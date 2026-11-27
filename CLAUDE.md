# Yuhshi platform — rules for every session

1. Before starting, read `claude/build-log.md` in the YUHSHI project. The Yuhshi Master Blueprint and Technical Architecture linked there are the official references.
2. Work on a branch, never directly on `main`. Open a pull request; `main` only accepts changes whose CI checks pass.
3. Before opening or merging a pull request, run locally: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm test && pnpm build`. All must pass.
4. Every new package has `typecheck`, `test` and `build` scripts so CI covers it automatically.
5. No raw colours or font sizes in components: import from `@yuhshi/tokens`. Icons come from `@yuhshi/icons`, synced from `YuhshiWorld/yuhshi-icons` with `scripts/sync-icons.sh` (never edited by hand).
6. Offline-first: every user action works offline or shows an honest status. Money and safety decisions run on the server.
7. Every feature ships with tests, an accessibility check (200% text, screen reader, RTL) and a written safety risk assessment.
8. After meaningful progress, append a dated entry to the build log's "Session updates".
9. Living documents: when you add, change or remove a feature, data use, fee or safety tool, update every document it affects in the same pull request or the build log entry (Community Guidelines, Terms, Privacy Policy, safety risk assessment, pricing plan, names register, Master Blueprint). Note in the PR which documents changed, or "none affected".
10. Improvements during the build (L12): any improvement you realise while building is implemented, in the same pull request or its own. Add a row to the build log's Improvements register (Section 8): what, where (PR, files, documents) and why, and say so in the PR. Improvements that change a locked decision (blueprint, pricing, names, logo, colours, fonts, tagline) go to the owner first.
