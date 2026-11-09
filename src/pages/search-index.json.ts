import { getCollection } from 'astro:content';
import { href } from '../lib/site';
export async function GET() {
  const papers=await getCollection('papers',({data})=>!data.draft);
  const posts=await getCollection('posts',({data})=>!data.draft);
  const pages=[{title:'About Ching Lam',url:href(),kind:'Page',text:'MIT CSAIL PhD biography contact email CV'}, {title:'Coffee hours',url:href('coffee/'),kind:'Page',text:'Calendar booking conversation Calendly'}, {title:'Beyond research',url:href('about/'),kind:'Page',text:'Climbing hiking music reading books literature'}, {title:'News & talks',url:href('news/'),kind:'Page',text:'News talks visits milestones service community'}];
  return new Response(JSON.stringify([...pages,...papers.map(p=>({title:p.data.title,url:href(p.data.project||`papers/${p.id}/`),kind:`${p.data.venue} ${p.data.year}`,text:`${p.data.authors.join(' ')} ${p.data.topics.join(' ')} ${p.data.summary}`})),...posts.map(p=>({title:p.data.title,url:href(`writing/${p.id}/`),kind:'Writing',text:p.data.description+' '+p.data.tags.join(' ')}))]),{headers:{'Content-Type':'application/json'}});
}
