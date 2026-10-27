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
    string: '#CCFF4D',
    keyword: '#ACA0FF',
    storage: '#C8B9FF',
    function: '#6E9CFF',
    property: '#5CDFFF',
    objectKey: '#FF6EB6',
    type: '#FFD21F',
    classReference: '#C4EAFF',
    injected: '#9AD1FF',
    parameter: '#C4EAFF',
    number: '#CCFF4D',
    constant: '#F77BFF',
    boolean: '#3BA9F5',
    constVariable: '#FF3B4E',
    tag: '#FF5370',
    operator: '#5ED3FF',
    self: '#FFD21F'
  })
});

const SYNTAX_LABELS = Object.freeze({
  comment: 'Comentarios',
  string: 'Strings',
  keyword: 'Keywords (if, return, import)',
  storage: 'Storage (const, class, function)',
  function: 'Funciones y métodos',
  property: 'Propiedades',
  objectKey: 'Claves de objetos (severity:, detail:)',
  type: 'Clases y tipos',
  classReference: 'Clases usadas (imports: [...], new X)',
  injected: 'Servicios inyectados (http, messageService)',
  parameter: 'Parámetros',
  number: 'Números',
  constant: 'Constantes (null, undefined, enums)',
  boolean: 'Booleanos (true, false)',
  constVariable: 'Variables const',
  tag: 'Tags HTML / JSX',
  operator: 'Operadores',
  self: 'this / self / super'
});

const THEME = Object.freeze({ name: 'Prisma-Tech', file: 'prisma-tech-color-theme.json' });

