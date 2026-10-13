#!/usr/bin/env node
// Generates a compact, first-party static media catalog from an independently
// maintained snapshot. No chapter text, credentials, or personal data is copied.
import {normalizeWebnovelIndex} from '../src/webnovels-v49.js';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'public/webnovels/catalog.json');
const inputFile=process.argv.find(x=>x.startsWith('--file='))?.slice('--file='.length);
const strict=process.argv.includes('--strict');
const source=process.env.MEDIATOK_WEBNOVELS_SOURCE ||
 'https://varun-patkar.github.io/webnovel-advanced-search/data/books-index.json';
let payload;
try{
 if(inputFile){payload=JSON.parse(await readFile(resolve(inputFile),'utf8'));}
 else{
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),30000);
  try{const res=await fetch(source,{signal:ctrl.signal,headers:{'Accept':'application/json'}});
   if(!res.ok)throw Error(`HTTP ${res.status}`);
   payload=await res.json();
  }finally{clearTimeout(timer)}
 }
 const rows=normalizeWebnovelIndex(payload);
 // Do not replace a good published snapshot with a partial provider response.
 if(rows.length<500)throw Error(`Source only contained ${rows.length} valid novel titles; refusing to replace catalog`);
 try{
  const existing=JSON.parse(await readFile(output,'utf8'));
  const previous=Array.isArray(existing?.books)?existing.books.length:0;
  if(previous>1000 && rows.length<Math.floor(previous*.8))throw Error(`Catalog shrink detected: ${previous} -> ${rows.length}; keeping previous snapshot`);
 }catch(e){if(e.code!=='ENOENT' && !String(e.message||'').includes('Unexpected token') && !String(e.message||'').includes('JSON'))throw e;}
 await mkdir(dirname(output),{recursive:true});
 await writeFile(output,JSON.stringify({generatedAt:new Date().toISOString(),source:'WebNovel public snapshot',books:rows}));
 console.log(`Synced ${rows.length.toLocaleString()} unique webnovels into public/webnovels/catalog.json`);
}catch(e){
 console.error('Webnovel sync unavailable:',String(e?.message||e));
 console.error('The working search and 101 offline titles remain available. Runtime directory discovery remains enabled.');
 if(strict)process.exitCode=1;
}
