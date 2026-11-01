# Alicia C Lacy Works Database
Built November 1, 2026. Read-only sources — building this database moved, deleted, renamed, or uploaded nothing.

## Files
- `alicia-c-lacy-works-database-2026-11-01.sqlite` — the database (SQLite, open in DB Browser for SQLite, or any SQLite tool)
- `alicia-c-lacy-works-database-works-export-2026-11-01.csv` — the works table as a spreadsheet-readable export
- Build script: `~/workspace/build-works-database.py` (re-runnable from the same sources)

## What's inside — verified counts
- Works: 271 = 261 live tracker rows + 10 newer works from the November 1 audit
- Assets: 794 = 442 Dropbox KEY CREATIONS manifest rows + 352 creation-estate files
- Folders: 18 = 10 existing KEY CREATIONS folders + 8 proposed folders (10 Talulah through 17 IRC41 Report)

## Tables
- `works` — one row per work: name, category, date, status, author (Alicia C. Lacy), token ID, tracker row, source, local path, Dropbox path, Dropbox status, estate folder, notes
- `assets` — one row per file copy: work name, creation label, original path, organized (Dropbox) path, local path, date, size, copy status, source
- `folders` — Dropbox KEY folders, existing vs proposed
- `meta` — build date, sources, and protection rules

## Protection rules baked in
- Originals untouched. Copies only.
- Duplicates go in a folder titled "duplicates" — never deleted.
- Proposed Dropbox folders (10–17) are NOT created and NO files were copied into them by this build. Copying awaits Alicia's approval of the audit list.
- Draft tracker rows 262–279 are NOT live-logged. Works marked draft in this database are drafts only.
- The live Creation Value Tracker (261 rows) is the source for tracker works — this database does not overwrite it.

## Quick checks (SQLite)
- All works: `SELECT id, name, category, date, dropbox_status FROM works ORDER BY id;`
- Works with no Dropbox folder yet: `SELECT name, dropbox_path FROM works WHERE dropbox_status LIKE 'proposed%';`
- Assets for one work: `SELECT organized_path, local_path FROM assets WHERE work_name LIKE '%Talulah%';`
- Audit gaps carried over: 5 manifest organized paths did not match the October 14 map exactly (naming/prefix mismatches, not proven losses — see the November 1 audit report); 171 manifest rows have a blank original path.

## Sources
- Creation Value Tracker, 2026-09-10 (live, 261 rows)
- Dropbox KEY CREATIONS manifest, 2026-10-02 (442 rows)
- creation-estate ESTATE_MANIFEST.json (177 entries)
- Dropbox path-to-folder audit, 2026-11-01

## Private repository copy
- Repository: AliciaCLacy/Ai-persona-registration- (private), folder goddess-myriad-ai-io/
- This copy, November 1, 2026, updates the brain's library from 259 creations (October 18, 2026) to 271 works.
- The SQLite database file and the accounting spreadsheet (.xlsx) are binary and stay in the local workspace (your_files); their full data is carried here as creations.json, the works CSV, and the accounting CSV.
- The brain stays private until Alicia says launch. Nothing here is published publicly.
