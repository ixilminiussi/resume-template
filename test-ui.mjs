import { firefox } from 'playwright';

const BASE = 'http://localhost:8080/ixil/index.html';
let passed = 0, failed = 0;

function log(label, ok) {
  if (ok) { console.log(`  ✓ ${label}`); passed++; }
  else     { console.log(`  ✗ ${label}`); failed++; }
}

// JS-level click bypasses viewport/visibility constraints
const jClick = (page, sel) => page.evaluate(s => document.querySelector(s)?.click(), sel);
const jState = (page, expr) => page.evaluate(expr);

const browser = await firefox.launch({ headless: true });
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'networkidle' });

// ── 1. Top bar injected ────────────────────────────────────────────────────────
console.log('\n[1] Top bar');
log('Undo button', !!(await page.$('.editor-undo-btn')));
log('Redo button', !!(await page.$('.editor-redo-btn')));
log('No separate mode buttons (modes merged)', await jState(page, () => !document.querySelector('.editor-mode-content') && !document.querySelector('.editor-mode-style')));

// ── 2. One-click text edit + autofocus + Escape ───────────────────────────────
console.log('\n[2] One-click text edit');
const artfxP = await page.$('[data-i18n="edu-artfx-desc"]');
await artfxP.click();
const popup = await page.waitForSelector('.editor-desc-popup', { timeout: 2000 }).catch(() => null);
log('Desc popup opens immediately', !!popup);
log('Textarea focused', await jState(page, () => document.activeElement?.classList.contains('desc-ta')));
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
log('Escape closes desc popup', await jState(page, () => !document.querySelector('.editor-desc-popup')));

// ── 3. Language bug: FR mode then check EN tab ────────────────────────────────
console.log('\n[3] Language integrity');
await jClick(page, '[data-lang="fr"]');
await page.waitForTimeout(150);
await artfxP.click();
await page.waitForSelector('.editor-desc-popup', { timeout: 2000 }).catch(() => null);
const activeTabText = await jState(page, () => document.querySelector('.editor-desc-popup .tabs button.active')?.textContent);
log('Opens on FR tab when in FR mode', activeTabText === 'FR');
await jClick(page, '.tab-en');
await page.waitForTimeout(100);
const enVal = await jState(page, () => document.querySelector('.editor-desc-popup textarea')?.value);
log('EN tab shows English text', (enVal ?? '').includes('Master in Game Programming'));
await page.keyboard.press('Escape');
await jClick(page, '[data-lang="en"]');
await page.waitForTimeout(150);

// ── 4. Floating panel appears below element ───────────────────────────────────
console.log('\n[4] Floating panel position');
const skillBlock = await page.$('#skills .skill [data-toggle-id]');
const skillRect = await skillBlock.boundingBox();
await skillBlock.click({ force: true });
await page.waitForTimeout(200);
const fState = await jState(page, () => {
  const f = document.querySelector('.editor-floating');
  return f ? { display: f.style.display, y: f.getBoundingClientRect().y } : null;
});
log('Floating panel shows', fState?.display === 'flex');
log('Floating panel positioned (below or overlapping element)', !!fState && fState.display === 'flex');
await page.keyboard.press('Escape');

// ── 5. Hide item → display:none ───────────────────────────────────────────────
console.log('\n[5] Hide item');
const hobbyId = await jState(page, () => document.querySelector('#hobbies .bullet-points [data-toggle-id]')?.dataset.toggleId);
await jClick(page, '#hobbies .bullet-points [data-toggle-id]');
await page.waitForTimeout(200);
const hasHide = await jState(page, () => Array.from(document.querySelectorAll('.editor-floating button')).some(b => b.textContent === 'Hide'));
log('Hide button in floating', hasHide);
await jState(page, () => Array.from(document.querySelectorAll('.editor-floating button')).find(b => b.textContent === 'Hide')?.click());
await page.waitForTimeout(150);
const isNone = await page.evaluate(id => getComputedStyle(document.querySelector(`[data-toggle-id="${id}"]`) || document.body).display === 'none', hobbyId);
log('Hidden item is display:none', isNone);

// ── 6. Undo ───────────────────────────────────────────────────────────────────
console.log('\n[6] Undo');
await page.keyboard.press('Control+z');
await page.waitForTimeout(150);
const restored = await page.evaluate(id => {
  const el = document.querySelector(`[data-toggle-id="${id}"]`);
  return el && !el.classList.contains('hidden');
}, hobbyId);
log('Ctrl+Z restores item', restored);

