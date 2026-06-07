# Garden Tracker — Component Library

All components are defined as reusable units. Each section describes the HTML structure, CSS behavior, state variants, and wiring requirements. Read `01-design-system.md` for tokens before implementing any component.

---

## 1. Topbar

The application chrome. Sticky at the top of the viewport.

### Structure

```
[Logo dot] [App name]    [Tab: Dashboard] [Tab: Plant] [Tab: Tasks]    [Weather chip]
```

### CSS

```css
.topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-background-primary);
  border-bottom: 0.5px solid var(--color-border-tertiary);
  position: sticky;
  top: 0;
  z-index: 20;
}
```

### Logo

```html
<div class="logo">
  <div class="logo-dot"></div>
  Garden Tracker
</div>
```

```css
.logo {
  font-family: var(--ff-display);
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}
.logo-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--leaf);
}
```

### Nav tabs

```html
<div class="nav-tabs">
  <button class="tab on" data-view="dash">Dashboard</button>
  <button class="tab" data-view="plant">Plant</button>
  <button class="tab" data-view="tasks">Tasks</button>
</div>
```

```css
.nav-tabs {
  display: flex;
  gap: 2px;
  background: var(--color-background-secondary);
  border-radius: 8px;
  padding: 3px;
}
.tab {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: var(--ff-body);
  white-space: nowrap;
  transition: all 0.12s;
}
.tab.on {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font-weight: 500;
}
```

**Wiring:** Clicking any `.tab` calls `showView(tab.dataset.view)`. The `.on` class is mutually exclusive across all tabs.

### Weather chip

Hidden on mobile, visible on desktop. Populated from a weather API call on app load.

```html
<div class="wx-chip">
  <i class="ti ti-sun" aria-hidden="true"></i>
  84°F · TN
</div>
```

```css
.wx-chip {
  font-family: var(--ff-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
  display: none; /* shown at ≥640px via media query */
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
@media (min-width: 640px) {
  .wx-chip { display: flex; }
}
```

---

## 2. Alert Banner

Persistent, non-dismissible hygiene warning. Always rendered directly below the topbar.

```html
<div class="alert-bar" role="alert">
  <i class="ti ti-alert-triangle" aria-hidden="true"></i>
  <span>
    <strong>Canopy zone active</strong> — All ground-plot fruit requires exhaustive
    wash cycles before consumption.
  </span>
</div>
```

```css
.alert-bar {
  background: var(--amber-bg);
  border-bottom: 0.5px solid var(--amber-border);
  padding: 7px 14px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  color: var(--amber-text);
  font-family: var(--ff-body);
}
.alert-bar i {
  font-size: 14px;
  color: var(--harvest);
  margin-top: 1px;
  flex-shrink: 0;
}
```

**Rules:**
- Never add a close/dismiss button
- Always render regardless of active view
- `role="alert"` for screen reader announcement on first render

---

## 3. Sidebar (desktop only)

Left-hand plant navigation. Hidden at < 640px, always visible at ≥ 640px.

```css
.sidebar {
  display: none;
  width: 240px;
  flex-shrink: 0;
  border-right: 0.5px solid var(--color-border-tertiary);
  padding: 12px 0;
  min-height: 600px;
}
@media (min-width: 640px) {
  .sidebar { display: block; }
}
```

### Section label

```html
<div class="sb-section">Ground Plot</div>
```

```css
.sb-section {
  padding: 10px 14px 4px;
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

### Sidebar item

```html
<div class="sb-item on" data-plant="cherry" role="button" tabindex="0">
  <i class="ti ti-plant-2" aria-hidden="true"></i>
  Cherry Tomatoes
  <div class="sb-dot near" aria-label="Near yield"></div>
