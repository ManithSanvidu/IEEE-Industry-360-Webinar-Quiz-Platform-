const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'public/image1.png');
const base64 = fs.readFileSync(imagePath).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <image href="data:image/png;base64,${base64}" x="15" y="15" width="70" height="70" />
</svg>`;

fs.writeFileSync(path.join(__dirname, 'src/app/icon.svg'), svg);
console.log('Created icon.svg');
