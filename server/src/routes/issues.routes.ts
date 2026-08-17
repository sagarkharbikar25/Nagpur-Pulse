import { Router } from "express";
import {
    getIssues,
    getIssueById,
    createIssue,
} from "../controllers/issues.controller";

const router = Router();

// GET /api/issues
router.get("/", getIssues);

// GET /api/issues/:id
router.get("/:id", getIssueById);

// POST /api/issues
router.post("/", createIssue);

export default router;