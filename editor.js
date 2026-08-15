(function () {
'use strict';

// =========================================================
// INIT
// =========================================================
const cvId = document.body.dataset.cv || 'unknown';
const stateKey = 'cv-editor-' + cvId;
const page = document.querySelector('.page');
if (!page) return;

// =========================================================
// COLOR MATH
// =========================================================
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}
function hsvToRgb(h, s, v) {
  h /= 360; s /= 100; v /= 100;
  let r, g, b;
  const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break; default: r = v; g = p; b = q;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => { if (t < 0) t++; if (t > 1) t--; if (t < 1/6) return p + (q-p)*6*t; if (t < 1/2) return q; if (t < 2/3) return p + (q-p)*(2/3-t)*6; return p; };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// =========================================================
// I18N TRANSLATIONS (Ixil only)
// =========================================================
const TRANSLATIONS = {
  'h-education':      { en: 'Education',           fr: 'Formation' },
  'h-skills':         { en: 'Skills',               fr: 'Compétences' },
  'h-hobbies':        { en: 'Hobbies',              fr: 'Loisirs' },
  'h-projects':       { en: 'Projects',             fr: 'Projets' },
  'h-work':           { en: 'Work Experience',      fr: 'Expériences Professionnelles' },
  'banner-title':     { en: 'Render / Engine Programmer', fr: 'Programmeur Rendu / Moteur' },
  'edu-artfx-desc':   { en: 'Master in Game Programming', fr: 'Master en Programmation de Jeux Vidéo' },
  'edu-artfx-graphics': { en: 'Advanced Computer Graphics', fr: 'Informatique Graphique Avancée' },
  'edu-artfx-shaders':  { en: 'Compute Shaders',   fr: 'Compute Shaders' },
  'edu-artfx-engine':   { en: 'Game Engine Architecture', fr: 'Architecture de Moteur de Jeu' },
  'edu-artfx-procgen':  { en: 'Procedural generation', fr: 'Génération Procédurale' },
  'edu-artfx-physics':  { en: 'Advanced Computer Physics', fr: 'Physique Informatique Avancée' },
  'edu-soton-desc':   { en: 'Bachelor of Software Engineering', fr: 'Licence de Génie Logiciel' },
  'edu-soton-realtime': { en: 'Real-Time Computing and Embedded Systems', fr: 'Informatique Temps Réel et Systèmes Embarqués' },
  'edu-soton-modelling':{ en: 'Advanced Software Modelling and Design', fr: 'Modélisation et Conception Logicielle Avancée' },
  'edu-soton-honours':  { en: 'First Honours',      fr: 'Mention Très Bien' },
  'edu-lycee-desc':   { en: 'American Section, Scientific Stream specializing in Numerical Sciences with Music option', fr: 'Section Américaine, filière Scientifique spécialisée en Sciences Numériques, option Musique' },
  'edu-lycee-honours':  { en: 'Highest Honours',    fr: 'Mention Très Bien' },
  'sk-languages':     { en: 'LANGUAGES ',           fr: 'LANGAGES ' },
  'sk-rendering':     { en: 'RENDERING ',           fr: 'RENDU ' },
  'sk-engine':        { en: 'ENGINE PROG. ',        fr: 'PROG. MOTEUR ' },
  'sk-tools-prog':    { en: 'TOOLS PROG. ',         fr: 'PROG. OUTILS ' },
  'sk-collab':        { en: 'COLLAB. ',             fr: 'COLLAB. ' },
  'sk-game-dev':      { en: 'GAME DEV. ',           fr: 'DEV. JEU ' },
  'sk-fullstack':     { en: 'FULLSTACK ',           fr: 'FULLSTACK ' },
  'sk-cloud':         { en: 'CLOUD DEV. ',          fr: 'DEV. CLOUD ' },
  'sk-software':      { en: 'SOFTWARE DEV. ',       fr: 'DEV. LOGICIEL ' },
  'sk-data':          { en: 'DATA ANALYSIS ',       fr: 'ANALYSE DE DONNÉES ' },
  'sk-art':           { en: 'ART / DESIGN ',        fr: 'ART / DESIGN ' },
  'sk-competencies':  { en: 'COMPETENCIES ',        fr: 'COMPÉTENCES ' },
  'sk-languages2':    { en: 'LANGUAGES #2 ',        fr: 'LANGUES #2 ' },
  'lang-english':     { en: 'English (Native)',      fr: 'Anglais (Natif)' },
  'lang-french':      { en: 'French (Native)',       fr: 'Français (Natif)' },
  'lang-russian':     { en: 'Russian (Beginner)',    fr: 'Russe (Débutant)' },
  'hobby-trekking':   { en: 'Trekking',              fr: 'Randonnée' },
  'hobby-gamejams':   { en: 'Game-Jams',             fr: 'Game-Jams' },
  'hobby-running':    { en: 'Running',               fr: 'Course à Pied' },
  'hobby-painting':   { en: 'Painting',              fr: 'Peinture' },
  'hobby-photography':{ en: 'Photography',           fr: 'Photographie' },
  'proj-gltf-desc':   { en: 'Forward+ rendering engine targeting real-time performance on integrated GPUs. Designed and implemented a render graph, a code reflection system, and core rendering features such as SSAO, tonemapping, shadow maps, and environment lighting.',
                        fr: 'Moteur de rendu Forward+ ciblant les performances temps réel sur GPU intégrés. Conception et implémentation d\'un render graph, d\'un système de réflexion de code, et de fonctionnalités clés : SSAO, tonemapping, shadow maps et éclairage d\'environnement.' },
  'proj-engine-desc': { en: 'General-purpose Vulkan engine with runtime scene editing. Implemented scene serialization (XML), real-time physics integration, input management, event dispatchers, and editor-facing engine tooling.',
                        fr: 'Moteur Vulkan polyvalent avec édition de scène en temps réel. Implémentation de la sérialisation de scène (XML), physique temps réel, gestion des entrées, dispatchers d\'événements et outils éditeur.' },
  'proj-planets-desc':{ en: 'Procedural planet and landscape generator. Uses compute shaders to generate spherical heights according to various parameters. Generates mountains, plains dunes, oceans and craters according to user settings.',
                        fr: 'Générateur procédural de planètes et paysages. Utilise des compute shaders pour générer des hauteurs sphériques selon divers paramètres. Génère montagnes, plaines, dunes, océans et cratères selon les réglages.' },
  'proj-dithering-desc':{ en: 'Implementation and exploration of Runevision\'s dithering effect. Where the filter is mapped onto the UVs and kept at the same size at any distance using a fractal pattern, leading to highly memorable retro visuals.',
                          fr: 'Implémentation de l\'effet de dithering de Runevision, mappé sur les UVs et maintenu à taille constante via un motif fractal, produisant des visuels rétro très reconnaissables.' },
  'proj-listener-desc':{ en: 'Lead Programmer in a 13 person end-of-studies team project. Worked on optimisation, Wwise integration and tooling, HUD and menus, and general narrative and gameplay features.',
                         fr: 'Lead Programmeur dans un projet de fin d\'études de 13 personnes. Travail sur l\'optimisation, l\'intégration Wwise, le HUD, les menus, et les fonctionnalités narratives et de gameplay.' },
  'proj-indie-games-desc':{ en: '<b>Cubecade</b>: local-multiplayer, single-attack fighting game.\n<b>Ludum Dare 53</b>: Tetris packing game, #73 Overall out of 1720 entries.\n<b>GMTK 2023</b>: 3D puzzle game, #577 Overall out of 6,811 entries.',
                            fr: '<b>Cubecade</b> : jeu de combat local multijoueur à une seule attaque.\n<b>Ludum Dare 53</b> : jeu de rangement Tetris, #73 général sur 1720 participations.\n<b>GMTK 2023</b> : puzzle 3D, #577 général sur 6 811 participations.' },
  'proj-unreal-desc': { en: 'Short-form projects made at ArtFX. <b>Jetpack</b>: Third person adventure game, worked on 3Cs.\n<b>Slime 64</b>: Third person collectathon, worked on traversal GPEs (rails, hooks, cannon).',
                        fr: 'Projets courts réalisés à ArtFX. <b>Jetpack</b> : jeu d\'aventure TPS, travail sur les 3C.\n<b>Slime 64</b> : collectathon TPS, travail sur les GPE de traversée (rails, crochets, canon).' },
  'proj-cubecade-desc':{ en: 'local-multiplayer fighting game, focusing on responsive, minimalist movements and slick menus.',
                         fr: 'Jeu de combat local multijoueur, centré sur des mouvements réactifs et minimalistes et des menus élégants.' },
  'proj-ludum53-desc': { en: 'Tetris-physics based packing game. Made Solo.',
                         fr: 'Jeu de rangement basé sur la physique Tetris. Réalisé solo.' },
  'proj-gmtk23-desc':  { en: '3D puzzle game in Godot. Made Solo.',
                         fr: 'Jeu de puzzle 3D dans Godot. Réalisé solo.' },
  'proj-timeline-desc':{ en: 'Cloud-based multiplayer game in VueJS, hosted on GAE with database in Microsoft Azure.',
                         fr: 'Jeu multijoueur en ligne VueJS, hébergé sur GAE avec base de données Microsoft Azure.' },
  'proj-scribbles-desc':{ en: 'VR painting game made on a homebrew VR system using 2 webcams, trigonometry, and google cardboard.',
                          fr: 'Jeu de peinture VR sur un système artisanal utilisant 2 webcams, la trigonométrie et Google Cardboard.' },
  'proj-ml-desc':      { en: 'Report on the foundations of machine learning, illustrated with examples coded in Python.',
                         fr: 'Rapport sur les fondements du machine learning, illustré par des exemples codés en Python.' },
  'proj-runway-desc':  { en: 'JavaFx tool for redeclaring airport runways depending on present obstacles.',
                         fr: 'Outil JavaFx pour re-déclarer des pistes d\'aéroport en fonction des obstacles présents.' },
  'work-tools-title':  { en: 'Research Engineer',   fr: 'Ingénieur de Recherche' },
  'work-tools-desc':   { en: 'Wrote a <b>C++ & Vulkan</b> 3D data visualization tool from scratch for researchers to explore protoplanetary cloud simulation data. Implemented a cumulative ray-marched view for real-time speculative renders.',
                         fr: 'Développement d\'un outil de visualisation 3D <b>C++ & Vulkan</b> pour explorer des données de simulation de nuages protoplanétaires. Implémentation d\'une vue ray-marchée cumulative pour des rendus spéculatifs temps réel.' },
  'work-bosch-title':  { en: 'Embedded Software Developer', fr: 'Développeur Logiciel Embarqué' },
  'work-bosch-desc':   { en: 'C/C++ <b>Embedded Systems Developer</b> as an Elsys consultant.',
                         fr: 'Développeur de <b>Systèmes Embarqués</b> C/C++ en tant que consultant Elsys.' },
  'work-phd-title':    { en: 'PhD Student (6 months)', fr: 'Doctorant (6 mois)' },
  'work-phd-desc':     { en: '<b>Electronic Engineering</b> thesis on placement algorithms for a C massively parallel graph-based computing system called POETS. Left after 6 months to pursue video game development.',
                         fr: 'Thèse d\'<b>Ingénierie Électronique</b> sur les algorithmes de placement pour un système de calcul massivement parallèle basé sur des graphes appelé POETS. Départ après 6 mois pour poursuivre le développement de jeux vidéo.' },
  'work-demo-title':   { en: 'Student Demonstrator', fr: 'Chargé de TD' },
  'work-demo-desc':    { en: 'Taught <b>x86 Assembly</b> under <b>Computer Systems I</b> and wrote unit tests for <b>Computer Engineering I</b> coursework.',
                         fr: 'Enseignement de l\'<b>Assembleur x86</b> dans le cadre de <b>Systèmes Informatiques I</b> et rédaction de tests unitaires pour <b>Ingénierie Informatique I</b>.' },
  'work-frontend-title':{ en: 'Front-end Web Developer', fr: 'Développeur Web Front-end' },
  'work-frontend-desc':{ en: 'As a <b>Research Assistant</b>, transformed the team\'s financial model into an accessible online tool for retailers to make predictions with.',
                         fr: 'En tant qu\'<b>Assistant de Recherche</b>, transformation du modèle financier de l\'équipe en un outil en ligne permettant aux détaillants de faire des prédictions.' },
};

// =========================================================
// BUILT-IN PALETTES (Ixil)
// =========================================================
const BUILT_IN_PALETTES = [
  { name: 'B&W', cssVars: {
    '--darker':'#000000','--dark':'#000000','--lightish':'#FFFFFF','--light':'#FFFFFF','--lightest':'#FFFFFF','--accent':'#D6CCC0','--complement':'#D6CCC0',
    '--leftbg-s1':'#000000','--leftbg-s2':'#262626','--banner-s1':'#d6ccc0','--banner-s2':'#c2b4a2','--grid-s1':'#ebe6e0','--grid-s2':'#d3c8bb','--details-s1':'#ebe6e0','--details-s2':'#edeceb','--banner-text':'#000000'
  }},
  { name: 'Green', cssVars: {
    '--darker':'#2c2424','--dark':'#594949','--lightish':'#aca4a4','--light':'#dedddd','--lightest':'#FFFFFF','--accent':'#6d7755','--complement':'#6d7755',
    '--leftbg-s1':'#2c2424','--leftbg-s2':'#3d3333','--banner-s1':'#8a9172','--banner-s2':'#7a8264','--grid-s1':'#c8ccc0','--grid-s2':'#b8bcb0','--details-s1':'#c8ccc0','--details-s2':'#caceca','--banner-text':'#FFFFFF'
  }},
  { name: 'Forest', cssVars: {
    '--darker':'#0c1519','--dark':'#162127','--lightish':'#ACB0A8','--light':'#F1EFE7','--lightest':'#FFFFFF','--accent':'#DC9F5A','--complement':'#A85B15',
    '--leftbg-s1':'#0c1519','--leftbg-s2':'#1a2830','--banner-s1':'#dc9f5a','--banner-s2':'#c8903a','--grid-s1':'#f1efe7','--grid-s2':'#e0ddd5','--details-s1':'#f1efe7','--details-s2':'#f3f1ec','--banner-text':'#0c1519'
  }},
  { name: 'Forest 2', cssVars: {
    '--darker':'#101918','--dark':'#283E33','--lightish':'#EECE90','--light':'#F1EFE7','--lightest':'#FFFFFF','--accent':'#B3642E','--complement':'#B3642E',
    '--leftbg-s1':'#101918','--leftbg-s2':'#1e2b29','--banner-s1':'#b3642e','--banner-s2':'#9e5825','--grid-s1':'#f1efe7','--grid-s2':'#e0ddd5','--details-s1':'#f1efe7','--details-s2':'#f3f1ec','--banner-text':'#FFFFFF'
  }},
  { name: 'Castle', cssVars: {
    '--darker':'#2C2D32','--dark':'#443838','--lightish':'#EECE90','--light':'#F1EFE7','--lightest':'#FFFFFF','--accent':'#5B2F30','--complement':'#E0BB6A',
    '--leftbg-s1':'#2C2D32','--leftbg-s2':'#3a3b42','--banner-s1':'#e0bb6a','--banner-s2':'#cca85a','--grid-s1':'#f1efe7','--grid-s2':'#e0ddd5','--details-s1':'#f1efe7','--details-s2':'#f3f1ec','--banner-text':'#2C2D32'
  }},
];

// Mathilde base colors (no gradients)
const MATHILDE_BASE_COLORS = ['--dark','--mid','--light','--lightest','--accent','--complement'];
const IXIL_BASE_COLORS = ['--darker','--dark','--lightish','--light','--lightest','--accent','--complement'];

// =========================================================
// STATE
// =========================================================
const DEFAULT_STATE = {
  hidden: [],
  order: {},
  sectionOrder: {},
  customItems: [],
  deleted: [],
  descriptions: {},
  contactEdits: {},
  contactLayout: 'left',
  language: 'en',
  cssVars: {},
  colorHistory: [],
  palettes: [],
  templates: [],
  bannerTitle: '',
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(stateKey);
    if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
  } catch (e) {}
  return Object.assign({}, DEFAULT_STATE);
}

function saveState() {
  try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch (e) {}
}

function applyState() {
  // Apply deleted — remove permanently from DOM
  state.deleted.forEach(id => {
    document.querySelectorAll(`[data-toggle-id="${id}"]`).forEach(el => el.remove());
  });

  // Apply hidden / visible
  document.querySelectorAll('[data-toggle-id]').forEach(el => {
    const id = el.dataset.toggleId;
    if (state.hidden.includes(id)) el.classList.add('hidden');
    else if (id === 'cv-photo-placeholder' && !state.hidden.includes('cv-photo')) el.classList.add('hidden');
    else el.classList.remove('hidden');
  });

  // Apply CSS vars
  Object.entries(state.cssVars).forEach(([k, v]) => {
    page.style.setProperty(k, v);
  });

  // Apply banner title
  if (state.bannerTitle && cvId === 'ixil') {
    const el = document.querySelector('[data-i18n="banner-title"]');
    if (el) el.textContent = state.bannerTitle;
  }

  // Apply contact layout (Ixil)
  if (cvId === 'ixil') {
    applyContactLayout(state.contactLayout || 'left');
  }

  // Apply contact text/link edits
  Object.keys(state.contactEdits || {}).forEach(applyContactEdit);

  // Apply order
  Object.entries(state.order).forEach(([parentSel, ids]) => {
    const parent = document.querySelector(parentSel);
    if (!parent) return;
    ids.forEach(id => {
      const el = parent.querySelector(`[data-toggle-id="${id}"]`);
      if (el) parent.appendChild(el);
    });
  });

  // Apply section order (whole-section reordering, e.g. Projects vs Work Experience)
  Object.entries(state.sectionOrder || {}).forEach(([parentSel, ids]) => {
    const parent = document.querySelector(parentSel);
    if (!parent) return;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.parentElement === parent) parent.appendChild(el);
    });
  });

  // Apply custom items
  state.customItems.forEach(item => {
    const parent = document.querySelector(item.parentSel);
    if (!parent || parent.querySelector(`[data-toggle-id="${item.id}"]`)) return;
    const el = createCustomItemEl(item);
    parent.appendChild(el);
  });

  // Apply descriptions
  Object.entries(state.descriptions).forEach(([key, val]) => {
    const lang = state.language || 'en';
    const text = val[lang] || val.en || '';
    const el = document.querySelector(`[data-i18n="${key}"], [data-edit-key="${key}"]`);
    if (el && text) el.innerHTML = text;
  });

  // Apply language
  applyLanguage(state.language || 'en', false);
}

