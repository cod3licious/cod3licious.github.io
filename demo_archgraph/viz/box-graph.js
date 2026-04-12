import { showSubmoduleDetail, showUnitDetail, clearDetail } from './detail.js';

// ── Load visualization-specific CSS ──────────────────────────────────────────
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'viz/box-graph.css';
document.head.appendChild(link);

// ── Constants ────────────────────────────────────────────────────────────────
const PAD_X = 48, PAD_Y = 40;
const BOX_GAP_X = 32, BOX_GAP_Y = 28;
const BOX_MIN_W = 130;
const UNIT_ROW_H = 20;
const TITLE_H = 26;
const BOX_PAD_Y = 10; // top+bottom padding inside box units area
const COLS_THRESHOLD = 4; // use 2 columns when unit count > this
const BAND_LABEL_H = 18; // vertical space reserved for the layer label above boxes

const VALID_COLOR     = '#333'; // arrow stroke for valid dependencies
const VALID_SYM_COLOR = '#555'; // port symbol fill for valid dependencies (slightly lighter)
const VIOLATION_COLOR = '#b03a2e'; // brick red for dependency violations

const SYM_R   = 4;  // circle radius / triangle half-size
const SYM_GAP = 14; // center-to-center spacing between symbols on same edge
const SYM_MARGIN = SYM_R + 4;

const BEZIER_CP_MIN    = 20;   // minimum bezier control-point offset
const BEZIER_CP_FACTOR = 0.25; // control-point length as fraction of arc distance
const BEZIER_CP_MAX    = 120;  // maximum bezier control-point offset

// ── Placeholder HTML (shown in detail pane before any selection) ─────────────
export const placeholderHTML = `
  <div>This graph shows the layered architecture of a codebase. Layers run top to bottom &mdash; higher layers should call into lower ones. Each grey band is a <strong>module</strong>, subdivided into <strong>submodules</strong> (the boxes). Each box lists its <strong>units</strong>: the individual functions or classes.</div>

  <h4>Visual encoding</h4>
  <div class="legend">
    <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,10 0,0 10,0" fill="#555"/></svg>
    <span>Outgoing dependency: this submodule calls another</span>
    <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#555"/></svg>
    <span>Incoming dependency: another submodule calls this one</span>
    <svg width="18" height="4" viewBox="0 0 18 4"><rect x="2" width="14" height="4" rx="1" fill="#b03a2e"/></svg>
    <span>Layer violation: dependency points upward in the hierarchy</span>
  </div>

  <h4>Interactions</h4>
  <div>Click any submodule box or unit name to focus it. Unrelated submodules fade out, and the dependency lines to connected submodules appear. The detail panel on the right shows the description.</div>
  <div style="margin-top:6px">Within the highlighted submodules, units are styled to show their role:</div>
  <div class="legend" style="margin-top:6px">
    <span></span><span><span class="unit-name is-selected">unit_name</span>: the selected unit(s)</span>
    <span></span><span><span class="unit-name is-callee">unit_name</span>: a dependency (callee)</span>
    <span></span><span><span class="unit-name is-caller">unit_name</span>: a dependent (caller)</span>
  </div>`;

// ── Main render ──────────────────────────────────────────────────────────────
export function render(data) {
  const { layers, submodules, units } = data;

  // 1. Determine ordered list of submodules
  const allSubmodules = flattenLayers(layers);

  // 2. Compute box sizes (content-based), then expand for port symbols
  const boxSizes = computeBoxSizes(allSubmodules, submodules);
  let layout = computeLayout(layers, allSubmodules, submodules, boxSizes);
  if (expandBoxesForSymbols(submodules, layout, boxSizes))
    layout = computeLayout(layers, allSubmodules, submodules, boxSizes);

  // 3. Total canvas size
  const totalW = Math.max(...Object.values(layout).map(p => p.x + boxSizes[p.submodule].w)) + PAD_X;
  const totalH = Math.max(...Object.values(layout).map(p => p.y + boxSizes[p.submodule].h)) + PAD_Y;

  const container = document.getElementById('graph-container');
  container.innerHTML = '<svg id="arrow-svg"></svg><svg id="symbol-svg"></svg>';
  container.style.width  = totalW + 'px';
  container.style.height = totalH + 'px';

  // 4. Draw layer bands
  drawBands(container, layout, layers, boxSizes);

  // 5. Draw boxes
  const boxEls = {};
  for (const sm of allSubmodules) {
    const pos = layout[sm];
    const sz  = boxSizes[sm];
    const box = drawBox(container, sm, submodules[sm], pos, sz);
    boxEls[sm] = box;
  }

  // 6. Draw arrows + port symbols
  const { arrowEls, portSymbolEls } = drawArrows(submodules, layout, boxSizes, totalW, totalH);

  // 7. Wire interactions
  wireInteractions(boxEls, arrowEls, portSymbolEls, submodules, units, layout, boxSizes);
}

