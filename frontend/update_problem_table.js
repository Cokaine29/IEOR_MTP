const fs = require('fs');
let text = fs.readFileSync('src/app/problem/page.tsx', 'utf8');

const oldRow = `<tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Online Learning <span className="font-normal text-zinc-500 text-sm block">(Choe 2016)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Crane variance only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>`;

const newRows = `<tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Tabular Q-Learning <span className="font-normal text-zinc-500 text-sm block">Documented as failed baseline in Choe et al. (2016)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Crane variance only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Online Preference Learning (MLP) <span className="font-normal text-zinc-500 text-sm block">Choe et al. (2016) — their actual method</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Crane variance only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>`;

if (text.includes(oldRow)) {
    text = text.replace(oldRow, newRows);
    fs.writeFileSync('src/app/problem/page.tsx', text, 'utf8');
    console.log('Replaced table rows successfully.');
} else {
    // Try regex
    const regex = /<tr className="hover:bg-zinc-50 transition-colors">\s*<td className="px-6 py-4 text-zinc-900 font-bold">Online Learning[\s\S]*?<\/tr>/;
    if (regex.test(text)) {
        text = text.replace(regex, newRows);
        fs.writeFileSync('src/app/problem/page.tsx', text, 'utf8');
        console.log('Replaced table rows using regex successfully.');
    } else {
        console.log('Failed to find the row to replace.');
    }
}