function createCustomItemEl(item) {
  const tag = item.type || 'li';
  const el = document.createElement(tag);
  el.setAttribute('data-toggle-id', item.id);
  el.setAttribute('data-custom', 'true');
  const text = item.textEn || item.text || '';
  if (tag === 'div') el.innerHTML = `<p>${text}</p>`;
  else if (tag === 'span') el.textContent = text;
  else el.innerHTML = `<span>${text}</span>`;
  return el;
}

// =========================================================
// UNDO / REDO
// =========================================================
const undoStack = [];
const redoStack = [];

function pushUndo() {
  undoStack.push(JSON.stringify(state));
  if (undoStack.length > 20) undoStack.shift();
  redoStack.length = 0;
  updateUndoButtons();
}

function doUndo() {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(state));
  applyHistoryState(undoStack.pop());
  updateUndoButtons();
}

function doRedo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(state));
  applyHistoryState(redoStack.pop());
  updateUndoButtons();
}

function applyHistoryState(json) {
  state = Object.assign({}, DEFAULT_STATE, JSON.parse(json));
  document.querySelectorAll('[data-toggle-id]').forEach(el => {
    el.classList.toggle('hidden', state.hidden.includes(el.dataset.toggleId));
  });
  Object.entries(state.cssVars).forEach(([k, v]) => page.style.setProperty(k, v));
  const lang = state.language || 'en';
  Object.entries(state.descriptions).forEach(([key, val]) => {
    const domEl = document.querySelector(`[data-i18n="${key}"], [data-edit-key="${key}"]`);
    if (domEl && val) domEl.innerHTML = val[lang] || val.en || '';
  });
  applyLanguage(lang, false);
  refreshStyleSwatches();
  saveState();
}

function updateUndoButtons() {
  const undoBtn = document.querySelector('.editor-undo-btn');
  const redoBtn = document.querySelector('.editor-redo-btn');
  if (undoBtn) undoBtn.style.opacity = undoStack.length ? '1' : '0.35';
  if (redoBtn) redoBtn.style.opacity = redoStack.length ? '1' : '0.35';
}

// =========================================================
// CONTACT LAYOUT (Ixil only)
// =========================================================
function applyContactLayout(layout) {
  ['left','banner','bottom'].forEach(pos => {
    const el = document.querySelector(`[data-toggle-id="contact-layout-${pos}"]`);
    if (el) el.classList.toggle('hidden', pos !== layout);
  });
}

