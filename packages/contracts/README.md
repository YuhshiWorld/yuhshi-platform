# @yuhshi/contracts

The shared definitions every Yuhshi workstream builds against, so sessions working in parallel fit together.

| Module | What it fixes |
| --- | --- |
| `ids` | `<prefix>_<ULID>` IDs made on the device (offline records keep their ID); prefixes per kind |
| `events` | Event catalogue (type, version, device or server origin, owning module), envelope, canonical JSON, SHA-256 hash chain, `verifyChain`, `deviceMayEmit` |
| `sync` | The six postcard statuses and allowed moves, sync priority order, outbox operation shape, retry back-off, weak-connection rules |
| `money` | USD base, integer minor units, price bands A–D, balanced double-entry postings, account names |
| `api` | API version, headers (idempotency key = outbox op ID), error codes and plain-words error shape, cursor paging, country availability |

## Rules
- Changing a contract is a pull request to this package, reviewed by the master build session. Other packages never redefine these types.
- A new event type is added to `eventCatalog` with its origin. Money, safety decisions, stamps and confirmations are `server` origin only.
- Changing an event payload means a new `version`; old versions stay readable forever.
- Living documents: note in the PR which documents the change affects (Privacy Policy for new data, Guidelines for new rules).
