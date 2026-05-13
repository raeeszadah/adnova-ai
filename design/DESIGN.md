# Design System Document

## 1. Overview & Creative North Star: "The Cinematic Canvas"
This design system is built to elevate the AI video creation process from a utility to an editorial experience. The Creative North Star, **The Cinematic Canvas**, dictates that every screen should feel like a high-definition frame: balanced, intentional, and premium. 

We are moving away from the "generic SaaS" look characterized by rigid grids and heavy borders. Instead, we utilize **intentional asymmetry**, high-contrast typographic scales, and layered depth to guide the user’s eye. This system treats the user interface not as a collection of boxes, but as a series of sophisticated, interactive surfaces that reflect the high-tech precision of AdNova AI’s video generation engine.

---

## 2. Colors & Tonal Architecture
The palette is rooted in a deep, authoritative blue (`primary: #004ac6`) and a crisp, airy environment (`background: #f7f9fb`). 

### The "No-Line" Rule
To achieve a high-end feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined through tonal shifts. A section should be distinguished from the background by moving from `surface` to `surface-container-low` or `surface-container-high`. This creates a seamless, modern flow that feels architectural rather than "boxed in."

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
- **Level 0:** `surface` (The base environment).
- **Level 1:** `surface-container-low` (Secondary content zones).
- **Level 2:** `surface-container-lowest` (Interactive cards or "raised" paper elements).
- **Nesting:** When placing a container within a container, always shift the tone. For example, a video settings panel (`surface-container-low`) should host input fields that use `surface-container-lowest` to create a natural, inset look.

### The "Glass & Gradient" Rule
For elements that require high prominence (e.g., "Generate Video" buttons or featured avatars), use subtle gradients transitioning from `primary` (#004ac6) to `primary_container` (#2563eb). For floating overlays or navigation bars, implement **Glassmorphism**: use semi-transparent `surface_container_lowest` with a 12px to 20px `backdrop-blur` to allow underlying content to softly bleed through.

---

## 3. Typography: The Editorial Voice
We utilize a dual-typeface strategy to balance "High-Tech" with "Highly Readable."

- **The Display Voice (Manrope):** Used for `display` and `headline` scales. Manrope’s geometric yet friendly curves provide a modern, AI-forward aesthetic. Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for hero headlines to command authority.
- **The Functional Voice (Inter):** Used for `title`, `body`, and `label` scales. Inter is the industry standard for legibility. 
- **Hierarchy via Contrast:** Create drama by pairing a `headline-sm` with a `label-md` in all-caps. This high-low mixing is a hallmark of premium editorial design.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often "dirty." In this system, we use **Ambient Shadows** and **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by stacking. A card doesn't need a shadow if it is `surface-container-lowest` sitting on top of `surface-container-high`.
- **Ambient Shadows:** For floating modals, use a multi-layered shadow: 
  - *Shadow 1:* 0px 4px 20px rgba(0, 0, 0, 0.04)
  - *Shadow 2:* 0px 10px 40px rgba(37, 99, 235, 0.06) (Note the subtle `primary` tint to the shadow).
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` at 20% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** High-gloss. Use a linear gradient (`primary` to `primary_container`). Border radius: `full`.
- **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
- **Tertiary:** Transparent background, `primary` text. Use for low-emphasis actions like "Cancel."

### Cards & Lists
- **Rule:** Absolute prohibition of divider lines. 
- **Style:** Use vertical whitespace (from the spacing scale) and `surface-container` shifts to separate items. A list item in a video queue should be a subtle `surface-container-low` shape on a `surface` background.

### Forms & Input Fields
- **Default State:** `surface-container-lowest` background with a `Ghost Border`.
- **Focus State:** Transition the border to `accent` (#38BDF8) and add a 4px outer glow of the same color at 15% opacity.
- **Micro-copy:** Use `label-sm` for helper text, ensuring it is always aligned with the `on-surface-variant` color for a soft, secondary feel.

### Progress Indicators (The Generation Bar)
- For AI video rendering, use a "pulsing" gradient. The track should be `surface-container-highest`, and the indicator should be a gradient of `accent` to `primary`. Add a subtle `backdrop-blur` if the progress bar overlays a video thumbnail.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use whitespace as a functional element to group related AI settings.
- **Do** use `accent` (#38BDF8) sparingly—only for "Success" states, progress highlights, or primary CTAs to maintain its visual impact.
- **Do** use `rounded-xl` (1.5rem) for large video preview containers to soften the "tech" feel.

### Don’t:
- **Don’t** use pure black (#000000) for text. Always use `on-surface` (#191c1e) or `text` (#0F172A) to maintain tonal depth.
- **Don’t** use 1px dividers to separate list items; use 8px–12px of vertical padding instead.
- **Don’t** use standard "drop shadows." If it looks like a default Photoshop shadow, it is wrong. Use the ambient, tinted shadows described in Section 4.
- **Don’t** crowd the interface. If an AI tool has 20 settings, use progressive disclosure (e.g., an "Advanced Settings" accordion) to keep the "Cinematic Canvas" clean.