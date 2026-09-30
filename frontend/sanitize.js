const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function clean(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let text = fs.readFileSync(filePath, 'utf8');
        let original = text;
        
        text = text.replace(/Ã¢â‚¬"/g, '-');
        text = text.replace(/Ã¢â‚¬â€œ/g, '-');
        text = text.replace(/Ã¢â‚¬â€/g, '-');
        text = text.replace(/Ã¢â‚¬/g, '-');
        text = text.replace(/â€”/g, '-');
        text = text.replace(/â€“/g, '-');
        text = text.replace(/â€™/g, "'");
        text = text.replace(/â€œ/g, '"');
        text = text.replace(/â€/g, '"');
        text = text.replace(/\uFFFD/g, '-');
        text = text.replace(/Ã/g, '-');

        if (text !== original) {
            fs.writeFileSync(filePath, text, 'utf8');
            console.log('Sanitized: ' + filePath);
        }
    }
}

walkDir('src/app', clean);
walkDir('src/components', clean);
