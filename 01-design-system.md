# Garden Tracker — Design System

## Overview

The Garden Tracker uses an **organic-utilitarian** aesthetic: the precision of a field notebook crossed with the density of a scientific instrument readout. Every design decision should feel like it belongs in a working garden — functional, legible under direct sunlight, unhurried but never cluttered.

---

## Typography

Load all three families from Google Fonts in this exact import:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

### Font roles

| Variable | Family | Weight | Use |
|---|---|---|---|
| `--ff-display` | Fraunces | 300, 500 | Plant names, zone titles, large metric numerals, app logo |
| `--ff-body` | DM Sans | 400, 500 | All UI labels, button text, descriptions, alert text |
| `--ff-mono` | DM Mono | 400, 500 | Stats, timestamps, badge values, interval counts, zone sub-labels, category tags |

### Type scale

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| App logo | display | 16px | 500 | Topbar only |
| Zone title | display | 14px | 500 | Section headers |
| Plant name (card) | display | 13px | 500 | Card and row primary label |
| Plant name (detail) | display | 16px | 500 | Plant detail header |
| Care metric number | display | 20px | 500 | Care rules grid values |
| Body / description | body | 12–13px | 400 | Alerts, milestone text, AI messages |
| Button text | body | 11–12px | 400 | Quick-action buttons |
| Mono label | mono | 10px | 400 | Zone sub-labels, pill values, task phase tags, care rule labels |
| Mono badge | mono | 10px | 500 | Quantity badges, AI badge |

### Rules

- Never use Inter, Roboto, Arial, or system-ui as a deliberate choice
- Fraunces is optical-size aware — always pair with `font-style: normal` unless italic is intentional
- Minimum font size anywhere in the UI: **11px**
- Body text line-height: `1.4–1.5` for dense UI, `1.6` for AI message bubbles
- Two font weights only per family: 400 and 500. Never 600 or 700.

---

## Color System

Define all tokens as CSS custom properties on `:root`. Never hardcode hex values outside this block.

```css
:root {
  /* Brand greens */
  --sage:          #3E5C3A;
  --sage-light:    #5C7A56;
  --leaf:          #7AAE72;

  /* Brand ambers */
  --harvest:       #C8832A;
  --harvest-light: #E8A94A;

  /* Semantic alert */
  --alert-red:     #A32D2D;
  --alert-amber:   #854F0B;
  --info-blue:     #185FA5;

  /* Tinted backgrounds (light mode) */
  --leaf-bg:       #EAF3DE;
  --leaf-text:     #27500A;
  --leaf-border:   #97C459;

  --amber-bg:      #FAEEDA;
  --amber-text:    #633806;
  --amber-border:  #EF9F27;

  --red-bg:        #FCEBEB;
  --red-text:      #791F1F;
  --red-border:    #F09595;

  --blue-bg:       #E6F1FB;
  --blue-text:     #0C447C;
  --blue-border:   #85B7EB;

  /* Fonts */
  --ff-display: 'Fraunces', serif;
  --ff-body:    'DM Sans', sans-serif;
  --ff-mono:    'DM Mono', monospace;
}
```

### Dark mode

Supplement the system CSS variables (`--color-background-primary`, `--color-text-primary`, etc.) with overrides for the brand tokens:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --leaf-bg:     #173404;
    --leaf-text:   #C0DD97;
    --leaf-border: #3B6D11;

    --amber-bg:    #412402;
    --amber-text:  #FAC775;
    --amber-border:#854F0B;

    --red-bg:      #501313;
    --red-text:    #F7C1C1;
    --red-border:  #A32D2D;

    --blue-bg:     #042C53;
    --blue-text:   #B5D4F4;
    --blue-border: #185FA5;
  }
}
```

All surface colors (`--color-background-primary/secondary/tertiary`) and text colors (`--color-text-primary/secondary/tertiary`) use the host framework's CSS variable system — do not redefine them.

### Status color mapping

Status colors are always applied as **accent marks**, never as full-surface fills:

| Status | Accent color | Usage |
|---|---|---|
| Near yield | `var(--harvest)` | Top border on card, left border on row |
| Fruiting | `var(--leaf)` | Top border on card, left border on row |
| Early / vegetative | `var(--info-blue)` | Top border on card, left border on row |
| Stagnant | `var(--color-border-secondary)` | Top border on card, left border on row |

### AI / diagnostic surfaces

- Plant-level AI chat and diagnostics use existing neutral host surfaces for the main message area: `var(--color-background-primary)` and `var(--color-background-secondary)`
- Structured AI patch previews always use the blue semantic set: `var(--blue-bg)`, `var(--blue-border)`, and `var(--blue-text)`
- Informational accents inside AI surfaces use `var(--info-blue)` rather than ad hoc hex values
- AI presence is indicated with small badges, icons, or labels only. Never flood an entire panel with brand or semantic color

---

## Spacing & Layout

```css
/* Horizontal gutters */
--gutter: 14px;

