import express from "express";
import "dotenv/config";

import issuesRoutes from "./routes/issues.routes";
import wardsRoutes from "./routes/wards.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import hotspotsRoutes from "./routes/hotspots.routes";

const app = express();

const PORT = process.env.PORT || 5000;

// JSON body read karne ke liye
app.use(express.json());

// Routes
app.use("/api/issues", issuesRoutes);
app.use("/api/wards", wardsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hotspots", hotspotsRoutes);

// Basic health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Civic Issue System API is running",
        },
        error: null,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});