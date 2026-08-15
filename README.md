# Identity Guard

A privacy-first universal Expo app starter for Android, iOS, and web.

## Scope

This MVP is intentionally designed for self-auditing:
- user-provided identity information
- authorized platform monitoring
- exposure findings
- remediation workflows

It does **not** perform facial recognition of strangers, scrape arbitrary profiles, infer private social graphs, or collect vulnerabilities about unrelated people.

## Run locally

```bash
npm install
npx expo start
```

Web:
```bash
npm run web
```

Android/iOS:
```bash
npm run android
npm run ios
```

## Production architecture

Recommended next layer:
- Expo Router universal client
- API routes/server functions
- PostgreSQL + row-level security
- OAuth/official platform APIs
- encrypted object storage for any user-uploaded photo
- queue/worker for scans
- immutable finding evidence with timestamps
- deletion/retention controls
- audit logs

## Deployment

Expo's current documentation recommends EAS Hosting for Expo web apps and EAS Build for Android/iOS binaries.

```bash
npm install -g eas-cli
eas login
npx expo export --platform web
eas deploy
eas build --platform all
```

Before production, add authentication, consent/authorization checks, rate limits, encryption, secret management, privacy policy, and platform-specific API compliance.
