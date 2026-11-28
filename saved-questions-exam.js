/*!
 * ExamTheorie — Saved Difficult Questions ("Zorlandığım Sorular") Exam Bookmark Add-on
 * Non-invasive modular script for test-{en,nl,tr,ar,ru,fa,es}.html.
 * Stores lightweight question pointers (~50 bytes, zero images/blobs) in public.user_saved_questions.
 */
(function () {
  'use strict';

  try {
    var SUPABASE_URL = 'https://rvbcsakzfadhtlfeigus.supabase.co';
    var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YmNzYWt6ZmFkaHRsZmVpZ3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjE0NTAsImV4cCI6MjA4NjkzNzQ1MH0.jU0Yt5pMurD9vhZeDTQCasQLkz-saZlhWekXDgUegRs';
    var SUPPORTED = ['en', 'nl', 'tr', 'ar', 'ru', 'fa', 'es'];

    var rawLang = String(document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    var lang = SUPPORTED.indexOf(rawLang) >= 0 ? rawLang : 'en';
    var isRtl = lang === 'ar' || lang === 'fa';

    var STRINGS = {
      tr: {
        add: 'Zorlandıklarıma Ekle',
        saved: 'Zorlandıklarıma Kaydedildi',
        toastAdd: '⭐ "Zorlandığım Sorular" listesine eklendi',
        toastRem: 'Listeden çıkarıldı'
      },
      nl: {
        add: 'Opslaan als lastige vraag',
        saved: 'Opgeslagen bij lastige vragen',
        toastAdd: '⭐ Toegevoegd aan je lastige vragen',
        toastRem: 'Verwijderd uit lastige vragen'
      },
      en: {
        add: 'Save to Difficult Questions',
        saved: 'Saved in Difficult Questions',
        toastAdd: '⭐ Added to Difficult Questions',
        toastRem: 'Removed from Difficult Questions'
      },
      ar: {
        add: 'حفظ في الأسئلة الصعبة',
        saved: 'محفوظ في الأسئلة الصعبة',
        toastAdd: '⭐ تمت الإضافة إلى الأسئلة الصعبة',
        toastRem: 'تمت الإزالة من الأسئلة الصعبة'
      },
      ru: {
        add: 'В сложные вопросы',
        saved: 'Сохранено в сложных',
        toastAdd: '⭐ Добавлено в «Сложные вопросы»',
        toastRem: 'Удалено из «Сложных вопросов»'
      },
      fa: {
        add: 'ذخیره در سؤالات دشوار',
        saved: 'ذخیره‌شده در سؤالات دشوار',
        toastAdd: '⭐ به سؤالات دشوار اضافه شد',
        toastRem: 'از سؤالات دشوار حذف شد'
      },
      es: {
        add: 'Guardar en preguntas difíciles',
        saved: 'Guardada en difíciles',
        toastAdd: '⭐ Añadida a Preguntas Difíciles',
        toastRem: 'Eliminada de Preguntas Difíciles'
      }
    };
    var T = STRINGS[lang] || STRINGS.en;

    var STAR_OUTLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    var STAR_FILLED = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

    var sbClient = null;
    var currentUserId = null;
    var savedKeys = new Set();
    var busyKeys = new Set();
    var buttonByKey = new Map(); // key -> Set<HTMLButtonElement>

    function injectStyles() {
      if (document.getElementById('et-saveq-styles')) return;
      var st = document.createElement('style');
      st.id = 'et-saveq-styles';
      st.textContent = [
        '.et-saveq-bar{display:flex;align-items:center;margin:0 0 4px;position:relative;z-index:7;pointer-events:auto!important}',
        '.et-saveq-btn{display:inline-flex;align-items:center;gap:6px;height:33px;padding:0 13px;border-radius:999px;border:1.5px dashed #cbd5e1;background:#f8fafc;color:#475569;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:12.5px;font-weight:700;line-height:1;cursor:pointer;transition:all .16s ease;pointer-events:auto!important;user-select:none;white-space:nowrap}',
        '.et-saveq-btn:hover{border-style:solid;border-color:#f59e0b;background:#fffbeb;color:#b45309;transform:translateY(-1px)}',
        '.et-saveq-btn svg{width:14.5px;height:14.5px;flex-shrink:0;color:#f59e0b}',
        '.et-saveq-btn.is-saved{border-style:solid;border-color:#f59e0b!important;background:linear-gradient(135deg,#fffbeb,#fef3c7)!important;color:#92400e!important;box-shadow:0 3px 10px rgba(245,158,11,.18)}',
        '.et-saveq-btn.is-saved svg{color:#d97706}',
        '.et-saveq-btn.is-busy{opacity:.65;pointer-events:none!important}',
        '.et-saveq-toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:9px 16px;border-radius:999px;font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(15,23,42,.28);z-index:10000;pointer-events:none;opacity:0;transition:opacity .2s;white-space:nowrap;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis}',
        '.et-saveq-toast.is-visible{opacity:1}',
        '@media(max-width:720px),(pointer:coarse) and (max-width:1100px){' +
          '.et-saveq-bar{margin:0 0 2px}' +
          '.et-saveq-btn{height:29px;padding:0 10px;font-size:11.5px;gap:5px}' +
          '.et-saveq-btn svg{width:13.5px;height:13.5px}' +
        '}'
      ].join('\n');
      document.head.appendChild(st);
    }

    var toastEl = null;
    var toastTimer = null;
    function showToast(msg) {
      if (!msg) return;
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'et-saveq-toast';
        if (isRtl) toastEl.dir = 'rtl';
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = msg;
      toastEl.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        if (toastEl) toastEl.classList.remove('is-visible');
      }, 2200);
    }

    function getAllQuestionsRef() {
      try {
        if (typeof allQuestionsS3 !== 'undefined' && Array.isArray(allQuestionsS3)) return allQuestionsS3;
      } catch (_) {}
      if (Array.isArray(window.allQuestionsS3)) return window.allQuestionsS3;
      return null;
    }

    function extractPointer(qIndexZeroBased) {
      var arr = getAllQuestionsRef();
      if (!arr || !arr[qIndexZeroBased]) return null;
      var q = arr[qIndexZeroBased];
      var numara = Number(q.numara);
      if (!Number.isInteger(numara) || numara < 1) return null;

      var testNum = Number(window.DYNAMIC_TEST_NUMBER) || 1;
      var contentTest = ((testNum - 1) % 5) + 1;
      var fileType = 'radio';
      if (q.type === 'dragdrop') fileType = 'dragdrop';
      else if (q.type === 'image') fileType = 'resimsech';
      else if (q.type === 'checkbox') fileType = 'checkbox';
      else if (q.onlyNumbers) fileType = 'fillblank';

      return {
        contentTest: contentTest,
        fileType: fileType,
        numara: numara,
        sourceTest: testNum,
        key: contentTest + ':' + fileType + ':' + numara
      };
    }

    function renderBtnState(btn, isSaved) {
      btn.classList.toggle('is-saved', isSaved);
      btn.setAttribute('aria-pressed', String(isSaved));
      btn.innerHTML = (isSaved ? STAR_FILLED : STAR_OUTLINE) + '<span>' + (isSaved ? T.saved : T.add) + '</span>';
    }

    function syncAllButtonsForKey(key) {
      var set = buttonByKey.get(key);
      if (!set) return;
      var isSaved = savedKeys.has(key);
      var isBusy = busyKeys.has(key);
      set.forEach(function (b) {
        b.classList.toggle('is-busy', isBusy);
        renderBtnState(b, isSaved);
      });
    }

    function notifyParentWindow() {
      try {
        var pw = (window.opener && !window.opener.closed)
          ? window.opener
          : (window.parent && window.parent !== window ? window.parent : null);
        if (pw) {
          pw.postMessage({ action: 'savedQuestionsUpdated', lang: lang }, '*');
        }
      } catch (_) {}
    }

    async function ensureSupabase() {
      if (sbClient && currentUserId) return true;
      if (typeof window.supabase === 'undefined') {
        await new Promise(function (resolve, reject) {
          var existing = document.querySelector('script[src*="@supabase/supabase-js"]');
          if (existing) {
            var checks = 0;
            var iv = setInterval(function () {
              checks++;
              if (typeof window.supabase !== 'undefined') { clearInterval(iv); resolve(); }
              else if (checks > 40) { clearInterval(iv); reject(new Error('Supabase timeout')); }
            }, 100);
            return;
          }
          var s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      if (!sbClient) {
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      }
      var res = await sbClient.auth.getSession();
      currentUserId = res && res.data && res.data.session && res.data.session.user
        ? res.data.session.user.id
        : null;
      return Boolean(currentUserId);
    }

    async function loadSavedSet() {
      try {
        var ok = await ensureSupabase();
        if (!ok) return;
        var res = await sbClient
          .from('user_saved_questions')
          .select('content_test,file_type,question_numara')
          .eq('user_id', currentUserId)
          .eq('language', lang);
        if (res && Array.isArray(res.data)) {
          savedKeys.clear();
          res.data.forEach(function (r) {
            savedKeys.add(r.content_test + ':' + r.file_type + ':' + r.question_numara);
          });
          buttonByKey.forEach(function (_, k) { syncAllButtonsForKey(k); });
        }
      } catch (e) {
        console.warn('Saved questions load skipped:', e);
      }
    }

    async function toggleSave(ptr) {
      if (!ptr || busyKeys.has(ptr.key)) return;
      busyKeys.add(ptr.key);
      syncAllButtonsForKey(ptr.key);
      try {
        var ok = await ensureSupabase();
        if (!ok) return;
        var currentlySaved = savedKeys.has(ptr.key);
        if (currentlySaved) {
          var del = await sbClient
            .from('user_saved_questions')
            .delete()
            .eq('user_id', currentUserId)
            .eq('language', lang)
            .eq('content_test', ptr.contentTest)
            .eq('file_type', ptr.fileType)
            .eq('question_numara', ptr.numara);
          if (!del.error) {
            savedKeys.delete(ptr.key);
            showToast(T.toastRem);
            notifyParentWindow();
          }
        } else {
          var ins = await sbClient
            .from('user_saved_questions')
            .upsert({
              user_id: currentUserId,
              language: lang,
              content_test: ptr.contentTest,
              file_type: ptr.fileType,
              question_numara: ptr.numara,
              source_test: ptr.sourceTest
            }, { onConflict: 'user_id,language,content_test,file_type,question_numara' });
          if (!ins.error) {
            savedKeys.add(ptr.key);
            showToast(T.toastAdd);
            notifyParentWindow();
          }
        }
      } catch (e) {
        console.warn('Saved question toggle failed:', e);
      } finally {
        busyKeys.delete(ptr.key);
        syncAllButtonsForKey(ptr.key);
      }
    }

    function enhanceQuestions() {
      var container = document.querySelector('.quiz-container-s3');
      if (!container) return;
      var questions = container.querySelectorAll('.questionS3');
      if (!questions.length) return;

      questions.forEach(function (qEl, idx) {
        if (qEl.dataset.etSaveqEnhanced === '1') return;
        var ptr = extractPointer(idx);
        if (!ptr) return;
        qEl.dataset.etSaveqEnhanced = '1';

        var answersDiv = qEl.querySelector(':scope > .answers');
        if (!answersDiv) {
          answersDiv = document.createElement('div');
          answersDiv.className = 'answers';
          qEl.appendChild(answersDiv);
        }

        var bar = document.createElement('div');
        bar.className = 'et-saveq-bar';
        if (isRtl) bar.dir = 'rtl';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'et-saveq-btn';
        renderBtnState(btn, savedKeys.has(ptr.key));

        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          toggleSave(ptr);
        });

        bar.appendChild(btn);

        var ttsBar = answersDiv.querySelector(':scope > .et-tts-qbar');
        if (ttsBar && ttsBar.nextSibling) {
          answersDiv.insertBefore(bar, ttsBar.nextSibling);
        } else if (ttsBar) {
          answersDiv.appendChild(bar);
        } else {
          answersDiv.insertBefore(bar, answersDiv.firstChild);
        }

        if (!buttonByKey.has(ptr.key)) buttonByKey.set(ptr.key, new Set());
        buttonByKey.get(ptr.key).add(btn);
      });
    }

    function init() {
      injectStyles();
      loadSavedSet();
      enhanceQuestions();

      var container = document.querySelector('.quiz-container-s3');
      if (container && typeof MutationObserver !== 'undefined') {
        var scheduled = false;
        new MutationObserver(function () {
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(function () {
            scheduled = false;
            enhanceQuestions();
          });
        }).observe(container, { childList: true, subtree: true });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (err) {
    console.warn('saved-questions-exam init skipped:', err);
  }
})();