</div>
```

```css
.sb-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  cursor: pointer;
  border-left: 2px solid transparent;
  font-size: 13px;
  font-family: var(--ff-body);
  color: var(--color-text-secondary);
  transition: all 0.12s;
}
.sb-item:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}
.sb-item.on {
  border-left-color: var(--leaf);
  color: var(--color-text-primary);
  background: var(--color-background-secondary);
  font-weight: 500;
}
.sb-item i {
  font-size: 15px;
  width: 18px;
  flex-shrink: 0;
}
```

### Status dot

```html
<div class="sb-dot near"></div>   <!-- harvest amber -->
<div class="sb-dot fruit"></div>  <!-- leaf green -->
<div class="sb-dot early"></div>  <!-- info blue -->
<div class="sb-dot stagnant"></div> <!-- border-secondary gray -->
```

```css
.sb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: auto;
}
.sb-dot.near     { background: var(--harvest); }
.sb-dot.fruit    { background: var(--leaf); }
.sb-dot.early    { background: var(--info-blue); }
.sb-dot.stagnant { background: var(--color-border-secondary); }
```

**Wiring:** Clicking a `.sb-item` calls `openPlant(plantKey)`. The `.on` class is mutually exclusive across all sidebar items.

---

## 4. PlantCard (grid layout)

Used in the ground plot 2- or 3-column grid. Contains full quick-action controls and alert chips.

### Full structure

```html
<article class="pcard fruit" data-plant="brandywine" aria-label="Brandywine Tomato">
  <div class="card-top">
    <div class="pname">Brandywine</div>
    <div class="qty">×1</div>
  </div>
  <div class="pills">
    <div class="pill g">5 ft</div>
    <div class="pill g">Fruiting</div>
  </div>
  <div class="qas">
    <button class="qa" data-action="water" aria-label="Log watering">
      <i class="ti ti-droplet" aria-hidden="true"></i> Water
    </button>
    <button class="qa" data-action="log" aria-label="Add log entry">
      <i class="ti ti-note" aria-hidden="true"></i> Log
    </button>
  </div>
  <div class="card-alerts">
    <div class="chip w">
      <i class="ti ti-alert-triangle" aria-hidden="true"></i>
      T-post recommended
    </div>
  </div>
</article>
```

### CSS

```css
.pcard {
  background: var(--color-background-primary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 12px;
  padding: 11px 12px;
  cursor: pointer;
  transition: border-color 0.15s;
  position: relative;
  overflow: hidden;
}
.pcard:hover { border-color: var(--color-border-secondary); }
.pcard.sel   { border-color: var(--sage-light); border-width: 1px; }

/* Status accent bar — top edge */
.pcard::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2.5px;
  border-radius: 12px 12px 0 0;
}
.pcard.near::before     { background: var(--harvest); }
.pcard.fruit::before    { background: var(--leaf); }
.pcard.early::before    { background: var(--info-blue); }
.pcard.stagnant::before { background: var(--color-border-secondary); }
```

### Card top row

```css
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 7px;
}
.pname {
  font-family: var(--ff-display);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
}
.qty {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--color-text-secondary);
  background: var(--color-background-secondary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 4px;
  padding: 1px 5px;
  flex-shrink: 0;
}
```

### Wiring

- Clicking anywhere on `.pcard` (not on a child button) calls `openPlant(card.dataset.plant)`
- All child buttons use `event.stopPropagation()` to prevent bubbling

---

## 5. StatPill

Inline status badge used inside cards and rows.

```html
<div class="pill g">5 ft</div>    <!-- green: healthy/fruiting -->
<div class="pill a">Near yield</div>  <!-- amber: attention needed -->
<div class="pill b">Pollinating</div> <!-- blue: early/info state -->
<div class="pill">Generic</div>       <!-- neutral: no semantic state -->
```

```css
.pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 7px;
}
.pill {
  font-family: var(--ff-mono);
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 20px;
  border: 0.5px solid var(--color-border-tertiary);
  color: var(--color-text-secondary);
  white-space: nowrap;
}
.pill.g {
  background: var(--leaf-bg);
  border-color: var(--leaf-border);
  color: var(--leaf-text);
}
.pill.a {
  background: var(--amber-bg);
  border-color: var(--amber-border);
  color: var(--amber-text);
}
.pill.b {
  background: var(--blue-bg);
  border-color: var(--blue-border);
  color: var(--blue-text);
}
```

---

## 6. QuickActionButton

Single-tap action buttons attached to plant cards and rows.

```html
<div class="qas">
  <button class="qa done" data-action="water">
    <i class="ti ti-droplet" aria-hidden="true"></i> Watered
  </button>
  <button class="qa" data-action="harvest">
    <i class="ti ti-basket" aria-hidden="true"></i> Harvest
  </button>
  <button class="qa" data-action="pollinate" id="sq-poll">
    <i class="ti ti-seeding" aria-hidden="true"></i> Pollinate
  </button>