// ── Layer flattening ─────────────────────────────────────────────────────────
function flattenLayers(layers) {
  const allSubmodules = [];
  for (const rowModules of layers.root_layers) {
    for (const mod of rowModules) {
      if (layers.submodule_layers && layers.submodule_layers[mod]) {
        for (const subRow of layers.submodule_layers[mod])
          for (const sm of subRow) allSubmodules.push(sm);
      } else {
        allSubmodules.push(mod);
      }
    }
  }
  return allSubmodules;
}

// ── Box sizing ───────────────────────────────────────────────────────────────
function computeBoxSizes(allSubmodules, submodules) {
  const CHAR_W = 7, COL_GAP = 12, SIDE_PAD = 28;
  const sizes = {};
  for (const sm of allSubmodules) {
    const data  = submodules[sm] || { units: [] };
    const units = data.units || [];
    const cols  = units.length > COLS_THRESHOLD ? 2 : 1;
    const rows  = Math.ceil(units.length / cols);
    const h = TITLE_H + BOX_PAD_Y + rows * UNIT_ROW_H;

    // Width: sum of max unit-name width per column + gaps + side padding
    const colWidths = Array.from({ length: cols }, (_, c) => {
      const colUnits = units.filter((_, i) => i % cols === c);
      return colUnits.length ? Math.max(...colUnits.map(u => u.length * CHAR_W)) : 0;
    });
    const titleW = sm.length * CHAR_W + SIDE_PAD;
    const colsW  = colWidths.reduce((s, w) => s + w, 0) + (cols - 1) * COL_GAP + SIDE_PAD;
    const contentW = Math.max(BOX_MIN_W, titleW, colsW);
    sizes[sm] = { w: contentW, h, contentW };
  }
  return sizes;
}

// ── Connection sides (shared by expandBoxesForSymbols and drawArrows) ────────
function connectionSides(from, to, layout, boxSizes) {
  const rf = layout[from].rowIdx, rt = layout[to].rowIdx;
  if (rf < rt) return { fromSide: 'bottom', toSide: 'top' };
  if (rf > rt) return { fromSide: 'top',    toSide: 'bottom' };
  const cf = layout[from].x + boxSizes[from].w / 2;
  const ct = layout[to].x   + boxSizes[to].w   / 2;
  return cf <= ct
    ? { fromSide: 'right', toSide: 'left' }
    : { fromSide: 'left',  toSide: 'right' };
}

// ── Expand boxes so port symbols fit ─────────────────────────────────────────
function expandBoxesForSymbols(submodules, layout, boxSizes) {
  const symCount = {};
  for (const sm of Object.keys(layout))
    symCount[sm] = { top: 0, bottom: 0, left: 0, right: 0 };

  for (const [from, smData] of Object.entries(submodules)) {
    for (const to of Object.keys(smData.dependencies || {})) {
      if (from === to || !layout[from] || !layout[to]) continue;
      const { fromSide, toSide } = connectionSides(from, to, layout, boxSizes);
      symCount[from][fromSide]++;
      symCount[to][toSide]++;
    }
  }

  let changed = false;
  for (const sm of Object.keys(symCount)) {
    const c = symCount[sm];
    const minHoriz = Math.max(c.top, c.bottom);
    const minVert  = Math.max(c.left, c.right);
    if (minHoriz > 0) {
      const need = (minHoriz - 1) * SYM_GAP + 2 * SYM_MARGIN;
      if (need > boxSizes[sm].w) { boxSizes[sm].w = need; changed = true; }
    }
    if (minVert > 0) {
      const need = (minVert - 1) * SYM_GAP + 2 * SYM_MARGIN;
      if (need > boxSizes[sm].h) { boxSizes[sm].h = need; changed = true; }
    }
  }
  return changed;
}

