# CV Editor — Developer Notes

## Testing requirement (mandatory)

**Every feature change to `editor.js` must be verified by running the Playwright UI test suite before reporting it as done.**

The test suite simulates real user interactions through the browser — mouse clicks, keyboard input, hover events — using headless Firefox via Playwright. It is the only accepted form of verification for frontend behaviour. Type checking and static analysis are not sufficient.

### Run tests

Ensure the local server is running (started from `experimental/`):
```
python3 -m http.server 8080
```

Then run:
```
node test-ui.mjs
```

All tests must pass (exit code 0) before a change is considered done.

### Adding tests

When adding a new editor feature, add a corresponding test section to `test-ui.mjs` that:
- Simulates the user interaction with `jClick` or `jState` (JS-level clicks bypass viewport constraints)
- Asserts the observable DOM outcome
- Uses `page.waitForSelector` for async UI transitions, not fixed `waitForTimeout` where avoidable

## Architecture

- `editor.js` — single IIFE, injected into any CV HTML page via `<script src="../editor.js">`
- No build step. Edit `editor.js` and `ixil/style.css` directly; `style.scss` is the source but must be kept in sync manually.
- State is persisted to `localStorage` under key `cv-editor-{cvId}`.
- Content editing (toggle/reorder/text) and style editing (sliders/colours) are always active simultaneously — there is no separate mode switch.

## Key functions

- `initContentHovers()` — registers click handlers on all toggle/editable elements
- `initStyleHovers()` — registers mousemove handler for slider highlighting
- `renderStylePanel()` — builds the right-side style panel
- `buildToggleControls(panel, el)` — floating panel for any toggleable item
- `openEditForm(el, cfg)` — pre-filled edit form for custom items
- `openDescEditor(el, key, opts)` — EN/FR textarea for text fields
- `pushUndo()` — call before any discrete state mutation
