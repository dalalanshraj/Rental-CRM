import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "./services/activityReminder.js";

// Custom Routes
import userRoutes from "./routes/userRoutes.js";
import leadsRoutes from "./routes/leadsRoutes.js";
import dealsRoutes from "./routes/dealsRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
const app = express();

const MONGO = process.env.MONGODB_URI;

const PORT = 3000;

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error("Not allowed by CORS")
        );
      }
    },

    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// =========================================
// ROOT TEST
// =========================================

app.get("/", (req, res) => {
  res.send("backend is Ready");
});


// =========================================
// ROUTES
// =========================================

app.use( "/api/auth", userRoutes );
app.use( "/api/leads", leadsRoutes );
app.use( "/api/deals", dealsRoutes ); 
app.use( "/api/organizations", organizationRoutes );
app.use( "/api/notes", noteRoutes );
app.use( "/api/activities", activityRoutes );
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =========================================
// MONGODB
// =========================================

mongoose
  .connect(MONGO, {
    serverSelectionTimeoutMS: 3000,
    tls: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error(
      "❌ Database Error:",
      err.message
    );
  });


// =========================================
// SERVER
// =========================================

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running at http://localhost:${PORT}`
  );
});