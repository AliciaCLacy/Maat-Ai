# Goddess Myriad AI.io — Conversation Response Layer
Author: Alicia C. Lacy. Added November 1, 2026, in the private repo only.

## What it is
A new Talk view in the app (index.html + conversation.js, styles in styles.css).
It is a response layer, not a live LLM chat: no API, no paid service, no external
model is called. It answers only by searching creations.json — her 271 works,
verbatim titles — and returning matches.

## Prompting suggestions
Tap a suggestion, then edit it in your own words. Suggestions cover her
prompting dimensions, verbatim from her direction:
- Measurement: "Measure it" — how many layers, how many works, what dates.
- Urban prompting variations: in the user's own voice / register.
- Acronym prompting by users: compressed, user-owned prompt language (e.g. H01).
- Voice to prompt by users: spoken prompts, not typed.
Plus direct work suggestions: H01, Talulah, KP NeX, Dashia's Halloween,
Soul Synthesis, UDAB.

## Multilanguage input / output
- Input language selector: English, Spanish, French, Portuguese. It sets the
  search box language and, for voice input, the browser speech-recognition
  language (en-US, es-ES, fr-FR, pt-BR).
- Output language selector: English, Spanish, French, Portuguese. It changes
  only the framing sentences around the results ("Here are works that match",
  "No work matches yet", etc.).
- Work titles, categories, dates, and statuses stay verbatim, in their filed
  language. They are never translated, reworded, or inferred down — translating
  a title would break her verbatim rule.
- Other languages fall back to English framing, with the same verbatim titles.

## Voice
- Voice input: browser Web Speech API, if the visitor's browser supports it.
  If not, the button is disabled and says so.
- Voice output: her recorded greeting only (voice-goddess-myriad-greeting-2026-11-01.mp3
  on Home, 7.24 seconds, November 1, 2026). Her voice is never synthesized
  or cloned in this layer.

## What it will NOT do
- No invented answers. If nothing in creations.json matches, it says so.
- No dollar totals as a market value, no estimates in Talk answers — estimates
  live only in the accounting CSV, labelled preliminary.
- No public launch by itself. This layer, like the rest of the brain, stays
  private until Alicia says launch.
