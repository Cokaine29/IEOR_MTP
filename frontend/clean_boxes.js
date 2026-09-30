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
        
        // Remove character 157 (invisible box)
        let regex = new RegExp(String.fromCharCode(157), 'g');
        text = text.replace(regex, '');
        
        // Remove character 141, 143, 144 etc (other windows-1252 control chars just in case)
        for(let i=128; i<=159; i++) {
            let r = new RegExp(String.fromCharCode(i), 'g');
            text = text.replace(r, '');
        }

        if (text !== original) {
            fs.writeFileSync(filePath, text, 'utf8');
            console.log('Cleaned boxes from: ' + filePath);
        }
    }
}

walkDir('src/app', clean);
walkDir('src/components', clean);
