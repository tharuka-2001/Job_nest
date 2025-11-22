// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import "dotenv/config";
// // console.log("Stripe webhook secret set?", !!process.env.STRIPE_WEBHOOK_SECRET);

// import { connectDB } from "./lib/db.js";
// //*Importing all the routes
// import authRouter from "./routes/auth.routes.js";
// import profileRouter from "./routes/profile.routes.js";
// import organizationRouter from "./routes/organization.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import jobRouter from "./routes/job.routes.js";
// import applicationRouter from "./routes/application.routes.js";
// import chatRouter from "./routes/chat.routes.js";
// import badgeRouter from "./routes/badge.routes.js";

// //* Realtime
// import http from "http";
// import { initSocket } from "./realtime/socket.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const server = http.createServer(app); // <-- http server for socket.io
// initSocket(server);

// app.use(helmet());
// // app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*" }));
// const allowedOrigins = process.env.CLIENT_URL?.split(",").map((url) =>
//   url.trim()
// );

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (e.g., mobile apps, Postman)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.warn("Blocked by CORS:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // if you use cookies/auth headers
//   })
// );
// app.use(morgan("dev"));

// const PORT = process.env.PORT || 4000;

// // Serve uploads statically
// app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// app.use(
//   "/api/webhooks/stripe",
//   express.raw({ type: "application/json" }),
//   (req, _res, next) => {
//     req.rawBody = req.body; // keep Buffer for signature verification
//     next();
//   },
//   paymentRoutes
// );

// app.use(express.json());

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", organizationRouter);
// app.use("/", jobRouter);
// app.use("/", applicationRouter);
// app.use("/", chatRouter);
// app.use("/", badgeRouter);

// app.listen(PORT, "0.0.0.0", async () => {
//   console.log(`Server is running on port ${PORT}`);
//   await connectDB();
// });

// src/server.js (or wherever your server.js lives)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { connectDB } from "./lib/db.js";

//* routes
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import organizationRouter from "./routes/organization.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import chatRouter from "./routes/chat.routes.js";
import badgeRouter from "./routes/badge.routes.js";

//* realtime
import http from "http";
import { initSocket } from "./realtime/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // Keep http server for Socket.IO
initSocket(server); // Attach socket.io to server

// --- Security & logging ---
app.use(helmet());
app.use(morgan("dev"));

// --- CORS ---
// Multiple origins can be comma-separated in CLIENT_URL (e.g. http://localhost:3000,http://192.168.8.110:8081)
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // Allow non-browser tools (curl, Postman, RN fetch without origin header)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn("Blocked by CORS:", origin);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// ❌ Do NOT use app.options("*", ...) on Express 5 — it crashes.
// If you insist on a global explicit OPTIONS handler, use "/*" instead of "*":
// app.options("/*", cors(corsOptions)); // optional, not required

// --- Static uploads (resumes/chat files) ---
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// --- Stripe webhook: RAW body FIRST (before express.json) ---
app.use(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  (req, _res, next) => {
    // keep the Buffer for signature verification inside route handler
    req.rawBody = req.body;
    next();
  },
  paymentRoutes
);

// --- JSON body for everything else ---
app.use(express.json());

// --- API routes ---
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", organizationRouter);
app.use("/", jobRouter);
app.use("/", applicationRouter);
app.use("/", chatRouter);
app.use("/", badgeRouter);

// --- Health check ---
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// --- Basic not-found (optional) ---
app.use((req, res, _next) => {
  res.status(404).json({ message: "Not Found" });
});

// --- Error handler (optional but helpful for CORS errors) ---
app.use((err, _req, res, _next) => {
  // If it's a CORS error, surface a readable message
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

// --- Start HTTP server (not app.listen) ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", async () => {
  console.log(`API + Socket.IO listening on http://0.0.0.0:${PORT}`);
  await connectDB();
});
