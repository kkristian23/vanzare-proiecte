import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('reports/showcase-audit');
const registry = JSON.parse(await readFile('showcase-projects/registry.json', 'utf8')).filter(p => p.id !== 24);
const read = async file => { try { return JSON.parse(await readFile(path.join(root, file), 'utf8')); } catch { return null; } };
const entries = [];
for (const project of registry) {
  const http = await read(`final/${project.slug}.http.json`);
  const browser = await read(`final/${project.slug}.browser.json`);
  const pages = await read(`pages/${project.slug}.browser.json`);
  const recheck = await read(`rechecks/${project.slug}.browser.json`);
  const interactionRecheck = await read(`interaction-rechecks/${project.slug}.json`);
  const resumeHistory=await read(`final/${project.slug}.resume-history.json`);
  const previousInterruptedAttempts=(resumeHistory?.pages||[]).filter(p=>p.error||p.inProgress||(p.controls||[]).some(c=>c.result==='interaction-error'));
  const pageKey = value => { try { return new URL(value).pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/,''); } catch { return value; } };
  const latestLoadReport = browser?.finished && browser.scope === 'all-pages-interactions' ? browser : recheck;
  const verified = issue => latestLoadReport?.finished && latestLoadReport.pages.some(p => pageKey(p.url)===pageKey(issue.page||issue.url) && (!issue.viewport || p.viewport.width===(issue.viewport.width||issue.viewport)) && !p.error);
  // Retain historical reports, but do not count old load failures after a newer successful visit.
  const pageIssues = (pages?.issues??[]).filter(i=>!verified(i));
  if(recheck && latestLoadReport !== browser) pageIssues.push(...recheck.issues);
  const baseline = await read(`${project.slug}.http.json`);
  const controls = browser?.pages.flatMap(p => p.controls ?? []) ?? [];
  const auditBlockedConsole = (browser?.issues ?? []).filter(issue=>/ERR_BLOCKED_BY_CLIENT/.test(issue.message??''));
  const auditAdvisoryConsole=(browser?.issues??[]).filter(issue=>issue.kind==='console'&&issue.level==='warning'&&/preloaded.*not used|preload.*credentials mode|Replay is disabled|THREE\.Clock.*deprecated|THREE\.WebGLProgram: Program Info Log:.*warning X4122/is.test(issue.message??''));
  const integrationIssues=(browser?.issues??[]).filter(issue=>
    (project.slug==='iqcalendar'&&/Google sign-in error.*auth\/network-request-failed/s.test(issue.message??''))||
    (project.slug==='neobarberclub'&&/Http failure response for \/api\/v1\/booking\/forms\//.test(issue.message??'')));
  const rawBrowserIssues = (browser?.issues ?? []).filter(issue=>!/ERR_BLOCKED_BY_CLIENT/.test(issue.message??'')&&!auditAdvisoryConsole.includes(issue)&&!integrationIssues.includes(issue));
  const exactPageKey=value=>{try{const u=new URL(value);u.hash='';u.pathname=u.pathname.replace(/\/index\.html$/,'/').replace(/\.html$/,'').replace(/\/$/,'');u.searchParams.sort();return u.pathname+u.search;}catch{return value;}};
  const newerRecheck=!!recheck?.finished && Date.parse(recheck.finished)>Date.parse(browser?.finished||browser?.started||0);
  const reverified=issue=>newerRecheck && recheck.pages.some(p=>!p.error&&exactPageKey(p.url)===exactPageKey(issue.page||issue.url)&&(!issue.viewport||p.viewport.width===(issue.viewport.width||issue.viewport))) && !recheck.issues.some(i=>exactPageKey(i.page||i.url)===exactPageKey(issue.page||issue.url));
  const verifiedLoadIssue=issue=>reverified(issue)||(issue.page==='chrome-error://chromewebdata/'&&newerRecheck&&http?.issues.length===0&&rawBrowserIssues.some(i=>i.kind==='http-browser')&&rawBrowserIssues.filter(i=>i.kind==='http-browser').every(reverified));
  const resolvedBrowserIssues=rawBrowserIssues.filter(verifiedLoadIssue);
  const browserIssues=rawBrowserIssues.filter(issue=>!verifiedLoadIssue(issue));
  const validInteractionRecheck=interactionRecheck?.finished && interactionRecheck.sourceFinished===browser?.finished;
  const resolvedInteractionChecks=validInteractionRecheck?interactionRecheck.checks.filter(c=>['click-reproduced-successfully','readonly-verified','accessible-label-not-a-click-target','not-visible-in-this-viewport','external-destination-manual'].includes(c.result)):[];
  const manualInteractionChecks=validInteractionRecheck?interactionRecheck.checks.filter(c=>c.result==='authentication-required-manual'):[];
  entries.push({ id: project.id, slug: project.slug, name: http?.name ?? project.slug, disabled: !!project.disabled,
    http, browser, browserIssues, previousInterruptedAttempts, resolvedBrowserIssues, resolvedInteractionChecks, manualInteractionChecks, integrationIssues, auditBlockedConsole, auditAdvisoryConsole, pages, recheck, interactionRecheck, pageIssues, initialHttpFindings: baseline?.issues.length ?? null,
    stats: { httpPages: http?.pages.length ?? 0, browserPages: (browser ?? pages)?.pages.filter(p => !p.aliasOf).length ?? 0,
      interactions: controls.length, historicalInteractionErrors: controls.filter(c => c.result === 'interaction-error').length,
      interactionErrors: Math.max(0,controls.filter(c => c.result === 'interaction-error').length-resolvedInteractionChecks.length-manualInteractionChecks.length),
      sharedNavigationChecks: controls.filter(c=>c.result==='shared-navigation-verified').length,
      outcomesToReview: controls.filter(c => c.result === 'clicked-review-outcome').length,
      findings: (http?.issues.length ?? 0) + browserIssues.length + pageIssues.length,
      manual: controls.filter(c => /manual|disabled/.test(c.result)).length+manualInteractionChecks.length+integrationIssues.length,
      limitedPages: browser?.pages.filter(p => p.limitReached).length ?? 0,
      fullInteractionRun: !project.disabled && !!browser?.finished && browser.pages.some(p=>!p.error&&!p.aliasOf) && !browser.pages.some(p=>p.error||p.inProgress||p.limitReached) && !browser.blocked?.some(item=>item.kind==='disabled-project') && browser.scope !== 'entry-interactions' && browser.scope !== 'all-pages-load-only' },
  });
}
const fixes = [
  'ArchiContract: meniul mobil se închide la orice link din header și la Escape; testat în toate cele trei limbi, inclusiv revenirea la tipărirea produsului.',
  "ArchiContract adaugă efectiv produsul din pagina lui în Project Board, păstrează produsele deja salvate la adăugarea din catalog și deschide imprimarea specificației.",
  "Fișele A4 EcoHabitat încadrează liniile pentru notițe pe mobil. Meniul YardCraft se închide la navigare și cu Escape, iar eticheta butonului reflectă starea deschis/închis.",
  "PopHaus afișează ordinea salvată în moodboard și o păstrează după reîncărcare. Neo Booking adaptează formularul de configurare la ecranul mobil.",
  "Nord & Oak nu mai învelește paginile într-un provider client neutilizat; încărcările repetate și navigarea înapoi sunt acoperite de regresii.",
  "RentTech limitează dimensiunile imaginilor pentru a păstra accesul la toate rezervările. Titlurile Forma Living se rup corect pe mobil; GazonPro initializează graficul cu dimensiuni valide.",
  'Toate cele 5 proiecte noi sunt reconstruite pentru adresele din catalog. Sincronizarea refuză un export Next compilat cu alt basePath și păstrează copia publică funcțională.',
  'Nord & Oak închide meniul mobil la navigare și cu Escape; revenirea între limbi reîncarcă documentul potrivit în exportul static.',
  'Audio Rental limitează imaginile la propriul cadru, astfel încât toate linkurile Detalii rămân accesibile. RentTech păstrează favoritele deasupra imaginilor și accesul la administrare în ecranul mobil.',
  'Micora limitează depășirea decorului animat și respectă preferința de mișcare redusă. Titlurile lungi Atelier Noire se încadrează pe mobil; graficul AquaVerde pornește cu dimensiuni valide.',
  'Sincronizarea păstrează directoarele exportate reports și fișierele lor JavaScript.',
  'Payloadurile Next.js exportate cu directoare Windows sunt copiate și sub numele cu puncte cerute de browser; payloadul rădăcinii Next 14/15 este publicat ca /proiect.txt.',
  'Căile resurselor din JavaScript și manifestele Vite sunt prefixate cu proiectul, inclusiv imaginile dinamice.',
  'PopHaus, Forma Living, ArchiContract, Atelier Noire și Market9000 exportă rutele interne identificate în surse.',
  'AutoFlow Partner și Micora folosesc basePath la compilarea pentru catalog.',
  'NeoBarber exportă paginile publice, corectează navigarea localizată și nu mai cere API-ul de conținut în demonstrația statică.',
  'IQCalendar nu mai declară imaginea socială inexistentă; detectarea Firebase verifică și conexiunea null, iar profilurile fără id nu mai produc startsWith pe undefined.',
  'StayNest evită prefixarea dublă a imaginilor; build-ul showcase folosește Webpack când politica Windows blochează modulul nativ Turbopack.',
  'RentTech folosește catalogul inclus în demonstrația statică și limba inițială fără cookies pe server.'
  ,'Nord & Oak curăță animația GSAP înaintea demontării DOM și păstrează schimbarea limbii în proiect.'
  ,'IQCalendar montează sincron interfața înaintea inițializării legacy, ignoră profilurile fără identificator și adaptează rutele curate pentru export.'
  ,'Lead Pilot, Garage Box, Élan, Studio Forma și RentTech au corecții de lățime; titlurile lungi și pașii Atelier Noire au ajustări pentru mobil.'
  ,'Audio Rental deschide secțiunea existentă „Cum funcționează” în locul rutei inexistente.'
  ,'Audio Rental exportă Contact, Confidențialitate și Termeni în RO/EN/RU. Căutarea și filtrarea pe categorii funcționează; formularul demonstrativ de perioadă deschide catalogul fără un API absent.'
  ,'Rescrierea adreselor React native este limitată la Studio Velora; Next Link din Audio Rental nu mai primește de două ori prefixul proiectului.'
  ,'PopHaus permite clickul pe butonul principal prin stratul decorativ al animației. Meniurile închise Noma și Drivolt sunt ascunse și pentru navigarea cu tastatura.'
  ,'Neo Booking este activat cu pagini exportate și rezervări explicit simulate. Configurarea locală deschide propriul preview în browser, fără publicare sau programări reale.'
  ,'Nord & Oak păstrează containerul animației în structura React, printr-un pinSpacer explicit, și deschide ruta canonică la intrarea în demonstrație.'
  ,'Drivolt deschide cereri prin e-mail cu produsele din coș; căutarea și coșul se închid cu Escape.'
  ,'Flow CRM creează înregistrări demonstrative, filtrează și selectează contacte, exportă CSV și salvează preferințele local. Acțiunile și meniul sunt accesibile pe mobil.'
  ,'Forma Living reconstruiește configurația din linkul partajat și pregătește cererea de ofertă cu modulele, materialul și prețul.'
  ,'Academia păstrează notițele lecției, oferă acces mobil la cont și lecții și deschide informațiile în ferestre închizibile. Înregistrarea video nu este inclusă.'
  ,'Tableo permite alegerea ridicării/livrării, deschide hărțile și informațiile din footer, validează data și salvează detaliile rezervării demonstrative.'
  ,'PopHaus actualizează previzualizarea ilustrată la alegerea culorii. Calculatorul Studio Velora se încadrează în ecranul mobil.'
  ,'Fixora deschide zona de atenționări de la butonul dedicat și compilează corect tipurile traducerilor.'
];
const summary = { generated: new Date().toISOString(), projects: entries.length, fixes, entries };
summary.coverage = {
  allDiscoveredPagesInteractionRuns: entries.filter(p=>p.stats.fullInteractionRun).length,
  entryOnlyProjects: entries.filter(p=>p.browser?.scope==='entry-interactions').map(p=>p.slug),
  unavailable: entries.filter(p=>p.disabled).map(p=>p.slug)
};
summary.catalog = await read('catalog.json');
summary.validation = await read('validation.json');
summary.archiProductActions = await read('archi-product-actions.json');
await mkdir(root, { recursive: true });
await writeFile(path.join(root, 'summary.json'), JSON.stringify(summary, null, 2));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const embedJson=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const details = (title, value) => `<details><summary>${escape(title)}</summary><pre>${escape(JSON.stringify(value, null, 2))}</pre></details>`;
const rows = details('Acoperire exactă — inclusiv proiectele cu interacțiuni verificate numai la intrare',summary.coverage)
  + details('Deschiderea fiecărui card din catalog și închiderea modalului',summary.catalog)
  + details('Build și teste de regresie',summary.validation)
  + details('ArchiContract — toate cele 30 de produse, trei limbi, desktop și mobil',summary.archiProductActions)
  + entries.map(p => `<section class="project" id="${escape(p.slug)}" data-name="${escape(`${p.name} ${p.slug}`.toLowerCase())}"><h2>${p.id}. ${escape(p.name)} <small>${escape(p.slug)}</small></h2>
<p><a target="_blank" href="http://127.0.0.1:4010/${p.slug}/">Deschide proiectul</a> · <a href="final/${p.slug}.http.json">HTTP JSON</a> · <a href="final/${p.slug}.browser.json">Browser JSON</a></p>
<p>${p.disabled ? '<strong>Indisponibil în registru — nu a putut fi verificat.</strong>' : `${p.stats.httpPages} URL-uri HTTP; ${p.stats.browserPages} pagini × dispozitiv în browser; ${p.stats.interactions} controale inventariate.`}</p>
<p>Constatări: ${p.stats.findings}; erori de interacțiune: ${p.stats.interactionErrors}; clickuri cu rezultat de confirmat: ${p.stats.outcomesToReview}; controale manuale/inactive: ${p.stats.manual}.</p>
<p>HTTP inițial: ${p.initialHttpFindings ?? 'fără bază'} → actual: ${p.http?.issues.length ?? 'nerulat'}. Interacțiuni: ${p.stats.fullInteractionRun ? 'parcurgere terminată pentru rutele descoperite' : 'parcurgere parțială / în curs'}. Pagini care au atins limita configurat? de controale: ${p.stats.limitedPages}.</p>
<p>Linkuri comune verificate prin aceeași structură și destinație, cu un click anterior în același proiect/dispozitiv: ${p.stats.sharedNavigationChecks}. Referințele exacte sunt în <code>verifiedBy</code> din Browser JSON. Folosește <code>--strict-clicks</code> pentru repetarea fizică a fiecărui link comun pe fiecare pagină.</p>
${details('Probleme HTTP', p.http?.issues ?? 'Nerulat')}${details('Erori browser și operații blocate', {issues:p.browserIssues, previousInterruptedAttempts:p.previousInterruptedAttempts, resolvedAfterRecheck:p.resolvedBrowserIssues, historicalInteractionErrors:p.stats.historicalInteractionErrors, resolvedInteractionChecks:p.resolvedInteractionChecks, blocked:p.browser?.blocked, auditBlockedConsole:p.auditBlockedConsole, advisoryConsoleWarnings:p.auditAdvisoryConsole, authenticationRequired:p.manualInteractionChecks,externalIntegrationChecks:p.integrationIssues, downloads:p.browser?.downloads, pageLoadIssues:p.pageIssues})}
${details('Reverificări punctuale după reparații (încărcare și afișare)',p.recheck??'Nu există lot separat')}
${details('Reverificarea erorilor de click din stare curată (include data raportului inițial)',p.interactionRecheck??'Nu există lot separat')}
${details('Toate paginile și stările HTTP', p.http?.pages)}
<script type="application/json" id="controls-${escape(p.slug)}">${embedJson((p.browser?.pages??[]).map(page=>page.controls??[]))}</script>
<details><summary>Fiecare pagină și fiecare control inventariat</summary>${(p.browser?.pages ?? []).map((page,index) => `<details class="page-check" data-project="${escape(p.slug)}" data-page="${index}"><summary>${escape(page.url)} — ${page.viewport?.width}px — ${page.controls?.length ?? 0} controale</summary><p>${escape(page.error || page.aliasOf || '')}</p><a href="${escape(page.url)}" target="_blank">Deschide pagina</a><div class="controls-output"></div></details>`).join('')}</details>
${details('Încărcări suplimentare desktop/mobil', p.pages?.pages ?? 'Incluse în raportul de interacțiuni sau nerulate')}</section>`).join('') + `<script>
const controlCache=new Map();
document.addEventListener('toggle',event=>{
  const pane=event.target;if(!(pane instanceof HTMLDetailsElement)||!pane.classList.contains('page-check')||!pane.open||pane.dataset.loaded)return;
  const project=pane.dataset.project;
  if(!controlCache.has(project))controlCache.set(project,JSON.parse(document.getElementById('controls-'+project).textContent));
  const controls=controlCache.get(project)[Number(pane.dataset.page)]||[];
  const table=document.createElement('table');const head=document.createElement('tr');
  for(const label of ['Control','Destinație','Rezultat observat','Eroare']){const cell=document.createElement('th');cell.textContent=label;head.append(cell);}table.append(head);
  for(const control of controls){const row=document.createElement('tr');for(const value of [control.tag+' '+control.name,control.href??control.afterUrl,control.result,control.error]){const cell=document.createElement('td');cell.textContent=value??'';row.append(cell);}table.append(row);}
  pane.querySelector('.controls-output').append(table);pane.dataset.loaded='true';
},true);
</script>`;
await writeFile(path.join(root, 'index.html'), `<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Audit catalog</title><style>body{font:15px/1.6 system-ui;background:#f4f3f8;color:#201d30;max-width:1200px;margin:auto;padding:30px}h1{font-size:36px}h2 small{font-size:13px;color:#706c82}section{background:white;border:1px solid #dedbe9;border-radius:14px;padding:24px;margin:20px 0}input{padding:14px;width:90%;font:inherit;border:1px solid #aaa;border-radius:8px}summary{cursor:pointer;padding:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;background:#f5f5f8;padding:15px;max-height:500px;overflow:auto}table{width:100%;border-collapse:collapse;font-size:12px}td,th{border:1px solid #ddd;padding:8px;text-align:left;overflow-wrap:anywhere}a{color:#6043b5}details{margin:8px 0}td:last-child{max-width:330px}</style><h1>Audit catalog — ${entries.length} proiecte</h1><p>Generat ${escape(summary.generated)}. Rezultatele descriu ce s-a observat, nu garantează toate combinațiile de stări.</p><p><strong>clicked-review-outcome</strong> înseamnă click executat, dar efectul trebuie confirmat. <strong>interaction-error</strong> poate indica un control defect sau un obstacol al automatizării. Operațiile de scriere în rețea, plățile și acțiunile distructive nu sunt executate. Paginile protejate necesită conturi de test; un proiect dezactivat nu este trecut ca valid.</p><p>Pornește <code>npm run audit:serve</code> pentru linkurile către proiecte. JSON-urile și acest raport se deschid direct de pe disc.</p>${details('Reparații implementate — consultă rezultatele de reverificare pentru starea fiecărui proiect',fixes)}<input id="search" placeholder="Caută proiectul…" aria-label="Caută proiect">${rows}<script>document.querySelector('#search').addEventListener('input',e=>document.querySelectorAll('.project').forEach(p=>p.hidden=!p.dataset.name.includes(e.target.value.toLowerCase())));</script></html>`);
await writeFile(path.join(root, 'README.md'), `# Audit catalog\n\nDeschide [raportul interactiv](index.html). Pentru fiecare proiect sunt listate paginile, controalele, rezultatele, erorile și blocajele.\n\nGenerat: ${summary.generated}. Nu confunda un click executat cu validarea rezultatului funcțional.\n\n| Proiect | URL-uri HTTP | Încărcări browser | Controale | Constatări | Erori interacțiune |\n|---|---:|---:|---:|---:|---:|\n${entries.map(p=>`| ${p.slug} | ${p.stats.httpPages} | ${p.stats.browserPages} | ${p.stats.interactions} | ${p.stats.findings} | ${p.stats.interactionErrors} |`).join('\n')}\n\n## Reparații\n\n${fixes.map(x=>'- '+x).join('\n')}\n\n## Reluare\n\nVezi [instrucțiunile](../../docs/showcase-audit.md).\n`);
console.log(`Report: ${path.join(root, 'index.html')}`);
