// ===== Constants =====
const STORAGE_KEY = 'cv-toggle-state';
const PALETTE_KEY = 'cv-palettes';
const TMPL_KEY = 'cv-layout-templates';
const COLOR_HISTORY_KEY = 'cv-color-history';
const COLOR_HISTORY_MAX = 16;
const FIXED_COLORS = { black: '#000000', white: '#ffffff' };
const BASE_KEYS = ['darker', 'dark', 'lightish', 'light', 'lightest', 'accent', 'complement'];
const PALETTE_KEYS = ['black', 'white', ...BASE_KEYS];
const GRADIENT_KEYS = ['leftbg', 'banner', 'grid', 'details'];

const SIZING_GROUPS = [
	{ name: 'Left Panel', children: [
		{ name: 'Text Sizes', defs: [
			{ var: '--left-very-large', label: 'Very large', min: 8, max: 36, step: 0.5, unit: 'pt', default: 22 },
			{ var: '--left-large', label: 'Large', min: 8, max: 30, step: 0.5, unit: 'pt', default: 16 },
			{ var: '--left-medium', label: 'Medium', min: 8, max: 30, step: 0.5, unit: 'pt', default: 15 },
			{ var: '--left-small', label: 'Small', min: 8, max: 30, step: 0.5, unit: 'pt', default: 14 },
		]},
		{ name: 'Padding', defs: [
			{ var: '--left-block-sides', label: 'Block sides', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
		]},
		{ name: 'Gaps', defs: [
			{ var: '--left-very-top', label: 'Top margin', min: 0, max: 40, step: 0.5, unit: 'mm', default: 21 },
			{ var: '--left-section-gap', label: 'Section', min: 0, max: 30, step: 0.5, unit: 'mm', default: 17 },
			{ var: '--left-title-bottom', label: 'Title bottom', min: 0, max: 25, step: 0.5, unit: 'mm', default: 13 },
			{ var: '--left-block-gap', label: 'Block', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
			{ var: '--left-skill-gap', label: 'Skill', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
			{ var: '--left-languages-gap', label: 'Language', min: 0, max: 15, step: 0.5, unit: 'mm', default: 4 },
		]},
	]},
	{ name: 'Right Panel', children: [
		{ name: 'Banner', defs: [
			{ var: '--banner-top', label: 'Banner top', min: 0, max: 30, step: 0.5, unit: 'mm', default: 5 },
			{ var: '--banner-contact-gap', label: 'Contact gap', min: 0, max: 10, step: 0.5, unit: 'mm', default: 1 },
		]},
		{ name: 'Padding', defs: [
			{ var: '--right-block-sides', label: 'Block sides', min: 0, max: 25, step: 0.5, unit: 'mm', default: 13 },
		]},
		{ name: 'Gaps', defs: [
			{ var: '--right-very-top', label: 'Top margin', min: 0, max: 20, step: 0.5, unit: 'mm', default: 9 },
			{ var: '--right-section-gap', label: 'Section', min: 0, max: 20, step: 0.5, unit: 'mm', default: 8.5 },
			{ var: '--right-title-bottom', label: 'Title bottom', min: 0, max: 25, step: 0.5, unit: 'mm', default: 10 },
			{ var: '--right-block-gap', label: 'Block', min: 0, max: 20, step: 0.5, unit: 'mm', default: 9.3 },
			{ var: '--right-grid-gap', label: 'Grid', min: 0, max: 15, step: 0.5, unit: 'mm', default: 6.4 },
			{ var: '--right-grid-height', label: 'Grid height', min: 60, max: 200, step: 1, unit: 'mm', default: 127 },
		]},
	]},
];
const allDefs = SIZING_GROUPS.flatMap(g => g.children.flatMap(c => c.defs));

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
				name: 'Game Dev.', categoryId: 'skills-game-dev', categoryDefault: false, parent: 'skills-game-dev', addType: 'skill', dynamic: true,
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
			{ id: 'projects-indie-games', label: 'Indie Games', default: false },
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
		bannerTitle: 'Render / Engine Programmer',
		sectionOrder: LEFT_SIDEBAR_DEFS.map(s => s.name),
		itemOrder: {}
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

	// Item order within sections
	if (!state._itemOrder || typeof state._itemOrder !== 'object') state._itemOrder = {};

	// Skill category order
	const skillSection = LEFT_SIDEBAR_DEFS.find(s => s.type === 'skills');
	const skillCatIds = skillSection ? skillSection.subgroups.map(s => s.categoryId) : [];
	if (!Array.isArray(state._skillCategoryOrder)) {
		state._skillCategoryOrder = [...skillCatIds];
	} else {
		state._skillCategoryOrder = state._skillCategoryOrder.filter(id => skillCatIds.includes(id));
		skillCatIds.forEach(id => { if (!state._skillCategoryOrder.includes(id)) state._skillCategoryOrder.push(id); });
	}

	// Section order
	const defNames = LEFT_SIDEBAR_DEFS.map(s => s.name);
	if (!Array.isArray(state._sectionOrder)) {
		state._sectionOrder = [...defNames];
	} else {
		state._sectionOrder = state._sectionOrder.filter(n => defNames.includes(n));
		defNames.forEach(n => { if (!state._sectionOrder.includes(n)) state._sectionOrder.push(n); });
	}

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
				return document.querySelector('#education .block:nth-of-type(1) .list');
			}
			if (parent === 'edu-soton') {
				return document.querySelector('#education .block:nth-of-type(2) .list');
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

	// Resume section reordering
	const SECTION_RESUME_MAP = {
		'Education': { id: 'education', column: 'left' },
		'Skills': { id: 'skills', column: 'left' },
		'Hobbies': { id: 'hobbies', column: 'left' },
		'Projects': { id: 'projects', column: 'right' },
		'Work Experience': { id: 'work experience', column: 'right' },
	};

	function applySectionOrder() {
		const leftCol = document.querySelector('.page .left');
		const rightCol = document.querySelector('.page .right');
		const contactLeft = leftCol.querySelector('[data-toggle-id="contact-layout-left"]');

		for (const name of state._sectionOrder) {
			const mapping = SECTION_RESUME_MAP[name];
			if (!mapping) continue;
			const el = document.getElementById(mapping.id);
			if (!el) continue;
			if (mapping.column === 'left') {
				if (contactLeft) leftCol.insertBefore(el, contactLeft);
				else leftCol.appendChild(el);
			} else {
				rightCol.appendChild(el);
			}
		}
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

	function applySkillCategoryOrder() {
		const container = document.querySelector('#skills .skill');
		if (!container) return;
		for (const catId of state._skillCategoryOrder) {
			const block = container.querySelector('[data-toggle-id="' + catId + '"]');
			if (block) container.appendChild(block);
		}
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

	// ==========================================
	// COLOR PICKER
	// ==========================================
	function drawSVCanvas(canvas, hue) {
		const w = parseInt(canvas.style.width);
		const h = parseInt(canvas.style.height);
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, w, h);
		// fill with current hue at full saturation/value
		ctx.fillStyle = hsvToHex(hue, 100, 100);
		ctx.fillRect(0, 0, w, h);
		// white gradient left→right
		const wGrad = ctx.createLinearGradient(0, 0, w, 0);
		wGrad.addColorStop(0, 'rgba(255,255,255,1)');
		wGrad.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = wGrad;
		ctx.fillRect(0, 0, w, h);
		// black gradient top→bottom
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
			// position SV cursor
			svCursor.style.left = (hsv.s / 100 * SV_SIZE) + 'px';
			svCursor.style.top = ((1 - hsv.v / 100) * SV_SIZE) + 'px';
			// position hue cursor
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

		// Draw initial canvases
		drawSVCanvas(svCanvas, hsv.h);
		drawHueBar(hueCanvas);
		updateFromHSV();

		// SV canvas interaction
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

		// Hue bar interaction
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

		// Hex input
		hexInput.addEventListener('input', () => {
			const val = hexInput.value.replace(/[^0-9a-fA-F]/g, '');
			if (val.length === 6) {
				currentHex = '#' + val.toLowerCase();
				hsv = hexToHSV(currentHex);
				drawSVCanvas(svCanvas, hsv.h);
				updateFromHSV();
			}
		});

		// Mode switch
		modeSelect.addEventListener('change', () => buildSliders());

		// History swatches
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

		// Apply
		document.getElementById('cp-apply').addEventListener('click', () => {
			addToColorHistory(currentHex);
			onConfirm(currentHex);
			closeModal();
		});

		// Cancel
		document.getElementById('cp-cancel').addEventListener('click', () => closeModal());
	}

	// Panel toggles
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

	// Export / Import
	document.getElementById('btn-export').addEventListener('click', () => {
		const data = {};
		[STORAGE_KEY, PALETTE_KEY, TMPL_KEY, COLOR_HISTORY_KEY].forEach(key => {
			const val = localStorage.getItem(key);
			if (val) data[key] = JSON.parse(val);
		});
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'ixil-resume-settings.json';
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

	// Setup drag-to-reorder for item controllers within a folder
	function setupItemReorder(container, itemElements, orderKey) {
		if (itemElements.length < 2) return;

		// Find suffix boundary (first element after the last item)
		const lastItem = itemElements[itemElements.length - 1].el;
		const refEl = lastItem.nextElementSibling;

		// Initialize or apply saved order
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

		// Add drag handles
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
		if (isSkill && subDef.categoryId) {
			folder.domElement.dataset.skillCategoryId = subDef.categoryId;
		}

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
		const addCtrl = folder.add(proxy, '__newItem__').name('New ' + subDef.addType);
		const addBtn = { 'Add': () => {
			const text = proxy['__newItem__'].trim();
			if (!text) return;
			addItem(subDef.parent, subDef.addType, text);
			rebuild();
		}};
		folder.add(addBtn, 'Add');

		setupItemReorder(folder.$children, itemEls, subDef.parent);

		return folder;
	}

	// Build each section (in saved order)
	const orderedDefs = state._sectionOrder.map(name => LEFT_SIDEBAR_DEFS.find(s => s.name === name)).filter(Boolean);
	for (const section of orderedDefs) {
		if (section.type === 'contact') {
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;
			// Layout dropdown
			const layoutProxy = { layout: state._contactLayout };
			folder.add(layoutProxy, 'layout', section.layout.options).name('Layout').onChange(val => {
				state._contactLayout = val;
				applyState();
				saveState();
			});
			// Contact toggles
			const contactEls = [];
			section.items.forEach(item => {
				const proxy = {};
				proxy[item.id] = !!state[item.id];
				const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
					state[item.id] = val;
					applyState();
					saveState();
				});
				contactEls.push({el: ctrl.domElement, id: item.id});
			});
			setupItemReorder(folder.$children, contactEls, section.name);
		}
		else if (section.type === 'simple') {
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;
			const simpleEls = [];
			section.items.forEach(item => {
				const proxy = {};
				proxy[item.id] = !!state[item.id];
				const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
					state[item.id] = val;
					applyState();
					saveState();
				});
				simpleEls.push({el: ctrl.domElement, id: item.id});
			});
			setupItemReorder(folder.$children, simpleEls, section.name);
		}
		else if (section.type === 'dynamic') {
			// Top-level dynamic group (Hobbies)
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;

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

				const hobbyEls = [];
				activeItems.forEach(item => {
					const ctrl = folder.add(proxy, item.id).name(item.label).onChange(val => {
						state[item.id] = val;
						applyState();
						saveState();
					});
					injectDeleteButton(ctrl, item.id, rebuildHobbies);
					hobbyEls.push({el: ctrl.domElement, id: item.id});
				});

				folder.add(proxy, '__newItem__').name('New ' + section.addType);
				folder.add({ 'Add': () => {
					const text = proxy['__newItem__'].trim();
					if (!text) return;
					addItem(section.parent, section.addType, text);
					rebuildHobbies();
				}}, 'Add');

				setupItemReorder(folder.$children, hobbyEls, section.parent);
			}
			rebuildHobbies();
		}
		else if (section.type === 'subgroups' || section.type === 'skills') {
			const folder = leftGui.addFolder(section.name);
			folder.domElement.dataset.sectionName = section.name;
			const isSkill = section.type === 'skills';

			// Build subfolders in saved category order
			const orderedSubs = isSkill
				? state._skillCategoryOrder
					.map(catId => section.subgroups.find(s => s.categoryId === catId))
					.filter(Boolean)
				: section.subgroups;

			orderedSubs.forEach(sub => {
				if (sub.dynamic) {
					buildDynamicSubfolder(folder, sub, isSkill);
				}
			});

			// Add drag-to-reorder for skill category sub-folders
			if (isSkill) {
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
	}

	// ==========================================
	// LEFT SIDEBAR — Drag handles for reordering
	// ==========================================
	(function initDragReorder() {
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

				const onMouseMove = (e) => {
					const siblings = Array.from(container.children);
					const dragIdx = siblings.indexOf(folderEl);
					for (let j = 0; j < siblings.length; j++) {
						if (j === dragIdx) continue;
						const rect = siblings[j].getBoundingClientRect();
						const midY = rect.top + rect.height / 2;
						if (j < dragIdx && e.clientY < midY) {
							container.insertBefore(folderEl, siblings[j]);
							break;
						} else if (j > dragIdx && e.clientY > midY) {
							container.insertBefore(folderEl, siblings[j].nextSibling);
							break;
						}
					}
				};

				const onMouseUp = () => {
					folderEl.classList.remove('dragging');
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
					// Read new order from DOM
					state._sectionOrder = Array.from(container.children)
						.map(el => el.dataset.sectionName)
						.filter(Boolean);
					applySectionOrder();
					saveState();
				};

				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
			});
		});
	})();

	// ==========================================
	// RIGHT SIDEBAR — Theme
	// ==========================================

	// Load custom palettes + migrate v0 → v1
	let customPalettes = {};
	try { customPalettes = JSON.parse(localStorage.getItem(PALETTE_KEY)) || {}; } catch (e) {}
	// Seed builtins into custom so they're all editable/deletable
	for (const [k, v] of Object.entries(BUILTIN_PALETTES)) {
		if (!(k in customPalettes)) customPalettes[k] = deepClone(v);
	}
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
	// Seed builtins into custom so they're all editable/deletable
	for (const [k, v] of Object.entries(BUILTIN_TMPLS)) {
		if (!(k in customTmpls)) customTmpls[k] = deepClone(v);
	}
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
		const ctrl = colorsFolder.addColor(state._theme.colors, k)
			.name(capitalize(k))
			.onChange(() => onThemeChange());
		// Disable native color input and intercept clicks for custom picker
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

	// Sizing folders (grouped)
	function addDefToFolder(folder, def) {
		folder.add(sizingProxy, def.var, def.min, def.max, def.step)
			.name(def.label)
			.onChange(val => {
				state._theme.sizing[def.var] = val + def.unit;
				page.style.setProperty(def.var, val + def.unit);
				saveState();
			});
	}

	SIZING_GROUPS.forEach(group => {
		const topFolder = gui.addFolder(group.name).close();
		group.children.forEach(sub => {
			const subFolder = topFolder.addFolder(sub.name).close();
			sub.defs.forEach(def => addDefToFolder(subFolder, def));
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
		const allPalettes = customPalettes;
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
		const allPalettes = customPalettes;
		for (const [key, p] of Object.entries(allPalettes)) {
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
			bannerTitle: state._theme.banner.title,
			sectionOrder: deepClone(state._sectionOrder),
			itemOrder: deepClone(state._itemOrder),
			skillCategoryOrder: deepClone(state._skillCategoryOrder)
		};
		state._activeLayout = key;
		saveTmpls();
		saveState();
	}

	function loadTmpl(key) {
		const allTmpls = customTmpls;
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
		const allTmpls = customTmpls;
		for (const [key, tmpl] of Object.entries(allTmpls)) {
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

			const nameInput = document.createElement('input');
			nameInput.type = 'text';
			nameInput.className = 'template-card-name-input';
			nameInput.value = tmpl.label;
			nameInput.addEventListener('change', () => {
				const newName = nameInput.value.trim();
				if (newName) {
					// Copy builtin to custom if needed
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

	// --- Apply + sync on load ---
	applyTheme();
	syncThemeUI();

	// --- Apply left sidebar state ---
	applyState();
	applySectionOrder();
	applyItemOrder();
	applySkillCategoryOrder();
	saveState();

	// ==========================================
	// TRANSLATION EN/FR
	// ==========================================
	const TRANSLATIONS = {
		// Section headers
		'h-education': 'Formation',
		'h-skills': 'Compétences',
		'h-hobbies': 'Loisirs',
		'h-projects': 'Projets',
		'h-work': 'Expérience Professionnelle',
		// Banner
		'banner-title': 'Programmeur Moteur / Graphique',
		// Education
		'edu-artfx-desc': 'Mastère en Programmation Jeux Vidéo',
		'edu-artfx-graphics': 'Advanced Computer Graphics',
		'edu-artfx-shaders': 'Compute Shaders',
		'edu-artfx-engine': 'Game Engine Architecture',
		'edu-artfx-procgen': 'Procedural Generation',
		'edu-artfx-physics': 'Advance Computer Physics',
		'edu-soton-desc': 'Bachelor in Software Engineering',
		'edu-soton-realtime': 'Real-time Embedded Systems',
		'edu-soton-modelling': 'Advanced Software Modelling',
		'edu-soton-honours': 'Mention Très Bien',
		'edu-lycee-desc': 'Bac OIB S, spé ISN, option Musique',
		'edu-lycee-honours': 'Mention Très Bien',
		// Skills categories
		'sk-languages': 'LANGAGES ',
		'sk-rendering': 'RENDU ',
		'sk-engine': 'PROG. MOTEUR ',
		'sk-collab': 'COLLAB. ',
		'sk-game-dev': 'DEV. DE JEU ',
		'sk-fullstack': 'FULLSTACK ',
		'sk-cloud': 'DÉV. CLOUD ',
		'sk-software': 'DÉV. LOGICIEL ',
		'sk-data': 'ANALYSE DE DONNÉES ',
		'sk-art': 'ART / DESIGN ',
		'sk-competencies': 'COMPÉTENCES ',
		'sk-languages2': 'LANGUES ',
		// Spoken languages
		'lang-english': 'Anglais (Natif)',
		'lang-french': 'Français (Natif)',
		'lang-russian': 'Russe (Débutant)',
		// Hobbies
		'hobby-trekking': 'Randonnée',
		'hobby-gamejams': 'Game-Jams',
		'hobby-running': 'Course à pied',
		'hobby-painting': 'Peinture',
		'hobby-photography': 'Photographie',
		// Projects
		'proj-gltf-desc': 'Moteur de rendu Forward+ pour matériaux PBR et scènes GlTF. Conception et implémentation d\'un render graph, d\'un système de réflexion de code, et de fonctionnalités de rendu telles que SSAO, tonemapping, shadow maps et environment lighting.',
		'proj-engine-desc': 'Moteur Vulkan généraliste avec édition de scène en temps réel. Implémentation de la sérialisation de scènes (XML), intégration physique temps réel, gestion des entrées, dispatch d\'événements et outils d\'édition.',
		'proj-planets-desc': 'Générateur procédural de planètes et paysages. Utilise des compute shaders pour générer des hauteurs sphériques selon divers paramètres. Génère montagnes, plaines, dunes, océans et cratères selon les réglages utilisateur.',
		'proj-dithering-desc': 'Implémentation et exploration de l\'effet de SSFD de Runevision. Un filtre de dithering est mappé sur les UVs et maintenu à la même taille à toute distance grâce à un motif fractal, pour un résultat unique et rétro.',
		'proj-listener-desc': 'Programmeur Principal dans un projet de fin d\'études en équipe de 13 personnes. Travail sur l\'optimisation, l\'intégration Wwise et l\'outillage, et les fonctionnalités de gameplay.',
		'proj-cubecade-desc': 'Jeu de combat multijoueur local, axé sur des mouvements réactifs et minimalistes et des menus élégants.',
		'proj-ludum53-desc': 'Jeu d\'emballage basé sur la physique de Tetris. Réalisé en solo.',
		'proj-gmtk23-desc': 'Jeu de puzzle 3D dans Godot. Réalisé en solo.',
		'proj-timeline-desc': 'Jeu multijoueur en ligne en VueJS, hébergé sur GAE avec base de données Microsoft Azure.',
		'proj-scribbles-desc': 'Jeu de peinture VR sur un système VR fait maison avec 2 webcams, de la trigonométrie et Google Cardboard.',
		'proj-ml-desc': 'Rapport sur les fondements de l\'apprentissage automatique, illustré d\'exemples codés en Python.',
		'proj-runway-desc': 'Outil JavaFx de re-déclaration de pistes d\'aéroport en fonction des obstacles présents.',
		// Work
		'work-tools-title': 'Programmeur Outils',
		'work-tools-desc': 'Développement d\'un outil de visualisation 3D en <b>C++ & Vulkan</b> pour des chercheurs explorant des données de simulation de nuages protoplanétaires. Implémentation d\'une vue ray-marchée pour des rendus spéculatifs temps réel.',
		'work-bosch-title': 'Développeur Logiciel Embarqué',
		'work-bosch-desc': 'Développeur <b>Systèmes Embarqués</b> C/C++ en tant que consultant Elsys.',
		'work-phd-title': 'Doctorant (6 mois)',
		'work-phd-desc': 'Thèse en <b>Ingénierie Électronique</b> sur les algorithmes de placement pour un système de calcul massivement parallèle basé sur des graphes en C appelé POETS. Départ après 6 mois pour poursuivre le développement de jeux vidéo.',
		'work-demo-title': 'Démonstrateur Étudiant',
		'work-demo-desc': 'Enseignement de l\'<b>assembleur x86</b> dans le cadre de <b>Computer Systems I</b> et rédaction de tests unitaires pour les travaux de <b>Computer Engineering I</b>.',
		'work-frontend-title': 'Développeur Web Front-end',
		'work-frontend-desc': 'En tant qu\'<b>Assistant de Recherche</b>, transformation du modèle financier de l\'équipe en un outil en ligne accessible pour les détaillants.',
	};

	const langToggle = document.getElementById('lang-toggle');
	const originals = {};

	function applyLanguage(lang) {
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n');
			if (!originals[key]) originals[key] = el.innerHTML;
			if (lang === 'fr' && TRANSLATIONS[key]) {
				el.innerHTML = TRANSLATIONS[key];
			} else if (lang === 'en' && originals[key]) {
				el.innerHTML = originals[key];
			}
		});
	}

	langToggle.addEventListener('change', () => {
		applyLanguage(langToggle.checked ? 'fr' : 'en');
	});
});
