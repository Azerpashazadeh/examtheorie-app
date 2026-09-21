/* Shared chapter quiz. Question banks are embedded in each page. */
(() => {
  'use strict';
  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function sample(pool) {
    return shuffle(pool).slice(0, Math.min(15, pool.length)).map(q => {
      const indices = shuffle(q.opts.map((_, i) => i));
      return {...q, opts: indices.map(i => q.opts[i]), ans: indices.indexOf(q.ans)};
    });
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {sample};
    return;
  }
  const dataNode = document.getElementById('chapter-quiz-data');
  if (!dataNode) return;
  const {questions: pool, labels: t} = JSON.parse(dataNode.textContent);
  if (!pool.length) return;
  const count = Math.min(15, pool.length);
  const format = (str, values = {}) => str.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (text, handler, secondary = false) => {
    const node = el('button', secondary ? 'cq-secondary' : 'cq-primary', text);
    node.type = 'button';
    node.addEventListener('click', handler);
    return node;
  };
  const launcher = button(format(t.launch, {n:count}), () => {
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    showStart();
  });
  launcher.id = 'chapter-quiz-launch';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'chapter-quiz');
  const language = (document.documentElement?.lang || 'en').toLowerCase().slice(0, 2);
  const menuLabels = {
    en: '← Back to Menu',
    tr: '← Menüye Dön',
    nl: '← Terug naar menu',
    ar: '← العودة إلى القائمة'
  };
  const menuReturn = button(menuLabels[language] || menuLabels.en, () => {
    const chapterFile = window.location.pathname.split('/').pop() || '';
    const target = `../../index.html?open=theory&chapter=${encodeURIComponent(chapterFile)}`;
    window.location.href = target;
  });
  menuReturn.id = 'chapter-menu-return';
  const fullQuizLabel = launcher.textContent;
  const fullMenuLabel = menuReturn.textContent;
  const compactMenuLabels = {en:'☰ Menu',tr:'☰ Menü',nl:'☰ Menu',ar:'☰ القائمة'};
  const browserWindow = typeof window !== 'undefined' ? window : null;
  const setResponsiveButtonLabels = () => {
    const compact = browserWindow ? browserWindow.innerWidth <= 480 : false;
    launcher.textContent = compact ? '📝 Quiz' : fullQuizLabel;
    menuReturn.textContent = compact ? (compactMenuLabels[language] || compactMenuLabels.en) : fullMenuLabel;
  };
  setResponsiveButtonLabels();
  browserWindow?.addEventListener('resize', setResponsiveButtonLabels, {passive:true});
  const dialog = el('dialog');
  dialog.id = 'chapter-quiz';
  dialog.setAttribute('aria-labelledby','cq-title');
  const panel = el('div','cq-panel');
  const header = el('header','cq-header');
  const title = el('h2','',t.title); title.id = 'cq-title';
  const badge = el('span','cq-badge');
  const close = button('×', () => dialog.close(), true);
  close.classList.add('cq-close'); close.setAttribute('aria-label',t.close);
  header.append(title,badge,close);
  const progress = el('progress','cq-progress');
  progress.max = count; progress.value = 0; progress.setAttribute('aria-label',t.progress);
  const body = el('div','cq-body');
  panel.append(header,progress,body); dialog.append(panel);
  document.body.append(menuReturn,launcher,dialog);
  let session=[], index=0, answers=[], locked=false, previousOverflow='';
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;launcher.focus();});
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  function clear() {body.replaceChildren();body.scrollTop=0;}
  function focus(node) {node.tabIndex=-1;node.focus({preventScroll:true});}
  function showStart() {
    clear(); progress.value=0; badge.textContent=format(t.count,{n:count});
    const intro = el('div','cq-start');
    intro.append(el('div','cq-icon','📝'),el('h3','',t.startTitle),el('p','',format(t.intro,{n:count,pool:pool.length})));
    const chips=el('div','cq-chips');
    [format(t.count,{n:count}),t.random,t.instant].forEach(text=>chips.append(el('span','cq-chip',text)));
    const start=button(t.start,startQuiz);intro.append(chips,start);body.append(intro);start.focus();
  }
  function startQuiz() {session=sample(pool);index=0;answers=[];renderQuestion();}
  function renderQuestion() {
    clear();locked=false;progress.value=index;badge.textContent=`${index+1} / ${count}`;
    const q=session[index];
    const meta=el('div','cq-meta');meta.append(el('span','',format(t.question,{n:index+1,total:count})),el('span','cq-chip',q.topic));
    const question=el('h3','cq-question',q.q);body.append(meta,question);
    if(q.image){
      const img=el('img','cq-image');img.src=q.image;img.alt=t.signImage;
      img.addEventListener('error',()=>{img.replaceWith(el('p','',format(t.imageUnavailable,{code:q.code})));});
      body.append(img);
    }
    const options=el('div','cq-options');
    const feedback=el('div','cq-feedback');feedback.setAttribute('role','status');feedback.hidden=true;
    const nav=el('div','cq-actions');
    q.opts.forEach((option,choice)=>{
      const optionButton=button('',()=>{
        if(locked)return;locked=true;
        const correct=choice===q.ans;answers.push({q,choice,correct});
        [...options.children].forEach((node,i)=>{node.disabled=true;if(i===q.ans)node.classList.add('cq-correct');else if(i===choice)node.classList.add('cq-wrong');});
        feedback.hidden=false;feedback.classList.add(correct?'cq-correct':'cq-wrong');
        feedback.append(el('strong','',correct?t.correct:format(t.incorrect,{answer:q.opts[q.ans]})),el('p','',q.exp));
        if(q.source){const link=el('a','',t.readSection);link.href='#'+q.source;link.addEventListener('click',()=>dialog.close());feedback.append(link);}
        nav.append(button(index<count-1?t.next:t.results,()=>{index++;index<count?renderQuestion():showResults();}));
        progress.value=index+1;
      });
      optionButton.className='cq-option';optionButton.append(el('span','cq-letter',String.fromCharCode(65+choice)),el('span','',option));options.append(optionButton);
    });
    body.append(options,feedback,nav);focus(question);
  }
  function showResults() {
    clear();progress.value=count;badge.textContent=t.complete;
    const score=answers.filter(a=>a.correct).length;
    const result=el('div','cq-result');
    const circle=el('div','cq-circle');circle.append(el('strong','',String(score)),el('span','',format(t.outOf,{n:count})));
    const heading=el('h3','',score/count>=.7?t.wellDone:t.keepPractising);
    result.append(circle,heading,el('p','',t.resultHint));
    const chips=el('div','cq-chips');chips.append(el('span','cq-chip cq-correct',format(t.correctCount,{n:score})),el('span','cq-chip cq-wrong',format(t.wrongCount,{n:count-score})));
    const actions=el('div','cq-actions');const review=el('div','cq-review');review.hidden=true;
    const reviewButton=button(t.review,()=>{
      review.hidden=!review.hidden;reviewButton.textContent=review.hidden?t.review:t.hideReview;
      reviewButton.setAttribute('aria-expanded',String(!review.hidden));
    },true);reviewButton.setAttribute('aria-expanded','false');
    actions.append(button(t.retry,startQuiz),reviewButton);
    answers.forEach((a,i)=>{
      const card=el('article',a.correct?'cq-review-card cq-correct':'cq-review-card cq-wrong');
      card.append(el('h4','',`${i+1}. ${a.q.q}`),el('p','',format(t.yourAnswer,{answer:a.q.opts[a.choice]})));
      if(!a.correct)card.append(el('p','',format(t.correctAnswer,{answer:a.q.opts[a.q.ans]})));
      card.append(el('p','',a.q.exp));review.append(card);
    });
    result.append(chips,actions);body.append(result,review);focus(heading);
  }
})();
