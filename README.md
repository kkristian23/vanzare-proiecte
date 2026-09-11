# MONO/DEV — catalog de proiecte

Administrarea conținutului, imaginilor și prețurilor afișate în catalogul MONO/DEV este disponibilă la `/admin`, cu Firebase Authentication și acces acordat explicit administratorilor. Panoul nu administrează cele 63 de site-uri demonstrative din `public/<slug>/`. Vezi [configurarea Firebase, autorizarea primului administrator și testele](docs/admin-firebase.md).

AquaVerde, TerraForma, GazonPro, EcoHabitat și YardCraft sunt disponibile în categoria **Grădini și peisagistică**. Vezi [sursele, stilurile și fluxul de actualizare](docs/garden-projects.md).

Cele 32 de proiecte noi au implementări separate pentru design, structură și fluxuri. Vezi [lista proiectelor, referințele și verificările](docs/32-project-redesign.md). Sursele lor sunt în directoarele numerotate din `D:/proiecte-front-end`, iar exporturile integrate sunt în `public/<slug>/`.

Previzualizările celor 32 de proiecte redau paginile curente. Descrierile și fișele proiectelor sunt disponibile în română, rusă și engleză. Funcțiile proiectelor sunt demonstrații cu date salvate local; serviciile reale se conectează separat.

## Catalog runtime

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the catalog and verify rendered content, registered routes, export prefixes and current project previews
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
