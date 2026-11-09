import {getCollection} from 'astro:content';
import {href} from '../lib/site';
export async function GET({site}:{site:URL}){
 const papers=await getCollection('papers',({data})=>!data.draft);const posts=await getCollection('posts',({data})=>!data.draft);
 const paths=['','research/','writing/','news/','about/','coffee/','papers/noiseAudits/',...papers.map(p=>`papers/${p.id}/`),...posts.map(p=>`writing/${p.id}/`)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${new URL(href(p),site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}
