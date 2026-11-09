const root=document.querySelector('[data-paper-browser]');
if(root){
 const input=document.getElementById('paper-search') as HTMLInputElement;
 const year=document.getElementById('paper-year') as HTMLSelectElement;
 const papers=[...root.querySelectorAll<HTMLElement>('[data-paper]')];
 const topics=[...root.querySelectorAll<HTMLButtonElement>('[data-topic]')];
 const count=document.getElementById('paper-count')!;
 const params=new URLSearchParams(location.search);
 let selectedTopic=topics.some(t=>t.dataset.topic===params.get('topic'))?params.get('topic')!:'all';
 input.value=params.get('q')||'';
 if([...year.options].some(o=>o.value===params.get('year')))year.value=params.get('year')!;
 function filter(){
  const terms=input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);let total=0;
  for(const paper of papers){const matchText=terms.every(t=>paper.dataset.search!.includes(t));const matchTopic=selectedTopic==='all'||JSON.parse(paper.dataset.topics!).includes(selectedTopic);const matchYear=year.value==='all'||paper.dataset.year===year.value;paper.hidden=!(matchText&&matchTopic&&matchYear);if(!paper.hidden)total++;}
  count.textContent=`${total} of ${papers.length} papers`;
  document.getElementById('paper-empty')!.hidden=total>0;
  topics.forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.topic===selectedTopic)));
  const state=new URLSearchParams();if(input.value.trim())state.set('q',input.value.trim());if(selectedTopic!=='all')state.set('topic',selectedTopic);if(year.value!=='all')state.set('year',year.value);
  history.replaceState(null,'',location.pathname+(state.size?'?'+state.toString():''));
 }
 input.addEventListener('input',filter);year.addEventListener('change',filter);
 topics.forEach(t=>t.addEventListener('click',()=>{selectedTopic=t.dataset.topic!;filter();}));
 document.getElementById('clear-paper-filters')?.addEventListener('click',()=>{input.value='';year.value='all';selectedTopic='all';filter();});
 const viewButtons=[...root.querySelectorAll<HTMLButtonElement>('[data-view]')];
 function setView(view:string){document.getElementById('paper-results')!.classList.toggle('grid-view',view==='grid');viewButtons.forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view));});}
 viewButtons.forEach(b=>b.addEventListener('click',()=>{const view=b.dataset.view!;setView(view);try{sessionStorage.setItem('paper-view',view);}catch{}}));
 try{setView(sessionStorage.getItem('paper-view')||'list');}catch{}
 filter();
}
