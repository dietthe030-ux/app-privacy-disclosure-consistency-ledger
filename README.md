# Privacy Disclosure Consistency Ledger

A GenLayer project that records an app-store privacy disclosure and a publisher privacy policy, then compares their bounded public claims over time.

## Current status

The contract and functional frontend pass local verification. The replacement contract is deployed and live-verified on Studionet at `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`; the production frontend is live on Vercel and its affected E2E rerun is verified. Final GitHub/Vercel and Explorer submission gates remain separate. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for exact revision, commands, evidence, and release status.

## Verified links

- Studionet contract: [Explorer](https://explorer-studio.genlayer.com/address/0xfE2E4216502f12206A61a2b2103CbD1329FFb56b)
- Live frontend: [Vercel production](https://app-privacy-disclosure-consistency.vercel.app/), built from the verified `frontend/` root.

## Trust problem

An app-store disclosure and a publisher policy can change independently, while a centralized comparison service can silently choose a favorable interpretation. This ledger records both public sources, freezes their URLs, and preserves each later assessment as an immutable revision.

## Why GenLayer

The important decision is nondeterministic: validators independently fetch the two bounded public sources and normalize privacy categories, retention, and source digests. GenLayer consensus commits the resulting bounded decision on-chain; no frontend or model prose can override the verdict.

## How it works

1. Anyone creates a record with an app identifier, platform, and two public HTTPS URLs.
2. The owner freezes the sources.
3. Anyone assesses the frozen sources; the contract stores the result and evidence digests.
4. Anyone reassesses later; the new revision is appended and earlier revisions remain readable.

## Architecture

- Contract: owns records, lifecycle authorization, append-only assessments, normalized evidence, and the verdict.
- Validators: independently retrieve and extract bounded fields, then reach consensus on the complete canonical decision.
- Frontend: discovers a selected wallet, submits contract methods, tracks finality, and reads authoritative state. It never calculates or overrides the verdict.
- Source of truth: lifecycle and assessment history are on-chain; the public URLs are external evidence captured by digest.

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

For a live frontend, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_CONTRACT_ADDRESS` only after the Studionet deployment has passed live smoke verification. The production artifact is separately bound to the replacement address and chain in [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Tests and verification

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider
cd frontend
npm test
npm run build
```

The current exact package passes lint/schema, 8 Direct Mode tests, 12 frontend tests, and the production build. Full deployment and live proof are recorded in [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Deployment and recovery

The current Studionet deployment is bound to source SHA-256 `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`. The deployment manifest records the finalized transaction, live proof matrix, exact-source parity, and frozen-contract replacement procedure.

## Security and limitations

User-controlled and fetched page content is treated as untrusted data. The contract bounds source retrieval and model output, validates the canonical schema, preserves disagreement/failure safely, and stores digests for lineage. Results describe consistency of captured disclosures only; they do not prove that a source is truthful, current, complete, or legally compliant.

## Scope

This is documentary consistency comparison, not legal advice or a privacy-compliance certification. The frontend does not calculate or override the on-chain verdict.
