# Deployment and recovery runbook

This runbook is prepared for the exact current source revision. It is not permission to deploy. No signature, deployment transaction, or contract write may be sent until the `PRE_DEPLOY` conditions below are satisfied.

## Current source

- Contract: `contracts/app_privacy_disclosure_consistency_ledger.py`
- SHA-256: `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`
- Contract source commit: `5cdd176013c2a06180119f0561078fd4f4fa734f`
- Constructor arguments: `[]`
- Contract methods: `create`, `freeze`, `assess`, `reassess`, `get`, `get_assessment`, `list_ids`

## Required decisions before deployment

1. Classification is `INTENTIONALLY FROZEN`: a post-deployment defect requires a replacement contract and frontend address update.
2. The selected Studio deployer public address is `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`; recheck access and spendable balance immediately before deployment.
3. Obtain anonymous `PRE_DEPLOY` approval for the exact source/evidence package.

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
