/*!
 * ExamTheorie Theory Audiobook, Sign Catalogue & Chapter Quiz TTS (theory-tts.js)
 * Loaded automatically on all 63 theory pages across 7 languages (en, nl, tr, ar, ru, fa, es).
 */
(function () {
  'use strict';

  var TTS = window.ExamTheorieTTS;
  if (!TTS || !TTS.enabled) return;

  var pageLang = TTS.detectPageShortLang();
  var rtl = TTS.isRtlLang(pageLang);
  var t = TTS.getStrings(pageLang);

  var SVG_SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
  var SVG_HEADPHONES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>';
  var SVG_LIST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="4" cy="6" r="1" fill="currentColor"></circle><circle cx="4" cy="12" r="1" fill="currentColor"></circle><circle cx="4" cy="18" r="1" fill="currentColor"></circle></svg>';
  var SVG_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>';
  var SVG_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"></rect><rect x="14" y="5" width="4" height="14" rx="1.2"></rect></svg>';
  var HTML_EQ = '<span class="et-th-eq" aria-hidden="true"><i></i><i></i><i></i></span>';
  var HTML_SPIN = '<span class="et-th-spin" aria-hidden="true"></span>';

  function injectStyles() {
    if (document.getElementById('et-theory-tts-styles')) return;
    var s = document.createElement('style');
    s.id = 'et-theory-tts-styles';
    s.textContent = [
      '.et-th-audiobar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:13px 18px;margin:0 0 28px;background:#ffffff;border:1.5px solid #d8d0be;border-radius:14px;box-shadow:0 8px 24px rgba(24,18,14,.06);font-family:Outfit,"Plus Jakarta Sans",system-ui,sans-serif}',
      '.et-th-mainbtn{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:999px;border:0;background:linear-gradient(135deg,#0061ff,#008cff);color:#ffffff;font-family:inherit;font-size:13.5px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(0,97,255,.24);transition:all .16s ease;white-space:nowrap}',
      '.et-th-mainbtn:hover{transform:translateY(-1px);box-shadow:0 11px 25px rgba(0,97,255,.34)}',
      '.et-th-mainbtn svg{width:16px;height:16px;flex-shrink:0}',
      '.et-th-mainbtn.is-paused{background:#eff6ff;color:#0061ff;border:1.5px solid #0061ff;box-shadow:none}',
      '.et-th-controls{display:inline-flex;flex-wrap:wrap;align-items:center;gap:8px;margin-inline-start:auto}',
      '.et-th-vseg,.et-th-rseg{display:inline-flex;align-items:center;background:#f4f1ea;border:1px solid #dfd7c5;border-radius:999px;padding:2px;height:36px}',
      '.et-th-segbtn{border:0;background:transparent;color:#574c41;font-family:Outfit,system-ui,sans-serif;font-size:12px;font-weight:700;padding:0 10px;height:30px;border-radius:999px;cursor:pointer;white-space:nowrap;transition:all .14s}',
      '.et-th-segbtn.is-selected{background:#ffffff;color:#0061ff;box-shadow:0 2px 6px rgba(24,18,14,.09)}',
      '.section-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}',
      '.et-th-secbtn{display:inline-flex;align-items:center;gap:6px;height:31px;padding:0 12px;border-radius:999px;border:1px solid #d5cebe;background:#ffffff;color:#2b2118;font-family:Outfit,system-ui,sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap}',
      '.et-th-secbtn:hover{border-color:#0061ff;color:#0061ff;background:#eff6ff}',
      '.et-th-secbtn.is-active{background:#0061ff;border-color:#0061ff;color:#ffffff}',
      '.et-th-secbtn.is-paused{background:#eff6ff;border-color:#0061ff;color:#0061ff}',
      '.et-th-secbtn svg{width:13.5px;height:13.5px}',
      '.et-th-card-host{position:relative}',
      '.et-th-cardbtn{position:absolute;top:10px;inset-inline-end:10px;width:31px;height:31px;border-radius:50%;border:1px solid rgba(24,18,14,.14);background:rgba(255,255,255,.92);color:#475569;display:inline-grid;place-items:center;cursor:pointer;z-index:4;transition:all .15s;padding:0}',
      '.rule-block.has-image .rule-body{position:relative}',
      '.et-th-cardbtn:hover{border-color:#0061ff;color:#0061ff;background:#eff6ff;transform:scale(1.06)}',
      '.et-th-cardbtn.is-active{background:#0061ff!important;border-color:#0061ff!important;color:#ffffff!important;box-shadow:0 4px 12px rgba(0,97,255,.28)}',
      '.et-th-cardbtn.is-paused{background:#eff6ff!important;border-color:#0061ff!important;color:#0061ff!important}',
      '.et-th-cardbtn svg{width:14px;height:14px}',
      '.et-th-reading-active{outline:2.5px solid #0061ff!important;outline-offset:3px;box-shadow:0 10px 28px rgba(0,97,255,.14)!important;transition:outline .2s,box-shadow .2s}',
      '.sign-card{position:relative}',
      '.sign-card .et-th-signbtn{position:absolute;top:7px;inset-inline-end:7px;width:28px;height:28px;border-radius:50%;border:1px solid rgba(15,23,42,.13);background:rgba(255,255,255,.94);color:#334155;display:inline-grid;place-items:center;cursor:pointer;z-index:3;padding:0;transition:all .14s}',
      '.sign-card .et-th-signbtn:hover{border-color:#0061ff;color:#0061ff;background:#eff6ff}',
      '.sign-card .et-th-signbtn.is-active{background:#0061ff;border-color:#0061ff;color:#ffffff}',
      '.sign-card .et-th-signbtn svg{width:13px;height:13px}',
      /* Floating Audiobook Dock */
      '.et-th-dock{position:fixed;left:50%;bottom:max(20px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:1120;display:none;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(15,23,42,.95);backdrop-filter:blur(14px);color:#ffffff;font-family:Outfit,system-ui,sans-serif;box-shadow:0 16px 40px rgba(15,23,42,.34);border:1px solid rgba(255,255,255,.14)}',
      '.et-th-dock.is-open{display:inline-flex}',
      '.et-th-dock button{border:0;background:rgba(255,255,255,.12);color:#ffffff;width:32px;height:32px;border-radius:50%;display:inline-grid;place-items:center;cursor:pointer;font-size:13px;font-weight:800;padding:0}',
      '.et-th-dock button:hover{background:#0061ff}',
      '.et-th-dock button svg{width:14px;height:14px}',
      '.et-th-dock-pos{font-size:12px;font-weight:700;padding:0 6px;color:#cbd5e1;white-space:nowrap}',
      /* Chapter Quiz Modal TTS */
      '.et-cq-ttsbar{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin:0 0 14px}',
      '.et-cq-pill{display:inline-flex;align-items:center;gap:6px;height:33px;padding:0 12px;border-radius:999px;border:1.5px solid rgba(0,97,255,.24);background:#f5f9ff;color:#0b3b8c;font-family:Outfit,system-ui,sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap}',
      '.et-cq-pill:hover{background:#e6f0ff;border-color:#0061ff;color:#0061ff}',
      '.et-cq-pill.is-active{background:#0061ff!important;border-color:#0061ff!important;color:#ffffff!important}',
      '.et-cq-pill.is-paused{background:#eff6ff!important;border-color:#0061ff!important;color:#0061ff!important}',
      '.et-cq-pill svg{width:14px;height:14px}',
      '.et-cq-vseg{display:inline-flex;align-items:center;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:999px;padding:2px;height:33px;margin-inline-start:auto}',
      '.et-cq-vseg button{border:0;background:transparent;color:#475569;font-family:Outfit,system-ui,sans-serif;font-size:11.5px;font-weight:700;padding:0 9px;height:27px;border-radius:999px;cursor:pointer}',
      '.et-cq-vseg button.is-selected{background:#ffffff;color:#0061ff;box-shadow:0 1px 4px rgba(15,23,42,.1)}',
      '#chapter-quiz .cq-option{align-items:center}',
      '#chapter-quiz .cq-option>span:nth-child(2){flex:1;min-width:0}',
      '.et-cq-optspk{margin-inline-start:auto;flex-shrink:0;width:29px;height:29px;border-radius:50%;border:1px solid #cbd5e1;background:#f8fafc;color:#475569;display:inline-grid;place-items:center;cursor:pointer;pointer-events:auto!important}',
      '.et-cq-optspk:hover{border-color:#0061ff;color:#0061ff;background:#eff6ff}',
      '.et-cq-optspk.is-active{background:#0061ff!important;border-color:#0061ff!important;color:#ffffff!important}',
      '.et-cq-optspk svg{width:13px;height:13px}',
      '.cq-option.et-cq-speaking{outline:2px solid #0061ff!important;outline-offset:1px}',
      '.et-cq-fbwrap{margin-top:10px;display:flex;justify-content:flex-end}',
      '.et-th-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px;width:12px;justify-content:center}',
      '.et-th-eq i{display:block;width:2.3px;background:currentColor;border-radius:2px;animation:etThEq .75s ease-in-out infinite alternate}',
      '.et-th-eq i:nth-child(1){height:4px;animation-delay:0s}',
      '.et-th-eq i:nth-child(2){height:11px;animation-delay:.18s}',
      '.et-th-eq i:nth-child(3){height:7px;animation-delay:.34s}',
      '@keyframes etThEq{0%{height:4px}100%{height:12px}}',
      '.et-th-spin{width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:etThSpin .65s linear infinite}',
      '@keyframes etThSpin{to{transform:rotate(360deg)}}',
      '@media(max-width:640px){.et-th-audiobar{padding:11px 13px;gap:8px}.et-th-controls{width:100%;margin-inline-start:0;justify-content:space-between}.et-th-dock{bottom:76px}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  var btnMap = new Map(); // ownerId -> { btn, kind, icon, label }
  function regBtn(ownerId, btn, kind, icon, label) {
    btnMap.set(ownerId, { btn: btn, kind: kind, icon: icon, label: label || '' });
  }

  function updateBtnVisual(entry, status) {
    var b = entry.btn;
    if (!b || !b.isConnected) return;
    b.classList.remove('is-active', 'is-paused');
    if (entry.kind === 'icon') {
      if (status === 'loading') { b.classList.add('is-active'); b.innerHTML = HTML_SPIN; }
      else if (status === 'playing') { b.classList.add('is-active'); b.innerHTML = HTML_EQ; }
      else if (status === 'paused') { b.classList.add('is-paused'); b.innerHTML = SVG_PLAY; }
      else { b.innerHTML = entry.icon; }
      return;
    }
    if (status === 'loading') {
      b.classList.add('is-active');
      b.innerHTML = HTML_SPIN + '<span>' + t.loading + '</span>';
    } else if (status === 'playing') {
      b.classList.add('is-active');
      b.innerHTML = HTML_EQ + '<span>' + t.pause + '</span>';
    } else if (status === 'paused') {
      b.classList.add('is-paused');
      b.innerHTML = SVG_PLAY + '<span>' + t.resume + '</span>';
    } else {
      b.innerHTML = entry.icon + '<span>' + entry.label + '</span>';
    }
  }

  function cleanNodeSpeechText(node) {
    var clone = node.cloneNode(true);
    clone.querySelectorAll('button, script, style, .et-th-cardbtn, .et-th-signbtn, .et-th-secbtn, .img-slot').forEach(function (n) { n.remove(); });
    clone.querySelectorAll('div, p, li, h1, h2, h3, h4, br, tr, td, th').forEach(function (b) {
      b.insertAdjacentText('afterend', ' ');
    });
    return String(clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  var dockEl = null;
  var dockPlayBtn = null;
  var dockPosEl = null;

  function ensureDock() {
    if (dockEl) return dockEl;
    dockEl = document.createElement('div');
    dockEl.className = 'et-th-dock';
    if (rtl) dockEl.dir = 'rtl';

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.title = t.prevPart;
    prevBtn.textContent = rtl ? '⏭' : '⏮';
    prevBtn.addEventListener('click', function () { TTS.jumpInActiveQueue(-1); });

    dockPlayBtn = document.createElement('button');
    dockPlayBtn.type = 'button';
    dockPlayBtn.innerHTML = SVG_PAUSE;
    dockPlayBtn.addEventListener('click', function () {
      var st = TTS.getState();
      if (st.ownerId) {
        TTS.toggleOrPlayQueue(st.ownerId, [], { language: pageLang });
      }
    });

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.title = t.nextPart;
    nextBtn.textContent = rtl ? '⏮' : '⏭';
    nextBtn.addEventListener('click', function () { TTS.jumpInActiveQueue(1); });

    dockPosEl = document.createElement('span');
    dockPosEl.className = 'et-th-dock-pos';
    dockPosEl.textContent = '1 / 1';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.title = t.stop;
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', function () { TTS.stop(); });

    dockEl.append(prevBtn, dockPlayBtn, nextBtn, dockPosEl, closeBtn);
    document.body.appendChild(dockEl);
    return dockEl;
  }

  TTS.onStateChange(function (st) {
    btnMap.forEach(function (entry, id) {
      updateBtnVisual(entry, id === st.ownerId ? st.status : 'idle');
    });

    var isMultiPart = st.ownerId && st.ownerId.indexOf('th-multi-') === 0 && (st.status === 'loading' || st.status === 'playing' || st.status === 'paused');
    if (isMultiPart) {
      ensureDock();
      dockEl.classList.add('is-open');
      dockPosEl.textContent = (st.itemIndex + 1) + ' / ' + st.totalItems;
      dockPlayBtn.innerHTML = st.status === 'paused' ? SVG_PLAY : SVG_PAUSE;
    } else if (dockEl) {
      dockEl.classList.remove('is-open');
    }
  });

  function syncPrefButtons() {
    var p = TTS.getPrefs();
    document.querySelectorAll('[data-et-th-voice]').forEach(function (b) {
      b.classList.toggle('is-selected', b.getAttribute('data-et-th-voice') === p.voice);
    });
    document.querySelectorAll('[data-et-th-rate]').forEach(function (b) {
      b.classList.toggle('is-selected', Number(b.getAttribute('data-et-th-rate')) === p.rate);
    });
  }
  TTS.onPrefsChange(syncPrefButtons);

  function buildTopBar(onPlayAllQueue) {
    var prefs = TTS.getPrefs();
    var bar = document.createElement('div');
    bar.className = 'et-th-audiobar';
    if (rtl) bar.dir = 'rtl';

    if (typeof onPlayAllQueue === 'function') {
      var ownerId = 'th-multi-chapter';
      var mainBtn = document.createElement('button');
      mainBtn.type = 'button';
      mainBtn.className = 'et-th-mainbtn';
      mainBtn.innerHTML = SVG_HEADPHONES + '<span>' + t.audiobookListen + '</span>';
      regBtn(ownerId, mainBtn, 'pill', SVG_HEADPHONES, t.audiobookListen);
      mainBtn.addEventListener('click', function () {
        var queue = onPlayAllQueue();
        if (queue && queue.length) {
          TTS.toggleOrPlayQueue(ownerId, queue, { language: pageLang });
        }
      });
      bar.appendChild(mainBtn);
    }

    var ctrls = document.createElement('div');
    ctrls.className = 'et-th-controls';

    var vseg = document.createElement('div');
    vseg.className = 'et-th-vseg';
    [
      { id: 'capella', label: '👩 ' + t.female },
      { id: 'orion', label: '👨 ' + t.male }
    ].forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'et-th-segbtn' + (prefs.voice === v.id ? ' is-selected' : '');
      b.setAttribute('data-et-th-voice', v.id);
      b.textContent = v.label;
      b.addEventListener('click', function () {
        var st = TTS.getState();
        TTS.setPrefs({ voice: v.id });
        if (st.status === 'playing' || st.status === 'paused') TTS.stop();
      });
      vseg.appendChild(b);
    });

    var rseg = document.createElement('div');
    rseg.className = 'et-th-rseg';
    [0.9, 1, 1.15, 1.25].forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'et-th-segbtn' + (prefs.rate === r ? ' is-selected' : '');
      b.setAttribute('data-et-th-rate', String(r));
      b.textContent = r + 'x';
      b.addEventListener('click', function () { TTS.setPrefs({ rate: r }); });
      rseg.appendChild(b);
    });

    ctrls.append(vseg, rseg);
    bar.appendChild(ctrls);
    return bar;
  }

  function makeHighlightQueueItem(elNode, txt) {
    return {
      text: txt,
      language: pageLang,
      onStart: function () {
        document.querySelectorAll('.et-th-reading-active').forEach(function (x) { x.classList.remove('et-th-reading-active'); });
        elNode.classList.add('et-th-reading-active');
        var rect = elNode.getBoundingClientRect();
        if (rect.top < 70 || rect.bottom > window.innerHeight - 90) {
          try { elNode.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
        }
      },
      onEnd: function () {
        elNode.classList.remove('et-th-reading-active');
      }
    };
  }

  function enhanceSignCataloguePage(mainPage) {
    var signCards = mainPage.querySelectorAll('.sign-card');
    if (!signCards.length) return false;

    var bar = buildTopBar(null);
    mainPage.insertBefore(bar, mainPage.firstChild);

    signCards.forEach(function (card, idx) {
      var code = (card.querySelector('.sign-code')?.textContent || '').trim();
      var name = (card.querySelector('.sign-name')?.textContent || '').trim();
      var spoken = code && name ? (code + ' — ' + name) : (name || code);
      if (!spoken) return;

      var ownerId = 'th-sign-' + idx;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'et-th-signbtn';
      btn.title = t.listenCard + ': ' + code;
      btn.setAttribute('aria-label', t.listenCard + ' ' + code);
      btn.innerHTML = SVG_SPEAKER;
      regBtn(ownerId, btn, 'icon', SVG_SPEAKER, '');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        TTS.toggleOrPlayQueue(ownerId, [makeHighlightQueueItem(card, spoken)], { language: pageLang });
      });
      card.appendChild(btn);
    });

    return true;
  }

  function enhanceNarrativeTheoryPage(mainPage) {
    var cardSelector = '.intro-pull, .rule-block, .callout, .split-box, .alcohol-box';
    var allCards = Array.from(mainPage.querySelectorAll(cardSelector));
    if (!allCards.length) return;

    allCards.forEach(function (card, idx) {
      var txt = cleanNodeSpeechText(card);
      if (!txt) return;
      var host = card.classList.contains('rule-block') && card.querySelector('.rule-body')
        ? card.querySelector('.rule-body')
        : card;
      host.classList.add('et-th-card-host');

      var ownerId = 'th-card-' + idx;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'et-th-cardbtn';
      btn.title = t.listenCard;
      btn.setAttribute('aria-label', t.listenCard);
      btn.innerHTML = SVG_SPEAKER;
      regBtn(ownerId, btn, 'icon', SVG_SPEAKER, '');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        TTS.toggleOrPlayQueue(ownerId, [makeHighlightQueueItem(card, txt)], { language: pageLang });
      });
      host.appendChild(btn);
    });

    var sections = Array.from(mainPage.querySelectorAll('section.section'));
    sections.forEach(function (sec, sIdx) {
      var head = sec.querySelector('.section-head');
      if (!head) return;
      var secCards = Array.from(sec.querySelectorAll(cardSelector));
      if (!secCards.length) return;

      var ownerId = 'th-multi-sec-' + sIdx;
      var sBtn = document.createElement('button');
      sBtn.type = 'button';
      sBtn.className = 'et-th-secbtn';
      sBtn.innerHTML = SVG_SPEAKER + '<span>' + t.listenSection + '</span>';
      regBtn(ownerId, sBtn, 'pill', SVG_SPEAKER, t.listenSection);

      sBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var headClone = head.cloneNode(true);
        headClone.querySelectorAll('button').forEach(function (b) { b.remove(); });
        var queue = [];
        var headTxt = String(headClone.textContent || '').trim();
        if (headTxt) queue.push(makeHighlightQueueItem(head, headTxt));
        secCards.forEach(function (c) {
          var ct = cleanNodeSpeechText(c);
          if (ct) queue.push(makeHighlightQueueItem(c, ct));
        });
        TTS.toggleOrPlayQueue(ownerId, queue, { language: pageLang });
      });
      head.appendChild(sBtn);
    });

    var bar = buildTopBar(function () {
      var queue = [];
      var h1 = document.querySelector('.book-header h1');
      if (h1 && h1.textContent.trim()) {
        queue.push({ text: h1.textContent.trim(), language: pageLang });
      }
      allCards.forEach(function (c) {
        var ct = cleanNodeSpeechText(c);
        if (ct) queue.push(makeHighlightQueueItem(c, ct));
      });
      return queue;
    });
    mainPage.insertBefore(bar, mainPage.firstChild);
  }

  // Chapter Quiz Dialog (#chapter-quiz) Integration
  function enhanceChapterQuizDialog() {
    var dialog = document.getElementById('chapter-quiz');
    if (!dialog) return;

    dialog.addEventListener('close', function () {
      TTS.stop();
    });

    var cqBody = dialog.querySelector('.cq-body');
    if (!cqBody || typeof MutationObserver === 'undefined') return;

    var lastQuestionText = '';

    function refreshQuizDom() {
      var qHeading = cqBody.querySelector('.cq-question');
      if (qHeading) {
        var qTxt = String(qHeading.textContent || '').trim();
        if (qTxt !== lastQuestionText) {
          lastQuestionText = qTxt;
          TTS.stop();
          if (qTxt) TTS.prefetchAudio(qTxt, { language: pageLang });
        }

        if (!cqBody.querySelector('.et-cq-ttsbar')) {
          var bar = document.createElement('div');
          bar.className = 'et-cq-ttsbar';
          if (rtl) bar.dir = 'rtl';

          var qOwner = 'cq-q';
          var qBtn = document.createElement('button');
          qBtn.type = 'button';
          qBtn.className = 'et-cq-pill';
          qBtn.innerHTML = SVG_SPEAKER + '<span>' + t.readQuestion + '</span>';
          regBtn(qOwner, qBtn, 'pill', SVG_SPEAKER, t.readQuestion);
          qBtn.addEventListener('click', function () {
            TTS.toggleOrPlayQueue(qOwner, [qTxt], { language: pageLang });
          });

          var qoOwner = 'cq-qo';
          var qoBtn = document.createElement('button');
          qoBtn.type = 'button';
          qoBtn.className = 'et-cq-pill';
          qoBtn.innerHTML = SVG_LIST + '<span>' + t.readWithOptions + '</span>';
          regBtn(qoOwner, qoBtn, 'pill', SVG_LIST, t.readWithOptions);
          qoBtn.addEventListener('click', function () {
            var queue = [{ text: qTxt, language: pageLang }];
            cqBody.querySelectorAll('.cq-option').forEach(function (optBtn) {
              var spanTxt = optBtn.children[1] ? String(optBtn.children[1].textContent || '').trim() : '';
              if (spanTxt) {
                queue.push({
                  text: spanTxt,
                  language: pageLang,
                  onStart: function () { optBtn.classList.add('et-cq-speaking'); },
                  onEnd: function () { optBtn.classList.remove('et-cq-speaking'); }
                });
              }
            });
            TTS.toggleOrPlayQueue(qoOwner, queue, { language: pageLang });
          });

          var prefs = TTS.getPrefs();
          var vseg = document.createElement('div');
          vseg.className = 'et-cq-vseg';
          [
            { id: 'ursa', label: '👩 ' + t.female },
            { id: 'orion', label: '👨 ' + t.male }
          ].forEach(function (v) {
            var vb = document.createElement('button');
            vb.type = 'button';
            vb.className = prefs.voice === v.id ? 'is-selected' : '';
            vb.setAttribute('data-et-th-voice', v.id);
            vb.textContent = v.label;
            vb.addEventListener('click', function () {
              TTS.setPrefs({ voice: v.id });
              TTS.stop();
            });
            vseg.appendChild(vb);
          });

          bar.append(qBtn, qoBtn, vseg);
          qHeading.insertAdjacentElement('afterend', bar);
        }

        // Per-option mini speaker
        cqBody.querySelectorAll('.cq-option').forEach(function (optBtn, oIdx) {
          if (optBtn.querySelector('.et-cq-optspk')) return;
          var spanTxt = optBtn.children[1] ? String(optBtn.children[1].textContent || '').trim() : '';
          if (!spanTxt) return;

          var oOwner = 'cq-opt-' + oIdx;
          var spk = document.createElement('span');
          spk.setAttribute('role', 'button');
          spk.setAttribute('tabindex', '0');
          spk.className = 'et-cq-optspk';
          spk.title = t.readOptionTitle;
          spk.innerHTML = SVG_SPEAKER;
          regBtn(oOwner, spk, 'icon', SVG_SPEAKER, '');

          spk.addEventListener('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            TTS.toggleOrPlayQueue(oOwner, [{
              text: spanTxt,
              language: pageLang,
              onStart: function () { optBtn.classList.add('et-cq-speaking'); },
              onEnd: function () { optBtn.classList.remove('et-cq-speaking'); }
            }], { language: pageLang });
          });
          optBtn.appendChild(spk);
        });
      }

      // Instant feedback inside quiz
      var fb = cqBody.querySelector('.cq-feedback');
      if (fb && !fb.hidden && !fb.querySelector('.et-cq-fbwrap')) {
        var expP = fb.querySelector('p');
        var expTxt = expP ? String(expP.textContent || '').trim() : '';
        if (expTxt) {
          var fbWrap = document.createElement('div');
          fbWrap.className = 'et-cq-fbwrap';
          var fbOwner = 'cq-fb';
          var fbBtn = document.createElement('button');
          fbBtn.type = 'button';
          fbBtn.className = 'et-cq-pill';
          fbBtn.innerHTML = SVG_SPEAKER + '<span>' + t.readExplanation + '</span>';
          regBtn(fbOwner, fbBtn, 'pill', SVG_SPEAKER, t.readExplanation);
          fbBtn.addEventListener('click', function () {
            TTS.toggleOrPlayQueue(fbOwner, [expTxt], { language: pageLang });
          });
          fbWrap.appendChild(fbBtn);
          fb.appendChild(fbWrap);
        }
      }

      // Post-quiz review cards
      var reviewBox = cqBody.querySelector('.cq-review');
      if (reviewBox && !reviewBox.hidden) {
        reviewBox.querySelectorAll('.cq-review-card').forEach(function (card, rIdx) {
          if (card.querySelector('.et-cq-fbwrap')) return;
          var ps = card.querySelectorAll('p');
          var lastP = ps.length ? ps[ps.length - 1] : null;
          var expTxt = lastP ? String(lastP.textContent || '').trim() : '';
          if (!expTxt) return;
          var rWrap = document.createElement('div');
          rWrap.className = 'et-cq-fbwrap';
          var rOwner = 'cq-rev-' + rIdx;
          var rBtn = document.createElement('button');
          rBtn.type = 'button';
          rBtn.className = 'et-cq-pill';
          rBtn.innerHTML = SVG_SPEAKER + '<span>' + t.readExplanation + '</span>';
          regBtn(rOwner, rBtn, 'pill', SVG_SPEAKER, t.readExplanation);
          rBtn.addEventListener('click', function () {
            TTS.toggleOrPlayQueue(rOwner, [expTxt], { language: pageLang });
          });
          rWrap.appendChild(rBtn);
          card.appendChild(rWrap);
        });
      }
    }

    new MutationObserver(function () {
      refreshQuizDom();
    }).observe(cqBody, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }

  function init() {
    injectStyles();
    var mainPage = document.querySelector('main.page');
    if (mainPage && !mainPage.dataset.etTheoryTts) {
      mainPage.dataset.etTheoryTts = '1';
      if (!enhanceSignCataloguePage(mainPage)) {
        enhanceNarrativeTheoryPage(mainPage);
      }
    }
    enhanceChapterQuizDialog();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
