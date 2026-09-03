---
type: "query"
date: "2026-09-03T07:42:33.445094+00:00"
question: "analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are."
contributor: "graphify"
outcome: "useful"
source_nodes: ["locales", "projects", "projectSlugs", "i18n.ts"]
---

# Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are.

## Answer

Expanded via graph vocab: projects showcase locale locales romanian catalog slugs. Static source and synchronized-output audit found 4 definite failures among 24 active projects: imobilia-one has Romanian-only source and a nonfunctional RO/EN/RU label; forge dashboard is English-only; studio-velora is Romanian-only and labels RO/EN/FR without localization; audio-rental-md exports identical Romanian HTML for ro/ru/en. The other 20 have all three locale implementations; IQ Calendar translation checker reports no missing keys.

## Outcome

- Signal: useful

## Source Nodes

- locales
- projects
- projectSlugs
- i18n.ts