# AGENTS.md

Guide for AI agents working on this storefront. Read `DESIGN.md` before
changing anything visual, and follow `CHECKLIST.md` when setting up a new store.

## What this is

A headless Tiendu storefront built with SvelteKit 3, Svelte 5 (runes) and
Tailwind CSS 4. Pages render on the server from the public **Store API**
(GraphQL). The browser only handles the shopper session (cart badge, add to
cart, account and favorites) and Tiendu's checkout, search, account and wishlist
overlays through `static/tiendu-sdk.js`.

Tiendu docs: start at `/llms.txt` on the docs site, then **Headless** and the
**Store API** reference. Store data changes (products, pages, menus) go through
the Merchant API or the Tiendu MCP server, not this code.

## Your first task on a new store

Adapt the copy in `src/lib/content.ts` to the real store. It ships with copy
for a fictional home-and-objects shop; nothing in it is store data. Rewrite
every string in the store's voice, in the store's language (rioplatense
Spanish by default: "vos", "tenés", "elegí"), keeping lengths close to the
originals so the layout holds. Then follow `CHECKLIST.md`.

## Where things live

| Path | What |
| --- | --- |
| `src/lib/content.ts` | All editorial copy and links that are not store data |
| `src/routes/+page.svelte` | Homepage: an ordered list of sections |
| `src/lib/sections/` | Homepage sections, one component each |
| `src/app.css` | Design tokens (`@theme`), `wrap`, `eyebrow`, `rich-text` |
| `src/routes/+layout.svelte` | Header, mobile menu, newsletter band, footer, WhatsApp button, store theming |
| `src/lib/store.ts` | Server-only Store API queries |
| `src/lib/shop.ts` | Browser-only SDK calls (cart, checkout, search, account, favorites, subscribe) |
| `src/lib/shopper-ui.svelte.ts` | Browser-owned customer, saved IDs and pending actions |
| `src/lib/WishlistButton.svelte` | Shared save/remove button for cards and product pages |
| `src/lib/tiendu.ts` | TypeScript types for Store API data |
| `src/lib/variants.ts` | Pure helpers for variant selection on the product page |
| `src/routes/**` | Pages: `/productos/[handle]`, `/categorias/[handle]` (all products is `/categorias/todas`), `/blog`, `/paginas/[handle]`, `/busqueda` |
| `src/routes/+error.svelte`, `src/error.html` | Error page, and the fallback when even the layout fails |
| `seed/` | Demo store data and image prompts (reference only, not used at runtime) |

## Common tasks

**Change text.** Edit `src/lib/content.ts`. Product, category, post and page
content comes from the store; change it in the store, not in code.

**Reorder, remove or repeat a homepage section.** Edit
`src/routes/+page.svelte`. Each section is one line. Sections with no data
(no posts, no categories) render nothing on their own.

**Add a homepage section.** Create `src/lib/sections/Name.svelte` with typed
props and a one-line comment saying what it is. Wrap it in
`<section class="wrap py-section">`, use `SectionHeader` for its title, put
its copy in `content.ts`, and add it to `+page.svelte`. Fetch any data it
needs in `src/routes/+page.server.ts` through a function in `store.ts`.

**Feature a specific collection.** Set `content.featured.collectionHandle`.
Pick one with at least 4 products; `null` shows best sellers.

**Change the look.** Change tokens in `src/app.css` (type sizes, neutrals,
section spacing). The brand color, font and rounding come from the store's
personalization in the Merchant Center, so prefer changing them there.

**Link to a page.** Only link `/paginas/<handle>` for pages that exist in the
store. New stores are seeded with `politicas-de-envio`,
`politicas-de-cambios-y-devoluciones` and `politicas-de-privacidad`.

**Fetch new data.** Add a function to `src/lib/store.ts` with an explicit
GraphQL query and a typed result, add types to `src/lib/tiendu.ts`, and call
it from a `+page.server.ts` `load`. Never import `store.ts` from browser code
or `shop.ts` from server code.

**Account and favorites.** Desktop header buttons and the mobile menu's bottom
actions open Tiendu's overlays. Keep the icon menu trigger available even when
there is no main menu. Close the drawer and flush its scroll lock before opening
an overlay. Both copies of the controls use the same shopper state. The menu
icon has two bars centered vertically. Drawer slide and backdrop fade transitions take
240ms, skip motion when requested, and keep scroll locked through the outro.
Use and await `closeMenu()` before opening a shopper overlay. Use
`WishlistButton` outside product links; anonymous clicks open sign-in with the
product pending. The root layout refreshes shared state on
`tiendu:shopper-status` and overlay close, so newly loaded cards and product
navigation retain the current hearts. Never fetch or mutate shopper state in
server loads.

## Conventions

- Svelte 5 runes (`$props`, `$state`, `$derived`), TypeScript, tabs.
- Tailwind utilities at the usage site; no component CSS except where already
  present. Reuse tokens (`text-headline`, `text-muted`, `border-line`,
  `bg-surface`, `py-section`, `wrap`) instead of raw values.
- Every page sets its own width with `wrap`; `<main>` has no width.
- Shopper-facing text in Spanish (rioplatense). Code and comments in English.
- Routes keep the Spanish prefixes (`/productos`, `/categorias`, `/paginas`,
  `/blog`); store menus link to them directly. All products is the virtual
  collection `todas` (`/categorias/todas`); there is no `/productos` listing.
- Links never point to routes that may not exist.
- Images: 4:5 for products and the homepage split, 4:3 for blog covers. See
  `DESIGN.md` for the art direction.

## Verify every change

```bash
pnpm check   # types and Svelte diagnostics
pnpm test    # unit tests (vitest)
pnpm build   # production build
```

Then run `pnpm dev` and look at the changed pages at desktop width and at
390px wide. Nothing may scroll horizontally. Useful pages: `/`,
`/categorias/todas`, a category, a product with options, `/blog`, a post, a policy page, and a
missing URL for the 404.

## Don't

- Don't add a CSS framework, UI kit or icon package. Icons are small Svelte
  components in `src/lib/ui/icons/`.
- Don't call the Merchant API from the storefront; it needs a secret key.
- Don't place real orders when testing checkout: use an email ending in
  `.test` and ask the merchant to clean up afterwards.
- Don't remove the empty states or the error pages.

## SDK initialization

SDK 2.2.0 handles `?cupon=CODE` on the first `Tiendu()` call: it removes the parameter and opens checkout with the code prefilled for the customer to confirm. `couponLinks: { enabled: false }` disables that behavior; `session: { persist: false }` keeps the shopper token in memory without localStorage. Both default to true. Set these options on the first client initialization; later calls reuse that client. Loading the SDK alone does not initialize it.
