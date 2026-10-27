'use strict';

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const gen = require('./generator');
const { getCustomizerHtml } = require('./customizer');

const SECTION = 'prismaTech';
const VIEW_ID = 'prismaTech.customizerView';
const KEYS = ['accentColor', 'background', 'italicComments', 'italicKeywords', 'italicParameters', 'brightText', 'syntax'];
const OLD_BRIGHT_NAME = 'Prisma-Tech Bright';

let panel;
let previewPanel;
let sidebarWebview;
let lastPreview; // estado sin guardar que está mostrando la barra lateral
let liveApplied = false; // hay colores aplicados en vivo en los Ajustes
let liveTimer;
let debounce;

function readOptions() {
  const cfg = vscode.workspace.getConfiguration(SECTION);
  const raw = {};
  for (const key of KEYS) raw[key] = cfg.get(key);
  return gen.normalizeOptions(raw);
}

/** Escribe el archivo del tema. Devuelve true si cambió. */
function writeThemes(context) {
  const file = path.join(context.extensionPath, 'themes', gen.THEME.file);
  const content = JSON.stringify(gen.buildTheme(readOptions()), null, 2) + '\n';
  let current = '';
  try { current = fs.readFileSync(file, 'utf8'); } catch (_) { /* archivo nuevo */ }
  if (current === content) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

function safeWrite(context) {
  try {
    return writeThemes(context);
  } catch (err) {
    vscode.window.showErrorMessage('Prisma-Tech: no se pudo actualizar el tema. ' + err.message);
    return false;
  }
}

function isPrismaActive() {
  return vscode.workspace.getConfiguration('workbench').get('colorTheme') === gen.THEME.name;
}

/*
 * Aplicar sin recargar: VS Code solo lee el archivo del tema al cargar la ventana, así que los
 * cambios se aplican con personalizaciones limitadas a "[Prisma-Tech]" en los Ajustes globales.
 * Al iniciar, el archivo ya está al día y esas personalizaciones se quitan.
 */
const LIVE_SCOPE = '[' + gen.THEME.name + ']';
const LIVE_SETTINGS = [
  ['workbench', 'colorCustomizations', (theme) => theme.colors],
  ['editor', 'tokenColorCustomizations', (theme) => ({ textMateRules: theme.tokenColors })],
  ['editor', 'semanticTokenColorCustomizations', (theme) => ({ enabled: true, rules: theme.semanticTokenColors })]
];

async function applyLive(options) {
  clearTimeout(liveTimer);
  const theme = gen.buildTheme(options);
  for (const [section, key, pick] of LIVE_SETTINGS) {
    const cfg = vscode.workspace.getConfiguration(section);
    const current = cfg.inspect(key).globalValue || {};
    await cfg.update(key, { ...current, [LIVE_SCOPE]: pick(theme) }, vscode.ConfigurationTarget.Global);
  }
  liveApplied = true;
}

async function clearLive() {
  clearTimeout(liveTimer);
  for (const [section, key] of LIVE_SETTINGS) {
    const cfg = vscode.workspace.getConfiguration(section);
    const current = cfg.inspect(key).globalValue;
    if (!current || !(LIVE_SCOPE in current)) continue;
    const { [LIVE_SCOPE]: _, ...rest } = current;
    await cfg.update(key, Object.keys(rest).length ? rest : undefined, vscode.ConfigurationTarget.Global);
  }
  liveApplied = false;
}

function reportLiveError(err) {
  vscode.window.showErrorMessage('Prisma-Tech: no se pudieron aplicar los colores. ' + err.message);
}

/** Aplica en vivo lo que se está editando (con una pequeña espera para no escribir en cada tecla). */
function scheduleLive(options) {
  if (!isPrismaActive()) return;
  const same = JSON.stringify(gen.normalizeOptions(options)) === JSON.stringify(readOptions());
  if (same && !liveApplied) return;
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => applyLive(options).catch(reportLiveError), 300);
}

/** Al salir del personalizador sin guardar, vuelve a los colores guardados. */
function revertUnsaved() {
  const unsaved = lastPreview && JSON.stringify(gen.normalizeOptions(lastPreview)) !== JSON.stringify(readOptions());
  lastPreview = undefined;
  if (unsaved && liveApplied) applyLive(readOptions()).catch(reportLiveError);
  else clearTimeout(liveTimer);
  // Los controles vuelven a mostrar lo guardado.
  if (unsaved) postInit();
}

