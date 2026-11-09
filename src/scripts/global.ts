const base = document.body.dataset.base || '/';
const menu = document.getElementById('menu-toggle');
menu?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.body.classList.remove('nav-open');
    menu?.setAttribute('aria-expanded', 'false');
  }
});
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog => {
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close(); } });
});
// Fetch the small search index only when search is first opened.
type SearchEntry = {title:string; url:string; kind:string; text:string};
let searchEntries:SearchEntry[]|null = null;
let indexPromise:Promise<SearchEntry[]>|null = null;
const searchDialog=document.getElementById('search-dialog') as HTMLDialogElement;
const searchInput=document.getElementById('site-search') as HTMLInputElement;
const searchResults=document.getElementById('search-results')!;
const searchStatus=document.getElementById('search-status')!;
function showResults(){
  const query=searchInput.value.trim().toLowerCase();
  searchResults.replaceChildren();
  if(!query){searchStatus.textContent='Start typing to search the site.';return;}
  if(!searchEntries){searchStatus.textContent='Loading the search index…';return;}
  const words=query.split(/\s+/);
  const found=searchEntries.filter(e=>words.every(w=>(e.title+' '+e.text).toLowerCase().includes(w))).slice(0,12);
  searchStatus.textContent=found.length?`${found.length} result${found.length===1?'':'s'}`:'No results. Try a title, author, or topic.';
  for(const entry of found){const li=document.createElement('li'),link=document.createElement('a'),kind=document.createElement('span');link.href=entry.url;link.append(document.createTextNode(entry.title));kind.textContent=entry.kind;link.append(kind);li.append(link);searchResults.append(li);}
}
async function openSearch(){
  if(!searchDialog.open)searchDialog.showModal();
  searchInput.focus();
  if(!searchEntries){
    try{indexPromise ||= fetch(base+'search-index.json').then(r=>{if(!r.ok)throw Error('Index unavailable');return r.json();});searchEntries=await indexPromise;showResults();}
    catch{indexPromise=null;searchStatus.textContent='Search could not load. Please use the navigation links or try again.';}
  }
}
document.querySelectorAll('[data-open-search]').forEach(b=>b.addEventListener('click',openSearch));
searchInput?.addEventListener('input',showResults);
document.addEventListener('keydown',e=>{
  const target=e.target as HTMLElement;const editing=target.matches('input, textarea, select, [contenteditable]');
  if(((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')||(!editing&&e.key==='/')){e.preventDefault();openSearch();}
});
// Citation files are downloaded on request, never during page load.
const citationDialog=document.getElementById('citation-dialog') as HTMLDialogElement;
const citationContent=document.getElementById('citation-content')!;
const citationStatus=document.getElementById('citation-status')!;
const citationDownload=document.getElementById('citation-download') as HTMLAnchorElement;
let citationRequest=0;
document.querySelectorAll<HTMLAnchorElement>('[data-cite]').forEach(link=>link.addEventListener('click',async e=>{
  e.preventDefault();const request=++citationRequest;const url=link.dataset.cite!;citationDownload.href=url;citationContent.textContent='Loading citation…';citationStatus.textContent='';citationDialog.showModal();
  try{const response=await fetch(url);if(!response.ok)throw Error('Citation unavailable');const text=await response.text();if(request===citationRequest)citationContent.textContent=text;}
  catch{if(request===citationRequest){citationContent.textContent='';citationStatus.textContent='Could not load this citation. Use the download link below.';}}
}));
document.getElementById('citation-copy')?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(citationContent.textContent||'');citationStatus.textContent='Copied to clipboard.';}
  catch{citationStatus.textContent='Select the citation text above to copy it, or download the .bib file.';}
});
document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach(b=>b.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(b.dataset.copyEmail!);document.getElementById('email-status')!.textContent='Email address copied.';}
  catch{document.getElementById('email-status')!.textContent=b.dataset.copyEmail!;}
}));
// Third-party players are created only after an explicit click.
document.querySelectorAll<HTMLButtonElement>('[data-youtube]').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.youtube;if(!id||!/^[\w-]{11}$/.test(id))return;
  const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;frame.title=button.getAttribute('aria-label')||'Video';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';frame.allowFullscreen=true;button.replaceWith(frame);
}));
