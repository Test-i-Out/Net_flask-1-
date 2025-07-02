export interface FireMonDevice {
  id: number;
  name: string;
  type: string;
  status: "online" | "offline" | "maintenance";
  lastSeen: string;
  rulesCount: number;
  domain: string;
}

export interface FireMonRule {
  id: string;
  name: string;
  sources: string[];
  destinations: string[];
  services: string[];
  action: "ACCEPT" | "DENY" | "DROP";
  lastUsed: string | null;
  enabled: boolean;
  redundant: boolean;
  shadowed: boolean;
  severity?: number;
  deviceId: number;
}

export interface DevicesResponse {
  devices: FireMonDevice[];
  total: number;
}

export interface QueryResultsResponse {
  rules: FireMonRule[];
  total: number;
  query: string;
  deviceId: number;
  deviceName: string;
}

export interface QueryRequest {
  query: string;
  deviceId: number;
}
