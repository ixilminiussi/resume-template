// ===== Constants =====
const STORAGE_KEY = 'cv-toggle-state';
const TEMPLATE_KEY = 'cv-templates';
const FIXED_COLORS = { black: '#000000', white: '#ffffff' };
const BASE_KEYS = ['darker', 'dark', 'lightish', 'light', 'lightest', 'accent', 'complement'];
const PALETTE_KEYS = ['black', 'white', ...BASE_KEYS];
const GRADIENT_KEYS = ['leftbg', 'banner', 'grid', 'details'];

function buildDefaultGradients(darkness) {
	return {
		leftbg: { label: 'Left Background', angle: 160, stops: [
			{ base: 'darker', lightness: null, satShift: 0 },
			{ base: 'darker', lightness: darkness, satShift: 0 }
		]},
		banner: { label: 'Banner', angle: 160, stops: [
			{ base: 'accent', lightness: null, satShift: 0 },
			{ base: 'accent', lightness: 70, satShift: 0 }
		]},
		grid: { label: 'Grid Blocks', angle: 150, stops: [
			{ base: 'accent', lightness: 90, satShift: 0 },
			{ base: 'complement', lightness: 78, satShift: 0 }
		]},
		details: { label: 'Details', angle: 150, stops: [
			{ base: 'complement', lightness: 90, satShift: 0 },
			{ base: 'accent', lightness: 93, satShift: -20 }
		]}
	};
}

const DEFAULT_THEME = {
	colors: { darker: '#000000', dark: '#000000', lightish: '#ffffff', light: '#ffffff', lightest: '#ffffff', accent: '#d6ccc0', complement: '#d6ccc0' },
	gradients: buildDefaultGradients(15),
	banner: { textColor: 'darker', title: 'Render / Engine Programmer' },
	sizing: {}
};

const BUILTIN_TEMPLATES = {
	castlebw: { version: 1, label: 'B&W', theme: {
		colors: { darker: '#000000', dark: '#000000', lightish: '#ffffff', light: '#ffffff', lightest: '#ffffff', accent: '#d6ccc0', complement: '#d6ccc0' },
		gradients: buildDefaultGradients(15),
		banner: { textColor: 'darker', title: 'Render / Engine Programmer' },
		sizing: {}
	}},
	green: { version: 1, label: 'Green', theme: {
		colors: { darker: '#2c2424', dark: '#594949', lightish: '#aca4a4', light: null, lightest: '#ffffff', accent: '#6d7755', complement: '#6d7755' },
		gradients: buildDefaultGradients(14),
		banner: { textColor: 'darker', title: 'Render / Engine Programmer' },
		sizing: {}
	}},
	forest: { version: 1, label: 'Forest', theme: {
		colors: { darker: '#0c1519', dark: '#162127', lightish: '#acb0a8', light: '#f1efe7', lightest: '#ffffff', accent: '#dc9f5a', complement: '#a85b15' },
		gradients: buildDefaultGradients(17),
		banner: { textColor: 'darker', title: 'Render / Engine Programmer' },
		sizing: {}
	}},
	forest2: { version: 1, label: 'Forest 2', theme: {
		colors: { darker: '#101918', dark: '#283e33', lightish: '#eece90', light: '#f1efe7', lightest: '#ffffff', accent: '#b3642e', complement: '#b3642e' },
		gradients: buildDefaultGradients(17),
		banner: { textColor: 'darker', title: 'Render / Engine Programmer' },
		sizing: {}
	}},
	castle: { version: 1, label: 'Castle', theme: {
		colors: { darker: '#2c2d32', dark: '#443838', lightish: '#eece90', light: '#f1efe7', lightest: '#ffffff', accent: '#5b2f30', complement: '#e0bb6a' },
		gradients: buildDefaultGradients(17),
		banner: { textColor: 'darker', title: 'Render / Engine Programmer' },
		sizing: {}
	}}
};

