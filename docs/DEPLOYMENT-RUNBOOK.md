# Deployment and recovery runbook

This runbook is prepared for the exact current source revision. It is not permission to deploy. No signature, deployment transaction, or contract write may be sent until the `PRE_DEPLOY` conditions below are satisfied.

## Current source

- Contract: `contracts/app_privacy_disclosure_consistency_ledger.py`
- SHA-256: `A11100F7846517E9F3C19C6AD637B4E7F3065B82D6EC3B2E16B88FA94C9A6830`
- Git commit: `4c5286c71378b821d38b7d2e052fc8f1aab45279`
- Constructor arguments: `[]`
- Contract methods: `create`, `freeze`, `assess`, `reassess`, `get`, `get_assessment`, `list_ids`

## Required decisions before deployment

1. Classify the contract as `INTENTIONALLY FROZEN` or `UPGRADABLE`.
2. If `INTENTIONALLY FROZEN`, record the explicit user decision and explain that a post-deployment defect requires a replacement contract and frontend address update.
3. If `UPGRADABLE`, do not deploy this current source: first add and verify the required Root/upgrader lifecycle, storage-compatibility plan, and upgrade tests.
4. Select and record the public address of an accessible Studio deployer account without sending a transaction.
5. Obtain anonymous `PRE_DEPLOY` approval for the exact source/evidence package.

## Gated Studionet action

The current official CLI guide documents this Studionet command:

```powershell
genlayer deploy --contract contracts/app_privacy_disclosure_consistency_ledger.py --rpc https://studio.genlayer.com/api
```

Do not run it until the conditions above pass. The primary AI must retain the resulting transaction hash, contract address, exact source hash, sender, constructor arguments, and semantic execution result. The current machine does not have the `genlayer` CLI command available, so the approved deployment route is the Codex in-app GenLayer Studio browser when the gate is cleared.

## Post-deployment matrix

Use one live row for each unique transition and retain failed attempts as diagnostic evidence:

- `LIVE-01`: create a draft record; authoritative readback shows `Draft` and revision `0`.
- `LIVE-02`: owner freezes the record; readback shows frozen sources.
- `LIVE-03`: any caller assesses frozen sources; readback shows comparison result and revision `1`.
- `LIVE-04`: any caller reassesses; readback shows a new revision while revision `1` remains readable.

Each successful write requires `FINALIZED`, current interface semantic execution success, and authoritative readback. A submitted or finalized transaction alone is not success evidence.

## Frontend wiring

Only after live smoke verification succeeds, set `frontend/.env.local`:

```text
VITE_CONTRACT_ADDRESS=<verified Studionet contract address>
```

Then run `npm test`, `npm run build`, and the exact browser journey against that address. Never store a private key, seed phrase, wallet credential, or Studio identity secret in this project.

## Official references

- [Load a contract into Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/loading-contract)
- [Deploy contracts in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/deploying-contract)
- [CLI deployment](https://docs.genlayer.com/developers/intelligent-contracts/deploying/cli-deployment)
- [Execute transactions in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/execute-transaction)
- [Current contract state](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/contract-state)
