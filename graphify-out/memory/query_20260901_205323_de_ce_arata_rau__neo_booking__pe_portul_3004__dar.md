---
type: "query"
date: "2026-09-01T20:53:23.664623+00:00"
question: "De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["sync-showcase.mjs", "nextConfig", "prefixDocument", "publicRoot"]
---

# Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?

## Answer

Expanded via graph vocab: route, path, prefix, public, showcase, sync, next, project. Cauza este prefixarea dubla: buildProject seteaza SHOWCASE_BASE_PATH=/neo-booking, iar proiectul neo-booking genereaza deja URL-uri cu basePath /neo-booking; apoi prefixDocument le prefixeaza din nou. HTML-ul servit cere /neo-booking/neo-booking/_next/... (404), in timp ce fisierul exista la /neo-booking/_next/... (200), deci CSS si JS nu se incarca.

## Outcome

- Signal: useful

## Source Nodes

- sync-showcase.mjs
- nextConfig
- prefixDocument
- publicRoot