// ===== Color utilities =====
function hexToHSL(hex) {
	hex = hex.replace('#', '');
	const r = parseInt(hex.substring(0, 2), 16) / 255;
	const g = parseInt(hex.substring(2, 4), 16) / 255;
	const b = parseInt(hex.substring(4, 6), 16) / 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;
	if (max === min) { h = s = 0; }
	else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
			case g: h = ((b - r) / d + 2) / 6; break;
			case b: h = ((r - g) / d + 4) / 6; break;
		}
	}
	return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
	h /= 360; s /= 100; l /= 100;
	let r, g, b;
	if (s === 0) { r = g = b = l; }
	else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1; if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = x => {
		const hx = Math.round(x * 255).toString(16);
		return hx.length === 1 ? '0' + hx : hx;
	};
	return '#' + toHex(r) + toHex(g) + toHex(b);
}

function setLightness(hex, lightness) {
	const hsl = hexToHSL(hex);
	return hslToHex(hsl.h, hsl.s, lightness);
}

function desaturateHex(hex, amount) {
	const hsl = hexToHSL(hex);
	return hslToHex(hsl.h, Math.max(0, hsl.s - amount), hsl.l);
}

function resolveColor(key, colors) {
	if (key in FIXED_COLORS) return FIXED_COLORS[key];
	return colors[key] || '#000000';
}

function computeStopColor(stop, colors) {
	const baseHex = resolveColor(stop.base, colors);
	const hsl = hexToHSL(baseHex);
	const l = (stop.lightness !== null && stop.lightness !== undefined) ? stop.lightness : hsl.l;
	const s = Math.max(0, Math.min(100, hsl.s + (stop.satShift || 0)));
	return hslToHex(hsl.h, s, l);
}

function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function migrateV0(t) {
	const colors = { ...t.colors };
	delete colors.darkness;
	return {
		version: 1,
		label: t.label,
		theme: {
			colors: colors,
			gradients: t.gradients || buildDefaultGradients(t.colors.darkness || 15),
			banner: {
				textColor: t.bannerTextColor || 'darker',
				title: t.bannerTitle || 'Render / Engine Programmer'
			},
			sizing: t.sizingVars || {}
		}
	};
}

