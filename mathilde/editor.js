// ===== Constants =====
const STORAGE_KEY = 'mathilde-cv-toggle-state';
const PALETTE_KEY = 'mathilde-cv-palettes';
const TMPL_KEY = 'mathilde-cv-layout-templates';
const COLOR_HISTORY_KEY = 'mathilde-cv-color-history';
const COLOR_HISTORY_MAX = 16;
const FIXED_COLORS = { black: '#000000', white: '#ffffff' };
const BASE_KEYS = ['dark', 'mid', 'light', 'lightest', 'accent', 'complement'];
const PALETTE_KEYS = ['black', 'white', ...BASE_KEYS];

const SIZING_DEFS = {
	left: [
		{ var: '--photo-top', label: 'Photo top', min: 0, max: 20, step: 0.5, unit: 'mm', default: 6 },
		{ var: '--photo-size', label: 'Photo size', min: 15, max: 60, step: 0.5, unit: 'mm', default: 30 },
		{ var: '--left-pad-top', label: 'Pad top', min: 0, max: 15, step: 0.5, unit: 'mm', default: 6 },
		{ var: '--left-pad-right', label: 'Pad right', min: 0, max: 15, step: 0.5, unit: 'mm', default: 6 },
		{ var: '--left-pad-bottom', label: 'Pad bottom', min: 0, max: 15, step: 0.5, unit: 'mm', default: 5 },
		{ var: '--left-pad-left', label: 'Pad left', min: 0, max: 15, step: 0.5, unit: 'mm', default: 7 },
		{ var: '--left-section-gap', label: 'Section gap', min: 0, max: 15, step: 0.5, unit: 'mm', default: 4 },
		{ var: '--left-section-title-size', label: 'Title size', min: 6, max: 18, step: 0.5, unit: 'pt', default: 11 },
		{ var: '--left-hr-margin-bottom', label: 'HR bottom', min: 0, max: 8, step: 0.5, unit: 'mm', default: 2.5 },
		{ var: '--left-name-size', label: 'Name size', min: 10, max: 30, step: 0.5, unit: 'pt', default: 19 },
		{ var: '--left-name-bottom', label: 'Name bottom', min: 0, max: 15, step: 0.5, unit: 'mm', default: 5 },
		{ var: '--left-subtitle-size', label: 'Subtitle size', min: 6, max: 20, step: 0.5, unit: 'pt', default: 12 },
		{ var: '--left-body-size', label: 'Body size', min: 6, max: 14, step: 0.5, unit: 'pt', default: 8.5 },
		{ var: '--left-label-size', label: 'Label size', min: 5, max: 14, step: 0.5, unit: 'pt', default: 8 },
		{ var: '--left-item-gap', label: 'Item gap', min: 0, max: 5, step: 0.5, unit: 'mm', default: 0.5 },
		{ var: '--left-skill-gap', label: 'Skill gap', min: 0, max: 8, step: 0.5, unit: 'mm', default: 2 },
		{ var: '--left-award-gap', label: 'Award gap', min: 0, max: 8, step: 0.5, unit: 'mm', default: 1.5 },
		{ var: '--left-leadership-gap', label: 'Leadership gap', min: 0, max: 8, step: 0.5, unit: 'mm', default: 1.5 },
		{ var: '--left-width', label: 'Left width', min: 20, max: 50, step: 1, unit: '%', default: 34 },
	],
	right: [
		{ var: '--right-section-gap', label: 'Section gap', min: 0, max: 15, step: 0.5, unit: 'mm', default: 4 },
		{ var: '--right-section-title-size', label: 'Title size', min: 8, max: 20, step: 0.5, unit: 'pt', default: 13 },
		{ var: '--right-hr-margin-bottom', label: 'HR bottom', min: 0, max: 8, step: 0.5, unit: 'mm', default: 3 },
		{ var: '--edu-banner-pad-top', label: 'Banner pad top', min: 0, max: 15, step: 0.5, unit: 'mm', default: 6 },
		{ var: '--edu-banner-pad-right', label: 'Banner pad right', min: 0, max: 15, step: 0.5, unit: 'mm', default: 8 },
		{ var: '--edu-banner-pad-bottom', label: 'Banner pad bottom', min: 0, max: 15, step: 0.5, unit: 'mm', default: 5 },
		{ var: '--edu-banner-pad-left', label: 'Banner pad left', min: 0, max: 15, step: 0.5, unit: 'mm', default: 9 },
		{ var: '--right-body-pad-top', label: 'Body pad top', min: 0, max: 15, step: 0.5, unit: 'mm', default: 4 },
		{ var: '--right-body-pad-right', label: 'Body pad right', min: 0, max: 15, step: 0.5, unit: 'mm', default: 8 },
		{ var: '--right-body-pad-bottom', label: 'Body pad bottom', min: 0, max: 15, step: 0.5, unit: 'mm', default: 5 },
		{ var: '--right-body-pad-left', label: 'Body pad left', min: 0, max: 15, step: 0.5, unit: 'mm', default: 9 },
		{ var: '--edu-entry-gap', label: 'Edu entry gap', min: 0, max: 8, step: 0.5, unit: 'mm', default: 2.5 },
		{ var: '--edu-institution-size', label: 'Institution size', min: 6, max: 16, step: 0.5, unit: 'pt', default: 10.5 },
		{ var: '--edu-degree-size', label: 'Degree size', min: 6, max: 14, step: 0.5, unit: 'pt', default: 9 },
		{ var: '--edu-courses-size', label: 'Courses size', min: 5, max: 12, step: 0.5, unit: 'pt', default: 8 },
		{ var: '--entry-gap', label: 'Entry gap', min: 0, max: 8, step: 0.5, unit: 'mm', default: 2.8 },
		{ var: '--entry-title-size', label: 'Entry title size', min: 6, max: 16, step: 0.5, unit: 'pt', default: 10 },
		{ var: '--entry-context-size', label: 'Entry context size', min: 5, max: 14, step: 0.5, unit: 'pt', default: 8 },
		{ var: '--entry-desc-size', label: 'Entry desc size', min: 5, max: 14, step: 0.5, unit: 'pt', default: 8 },
	]
};
const allDefs = [...SIZING_DEFS.left, ...SIZING_DEFS.right];

