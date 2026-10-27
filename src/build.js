'use strict';
// Regenera el tema con los valores por defecto: npm run build
const fs = require('fs');
const path = require('path');
const { THEME, DEFAULTS, buildTheme } = require('./generator');

const file = path.join(__dirname, '..', 'themes', THEME.file);
fs.writeFileSync(file, JSON.stringify(buildTheme(DEFAULTS), null, 2) + '\n');
console.log('✓ ' + THEME.file);
