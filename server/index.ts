import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getDevices, queryDevice } from "./routes/firemon";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // FireMon API routes
  app.get("/api/devices", getDevices);
  app.post("/api/query", queryDevice);

  return app;
}
