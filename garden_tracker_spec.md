# Master Garden Tracker App: Project Specification & Architecture Blueprint

## 1. Project Vision & Context

This specification outlines a custom, hyper-local, hybrid web application designed for tracking a personal backyard vegetable and fruit garden. The application optimizes the balance between immediate, high-performance user logging and context-rich AI intelligence.

### User Micro-Climate & Base Context

- **Location:** Columbia, TN (USDA Hardiness Zone 7b, bordering 8a)
- **General Daylight Profile:** Main ground plot receives 6-7 hours of intense morning-to-midday sun before moving into the shadow of a large overhanging tree around 1:00 PM.
- **Sunlight Exceptions:** A specialized downhill trellis section receives 8-10 hours of uninterrupted daily sun.
- **Environmental Anomaly:** The overhanging canopy tree produces berries and seeds, attracting a large, permanent daytime bird population. This creates heavy, continuous bird-dropping coverage across the ground-plot leaves and soil, functioning as a high-nitrogen/phosphorus sky fertilizer but imposing strict harvest washing and hygiene guidelines.

---

## 2. Architecture Model: The Hybrid Event Driven Flow

To bypass the latency, cost, and predictability issues common to pure AI architectures, this application splits tasks between a **Deterministic Engine (Local Code)** and a **Contextual Engine (Gemini API Structured JSON)**.

```text
+-----------------------------------------------------------------------+
|                         User Interface (Web App)                      |
+-----------------------------------------------------------------------+
|                                                                       |
| (Routine Mutations: Immediate)                        | (Strategic Triggers & Inquiries)
v                                                       v
+----------------------------------+          +----------------------------------+
|   Deterministic Engine (Code)    |          |    Contextual Engine (AI)        |
|  - Instant CRUD Log Additions    |          |  - JSON Schema Generation        |
|  - Integer Tally Increments      |          |  - Multi-modal Image Analysis    |
|  - Local Recurrence Math Loops   |          |  - Phase-Shift Custom Tasks      |
+----------------------------------+          +----------------------------------+
|                                                       |
+---------------------------+---------------------------+
|
v
+-----------------------+
|   Database Layer      |
|   (PostgreSQL/SQLite) |
+-----------------------+
```

### Functional Separation Rules

1. **The Deterministic Local Code Engine:** Handles immediate user mutations, UI state changes, numbers/tallies, and recurring time-based loops. When a user logs a harvest weight, height adjustment, or clicks a button indicating a task is done, the change is written directly to the database and reflected instantly on screen with zero LLM loading states.
2. **The Contextual AI Engine (Gemini API):** Invoked asynchronously and sparingly. It handles high-value processing tasks: generating custom care rules on initial plant setup, parsing photographic inputs for plant pathology or anomalies, and updating localized task logic when a plant crosses a major structural milestone.

---

## 3. Database Schema Blueprint

```sql
-- Core Table: Plant Records
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    plant_name VARCHAR(100) NOT NULL,             -- e.g., "Black Tomato"
    variety_type VARCHAR(100),                    -- e.g., "Heirloom Indeterminate"
    date_planted DATE NOT NULL,                   -- e.g., 2026-05-06
    location_context VARCHAR(100) NOT NULL,       -- e.g., "Columbia, TN"
    planting_medium VARCHAR(100) NOT NULL,        -- e.g., "In-ground", "12-inch plastic container"
    sunlight_hours_estimate INT NOT NULL,         -- e.g., 7
    total_harvest_count INT DEFAULT 0,            -- Deterministic local counter
    current_height_string VARCHAR(50),            -- Deterministic local state tracking
    notes_initial TEXT,

    -- The core AI payload storage block
    ai_care_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supporting Table: Event Timeline Logs
CREATE TABLE garden_logs (
    id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(id) ON DELETE CASCADE,
    log_type VARCHAR(50) NOT NULL,                -- 'Harvest', 'Measurement', 'Photo Note', 'Watering', 'Fertilizing'
    metric_value VARCHAR(255) NOT NULL,           -- e.g., "5 fruits", "6 feet", "https://storage.cdn/leaf_img.png"
    text_description TEXT,                        -- User entry text or AI analysis feedback
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Gemini API Integration & JSON Schemas

### Plant Onboarding Request Schema

When a user instantiates a plant, the metadata is compiled and forwarded to the Gemini API using the `response_schema` option to enforce an immutable JSON mapping payload.

#### System Prompt

```text
You are an expert agronomist and regional master gardener specializing in Southeastern US micro-climates. Analyze the user's localized plant metadata, climate parameters, and planting setup to return a structured care sheet matching the target JSON schema precisely. Never include unformatted text outside the JSON output. Factor all localized geographic risks (e.g., specific soil, humidity variations, regional pest cadences) into the numeric parameters.
```

#### Enforced API Output JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PlantCareRules",
  "type": "object",
  "properties": {
    "care_rules": {
      "type": "object",
      "properties": {
        "watering_interval_days_dry_season": { "type": "integer" },
        "watering_interval_days_normal": { "type": "integer" },
        "fertilizing_interval_weeks": { "type": "integer" },
        "ideal_soil_moisture_depth_inches": { "type": "integer" },
        "days_to_maturity_estimate": { "type": "integer" }
      },
      "required": [
        "watering_interval_days_dry_season",
        "watering_interval_days_normal",
        "fertilizing_interval_weeks",
        "ideal_soil_moisture_depth_inches",
        "days_to_maturity_estimate"
      ]
    },
    "milestones": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "phase": { "type": "string" },
          "tip": { "type": "string" }
        },
        "required": ["phase", "tip"]
      }
    },
    "end_of_season": {
      "type": "object",
      "properties": {
        "estimated_final_harvest_month": { "type": "string" },
        "winter_prep_steps": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["estimated_final_harvest_month", "winter_prep_steps"]
    }
  },
  "required": ["care_rules", "milestones", "end_of_season"]
}
```