// Tonos de texto: suave por defecto, o brillante si "brightText" está activo.
const TEXT = Object.freeze({
  // Todos los blancos usan el mismo azul cielo muy claro (#C4EAFF); el modo brillante, una versión más clara.
  soft: Object.freeze({ fg: '#C4EAFF', fgDim: '#8FA8B6', variable: '#C4EAFF' }),
  bright: Object.freeze({ fg: '#DCF2FF', fgDim: '#A9C2CF', variable: '#DCF2FF' })
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
    // Bordes de ventanas emergentes, buscador y campos: el azul cielo del texto apagado (antes, gris neutro).
    borderLight: mix(bg, text.fg, 0.14),
    // Números de línea: el azul cielo del texto, apagado hacia el fondo para que combine.
    lineNumber: mix(bg, text.fg, 0.22),
    // Iconos no seleccionados de la barra de actividad: pasivos, con el mismo tono del fondo.
    iconOff: mix(bg, text.fgDim, 0.35),
    guide: mix(bg, '#FFFFFF', 0.05),
    guideActive: mix(bg, '#FFFFFF', 0.17),
    whitespace: mix(bg, '#FFFFFF', 0.08),
    fg: text.fg,
    fgDim: text.fgDim,
    variable: text.variable,
    muted: mix(bg, text.fg, 0.4),
    blame: mix(bg, text.fg, 0.3),
    red: '#FF4D5E',
    orange: '#FFA94D',
    // Azul mar para las clases de CSS/SCSS (.invade-panel).
    cssClass: '#3BA9F5',
    // Declaración de variables en CSS/SCSS (--interface-green:, $accent:): azul cielo claro.
    cssVarDecl: '#87CEFA',
    // Selectores de etiqueta y pseudoclases en CSS/SCSS: rojo cereza intenso.
    cssSelector: '#FF2D5C',
    // Colores hexadecimales (#61FFCA): entre azul cielo y blanco.
    hexColor: mix('#87CEEB', '#FFFFFF', 0.35),
    // Naranja intenso para const/let/var y constructor.
    declare: '#FF9100'
  };
  const italic = (on) => (on ? 'italic' : '');

  const colors = {
    focusBorder: g + '80', foreground: c.fg, descriptionForeground: c.fgDim,
    errorForeground: c.red, 'selection.background': g + '40', 'widget.shadow': '#00000066',
    'icon.foreground': c.fgDim, 'textLink.foreground': g, 'textLink.activeForeground': s.property,
    'button.background': g, 'button.foreground': c.bgDarker, 'button.hoverBackground': mix(g, '#000000', 0.12),
    // Botones secundarios: el azul cielo del texto mezclado con el fondo (antes, gris neutro).
    'button.secondaryBackground': mix(bg, c.fg, 0.13), 'button.secondaryForeground': c.fg,
    'button.secondaryHoverBackground': mix(bg, c.fg, 0.2), 'button.secondaryBorder': mix(bg, c.fg, 0.2),
    'button.separator': c.bgDarker + '66',
    'widget.border': c.borderLight, 'toolbar.hoverBackground': mix(bg, c.fg, 0.1),
    'toolbar.activeBackground': mix(bg, c.fg, 0.16),
    'extensionButton.prominentBackground': g, 'extensionButton.prominentForeground': c.bgDarker,
    'extensionButton.prominentHoverBackground': mix(g, '#000000', 0.12),
    'extensionButton.background': mix(bg, c.fg, 0.13), 'extensionButton.foreground': c.fg,
    'extensionButton.hoverBackground': mix(bg, c.fg, 0.2),
    // Página de una extensión: botones, separador, estrellas, verificado, prelanzamiento y patrocinio.
    'extensionButton.border': mix(bg, c.fg, 0.2), 'extensionButton.separator': c.bgDarker + '66',
    'extensionIcon.starForeground': s.type, 'extensionIcon.verifiedForeground': g,
    'extensionIcon.preReleaseForeground': c.orange, 'extensionIcon.sponsorForeground': s.objectKey,
    'extensionIcon.privateForeground': s.keyword,
    'extensionBadge.remoteBackground': g, 'extensionBadge.remoteForeground': c.bgDarker,
    // Texto del README de la extensión: separadores, código en línea y bloques.
    'textSeparator.foreground': c.borderLight, 'textPreformat.background': mix(bg, c.fg, 0.08),
    'textPreformat.border': c.borderLight,
    'badge.background': g, 'badge.foreground': c.bgDarker,
    // Barras de progreso: punto medio entre verde aura y azul celeste (VS Code solo admite un color).
    'progressBar.background': mix(g, '#5CDFFF', 0.5), 'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': c.muted + '33', 'scrollbarSlider.hoverBackground': c.muted + '55',
    'scrollbarSlider.activeBackground': g + '55',
    // Texto de campos y áreas de texto: más suave que el texto normal, en la misma gama azulada del fondo.
    'input.background': c.bgDark, 'input.border': c.borderLight, 'input.foreground': mix(c.fg, c.fgDim, 0.5),
    'input.placeholderForeground': c.muted, 'inputOption.activeBorder': g, 'inputOption.activeBackground': g + '26',
    'inputOption.activeForeground': g, 'inputOption.hoverBackground': mix(bg, c.fg, 0.12),
    'dropdown.background': c.bgDark, 'dropdown.border': c.borderLight, 'dropdown.foreground': c.fg,
    // Casillas: fondo oscuro con borde azulado; la marca de activado en verde aura brillante.
    'checkbox.background': c.bgDark, 'checkbox.border': c.borderLight, 'checkbox.foreground': g,
    'checkbox.selectBackground': c.bgDark, 'checkbox.selectBorder': g,
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
    // Explorador: nombres en el azul cielo suave del tema; hover, selección y guías con el mismo tono.
    'sideBar.background': c.bgDark, 'sideBar.foreground': mix(c.fg, c.fgDim, 0.5), 'sideBar.border': c.border,
    'sideBarTitle.foreground': c.fg, 'sideBarSectionHeader.background': c.bgDark,
    'sideBarSectionHeader.foreground': c.fg, 'sideBarSectionHeader.border': c.border,
    'list.activeSelectionBackground': g + '1F', 'list.activeSelectionForeground': g,
    'list.activeSelectionIconForeground': g, 'list.focusForeground': c.fg,
    'list.inactiveSelectionBackground': mix(bg, c.fg, 0.09), 'list.inactiveSelectionForeground': c.fg,
    'list.hoverBackground': mix(bg, c.fg, 0.06), 'list.hoverForeground': c.fg, 'list.focusOutline': g + '60',
    'list.focusAndSelectionOutline': g + '80', 'list.inactiveFocusOutline': mix(bg, c.fg, 0.2),
    'list.highlightForeground': g, 'list.focusHighlightForeground': g,
    'list.errorForeground': c.red, 'list.warningForeground': c.orange,
    'list.deemphasizedForeground': c.muted, 'list.dropBackground': g + '1A', 'list.dropBetweenBackground': g,
    'list.filterMatchBackground': s.keyword + '33', 'list.filterMatchBorder': s.keyword + '66',
    'tree.indentGuidesStroke': mix(bg, c.fg, 0.18), 'tree.inactiveIndentGuidesStroke': mix(bg, c.fg, 0.08),
    'tree.tableColumnsBorder': c.borderLight, 'tree.tableOddRowsBackground': mix(bg, c.fg, 0.03),
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
    // Buscador: la coincidencia seleccionada en verde aura (como la selección) y las demás en índigo
    // (como las otras apariciones de una palabra). «Buscar en la selección» en índigo muy suave.
    'editor.findMatchBackground': g + '40', 'editor.findMatchBorder': g,
    'editor.findMatchHighlightBackground': s.keyword + '33', 'editor.findMatchHighlightBorder': s.keyword + '66',
    'editor.findRangeHighlightBackground': s.keyword + '14',
    'searchEditor.findMatchBackground': s.keyword + '33', 'searchEditor.findMatchBorder': s.keyword + '66',
    'search.resultsInfoForeground': c.fgDim, 'editor.lineHighlightBackground': c.bgLight + '99',
    'editor.lineHighlightBorder': '#00000000', 'editor.rangeHighlightBackground': g + '0D',
    'editorWhitespace.foreground': c.whitespace, 'editorIndentGuide.background1': c.guide,
    'editorIndentGuide.activeBackground1': c.guideActive, 'editorRuler.foreground': c.guide,
    'editorBracketMatch.background': g + '1A', 'editorBracketMatch.border': g + '80',
    'editorBracketHighlight.foreground1': s.keyword, 'editorBracketHighlight.foreground2': g,
    'editorBracketHighlight.foreground3': s.property, 'editorBracketHighlight.foreground4': s.parameter,
    'editorBracketHighlight.foreground5': s.constant, 'editorBracketHighlight.foreground6': s.type,
    'editorBracketHighlight.unexpectedBracket.foreground': c.red,
    'editorError.foreground': c.red, 'editorWarning.foreground': c.orange, 'editorInfo.foreground': s.property,
    'editorHint.foreground': g, 'editorCodeLens.foreground': c.blame, 'editorLink.activeForeground': g,
    'editorGutter.addedBackground': g + 'B3', 'editorGutter.modifiedBackground': s.function + 'B3',
    'editorGutter.deletedBackground': c.red + 'B3',
    'editorOverviewRuler.border': c.border, 'editorOverviewRuler.findMatchForeground': s.keyword + 'CC',
    'editorOverviewRuler.errorForeground': c.red, 'editorOverviewRuler.warningForeground': c.orange,
    'editorOverviewRuler.addedForeground': g + '99', 'editorOverviewRuler.modifiedForeground': s.function + '99',
    'editorOverviewRuler.deletedForeground': c.red + '99',
    'editorWidget.background': c.bgDark, 'editorWidget.border': c.borderLight, 'editorWidget.foreground': c.fg,
    // Borde izquierdo del buscador (el que se arrastra para cambiar su ancho): verde aura brillante.
    'editorWidget.resizeBorder': g,
    'editorSuggestWidget.background': c.bgDark, 'editorSuggestWidget.border': c.borderLight,
    'editorSuggestWidget.selectedBackground': g + '1F', 'editorSuggestWidget.highlightForeground': g,
    'editorSuggestWidget.foreground': c.fg, 'editorHoverWidget.background': c.bgDark,
    'editorHoverWidget.border': c.borderLight, 'peekView.border': g,
    'peekViewEditor.background': c.bgDark, 'peekViewResult.background': c.bgDarker,
    'peekViewTitle.background': c.bgDarker, 'peekViewEditor.matchHighlightBackground': g + '40',
    'peekViewResult.matchHighlightBackground': s.keyword + '40', 'peekViewResult.selectionBackground': g + '1F',
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
    // Ignorados por git: discretos, apenas por encima del fondo de la barra lateral.
    'gitDecoration.ignoredResourceForeground': mix(c.bgDark, c.fg, 0.28), 'gitDecoration.conflictingResourceForeground': s.constant,
    'gitDecoration.renamedResourceForeground': s.property, 'gitDecoration.submoduleResourceForeground': s.keyword,
    'gitDecoration.stageModifiedResourceForeground': c.orange, 'gitDecoration.stageDeletedResourceForeground': c.red,
    'debugToolBar.background': c.bgDark, 'welcomePage.tileBackground': c.bgDark,
    'settings.headerForeground': g, 'settings.modifiedItemIndicator': c.orange,
    'textBlockQuote.background': c.bgDark, 'textBlockQuote.border': g, 'textCodeBlock.background': c.bgDark,
    'textPreformat.foreground': c.orange,
    // Colores que usan las vistas web de otras extensiones (p. ej. NPM Visual Manager) para estados y gráficos.
    'testing.iconPassed': g, 'testing.iconFailed': c.red, 'testing.iconQueued': c.orange,
    'charts.foreground': c.fg, 'charts.lines': c.borderLight, 'charts.green': g, 'charts.red': c.red,
    'charts.blue': s.function, 'charts.yellow': s.type, 'charts.orange': c.orange, 'charts.purple': s.keyword,
    'editorWarning.background': c.orange + '1A', 'editorHoverWidget.foreground': c.fg,
    'symbolIcon.packageForeground': c.orange,
    // Git blame en línea (GitLens y el de VS Code): discreto, en el tono del texto pero apagado.
    'gitlens.trailingLineForegroundColor': c.blame, 'gitlens.trailingLineBackgroundColor': '#00000000',
    'git.blame.editorDecorationForeground': c.blame,
    // GitLens: blame por archivo, iconos de commits, ramas y pull requests, y el gráfico, con la paleta del tema.
    'gitlens.gutterBackgroundColor': c.bgLight, 'gitlens.gutterForegroundColor': mix(bg, c.fg, 0.45),
    'gitlens.gutterUncommittedForegroundColor': g + '99',
    'gitlens.lineHighlightBackgroundColor': g + '14', 'gitlens.lineHighlightOverviewRulerColor': g + '99',
    'gitlens.openAutolinkedIssueIconColor': g, 'gitlens.closedAutolinkedIssueIconColor': s.keyword,
    'gitlens.openPullRequestIconColor': g, 'gitlens.closedPullRequestIconColor': c.red,
    'gitlens.mergedPullRequestIconColor': s.keyword,
    'gitlens.unpublishedChangesIconColor': g, 'gitlens.unpublishedCommitIconColor': g,
    'gitlens.unpulledChangesIconColor': c.orange,
    'gitlens.decorations.branchAheadForegroundColor': g, 'gitlens.decorations.branchBehindForegroundColor': c.orange,
    'gitlens.decorations.branchDivergedForegroundColor': s.type,
    'gitlens.decorations.branchMissingUpstreamForegroundColor': c.red,
    'gitlens.decorations.statusMergingOrRebasingForegroundColor': s.type,
    'gitlens.decorations.statusMergingOrRebasingConflictForegroundColor': c.red,
    'gitlens.decorations.statusPausedOperationReadyForegroundColor': g,
    'gitlens.decorations.workspaceCurrentForegroundColor': g, 'gitlens.decorations.workspaceRepoOpenForegroundColor': g,
    'gitlens.decorations.workspaceRepoMissingForegroundColor': c.muted,
    'gitlens.decorations.worktreeHasUncommittedChangesForegroundColor': c.orange,
    'gitlens.decorations.worktreeMissingForegroundColor': c.red,
    'gitlens.graphLane1Color': g, 'gitlens.graphLane2Color': s.property, 'gitlens.graphLane3Color': s.function,
    'gitlens.graphLane4Color': s.keyword, 'gitlens.graphLane5Color': s.constant, 'gitlens.graphLane6Color': s.objectKey,
    'gitlens.graphLane7Color': c.orange, 'gitlens.graphLane8Color': s.type, 'gitlens.graphLane9Color': s.string,
    'gitlens.graphLane10Color': s.boolean,
    'gitlens.timelineAdditionsColor': g, 'gitlens.timelineDeletionsColor': c.red,
    'gitlens.graphChangesColumnAddedColor': g, 'gitlens.graphChangesColumnDeletedColor': c.red,
    'gitlens.graphMinimapMarkerHeadColor': g, 'gitlens.graphScrollMarkerHeadColor': g,
    'gitlens.graphMinimapMarkerUpstreamColor': mix(g, bg, 0.35), 'gitlens.graphScrollMarkerUpstreamColor': mix(g, bg, 0.35),
    'gitlens.graphMinimapMarkerLocalBranchesColor': s.function, 'gitlens.graphScrollMarkerLocalBranchesColor': s.function,
    'gitlens.graphMinimapMarkerRemoteBranchesColor': mix(s.function, bg, 0.4), 'gitlens.graphScrollMarkerRemoteBranchesColor': mix(s.function, bg, 0.4),
    'gitlens.graphMinimapMarkerPullRequestsColor': c.orange, 'gitlens.graphScrollMarkerPullRequestsColor': c.orange,
    'gitlens.graphMinimapMarkerHighlightsColor': s.type, 'gitlens.graphScrollMarkerHighlightsColor': s.type,
    'gitlens.graphMinimapMarkerStashesColor': c.muted, 'gitlens.graphScrollMarkerStashesColor': c.muted,
    'gitlens.graphMinimapMarkerTagsColor': mix(s.type, bg, 0.45), 'gitlens.graphScrollMarkerTagsColor': mix(s.type, bg, 0.45),
    'gitlens.graphMinimapMarkerWorktreeColor': s.constant,
    'gitlens.graphScrollMarkerWipColor': s.constant, 'gitlens.graphScrollMarkerMergeTargetColor': s.keyword,
    'gitlens.graphScrollMarkerPinnedColor': s.property,
    'gitlens.launchpadIndicatorMergeableColor': g, 'gitlens.launchpadIndicatorMergeableHoverColor': g,
    'gitlens.launchpadIndicatorBlockedColor': c.red, 'gitlens.launchpadIndicatorBlockedHoverColor': c.red,
    'gitlens.launchpadIndicatorAttentionColor': s.type, 'gitlens.launchpadIndicatorAttentionHoverColor': s.type,
    // Chat (Copilot y agentes): caja de texto, mensajes y etiquetas con la paleta del tema.
    'agentsChatInput.background': c.bgDark, 'agentsChatInput.foreground': mix(c.fg, c.fgDim, 0.5),
    'agentsChatInput.border': c.borderLight, 'agentsChatInput.focusBorder': g + '80',
    'agentsChatInput.placeholderForeground': c.muted,
    'inlineChat.background': c.bgDark, 'inlineChat.foreground': c.fg, 'inlineChat.border': c.borderLight,
    'inlineChatInput.background': c.bgDark, 'inlineChatInput.border': c.borderLight,
    'inlineChatInput.focusBorder': g + '80', 'inlineChatInput.placeholderForeground': c.muted,
    'chat.requestBackground': c.bgLight, 'chat.requestBorder': c.borderLight,
    'chat.requestBubbleBackground': c.bgLighter, 'chat.requestBubbleHoverBackground': mix(c.bgLighter, '#FFFFFF', 0.04),
    'chat.requestCodeBorder': s.function + '55', 'chat.checkpointSeparator': c.borderLight,
    'chat.slashCommandBackground': s.keyword + '26', 'chat.slashCommandForeground': s.keyword,
    'chat.avatarBackground': c.bgDarker, 'chat.avatarForeground': c.fg,
    'chat.editedFileForeground': c.orange, 'chat.linesAddedForeground': g, 'chat.linesRemovedForeground': c.red,
    'chat.workingProgressStableIconForeground': g,
    'interactive.activeCodeBorder': g, 'interactive.inactiveCodeBorder': c.borderLight
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
    t(['constant.language', 'constant.language.null'], s.constant),
    // true / false: azul mar.
    t(['constant.language.boolean'], s.boolean),
    t(['constant.other', 'variable.other.enummember'], s.constant),
    // Declaraciones: la palabra const/let/var en naranja y el nombre de la variable en rojo.
    t(['storage.type.ts', 'storage.type.tsx', 'storage.type.js', 'storage.type.jsx'], c.declare),
    t(['variable.other.constant'], s.constVariable),
    // Nombres dentro de import { ... }: el mismo azul cielo claro que las clases usadas.
    t(['variable.other.readwrite.alias', 'meta.import variable.other.readwrite', 'meta.export variable.other.readwrite'], s.classReference),
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
    t(['variable.other.property', 'variable.other.object.property', 'support.type.property-name'], s.property),
    // Claves de objetos literales ({ severity: 'error' }): rosa mexicano.
    t(['meta.object-literal.key', 'meta.object-literal.key entity.name.function'], s.objectKey),
    t(['variable.other.object'], c.variable),
    t(['entity.name.tag', 'meta.tag.sgml'], s.tag),
    t(['support.class.component', 'entity.name.tag.tsx', 'entity.name.tag.jsx'], s.type),
    t(['entity.other.attribute-name'], s.storage, 'italic'),
    t(['punctuation.definition.tag'], s.operator),
    t(['entity.other.attribute-name.class.css', 'entity.other.attribute-name.class.scss', 'entity.other.attribute-name.class.less'], c.cssClass),
    t(['entity.other.attribute-name.id.css'], s.parameter),
    // Variables de CSS/SCSS: al declararlas (--interface-green:, $accent) en azul cielo claro;
    // al usarlas dentro de var(--x), en el azul cielo claro del texto.
    t(['variable.css', 'support.type.custom-property', 'variable.scss', 'variable.other.less'], c.cssVarDecl),
    t(['variable.argument.css'], c.variable),
    // Colores hexadecimales (#61FFCA) y su #: entre azul cielo y blanco.
    t(['constant.other.color', 'constant.other.rgb-value', 'constant.other.color.rgb-value',
      'punctuation.definition.constant.css', 'punctuation.definition.constant.scss'], c.hexColor),
    t(['support.type.property-name.css'], s.property),
    t(['support.constant.property-value.css', 'keyword.other.unit'], s.number),
    // Selectores de etiqueta y pseudoclases en CSS/SCSS (:root, body, html, :host, :hover): rojo cereza intenso.
    t(['entity.name.tag.css', 'entity.name.tag.scss', 'entity.name.tag.reference.scss',
      'entity.other.attribute-name.pseudo-class.css', 'entity.other.attribute-name.pseudo-class.scss'], c.cssSelector),
    // Morado más claro en CSS/SCSS: ::before, @media, @include, @use.
    t(['entity.other.attribute-name.pseudo-element.css', 'keyword.control.at-rule.css', 'keyword.control.at-rule.scss',
      'keyword.control.at-rule.media.scss', 'keyword.control.at-rule.include.scss', 'keyword.control.at-rule.use.scss'], mix(s.keyword, '#FFFFFF', 0.3)),
    t(['support.type.property-name.json'], s.property),
    t(['entity.name.decorator', 'meta.decorator', 'punctuation.decorator'], s.constant, 'italic'),
    // Anotaciones y atributos de otros lenguajes: @Service (Java), #[derive] (Rust), #[Attr] (PHP), [Attr] (C#).
    t(['storage.type.annotation', 'punctuation.definition.annotation', 'meta.declaration.annotation',
      'meta.attribute.rust', 'punctuation.definition.attribute.rust', 'meta.attribute.php', 'meta.attribute.cs'], s.constant, 'italic'),
    // Directivas del preprocesador de C/C++ (#include, #define) y macros de Rust (println!).
    t(['keyword.control.directive', 'punctuation.definition.directive', 'meta.preprocessor keyword'], s.keyword),
    t(['entity.name.function.preprocessor', 'entity.name.function.macro'], s.function),
    // PHP: el $ forma parte del nombre de la variable.
    t(['punctuation.definition.variable.php'], c.variable),
    // Paquetes de Go/Java/Kotlin y módulos de Rust.
    t(['entity.name.package', 'entity.name.type.package', 'entity.name.module.rust'], s.type),
    // Tipos primitivos (int, double, f64, bool): como storage.
    t(['storage.type.primitive', 'support.type.primitive', 'storage.type.built-in', 'entity.name.type.primitive',
      'storage.type.numeric.go', 'storage.type.boolean.go', 'storage.type.string.go', 'storage.type.core.rust'], s.storage),
    t(['entity.name.namespace', 'entity.name.module'], s.type),
    t(['punctuation', 'meta.brace', 'punctuation.separator'], c.fgDim),
    // Punto y coma: el mismo azul cielo claro del texto.
    t(['punctuation.terminator'], c.fg),
    // Comillas del mismo color que el texto que encierran (si no, la regla de puntuación las vuelve grises).
    t(['punctuation.definition.string'], s.string),
    t(['punctuation.support.type.property-name', 'punctuation.definition.string.begin.json support.type.property-name',
      'support.type.property-name.json punctuation'], s.property),
    t(['punctuation.definition.string.begin.css', 'punctuation.definition.string.end.css'], s.string),
    t(['markup.heading', 'entity.name.section.markdown'], s.string, 'bold'),
    t(['markup.bold'], c.orange, 'bold'),
    t(['markup.italic'], s.constant, 'italic'),
    t(['markup.inline.raw', 'markup.fenced_code.block'], c.orange),
    t(['markup.underline.link', 'string.other.link'], s.property),
    t(['markup.quote'], c.muted, 'italic'),
    t(['markup.list', 'punctuation.definition.list'], s.keyword),
    t(['markup.inserted'], s.string),
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
    // Clases usadas como valor (imports de Angular, new X): azul cielo muy claro; su declaración sigue amarilla.
    class: s.classReference,
    'class.declaration': s.type,
    // Servicios inyectados: private readonly http: HttpClient  /  private readonly http = inject(HttpClient)
    'parameter.readonly': s.injected,
    'property.declaration.readonly': s.injected,
    'property.declaration': s.objectKey,
    interface: { foreground: s.type, italic: true },
    type: s.type,
    enumMember: s.constant,
    namespace: s.type,
    'variable.readonly': s.constVariable,
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
