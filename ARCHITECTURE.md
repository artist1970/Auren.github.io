# Auren public front door — architectural blueprint v0.1

**Status:** public front-end scaffold, not an AI backend or private archive connector.  
**References inspected:** `artist1970/Pierre.gihub.io` public landing/chat design; private `artist1970/CORE/AurenCore` charter; private `artist1970/AIPCore` README, adaptive-memory policy, STOS and ADIT bridge guides (2026-10-31).

## Distinct responsibilities

| Layer | Purpose | Data scope | State |
| --- | --- | --- | --- |
| `Auren.github.io` | Public entry page, informational panels, chat input, speech controls | Approved public knowledge only | Site scaffold |
| `CORE/AurenCore` | Identity, role, continuity, boundaries, provenance and instruction codex | Private documentation | Documented, no runtime |
| `AIPCore` | Shared language reference and bounded pattern relevance | Sanitized feature signals only, where explicitly enabled | Existing separate package; **not connected here** |
| `Creative Spark` | Potential future reviewed public knowledge and approval workflow | Requires a defined API and authorization | Proposed; not connected |
| Memory Project private repository | Canonical original conversations, checksums, receipts, sensitive creative history | Restricted original source data | Never accessed directly by public browser |

## Safe first-release conversation

1. Load a versioned `knowledge/public-qa.v1.json` with approved-for-public-release entries only.
2. Match the user's question locally in the browser; return a sourced curated answer or explain limitations.
3. Never automatically send private questions, transcripts, filenames, or user metadata to AIPCore or elsewhere.
4. Do not claim the public experience is a general language model, that it remembers returning visitors, or that it sees the private archive.
5. Speech synthesis, if available, stays within browser capabilities.
6. Any future report-unknown-question workflow needs explicit consent, retention, moderation and an authenticated review service.

## Later AIPCore integration proposal

Public query → local intent/safety check → approved public index → optional sanitized language reference / relevance suggestion through an explicitly reviewed adapter → answer carrying source metadata.

AIPCore's Adaptive Pattern Memory principle is **learning changes attention and teaching strategy, not authority**. An adapter must forbid:
- private-source reads or leaks;
- repository writes, access-control changes or publishing decisions;
- authority self-elevation, secret-bearing requests and automatic approvals;
- retention of raw private conversation material or sensitive inferred traits.

Do not import legacy Aurora compatibility internals directly into a public Auren chat page. Audit browser compatibility, package exports, network behavior, licensing, update policy and privacy first. No AIPCore runtime is bundled by this blueprint.

## Future private archival workflow (separate service)

Authorized user → authenticated request → approved source retrieval from private archive → provenance verification (filename/hash/page/author/permissions) → reviewed derivative → optional public-release approval → publish allowlisted summary or Q&A.

Use signed/recorded publication receipts, audit logs, revocation, and a clearly bounded source allowlist. Authentication and private repository access must be enforced server-side or through trusted authenticated connectors; browser JS must never contain privileged tokens.

## Test gates before declaring production

- Site loads and navigates on desktop/mobile with keyboard and screen reader.
- Curated bank loads, validates and fails closed with helpful fallback; no hostile text interpreted as markup.
- Voice gracefully handles unsupported browsers.
- Missing/unknown queries never invent private archive citations.
- Browser network inspection confirms no messages leave the origin.
- AIPCore integration tested in isolation, with malicious and sensitive inputs, and explicit negative tests for authority and privacy.
- GitHub Pages enabled and live deployment independently verified.

## Current limitation

The initial HTML has a chat layout; its JavaScript and curated public bank are architectural stubs until added and validated. Links to private CORE must never be treated as public retrieval interfaces.
