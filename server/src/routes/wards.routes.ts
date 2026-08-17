import { Router } from "express";
import {
    getWards,
    getWardStats,
} from "../controllers/wards.controller";

const router = Router();

// GET /api/wards
router.get("/", getWards);

// GET /api/wards/:id/stats
router.get("/:id/stats", getWardStats);

export default router;