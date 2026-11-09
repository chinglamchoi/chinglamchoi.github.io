import {writeFile,mkdir,access} from 'node:fs/promises';
const [kind,...words]=process.argv.slice(2),title=words.join(' ');
if(!['post','paper'].includes(kind)||!title){console.error('Usage: npm run new:post -- "Title" or npm run new:paper -- "Title"');process.exit(1);}
const slug=title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
if(!slug){console.error('Please use a title containing letters or numbers, then edit it in the file.');process.exit(1);}
const dir=`src/content/${kind==='post'?'posts':'papers'}`,path=`${dir}/${slug}.md`;
try{await access(path);console.error(`Already exists: ${path}`);process.exit(1);}catch{}
const common=`title: ${JSON.stringify(title)}\n`;
const fields=kind==='post'?`description: "Add a short description."\ndate: ${new Date().toISOString().slice(0,10)}\ncategory: Notes\ntags: []\ndraft: true\n`:`year: ${new Date().getUTCFullYear()}\nvenue: Preprint\nauthors: [Ching Lam Choi]\nsummary: "Add the paper summary."\ntopics: [Representation learning]\nimage: naudits\npdf: docs/your-paper.pdf\nbib: bibs/your-paper.bib\nfeatured: false\noral: false\norder: 0\ndraft: true\n`;
await mkdir(dir,{recursive:true});await writeFile(path,`---\n${common}${fields}---\n\nWrite here in Markdown.\n`);console.log(`Created ${path}. It stays hidden until you set draft: false. Replace all sample fields before publishing.`);
