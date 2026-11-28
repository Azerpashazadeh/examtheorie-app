/*!
 * ExamTheorie CBR Exam Runner TTS UI (exam-tts.js)
 * Plugs non-invasively into deneme-{en,nl,tr,ar,ru,fa,es}.html & test-{en,nl,tr,ar,ru,fa,es}.html
 */
(function () {
  'use strict';

  var TTS = window.ExamTheorieTTS;
  if (!TTS || !TTS.enabled) return;

  var pageLang = TTS.detectPageShortLang();
  var rtl = TTS.isRtlLang(pageLang);
  var t = TTS.getStrings(pageLang);

  var SVG_SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
  var SVG_LIST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="4" cy="6" r="1" fill="currentColor"></circle><circle cx="4" cy="12" r="1" fill="currentColor"></circle><circle cx="4" cy="18" r="1" fill="currentColor"></circle></svg>';
  var SVG_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"></rect><rect x="14" y="5" width="4" height="14" rx="1.2"></rect></svg>';
  var SVG_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>';
  var SVG_SLIDERS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>';
  var HTML_EQ = '<span class="et-tts-eq" aria-hidden="true"><i></i><i></i><i></i></span>';
  var HTML_SPIN = '<span class="et-tts-spin" aria-hidden="true"></span>';

  function injectStyles() {
    if (document.getElementById('et-exam-tts-styles')) return;
    var style = document.createElement('style');
    style.id = 'et-exam-tts-styles';
    style.textContent = [
      '.et-tts-qbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 6px;position:relative;z-index:8;pointer-events:auto!important}',
      '.et-tts-qbar.et-tts-dd-bar{grid-column:2;grid-row:2;padding:0 22px 16px;align-self:start}',
      '.questionS3.no-media>.et-tts-qbar.et-tts-dd-bar{grid-column:1}',
      '.et-tts-pill{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 13px;border-radius:999px;border:1.5px solid #d5e2f0;background:#ffffff;color:#334155;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:13px;font-weight:700;line-height:1;cursor:pointer;transition:all .16s ease;pointer-events:auto!important;user-select:none;white-space:nowrap}',
      '.et-tts-pill:hover{background:#f0f7ff;border-color:#0061ff;color:#0061ff;transform:translateY(-1px)}',
      '.et-tts-pill svg{width:15px;height:15px;flex-shrink:0}',
      '.et-tts-pill.is-preferred{background:#eef5ff;border-color:rgba(0,97,255,.45);color:#0055e5;box-shadow:0 2px 8px rgba(0,97,255,.08)}',
      '.et-tts-pill.is-active{background:linear-gradient(135deg,#0061ff,#0095ff)!important;border-color:#0061ff!important;color:#ffffff!important;box-shadow:0 6px 18px rgba(0,97,255,.28)}',
      '.et-tts-pill.is-paused{background:#eff6ff!important;border-color:#0061ff!important;color:#0061ff!important}',
      '.et-tts-pill.is-error{background:#fef2f2!important;border-color:#ef4444!important;color:#b91c1c!important}',
      '.et-tts-voice-seg{display:inline-flex;align-items:center;background:#f1f5f9;border:1px solid #d5e2f0;border-radius:999px;padding:2px;height:36px;margin-inline-start:auto}',
      '.et-tts-vbtn{border:0;background:transparent;color:#475569;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:12px;font-weight:700;padding:0 10px;height:30px;border-radius:999px;cursor:pointer;transition:all .15s ease;pointer-events:auto!important;white-space:nowrap}',
      '.et-tts-vbtn.is-selected{background:#ffffff;color:#0061ff;box-shadow:0 2px 6px rgba(15,23,42,.08)}',
      '.et-tts-gear-wrap{position:relative;display:inline-flex}',
      '.et-tts-gear-btn{width:36px;height:36px;border-radius:999px;border:1.5px solid #d5e2f0;background:#ffffff;color:#475569;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;pointer-events:auto!important;padding:0}',
      '.et-tts-gear-btn:hover,.et-tts-gear-btn.is-open{border-color:#0061ff;color:#0061ff;background:#eff6ff}',
      '.et-tts-gear-btn svg{width:15px;height:15px;flex-shrink:0}',
      '.et-tts-gear-summary{display:none;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:11.5px;font-weight:700;color:#1e293b;line-height:1;white-space:nowrap}',
      '.et-tts-lbl-short{display:none}',
      '.et-tts-popover{position:absolute;top:calc(100% + 8px);inset-inline-end:0;min-width:236px;max-width:calc(100vw - 34px);background:#ffffff;border:1.5px solid #cbd5e1;border-radius:16px;padding:13px 14px;box-shadow:0 18px 42px rgba(15,23,42,.16);z-index:50;display:none;flex-direction:column;gap:11px;text-align:start}',
      '.et-tts-popover.is-open{display:flex}',
      '.et-tts-pop-row{display:flex;flex-direction:column;gap:6px}',
      '.et-tts-pop-voice{display:none}',
      '.et-tts-pop-voice-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}',
      '.et-tts-pvbtn{height:32px;border-radius:9px;border:1px solid #cbd5e1;background:#f8fafc;color:#334155;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:12px;font-weight:700;cursor:pointer}',
      '.et-tts-pvbtn.is-selected{background:#0061ff;border-color:#0061ff;color:#ffffff}',
      '.et-tts-pop-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b}',
      '.et-tts-rate-row{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}',
      '.et-tts-rbtn{height:30px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#334155;font-size:12px;font-weight:700;cursor:pointer}',
      '.et-tts-rbtn.is-selected{background:#0061ff;border-color:#0061ff;color:#ffffff}',
      '.et-tts-autoread{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12.5px;font-weight:600;color:#1e293b;cursor:pointer;padding-top:4px;border-top:1px solid #f1f5f9}',
      '.et-tts-autoread input{width:17px;height:17px;accent-color:#0061ff;cursor:pointer}',
      '.cevapSecenegi-s3 .et-tts-opt-text{flex:1;min-width:0}',
      '.et-tts-opt-btn{margin-inline-start:auto;flex-shrink:0;width:32px;height:32px;border-radius:50%;border:1px solid #d5e2f0;background:#f8fafc;color:#475569;display:inline-grid;place-items:center;cursor:pointer;pointer-events:auto!important;transition:all .15s ease;padding:0}',
      '.et-tts-opt-btn:hover{border-color:#0061ff;color:#0061ff;background:#eff6ff;transform:scale(1.05)}',
      '.et-tts-opt-btn svg{width:14px;height:14px}',
      '.et-tts-opt-btn.is-active{background:#0061ff!important;border-color:#0061ff!important;color:#ffffff!important;box-shadow:0 4px 12px rgba(0,97,255,.28)}',
      '.et-tts-opt-btn.is-paused{background:#eff6ff!important;border-color:#0061ff!important;color:#0061ff!important}',
      '.cevapSecenegi-s3.et-tts-speaking-opt{outline:2px solid #0061ff!important;outline-offset:1px}',
      '.feedback-container{flex-wrap:wrap}',
      '.answers>.feedback-container{margin-top:4px!important}',
      '.et-tts-fb-wrap{width:100%;display:flex;justify-content:flex-end;margin-top:6px;pointer-events:auto!important}',
      '.et-tts-fb-btn{height:32px;padding:0 12px;font-size:12px}',
      '.et-tts-eq{display:inline-flex;align-items:flex-end;gap:2px;height:13px;width:13px;justify-content:center}',
      '.et-tts-eq i{display:block;width:2.5px;background:currentColor;border-radius:2px;animation:etTtsEq .75s ease-in-out infinite alternate}',
      '.et-tts-eq i:nth-child(1){height:5px;animation-delay:0s}',
      '.et-tts-eq i:nth-child(2){height:12px;animation-delay:.18s}',
      '.et-tts-eq i:nth-child(3){height:7px;animation-delay:.34s}',
      '@keyframes etTtsEq{0%{height:4px}100%{height:13px}}',
      '.et-tts-spin{width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:etTtsSpin .65s linear infinite}',
      '@keyframes etTtsSpin{to{transform:rotate(360deg)}}',
      '.et-tts-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:9px 16px;border-radius:999px;font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(15,23,42,.28);z-index:9999;pointer-events:none;opacity:0;transition:opacity .2s}',
      '.et-tts-toast.is-visible{opacity:1}',
      '@media(max-width:720px),(pointer:coarse) and (max-width:1100px){' +
        '.et-tts-qbar{flex-wrap:nowrap;gap:6px;margin:0 0 2px}' +
        '.et-tts-qbar.et-tts-dd-bar{order:2;padding:0 0 8px;width:100%}' +
        '.et-tts-pill{height:30px;padding:0 10px;font-size:11.5px;gap:5px}' +
        '.et-tts-pill svg{width:13.5px;height:13.5px}' +
        '.et-tts-lbl-full{display:none}' +
        '.et-tts-lbl-short{display:inline}' +
        '.et-tts-voice-seg{display:none}' +
        '.et-tts-gear-wrap{margin-inline-start:auto;flex-shrink:0}' +
        '.et-tts-gear-btn{width:auto;height:30px;padding:0 9px;gap:5px}' +
        '.et-tts-gear-btn svg{width:13.5px;height:13.5px}' +
        '.et-tts-gear-summary{display:inline-flex;align-items:center;gap:3px}' +
        '.et-tts-pop-voice{display:flex}' +
        '.et-tts-opt-btn{width:29px;height:29px}' +
        '.et-tts-opt-btn svg{width:13px;height:13px}' +
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  var toastEl = null;
  var toastTimer = null;
  function showToast(msg) {
    if (!msg) return;
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'et-tts-toast';
      if (rtl) toastEl.dir = 'rtl';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      if (toastEl) toastEl.classList.remove('is-visible');
    }, 2600);
  }

  function getCleanQuestionStem(qEl, qIndexZeroBased) {
    if (typeof window.allQuestionsS3 !== 'undefined' && Array.isArray(window.allQuestionsS3) && window.allQuestionsS3[qIndexZeroBased]) {
      var rawSoru = window.allQuestionsS3[qIndexZeroBased].soru;
      if (rawSoru) return String(rawSoru).trim();
    }
    var p = qEl.querySelector(':scope > p');
    if (!p) return '';
    return String(p.textContent || '').replace(/^\s*\d+\.\s*/, '').trim();
  }

  function getOptionCleanText(labelEl) {
    var clone = labelEl.cloneNode(true);
    var removals = clone.querySelectorAll('input, .marker, .et-tts-opt-btn');
    for (var i = 0; i < removals.length; i++) removals[i].remove();
    return String(clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function makeDualLabelHtml(fullText, shortText) {
    if (!shortText || shortText === fullText) {
      return '<span>' + fullText + '</span>';
    }
    return '<span class="et-tts-lbl-full">' + fullText + '</span><span class="et-tts-lbl-short">' + shortText + '</span>';
  }

  function formatGearSummary(prefs) {
    var icon = prefs.voice === 'orion' ? '👨' : '👩';
    return icon + ' ' + prefs.rate + 'x';
  }

  var buttonRegistry = new Map(); // ownerId -> { btn, kind, defaultIconHtml, defaultLabelHtml }

  function registerButton(ownerId, btn, kind, defaultIconHtml, defaultText, shortText) {
    buttonRegistry.set(ownerId, {
      btn: btn,
      kind: kind,
      defaultIconHtml: defaultIconHtml,
      defaultLabelHtml: makeDualLabelHtml(defaultText || '', shortText || defaultText || '')
    });
  }

  function renderButtonState(entry, status) {
    var btn = entry.btn;
    if (!btn || !btn.isConnected) return;
    btn.classList.remove('is-active', 'is-paused', 'is-error');

    if (entry.kind === 'option') {
      if (status === 'loading') {
        btn.classList.add('is-active');
        btn.innerHTML = HTML_SPIN;
      } else if (status === 'playing') {
        btn.classList.add('is-active');
        btn.innerHTML = HTML_EQ;
      } else if (status === 'paused') {
        btn.classList.add('is-paused');
        btn.innerHTML = SVG_PLAY;
      } else {
        btn.innerHTML = entry.defaultIconHtml;
      }
      return;
    }

    if (status === 'loading') {
      btn.classList.add('is-active');
      btn.innerHTML = HTML_SPIN + '<span>' + t.loading + '</span>';
    } else if (status === 'playing') {
      btn.classList.add('is-active');
      btn.innerHTML = HTML_EQ + '<span>' + t.pause + '</span>';
    } else if (status === 'paused') {
      btn.classList.add('is-paused');
      btn.innerHTML = SVG_PLAY + '<span>' + t.resume + '</span>';
    } else if (status === 'error') {
      btn.classList.add('is-error');
      btn.innerHTML = entry.defaultIconHtml + entry.defaultLabelHtml;
    } else {
      btn.innerHTML = entry.defaultIconHtml + entry.defaultLabelHtml;
    }
  }

  TTS.onStateChange(function (st) {
    buttonRegistry.forEach(function (entry, id) {
      if (id === st.ownerId) {
        renderButtonState(entry, st.status);
      } else {
        renderButtonState(entry, 'idle');
      }
    });
    if (st.status === 'error' && st.errorMessage) {
      showToast(st.errorMessage);
    }
  });

  function syncAllPreferenceWidgets() {
    var prefs = TTS.getPrefs();
    document.querySelectorAll('.et-tts-vbtn, .et-tts-pvbtn').forEach(function (b) {
      b.classList.toggle('is-selected', b.getAttribute('data-voice') === prefs.voice);
    });
    document.querySelectorAll('.et-tts-gear-summary').forEach(function (s) {
      s.textContent = formatGearSummary(prefs);
    });
    document.querySelectorAll('.et-tts-rbtn').forEach(function (b) {
      b.classList.toggle('is-selected', Number(b.getAttribute('data-rate')) === prefs.rate);
    });
    document.querySelectorAll('.et-tts-autoread-chk').forEach(function (chk) {
      chk.checked = Boolean(prefs.autoRead);
    });
    document.querySelectorAll('.et-tts-qbar').forEach(function (bar) {
      var hasOpts = Boolean(bar.querySelector('[data-read-scope="question_options"]'));
      var effectiveScope = (prefs.readScope === 'question_options' && hasOpts) ? 'question_options' : 'question';
      bar.querySelectorAll('[data-read-scope]').forEach(function (btn) {
        btn.classList.toggle('is-preferred', btn.getAttribute('data-read-scope') === effectiveScope);
      });
    });
  }

  function buildQuestionWithOptionsQueue(qEl, qIdx) {
    var stem = getCleanQuestionStem(qEl, qIdx);
    var queue = [];
    if (stem) queue.push({ text: stem, language: pageLang });
    var currentLabels = qEl.querySelectorAll('.cevapSecenegi-s3');
    currentLabels.forEach(function (lbl) {
      var optText = getOptionCleanText(lbl);
      if (optText) {
        queue.push({
          text: optText,
          language: pageLang,
          onStart: function () { lbl.classList.add('et-tts-speaking-opt'); },
          onEnd: function () { lbl.classList.remove('et-tts-speaking-opt'); }
        });
      }
    });
    return queue;
  }

  TTS.onPrefsChange(syncAllPreferenceWidgets);

  function closeAllPopovers(except) {
    document.querySelectorAll('.et-tts-popover.is-open').forEach(function (pop) {
      if (pop !== except) pop.classList.remove('is-open');
    });
    document.querySelectorAll('.et-tts-gear-btn.is-open').forEach(function (btn) {
      if (!except || btn.nextElementSibling !== except) btn.classList.remove('is-open');
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.et-tts-gear-wrap')) {
      closeAllPopovers(null);
    }
  });

  function buildQuestionBar(qEl, qIdx) {
    var bar = document.createElement('div');
    bar.className = 'et-tts-qbar';
    if (rtl) bar.dir = 'rtl';

    var prefs = TTS.getPrefs();
    var optionLabels = qEl.querySelectorAll('.cevapSecenegi-s3');
    var hasOptions = optionLabels.length > 0;
    var effectiveScope = (prefs.readScope === 'question_options' && hasOptions) ? 'question_options' : 'question';

    var qOwnerId = 'exam-q-' + qIdx;
    var qBtn = document.createElement('button');
    qBtn.type = 'button';
    qBtn.className = 'et-tts-pill' + (effectiveScope === 'question' ? ' is-preferred' : '');
    qBtn.setAttribute('data-read-scope', 'question');
    qBtn.innerHTML = SVG_SPEAKER + makeDualLabelHtml(t.readQuestion, t.readQuestionShort);
    registerButton(qOwnerId, qBtn, 'pill', SVG_SPEAKER, t.readQuestion, t.readQuestionShort);

    qBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      TTS.setPrefs({ readScope: 'question' });
      var stem = getCleanQuestionStem(qEl, qIdx);
      TTS.toggleOrPlayQueue(qOwnerId, [stem], { language: pageLang });
    });
    bar.appendChild(qBtn);

    if (hasOptions) {
      var qoOwnerId = 'exam-qo-' + qIdx;
      var qoBtn = document.createElement('button');
      qoBtn.type = 'button';
      qoBtn.className = 'et-tts-pill' + (effectiveScope === 'question_options' ? ' is-preferred' : '');
      qoBtn.setAttribute('data-read-scope', 'question_options');
      qoBtn.innerHTML = SVG_LIST + makeDualLabelHtml(t.readWithOptions, t.readWithOptionsShort);
      registerButton(qoOwnerId, qoBtn, 'pill', SVG_LIST, t.readWithOptions, t.readWithOptionsShort);

      qoBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        TTS.setPrefs({ readScope: 'question_options' });
        var queue = buildQuestionWithOptionsQueue(qEl, qIdx);
        TTS.toggleOrPlayQueue(qoOwnerId, queue, { language: pageLang });
      });
      bar.appendChild(qoBtn);
    }
    var seg = document.createElement('div');
    seg.className = 'et-tts-voice-seg';
    seg.setAttribute('role', 'group');
    seg.setAttribute('aria-label', t.voiceLabel);

    [
      { id: 'capella', label: '👩 ' + t.female },
      { id: 'orion', label: '👨 ' + t.male }
    ].forEach(function (v) {
      var vb = document.createElement('button');
      vb.type = 'button';
      vb.className = 'et-tts-vbtn' + (prefs.voice === v.id ? ' is-selected' : '');
      vb.setAttribute('data-voice', v.id);
      vb.textContent = v.label;
      vb.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var prevState = TTS.getState();
        TTS.setPrefs({ voice: v.id });
        if (prevState.status === 'playing' || prevState.status === 'paused') {
          TTS.stop();
        }
      });
      seg.appendChild(vb);
    });
    bar.appendChild(seg);

    // Compact voice (mobile) + speed + auto-read settings popover
    var gearWrap = document.createElement('div');
    gearWrap.className = 'et-tts-gear-wrap';
    var gearBtn = document.createElement('button');
    gearBtn.type = 'button';
    gearBtn.className = 'et-tts-gear-btn';
    gearBtn.title = t.settingsTitle;
    gearBtn.setAttribute('aria-label', t.settingsTitle);
    gearBtn.innerHTML = '<span class="et-tts-gear-summary">' + formatGearSummary(prefs) + '</span>' + SVG_SLIDERS;

    var pop = document.createElement('div');
    pop.className = 'et-tts-popover';
    if (rtl) pop.dir = 'rtl';

    var voiceRowWrap = document.createElement('div');
    voiceRowWrap.className = 'et-tts-pop-row et-tts-pop-voice';
    var voiceLbl = document.createElement('span');
    voiceLbl.className = 'et-tts-pop-lbl';
    voiceLbl.textContent = t.voiceLabel;
    var voiceGrid = document.createElement('div');
    voiceGrid.className = 'et-tts-pop-voice-grid';
    [
      { id: 'capella', label: '👩 ' + t.female },
      { id: 'orion', label: '👨 ' + t.male }
    ].forEach(function (v) {
      var pvb = document.createElement('button');
      pvb.type = 'button';
      pvb.className = 'et-tts-pvbtn' + (prefs.voice === v.id ? ' is-selected' : '');
      pvb.setAttribute('data-voice', v.id);
      pvb.textContent = v.label;
      pvb.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var prevState = TTS.getState();
        TTS.setPrefs({ voice: v.id });
        if (prevState.status === 'playing' || prevState.status === 'paused') {
          TTS.stop();
        }
      });
      voiceGrid.appendChild(pvb);
    });
    voiceRowWrap.appendChild(voiceLbl);
    voiceRowWrap.appendChild(voiceGrid);
    pop.appendChild(voiceRowWrap);

    var rateRowWrap = document.createElement('div');
    rateRowWrap.className = 'et-tts-pop-row';
    var rateLbl = document.createElement('span');
    rateLbl.className = 'et-tts-pop-lbl';
    rateLbl.textContent = t.speedLabel;
    var rateGrid = document.createElement('div');
    rateGrid.className = 'et-tts-rate-row';
    [0.9, 1, 1.15, 1.25].forEach(function (r) {
      var rb = document.createElement('button');
      rb.type = 'button';
      rb.className = 'et-tts-rbtn' + (prefs.rate === r ? ' is-selected' : '');
      rb.setAttribute('data-rate', String(r));
      rb.textContent = r + 'x';
      rb.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        TTS.setPrefs({ rate: r });
      });
      rateGrid.appendChild(rb);
    });
    rateRowWrap.appendChild(rateLbl);
    rateRowWrap.appendChild(rateGrid);
    pop.appendChild(rateRowWrap);

    var autoLbl = document.createElement('label');
    autoLbl.className = 'et-tts-autoread';
    var autoSpan = document.createElement('span');
    autoSpan.textContent = t.autoRead;
    var autoChk = document.createElement('input');
    autoChk.type = 'checkbox';
    autoChk.className = 'et-tts-autoread-chk';
    autoChk.checked = Boolean(prefs.autoRead);
    autoChk.addEventListener('change', function (e) {
      e.stopPropagation();
      TTS.setPrefs({ autoRead: autoChk.checked });
    });
    autoLbl.appendChild(autoSpan);
    autoLbl.appendChild(autoChk);
    pop.appendChild(autoLbl);

    gearBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var opening = !pop.classList.contains('is-open');
      closeAllPopovers(opening ? pop : null);
      pop.classList.toggle('is-open', opening);
      gearBtn.classList.toggle('is-open', opening);
    });

    gearWrap.appendChild(gearBtn);
    gearWrap.appendChild(pop);
    bar.appendChild(gearWrap);

    return bar;
  }

  function enhanceOptionLabels(qEl, qIdx) {
    var labels = qEl.querySelectorAll('.cevapSecenegi-s3');
    labels.forEach(function (lbl, optIdx) {
      if (lbl.querySelector('.et-tts-opt-btn')) return;
      var ownerId = 'exam-opt-' + qIdx + '-' + optIdx;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'et-tts-opt-btn';
      btn.title = t.readOptionTitle;
      btn.setAttribute('aria-label', t.readOptionTitle);
      btn.innerHTML = SVG_SPEAKER;
      registerButton(ownerId, btn, 'option', SVG_SPEAKER, '');

      function swallow(ev) {
        ev.stopPropagation();
      }
      btn.addEventListener('mousedown', swallow);
      btn.addEventListener('touchstart', swallow, { passive: true });
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var txt = getOptionCleanText(lbl);
        if (!txt) return;
        TTS.toggleOrPlayQueue(ownerId, [{
          text: txt,
          language: pageLang,
          onStart: function () { lbl.classList.add('et-tts-speaking-opt'); },
          onEnd: function () { lbl.classList.remove('et-tts-speaking-opt'); }
        }], { language: pageLang });
      });

      lbl.appendChild(btn);
    });
  }

  function enhanceFeedbackBoxes(root) {
    var boxes = (root || document).querySelectorAll('.feedback-container');
    boxes.forEach(function (fb) {
      var hostQuestion = fb.closest('.questionS3');
      if (hostQuestion && fb.parentElement === hostQuestion) {
        var hostAnswers = hostQuestion.querySelector(':scope > .answers');
        if (hostAnswers) {
          hostAnswers.appendChild(fb);
        }
      }
      if (fb.querySelector('.et-tts-fb-btn')) return;
      var textEl = fb.querySelector('.feedback-text');
      var txt = textEl ? String(textEl.textContent || '').trim() : String(fb.textContent || '').trim();
      if (!txt) return;

      var ownerId = 'exam-fb-' + (fb.id || Math.random().toString(36).slice(2, 9));
      var wrap = document.createElement('div');
      wrap.className = 'et-tts-fb-wrap';
      if (rtl) wrap.dir = 'rtl';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'et-tts-pill is-preferred et-tts-fb-btn';
      btn.innerHTML = SVG_SPEAKER + '<span>' + t.readExplanation + '</span>';
      registerButton(ownerId, btn, 'pill', SVG_SPEAKER, t.readExplanation);

      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        TTS.toggleOrPlayQueue(ownerId, [txt], { language: pageLang });
      });

      wrap.appendChild(btn);
      fb.appendChild(wrap);
    });
  }

  function enhanceAllQuestions() {
    var questions = document.querySelectorAll('.quiz-container-s3 .questionS3');
    if (!questions.length) return;

    questions.forEach(function (qEl, idx) {
      if (!qEl.dataset.etTtsEnhanced) {
        qEl.dataset.etTtsEnhanced = '1';
        var bar = buildQuestionBar(qEl, idx);
        var answersDiv = qEl.querySelector(':scope > .answers');
        if (!answersDiv) {
          answersDiv = document.createElement('div');
          answersDiv.className = 'answers';
          qEl.appendChild(answersDiv);
        }
        answersDiv.insertBefore(bar, answersDiv.firstChild);
        enhanceOptionLabels(qEl, idx);
      }
      enhanceFeedbackBoxes(qEl);
    });
  }

  var lastActiveQuestionId = null;

  function checkActiveQuestionTransition() {
    var container = document.querySelector('.quiz-container-s3');
    if (!container || container.classList.contains('hidden')) {
      if (lastActiveQuestionId !== null) {
        lastActiveQuestionId = null;
        TTS.stop();
      }
      return;
    }

    var questions = container.querySelectorAll('.questionS3');
    var activeIdx = -1;
    var activeEl = null;
    for (var i = 0; i < questions.length; i++) {
      if (!questions[i].classList.contains('hidden')) {
        activeIdx = i;
        activeEl = questions[i];
        break;
      }
    }

    var nextId = activeEl ? activeEl.id : null;
    if (nextId === lastActiveQuestionId) return;

    lastActiveQuestionId = nextId;
    TTS.stop();
    closeAllPopovers(null);

    if (!activeEl || activeIdx < 0) return;

    var prefs = TTS.getPrefs();
    var curStem = getCleanQuestionStem(activeEl, activeIdx);
    if (curStem) {
      TTS.prefetchAudio(curStem, { language: pageLang });
    }
    if (prefs.readScope === 'question_options') {
      activeEl.querySelectorAll('.cevapSecenegi-s3').forEach(function (lbl) {
        var optTxt = getOptionCleanText(lbl);
        if (optTxt) TTS.prefetchAudio(optTxt, { language: pageLang });
      });
    }
    if (activeIdx + 1 < questions.length) {
      var nextStem = getCleanQuestionStem(questions[activeIdx + 1], activeIdx + 1);
      if (nextStem) {
        TTS.prefetchAudio(nextStem, { language: pageLang });
      }
    }

    var inReviewMode = Boolean(window.viewResult);
    if (prefs.autoRead && !inReviewMode && curStem) {
      var activeOptions = activeEl.querySelectorAll('.cevapSecenegi-s3');
      if (prefs.readScope === 'question_options' && activeOptions.length > 0) {
        var autoQueue = buildQuestionWithOptionsQueue(activeEl, activeIdx);
        TTS.toggleOrPlayQueue('exam-qo-' + activeIdx, autoQueue, { language: pageLang });
      } else {
        TTS.toggleOrPlayQueue('exam-q-' + activeIdx, [curStem], { language: pageLang });
      }
    }
  }


  var GUIDE_I18N = {
    tr: {
      heading: '✨ Akıllı Sınav Araçları — Kullanım Kılavuzu',
      c1Title: 'Sesli Okuma (Soru & Şıklar)',
      c1Pills: ['🔊 Soruyu Oku', '📋 + Şıklar'],
      c1Body: 'Soruyu dinlemek için "Soruyu Oku"ya, soruyu ve tüm şıkları sırayla dinlemek için "+ Şıklar"a dokunun. Her şıkkın sağındaki küçük 🔊 simgesiyle tek bir şıkkı, sınav sonunda ise çözüm açıklamasını sesli dinleyebilirsiniz.',
      c2Title: 'Kadın / Erkek Sesi, Hız & Otomatik Oku',
      c2Pills: ['👩 Kadın', '👨 Erkek', '🎛️ Ayarlar'],
      c2Body: 'Sağdaki seçiciden (mobilde 🎛️ düğmesinden) dilediğiniz an Kadın veya Erkek sesini seçebilir, okuma hızını (0.9x – 1.25x) değiştirebilir ve yeni soruya geçince "Otomatik Oku" özelliğini açabilirsiniz.',
      c3Title: 'Zorlandığım Sorular & Özel Alıştırma',
      c3Pills: ['☆ 28:30 (Üst Bar)', '⭐ Havuzum'],
      c3Body: 'Sınav sırasında üst barda geri sayım saatinin solundaki (sınav sonu incelemede de üst bardaki) ☆ yıldız düğmesine basarak zorlandığınız soruyu kaydedin (⭐). Ana sayfadaki "⭐ Zorlandığım Sorular" kutusundan sadece bu sorulardan oluşan süresiz, anında cevap ve açıklama kontrollü özel testinizi istediğiniz zaman çözebilirsiniz.'
    },
    nl: {
      heading: '✨ Slimme Examentools — Korte Handleiding',
      c1Title: 'Voorlezen (Vraag & Antwoorden)',
      c1Pills: ['🔊 Lees vraag', '📋 + Opties'],
      c1Body: 'Klik op "Lees vraag" om de vraag te beluisteren, of op "+ Opties" om de vraag én alle antwoordopties achter elkaar te horen. Na afloop kun je bij het nakijken ook de uitleg laten voorlezen.',
      c2Title: 'Vrouwen- / Mannenstem, Snelheid & Auto-lees',
      c2Pills: ['👩 Vrouw', '👨 Man', '🎛️ Instellingen'],
      c2Body: 'Kies rechts (op mobiel via 🎛️) eenvoudig tussen een vrouwen- of mannenstem, pas de voorleessnelheid aan (0.9x – 1.25x) en schakel automatisch voorlezen bij elke nieuwe vraag in.',
      c3Title: 'Mijn Lastige Vragen & Oefentoets',
      c3Pills: ['☆ 28:30 (Bovenbalk)', '⭐ Mijn lijst'],
      c3Body: 'Twijfel je bij een vraag of maakte je een fout? Tik in de bovenbalk links naast de klok op de ster ☆ om de vraag op te slaan (⭐). Op de startpagina start je via "⭐ Mijn Lastige Vragen" op elk moment een tijdloze oefentoets met directe uitleg.'
    },
    en: {
      heading: '✨ Smart Exam Tools — Quick Guide',
      c1Title: 'Audio Read-Aloud (Question & Options)',
      c1Pills: ['🔊 Read Question', '📋 + Options'],
      c1Body: 'Tap "Read Question" to hear the question, or "+ Options" to hear the question followed by every answer choice. Tap the small 🔊 icon on any choice to hear it alone, or listen to explanations when reviewing results.',
      c2Title: 'Female / Male Voice, Speed & Auto-Read',
      c2Pills: ['👩 Female', '👨 Male', '🎛️ Settings'],
      c2Body: 'Switch anytime between Female and Male voices (on mobile, tap 🎛️), adjust playback speed (0.9x – 1.25x), and turn on Auto-Read so each new question plays automatically.',
      c3Title: 'Difficult Questions Pool & Practice Quiz',
      c3Pills: ['☆ 28:30 (Top Bar)', '⭐ My Pool'],
      c3Body: 'Stuck on a tricky question during the exam or result review? Tap the star ☆ next to the timer in the top bar to bookmark it (⭐). From the "⭐ My Difficult Questions" card on your homepage, launch an untimed custom practice quiz with instant answer checks anytime.'
    },
    ar: {
      heading: '✨ أدوات الاختبار الذكية — دليل الاستخدام السريع',
      c1Title: 'القراءة الصوتية (السؤال والخيارات)',
      c1Pills: ['🔊 قراءة السؤال', '📋 + الخيارات'],
      c1Body: 'اضغط على "قراءة السؤال" لسماع السؤال، أو "+ الخيارات" لسماع السؤال مع جميع الخيارات بالترتيب. يمكنك أيضاً سماع خيار منفرد عبر رمز 🔊 أو سماع الشرح عند مراجعة النتيجة.',
      c2Title: 'صوت أنثى / ذكر، السرعة والقراءة التلقائية',
      c2Pills: ['👩 أنثى', '👨 ذكر', '🎛️ الإعدادات'],
      c2Body: 'بدّل في أي وقت بين صوت الأنثى والذكر (في الهاتف عبر زر 🎛️)، وتحكم في سرعة القراءة (0.9x – 1.25x)، وفعّل القراءة التلقائية عند الانتقال لسؤال جديد.',
      c3Title: 'الأسئلة الصعبة والاختبار التدريبي الخاص',
      c3Pills: ['☆ 28:30 (الشريط العلوي)', '⭐ قائمتي'],
      c3Body: 'هل واجهت سؤالاً صعباً أثناء الحل أو المراجعة؟ اضغط على النجمة ☆ بجانب مؤقت العد التنازلي في الشريط العلوي لحفظه (⭐). ومن بطاقة "⭐ أسئلتي الصعبة" في الصفحة الرئيسية يمكنك بدء اختبار تدريبي بدون وقت مع تحقق فوري.'
    },
    ru: {
      heading: '✨ Умные функции экзамена — краткая инструкция',
      c1Title: 'Озвучка вопросов и ответов',
      c1Pills: ['🔊 Вопрос', '📋 + Варианты'],
      c1Body: 'Нажмите «Вопрос», чтобы прослушать вопрос, или «+ Варианты», чтобы прослушать вопрос и все варианты ответа подряд. Значок 🔊 у варианта читает только его, а после экзамена доступна озвучка объяснений.',
      c2Title: 'Женский / мужской голос и скорость',
      c2Pills: ['👩 Жен.', '👨 Муж.', '🎛️ Настройки'],
      c2Body: 'Переключайтесь между женским и мужским голосом (на телефоне через кнопку 🎛️), выбирайте скорость (0.9x – 1.25x) и включайте авточтение при переходе к следующему вопросу.',
      c3Title: 'Сложные вопросы и личная тренировка',
      c3Pills: ['☆ 28:30 (Вверху)', '⭐ Мой список'],
      c3Body: 'Трудный вопрос? Нажмите звёздочку ☆ слева от таймера на верхней панели во время теста или разбора ошибок (⭐). На главной странице в блоке «⭐ Мои сложные вопросы» вы сможете в любой момент запустить тренировку без таймера.'
    },
    fa: {
      heading: '✨ راهنمای ابزارهای هوشمند آزمون',
      c1Title: 'خوانش صوتی (سؤال و گزینه‌ها)',
      c1Pills: ['🔊 خوانش سؤال', '📋 + گزینه‌ها'],
      c1Body: 'برای شنیدن متن سؤال روی «خوانش سؤال» و برای شنیدن سؤال به‌همراه تمام گزینه‌ها روی «+ گزینه‌ها» بزنید. در پایان آزمون نیز می‌توانید توضیح پاسخ‌ها را صوتی بشنوید.',
      c2Title: 'صدای زن / مرد، سرعت و خوانش خودکار',
      c2Pills: ['👩 زن', '👨 مرد', '🎛️ تنظیمات'],
      c2Body: 'از بخش سمت راست (در موبایل دکمه 🎛️) صدای زن یا مرد را انتخاب کنید، سرعت خوانش (0.9x تا 1.25x) را تنظیم نمایید و خوانش خودکار سؤالات را فعال کنید.',
      c3Title: 'سؤالات دشوار و آزمون تمرینی شخصی',
      c3Pills: ['☆ 28:30 (نوار بالا)', '⭐ فهرست من'],
      c3Body: 'هنگام آزمون یا مرور نتایج، با دکمه ستاره ☆ در کنار زمان‌سنج نوار بالا سؤال دشوار را ذخیره کنید (⭐). سپس از کارت «⭐ سؤالات دشوار من» در صفحه اصلی، آزمون تمرینی بدون زمان با بررسی فوری پاسخ را اجرا کنید.'
    },
    es: {
      heading: '✨ Herramientas Inteligentes — Guía Rápida',
      c1Title: 'Lectura por Voz (Pregunta y Opciones)',
      c1Pills: ['🔊 Leer pregunta', '📋 + Opciones'],
      c1Body: 'Pulsa "Leer pregunta" para escuchar el enunciado o "+ Opciones" para escuchar la pregunta seguida de todas las respuestas. Al finalizar también podrás escuchar las explicaciones.',
      c2Title: 'Voz Femenina / Masculina y Velocidad',
      c2Pills: ['👩 Mujer', '👨 Hombre', '🎛️ Ajustes'],
      c2Body: 'Elige en cualquier momento entre voz femenina o masculina (en móvil pulsa 🎛️), ajusta la velocidad (0.9x – 1.25x) y activa la lectura automática al pasar de pregunta.',
      c3Title: 'Preguntas Difíciles y Práctica Personal',
      c3Pills: ['☆ 28:30 (Barra sup.)', '⭐ Mi lista'],
      c3Body: '¿Dudas en una pregunta durante el test o la revisión? Pulsa la estrella ☆ junto al temporizador en la barra superior para guardarla (⭐). Desde "⭐ Mis Preguntas Difíciles" en la página principal podrás practicar sin límite de tiempo y con corrección instantánea.'
    }
  };

  function mountStartMessageGuide() {
    var startEl = document.getElementById('startMessage');
    if (!startEl || startEl.querySelector('.et-start-guide')) return;

    var g = GUIDE_I18N[pageLang] || GUIDE_I18N.en;
    var hasSavedFeature = Boolean(document.querySelector('script[src*="saved-questions-exam"]'));

    if (!document.getElementById('et-start-guide-styles')) {
      var st = document.createElement('style');
      st.id = 'et-start-guide-styles';
      st.textContent = [
        '#startMessage{max-width:860px!important}',
        '.et-start-guide{margin:18px 0 20px;padding:16px 18px;border-radius:18px;background:linear-gradient(135deg,#f8fbff 0%,#f1f6fd 100%);border:1.5px solid #cfe0f5;text-align:start;box-shadow:0 8px 24px rgba(15,23,42,.05)}',
        '.et-start-guide-head{font-family:Outfit,Inter,sans-serif;font-size:15px;font-weight:800;color:#0f172a;margin:0 0 12px;display:flex;align-items:center;gap:6px}',
        '.et-start-guide-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:11px}',
        '.et-sg-card{background:#ffffff;border:1px solid #dbe7f4;border-radius:13px;padding:12px 13px;display:flex;flex-direction:column;gap:7px}',
        '.et-sg-card.is-star{border-color:#fde68a;background:linear-gradient(180deg,#ffffff 0%,#fffdf5 100%)}',
        '.et-sg-pills{display:flex;flex-wrap:wrap;gap:5px}',
        '.et-sg-pill{display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;font-family:Outfit,Inter,sans-serif;font-size:11px;font-weight:700;background:#eff6ff;color:#0061ff;border:1px solid rgba(0,97,255,.2);white-space:nowrap}',
        '.et-sg-card.is-star .et-sg-pill{background:#fffbeb;color:#b45309;border-color:#fcd34d}',
        '.et-sg-title{font-family:Outfit,Inter,sans-serif;font-size:13.5px;font-weight:800;color:#0f172a;margin:0;line-height:1.3}',
        '.et-sg-body{font-size:12.5px!important;line-height:1.52!important;color:#475569!important;margin:0!important}',
        '@media(max-width:720px){.et-start-guide{padding:13px 12px;margin:14px 0 16px}.et-start-guide-grid{grid-template-columns:1fr;gap:9px}}'
      ].join('\n');
      document.head.appendChild(st);
    }

    var box = document.createElement('div');
    box.className = 'et-start-guide';
    if (rtl) box.dir = 'rtl';

    var head = document.createElement('div');
    head.className = 'et-start-guide-head';
    head.textContent = g.heading;
    box.appendChild(head);

    var grid = document.createElement('div');
    grid.className = 'et-start-guide-grid';

    var cards = [
      { title: g.c1Title, pills: g.c1Pills, body: g.c1Body, star: false },
      { title: g.c2Title, pills: g.c2Pills, body: g.c2Body, star: false }
    ];
    if (hasSavedFeature) {
      cards.push({ title: g.c3Title, pills: g.c3Pills, body: g.c3Body, star: true });
    }

    cards.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'et-sg-card' + (c.star ? ' is-star' : '');

      var pillsRow = document.createElement('div');
      pillsRow.className = 'et-sg-pills';
      c.pills.forEach(function (pTxt) {
        var sp = document.createElement('span');
        sp.className = 'et-sg-pill';
        sp.textContent = pTxt;
        pillsRow.appendChild(sp);
      });
      card.appendChild(pillsRow);

      var ttl = document.createElement('div');
      ttl.className = 'et-sg-title';
      ttl.textContent = c.title;
      card.appendChild(ttl);

      var bd = document.createElement('p');
      bd.className = 'et-sg-body';
      bd.textContent = c.body;
      card.appendChild(bd);

      grid.appendChild(card);
    });

    box.appendChild(grid);

    var btnContainer = startEl.querySelector('.button-container');
    var lastH4 = startEl.querySelector('h4:last-of-type');
    if (lastH4 && lastH4 !== startEl.querySelector('h4:first-of-type')) {
      startEl.insertBefore(box, lastH4);
    } else if (btnContainer) {
      startEl.insertBefore(box, btnContainer);
    } else {
      startEl.appendChild(box);
    }
  }

  function init() {
    injectStyles();
    mountStartMessageGuide();
    enhanceAllQuestions();
    checkActiveQuestionTransition();

    var container = document.querySelector('.quiz-container-s3');
    if (container && typeof MutationObserver !== 'undefined') {
      var rafScheduled = false;
      new MutationObserver(function () {
        if (rafScheduled) return;
        rafScheduled = true;
        requestAnimationFrame(function () {
          rafScheduled = false;
          enhanceAllQuestions();
          checkActiveQuestionTransition();
        });
      }).observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
