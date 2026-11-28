/*!
 * ExamTheorie — Saved Difficult Questions ("Zorlandığım Sorular") Exam Bookmark Add-on
 * Mounts inline inside .et-tts-qbar (0px extra vertical height on mobile & desktop).
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
        shortAdd: 'Zor Soru',
        shortSaved: 'Kaydedildi',
        titleAdd: 'Zorlandığım Sorulara Ekle',
        titleSaved: 'Zorlandığım Sorulara Kaydedildi (Çıkarmak için tıklayın)',
        toastAdd: '⭐ "Zorlandığım Sorular" havuzuna eklendi',
        toastRem: 'Soru havuzdan çıkarıldı'
      },
      nl: {
        shortAdd: 'Opslaan',
        shortSaved: 'Opgeslagen',
        titleAdd: 'Opslaan bij mijn lastige vragen',
        titleSaved: 'Opgeslagen bij lastige vragen (klik om te verwijderen)',
        toastAdd: '⭐ Toegevoegd aan je lastige vragen',
        toastRem: 'Verwijderd uit lastige vragen'
      },
      en: {
        shortAdd: 'Save',
        shortSaved: 'Saved',
        titleAdd: 'Save to Difficult Questions',
        titleSaved: 'Saved in Difficult Questions (click to remove)',
        toastAdd: '⭐ Added to Difficult Questions',
        toastRem: 'Removed from Difficult Questions'
      },
      ar: {
        shortAdd: 'حفظ',
        shortSaved: 'محفوظ',
        titleAdd: 'حفظ في الأسئلة الصعبة',
        titleSaved: 'محفوظ في الأسئلة الصعبة (اضغط للإزالة)',
        toastAdd: '⭐ تمت الإضافة إلى الأسئلة الصعبة',
        toastRem: 'تمت الإزالة من الأسئلة الصعبة'
      },
      ru: {
        shortAdd: 'В сложные',
        shortSaved: 'Сохранено',
        titleAdd: 'Сохранить в сложные вопросы',
        titleSaved: 'Сохранено в сложных вопросах (нажмите, чтобы убрать)',
        toastAdd: '⭐ Добавлено в «Сложные вопросы»',
        toastRem: 'Удалено из «Сложных вопросов»'
      },
      fa: {
        shortAdd: 'ذخیره',
        shortSaved: 'ذخیره شد',
        titleAdd: 'ذخیره در سؤالات دشوار',
        titleSaved: 'ذخیره‌شده در سؤالات دشوار (برای حذف بزنید)',
        toastAdd: '⭐ به سؤالات دشوار اضافه شد',
        toastRem: 'از سؤالات دشوار حذف شد'
      },
      es: {
        shortAdd: 'Guardar',
        shortSaved: 'Guardada',
        titleAdd: 'Guardar en preguntas difíciles',
        titleSaved: 'Guardada en preguntas difíciles (pulsa para quitar)',
        toastAdd: '⭐ Añadida a Preguntas Difíciles',
        toastRem: 'Eliminada de Preguntas Difíciles'
      }
    };
    var T = STRINGS[lang] || STRINGS.en;

    var STAR_OUTLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    var STAR_FILLED = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

    var sbClient = null;
    var currentUserId = null;
    var savedKeys = new Set();
    var busyKeys = new Set();
    var buttonByKey = new Map();

    function injectStyles() {
      if (document.getElementById('et-saveq-styles')) return;
      var st = document.createElement('style');
      st.id = 'et-saveq-styles';
      st.textContent = [
        '.et-saveq-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 12px;border-radius:999px;border:1.5px solid #cbd5e1;background:#ffffff;color:#475569;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:12.5px;font-weight:700;line-height:1;cursor:pointer;transition:all .16s ease;pointer-events:auto!important;user-select:none;white-space:nowrap;flex-shrink:0}',
        '.et-saveq-btn:hover{border-color:#f59e0b;background:#fffbeb;color:#b45309;transform:translateY(-1px)}',
        '.et-saveq-btn svg{width:15px;height:15px;flex-shrink:0;color:#f59e0b}',
        '.et-saveq-btn.is-saved{border-color:#f59e0b!important;background:linear-gradient(135deg,#fffbeb,#fef3c7)!important;color:#92400e!important;box-shadow:0 3px 10px rgba(245,158,11,.2)}',
        '.et-saveq-btn.is-saved svg{color:#d97706}',
        '.et-saveq-btn.is-busy{opacity:.6;pointer-events:none!important}',
        '@media(max-width:1360px){.et-saveq-btn{width:36px;padding:0}.et-saveq-lbl{display:none}}',
        '@media(max-width:720px),(pointer:coarse) and (max-width:1100px){' +
          '.et-saveq-btn{width:30px;height:30px;padding:0;gap:0}' +
          '.et-saveq-btn svg{width:14.5px;height:14.5px}' +
          '.et-saveq-lbl{display:none}' +
        '}',
        '.et-saveq-fallback-wrap{display:flex;align-items:center;margin:0 0 4px;pointer-events:auto!important}',
        '.et-saveq-toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:9px 16px;border-radius:999px;font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(15,23,42,.28);z-index:10000;pointer-events:none;opacity:0;transition:opacity .2s;white-space:nowrap;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis}',
        '.et-saveq-toast.is-visible{opacity:1}'
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
      var fullTitle = isSaved ? T.titleSaved : T.titleAdd;
      btn.title = fullTitle;
      btn.setAttribute('aria-label', fullTitle);
      btn.innerHTML = (isSaved ? STAR_FILLED : STAR_OUTLINE) + '<span class="et-saveq-lbl">' + (isSaved ? T.shortSaved : T.shortAdd) + '</span>';
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

    function placeInsideTtsBar(qEl, btn) {
      var ttsBar = qEl.querySelector('.et-tts-qbar');
      if (!ttsBar) return false;
      var fallback = btn.parentElement && btn.parentElement.classList.contains('et-saveq-fallback-wrap')
        ? btn.parentElement
        : null;
      var anchor = ttsBar.querySelector('.et-tts-voice-seg') || ttsBar.querySelector('.et-tts-gear-wrap');
      if (anchor) {
        ttsBar.insertBefore(btn, anchor);
      } else {
        ttsBar.appendChild(btn);
      }
      if (fallback) fallback.remove();
      return true;
    }

    function enhanceQuestions() {
      var container = document.querySelector('.quiz-container-s3');
      if (!container) return;
      var questions = container.querySelectorAll('.questionS3');
      if (!questions.length) return;

      questions.forEach(function (qEl, idx) {
        var existingBtn = qEl.querySelector('.et-saveq-btn');
        if (existingBtn) {
          // If exam-tts.js created .et-tts-qbar after our fallback, dock inline into .et-tts-qbar!
          if (!existingBtn.closest('.et-tts-qbar')) {
            placeInsideTtsBar(qEl, existingBtn);
          }
          return;
        }

        var ptr = extractPointer(idx);
        if (!ptr) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'et-saveq-btn';
        renderBtnState(btn, savedKeys.has(ptr.key));

        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          toggleSave(ptr);
        });

        if (!placeInsideTtsBar(qEl, btn)) {
          var answersDiv = qEl.querySelector(':scope > .answers');
          if (!answersDiv) {
            answersDiv = document.createElement('div');
            answersDiv.className = 'answers';
            qEl.appendChild(answersDiv);
          }
          var wrap = document.createElement('div');
          wrap.className = 'et-saveq-fallback-wrap';
          wrap.appendChild(btn);
          answersDiv.insertBefore(wrap, answersDiv.firstChild);
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
