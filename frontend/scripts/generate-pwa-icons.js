/**
 * PWA Icon Generator Script
 *
 * This script generates PWA icons from a source image.
 *
 * Prerequisites:
 * npm install sharp
 *
 * Usage:
 * node scripts/generate-pwa-icons.js <source-image>
 *
 * Example:
 * node scripts/generate-pwa-icons.js src/assets/images/ceslar_logo.png
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Install it with: npm install sharp --save-dev');
  console.log('\nAlternatively, use an online tool like:');
  console.log('- https://www.pwabuilder.com/imageGenerator');
  console.log('- https://realfavicongenerator.net/');
  console.log('\nRequired icon sizes:');
  console.log('- icon-72x72.png');
  console.log('- icon-96x96.png');
  console.log('- icon-128x128.png');
  console.log('- icon-144x144.png');
  console.log('- icon-152x152.png');
  console.log('- icon-192x192.png');
  console.log('- icon-384x384.png');
  console.log('- icon-512x512.png');
  console.log('- icon-maskable-512x512.png (with padding for maskable)');
  console.log('- favicon.ico');
  process.exit(0);
}

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons(sourcePath) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Generating PWA icons...\n');

  // Generate standard icons
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(sourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    console.log(`Created: icon-${size}x${size}.png`);
  }

  // Generate maskable icon (with padding)
  const maskableSize = 512;
  const maskablePadding = Math.floor(maskableSize * 0.1); // 10% padding
  const innerSize = maskableSize - (maskablePadding * 2);

  await sharp(sourcePath)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 26, g: 54, b: 93, alpha: 1 } // Primary color background
    })
    .extend({
      top: maskablePadding,
      bottom: maskablePadding,
      left: maskablePadding,
      right: maskablePadding,
      background: { r: 26, g: 54, b: 93, alpha: 1 }
    })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'icon-maskable-512x512.png'));
  console.log('Created: icon-maskable-512x512.png');

  // Generate favicon.ico (using 32x32)
  await sharp(sourcePath)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
  console.log('Created: favicon.ico');

  console.log('\nPWA icons generated successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node generate-pwa-icons.js <source-image>');
  console.log('Example: node generate-pwa-icons.js src/assets/images/ceslar_logo.png');
  process.exit(1);
}

generateIcons(args[0]).catch(console.error);
