import { Request, Response } from "express";
import { IssuesService } from "../services/issues.service";
import { categorizeIssue } from "../services/ai.service";

export async function getIssues(req: Request, res: Response) {
    try {
        const {
            ward_id,
            category,
            status,
            page = "1",
            limit = "50",
        } = req.query;

        const filters = {
            ward_id: typeof ward_id === "string" ? ward_id : undefined,
            category: typeof category === "string" ? category : undefined,
            status: typeof status === "string" ? status : undefined,
            page: Number(page) || 1,
            limit: Math.min(Number(limit) || 50, 50),
        };

        const result = await IssuesService.getIssues(filters);

        return res.json({
            success: true,
            data: result,
            error: null,
        });
    } catch (error) {
        console.error("Get issues error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch issues",
        });
    }
}

export async function getIssueById(req: Request, res: Response) {
    try {
        const id = String(req.params.id);

        const issue = await IssuesService.getIssueById(id);

        return res.json({
            success: true,
            data: issue,
            error: null,
        });
    } catch (error) {
        console.error("Get issue error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch issue",
        });
    }
}

export async function createIssue(req: Request, res: Response) {
    try {
        const { description, ward_id, citizen_id } = req.body;

        if (!description) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Description is required",
            });
        }

        if (!citizen_id) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Citizen ID is required",
            });
        }

        const aiResult = await categorizeIssue(description);

        const issue = await IssuesService.createIssue({
            citizen_id,
            description,
            ward_id,
            category: aiResult.category,
            ai_summary: aiResult.summary,
            severity_hint: aiResult.severity_hint,
            status: "open",
        });

        return res.status(201).json({
            success: true,
            data: {
                id: issue.id,
                category: aiResult.category,
                ai_summary: aiResult.summary,
                severity_hint: aiResult.severity_hint,
                status: issue.status,
                hotspot_triggered: false,
            },
            error: null,
        });
    } catch (error) {
        console.error("Create issue error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to create issue",
        });
    }
}

export async function updateIssueStatus(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const { status, resolution_note = null } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Status is required",
            });
        }

        const updatedIssue = await IssuesService.updateIssueStatus(
            id,
            status,
            null,
            resolution_note
        );

        return res.json({
            success: true,
            data: updatedIssue,
            error: null,
        });
    } catch (error) {
        console.error("Update issue status error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to update issue status",
        });
    }
}