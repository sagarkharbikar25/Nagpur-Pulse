import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();

// GET /api/dashboard
router.get("/", getDashboard);

export default router;