# Stage 1 — App Privacy Disclosure Consistency Ledger

Status: `RESEARCH_APPROVED_R2`; exact package: `E:\Genlayer-Projects\_research-candidates-2026-09-01\RESEARCH-CANDIDATES-R1.md`; package SHA-256: `D6D5DD20D86AE616CE7A3E084C26E4DDF31410E4AF72383EC62A11C2F344E046`.

Users compare one app-store privacy disclosure with one publisher policy. Trust failure: either page can change independently and a centralized comparator can choose a favorable interpretation. Actors: publisher/owner creates and freezes; anyone assesses; GenLayer validators independently fetch and compare; readers verify. State: `DRAFT -> FROZEN -> ASSESSED`; reassessment appends a revision. Four categories use bounded values `NOT_MENTIONED|PERMITTED|RESTRICTED`; unknown retention/ambiguous evidence is safe `UNRESOLVED`, not an inferred conflict. Product is documentary consistency only, not privacy compliance or legal advice. One contract, one consensus operation per assessment, two bounded public HTTPS sources. Build must verify source retrieval with the current runtime before technical lock.

Closest projects: `policy-translation-release-gate`, `public-notice-version-consistency-registry`; same two-source semantic comparison, but this uses privacy-category/retention disclosure lineage and a distinct on-chain decision. Reviewer R2: `APPROVED`.

Acceptance: category omission, conditional wording, renamed categories, contradictory retention, reassessment and source-change fixtures produce stable enums; revision 1 remains readable after revision 2.
