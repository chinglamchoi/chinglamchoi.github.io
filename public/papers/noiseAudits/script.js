const RESULTS = [
  {
    "name": "FractalDB",
    "eld": 0.426,
    "fid": 1254,
    "lpips": 0.26,
    "recall": 0.018,
    "linear": 23.91,
    "finetune": 56.66,
    "inc": 18.7,
    "ina": 10.3,
    "regime": "Noise-like",
    "id": 0,
    "image": "assets/source-0-grid.jpg"
  },
  {
    "name": "Perlin noise",
    "eld": 0.427,
    "fid": 1922,
    "lpips": 0.208,
    "recall": 0,
    "linear": 21.53,
    "finetune": 55.38,
    "inc": 16.79,
    "ina": 9.11,
    "regime": "Noise-like",
    "id": 1,
    "image": "assets/source-1-grid.jpg"
  },
  {
    "name": "Gaussian noise",
    "eld": 0.5,
    "fid": 2145,
    "lpips": 0.237,
    "recall": 0,
    "linear": 20.26,
    "finetune": 52.26,
    "inc": 15.53,
    "ina": 5.01,
    "regime": "Noise-like",
    "id": 2,
    "image": "assets/source-2-grid.jpg"
  },
  {
    "name": "Diffusion \u00b7 high CFG",
    "eld": 0.138,
    "fid": 481,
    "lpips": 0.342,
    "recall": 0.02,
    "linear": 28.18,
    "finetune": 59.34,
    "inc": 21.41,
    "ina": 10.84,
    "regime": "Over-concentrated",
    "id": 3,
    "image": "assets/source-3-grid.jpg"
  },
  {
    "name": "StyleGAN3",
    "eld": 0.309,
    "fid": 1148,
    "lpips": 0.305,
    "recall": 0.001,
    "linear": 24.71,
    "finetune": 57.49,
    "inc": 18.34,
    "ina": 10.59,
    "regime": "Broad / shifted",
    "id": 4,
    "image": "assets/source-4-grid.jpg"
  },
  {
    "name": "BigGAN",
    "eld": 0.112,
    "fid": 566,
    "lpips": 0.303,
    "recall": 0.101,
    "linear": 28.36,
    "finetune": 58.97,
    "inc": 18.1,
    "ina": 10.35,
    "regime": "Broad / shifted",
    "id": 5,
    "image": "assets/source-5-grid.jpg"
  },
  {
    "name": "Diffusion \u00b7 mid CFG",
    "eld": 0.088,
    "fid": 459,
    "lpips": 0.338,
    "recall": 0.03,
    "linear": 29.17,
    "finetune": 59.57,
    "inc": 21.44,
    "ina": 12.35,
    "regime": "Broad / shifted",
    "id": 6,
    "image": "assets/source-6-grid.jpg"
  },
  {
    "name": "Diffusion \u00b7 low CFG",
    "eld": 0.153,
    "fid": 1129,
    "lpips": 0.297,
    "recall": 0.022,
    "linear": 28.67,
    "finetune": 59.6,
    "inc": 21.38,
    "ina": 11.99,
    "regime": "Broad / shifted",
    "id": 7,
    "image": "assets/source-7-grid.jpg"
  },
  {
    "name": "Uniform mixture",
    "eld": 0.112,
    "fid": 616,
    "lpips": 0.294,
    "recall": 0.023,
    "linear": 27.45,
    "finetune": 57.61,
    "inc": 20.8,
    "ina": 11.07,
    "regime": "Curated mixture",
    "id": 8,
    "image": "assets/source-8-grid.jpg"
  }
];
'use strict';
const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
function svgNode(tag, attributes = {}, text) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
const colors = {'Noise-like':'#0096a6','Over-concentrated':'#d94364','Broad / shifted':'#7d4cc2','Curated mixture':'#169464'};
const presets = {
  noise: {title:'Noise-like', description:'Too much mass sits in high-energy, low-likelihood regions.', mean:.84, spread:.075},
  concentrated: {title:'Over-concentrated', description:'Likely samples, but too narrow a slice of the real-image energy range.', mean:.22, spread:.045},
  shifted: {title:'Broad / shifted', description:'A broad profile can still miss the reference in location, spread, and tail structure.', mean:.66, spread:.19},
  matched: {title:'Matched profile', description:'The same energy profile. Semantic coverage and diversity still need separate checks.'}
};
let activePreset = 'noise';
function bell(x, mean, spread) { return Math.exp(-.5 * ((x - mean) / spread) ** 2) / spread; }
function normalize(values) { const sum = values.reduce((a,b) => a+b,0); return values.map(v => v/sum); }
const bins = 161;
const energies = Array.from({length:bins}, (_,i) => i/(bins-1));
const realProfile = normalize(energies.map(x => .72*bell(x,.39,.13) + .28*bell(x,.64,.16)));
function energyChart() {
  const preset = presets[activePreset];
  const blend = Number($('curation').value)/100;
  const initial = activePreset === 'matched' ? realProfile : normalize(energies.map(x => bell(x,preset.mean,preset.spread)));
  const synthetic = initial.map((v,i) => (1-blend)*v+blend*realProfile[i]);
  let realCDF=0, syntheticCDF=0, distance=0;
  for (let i=0;i<bins-1;i++) { realCDF += realProfile[i]; syntheticCDF += synthetic[i]; distance += Math.abs(realCDF-syntheticCDF)/(bins-1); }
  const svg=$('energy-chart'); svg.replaceChildren();
  const compact=window.matchMedia('(max-width:700px)').matches;
  const width=compact?400:720,height=compact?255:285;
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const left=compact?24:32, right=width-18, top=20, bottom=height-45;
  const max=Math.max(...realProfile,...synthetic)*1.12;
  const x = i => left+(right-left)*i/(bins-1), y = v => bottom-(bottom-top)*v/max;
  for(let i=0;i<4;i++) svg.append(svgNode('line',{x1:left,y1:bottom-i*(bottom-top)/3,x2:right,y2:bottom-i*(bottom-top)/3,stroke:'#edf0f4','stroke-width':1}));
  function line(profile) { return profile.map((v,i)=>(i?'L':'M')+x(i).toFixed(2)+','+y(v).toFixed(2)).join(' '); }
  const syntheticColor = {noise:'#0096a6',concentrated:'#d94364',shifted:'#7d4cc2',matched:'#169464'}[activePreset];
  document.querySelector('i.synthetic').style.background = syntheticColor;
  $('energy-value').style.color = syntheticColor;
  $('curation').style.accentColor = syntheticColor;
  for(const [profile,color] of [[realProfile,'#1677cc'],[synthetic,syntheticColor]]) {
    const d=line(profile);
    svg.append(svgNode('path',{d:d+` L${right},${bottom} L${left},${bottom} Z`,fill:color,'fill-opacity':.30}));
    svg.append(svgNode('path',{d,fill:'none',stroke:color,'stroke-width':3,'stroke-linejoin':'round'}));
  }
  svg.append(svgNode('line',{x1:left,y1:bottom,x2:right,y2:bottom,stroke:'#bdc8d6'}));
  svg.append(svgNode('text',{x:(left+right)/2,y:height-10,'text-anchor':'middle',class:'chart-label'},'Real-image energy  Eₚ(x) →'));
  svg.append(svgNode('text',{x:left,y:12,class:'chart-label'},'Relative frequency'));
  $('energy-value').textContent=distance.toFixed(3);
  $('curation-value').textContent=Math.round(blend*100)+'%';
  $('regime-title').textContent=preset.title;
  $('regime-description').textContent=preset.description;
  svg.setAttribute('aria-label',`${preset.title} illustrative energy distribution. Blended ${Math.round(blend*100)} percent toward the real reference; Wasserstein-1 mismatch ${distance.toFixed(3)} in arbitrary energy units.`);
}
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click',()=>{
  activePreset=button.dataset.preset;
  document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('curation').value=0; energyChart();
}));
$('curation').addEventListener('input',energyChart);
energyChart();

