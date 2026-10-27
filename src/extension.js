'use strict';

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const gen = require('./generator');
const { getCustomizerHtml } = require('./customizer');

const SECTION = 'prismaTech';
const KEYS = ['accentColor', 'background', 'italicComments', 'italicKeywords', 'italicParameters', 'brightText', 'syntax'];
const OLD_BRIGHT_NAME = 'Prisma-Tech Bright';

let panel;
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

async function promptReload() {
  const pick = await vscode.window.showInformationMessage(
    'Prisma-Tech se actualizó. Recarga la ventana para ver los cambios.',
    'Recargar'
  );
  if (pick === 'Recargar') vscode.commands.executeCommand('workbench.action.reloadWindow');
}

async function applyFromSettings(context) {
  if (safeWrite(context) && isPrismaActive()) await promptReload();
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

function postInit() {
  if (!panel) return;
  panel.webview.postMessage({
    type: 'init',
    options: readOptions(),
    defaults: gen.normalizeOptions(gen.DEFAULTS),
    labels: gen.SYNTAX_LABELS,
    text: gen.TEXT
  });
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

  const nonce = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
  panel.webview.html = getCustomizerHtml(panel.webview, nonce);

  panel.webview.onDidReceiveMessage(async (msg) => {
    switch (msg.type) {
      case 'ready':
        postInit();
        break;

      case 'save': {
        await saveOptions(msg.options);
        clearTimeout(debounce);
        const changed = safeWrite(context);
        panel && panel.webview.postMessage({ type: 'saved' });
        if (!isPrismaActive()) {
          const pick = await vscode.window.showInformationMessage(
            'Cambios guardados. ¿Quieres activar Prisma-Tech ahora?',
            'Activar'
          );
          if (pick) {
            await vscode.workspace.getConfiguration('workbench')
              .update('colorTheme', gen.THEME.name, vscode.ConfigurationTarget.Global);
          }
        } else if (changed) {
          await promptReload();
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
          const changed = safeWrite(context);
          postInit();
          if (changed && isPrismaActive()) await promptReload();
        }
        break;
      }

      case 'openSettings':
        vscode.commands.executeCommand('workbench.action.openSettings', SECTION);
        break;
    }
  }, undefined, context.subscriptions);

  panel.onDidDispose(() => { panel = undefined; }, undefined, context.subscriptions);
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

  // Sincroniza el archivo del tema con los Ajustes actuales.
  if (migrated) safeWrite(context);
  else applyFromSettings(context);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration(SECTION)) return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        applyFromSettings(context);
        postInit();
      }, 400);
    }),

    vscode.commands.registerCommand('prismaTech.customize', () => openCustomizer(context)),

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
}

module.exports = { activate, deactivate };
