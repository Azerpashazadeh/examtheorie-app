const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {sample}=require('./assets/chapter-quiz.js');
const source=fs.readFileSync(path.join(__dirname,'assets/chapter-quiz.js'),'utf8');
let pages=0,total=0;
for(const lang of ['en','tr','nl','ar'])for(const file of fs.readdirSync(path.join(__dirname,lang)).filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(path.join(__dirname,lang,file),'utf8');
  const match=html.match(/<script type="application\/json" id="chapter-quiz-data">([\s\S]*?)<\/script>/);
  assert(match,`${lang}/${file} bank missing`);
  assert.equal((html.match(/id="chapter-quiz-data"/g)||[]).length,1);
  const data=JSON.parse(match[1]),pool=data.questions;
  assert(pool.length>0);total+=pool.length;pages++;
  assert.equal(new Set(pool.map(q=>q.q+(q.code||''))).size,pool.length);
  for(const q of pool){assert.equal(new Set(q.opts).size,4);assert(q.exp&&q.topic);assert(q.ans>=0&&q.ans<4);}
  const sets=new Set();
  for(let i=0;i<100;i++){
    const selected=sample(pool);assert.equal(selected.length,Math.min(15,pool.length));
    assert.equal(new Set(selected.map(q=>q.q+(q.code||''))).size,selected.length);
    sets.add(selected.map(q=>q.q+(q.code||'')).sort().join('|'));
    for(const q of selected){const original=pool.find(p=>p.q===q.q&&p.code===q.code);assert.equal(q.opts[q.ans],original.opts[original.ans]);}
  }
  if(pool.length>15)assert(sets.size>1);
  // Run the deployed event handlers with a minimal DOM, without a browser/network.
  class Element {
    constructor(tag){this.tagName=tag;this.children=[];this.style={};this.attrs={};this.events={};this.hidden=false;this.textContent='';this.className='';this.classList={add:(s)=>{this.className+=' '+s;}};}
    append(...nodes){this.children.push(...nodes);}
    replaceChildren(...nodes){this.children=nodes;}
    setAttribute(k,v){this.attrs[k]=v;}
    addEventListener(k,fn){(this.events[k]??=[]).push(fn);}
    focus(){document.activeElement=this;}
    click(){if(!this.disabled)(this.events.click||[]).forEach(fn=>fn({target:this}));}
    showModal(){this.open=true;}
    close(){this.open=false;(this.events.close||[]).forEach(fn=>fn());}
    find(test){return test(this)?this:this.children.map(c=>c.find?.(test)).find(Boolean);}
    all(test){return [...(test(this)?[this]:[]),...this.children.flatMap(c=>c.all?.(test)||[])];}
  }
  const document={body:new Element('body'),createElement:t=>new Element(t),getElementById:id=>id==='chapter-quiz-data'?{textContent:JSON.stringify(data)}:document.body.find(e=>e.id===id)};
  document.body.style.overflow='auto';
  vm.runInNewContext(source,{document});
  const launcher=document.getElementById('chapter-quiz-launch'),dialog=document.getElementById('chapter-quiz');
  const byText=text=>dialog.find(e=>e.tagName==='button'&&e.textContent===text);
  launcher.click();assert(dialog.open);assert.equal(document.body.style.overflow,'hidden');
  byText(data.labels.start).click();
  let expected=0;
  for(let i=0;i<Math.min(15,pool.length);i++){
    const title=dialog.find(e=>e.className==='cq-question').textContent;
    const opts=dialog.all(e=>e.className==='cq-option');
    let candidates=pool.filter(q=>q.q===title);
    const image=dialog.find(e=>e.className==='cq-image');
    if(image)candidates=candidates.filter(q=>q.image===image.src);
    const question=candidates[0];assert(question);
    const correct=opts.findIndex(o=>o.children[1].textContent===question.opts[question.ans]);
    const choice=i%2===0?correct:(correct+1)%4;
    if(choice===correct)expected++;
    opts[choice].click();opts[choice].click();assert(opts.every(o=>o.disabled));
    byText(i<Math.min(15,pool.length)-1?data.labels.next:data.labels.results).click();
  }
  const score=dialog.find(e=>e.className==='cq-circle').children[0].textContent;assert.equal(Number(score),expected);
  byText(data.labels.review).click();assert.equal(dialog.find(e=>e.className==='cq-review').hidden,false);
  byText(data.labels.hideReview).click();assert.equal(dialog.find(e=>e.className==='cq-review').hidden,true);
  byText(data.labels.retry).click();assert(dialog.find(e=>e.className==='cq-question'));
  dialog.close();assert.equal(document.body.style.overflow,'auto');assert.equal(document.activeElement,launcher);
}
assert.equal(pages,36);
console.log(`PASS: ${pages} pages, ${total} localized questions; sampling, remapping, no repeats, answer locking, scores, review, retry and close.`);
for(const n of [1,9,10,14,15,20,50]){
 const pool=Array.from({length:n},(_,i)=>({q:String(i),opts:['a','b','c','d'],ans:2}));
 assert.equal(sample(pool).length,Math.min(n,15));
}
console.log('PASS: pool sizes below, at and above 15.');
