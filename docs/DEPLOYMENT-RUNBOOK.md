# Deployment and recovery runbook

This runbook records the exact source and the completed Studionet deployment. Its pre-deployment conditions are retained as historical gate documentation; the remaining acceptance gate is anonymous `POST_DEPLOY_TEST` review.

## Current source

- Contract: `contracts/app_privacy_disclosure_consistency_ledger.py`
- SHA-256: `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`
- Contract source commit: `5cdd176013c2a06180119f0561078fd4f4fa734f`
- Constructor arguments: `[]`
- Contract methods: `create`, `freeze`, `assess`, `reassess`, `get`, `get_assessment`, `list_ids`

## Recorded pre-deployment decisions

1. Classification is `INTENTIONALLY FROZEN`: a post-deployment defect requires a replacement contract and frontend address update.
2. The selected Studio deployer public address was `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`; balance was rechecked immediately before deployment at `998 GEN`.
3. Anonymous `PRE_DEPLOY` approval was received for the exact source package at HEAD `610495ab520aacf4d3a13ca34b6355896ab007e8`.

The frontend write preflight requires at least `0.01 GEN` from the selected external wallet before enabling or submitting a zero-value contract write. This is a conservative local floor, not a claim about production gas pricing; final transaction success still requires finality, semantic execution success and readback.

## Gated Studionet action

The current official CLI guide documents this Studionet command:

```powershell
genlayer deploy --contract contracts/app_privacy_disclosure_consistency_ledger.py --rpc https://studio.genlayer.com/api
```

The CLI was unavailable on this machine, so the approved deployment route was the Codex in-app GenLayer Studio browser. Deployment transaction: `0x6c79de4694e9584293ba1eb31b20466c85bf417c3bdc899103c7db56ac39b2f7`; contract: `0x97a005a129e0212c792CC00B20B702288c1C13EB`; both are recorded as `FINALIZED` with semantic `SUCCESS`.

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
