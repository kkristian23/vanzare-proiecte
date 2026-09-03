---
type: "query"
date: "2026-09-03T08:00:26.405269+00:00"
question: "mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect"
contributor: "graphify"
outcome: "useful"
source_nodes: ["projects", "locales", "projectSlugs", "showcase-projects/README.md"]
---

# Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect

## Answer

Browser and source audit of 24 active showcase projects: 14 pass; 10 have issues. Failures: imobilia-one missing functional locale UI in synchronized export; forge dynamic project/job strings remain Romanian; studio-velora RU switch leaves much Romanian content; audio-rental-md RU/EN leave hardcoded Romanian strings; pophaus, archicontract, atelier-noire open locale directory listings; nord-and-oak locale links return to Romanian; neobarberclub RU navigation resolves under wrong prefix and displays English; forma-living translates but html lang remains ro.

## Outcome

- Signal: useful

## Source Nodes

- projects
- locales
- projectSlugs
- showcase-projects/README.md