// ===== Sidebar definitions =====
const SIDEBAR_DEFS = [
	{
		name: 'Page',
		type: 'simple',
		items: [
			{ id: 'cv-photo', label: 'Show Photo', default: true },
		]
	},
	{
		name: 'Contact',
		type: 'simple',
		items: [
			{ id: 'contact-address', label: 'Address', default: true },
			{ id: 'contact-email', label: 'Email', default: true },
			{ id: 'contact-phone', label: 'Phone', default: true },
			{ id: 'contact-github', label: 'GitHub', default: true },
			{ id: 'contact-linkedin', label: 'LinkedIn', default: true },
		]
	},
	{
		name: 'Skills',
		type: 'skills',
		subgroups: [
			{
				name: 'Languages', categoryId: 'skill-languages', categoryDefault: true, parent: 'skill-languages', addType: 'skill', dynamic: true,
				items: [
					{ id: 'sklang-english', label: 'English (fluent)', default: true },
					{ id: 'sklang-french', label: 'French (native)', default: true },
					{ id: 'sklang-italian', label: 'Italian (intermediate)', default: true },
					{ id: 'sklang-spanish', label: 'Spanish (elementary)', default: true },
				]
			},
			{
				name: 'Coding Languages', categoryId: 'skill-coding', categoryDefault: true, parent: 'skill-coding', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skcode-python', label: 'Python', default: true },
					{ id: 'skcode-cpp', label: 'C++', default: true },
					{ id: 'skcode-matlab', label: 'MATLAB', default: true },
					{ id: 'skcode-julia', label: 'Julia', default: true },
					{ id: 'skcode-r', label: 'R', default: true },
				]
			},
			{
				name: 'Tools', categoryId: 'skill-tools', categoryDefault: true, parent: 'skill-tools', addType: 'skill', dynamic: true,
				items: [
					{ id: 'sktool-git', label: 'Git', default: true },
					{ id: 'sktool-ml', label: 'ML tools (Scikit Learn, Pandas library)', default: true },
					{ id: 'sktool-blender', label: 'Blender', default: true },
					{ id: 'sktool-fluent', label: 'Ansys Fluent', default: true },
					{ id: 'sktool-monolix', label: 'MonolixSuite', default: true },
					{ id: 'sktool-fenics', label: 'FeniCSx library', default: true },
				]
			},
			{
				name: 'Tech Competencies', categoryId: 'skill-competencies', categoryDefault: true, parent: 'skill-competencies', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skcomp-data', label: 'data science', default: true },
					{ id: 'skcomp-hpc', label: 'HPC', default: true },
					{ id: 'skcomp-nlme', label: 'NLME modeling', default: true },
					{ id: 'skcomp-numerical', label: 'numerical methods (finite difference, FEM)', default: true },
					{ id: 'skcomp-software', label: 'software development', default: true },
				]
			},
		]
	},
	{
		name: 'Awards',
		type: 'simple',
		items: [
			{ id: 'award-bending', label: 'Bending Spoons', default: true },
			{ id: 'award-graphics', label: 'Graphics Competition', default: true },
		]
	},
	{
		name: 'Leadership',
		type: 'simple',
		items: [
			{ id: 'lead-tutoring', label: 'Tutoring', default: true },
			{ id: 'lead-spacecraft', label: 'Spacecraft Team', default: true },
			{ id: 'lead-westem', label: 'weSTEM Mentor', default: true },
			{ id: 'lead-track', label: 'Track & Field', default: true },
		]
	},
	{
		name: 'Education',
		type: 'subgroups',
		subgroups: [
			{
				name: 'EPFL', parent: 'edu-epfl', addType: 'course', dynamic: true,
				items: [
					{ id: 'epfl-course-pde', label: 'Num. Approx. to PDEs (FEM)', default: true },
					{ id: 'epfl-course-sim', label: 'Computer Simulations', default: true },
					{ id: 'epfl-course-numa', label: 'Adv. Numerical Analysis', default: true },
					{ id: 'epfl-course-flow', label: 'Numerical Flow Simulation', default: true },
				]
			},
			{
				name: 'NYU Abu Dhabi', parent: 'edu-nyu', addType: 'course', dynamic: true,
				items: [
					{ id: 'nyu-course-model', label: 'Math Modeling', default: true },
					{ id: 'nyu-course-physics', label: 'Computational Physics', default: true },
					{ id: 'nyu-course-ml', label: 'Machine Learning', default: true },
					{ id: 'nyu-course-bigdata', label: 'Big Data', default: true },
				]
			},
			{
				name: 'Lycée International', parent: 'edu-lycee', addType: 'course', dynamic: false,
				items: []
			},
		]
	},
	{
		name: 'Academic Experience',
		type: 'simple',
		items: [
			{ id: 'acad-lem', label: 'LEM Thesis', default: true },
			{ id: 'acad-cubesat', label: 'CubeSat', default: true },
			{ id: 'acad-nystrom', label: 'Nyström', default: true },
			{ id: 'acad-fem', label: 'FEM', default: true },
			{ id: 'acad-stommel', label: 'Stommel', default: true },
		]
	},
	{
		name: 'Work Experience',
		type: 'simple',
		items: [
			{ id: 'work-lyox', label: 'LYO-X Intern', default: true },
			{ id: 'work-mars', label: 'Mars Research', default: true },
		]
	}
];

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

function hexToRGB(hex) {
	hex = hex.replace('#', '');
	return {
		r: parseInt(hex.substring(0, 2), 16),
		g: parseInt(hex.substring(2, 4), 16),
		b: parseInt(hex.substring(4, 6), 16)
	};
}

function rgbToHex(r, g, b) {
	const toHex = x => {
		const hx = Math.max(0, Math.min(255, Math.round(x))).toString(16);
		return hx.length === 1 ? '0' + hx : hx;
	};
	return '#' + toHex(r) + toHex(g) + toHex(b);
}

function hexToHSV(hex) {
	const { r, g, b } = hexToRGB(hex);
	const r1 = r / 255, g1 = g / 255, b1 = b / 255;
	const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
	const d = max - min;
	let h = 0;
	if (d !== 0) {
		switch (max) {
			case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) * 60; break;
			case g1: h = ((b1 - r1) / d + 2) * 60; break;
			case b1: h = ((r1 - g1) / d + 4) * 60; break;
		}
	}
	const s = max === 0 ? 0 : (d / max) * 100;
	const v = max * 100;
	return { h, s, v };
}

function hsvToHex(h, s, v) {
	h = ((h % 360) + 360) % 360;
	s /= 100; v /= 100;
	const c = v * s;
	const x = c * (1 - Math.abs((h / 60) % 2 - 1));
	const m = v - c;
	let r1, g1, b1;
	if (h < 60)       { r1 = c; g1 = x; b1 = 0; }
	else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
	else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
	else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
	else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
	else              { r1 = c; g1 = 0; b1 = x; }
	return rgbToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
}

function setupHiDPICanvas(canvas, w, h) {
	const dpr = window.devicePixelRatio || 1;
	canvas.width = w * dpr;
	canvas.height = h * dpr;
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';
	canvas.getContext('2d').scale(dpr, dpr);
	return canvas;
}

function getColorHistory() {
	try { return JSON.parse(localStorage.getItem(COLOR_HISTORY_KEY)) || []; } catch (e) { return []; }
}

function addToColorHistory(hex) {
	hex = hex.toLowerCase();
	let history = getColorHistory().filter(c => c !== hex);
	history.unshift(hex);
	if (history.length > COLOR_HISTORY_MAX) history = history.slice(0, COLOR_HISTORY_MAX);
	localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(history));
}

