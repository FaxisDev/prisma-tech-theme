'use strict';

/**
 * HTML del panel "Personalizar Prisma-Tech".
 * Selectores de color, opciones de estilo y vista previa en vivo.
 * mode: 'full' (controles y vista previa), 'controls' (barra lateral) o 'preview' (pestaña del editor).
 */
function getCustomizerHtml(webview, nonce, mode = 'full') {
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
    color: var(--ui-foreground, var(--vscode-foreground)); background: var(--ui-editor-background, var(--vscode-editor-background));
  }
  h1 { font-size: 20px; margin: 0 0 4px; font-weight: 600; }
  /* Título prismático: el degradado se desplaza y un halo del color de acento respira. */
  h1 .prism { background: linear-gradient(90deg, var(--g1, #61FFCA), var(--g2, #5CDFFF), var(--g3, #ACA0FF),
      var(--g4, #F77BFF), var(--g1, #61FFCA));
    background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: prism-shift 8s linear infinite, prism-breathe 3.2s ease-in-out infinite; }
  @keyframes prism-shift { to { background-position: 200% center; } }
  @keyframes prism-breathe {
    0%, 100% { filter: drop-shadow(0 0 0 transparent) brightness(1); }
    50% { filter: drop-shadow(0 0 7px color-mix(in srgb, var(--g1, #61FFCA) 65%, transparent)) brightness(1.25); }
  }
  body.no-glow h1 .prism { animation: none; filter: none; }
  @media (prefers-reduced-motion: reduce) { h1 .prism { animation: none; filter: none; } }
  .sub { color: var(--ui-descriptionForeground, var(--vscode-descriptionForeground)); margin: 0 0 22px; }
  .layout { display: grid; grid-template-columns: minmax(300px, 400px) 1fr; gap: 28px; align-items: start; }
  @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
  /* Barra lateral: márgenes más chicos y el mismo fondo que la barra. */
  @media (max-width: 480px) {
    body { padding: 12px 12px 24px; background: var(--ui-sideBar-background, var(--vscode-sideBar-background)); }
    h1 { font-size: 16px; }
    .sub { margin-bottom: 16px; }
    .layout { gap: 16px; }
    /* Nombre del color en su propia línea para que no se corte. */
    .row { grid-template-columns: auto 1fr 34px 22px; gap: 2px 6px; padding: 4px 6px; }
    .row label { grid-column: 1 / -1; }
  }
  section { margin-bottom: 22px; }
  h2 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px;
    color: var(--ui-descriptionForeground, var(--vscode-descriptionForeground)); font-weight: 600; }
  .row { display: grid; grid-template-columns: 1fr auto 84px 36px 26px; gap: 8px; align-items: center; padding: 5px 0;
    border-radius: 4px; transition: background .3s; }
  .row.flash { background: color-mix(in srgb, var(--ui-button-background, var(--vscode-button-background)) 22%, transparent); }
  /* Contraste del color contra el fondo del editor. */
  .cr { font-size: 10.5px; text-align: center; border-radius: 3px; padding: 2px 0; color: var(--ui-descriptionForeground, var(--vscode-descriptionForeground));
    font-variant-numeric: tabular-nums; }
  .cr.low { color: var(--ui-errorForeground, var(--vscode-errorForeground)); background: color-mix(in srgb, var(--ui-errorForeground, var(--vscode-errorForeground)) 14%, transparent); }
  .hint { display: none; margin: 0 0 10px; padding: 6px 8px; border-radius: 4px; font-size: 12px;
    background: color-mix(in srgb, var(--ui-button-background, var(--vscode-button-background)) 14%, transparent); }
  .hint.show { display: block; }
  .section-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
  .section-head h2 { margin: 0; }
  button.small { padding: 3px 9px; font-size: 11.5px; }
  .row label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  input[type=color] { width: 30px; height: 24px; padding: 0; border: 1px solid var(--ui-input-border, var(--vscode-input-border, transparent));
    border-radius: 4px; background: none; cursor: pointer; }
  input[type=color]::-webkit-color-swatch-wrapper { padding: 2px; }
  input[type=color]::-webkit-color-swatch { border: none; border-radius: 2px; }
  input[type=text] { width: 100%; padding: 4px 6px; font-family: var(--vscode-editor-font-family); font-size: 12px;
    color: var(--ui-input-foreground, var(--vscode-input-foreground)); background: var(--ui-input-background, var(--vscode-input-background));
    border: 1px solid var(--ui-input-border, var(--vscode-input-border, transparent)); border-radius: 3px; text-transform: uppercase; }
  input[type=text].bad { border-color: var(--vscode-inputValidation-errorBorder, #FF4D5E); }
  .undo { width: 26px; height: 24px; padding: 0; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;
    background: transparent; color: var(--ui-descriptionForeground, var(--vscode-descriptionForeground)); visibility: hidden; }
  .undo.show { visibility: visible; }
  .undo:hover { background: var(--ui-toolbar-hoverBackground, var(--vscode-toolbar-hoverBackground)); color: var(--ui-foreground, var(--vscode-foreground)); }
  .presets { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .chip { width: 26px; height: 26px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; padding: 0; }
  .chip.active { border-color: var(--ui-foreground, var(--vscode-foreground)); }
  .toggle { display: flex; align-items: center; gap: 8px; padding: 5px 0; cursor: pointer; }
  /* Casillas del panel: apagadas con el tono del tema; activadas, verde aura brillante. */
  .toggle input { appearance: none; -webkit-appearance: none; flex-shrink: 0; width: 16px; height: 16px; margin: 0;
    border-radius: 4px; cursor: pointer; display: grid; place-content: center;
    background: var(--ui-input-background, var(--vscode-input-background));
    border: 1px solid var(--ui-input-border, var(--vscode-input-border)); transition: background .15s, box-shadow .15s; }
  .toggle input::after { content: ''; width: 9px; height: 5px; margin-top: -2px; border: solid transparent;
    border-width: 0 0 2px 2px; transform: rotate(-45deg); }
  .toggle input:checked { background: var(--ui-button-background, var(--vscode-button-background));
    border-color: var(--ui-button-background, var(--vscode-button-background));
    box-shadow: 0 0 8px color-mix(in srgb, var(--ui-button-background, var(--vscode-button-background)) 55%, transparent); }
  .toggle input:checked::after { border-color: var(--ui-button-foreground, var(--vscode-button-foreground)); }
  .toggle input:hover:not(:checked) { border-color: var(--ui-button-background, var(--vscode-button-background)); }
  .toggle input:focus-visible { outline: 1px solid var(--ui-button-background, var(--vscode-button-background)); outline-offset: 2px; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  button.btn { padding: 6px 14px; border: none; border-radius: 3px; cursor: pointer; font-size: 13px; font-family: inherit; }
  .primary { background: var(--ui-button-background, var(--vscode-button-background)); color: var(--ui-button-foreground, var(--vscode-button-foreground)); }
  .primary:hover { background: var(--ui-button-hoverBackground, var(--vscode-button-hoverBackground)); }
  .secondary { background: var(--ui-button-secondaryBackground, var(--vscode-button-secondaryBackground)); color: var(--ui-button-secondaryForeground, var(--vscode-button-secondaryForeground)); }
  .secondary:hover { background: var(--ui-button-secondaryHoverBackground, var(--vscode-button-secondaryHoverBackground)); }
  .status { margin-left: 4px; align-self: center; color: var(--ui-descriptionForeground, var(--vscode-descriptionForeground)); }
  .sticky { position: sticky; top: 16px; }

  /* Modos: la barra lateral solo muestra controles; la pestaña del editor solo la vista previa. */
  body.mode-controls .sticky { display: none; }
  body.mode-preview > h1, body.mode-preview > .sub, body.mode-preview .layout > div:first-child { display: none; }
  body.mode-preview .layout { display: block; }
  body.mode-preview .sticky { position: static; }
  body.mode-preview .win { font-size: 14px; }
  body.mode-preview .body { grid-template-columns: 48px 210px 1fr; min-height: calc(100vh - 120px); }

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
  .tab { padding: 7px 14px; font-size: 11.5px; color: var(--p-muted); border-right: 1px solid var(--p-border); cursor: pointer; }
  .tab:hover { color: var(--p-fgDim); }
  .tabs { overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { white-space: nowrap; flex-shrink: 0; display: flex; align-items: center; }
  .side .f { display: flex; align-items: center; white-space: nowrap; overflow: hidden; }
  /* Icono del lenguaje: abreviatura con su color característico. */
  .ico { display: inline-block; min-width: 18px; margin-right: 6px; font: 700 8.5px/1 -apple-system, sans-serif;
    letter-spacing: -.02em; text-align: center; }
  .side .f[data-lang] { cursor: pointer; }
  pre [class^="t-"] { cursor: pointer; border-radius: 2px; }
  pre [class^="t-"]:hover { outline: 1px dashed var(--p-fgDim); outline-offset: 1px; }
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
  .t-constvar { color: var(--s-constVariable); }
  .t-boolean { color: var(--s-boolean); }
  .t-objkey { color: var(--s-objectKey); }
  .t-classref { color: var(--s-classReference); }
  .t-tag { color: var(--s-tag); }
  .t-operator { color: var(--s-operator); }
  .t-self { color: var(--s-self); font-style: var(--i-keyword); }
  .t-attr { color: var(--s-storage); font-style: italic; }
  .t-punct { color: var(--p-fgDim); }
  .t-var { color: var(--p-variable); }
  .t-key { color: var(--s-property); }
  .t-decorator { color: var(--s-constant); font-style: italic; }
  .t-cssprop { color: var(--s-property); }
  .t-cssval { color: var(--s-number); }
  .t-cssclass { color: var(--x-cssClass); font-style: italic; }
  .t-cssvar { color: var(--x-cssVar); }
  .t-csspseudo, .t-csstag { color: var(--x-cssPseudo); }
  .t-cssdecl { color: var(--x-cssDecl); }
  .t-csssel { color: var(--x-cssSel); }
  .t-exportkw { color: #FF4D5E; font-style: var(--i-keyword); }
  .t-classdecl { color: #3BA9F5; }
  .t-hex { color: var(--x-hex); }
</style>
</head>
<body class="mode-${mode}">
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
        <div class="section-head">
          <h2>Sintaxis</h2>
          <button class="btn secondary small" id="prism" title="Reparte los colores por todo el espectro a partir del acento">✦ Modo prisma</button>
        </div>
        <div class="hint" id="hint"></div>
        <div id="syntax"></div>
      </section>

      <section>
        <h2>Estilo</h2>
        <label class="toggle"><input type="checkbox" id="italicComments"> Comentarios en cursiva</label>
        <label class="toggle"><input type="checkbox" id="italicKeywords"> Keywords de control en cursiva</label>
        <label class="toggle"><input type="checkbox" id="italicParameters"> Parámetros en cursiva</label>
        <label class="toggle"><input type="checkbox" id="brightText"> Texto brillante (más contraste)</label>
        <label class="toggle" title="No cambia el tema, solo este panel"><input type="checkbox" id="titleGlow"> Brillo animado en el título</label>
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
          <span class="name" id="winName">prisma.ts — Prisma-Tech</span>
        </div>
        <div class="body">
          <div class="activity"><div class="on"><span></span></div><div><span></span></div><div><span></span></div><div><span></span></div></div>
          <div class="side">
            <div class="h">EXPLORADOR</div>
            <div class="f">components</div>
            <div class="f sel" data-lang="ts"><span class="ico" style="color:#3178C6">TS</span>prisma.ts</div>
            <div class="f" data-lang="js"><span class="ico" style="color:#F7DF1E">JS</span>prisma.js</div>
            <div class="f" data-lang="dart"><span class="ico" style="color:#40C4FF">DT</span>prism.dart</div>
            <div class="f" data-lang="py"><span class="ico" style="color:#4B8BBE">PY</span>prisma.py</div>
            <div class="f mod" data-lang="scss"><span class="ico" style="color:#CD6799">S</span>styles.scss</div>
            <div class="f" data-lang="html"><span class="ico" style="color:#E44D26">&lt;&gt;</span>index.html</div>
            <div class="f" data-lang="json"><span class="ico" style="color:#CBCB41">{}</span>package.json</div>
            <div class="f" data-lang="php"><span class="ico" style="color:#8892BF">PHP</span>PrismService.php</div>
            <div class="f" data-lang="java"><span class="ico" style="color:#E76F00">J</span>Prism.java</div>
            <div class="f" data-lang="cpp"><span class="ico" style="color:#659AD2">C++</span>prism.cpp</div>
            <div class="f" data-lang="go"><span class="ico" style="color:#00ADD8">GO</span>prism.go</div>
            <div class="f" data-lang="rust"><span class="ico" style="color:#DEA584">RS</span>prism.rs</div>
          </div>
          <div class="main">
            <div class="tabs" id="tabs"><div class="tab on" data-lang="ts" data-file="prisma.ts" title="TypeScript"><span class="ico" style="color:#3178C6">TS</span>prisma.ts</div><div class="tab" data-lang="js" data-file="prisma.js" title="JavaScript"><span class="ico" style="color:#F7DF1E">JS</span>prisma.js</div><div class="tab" data-lang="dart" data-file="prism.dart" title="Dart"><span class="ico" style="color:#40C4FF">DT</span>prism.dart</div><div class="tab" data-lang="py" data-file="prisma.py" title="Python"><span class="ico" style="color:#4B8BBE">PY</span>prisma.py</div><div class="tab" data-lang="scss" data-file="styles.scss" title="SCSS"><span class="ico" style="color:#CD6799">S</span>styles.scss</div><div class="tab" data-lang="html" data-file="index.html" title="HTML"><span class="ico" style="color:#E44D26">&lt;&gt;</span>index.html</div><div class="tab" data-lang="json" data-file="package.json" title="JSON"><span class="ico" style="color:#CBCB41">{}</span>package.json</div><div class="tab" data-lang="php" data-file="PrismService.php" title="PHP"><span class="ico" style="color:#8892BF">PHP</span>PrismService.php</div><div class="tab" data-lang="java" data-file="Prism.java" title="Java"><span class="ico" style="color:#E76F00">J</span>Prism.java</div><div class="tab" data-lang="cpp" data-file="prism.cpp" title="C++"><span class="ico" style="color:#659AD2">C++</span>prism.cpp</div><div class="tab" data-lang="go" data-file="prism.go" title="Go"><span class="ico" style="color:#00ADD8">GO</span>prism.go</div><div class="tab" data-lang="rust" data-file="prism.rs" title="Rust"><span class="ico" style="color:#DEA584">RS</span>prism.rs</div></div>
<pre data-lang="ts"><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech: refracción de la luz</span></span><span class="ln" data-n="2"><span class="t-flow">import</span> <span class="t-punct">{</span> <span class="t-var">render</span> <span class="t-punct">}</span> <span class="t-flow">from</span> <span class="t-string">'./engine'</span><span class="t-punct">;</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-storage">const</span> <span class="t-constvar">MAX_ANGLE</span> <span class="t-operator">=</span> <span class="t-number">90</span><span class="t-punct">;</span></span><span class="ln" data-n="5"> </span><span class="ln" data-n="6"><span class="t-exportkw">export</span> <span class="t-exportkw">class</span> <span class="t-classdecl">Prisma</span> <span class="t-storage">extends</span> <span class="t-classref">Light</span> <span class="t-punct">{</span></span><span class="ln" data-n="7">  <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-parameter">beam</span><span class="t-operator">:</span> <span class="t-type">Beam</span><span class="t-punct">,</span> <span class="t-parameter">angle</span> <span class="t-operator">=</span> <span class="t-number">45</span><span class="t-punct">)</span> <span class="t-punct">{</span></span><span class="ln cur" data-n="8">    <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">angle</span> <span class="t-operator">&gt;</span> <span class="t-constvar">MAX_ANGLE</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-constant">null</span><span class="cursor"></span><span class="t-punct">;</span></span><span class="ln" data-n="9">    <span class="t-storage">const</span> <span class="t-constvar">ratio</span> <span class="t-operator">=</span> <span class="t-number">1.52</span> <span class="t-operator">*</span> <span class="t-var">beam</span><span class="t-punct">.</span><span class="t-property">speed</span><span class="t-punct">;</span></span><span class="ln" data-n="10">    <span class="t-self">this</span><span class="t-punct">.</span><span class="t-property">spectrum</span> <span class="t-operator">=</span> <span class="t-function">render</span><span class="t-punct">({</span> <span class="t-objkey">glow</span><span class="t-operator">:</span> <span class="t-boolean">true</span><span class="t-punct">,</span> <span class="sel"><span class="t-constvar">ratio</span></span> <span class="t-punct">});</span></span><span class="ln" data-n="11">    <span class="t-flow">return</span> <span class="t-tag">&lt;Card</span> <span class="t-attr">title</span><span class="t-operator">=</span><span class="t-string">"Prisma"</span> <span class="t-tag">/&gt;</span><span class="t-punct">;</span></span><span class="ln" data-n="12">  <span class="t-punct">}</span></span><span class="ln" data-n="13"><span class="t-punct">}</span></span></pre><pre data-lang="scss" hidden><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech: panel</span></span><span class="ln" data-n="2"><span class="t-csspseudo">@use</span> <span class="t-string">'sass:math'</span><span class="t-punct">;</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-csssel">:host</span> <span class="t-punct">{</span></span><span class="ln" data-n="5">  <span class="t-cssdecl">--interface-green</span><span class="t-punct">:</span> <span class="t-hex">#61FFCA</span><span class="t-punct">;</span></span><span class="ln" data-n="6">  <span class="t-cssprop">display</span><span class="t-punct">:</span> <span class="t-cssval">block</span><span class="t-punct">;</span></span><span class="ln" data-n="7"><span class="t-punct">}</span></span><span class="ln" data-n="8"><span class="t-cssclass">.invade-panel</span> <span class="t-punct">{</span></span><span class="ln" data-n="9">  <span class="t-cssprop">border</span><span class="t-punct">:</span> <span class="t-cssval">1px solid</span> <span class="t-function">var</span><span class="t-punct">(</span><span class="t-cssvar">--dashboard-border</span><span class="t-punct">);</span></span><span class="ln" data-n="10">  <span class="t-cssprop">border-radius</span><span class="t-punct">:</span> <span class="t-cssval">8px</span><span class="t-punct">;</span></span><span class="ln" data-n="11">  <span class="t-cssprop">color</span><span class="t-punct">:</span> <span class="t-cssdecl">$accent</span><span class="t-punct">;</span></span><span class="ln" data-n="12">  <span class="t-csssel">&amp;:hover</span> <span class="t-csssel">span</span> <span class="t-punct">{</span> <span class="t-cssprop">opacity</span><span class="t-punct">:</span> <span class="t-cssval">0.8</span><span class="t-punct">;</span> <span class="t-punct">}</span></span><span class="ln" data-n="13"><span class="t-punct">}</span></span></pre><pre data-lang="html" hidden><span class="ln" data-n="1"><span class="t-comment">&lt;!-- Prisma-Tech --&gt;</span></span><span class="ln" data-n="2"><span class="t-tag">&lt;section</span> <span class="t-attr">class</span><span class="t-operator">=</span><span class="t-string">"prism"</span> <span class="t-attr">id</span><span class="t-operator">=</span><span class="t-string">"hero"</span><span class="t-tag">&gt;</span></span><span class="ln" data-n="3">  <span class="t-tag">&lt;h1</span> <span class="t-attr">title</span><span class="t-operator">=</span><span class="t-string">"Luz"</span><span class="t-tag">&gt;</span><span class="t-var">Refracción</span><span class="t-tag">&lt;/h1&gt;</span></span><span class="ln" data-n="4">  <span class="t-tag">&lt;app-card</span> <span class="t-attr">[glow]</span><span class="t-operator">=</span><span class="t-string">"true"</span><span class="t-tag">&gt;&lt;/app-card&gt;</span></span><span class="ln" data-n="5">  <span class="t-tag">&lt;p&gt;</span><span class="t-var">Ángulo: </span><span class="t-string">{{ angle }}</span><span class="t-tag">&lt;/p&gt;</span></span><span class="ln" data-n="6"><span class="t-tag">&lt;/section&gt;</span></span></pre><pre data-lang="json" hidden><span class="ln" data-n="1"><span class="t-punct">{</span></span><span class="ln" data-n="2">  <span class="t-key">"name"</span><span class="t-punct">:</span> <span class="t-string">"prisma-tech-theme"</span><span class="t-punct">,</span></span><span class="ln" data-n="3">  <span class="t-key">"version"</span><span class="t-punct">:</span> <span class="t-string">"0.2.0"</span><span class="t-punct">,</span></span><span class="ln" data-n="4">  <span class="t-key">"private"</span><span class="t-punct">:</span> <span class="t-boolean">true</span><span class="t-punct">,</span></span><span class="ln" data-n="5">  <span class="t-key">"stars"</span><span class="t-punct">:</span> <span class="t-number">1520</span><span class="t-punct">,</span></span><span class="ln" data-n="6">  <span class="t-key">"engines"</span><span class="t-punct">:</span> <span class="t-punct">{</span> <span class="t-key">"vscode"</span><span class="t-punct">:</span> <span class="t-string">"^1.80.0"</span> <span class="t-punct">}</span></span><span class="ln" data-n="7"><span class="t-punct">}</span></span></pre><pre data-lang="py" hidden><span class="ln" data-n="1"><span class="t-comment"># Prisma-Tech: refracción</span></span><span class="ln" data-n="2"><span class="t-flow">from</span> <span class="t-var">dataclasses</span> <span class="t-flow">import</span> <span class="t-var">dataclass</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-decorator">@dataclass</span></span><span class="ln" data-n="5"><span class="t-storage">class</span> <span class="t-type">Prism</span><span class="t-punct">(</span><span class="t-type">Light</span><span class="t-punct">):</span></span><span class="ln" data-n="6">    <span class="t-property">angle</span><span class="t-punct">:</span> <span class="t-type">float</span> <span class="t-operator">=</span> <span class="t-number">45.0</span></span><span class="ln" data-n="7"> </span><span class="ln" data-n="8">    <span class="t-storage">def</span> <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-self">self</span><span class="t-punct">,</span> <span class="t-parameter">beam</span><span class="t-punct">,</span> <span class="t-parameter">angle</span><span class="t-operator">=</span><span class="t-constant">None</span><span class="t-punct">):</span></span><span class="ln" data-n="9">        <span class="t-flow">if</span> <span class="t-var">angle</span> <span class="t-keyword">is</span> <span class="t-constant">None</span><span class="t-punct">:</span></span><span class="ln" data-n="10">            <span class="t-flow">return</span> <span class="t-self">self</span><span class="t-punct">.</span><span class="t-function">spectrum</span><span class="t-punct">(</span><span class="t-var">beam</span><span class="t-punct">)</span></span><span class="ln" data-n="11">        <span class="t-flow">return</span> <span class="t-string">f"{beam.speed * 1.52:.2f}"</span></span></pre><pre data-lang="js" hidden><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech: refracción</span></span><span class="ln" data-n="2"><span class="t-flow">import</span> <span class="t-var">express</span> <span class="t-flow">from</span> <span class="t-string">'express'</span><span class="t-punct">;</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-storage">const</span> <span class="t-constvar">app</span> <span class="t-operator">=</span> <span class="t-function">express</span><span class="t-punct">();</span></span><span class="ln" data-n="5"><span class="t-storage">const</span> <span class="t-constvar">MAX_ANGLE</span> <span class="t-operator">=</span> <span class="t-number">90</span><span class="t-punct">;</span></span><span class="ln" data-n="6"> </span><span class="ln" data-n="7"><span class="t-var">app</span><span class="t-punct">.</span><span class="t-function">get</span><span class="t-punct">(</span><span class="t-string">'/prism'</span><span class="t-punct">,</span> <span class="t-storage">async</span> <span class="t-punct">(</span><span class="t-parameter">req</span><span class="t-punct">,</span> <span class="t-parameter">res</span><span class="t-punct">)</span> <span class="t-operator">=&gt;</span> <span class="t-punct">{</span></span><span class="ln" data-n="8">  <span class="t-storage">const</span> <span class="t-constvar">angle</span> <span class="t-operator">=</span> <span class="t-function">Number</span><span class="t-punct">(</span><span class="t-var">req</span><span class="t-punct">.</span><span class="t-property">query</span><span class="t-punct">.</span><span class="t-property">angle</span><span class="t-punct">)</span> <span class="t-operator">??</span> <span class="t-number">45</span><span class="t-punct">;</span></span><span class="ln" data-n="9">  <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">angle</span> <span class="t-operator">&gt;</span> <span class="t-constvar">MAX_ANGLE</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-var">res</span><span class="t-punct">.</span><span class="t-function">status</span><span class="t-punct">(</span><span class="t-number">400</span><span class="t-punct">).</span><span class="t-function">end</span><span class="t-punct">();</span></span><span class="ln" data-n="10">  <span class="t-var">res</span><span class="t-punct">.</span><span class="t-function">json</span><span class="t-punct">({</span> <span class="t-objkey">glow</span><span class="t-punct">:</span> <span class="t-boolean">true</span><span class="t-punct">,</span> <span class="t-objkey">ratio</span><span class="t-punct">:</span> <span class="t-number">1.52</span> <span class="t-punct">});</span></span><span class="ln" data-n="11"><span class="t-punct">});</span></span></pre><pre data-lang="dart" hidden><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech: widget</span></span><span class="ln" data-n="2"><span class="t-flow">import</span> <span class="t-string">'package:flutter/material.dart'</span><span class="t-punct">;</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-storage">class</span> <span class="t-type">Prism</span> <span class="t-storage">extends</span> <span class="t-classref">StatelessWidget</span> <span class="t-punct">{</span></span><span class="ln" data-n="5">  <span class="t-keyword">final</span> <span class="t-storage">double</span> <span class="t-property">angle</span><span class="t-punct">;</span></span><span class="ln" data-n="6">  <span class="t-keyword">const</span> <span class="t-type">Prism</span><span class="t-punct">({</span><span class="t-keyword">super</span><span class="t-punct">.</span><span class="t-parameter">key</span><span class="t-punct">,</span> <span class="t-self">this</span><span class="t-punct">.</span><span class="t-parameter">angle</span> <span class="t-operator">=</span> <span class="t-number">45</span><span class="t-punct">});</span></span><span class="ln" data-n="7"> </span><span class="ln" data-n="8">  <span class="t-decorator">@override</span></span><span class="ln" data-n="9">  <span class="t-type">Widget</span> <span class="t-function">build</span><span class="t-punct">(</span><span class="t-classref">BuildContext</span> <span class="t-parameter">context</span><span class="t-punct">)</span> <span class="t-punct">{</span></span><span class="ln" data-n="10">    <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">angle</span> <span class="t-operator">&gt;</span> <span class="t-number">90</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-keyword">const</span> <span class="t-classref">SizedBox</span><span class="t-punct">();</span></span><span class="ln" data-n="11">    <span class="t-flow">return</span> <span class="t-classref">Text</span><span class="t-punct">(</span><span class="t-string">'Prisma $angle'</span><span class="t-punct">,</span> <span class="t-objkey">softWrap</span><span class="t-punct">:</span> <span class="t-boolean">true</span><span class="t-punct">);</span></span><span class="ln" data-n="12">  <span class="t-punct">}</span></span><span class="ln" data-n="13"><span class="t-punct">}</span></span></pre><pre data-lang="php" hidden><span class="ln" data-n="1"><span class="t-constant">&lt;?php</span></span><span class="ln" data-n="2"><span class="t-comment">// Prisma-Tech: servicio</span></span><span class="ln" data-n="3"><span class="t-keyword">namespace</span> <span class="t-type">App</span><span class="t-punct">;</span></span><span class="ln" data-n="4"> </span><span class="ln" data-n="5"><span class="t-keyword">final</span> <span class="t-storage">class</span> <span class="t-type">PrismService</span> <span class="t-storage">extends</span> <span class="t-classref">Service</span></span><span class="ln" data-n="6"><span class="t-punct">{</span></span><span class="ln" data-n="7">    <span class="t-keyword">public</span> <span class="t-storage">function</span> <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-classref">Beam</span> <span class="t-parameter">$beam</span><span class="t-punct">,</span> <span class="t-storage">int</span> <span class="t-parameter">$angle</span> <span class="t-operator">=</span> <span class="t-number">45</span><span class="t-punct">):</span> <span class="t-type">?string</span></span><span class="ln" data-n="8">    <span class="t-punct">{</span></span><span class="ln" data-n="9">        <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">$angle</span> <span class="t-operator">&gt;</span> <span class="t-self">self</span><span class="t-operator">::</span><span class="t-constvar">MAX</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-constant">null</span><span class="t-punct">;</span></span><span class="ln" data-n="10">        <span class="t-self">$this</span><span class="t-operator">-&gt;</span><span class="t-property">spectrum</span> <span class="t-operator">=</span> <span class="t-punct">[</span><span class="t-string">'glow'</span> <span class="t-operator">=&gt;</span> <span class="t-boolean">true</span><span class="t-punct">];</span></span><span class="ln" data-n="11">        <span class="t-flow">return</span> <span class="t-string">"Ángulo: {$angle}"</span><span class="t-punct">;</span></span><span class="ln" data-n="12">    <span class="t-punct">}</span></span><span class="ln" data-n="13"><span class="t-punct">}</span></span></pre><pre data-lang="java" hidden><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech: refracción</span></span><span class="ln" data-n="2"><span class="t-keyword">package</span> <span class="t-type">dev.prisma</span><span class="t-punct">;</span></span><span class="ln" data-n="3"> </span><span class="ln" data-n="4"><span class="t-decorator">@Service</span></span><span class="ln" data-n="5"><span class="t-keyword">public</span> <span class="t-storage">class</span> <span class="t-type">Prism</span> <span class="t-storage">extends</span> <span class="t-classref">Light</span> <span class="t-punct">{</span></span><span class="ln" data-n="6">    <span class="t-keyword">private static final</span> <span class="t-storage">int</span> <span class="t-constvar">MAX</span> <span class="t-operator">=</span> <span class="t-number">90</span><span class="t-punct">;</span></span><span class="ln" data-n="7"> </span><span class="ln" data-n="8">    <span class="t-decorator">@Override</span></span><span class="ln" data-n="9">    <span class="t-keyword">public</span> <span class="t-type">String</span> <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-classref">Beam</span> <span class="t-parameter">beam</span><span class="t-punct">,</span> <span class="t-storage">int</span> <span class="t-parameter">angle</span><span class="t-punct">)</span> <span class="t-punct">{</span></span><span class="ln" data-n="10">        <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">angle</span> <span class="t-operator">&gt;</span> <span class="t-constvar">MAX</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-constant">null</span><span class="t-punct">;</span></span><span class="ln" data-n="11">        <span class="t-self">this</span><span class="t-punct">.</span><span class="t-property">glow</span> <span class="t-operator">=</span> <span class="t-boolean">true</span><span class="t-punct">;</span></span><span class="ln" data-n="12">        <span class="t-flow">return</span> <span class="t-string">"Prisma "</span> <span class="t-operator">+</span> <span class="t-var">beam</span><span class="t-punct">.</span><span class="t-function">getSpeed</span><span class="t-punct">();</span></span><span class="ln" data-n="13">    <span class="t-punct">}</span></span><span class="ln" data-n="14"><span class="t-punct">}</span></span></pre><pre data-lang="cpp" hidden><span class="ln" data-n="1"><span class="t-keyword">#include</span> <span class="t-string">&lt;vector&gt;</span></span><span class="ln" data-n="2"><span class="t-comment">// Prisma-Tech</span></span><span class="ln" data-n="3"><span class="t-keyword">namespace</span> <span class="t-type">prisma</span> <span class="t-punct">{</span></span><span class="ln" data-n="4"> </span><span class="ln" data-n="5"><span class="t-keyword">constexpr</span> <span class="t-storage">int</span> <span class="t-constvar">MAX_ANGLE</span> <span class="t-operator">=</span> <span class="t-number">90</span><span class="t-punct">;</span></span><span class="ln" data-n="6"> </span><span class="ln" data-n="7"><span class="t-storage">class</span> <span class="t-type">Prism</span> <span class="t-operator">:</span> <span class="t-keyword">public</span> <span class="t-classref">Light</span> <span class="t-punct">{</span></span><span class="ln" data-n="8"><span class="t-keyword">public</span><span class="t-punct">:</span></span><span class="ln" data-n="9">    <span class="t-storage">double</span> <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-keyword">const</span> <span class="t-classref">Beam</span><span class="t-operator">&amp;</span> <span class="t-parameter">beam</span><span class="t-punct">,</span> <span class="t-storage">int</span> <span class="t-parameter">angle</span> <span class="t-operator">=</span> <span class="t-number">45</span><span class="t-punct">)</span> <span class="t-punct">{</span></span><span class="ln" data-n="10">        <span class="t-flow">if</span> <span class="t-punct">(</span><span class="t-var">angle</span> <span class="t-operator">&gt;</span> <span class="t-constvar">MAX_ANGLE</span><span class="t-punct">)</span> <span class="t-flow">return</span> <span class="t-number">0.0</span><span class="t-punct">;</span></span><span class="ln" data-n="11">        <span class="t-flow">return</span> <span class="t-var">beam</span><span class="t-punct">.</span><span class="t-property">speed</span> <span class="t-operator">*</span> <span class="t-number">1.52</span><span class="t-punct">;</span></span><span class="ln" data-n="12">    <span class="t-punct">}</span></span><span class="ln" data-n="13"><span class="t-punct">};</span></span><span class="ln" data-n="14"><span class="t-punct">}</span>  <span class="t-comment">// namespace prisma</span></span></pre><pre data-lang="go" hidden><span class="ln" data-n="1"><span class="t-keyword">package</span> <span class="t-type">prisma</span></span><span class="ln" data-n="2"> </span><span class="ln" data-n="3"><span class="t-flow">import</span> <span class="t-string">"fmt"</span></span><span class="ln" data-n="4"> </span><span class="ln" data-n="5"><span class="t-keyword">type</span> <span class="t-type">Prism</span> <span class="t-keyword">struct</span> <span class="t-punct">{</span></span><span class="ln" data-n="6">    <span class="t-property">Angle</span> <span class="t-storage">float64</span></span><span class="ln" data-n="7">    <span class="t-property">Glow</span>  <span class="t-storage">bool</span></span><span class="ln" data-n="8"><span class="t-punct">}</span></span><span class="ln" data-n="9"> </span><span class="ln" data-n="10"><span class="t-keyword">func</span> <span class="t-punct">(</span><span class="t-parameter">p</span> <span class="t-operator">*</span><span class="t-classref">Prism</span><span class="t-punct">)</span> <span class="t-function">Refract</span><span class="t-punct">(</span><span class="t-parameter">beam</span> <span class="t-classref">Beam</span><span class="t-punct">)</span> <span class="t-storage">string</span> <span class="t-punct">{</span></span><span class="ln" data-n="11">    <span class="t-flow">if</span> <span class="t-var">p</span><span class="t-punct">.</span><span class="t-property">Angle</span> <span class="t-operator">&gt;</span> <span class="t-number">90</span> <span class="t-punct">{</span> <span class="t-flow">return</span> <span class="t-string">""</span> <span class="t-punct">}</span></span><span class="ln" data-n="12">    <span class="t-flow">return</span> <span class="t-type">fmt</span><span class="t-punct">.</span><span class="t-function">Sprintf</span><span class="t-punct">(</span><span class="t-string">"%.2f"</span><span class="t-punct">,</span> <span class="t-var">beam</span><span class="t-punct">.</span><span class="t-property">Speed</span><span class="t-operator">*</span><span class="t-number">1.52</span><span class="t-punct">)</span></span><span class="ln" data-n="13"><span class="t-punct">}</span></span></pre><pre data-lang="rust" hidden><span class="ln" data-n="1"><span class="t-comment">// Prisma-Tech</span></span><span class="ln" data-n="2"><span class="t-decorator">#[derive(Debug, Clone)]</span></span><span class="ln" data-n="3"><span class="t-keyword">pub</span> <span class="t-keyword">struct</span> <span class="t-type">Prism</span> <span class="t-punct">{</span></span><span class="ln" data-n="4">    <span class="t-property">angle</span><span class="t-punct">:</span> <span class="t-storage">f64</span><span class="t-punct">,</span></span><span class="ln" data-n="5"><span class="t-punct">}</span></span><span class="ln" data-n="6"> </span><span class="ln" data-n="7"><span class="t-keyword">impl</span> <span class="t-type">Prism</span> <span class="t-punct">{</span></span><span class="ln" data-n="8">    <span class="t-keyword">pub</span> <span class="t-keyword">fn</span> <span class="t-function">refract</span><span class="t-punct">(</span><span class="t-operator">&amp;</span><span class="t-self">self</span><span class="t-punct">,</span> <span class="t-parameter">beam</span><span class="t-punct">:</span> <span class="t-operator">&amp;</span><span class="t-classref">Beam</span><span class="t-punct">)</span> <span class="t-operator">-&gt;</span> <span class="t-type">Option</span><span class="t-punct">&lt;</span><span class="t-storage">f64</span><span class="t-punct">&gt;</span> <span class="t-punct">{</span></span><span class="ln" data-n="9">        <span class="t-flow">if</span> <span class="t-self">self</span><span class="t-punct">.</span><span class="t-property">angle</span> <span class="t-operator">&gt;</span> <span class="t-number">90.0</span> <span class="t-punct">{</span> <span class="t-flow">return</span> <span class="t-constant">None</span><span class="t-punct">;</span> <span class="t-punct">}</span></span><span class="ln" data-n="10">        <span class="t-storage">let</span> <span class="t-var">ratio</span> <span class="t-operator">=</span> <span class="t-var">beam</span><span class="t-punct">.</span><span class="t-property">speed</span> <span class="t-operator">*</span> <span class="t-number">1.52</span><span class="t-punct">;</span></span><span class="ln" data-n="11">        <span class="t-function">println!</span><span class="t-punct">(</span><span class="t-string">"ratio: {}"</span><span class="t-punct">,</span> <span class="t-var">ratio</span><span class="t-punct">);</span></span><span class="ln" data-n="12">        <span class="t-function">Some</span><span class="t-punct">(</span><span class="t-var">ratio</span><span class="t-punct">)</span></span><span class="ln" data-n="13">    <span class="t-punct">}</span></span><span class="ln" data-n="14"><span class="t-punct">}</span></span></pre>
            <div class="terminal">
              <div class="h">TERMINAL</div><br>
              <span style="color:var(--p-accent)">➜</span> <span style="color:var(--s-property)">prisma-tech</span> <span style="color:var(--s-keyword)">git:(</span><span style="color:var(--p-red)">main</span><span style="color:var(--s-keyword)">)</span> npm run build<br>
              <span style="color:var(--p-accent)">✓</span> compilado en <span style="color:var(--p-orange)">412ms</span>
            </div>
          </div>
        </div>
        <div class="statusbar"><span class="remote">⟨⟩</span><span>⎇ main</span><span id="winLang">TypeScript</span><span>UTF-8</span></div>
      </div>
    </div>
  </div>

<script nonce="${nonce}">
(function () {
  var vscode = acquireVsCodeApi();
  var mode = document.body.className.replace('mode-', '');
  var state = null, defaults = null, labels = {}, text = null;
  var HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
  var PRESETS = ['#61FFCA', '#5CDFFF', '#ACA0FF', '#F77BFF', '#FFD21F', '#C3E88D', '#FF4D5E', '#FFFFFF'];

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
  function lum(h) {
    return rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce(function (acc, v, i) { return acc + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function contrast(a, b) {
    var x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function hue(h) {
    var c = rgb(h).map(function (v) { return v / 255; });
    var mx = Math.max.apply(null, c), mn = Math.min.apply(null, c), d = mx - mn;
    if (!d) return 0;
    var H = mx === c[0] ? ((c[1] - c[2]) / d) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4;
    return (H * 60 + 360) % 360;
  }
  function hsl(H, S, L) {
    S /= 100; L /= 100;
    var a = S * Math.min(L, 1 - L);
    function f(n) { var k = (n + H / 30) % 12; return L - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1))); }
    return '#' + [0, 8, 4].map(function (n) { return Math.round(f(n) * 255).toString(16).padStart(2, '0'); }).join('').toUpperCase();
  }

  function colorRow(container, label, get, set, getDefault, key) {
    var row = document.createElement('div'); row.className = 'row'; row.dataset.key = key;
    var cr = document.createElement('span'); cr.className = 'cr';
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
      if (key === 'background') { cr.textContent = ''; return; }
      // Los comentarios pueden ser tenues a propósito: se exige menos contraste.
      var c = contrast(v, state.background), min = key === 'comment' ? 2.5 : 4.5;
      cr.textContent = (c < min ? '⚠ ' : '') + c.toFixed(1);
      cr.classList.toggle('low', c < min);
      cr.title = 'Contraste contra el fondo: ' + c.toFixed(1) + (c < min ? ' (difícil de leer, mínimo ' + min + ')' : '');
    }
    picker.addEventListener('input', function () { set(picker.value.toUpperCase()); refresh(); });
    text.addEventListener('input', function () {
      var v = norm(text.value);
      if (v) { set(v); refresh(); } else { text.classList.add('bad'); }
    });
    text.addEventListener('blur', function () { text.value = get(); text.classList.remove('bad'); });
    undo.addEventListener('click', function () { set(getDefault()); text.value = getDefault(); refresh(); });

    row.appendChild(lab); row.appendChild(picker); row.appendChild(text); row.appendChild(cr); row.appendChild(undo);
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
      function () { return defaults.accentColor; }, 'accentColor');
    colorRow($('base'), 'Fondo del editor',
      function () { return state.background; },
      function (v) { state.background = v; },
      function () { return defaults.background; }, 'background');

    PRESETS.forEach(function (c) {
      var b = document.createElement('button'); b.className = 'chip'; b.style.background = c; b.title = c;
      b.addEventListener('click', function () { state.accentColor = c; refresh(); });
      $('presets').appendChild(b);
    });

    Object.keys(defaults.syntax).forEach(function (key) {
      colorRow($('syntax'), labels[key] || key,
        function () { return state.syntax[key]; },
        function (v) { state.syntax[key] = v; },
        function () { return defaults.syntax[key]; }, key);
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
      '--p-border': mix(bg, '#FFFFFF', 0.03), '--p-lineNo': mix(bg, v.fg, 0.22),
      '--x-cssClass': '#3BA9F5', '--x-cssVar': v.variable, '--x-cssDecl': '#87CEFA', '--x-cssSel': '#FF2D5C', '--x-hex': mix('#87CEEB', '#FFFFFF', 0.35), '--x-cssPseudo': mix(state.syntax.keyword, '#FFFFFF', 0.3),
      '--p-lineHl': mix(bg, '#FFFFFF', 0.04), '--p-accent': state.accentColor,
      '--p-fg': v.fg, '--p-fgDim': v.fgDim, '--p-variable': v.variable, '--p-muted': mix(bg, v.fg, 0.4),
      '--p-red': '#FF4D5E', '--p-orange': '#FFA94D',
      '--i-comment': state.italicComments ? 'italic' : 'normal',
      '--i-keyword': state.italicKeywords ? 'italic' : 'normal',
      '--i-parameter': state.italicParameters ? 'italic' : 'normal'
    };
    Object.keys(state.syntax).forEach(function (k) { vars['--s-' + k] = state.syntax[k]; });
    Object.keys(vars).forEach(function (k) { p.setProperty(k, vars[k]); });
    // El título toma los colores actuales: acento, propiedades, keywords y constantes.
    var b = document.body.style;
    // El propio panel (fondo, textos, campos y botones) se pinta con Prisma-Tech aunque el tema activo sea otro.
    var ui = {
      'foreground': v.fg, 'editor-background': bg, 'sideBar-background': mix(bg, '#000000', 0.2),
      'descriptionForeground': v.fgDim, 'errorForeground': '#FF4D5E',
      'button-background': state.accentColor, 'button-foreground': mix(bg, '#000000', 0.34),
      'button-hoverBackground': mix(state.accentColor, '#000000', 0.12),
      'button-secondaryBackground': mix(bg, v.fg, 0.13), 'button-secondaryForeground': v.fg,
      'button-secondaryHoverBackground': mix(bg, v.fg, 0.2),
      'input-background': mix(bg, '#000000', 0.2), 'input-foreground': mix(v.fg, v.fgDim, 0.5),
      'input-border': mix(bg, v.fg, 0.14), 'toolbar-hoverBackground': mix(bg, v.fg, 0.1)
    };
    Object.keys(ui).forEach(function (k) { b.setProperty('--ui-' + k, ui[k]); });
    b.setProperty('--g1', state.accentColor); b.setProperty('--g2', state.syntax.property);
    b.setProperty('--g3', state.syntax.keyword); b.setProperty('--g4', state.syntax.constant);
    $('status').textContent = '';
    // Avisa a la extensión: actualiza la vista previa del editor y aplica los colores en vivo.
    if (mode !== 'preview') vscode.postMessage({ type: 'preview', state: state });
  }

  // ---------- Modo prisma: reparte los colores por el espectro a partir del acento ----------
  var PRISM_ORDER = ['string', 'operator', 'property', 'objectKey', 'function', 'keyword', 'storage',
    'constant', 'boolean', 'parameter', 'tag', 'constVariable', 'self', 'number', 'type', 'classReference', 'injected'];
  $('prism').addEventListener('click', function () {
    var h0 = hue(state.accentColor);
    PRISM_ORDER.forEach(function (key, i) {
      var H = (h0 + i * 360 / PRISM_ORDER.length) % 360, L = 60, c;
      // Sube la luz hasta que el color se lea bien sobre el fondo.
      do { c = hsl(H, 100, L); L += 1; } while (contrast(c, state.background) < 7 && L < 90);
      state.syntax[key] = c;
    });
    refresh();
    showHint('Colores repartidos por el espectro. Ajusta los que quieras o pulsa Guardar.');
  });

  // ---------- Pestañas de lenguajes en la vista previa ----------
  function showLang(lang) {
    Array.prototype.forEach.call(document.querySelectorAll('#preview pre'), function (pre) { pre.hidden = pre.dataset.lang !== lang; });
    Array.prototype.forEach.call(document.querySelectorAll('#preview [data-lang]:not(pre)'), function (el) {
      el.classList.toggle(el.classList.contains('tab') ? 'on' : 'sel', el.dataset.lang === lang);
    });
    var tab = document.querySelector('#tabs [data-lang="' + lang + '"]');
    $('winName').textContent = tab.dataset.file + ' — Prisma-Tech';
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    $('winLang').textContent = tab.title;
  }
  $('preview').addEventListener('click', function (e) {
    var nav = e.target.closest('[data-lang]:not(pre)');
    if (nav) { showLang(nav.dataset.lang); return; }
    var tok = e.target.closest('pre [class^="t-"]');
    if (!tok) return;
    var target = TOKEN_KEYS[tok.className.slice(2)] || { note: 'Este texto usa el color normal del editor.' };
    if (mode === 'preview') vscode.postMessage({ type: 'focus', key: target.key, note: target.note });
    else focusRow(target.key, target.note);
  });

  // ---------- Clic en el código: salta al color que lo controla ----------
  var TOKEN_KEYS = {
    comment: { key: 'comment' }, string: { key: 'string' }, keyword: { key: 'keyword' }, flow: { key: 'keyword' },
    storage: { key: 'storage' }, attr: { key: 'storage' }, 'function': { key: 'function' }, property: { key: 'property' },
    key: { key: 'property' }, cssprop: { key: 'property' }, type: { key: 'type' }, parameter: { key: 'parameter' },
    number: { key: 'number' }, cssval: { key: 'number' }, constant: { key: 'constant' }, decorator: { key: 'constant' },
    constvar: { key: 'constVariable' }, boolean: { key: 'boolean' }, objkey: { key: 'objectKey' }, classref: { key: 'classReference' },
    tag: { key: 'tag' }, operator: { key: 'operator' }, self: { key: 'self' },
    csspseudo: { key: 'keyword', note: 'En CSS/SCSS se usa una versión más clara de las keywords.' },
    csstag: { key: 'keyword', note: 'En CSS/SCSS se usa una versión más clara de las keywords.' },
    cssclass: { note: 'Las clases de CSS/SCSS usan un azul mar fijo (#3BA9F5).' },
    cssvar: { note: 'Las variables dentro de var(--x) usan el azul cielo claro del texto.' },
    exportkw: { note: 'En TS/JS, export y class usan un rojo fijo (#FF4D5E).' },
    classdecl: { note: 'El nombre de una clase al declararla usa un azul mar fijo (#3BA9F5).' },
    csssel: { note: 'Selectores como :root, body o html usan un rojo cereza fijo (#FF2D5C).' },
    cssdecl: { note: 'Al declarar variables en CSS/SCSS (--x:, $x) se usa un azul cielo claro fijo (#87CEFA).' },
    hex: { note: 'Los colores hexadecimales usan un tono fijo entre azul cielo y blanco.' },
    'var': { note: 'Las variables usan el color de texto; cámbialo con «Texto brillante».' },
    punct: { note: 'La puntuación usa el texto secundario del tema.' }
  };
  function showHint(msg) {
    $('hint').textContent = msg || '';
    $('hint').classList.toggle('show', !!msg);
  }
  function focusRow(key, note) {
    showHint(note);
    var row = key && document.querySelector('.row[data-key="' + key + '"]');
    var el = row || $('hint');
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (row) {
      row.classList.add('flash');
      setTimeout(function () { row.classList.remove('flash'); }, 1200);
      var input = row.querySelector('input[type=color]');
      if (input) input.focus();
    }
  }

  $('save').addEventListener('click', function () {
    $('status').textContent = 'Guardando…';
    vscode.postMessage({ type: 'save', options: state });
  });
  $('reset').addEventListener('click', function () { vscode.postMessage({ type: 'reset' }); });
  $('settings').addEventListener('click', function () { vscode.postMessage({ type: 'openSettings' }); });
  $('titleGlow').addEventListener('change', function () {
    document.body.classList.toggle('no-glow', !$('titleGlow').checked);
    vscode.postMessage({ type: 'titleGlow', value: $('titleGlow').checked });
  });

  window.addEventListener('message', function (e) {
    var m = e.data;
    if (m.type === 'init') {
      state = JSON.parse(JSON.stringify(m.options));
      defaults = m.defaults; labels = m.labels; text = m.text;
      $('titleGlow').checked = m.titleGlow !== false;
      document.body.classList.toggle('no-glow', m.titleGlow === false);
      build(); refresh();
    } else if (m.type === 'preview' && mode === 'preview' && defaults) {
      state = m.state;
      refresh();
    } else if (m.type === 'focus') {
      focusRow(m.key, m.note);
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
