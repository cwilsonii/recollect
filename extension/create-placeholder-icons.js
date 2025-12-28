#!/usr/bin/env node

/**
 * Create Placeholder Icons for Recollect Extension
 *
 * This script generates simple placeholder icons using SVG.
 * For production, consider designing custom icons.
 *
 * Usage:
 *   node create-placeholder-icons.js
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log('✓ Created public/icons/ directory');
}

// SVG bookmark icon template
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>

  <!-- Bookmark icon -->
  <path
    d="M ${size * 0.25} ${size * 0.2}
       L ${size * 0.75} ${size * 0.2}
       L ${size * 0.75} ${size * 0.8}
       L ${size * 0.5} ${size * 0.65}
       L ${size * 0.25} ${size * 0.8}
       Z"
    fill="white"
    stroke="white"
    stroke-width="${Math.max(1, size / 32)}"
  />
</svg>`;

// Icon sizes
const sizes = [16, 48, 128];

console.log('🎨 Generating placeholder icons...\n');

sizes.forEach((size) => {
  const svg = createSVG(size);
  const filename = `icon${size}.svg`;
  const filepath = path.join(ICONS_DIR, filename);

  fs.writeFileSync(filepath, svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All SVG icons created successfully!');
console.log('\nNote: Chrome extensions prefer PNG icons.');
console.log('To convert SVG to PNG:');
console.log('1. Open generate-icons.html in your browser');
console.log('2. Download the PNG icons');
console.log('3. Or use an online converter like:');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://www.freeconvert.com/svg-to-png');
console.log('\nOr install a converter tool:');
console.log('   npm install -g svgexport');
console.log('   svgexport public/icons/icon16.svg public/icons/icon16.png 16:16');
console.log('   svgexport public/icons/icon48.svg public/icons/icon48.png 48:48');
console.log('   svgexport public/icons/icon128.svg public/icons/icon128.png 128:128');