// ── Layout ───────────────────────────────────────────────────────────────────
// Returns layout: { [sm]: { x, y, submodule, rowIdx } }
function computeLayout(layers, allSubmodules, submodules, boxSizes) {
  const layout = {};
  const bandSms = [];
  let bandY = PAD_Y;
  let globalRowIdx = 0;

  for (const rootRow of layers.root_layers) {
    const moduleCols = rootRow.map(mod =>
      (layers.submodule_layers && layers.submodule_layers[mod])
        ? layers.submodule_layers[mod]
        : [[mod]]
    );

    const maxSubRows = Math.max(...moduleCols.map(c => c.length));

    const rowHeights = [];
    for (let r = 0; r < maxSubRows; r++) {
      let maxH = 0;
      for (const col of moduleCols) {
        const subRow = col[r] || [];
        for (const sm of subRow) maxH = Math.max(maxH, (boxSizes[sm] || {}).h || 0);
      }
      rowHeights.push(maxH);
    }

    const thisBandSms = [];
    let colX = PAD_X;
    for (const col of moduleCols) {
      let colW = 0;
      for (const subRow of col) {
        let rowW = subRow.reduce((s, sm) => s + ((boxSizes[sm] || {}).w || 0), 0)
                 + (subRow.length - 1) * BOX_GAP_X;
        colW = Math.max(colW, rowW);
      }

      let subRowY = bandY + BAND_LABEL_H;
      for (let r = 0; r < col.length; r++) {
        const subRow = col[r];
        const rowW = subRow.reduce((s, sm) => s + ((boxSizes[sm] || {}).w || 0), 0)
                   + (subRow.length - 1) * BOX_GAP_X;
        let smX = colX + Math.round((colW - rowW) / 2);
        for (const sm of subRow) {
          layout[sm] = { x: smX, y: subRowY, submodule: sm, rowIdx: globalRowIdx + r };
          thisBandSms.push(sm);
          smX += (boxSizes[sm] || {}).w + BOX_GAP_X;
        }
        subRowY += rowHeights[r] + BOX_GAP_Y;
      }
      colX += colW + BOX_GAP_X * 2;
    }

    bandSms.push(thisBandSms);
    globalRowIdx += maxSubRows;
    const bandH = BAND_LABEL_H + rowHeights.reduce((s, h) => s + h, 0)
                + (maxSubRows - 1) * BOX_GAP_Y
                + BOX_PAD_Y * 2;
    bandY += bandH + BOX_GAP_Y;
  }

  // Second pass: center each band horizontally around the widest band
  const totalContentW = Math.max(...Object.values(layout).map(p => p.x + boxSizes[p.submodule].w)) - PAD_X;
  for (const sms of bandSms) {
    if (!sms.length) continue;
    const bandMinX = Math.min(...sms.map(sm => layout[sm].x));
    const bandMaxX = Math.max(...sms.map(sm => layout[sm].x + boxSizes[sm].w));
    const bandContentW = bandMaxX - bandMinX;
    const shift = Math.round((totalContentW - bandContentW) / 2);
    if (shift > 0) for (const sm of sms) layout[sm].x += shift;
  }

  return layout;
}

// ── Draw layer bands ─────────────────────────────────────────────────────────
function drawBands(container, layout, layers, boxSizes) {
  const BAND_PAD = BOX_PAD_Y;
  for (const rowModules of layers.root_layers) {
    for (const mod of rowModules) {
      const subs = (layers.submodule_layers && layers.submodule_layers[mod])
        ? layers.submodule_layers[mod].flat()
        : [mod];
      const placed = subs.filter(sm => layout[sm]);
      if (!placed.length) continue;

      const xs    = placed.map(sm => layout[sm].x);
      const xRs   = placed.map(sm => layout[sm].x + boxSizes[sm].w);
      const ys    = placed.map(sm => layout[sm].y);
      const yBots = placed.map(sm => layout[sm].y + boxSizes[sm].h);

      const left   = Math.min(...xs) - BAND_PAD;
      const right  = Math.max(...xRs) + BAND_PAD;
      const top    = Math.min(...ys) - BAND_PAD - BAND_LABEL_H;
      const bottom = Math.max(...yBots) + BAND_PAD;

      const band = document.createElement('div');
      band.className = 'layer-band';
      band.style.left   = left + 'px';
      band.style.width  = (right - left) + 'px';
      band.style.top    = top + 'px';
      band.style.height = (bottom - top) + 'px';

      const label = document.createElement('div');
      label.className = 'layer-label';
      label.textContent = mod;
      band.appendChild(label);

      container.appendChild(band);
    }
  }
}