/* Card internals */
--card-pad: 11px 12px;
--card-radius: 12px;

/* Row internals */
--row-pad: 10px 12px;
--row-radius: 10px;

/* Gap between cards in grid */
--grid-gap: 8px;

/* Gap between rows */
--row-gap: 7px;

/* Section divider margin */
--divider-margin: 10px var(--gutter);
```

All vertical rhythm uses `px` for component internals and `rem` for section-level spacing. Never mix them within the same component.

---

## Borders

- Default border: `0.5px solid var(--color-border-tertiary)`
- Hover border: `0.5px solid var(--color-border-secondary)`
- Active/selected border: `1px solid var(--sage-light)` — the only 1px border in the system
- Status accent bars: `2.5px` solid, no border-radius on the accent side

**Rule:** Never use `box-shadow` for elevation. The app is intentionally flat. The only allowed `box-shadow` is a focus ring: `box-shadow: 0 0 0 2px var(--sage-light)`.

---

## Iconography

Use **Tabler Icons outline** webfont exclusively. Never hand-draw SVG icon paths.

```html
<!-- Already loaded in the host environment -->
<i class="ti ti-plant-2" aria-hidden="true"></i>
```

Icon sizing rules:
- Inline with text: `font-size: 12–14px`
- Standalone decorative: `font-size: 15–18px`
- Topbar / navigation: `font-size: 15px`
- Never exceed `20px` in a dense UI context

Required icons by component:

| Context | Icon class |
|---|---|
| Ground plot plants | `ti-plant-2` |
| Container plants | `ti-box` |
| Water action | `ti-droplet` |
| Harvest action | `ti-basket` |
| Pollinate action | `ti-seeding` |
| Log / note | `ti-note` |
| Photo upload | `ti-photo` |
| Send message | `ti-send` |
| AI indicator | `ti-robot` |
| Back navigation | `ti-arrow-left` |
| Sun / weather | `ti-sun` |
| Alert / warning | `ti-alert-triangle` |
| Clock / timer | `ti-clock` |
| Leaf / plant health | `ti-leaf` |
| Task check | `ti-check` |

All decorative icons: `aria-hidden="true"`. Icon-only buttons: `aria-label="[action]"`.

---

## Motion & Transitions

- All interactive transitions: `transition: all 0.12s ease`
- Status color transitions (pollinate done state): `transition: background 0.15s, border-color 0.15s, color 0.15s`
- No entrance animations on cards — the app prioritizes fast perceived render
- Micro-interaction on task checkbox: toggle class-based transition only, no keyframes
- No parallax, no scroll-triggered animations, no page-load sequences

---

## Accessibility

- Minimum touch target: `44px` × `44px` — use padding to expand visual elements without changing their rendered size
- Focus ring: `outline: none; box-shadow: 0 0 0 2px var(--sage-light)` on all interactive elements
- Color is never the sole conveyor of information — status dots in the sidebar always have a text label, status bars on cards are always accompanied by a text pill
- Screen reader landmark: wrap the entire app in `<main>` with `aria-label="Garden Tracker dashboard"`
- All section headers use semantic `<h2>` or `<h3>` elements, not styled divs
