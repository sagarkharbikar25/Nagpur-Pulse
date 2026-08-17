import { Request, Response } from "express";
import { supabaseAnon } from "../config/supabase";

export async function getDashboard(req: Request, res: Response) {
    try {
        const { data: issues, error } = await supabaseAnon
            .from("issues")
            .select("ward_id, category, status, created_at");

        if (error) {
            throw error;
        }

        const rows = issues ?? [];

        const totalIssues = rows.length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const resolvedToday = rows.filter((issue) => {
            if (issue.status !== "resolved" || !issue.created_at) {
                return false;
            }

            const date = new Date(issue.created_at);
            return date >= today;
        }).length;

        const resolvedCount = rows.filter(
            (issue) => issue.status === "resolved"
        ).length;

        const cityResolutionRate =
            totalIssues > 0
                ? Number(((resolvedCount / totalIssues) * 100).toFixed(1))
                : 0;

        const categoryCounts: Record<string, number> = {};

        for (const issue of rows) {
            const category = issue.category ?? "other";

            categoryCounts[category] =
                (categoryCounts[category] ?? 0) + 1;
        }

        const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category]) => category);

        const wardData: Record<
            string,
            {
                open: number;
                total: number;
                resolved: number;
            }
        > = {};

        for (const issue of rows) {
            const ward = issue.ward_id ?? "unknown";

            if (!wardData[ward]) {
                wardData[ward] = {
                    open: 0,
                    total: 0,
                    resolved: 0,
                };
            }

            wardData[ward].total++;

            if (issue.status === "open") {
                wardData[ward].open++;
            }

            if (issue.status === "resolved") {
                wardData[ward].resolved++;
            }
        }

        const wardRankings = Object.entries(wardData)
            .map(([ward, data]) => ({
                ward,
                open: data.open,
                resolution_rate:
                    data.total > 0
                        ? Number(
                              (
                                  (data.resolved / data.total) *
                                  100
                              ).toFixed(1)
                          )
                        : 0,
            }))
            .sort((a, b) => b.open - a.open);

        const { count: activeHotspots, error: hotspotError } =
            await supabaseAnon
                .from("hotspots")
                .select("*", {
                    count: "exact",
                    head: true,
                });

        if (hotspotError) {
            console.warn(
                "Could not fetch hotspot count:",
                hotspotError.message
            );
        }

        return res.json({
            success: true,
            data: {
                total_issues: totalIssues,
                resolved_today: resolvedToday,
                active_hotspots: activeHotspots ?? 0,
                city_resolution_rate: cityResolutionRate,
                top_categories: topCategories,
                ward_rankings: wardRankings,
            },
            error: null,
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch dashboard data",
        });
    }
}