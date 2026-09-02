# Proiecte incluse în catalog

`registry.json` leagă URL-urile publice de proiectele independente din `D:\`.
Proiectele-sursă nu sunt modificate.

Sincronizare completă:

```powershell
npm run showcase:sync
```

Reconstruirea tuturor exporturilor și sincronizarea lor:

```powershell
npm run showcase:sync -- --build
```

`--build` reconstruiește întotdeauna proiectele selectate, chiar dacă există deja
un director `out` sau `dist`.

Sincronizarea unui singur proiect:

```powershell
npm run showcase:sync -- neobarberclub
```

Fiecare proiect trebuie să producă un export static cu `index.html` într-unul dintre
directoarele declarate în `outputs`. Un build Next.js care produce numai `.next`
necesită mai întâi configurarea `output: "export"`; `.next` nu poate fi copiat direct
într-un subdirector static Netlify.

Conținutul sincronizat ajunge în `public/<slug>/` și este inclus automat de buildul
principal. Astfel, un singur deploy publică atât catalogul, cât și toate exporturile.

## Actualizare automată la pornirea serverului și la fiecare oră

Instalarea sarcinii Windows (o singură dată):

```powershell
npm run showcase:schedule
```

Sarcina reconstruiește toate proiectele, le sincronizează în `public/`, apoi
reconstruiește catalogul. Rulează numai când utilizatorul este autentificat, iar
rulările suprapuse sunt ignorate. Jurnalul se află în `logs/showcase-refresh.log`.

Comenzile `npm run dev` și `npm start` pornesc prioritar serverul catalogului, apoi
reconstruiesc și sincronizează automat proiectele secundare în fundal. În plus,
sarcina Windows repetă procesul complet o dată pe oră cât timp calculatorul este
pornit și utilizatorul autentificat.
