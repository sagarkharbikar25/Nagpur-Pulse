import { Router } from "express";
import {
    getHotspots,
    getWardHotspots,
} from "../controllers/hotspots.controller";

const router = Router();

// GET /api/hotspots
router.get("/", getHotspots);

// GET /api/hotspots/:ward_id
router.get("/:ward_id", getWardHotspots);

export default router;