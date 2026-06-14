# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based widget for Korean healthcare insurance claim review and decision support. It renders a searchable, card-based UI that provides claim handlers with recommended diagnosis codes (ICD-10), specific detail/symbol requirements, risk/audit trigger checklists, and copy-paste template text.

Deployed as an embedded widget on **IMWeb** (Korean web builder platform) via script injection into common code and code widget blocks.

## No Build Tooling

This is vanilla JavaScript (ES6). There is no `package.json`, bundler, transpiler, linter, formatter, or test framework. Files are served directly as static assets. There are no install steps, build commands, or test commands.

## Architecture

Three layers, loaded in sequence at runtime:

```
Loader (claim_loader_v1.js)
  └─ injects DB scripts → populates window.CLAIM_DB
  └─ exposes window.ClaimDB (API) and window.ClaimWidget (UI mount)

Database Layer (db/)
  ├─ claim_db_meta_v1.js     initializes window.CLAIM_DB structure
  ├─ claim_db_seed_v1.js     populates cards[] with playbook entries
  └─ claim_db_parts_index_v1.json  manifest for lazy-loading masters (currently empty)

UI Layer (app/claim_widget_app_v1.js)
  └─ ClaimWidget.mount(selector) renders search input + card grid
```

### Global State

- `window.CLAIM_WIDGET_CONFIG` — must be set before loader runs; requires `baseUrl` pointing to the hosted folder
- `window.CLAIM_DB` — initialized by DB scripts; contains `meta`, `masters`, `codeTables`, `cards[]`
- `window.ClaimDB` — loader API; `init()`, `getIndex()`, `lookupKcd()`, `lookupDrug()`, `lookupFee()`
- `window.ClaimWidget` — UI API; `mount(rootSelector)`

### Card Schema

Every playbook entry in `CLAIM_DB.cards[]` follows this shape:

```javascript
{
  key: "ingredient_gabapentin",
  type: "ingredient" | "test" | ...,      // drives the UI badge
  title: "가바펜틴 (gabapentin) ...",
  recommend_icd: {
    core2: [{ code: "G53.0", note: "..." }],  // up to 2 ICD-10 candidates
    choose_rule: "..."                         // selection guidance for reviewers
  },
  specific_detail: {
    required: true | false | "conditional",
    code: "JX999" | "MX999" | null,
    decision: "...",
    templates: ["JX999: ..."]               // boilerplate claim note text
  },
  risk_triggers: ["상병-목적 불일치", ...]   // audit/denial checklist items
}
```

### Master Tables

`CLAIM_DB.masters` has `kcd`, `drugs`, `fees` — all currently empty. The lookup functions (`lookupKcd`, `lookupDrug`, `lookupFee`) return `null` until these are populated. The parts index (`claim_db_parts_index_v1.json`) is the manifest for lazy-loading these in future.

## Key Implementation Details

**DOM utilities** — `app/claim_widget_app_v1.js` uses a local `el(tag, attrs, children)` helper for all DOM creation. No external DOM library.

**Inline CSS** — all styles are injected as a `<style>` tag inside `ClaimWidget.mount()`. No external stylesheet. System font stack: `system-ui, -apple-system, Segoe UI, Roboto, Arial`.

**Search** — `searchCards()` does a case-insensitive linear scan (`O(n)`) by JSON-stringifying each card and checking `.includes(query)`. Results capped at 20. Acceptable for the current card count; would need indexing at scale.

**Script injection** — `claim_loader_v1.js` dynamically injects `<script>` tags and returns Promises. All DB loading is async/await.

**Clipboard** — uses `navigator.clipboard.writeText()` with a `window.prompt()` fallback for environments that block the Clipboard API.

## Deployment

1. Host `/db/` and `/app/` on a static server (e.g. GitHub Pages). The folder structure must be preserved relative to `baseUrl`.
2. In IMWeb **common code (HEAD)**, insert:
   ```html
   <script>
     window.CLAIM_WIDGET_CONFIG = { baseUrl: "https://example.com" };
   </script>
   <script src="https://example.com/app/claim_loader_v1.js"></script>
   ```
3. In an IMWeb **code widget**, insert the contents of `app/claim_widget_embed_v1.html`.

See `README_IMWEB.md` for the full deployment guide (Korean).

## Extending the Widget

**Add a card**: append an object matching the card schema to the `cards` array in `db/claim_db_seed_v1.js`. It appears in search immediately — no registration needed.

**Add master data**: populate `CLAIM_DB.masters.kcd / drugs / fees` either in the seed file or by fetching and merging at runtime.

**Customize UI**: edit the `css` string constant and `renderCard()` function in `app/claim_widget_app_v1.js`.

## Domain Context

All content is in Korean. The widget is specific to the Korean National Health Insurance (NHI) claims system:
- **KCD codes** — Korean Classification of Diseases (ICD-10-based)
- **specific_detail codes** — NHI-specific claim fields (JX999, MX999, etc.)
- **risk_triggers** — common audit/denial reasons per Korean NHI review criteria

Sample cards are marked `needs_verification` and require validation against official Korean NHI guidelines (고시, 심사지침) before production use.
