import nvidia from "../config/nvidia";
import {
    AICategorizationResult,
    IssueCategory,
    SeverityHint,
} from "../types/ai.types";

export async function categorizeIssue(
    description: string
): Promise<AICategorizationResult> {
    try {
        const response = await nvidia.chat.completions.create({
            model: "nvidia/nemotron-3-super-120b-a12b",

            messages: [
                {
                    role: "user",
                    content: `You are a civic issue classifier for Nagpur Municipal Corporation.

Given this citizen report, return ONLY a JSON object with these exact fields:
{
  "category": "pothole | streetlight | water | garbage | drainage | encroachment | other",
  "summary": "a clear 1-sentence summary under 100 chars",
  "severity_hint": "low | medium | high"
}

Severity guide:
- high: immediate safety risk, blocking road, no water supply
- medium: causes inconvenience, recurring issue
- low: minor, aesthetic

Citizen report: "${description}"

Return ONLY the JSON. No explanation. No markdown.`,
                },
            ],

            temperature: 0.2,
            max_tokens: 300,
        });

        const result = response.choices[0]?.message?.content;

        if (!result) {
            throw new Error("AI returned empty response");
        }

        const parsed = JSON.parse(result);

        return {
            category: validateCategory(parsed.category),
            summary: String(parsed.summary).slice(0, 100),
            severity_hint: validateSeverity(parsed.severity_hint),
        };

    } catch (error) {
        console.error("AI categorization failed:", error);

        // AI fail hone par bhi issue submission continue rahega
        return {
            category: "other",
            summary: description.slice(0, 100),
            severity_hint: "medium",
        };
    }
}

function validateCategory(value: unknown): IssueCategory {
    const categories: IssueCategory[] = [
        "pothole",
        "streetlight",
        "water",
        "garbage",
        "drainage",
        "encroachment",
        "other",
    ];

    if (categories.includes(value as IssueCategory)) {
        return value as IssueCategory;
    }

    return "other";
}

function validateSeverity(value: unknown): SeverityHint {
    const severities: SeverityHint[] = [
        "low",
        "medium",
        "high",
    ];

    if (severities.includes(value as SeverityHint)) {
        return value as SeverityHint;
    }

    return "medium";
}