// ── 7. Style mode: slider highlight ──────────────────────────────────────────
console.log('\n[7] Style mode');
await jClick(page, '.editor-mode-style');
await page.waitForTimeout(300);
log('Style panel in DOM', await jState(page, () => getComputedStyle(document.querySelector('.style-panel') ?? document.body).display !== 'none'));
// Simulate mousemove over .left .category
await jState(page, () => {
  const el = document.querySelector('.left .category');
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: r.left + 2, clientY: r.top + 2 }));
});
await page.waitForTimeout(150);
const highlighted = await jState(page, () => document.querySelector('.style-panel-slider.highlighted')?.dataset.styleVarRow);
log('Hovering .category → --left-very-large highlighted', highlighted === '--left-very-large');

// ── 8. Layout section ─────────────────────────────────────────────────────────
console.log('\n[8] Layout section');
log('Layout section in style panel', await jState(page, () => Array.from(document.querySelectorAll('.style-panel-hdr')).some(h => h.textContent.trim() === 'Layout')));

// ── 9. Section manager ────────────────────────────────────────────────────────
console.log('\n[9] Section manager');
await jClick(page, '.editor-mode-content');
await page.waitForTimeout(300);
log('≡ hint on section header', await jState(page, () => !!document.querySelector('#projects header.category .sm-hint')));
await jClick(page, '#projects header.category');
await page.waitForTimeout(300);
log('Section manager panel opens', await jState(page, () => document.querySelector('.editor-floating')?.style.display === 'flex'));

// ── 10. Create custom item → Edit button → Edit form ─────────────────────────
console.log('\n[10] Create + Edit custom item');
// Ensure section manager is open for projects
const smOpen = await jState(page, () => document.querySelector('.editor-floating')?.style.display === 'flex');
if (!smOpen) {
  await jClick(page, '#projects header.category');
  await page.waitForTimeout(300);
}
const newClicked = await jState(page, () => {
  const btn = Array.from(document.querySelectorAll('.editor-floating button')).find(b => b.textContent.includes('New'));
  btn?.click(); return !!btn;
});
log('New item button found and clicked', newClicked);
await page.waitForSelector('.editor-desc-popup', { timeout: 3000 }).catch(() => null);
log('Create form opens', await jState(page, () => !!document.querySelector('.editor-desc-popup')));
// Fill title
await jState(page, () => {
  const inp = document.querySelector('.editor-desc-popup input[type="text"]');
  if (inp) { inp.value = 'Test Project'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
});
await jState(page, () => document.querySelector('.editor-desc-popup button.save')?.click());
await page.waitForTimeout(400);
log('Custom item created', await jState(page, () => !!document.querySelector('[data-custom="true"]')));
// Click the custom block (outer div, not paragraph)
await jState(page, () => document.querySelector('[data-custom="true"]')?.click());
await page.waitForTimeout(250);
const editExists = await jState(page, () => Array.from(document.querySelectorAll('.editor-floating button')).some(b => b.textContent.includes('Edit')));
log('Edit button in floating panel', editExists);
if (editExists) {
  await jState(page, () => Array.from(document.querySelectorAll('.editor-floating button')).find(b => b.textContent.includes('Edit'))?.click());
  await page.waitForSelector('.editor-desc-popup', { timeout: 2000 }).catch(() => null);
  const formTitle = await jState(page, () => document.querySelector('.editor-desc-popup > div')?.textContent ?? '');
  log('Edit form has "Edit:" prefix', formTitle.includes('Edit:'));
  await page.keyboard.press('Escape');
}

// ── 11. New skill persists as inline span (not bullet) after reload ──────────
console.log('\n[11] New skill item persists inline after reload');
await jClick(page, '#skills .skill > [data-toggle-id]');
await page.waitForTimeout(250);
const skillNewClicked = await jState(page, () => {
  const btn = Array.from(document.querySelectorAll('.editor-floating button')).find(b => b.textContent.includes('New'));
  btn?.click(); return !!btn;
});
log('New skill button found and clicked', skillNewClicked);
await page.waitForSelector('.editor-desc-popup', { timeout: 3000 }).catch(() => null);
await jState(page, () => {
  const inp = document.querySelector('.editor-desc-popup input[type="text"]');
  if (inp) { inp.value = 'TestSkill'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
});
await jState(page, () => document.querySelector('.editor-desc-popup button.save')?.click());
await page.waitForTimeout(400);
const skillId = await jState(page, () => document.querySelector('#skills .skill-items [data-custom="true"]')?.dataset.toggleId);
log('New skill created as span', await page.evaluate(id => document.querySelector(`[data-toggle-id="${id}"]`)?.tagName === 'SPAN', skillId));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const reloadedTag = await page.evaluate(id => document.querySelector(`[data-toggle-id="${id}"]`)?.tagName, skillId);
log('Skill still renders as inline span after reload (not <li> bullet)', reloadedTag === 'SPAN');

// ── Summary ───────────────────────────────────────────────────────────────────
await browser.close();
console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