function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function capitalize(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

// ===== Build defaults from SIDEBAR_DEFS =====
function buildDefaults() {
	const defaults = {};
	for (const section of SIDEBAR_DEFS) {
		if (section.items) {
			for (const item of section.items) {
				defaults[item.id] = item.default;
			}
		}
		if (section.subgroups) {
			for (const sub of section.subgroups) {
				if (sub.categoryId) defaults[sub.categoryId] = sub.categoryDefault;
				for (const item of sub.items) {
					defaults[item.id] = item.default;
				}
			}
		}
	}
	return defaults;
}

const DEFAULT_THEME = {
	colors: { dark: '#002835', mid: '#7D9099', light: '#afafaf', lightest: '#ffffff', accent: '#BD223A', complement: '#E16061' },
	subtitle: "Master's Student in\nComputational Sciences",
	sizing: {}
};

const BUILTIN_PALETTES = {
	original: { version: 1, label: 'Original', theme: {
		colors: { dark: '#002835', mid: '#7D9099', light: '#afafaf', lightest: '#ffffff', accent: '#BD223A', complement: '#E16061' },
		sizing: {}
	}},
	navy: { version: 1, label: 'Navy', theme: {
		colors: { dark: '#1a2744', mid: '#6b7d96', light: '#a0a8b4', lightest: '#ffffff', accent: '#c9963a', complement: '#d4a85a' },
		sizing: {}
	}},
	forest: { version: 1, label: 'Forest', theme: {
		colors: { dark: '#1c2e1c', mid: '#6b8b6b', light: '#a0b0a0', lightest: '#ffffff', accent: '#8b4513', complement: '#a0603a' },
		sizing: {}
	}},
	monochrome: { version: 1, label: 'Monochrome', theme: {
		colors: { dark: '#1a1a1a', mid: '#808080', light: '#b0b0b0', lightest: '#ffffff', accent: '#333333', complement: '#555555' },
		sizing: {}
	}}
};

// ===== DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
	const page = document.getElementById('page');

	// Build default state from definitions
	const defaults = buildDefaults();

	// Load saved state, merging with defaults
	let saved = {};
	try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}
	const state = { ...defaults, ...saved };

	// Section order
	const defNames = SIDEBAR_DEFS.map(s => s.name);
	if (!Array.isArray(state._sectionOrder)) {
		state._sectionOrder = [...defNames];
	} else {
		state._sectionOrder = state._sectionOrder.filter(n => defNames.includes(n));
		defNames.forEach(n => { if (!state._sectionOrder.includes(n)) state._sectionOrder.push(n); });
	}

	// Item order within sections
	if (!state._itemOrder || typeof state._itemOrder !== 'object') state._itemOrder = {};

	// Custom items + deleted defaults
	if (!state._customItems) state._customItems = [];
	if (!state._deletedDefaults) state._deletedDefaults = [];

	// Skill category order
	const skillSection = SIDEBAR_DEFS.find(s => s.type === 'skills');
	const skillCatIds = skillSection ? skillSection.subgroups.map(s => s.categoryId) : [];
	if (!Array.isArray(state._skillCategoryOrder)) {
		state._skillCategoryOrder = [...skillCatIds];
	} else {
		state._skillCategoryOrder = state._skillCategoryOrder.filter(id => skillCatIds.includes(id));
		skillCatIds.forEach(id => { if (!state._skillCategoryOrder.includes(id)) state._skillCategoryOrder.push(id); });
	}

	function applyState() {
		for (const [id, visible] of Object.entries(state)) {
			if (id.startsWith('_')) continue;
			document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => {
				el.classList.toggle('hidden', !visible);
			});
		}
		// Photo placeholder: hidden when photo is shown
		const showPhoto = !!state['cv-photo'];
		document.querySelectorAll('[data-toggle-id="cv-photo-placeholder"]').forEach(el => {
			el.classList.toggle('hidden', showPhoto);
		});
	}

	function applyItemOrder() {
		for (const [key, order] of Object.entries(state._itemOrder)) {
			const parentGroups = new Map();
			order.forEach(id => {
				document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => {
					const p = el.parentNode;
					if (!p) return;
					if (!parentGroups.has(p)) parentGroups.set(p, []);
					parentGroups.get(p).push(el);
				});
			});
			parentGroups.forEach((items, parent) => {
				items.forEach(el => parent.appendChild(el));
			});
		}
	}

	function saveState() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}

	// ==========================================
	// PAGE ELEMENT HELPERS (skills)
	// ==========================================
	function getPageContainer(parent, type) {
		if (type === 'skill') {
			const block = document.querySelector('[data-toggle-id="' + parent + '"]');
			return block ? block.querySelector('.skill-items') : null;
		}
		if (type === 'course') {
			const block = document.querySelector('[data-toggle-id="' + parent + '"]');
			return block ? block.querySelector('.skill-items') : null;
		}
		return null;
	}

	function createPageElement(id, text, type) {
		if (type === 'skill' || type === 'course') {
			const span = document.createElement('span');
			span.dataset.toggleId = id;
			span.textContent = text;
			return span;
		}
		return null;
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
		saveState();
	}

	function addItem(parent, type, text) {
		const id = 'custom-' + Date.now();
		const container = getPageContainer(parent, type);
		if (!container) return;
		const el = createPageElement(id, text, type);
		container.appendChild(el);
		state[id] = true;
		state._customItems.push({ id, text, parent, type });
		applyState();
		saveState();
		return id;
	}

	// Restore custom items from localStorage
	state._customItems.forEach(item => {
		const container = getPageContainer(item.parent, item.type);
		if (!container) return;
		const el = createPageElement(item.id, item.text, item.type);
		container.appendChild(el);
		if (!(item.id in state)) state[item.id] = true;
	});

	// Apply deleted defaults
	state._deletedDefaults.forEach(id => {
		document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => el.remove());
		delete state[id];
	});

	function applySkillCategoryOrder() {
		// Reorder skill groups in the page based on saved order
		const skillsContainer = document.querySelector('#section-skills');
		if (!skillsContainer) return;
		const hr = skillsContainer.querySelector('hr');
		for (const catId of state._skillCategoryOrder) {
			const block = skillsContainer.querySelector('[data-toggle-id="' + catId + '"]');
			if (block) skillsContainer.appendChild(block);
		}
	}

	// ==========================================
	// MODAL SYSTEM
	// ==========================================
	const modalOverlay = document.getElementById('modal-overlay');
	const modalContent = document.getElementById('modal-content');

	function openModal(html) {
		modalContent.innerHTML = html;
		modalOverlay.classList.remove('hidden');
	}

	function closeModal() {
		modalOverlay.classList.add('hidden');
		modalContent.innerHTML = '';
	}

	modalOverlay.addEventListener('click', (e) => {
		if (e.target === modalOverlay) closeModal();
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeModal();
	});

	// ==========================================
	// COLOR PICKER
	// ==========================================
	function drawSVCanvas(canvas, hue) {
		const w = parseInt(canvas.style.width);
		const h = parseInt(canvas.style.height);
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = hsvToHex(hue, 100, 100);
		ctx.fillRect(0, 0, w, h);
		const wGrad = ctx.createLinearGradient(0, 0, w, 0);
		wGrad.addColorStop(0, 'rgba(255,255,255,1)');
		wGrad.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = wGrad;
		ctx.fillRect(0, 0, w, h);
		const bGrad = ctx.createLinearGradient(0, 0, 0, h);
		bGrad.addColorStop(0, 'rgba(0,0,0,0)');
		bGrad.addColorStop(1, 'rgba(0,0,0,1)');
		ctx.fillStyle = bGrad;
		ctx.fillRect(0, 0, w, h);
	}

	function drawHueBar(canvas) {
		const w = parseInt(canvas.style.width);
		const h = parseInt(canvas.style.height);
		const ctx = canvas.getContext('2d');
		const grad = ctx.createLinearGradient(0, 0, 0, h);
		for (let i = 0; i <= 6; i++) {
			grad.addColorStop(i / 6, hsvToHex(i * 60, 100, 100));
		}
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);
	}

	function buildColorPickerHTML(initialHex) {
		const history = getColorHistory();
		let historyHTML = '';
		history.forEach(c => {
			historyHTML += '<div class="cp-history-swatch" data-color="' + c + '" style="background:' + c + '"></div>';
		});
		return '<div class="cp-picker">' +
			'<h3>Color Picker</h3>' +
			'<div class="cp-container">' +
				'<div class="cp-canvas-area">' +
					'<div class="cp-sv-wrap">' +
						'<canvas id="cp-sv"></canvas>' +
						'<div class="cp-cursor" id="cp-sv-cursor"></div>' +
					'</div>' +
					'<div class="cp-hue-wrap">' +
						'<canvas id="cp-hue"></canvas>' +
						'<div class="cp-hue-cursor" id="cp-hue-cursor"></div>' +
					'</div>' +
				'</div>' +
				'<div class="cp-controls">' +
					'<div class="cp-preview-row">' +
						'<div class="cp-preview-new" id="cp-preview-new"></div>' +
						'<div class="cp-preview-old" id="cp-preview-old" style="background:' + initialHex + '"></div>' +
					'</div>' +
					'<div class="cp-hex-row">' +
						'<span>#</span>' +
						'<input type="text" id="cp-hex-input" class="cp-hex-input" maxlength="6">' +
					'</div>' +
					'<div class="cp-mode-row">' +
						'<select id="cp-mode" class="cp-mode-select">' +
							'<option value="rgb">RGB</option>' +
							'<option value="hsl">HSL</option>' +
						'</select>' +
					'</div>' +
					'<div id="cp-sliders" class="cp-sliders"></div>' +
					(history.length > 0 ?
						'<div class="cp-history-label">Recent</div>' +
						'<div class="cp-history" id="cp-history">' + historyHTML + '</div>'
					: '') +
				'</div>' +
			'</div>' +
			'<div class="cp-buttons">' +
				'<button class="modal-btn" id="cp-cancel">Cancel</button>' +
				'<button class="modal-btn modal-btn-primary" id="cp-apply">Apply</button>' +
			'</div>' +
		'</div>';
	}

	function openColorPicker(initialHex, onConfirm) {
		openModal(buildColorPickerHTML(initialHex));

		const SV_SIZE = 256;
		const HUE_W = 20;
		const HUE_H = SV_SIZE;

		const svCanvas = setupHiDPICanvas(document.getElementById('cp-sv'), SV_SIZE, SV_SIZE);
		const hueCanvas = setupHiDPICanvas(document.getElementById('cp-hue'), HUE_W, HUE_H);
		const svCursor = document.getElementById('cp-sv-cursor');
		const hueCursor = document.getElementById('cp-hue-cursor');
		const previewNew = document.getElementById('cp-preview-new');
		const hexInput = document.getElementById('cp-hex-input');
		const modeSelect = document.getElementById('cp-mode');
		const slidersDiv = document.getElementById('cp-sliders');

		let hsv = hexToHSV(initialHex);
		let currentHex = initialHex.toLowerCase();

		function updateFromHSV(skipSliders) {
			currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
			previewNew.style.background = currentHex;
			hexInput.value = currentHex.replace('#', '');
			svCursor.style.left = (hsv.s / 100 * SV_SIZE) + 'px';
			svCursor.style.top = ((1 - hsv.v / 100) * SV_SIZE) + 'px';
			hueCursor.style.top = (hsv.h / 360 * HUE_H) + 'px';
			if (!skipSliders) buildSliders();
		}

		function buildSliders() {
			const mode = modeSelect.value;
			let labels, values, maxes;
			if (mode === 'rgb') {
				const rgb = hexToRGB(currentHex);
				labels = ['R', 'G', 'B'];
				values = [rgb.r, rgb.g, rgb.b];
				maxes = [255, 255, 255];
			} else {
				const hsl = hexToHSL(currentHex);
				labels = ['H', 'S', 'L'];
				values = [Math.round(hsl.h), Math.round(hsl.s), Math.round(hsl.l)];
				maxes = [360, 100, 100];
			}
			slidersDiv.innerHTML = '';
			labels.forEach((lbl, i) => {
				const row = document.createElement('div');
				row.className = 'cp-slider-row';
				const label = document.createElement('span');
				label.className = 'cp-slider-label';
				label.textContent = lbl;
				const range = document.createElement('input');
				range.type = 'range';
				range.className = 'cp-range';
				range.min = 0;
				range.max = maxes[i];
				range.value = values[i];
				const num = document.createElement('input');
				num.type = 'number';
				num.className = 'cp-num';
				num.min = 0;
				num.max = maxes[i];
				num.value = values[i];
				function onSliderInput() {
					num.value = range.value;
					applySliderValues();
				}
				function onNumInput() {
					let v = parseInt(num.value) || 0;
					v = Math.max(0, Math.min(maxes[i], v));
					range.value = v;
					applySliderValues();
				}
				range.addEventListener('input', onSliderInput);
				num.addEventListener('input', onNumInput);
				row.appendChild(label);
				row.appendChild(range);
				row.appendChild(num);
				slidersDiv.appendChild(row);
			});
		}

		function applySliderValues() {
			const mode = modeSelect.value;
			const inputs = slidersDiv.querySelectorAll('.cp-num');
			const v0 = parseInt(inputs[0].value) || 0;
			const v1 = parseInt(inputs[1].value) || 0;
			const v2 = parseInt(inputs[2].value) || 0;
			if (mode === 'rgb') {
				currentHex = rgbToHex(v0, v1, v2);
			} else {
				currentHex = hslToHex(v0, v1, v2);
			}
			hsv = hexToHSV(currentHex);
			drawSVCanvas(svCanvas, hsv.h);
			previewNew.style.background = currentHex;
			hexInput.value = currentHex.replace('#', '');
			svCursor.style.left = (hsv.s / 100 * SV_SIZE) + 'px';
			svCursor.style.top = ((1 - hsv.v / 100) * SV_SIZE) + 'px';
			hueCursor.style.top = (hsv.h / 360 * HUE_H) + 'px';
		}

		drawSVCanvas(svCanvas, hsv.h);
		drawHueBar(hueCanvas);
		updateFromHSV();

		function onSVPointer(e) {
			const rect = svCanvas.getBoundingClientRect();
			const x = Math.max(0, Math.min(SV_SIZE, (e.clientX - rect.left) / rect.width * SV_SIZE));
			const y = Math.max(0, Math.min(SV_SIZE, (e.clientY - rect.top) / rect.height * SV_SIZE));
			hsv.s = x / SV_SIZE * 100;
			hsv.v = (1 - y / SV_SIZE) * 100;
			updateFromHSV();
		}
		svCanvas.addEventListener('pointerdown', (e) => {
			e.preventDefault();
			svCanvas.setPointerCapture(e.pointerId);
			onSVPointer(e);
		});
		svCanvas.addEventListener('pointermove', (e) => {
			if (e.buttons > 0) onSVPointer(e);
		});

		function onHuePointer(e) {
			const rect = hueCanvas.getBoundingClientRect();
			const y = Math.max(0, Math.min(HUE_H, (e.clientY - rect.top) / rect.height * HUE_H));
			hsv.h = y / HUE_H * 360;
			drawSVCanvas(svCanvas, hsv.h);
			updateFromHSV();
		}
		hueCanvas.addEventListener('pointerdown', (e) => {
			e.preventDefault();
			hueCanvas.setPointerCapture(e.pointerId);
			onHuePointer(e);
		});
		hueCanvas.addEventListener('pointermove', (e) => {
			if (e.buttons > 0) onHuePointer(e);
		});

		hexInput.addEventListener('input', () => {
			const val = hexInput.value.replace(/[^0-9a-fA-F]/g, '');
			if (val.length === 6) {
				currentHex = '#' + val.toLowerCase();
				hsv = hexToHSV(currentHex);
				drawSVCanvas(svCanvas, hsv.h);
				updateFromHSV();
			}
		});

		modeSelect.addEventListener('change', () => buildSliders());

		const historyDiv = document.getElementById('cp-history');
		if (historyDiv) {
			historyDiv.addEventListener('click', (e) => {
				const swatch = e.target.closest('.cp-history-swatch');
				if (!swatch) return;
				currentHex = swatch.dataset.color;
				hsv = hexToHSV(currentHex);
				drawSVCanvas(svCanvas, hsv.h);
				updateFromHSV();
			});
		}

		document.getElementById('cp-apply').addEventListener('click', () => {
			addToColorHistory(currentHex);
			onConfirm(currentHex);
			closeModal();
		});

		document.getElementById('cp-cancel').addEventListener('click', () => closeModal());
	}

	// ==========================================
	// TOP BAR — Panel toggles
	// ==========================================
	const editor = document.querySelector('.editor');
	const panelBtns = {
		none: document.getElementById('panel-none'),
		content: document.getElementById('panel-content'),
		styling: document.getElementById('panel-styling')
	};

	function setPanel(mode) {
		editor.classList.remove('show-content', 'show-styling');
		Object.values(panelBtns).forEach(b => b.classList.remove('active'));
		if (mode === 'content') editor.classList.add('show-content');
		else if (mode === 'styling') editor.classList.add('show-styling');
		panelBtns[mode].classList.add('active');
	}

	panelBtns.none.addEventListener('click', () => setPanel('none'));
	panelBtns.content.addEventListener('click', () => setPanel('content'));
	panelBtns.styling.addEventListener('click', () => setPanel('styling'));

	// ==========================================
	// TOP BAR — Export / Import
	// ==========================================
	document.getElementById('btn-export').addEventListener('click', () => {
		const data = {};
		[STORAGE_KEY, PALETTE_KEY, TMPL_KEY, COLOR_HISTORY_KEY].forEach(key => {
			const val = localStorage.getItem(key);
			if (val) data[key] = JSON.parse(val);
		});
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'mathilde-resume-settings.json';
		a.click();
		URL.revokeObjectURL(a.href);
	});

	document.getElementById('btn-import').addEventListener('click', () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.addEventListener('change', () => {
			const file = input.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				try {
					const data = JSON.parse(reader.result);
					for (const [key, val] of Object.entries(data)) {
						localStorage.setItem(key, JSON.stringify(val));
					}
					location.reload();
				} catch (e) {
					alert('Invalid settings file');
				}
			};
			reader.readAsText(file);
		});
		input.click();
	});

	// ==========================================
	// TOP BAR — Menu buttons
	// ==========================================
	document.getElementById('btn-download').addEventListener('click', () => window.print());

	document.getElementById('btn-new-palette').addEventListener('click', () => {
		openModal(
			'<h3>New Palette</h3>' +
			'<p>Save the current colors as a new palette.</p>' +
			'<div class="modal-row">' +
				'<input type="text" class="modal-input" id="new-palette-name" placeholder="Palette name..." autofocus>' +
				'<button class="modal-btn modal-btn-primary" id="new-palette-save">Save</button>' +
			'</div>'
		);
		const input = document.getElementById('new-palette-name');
		const btn = document.getElementById('new-palette-save');
		function doSave() {
			const name = input.value.trim();
			if (!name) return;
			saveCurrentPalette(name);
			closeModal();
		}
		btn.addEventListener('click', doSave);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') { e.preventDefault(); doSave(); }
		});
		input.focus();
	});

	document.getElementById('btn-load-palette').addEventListener('click', () => {
		openModal('<h3>Load Palette</h3><div class="template-grid" id="palette-grid"></div>');
		renderPaletteGrid();
	});

	// New Template
	document.getElementById('btn-new-template').addEventListener('click', () => {
		openModal(
			'<h3>New Template</h3>' +
			'<p>Save the current layout (toggles, sizing, subtitle) as a template.</p>' +
			'<div class="modal-row">' +
				'<input type="text" class="modal-input" id="new-tmpl-name" placeholder="Template name..." autofocus>' +
				'<button class="modal-btn modal-btn-primary" id="new-tmpl-save">Save</button>' +
			'</div>'
		);
		const input = document.getElementById('new-tmpl-name');
		const btn = document.getElementById('new-tmpl-save');
		function doSave() {
			const name = input.value.trim();
			if (!name) return;
			saveCurrentTmpl(name);
			closeModal();
		}
		btn.addEventListener('click', doSave);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') { e.preventDefault(); doSave(); }
		});
		input.focus();
	});

	// Load Template
	document.getElementById('btn-load-template').addEventListener('click', () => {
		openModal('<h3>Load Template</h3><div class="template-grid" id="tmpl-grid"></div>');
		renderTmplGrid();
	});

	// ==========================================
	// LEFT SIDEBAR — lil-gui (toggles)
	// ==========================================
	const leftGui = new lil.GUI({ container: document.getElementById('left-gui-container'), autoPlace: false });

	// Drag reorder for items within a folder
	function setupItemReorder(container, itemElements, orderKey) {
		if (itemElements.length < 2) return;

		const lastItem = itemElements[itemElements.length - 1].el;
		const refEl = lastItem.nextElementSibling;

		const savedOrder = state._itemOrder[orderKey];
		if (savedOrder) {
			const sorted = [];
			savedOrder.forEach(id => {
				const item = itemElements.find(ie => ie.id === id);
				if (item) sorted.push(item);
			});
			itemElements.forEach(ie => {
				if (!sorted.some(s => s.id === ie.id)) sorted.push(ie);
			});
			sorted.forEach(item => container.insertBefore(item.el, refEl));
			state._itemOrder[orderKey] = sorted.map(ie => ie.id);
		} else {
			state._itemOrder[orderKey] = itemElements.map(ie => ie.id);
		}

		itemElements.forEach(({el, id}) => {
			const handle = document.createElement('span');
			handle.className = 'drag-handle';
			handle.textContent = '\u283F';
			handle.title = 'Drag to reorder';
			el.insertBefore(handle, el.firstChild);

			handle.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); });

			handle.addEventListener('mousedown', e => {
				e.preventDefault();
				e.stopPropagation();
				el.classList.add('dragging');

				const getOrderedEls = () => {
					const elSet = new Set(itemElements.map(ie => ie.el));
					return Array.from(container.children).filter(ch => elSet.has(ch));
				};

				const onMouseMove = (me) => {
					const ordered = getOrderedEls();
					const dragIdx = ordered.indexOf(el);
					for (let j = 0; j < ordered.length; j++) {
						if (j === dragIdx) continue;
						const rect = ordered[j].getBoundingClientRect();
						const midY = rect.top + rect.height / 2;
						if (j < dragIdx && me.clientY < midY) {
							container.insertBefore(el, ordered[j]);
							break;
						} else if (j > dragIdx && me.clientY > midY) {
							container.insertBefore(el, ordered[j].nextSibling);
							break;
						}
					}
				};

				const onMouseUp = () => {
					el.classList.remove('dragging');
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
					const ordered = getOrderedEls();
					state._itemOrder[orderKey] = ordered.map(e => {
						const item = itemElements.find(ie => ie.el === e);
						return item ? item.id : null;
					}).filter(Boolean);
					applyItemOrder();
					applySkillCategoryOrder();
					saveState();
				};

				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
			});
		});
	}

	// Get active items for a dynamic group (defaults minus deleted, plus custom)
	function getActiveItems(subDef) {
		const parent = subDef.parent;
		const deleted = state._deletedDefaults || [];
		const defaultItems = subDef.items.filter(it => !deleted.includes(it.id));
		const customItems = (state._customItems || [])
			.filter(ci => ci.parent === parent)
			.map(ci => ({ id: ci.id, label: ci.text, default: true }));
		return [...defaultItems, ...customItems];
	}

	// Inject a delete button into a lil-gui controller
	function injectDeleteButton(ctrl, id, rebuildFn) {
		const btn = document.createElement('button');
		btn.className = 'lil-gui-delete-btn';
		btn.textContent = '\u00d7';
		btn.title = 'Delete';
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteItem(id);
			rebuildFn();
		});
		ctrl.$widget.appendChild(btn);
	}

	// Build a dynamic subfolder (skill category with add/delete)
	function buildDynamicSubfolder(parentFolder, subDef) {
		const activeItems = getActiveItems(subDef);
		const proxy = {};

		// Category toggle
		if (subDef.categoryId) {
			proxy['__category__'] = !!state[subDef.categoryId];
		}

		activeItems.forEach(item => {
			if (item.id in state) {
				proxy[item.id] = !!state[item.id];
			} else {
				proxy[item.id] = item.default;
				state[item.id] = item.default;
			}
		});

		proxy['__newItem__'] = '';

		const folder = parentFolder.addFolder(subDef.name).close();
		if (subDef.categoryId) {
			folder.domElement.dataset.skillCategoryId = subDef.categoryId;
		}

		function rebuild() {
			folder.destroy();
			buildDynamicSubfolder(parentFolder, subDef);
		}

		// Category toggle
		if (subDef.categoryId) {
			folder.add(proxy, '__category__').name('Show category').onChange(val => {
				state[subDef.categoryId] = val;
				applyState();
				saveState();
			});
		}

		// Item controllers with delete buttons
		const itemEls = [];
		activeItems.forEach(item => {
			const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
				state[item.id] = val;
				applyState();
				saveState();
			});
			injectDeleteButton(ctrl, item.id, rebuild);
			itemEls.push({el: ctrl.domElement, id: item.id});
		});

		// Add new item
		folder.add(proxy, '__newItem__').name('New ' + subDef.addType);
		folder.add({ 'Add': () => {
			const text = proxy['__newItem__'].trim();
			if (!text) return;
			addItem(subDef.parent, subDef.addType, text);
			rebuild();
		}}, 'Add');

		setupItemReorder(folder.$children, itemEls, subDef.parent);

		return folder;
	}

	// Build toggle sections
	for (const section of SIDEBAR_DEFS) {
		if (section.type === 'simple') {
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;
			const itemEls = [];
			section.items.forEach(item => {
				const proxy = {};
				proxy[item.id] = !!state[item.id];
				const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
					state[item.id] = val;
					applyState();
					saveState();
				});
				itemEls.push({ el: ctrl.domElement, id: item.id });
			});
			setupItemReorder(folder.$children, itemEls, section.name);
		}
		else if (section.type === 'subgroups') {
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;
			section.subgroups.forEach(sub => {
				if (sub.dynamic) {
					buildDynamicSubfolder(folder, sub);
				} else {
					// Static entry — just a toggle for the parent
					const proxy = {};
					proxy[sub.parent] = !(state._deletedDefaults || []).includes(sub.parent) && state[sub.parent] !== false;
					const ctrl = folder.add(proxy, sub.parent).name(sub.name).onChange(val => {
						state[sub.parent] = val;
						applyState();
						saveState();
					});
				}
			});
		}
		else if (section.type === 'skills') {
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;

			// Build subfolders in saved category order
			const orderedSubs = state._skillCategoryOrder
				.map(catId => section.subgroups.find(s => s.categoryId === catId))
				.filter(Boolean);

			orderedSubs.forEach(sub => {
				if (sub.dynamic) {
					buildDynamicSubfolder(folder, sub);
				}
			});

			// Add drag-to-reorder for skill category sub-folders
			const subContainer = folder.$children;
			folder.folders.forEach(subFolder => {
				const subEl = subFolder.domElement;
				const subTitle = subFolder.$title;
				const handle = document.createElement('span');
				handle.className = 'drag-handle';
				handle.textContent = '\u283F';
				handle.title = 'Drag to reorder';
				subTitle.insertBefore(handle, subTitle.firstChild);

				handle.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); });
				handle.addEventListener('mousedown', e => {
					e.preventDefault();
					e.stopPropagation();
					subEl.classList.add('dragging');

					const onMouseMove = (me) => {
						const siblings = Array.from(subContainer.children);
						const dragIdx = siblings.indexOf(subEl);
						for (let j = 0; j < siblings.length; j++) {
							if (j === dragIdx) continue;
							const rect = siblings[j].getBoundingClientRect();
							const midY = rect.top + rect.height / 2;
							if (j < dragIdx && me.clientY < midY) {
								subContainer.insertBefore(subEl, siblings[j]);
								break;
							} else if (j > dragIdx && me.clientY > midY) {
								subContainer.insertBefore(subEl, siblings[j].nextSibling);
								break;
							}
						}
					};
					const onMouseUp = () => {
						subEl.classList.remove('dragging');
						document.removeEventListener('mousemove', onMouseMove);
						document.removeEventListener('mouseup', onMouseUp);
						state._skillCategoryOrder = Array.from(subContainer.children)
							.map(el => el.dataset.skillCategoryId)
							.filter(Boolean);
						applySkillCategoryOrder();
						saveState();
					};
					document.addEventListener('mousemove', onMouseMove);
					document.addEventListener('mouseup', onMouseUp);
				});
			});
		}
	}

	// Section-level drag reorder
	(function initSectionDragReorder() {
		const container = leftGui.$children;
		leftGui.folders.forEach(folder => {
			const folderEl = folder.domElement;
			const titleEl = folder.$title;
			const handle = document.createElement('span');
			handle.className = 'drag-handle';
			handle.textContent = '\u283F';
			handle.title = 'Drag to reorder';
			titleEl.insertBefore(handle, titleEl.firstChild);

			handle.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); });
			handle.addEventListener('mousedown', e => {
				e.preventDefault();
				e.stopPropagation();
				folderEl.classList.add('dragging');

				const onMouseMove = (me) => {
					const siblings = Array.from(container.children);
					const dragIdx = siblings.indexOf(folderEl);
					for (let j = 0; j < siblings.length; j++) {
						if (j === dragIdx) continue;
						const rect = siblings[j].getBoundingClientRect();
						const midY = rect.top + rect.height / 2;
						if (j < dragIdx && me.clientY < midY) {
							container.insertBefore(folderEl, siblings[j]);
							break;
						} else if (j > dragIdx && me.clientY > midY) {
							container.insertBefore(folderEl, siblings[j].nextSibling);
							break;
						}
					}
				};
				const onMouseUp = () => {
					folderEl.classList.remove('dragging');
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
					state._sectionOrder = Array.from(container.children)
						.map(el => el.dataset.sectionName)
						.filter(Boolean);
					saveState();
				};
				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
			});
		});
	})();

	// ==========================================
	// RIGHT SIDEBAR — lil-gui (theme)
	// ==========================================
	const gui = new lil.GUI({ container: document.getElementById('gui-container'), autoPlace: false });

	// ==========================================
	// RIGHT SIDEBAR — Theme (colors + sizing)
	// ==========================================

	// Load custom palettes
	let customPalettes = {};
	try { customPalettes = JSON.parse(localStorage.getItem(PALETTE_KEY)) || {}; } catch (e) {}
	for (const [k, v] of Object.entries(BUILTIN_PALETTES)) {
		if (!(k in customPalettes)) customPalettes[k] = deepClone(v);
	}
	function savePalettes() { localStorage.setItem(PALETTE_KEY, JSON.stringify(customPalettes)); }

	// Load custom layout templates
	const BUILTIN_TMPLS = {
		'default': {
			label: 'Default',
			toggles: buildDefaults(),
			customItems: [],
			deletedDefaults: [],
			sizing: {},
			subtitle: DEFAULT_THEME.subtitle,
			sectionOrder: SIDEBAR_DEFS.map(s => s.name),
			itemOrder: {},
			skillCategoryOrder: skillCatIds.slice()
		}
	};
	let customTmpls = {};
	try { customTmpls = JSON.parse(localStorage.getItem(TMPL_KEY)) || {}; } catch (e) {}
	for (const [k, v] of Object.entries(BUILTIN_TMPLS)) {
		if (!(k in customTmpls)) customTmpls[k] = deepClone(v);
	}
	function saveTmpls() { localStorage.setItem(TMPL_KEY, JSON.stringify(customTmpls)); }
	if (!state._activeLayout) state._activeLayout = 'default';

	// Theme state
	if (!state._theme) {
		state._theme = deepClone(DEFAULT_THEME);
	}
	if (!state._activePalette) state._activePalette = 'original';

	// Sizing proxy
	const sizingProxy = {};
	allDefs.forEach(def => {
		const saved = state._theme.sizing[def.var];
		sizingProxy[def.var] = saved ? parseFloat(saved) : def.default;
	});

	// Apply theme to page
	function applyTheme() {
		const t = state._theme;
		BASE_KEYS.forEach(k => page.style.setProperty('--' + k, t.colors[k]));
		for (const [k, v] of Object.entries(t.sizing)) {
			page.style.setProperty(k, v);
		}
		// Update subtitle
		const subtitleEl = page.querySelector('.name-block .subtitle');
		if (subtitleEl && t.subtitle != null) {
			subtitleEl.innerHTML = t.subtitle.replace(/\n/g, '<br>');
		}
	}

	function onThemeChange() {
		state._activePalette = null;
		applyTheme();
		saveState();
	}

	// Subtitle
	if (!state._theme.subtitle) state._theme.subtitle = DEFAULT_THEME.subtitle;
	gui.add(state._theme, 'subtitle').name('Subtitle').onChange(() => {
		applyTheme();
		saveState();
	});

	// Colors folder
	const colorsFolder = gui.addFolder('Colors');
	BASE_KEYS.forEach(k => {
		const ctrl = colorsFolder.addColor(state._theme.colors, k)
			.name(capitalize(k))
			.onChange(() => onThemeChange());
		const nativeInput = ctrl.domElement.querySelector('input[type="color"]');
		if (nativeInput) {
			nativeInput.style.pointerEvents = 'none';
			nativeInput.tabIndex = -1;
		}
		ctrl.$widget.style.cursor = 'pointer';
		ctrl.$widget.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			openColorPicker(state._theme.colors[k], (hex) => {
				state._theme.colors[k] = hex;
				ctrl.updateDisplay();
				onThemeChange();
			});
		});
	});

	// Left Layout folder
	const leftFolder = gui.addFolder('Left Layout').close();
	SIZING_DEFS.left.forEach(def => {
		leftFolder.add(sizingProxy, def.var, def.min, def.max, def.step)
			.name(def.label)
			.onChange(val => {
				state._theme.sizing[def.var] = val + def.unit;
				page.style.setProperty(def.var, val + def.unit);
				saveState();
			});
	});

	// Right Layout folder
	const rightFolder = gui.addFolder('Right Layout').close();
	SIZING_DEFS.right.forEach(def => {
		rightFolder.add(sizingProxy, def.var, def.min, def.max, def.step)
			.name(def.label)
			.onChange(val => {
				state._theme.sizing[def.var] = val + def.unit;
				page.style.setProperty(def.var, val + def.unit);
				saveState();
			});
	});

	function syncThemeUI() {
		allDefs.forEach(def => {
			const saved = state._theme.sizing[def.var];
			sizingProxy[def.var] = saved ? parseFloat(saved) : def.default;
		});
		gui.controllersRecursive().forEach(c => c.updateDisplay());
	}

	// ==========================================
	// PALETTE MANAGEMENT
	// ==========================================
	function loadPalette(key) {
		const p = customPalettes[key];
		if (!p) return;
		state._theme.colors = deepClone(p.theme.colors);
		state._activePalette = key;
		applyTheme();
		syncThemeUI();
		saveState();
	}

	function saveCurrentPalette(name) {
		const key = 'palette-' + Date.now();
		customPalettes[key] = {
			version: 1,
			label: name,
			theme: {
				colors: deepClone(state._theme.colors),
				sizing: {}
			}
		};
		state._activePalette = key;
		savePalettes();
		saveState();
	}

	function renderPaletteGrid() {
		const grid = document.getElementById('palette-grid');
		if (!grid) return;
		grid.innerHTML = '';
		for (const [key, p] of Object.entries(customPalettes)) {
			const colors = p.theme ? p.theme.colors : p.colors;
			const card = document.createElement('div');
			card.className = 'template-card' + (state._activePalette === key ? ' active' : '');

			const preview = document.createElement('div');
			preview.className = 'template-preview';
			const previewLeft = document.createElement('div');
			previewLeft.className = 'preview-left';
			previewLeft.style.background = colors.dark || '#000';
			const previewRight = document.createElement('div');
			previewRight.className = 'preview-right';
			previewRight.style.background = colors.lightest || '#fff';
			const previewBanner = document.createElement('div');
			previewBanner.className = 'preview-banner';
			previewBanner.style.background = colors.mid || '#888';
			previewRight.appendChild(previewBanner);
			preview.appendChild(previewLeft);
			preview.appendChild(previewRight);
			card.appendChild(preview);

			preview.addEventListener('click', () => {
				loadPalette(key);
				closeModal();
			});

			const nameRow = document.createElement('div');
			nameRow.className = 'template-card-name-row';

			const nameInput = document.createElement('input');
			nameInput.type = 'text';
			nameInput.className = 'template-card-name-input';
			nameInput.value = p.label;
			nameInput.addEventListener('change', () => {
				const newName = nameInput.value.trim();
				if (newName) {
					customPalettes[key].label = newName;
					savePalettes();
				} else {
					nameInput.value = p.label;
				}
			});
			nameInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') { e.preventDefault(); nameInput.blur(); }
			});
			nameRow.appendChild(nameInput);

			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'template-card-delete';
			deleteBtn.textContent = '\u00d7';
			deleteBtn.title = 'Delete palette';
			deleteBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				if (confirm('Delete palette "' + p.label + '"?')) {
					delete customPalettes[key];
					savePalettes();
					if (state._activePalette === key) state._activePalette = null;
					saveState();
					renderPaletteGrid();
				}
			});
			nameRow.appendChild(deleteBtn);

			card.appendChild(nameRow);
			grid.appendChild(card);
		}
	}

	// ==========================================
	// TEMPLATE MANAGEMENT
	// ==========================================
	function saveCurrentTmpl(name) {
		const key = 'tmpl-' + Date.now();
		const toggles = {};
		const defs = buildDefaults();
		for (const id of Object.keys(defs)) {
			toggles[id] = !!state[id];
		}
		(state._customItems || []).forEach(ci => {
			toggles[ci.id] = !!state[ci.id];
		});
		customTmpls[key] = {
			label: name,
			toggles,
			customItems: deepClone(state._customItems || []),
			deletedDefaults: deepClone(state._deletedDefaults || []),
			sizing: deepClone(state._theme.sizing || {}),
			subtitle: state._theme.subtitle || DEFAULT_THEME.subtitle,
			sectionOrder: deepClone(state._sectionOrder),
			itemOrder: deepClone(state._itemOrder),
			skillCategoryOrder: deepClone(state._skillCategoryOrder)
		};
		state._activeLayout = key;
		saveTmpls();
		saveState();
	}

	function loadTmpl(key) {
		const tmpl = customTmpls[key];
		if (!tmpl) return;

		const newState = {};
		for (const [k, v] of Object.entries(tmpl.toggles)) {
			newState[k] = v;
		}
		newState._customItems = deepClone(tmpl.customItems || []);
		newState._deletedDefaults = deepClone(tmpl.deletedDefaults || []);

		const theme = deepClone(state._theme);
		theme.sizing = deepClone(tmpl.sizing || {});
		theme.subtitle = tmpl.subtitle || DEFAULT_THEME.subtitle;
		newState._theme = theme;

		newState._activePalette = state._activePalette;
		newState._activeLayout = key;
		if (tmpl.sectionOrder) newState._sectionOrder = deepClone(tmpl.sectionOrder);
		if (tmpl.itemOrder) newState._itemOrder = deepClone(tmpl.itemOrder);
		if (tmpl.skillCategoryOrder) newState._skillCategoryOrder = deepClone(tmpl.skillCategoryOrder);

		localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
		location.reload();
	}

	function renderTmplGrid() {
		const grid = document.getElementById('tmpl-grid');
		if (!grid) return;
		grid.innerHTML = '';
		for (const [key, tmpl] of Object.entries(customTmpls)) {
			const card = document.createElement('div');
			card.className = 'template-card' + (state._activeLayout === key ? ' active' : '');

			const preview = document.createElement('div');
			preview.className = 'template-preview tmpl-preview-block';
			const titleSpan = document.createElement('span');
			titleSpan.className = 'tmpl-preview-title';
			titleSpan.textContent = tmpl.subtitle || tmpl.label || 'Template';
			preview.appendChild(titleSpan);
			card.appendChild(preview);

			preview.addEventListener('click', () => loadTmpl(key));

			const nameRow = document.createElement('div');
			nameRow.className = 'template-card-name-row';

			const nameInput = document.createElement('input');
			nameInput.type = 'text';
			nameInput.className = 'template-card-name-input';
			nameInput.value = tmpl.label;
			nameInput.addEventListener('change', () => {
				const newName = nameInput.value.trim();
				if (newName) {
					customTmpls[key].label = newName;
					saveTmpls();
				} else {
					nameInput.value = tmpl.label;
				}
			});
			nameInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') { e.preventDefault(); nameInput.blur(); }
			});
			nameRow.appendChild(nameInput);

			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'template-card-delete';
			deleteBtn.textContent = '\u00d7';
			deleteBtn.title = 'Delete template';
			deleteBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				if (confirm('Delete template "' + tmpl.label + '"?')) {
					delete customTmpls[key];
					saveTmpls();
					if (state._activeLayout === key) state._activeLayout = null;
					saveState();
					renderTmplGrid();
				}
			});
			nameRow.appendChild(deleteBtn);

			card.appendChild(nameRow);
			grid.appendChild(card);
		}
	}

	// ==========================================
	// APPLY ON LOAD
	// ==========================================
	applyTheme();
	syncThemeUI();
	applyState();
	applyItemOrder();
	applySkillCategoryOrder();
	saveState();
});
