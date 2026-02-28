// ===== Constants =====
const STORAGE_KEY = 'cv-toggle-state';
const PALETTE_KEY = 'cv-palettes';
const TMPL_KEY = 'cv-layout-templates';
const FIXED_COLORS = { black: '#000000', white: '#ffffff' };
const BASE_KEYS = ['darker', 'dark', 'lightish', 'light', 'lightest', 'accent', 'complement'];
const PALETTE_KEYS = ['black', 'white', ...BASE_KEYS];
const GRADIENT_KEYS = ['leftbg', 'banner', 'grid', 'details'];

const SIZING_DEFS = {
	left: [
		{ var: '--left-very-top', label: 'Top margin', min: 0, max: 40, step: 0.5, unit: 'mm', default: 21 },
		{ var: '--left-section-gap', label: 'Section gap', min: 0, max: 30, step: 0.5, unit: 'mm', default: 17 },
		{ var: '--left-title-bottom', label: 'Title bottom', min: 0, max: 25, step: 0.5, unit: 'mm', default: 13 },
		{ var: '--left-block-gap', label: 'Block gap', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
		{ var: '--left-block-sides', label: 'Block sides', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
		{ var: '--left-skill-gap', label: 'Skill gap', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
		{ var: '--left-languages-gap', label: 'Lang. gap', min: 0, max: 15, step: 0.5, unit: 'mm', default: 4 },
		{ var: '--left-very-large', label: 'Very large', min: 8, max: 36, step: 0.5, unit: 'pt', default: 22 },
		{ var: '--left-large', label: 'Large', min: 8, max: 30, step: 0.5, unit: 'pt', default: 16 },
		{ var: '--left-medium', label: 'Medium', min: 8, max: 30, step: 0.5, unit: 'pt', default: 15 },
		{ var: '--left-small', label: 'Small', min: 8, max: 30, step: 0.5, unit: 'pt', default: 14 },
	],
	right: [
		{ var: '--right-very-top', label: 'Top margin', min: 0, max: 20, step: 0.5, unit: 'mm', default: 9 },
		{ var: '--right-section-gap', label: 'Section gap', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
		{ var: '--right-title-bottom', label: 'Title bottom', min: 0, max: 25, step: 0.5, unit: 'mm', default: 10 },
		{ var: '--right-block-gap', label: 'Block gap', min: 0, max: 20, step: 0.5, unit: 'mm', default: 9.3 },
		{ var: '--right-block-sides', label: 'Block sides', min: 0, max: 25, step: 0.5, unit: 'mm', default: 13 },
		{ var: '--right-grid-gap', label: 'Grid gap', min: 0, max: 15, step: 0.5, unit: 'mm', default: 6.4 },
		{ var: '--right-grid-height', label: 'Grid height', min: 60, max: 200, step: 1, unit: 'mm', default: 127 },
		{ var: '--banner-contact-gap', label: 'Contact gap', min: 0, max: 10, step: 0.5, unit: 'mm', default: 1 },
	]
};
const allDefs = [...SIZING_DEFS.left, ...SIZING_DEFS.right];

// ===== Left sidebar definitions =====
const LEFT_SIDEBAR_DEFS = [
	{
		name: 'Page',
		type: 'simple',
		items: [
			{ id: 'cv-photo', label: 'Show Photo', default: false },
		]
	},
	{
		name: 'Contact',
		type: 'contact',
		layout: { key: '_contactLayout', default: 'left', options: { 'Left stack': 'left', 'Bottom row': 'bottom', 'Banner right': 'banner' } },
		items: [
			{ id: 'contact-phone', label: 'Phone', default: true },
			{ id: 'contact-address', label: 'Address', default: false },
			{ id: 'contact-email', label: 'Email', default: true },
			{ id: 'contact-linkedin', label: 'LinkedIn', default: true },
			{ id: 'contact-github', label: 'GitHub', default: true },
			{ id: 'contact-itchio', label: 'Itch.io', default: false },
		]
	},
	{
		name: 'Education',
		type: 'subgroups',
		subgroups: [
			{
				name: 'ArtFX', parent: 'edu-artfx', addType: 'class', dynamic: true,
				items: [
					{ id: 'edu-artfx-graphics', label: 'Adv. Computer Graphics', default: true },
					{ id: 'edu-artfx-shaders', label: 'Compute Shaders', default: true },
					{ id: 'edu-artfx-engine', label: 'Game Engine Architecture', default: true },
					{ id: 'edu-artfx-procgen', label: 'Procedural Generation', default: true },
					{ id: 'edu-artfx-physics', label: 'Adv. Computer Physics', default: false },
				]
			},
			{
				name: 'Southampton', parent: 'edu-soton', addType: 'class', dynamic: true,
				items: [
					{ id: 'edu-soton-realtime', label: 'Real-Time Computing', default: true },
					{ id: 'edu-soton-modelling', label: 'Software Modelling', default: true },
				]
			}
		]
	},
	{
		name: 'Skills',
		type: 'skills',
		subgroups: [
			{
				name: 'Languages', categoryId: 'skills-languages', categoryDefault: true, parent: 'skills-languages', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-lang-cpp', label: 'C++', default: true },
					{ id: 'skill-lang-c', label: 'C', default: true },
					{ id: 'skill-lang-csharp', label: 'C#', default: true },
					{ id: 'skill-lang-asm', label: 'x86 Assembly', default: true },
					{ id: 'skill-lang-python', label: 'Python', default: true },
					{ id: 'skill-lang-go', label: 'Go', default: true },
					{ id: 'skill-lang-jai', label: 'Jai', default: true },
				]
			},
			{
				name: 'Rendering', categoryId: 'skills-rendering', categoryDefault: true, parent: 'skills-rendering', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-render-vulkan', label: 'Vulkan', default: true },
					{ id: 'skill-render-opengl', label: 'OpenGL', default: true },
					{ id: 'skill-render-glsl', label: 'GLSL', default: true },
					{ id: 'skill-render-slang', label: 'SLang', default: true },
					{ id: 'skill-render-hlsl', label: 'HLSL', default: true },
					{ id: 'skill-render-renderdoc', label: 'renderdoc', default: true },
					{ id: 'skill-render-bindless', label: 'bindless model', default: true },
				]
			},
			{
				name: 'Engine Prog.', categoryId: 'skills-engine', categoryDefault: true, parent: 'skills-engine', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-engine-mt', label: 'Multithreading', default: true },
					{ id: 'skill-engine-profiling', label: 'CPU/GPU Profiling', default: true },
					{ id: 'skill-engine-compute', label: 'Compute shaders', default: true },
					{ id: 'skill-engine-imgui', label: 'ImGui', default: true },
					{ id: 'skill-engine-glfw', label: 'GLFW', default: true },
					{ id: 'skill-engine-sdl', label: 'SDL', default: true },
					{ id: 'skill-engine-procgen', label: 'Procedural generation', default: true },
				]
			},
			{
				name: 'Collab.', categoryId: 'skills-collab', categoryDefault: false, parent: 'skills-collab', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-collab-git', label: 'Git', default: true },
					{ id: 'skill-collab-perforce', label: 'Perforce', default: true },
				]
			},
			{
				name: 'Game Engines', categoryId: 'skills-game-engines', categoryDefault: false, parent: 'skills-game-engines', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-ge-unreal', label: 'Unreal Engine', default: true },
					{ id: 'skill-ge-unity', label: 'Unity', default: true },
					{ id: 'skill-ge-godot', label: 'Godot', default: true },
				]
			},
			{
				name: 'Fullstack', categoryId: 'skills-fullstack', categoryDefault: false, parent: 'skills-fullstack', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-fs-azure', label: 'Microsoft Azure', default: true },
					{ id: 'skill-fs-cosmos', label: 'CosmosDB', default: true },
					{ id: 'skill-fs-gae', label: 'GAE', default: true },
					{ id: 'skill-fs-css', label: 'CSS', default: true },
					{ id: 'skill-fs-html', label: 'HTML', default: true },
					{ id: 'skill-fs-tailwind', label: 'TailwindCSS', default: true },
					{ id: 'skill-fs-vue', label: 'VueJS/Vue3', default: true },
					{ id: 'skill-fs-express', label: 'ExpressJS', default: true },
					{ id: 'skill-fs-react', label: 'ReactJS', default: true },
				]
			},
			{
				name: 'Cloud Dev', categoryId: 'skills-cloud', categoryDefault: false, parent: 'skills-cloud', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-cloud-azure', label: 'Microsoft Azure', default: true },
					{ id: 'skill-cloud-gae', label: 'GAE', default: true },
					{ id: 'skill-cloud-heroku', label: 'Heroku', default: true },
					{ id: 'skill-cloud-cosmos', label: 'CosmosDB', default: true },
					{ id: 'skill-cloud-docker', label: 'Docker', default: true },
					{ id: 'skill-cloud-node', label: 'NodeJS', default: true },
				]
			},
			{
				name: 'Software Dev', categoryId: 'skills-software', categoryDefault: false, parent: 'skills-software', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-sw-git', label: 'Git', default: true },
					{ id: 'skill-sw-ssh', label: 'SSH', default: true },
					{ id: 'skill-sw-jira', label: 'Jira', default: true },
					{ id: 'skill-sw-linux', label: 'Linux', default: true },
					{ id: 'skill-sw-vim', label: 'Vim', default: true },
					{ id: 'skill-sw-vscode', label: 'VSCode', default: true },
					{ id: 'skill-sw-pygame', label: 'PyGame', default: true },
					{ id: 'skill-sw-javafx', label: 'JavaFx', default: true },
					{ id: 'skill-sw-godot', label: 'Godot', default: true },
					{ id: 'skill-sw-opengl', label: 'OpenGL', default: true },
				]
			},
			{
				name: 'Data Analysis', categoryId: 'skills-data', categoryDefault: false, parent: 'skills-data', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-data-matplotlib', label: 'MatPlotLib', default: true },
					{ id: 'skill-data-seaborn', label: 'Seaborn', default: true },
					{ id: 'skill-data-numpy', label: 'NumPy', default: true },
					{ id: 'skill-data-sklearn', label: 'SciKit-Learn', default: true },
					{ id: 'skill-data-jupyter', label: 'Jupyter Notebook', default: true },
				]
			},
			{
				name: 'Art / Design', categoryId: 'skills-art', categoryDefault: false, parent: 'skills-art', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-art-krita', label: 'Krita', default: true },
					{ id: 'skill-art-gimp', label: 'Gimp', default: true },
					{ id: 'skill-art-blender', label: 'Blender', default: true },
					{ id: 'skill-art-audacity', label: 'Audacity', default: true },
					{ id: 'skill-art-reaper', label: 'Reaper', default: true },
					{ id: 'skill-art-css', label: 'CSS', default: true },
					{ id: 'skill-art-inkscape', label: 'Inkscape', default: true },
				]
			},
			{
				name: 'Competencies', categoryId: 'skills-competencies', categoryDefault: false, parent: 'skills-competencies', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-comp-research', label: 'Scientific Research', default: true },
					{ id: 'skill-comp-cg', label: 'Computer Graphics', default: true },
					{ id: 'skill-comp-realtime', label: 'Real-Time/Parallel', default: true },
					{ id: 'skill-comp-pedagogy', label: 'Pedagogy', default: true },
					{ id: 'skill-comp-data', label: 'Data Management', default: true },
					{ id: 'skill-comp-ui', label: 'UI Design', default: true },
					{ id: 'skill-comp-docs', label: 'Documentation', default: true },
					{ id: 'skill-comp-optim', label: 'Optimisation', default: true },
				]
			},
			{
				name: 'Languages #2', categoryId: 'skills-languages2', categoryDefault: true, parent: 'skills-languages2', addType: 'skill', dynamic: true,
				items: [
					{ id: 'skill-lang2-english', label: 'English (Native)', default: true },
					{ id: 'skill-lang2-french', label: 'French (Native)', default: true },
					{ id: 'skill-lang2-russian', label: 'Russian (Beginner)', default: true },
				]
			},
		]
	},
	{
		name: 'Hobbies',
		type: 'dynamic',
		parent: 'hobbies',
		addType: 'hobby',
		items: [
			{ id: 'hobbies-trekking', label: 'Trekking', default: true },
			{ id: 'hobbies-gamejams', label: 'Game-Jams', default: true },
			{ id: 'hobbies-running', label: 'Running', default: true },
			{ id: 'hobbies-painting', label: 'Painting', default: true },
			{ id: 'hobbies-photography', label: 'Photography', default: false },
		]
	},
	{
		name: 'Projects',
		type: 'simple',
		items: [
			{ id: 'projects-gltf', label: 'GLTF + PBR Renderer', default: true },
			{ id: 'projects-engine', label: 'Game Engine', default: true },
			{ id: 'projects-planets', label: 'Procedural Planets', default: true },
			{ id: 'projects-listener', label: 'The Listener', default: true },
			{ id: 'projects-dithering', label: 'Fractal Dithering', default: false },
			{ id: 'projects-cubecade', label: 'Cubecade', default: false },
			{ id: 'projects-ludum53', label: 'Ludum Dare 53', default: false },
			{ id: 'projects-gmtk23', label: 'GMTK 2023', default: false },
			{ id: 'projects-timeline', label: 'Timeline', default: false },
			{ id: 'projects-scribbles', label: 'Scribbles in VR', default: false },
			{ id: 'projects-ml', label: 'ML Report', default: false },
			{ id: 'projects-runway', label: 'Runway Redeclaration', default: false },
		]
	},
	{
		name: 'Work Experience',
		type: 'simple',
		items: [
			{ id: 'work-tools', label: 'Tools Programmer', default: true },
			{ id: 'work-bosch', label: 'Embedded Dev - Bosch', default: true },
			{ id: 'work-phd', label: 'PhD Student', default: true },
			{ id: 'work-demonstrator', label: 'Student Demonstrator', default: true },
			{ id: 'work-frontend', label: 'Front-end Web Dev', default: true },
		]
	}
];

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

