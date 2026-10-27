

import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from backend/.env");
}

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "nexadesk.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
      path: "/",
    },
  })
);

// Health route must be registered before the 404 handler.
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "NexaDesk API is running.",
  });
});

// Authentication routes.
app.use("/api/auth", authRoutes);

// Keep the 404 handler LAST.
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`NexaDesk API running at http://localhost:${PORT}`);
});
