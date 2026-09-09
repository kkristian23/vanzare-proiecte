# Proiecte de grădină și peisagistică

Cele cinci proiecte sunt integrate cu paginile și identitatea vizuală din sursele lor independente.

| ID | Proiect | Sursă | Rută în catalog | Stil |
| --- | --- | --- | --- | --- |
| 71 | AquaVerde | `D:/AquaVerde` | `/aquaverde/` | Verde-mentă, alb, prezentare tehnică a irigării |
| 70 | TerraForma | `D:/TerraForma` | `/terraforma/` | Crem, măsliniu, teracotă, portofoliu editorial |
| 69 | GazonPro | `D:/GazonPro` | `/gazonpro/` | Verde intens, Manrope, fotografii de gazon |
| 68 | EcoHabitat | `D:/EcoHabitat` | `/ecohabitat/` | Verde-pădure, salvie, nisip, fotografie naturală |
| 67 | YardCraft | `D:/YardCraft` | `/yardcraft/` | Lime și suprafețe deschise, configurator de curte |

`app/garden-projects.ts` conține descrierile, stilurile și funcțiile în română, engleză și rusă. Prețurile catalogului se editează în `app/project-prices.json`; acestea reprezintă prețurile proiectelor web, separate de estimările demonstrative ale serviciilor de grădinărit din paginile exportate.

Categoria are cheia `Gardens & Landscaping` și filtrul URL `gardens-landscaping`.

## Actualizare

```sh
npm run showcase:sync -- aquaverde terraforma gazonpro ecohabitat yardcraft --build --strict
npm test
```

Configurațiile Next.js din surse acceptă `SHOWCASE_BASE_PATH`, iar componentele cu linkuri HTML native din EcoHabitat și YardCraft acceptă `NEXT_PUBLIC_SHOWCASE_BASE_PATH`. Scriptul de sincronizare setează ambele variabile; build-urile independente folosesc implicit rădăcina site-ului.

Exporturile publicabile sunt păstrate în `public/<slug>/`. Catalogul folosește imagini statice responsive prin Netlify Image CDN; exportul interactiv este încărcat numai după apăsarea acțiunii „Deschide proiectul”. Fișierul `preview.html` este păstrat ca intrare de compatibilitate foarte mică și fără resurse externe.
