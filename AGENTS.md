# AGENTS.md — dfg-viewer (UB Mannheim)

## Commit-Messages

- Verwendung `[FEATURE]` statt `feat:` (ebenso `[FIX]` statt `fix:`,
  `[STYLE]`, `[CHORE]` etc. nach Bedarf statt der square-bracket-losen
  Conventional-Commit-Prefixe). Beispielsweise:
  - `[FEATURE] cover grid of volumes on multi-volume work page`
  - `[FIX] remove duplicated css code`
- Gleiches gilt bei Rebases: wenn Commits neu zusammengefasst,
  squashed oder ihre Messages angepasst werden, den `type:`-Stil durch
  `[TYPE]` ersetzen.

## Build

- LESS → CSS: `cd Build && npx grunt less` (kompiliert
  `Resources/Public/Css/allStyles.css` und `webStyles.css` aus
  `Resources/Private/Less/`).
- Nach LESS-Änderungen immer neu kompilieren; die generierten CSS-Dateien
  werden commited. Bei Rebase-Konflikten in den generierten CSS-Dateien:
  die LESS-Quelle mergen lassen und neu kompilieren, nicht die
  minifizierte CSS manuell patchen.
