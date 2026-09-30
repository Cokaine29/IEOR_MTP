const fs = require('fs');
const path = require('path');

const dirs = ['src/app/methodology', 'src/components/methodology'];

for (const dir of dirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            if (file.endsWith('.tsx')) {
                const fullPath = path.join(dir, file);
                let content = fs.readFileSync(fullPath, 'utf8');
                
                // Replace em-dashes
                content = content.replace(/Phase (\d+) — /g, 'Phase $1: ');
                content = content.replace(/Layout A — /g, 'Layout A: ');
                content = content.replace(/Layout B — /g, 'Layout B: ');
                content = content.replace(/ — /g, ', ');
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed dashes in', fullPath);
            }
        }
    }
}
