const fs = require('fs');
let content = fs.readFileSync('src/components/methodology/Phase7.tsx', 'utf8');
content = content.replace(
    "import { BarChart3, LineChart, TestTube, Search, FileText } from 'lucide-react';", 
    "import { BarChart3, LineChart, TestTube, Search, FileText, Users } from 'lucide-react';"
);
fs.writeFileSync('src/components/methodology/Phase7.tsx', content, 'utf8');
