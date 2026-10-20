# Design

The minimal template: high contrast, oversized type, lots of room, and nothing
that does not earn its place. These are the rules that keep it looking like
itself when the copy, products and brand color change.

## Principles

1. **Hierarchy comes from size, not weight.** Headings are huge and
   `font-medium`; body text is regular. Never bold a whole sentence to make it
   stand out: make it bigger or give it more space.
2. **Space is the layout.** Sections breathe (`py-section` on both sides).
   When something feels crowded, remove something before shrinking spacing.
3. **Black, white and one color.** Ink on paper for almost everything. The
   store's color (`--primary`) appears only on buttons, the cart badge, rating
   stars and the newsletter band.
4. **One loud thing per screen.** One filled button per view; everything else
   is a text link with an arrow.
5. **Lines, not boxes.** Group with thin rules (`border-line`) and alignment.
   Cards have no borders; panels are reserved for images and the featured post.
6. **Photos carry the warmth.** The UI is neutral so product images, shot on a
   warm background, read as blocks of color.

## Tokens

Defined in `src/app.css` under `@theme`. Change them there, not in components.

### Type

| Token | Size | Use |
| --- | --- | --- |
| `text-display` | `clamp(3.25rem, 10vw, 9rem)`, line height 0.92, tracking −0.045em | One per page: hero, category name, error page, blog title |
| `text-headline` | `clamp(2.25rem, 5.5vw, 4.75rem)`, line height 1, tracking −0.035em | Section titles, post and page titles, newsletter |
| `text-title` | `clamp(1.75rem, 3.2vw, 2.75rem)`, line height 1.05, tracking −0.025em | Product title, category rows, post titles in lists |
| `eyebrow` (utility) | 0.75rem, uppercase, tracking 0.14em, muted | Small label above a heading |
| Body | `text-base` / `text-lg` | Paragraphs; `text-muted` for secondary text |

Headings use `font-medium` and `text-balance`. The font is the store's own
(`store.personalization.font`), so the type scale must work with any family.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#0a0a0a` | Text, rules that need weight, active states |
| `paper` | `#ffffff` | Page background |
| `muted` | `#6b6b6b` | Secondary text, eyebrows, inactive nav |
| `line` | `#e5e5e5` | Dividers and control borders |
| `surface` | `#f2f1ee` | Image backgrounds, placeholders, featured post without cover |
| `--primary` / `--on-primary` | From the store | Buttons, cart badge, stars, newsletter band |

### Spacing and width

- `py-section`: vertical room on each side of a homepage section
  (`clamp(3.5rem, 7vw, 6.5rem)`). Two adjacent sections add up.
- `wrap`: page container, max 90rem with responsive side gutters. Every page
  sets its own width with it.
- Long-form text (`rich-text`) is capped at 68 characters per line.

### Rounding

Controls and panels follow `store.personalization.rounding` (`none`, `sm`,
`md`, `lg`) through `--radius-controls` and `--radius-panels`.
`none` suits this template best: square corners match the type and the rules.

## Components

| Piece | Where | Notes |
| --- | --- | --- |
| Button | `src/lib/ui/button/Button.svelte` | `primary` (filled) or `secondary` (quiet). Sizes `sm`–`xl`; `xl` is 56px tall. `full` stretches it. |
| Text link with arrow | inline in sections | `group inline-flex gap-2`, underline on hover, arrow nudges right. The default secondary action. |
| Section header | `src/lib/sections/SectionHeader.svelte` | Eyebrow + headline left, optional link right. |
| Product card | `src/lib/ProductCard.svelte` | 4:5 image on `surface`, title, price. No border. "Agotado" label top left. |
| Product grid | `src/lib/ProductListing.svelte` | 2 / 3 / 4 columns, infinite scroll, no-JS pagination, empty state. |
| Rich text | `rich-text` utility in `app.css` | Merchant HTML in posts and pages. |

## Pages

- **Home:** text-only hero, featured products, split image and text,
  categories as a big text list, benefits, blog (latest post featured), then
  the newsletter band and footer on every page.
- **Category and all products:** `text-display` title, product count and sort
  bar between rules, grid.
- **Product:** gallery (7/12) and details (5/12). Options as outlined chips or
  a dropdown, quantity stepper next to a full-width button, collapsible
  description and specifications, reviews with a large average, related
  products.
- **Blog:** list with date, title and excerpt between rules. **Post:** centered
  column, wide cover, `rich-text` body, more posts after it.
- **Static page:** title on the left (sticky on desktop), text on the right.
- **Error:** `text-display` message with a way back.

## Images

Products, posts and the homepage split image follow one art direction so the
store reads as one brand. Full prompts are in `seed/images.md`.

- **Background:** warm greige plaster wall (around `#CBBFAE`), never white,
  so photos stand out against the white page.
- **Surface:** pale oak for objects, warm gray microcement for furniture.
- **Light:** soft window light from the left, soft shadows to the right.
- **Camera:** eye level, about 15° down, 50 mm, subject centered with room.
- **Grading:** sand, oat, stone, clay, charcoal; low saturation, matte, light
  grain. No text, logos, people or hands.

| Use | Ratio |
| --- | --- |
| Product photos, homepage split | 4:5 |
| Blog covers | 4:3 (cropped to 16:9 on the post page; keep the subject centered) |
| Images inside posts | 3:2 |

Color variants of a product should share the exact same framing: the product
page swaps the photo when the shopper picks a color.

## Do and don't

- **Do** reuse `text-display`, `text-headline`, `text-title` and `eyebrow`
  instead of new sizes.
- **Do** keep one filled button per view and use arrow links for the rest.
- **Do** check every change at 390px wide: no horizontal scroll, ever.
- **Don't** add borders around cards, shadows (except the floating WhatsApp
  button and gallery arrows) or gradients.
- **Don't** use `--primary` for text or large areas other than the newsletter
  band.
- **Don't** bold body copy or use more than one weight per heading.
