const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the required directories exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Check if we need to install the sharp package for image conversion
try {
  console.log('Checking for sharp package...');
  require.resolve('sharp');
  console.log('Sharp package is already installed.');
} catch (e) {
  console.log('Installing sharp package...');
  execSync('npm install sharp', { stdio: 'inherit' });
}

// Now import sharp after ensuring it's installed
const sharp = require('sharp');

// Path to the SVG file
const svgPath = path.join(publicDir, 'graduation-hat.svg');

// Generate favicon.ico
console.log('Generating favicon.ico...');
sharp(svgPath)
  .resize(32, 32)
  .toFile(path.join(publicDir, 'favicon.ico'), (err) => {
    if (err) {
      console.error('Error generating favicon.ico:', err);
    } else {
      console.log('favicon.ico generated successfully!');
    }
  });

// Generate favicon.png (16x16)
console.log('Generating favicon-16x16.png...');
sharp(svgPath)
  .resize(16, 16)
  .toFile(path.join(publicDir, 'favicon-16x16.png'), (err) => {
    if (err) {
      console.error('Error generating favicon-16x16.png:', err);
    } else {
      console.log('favicon-16x16.png generated successfully!');
    }
  });

// Generate favicon.png (32x32)
console.log('Generating favicon-32x32.png...');
sharp(svgPath)
  .resize(32, 32)
  .toFile(path.join(publicDir, 'favicon-32x32.png'), (err) => {
    if (err) {
      console.error('Error generating favicon-32x32.png:', err);
    } else {
      console.log('favicon-32x32.png generated successfully!');
    }
  });

// Generate apple-touch-icon.png (180x180)
console.log('Generating apple-touch-icon.png...');
sharp(svgPath)
  .resize(180, 180)
  .toFile(path.join(publicDir, 'apple-touch-icon.png'), (err) => {
    if (err) {
      console.error('Error generating apple-touch-icon.png:', err);
    } else {
      console.log('apple-touch-icon.png generated successfully!');
    }
  });

console.log('Favicon generation script completed!'); 