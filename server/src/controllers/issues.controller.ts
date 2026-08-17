import { Request, Response } from "express";

export async function getIssues(req: Request, res: Response) {
    try {
        res.json({
            success: true,
            data: [],
            error: null,
        });
    } catch (error) {
        console.error("Get issues error:", error);

        res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch issues",
        });
    }
}

export async function getIssueById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        res.json({
            success: true,
            data: {
                id,
            },
            error: null,
        });
    } catch (error) {
        console.error("Get issue error:", error);

        res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch issue",
        });
    }
}

export async function createIssue(req: Request, res: Response) {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Description is required",
            });
        }

        res.status(201).json({
            success: true,
            data: {
                message: "Issue received",
                description,
            },
            error: null,
        });
    } catch (error) {
        console.error("Create issue error:", error);

        res.status(500).json({
            success: false,
            data: null,
            error: "Failed to create issue",
        });
    }
}