---

## 5. UI/UX Interaction Maps (Claude Prototype Blueprint)

### Canonical Design References

The implementation should treat the following files as the authoritative design layer for layout, tokens, components, and interaction detail:

- [01-design-system.md](/Users/caseyburesh/caseyrepo/Garden%20Tracker/01-design-system.md): typography, color tokens, spacing, border rules, iconography, motion, accessibility, and AI surface styling
- [02-component-library.md](/Users/caseyburesh/caseyrepo/Garden%20Tracker/02-component-library.md): full component specs for dashboard, plant detail, task controls, moisture indicators, and the plant diagnostics chatbox panel
- [garden_tracker_responsive_mockup.html](/Users/caseyburesh/caseyrepo/Garden%20Tracker/garden_tracker_responsive_mockup.html): responsive reference implementation for layout behavior, desktop/mobile view switching, and the current plant-detail panel composition

If this specification and those design files ever differ, use the design system and component library as the source of truth for frontend implementation details, and use this document as the product and architecture source of truth.

### View A: The Dashboard & Interactive Logs

- **The Plant Matrix:** Cards representing each active garden asset grouped by zone ("Ground Plot" vs. "Container Zone"). Potted assets display accelerated dryout alert indicators.
- **The Quick-Action Hub:** One-click, single-tap buttons attached to each plant item to execute routine updates. Tapping "Watered Today" immediately updates the locally stored log and computes a native JavaScript calculation (`Date.now() + (watering_interval_days * 86400000)`) to drive UI calendar warning states without invoking an API call.

### View B: Contextual AI Interfaces (The Plant Chatbox)

- **The Inline Multimodal Diagnostic Box:** Instead of a generic app-wide update workflow, each plant profile contains an embedded text/file input field. The user uploads an image along with an unstructured description (for example, "Leaf showing white spots under the tree").
- **The Patch Interaction Flow:** The background call passes the historical context plus the prompt to the AI. The resulting response renders conversational text to the user while optionally supplying a structured JSON data block designed to patch specific fields in the parent SQL row:

```json
{
  "patch_detected": true,
  "target_fields": {
    "watering_interval_days_normal": 3
  },
  "user_alert": "White patches are verified as overhead bird droppings, not powdery mildew. Care cycles are safe, but increase harvest scrubbing protocols."
}
```

---

## 6. Case Study: Seed Data (Current Real-World Garden State)

The frontend prototype and database seeds should copy the exact metrics of the user's running plot as of **June 6, 2026**.

### Ground Plot Profile