async function applyFromSettings(context) {
  if (safeWrite(context) && isPrismaActive()) await applyLive(readOptions());
}

/** Guarda en Ajustes solo lo que difiere de los valores por defecto. */
async function saveOptions(raw) {
  const cfg = vscode.workspace.getConfiguration(SECTION);
  const target = vscode.ConfigurationTarget.Global;
  const o = gen.normalizeOptions(raw);
  const d = gen.DEFAULTS;

  for (const key of ['accentColor', 'background', 'italicComments', 'italicKeywords', 'italicParameters', 'brightText']) {
    await cfg.update(key, o[key] === d[key] ? undefined : o[key], target);
  }
  const syntax = {};
  for (const key of Object.keys(d.syntax)) {
    if (o.syntax[key] !== d.syntax[key]) syntax[key] = o.syntax[key];
  }
  await cfg.update('syntax', Object.keys(syntax).length ? syntax : undefined, target);
}

async function resetOptions() {
  const cfg = vscode.workspace.getConfiguration(SECTION);
  for (const key of KEYS) await cfg.update(key, undefined, vscode.ConfigurationTarget.Global);
}

/** Webviews abiertos con el personalizador: el panel del editor y la vista de la barra lateral. */
const webviews = new Set();

function postInit() {
  const msg = {
    type: 'init',
    options: readOptions(),
    defaults: gen.normalizeOptions(gen.DEFAULTS),
    labels: gen.SYNTAX_LABELS,
    text: gen.TEXT,
    titleGlow: vscode.workspace.getConfiguration(SECTION).get('titleGlow', true)
  };
  for (const webview of webviews) webview.postMessage(msg);
}

/** Carga el personalizador en un webview y atiende sus mensajes. */
function attachCustomizer(webview, context, mode = 'full') {
  webview.options = { enableScripts: true };
  const nonce = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
  webview.html = getCustomizerHtml(webview, nonce, mode);
  webviews.add(webview);

  webview.onDidReceiveMessage(async (msg) => {
    switch (msg.type) {
      case 'ready':
        postInit();
        if (mode === 'preview' && lastPreview) webview.postMessage({ type: 'preview', state: lastPreview });
        break;

      case 'preview':
        lastPreview = msg.state;
        if (previewPanel) previewPanel.webview.postMessage({ type: 'preview', state: lastPreview });
        scheduleLive(lastPreview);
        break;

      case 'focus':
        // Clic en la vista previa del editor: la barra lateral salta al color.
        if (sidebarWebview) sidebarWebview.postMessage(msg);
        break;

      case 'save': {
        await saveOptions(msg.options);
        clearTimeout(debounce);
        safeWrite(context);
        if (isPrismaActive()) await applyLive(readOptions()).catch(reportLiveError);
        webview.postMessage({ type: 'saved' });
        if (!isPrismaActive()) {
          const pick = await vscode.window.showInformationMessage(
            'Cambios guardados. ¿Quieres activar Prisma-Tech ahora?',
            'Activar'
          );
          if (pick) {
            await vscode.workspace.getConfiguration('workbench')
              .update('colorTheme', gen.THEME.name, vscode.ConfigurationTarget.Global);
          }
        }
        break;
      }

      case 'reset': {
        const ok = await vscode.window.showWarningMessage(
          '¿Restablecer Prisma-Tech a sus colores originales?',
          { modal: true },
          'Restablecer'
        );
        if (ok) {
          await resetOptions();
          clearTimeout(debounce);
          safeWrite(context);
          if (isPrismaActive()) await applyLive(readOptions()).catch(reportLiveError);
          postInit();
        }
        break;
      }

      case 'titleGlow':
        await vscode.workspace.getConfiguration(SECTION).update('titleGlow', !!msg.value, vscode.ConfigurationTarget.Global);
        break;

      case 'openSettings':
        vscode.commands.executeCommand('workbench.action.openSettings', SECTION);
        break;
    }
  }, undefined, context.subscriptions);
}

