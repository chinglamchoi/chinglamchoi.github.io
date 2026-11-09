import {readdir,readFile,stat} from 'node:fs/promises';
import {join,resolve,extname} from 'node:path';
const root=resolve('dist'),base='/';let checked=0,errors=[];
async function walk(dir){let files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
const htmlFiles=(await walk(root)).filter(p=>p.endsWith('.html'));
async function exists(p){try{return await stat(p);}catch{return null;}}
for(const file of htmlFiles){
 const html=await readFile(file,'utf8');
 for(const match of html.matchAll(/(?:href|src|data-cite)="([^"]+)"/g)){
  const ref=match[1].replaceAll('&amp;','&');if(/^(https?:|mailto:|data:|tel:|javascript:)/.test(ref))continue;
  const pagePath=file.slice(root.length).replace(/index\.html$/,'');const url=new URL(ref,`https://test.invalid${base.replace(/\/$/,'')}${pagePath}`);
  if(!url.pathname.startsWith(base)){errors.push(`${file}: base-path escape ${ref}`);continue;}
  const path=join(root,decodeURIComponent(url.pathname.slice(base.length)));const info=await exists(path);const target=info?.isDirectory()?join(path,'index.html'):path;
  if(!await exists(target)){errors.push(`${file}: missing ${ref}`);continue;}
  if(url.hash && extname(target)==='.html'){
   const targetHtml=target===file?html:await readFile(target,'utf8');const id=decodeURIComponent(url.hash.slice(1));
   if(!targetHtml.includes(`id="${id}"`)&&!targetHtml.includes(`id='${id}'`))errors.push(`${file}: missing anchor ${ref}`);
  }
  checked++;
 }
}
const index=JSON.parse(await readFile(join(root,'search-index.json'),'utf8'));
for(const e of index){if(!e.url.startsWith(base))errors.push(`Search entry outside base: ${e.url}`);}
console.log(`${htmlFiles.length} HTML pages; ${checked} local references; ${index.length} search entries.`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('All local links, assets, citations, and anchors resolve.');