</div>
```

```css
.qas {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.qa {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 0.5px solid var(--color-border-tertiary);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--ff-body);
  white-space: nowrap;
  transition: all 0.12s;
  min-height: 28px; /* extends to 44px tap zone via parent padding on mobile */
}
.qa:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border-color: var(--color-border-secondary);
}
.qa.done {
  background: var(--leaf-bg);
  border-color: var(--leaf-border);
  color: var(--leaf-text);
}
.qa i { font-size: 12px; }
```

### Action wiring

| `data-action` | Behavior |
|---|---|
| `water` | Write `garden_logs` entry `{log_type: 'Watering', metric_value: 'logged'}`, compute next water date, toggle `.done` |
| `harvest` | Increment `plants.total_harvest_count` locally and in DB, write `garden_logs` entry, open harvest count input |
| `log` | Open inline text input below the card for a quick note entry |
| `pollinate` | See **Pollination Tracker** section in `03-views-and-wiring.md` |

---

## 7. AlertChip

Contextual inline alert rendered inside a card or below a row.

```html
<div class="chip w">  <!-- warn -->
  <i class="ti ti-alert-triangle" aria-hidden="true"></i>
  Verify bamboo anchors — >5 ft
</div>
<div class="chip i">  <!-- info -->
  <i class="ti ti-clock" aria-hidden="true"></i>
  72-hr check armed
</div>
<div class="chip d">  <!-- danger -->
  <i class="ti ti-alert-triangle" aria-hidden="true"></i>
  Fruit drop risk — check now
</div>
```

```css
.chip {
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.3;
  margin-bottom: 4px;
  font-family: var(--ff-body);
}
.chip i { font-size: 11px; flex-shrink: 0; }
.chip.w {
  background: var(--amber-bg);
  color: var(--amber-text);
  border: 0.5px solid var(--amber-border);
}
.chip.i {
  background: var(--blue-bg);
  color: var(--blue-text);
  border: 0.5px solid var(--blue-border);
}
.chip.d {
  background: var(--red-bg);
  color: var(--red-text);
  border: 0.5px solid var(--red-border);
}
```

### Auto-generated chips (deterministic engine)

The following chips are injected by JS logic without any user action:

| Condition | Chip class | Text |
|---|---|---|
| `current_height >= 5` (tomatoes) | `.w` | "Verify bamboo anchors — >5 ft" |
| `current_height >= 5` (tomatoes, brandywine) | `.w` | "T-post recommended" |
| `pollinatedAt` exists, <48 hrs elapsed | `.i` | "72-hr check armed — verify fruit set" |
| `pollinatedAt` exists, 48–72 hrs elapsed | `.w` | "Check for fruit drop — 48 hrs post-pollination" |
| `pollinatedAt` exists, >72 hrs elapsed | `.d` | "Fruit drop risk — assess fruit set now" |
| Container dryout >75% of interval | `.w` | "Water in ~N hrs" |
| Container dryout >95% of interval | `.d` | "Water now" |

---

## 8. PlantRow

Full-width single-line plant entry. Used for simpler ground-plot plants and all container plants.

```html
<article class="prow early" data-plant="cantaloupe" aria-label="Cantaloupe">
  <div class="prow-content">
    <div class="pname">Cantaloupe</div>
    <div class="prow-sub">Blooming · 8–10 hr sun · Awaiting fruit set</div>
  </div>
  <div class="pills" style="margin: 0;">
    <div class="pill b">Blooming</div>
  </div>
  <div class="prow-actions">
    <button class="qa" aria-label="Log watering"><i class="ti ti-droplet" aria-hidden="true"></i></button>
    <button class="qa" aria-label="Add log entry"><i class="ti ti-note" aria-hidden="true"></i></button>
  </div>
</article>
```

```css
.prow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-background-primary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s;
  margin: 0 14px 7px;
  position: relative;
  overflow: hidden;
}
.prow:hover { border-color: var(--color-border-secondary); }

/* Status accent bar — left edge */
.prow::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 2.5px;
  border-radius: 0; /* single-sided — no rounded corners */
}
.prow.near::before     { background: var(--harvest); }
.prow.fruit::before    { background: var(--leaf); }
.prow.early::before    { background: var(--info-blue); }
.prow.stagnant::before { background: var(--color-border-secondary); }

