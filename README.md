# Minimal headless store (SvelteKit)

Minimal SSR storefront for a Tiendu store. Server renders catalog pages with
plain `fetch` against the public Store API; the browser handles only the
shopper session (cart badge, add to cart) and the Tiendu checkout overlay
through `static/tiendu-sdk.js`.

Out of scope on purpose: shopper account and wishlist. Add them the same way
when needed.

- `CHECKLIST.md`: steps to turn the template into a real store.
- `DESIGN.md`: design rules, tokens and image art direction.
- `AGENTS.md`: guide for AI agents working on the code.
- `seed/`: demo store data and image prompts (reference only).

## Setup

1. Copy `.env.example` to `.env` and set `STORE_HANDLE` (+ `PUBLIC_*` twins).
2. In Merchant Center → Ajustes → Tienda → Desarrollo y API, turn developer
   mode **on** while you develop on `localhost`. Turn it off before launch and
   add your production origin under Orígenes permitidos instead.
3. `pnpm install`
4. `pnpm dev` and open the printed localhost URL.

> Linux: Node must resolve `stores.localhost`. If pages return 500 with
> `fetch failed`, run once:
> `echo '127.0.0.1 stores.localhost' | sudo tee -a /etc/hosts`

## Testing checkout

Checkout creates real orders and subtracts stock. Test with emails ending in
`.test` (for example `shopper@tiendu.test`). Ask the store owner to clean up
test orders afterwards.

## Routes

- `/` home (sections listed in `src/routes/+page.svelte`)
- `/categorias/[handle]` collection with subcategories, sort and infinite scroll.
  All products is the virtual collection `todas`, at `/categorias/todas`.
- `/productos/[handle]` product with variant picker + add to cart
- `/busqueda?q=...` search results (also the target of the search overlay)
- `/blog` and `/blog/[handle]` blog list and post
- `/paginas/[handle]` static pages (policies)
- `/sitemap.xml`, `/robots.txt`

## License

MIT. See `LICENSE`.
