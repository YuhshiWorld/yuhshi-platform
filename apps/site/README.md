# @yuhshi/site — pre-launch website

Homepage, "Bring Yuhshi to my country" pledge and waitlist. `pnpm --filter @yuhshi/site dev`.

## Status
- Pledges are stored only when `PLEDGE_STORE_URL` is set. Until then the form says plainly "Sign-ups open soon. Nothing was saved."
- Hosting and the yuhshi.com domain are owner actions.

## Accessibility check
- Text uses rem and tokens; layout reflows at 200% text (no fixed heights on text).
- Skip link, labelled fields, `aria-invalid`, `aria-live` status, visible focus ring, 48 px targets.
- Respects `prefers-reduced-motion` and dark mode. `lang`/`dir` set on `<html>`; layout uses no left/right-only spacing that breaks RTL. RTL locales arrive with i18n.

## Safety risk assessment
| Risk | Mitigation |
| --- | --- |
| Email harvesting / spam sign-ups | Server-side validation; store adds rate limiting and double opt-in before launch |
| Emailing without consent | Consent box required server-side; only the opening-day email |
| Personal data exposure | Only email + country collected; no tracking scripts; `/api/` not indexed |
| Clickjacking, sniffing | `X-Frame-Options: DENY`, `nosniff`, strict referrer, camera/mic/location blocked |
| Ranking countries | Country list is alphabetical in the reader's language (`@yuhshi/geo`) |
