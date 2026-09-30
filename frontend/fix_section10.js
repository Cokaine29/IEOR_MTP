const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const targetStr = '<span className="text-cyan-400 font-bold">This represents the precise research gap that this thesis aims to close.</span> By applying MAPPO to a stochastically disrupted PettingZoo port environment, this project bridges the gap between theoretical Multi-Agent Deep RL and the volatile physical realities of modern container terminals.';

const replacementStr = '<span className="text-cyan-400 font-bold">This represents the precise research gap that this thesis aims to close.</span> In Phase 1, a single-agent <strong className="text-cyan-300">PPO</strong> policy is applied — for the first time in the ACT dispatching context — to a Gymnasium-based simulation with simultaneous stochastic disruptions, benchmarked against verified classical baselines. In Phase 2, this is extended to <strong className="text-cyan-300">MAPPO</strong> for decentralised multi-agent coordination across a full AGV fleet, evaluated under NeurIPS 2021 statistical standards (Agarwal et al.).';

if (page.includes(targetStr)) {
    page = page.replace(targetStr, replacementStr);
    fs.writeFileSync('src/app/background/page.tsx', page, 'utf8');
    console.log('Fixed Section 10 successfully.');
} else {
    console.log('Could not find the target string. Using regex.');
    // Try a more flexible regex in case of slight formatting differences
    const regex = /<span className="text-cyan-400 font-bold">This represents the precise research gap that this thesis aims to close\.<\/span>[\s\S]*?(?=<\/p>)/;
    if (regex.test(page)) {
        page = page.replace(regex, replacementStr);
        fs.writeFileSync('src/app/background/page.tsx', page, 'utf8');
        console.log('Fixed Section 10 using regex successfully.');
    } else {
        console.log('Failed to find target string via regex as well.');
    }
}