const metrics={
  eld:{label:'ELD ↓',short:'ELD ↓',digits:3},fid:{label:'FID ↓',short:'FID ↓',digits:0},
  lpips:{label:'LPIPS variation ↑',short:'LPIPS ↑',digits:3},recall:{label:'Feature recall ↑',short:'Recall ↑',digits:3},
  linear:{label:'ImageNet-1K linear accuracy (%) ↑',short:'IN-1K linear',digits:2},
  finetune:{label:'ImageNet-1K fine-tuning accuracy (%) ↑',short:'IN-1K FT',digits:2},
  inc:{label:'ImageNet-C accuracy (%) ↑',short:'IN-C',digits:2},ina:{label:'ImageNet-A accuracy (%) ↑',short:'IN-A',digits:2}
};
let selectedSource=6;
function ranks(values) { return values.map(v=>{const below=values.filter(x=>x<v).length, equal=values.filter(x=>x===v).length;return below+(equal+1)/2;}); }
function spearman(xs,ys) {
  const rx=ranks(xs),ry=ranks(ys),avg=(xs.length+1)/2;
  const numerator=rx.reduce((sum,v,i)=>sum+(v-avg)*(ry[i]-avg),0);
  return numerator/Math.sqrt(rx.reduce((s,v)=>s+(v-avg)**2,0)*ry.reduce((s,v)=>s+(v-avg)**2,0));
}
function detail() {
  const d=RESULTS[selectedSource],xKey=$('x-metric').value,yKey=$('y-metric').value;
  $('source-name').textContent=d.name;
  $('source-regime').textContent=d.regime;
  $('source-regime').style.color=colors[d.regime];
  $('source-images').src=d.image;
  $('source-images').alt=`Six synthetic samples from ${d.name}, reproduced from Figure 6 of the paper.`;
  $('source-select').value=String(selectedSource);
  $('source-metrics').replaceChildren();
  const fields=[...new Set([xKey,yKey,'eld','fid','inc','ina'])].slice(0,4);
  for(const key of fields) {
    const cell=document.createElement('div'),label=document.createElement('span'),value=document.createElement('strong');
    label.textContent=metrics[key].short; value.textContent=d[key].toFixed(metrics[key].digits)+(key in {linear:1,finetune:1,inc:1,ina:1}?'%':'');
    cell.append(label,value);$('source-metrics').append(cell);
  }
  document.querySelectorAll('.point-ring').forEach(ring=>ring.setAttribute('opacity',Number(ring.dataset.id)===selectedSource?'1':'0'));
  document.querySelectorAll('.point-label').forEach(label=>label.setAttribute('opacity',Number(label.dataset.id)===selectedSource?'1':'0'));
  document.querySelectorAll('.chart-point').forEach(point=>point.setAttribute('aria-pressed',String(Number(point.dataset.id)===selectedSource)));
}
function resultsChart() {
  const svg=$('results-chart');svg.replaceChildren();
  const xKey=$('x-metric').value,yKey=$('y-metric').value;
  const xs=RESULTS.map(d=>d[xKey]),ys=RESULTS.map(d=>d[yKey]);
  const xMin=Math.min(...xs),xMax=Math.max(...xs),yMin=Math.min(...ys),yMax=Math.max(...ys);
  const xPadding=(xMax-xMin)*.14, yPadding=(yMax-yMin)*.17;
  const lowX=xKey==='recall'?0:xMin-xPadding,highX=xMax+xPadding,lowY=yMin-yPadding,highY=yMax+yPadding;
  const compact=window.matchMedia('(max-width:700px)').matches;
  const width=compact?400:680,height=compact?350:430;
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const left=compact?58:76,right=width-25,top=40,bottom=height-74;
  const X = v => left+(v-lowX)/(highX-lowX)*(right-left),Y=v=>bottom-(v-lowY)/(highY-lowY)*(bottom-top);
  for(let i=0;i<=4;i++) {
    const yTick=lowY+(highY-lowY)*i/4, y=Y(yTick),xTick=lowX+(highX-lowX)*i/4,x=X(xTick);
    svg.append(svgNode('line',{x1:left,y1:y,x2:right,y2:y,stroke:'#e7ecf2'}));
    svg.append(svgNode('text',{x:left-13,y:y+4,'text-anchor':'end',class:'chart-label'},yTick.toFixed(1)));
    svg.append(svgNode('line',{x1:x,y1:top,x2:x,y2:bottom,stroke:'#f1f4f8'}));
    svg.append(svgNode('text',{x,y:bottom+24,'text-anchor':'middle',class:'chart-label'},xTick.toFixed(xKey==='fid'?0:xKey==='recall'?3:2)));
  }
  svg.append(svgNode('line',{x1:left,y1:bottom,x2:right,y2:bottom,stroke:'#b8c5d6'}));
  svg.append(svgNode('text',{x:(left+right)/2,y:height-20,'text-anchor':'middle',class:'chart-label'},metrics[xKey].label));
  svg.append(svgNode('text',{transform:`translate(${compact?16:19} ${(top+bottom)/2}) rotate(-90)`,'text-anchor':'middle',class:'chart-label'},compact?`${metrics[yKey].short} accuracy (%) ↑`:metrics[yKey].label));
  const rho=spearman(xs,ys);
  svg.append(svgNode('text',{x:left+5,y:24,class:'chart-label'},`Spearman ρ = ${rho.toFixed(2)} · 9 sources`));
  for(const d of RESULTS) {
    const x=X(d[xKey]),y=Y(d[yKey]),color=colors[d.regime];
    const g=svgNode('g',{class:'chart-point',tabindex:0,role:'button','aria-label':`${d.name}: ${metrics[xKey].short} ${d[xKey]}, ${metrics[yKey].short} ${d[yKey]} percent. Select to inspect samples.`, 'aria-pressed':String(d.id===selectedSource),'data-id':d.id});
    g.append(svgNode('circle',{cx:x,cy:y,r:15,fill:'transparent'}));
    g.append(svgNode('circle',{cx:x,cy:y,r:10,fill:'none',stroke:color,'stroke-width':1.5,class:'point-ring','data-id':d.id,opacity:d.id===selectedSource?1:0}));
    g.append(svgNode('circle',{cx:x,cy:y,r:6.5,fill:color,stroke:'#fff','stroke-width':1.5}));
    g.append(svgNode('title',{},`${d.name}\n${metrics[xKey].short}: ${d[xKey]}\n${metrics[yKey].short}: ${d[yKey]}%`));
    const label=svgNode('text',{x:x>width*.7?x-13:x+13,y:y-12,'text-anchor':x>width*.7?'end':'start',class:'point-label','data-id':d.id,opacity:d.id===selectedSource?1:0},d.name);
    svg.append(g,label);
    const select=()=>{selectedSource=d.id;detail();};
    g.addEventListener('click',select);
    g.addEventListener('focus',select);
    g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select();}});
  }
  $('plot-summary').textContent=`Spearman rank correlation ρ = ${rho.toFixed(2)}, computed from the nine rounded values in Table 1. Association across these sources does not establish causation; the other data properties are not held fixed.`;
  detail();
}
$('x-metric').addEventListener('change',resultsChart);
$('y-metric').addEventListener('change',resultsChart);
$('source-select').addEventListener('change',event=>{selectedSource=Number(event.target.value);detail();});
resultsChart();
const copyButton=$('copy-citation');
if(navigator.clipboard?.writeText) {
  copyButton.hidden=false;
  copyButton.addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText($('bibtex').textContent);$('copy-status').textContent='Citation copied to clipboard.'; }
    catch { $('copy-status').textContent='Select and copy the BibTeX above, or download the .bib file.'; }
  });
}

window.addEventListener('resize',()=>{energyChart();resultsChart();});
