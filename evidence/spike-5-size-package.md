# Spike 5 size/package evidence

Run `pnpm verify:size` to regenerate `size-report.json` and compare two clean candidate builds. The report separates foundations, standalone recipes, aggregate recipes, combined consumer CSS, excluded five-theme fixture CSS, archive manifest, and consumer transferred CSS.

The archive is local and private only. Its manifest is CSS, README, and package metadata; runtime JavaScript/assets/dependencies are asserted as zero. Consumer imports are aggregate (`@neobrui/private-spike-candidate`) and standalone Button subpath, with no network/public registry resolution.
