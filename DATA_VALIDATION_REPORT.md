# UMAA 2026 data validation report

Source reviewed: `UMAA_2026_Final_Program.pdf` (36 pages), `Speaker_Bios.xlsx`, and supplied JSON reconciliation data.

## Current source inventory

- Sessions: 50 (from the supplied program seed)
- Biography source rows: 62
- Program participant pages: generated from every named individual in session roles; organizations are excluded from person pages.
- Stable session IDs and generated slugs: no duplicates found by automated check.
- Each supplied session has source page references. Exact-time omissions remain source-labelled and are never assigned a clock time.

## Biography identity policy

Confirmed mappings in `speaker_aliases_review.json` receive the supplied workbook biography. Exact program/workbook names receive their workbook biography. Probable and unmatched mappings are deliberately not joined and show exactly `Bio not currently available`.

Human review remains required for the probable matches listed in `data/speaker_aliases_review.json`, including Rizwan Khalfan, Maulana Syed Muhammad Al Najafi, Sr. Naba Bahar, Sayed Mehboob, Mullah Nizar Qatari, Saarah Panju, Dr. Syed Mehdi Abbas Husaini, and Syed Rizvi. The unmatched names listed in that source remain without biographies.

## Launch checks

Run `pnpm test` to recheck IDs, slugs, dates, intervals, and source pages after any data update. Review the rendered program against the PDF before publishing content edits.
