import { firefox } from 'playwright';
const page = await (await firefox.launch({ headless: true })).newPage();
page.on('console', m => console.log('[browser]', m.type(), m.text()));
await page.goto('http://localhost:8080/ixil/index.html', { waitUntil: 'networkidle' });

// Test: section manager click
console.log('\n-- Section manager debug --');
const hdr = await page.$('#projects header.category');
console.log('header found:', !!hdr);
console.log('has sm-hint:', !!(await hdr?.$('.sm-hint')));
console.log('has section-manager-trigger class:', await hdr?.evaluate(el => el.classList.contains('section-manager-trigger')));

await hdr?.click();
await page.waitForTimeout(400);

const floating = await page.$('.editor-floating');
console.log('floating el found:', !!floating);
const display = await floating?.evaluate(el => el.style.display);
console.log('floating display:', display);

// Test: create a project then try to edit it
console.log('\n-- Create + Edit debug --');
await hdr?.click();
await page.waitForTimeout(300);

const newItemBtn = await page.$('.editor-floating button');
const btns = await page.$$('.editor-floating button');
for (const b of btns) console.log('  floating btn:', await b.textContent());

const newBtn = btns.find(async b => (await b.textContent()).includes('New'));
// find + New item button
let newItemBtnFinal = null;
for (const b of btns) { if ((await b.textContent()).includes('New')) { newItemBtnFinal = b; break; } }
if (newItemBtnFinal) {
  await newItemBtnFinal.click();
  await page.waitForTimeout(300);
  const form = await page.$('.editor-desc-popup, [class*="desc-popup"]');
  console.log('create form opened:', !!form);
  const formInputs = await page.$$('input[type=text]');
  console.log('input count:', formInputs.length);
  if (formInputs[0]) await formInputs[0].fill('Test Project');
  const saveBtn = await page.$('button.save');
  console.log('save btn:', await saveBtn?.textContent());
  if (saveBtn) await saveBtn.click();
  await page.waitForTimeout(300);

  // find the custom item
  const customItem = await page.$('[data-custom="true"]');
  console.log('custom item created:', !!customItem);
  if (customItem) {
    await customItem.click();
    await page.waitForTimeout(300);
    const panelBtns = await page.$$('.editor-floating button');
    console.log('panel buttons after clicking custom item:');
    for (const b of panelBtns) console.log(' ', await b.textContent());
  }
}

process.exit(0);