// ── Draw a submodule box ─────────────────────────────────────────────────────
function drawBox(container, sm, data, pos, sz) {
  const box = document.createElement('div');
  box.className = 'submodule-box';
  box.dataset.sm = sm;
  box.style.left   = pos.x + 'px';
  box.style.top    = pos.y + 'px';
  box.style.width  = sz.w + 'px';
  box.style.height = sz.h + 'px';
  box.style.backgroundColor = data.color || '#ddd';

  const title = document.createElement('div');
  title.className = 'box-title';
  title.textContent = sm;
  box.appendChild(title);

  const unitsDiv = document.createElement('div');
  unitsDiv.className = 'box-units';
  const units = data.units || [];
  const cols  = units.length > COLS_THRESHOLD ? 2 : 1;
  unitsDiv.style.gridTemplateColumns = cols === 2 ? '1fr 1fr' : '1fr';
  if (sz.contentW < sz.w) {
    unitsDiv.style.maxWidth = sz.contentW + 'px';
    unitsDiv.style.margin = '0 auto';
  }

  for (const u of units) {
    const span = document.createElement('span');
    span.className = 'unit-name';
    span.textContent = u;
    span.dataset.unit = sm + '.' + u;
    span.dataset.sm   = sm;
    unitsDiv.appendChild(span);
  }

  box.appendChild(unitsDiv);
  container.appendChild(box);
  return box;
}

// ── Arrow drawing ────────────────────────────────────────────────────────────
function drawArrows(submodules, layout, boxSizes, totalW, totalH) {
  const svg = document.getElementById('arrow-svg');
  svg.setAttribute('width',  totalW);
  svg.setAttribute('height', totalH);
  const symSvg = document.getElementById('symbol-svg');
  symSvg.setAttribute('width',  totalW);
  symSvg.setAttribute('height', totalH);

  // Build edge list (only cross-submodule)
  const edges = []; // { from, to, valid }
  for (const [from, smData] of Object.entries(submodules)) {
    for (const [to, valid] of Object.entries(smData.dependencies || {})) {
      if (from !== to && layout[from] && layout[to])
        edges.push({ from, to, valid });
    }
  }

  // connSide[sm][side] = [{partner, isOut, valid}, ...]
  const connSide = {};
  for (const sm of Object.keys(layout))
    connSide[sm] = { top: [], bottom: [], left: [], right: [] };

  for (const { from, to, valid } of edges) {
    const { fromSide, toSide } = connectionSides(from, to, layout, boxSizes);
    connSide[from][fromSide].push({ partner: to,   isOut: true,  valid });
    connSide[to][toSide].push(    { partner: from, isOut: false, valid });
  }

  // portOut[from][to] and portIn[to][from] store {x, y, side}
  const portOut = {}, portIn = {};
  for (const sm of Object.keys(layout)) { portOut[sm] = {}; portIn[sm] = {}; }

  const portSymbolEls = {};

  for (const sm of Object.keys(layout)) {
    const syms = [];
    const pos = layout[sm], sz = boxSizes[sm];

    for (const side of ['top', 'bottom', 'left', 'right']) {
      const isHoriz = side === 'top' || side === 'bottom';
      const partnerCenter = p => isHoriz
        ? layout[p].x + boxSizes[p].w / 2
        : layout[p].y + boxSizes[p].h / 2;

      const items = [...connSide[sm][side]].sort((a, b) => {
        if (a.valid !== b.valid) return a.valid ? -1 : 1;
        return partnerCenter(a.partner) - partnerCenter(b.partner);
      });
      if (!items.length) continue;

      const n = items.length;
      const totalSpan = (n - 1) * SYM_GAP;
      const edgeLen = isHoriz ? sz.w : sz.h;
      const start = Math.max(SYM_MARGIN, (edgeLen - totalSpan) / 2);

      items.forEach(({ partner, isOut, valid }, i) => {
        const color = valid ? VALID_SYM_COLOR : VIOLATION_COLOR;
        const t = start + i * SYM_GAP;
        let x, y;
        if      (side === 'top')    { x = pos.x + t;    y = pos.y; }
        else if (side === 'bottom') { x = pos.x + t;    y = pos.y + sz.h; }
        else if (side === 'left')   { x = pos.x;        y = pos.y + t; }
        else                        { x = pos.x + sz.w; y = pos.y + t; }

        if (isOut) portOut[sm][partner] = { x, y, side };
        else       portIn[sm][partner]  = { x, y, side };

        let el;
        if (isOut) {
          let pts;
          if      (side === 'bottom') pts = `${x},${y+SYM_R*2} ${x-SYM_R},${y} ${x+SYM_R},${y}`;
          else if (side === 'top')    pts = `${x},${y-SYM_R*2} ${x-SYM_R},${y} ${x+SYM_R},${y}`;
          else if (side === 'right')  pts = `${x+SYM_R*2},${y} ${x},${y-SYM_R} ${x},${y+SYM_R}`;
          else                        pts = `${x-SYM_R*2},${y} ${x},${y-SYM_R} ${x},${y+SYM_R}`;
          el = svgEl('polygon');
          el.setAttribute('points', pts);
        } else {
          el = svgEl('circle');
          el.setAttribute('cx', x);
          el.setAttribute('cy', y);
          el.setAttribute('r', SYM_R);
        }
        el.setAttribute('fill', color);
        el.classList.add('port-symbol');
        el.dataset.sm = sm;
        el.dataset.partner = partner;
        symSvg.appendChild(el);
        syms.push(el);
      });
    }
    portSymbolEls[sm] = syms;
  }

  // Draw edges (hidden by default, shown on selection)
  const arrowEls = {};
  for (const { from, to, valid } of edges) {
    const p1 = portOut[from][to];
    const p2 = portIn[to][from];
    if (!p1 || !p2) continue;

    const path = svgEl('path');
    path.setAttribute('d', bezierPath(p1, p2));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', valid ? VALID_COLOR : VIOLATION_COLOR);
    path.setAttribute('stroke-width', '2');
    path.classList.add('arrow');
    if (!valid) path.classList.add('violation');
    path.dataset.from = from;
    path.dataset.to   = to;
    svg.appendChild(path);
    arrowEls[`${from}->${to}`] = path;
  }

  return { arrowEls, portSymbolEls };
}