.prow-content { flex: 1; min-width: 0; }
.prow-sub {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-family: var(--ff-mono);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prow-actions { display: flex; gap: 4px; flex-shrink: 0; }
```

---

## 9. Moisture Dryout Bar

Rendered directly below each container-zone PlantRow. Never inside the row element itself.

```html
<div class="dryrow">
  <span class="dry-lbl">Moisture</span>
  <div class="dry-track" role="progressbar" aria-valuenow="52" aria-valuemin="0" aria-valuemax="100" aria-label="Moisture level 52%">
    <div class="dry-fill mid" style="width: 52%;"></div>
  </div>
  <span class="dry-lbl" style="color: var(--harvest);">~18 hrs</span>
</div>
```

```css
.dryrow {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px 8px;
}
.dry-lbl {
  font-size: 10px;
  font-family: var(--ff-mono);
  color: var(--color-text-secondary);
  white-space: nowrap;
}
.dry-track {
  flex: 1;
  height: 3px;
  background: var(--color-background-secondary);
  border-radius: 2px;
  overflow: hidden;
}
.dry-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}
.dry-fill.lo  { background: var(--leaf); }    /* 0–60% elapsed */
.dry-fill.mid { background: var(--harvest); } /* 60–85% elapsed */
.dry-fill.hi  { background: #E24B4A; }        /* >85% elapsed */
```

**Calculation (deterministic):**

```js
function getDryoutState(plant) {
  const elapsed = Date.now() - plant.lastWateredAt;
  const interval = plant.ai_care_metadata.care_rules.watering_interval_days * 86400000;
  const pct = Math.min(100, Math.round((elapsed / interval) * 100));
  const fillClass = pct < 60 ? 'lo' : pct < 85 ? 'mid' : 'hi';
  const hrsRemaining = Math.max(0, Math.round((interval - elapsed) / 3600000));
  const label = pct >= 85 ? 'Water now' : `~${hrsRemaining} hrs`;
  const labelColor = pct >= 85 ? 'var(--alert-red)' : pct >= 60 ? 'var(--harvest)' : 'var(--color-text-secondary)';
  return { pct, fillClass, label, labelColor };
}
```

---

## 10. Task Checkbox

```html
<div class="task">
  <button class="tc on" aria-label="Mark task incomplete" aria-pressed="true">
    <i class="ti ti-check" aria-hidden="true"></i>
  </button>
  <div class="task-body">
    <div class="ttxt done">Harvest hygiene alert banner injected</div>
    <div class="tphase">HIGH · Hygiene System</div>
  </div>
</div>
```

```css
.task {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 7px 10px;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 8px;
  background: var(--color-background-primary);
  margin-bottom: 5px;
}
.tc {
  width: 15px; height: 15px;
  border-radius: 50%;
  border: 0.5px solid var(--color-border-secondary);
  flex-shrink: 0;
  margin-top: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: all 0.12s;
  padding: 0;
}
.tc.on {
  background: var(--sage);
  border-color: var(--sage);
}
.tc i { font-size: 8px; color: transparent; }
.tc.on i { color: #fff; }

.ttxt {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
.ttxt.done {
  text-decoration: line-through;
  color: var(--color-text-tertiary);
}
.tphase {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
```

**Wiring:** Toggle `.on` on `.tc` and `.done` on `.ttxt` simultaneously. Persist state to `localStorage` key `garden_tasks_state`.

---

## 11. Plant Care Chatbox Panel

Plant-scoped contextual interface for multimodal diagnostics, inline AI responses, and structured patch previews. Render this panel at the top of the plant detail view before care metrics and milestones.

### Structure

```text
+-------------------------------------------------------------+
| Plant diagnostics                                 [AI badge] |
+-------------------------------------------------------------+
| (You) Leaf showing white spots...                          |
|                                                             |
| (AI) Bird dropping residue confirmed, not pathological.     |
|      [PATCH · target: cherry_tomatoes]                      |
+-------------------------------------------------------------+
| [photo] [Describe what you're seeing...] [send]             |
+-------------------------------------------------------------+
```

### HTML

```html
<section class="ai-panel" aria-label="Plant diagnostics">
  <div class="ai-hd">
    <div class="ai-title">Plant diagnostics</div>
    <div class="ai-badge">
      <i class="ti ti-robot" aria-hidden="true"></i> AI
    </div>
  </div>

  <div class="msgs" id="plant-chat-messages">
    <div class="msg">
      <div class="av u">C</div>
      <div class="mbody">
        Leaf showing white spots — mildew or bird droppings?
        <div class="msg-attachment">
          <i class="ti ti-photo" aria-hidden="true"></i>
          leaf-photo.jpg
        </div>
      </div>
    </div>

    <div class="msg">
      <div class="av ai">
        <i class="ti ti-leaf" aria-hidden="true"></i>
      </div>
      <div class="mbody">
        <strong>Bird dropping residue confirmed, not pathological.</strong>
        Irregular pattern and location match your canopy context. No fungal
        signature. Care cycles unchanged — increase pre-harvest scrub protocol.
        <div class="patch">
          <span class="patch-lbl">PATCH · target: cherry_tomatoes</span>
          watering_interval_days_normal: 2 (no change)<br>
          user_alert: "Double-rinse all fruit before consumption."
        </div>
      </div>
    </div>
  </div>

  <form class="ai-inp-row" id="plant-chat-form">
    <label class="icn-btn" for="plant-chat-file" aria-label="Upload photo">
      <i class="ti ti-photo" aria-hidden="true"></i>
    </label>
    <input id="plant-chat-file" type="file" accept="image/*" hidden>
    <input
      class="ai-inp"
      type="text"
      name="prompt"
      placeholder="Describe what you're seeing..."
      aria-label="Describe what you're seeing"
    >
    <button class="send-btn" type="submit" aria-label="Send diagnostic request">
      <i class="ti ti-send" aria-hidden="true"></i>
    </button>
  </form>
</section>
```

### CSS

```css
.ai-panel {
  margin: 10px 14px;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background-primary);
}
.ai-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: var(--color-background-secondary);
  border-bottom: 0.5px solid var(--color-border-tertiary);
}
.ai-title {
  font-family: var(--ff-display);
  font-size: 13px;
  font-weight: 500;
}
.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-family: var(--ff-mono);
  background: var(--leaf-bg);
  color: var(--leaf-text);
  border: 0.5px solid var(--leaf-border);
  border-radius: 4px;
  padding: 2px 6px;
}
.msgs {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  max-height: 280px;
  overflow-y: auto;
}
.msg {
  display: flex;
  gap: 7px;
  align-items: flex-start;
}
.av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  font-family: var(--ff-mono);
}
.av.u {
  background: var(--color-background-secondary);
  border: 0.5px solid var(--color-border-tertiary);
  color: var(--color-text-secondary);
}
.av.ai {
  background: var(--leaf-bg);
  border: 0.5px solid var(--leaf-border);
  color: var(--leaf-text);
}
.mbody {
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  flex: 1;
}
.mbody strong {
  color: var(--color-text-primary);
  font-weight: 500;
}
.msg-attachment {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--color-text-secondary);
  background: var(--color-background-secondary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 6px;
  padding: 4px 8px;
}
.patch {
  background: var(--blue-bg);
  border: 0.5px solid var(--blue-border);
  border-radius: 7px;
  padding: 7px 9px;
  margin-top: 5px;
  font-family: var(--ff-mono);
  font-size: 10.5px;
  color: var(--blue-text);
  line-height: 1.6;
}
.patch-lbl {
  display: block;
  margin-bottom: 3px;
  font-size: 10px;
  color: var(--info-blue);
}
.ai-inp-row {
  padding: 9px 12px;
  border-top: 0.5px solid var(--color-border-tertiary);
  display: flex;
  gap: 5px;
  align-items: center;
}
.ai-inp {
  flex: 1;
  font-size: 12px;
  font-family: var(--ff-body);
  padding: 6px 9px;
  border-radius: 7px;
  border: 0.5px solid var(--color-border-tertiary);
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  outline: none;
}
.ai-inp:focus {
  box-shadow: 0 0 0 2px var(--sage-light);
}
.icn-btn {
  width: 28px;
  height: 28px;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.12s ease;
  flex-shrink: 0;
}
.icn-btn:hover {
  background: var(--color-background-secondary);
}
.send-btn {
  width: 28px;
  height: 28px;
  background: var(--sage);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  transition: all 0.12s ease;
}
.send-btn:hover {
  background: var(--sage-light);
}
.send-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}
```

### States

- Append the user message immediately on submit, then clear the text field without waiting for the model response
- While the request is in flight, disable `.send-btn` and preserve the selected image attachment until the request resolves
- Render `.patch` only when the AI response includes structured mutation content
- Keep messages scoped to the currently selected plant; switching plants swaps the visible message history

### Wiring Checklist

- Client state is partitioned by `plant_id`; opening a different plant rehydrates only that plant's message array into `.msgs`
- Submit `FormData` containing the prompt text, the optional image file, and the active `plant_id` to the background Gemini endpoint
- If the AI payload includes `patch_detected: true`, apply `target_fields` to the matching plant record immediately and rerender the affected `PlantCard`, timers, and care metrics without a full page refresh
