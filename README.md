# Identity Guard

A privacy-first Expo app for Android, iOS, and web with a small Node API for live identity-exposure checks.

## What is live now

The dashboard no longer displays a hard-coded score or fake findings. The API can use:
- Brave Search API for public web results matching identifiers you supply
- Have I Been Pwned API for breach exposure tied to an email you are authorized to audit
- evidence URLs, timestamps, and a score derived from returned findings

The app does not perform facial identification of strangers, bypass access controls, infer private social graphs, or collect vulnerabilities about unrelated people.

## Run locally

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and add at least one provider key:

```text
BRAVE_SEARCH_API_KEY=your_key_here
HIBP_API_KEY=your_key_here
```

Then:

```bash
npm run dev
```

The API starts on `http://localhost:8787`. Check `http://localhost:8787/health` to see which providers are configured.

### 2. Expo client

From the repository root:

```bash
npm install
cp .env.example .env
npm run web
```

The default client API URL is `http://localhost:8787`. For an Android emulator, set `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8787`. For a physical phone, use your computer's LAN IP and ensure the firewall permits the port.

## Important limitations

- Search results are candidates, not proof that a page belongs to the user; verify evidence before acting.
- The optional reference photo currently remains local and is not sent to the scan API.
- Selected-platform persistence, authentication, scheduled scans, and PostgreSQL storage are still to be implemented.
- Never commit `.env` files or provider secrets. `.env.example` files contain names/placeholders only.

## Recommended production architecture

- Expo Router universal client
- authenticated API
- PostgreSQL with row-level security
- official OAuth/platform APIs where supported
- encrypted object storage
- background scan queue
- evidence retention/deletion controls
- rate limiting and audit logs

Before production, add authentication, consent/authorization checks, secret management, abuse prevention, a privacy policy, and platform-specific API compliance.
