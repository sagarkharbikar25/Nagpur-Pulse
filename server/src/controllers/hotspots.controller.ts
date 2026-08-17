import { Request, Response } from "express";

export async function getHotspots(req: Request, res: Response) {
    try {
        res.json({
            success: true,
            data: [],
            error: null,
        });
    } catch (error) {
        console.error("Get hotspots error:", error);

        res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch hotspots",
        });
    }
}

export async function getWardHotspots(req: Request, res: Response) {
    try {
        const { ward_id } = req.params;

        res.json({
            success: true,
            data: {
                ward_id,
                hotspots: [],
                issues: [],
            },
            error: null,
        });
    } catch (error) {
        console.error("Get ward hotspots error:", error);

        res.status(500).json({
            success: false,
            data: null,
            error: "Failed to fetch ward hotspots",
        });
    }
}