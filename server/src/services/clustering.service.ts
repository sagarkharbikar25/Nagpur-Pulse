import { IssuesService } from "./issues.service";
import { supabaseAdmin } from "../config/supabase";

export async function checkAndCreateHotspot(
    wardId: string,
    category: string
): Promise<boolean> {
    try {
        if (!wardId || !category) {
            return false;
        }

        // Count unresolved issues for the same ward/category.
        // IssuesService already contains the database query for this.
        const count = await IssuesService.getHotspotCount(
            wardId,
            category
        );

        console.log(
            `Hotspot check: ward=${wardId}, category=${category}, count=${count}`
        );

        if (count < 3) {
            return false;
        }

        // Create/update hotspot record.
        const { error } = await supabaseAdmin
            .from("hotspots")
            .upsert(
                {
                    ward_id: wardId,
                    category,
                    issue_count: count,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "ward_id,category",
                }
            );

        if (error) {
            console.error("Hotspot upsert failed:", error);
            return false;
        }

        console.log(
            `Hotspot created/updated: ward=${wardId}, category=${category}`
        );

        return true;
    } catch (error) {
        console.error("Hotspot detection failed:", error);

        // Hotspot failure must never crash issue submission.
        return false;
    }
}