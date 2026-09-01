# Privacy Disclosure Consistency Ledger

A GenLayer project that records an app-store privacy disclosure and a publisher privacy policy, then compares their bounded public claims over time.

## Current status

The contract and functional frontend pass local verification. The replacement contract is deployed and live-verified on Studionet at `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`; anonymous `POST_DEPLOY_TEST` is approved, while frontend release wiring remains separate. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for the exact revision, commands, evidence, and release blockers.

## Local checks

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider
cd frontend
npm install --save-exact
npm test
npm run build
```

For a live frontend, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_CONTRACT_ADDRESS` only after the Studionet deployment has passed live smoke verification.

## Scope

This is documentary consistency comparison, not legal advice or a privacy-compliance certification. The frontend does not calculate or override the on-chain verdict.
