import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

const PORT = Number(process.env.PORT || 8787);
const BRAVE_KEY = process.env.BRAVE_SEARCH_API_KEY;
const HIBP_KEY = process.env.HIBP_API_KEY;

function severityWeight(severity) {
  return { Critical: 30, High: 20, Medium: 12, Low: 5, Review: 3 }[severity] || 0;
}

function scoreFindings(findings) {
  return Math.max(0, 100 - findings.reduce((sum, f) => sum + severityWeight(f.severity), 0));
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return undefined; }
}

async function braveSearch(query, platforms = []) {
  if (!BRAVE_KEY) return [];
  const searches = [query, ...platforms.slice(0, 5).map(platform => `site:${hostOf(platform) || platform} ${query}`)];
  const findings = [];

  for (const q of searches) {
    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.set("q", q);
    url.searchParams.set("count", "10");
    const response = await fetch(url, {
      headers: { Accept: "application/json", "X-Subscription-Token": BRAVE_KEY },
    });
    if (!response.ok) throw new Error(`Brave Search returned HTTP ${response.status}`);
    const data = await response.json();
    for (const item of data.web?.results || []) {
      findings.push({
        id: `web:${item.url}`,
        type: "web",
        title: item.title || "Public web result",
        detail: item.description || "Public result matching one of your supplied identifiers. Verify that it belongs to you.",
        severity: "Review",
        source: hostOf(item.url),
        url: item.url,
        observedAt: new Date().toISOString(),
      });
    }
  }
  return [...new Map(findings.map(f => [f.id, f])).values()];
}

async function hibpBreaches(email) {
  if (!HIBP_KEY || !email) return [];
  const endpoint = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
  const response = await fetch(endpoint, {
    headers: { "hibp-api-key": HIBP_KEY, "user-agent": "Identity-Guard/0.1" },
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`HIBP returned HTTP ${response.status}`);
  const breaches = await response.json();
  return breaches.map(b => ({
    id: `breach:${b.Name}`,
    type: "breach",
    title: `${b.Title || b.Name} breach exposure`,
    detail: `Your verified email may appear in this breach. Exposed data classes: ${(b.DataClasses || []).join(", ") || "not specified"}. Change reused passwords and enable MFA/passkeys.`,
    severity: (b.DataClasses || []).some(x => /password/i.test(x)) ? "High" : "Medium",
    source: "Have I Been Pwned",
    url: b.Domain ? `https://${b.Domain}` : undefined,
    observedAt: new Date().toISOString(),
  }));
}

app.get("/health", (_req, res) => res.json({ ok: true, providers: { brave: Boolean(BRAVE_KEY), hibp: Boolean(HIBP_KEY) } }));

app.post("/scan", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const username = String(req.body?.username || "").trim();
  const platforms = Array.isArray(req.body?.platforms) ? req.body.platforms.map(String) : [];
  if (!name && !email && !username) return res.status(400).json({ error: "Provide at least one identity identifier." });
  if (!BRAVE_KEY && !HIBP_KEY) return res.status(503).json({ error: "No scan provider is configured. Add BRAVE_SEARCH_API_KEY and/or HIBP_API_KEY to server/.env." });

  try {
    const terms = [name && `\"${name}\"`, username && `\"${username}\"`, email && `\"${email}\"`].filter(Boolean).join(" OR ");
    const [web, breaches] = await Promise.all([
      terms ? braveSearch(terms, platforms) : [],
      hibpBreaches(email),
    ]);
    const findings = [...breaches, ...web];
    res.json({ score: scoreFindings(findings), findings, providers: { brave: Boolean(BRAVE_KEY), hibp: Boolean(HIBP_KEY) }, scannedAt: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: error instanceof Error ? error.message : "Scan provider failed." });
  }
});

app.listen(PORT, () => console.log(`Identity Guard API listening on http://localhost:${PORT}`));