const BUILTIN_PALETTES = {
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

function capitalize(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
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

// ===== Build defaults from LEFT_SIDEBAR_DEFS =====
function buildDefaults() {
	const defaults = {};
	for (const section of LEFT_SIDEBAR_DEFS) {
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

// ===== Built-in layout templates =====
const BUILTIN_TMPLS = {
	'default': {
		label: 'Default',
		toggles: buildDefaults(),
		contactLayout: 'left',
		customItems: [],
		deletedDefaults: [],
		sizing: {},
		bannerTitle: 'Render / Engine Programmer'
	}
};

// ===== DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
	const page = document.getElementById('page');

	// Build default state from definitions
	const defaults = buildDefaults();
	const defaultLayout = 'left';

	// Migrate old localStorage key
	if (!localStorage.getItem(PALETTE_KEY) && localStorage.getItem('cv-templates')) {
		localStorage.setItem(PALETTE_KEY, localStorage.getItem('cv-templates'));
		localStorage.removeItem('cv-templates');
	}

	// Load saved state, merging with defaults
	let saved = {};
	try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}
	const state = { ...defaults, ...saved };
	if (!state._contactLayout) state._contactLayout = defaultLayout;
	if (!state._customItems) state._customItems = [];
	if (!state._deletedDefaults) state._deletedDefaults = [];

	// --- Page element helpers (unchanged) ---
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

	function applyState() {
		for (const [id, visible] of Object.entries(state)) {
			if (id.startsWith('_') || id.startsWith('contact-layout-')) continue;
			document.querySelectorAll('[data-toggle-id="' + id + '"]').forEach(el => {
				el.classList.toggle('hidden', !visible);
			});
		}
		// Photo placeholder: hidden when photo is shown
		const showPhoto = !!state['cv-photo'];
		document.querySelectorAll('[data-toggle-id="cv-photo-placeholder"]').forEach(el => {
			el.classList.toggle('hidden', showPhoto);
		});
		const layout = state._contactLayout;
		document.querySelectorAll('[data-toggle-id="contact-layout-left"]').forEach(el => {
			el.classList.toggle('hidden', layout !== 'left');
		});
		document.querySelectorAll('[data-toggle-id="contact-layout-bottom"]').forEach(el => {
			el.classList.toggle('hidden', layout !== 'bottom');
		});
		document.querySelectorAll('[data-toggle-id="contact-layout-banner"]').forEach(el => {
			el.classList.toggle('hidden', layout !== 'banner');
		});
	}

	function saveState() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}

	// ==========================================
	// TOP BAR — Menu buttons
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

	// Download
	document.getElementById('btn-download').addEventListener('click', () => window.print());

	// New Palette
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

	// Load Palette
	document.getElementById('btn-load-palette').addEventListener('click', () => {
		openModal('<h3>Load Palette</h3><div class="template-grid" id="palette-grid"></div>');
		renderPaletteGrid();
	});

	// New Template
	document.getElementById('btn-new-template').addEventListener('click', () => {
		openModal(
			'<h3>New Template</h3>' +
			'<p>Save the current layout (toggles, sizing, title) as a template.</p>' +
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
	// LEFT SIDEBAR — lil-gui
	// ==========================================
	const leftGui = new lil.GUI({ container: document.getElementById('left-gui-container'), autoPlace: false });

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

	// Build a dynamic subfolder (education subgroup or skill category with add/delete)
	function buildDynamicSubfolder(parentFolder, subDef, isSkill) {
		const activeItems = getActiveItems(subDef);
		const proxy = {};

		// Category toggle for skills
		if (isSkill && subDef.categoryId) {
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

		// Add input proxy
		proxy['__newItem__'] = '';

		const folder = parentFolder.addFolder(subDef.name).close();

		function rebuild() {
			folder.destroy();
			buildDynamicSubfolder(parentFolder, subDef, isSkill);
		}

		// Category toggle
		if (isSkill && subDef.categoryId) {
			folder.add(proxy, '__category__').name('Show category').onChange(val => {
				state[subDef.categoryId] = val;
				applyState();
				saveState();
			});
		}

		// Item controllers with delete buttons
		activeItems.forEach(item => {
			const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
				state[item.id] = val;
				applyState();
				saveState();
			});
			injectDeleteButton(ctrl, item.id, rebuild);
		});

		// Add new item
		const addCtrl = folder.add(proxy, '__newItem__').name('New ' + subDef.addType);
		const addBtn = { 'Add': () => {
			const text = proxy['__newItem__'].trim();
			if (!text) return;
			addItem(subDef.parent, subDef.addType, text);
			rebuild();
		}};
		folder.add(addBtn, 'Add');

		return folder;
	}

	// Build each section
	for (const section of LEFT_SIDEBAR_DEFS) {
		if (section.type === 'contact') {
			const folder = leftGui.addFolder(section.name);
			// Layout dropdown
			const layoutProxy = { layout: state._contactLayout };
			folder.add(layoutProxy, 'layout', section.layout.options).name('Layout').onChange(val => {
				state._contactLayout = val;
				applyState();
				saveState();
			});
			// Contact toggles
			section.items.forEach(item => {
				const proxy = {};
				proxy[item.id] = !!state[item.id];
				folder.add(proxy, item.id).name(item.label).onChange(val => {
					state[item.id] = val;
					applyState();
					saveState();
				});
			});
		}
		else if (section.type === 'simple') {
			const folder = leftGui.addFolder(section.name);
			section.items.forEach(item => {
				const proxy = {};
				proxy[item.id] = !!state[item.id];
				folder.add(proxy, item.id).name(item.label).onChange(val => {
					state[item.id] = val;
					applyState();
					saveState();
				});
			});
		}
		else if (section.type === 'dynamic') {
			// Top-level dynamic group (Hobbies)
			const folder = leftGui.addFolder(section.name);

			function rebuildHobbies() {
				// Destroy all children and rebuild
				while (folder.controllers.length) folder.controllers[0].destroy();
				while (folder.folders.length) folder.folders[0].destroy();

				const activeItems = getActiveItems(section);
				const proxy = {};
				activeItems.forEach(item => {
					if (item.id in state) {
						proxy[item.id] = !!state[item.id];
					} else {
						proxy[item.id] = item.default;
						state[item.id] = item.default;
					}
				});
				proxy['__newItem__'] = '';

				activeItems.forEach(item => {
					const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
						state[item.id] = val;
						applyState();
						saveState();
					});
					injectDeleteButton(ctrl, item.id, rebuildHobbies);
				});

				folder.add(proxy, '__newItem__').name('New ' + section.addType);
				folder.add({ 'Add': () => {
					const text = proxy['__newItem__'].trim();
					if (!text) return;
					addItem(section.parent, section.addType, text);
					rebuildHobbies();
				}}, 'Add');
			}
			rebuildHobbies();
		}
		else if (section.type === 'subgroups' || section.type === 'skills') {
			const folder = leftGui.addFolder(section.name);
			const isSkill = section.type === 'skills';
			section.subgroups.forEach(sub => {
				if (sub.dynamic) {
					buildDynamicSubfolder(folder, sub, isSkill);
				}
			});
		}
	}

	// ==========================================
	// RIGHT SIDEBAR — Theme
	// ==========================================

	// Load custom palettes + migrate v0 → v1
	let customPalettes = {};
	try { customPalettes = JSON.parse(localStorage.getItem(PALETTE_KEY)) || {}; } catch (e) {}
	let palettesMigrated = false;
	for (const key of Object.keys(customPalettes)) {
		if (!customPalettes[key].version) {
			customPalettes[key] = migrateV0(customPalettes[key]);
			palettesMigrated = true;
		}
	}
	function savePalettes() { localStorage.setItem(PALETTE_KEY, JSON.stringify(customPalettes)); }
	if (palettesMigrated) savePalettes();

	// Load custom layout templates
	let customTmpls = {};
	try { customTmpls = JSON.parse(localStorage.getItem(TMPL_KEY)) || {}; } catch (e) {}
	function saveTmpls() { localStorage.setItem(TMPL_KEY, JSON.stringify(customTmpls)); }

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
	if (!state._activePalette) state._activePalette = 'castlebw';
	if (!state._activeLayout) state._activeLayout = 'default';

	// --- Sizing proxy for lil-gui ---
	const sizingProxy = {};
	allDefs.forEach(def => {
		const saved = state._theme.sizing[def.var];
		sizingProxy[def.var] = saved ? parseFloat(saved) : def.default;
	});

	// --- Palette options for gradient dropdowns ---
	const paletteOptions = {};
	PALETTE_KEYS.forEach(k => { paletteOptions[capitalize(k)] = k; });

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

	function onThemeChange() {
		state._activePalette = null;
		applyTheme();
		saveState();
	}

	function onGradientChange() {
		state._activePalette = null;
		applyTheme();
		saveState();
	}

	// --- lil-gui setup ---
	const gui = new lil.GUI({ container: document.getElementById('gui-container'), autoPlace: false });

	// Base Colors folder
	const colorsFolder = gui.addFolder('Base Colors');
	BASE_KEYS.forEach(k => {
		colorsFolder.addColor(state._theme.colors, k)
			.name(capitalize(k))
			.onChange(() => onThemeChange());
	});

	// Banner folder
	const bannerFolder = gui.addFolder('Banner');
	bannerFolder.add(state._theme.banner, 'textColor', paletteOptions)
		.name('Text Color')
		.onChange(() => onThemeChange());
	bannerFolder.add(state._theme.banner, 'title')
		.name('Title')
		.onChange(() => { applyTheme(); saveState(); });

	// Gradients folder
	let gradientsFolder;
	function buildGradientGUI() {
		if (gradientsFolder) gradientsFolder.destroy();
		gradientsFolder = gui.addFolder('Gradients');
		for (const gKey of GRADIENT_KEYS) {
			const grad = state._theme.gradients[gKey];
			const gf = gradientsFolder.addFolder(grad.label);
			grad.stops.forEach((stop, si) => {
				if (stop.lightness == null) {
					stop.lightness = Math.round(hexToHSL(resolveColor(stop.base, state._theme.colors)).l);
				}
				const prefix = si === 0 ? 'Start' : 'End';
				gf.add(stop, 'base', paletteOptions).name(prefix).onChange(onGradientChange);
				gf.add(stop, 'lightness', 0, 100, 1).name(prefix + ' L').onChange(onGradientChange);
				gf.add(stop, 'satShift', -50, 50, 1).name(prefix + ' Sat').onChange(onGradientChange);
			});
			gf.close();
		}
	}
	buildGradientGUI();

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

	// --- syncThemeUI (called on palette load) ---
	function syncThemeUI() {
		allDefs.forEach(def => {
			const saved = state._theme.sizing[def.var];
			sizingProxy[def.var] = saved ? parseFloat(saved) : def.default;
		});
		buildGradientGUI();
		gui.controllersRecursive().forEach(c => c.updateDisplay());
	}

	// --- Palette management ---
	function loadPalette(key) {
		const allPalettes = { ...BUILTIN_PALETTES, ...customPalettes };
		const p = allPalettes[key];
		if (!p) return;
		const t = p.theme;
		// Only apply color-related properties; preserve sizing and banner title
		state._theme.colors = deepClone(t.colors);
		state._theme.gradients = deepClone(t.gradients);
		if (t.banner) state._theme.banner.textColor = t.banner.textColor || 'darker';
		if (!state._theme.colors.light) state._theme.colors.light = setLightness(state._theme.colors.darker, 90);
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
				gradients: deepClone(state._theme.gradients),
				banner: { textColor: state._theme.banner.textColor }
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
		const allPalettes = { ...BUILTIN_PALETTES, ...customPalettes };
		for (const [key, p] of Object.entries(allPalettes)) {
			const isBuiltin = key in BUILTIN_PALETTES;
			const colors = p.theme ? p.theme.colors : p.colors;
			const card = document.createElement('div');
			card.className = 'template-card' + (state._activePalette === key ? ' active' : '');

			// Mini page preview
			const preview = document.createElement('div');
			preview.className = 'template-preview';
			const previewLeft = document.createElement('div');
			previewLeft.className = 'preview-left';
			previewLeft.style.background = colors.darker || '#000';
			const previewRight = document.createElement('div');
			previewRight.className = 'preview-right';
			previewRight.style.background = colors.lightest || '#fff';
			const previewBanner = document.createElement('div');
			previewBanner.className = 'preview-banner';
			previewBanner.style.background = colors.accent || '#ccc';
			previewRight.appendChild(previewBanner);
			preview.appendChild(previewLeft);
			preview.appendChild(previewRight);
			card.appendChild(preview);

			preview.addEventListener('click', () => {
				loadPalette(key);
				closeModal();
			});

			// Name row
			const nameRow = document.createElement('div');
			nameRow.className = 'template-card-name-row';

			if (!isBuiltin) {
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
			} else {
				const nameSpan = document.createElement('span');
				nameSpan.className = 'template-card-name';
				nameSpan.textContent = p.label;
				nameRow.appendChild(nameSpan);
			}

			card.appendChild(nameRow);
			grid.appendChild(card);
		}
	}

	// --- Template management (layout/toggle state) ---
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
			contactLayout: state._contactLayout,
			customItems: deepClone(state._customItems || []),
			deletedDefaults: deepClone(state._deletedDefaults || []),
			sizing: deepClone(state._theme.sizing || {}),
			bannerTitle: state._theme.banner.title
		};
		state._activeLayout = key;
		saveTmpls();
		saveState();
	}

	function loadTmpl(key) {
		const allTmpls = { ...BUILTIN_TMPLS, ...customTmpls };
		const tmpl = allTmpls[key];
		if (!tmpl) return;

		// Build new state from template, keeping current palette
		const newState = {};
		for (const [k, v] of Object.entries(tmpl.toggles)) {
			newState[k] = v;
		}
		newState._contactLayout = tmpl.contactLayout || 'left';
		newState._customItems = deepClone(tmpl.customItems || []);
		newState._deletedDefaults = deepClone(tmpl.deletedDefaults || []);

		// Keep current theme but update sizing and banner title
		const theme = deepClone(state._theme);
		theme.sizing = deepClone(tmpl.sizing || {});
		theme.banner.title = tmpl.bannerTitle || 'Render / Engine Programmer';
		newState._theme = theme;

		newState._activePalette = state._activePalette;
		newState._activeLayout = key;

		localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
		location.reload();
	}

	function renderTmplGrid() {
		const grid = document.getElementById('tmpl-grid');
		if (!grid) return;
		grid.innerHTML = '';
		const allTmpls = { ...BUILTIN_TMPLS, ...customTmpls };
		for (const [key, tmpl] of Object.entries(allTmpls)) {
			const isBuiltin = key in BUILTIN_TMPLS;
			const card = document.createElement('div');
			card.className = 'template-card' + (state._activeLayout === key ? ' active' : '');

			// Preview — show banner title text
			const preview = document.createElement('div');
			preview.className = 'template-preview tmpl-preview-block';
			const titleSpan = document.createElement('span');
			titleSpan.className = 'tmpl-preview-title';
			titleSpan.textContent = tmpl.bannerTitle || 'Template';
			preview.appendChild(titleSpan);
			card.appendChild(preview);

			preview.addEventListener('click', () => {
				loadTmpl(key);
			});

			// Name row
			const nameRow = document.createElement('div');
			nameRow.className = 'template-card-name-row';

			if (!isBuiltin) {
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
			} else {
				const nameSpan = document.createElement('span');
				nameSpan.className = 'template-card-name';
				nameSpan.textContent = tmpl.label;
				nameRow.appendChild(nameSpan);
			}

			card.appendChild(nameRow);
			grid.appendChild(card);
		}
	}

	// --- Apply + sync on load ---
	applyTheme();
	syncThemeUI();

	// --- Apply left sidebar state ---
	applyState();
	saveState();
});
