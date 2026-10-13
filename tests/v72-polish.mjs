import fs from 'node:fs';
const html=fs.readFileSync('public/index.html','utf8');
const worker=fs.readFileSync('src/worker.js','utf8');
const checks=[
 ['36 rotating recommendations',html.includes('HOME_RECOMMENDATION_COUNT=36')&&html.includes('return shuffled(pool).slice(0,HOME_RECOMMENDATION_COUNT)')],
 ['recommendations explicitly exclude global activity',html.includes('Global activity never seeds this grid')],
 ['remove is in status dropdown',html.includes('<option value="__remove__">Remove from my list</option>')],
 ['large details remove button gone',!html.includes('id="mtDetailsRemoveLog"')],
 ['profile poster remove hidden',html.includes('.pf .pf-poster .mt-poster-remove{display:none!important}')],
 ['similar media panel',html.includes('Similar media')&&html.includes('loadSimilarMedia(r,type)')],
 ['DM toast watch',html.includes('mtStartDmWatch()')&&html.includes('New message from')],
 ['staff placeholders are immediate',html.includes('md-person-art')&&html.includes("onload=\"this.classList.add('loaded')\"")],
 ['v72 health',worker.includes('version:"v72"')]
];
for(const [name,ok] of checks){if(!ok)throw new Error('FAIL '+name)}
console.log('PASS v72 polish: '+checks.map(x=>x[0]).join('; '));
