# Yuhshi

**Don't collect followers. Collect the world.**

Monorepo for the Yuhshi human exchange network. The Yuhshi Master Blueprint (Consolidated Edition 1.0) is the strategic reference; the Technical Architecture doc is the engineering reference.

## Layout

| Folder | Purpose |
| --- | --- |
| `apps/` | `mobile` (Expo: Android, iOS, web), `site` (Next.js homepage), `admin` |
| `services/` | `api` (modular-monolith backend), workers |
| `packages/` | Shared code: `tokens`, `ui`, `i18n`, `sync`, `types` |

Only `packages/tokens` exists so far.

## Rules for every contributor and Claude session

- Read `claude/build-log.md` in the YUHSHI project before starting; log progress there after.
- TypeScript everywhere, strict mode.
- No raw colors or font sizes in components: import from `@yuhshi/tokens`.
- Offline-first: every user action works offline or shows an honest status (Saved locally → Pending sync → Confirmed).
- Every feature ships with a written safety risk assessment (Master Blueprint S1).

## Commands

```sh
pnpm install
pnpm test
pnpm build
```
