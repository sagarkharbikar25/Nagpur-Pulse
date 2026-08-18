import { nvidiaClient, NVIDIA_MODEL } from '../config/nvidia';

export interface AIResult {
  category: string;
  summary: string;
  severity_hint: string;
}

export class AIService {
  /**
   * Rule-based local NLP classifier fallback for Nagpur civic taxonomy
   */
  private static localClassify(text: string): AIResult {
    const lower = text.toLowerCase();

    // 1. Pothole / Road damage
    if (
      lower.includes('pothole') ||
      lower.includes('road') ||
      lower.includes('asphalt') ||
      lower.includes('crater') ||
      lower.includes('rock') ||
      lower.includes('slide') ||
      lower.includes('divider') ||
      lower.includes('accident')
    ) {
      return {
        category: 'pothole',
        summary: `Road surface hazard: ${text.slice(0, 75)}`,
        severity_hint: lower.includes('accident') || lower.includes('deep') || lower.includes('danger') ? 'high' : 'medium',
      };
    }

    // 2. Streetlight / Electrical
    if (
      lower.includes('light') ||
      lower.includes('lamp') ||
      lower.includes('dark') ||
      lower.includes('pole') ||
      lower.includes('wire') ||
      lower.includes('electricity') ||
      lower.includes('transformer') ||
      lower.includes('spark')
    ) {
      return {
        category: 'streetlight',
        summary: `Street lighting / electrical outage reported: ${text.slice(0, 70)}`,
        severity_hint: lower.includes('wire') || lower.includes('spark') ? 'high' : 'medium',
      };
    }

    // 3. Water supply
    if (
      lower.includes('water') ||
      lower.includes('pipeline') ||
      lower.includes('leak') ||
      lower.includes('pipe') ||
      lower.includes('drinking') ||
      lower.includes('tap') ||
      lower.includes('pressure')
    ) {
      return {
        category: 'water',
        summary: `Water supply / pipeline breakdown: ${text.slice(0, 70)}`,
        severity_hint: lower.includes('no water') || lower.includes('burst') ? 'high' : 'medium',
      };
    }

    // 4. Garbage / Waste / Pollution
    if (
      lower.includes('garbage') ||
      lower.includes('trash') ||
      lower.includes('waste') ||
      lower.includes('dump') ||
      lower.includes('smell') ||
      lower.includes('dust') ||
      lower.includes('pollution') ||
      lower.includes('smoke') ||
      lower.includes('debris')
    ) {
      return {
        category: 'garbage',
        summary: `Sanitation / environmental waste accumulation: ${text.slice(0, 70)}`,
        severity_hint: lower.includes('toxic') || lower.includes('heavy') ? 'high' : 'medium',
      };
    }

    // 5. Drainage / Sewage
    if (
      lower.includes('drain') ||
      lower.includes('gutter') ||
      lower.includes('sewage') ||
      lower.includes('overflow') ||
      lower.includes('waterlog') ||
      lower.includes('flood') ||
      lower.includes('clog')
    ) {
      return {
        category: 'drainage',
        summary: `Storm drain / sewage overflow hazard: ${text.slice(0, 70)}`,
        severity_hint: lower.includes('flood') || lower.includes('sewage') ? 'high' : 'medium',
      };
    }

    // 6. Encroachment / Noise / Public nuisance
    if (
      lower.includes('encroach') ||
      lower.includes('hawker') ||
      lower.includes('parking') ||
      lower.includes('footpath') ||
      lower.includes('noise') ||
      lower.includes('noice') ||
      lower.includes('loudspeaker') ||
      lower.includes('illegal') ||
      lower.includes('block')
    ) {
      return {
        category: 'encroachment',
        summary: `Public encroachment / civic nuisance report: ${text.slice(0, 70)}`,
        severity_hint: 'medium',
      };
    }

    // 7. Other default
    return {
      category: 'other',
      summary: `Civic issue: ${text.slice(0, 80)}`,
      severity_hint: 'medium',
    };
  }

  /**
   * Categorize a civic issue using NVIDIA Nemotron or Local NLP Engine
   */
  static async categorizeIssue(description: string): Promise<AIResult> {
    const localResult = this.localClassify(description);

    // If no real API key is configured, return the instant intelligent local classification
    if (!process.env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY.includes('your-nvidia-api-key')) {
      return localResult;
    }

    try {
      const completion = await nvidiaClient.chat.completions.create({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'user',
            content: `You are a civic issue classifier for Nagpur Municipal Corporation.

Given this citizen report, return ONLY a JSON object with these exact fields:
{
  "category": one of [pothole, streetlight, water, garbage, drainage, encroachment, other],
  "summary": a clear 1-sentence summary under 100 chars,
  "severity_hint": one of [low, medium, high]
}

Severity guide:
- high: immediate safety risk, blocking road, no water supply
- medium: causes inconvenience, recurring issue
- low: minor, aesthetic

Citizen report: "${description}"

Return ONLY the JSON. No explanation. No markdown. No code fences.`,
          },
        ],
        temperature: 0.2,
        top_p: 0.95,
        max_tokens: 256,
      });

      const text = (completion.choices[0]?.message?.content ?? '').trim();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const validCategories = ['pothole', 'streetlight', 'water', 'garbage', 'drainage', 'encroachment', 'other'];
      const validSeverities = ['low', 'medium', 'high'];

      return {
        category: validCategories.includes(parsed.category) ? parsed.category : localResult.category,
        summary: String(parsed.summary ?? localResult.summary).slice(0, 100),
        severity_hint: validSeverities.includes(parsed.severity_hint) ? parsed.severity_hint : localResult.severity_hint,
      };
    } catch (err) {
      console.warn('[AIService] Cloud AI call failed — using local NLP classifier:', err);
      return localResult;
    }
  }

  /**
   * Describe a photo using NVIDIA Nemotron vision
   */
  static async describePhoto(imageBase64: string, mimeType: string): Promise<string | null> {
    if (!process.env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY.includes('your-nvidia-api-key')) {
      return 'Photo attached for municipal inspection';
    }

    try {
      const completion = await nvidiaClient.chat.completions.create({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe what civic issue is visible in this image in one sentence. Be specific: mention what you see (road, drain, light, etc.) and the problem. Return ONLY the description sentence. Maximum 120 characters.',
              },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      const text = (completion.choices[0]?.message?.content ?? '').trim();
      return text.slice(0, 120) || 'Photo verified by AI Vision';
    } catch (err) {
      console.warn('[AIService] describePhoto fallback:', err);
      return 'Photo attached for municipal verification';
    }
  }
}