function svgEl(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function bezierPath(p1, p2) {
  const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  const cp   = Math.min(Math.max(BEZIER_CP_MIN, dist * BEZIER_CP_FACTOR), BEZIER_CP_MAX);

  const tangent = side => {
    if (side === 'bottom') return [0,  cp];
    if (side === 'top')    return [0, -cp];
    if (side === 'right')  return [ cp, 0];
    /* left */             return [-cp, 0];
  };

  const [dx1, dy1] = tangent(p1.side);
  const [dx2, dy2] = tangent(p2.side);

  return `M${p1.x},${p1.y} C${p1.x+dx1},${p1.y+dy1} ${p2.x+dx2},${p2.y+dy2} ${p2.x},${p2.y}`;
}

// ── Interactions ─────────────────────────────────────────────────────────────
function wireInteractions(boxEls, arrowEls, portSymbolEls, submodules, units, layout, boxSizes) {
  const graphPane = document.getElementById('graph-pane');
  let selection = null; // { type: 'submodule'|'unit', id }

  const UNIT_CLASSES = ['dimmed', 'is-selected', 'is-callee', 'is-caller'];

  function clearSelection() {
    selection = null;
    for (const el of Object.values(boxEls)) {
      el.classList.remove('dimmed', 'focused', 'is-unit-selected');
      for (const u of el.querySelectorAll('.unit-name'))
        u.classList.remove(...UNIT_CLASSES);
    }
    for (const el of Object.values(arrowEls))
      el.classList.remove('dimmed', 'visible');
    for (const syms of Object.values(portSymbolEls))
      for (const el of syms) el.classList.remove('dimmed');
    clearDetail();
  }

  function applyHighlighting(relevant, relevantArrows, unitClassifier) {
    for (const [sm, el] of Object.entries(boxEls)) {
      if (relevant.has(sm)) {
        el.classList.remove('dimmed', 'is-unit-selected');
        el.classList.add('focused');
        for (const u of el.querySelectorAll('.unit-name')) {
          u.classList.remove(...UNIT_CLASSES);
          u.classList.add(unitClassifier(sm, u.dataset.unit));
        }
      } else {
        el.classList.add('dimmed');
        el.classList.remove('focused', 'is-unit-selected');
        for (const u of el.querySelectorAll('.unit-name')) {
          u.classList.remove(...UNIT_CLASSES);
          u.classList.add('dimmed');
        }
      }
    }
    for (const [key, el] of Object.entries(arrowEls)) {
      if (relevantArrows.has(key)) { el.classList.add('visible'); el.classList.remove('dimmed'); }
      else { el.classList.remove('visible'); el.classList.add('dimmed'); }
    }
    for (const [sm, syms] of Object.entries(portSymbolEls))
      for (const el of syms) {
        const p = el.dataset.partner;
        if (relevantArrows.has(`${sm}->${p}`) || relevantArrows.has(`${p}->${sm}`))
          el.classList.remove('dimmed');
        else el.classList.add('dimmed');
      }
  }

  function selectSubmodule(sm) {
    selection = { type: 'submodule', id: sm };

    const outDeps = Object.keys(submodules[sm]?.dependencies || {});
    const referencedUnits = new Set(
      (submodules[sm]?.units || []).flatMap(name =>
        Object.keys(units[`${sm}.${name}`]?.dependencies || {})
      )
    );

    const inDeps = Object.keys(submodules).filter(s =>
      s !== sm && submodules[s].dependencies?.[sm] !== undefined
    );
    const referencingUnits = new Set(
      Object.values(units)
        .filter(u => u.submodule !== sm && Object.keys(u.dependencies || {}).some(d => units[d]?.submodule === sm))
        .map(u => `${u.submodule}.${u.name}`)
    );

    const relevant = new Set([sm, ...outDeps, ...inDeps]);
    const relevantArrows = new Set([
      ...outDeps.map(d => `${sm}->${d}`),
      ...inDeps.map(s => `${s}->${sm}`),
    ]);

    applyHighlighting(relevant, relevantArrows, (s, uPath) => {
      if (s === sm)                        return 'is-selected';
      if (referencedUnits.has(uPath))      return 'is-callee';
      if (referencingUnits.has(uPath))     return 'is-caller';
      return 'dimmed';
    });
    showSubmoduleDetail(sm, submodules[sm], units);
  }

  function selectUnit(unitPath) {
    selection = { type: 'unit', id: unitPath };
    const unitData = units[unitPath];
    if (!unitData) return;
    const sm = unitData.submodule;

    const calleeUnits = new Set(Object.keys(unitData.dependencies || {}));
    const calleeSubs  = new Set([...calleeUnits].map(u => units[u]?.submodule).filter(s => s && s !== sm));

    const callerUnits = new Set(
      Object.entries(units)
        .filter(([p, u]) => p !== unitPath && u.dependencies?.[unitPath] !== undefined)
        .map(([p]) => p)
    );
    const callerSubs = new Set([...callerUnits].map(u => units[u]?.submodule).filter(s => s && s !== sm));

    const relevant = new Set([sm, ...calleeSubs, ...callerSubs]);
    const relevantArrows = new Set([
      ...[...calleeSubs].map(s => `${sm}->${s}`),
      ...[...callerSubs].map(s => `${s}->${sm}`),
    ]);

    applyHighlighting(relevant, relevantArrows, (_s, uPath) => {
      if (uPath === unitPath)          return 'is-selected';
      if (calleeUnits.has(uPath))      return 'is-callee';
      if (callerUnits.has(uPath))      return 'is-caller';
      return 'dimmed';
    });
    boxEls[sm].classList.add('is-unit-selected');
    showUnitDetail(unitPath, unitData);
  }

  // Click on submodule box (not on a unit name)
  for (const [sm, el] of Object.entries(boxEls)) {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const unitEl = e.target.closest('.unit-name');
      if (unitEl) {
        if (selection?.type === 'unit' && selection.id === unitEl.dataset.unit) clearSelection();
        else selectUnit(unitEl.dataset.unit);
      } else {
        if (selection?.type === 'submodule' && selection.id === sm) clearSelection();
        else selectSubmodule(sm);
      }
    });
  }

  // Click background to clear
  const bgHandler = e => {
    if (e.target === graphPane || e.target === document.getElementById('graph-container')
        || e.target.classList.contains('layer-band')
        || e.target.classList.contains('layer-label')) {
      clearSelection();
    }
  };
  graphPane.addEventListener('click', bgHandler);
  graphPane._viewCleanup = () => graphPane.removeEventListener('click', bgHandler);
}
