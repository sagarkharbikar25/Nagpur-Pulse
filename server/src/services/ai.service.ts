import { nvidiaClient, NVIDIA_MODEL } from '../config/nvidia';

export interface AIResult {
  category: string;
  summary: string;
  severity_hint: string;
}

export class AIService {
  /**
   * Categorize a civic issue using NVIDIA Nemotron
   * Always returns a result — never throws (fallback on failure)
   */
  static async categorizeIssue(description: string): Promise<AIResult> {
    const fallback: AIResult = {
      category: 'other',
      summary: description.slice(0, 100),
      severity_hint: 'medium',
    };

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
      // Strip markdown code fences if model adds them
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const validCategories = ['pothole', 'streetlight', 'water', 'garbage', 'drainage', 'encroachment', 'other'];
      const validSeverities = ['low', 'medium', 'high'];

      return {
        category: validCategories.includes(parsed.category) ? parsed.category : 'other',
        summary: String(parsed.summary ?? description).slice(0, 100),
        severity_hint: validSeverities.includes(parsed.severity_hint) ? parsed.severity_hint : 'medium',
      };
    } catch (err) {
      console.warn('[AIService] categorizeIssue failed — using fallback:', err);
      return fallback;
    }
  }

  /**
   * Describe a photo using NVIDIA Nemotron vision
   * Returns null on failure — issue still saves without description
   */
  static async describePhoto(imageBase64: string, mimeType: string): Promise<string | null> {
    try {
      const completion = await nvidiaClient.chat.completions.create({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe what civic issue is visible in this image in one sentence. Be specific: mention what you see (road, drain, light, etc.) and the problem. Return ONLY the description sentence. No JSON. No extra text. Maximum 120 characters.',
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
      return text.slice(0, 120) || null;
    } catch (err) {
      console.warn('[AIService] describePhoto failed (non-critical):', err);
      return null;
    }
  }
}
