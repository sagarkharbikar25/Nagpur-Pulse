import { Request, Response } from "express";
import { supabaseAnon } from "../config/supabase";

export async function getWards(req: Request, res: Response) {
    try {
        const { data, error } = await supabaseAnon
            .from("wards")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            throw error;
        }

        return res.json({
            success: true,
            data: data ?? [],
            error: null,
        });
    } catch (error) {
        console.error("Get wards error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch wards",
        });
    }
}

export async function getWardStats(req: Request, res: Response) {
    try {
        const wardId = String(req.params.id);

        const { data: issues, error } = await supabaseAnon
            .from("issues")
            .select("category, status")
            .eq("ward_id", wardId);

        if (error) {
            throw error;
        }

        const rows = issues ?? [];

        const open = rows.filter(
            (issue) => issue.status === "open"
        ).length;

        const inProgress = rows.filter(
            (issue) => issue.status === "in_progress"
        ).length;

        const resolved = rows.filter(
            (issue) => issue.status === "resolved"
        ).length;

        const categoryBreakdown: Record<string, number> = {};

        for (const issue of rows) {
            const category = issue.category ?? "other";
            categoryBreakdown[category] =
                (categoryBreakdown[category] ?? 0) + 1;
        }

        const total = rows.length;

        const resolutionRate =
            total > 0
                ? Number(((resolved / total) * 100).toFixed(1))
                : 0;

        return res.json({
            success: true,
            data: {
                ward_id: wardId,
                total_issues: total,
                open,
                in_progress: inProgress,
                resolved,
                resolution_rate: resolutionRate,
                category_breakdown: categoryBreakdown,
            },
            error: null,
        });
    } catch (error) {
        console.error("Get ward stats error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch ward statistics",
        });
    }
}