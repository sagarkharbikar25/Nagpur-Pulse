import { Request, Response } from "express";

export async function getDashboard(req: Request, res: Response) {
    try {
        res.json({
            success: true,
            data: {
                total_issues: 0,
                resolved_today: 0,
                active_hotspots: 0,
                city_resolution_rate: 0,
                top_categories: [],
                ward_rankings: [],
            },
            error: null,
        });
    } catch (error) {
        console.error("Get dashboard error:", error);

        res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch dashboard statistics",
        });
    }
}