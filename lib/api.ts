export type Severity = "Critical" | "High" | "Medium" | "Low" | "Review";

export type Finding = {
  id: string;
  type: "web" | "breach" | "platform";
  title: string;
  detail: string;
  severity: Severity;
  source?: string;
  url?: string;
  observedAt: string;
};

export type ScanRequest = {
  name: string;
  email?: string;
  username?: string;
  platforms?: string[];
};

export type ScanResponse = {
  score: number;
  findings: Finding[];
  providers: {
    brave: boolean;
    hibp: boolean;
  };
  scannedAt: string;
};

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8787").replace(/\/$/, "");

export async function scanIdentity(input: ScanRequest): Promise<ScanResponse> {
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || `Scan failed with HTTP ${response.status}`);
  }
  return payload as ScanResponse;
}