// =========================================================
// LANGUAGE
// =========================================================
function applyLanguage(lang, save = true) {
  state.language = lang;
  if (save) saveState();

  if (cvId === 'ixil') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      // Custom description overrides translation
      if (state.descriptions[key]) {
        el.innerHTML = state.descriptions[key][lang] || state.descriptions[key].en || '';
        return;
      }
      const t = TRANSLATIONS[key];
      if (t) el.innerHTML = t[lang] || t.en || '';
    });
  }

  // Update EN/FR buttons
  document.querySelectorAll('.editor-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// =========================================================
// CSS INJECTION
// =========================================================
function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    body { padding-top: 44px; padding-right: 260px; }
    .editor-top-bar {
      position: fixed; top: 0; left: 0; right: 0; height: 44px; z-index: 99999;
      background: #1a1a1a; display: flex; align-items: center; gap: 4px; padding: 0 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px;
      color: #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
    .editor-top-bar button {
      background: none; border: none; color: #bbb; font-size: 12px; padding: 5px 10px;
      cursor: pointer; border-radius: 5px; transition: background .15s;
    }
    .editor-top-bar button:hover { background: #333; color: #fff; }
    .editor-top-bar button.active { background: #444; color: #fff; }
    .editor-top-bar .tb-sep { width: 1px; height: 20px; background: #444; margin: 0 4px; }
    .editor-top-bar .tb-label { color: #666; font-size: 11px; margin-right: 2px; }
    .editor-lang-btn.active { background: #555 !important; color: #fff !important; }

    /* Floating panel */
    .editor-floating {
      position: absolute; z-index: 99998;
      background: #222; border: 1px solid #444; border-radius: 7px;
      padding: 6px; display: flex; gap: 4px; align-items: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      pointer-events: all; flex-wrap: wrap; max-width: 320px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .editor-floating button {
      background: #333; border: 1px solid #555; color: #ddd;
      padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;
      white-space: nowrap; transition: background .1s;
    }
    .editor-floating button:hover { background: #4a4a4a; color: #fff; }
    .editor-floating button.danger:hover { background: #7a2020; }
    .editor-floating button.active { background: #2a5298; color: #fff; }
    .editor-floating .f-sep { width: 1px; height: 18px; background: #444; }
    .editor-floating .f-label { color: #888; font-size: 11px; padding: 2px 4px; white-space: nowrap; }
    .editor-floating .f-section { width: 100%; font-size: 11px; color: #666; padding: 2px 4px 0; }

    /* Clickable highlights */
    [data-toggle-id], [data-edit-key] { cursor: pointer; }
    [data-toggle-id]:hover, [data-edit-key]:hover {
      outline: 1.5px dashed rgba(100,150,255,0.5); outline-offset: 2px;
    }
    [data-style-hover] {
      outline: 1.5px dashed rgba(80,200,100,.5); outline-offset: 2px;
    }

    /* Section manager trigger headers */
    .section-manager-trigger { cursor: pointer; }
    .section-manager-trigger:hover {
      outline: 1.5px solid rgba(255,200,50,0.8) !important; outline-offset: 3px;
    }
    /* Section panel rows */
    .editor-section-row { display:flex;align-items:center;gap:4px;width:100%;padding:2px 0;min-width:220px; }
    .editor-section-row .row-name { flex:1;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
    .editor-section-row .row-name.is-hidden { color:#555; text-decoration: line-through; }
    .editor-section-row .row-name.is-visible { color:#ddd; }

    /* Color picker */
    .editor-color-picker {
      position: fixed; z-index: 100000;
      background: #1e1e1e; border: 1px solid #444; border-radius: 8px;
      padding: 10px; width: 240px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.6);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #ccc;
    }
    .editor-color-picker .cp-canvas-wrap { position: relative; width: 220px; height: 140px; margin-bottom: 8px; cursor: crosshair; border-radius: 4px; overflow: hidden; }
    .editor-color-picker canvas { display: block; border-radius: 4px; }
    .editor-color-picker .cp-handle {
      position: absolute; width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid #fff; box-shadow: 0 0 0 1px #000; pointer-events: none;
      transform: translate(-50%,-50%);
    }
    .editor-color-picker .cp-hue { width: 220px; height: 12px; margin-bottom: 8px; border-radius: 6px;
      background: linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00); cursor: pointer; }
    .editor-color-picker .cp-hue input[type=range] { width: 100%; margin: 0; appearance: none; background: transparent; height: 12px; cursor: pointer; }
    .editor-color-picker .cp-hue input[type=range]::-webkit-slider-thumb { appearance: none; width: 12px; height: 18px; border-radius: 3px; background: #fff; border: 1px solid #888; margin-top: -3px; }
    .editor-color-picker .cp-hue input[type=range]::-webkit-slider-runnable-track { height: 12px; border-radius: 6px; }
    .editor-color-picker .cp-inputs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; margin-bottom: 8px; }
    .editor-color-picker .cp-inputs label { display: flex; flex-direction: column; align-items: center; gap: 1px; }
    .editor-color-picker .cp-inputs span { font-size: 9px; color: #888; }
    .editor-color-picker .cp-inputs input { width: 100%; background: #2a2a2a; border: 1px solid #444; color: #ddd; border-radius: 3px; padding: 2px 4px; text-align: center; font-size: 11px; }
    .editor-color-picker .cp-hex { display: flex; gap: 4px; align-items: center; margin-bottom: 8px; }
    .editor-color-picker .cp-hex input { flex: 1; background: #2a2a2a; border: 1px solid #444; color: #ddd; border-radius: 3px; padding: 3px 6px; font-size: 12px; }
    .editor-color-picker .cp-hex .cp-swatch-preview { width: 28px; height: 24px; border-radius: 4px; border: 1px solid #555; }
    .editor-color-picker .cp-history { display: flex; flex-wrap: wrap; gap: 3px; }
    .editor-color-picker .cp-history .cp-hist-swatch { width: 18px; height: 18px; border-radius: 3px; border: 1px solid #555; cursor: pointer; }
    .editor-color-picker .cp-mode-tabs { display: flex; gap: 3px; margin-bottom: 6px; }
    .editor-color-picker .cp-mode-tabs button { padding: 2px 8px; background: #333; border: 1px solid #555; color: #ccc; border-radius: 3px; cursor: pointer; font-size: 11px; }
    .editor-color-picker .cp-mode-tabs button.active { background: #2a5298; color: #fff; border-color: #2a5298; }

    /* Slider row */
    .editor-slider-row { display: flex; align-items: center; gap: 6px; padding: 2px 0; width: 100%; }
    .editor-slider-row label { font-size: 10px; color: #999; min-width: 90px; }
    .editor-slider-row input[type=range] { flex: 1; cursor: pointer; }
    .editor-slider-row .sv { font-size: 10px; color: #ccc; min-width: 40px; text-align: right; }

    /* Swatch button */
    .editor-swatch { width: 20px; height: 20px; border-radius: 3px; border: 1px solid #666; cursor: pointer; display: inline-block; vertical-align: middle; }

    /* Text editor area */
    .editor-desc-popup {
      position: absolute; z-index: 99999;
      background: #1e1e1e; border: 1px solid #444; border-radius: 8px; padding: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      width: 300px;
    }
    .editor-desc-popup .tabs { display: flex; gap: 4px; margin-bottom: 6px; }
    .editor-desc-popup .tabs button { padding: 2px 10px; background: #333; border: 1px solid #555; color: #ccc; border-radius: 3px; cursor: pointer; font-size: 11px; }
    .editor-desc-popup .tabs button.active { background: #2a5298; color: #fff; }
    .editor-desc-popup textarea { width: 100%; height: 100px; background: #2a2a2a; border: 1px solid #444; color: #ddd; border-radius: 4px; padding: 6px; font-size: 11px; resize: vertical; box-sizing: border-box; }
    .editor-desc-popup .actions { display: flex; gap: 4px; margin-top: 6px; }
    .editor-desc-popup .actions button { flex: 1; padding: 4px; background: #333; border: 1px solid #555; color: #ddd; border-radius: 4px; cursor: pointer; font-size: 11px; }
    .editor-desc-popup .actions button.save { background: #2a5298; border-color: #2a5298; color: #fff; }

    /* Add item form */
    .editor-add-form { display: flex; gap: 4px; align-items: center; }
    .editor-add-form input { flex: 1; background: #2a2a2a; border: 1px solid #444; color: #ddd; border-radius: 3px; padding: 3px 6px; font-size: 11px; }
    .editor-add-form button { padding: 3px 8px; background: #2a5298; border: none; color: #fff; border-radius: 3px; cursor: pointer; font-size: 11px; }

    /* Palette & Template panels */
    .editor-pal-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px; }
    .editor-pal-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; }
    .editor-pal-preview { display: flex; height: 20px; border-radius: 3px; overflow: hidden; border: 1px solid #555; }
    .editor-pal-preview span { display: block; flex: 1; }
    .editor-pal-name { font-size: 10px; color: #aaa; }

    /* Style right panel */
    .style-panel {
      position: fixed; top: 44px; right: 0; width: 260px; bottom: 0;
      background: #181818; border-left: 1px solid #242424;
      overflow-y: auto; z-index: 99990;
      padding: 8px; box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px; color: #ccc;
    }
    .style-panel-section {
      margin-bottom: 12px; border-radius: 5px; padding: 6px 7px;
      border: 1px solid transparent;
      transition: background .12s, border-color .12s;
    }
    .style-panel-section.highlighted {
      background: rgba(80,200,100,.08);
      border-color: rgba(80,200,100,.28);
    }
    .style-panel-hdr {
      font-size: 9px; color: #555; text-transform: uppercase;
      letter-spacing: .8px; margin-bottom: 6px;
      padding-bottom: 4px; border-bottom: 1px solid #242424;
    }
    .style-panel-sub-hdr {
      font-size: 9px; color: #444; text-transform: uppercase;
      letter-spacing: .6px; margin-bottom: 3px; padding-top: 2px;
    }
    .style-panel-swatches {
      display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
    }
    .style-panel-color-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
    }
    .style-panel-color-wrap .sp-lbl { font-size: 8px; color: #444; }
    .style-panel-slider {
      display: flex; align-items: center; gap: 5px; padding: 2px 0;
    }
    .style-panel-slider label {
      font-size: 10px; color: #777; min-width: 84px; flex-shrink: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .style-panel-slider input[type=range] { flex: 1; min-width: 0; cursor: pointer; }
    .style-panel-slider .sp-val {
      font-size: 10px; color: #aaa; width: 36px; text-align: right; flex-shrink: 0;
    }
    /* Highlighted slider row in style panel */
    .style-panel-slider.highlighted {
      background: rgba(80,200,100,.12); border-radius: 3px;
      margin-left: -4px; padding-left: 4px; margin-right: -4px; padding-right: 4px;
    }
    .style-panel-slider.highlighted label { color: rgba(80,200,100,.9); }

/* Section manager hint icon */
    .section-manager-trigger .sm-hint {
      display: none !important;
    }

    /* Style panel section → CV zone hover */
    .editor-style-hover-zone {
      outline: 2px solid rgba(80,200,100,0.4) !important;
      outline-offset: 3px;
    }

    @media print {
      .editor-top-bar, .editor-floating, .editor-color-picker, .editor-desc-popup, .style-panel { display: none !important; }
      .sm-hint { display: none !important; }
      body { padding-top: 0 !important; padding-right: 0 !important; }
    }
  `;
  document.head.appendChild(s);
}

// =========================================================
// TOP BAR
// =========================================================

function injectTopBar() {
  const bar = document.createElement('div');
  bar.className = 'editor-top-bar editor-ui';
  bar.innerHTML = `
    <span class="tb-label">Lang:</span>
    <button class="editor-lang-btn ${state.language==='en'?'active':''}" data-lang="en">EN</button>
    <button class="editor-lang-btn ${state.language==='fr'?'active':''}" data-lang="fr">FR</button>
    <div class="tb-sep"></div>
    <button class="editor-palette-btn" title="Palettes">🎨 Palettes</button>
    <button class="editor-template-btn" title="Templates">📋 Templates</button>
    <div class="tb-sep"></div>
    <button class="editor-undo-btn" title="Undo (Ctrl+Z)" style="opacity:0.35">↩ Undo</button>
    <button class="editor-redo-btn" title="Redo (Ctrl+Y)" style="opacity:0.35">↪ Redo</button>
    <div class="tb-sep"></div>
    <button class="editor-export-btn">⬇ Export</button>
    <button class="editor-import-btn">⬆ Import</button>
    <div class="tb-sep"></div>
    <button class="editor-print-btn">🖨 Print</button>
  `;
  document.body.insertBefore(bar, document.body.firstChild);

  bar.querySelectorAll('.editor-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });
  bar.querySelector('.editor-palette-btn').addEventListener('click', openPalettePanel);
  bar.querySelector('.editor-template-btn').addEventListener('click', openTemplatePanel);
  bar.querySelector('.editor-undo-btn').addEventListener('click', doUndo);
  bar.querySelector('.editor-redo-btn').addEventListener('click', doRedo);
  bar.querySelector('.editor-export-btn').addEventListener('click', exportState);
  bar.querySelector('.editor-import-btn').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json';
    inp.onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => importState(ev.target.result); r.readAsText(f); };
    inp.click();
  });
  bar.querySelector('.editor-print-btn').addEventListener('click', () => window.print());
}


// =========================================================
// FLOATING PANEL
// =========================================================
let floatingEl = null, activeTriggerEl = null, outsideClickHandler = null;

function initFloatingPanel() {
  floatingEl = document.createElement('div');
  floatingEl.className = 'editor-floating editor-ui';
  floatingEl.style.display = 'none';
  document.body.appendChild(floatingEl);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { hideFloating(); closeDescPopup(); closeCreateForm(); }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); doUndo(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); doRedo(); }
  });
}

function showFloating(el, buildFn) {
  // Toggle: clicking the same element again closes the panel
  if (activeTriggerEl === el && floatingEl.style.display !== 'none') {
    hideFloating();
    return;
  }
  floatingEl.innerHTML = '';
  buildFn(floatingEl);
  if (!floatingEl.children.length) { floatingEl.style.display = 'none'; return; }
  activeTriggerEl = el;
  floatingEl.style.display = 'flex';
  positionFloating(el);
  attachOutsideClick(el);
}

function refreshFloating(el, buildFn) {
  if (floatingEl.style.display === 'none') return;
  floatingEl.innerHTML = '';
  buildFn(floatingEl);
  positionFloating(el);
}

function positionFloating(el) {
  const rect = el.getBoundingClientRect();
  const fw = floatingEl.offsetWidth || 200;
  const fh = floatingEl.offsetHeight || 40;
  let left = rect.left + window.scrollX;
  let top  = rect.bottom + window.scrollY + 6;
  left = Math.max(window.scrollX + 4, Math.min(left, window.scrollX + window.innerWidth - fw - 4));
  top  = Math.max(window.scrollY + 48, top);
  floatingEl.style.top  = top  + 'px';
  floatingEl.style.left = left + 'px';
}

function attachOutsideClick(triggerEl) {
  if (outsideClickHandler) document.removeEventListener('mousedown', outsideClickHandler);
  outsideClickHandler = e => {
    if (!floatingEl.contains(e.target) && !triggerEl.contains(e.target)) hideFloating();
  };
  // Defer so the click that opened the panel doesn't immediately close it
  setTimeout(() => document.addEventListener('mousedown', outsideClickHandler), 0);
}

function hideFloating() {
  floatingEl.style.display = 'none';
  activeTriggerEl = null;
  if (outsideClickHandler) {
    document.removeEventListener('mousedown', outsideClickHandler);
    outsideClickHandler = null;
  }
}

// =========================================================
// CONTENT MODE
// =========================================================
const contentHoverCleanup = [];

function initContentHovers() {
  contentHoverCleanup.forEach(fn => fn());
  contentHoverCleanup.length = 0;

  // Pre-compute section configs and which elements they override
  const sectionCfgs = getSectionConfigs();
  const overrideEls = new Set(sectionCfgs.filter(c => c.override).map(c => c.trigger));

  // Toggleable items
  document.querySelectorAll('[data-toggle-id]').forEach(el => {
    const id = el.dataset.toggleId;
    if (id.startsWith('contact-layout-')) {
      attachContactLayoutHover(el);
      return;
    }
    // Skip individual skills inside .skill-items — managed by skill block section panel
    if (el.closest('.skill-items')) return;
    // Skip elements whose click is fully handled by a section manager
    if (overrideEls.has(el)) return;
    const click = e => {
      e.stopPropagation();
      showFloating(el, panel => buildToggleControls(panel, el));
    };
    el.addEventListener('click', click);
    contentHoverCleanup.push(() => el.removeEventListener('click', click));
  });

  // Editable descriptions
  document.querySelectorAll('[data-edit-key], [data-i18n]').forEach(el => {
    const key = el.dataset.editKey || el.dataset.i18n;
    const isDesc = el.tagName === 'P' || el.dataset.editKey || el.dataset.i18n === 'banner-title';
    if (!isDesc) return;
    const click = e => {
      // Let click bubble to the parent custom-item handler so Edit button is reachable
      if (el.closest('[data-toggle-id][data-custom="true"]')) return;
      e.stopPropagation();
      openDescEditor(el, key, { singleLine: el.dataset.i18n === 'banner-title' });
    };
    el.addEventListener('click', click);
    contentHoverCleanup.push(() => el.removeEventListener('click', click));
  });

  // Add buttons for section containers
  attachAddButtons();
  // Section manager headers (pass pre-computed configs to avoid recomputing)
  initSectionManagers(sectionCfgs);
}

function buildToggleControls(panel, el) {
  const id = el.dataset.toggleId;
  const isHidden = el.classList.contains('hidden');
  const isCustom = el.dataset.custom === 'true';
  const parent = el.parentElement;

  // Label
  const label = document.createElement('span');
  label.className = 'f-label';
  label.textContent = getItemLabel(el);
  panel.appendChild(label);

  const sep = document.createElement('div');
  sep.className = 'f-sep';
  panel.appendChild(sep);

  // Toggle visibility
  const eyeBtn = document.createElement('button');
  eyeBtn.textContent = isHidden ? 'Show' : 'Hide';
  eyeBtn.onclick = () => { toggleItem(el, id, !isHidden); refreshFloating(el, p => buildToggleControls(p, el)); };
  panel.appendChild(eyeBtn);

  // Reorder - only if siblings exist
  const siblings = Array.from(parent.children).filter(c => c.dataset && c.dataset.toggleId && !c.dataset.toggleId.startsWith('contact-layout-'));
  const idx = siblings.indexOf(el);
  if (idx > 0) {
    const upBtn = document.createElement('button');
    upBtn.textContent = '↑';
    upBtn.onclick = () => { parent.insertBefore(el, siblings[idx - 1]); saveOrder(parent); refreshFloating(el, p => buildToggleControls(p, el)); };
    panel.appendChild(upBtn);
  }
  if (idx < siblings.length - 1) {
    const downBtn = document.createElement('button');
    downBtn.textContent = '↓';
    downBtn.onclick = () => { parent.insertBefore(siblings[idx + 1], el); saveOrder(parent); refreshFloating(el, p => buildToggleControls(p, el)); };
    panel.appendChild(downBtn);
  }

  // Edit text/link (contact items)
  if (id.startsWith('contact-') && !id.startsWith('contact-layout-')) {
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏ Edit';
    editBtn.onclick = () => { hideFloating(); openContactEditForm(el, id); };
    panel.appendChild(editBtn);
  }

  // Edit / Delete (custom items only)
  if (isCustom) {
    const cfgs = getSectionConfigs();
    const matchCfg = cfgs.find(c => c.create && c.getParent && c.getParent() === el.parentElement);
    if (matchCfg) {
      const editBtn = document.createElement('button');
      editBtn.textContent = '✏ Edit';
      editBtn.onclick = () => { hideFloating(); openEditForm(el, matchCfg); };
      panel.appendChild(editBtn);
    }
    const del = document.createElement('button');
    del.textContent = '✕ Delete';
    del.className = 'danger';
    del.onclick = () => { el.remove(); state.customItems = state.customItems.filter(i => i.id !== id); state.hidden = state.hidden.filter(i => i !== id); saveState(); hideFloating(); };
    panel.appendChild(del);
  }
}

function toggleItem(el, id, shouldHide) {
  pushUndo();
  el.classList.toggle('hidden', shouldHide);
  if (shouldHide) { if (!state.hidden.includes(id)) state.hidden.push(id); }
  else { state.hidden = state.hidden.filter(i => i !== id); }
  saveState();
}

function saveOrder(parent) {
  pushUndo();
  const sel = getCssSel(parent);
  state.order[sel] = Array.from(parent.children)
    .filter(c => c.dataset && c.dataset.toggleId)
    .map(c => c.dataset.toggleId);
  saveState();
}

function getSwappableSiblings(sectionEl) {
  return Array.from(sectionEl.parentElement.children).filter(c => c.dataset && c.dataset.swappableSection === 'true');
}

function saveSectionOrder(parent) {
  pushUndo();
  const sel = getCssSel(parent);
  state.sectionOrder[sel] = Array.from(parent.children)
    .filter(c => c.dataset && c.dataset.swappableSection === 'true')
    .map(c => c.id);
  saveState();
}

function getCssSel(el) {
  // Build a path up to the nearest ancestor with an id (or body), using
  // nth-of-type indices to disambiguate siblings with the same class.
  const parts = [];
  let cur = el;
  while (cur && cur !== document.body) {
    if (cur.id) { parts.push('#' + cur.id); break; }
    const tag = cur.tagName.toLowerCase();
    const cls = cur.className && typeof cur.className === 'string'
      ? '.' + cur.className.trim().split(/\s+/).join('.') : '';
    // Find position among same-tag siblings to disambiguate
    const siblings = cur.parentElement
      ? Array.from(cur.parentElement.children).filter(c => c.tagName === cur.tagName)
      : [cur];
    const idx = siblings.indexOf(cur);
    const nth = siblings.length > 1 ? `:nth-of-type(${idx + 1})` : '';
    parts.push(tag + cls + nth);
    cur = cur.parentElement;
  }
  return parts.reverse().join(' > ');
}

function attachContactLayoutHover(el) {
  const click = e => {
    e.stopPropagation();
    showFloating(el, panel => {
      const label = document.createElement('span');
      label.className = 'f-label';
      label.textContent = 'Contact position:';
      panel.appendChild(label);
      ['left','banner','bottom'].forEach(pos => {
        const btn = document.createElement('button');
        btn.textContent = pos.charAt(0).toUpperCase() + pos.slice(1);
        if (state.contactLayout === pos) btn.classList.add('active');
        btn.onclick = () => { state.contactLayout = pos; applyContactLayout(pos); saveState(); refreshFloating(el, p => { attachContactLayoutHover._build(p, el); }); };
        panel.appendChild(btn);
      });
    });
  };
  el.addEventListener('click', click);
  contentHoverCleanup.push(() => el.removeEventListener('click', click));
}

function getContactTextNode(el) {
  const value = el.querySelector('.value');
  if (value) return value;
  const a = el.querySelector('a');
  if (a) return a;
  for (let i = el.childNodes.length - 1; i >= 0; i--) {
    const n = el.childNodes[i];
    if (n.nodeType === 3 && n.textContent.trim()) return n;
  }
  return null;
}

function applyContactEdit(id) {
  const edit = state.contactEdits && state.contactEdits[id];
  if (!edit) return;
  document.querySelectorAll(`[data-toggle-id="${id}"]`).forEach(el => {
    const node = getContactTextNode(el);
    if (node && edit.text) node.textContent = edit.text;
    if (edit.href) {
      const a = el.querySelector('a');
      if (a) a.setAttribute('href', edit.href);
    }
  });
}

function openContactEditForm(el, id) {
  closeCreateForm();
  const valueNode = getContactTextNode(el);
  const linkNode = el.querySelector('a');
  const currentText = valueNode ? valueNode.textContent.trim() : '';
  const currentHref = linkNode ? (linkNode.getAttribute('href') || '') : '';

  createFormEl = document.createElement('div');
  createFormEl.className = 'editor-desc-popup editor-ui';
  createFormEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;z-index:100001';

  const title = document.createElement('div');
  title.style.cssText = 'font-size:12px;font-weight:bold;color:#ccc;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #333';
  title.textContent = 'Edit: ' + getItemLabel(el);
  createFormEl.appendChild(title);

  const mkField = (labelText, value, placeholder) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-bottom:6px';
    const lbl = document.createElement('label');
    lbl.style.cssText = 'display:block;font-size:10px;color:#888;margin-bottom:2px';
    lbl.textContent = labelText;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.style.cssText = 'width:100%;background:#2a2a2a;border:1px solid #444;color:#ddd;border-radius:3px;padding:4px 6px;font-size:11px;box-sizing:border-box';
    inp.placeholder = placeholder || '';
    inp.value = value || '';
    wrap.appendChild(lbl); wrap.appendChild(inp);
    createFormEl.appendChild(wrap);
    return inp;
  };

  const textInp = mkField('Text', currentText, 'e.g. +33 6 12 34 56 78');
  const linkInp = linkNode ? mkField('Link (href)', currentHref, 'e.g. mailto:you@example.com') : null;

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.style.marginTop = '8px';
  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel'; cancel.onclick = closeCreateForm;
  const save = document.createElement('button');
  save.textContent = 'Save'; save.className = 'save';
  save.onclick = () => {
    pushUndo();
    const text = textInp.value.trim();
    const href = linkInp ? linkInp.value.trim() : '';
    state.contactEdits = state.contactEdits || {};
    state.contactEdits[id] = { text, href: linkInp ? href : '' };
    applyContactEdit(id);
    saveState();
    closeCreateForm();
    showFloating(el, p => buildToggleControls(p, el));
  };
  actions.appendChild(cancel); actions.appendChild(save);
  createFormEl.appendChild(actions);
  document.body.appendChild(createFormEl);
  setTimeout(() => document.addEventListener('mousedown', outsideCreateClick), 0);
}

function attachAddButtons() {
  // For each section/list that contains toggleable items, allow adding custom items
  const addTargets = [
    { sel: '#education .list', type: 'li' },
    { sel: '#skills .skill', type: 'div' },
    { sel: '#hobbies .bullet-points', type: 'li' },
    { sel: '#projects .grid', type: 'div' },
    { sel: '#section-skills', type: 'div' },
    { sel: '#section-awards', type: 'div' },
    { sel: '#section-leadership', type: 'div' },
  ];
  addTargets.forEach(({ sel, type }) => {
    const container = document.querySelector(sel);
    if (!container) return;
    const click = e => {
      e.stopPropagation();
      showFloating(container, panel => {
        const label = document.createElement('span');
        label.className = 'f-label';
        label.textContent = 'Add item:';
        panel.appendChild(label);

        const form = document.createElement('div');
        form.className = 'editor-add-form';
        const inp = document.createElement('input');
        inp.placeholder = 'Item text (EN)';
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add';
        addBtn.onclick = () => {
          const text = inp.value.trim();
          if (!text) return;
          const id = 'custom-' + Date.now();
          const item = { id, parentSel: sel, type, textEn: text, textFr: text };
          state.customItems.push(item);
          const newEl = createCustomItemEl(item);
          container.appendChild(newEl);
          const clickNew = ev => { ev.stopPropagation(); showFloating(newEl, p => buildToggleControls(p, newEl)); };
          newEl.addEventListener('click', clickNew);
          saveState(); hideFloating();
        };
        form.appendChild(inp);
        form.appendChild(addBtn);
        panel.appendChild(form);
      });
    };
    container.addEventListener('click', click);
    contentHoverCleanup.push(() => container.removeEventListener('click', click));
  });
}

// =========================================================
// SECTION MANAGER
// =========================================================
function getItemLabel(el) {
  const candidates = [
    el.querySelector('a')?.textContent,
    el.querySelector('.entry-title')?.textContent,
    el.querySelector('.edu-institution')?.textContent,
    el.querySelector('h2')?.textContent,
    el.querySelector('b')?.textContent,
    el.querySelector('p')?.textContent,
    el.querySelector('span')?.textContent,
    el.textContent,
    el.dataset.toggleId,
  ];
  const label = candidates.find(c => c && c.trim());
  return label ? label.trim().replace(/\s+/g, ' ').slice(0, 45) : el.dataset.toggleId;
}

function buildSectionPanel(panel, cfg) {
  const { label, getItems, getParent, create, triggerEl, sectionEl } = cfg;
  const items = getItems();

  // Header
  const title = document.createElement('div');
  title.style.cssText = 'width:100%;font-size:11px;color:#888;padding:2px 4px 4px;border-bottom:1px solid #333;margin-bottom:2px';
  title.textContent = label;
  panel.appendChild(title);

  // Whole-section reorder (move this entire section relative to its siblings)
  if (sectionEl) {
    const siblings = getSwappableSiblings(sectionEl);
    if (siblings.length > 1) {
      const idx = siblings.indexOf(sectionEl);
      const row = document.createElement('div');
      row.className = 'editor-section-row';

      const name = document.createElement('span');
      name.className = 'row-name';
      name.textContent = 'Move section';
      row.appendChild(name);

      const up = document.createElement('button');
      up.textContent = '↑'; up.style.cssText = 'padding:1px 4px;font-size:11px';
      up.title = 'Move whole section up';
      up.disabled = idx === 0;
      up.onclick = () => {
        sectionEl.parentElement.insertBefore(sectionEl, siblings[idx - 1]);
        saveSectionOrder(sectionEl.parentElement);
        refreshFloating(triggerEl, p => buildSectionPanel(p, cfg));
      };
      row.appendChild(up);

      const down = document.createElement('button');
      down.textContent = '↓'; down.style.cssText = 'padding:1px 4px;font-size:11px';
      down.title = 'Move whole section down';
      down.disabled = idx === siblings.length - 1;
      down.onclick = () => {
        sectionEl.parentElement.insertBefore(siblings[idx + 1], sectionEl);
        saveSectionOrder(sectionEl.parentElement);
        refreshFloating(triggerEl, p => buildSectionPanel(p, cfg));
      };
      row.appendChild(down);

      panel.appendChild(row);
    }
  }

  // Item rows
  if (!items.length) {
    const empty = document.createElement('span');
    empty.className = 'f-label';
    empty.textContent = 'No items';
    panel.appendChild(empty);
  }

  const refresh = () => refreshFloating(triggerEl, p => buildSectionPanel(p, cfg));

  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'editor-section-row';
    const isHidden = item.classList.contains('hidden');

    const eye = document.createElement('button');
    eye.textContent = isHidden ? '🙈' : '👁';
    eye.style.cssText = 'padding:1px 5px;font-size:12px;min-width:30px';
    eye.title = isHidden ? 'Show' : 'Hide';
    eye.onclick = () => { toggleItem(item, item.dataset.toggleId, !isHidden); refresh(); };

    const name = document.createElement('span');
    name.className = 'row-name ' + (isHidden ? 'is-hidden' : 'is-visible');
    name.textContent = getItemLabel(item);

    const up = document.createElement('button');
    up.textContent = '↑'; up.style.cssText = 'padding:1px 4px;font-size:11px';
    up.disabled = i === 0;
    up.onclick = () => { item.parentElement.insertBefore(item, getItems()[i-1]); saveOrder(item.parentElement); refresh(); };

    const down = document.createElement('button');
    down.textContent = '↓'; down.style.cssText = 'padding:1px 4px;font-size:11px';
    down.disabled = i === items.length - 1;
    down.onclick = () => { item.parentElement.insertBefore(getItems()[i+1], item); saveOrder(item.parentElement); refresh(); };

    // Delete with inline confirm
    const del = document.createElement('button');
    del.textContent = '🗑';
    del.style.cssText = 'padding:1px 5px;font-size:11px;color:#c44';
    del.title = 'Delete';
    del.onclick = e => {
      e.stopPropagation();
      // Replace row with confirm UI
      row.innerHTML = '';
      const msg = document.createElement('span');
      msg.style.cssText = 'font-size:10px;color:#e88;flex:1';
      msg.textContent = 'Delete "' + getItemLabel(item).slice(0, 25) + '"?';
      const yes = document.createElement('button');
      yes.textContent = 'Yes'; yes.style.cssText = 'padding:1px 7px;background:#7a2020;border-color:#a33;color:#fff;font-size:11px';
      yes.onclick = () => { deleteItem(item); refresh(); };
      const no = document.createElement('button');
      no.textContent = 'No'; no.style.cssText = 'padding:1px 7px;font-size:11px';
      no.onclick = refresh;
      row.appendChild(msg); row.appendChild(yes); row.appendChild(no);
    };

    row.appendChild(eye); row.appendChild(name); row.appendChild(up); row.appendChild(down); row.appendChild(del);
    panel.appendChild(row);
  });

  // Create new item — button opens a content-specific form popup
  const parent = getParent ? getParent() : null;
  if (create && parent) {
    const sep = document.createElement('div');
    sep.style.cssText = 'width:100%;border-top:1px solid #333;margin:4px 0 2px';
    panel.appendChild(sep);
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ New item';
    addBtn.style.cssText = 'width:100%;padding:4px;background:#1e3a6e;border:1px solid #2a5298;color:#8ab;border-radius:4px;cursor:pointer;font-size:11px';
    addBtn.onclick = e => {
      e.stopPropagation();
      openCreateForm(cfg, parent, refresh);
    };
    panel.appendChild(addBtn);
  }

}

// =========================================================
// CREATE / EDIT FORM
// =========================================================
let createFormEl = null;

function openEditForm(el, cfg) {
  const id = el.dataset.toggleId;
  const descKey = id + '-desc';
  const existing = {
    title:       el.querySelector('h2')?.textContent?.trim() || el.querySelector('a')?.textContent?.trim() || '',
    link:        el.querySelector('a')?.getAttribute('href') || '',
    date:        el.querySelector('em')?.textContent?.trim() || '',
    stack:       el.querySelector('h3')?.textContent?.trim() || '',
    company:     el.querySelector('h3')?.textContent?.trim() || '',
    label:       el.querySelector('b')?.textContent?.trim().replace(/\s+$/, '') || el.querySelector('span')?.textContent?.trim() || '',
    institution: el.querySelector('.edu-institution')?.textContent?.trim() || '',
    location:    el.querySelector('.edu-location')?.textContent?.trim() || '',
    degree:      el.querySelector('.edu-degree')?.textContent?.trim() || '',
    context:     el.querySelector('.entry-context')?.textContent?.trim() || '',
    descEn:      state.descriptions[descKey]?.en || '',
    descFr:      state.descriptions[descKey]?.fr || '',
  };
  openCreateForm(cfg, cfg.getParent(), () => {}, existing, id);
}

function openCreateForm(cfg, parent, onCreated, prefill = null, editId = null) {
  closeCreateForm();
  const fields = getCreateFields(cfg.label);
  createFormEl = document.createElement('div');
  createFormEl.className = 'editor-desc-popup editor-ui';
  createFormEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:340px;z-index:100001;max-height:80vh;overflow-y:auto';

  const isEdit = !!editId;
  const title = document.createElement('div');
  title.style.cssText = 'font-size:12px;font-weight:bold;color:#ccc;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #333';
  title.textContent = (isEdit ? 'Edit: ' : 'New: ') + cfg.label;
  createFormEl.appendChild(title);


  const inputs = {};
  fields.forEach(f => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-bottom:6px';
    const lbl = document.createElement('label');
    lbl.style.cssText = 'display:block;font-size:10px;color:#888;margin-bottom:2px';
    lbl.textContent = f.label + (f.required ? ' *' : '') + (f.hint ? '  ' + f.hint : '');
    let inp;
    if (f.type === 'textarea') {
      inp = document.createElement('textarea');
      inp.style.cssText = 'width:100%;height:64px;background:#2a2a2a;border:1px solid #444;color:#ddd;border-radius:3px;padding:5px 6px;font-size:11px;resize:vertical;box-sizing:border-box';
    } else {
      inp = document.createElement('input');
      inp.type = f.type || 'text';
      inp.style.cssText = 'width:100%;background:#2a2a2a;border:1px solid #444;color:#ddd;border-radius:3px;padding:4px 6px;font-size:11px;box-sizing:border-box';
    }
    inp.placeholder = f.placeholder || '';
    if (prefill && prefill[f.key] !== undefined) inp.value = prefill[f.key];
    wrap.appendChild(lbl); wrap.appendChild(inp);
    createFormEl.appendChild(wrap);
    inputs[f.key] = inp;
  });

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.style.marginTop = '8px';
  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel'; cancel.className = ''; cancel.onclick = closeCreateForm;
  const save = document.createElement('button');
  save.textContent = isEdit ? 'Update' : 'Create'; save.className = 'save';
  save.onclick = () => {
    const data = {};
    let valid = true;
    fields.forEach(f => { data[f.key] = inputs[f.key].value.trim(); if (f.required && !data[f.key]) valid = false; });
    if (!valid) { save.textContent = 'Fill required fields'; setTimeout(() => save.textContent = isEdit ? 'Update' : 'Create', 1500); return; }

    if (isEdit) {
      pushUndo();
      const oldEl = document.querySelector(`[data-toggle-id="${editId}"]`);
      if (oldEl && cfg.create) {
        const newEl = cfg.create(data, editId);
        newEl.setAttribute('data-toggle-id', editId);
        newEl.setAttribute('data-custom', 'true');
        if (oldEl.classList.contains('hidden')) newEl.classList.add('hidden');
        oldEl.parentElement.replaceChild(newEl, oldEl);
        const clickNew = ev => { ev.stopPropagation(); showFloating(newEl, p => buildToggleControls(p, newEl)); };
        newEl.addEventListener('click', clickNew);
      }
      const itemIdx = state.customItems.findIndex(i => i.id === editId);
      if (itemIdx >= 0) state.customItems[itemIdx].textEn = data.title || data.label || data.institution || '';
      if (data.descEn || data.descFr) state.descriptions[editId + '-desc'] = { en: data.descEn || '', fr: data.descFr || '' };
      saveState(); closeCreateForm(); onCreated();
      return;
    }

    const id = 'custom-' + Date.now();
    const el = cfg.create(data, id);
    el.setAttribute('data-toggle-id', id);
    el.setAttribute('data-custom', 'true');
    parent.appendChild(el);
    state.customItems.push({ id, parentSel: getCssSel(parent), type: el.tagName.toLowerCase(), textEn: data.titleEn || data.label || data.title || '', textFr: data.titleFr || data.label || '' });
    if (data.descEn || data.descFr) state.descriptions[id + '-desc'] = { en: data.descEn || '', fr: data.descFr || '' };
    const clickNew = ev => { ev.stopPropagation(); showFloating(el, p => buildToggleControls(p, el)); };
    el.addEventListener('click', clickNew);
    saveState(); closeCreateForm(); onCreated();
  };
  actions.appendChild(cancel); actions.appendChild(save);
  createFormEl.appendChild(actions);
  document.body.appendChild(createFormEl);
  setTimeout(() => document.addEventListener('mousedown', outsideCreateClick), 0);
}

function outsideCreateClick(e) {
  if (createFormEl && !createFormEl.contains(e.target)) closeCreateForm();
}

function closeCreateForm() {
  if (createFormEl) { createFormEl.remove(); createFormEl = null; }
  document.removeEventListener('mousedown', outsideCreateClick);
}

function getCreateFields(label) {
  const lbl = label.toLowerCase();
  // Project
  if (lbl.includes('project')) return [
    { key:'title',   label:'Title',           required:true,  placeholder:'e.g. GLTF Renderer' },
    { key:'link',    label:'Link (optional)',  required:false, placeholder:'https://…' },
    { key:'date',    label:'Date / period',    required:false, placeholder:'e.g. 2025' },
    { key:'stack',   label:'Stack / tech',     required:false, placeholder:'e.g. C++, Vulkan' },
    { key:'descEn',  label:'Description (EN)', required:false, type:'textarea', placeholder:'English description…' },
    { key:'descFr',  label:'Description (FR)', required:false, type:'textarea', placeholder:'Description en français…' },
  ];
  // Work experience
  if (lbl.includes('work')) return [
    { key:'title',   label:'Job title',        required:true,  placeholder:'e.g. Research Engineer' },
    { key:'company', label:'Company / location',required:false, placeholder:'e.g. OCA / Nice, FR' },
    { key:'date',    label:'Date / period',     required:false, placeholder:'e.g. 2025' },
    { key:'descEn',  label:'Description (EN)',  required:false, type:'textarea', placeholder:'English description…' },
    { key:'descFr',  label:'Description (FR)',  required:false, type:'textarea', placeholder:'Description en français…' },
  ];
  // Academic experience
  if (lbl.includes('academic')) return [
    { key:'title',   label:'Title',             required:true,  placeholder:'e.g. CubeSat Digital Twin' },
    { key:'context', label:'Context / lab',     required:false, placeholder:'e.g. EPFL CHANGE lab | Fall 2025' },
    { key:'descEn',  label:'Description (EN)',  required:false, type:'textarea', placeholder:'English description…' },
    { key:'descFr',  label:'Description (FR)',  required:false, type:'textarea', placeholder:'Description en français…' },
  ];
  // Education entry
  if (lbl.includes('education')) return [
    { key:'institution', label:'Institution',   required:true,  placeholder:'e.g. MIT' },
    { key:'location',    label:'Location | period', required:false, placeholder:'e.g. Cambridge, USA | 2020-2024' },
    { key:'degree',      label:'Degree',        required:false, placeholder:'e.g. BSc in Computer Science' },
    { key:'honors',      label:'Honours',       required:false, placeholder:'e.g. GPA 4.0/4.0' },
  ];
  // Course (inside education institution)
  if (lbl.includes('course')) return [
    { key:'label', label:'Course name', required:true, placeholder:'e.g. Advanced Machine Learning' },
  ];
  // Skill group
  if (lbl.includes('skill group') || lbl.includes('skill groups')) return [
    { key:'label', label:'Category name', required:true, placeholder:'e.g. TOOLS PROG.' },
  ];
  // Individual skill
  if (lbl.includes('skill')) return [
    { key:'label', label:'Skill name', required:true, placeholder:'e.g. Vulkan' },
  ];
  // Hobby
  if (lbl.includes('hobb')) return [
    { key:'label', label:'Hobby', required:true, placeholder:'e.g. Rock Climbing' },
  ];
  // Fallback
  return [
    { key:'label', label:'Name / label', required:true, placeholder:'' },
  ];
}

// Update getSectionConfigs create functions to accept data objects
function buildElementFromData(cfg, data, id) {
  // called inside create — but we rebuild create fns in getSectionConfigs to use data objects
}

function deleteItem(el) {
  const id = el.dataset.toggleId;
  el.remove();
  if (!state.deleted.includes(id)) state.deleted.push(id);
  state.hidden = state.hidden.filter(i => i !== id);
  state.customItems = state.customItems.filter(i => i.id !== id);
  saveState();
}

function getSectionConfigs() {
  const cfgs = [];

  const mkCfg = (triggerSel, label, itemsSel, parentSel, createFn, sectionSel) => {
    const trigger = document.querySelector(triggerSel);
    if (!trigger) return;
    const sectionEl = sectionSel ? document.querySelector(sectionSel) : null;
    if (sectionEl) sectionEl.dataset.swappableSection = 'true';
    cfgs.push({
      trigger, label, triggerEl: trigger,
      getItems:   () => Array.from(document.querySelectorAll(itemsSel)),
      getParent:  parentSel ? () => document.querySelector(parentSel) : null,
      create:     createFn || null,
      sectionEl,
    });
  };

  if (cvId === 'ixil') {
    mkCfg('#projects header.category', 'Projects',
      '#projects .grid > [data-toggle-id]',
      '#projects .grid',
      (d, id) => {
        const el = document.createElement('div'); el.className = 'block';
        const link = d.link ? `<a href="${d.link}"><svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m10 6h-4c-1.10457 0-2 .89543-2 2v10c0 1.1046.89543 2 2 2h10c1.1046 0 2-.8954 2-2v-4m-4-10h6m0 0v6m0-6-10 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg> ${d.title}</a>` : `<h2>${d.title}</h2>`;
        el.innerHTML = `${d.date ? `<em>${d.date}</em>` : ''}<div>${link}${d.stack ? `<h3>${d.stack}</h3>` : ''}<p data-i18n="${id}-desc" data-edit-key="${id}-desc">${d.descEn || ''}</p></div>`;
        if (d.descEn || d.descFr) state.descriptions[id + '-desc'] = { en: d.descEn || '', fr: d.descFr || '' };
        return el;
      }, '#projects');

    mkCfg('#skills header.category', 'Skill groups',
      '#skills .skill > [data-toggle-id]',
      '#skills .skill',
      (d) => { const el = document.createElement('div'); el.className = 'block'; el.innerHTML = `<p><b>${(d.label||'').toUpperCase()} </b><span class="skill-items"></span></p>`; return el; });

    mkCfg('#hobbies header.category', 'Hobbies',
      '#hobbies .bullet-points > [data-toggle-id]',
      '#hobbies .bullet-points',
      (d) => { const li = document.createElement('li'); li.innerHTML = `<span>${d.label||''}</span>`; return li; });

    mkCfg('[id="work experience"] header.category', 'Work Experience',
      '[id="work experience"] > [data-toggle-id]',
      '[id="work experience"]',
      (d, id) => {
        const el = document.createElement('div'); el.className = 'block';
        el.innerHTML = `${d.date ? `<em>${d.date}</em>` : ''}<div><h2 data-i18n="${id}-title">${d.title||''}</h2><h3>${d.company||''}</h3><p data-i18n="${id}-desc" data-edit-key="${id}-desc">${d.descEn||''}</p></div>`;
        if (d.descEn || d.descFr) state.descriptions[id + '-desc'] = { en: d.descEn || '', fr: d.descFr || '' };
        return el;
      }, '[id="work experience"]');

    // Education institutions → courses
    document.querySelectorAll('#education .block').forEach(block => {
      const h2 = block.querySelector('h2');
      if (!h2) return;
      const instName = h2.textContent.trim();
      let list = block.querySelector('ul.list');
      cfgs.push({
        trigger: h2, label: instName + ' — Courses', triggerEl: h2,
        getItems:  () => Array.from(block.querySelectorAll('li[data-toggle-id]')),
        getParent: () => { if (!list) { list = document.createElement('ul'); list.className = 'list'; block.querySelector('div').appendChild(list); } return list; },
        create:    (d) => { const li = document.createElement('li'); li.innerHTML = `<p>${d.label||''}</p>`; return li; },
      });
    });

    // Skill blocks: clicking a block opens its individual skills sub-panel
    document.querySelectorAll('#skills .skill > [data-toggle-id]').forEach(block => {
      const lbl = (block.querySelector('b[data-i18n]')?.textContent || block.dataset.toggleId).trim();
      const skillItems = block.querySelector('.skill-items');
      cfgs.push({
        trigger: block, label: lbl, triggerEl: block,
        override: true,
        getItems:  () => Array.from(block.querySelectorAll('.skill-items > [data-toggle-id]')),
        getParent: () => skillItems,
        create:    (d) => { const sp = document.createElement('span'); sp.textContent = d.label||''; return sp; },
      });
    });

  } else if (cvId === 'mathilde') {
    mkCfg('#section-skills .left-section-title', 'Skills',
      '#section-skills > [data-toggle-id]',
      '#section-skills',
      (d) => { const el = document.createElement('div'); el.className = 'skill-group'; el.innerHTML = `<span class="skill-label">${d.label||''}</span> <span class="skill-items"></span>`; return el; });

    mkCfg('#section-awards .left-section-title', 'Awards',
      '#section-awards > [data-toggle-id]',
      '#section-awards',
      (d) => { const el = document.createElement('div'); el.className = 'award-item'; el.textContent = d.label||''; return el; });

    mkCfg('#section-leadership .left-section-title', 'Leadership',
      '#section-leadership > [data-toggle-id]',
      '#section-leadership',
      (d) => { const el = document.createElement('div'); el.className = 'leadership-item'; el.textContent = d.label||''; return el; });

    mkCfg('#section-academic .right-section-title', 'Academic Experience',
      '#section-academic > [data-toggle-id]',
      '#section-academic',
      (d, id) => {
        const el = document.createElement('div'); el.className = 'entry';
        el.innerHTML = `<div class="entry-title">${d.title||''}</div><div class="entry-context">${d.context||''}</div><div class="entry-desc" data-edit-key="${id}-desc">${d.descEn||''}</div>`;
        if (d.descEn || d.descFr) state.descriptions[id + '-desc'] = { en: d.descEn || '', fr: d.descFr || '' };
        return el;
      }, '#section-academic');

    mkCfg('#section-work .right-section-title', 'Work Experience',
      '#section-work > [data-toggle-id]',
      '#section-work',
      (d, id) => {
        const el = document.createElement('div'); el.className = 'entry';
        el.innerHTML = `<div class="entry-title">${d.title||''}</div><div class="entry-context">${d.company||''}</div><div class="entry-desc" data-edit-key="${id}-desc">${d.descEn||''}</div>`;
        if (d.descEn || d.descFr) state.descriptions[id + '-desc'] = { en: d.descEn || '', fr: d.descFr || '' };
        return el;
      }, '#section-work');

    mkCfg('#section-education .right-section-title', 'Education',
      '#section-education > [data-toggle-id]',
      '#section-education',
      (d) => { const el = document.createElement('div'); el.className = 'edu-entry'; el.innerHTML = `<div class="edu-institution">${d.institution||''}</div><div class="edu-location">${d.location||''}</div><div class="edu-degree">${d.degree||''}</div>${d.honors?`<div class="edu-honors">${d.honors}</div>`:''}`;  return el; });

    // Courses per institution
    document.querySelectorAll('#section-education [data-toggle-id]').forEach(entry => {
      const inst = entry.querySelector('.edu-institution');
      if (!inst) return;
      const skillItems = entry.querySelector('.skill-items');
      if (!skillItems) return;
      cfgs.push({
        trigger: inst, label: inst.textContent.trim() + ' — Courses', triggerEl: inst,
        getItems:  () => Array.from(entry.querySelectorAll('.skill-items > [data-toggle-id]')),
        getParent: () => skillItems,
        create:    (d) => { const sp = document.createElement('span'); sp.textContent = d.label||''; return sp; },
      });
    });

    // Skill groups: clicking a group block opens its individual skills sub-panel
    document.querySelectorAll('#section-skills > [data-toggle-id]').forEach(block => {
      const lbl = block.querySelector('.skill-label')?.textContent.trim() || block.dataset.toggleId;
      const skillItems = block.querySelector('.skill-items');
      if (!skillItems) return;
      cfgs.push({
        trigger: block, label: lbl, triggerEl: block,
        override: true,
        getItems:  () => Array.from(block.querySelectorAll('.skill-items > [data-toggle-id]')),
        getParent: () => skillItems,
        create:    (d) => { const sp = document.createElement('span'); sp.textContent = d.label||''; return sp; },
      });
    });
  }
  return cfgs;
}

function initSectionManagers(configs) {
  configs.forEach(cfg => {
    const { trigger } = cfg;
    trigger.classList.add('section-manager-trigger');
    trigger.style.position = 'relative';
    if (!trigger.querySelector('.sm-hint')) {
      const hint = document.createElement('span');
      hint.className = 'sm-hint editor-ui';
      hint.textContent = '≡';
      trigger.appendChild(hint);
    }
    const click = e => {
      e.stopPropagation();
      showFloating(trigger, panel => buildSectionPanel(panel, cfg));
    };
    trigger.addEventListener('click', click);
    contentHoverCleanup.push(() => {
      trigger.classList.remove('section-manager-trigger');
      trigger.style.position = '';
      trigger.querySelector('.sm-hint')?.remove();
      trigger.removeEventListener('click', click);
    });
  });
}

// =========================================================
// DESCRIPTION EDITOR
// =========================================================
let descPopup = null;

function openDescEditor(el, key, opts = {}) {
  closeDescPopup();
  const existing = state.descriptions[key] || {};
  const lang = state.language || 'en';
  const enText = existing.en !== undefined ? existing.en : (TRANSLATIONS[key] ? TRANSLATIONS[key].en : lang === 'en' ? el.innerHTML : '');
  const frText = existing.fr !== undefined ? existing.fr : (TRANSLATIONS[key] ? TRANSLATIONS[key].fr : lang === 'fr' ? el.innerHTML : '');

  descPopup = document.createElement('div');
  descPopup.className = 'editor-desc-popup editor-ui';
  let currentTab = lang;
  descPopup.innerHTML = `
    <div class="tabs">
      <button class="tab-en ${lang==='en'?'active':''}" data-tab="en">EN</button>
      <button class="tab-fr ${lang==='fr'?'active':''}" data-tab="fr">FR</button>
    </div>
    <textarea class="desc-ta"></textarea>
    <div class="actions">
      <button class="cancel">Cancel</button>
      <button class="save">Save</button>
    </div>
  `;
  const ta = descPopup.querySelector('textarea');
  if (opts.singleLine) { ta.style.height = '36px'; ta.style.resize = 'none'; }
  ta.value = enText;

  descPopup.querySelectorAll('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      const vals = { en: ta.value };
      if (currentTab === 'en') enCache = ta.value;
      else frCache = ta.value;
      currentTab = btn.dataset.tab;
      ta.value = currentTab === 'en' ? enCache : frCache;
      descPopup.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  let enCache = enText, frCache = frText;
  ta.value = lang === 'fr' ? frCache : enCache;

  descPopup.querySelector('.cancel').onclick = closeDescPopup;
  descPopup.querySelector('.save').onclick = () => {
    if (currentTab === 'en') enCache = ta.value;
    else frCache = ta.value;
    pushUndo();
    state.descriptions[key] = { en: enCache, fr: frCache };
    saveState();
    const lang = state.language || 'en';
    el.innerHTML = lang === 'fr' ? frCache : enCache;
    closeDescPopup();
  };

  document.body.appendChild(descPopup);
  const rect = el.getBoundingClientRect();
  const popLeft = Math.min(rect.left + window.scrollX, window.scrollX + window.innerWidth - 308);
  descPopup.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  descPopup.style.left = popLeft + 'px';
  ta.focus();
  ta.select();

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('mousedown', outsideDescClick, { once: false });
  }, 100);
}

function outsideDescClick(e) {
  if (descPopup && !descPopup.contains(e.target)) closeDescPopup();
}

function closeDescPopup() {
  if (descPopup) { descPopup.remove(); descPopup = null; }
  document.removeEventListener('mousedown', outsideDescClick);
}

// =========================================================
// ELEMENT → CSS VAR MAPPING (for targeted slider highlights)
// =========================================================
const ELEMENT_TO_VARS = [
  // Left: text sizes (from SCSS)
  { sel: '.left .category',                                           vars: ['--left-very-large'] },
  { sel: '.left .block h2, .left .block h3',                          vars: ['--left-large'] },
  { sel: '.left .block em, .left .block u',                           vars: ['--left-medium'] },
  { sel: '.left .bullet-points li, .left .bullet-points span',        vars: ['--left-medium'] },
  { sel: '.left .block p, .left .block .list',                        vars: ['--left-small'] },
  // Left: spacing (from SCSS)
  { sel: '.left img, .left .image-placeholder',                       vars: ['--left-very-top'] },
  { sel: '.left hr',                                                  vars: ['--left-title-bottom'] },
  { sel: '.left section',                                             vars: ['--left-section-gap'] },
  { sel: '.left .skill .block',                                       vars: ['--left-skill-gap'] },
  { sel: '.left .languages .block',                                   vars: ['--left-languages-gap'] },
  { sel: '.left section:not(.contact-information) .block',            vars: ['--left-block-gap', '--left-block-sides'] },
  // Banner (from SCSS)
  { sel: '.banner',                                                   vars: ['--banner-top', '--right-very-top'] },
  { sel: '.contact-information.contact-banner',                       vars: ['--banner-contact-gap'] },
  // Right: text sizes
  { sel: '.right section .category',                                  vars: ['--right-very-large'] },
  { sel: '.right .block h2, .right .block a',                         vars: ['--right-large'] },
  { sel: '.right .block em',                                          vars: ['--right-large'] },
  { sel: '.right .block h3',                                          vars: ['--right-medium'] },
  { sel: '.right .block p, .right .block u',                          vars: ['--right-small'] },
  // Right: spacing
  { sel: '.right section',                                            vars: ['--right-section-gap'] },
  { sel: '.right section hr',                                         vars: ['--right-title-bottom'] },
  { sel: '.right section .block',                                     vars: ['--right-block-gap', '--right-block-sides'] },
  { sel: '.right .grid',                                              vars: ['--right-grid-gap', '--right-grid-height'] },
];

const MATHILDE_ELEMENT_TO_VARS = [
  { sel: '.photo-area',                                               vars: ['--photo-top'] },
  { sel: '.photo-area img, .photo-placeholder',                       vars: ['--photo-size'] },
  { sel: '.left-body',                                                vars: ['--left-pad-top', '--left-pad-right', '--left-pad-bottom', '--left-pad-left'] },
  { sel: '.name-block h1',                                            vars: ['--left-name-size'] },
  { sel: '.name-block .subtitle',                                     vars: ['--left-subtitle-size'] },
  { sel: '.left-section-title',                                       vars: ['--left-section-title-size'] },
  { sel: '.left-section',                                             vars: ['--left-section-gap'] },
  { sel: '.contact-item .label, .skill-group .skill-label',           vars: ['--left-label-size'] },
  { sel: '.contact-item, .skill-group, .award-item, .leadership-item', vars: ['--left-body-size'] },
  { sel: '.contact-item',                                             vars: ['--left-item-gap'] },
  { sel: '.skill-group',                                              vars: ['--left-skill-gap'] },
  { sel: '.award-item',                                               vars: ['--left-award-gap'] },
  { sel: '.leadership-item',                                          vars: ['--left-leadership-gap'] },
  { sel: '.right-section',                                            vars: ['--right-section-gap'] },
  { sel: '.right-section-title',                                      vars: ['--right-section-title-size'] },
  { sel: '.education-banner',                                         vars: ['--edu-banner-pad-top', '--edu-banner-pad-right', '--edu-banner-pad-bottom', '--edu-banner-pad-left'] },
  { sel: '.right-body',                                               vars: ['--right-body-pad-top', '--right-body-pad-right', '--right-body-pad-bottom', '--right-body-pad-left'] },
  { sel: '.edu-entry',                                                vars: ['--edu-entry-gap'] },
  { sel: '.entry',                                                    vars: ['--entry-gap'] },
  { sel: '.entry-title',                                              vars: ['--entry-title-size'] },
  { sel: '.entry-desc',                                               vars: ['--entry-desc-size'] },
];

// =========================================================
// CSS VARIABLE LABELS
// =========================================================
const VAR_LABELS = {
  '--left-very-large': 'Very large text', '--left-large': 'Large text',
  '--left-medium': 'Medium text', '--left-small': 'Small text',
  '--left-very-top': 'Top padding', '--left-section-gap': 'Section gap',
  '--left-title-bottom': 'Title bottom', '--left-block-gap': 'Block gap',
  '--left-block-sides': 'Side padding', '--left-skill-gap': 'Skill gap',
  '--left-languages-gap': 'Languages gap',
  '--right-very-large': 'Very large text', '--right-large': 'Large text',
  '--right-medium': 'Medium text', '--right-small': 'Small text',
  '--right-very-top': 'Top padding', '--right-section-gap': 'Section gap',
  '--right-title-bottom': 'Title bottom', '--right-block-gap': 'Block gap',
  '--right-block-sides': 'Side padding', '--right-grid-gap': 'Grid gap',
  '--right-grid-height': 'Grid row height', '--banner-top': 'Banner top',
  '--banner-contact-gap': 'Contact gap',
  '--left-pad-top': 'Top padding', '--left-pad-right': 'Right padding',
  '--left-pad-bottom': 'Bottom padding', '--left-pad-left': 'Left padding',
  '--left-name-size': 'Name size', '--left-subtitle-size': 'Subtitle size',
  '--left-body-size': 'Body text', '--left-label-size': 'Label text',
  '--left-section-title-size': 'Section title', '--left-award-gap': 'Award gap',
  '--left-leadership-gap': 'Leadership gap', '--left-item-gap': 'Item gap',
  '--right-section-title-size': 'Section title',
  '--edu-banner-pad-top': 'Edu banner top', '--edu-banner-pad-right': 'Edu banner right',
  '--edu-banner-pad-bottom': 'Edu banner bottom', '--edu-banner-pad-left': 'Edu banner left',
  '--right-body-pad-top': 'Body top', '--right-body-pad-right': 'Body right',
  '--right-body-pad-bottom': 'Body bottom', '--right-body-pad-left': 'Body left',
  '--edu-entry-gap': 'Education gap', '--entry-gap': 'Entry gap',
  '--entry-title-size': 'Entry title', '--entry-desc-size': 'Entry text',
  '--photo-top': 'Photo top', '--photo-size': 'Photo size',
};

// =========================================================
// STYLE MODE
// =========================================================
const IXIL_STYLE_MAP = [
  { selector: null, label: 'Layout', type: 'layout' },
  { selector: '.page', label: 'Base Colors', type: 'colors' },
  { selector: null, label: 'Gradients', type: 'gradients', gradients: [
    { label: 'Left BG',     vars: ['--leftbg-s1','--leftbg-s2'],   selector: '.left' },
    { label: 'Banner',      vars: ['--banner-s1','--banner-s2'],    selector: '.banner' },
    { label: 'Grid Blocks', vars: ['--grid-s1','--grid-s2'],        selector: '.grid .block' },
    { label: 'Details Box', vars: ['--details-s1','--details-s2'],  selector: '.details' },
  ]},
  { selector: '.left', label: 'Left Column', type: 'sizes', groups: [
    { label: 'Text', vars: ['--left-very-large','--left-large','--left-medium','--left-small'] },
    { label: 'Spacing', vars: ['--left-very-top','--left-section-gap','--left-title-bottom','--left-block-gap','--left-block-sides','--left-skill-gap','--left-languages-gap'] },
  ]},
  { selector: '.right', label: 'Right Column', type: 'sizes', groups: [
    { label: 'Text', vars: ['--right-very-large','--right-large','--right-medium','--right-small'] },
    { label: 'Banner', vars: ['--banner-top','--banner-contact-gap'] },
    { label: 'Spacing', vars: ['--right-very-top','--right-section-gap','--right-title-bottom','--right-block-gap','--right-block-sides','--right-grid-gap','--right-grid-height'] },
  ]},
];

const MATHILDE_STYLE_MAP = [
  { selector: '.left', label: 'Left Sizes', type: 'sizes', vars: [
    '--photo-top','--photo-size',
    '--left-pad-top','--left-pad-right','--left-pad-bottom','--left-pad-left',
    '--left-section-gap','--left-name-size','--left-subtitle-size',
    '--left-body-size','--left-label-size','--left-section-title-size',
    '--left-skill-gap','--left-award-gap','--left-leadership-gap','--left-item-gap'
  ]},
  { selector: '.right', label: 'Right Sizes', type: 'sizes', vars: [
    '--right-section-gap','--right-section-title-size',
    '--edu-banner-pad-top','--edu-banner-pad-right','--edu-banner-pad-bottom','--edu-banner-pad-left',
    '--right-body-pad-top','--right-body-pad-right','--right-body-pad-bottom','--right-body-pad-left',
    '--edu-entry-gap','--entry-gap','--entry-title-size','--entry-desc-size'
  ]},
  { selector: '.page', label: 'Base Colors', type: 'colors' },
];

const styleMap = cvId === 'mathilde' ? MATHILDE_STYLE_MAP : IXIL_STYLE_MAP;
const styleHoverCleanup = [];

function initStyleHovers() {
  styleHoverCleanup.forEach(fn => fn());
  styleHoverCleanup.length = 0;

  let lastTarget = null;

  const onMove = e => {
    const target = e.target;
    if (target === lastTarget) return;
    if (lastTarget) lastTarget.removeAttribute('data-style-hover');
    lastTarget = null;
    if (!target.closest('.editor-ui') && page.contains(target)) {
      target.setAttribute('data-style-hover', '');
      lastTarget = target;
      highlightStyleEntries(target);
    } else {
      clearStyleHighlights();
    }
  };

  const onLeave = () => {
    if (lastTarget) lastTarget.removeAttribute('data-style-hover');
    lastTarget = null;
    clearStyleHighlights();
  };

  page.addEventListener('mousemove', onMove);
  page.addEventListener('mouseleave', onLeave);

  styleHoverCleanup.push(() => {
    page.removeEventListener('mousemove', onMove);
    page.removeEventListener('mouseleave', onLeave);
    if (lastTarget) lastTarget.removeAttribute('data-style-hover');
    clearStyleHighlights();
  });
}

function getVar(varName) {
  const fromState = state.cssVars[varName];
  if (fromState) return fromState;
  return getComputedStyle(page).getPropertyValue(varName).trim();
}

function setVar(varName, value) {
  state.cssVars[varName] = value;
  page.style.setProperty(varName, value);
  saveState();
}

function parseUnit(val) {
  val = val.trim();
  const m = val.match(/^(-?[\d.]+)(mm|pt|px|em|rem|%|vw|vh)?$/);
  if (!m) return { num: 0, unit: 'px' };
  return { num: parseFloat(m[1]), unit: m[2] || 'px' };
}

// =========================================================
// STYLE PANEL
// =========================================================
let stylePanelEl = null;

function injectStylePanel() {
  if (stylePanelEl) return;
  stylePanelEl = document.createElement('div');
  stylePanelEl.className = 'style-panel editor-ui';
  stylePanelEl.style.display = 'block';
  document.body.appendChild(stylePanelEl);
  renderStylePanel();
}

function renderStylePanel() {
  if (!stylePanelEl) return;
  stylePanelEl.innerHTML = '';

  styleMap.forEach((entry, idx) => {
    const section = document.createElement('div');
    section.className = 'style-panel-section';
    section.dataset.entryIdx = String(idx);

    const hdr = document.createElement('div');
    hdr.className = 'style-panel-hdr';
    hdr.textContent = entry.label;
    section.appendChild(hdr);

    if (entry.type === 'gradients') {
      entry.gradients.forEach(grad => {
        const gradRow = document.createElement('div');
        gradRow.style.cssText = 'display:flex;align-items:center;gap:5px;padding:2px 0';
        const gradLbl = document.createElement('span');
        gradLbl.style.cssText = 'font-size:10px;color:#666;min-width:68px;flex-shrink:0';
        gradLbl.textContent = grad.label;
        gradRow.appendChild(gradLbl);
        const swatchRow = document.createElement('div');
        swatchRow.className = 'style-panel-swatches';
        swatchRow.style.cssText = 'flex:1;justify-content:flex-start;gap:4px';
        grad.vars.forEach((v, i) => {
          if (i === 1) {
            const arr = document.createElement('span');
            arr.style.cssText = 'color:#444;font-size:11px;line-height:1';
            arr.textContent = '→';
            swatchRow.appendChild(arr);
          }
          const sw = document.createElement('button');
          sw.className = 'editor-swatch';
          sw.dataset.styleVar = v;
          sw.style.background = getVar(v) || '#888';
          sw.title = v;
          const gradZone = grad.selector ? document.querySelector(grad.selector) : null;
          sw.onmouseenter = () => { if (gradZone) gradZone.classList.add('editor-style-hover-zone'); };
          sw.onmouseleave = () => { if (gradZone) gradZone.classList.remove('editor-style-hover-zone'); };
          sw.onclick = () => openColorPicker(sw, v, hex => { sw.style.background = hex; });
          swatchRow.appendChild(sw);
        });
        gradRow.appendChild(swatchRow);
        section.appendChild(gradRow);
      });

    } else if (entry.type === 'colors') {
      const row = document.createElement('div');
      row.className = 'style-panel-swatches';
      const baseVars = cvId === 'mathilde' ? MATHILDE_BASE_COLORS : IXIL_BASE_COLORS;
      baseVars.forEach(v => {
        const wrap = document.createElement('div');
        wrap.className = 'style-panel-color-wrap';
        const sw = document.createElement('button');
        sw.className = 'editor-swatch';
        sw.dataset.styleVar = v;
        sw.style.background = getVar(v) || '#888';
        sw.title = v;
        sw.onclick = () => openColorPicker(sw, v, hex => { sw.style.background = hex; });
        const lbl = document.createElement('span');
        lbl.className = 'sp-lbl';
        lbl.textContent = v.replace('--', '');
        wrap.appendChild(sw); wrap.appendChild(lbl);
        row.appendChild(wrap);
      });
      section.appendChild(row);

    } else if (entry.type === 'sizes') {
      const renderSlider = (v, container) => {
        const { num, unit } = parseUnit(getVar(v) || '0');
        const row = document.createElement('div');
        row.className = 'style-panel-slider';
        const lbl = document.createElement('label');
        lbl.textContent = VAR_LABELS[v] || v.replace(/--[\w]+-?/, '').replace(/-/g, ' ').trim();
        const sl = document.createElement('input');
        sl.type = 'range';
        const maxVal = v === '--right-grid-height' ? 300 : unit === 'pt' ? 40 : unit === 'mm' ? 50 : 100;
        sl.min = 0; sl.max = maxVal; sl.step = 0.5; sl.value = num;
        const sv = document.createElement('span');
        sv.className = 'sp-val';
        sv.textContent = num + unit;
        sl.addEventListener('mousedown', pushUndo);
        sl.oninput = () => { const val = sl.value + unit; sv.textContent = val; setVar(v, val); };
        row.appendChild(lbl); row.appendChild(sl); row.appendChild(sv);
        row.dataset.styleVarRow = v;
        container.appendChild(row);
      };
      if (entry.groups) {
        entry.groups.forEach((group, gi) => {
          const subHdr = document.createElement('div');
          subHdr.className = 'style-panel-sub-hdr';
          if (gi > 0) subHdr.style.marginTop = '6px';
          subHdr.textContent = group.label;
          section.appendChild(subHdr);
          group.vars.forEach(v => renderSlider(v, section));
        });
      } else {
        (entry.vars || []).forEach(v => renderSlider(v, section));
      }

    } else if (entry.type === 'layout') {
      // Photo toggle (ixil only)
      const photoEl = document.querySelector('[data-toggle-id="cv-photo"]');
      const placeholderEl = document.querySelector('[data-toggle-id="cv-photo-placeholder"]');
      if (photoEl) {
        const photoOn = !photoEl.classList.contains('hidden');
        const photoRow = document.createElement('div');
        photoRow.style.cssText = 'display:flex;align-items:center;gap:6px;padding:2px 0 4px';
        const photoLbl = document.createElement('label');
        photoLbl.style.cssText = 'font-size:10px;color:#777;flex:1';
        photoLbl.textContent = 'Photo';
        const photoBtn = document.createElement('button');
        photoBtn.style.cssText = `padding:2px 10px;font-size:10px;border:1px solid #555;border-radius:3px;cursor:pointer;background:${photoOn ? '#2a5298' : '#333'};color:${photoOn ? '#fff' : '#bbb'}`;
        photoBtn.textContent = photoOn ? 'On' : 'Off';
        photoBtn.onclick = () => {
          pushUndo();
          const hiding = !photoEl.classList.contains('hidden');
          photoEl.classList.toggle('hidden', hiding);
          if (hiding) { if (!state.hidden.includes('cv-photo')) state.hidden.push('cv-photo'); }
          else { state.hidden = state.hidden.filter(i => i !== 'cv-photo'); }
          if (placeholderEl) {
            placeholderEl.classList.toggle('hidden', !hiding);
            if (!hiding) { if (!state.hidden.includes('cv-photo-placeholder')) state.hidden.push('cv-photo-placeholder'); }
            else { state.hidden = state.hidden.filter(i => i !== 'cv-photo-placeholder'); }
          }
          saveState();
          renderStylePanel();
        };
        photoRow.appendChild(photoLbl); photoRow.appendChild(photoBtn);
        section.appendChild(photoRow);
      }

      // Contact position
      const contactLbl = document.createElement('div');
      contactLbl.style.cssText = 'font-size:10px;color:#777;padding:2px 0 3px';
      contactLbl.textContent = 'Contact position';
      section.appendChild(contactLbl);
      const contactRow = document.createElement('div');
      contactRow.style.cssText = 'display:flex;gap:4px';
      ['left','banner','bottom'].forEach(pos => {
        const btn = document.createElement('button');
        const active = state.contactLayout === pos;
        btn.style.cssText = `padding:2px 8px;font-size:10px;border:1px solid #555;border-radius:3px;cursor:pointer;background:${active ? '#2a5298' : '#333'};color:${active ? '#fff' : '#bbb'}`;
        btn.textContent = pos.charAt(0).toUpperCase() + pos.slice(1);
        btn.onclick = () => {
          pushUndo();
          state.contactLayout = pos;
          applyContactLayout(pos);
          saveState();
          renderStylePanel();
        };
        contactRow.appendChild(btn);
      });
      section.appendChild(contactRow);
    }

    // Bidirectional zone highlight: hovering panel section highlights CV zone
    const zone = entry.selector ? document.querySelector(entry.selector) : null;
    if (zone) {
      section.addEventListener('mouseenter', () => zone.classList.add('editor-style-hover-zone'));
      section.addEventListener('mouseleave', () => zone.classList.remove('editor-style-hover-zone'));
    }
    stylePanelEl.appendChild(section);
  });
}

function highlightStyleEntries(el) {
  if (!stylePanelEl) return;
  clearStyleHighlights();
  const matchedVars = new Set();
  const elementToVars = cvId === 'mathilde' ? MATHILDE_ELEMENT_TO_VARS : ELEMENT_TO_VARS;
  elementToVars.forEach(({ sel, vars }) => {
    if (el.closest(sel)) vars.forEach(v => matchedVars.add(v));
  });
  matchedVars.forEach(v => {
    const row = stylePanelEl.querySelector(`[data-style-var-row="${v}"]`);
    if (row) row.classList.add('highlighted');
  });
}

function clearStyleHighlights() {
  if (!stylePanelEl) return;
  stylePanelEl.querySelectorAll('[data-style-var-row].highlighted')
    .forEach(r => r.classList.remove('highlighted'));
}

function refreshStyleSwatches() {
  if (!stylePanelEl) return;
  stylePanelEl.querySelectorAll('[data-style-var]').forEach(sw => {
    sw.style.background = getVar(sw.dataset.styleVar) || '#888';
  });
}

// =========================================================
// COLOR PICKER
// =========================================================
let pickerEl = null, pickerHsv = { h: 0, s: 100, v: 100 }, pickerCallback = null, pickerVar = null;

function openColorPicker(nearEl, varName, onChange) {
  closeColorPicker();
  pickerVar = varName;
  pickerCallback = onChange;

  const hex = getVar(varName) || '#ff0000';
  const rgb = hexToRgb(hex);
  pickerHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  pickerEl = document.createElement('div');
  pickerEl.className = 'editor-color-picker editor-ui';
  document.body.appendChild(pickerEl);

  renderColorPicker(pickerEl);
  positionColorPicker(nearEl);

  setTimeout(() => {
    document.addEventListener('mousedown', outsidePickerClick, { capture: true });
  }, 100);
}

function closeColorPicker() {
  if (pickerEl) { pickerEl.remove(); pickerEl = null; }
  document.removeEventListener('mousedown', outsidePickerClick, { capture: true });
}

function outsidePickerClick(e) {
  if (pickerEl && !pickerEl.contains(e.target)) closeColorPicker();
}

function positionColorPicker(nearEl) {
  if (!pickerEl) return;
  const rect = nearEl.getBoundingClientRect();
  let top = rect.bottom + 6;
  let left = rect.left;
  if (left + 250 > window.innerWidth) left = window.innerWidth - 250;
  if (top + 320 > window.innerHeight) top = rect.top - 320;
  pickerEl.style.top = top + 'px';
  pickerEl.style.left = left + 'px';
}

function renderColorPicker(el) {
  el.innerHTML = '';
  let inputMode = 'rgb';

  // Canvas (SV plane)
  const canvasWrap = document.createElement('div');
  canvasWrap.className = 'cp-canvas-wrap';
  const canvas = document.createElement('canvas');
  canvas.width = 220; canvas.height = 140;
  const handle = document.createElement('div');
  handle.className = 'cp-handle';
  canvasWrap.appendChild(canvas);
  canvasWrap.appendChild(handle);
  el.appendChild(canvasWrap);

  // Hue slider
  const hueWrap = document.createElement('div');
  hueWrap.className = 'cp-hue';
  const hueSlider = document.createElement('input');
  hueSlider.type = 'range'; hueSlider.min = 0; hueSlider.max = 360; hueSlider.step = 1;
  hueSlider.value = pickerHsv.h;
  hueWrap.appendChild(hueSlider);
  el.appendChild(hueWrap);

  // Hex row
  const hexRow = document.createElement('div');
  hexRow.className = 'cp-hex';
  const preview = document.createElement('div');
  preview.className = 'cp-swatch-preview';
  const hexInp = document.createElement('input');
  hexInp.placeholder = '#000000';
  hexRow.appendChild(preview);
  hexRow.appendChild(hexInp);
  el.appendChild(hexRow);

  // Mode tabs
  const modeTabs = document.createElement('div');
  modeTabs.className = 'cp-mode-tabs';
  ['RGB','HSL'].forEach(mode => {
    const btn = document.createElement('button');
    btn.textContent = mode;
    if (mode === 'RGB') btn.classList.add('active');
    btn.onclick = () => {
      inputMode = mode.toLowerCase();
      modeTabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
      updateChannelInputs();
    };
    modeTabs.appendChild(btn);
  });
  el.appendChild(modeTabs);

  // Channel inputs
  const inputsWrap = document.createElement('div');
  inputsWrap.className = 'cp-inputs';
  const ch = ['A','B','C'].map(c => {
    const lbl = document.createElement('label');
    const sp = document.createElement('span'); sp.textContent = c;
    const inp = document.createElement('input'); inp.type = 'number';
    lbl.appendChild(sp); lbl.appendChild(inp);
    inputsWrap.appendChild(lbl);
    return { sp, inp };
  });
  el.appendChild(inputsWrap);

  // History
  const histDiv = document.createElement('div');
  histDiv.className = 'cp-history';
  el.appendChild(histDiv);

  function currentHex() {
    const rgb = hsvToRgb(pickerHsv.h, pickerHsv.s, pickerHsv.v);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  function updateAll() {
    drawCanvas();
    updateHandle();
    const hex = currentHex();
    hexInp.value = hex;
    preview.style.background = hex;
    updateChannelInputs();
    hueSlider.value = pickerHsv.h;
    // Apply
    setVar(pickerVar, hex);
    if (pickerCallback) pickerCallback(hex);
  }

  function drawCanvas() {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const baseRgb = hsvToRgb(pickerHsv.h, 100, 100);
    // White → hue (left to right)
    const gH = ctx.createLinearGradient(0, 0, w, 0);
    gH.addColorStop(0, '#fff');
    gH.addColorStop(1, `rgb(${baseRgb.r},${baseRgb.g},${baseRgb.b})`);
    ctx.fillStyle = gH;
    ctx.fillRect(0, 0, w, h);
    // Transparent → black (top to bottom)
    const gV = ctx.createLinearGradient(0, 0, 0, h);
    gV.addColorStop(0, 'transparent');
    gV.addColorStop(1, '#000');
    ctx.fillStyle = gV;
    ctx.fillRect(0, 0, w, h);
  }

  function updateHandle() {
    const x = (pickerHsv.s / 100) * 220;
    const y = (1 - pickerHsv.v / 100) * 140;
    handle.style.left = x + 'px';
    handle.style.top = y + 'px';
    handle.style.borderColor = pickerHsv.v > 50 ? '#000' : '#fff';
  }

  function updateChannelInputs() {
    if (inputMode === 'rgb') {
      const { r, g, b } = hsvToRgb(pickerHsv.h, pickerHsv.s, pickerHsv.v);
      ch[0].sp.textContent = 'R'; ch[0].inp.min = 0; ch[0].inp.max = 255; ch[0].inp.value = r;
      ch[1].sp.textContent = 'G'; ch[1].inp.min = 0; ch[1].inp.max = 255; ch[1].inp.value = g;
      ch[2].sp.textContent = 'B'; ch[2].inp.min = 0; ch[2].inp.max = 255; ch[2].inp.value = b;
    } else {
      const { r, g, b } = hsvToRgb(pickerHsv.h, pickerHsv.s, pickerHsv.v);
      const { h, s, l } = rgbToHsl(r, g, b);
      ch[0].sp.textContent = 'H'; ch[0].inp.min = 0; ch[0].inp.max = 360; ch[0].inp.value = h;
      ch[1].sp.textContent = 'S'; ch[1].inp.min = 0; ch[1].inp.max = 100; ch[1].inp.value = s;
      ch[2].sp.textContent = 'L'; ch[2].inp.min = 0; ch[2].inp.max = 100; ch[2].inp.value = l;
    }
  }

  function renderHistory() {
    histDiv.innerHTML = '';
    state.colorHistory.forEach(hex => {
      const sw = document.createElement('div');
      sw.className = 'cp-hist-swatch';
      sw.style.background = hex;
      sw.title = hex;
      sw.onclick = () => {
        const rgb = hexToRgb(hex);
        pickerHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        updateAll();
      };
      histDiv.appendChild(sw);
    });
  }

  function pushHistory(hex) {
    pushUndo();
    state.colorHistory = [hex, ...state.colorHistory.filter(c => c !== hex)].slice(0, 16);
    saveState();
    renderHistory();
  }

  // SV canvas drag
  function svFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    pickerHsv.s = x * 100;
    pickerHsv.v = (1 - y) * 100;
    updateAll();
  }
  let dragging = false;
  canvas.addEventListener('mousedown', e => { dragging = true; svFromEvent(e); pushHistory(currentHex()); });
  document.addEventListener('mousemove', e => { if (dragging) svFromEvent(e); });
  document.addEventListener('mouseup', () => { dragging = false; });

  // Hue slider
  hueSlider.addEventListener('input', () => {
    pickerHsv.h = parseFloat(hueSlider.value);
    updateAll();
  });
  hueSlider.addEventListener('change', () => pushHistory(currentHex()));

  // Hex input
  hexInp.addEventListener('change', () => {
    let v = hexInp.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      const rgb = hexToRgb(v);
      pickerHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      updateAll(); pushHistory(v);
    }
  });

  // Channel inputs
  ch.forEach((c, i) => {
    c.inp.addEventListener('change', () => {
      const vals = ch.map(x => parseFloat(x.inp.value) || 0);
      if (inputMode === 'rgb') {
        pickerHsv = rgbToHsv(vals[0], vals[1], vals[2]);
      } else {
        const rgb = hslToRgb(vals[0], vals[1], vals[2]);
        pickerHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      }
      updateAll(); pushHistory(currentHex());
    });
  });

  renderHistory();
  updateAll();
}

// =========================================================
// PALETTE SYSTEM
// =========================================================
let palettePanel = null;

function openPalettePanel() {
  if (palettePanel) { palettePanel.remove(); palettePanel = null; return; }
  palettePanel = document.createElement('div');
  palettePanel.className = 'editor-color-picker editor-ui';
  palettePanel.style.cssText = 'width:280px;position:fixed;top:50px;right:270px';
  document.body.appendChild(palettePanel);
  renderPalettePanel();
}

function renderPalettePanel() {
  if (!palettePanel) return;
  palettePanel.innerHTML = '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;color:#ccc">Palettes</div>';

  const allPalettes = [...BUILT_IN_PALETTES, ...state.palettes];
  const grid = document.createElement('div');
  grid.className = 'editor-pal-grid';

  allPalettes.forEach((pal, idx) => {
    const item = document.createElement('div');
    item.className = 'editor-pal-item';
    const prev = document.createElement('div');
    prev.className = 'editor-pal-preview';
    prev.style.width = '60px';
    const vars = cvId === 'mathilde' ? MATHILDE_BASE_COLORS : IXIL_BASE_COLORS;
    vars.slice(0, 4).forEach(v => {
      const sp = document.createElement('span');
      sp.style.background = pal.cssVars[v] || '#888';
      prev.appendChild(sp);
    });
    const name = document.createElement('div');
    name.className = 'editor-pal-name';
    name.textContent = pal.name;
    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.style.cssText = 'font-size:10px;padding:1px 6px;background:#333;border:1px solid #555;color:#ccc;border-radius:3px;cursor:pointer';
    loadBtn.onclick = () => { applyPaletteVars(pal); renderPalettePanel(); };
    item.appendChild(prev); item.appendChild(name); item.appendChild(loadBtn);
    if (idx >= BUILT_IN_PALETTES.length) {
      const del = document.createElement('button');
      del.textContent = '✕';
      del.style.cssText = 'font-size:10px;padding:1px 4px;background:#500;border:1px solid #700;color:#faa;border-radius:3px;cursor:pointer;margin-left:2px';
      del.onclick = () => { state.palettes.splice(idx - BUILT_IN_PALETTES.length, 1); saveState(); renderPalettePanel(); };
      item.appendChild(del);
    }
    grid.appendChild(item);
  });
  palettePanel.appendChild(grid);

  // Save current as new palette
  const saveRow = document.createElement('div');
  saveRow.style.cssText = 'display:flex;gap:4px;margin-top:8px;align-items:center';
  const inp = document.createElement('input');
  inp.placeholder = 'New palette name';
  inp.style.cssText = 'flex:1;background:#2a2a2a;border:1px solid #444;color:#ddd;border-radius:3px;padding:3px 6px;font-size:11px';
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.cssText = 'padding:3px 8px;background:#2a5298;border:none;color:#fff;border-radius:3px;cursor:pointer;font-size:11px';
  saveBtn.onclick = () => {
    const name = inp.value.trim();
    if (!name) return;
    const palette = { name, cssVars: {} };
    const vars = cvId === 'mathilde' ? MATHILDE_BASE_COLORS : [...IXIL_BASE_COLORS, '--leftbg-s1','--leftbg-s2','--banner-s1','--banner-s2','--grid-s1','--grid-s2','--details-s1','--details-s2','--banner-text'];
    vars.forEach(v => { palette.cssVars[v] = getVar(v); });
    state.palettes.push(palette);
    saveState(); inp.value = ''; renderPalettePanel();
  };
  saveRow.appendChild(inp); saveRow.appendChild(saveBtn);
  palettePanel.appendChild(saveRow);

  // Close btn
  const close = document.createElement('button');
  close.textContent = '✕ Close';
  close.style.cssText = 'margin-top:8px;width:100%;background:#333;border:1px solid #555;color:#aaa;border-radius:4px;padding:4px;cursor:pointer;font-size:11px';
  close.onclick = () => { palettePanel.remove(); palettePanel = null; };
  palettePanel.appendChild(close);
}

function applyPaletteVars(palette) {
  pushUndo();
  Object.entries(palette.cssVars).forEach(([k, v]) => {
    page.style.setProperty(k, v);
    state.cssVars[k] = v;
  });
  saveState();
  refreshStyleSwatches();
}

// =========================================================
// TEMPLATE SYSTEM
// =========================================================
let templatePanel = null;
const D1_API = '/api/templates';

async function fetchRemoteTemplates() {
  try {
    const res = await fetch(`${D1_API}?owner=${cvId}`);
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data)) return;
    data.forEach(remote => {
      const existing = state.templates.findIndex(t => t.id === remote.id);
      if (existing >= 0) state.templates[existing] = remote;
      else state.templates.push(remote);
    });
    saveState();
  } catch (e) {}
}

async function saveRemoteTemplate(template) {
  try {
    await fetch(`${D1_API}?owner=${cvId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });
  } catch (e) {}
}

async function deleteRemoteTemplate(id) {
  try { await fetch(`${D1_API}?owner=${cvId}&id=${id}`, { method: 'DELETE' }); } catch (e) {}
}

function captureTemplate(name) {
  return {
    id: 'tmpl-' + Date.now(),
    name,
    hidden: [...state.hidden],
    order: JSON.parse(JSON.stringify(state.order)),
    sectionOrder: JSON.parse(JSON.stringify(state.sectionOrder || {})),
    customItems: JSON.parse(JSON.stringify(state.customItems)),
    deleted: [...state.deleted],
    descriptions: JSON.parse(JSON.stringify(state.descriptions)),
    contactEdits: JSON.parse(JSON.stringify(state.contactEdits || {})),
    contactLayout: state.contactLayout,
    language: state.language,
    cssVars: JSON.parse(JSON.stringify(state.cssVars)),
    bannerTitle: state.bannerTitle,
  };
}

function applyTemplateData(tmpl) {
  pushUndo();
  // Restore state fields (keep palettes & colorHistory)
  state.hidden = tmpl.hidden || [];
  state.order = tmpl.order || {};
  state.sectionOrder = tmpl.sectionOrder || {};
  state.customItems = tmpl.customItems || [];
  state.deleted = tmpl.deleted || [];
  state.descriptions = tmpl.descriptions || {};
  state.contactEdits = tmpl.contactEdits || {};
  state.contactLayout = tmpl.contactLayout || 'left';
  state.language = tmpl.language || 'en';
  state.cssVars = tmpl.cssVars || {};
  state.bannerTitle = tmpl.bannerTitle || '';
  saveState();
  // Reset DOM, then re-apply
  document.querySelectorAll('[data-toggle-id]').forEach(el => el.classList.remove('hidden'));
  applyState();
}

function openTemplatePanel() {
  if (templatePanel) { templatePanel.remove(); templatePanel = null; return; }
  templatePanel = document.createElement('div');
  templatePanel.className = 'editor-color-picker editor-ui';
  templatePanel.style.cssText = 'width:280px;position:fixed;top:50px;right:300px';
  document.body.appendChild(templatePanel);
  renderTemplatePanel();
  fetchRemoteTemplates().then(() => renderTemplatePanel());
}

function renderTemplatePanel() {
  if (!templatePanel) return;
  templatePanel.innerHTML = '<div style="font-size:12px;font-weight:bold;margin-bottom:8px;color:#ccc">Templates</div>';

  state.templates.forEach((tmpl, idx) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:4px;margin-bottom:4px';
    const name = document.createElement('span');
    name.textContent = tmpl.name;
    name.style.cssText = 'flex:1;font-size:11px;color:#ccc';
    const load = document.createElement('button');
    load.textContent = 'Load';
    load.style.cssText = 'font-size:10px;padding:2px 6px;background:#2a5298;border:none;color:#fff;border-radius:3px;cursor:pointer';
    load.onclick = () => { applyTemplateData(tmpl); renderTemplatePanel(); };
    const del = document.createElement('button');
    del.textContent = '✕';
    del.style.cssText = 'font-size:10px;padding:2px 4px;background:#500;border:none;color:#faa;border-radius:3px;cursor:pointer';
    del.onclick = () => {
      deleteRemoteTemplate(tmpl.id);
      state.templates.splice(idx, 1);
      saveState(); renderTemplatePanel();
    };
    row.appendChild(name); row.appendChild(load); row.appendChild(del);
    templatePanel.appendChild(row);
  });

  const saveRow = document.createElement('div');
  saveRow.style.cssText = 'display:flex;gap:4px;margin-top:8px;align-items:center';
  const inp = document.createElement('input');
  inp.placeholder = 'Template name';
  inp.style.cssText = 'flex:1;background:#2a2a2a;border:1px solid #444;color:#ddd;border-radius:3px;padding:3px 6px;font-size:11px';
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.cssText = 'padding:3px 8px;background:#2a5298;border:none;color:#fff;border-radius:3px;cursor:pointer;font-size:11px';
  saveBtn.onclick = () => {
    const name = inp.value.trim();
    if (!name) return;
    const tmpl = captureTemplate(name);
    state.templates.push(tmpl);
    saveState();
    saveRemoteTemplate(tmpl);
    inp.value = '';
    renderTemplatePanel();
  };
  saveRow.appendChild(inp); saveRow.appendChild(saveBtn);
  templatePanel.appendChild(saveRow);

  const close = document.createElement('button');
  close.textContent = '✕ Close';
  close.style.cssText = 'margin-top:8px;width:100%;background:#333;border:1px solid #555;color:#aaa;border-radius:4px;padding:4px;cursor:pointer;font-size:11px';
  close.onclick = () => { templatePanel.remove(); templatePanel = null; };
  templatePanel.appendChild(close);
}

// =========================================================
// EXPORT / IMPORT
// =========================================================
function exportState() {
  const json = JSON.stringify(state, null, 2);
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  a.download = `cv-state-${cvId}.json`;
  a.click();
}

function importState(json) {
  try {
    const imported = JSON.parse(json);
    Object.assign(state, DEFAULT_STATE, imported);
    saveState();
    document.querySelectorAll('[data-toggle-id]').forEach(el => el.classList.remove('hidden'));
    applyState();
    alert('State imported successfully.');
  } catch (e) {
    alert('Import failed: ' + e.message);
  }
}

// =========================================================
// BOOT
// =========================================================
injectStyles();
injectTopBar();
initFloatingPanel();
injectStylePanel();
document.body.classList.add('editor-content-mode', 'editor-style-mode');
initContentHovers();
applyState();
initContentHovers();
initStyleHovers();

})();
