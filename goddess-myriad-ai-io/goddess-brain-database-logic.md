# Goddess Brain — Database Logic
Author: Alicia C. Lacy. Updated November 1, 2026, from the Alicia C Lacy Works Database (271 works).

## What the brain now holds
- creations.json — the full library, 271 works, in tracker order plus 10 newer works.
  Each entry: id, name, category, date, status, author, token_id, tracker_row,
  publishing_tier, file_name, local_path, dropbox_path, dropbox_status,
  estate_folder, source, estimate_low_as_recorded, estimate_high_as_recorded, estimate_basis.
- alicia-c-lacy-works-database-works-export-2026-11-01.csv — the same works as a spreadsheet table.
- alicia-c-lacy-works-database-accounting-2026-11-01.csv — line-by-line accounting, with the recorded estimate per work.
- alicia-c-lacy-works-database-readme-2026-11-01.md — database notes and protection rules.

## Logic: work -> asset -> folder
- A work is identified by name + date + authorship (Alicia C. Lacy).
- Its assets are its files (local path in the workspace, organized copy in Dropbox).
- Its associated folder is its Dropbox KEY CREATIONS folder (existing 00-09, or proposed 10-17 for newer works).
- Path rule: creation -> its path -> its asset copy -> its associated folder. The manifest and this database are the logic tying them together.
- Originals are never moved, renamed, or deleted. Copies only. Duplicates go in a folder titled "duplicates".

## How the AI in this brain must use it
- Search and filter by name, category, date, and Dropbox folder — the app.js library already does this from creations.json.
- Answer from these recorded works first, before fresh generation. Preserve titles, names, counts, and original art verbatim.
- Works are never presented as AI-generated. Timestamps and authorship travel with every use.
- Recorded estimates are preliminary internal estimates only (tracker header: not a professional appraisal; HER = her stated figure, unverified; AI = preliminary, not a market value). Never present a summed total as a market valuation, and never present the $93.5M outright single-buyer sunset asking price as a sum of these lines — it is a separate, her-decided sale figure.
- Lines marked Draft, Included, TBD, or blank have no recorded dollar figure. Do not invent one.
- Draft tracker rows 262-279 are NOT live-logged. Do not present a newer work as a live tracker row.
- This repository is private until Alicia says launch. Nothing from it is published publicly by the brain.
