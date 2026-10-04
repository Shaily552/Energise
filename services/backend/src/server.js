import dns from "node:dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB model
const machineSchema = new mongoose.Schema(
  {
    machineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    energyConsumption: { type: Number, required: true },
  },
  { timestamps: true }
);

const Machine =
  mongoose.models.Machine || mongoose.model("Machine", machineSchema);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Energise API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Dashboard overview — sample values until real readings are available
app.get("/api/dashboard/overview", (req, res) => {
  res.json({
    energyConsumed: 1248,
    energyUnit: "kWh",
    estimatedCost: 9984,
    estimatedSavings: 12.5,
    efficiency: 87.4,
    emissions: 1023,
    dataSource: "sample",
  });
});


app.post("/api/machines", async (req, res) => {
  try {
    const { machineId, name, status, energyConsumption } = req.body;

    if (
      typeof machineId !== "string" ||
      !machineId.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      !["Running", "Idle", "Maintenance", "Offline"].includes(status) ||
      energyConsumption === "" ||
      energyConsumption === null ||
      energyConsumption === undefined ||
      !Number.isFinite(Number(energyConsumption)) ||
      Number(energyConsumption) < 0
    ) {
      return res.status(400).json({
        message:
          "Provide a machine ID, name, valid status, and non-negative energy consumption.",
      });
    }

    const machine = await Machine.create({
      machineId: machineId.trim(),
      name: name.trim(),
      status,
      energyConsumption: Number(energyConsumption),
    });

    return res.status(201).json({
      id: machine.machineId,
      name: machine.name,
      status: machine.status,
      energyConsumption: machine.energyConsumption,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A machine with this ID already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "The machine details are invalid.",
      });
    }

    console.error("Machine creation failed:", error.message);

    return res.status(500).json({
      message: "Could not save the machine.",
    });
  }
});

// Machines — read from MongoDB; seed sample records if collection is empty
app.get("/api/machines", async (req, res) => {
  try {
    let machines = await Machine.find().lean();

    if (machines.length === 0) {
      await Machine.insertMany([
        { machineId: "M001", name: "Air Compressor 01", status: "Running", energyConsumption: 420 },
        { machineId: "M002", name: "Injection Moulding 02", status: "Running", energyConsumption: 510 },
        { machineId: "M003", name: "Cooling System 01", status: "Maintenance", energyConsumption: 318 },
      ]);

      machines = await Machine.find().lean();
    }

    res.json(
      machines.map(({ machineId, name, status, energyConsumption }) => ({
        id: machineId,
        name,
        status,
        energyConsumption,
      }))
    );
  } catch (error) {
    console.error("Machines query failed:", error.message);
    res.status(500).json({ message: "Could not load machines from database." });
  }
});

// Alerts — illustrative until alert persistence is implemented
app.get("/api/alerts", (req, res) => {
  res.json([
    {
      id: "A001",
      machine: "Air Compressor 01",
      severity: "medium",
      message: "Illustrative energy consumption anomaly",
      dataSource: "sample",
    },
  ]);
});

// Recommendations — illustrative until recommendation persistence is implemented
app.get("/api/recommendations", (req, res) => {
  res.json([
    {
      id: "R001",
      title: "Review compressor operating pressure",
      estimatedSavings: 850,
      unit: "INR/month",
      dataSource: "sample",
    },
  ]);
});


app.get("/api/ml/demo-analysis", async (req, res) => {
  try {
    const response = await fetch(
      process.env.ML_SERVICE_URL || "http://localhost:8000/demo-analysis"
    );

    if (!response.ok) {
      return res.status(502).json({ message: "ML service returned an error." });
    }

    res.json(await response.json());
  } catch (error) {
    console.error("ML demo analysis failed:", error.message);
    res.status(503).json({
      message: "ML service is unavailable. Ensure it is running on port 8000.",
    });
  }
});

app.post("/api/ml/analyze", async (req, res) => {
  try {
    const response = await fetch(
      (process.env.ML_SERVICE_URL || "http://localhost:8000") + "/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    console.error("ML analysis failed:", error.message);
    res.status(503).json({
      message: "ML service is unavailable. Ensure it is running on port 8000.",
    });
  }
});


async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from services/backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Energise API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
