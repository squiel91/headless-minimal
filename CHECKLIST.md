# Store customization checklist

The recommended steps to turn this template into a real store, in order.
Steps marked **Merchant Center** happen in the store admin (or through the
Tiendu MCP server); the rest are changes in this code. Agents: check each item
off with the merchant and verify the result in the browser.

## 1. Run it locally

- [ ] Copy `.env.example` to `.env` and set `STORE_HANDLE` and
      `PUBLIC_STORE_HANDLE` to the store's handle.
- [ ] **Merchant Center:** Ajustes → Tienda → Desarrollo y API → turn
      developer mode on while working on `localhost`.
- [ ] `pnpm install`, then `pnpm dev`, and open the printed URL.

## 2. Store identity

- [ ] **Merchant Center:** Ajustes → Negocio → General: store name, WhatsApp
      number and main email. The WhatsApp number turns on the floating button;
      the email and WhatsApp appear in the footer.
- [ ] **Merchant Center:** set the store description. It is the homepage meta
      description: one or two sentences, under 160 characters.
- [ ] **Merchant Center:** Ajustes → Tienda → Personalización: main color,
      button text color, font and rounding. The storefront uses the same
      values as the checkout. `Sin redondeo` suits this template best.

## 3. Homepage copy

- [ ] Rewrite every string in `src/lib/content.ts` for this store: hero,
      featured title, split section, categories heading, benefits, product
      page benefits, blog heading, newsletter and the WhatsApp message.
- [ ] Keep each text close to its original length so the layout holds.
- [ ] Make the benefits true: real shipping times, return window and payment
      methods. Remove any benefit the store cannot promise.
- [ ] Replace the split section image (`content.split.image`) with a photo of
      the store's own products or space, 4:5, and write its alt text.

## 4. Catalog

- [ ] **Merchant Center:** load the real products: title, price, stock,
      description, specifications and photos (4:5, same background and light
      for all; see `DESIGN.md`).
- [ ] Give products with color options one photo per color, assigned to the
      matching variants, so the gallery follows the shopper's choice.
- [ ] Create the real categories with a short description each.
- [ ] Delete the demo products, categories and reviews.
- [ ] Optional: set `content.featured.collectionHandle` to a category with at
      least 4 products; otherwise the homepage shows best sellers.

## 5. Navigation and pages

- [ ] **Merchant Center:** edit the `principal` menu (header): main
      categories, all products (`/categorias/todas`), blog. Keep it to 4–6
      links.
- [ ] **Merchant Center:** edit the `footer` menu (Información column).
- [ ] **Merchant Center:** complete the three policy pages (shipping, returns,
      privacy) with the store's real terms. Replace every placeholder such as
      `[NOMBRE_DE_TU_NEGOCIO]`.
- [ ] If any policy page is renamed or deleted, update the links in
      `content.ts` (benefits and newsletter privacy note).

## 6. Blog

- [ ] Replace the demo posts with real ones, or delete them and remove the
      `BlogPreview` line from `src/routes/+page.svelte` if the store will not
      have a blog. Also remove Blog from the `principal` menu.
- [ ] Post covers are 4:3 with the subject centered.

## 7. Homepage layout

- [ ] Review the section order in `src/routes/+page.svelte` and remove
      anything the store does not need.
- [ ] Check the homepage at desktop width and at 390px wide.

## 8. Selling

- [ ] **Merchant Center:** Ajustes → Negocio → Cobros: set up at least one
      payment method.
- [ ] **Merchant Center:** Ajustes → Negocio → Logística: shipping rules
      and/or pickup.
- [ ] Place a test order end to end with an email ending in `.test` (for
      example `prueba@tienda.test`). Check the confirmation email, then ask for
      the test order to be removed.
- [ ] Try search, add to cart from a product with options, and the
      newsletter form.

## 9. SEO

- [ ] **Merchant Center:** SEO title and description for the main products,
      categories and posts.
- [ ] Check `/sitemap.xml` and `/robots.txt` once deployed.
- [ ] Every product and post image has meaningful alt text.

## 10. Launch

- [ ] `pnpm check`, `pnpm test` and `pnpm build` pass.
- [ ] Deploy the build (`node build`) to the production host with the same
      environment variables.
- [ ] **Merchant Center:** Ajustes → Tienda → Desarrollo y API: add the
      production origin under Orígenes permitidos, then turn developer mode
      off.
- [ ] **Merchant Center:** Ajustes → Tienda → Dominios: connect the domain.
- [ ] Visit the live site on a phone: homepage, a product, add to cart,
      checkout, the WhatsApp button and a 404 page.
