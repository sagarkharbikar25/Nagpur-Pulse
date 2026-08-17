import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

export async function getHotspots(req: Request, res: Response) {
    try {
        const { data, error } = await supabaseAdmin
            .from("hotspots")
            .select("*")
            .order("issue_count", { ascending: false });

        if (error) {
            throw error;
        }

        return res.json({
            success: true,
            data: data ?? [],
            error: null,
        });
    } catch (error) {
        console.error("Get hotspots error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch hotspots",
        });
    }
}

export async function getWardHotspots(req: Request, res: Response) {
    try {
        const wardId = String(req.params.ward_id);

        const { data: hotspots, error: hotspotError } = await supabaseAdmin
            .from("hotspots")
            .select("*")
            .eq("ward_id", wardId)
            .order("issue_count", { ascending: false });

        if (hotspotError) {
            throw hotspotError;
        }

        const { data: issues, error: issueError } = await supabaseAdmin
            .from("issues")
            .select("*")
            .eq("ward_id", wardId)
            .neq("status", "resolved")
            .order("created_at", { ascending: false });

        if (issueError) {
            throw issueError;
        }

        return res.json({
            success: true,
            data: {
                ward_id: wardId,
                hotspots: hotspots ?? [],
                issues: issues ?? [],
            },
            error: null,
        });
    } catch (error) {
        console.error("Get ward hotspots error:", error);

        return res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch ward hotspots",
        });
    }
}