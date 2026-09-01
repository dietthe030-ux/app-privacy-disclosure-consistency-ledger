# Privacy Disclosure Consistency Ledger — UI Design

## Intent

Build a calm, judge-facing public record tool for comparing an app-store privacy disclosure with the publisher privacy policy. The interface should make the record lifecycle and latest comparison outcome understandable without exposing implementation details.

## Visual direction

- Warm off-white canvas, ink text, muted slate secondary text, and restrained teal as the action color.
- Editorial ledger feel: clear rows, thin borders, generous whitespace, and compact status badges.
- Responsive single-column layout that becomes a two-column workspace on wide screens.
- No gradients, glassmorphism, decorative illustrations, or dashboard-like metric walls.

## Interaction rules

- The primary action is always explicit: connect a wallet, create a record, freeze sources, or assess a record.
- Wallet choice is a modal selection among the required available wallets only; opening it never requests accounts.
- Public copy uses plain language such as “Compare disclosures” and “Network connection”. It does not expose provider, RPC, chain-ID, contract, test, or debug terminology.
- Assessment evidence is documentary comparison only, not a legal or privacy-compliance opinion.

## Accessibility

- Use semantic headings, labels, buttons, lists, and status regions.
- Keep visible focus states, keyboard navigation, Escape dismissal, focus restoration, and a modal focus trap.
- Preserve readable contrast and do not rely on color alone for lifecycle or verdict meaning.

## Exclusions

- No auto-connect or silent session restoration.
- No provider object details, technical network values, transaction internals, or developer-only diagnostics in the public UI.
- No unsupported wallet brands, social login, WalletConnect, or embedded wallet flow.