function openCustomizer(context) {
  if (panel) {
    panel.reveal();
    return;
  }
  panel = vscode.window.createWebviewPanel(
    'prismaTechCustomizer',
    'Personalizar Prisma-Tech',
    vscode.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: true }
  );
  const webview = panel.webview;
  attachCustomizer(webview, context);
  panel.onDidDispose(() => { webviews.delete(webview); panel = undefined; revertUnsaved(); }, undefined, context.subscriptions);
}

/** Vista previa a tamaño completo en el editor, mientras la sección Prisma-Tech está abierta. */
function openPreview(context) {
  if (previewPanel) return;
  previewPanel = vscode.window.createWebviewPanel(
    'prismaTechPreview',
    'Vista previa · Prisma-Tech',
    { viewColumn: vscode.ViewColumn.Active, preserveFocus: true },
    { enableScripts: true, retainContextWhenHidden: true }
  );
  const webview = previewPanel.webview;
  attachCustomizer(webview, context, 'preview');
  previewPanel.onDidDispose(() => { webviews.delete(webview); previewPanel = undefined; }, undefined, context.subscriptions);
}

function closePreview() {
  if (previewPanel) previewPanel.dispose();
}

/**
 * Migración: antes existía "Prisma-Tech Bright" como tema aparte.
 * Si estaba activo, se cambia a Prisma-Tech con la opción de texto brillante.
 */
async function migrateBrightVariant() {
  const workbench = vscode.workspace.getConfiguration('workbench');
  if (workbench.get('colorTheme') !== OLD_BRIGHT_NAME) return false;
  await vscode.workspace.getConfiguration(SECTION).update('brightText', true, vscode.ConfigurationTarget.Global);
  await workbench.update('colorTheme', gen.THEME.name, vscode.ConfigurationTarget.Global);
  return true;
}

async function activate(context) {
  // Limpia el archivo del antiguo tema Bright si quedó en la carpeta.
  try { fs.unlinkSync(path.join(context.extensionPath, 'themes', 'prisma-tech-bright-color-theme.json')); } catch (_) { /* no existe */ }

  const migrated = await migrateBrightVariant();
  clearTimeout(debounce);

  // Sincroniza el archivo del tema con los Ajustes actuales. Si no cambió, la ventana ya lo cargó
  // al día y sobran las personalizaciones en vivo de la sesión anterior.
  const changed = safeWrite(context);
  if (migrated) { /* el cambio de tema recarga los colores */ }
  else if (changed && isPrismaActive()) applyLive(readOptions()).catch(reportLiveError);
  else clearLive().catch(reportLiveError);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      // Solo los ajustes de colores regeneran el tema (titleGlow es del panel).
      if (!KEYS.some((key) => e.affectsConfiguration(SECTION + '.' + key))) return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        applyFromSettings(context);
        postInit();
      }, 400);
    }),

    vscode.commands.registerCommand('prismaTech.customize', () => openCustomizer(context)),

    // Sección "Prisma-Tech" de la barra de actividad con el mismo personalizador.
    vscode.window.registerWebviewViewProvider(VIEW_ID, {
      resolveWebviewView(view) {
        const webview = view.webview;
        sidebarWebview = webview;
        attachCustomizer(webview, context, 'controls');
        // Abrir la sección muestra la vista previa en el editor; cerrarla la quita
        // y descarta lo que no se haya guardado.
        if (view.visible) openPreview(context);
        view.onDidChangeVisibility(() => {
          if (view.visible) return openPreview(context);
          closePreview();
          revertUnsaved();
        });
        view.onDidDispose(() => { webviews.delete(webview); sidebarWebview = undefined; closePreview(); revertUnsaved(); });
      }
    }, { webviewOptions: { retainContextWhenHidden: true } }),

    vscode.commands.registerCommand('prismaTech.reset', async () => {
      const ok = await vscode.window.showWarningMessage(
        '¿Restablecer Prisma-Tech a sus colores originales?',
        { modal: true },
        'Restablecer'
      );
      if (ok) await resetOptions();
    }),

    vscode.commands.registerCommand('prismaTech.openSettings', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', SECTION)
    )
  );
}

function deactivate() {
  clearTimeout(debounce);
  closePreview();
}

module.exports = { activate, deactivate };
