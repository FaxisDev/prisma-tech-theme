'use strict';

/**
 * HTML del panel "Personalizar Prisma-Tech".
 * Selectores de color, opciones de estilo y vista previa en vivo.
 */
function getCustomizerHtml(webview, nonce) {
  const csp = [
    "default-src 'none'",
    "style-src " + webview.cspSource + " 'unsafe-inline'",
    "script-src 'nonce-" + nonce + "'"
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Personalizar Prisma-Tech</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 24px 28px 40px;
    font-family: var(--vscode-font-family); font-size: 13px;
    color: var(--vscode-foreground); background: var(--vscode-editor-background);
  }
  h1 { font-size: 20px; margin: 0 0 4px; font-weight: 600; }
  h1 .prism { background: linear-gradient(90deg, #61FFCA, #82E2FF, #A277FF, #F694FF);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { color: var(--vscode-descriptionForeground); margin: 0 0 22px; }
  .layout { display: grid; grid-template-columns: minmax(300px, 400px) 1fr; gap: 28px; align-items: start; }
  @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
  section { margin-bottom: 22px; }
  h2 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px;
    color: var(--vscode-descriptionForeground); font-weight: 600; }
  .row { display: grid; grid-template-columns: 1fr auto 84px 26px; gap: 8px; align-items: center; padding: 5px 0; }
  .row label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  input[type=color] { width: 30px; height: 24px; padding: 0; border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 4px; background: none; cursor: pointer; }
  input[type=color]::-webkit-color-swatch-wrapper { padding: 2px; }
  input[type=color]::-webkit-color-swatch { border: none; border-radius: 2px; }
  input[type=text] { width: 100%; padding: 4px 6px; font-family: var(--vscode-editor-font-family); font-size: 12px;
    color: var(--vscode-input-foreground); background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border, transparent); border-radius: 3px; text-transform: uppercase; }
  input[type=text].bad { border-color: var(--vscode-inputValidation-errorBorder, #FF6767); }
  .undo { width: 26px; height: 24px; padding: 0; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;
    background: transparent; color: var(--vscode-descriptionForeground); visibility: hidden; }
  .undo.show { visibility: visible; }
  .undo:hover { background: var(--vscode-toolbar-hoverBackground); color: var(--vscode-foreground); }
  .presets { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .chip { width: 26px; height: 26px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; padding: 0; }
  .chip.active { border-color: var(--vscode-foreground); }
  .toggle { display: flex; align-items: center; gap: 8px; padding: 5px 0; cursor: pointer; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  button.btn { padding: 6px 14px; border: none; border-radius: 3px; cursor: pointer; font-size: 13px; font-family: inherit; }
  .primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
  .primary:hover { background: var(--vscode-button-hoverBackground); }
  .secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
  .secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
  .status { margin-left: 4px; align-self: center; color: var(--vscode-descriptionForeground); }
  .sticky { position: sticky; top: 16px; }

  /* ---------- Vista previa ---------- */
  .win { border-radius: 8px; overflow: hidden; border: 1px solid var(--p-border); box-shadow: 0 10px 30px #0006;
    font-family: var(--vscode-editor-font-family, Menlo, monospace); font-size: 12.5px; }
  .titlebar { height: 30px; background: var(--p-bgDark); border-bottom: 1px solid var(--p-border);
    display: flex; align-items: center; gap: 7px; padding: 0 12px; color: var(--p-fgDim); font-size: 11.5px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .titlebar .name { margin: 0 auto; }
  .body { display: grid; grid-template-columns: 38px 150px 1fr; min-height: 340px; }
  .activity { background: var(--p-bgDark); border-right: 1px solid var(--p-border); padding-top: 8px; }
  .activity div { height: 30px; margin: 4px 0; border-left: 2px solid transparent; display: flex; align-items: center; justify-content: center; }
  .activity div span { width: 14px; height: 14px; border-radius: 3px; background: var(--p-muted); }
  .activity div.on { border-left-color: var(--p-accent); }
  .activity div.on span { background: var(--p-accent); }
  .side { background: var(--p-bgDark); border-right: 1px solid var(--p-border); color: var(--p-fgDim); padding: 8px 0; font-size: 11.5px; }
  .side .h { padding: 2px 12px 8px; font-size: 10px; letter-spacing: .08em; color: var(--p-fg); }
  .side .f { padding: 3px 12px 3px 20px; }
  .side .f.sel { background: color-mix(in srgb, var(--p-accent) 12%, transparent); color: var(--p-accent); }
  .side .f.mod { color: var(--p-orange); }
  .main { background: var(--p-bg); display: flex; flex-direction: column; min-width: 0; }
  .tabs { display: flex; background: var(--p-bgDark); border-bottom: 1px solid var(--p-border); }
  .tab { padding: 7px 14px; font-size: 11.5px; color: var(--p-muted); border-right: 1px solid var(--p-border); }
  .tab.on { background: var(--p-bg); color: var(--p-fg); box-shadow: inset 0 1px 0 var(--p-accent); }
  pre { margin: 0; padding: 10px 0; overflow-x: auto; line-height: 1.6; color: var(--p-fg); flex: 1; }
  .ln { display: block; padding-right: 14px; white-space: pre; }
  .ln::before { content: attr(data-n); display: inline-block; width: 34px; padding-right: 14px; text-align: right; color: var(--p-lineNo); }
  .ln.cur { background: var(--p-lineHl); }
  .ln.cur::before { color: var(--p-accent); }
  .cursor { border-left: 2px solid var(--p-accent); margin-left: -1px; }
  .sel { background: color-mix(in srgb, var(--p-accent) 18%, transparent); }
  .statusbar { height: 22px; background: var(--p-bgDark); border-top: 1px solid var(--p-border); color: var(--p-fgDim);
    display: flex; align-items: center; gap: 14px; font-size: 11px; }
  .statusbar .remote { background: var(--p-accent); color: var(--p-bgDarker); height: 100%; padding: 0 10px; display: flex; align-items: center; }
  .terminal { background: var(--p-bgDark); border-top: 1px solid var(--p-border); padding: 6px 12px 8px; font-size: 11.5px; line-height: 1.6; }
  .terminal .h { color: var(--p-fg); font-size: 10px; letter-spacing: .08em; border-bottom: 1px solid var(--p-accent); display: inline-block; margin-bottom: 4px; }

  .t-comment { color: var(--s-comment); font-style: var(--i-comment); }
  .t-string { color: var(--s-string); }
  .t-keyword { color: var(--s-keyword); }
  .t-flow { color: var(--s-keyword); font-style: var(--i-keyword); }
  .t-storage { color: var(--s-storage); }
  .t-function { color: var(--s-function); }
  .t-property { color: var(--s-property); }
  .t-type { color: var(--s-type); }
  .t-parameter { color: var(--s-parameter); font-style: var(--i-parameter); }
  .t-number { color: var(--s-number); }
  .t-constant { color: var(--s-constant); }
  .t-tag { color: var(--s-tag); }
  .t-operator { color: var(--s-operator); }
  .t-self { color: var(--s-self); font-style: var(--i-keyword); }
  .t-attr { color: var(--s-storage); font-style: italic; }
  .t-punct { color: var(--p-fgDim); }
  .t-var { color: var(--p-variable); }
</style>
</head>
<body>
  <h1>Personalizar <span class="prism">Prisma-Tech</span></h1>
  <p class="sub">Ajusta los colores y mira el resultado al instante. Al guardar, el tema se regenera automáticamente.</p>

  <div class="layout">
    <div>
      <section>
        <h2>Base</h2>
        <div id="base"></div>
        <div class="presets" id="presets" title="Acentos rápidos"></div>
      </section>

      <section>
        <h2>Sintaxis</h2>
        <div id="syntax"></div>
      </section>

      <section>
        <h2>Estilo</h2>
        <label class="toggle"><input type="checkbox" id="italicComments"> Comentarios en cursiva</label>
        <label class="toggle"><input type="checkbox" id="italicKeywords"> Keywords de control en cursiva</label>
        <label class="toggle"><input type="checkbox" id="italicParameters"> Parámetros en cursiva</label>
        <label class="toggle"><input type="checkbox" id="brightText"> Texto brillante (más contraste)</label>
      </section>

      <div class="actions">
        <button class="btn primary" id="save">Guardar y aplicar</button>
        <button class="btn secondary" id="reset">Restablecer</button>
        <button class="btn secondary" id="settings">Abrir Ajustes</button>
        <span class="status" id="status"></span>
      </div>
    </div>

    <div class="sticky">
      <div class="win" id="preview">
        <div class="titlebar">
          <span class="dot" style="background:#FF5F57"></span><span class="dot" style="background:#FEBC2E"></span><span class="dot" style="background:#28C840"></span>
          <span class="name">prisma.ts — Prisma-Tech</span>
        </div>
        <div class="body">
          <div class="activity"><div class="on"><span></span></div><div><span></span></div><div><span></span></div><div><span></span></div></div>
          <div class="side">
            <div class="h">EXPLORADOR</div>
            <div class="f">components</div>
            <div class="f sel">prisma.ts</div>
            <div class="f mod">Card.tsx</div>
            <div class="f">styles.css</div>
            <div class="f">package.json</div>
          </div>
          <div class="main">
            <div class="tabs"><div class="tab on">prisma.ts</div><div class="tab">Card.tsx</div></div>
<pre><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech: refracción de la luz</span></span><span class="ln" data-n="2"><span class="t-flow">import</span> <span class="t-punct">{</span> <span class="t-var">render</span> <span class="t-punct">}</span> <span class="t-flow">from</span> <span class="t-string">'./engine'</span><span class="t-punct">;</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-storage">const</span> <span class="t-constant">MAX_ANGLE</span> <span class="t-operator">=</span> <span class="t-number">90</span><span class="t-punct">;</span></span><span class="ln" data-n="5"> </span><span class="ln" data-n="6"><span class="t-flow">export</span> <span class="t-storage">class</span> <span class="t-type">Prisma</span> <span class="t-storage">extends</span> <span class="t-type">Light</span> <span class="t-punct">{</span></span><span class="ln" data-n="7">  <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-parameter">beam</span><span class="t-operator">:</span> <span class="t-type">Beam</span><span class="t-punct">,</span> <span class="t-parameter">angle</span> <span class="t-operator">=</span> <span class="t-number">45</span><span class="t-punct">)</span> <span class="t-punct">{</span></span><span class="ln cur" data-n="8">    <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">angle</span> <span class="t-operator">&gt;</span> <span class="t-constant">MAX_ANGLE</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-constant">null</span><span class="cursor"></span><span class="t-punct">;</span></span><span class="ln" data-n="9">    <span class="t-storage">const</span> <span class="t-var">ratio</span> <span class="t-operator">=</span> <span class="t-number">1.52</span> <span class="t-operator">*</span> <span class="t-var">beam</span><span class="t-punct">.</span><span class="t-property">speed</span><span class="t-punct">;</span></span><span class="ln" data-n="10">    <span class="t-self">this</span><span class="t-punct">.</span><span class="t-property">spectrum</span> <span class="t-operator">=</span> <span class="t-function">render</span><span class="t-punct">({</span> <span class="t-property">glow</span><span class="t-operator">:</span> <span class="t-constant">true</span><span class="t-punct">,</span> <span class="sel"><span class="t-var">ratio</span></span> <span class="t-punct">});</span></span><span class="ln" data-n="11">    <span class="t-flow">return</span> <span class="t-tag">&lt;Card</span> <span class="t-attr">title</span><span class="t-operator">=</span><span class="t-string">"Prisma"</span> <span class="t-tag">/&gt;</span><span class="t-punct">;</span></span><span class="ln" data-n="12">  <span class="t-punct">}</span></span><span class="ln" data-n="13"><span class="t-punct">}</span></span></pre>
            <div class="terminal">
              <div class="h">TERMINAL</div><br>
              <span style="color:var(--p-accent)">➜</span> <span style="color:var(--s-property)">prisma-tech</span> <span style="color:var(--s-keyword)">git:(</span><span style="color:var(--p-red)">main</span><span style="color:var(--s-keyword)">)</span> npm run build<br>
              <span style="color:var(--p-accent)">✓</span> compilado en <span style="color:var(--p-orange)">412ms</span>
            </div>
          </div>
        </div>
        <div class="statusbar"><span class="remote">⟨⟩</span><span>⎇ main</span><span>TypeScript</span><span>UTF-8</span></div>
      </div>
    </div>
  </div>

<script nonce="${nonce}">
(function () {
  var vscode = acquireVsCodeApi();
  var state = null, defaults = null, labels = {}, text = null;
  var HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
  var PRESETS = ['#61FFCA', '#82E2FF', '#A277FF', '#F694FF', '#FFCA85', '#C3E88D', '#FF6767', '#FFFFFF'];

  function norm(v) {
    var m = String(v || '').trim().match(HEX);
    if (!m) return null;
    var h = m[1];
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    return '#' + h.toUpperCase();
  }
  function rgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) {
    var x = rgb(a), y = rgb(b);
    return '#' + x.map(function (v, i) {
      return Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0');
    }).join('').toUpperCase();
  }
  function $(id) { return document.getElementById(id); }

  function colorRow(container, label, get, set, getDefault) {
    var row = document.createElement('div'); row.className = 'row';
    var lab = document.createElement('label'); lab.textContent = label; lab.title = label;
    var picker = document.createElement('input'); picker.type = 'color';
    var text = document.createElement('input'); text.type = 'text'; text.maxLength = 7; text.spellcheck = false;
    var undo = document.createElement('button'); undo.className = 'undo'; undo.textContent = '↺'; undo.title = 'Volver al valor original';

    function sync() {
      var v = get();
      picker.value = v.toLowerCase();
      if (document.activeElement !== text) text.value = v;
      text.classList.remove('bad');
      undo.classList.toggle('show', v !== getDefault());
    }
    picker.addEventListener('input', function () { set(picker.value.toUpperCase()); refresh(); });
    text.addEventListener('input', function () {
      var v = norm(text.value);
      if (v) { set(v); refresh(); } else { text.classList.add('bad'); }
    });
    text.addEventListener('blur', function () { text.value = get(); text.classList.remove('bad'); });
    undo.addEventListener('click', function () { set(getDefault()); text.value = getDefault(); refresh(); });

    row.appendChild(lab); row.appendChild(picker); row.appendChild(text); row.appendChild(undo);
    container.appendChild(row);
    syncers.push(sync);
  }

  var syncers = [];

  function build() {
    syncers = [];
    $('base').innerHTML = ''; $('syntax').innerHTML = ''; $('presets').innerHTML = '';

    colorRow($('base'), 'Color de acento',
      function () { return state.accentColor; },
      function (v) { state.accentColor = v; },
      function () { return defaults.accentColor; });
    colorRow($('base'), 'Fondo del editor',
      function () { return state.background; },
      function (v) { state.background = v; },
      function () { return defaults.background; });

    PRESETS.forEach(function (c) {
      var b = document.createElement('button'); b.className = 'chip'; b.style.background = c; b.title = c;
      b.addEventListener('click', function () { state.accentColor = c; refresh(); });
      $('presets').appendChild(b);
    });

    Object.keys(defaults.syntax).forEach(function (key) {
      colorRow($('syntax'), labels[key] || key,
        function () { return state.syntax[key]; },
        function (v) { state.syntax[key] = v; },
        function () { return defaults.syntax[key]; });
    });

    ['italicComments', 'italicKeywords', 'italicParameters', 'brightText'].forEach(function (k) {
      $(k).onchange = function () { state[k] = $(k).checked; refresh(); };
    });
  }

  function refresh() {
    syncers.forEach(function (f) { f(); });
    ['italicComments', 'italicKeywords', 'italicParameters', 'brightText'].forEach(function (k) { $(k).checked = !!state[k]; });
    Array.prototype.forEach.call($('presets').children, function (b) { b.classList.toggle('active', b.title === state.accentColor); });

    var v = state.brightText ? text.bright : text.soft, bg = state.background, p = $('preview').style;
    var vars = {
      '--p-bg': bg, '--p-bgDark': mix(bg, '#000000', 0.2), '--p-bgDarker': mix(bg, '#000000', 0.34),
      '--p-border': mix(bg, '#000000', 0.38), '--p-lineNo': mix(bg, '#FFFFFF', 0.17),
      '--p-lineHl': mix(bg, '#FFFFFF', 0.04), '--p-accent': state.accentColor,
      '--p-fg': v.fg, '--p-fgDim': v.fgDim, '--p-variable': v.variable, '--p-muted': mix(bg, v.fg, 0.4),
      '--p-red': '#FF6767', '--p-orange': '#FFCA85',
      '--i-comment': state.italicComments ? 'italic' : 'normal',
      '--i-keyword': state.italicKeywords ? 'italic' : 'normal',
      '--i-parameter': state.italicParameters ? 'italic' : 'normal'
    };
    Object.keys(state.syntax).forEach(function (k) { vars['--s-' + k] = state.syntax[k]; });
    Object.keys(vars).forEach(function (k) { p.setProperty(k, vars[k]); });
    $('status').textContent = '';
  }

  $('save').addEventListener('click', function () {
    $('status').textContent = 'Guardando…';
    vscode.postMessage({ type: 'save', options: state });
  });
  $('reset').addEventListener('click', function () { vscode.postMessage({ type: 'reset' }); });
  $('settings').addEventListener('click', function () { vscode.postMessage({ type: 'openSettings' }); });

  window.addEventListener('message', function (e) {
    var m = e.data;
    if (m.type === 'init') {
      state = JSON.parse(JSON.stringify(m.options));
      defaults = m.defaults; labels = m.labels; text = m.text;
      build(); refresh();
    } else if (m.type === 'saved') {
      $('status').textContent = 'Guardado ✓';
    }
  });

  vscode.postMessage({ type: 'ready' });
})();
</script>
</body>
</html>`;
}

module.exports = { getCustomizerHtml };