// ===== DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("save-pdf").addEventListener("click", () => {
		window.print();
	});

	const page = document.getElementById('page');
	const radios = document.querySelectorAll('.sidebar-left input[type="radio"][name="contact-layout"]');

	// Prevent checkbox clicks inside <summary> from toggling the <details>
	document.querySelectorAll('summary input[type="checkbox"]').forEach(cb => {
		cb.addEventListener('click', e => e.stopPropagation());
	});

	// Build default state from HTML checked attributes
	const defaults = {};
	document.querySelectorAll('.sidebar-left input[type="checkbox"]').forEach(cb => {
		defaults[cb.dataset.target] = cb.hasAttribute('checked');
	});
	const defaultLayout = 'left';

	// Load saved state, merging with defaults
	let saved = {};
	try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}
	const state = { ...defaults, ...saved };
	if (!state._contactLayout) state._contactLayout = defaultLayout;
	if (!state._customItems) state._customItems = [];
	if (!state._deletedDefaults) state._deletedDefaults = [];

	// --- Left sidebar helpers ---
	function getPageContainer(parent, type) {
		if (type === 'skill') {
			const block = document.querySelector('[data-toggle-id="' + parent + '"]');
			return block ? block.querySelector('.skill-items') : null;
		}
		if (type === 'hobby') {
			return document.querySelector('#hobbies .bullet-points');
		}
		if (type === 'class') {
			if (parent === 'edu-artfx') {
				return document.querySelector('#education .block:nth-child(1) .list');
			}
			if (parent === 'edu-soton') {
				return document.querySelector('#education .block:nth-child(2) .list');
			}
		}
		return null;
	}

	function createPageElement(id, text, type) {
		if (type === 'skill') {
			const span = document.createElement('span');
			span.dataset.toggleId = id;
			span.textContent = text;
			return span;
		}
		if (type === 'hobby') {
			const li = document.createElement('li');
			li.dataset.toggleId = id;
			const span = document.createElement('span');
			span.textContent = text;
			li.appendChild(span);
			return li;
		}
		if (type === 'class') {
			const li = document.createElement('li');
			li.dataset.toggleId = id;
			const p = document.createElement('p');
			p.textContent = text;
			li.appendChild(p);
			return li;
		}
		return null;
	}

	function createSidebarLabel(id, text, sidebarGroup) {
		const label = document.createElement('label');
		const cb = document.createElement('input');
		cb.type = 'checkbox';
		cb.dataset.target = id;
		cb.checked = true;
		label.appendChild(cb);
		label.appendChild(document.createTextNode(' ' + text + ' '));
		const del = document.createElement('button');
		del.className = 'delete-btn';
		del.dataset.delete = id;
		del.textContent = '\u00d7';
		label.appendChild(del);
		const addRow = sidebarGroup.querySelector('.add-row');
		sidebarGroup.insertBefore(label, addRow);
		cb.addEventListener('change', () => {
			state[id] = cb.checked;
			applyState();
			saveState();
		});
		del.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			deleteItem(id);
		});
	}

	function deleteItem(id) {
		const customIdx = state._customItems.findIndex(item => item.id === id);
		if (customIdx !== -1) {
			state._customItems.splice(customIdx, 1);
		} else {
			if (!state._deletedDefaults.includes(id)) {
				state._deletedDefaults.push(id);
			}
		}
		delete state[id];
		document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => el.remove());
		const cb = document.querySelector('.sidebar-left input[data-target="' + id + '"]');
		if (cb) {
			const label = cb.closest('label');
			if (label) label.remove();
		}
		saveState();
	}

	function addItem(parent, type, text) {
		const id = 'custom-' + Date.now();
		const container = getPageContainer(parent, type);
		if (!container) return;
		const el = createPageElement(id, text, type);
		container.appendChild(el);
		const sidebarGroup = document.querySelector('[data-add-section="' + parent + '"]');
		if (sidebarGroup) {
			createSidebarLabel(id, text, sidebarGroup);
		}
		state[id] = true;
		state._customItems.push({ id, text, parent, type });
		applyState();
		saveState();
	}

	// Restore custom items from localStorage
	state._customItems.forEach(item => {
		const container = getPageContainer(item.parent, item.type);
		if (!container) return;
		const el = createPageElement(item.id, item.text, item.type);
		container.appendChild(el);
		const sidebarGroup = document.querySelector('[data-add-section="' + item.parent + '"]');
		if (sidebarGroup) {
			createSidebarLabel(item.id, item.text, sidebarGroup);
		}
		if (!(item.id in state)) state[item.id] = true;
	});

	// Apply deleted defaults
	state._deletedDefaults.forEach(id => {
		document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => el.remove());
		const cb = document.querySelector('.sidebar-left input[data-target="' + id + '"]');
		if (cb) {
			const label = cb.closest('label');
			if (label) label.remove();
		}
		delete state[id];
	});

	function applyState() {
		for (const [id, visible] of Object.entries(state)) {
			if (id.startsWith('_') || id.startsWith('contact-layout-')) continue;
			document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => {
				el.classList.toggle('hidden', !visible);
			});
		}
		const layout = state._contactLayout;
		document.querySelectorAll('[data-toggle-id="contact-layout-left"]').forEach(el => {
			el.classList.toggle('hidden', layout !== 'left');
		});
		document.querySelectorAll('[data-toggle-id="contact-layout-bottom"]').forEach(el => {
			el.classList.toggle('hidden', layout !== 'bottom');
		});
		document.querySelectorAll('.sidebar-left input[type="checkbox"]').forEach(cb => {
			if (cb.dataset.target) cb.checked = !!state[cb.dataset.target];
		});
		radios.forEach(r => { r.checked = (r.value === layout); });
	}

	function saveState() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}

	// Wire up left sidebar
	document.querySelectorAll('.sidebar-left input[type="checkbox"]').forEach(cb => {
		cb.addEventListener('change', () => {
			state[cb.dataset.target] = cb.checked;
			applyState();
			saveState();
		});
	});

	radios.forEach(r => {
		r.addEventListener('change', () => {
			state._contactLayout = r.value;
			applyState();
			saveState();
		});
	});

	document.querySelectorAll('.sidebar-left .delete-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			deleteItem(btn.dataset.delete);
		});
	});

	document.querySelectorAll('.sidebar-left .add-row').forEach(row => {
		const group = row.closest('[data-add-section]');
		if (!group) return;
		const parent = group.dataset.addSection;
		const type = group.dataset.addType;
		const input = row.querySelector('.add-input');
		const btn = row.querySelector('.add-btn');

		function doAdd() {
			const text = input.value.trim();
			if (!text) return;
			addItem(parent, type, text);
			input.value = '';
		}

		btn.addEventListener('click', doAdd);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				doAdd();
			}
		});
	});

	// ==========================================
	// RIGHT SIDEBAR — Theme
	// ==========================================

	// Load custom templates + migrate v0 → v1
	let customTemplates = {};
	try { customTemplates = JSON.parse(localStorage.getItem(TEMPLATE_KEY)) || {}; } catch (e) {}
	let templatesMigrated = false;
	for (const key of Object.keys(customTemplates)) {
		if (!customTemplates[key].version) {
			customTemplates[key] = migrateV0(customTemplates[key]);
			templatesMigrated = true;
		}
	}
	function saveTemplates() { localStorage.setItem(TEMPLATE_KEY, JSON.stringify(customTemplates)); }
	if (templatesMigrated) saveTemplates();

	// Theme state init + migration from old scattered keys
	if (!state._theme && state._colors) {
		state._theme = {
			colors: { ...state._colors },
			gradients: state._gradients ? deepClone(state._gradients) : buildDefaultGradients(state._colors.darkness || 15),
			banner: {
				textColor: state._bannerTextColor || 'darker',
				title: state._bannerTitle || 'Render / Engine Programmer'
			},
			sizing: state._sizingVars || {}
		};
		delete state._colors;
		delete state._gradients;
		delete state._bannerTextColor;
		delete state._bannerTitle;
		delete state._sizingVars;
		delete state._derivedColors;
	}
	if (!state._theme) {
		state._theme = deepClone(DEFAULT_THEME);
	}
	delete state._theme.colors.darkness;
	if (!state._activeTemplate) state._activeTemplate = 'castlebw';

	// --- Core functions ---
	function applyTheme() {
		const t = state._theme;
		if (!t.colors.light) t.colors.light = setLightness(t.colors.darker, 90);
		BASE_KEYS.forEach(k => page.style.setProperty('--' + k, t.colors[k]));
		for (const gKey of GRADIENT_KEYS) {
			const grad = t.gradients[gKey];
			page.style.setProperty('--' + gKey + '-s1', computeStopColor(grad.stops[0], t.colors));
			page.style.setProperty('--' + gKey + '-s2', computeStopColor(grad.stops[1], t.colors));
		}
		page.style.setProperty('--complement-45', setLightness(t.colors.complement, 45));
		page.style.setProperty('--banner-text', resolveColor(t.banner.textColor, t.colors));
		const h2 = page.querySelector('.banner h2');
		if (h2) h2.textContent = t.banner.title;
		for (const [k, v] of Object.entries(t.sizing)) {
			page.style.setProperty(k, v);
		}
	}

	function syncThemeUI() {
		const t = state._theme;
		// Color pickers
		document.querySelectorAll('.sidebar-right .color-pickers input[data-color-var]').forEach(input => {
			const v = input.dataset.colorVar;
			if (t.colors[v]) input.value = t.colors[v];
		});
		// Gradient UI
		for (const gKey of GRADIENT_KEYS) {
			const grad = t.gradients[gKey];
			grad.stops.forEach((stop, si) => {
				const sel = document.querySelector('select[data-gradient="' + gKey + '"][data-stop="' + si + '"]');
				if (sel) sel.value = stop.base;
				const lSlider = document.querySelector('input[data-gradient="' + gKey + '"][data-stop="' + si + '"][data-field="lightness"]');
				if (lSlider) {
					const baseHSL = hexToHSL(resolveColor(stop.base, t.colors));
					lSlider.value = (stop.lightness !== null && stop.lightness !== undefined) ? stop.lightness : Math.round(baseHSL.l);
					const lVal = lSlider.parentElement.querySelector('.stop-value');
					if (lVal) lVal.textContent = lSlider.value + '%';
				}
				const sSlider = document.querySelector('input[data-gradient="' + gKey + '"][data-stop="' + si + '"][data-field="satShift"]');
				if (sSlider) {
					sSlider.value = stop.satShift || 0;
					const sVal = sSlider.parentElement.querySelector('.stop-value');
					if (sVal) sVal.textContent = sSlider.value;
				}
			});
		}
		updateGradientPreviews();
		// Banner UI
		const bannerSel = document.getElementById('banner-text-color');
		if (bannerSel) bannerSel.value = t.banner.textColor;
		const bannerInp = document.getElementById('banner-title-input');
		if (bannerInp) bannerInp.value = t.banner.title;
		// Sizing UI
		document.querySelectorAll('.sidebar-right .var-controls input[type="range"]').forEach(input => {
			const varName = input.dataset.var;
			const unit = input.dataset.unit;
			const savedVal = t.sizing[varName];
			if (savedVal) input.value = parseFloat(savedVal);
			const valSpan = input.parentElement.querySelector('.var-value');
			if (valSpan) valSpan.textContent = input.value + unit;
		});
	}

	function buildGradientEditorUI() {
		const container = document.getElementById('gradient-editors');
		container.innerHTML = '';
		for (const gKey of GRADIENT_KEYS) {
			const grad = state._theme.gradients[gKey];
			const editor = document.createElement('div');
			editor.className = 'gradient-editor';

			const label = document.createElement('span');
			label.className = 'gradient-label';
			label.textContent = grad.label;
			editor.appendChild(label);

			const preview = document.createElement('div');
			preview.className = 'gradient-preview';
			preview.dataset.gradient = gKey;
			editor.appendChild(preview);

			grad.stops.forEach((stop, si) => {
				const stopDiv = document.createElement('div');
				stopDiv.className = 'gradient-stop';

				// Base color dropdown
				const baseRow = document.createElement('div');
				baseRow.className = 'stop-row';
				const baseLabel = document.createElement('span');
				baseLabel.textContent = si === 0 ? 'Start' : 'End';
				baseRow.appendChild(baseLabel);
				const select = document.createElement('select');
				select.dataset.gradient = gKey;
				select.dataset.stop = si;
				select.dataset.field = 'base';
				PALETTE_KEYS.forEach(k => {
					const opt = document.createElement('option');
					opt.value = k;
					opt.textContent = k.charAt(0).toUpperCase() + k.slice(1);
					if (k === stop.base) opt.selected = true;
					select.appendChild(opt);
				});
				select.addEventListener('change', () => {
					state._theme.gradients[gKey].stops[si].base = select.value;
					onGradientChange();
				});
				baseRow.appendChild(select);
				stopDiv.appendChild(baseRow);

				// Lightness slider
				const lRow = document.createElement('div');
				lRow.className = 'stop-row';
				const lLabel = document.createElement('span');
				lLabel.textContent = 'Lightness';
				lRow.appendChild(lLabel);
				const lSlider = document.createElement('input');
				lSlider.type = 'range';
				lSlider.min = '0';
				lSlider.max = '100';
				lSlider.step = '1';
				lSlider.dataset.gradient = gKey;
				lSlider.dataset.stop = si;
				lSlider.dataset.field = 'lightness';
				const baseHSL = hexToHSL(resolveColor(stop.base, state._theme.colors));
				lSlider.value = (stop.lightness !== null && stop.lightness !== undefined) ? stop.lightness : Math.round(baseHSL.l);
				lRow.appendChild(lSlider);
				const lVal = document.createElement('span');
				lVal.className = 'stop-value';
				lVal.textContent = lSlider.value + '%';
				lRow.appendChild(lVal);
				lSlider.addEventListener('input', () => {
					state._theme.gradients[gKey].stops[si].lightness = parseInt(lSlider.value);
					lVal.textContent = lSlider.value + '%';
					onGradientChange();
				});
				stopDiv.appendChild(lRow);

				// Saturation shift slider
				const sRow = document.createElement('div');
				sRow.className = 'stop-row';
				const sLabel = document.createElement('span');
				sLabel.textContent = 'Sat. shift';
				sRow.appendChild(sLabel);
				const sSlider = document.createElement('input');
				sSlider.type = 'range';
				sSlider.min = '-50';
				sSlider.max = '50';
				sSlider.step = '1';
				sSlider.dataset.gradient = gKey;
				sSlider.dataset.stop = si;
				sSlider.dataset.field = 'satShift';
				sSlider.value = stop.satShift || 0;
				sRow.appendChild(sSlider);
				const sVal = document.createElement('span');
				sVal.className = 'stop-value';
				sVal.textContent = sSlider.value;
				sRow.appendChild(sVal);
				sSlider.addEventListener('input', () => {
					state._theme.gradients[gKey].stops[si].satShift = parseInt(sSlider.value);
					sVal.textContent = sSlider.value;
					onGradientChange();
				});
				stopDiv.appendChild(sRow);

				editor.appendChild(stopDiv);
			});

			container.appendChild(editor);
		}
		updateGradientPreviews();
	}

	function onGradientChange() {
		state._activeTemplate = null;
		applyTheme();
		updateGradientPreviews();
		renderTemplateList();
		saveState();
	}

	function updateGradientPreviews() {
		document.querySelectorAll('.gradient-preview[data-gradient]').forEach(preview => {
			const gKey = preview.dataset.gradient;
			const grad = state._theme.gradients[gKey];
			const c1 = computeStopColor(grad.stops[0], state._theme.colors);
			const c2 = computeStopColor(grad.stops[1], state._theme.colors);
			preview.style.background = 'linear-gradient(' + grad.angle + 'deg, ' + c1 + ', ' + c2 + ')';
		});
	}

	// --- Template management ---
	function renderTemplateList() {
		const list = document.querySelector('.template-list');
		list.innerHTML = '';
		const allTemplates = { ...BUILTIN_TEMPLATES, ...customTemplates };
		for (const [key, t] of Object.entries(allTemplates)) {
			const isBuiltin = key in BUILTIN_TEMPLATES;
			const colors = t.theme.colors;
			const item = document.createElement('div');
			item.className = 'template-item' + (state._activeTemplate === key ? ' active' : '');

			const swatch = document.createElement('span');
			swatch.className = 'template-swatch';
			swatch.style.background = 'linear-gradient(135deg, ' + colors.darker + ' 50%, ' + colors.accent + ' 50%)';
			item.appendChild(swatch);

			const name = document.createElement('span');
			name.className = 'template-name';
			name.textContent = t.label;
			item.appendChild(name);

			if (!isBuiltin) {
				const renameBtn = document.createElement('button');
				renameBtn.className = 'template-action-btn';
				renameBtn.textContent = '\u270E';
				renameBtn.title = 'Rename';
				renameBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					const newName = prompt('Rename template:', t.label);
					if (newName && newName.trim()) {
						customTemplates[key].label = newName.trim();
						saveTemplates();
						renderTemplateList();
					}
				});
				item.appendChild(renameBtn);

				const deleteBtn = document.createElement('button');
				deleteBtn.className = 'template-action-btn template-delete-btn';
				deleteBtn.textContent = '\u00d7';
				deleteBtn.title = 'Delete';
				deleteBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					if (confirm('Delete template "' + t.label + '"?')) {
						delete customTemplates[key];
						saveTemplates();
						if (state._activeTemplate === key) state._activeTemplate = null;
						renderTemplateList();
						saveState();
					}
				});
				item.appendChild(deleteBtn);
			}

			item.addEventListener('click', () => loadTemplate(key));
			list.appendChild(item);
		}
	}

	function loadTemplate(key) {
		const allTemplates = { ...BUILTIN_TEMPLATES, ...customTemplates };
		const t = allTemplates[key];
		if (!t) return;
		state._theme = deepClone(t.theme);
		if (!state._theme.colors.light) state._theme.colors.light = setLightness(state._theme.colors.darker, 90);
		state._activeTemplate = key;
		applyTheme();
		buildGradientEditorUI();
		syncThemeUI();
		renderTemplateList();
		saveState();
	}

	function saveCurrentTemplate(name) {
		const key = 'custom-' + Date.now();
		customTemplates[key] = { version: 1, label: name, theme: deepClone(state._theme) };
		state._activeTemplate = key;
		saveTemplates();
		renderTemplateList();
		saveState();
	}

	function saveOverTemplate(key) {
		if (!(key in customTemplates)) return;
		customTemplates[key].theme = deepClone(state._theme);
		state._activeTemplate = key;
		saveTemplates();
		renderTemplateList();
		saveState();
	}

	// --- Apply + sync on load ---
	applyTheme();
	buildGradientEditorUI();
	syncThemeUI();
	renderTemplateList();

	// --- Event wiring ---
	// Base color inputs
	document.querySelectorAll('.sidebar-right .color-pickers input[data-color-var]').forEach(input => {
		input.addEventListener('input', () => {
			state._theme.colors[input.dataset.colorVar] = input.value;
			state._activeTemplate = null;
			applyTheme();
			updateGradientPreviews();
			renderTemplateList();
			saveState();
		});
	});

	// Sizing sliders
	document.querySelectorAll('.sidebar-right .var-controls input[type="range"]').forEach(input => {
		input.addEventListener('input', () => {
			const varName = input.dataset.var;
			const unit = input.dataset.unit;
			const value = input.value + unit;
			page.style.setProperty(varName, value);
			state._theme.sizing[varName] = value;
			const valSpan = input.parentElement.querySelector('.var-value');
			if (valSpan) valSpan.textContent = value;
			saveState();
		});
	});

	// Template save
	const saveBtn = document.querySelector('.template-save-btn');
	const saveInput = document.querySelector('.template-name-input');
	if (saveBtn && saveInput) {
		saveBtn.addEventListener('click', () => {
			const name = saveInput.value.trim();
			if (!name) return;
			if (state._activeTemplate && state._activeTemplate in customTemplates
				&& customTemplates[state._activeTemplate].label === name) {
				saveOverTemplate(state._activeTemplate);
			} else {
				const existing = Object.entries(customTemplates).find(([k, t]) => t.label === name);
				if (existing) {
					if (confirm('Overwrite existing template "' + name + '"?')) {
						saveOverTemplate(existing[0]);
					}
				} else {
					saveCurrentTemplate(name);
				}
			}
			saveInput.value = '';
		});
		saveInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') { e.preventDefault(); saveBtn.click(); }
		});
	}

	// Banner controls
	const bannerColorSel = document.getElementById('banner-text-color');
	if (bannerColorSel) {
		bannerColorSel.addEventListener('change', () => {
			state._theme.banner.textColor = bannerColorSel.value;
			state._activeTemplate = null;
			applyTheme();
			renderTemplateList();
			saveState();
		});
	}

	const bannerTitleInput = document.getElementById('banner-title-input');
	if (bannerTitleInput) {
		bannerTitleInput.addEventListener('input', () => {
			state._theme.banner.title = bannerTitleInput.value;
			applyTheme();
			saveState();
		});
	}

	// --- Left sidebar final ---
	applyState();
	saveState();
});
