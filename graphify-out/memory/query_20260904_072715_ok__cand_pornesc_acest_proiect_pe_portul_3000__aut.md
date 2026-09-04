---
type: "query"
date: "2026-09-04T07:27:15.216251+00:00"
question: "ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["findAvailablePort()", "portIsAvailable()", "scripts"]
---

# Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?

## Answer

În acest proiect, scriptul de pornire caută un port liber: există indAvailablePort(), care verifică porturile prin portIsAvailable() înainte să pornească serverul (scripts/start-server.mjs, liniile 55–68). Așadar, dacă 3000 este ocupat, acest proiect este configurat să aleagă alt port disponibil. Pentru al doilea proiect, comportamentul depinde de propriul lui framework/script: unele aleg automat 3001, 3002 etc., iar altele se opresc cu eroarea EADDRINUSE. Două servere nu pot asculta simultan pe același IP și același port. Ca să fii sigur, poți porni explicit al doilea proiect cu alt port, de exemplu 
pm run dev -- --port 3001 (dacă acel framework acceptă opțiunea). Expanded from original query via vocab: [port, server, next, scripts, run, host].

## Outcome

- Signal: useful

## Source Nodes

- findAvailablePort()
- portIsAvailable()
- scripts