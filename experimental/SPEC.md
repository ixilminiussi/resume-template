# Experimental CV Editor — Feature Specification

This document describes the capabilities that the editor must support. It is intentionally free of implementation details, UI paradigms, library choices, or references to any existing codebase. You are free to design the architecture, interaction model, and visual language from scratch.

---

## What this tool is

A browser-based, single-page CV editor. The CV is displayed live inside the page. The user can control which content is shown, how it is ordered, and how it looks — and then print/save it as a PDF. All state is persisted locally (and partially to a remote server for one feature). There is no login.

The CV belongs to a specific person (Ixil Miniussi, a game/render programmer). The content is fixed — sections, entries, and items are predefined. The editor does not allow free-form text editing of the CV body, except in specific places noted below.

---

## CV Structure

The CV has two columns.

**Left column** contains: Education, Skills, Hobbies, and a Contact block.
**Right column** contains: Projects, Work Experience, and a Banner (name + job title + optional contact block).

The contact information can appear in one of three positions: the left column stack, a bottom row spanning the full width, or inside the banner on the right. Exactly one of these is active at a time.

---

## Content Panel Capabilities

### Sections
- The order of sections within each column can be changed by the user.

### Photo
- A profile photo can be shown or hidden.

### Contact
- The layout position can be chosen: left column stack, bottom row, or banner.
- Each contact item can be individually shown or hidden. Items are: Phone, Address, Email, LinkedIn, GitHub, Itch.io.
- The order of contact items can be changed.

### Education
- Two institutions are present: ArtFX and University of Southampton.
- For each institution, individual course/module items can be shown or hidden.
- Custom items can be added to each institution.
- Any item (default or custom) can be deleted.
- The order of items within each institution can be changed.

### Skills
- Skills are organised into named categories (e.g. Languages, Rendering, Engine Programming, etc.).
- Each category row can be shown or hidden as a whole.
- Within a category, individual skills can be shown or hidden.
- Custom skills can be added to any category.
- Any skill (default or custom) can be deleted.
- The order of skills within a category can be changed.
- The order of categories themselves can be changed.

### Hobbies
- Individual hobby items can be shown or hidden.
- Custom hobbies can be added.
- Any hobby (default or custom) can be deleted.
- The order of hobbies can be changed.

### Projects
- Individual project blocks can be shown or hidden.
- The description text (in both English and French) of each project can be edited.
- The order of project blocks can be changed.

### Work Experience
- Individual work entries can be shown or hidden.
- The description text (in both English and French) of each entry can be edited.
- The order of entries can be changed.

---

## Styling Panel Capabilities

### Base Colors
7 named base colors can be set: Darker, Dark, Lightish, Light, Lightest, Accent, Complement. These drive the rest of the color system.

### Gradients
4 named gradients exist: Left Background, Banner, Grid Blocks, Details. Each gradient has two color stops. For each stop, the following can be configured:
- Which base color it derives from
- Lightness override (0–100)
- Saturation shift (e.g. –50 to +50)

### Banner
- The banner text color can be set (chosen from the named base colors).
- The job title text displayed in the banner can be edited.

### Sizing — Left column
- Text sizes: four levels (very large, large, medium, small).
- Block horizontal padding.
- Gaps: top margin, section gap, title-bottom gap, block gap, skill gap, language gap.

### Sizing — Right column
- Text sizes: four levels (very large, large, medium, small).
- Banner top padding and contact gap.
- Block horizontal padding.
- Gaps: top margin, section gap, title-bottom gap, block gap, grid gap.
- Grid height.

---

## Color Picker

When setting a base color, a full-featured color picker is available. It must support:
- Visual hue + saturation/value selection.
- Direct hex input.
- Numeric channel inputs in both RGB and HSL modes.
- A history of recently used colors (up to 16) available as quick-select swatches.

---

## Palettes

A palette stores a set of base colors and gradient configurations (but not sizing or banner title).

- 5 built-in palettes are provided: B&W, Green, Forest, Forest 2, Castle.
- The current colors and gradients can be saved as a new named palette.
- Any palette can be loaded (applies colors and gradients; sizing and banner title are left untouched).
- Palettes can be renamed or deleted.

---

## Templates

A template stores the full layout state: all content toggles, contact layout choice, custom items, deleted items, section order, item order, skill category order, sizing values, banner title, and custom descriptions.

- A "Default" template is provided as a starting point.
- The current layout state can be saved as a new named template.
- Any template can be loaded (applies layout state; current palette and colors are left untouched).
- Templates can be renamed or deleted.
- Templates are persisted to a remote Cloudflare D1 database via a simple REST API (`GET/POST/PATCH/DELETE /api/templates?owner=<id>`). They are fetched on page load and upserted/deleted as the user makes changes.

---

## Language

- All labeled content in the CV can be toggled between English and French.
- The French translations are predefined for all default content.
- Where custom descriptions have been entered (see Projects and Work Experience above), the custom EN/FR text is used instead.

---

## Export / Import

- All settings (content state, palettes, templates, color history) can be exported as a single JSON file.
- A previously exported JSON file can be imported to restore all settings.

---

## Persistence

All state is automatically saved to `localStorage` after every change and restored on page load. This includes content toggles, ordering, theme, custom items, deleted items, and custom descriptions.

---

## Output

The CV can be printed / saved as a PDF via the browser's print dialog. No editor UI should appear in the printed output.
