import React, { createContext, useContext, useState, ReactNode } from "react";

export interface LogEvent {
  timestamp: string;
  ip: string;
  path: string;
  status: string | number;
  raw?: string;
}

export interface Alert {
  severity: "critical" | "high" | "medium" | "low";
  rule_id: string;
  ip: string;
  time_window: string;
  count: number;
  explain?: {
    condition: string;
    observed: string;
    matched_examples: LogEvent[];
  };
}

export interface AnalyticsData {
  traffic_over_time: { time: string; count: number }[];
  top_ips: { ip: string; count: number }[];
  status_distribution: { status: string; count: number }[];
  alerts_by_rule: { rule: string; count: number }[];
}

export interface AnalysisResult {
  summary: string;
  risk: string;
  alerts: Alert[];
  analytics: AnalyticsData;
  events_preview: LogEvent[];
}

interface AnalysisContextType {
  data: AnalysisResult | null;
  setData: (d: AnalysisResult | null) => void;
  isDemo: boolean;
  setIsDemo: (v: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType>({
  data: null,
  setData: () => {},
  isDemo: false,
  setIsDemo: () => {},
});

export const useAnalysis = () => useContext(AnalysisContext);

export const DEMO_DATA: AnalysisResult = {
  summary: "Detected 3,247 events across 142 unique IPs. Multiple brute-force attempts and SQL injection patterns identified. 12 critical alerts triggered.",
  risk: "High",
  alerts: [
    { severity: "critical", rule_id: "BRUTE_FORCE_SSH", ip: "192.168.1.105", time_window: "2025-03-01 02:00 - 02:15", count: 847, explain: { condition: "More than 100 failed SSH login attempts within 15 minutes from a single IP", observed: "847 failed SSH attempts from 192.168.1.105 in 15 minutes", matched_examples: [{ timestamp: "2025-03-01T02:01:12Z", ip: "192.168.1.105", path: "/ssh", status: 401, raw: "Mar  1 02:01:12 sshd[12345]: Failed password for root from 192.168.1.105" }, { timestamp: "2025-03-01T02:01:13Z", ip: "192.168.1.105", path: "/ssh", status: 401, raw: "Mar  1 02:01:13 sshd[12346]: Failed password for admin from 192.168.1.105" }] } },
    { severity: "critical", rule_id: "SQL_INJECTION", ip: "10.0.0.42", time_window: "2025-03-01 14:30 - 14:45", count: 23, explain: { condition: "SQL injection patterns detected in HTTP request parameters", observed: "23 requests containing SQL injection payloads from 10.0.0.42", matched_examples: [{ timestamp: "2025-03-01T14:31:05Z", ip: "10.0.0.42", path: "/api/users?id=1' OR '1'='1", status: 200, raw: "GET /api/users?id=1' OR '1'='1 HTTP/1.1" }] } },
    { severity: "high", rule_id: "PORT_SCAN", ip: "172.16.0.88", time_window: "2025-03-01 08:00 - 08:30", count: 1024, explain: { condition: "More than 500 connection attempts to different ports within 30 minutes", observed: "1024 port scan attempts from 172.16.0.88", matched_examples: [{ timestamp: "2025-03-01T08:05:22Z", ip: "172.16.0.88", path: "port:22", status: "SYN" }] } },
    { severity: "high", rule_id: "XSS_ATTEMPT", ip: "10.0.0.42", time_window: "2025-03-01 14:45 - 15:00", count: 15, explain: { condition: "Cross-site scripting payloads in request parameters", observed: "15 XSS attempts from 10.0.0.42", matched_examples: [{ timestamp: "2025-03-01T14:46:11Z", ip: "10.0.0.42", path: "/search?q=<script>alert(1)</script>", status: 200 }] } },
    { severity: "medium", rule_id: "RATE_LIMIT", ip: "203.0.113.50", time_window: "2025-03-01 10:00 - 10:05", count: 500, explain: { condition: "More than 200 requests per minute from a single IP", observed: "500 requests in 5 minutes from 203.0.113.50", matched_examples: [{ timestamp: "2025-03-01T10:01:00Z", ip: "203.0.113.50", path: "/api/data", status: 429 }] } },
    { severity: "low", rule_id: "GEO_ANOMALY", ip: "185.220.101.1", time_window: "2025-03-01 03:00 - 03:30", count: 12, explain: { condition: "Access from unusual geographic location", observed: "12 requests from Tor exit node 185.220.101.1", matched_examples: [{ timestamp: "2025-03-01T03:12:44Z", ip: "185.220.101.1", path: "/admin", status: 403 }] } },
  ],
  analytics: {
    traffic_over_time: [
      { time: "00:00", count: 120 }, { time: "02:00", count: 890 }, { time: "04:00", count: 45 },
      { time: "06:00", count: 210 }, { time: "08:00", count: 1100 }, { time: "10:00", count: 650 },
      { time: "12:00", count: 380 }, { time: "14:00", count: 720 }, { time: "16:00", count: 290 },
      { time: "18:00", count: 180 }, { time: "20:00", count: 95 }, { time: "22:00", count: 67 },
    ],
    top_ips: [
      { ip: "192.168.1.105", count: 847 }, { ip: "10.0.0.42", count: 456 },
      { ip: "172.16.0.88", count: 1024 }, { ip: "203.0.113.50", count: 500 },
      { ip: "185.220.101.1", count: 12 },
    ],
    status_distribution: [
      { status: "200", count: 1850 }, { status: "401", count: 920 },
      { status: "403", count: 180 }, { status: "404", count: 210 }, { status: "429", count: 87 },
    ],
    alerts_by_rule: [
      { rule: "BRUTE_FORCE_SSH", count: 847 }, { rule: "SQL_INJECTION", count: 23 },
      { rule: "PORT_SCAN", count: 1024 }, { rule: "XSS_ATTEMPT", count: 15 },
      { rule: "RATE_LIMIT", count: 500 }, { rule: "GEO_ANOMALY", count: 12 },
    ],
  },
  events_preview: [
    { timestamp: "2025-03-01T02:01:12Z", ip: "192.168.1.105", path: "/ssh", status: 401 },
    { timestamp: "2025-03-01T08:05:22Z", ip: "172.16.0.88", path: "port:22", status: "SYN" },
    { timestamp: "2025-03-01T10:01:00Z", ip: "203.0.113.50", path: "/api/data", status: 429 },
    { timestamp: "2025-03-01T14:31:05Z", ip: "10.0.0.42", path: "/api/users?id=1' OR '1'='1", status: 200 },
    { timestamp: "2025-03-01T14:46:11Z", ip: "10.0.0.42", path: "/search?q=<script>alert(1)</script>", status: 200 },
    { timestamp: "2025-03-01T03:12:44Z", ip: "185.220.101.1", path: "/admin", status: 403 },
    { timestamp: "2025-03-01T06:22:10Z", ip: "10.10.10.5", path: "/index.html", status: 200 },
    { timestamp: "2025-03-01T12:15:33Z", ip: "192.168.1.20", path: "/api/login", status: 200 },
    { timestamp: "2025-03-01T16:40:55Z", ip: "172.16.0.10", path: "/dashboard", status: 200 },
    { timestamp: "2025-03-01T20:05:18Z", ip: "10.0.0.15", path: "/api/reports", status: 404 },
    { timestamp: "2025-03-01T22:30:01Z", ip: "192.168.1.105", path: "/ssh", status: 401 },
    { timestamp: "2025-03-01T01:45:22Z", ip: "203.0.113.50", path: "/api/health", status: 200 },
  ],
};

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  return (
    <AnalysisContext.Provider value={{ data, setData, isDemo, setIsDemo }}>
      {children}
    </AnalysisContext.Provider>
  );
};
