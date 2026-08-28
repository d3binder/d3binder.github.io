# FireNate v5.1 — Change Log

Running list of what's changed in this branch since v5.0, kept up to date
as the work happens — not reconstructed later by diffing folders (that's
what cutting v5.0 required, and it took a dedicated audit to get right).
See CLAUDE.md's "Change log" section for the actual convention. Newest
entry at the top. When this version ships, these bullets become the
version picker's own change-log list for v5.1's card — write them in that
voice from the start (concrete, specific, second person) so no rewriting
is needed at cut time.

- New "Reach FI By Age" tool in Journey Progress — drag a slider between
  ages 40 and 70 and see what monthly investment it'd take to hit your
  goal by then, computed live from your saved profile (works for anyone
  who's filled in "Your info," no need to have visited a specific
  calculator first)
- "Your info" panel: clicking "Clear my info" now triggers the same fun
  full-screen trash-burst effect as Settings' "Reset this device" —
  particles, a pop-in trash icon, an "Info cleared" label — instead of
  clearing silently
- "Your info" panel: reorganized the icon rows — Share now floats alone
  on the left of the top row (next to the panel title), with Save,
  Snapshot, and Load grouped on the right; Export, Import, and "Clear my
  info" (the trash icon) moved down together into the bottom-right corner
  of the panel
- Profile Manager: moved "Delete snapshots older than 90 days" and the
  automatic-snapshot frequency control up next to the storage usage
  graphic near the top of the page, since both are storage-management
  actions rather than list-selection ones — also fixed a bug (pre-existing
  for the snapshot list's own selection bar too) where the `hidden`
  attribute silently failed to hide these elements
- Profile Manager: added a "Select all" button to Saved profiles' bulk
  selection tools — toggles to "Deselect all" once everything's checked
- Profile Manager: "Let's set up your profile first" no longer nags once
  you've entered or loaded any profile data — previously it stuck around
  until all four required fields (birthday, savings, goal, retirement age)
  were filled in, so a partial or freshly-imported profile still saw it
- Profile Manager: added a storage-used graphic near the top of the page —
  a colored bar (green/gold/red, same thresholds as the storage-size
  notification) showing how close you are to the ~5MB most browsers
  guarantee per site, updating live as you save, delete, or import
- New automatic local snapshot — every 7 days by default (if there's real
  data), quietly saves an in-browser safety copy of your profile,
  recoverable via "Load saved profile." Doesn't replace exporting a real
  backup file (lives in the same browser storage), and says so when it
  happens. Frequency is configurable from Profile Manager — Hourly, Daily,
  Every 3 days, Every 7 days, Every 14 days, or Every 28 days
- New storage-size warning — a plain informational heads-up at 50% of
  what browsers typically allow per site, escalating to warning at 70%
  and urgent at 90%, before a save can silently start failing
- New per-type notification muting in Settings — uncheck Urgent, Warning,
  Informational, or Achievement to hide that type from the bell entirely;
  the underlying checks still run, so un-muting later surfaces anything
  that fired while muted
- "Import profiles" (both the "Your info" panel's and Profile Manager's)
  now warns before loading a file that's older than what's already
  here — compares the file's own export time against your current data's
  last-changed time, not against when you happen to open the file
- Profile Manager: saved profiles can now be bulk-deleted — select
  individual snapshots to delete, or clear everything older than 90 days
  in one click — since the backup reminder and the new automatic
  snapshots both actively add to that list over time
- Profile Manager: "Full raw backup" section can now import as well as
  export — restores every key from a previously-exported raw dump straight
  back into local storage (merging, not replacing — keys the file doesn't
  mention are left alone), with its own status message and the same
  pre-restore safety backup "Import profiles" uses
- "Your info" panel: the new download/upload buttons now take a snapshot
  and show the camera-flash cue immediately on click, before the download
  or file dialog even opens — export's is a plain snapshot, import's is
  the real pre-overwrite safety net (fires even if the file dialog gets
  cancelled)
- Moved the "Your info" panel's download/upload icons up next to the share
  icon, out of the busier save/snapshot/load/clear row
- "Your info" panel: added Export and Import icon buttons doing the exact
  same thing as Profile Manager's own Export/Import profiles buttons (same
  file format, round-trips through either)
- New backup-reminder system notification — warns (escalating to urgent)
  once it's been a while since your last export, or you've added a fair
  amount of new data since then; tracked via a new shared
  `window.FNBackupTracker`, written to by every export button on the site
- Notifications: admin JSON entries can now be scheduled for a future date
  *and time* (not just a day) — stays completely out of the list and badge
  count until that moment arrives
- Notifications: added a "Clear all" button to the panel head
- Notifications: each item can now be individually hidden for good, not
  just marked read
- Notifications: added a "type" field — urgent (rust triangle), warning
  (gold circle-!), info (azure circle-i, the default), and achievement
  (jade award ribbon, for genuine milestones) — each with its own icon;
  Journey Progress milestones and the SS Bridge "funded" check now fire as
  achievements instead of plain info
- Homepage: removed "New!" ribbons that were actually years stale (kept
  only on Contribution Limits, the one genuinely new page this version);
  removed all "Updated" ribbons, which had drifted to flag some
  barely-touched pages while missing the ones with the biggest real
  changes; added a new ★ badge marking the handful of calculators most
  people are likely to return to regularly (FI Snapshot, Net Worth, Budget
  Calculator, Time to FI)
