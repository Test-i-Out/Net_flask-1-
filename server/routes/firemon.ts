import { RequestHandler } from "express";
import {
  DevicesResponse,
  QueryResultsResponse,
  FireMonDevice,
  FireMonRule,
} from "@shared/firemon";

// Mock data generator
const generateMockDevices = (): FireMonDevice[] => {
  const devices: FireMonDevice[] = [];
  const deviceTypes = ["Firewall", "Router", "Switch", "Load Balancer"];
  const statuses: ("online" | "offline" | "maintenance")[] = [
    "online",
    "offline",
    "maintenance",
  ];
  const domains = ["Production", "Staging", "Development", "DMZ", "Internal"];

  for (let i = 1; i <= 250; i++) {
    devices.push({
      id: i,
      name: `Device-${String(i).padStart(3, "0")}`,
      type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastSeen: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      rulesCount: Math.floor(Math.random() * 500) + 10,
      domain: domains[Math.floor(Math.random() * domains.length)],
    });
  }

  return devices;
};

const generateMockRules = (deviceId: number, query: string): FireMonRule[] => {
  const rules: FireMonRule[] = [];
  const actions: ("ACCEPT" | "DENY" | "DROP")[] = ["ACCEPT", "DENY", "DROP"];
  const sources = [
    "10.0.0.0/8",
    "192.168.1.0/24",
    "172.16.0.0/12",
    "any",
    "internal",
  ];
  const destinations = [
    "10.0.0.0/8",
    "192.168.1.0/24",
    "external",
    "any",
    "dmz",
  ];
  const services = [
    "HTTP",
    "HTTPS",
    "SSH",
    "FTP",
    "DNS",
    "any",
    "TCP-80",
    "TCP-443",
  ];

  // Generate different rule sets based on query keywords
  let ruleCount = Math.floor(Math.random() * 20) + 5;

  if (
    query.toLowerCase().includes("unused") ||
    query.toLowerCase().includes("90 days")
  ) {
    ruleCount = Math.floor(Math.random() * 15) + 3;
  } else if (
    query.toLowerCase().includes("redundant") ||
    query.toLowerCase().includes("shadowed")
  ) {
    ruleCount = Math.floor(Math.random() * 8) + 2;
  } else if (query.toLowerCase().includes("any")) {
    ruleCount = Math.floor(Math.random() * 25) + 10;
  }

  for (let i = 1; i <= ruleCount; i++) {
    const lastUsed =
      Math.random() > 0.3
        ? new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null;

    rules.push({
      id: `rule-${deviceId}-${i}`,
      name: `Rule_${String(i).padStart(3, "0")}_Device_${deviceId}`,
      sources: [sources[Math.floor(Math.random() * sources.length)]],
      destinations: [
        destinations[Math.floor(Math.random() * destinations.length)],
      ],
      services: [services[Math.floor(Math.random() * services.length)]],
      action: actions[Math.floor(Math.random() * actions.length)],
      lastUsed,
      enabled: Math.random() > 0.2,
      redundant: Math.random() > 0.8,
      shadowed: Math.random() > 0.85,
      severity:
        Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : undefined,
      deviceId,
    });
  }

  return rules;
};

export const getDevices: RequestHandler = (req, res) => {
  try {
    const devices = generateMockDevices();
    const response: DevicesResponse = {
      devices,
      total: devices.length,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

export const queryDevice: RequestHandler = (req, res) => {
  try {
    const { query, deviceId } = req.body;

    if (!query || !deviceId) {
      return res.status(400).json({ error: "Query and deviceId are required" });
    }

    const devices = generateMockDevices();
    const device = devices.find((d) => d.id === parseInt(deviceId));

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    const rules = generateMockRules(parseInt(deviceId), query);

    const response: QueryResultsResponse = {
      rules,
      total: rules.length,
      query,
      deviceId: parseInt(deviceId),
      deviceName: device.name,
    };

    res.json(response);
  } catch (error) {
    console.error("Error querying device:", error);
    res.status(500).json({ error: "Failed to query device" });
  }
};
