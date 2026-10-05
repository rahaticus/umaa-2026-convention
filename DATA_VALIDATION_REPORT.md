# UMAA program validation

Final programme reconciled October 5, 2026.

- 53 unique daily occurrence IDs and unique session routes.
- All dates fall on October 9, 10, or 11, 2026.
- All exact time intervals are valid in America/Toronto.
- Nine children’s occurrences, with revised 0 to 5 and 6 to 11 age groups.
- Seven daily ladies-only occurrences across five programmes.
- Every scheduled room resolves to canonical room metadata.
- New Rob Turfe biography and appearances resolve.
- Existing IDs preserved for continuing sessions; removed events are filtered out of saved itineraries.
- Updated programme tests cover moved, removed, added, timed, room, registration, and eligibility changes.

Verification: all 21 tests pass; production build and TypeScript checks pass. HTTP checks pass for all 53 session detail routes, five changed calendar exports, Rob Turfe biography and appearances, and the updates page. Browser QA is unavailable because Chromium download could not complete.
