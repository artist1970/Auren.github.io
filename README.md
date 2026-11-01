# Auren · Keeper of the Living Archive

Auren's public front door in the Verve N Veda ecosystem.

> Preserve what was. Understand what is. Illuminate what may yet become.

## Current stage: architecture and small public prototype

- `index.html`: responsive charcoal, violet, parchment and gold landing page, chat interface, accessibility labels and browser speech controls.
- `auren-conversation-v1.js`: browser-local deterministic answer matcher; no generative AI backend, cookies, account management, analytics or remote message submission.
- `knowledge/public-qa.v1.json`: small, explicitly public introductory question bank.
- `ARCHITECTURE.md`: proposed future integration layers, security boundaries and release tests.

The actual repository is `artist1970/Auren.github.io` (public). Its usual *project* GitHub Pages URL would be `https://artist1970.github.io/Auren.github.io/` **if Pages is enabled**. The actual deployment has not been independently verified.

## Architectural separation

- **Private identity:** `artist1970/CORE/AurenCore` (a private documentation CORE).
- **Shared reference:** `artist1970/AIPCore` (private shared dictionary/refinement and bounded adaptive-pattern memory). **No live integration**.
- **Private historical originals:** `KhaemenesAcademy/chat-conversations.github.io`. Not accessible from public browser code.
- **Public Auren:** introductory guidance, public approved data only, and optional browser speech.

## Chat limitations

The local matcher answers only approved topics. It cannot analyze uploaded sources or access private archives. It does not save user messages, queue unknown questions, or use a live language model. Speech synthesis may depend on browser/device voices. The public knowledge JSON is downloaded to the viewer's browser and therefore must never contain private data.

## Next gates

1. Verify Pages deployment and rendered site on desktop and mobile.
2. Browser test keyboard access, speech selection and unavailable bank fallback.
3. Review public Q&A accuracy and content approval.
4. Confirm network behavior and privacy in a real browser.
5. Design any optional AIPCore/Creative Spark integration as a separate audited and authorized adapter; no direct private API calls from the public front end.

## Preservation principle

The archive belongs to its creators. Original source records and attribution are preserved independently from interpretations or summaries.

© 2026 Jennifer Kay Pearl · Verve N Veda.
