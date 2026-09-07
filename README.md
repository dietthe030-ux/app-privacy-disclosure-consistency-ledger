# Privacy Disclosure Consistency Ledger

A GenLayer project that binds an exact app-store listing to a publisher privacy policy, captures independently verifiable evidence, and compares their bounded public claims over time.

## Current status

The steward-requested correction passes local lint/schema, Direct Mode, frontend tests and production build. Its exact source is deployed on Studionet at `0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51`; source-byte parity and a fresh create → freeze → assess → reassess lifecycle passed independent `POST_DEPLOY_TEST` review. GitHub publication and a new Vercel build wired to this contract remain separate release gates. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for exact evidence and status.

## Verified links

- Corrected Studionet contract: [Explorer](https://explorer-studio.genlayer.com/address/0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51)
- Historical frontend (not yet rebound to the corrected contract): [Vercel production](https://app-privacy-disclosure-consistency.vercel.app/)

## Trust problem

An app-store disclosure and a publisher policy can change independently, while a centralized comparison service can silently choose a favorable interpretation. This ledger records both public sources, freezes their URLs, and preserves each later assessment as an immutable revision.

## Why GenLayer

The important decision is nondeterministic: validators independently fetch the two bounded public sources and normalize privacy categories, retention, and source digests. GenLayer consensus commits the resulting bounded decision on-chain; no frontend or model prose can override the verdict.

## How it works

1. Anyone creates a record with a platform-specific app-store ID, its matching allowlisted listing URL, and a policy URL on a distinct publisher host.
2. The owner freezes the sources.
3. Anyone assesses the frozen sources; validators independently retrieve both sources and confirm the app/publisher identity relationship before a conclusive verdict.
4. Anyone reassesses later; each immutable revision keeps retrieval time, source URL/host/status, captured byte count, truncation flag, digest, bounded excerpt, exact supporting quotes, normalized comparison and verdict.

## Architecture

- Contract: owns records, lifecycle authorization, append-only assessments, normalized evidence, and the verdict.
- Validators: independently retrieve and extract bounded fields, then reach consensus on the complete canonical decision.
- Frontend: discovers a selected wallet, submits contract methods, tracks finality, and reads authoritative state. It never calculates or overrides the verdict.
- Source of truth: lifecycle and complete assessment history are on-chain; `get_assessment(record_id, revision)` exposes the evidence snapshot used for every historical verdict.

## Intelligent Contract

State moves from `DRAFT` to `FROZEN` to `ASSESSED`. `create` is permissionless, `freeze` is owner-only, and `assess`/`reassess` are permissionless. Read methods are `get`, `get_assessment`, and `list_ids`. Safe outcomes include `CONSISTENT`, `MATERIAL_CONFLICT`, `DISCLOSURE_MISSING`, and `UNRESOLVED`; the contract is documentary comparison only, not legal or privacy-compliance advice.

## Transaction lifecycle

The frontend requires explicit wallet selection, checks the selected account and Studionet network, submits once, retains the transaction hash, waits for `FINALIZED` and successful execution, then performs an authoritative readback. Rejected, pending, failed, rate-limited, and reconciliation states remain actionable; the UI does not show success from a submission toast alone.

## Local checks

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider
cd frontend
npm install --save-exact
npm test
npm run build
```

For a live frontend, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_CONTRACT_ADDRESS` to the corrected Studionet address. The existing public Vercel artifact remains historical until a new build is independently bound to that address, chain `61999`, and the exact approved frontend source.

## Tests and verification

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider
cd frontend
npm test
npm run build
```

The corrected package passes lint/schema, 17 Direct Mode tests, 13 frontend tests, and the production build. Its 26,522-byte deployed source exactly matches SHA-256 `C475DF6EF49A4EE4984CFD98A1664E50D3577AEE1B5D98899253917CA6F897AA`; all four fresh lifecycle writes finalized successfully with authoritative revision readbacks and no retries or duplicate writes.

## Deployment and recovery

The corrected upgradable contract is deployed at `0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51` by transaction `0x72732555ed7fda8caf2646f0e548908e180d789169c9ae3a4a443927d04813c6`. Its deployer is registered as a native Root Slot upgrader. Earlier frozen contracts and the existing Vercel artifact are historical only; the next production deployment must bind the frontend to this corrected address and preserve exact source/build provenance.

## Security and limitations

User-controlled and fetched page content is treated as untrusted data. The contract bounds source retrieval and model output, validates the canonical schema, preserves disagreement/failure safely, and stores digests for lineage. Results describe consistency of captured disclosures only; they do not prove that a source is truthful, current, complete, or legally compliant.

## Scope

This is documentary consistency comparison, not legal advice or a privacy-compliance certification. The frontend does not calculate or override the on-chain verdict.
