// src/types/decision.ts

export interface Decision {
    id: number;
    summary: string;
    status: string;
    rationale: string;
    created_at: string;
    tags: string;
    confidence: string;
    username: string;
    team: string;
    jiraUrl: string;
}