- **Cherry Tomatoes (Qty: 2):** ~6 ft tall; dual main split veins. Supported via a hybrid metal ring cage and heavy bamboo stakes. Status: Nearing first yield; fruit at base is fully sized, waiting to turn red. Notes: Heavily clustered with green fruit; under intense bird-dropping drop zone.
- **Brandywine Tomato (Qty: 1):** ~5 ft tall; dual main split veins. Supported by bamboo stakes. Status: Fruiting; several small fruit clusters present, far from mature size.
- **Beefsteak Tomato (Qty: 1):** ~4 to 4.5 ft tall. Supported by bamboo stakes. Status: Fruiting; exactly 2 tomatoes developing steadily.
- **Cucumbers (Qty: 2):** ~5 ft tall climbing vines. Supported by a white accordion lattice trellis combined with vertical bamboo poles. Status: Fruiting and blooming; 2 manually pollinated fruits tracked closely, 5+ unopened buds present.
- **Squash (Qty: 1):** Large, robust bush stabilized by a center bamboo anchor pole. Status: Fruiting and blooming. Notes: One 6-inch squash successfully harvested and frozen last week. 5-6 new baby fruits present (2 approaching bloom). Leaves are heavily covered in bird droppings (confirmed benign/non-pathological).
- **Green Bean Bush (Qty: 1):** Compact, lush bush positioned along the front edge of the log plot border. Status: High production. Notes: 20-25 beans harvested over the past week and stored in the refrigerator with paper towels. Continuous rapid flowering.
- **Cantaloupe (Qty: 1):** One 3 ft vine and one 1 ft vine. Planted downhill in the high-sun section (8-10 hours). Climbs a custom-engineered 7 ft structural bamboo and chicken-wire "tombstone" trellis. Status: Blooming. Notes: Awaiting plant maturity; no baby fruit sets visible yet. Mesh fruit support hammocks prepped.
- **Marigolds (Multi):** Bright orange companion flowers interplanted at tactical corners and plant bases (specifically flanking squash and tomatoes) for natural pest deterrence.

### Container Zone Profile

- **Black Tomato (Qty: 1):** ~1 ft tall. Planted 1 month late. Planted in a large white textured pot with a wooden split-rail piece used as a structural stake. Status: Early bloom phase. Notes: Recently repotted out of the ground plot to fix shallow, surface-level planting and promote deep root network establishment.
- **Watermelon (Qty: 1):** ~6 in. climbing vine. Planted 1 month late in a medium black nursery pot. Status: Vegetative stage. Notes: Recently repotted out of the ground plot to correct a shallow root depth issue.
- **Peppers (Qty: 2):** ~3-4 in. seedlings. Planted 1 month late in small grey starter pots, nested safely inside a protective pink clover-shaped multi-planter base unit. Status: Seedling/Vegetative stage. Notes: Rescued out of the ground plot due to shallow rooting issues.
- **Strawberry (Qty: 1):** Nested in a pink clover multi-planter module. Status: Stagnant. Notes: High-security isolation setup; placed dead-center on top of a covered backyard fire pit to act as a vertical moat barrier preventing ground critter consumption.

---

## 7. Active Task Backlog (Codex Implementation Milestones)

### Immediate / High Priority

- [ ] **Pollination Tracker Interface:** Build a manual tracking UI component for the squash and cucumber items that updates the state to "Manually Pollinated" and triggers a local countdown warning to check for fruit drop or successful set within 72 hours.
- [ ] **Black Tomato Bloom Monitor:** Build an instant milestone toggle for the Black Tomato. Checking `[x] Blooms Open` must push a dashboard tip emphasizing morning-hour electric toothbrush pollination.
- [ ] **Harvest Hygiene System Alerts:** Inject a persistent UI alert across all Ground Plot profiles stating: "Notice: Active overhead canopy requires exhaustive wash cycles for all open-air fruit."

### Medium Priority

- [ ] **Support Staking Warn Cycle:** Implement a rule flagging tomatoes exceeding 5 feet (Cherry & Brandywine) to remind the user to source and place secondary structural T-posts before heavy fruit weight threatens the bamboo anchors.
- [ ] **Cantaloupe Trellis Training Alerts:** Create UI layout alerts to guide the user to check and weave the 3 ft and 1 ft cantaloupe vines into the bottom layers of the chicken-wire mesh.

### Low Priority / Seasonal

- [ ] **Cantaloupe Hammock Trigger:** Program a log tracker that flags when cantaloupe fruit logs transition from "Baby Set" to "Active Sizing" to trigger a task to construct mesh or pantyhose support hammocks.

---

## 8. Deployment & Runtime Configuration

The production rollout should be prepared for a Cloudflare-hosted deployment using a dedicated garden subdomain, with Gemini powering contextual AI features and either Supabase or Firebase available for backend services depending on the final implementation split.

### Expected environment groups

- **Application runtime:** base URL, environment mode, session secrets, timezone, and location defaults
- **Gemini / Google AI:** API key plus model routing values for text and multimodal analysis
- **Cloudflare:** account, zone, subdomain, Worker, and optional storage/database services such as R2, D1, KV, and Images
- **Supabase:** project URL, anon key, service role key, direct database URL, and storage bucket configuration
- **Firebase:** project ID, web app config, admin SDK credentials, and storage bucket values
- **Optional operations:** email delivery, error monitoring, and analytics/logging providers

Create and maintain these values in `.env` for local setup, then mirror the production subset into Cloudflare environment variables and secret storage before cutover.
