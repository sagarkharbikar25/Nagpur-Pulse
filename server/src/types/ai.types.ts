export type IssueCategory =
    | "pothole"
    | "streetlight"
    | "water"
    | "garbage"
    | "drainage"
    | "encroachment"
    | "other";

export type SeverityHint = "low" | "medium" | "high";

export interface AICategorizationResult {
    category: IssueCategory;
    summary: string;
    severity_hint: SeverityHint;
}