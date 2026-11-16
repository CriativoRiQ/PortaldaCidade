/* Portal da Cidade — banco local (modo offline/visualização)
   Usado automaticamente quando o portal é aberto fora do Claude.
   Simula a mesma API do banco real (collection/doc/onSnapshot/set/delete)
   e salva tudo no localStorage deste navegador. */
(function(){
  const KEY='portal_cidade_db_v1';
  let store;
  try{const raw=localStorage.getItem(KEY);store=new Map(Object.entries(raw?JSON.parse(raw):(window.__SEED||{})))}catch(e){store=new Map(Object.entries(window.__SEED||{}))}
  const subs=new Set();
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(Object.fromEntries(store)))}catch(e){console.warn('localStorage cheio',e)}};
  const meta={fromCache:false,hasPendingWrites:false};
  const snapDoc=(id,d)=>({id,exists:d!==undefined,data:()=>d===undefined?undefined:JSON.parse(JSON.stringify(d)),metadata:meta});
  const notify=()=>setTimeout(()=>subs.forEach(f=>f()),0);
  const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  function query(path){const n=path.split('/').length;const docs=[...store.entries()].filter(([k])=>k.startsWith(path+'/')&&k.split('/').length===n+1).map(([k,v])=>snapDoc(k.split('/').pop(),v));return{docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:meta}}
  function coll(path){return{path,doc:id=>docRef(path+'/'+(id||rid())),add:async d=>{const r=docRef(path+'/'+rid());await r.set(d);return r},get:async()=>query(path),onSnapshot(next){const f=()=>next(query(path));subs.add(f);setTimeout(f,0);return()=>subs.delete(f)},where(){return this},orderBy(){return this},limit(){return this}}}
  function docRef(path){const id=path.split('/').pop();return{path,id,get:async()=>snapDoc(id,store.get(path)),set:async d=>{store.set(path,JSON.parse(JSON.stringify(d)));persist();notify()},update:async d=>{if(!store.has(path))throw{code:'invalid_argument'};store.set(path,{...store.get(path),...JSON.parse(JSON.stringify(d))});persist();notify()},delete:async()=>{store.delete(path);persist();notify()},onSnapshot(next){const f=()=>next(snapDoc(id,store.get(path)));subs.add(f);setTimeout(f,0);return()=>subs.delete(f)},collection:p=>coll(path+'/'+p)}}
  const db={doc:docRef,collection:coll};
  const user={id:async()=>'local-admin',isOwner:()=>true,canEdit:()=>true,can:()=>true,me:async()=>({id:'local-admin'}),profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{name:i==='local-admin'?'Administrador local':''}]))};
  const toDataURL=b=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(b)});
  const assets={upload:async b=>({id:null,url:await toDataURL(b),sizeBytes:b.size}),delete:async()=>{},list:async()=>({assets:[]})};
  window.__LOCAL_CLAUDE={use:async n=>({db,user,assets}[n]||null)};
  window.__resetLocalDb=()=>{localStorage.removeItem(KEY);location.reload()};
})();
