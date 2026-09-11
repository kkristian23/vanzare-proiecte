import { cmsContent } from "./lib/cms-store";
import { gardenDetails } from "./garden-projects";

export const newProjectDetails: Record<number,{summary:string;sections:{title:string;items:string[]}[]}> = cmsContent("new-project-details-newProjectDetails", {
  ...gardenDetails("ro"),
  "73": {
    summary: "ServiceFlow Pro centralizează solicitările și lucrările unei firme de renovări și mentenanță.",
    sections: [
      { title: "Pentru clienți", items: ["Catalog de servicii și calculator de estimare", "Cereri de ofertă și programări", "Cont client cu urmărirea lucrărilor"] },
      { title: "Pentru companie", items: ["Administrarea solicitărilor și statusurilor", "Oferte PDF și comunicare cu clienții", "Interfață RO / RU / EN și integrare Firebase configurabilă"] }
    ]
  },
  "74": {
    summary: "Vatra Market aduce produsele artizanilor și administrarea comenzilor într-un marketplace dedicat producătorilor locali.",
    sections: [
      { title: "Cumpărături", items: ["Catalog cu căutare, filtre și variante de produs", "Favorite, coș și flux de comandă", "Pagini de producători și recenzii"] },
      { title: "Administrare", items: ["Panou producător pentru produse și stocuri", "Gestionarea comenzilor și notificărilor", "RO / RU / EN; Firebase Auth, Firestore și Storage configurabile"] }
    ]
  },
  "75": {
    summary: "Codru Escapes reunește cazările și experiențele din Moldova, cu rezervări și administrare pentru proprietari.",
    sections: [
      { title: "Pentru turiști", items: ["Căutare cazări după perioadă, oaspeți și facilități", "Hartă, galerii și pagini de proprietăți", "Calculul sejurului și rezervări"] },
      { title: "Pentru proprietari", items: ["Calendar și gestionarea rezervărilor", "Mesagerie și statistici", "Interfață RO / RU / EN și integrare Firebase configurabilă"] }
    ]
  },
  "76": {
    summary: "ClientAxis CRM centralizează clienții, vânzările și activitățile echipei într-un singur spațiu de lucru.",
    sections: [
      { title: "Vânzări și relații cu clienții", items: ["Contacte, companii și oportunități", "Pipeline Kanban și sarcini", "Oferte PDF și import/export CSV"] },
      { title: "Echipă și administrare", items: ["Organizații, roluri și permisiuni", "Rapoarte și notificări", "Interfață RO / RU / EN și integrare Firebase configurabilă"] }
    ]
  },
  "35": {
    "summary": "Comunitate de bloc, avizier și participare.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Comunitate de bloc, avizier și participare",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Sesizări cu stări",
          "un vot per propunere în demo",
          "repartizarea cheltuielilor pe apartament și suprafață"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "36": {
    "summary": "Cont de consumator pentru facturi și contor.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Cont de consumator pentru facturi și contor",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Achitare simulată cu sold actualizat",
          "indici validați",
          "istoric de consum și facturi descărcabile"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "37": {
    "summary": "Bistro editorial și meniu sezonier.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Bistro editorial și meniu sezonier",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtre vegetariene și alergeni declarați",
          "selecție de preparate exportabilă",
          "vizite planificate"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "38": {
    "summary": "Meniu de livrare cu coș lateral și urmărire.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Meniu de livrare cu coș lateral și urmărire",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Produse și observații",
          "taxe pe zonă sau ridicare",
          "comenzi și simularea etapelor de pregătire"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "39": {
    "summary": "Restaurante și plan interactiv de sală.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Restaurante și plan interactiv de sală",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Selecție dată, oră și persoane",
          "masă conform capacității",
          "rezervări și eliberarea mesei"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "40": {
    "summary": "Atlas interactiv de cartiere și indicatori.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Atlas interactiv de cartiere și indicatori",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Schemă interactivă",
          "straturi de preț, transport și verdeață",
          "estimare orientativă și export"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "41": {
    "summary": "Locuințe direct de la proprietar și agendă.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Locuințe direct de la proprietar și agendă",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Anunțuri proprii",
          "programări de vizionare fără suprapuneri",
          "listă personală de verificare"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "42": {
    "summary": "Catalog de proprietăți și dosare comparative.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Catalog de proprietăți și dosare comparative",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtre combinate",
          "fișe de proprietate",
          "comparație de suprafețe, camere și preț pe m²"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "43": {
    "summary": "Trasee de carieră cu exerciții și mentorat.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Trasee de carieră cu exerciții și mentorat",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Plan în funcție de timpul disponibil",
          "portofoliu cu etape succesive",
          "sesiuni fără suprapunere"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "44": {
    "summary": "Portal instituțional cu program și evaluare.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Portal instituțional cu program și evaluare",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Module de lectură",
          "evaluare deblocată prin progres",
          "confirmare demonstrativă descărcabilă"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "45": {
    "summary": "Studio de cursuri practice și lecții de probă.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Studio de cursuri practice și lecții de probă",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Catalog pe subiecte",
          "alegerea grupei",
          "lecții, evaluare și progres salvat"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "46": {
    "summary": "Piață de artizanat cu povești și personalizare.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Piață de artizanat cu povești și personalizare",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Glazură și inscripție",
          "cantități și ambalaj pentru obiecte",
          "comenzi cu opțiunile păstrate"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "47": {
    "summary": "Comparator de oferte și istoric de preț.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Comparator de oferte și istoric de preț",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Sortare cu livrare și disponibilitate",
          "istoric demonstrativ",
          "praguri de preț persistente"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "48": {
    "summary": "Anunțuri locale pe categorii și localități.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Anunțuri locale pe categorii și localități",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Publicare și retragere de anunțuri demo",
          "favorite",
          "afișarea datelor de contact"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "49": {
    "summary": "Planificator de escapade și itinerar.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Planificator de escapade și itinerar",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Cazări după regiune și buget",
          "experiențe locale",
          "calcul și export de plan personal"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "50": {
    "summary": "Colecție de apartamente cu galerie asimetrică.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Colecție de apartamente cu galerie asimetrică",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtrare cartiere",
          "colecție personală",
          "solicitări de cazare cu istoric și anulare"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "51": {
    "summary": "Hotel cu experiențe de cazare, spa și restaurant.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Hotel cu experiențe de cazare, spa și restaurant",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Schimbarea experienței",
          "configurare cameră și servicii suplimentare",
          "pachete de sejur persistente"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "52": {
    "summary": "Prezentare arhitecturală de apartamente urbane.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Prezentare arhitecturală de apartamente urbane",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtrare după capacitate",
          "calculul nopților și totalului",
          "istoric de sejururi și anulare"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "53": {
    "summary": "Comparație de kituri aftermarket și service.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Comparație de kituri aftermarket și service",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Garaj și buget",
          "comparație de specificații",
          "estimare cu montaj și programări consultabile"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "54": {
    "summary": "Aprovizionare angro prin tabel și deviz.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Aprovizionare angro prin tabel și deviz",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Categorii și depozite",
          "cantități limitate de stoc",
          "reduceri de volum și oferte descărcabile"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "55": {
    "summary": "Banc de lucru pentru atelier și inventar OEM.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Banc de lucru pentru atelier și inventar OEM",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Căutare OEM",
          "kit de revizie",
          "alocare de stoc în fișe de lucru și export"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "56": {
    "summary": "Magazin de piese cu selecție dependentă de vehicul.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Magazin de piese cu selecție dependentă de vehicul",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Marcă/model/motor",
          "filtrare compatibilitate demonstrativă",
          "coș, cantități și istoric de comenzi"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "57": {
    "summary": "Inbox comercial cu conversații și fișe de contact.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Inbox comercial cu conversații și fișe de contact",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Răspunsuri demo și note interne",
          "schițe separate pe conversație",
          "follow-up și rezolvare"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "58": {
    "summary": "Bază de contacte și segmentare pentru marketing.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Bază de contacte și segmentare pentru marketing",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Contacte editabile",
          "gestionarea abonării",
          "campanii locale pentru destinatarii eligibili"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "59": {
    "summary": "Panou de oportunități pe etape comerciale.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Panou de oportunități pe etape comerciale",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Creare și editare oportunități",
          "mutare între etape prin tragere sau selector",
          "activități și totaluri"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "60": {
    "summary": "Selecție ghidată de consultații în trei pași.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Selecție ghidată de consultații în trei pași",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Potrivire după specialitate, limbă și tip de consultație",
          "rezervare",
          "agendă de vizite"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "61": {
    "summary": "Director de medici cu disponibilitate pe zile.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Director de medici cu disponibilitate pe zile",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtre specialitate/cartier",
          "rezervarea unui interval",
          "eliberarea intervalului prin anulare"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "62": {
    "summary": "Catalog de analize cu listă de recoltare.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Catalog de analize cu listă de recoltare",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Căutare după analiză sau cod",
          "coș de investigații",
          "alegerea centrului și istoricul cererilor"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "63": {
    "summary": "Prezentare de clinică, specialități și echipă.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Prezentare de clinică, specialități și echipă",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Selecție specialist",
          "programări cu verificarea intervalului",
          "istoric și anulare"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "64": {
    "summary": "Consolă pentru organizatori și registru de participanți.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Consolă pentru organizatori și registru de participanți",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Emitere bilete demo",
          "check-in și anulare",
          "export CSV și capacitate de eveniment"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "65": {
    "summary": "Ghid cultural editorial cu agendă cronologică.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Ghid cultural editorial cu agendă cronologică",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtre după zi și interes",
          "agendă personală",
          "exportul programului de weekend"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  },
  "66": {
    "summary": "Afișe de concerte și catalog de bilete.",
    "sections": [
      {
        "title": "Design și structură",
        "items": [
          "Afișe de concerte și catalog de bilete",
          "Interfață proprie, adaptată pe desktop și mobil"
        ]
      },
      {
        "title": "Funcționalități demonstrative",
        "items": [
          "Filtrare evenimente",
          "categorii de bilete și cantități",
          "comenzi persistente și confirmări descărcabile"
        ]
      },
      {
        "title": "Ce primește cumpărătorul",
        "items": [
          "Cod sursă independent, editabil",
          "Export static integrat în catalog",
          "Fluxuri locale testate; conectarea serviciilor reale se face separat"
        ]
      }
    ]
  }
});
