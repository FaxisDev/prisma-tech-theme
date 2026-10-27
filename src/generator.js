'use strict';

/**
 * Generador del tema Prisma-Tech.
 * Toma las opciones de personalización y construye el JSON del tema.
 */

const DEFAULTS = Object.freeze({
  accentColor: '#61FFCA',
  background: '#1B2126',
  italicComments: true,
  italicKeywords: true,
  italicParameters: true,
  brightText: false,
  syntax: Object.freeze({
    comment: '#5C6B75',
    string: '#61FFCA',
    keyword: '#ACA0FF',
    storage: '#C8B9FF',
    function: '#6E9CFF',
    property: '#5CDFFF',
    type: '#FFD23F',
    parameter: '#FFB86C',
    number: '#FF9A3C',
    constant: '#F77BFF',
    tag: '#FF5370',
    operator: '#5ED3FF',
    self: '#FF4D5E'
  })
});

const SYNTAX_LABELS = Object.freeze({
  comment: 'Comentarios',
  string: 'Strings',
  keyword: 'Keywords (if, return, import)',
  storage: 'Storage (const, class, function)',
  function: 'Funciones y métodos',
  property: 'Propiedades',
  type: 'Clases y tipos',
  parameter: 'Parámetros',
  number: 'Números',
  constant: 'Constantes y booleanos',
  tag: 'Tags HTML / JSX',
  operator: 'Operadores',
  self: 'this / self / super'
});

const THEME = Object.freeze({ name: 'Prisma-Tech', file: 'prisma-tech-color-theme.json' });

// Tonos de texto: suave por defecto, o brillante si "brightText" está activo.
const TEXT = Object.freeze({
  // Blancos mezclados con azul cielo (#87CEEB).
  soft: Object.freeze({ fg: '#C7E2EF', fgDim: '#8FA8B6', variable: '#DBF0F9' }),
  bright: Object.freeze({ fg: '#E1F3FA', fgDim: '#A9C2CF', variable: '#EDF8FC' })
});

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function normHex(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const m = value.trim().match(HEX);
  if (!m) return fallback;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return '#' + h.toUpperCase();
}

function toRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a, b, t) {
  const x = toRgb(a);
  const y = toRgb(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function normalizeOptions(raw) {
  raw = raw || {};
  const s = raw.syntax || {};
  const syntax = {};
  for (const key of Object.keys(DEFAULTS.syntax)) syntax[key] = normHex(s[key], DEFAULTS.syntax[key]);
  const bool = (v, d) => (typeof v === 'boolean' ? v : d);
  return {
    accentColor: normHex(raw.accentColor, DEFAULTS.accentColor),
    background: normHex(raw.background, DEFAULTS.background),
    italicComments: bool(raw.italicComments, DEFAULTS.italicComments),
    italicKeywords: bool(raw.italicKeywords, DEFAULTS.italicKeywords),
    italicParameters: bool(raw.italicParameters, DEFAULTS.italicParameters),
    brightText: bool(raw.brightText, DEFAULTS.brightText),
    syntax
  };
}

function buildTheme(options) {
  const o = normalizeOptions(options);
  const text = o.brightText ? TEXT.bright : TEXT.soft;
  const s = o.syntax;
  const g = o.accentColor;
  const bg = o.background;
  const c = {
    bg,
    bgDark: mix(bg, '#000000', 0.2),
    bgDarker: mix(bg, '#000000', 0.34),
    bgLight: mix(bg, '#FFFFFF', 0.04),
    bgLighter: mix(bg, '#FFFFFF', 0.09),
    // Apenas más claro que el fondo: los bordes se notan muy suavemente sin cortar.
    border: mix(bg, '#FFFFFF', 0.03),
    borderLight: mix(bg, '#FFFFFF', 0.09),
    lineNumber: mix(bg, '#FFFFFF', 0.17),
    // Iconos no seleccionados de la barra de actividad: pasivos, con el mismo tono del fondo.
    iconOff: mix(bg, text.fgDim, 0.35),
    guide: mix(bg, '#FFFFFF', 0.05),
    guideActive: mix(bg, '#FFFFFF', 0.17),
    whitespace: mix(bg, '#FFFFFF', 0.08),
    fg: text.fg,
    fgDim: text.fgDim,
    variable: text.variable,
    muted: mix(bg, text.fg, 0.4),
    red: '#FF4D5E',
    orange: '#FFA94D',
    // Verde pino para las clases de CSS/SCSS: más profundo que el verde aura.
    pine: '#4AEB9E'
  };
  const italic = (on) => (on ? 'italic' : '');

  const colors = {
    focusBorder: g + '80', foreground: c.fg, descriptionForeground: c.fgDim,
    errorForeground: c.red, 'selection.background': g + '40', 'widget.shadow': '#00000066',
    'icon.foreground': c.fgDim, 'textLink.foreground': g, 'textLink.activeForeground': s.property,
    'button.background': g, 'button.foreground': c.bgDarker, 'button.hoverBackground': mix(g, '#000000', 0.12),
    'button.secondaryBackground': c.bgLighter, 'button.secondaryForeground': c.fg,
    'button.secondaryHoverBackground': mix(c.bgLighter, '#FFFFFF', 0.06),
    'widget.border': c.borderLight, 'toolbar.hoverBackground': c.bgLighter,
    'badge.background': g, 'badge.foreground': c.bgDarker,
    'progressBar.background': g, 'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': c.muted + '33', 'scrollbarSlider.hoverBackground': c.muted + '55',
    'scrollbarSlider.activeBackground': g + '55',
    'input.background': c.bgDark, 'input.border': c.borderLight, 'input.foreground': c.fg,
    'input.placeholderForeground': c.muted, 'inputOption.activeBorder': g, 'inputOption.activeBackground': g + '26',
    'dropdown.background': c.bgDark, 'dropdown.border': c.borderLight, 'dropdown.foreground': c.fg,
    'checkbox.background': c.bgDark, 'checkbox.border': c.borderLight,
    'activityBar.background': c.bgDark, 'activityBar.foreground': g, 'activityBar.inactiveForeground': c.iconOff,
    'activityBarTop.foreground': g, 'activityBarTop.inactiveForeground': c.iconOff, 'activityBarTop.activeBorder': g,
    // Interfaz moderna de VS Code: estas claves mandan sobre activityBar.* en el icono seleccionado.
    'modernActivityBarItem.activeForeground': g, 'modernActivityBarItem.activeBackground': c.bgLight,
    'modernActivityBarItem.hoverForeground': c.fgDim, 'modernActivityBarItem.hoverBackground': c.bg,
    'modernActivityBar.border': c.border, 'modernPanel.border': c.border,
    // Divisiones entre secciones (Explorador, Control de código, paneles): sin esto VS Code usa un gris claro.
    'surface.border': c.border, 'editor.border': c.border, 'sideBarActivityBarTop.border': c.border,
    'panelSection.border': c.border, 'panelSectionHeader.border': c.border, 'sideBarTitle.border': c.border,
    'sideBarStickyScroll.border': c.border, 'panelStickyScroll.border': c.border, 'editorGroupHeader.border': c.border,
    'activityBar.border': c.border, 'activityBar.activeBorder': g,
    'activityBarBadge.background': g, 'activityBarBadge.foreground': c.bgDarker,
    'panelTitleBadge.background': g, 'panelTitleBadge.foreground': c.bgDarker,
    'sideBar.background': c.bgDark, 'sideBar.foreground': c.fgDim, 'sideBar.border': c.border,
    'sideBarTitle.foreground': c.fg, 'sideBarSectionHeader.background': c.bgDark,
    'sideBarSectionHeader.foreground': c.fg, 'sideBarSectionHeader.border': c.border,
    'list.activeSelectionBackground': g + '1F', 'list.activeSelectionForeground': g,
    'list.inactiveSelectionBackground': c.bgLight, 'list.inactiveSelectionForeground': c.fg,
    'list.hoverBackground': c.bgLight, 'list.hoverForeground': c.fg, 'list.focusOutline': g + '60',
    'list.highlightForeground': g, 'list.errorForeground': c.red, 'list.warningForeground': c.orange,
    'tree.indentGuidesStroke': c.borderLight,
    'editorGroup.border': c.border, 'editorGroupHeader.tabsBackground': c.bgDark,
    'editorGroupHeader.tabsBorder': c.border, 'editorGroup.dropBackground': g + '1A',
    'tab.activeBackground': c.bg, 'tab.activeForeground': c.fg, 'tab.activeBorderTop': g,
    'tab.inactiveBackground': c.bgDark, 'tab.inactiveForeground': c.muted, 'tab.border': c.border,
    'tab.hoverBackground': c.bgLight, 'tab.unfocusedActiveBorderTop': g + '60',
    'tab.activeModifiedBorder': c.orange,
    'breadcrumb.foreground': c.muted, 'breadcrumb.focusForeground': c.fg,
    'breadcrumb.activeSelectionForeground': g, 'breadcrumbPicker.background': c.bgDark,
    'editor.background': c.bg, 'editor.foreground': c.fg,
    'editorLineNumber.foreground': c.lineNumber, 'editorLineNumber.activeForeground': g,
    'editorCursor.foreground': g, 'editor.selectionBackground': g + '2E',
    'editor.inactiveSelectionBackground': g + '17', 'editor.selectionHighlightBackground': s.keyword + '26',
    'editor.wordHighlightBackground': s.property + '1F', 'editor.wordHighlightStrongBackground': s.keyword + '2E',
    'editor.findMatchBackground': c.orange + '40', 'editor.findMatchBorder': c.orange,
    'editor.findMatchHighlightBackground': c.orange + '1F', 'editor.lineHighlightBackground': c.bgLight + '99',
    'editor.lineHighlightBorder': '#00000000', 'editor.rangeHighlightBackground': g + '0D',
    'editorWhitespace.foreground': c.whitespace, 'editorIndentGuide.background1': c.guide,
    'editorIndentGuide.activeBackground1': c.guideActive, 'editorRuler.foreground': c.guide,
    'editorBracketMatch.background': g + '1A', 'editorBracketMatch.border': g + '80',
    'editorBracketHighlight.foreground1': s.keyword, 'editorBracketHighlight.foreground2': g,
    'editorBracketHighlight.foreground3': s.property, 'editorBracketHighlight.foreground4': s.parameter,
    'editorBracketHighlight.foreground5': s.constant, 'editorBracketHighlight.foreground6': s.type,
    'editorBracketHighlight.unexpectedBracket.foreground': c.red,
    'editorError.foreground': c.red, 'editorWarning.foreground': c.orange, 'editorInfo.foreground': s.property,
    'editorHint.foreground': g, 'editorCodeLens.foreground': c.muted, 'editorLink.activeForeground': g,
    'editorGutter.addedBackground': g + 'B3', 'editorGutter.modifiedBackground': s.function + 'B3',
    'editorGutter.deletedBackground': c.red + 'B3',
    'editorOverviewRuler.border': c.border, 'editorOverviewRuler.findMatchForeground': c.orange + 'AA',
    'editorOverviewRuler.errorForeground': c.red, 'editorOverviewRuler.warningForeground': c.orange,
    'editorOverviewRuler.addedForeground': g + '99', 'editorOverviewRuler.modifiedForeground': s.function + '99',
    'editorOverviewRuler.deletedForeground': c.red + '99',
    'editorWidget.background': c.bgDark, 'editorWidget.border': c.borderLight,
    'editorSuggestWidget.background': c.bgDark, 'editorSuggestWidget.border': c.borderLight,
    'editorSuggestWidget.selectedBackground': g + '1F', 'editorSuggestWidget.highlightForeground': g,
    'editorSuggestWidget.foreground': c.fg, 'editorHoverWidget.background': c.bgDark,
    'editorHoverWidget.border': c.borderLight, 'peekView.border': g,
    'peekViewEditor.background': c.bgDark, 'peekViewResult.background': c.bgDarker,
    'peekViewTitle.background': c.bgDarker, 'peekViewEditor.matchHighlightBackground': c.orange + '40',
    'peekViewResult.matchHighlightBackground': c.orange + '40', 'peekViewResult.selectionBackground': g + '1F',
    'minimap.background': c.bg, 'minimap.selectionHighlight': g + '55', 'minimapSlider.background': c.muted + '22',
    'diffEditor.insertedTextBackground': g + '1A', 'diffEditor.removedTextBackground': c.red + '1A',
    'panel.background': c.bgDark, 'panel.border': c.border,
    'panelTitle.activeForeground': c.fg, 'panelTitle.activeBorder': g, 'panelTitle.inactiveForeground': c.muted,
    'statusBar.background': c.bgDark, 'statusBar.foreground': c.fgDim, 'statusBar.border': c.border,
    'statusBar.debuggingBackground': s.keyword, 'statusBar.debuggingForeground': '#FFFFFF',
    'statusBar.noFolderBackground': c.bgDark, 'statusBarItem.hoverBackground': c.bgLight,
    'statusBarItem.remoteBackground': g, 'statusBarItem.remoteForeground': c.bgDarker,
    'statusBarItem.prominentBackground': c.bgLight,
    'titleBar.activeBackground': c.bgDark, 'titleBar.activeForeground': c.fg,
    'titleBar.inactiveBackground': c.bgDark, 'titleBar.inactiveForeground': c.muted, 'titleBar.border': c.border,
    'menu.background': c.bgDark, 'menu.foreground': c.fg, 'menu.selectionBackground': g + '1F',
    'menu.selectionForeground': g, 'menu.separatorBackground': c.borderLight, 'menu.border': c.borderLight,
    'quickInput.background': c.bgDark, 'quickInputList.focusBackground': g + '1F',
    'quickInputList.focusForeground': g, 'pickerGroup.foreground': g, 'pickerGroup.border': c.borderLight,
    'keybindingLabel.background': c.bgLight, 'keybindingLabel.foreground': c.fg,
    'keybindingLabel.border': c.borderLight, 'keybindingLabel.bottomBorder': c.border,
    'notifications.background': c.bgDark, 'notifications.border': c.borderLight,
    'notificationCenterHeader.background': c.bgDarker, 'notificationLink.foreground': g,
    'terminal.background': c.bgDark, 'terminal.foreground': c.fg, 'terminalCursor.foreground': g,
    'terminal.selectionBackground': g + '33',
    'terminal.ansiBlack': c.bgDarker, 'terminal.ansiRed': c.red, 'terminal.ansiGreen': g,
    'terminal.ansiYellow': c.orange, 'terminal.ansiBlue': s.function, 'terminal.ansiMagenta': s.keyword,
    'terminal.ansiCyan': s.property, 'terminal.ansiWhite': c.fg,
    'terminal.ansiBrightBlack': c.muted, 'terminal.ansiBrightRed': mix(c.red, '#FFFFFF', 0.25),
    'terminal.ansiBrightGreen': mix(g, '#FFFFFF', 0.3), 'terminal.ansiBrightYellow': s.type,
    'terminal.ansiBrightBlue': mix(s.function, '#FFFFFF', 0.25), 'terminal.ansiBrightMagenta': s.constant,
    'terminal.ansiBrightCyan': s.operator, 'terminal.ansiBrightWhite': c.variable,
    'gitDecoration.addedResourceForeground': g, 'gitDecoration.modifiedResourceForeground': c.orange,
    'gitDecoration.deletedResourceForeground': c.red, 'gitDecoration.untrackedResourceForeground': s.property,
    'gitDecoration.ignoredResourceForeground': c.lineNumber, 'gitDecoration.conflictingResourceForeground': s.constant,
    'debugToolBar.background': c.bgDark, 'welcomePage.tileBackground': c.bgDark,
    'settings.headerForeground': g, 'settings.modifiedItemIndicator': c.orange,
    'textBlockQuote.background': c.bgDark, 'textBlockQuote.border': g, 'textCodeBlock.background': c.bgDark,
    'textPreformat.foreground': c.orange,
    // Colores que usan las vistas web de otras extensiones (p. ej. NPM Visual Manager) para estados y gráficos.
    'testing.iconPassed': g, 'testing.iconFailed': c.red, 'testing.iconQueued': c.orange,
    'charts.foreground': c.fg, 'charts.lines': c.borderLight, 'charts.green': g, 'charts.red': c.red,
    'charts.blue': s.function, 'charts.yellow': s.type, 'charts.orange': c.orange, 'charts.purple': s.keyword,
    'editorWarning.background': c.orange + '1A', 'editorHoverWidget.foreground': c.fg,
    'symbolIcon.packageForeground': c.orange
  };

  const t = (scope, foreground, fontStyle) => {
    const settings = {};
    if (foreground) settings.foreground = foreground;
    if (fontStyle !== undefined) settings.fontStyle = fontStyle;
    return { scope, settings };
  };

  const tokenColors = [
    t(['comment', 'punctuation.definition.comment'], s.comment, italic(o.italicComments)),
    t(['string', 'string.quoted', 'string.template'], s.string),
    t(['constant.character.escape', 'string.regexp'], s.operator),
    t(['punctuation.definition.template-expression', 'punctuation.section.embedded'], s.constant),
    t(['constant.numeric'], s.number),
    t(['constant.language', 'constant.language.boolean', 'constant.language.null'], s.constant),
    t(['constant.other', 'variable.other.constant', 'variable.other.enummember'], s.constant),
    t(['keyword', 'keyword.control', 'storage.modifier'], s.keyword),
    t(['keyword.control.flow', 'keyword.control.import', 'keyword.control.export', 'keyword.control.from'], s.keyword, italic(o.italicKeywords)),
    t(['storage.type', 'storage'], s.storage),
    t(['keyword.operator', 'punctuation.separator.key-value', 'storage.type.function.arrow'], s.operator),
    t(['keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python'], s.keyword),
    t(['variable', 'variable.other.readwrite'], c.variable),
    t(['variable.parameter', 'meta.parameter'], s.parameter, italic(o.italicParameters)),
    t(['variable.language', 'variable.language.this', 'variable.language.self', 'variable.language.super'], s.self, italic(o.italicKeywords)),
    t(['entity.name.function', 'meta.function-call', 'support.function', 'variable.function'], s.function),
    t(['entity.name.type', 'entity.name.class', 'support.class', 'support.type', 'entity.other.inherited-class'], s.type),
    t(['entity.name.type.interface', 'entity.name.type.alias'], s.type, 'italic'),
    t(['variable.other.property', 'variable.other.object.property', 'meta.object-literal.key', 'support.type.property-name'], s.property),
    t(['variable.other.object'], c.variable),
    t(['entity.name.tag', 'meta.tag.sgml'], s.tag),
    t(['support.class.component', 'entity.name.tag.tsx', 'entity.name.tag.jsx'], s.type),
    t(['entity.other.attribute-name'], s.storage, 'italic'),
    t(['punctuation.definition.tag'], s.operator),
    t(['entity.other.attribute-name.class.css', 'entity.other.attribute-name.class.scss', 'entity.other.attribute-name.class.less'], c.pine),
    t(['entity.other.attribute-name.id.css'], s.parameter),
    // Variables de CSS/SCSS (--mi-var, $mi-var): blanco con toque azul cielo.
    t(['variable.css', 'variable.argument.css', 'support.type.custom-property', 'variable.scss', 'variable.other.less'], mix(c.variable, '#87CEEB', 0.35)),
    t(['support.type.property-name.css'], s.property),
    t(['support.constant.property-value.css', 'keyword.other.unit'], s.number),
    // Morado más claro en CSS/SCSS: etiquetas (span), :host, ::before, @media, @include.
    t(['entity.name.tag.css', 'entity.name.tag.scss', 'entity.other.attribute-name.pseudo-class.css',
      'entity.other.attribute-name.pseudo-element.css', 'keyword.control.at-rule.css', 'keyword.control.at-rule.scss',
      'keyword.control.at-rule.media.scss', 'keyword.control.at-rule.include.scss', 'keyword.control.at-rule.use.scss'], mix(s.keyword, '#FFFFFF', 0.3)),
    t(['support.type.property-name.json'], s.property),
    t(['entity.name.decorator', 'meta.decorator', 'punctuation.decorator'], s.constant, 'italic'),
    t(['entity.name.namespace', 'entity.name.module'], s.type),
    t(['punctuation', 'meta.brace', 'punctuation.terminator', 'punctuation.separator'], c.fgDim),
    t(['markup.heading', 'entity.name.section.markdown'], g, 'bold'),
    t(['markup.bold'], c.orange, 'bold'),
    t(['markup.italic'], s.constant, 'italic'),
    t(['markup.inline.raw', 'markup.fenced_code.block'], c.orange),
    t(['markup.underline.link', 'string.other.link'], s.property),
    t(['markup.quote'], c.muted, 'italic'),
    t(['markup.list', 'punctuation.definition.list'], s.keyword),
    t(['markup.inserted'], g),
    t(['markup.deleted'], c.red),
    t(['markup.changed'], c.orange),
    t(['invalid', 'invalid.illegal'], c.red)
  ];

  const semanticTokenColors = {
    variable: c.variable,
    parameter: { foreground: s.parameter, italic: o.italicParameters },
    property: s.property,
    function: s.function,
    method: s.function,
    class: s.type,
    interface: { foreground: s.type, italic: true },
    type: s.type,
    enumMember: s.constant,
    namespace: s.type,
    'variable.readonly': s.constant,
    decorator: s.constant,
    selfKeyword: s.self
  };

  return {
    $schema: 'vscode://schemas/color-theme',
    name: THEME.name,
    type: 'dark',
    semanticHighlighting: true,
    colors,
    tokenColors,
    semanticTokenColors
  };
}

module.exports = { DEFAULTS, SYNTAX_LABELS, THEME, TEXT, normalizeOptions, buildTheme, mix };
