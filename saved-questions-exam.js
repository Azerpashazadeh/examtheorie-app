/*!
 * ExamTheorie — Saved Difficult Questions ("Zorlandığım Sorular") Exam Bookmark Add-on
 * Works on BOTH paid test-{lang}.html AND free deneme-{lang}.html!
 * - Signed-in users: saves lightweight pointers directly to public.user_saved_questions
 * - Guests on free demo exams: saves to localStorage and auto-syncs to Supabase upon sign-in
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
    var GUEST_STORAGE_KEY = 'et_guest_saved_q_' + lang;

    var STRINGS = {
      tr: {
        shortAdd: 'Zor Soru',
        shortSaved: 'Kaydedildi',
        titleAdd: 'Bu soruyu Zorlandığım Sorulara ekle',
        titleSaved: 'Zorlandığım Sorularda kayıtlı (Çıkarmak için dokunun)',
        toastAdd: '⭐ Soru "Zorlandığım Sorular" havuzuna eklendi',
        toastGuestAdd: '⭐ Kaydedildi! Kalıcı olması ve alıştırma testi için giriş yapın',
        toastRem: 'Soru havuzdan çıkarıldı'
      },
      nl: {
        shortAdd: 'Opslaan',
        shortSaved: 'Opgeslagen',
        titleAdd: 'Deze vraag opslaan bij lastige vragen',
        titleSaved: 'Opgeslagen bij lastige vragen (tik om te verwijderen)',
        toastAdd: '⭐ Toegevoegd aan je lastige vragen',
        toastGuestAdd: '⭐ Opgeslagen! Log in om je oefentoets te openen',
        toastRem: 'Verwijderd uit lastige vragen'
      },
      en: {
        shortAdd: 'Save',
        shortSaved: 'Saved',
        titleAdd: 'Save this question to Difficult Questions',
        titleSaved: 'Saved in Difficult Questions (tap to remove)',
        toastAdd: '⭐ Added to Difficult Questions',
        toastGuestAdd: '⭐ Saved! Sign in to unlock your personal practice quiz',
        toastRem: 'Removed from Difficult Questions'
      },
      ar: {
        shortAdd: 'حفظ',
        shortSaved: 'محفوظ',
        titleAdd: 'حفظ هذا السؤال في الأسئلة الصعبة',
        titleSaved: 'محفوظ في الأسئلة الصعبة (اضغط للإزالة)',
        toastAdd: '⭐ تمت الإضافة إلى الأسئلة الصعبة',
        toastGuestAdd: '⭐ تم الحفظ! سجّل الدخول لفتح الاختبار التدريبي',
        toastRem: 'تمت الإزالة من الأسئلة الصعبة'
      },
      ru: {
        shortAdd: 'В сложные',
        shortSaved: 'Сохранено',
        titleAdd: 'Сохранить вопрос в сложные',
        titleSaved: 'Сохранено в сложных вопросах (нажмите, чтобы убрать)',
        toastAdd: '⭐ Добавлено в «Сложные вопросы»',
        toastGuestAdd: '⭐ Сохранено! Войдите в аккаунт для запуска тренировки',
        toastRem: 'Удалено из «Сложных вопросов»'
      },
      fa: {
        shortAdd: 'ذخیره',
        shortSaved: 'ذخیره شد',
        titleAdd: 'ذخیره این سؤال در سؤالات دشوار',
        titleSaved: 'ذخیره‌شده در سؤالات دشوار (برای حذف بزنید)',
        toastAdd: '⭐ به سؤالات دشوار اضافه شد',
        toastGuestAdd: '⭐ ذخیره شد! برای باز کردن آزمون تمرینی وارد شوید',
        toastRem: 'از سؤالات دشوار حذف شد'
      },
      es: {
        shortAdd: 'Guardar',
        shortSaved: 'Guardada',
        titleAdd: 'Guardar pregunta en difíciles',
        titleSaved: 'Guardada en preguntas difíciles (pulsa para quitar)',
        toastAdd: '⭐ Añadida a Preguntas Difíciles',
        toastGuestAdd: '⭐ ¡Guardada! Inicia sesión para abrir tu práctica',
        toastRem: 'Eliminada de Preguntas Difíciles'
      }
    };
    var T = STRINGS[lang] || STRINGS.en;

    var STAR_OUTLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    var STAR_FILLED = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

    var sbClient = null;
    var currentUserId = null;
    var savedKeys = new Set();
    var busyKeys = new Set();
    var toolbarBtn = null;
    var activePointer = null;

    function readGuestList() {
      try {
        var raw = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || '[]');
        return Array.isArray(raw) ? raw : [];
      } catch (_) {
        return [];
      }
    }

    function writeGuestList(arr) {
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(arr));
      } catch (_) {}
    }

    function injectStyles() {
      if (document.getElementById('et-saveq-styles')) return;
      var st = document.createElement('style');
      st.id = 'et-saveq-styles';
      st.textContent = [
        /* Hide "Time Left" / "Kalan süre" caption next to countdown timer — replaced by star button */
        '.exam-toolbar .countdown-caption{display:none!important}',
        '.exam-toolbar .timer-slot{display:flex;align-items:center;gap:9px}',
        '.exam-shell.et-on-question:not(.has-timer) .timer-slot{display:flex!important}',
        '@media(max-width:720px),(pointer:coarse) and (max-width:1100px){' +
          '.exam-shell.et-on-question:not(.has-timer) .progress-group{grid-column:2!important}' +
        '}',
        /* Smooth vertical touch-scrolling directly over all question images */
        '.question-image,.image-wrapper img,.drag-drop-container img{-webkit-user-drag:none;user-select:none;-webkit-touch-callout:none;touch-action:pan-y pinch-zoom!important}',
        '.drag-drop-container img{pointer-events:none}',
        '.questionS3>.drag-drop-container{touch-action:pan-y pinch-zoom!important}',
        '.drag-drop-container .box{touch-action:none!important}',
        '.et-toolbar-savebtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 12px;border-radius:999px;border:1.5px solid #cbd5e1;background:#ffffff;color:#334155;font-family:Outfit,Inter,"Segoe UI",sans-serif;font-size:12.5px;font-weight:700;line-height:1;cursor:pointer;transition:all .16s ease;pointer-events:auto!important;user-select:none;white-space:nowrap;flex-shrink:0;box-shadow:0 2px 6px rgba(15,23,42,.05)}',
        '.et-toolbar-savebtn[hidden]{display:none!important}',
        '.et-toolbar-savebtn:hover{border-color:#f59e0b;background:#fffbeb;color:#b45309;transform:translateY(-1px)}',
        '.et-toolbar-savebtn svg{width:15.5px;height:15.5px;flex-shrink:0;color:#f59e0b}',
        '.et-toolbar-savebtn.is-saved{border-color:#f59e0b!important;background:linear-gradient(135deg,#fffbeb,#fef3c7)!important;color:#92400e!important;box-shadow:0 3px 10px rgba(245,158,11,.22)}',
        '.et-toolbar-savebtn.is-saved svg{color:#d97706}',
        '.et-toolbar-savebtn.is-busy{opacity:.6;pointer-events:none!important}',
        '@media(max-width:960px){' +
          '.et-toolbar-savebtn{width:32px;height:32px;padding:0;gap:0}' +
          '.et-toolbar-savebtn .et-saveq-lbl{display:none}' +
          '.exam-toolbar .timer-slot{gap:7px}' +
        '}',
        '.et-saveq-toast{position:fixed;bottom:72px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:9px 16px;border-radius:999px;font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(15,23,42,.28);z-index:10000;pointer-events:none;opacity:0;transition:opacity .2s;white-space:nowrap;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis}',
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
      }, 2500);
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
      // Populate guest bookmarks immediately
      var guestItems = readGuestList();
      guestItems.forEach(function (g) {
        if (g && g.contentTest && g.fileType && g.numara) {
          savedKeys.add(g.contentTest + ':' + g.fileType + ':' + g.numara);
        }
      });
      syncToolbarButton();

      try {
        var ok = await ensureSupabase();
        if (!ok) return;

        // Migrate any guest bookmarks into user's Supabase account seamlessly
        if (guestItems.length > 0) {
          var toUpsert = guestItems
            .filter(function (g) { return g && g.contentTest && g.fileType && g.numara; })
            .map(function (g) {
              return {
                user_id: currentUserId,
                language: lang,
                content_test: Number(g.contentTest),
                file_type: String(g.fileType),
                question_numara: Number(g.numara),
                source_test: Number(g.sourceTest) || 1
              };
            });
          if (toUpsert.length > 0) {
            var mig = await sbClient
              .from('user_saved_questions')
              .upsert(toUpsert, { onConflict: 'user_id,language,content_test,file_type,question_numara' });
            if (!mig.error) {
              writeGuestList([]);
              notifyParentWindow();
            }
          }
        }

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
          syncToolbarButton();
        }
      } catch (e) {
        console.warn('Saved questions load skipped:', e);
      }
    }

    async function toggleSaveActive() {
      var ptr = activePointer;
      if (!ptr || busyKeys.has(ptr.key)) return;
      busyKeys.add(ptr.key);
      syncToolbarButton();
      try {
        var ok = false;
        try { ok = await ensureSupabase(); } catch (_) { ok = false; }

        var currentlySaved = savedKeys.has(ptr.key);

        if (!ok) {
          // Guest fallback on free demo exam (deneme-*)
          var list = readGuestList();
          if (currentlySaved) {
            list = list.filter(function (g) {
              return (g.contentTest + ':' + g.fileType + ':' + g.numara) !== ptr.key;
            });
            writeGuestList(list);
            savedKeys.delete(ptr.key);
            showToast(T.toastRem);
            notifyParentWindow();
          } else {
            list.push({
              contentTest: ptr.contentTest,
              fileType: ptr.fileType,
              numara: ptr.numara,
              sourceTest: ptr.sourceTest
            });
            writeGuestList(list);
            savedKeys.add(ptr.key);
            showToast(T.toastGuestAdd);
            notifyParentWindow();
          }
          return;
        }

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
        syncToolbarButton();
      }
    }

    function ensureToolbarButton() {
      if (toolbarBtn && document.body.contains(toolbarBtn)) return toolbarBtn;
      var slot = document.querySelector('.exam-toolbar .timer-slot');
      if (!slot) return null;
      toolbarBtn = document.createElement('button');
      toolbarBtn.type = 'button';
      toolbarBtn.id = 'etToolbarSaveBtn';
      toolbarBtn.className = 'et-toolbar-savebtn';
      toolbarBtn.hidden = true;
      toolbarBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleSaveActive();
      });
      slot.insertBefore(toolbarBtn, slot.firstChild);
      return toolbarBtn;
    }

    function findVisibleQuestionIndex() {
      var container = document.querySelector('.quiz-container-s3');
      if (!container || container.classList.contains('hidden') || container.style.display === 'none') {
        return -1;
      }
      var cur = container.querySelector('.questionS3:not(.hidden)');
      if (!cur || cur.style.display === 'none') return -1;
      var idParts = String(cur.id || '').split('-');
      var oneBased = Number(idParts[idParts.length - 1]);
      return (Number.isInteger(oneBased) && oneBased >= 1) ? (oneBased - 1) : -1;
    }

    function syncToolbarButton() {
      var btn = ensureToolbarButton();
      var shell = document.getElementById('exam-shell');
      if (!btn || !shell) return;

      var qIdx = findVisibleQuestionIndex();
      var ptr = qIdx >= 0 ? extractPointer(qIdx) : null;
      activePointer = ptr;

      var onQuestion = Boolean(ptr);
      shell.classList.toggle('et-on-question', onQuestion);
      btn.hidden = !onQuestion;
      if (!onQuestion) return;

      var isSaved = savedKeys.has(ptr.key);
      var isBusy = busyKeys.has(ptr.key);
      btn.classList.toggle('is-saved', isSaved);
      btn.classList.toggle('is-busy', isBusy);
      btn.setAttribute('aria-pressed', String(isSaved));
      var fullTitle = isSaved ? T.titleSaved : T.titleAdd;
      btn.title = fullTitle;
      btn.setAttribute('aria-label', fullTitle);
      btn.innerHTML = (isSaved ? STAR_FILLED : STAR_OUTLINE) + '<span class="et-saveq-lbl">' + (isSaved ? T.shortSaved : T.shortAdd) + '</span>';
    }

    function init() {
      injectStyles();
      // Prevent native HTML5 image drag from hijacking vertical scroll gestures
      document.addEventListener('dragstart', function (ev) {
        if (ev.target && ev.target.tagName === 'IMG') {
          ev.preventDefault();
        }
      });

      ensureToolbarButton();
      loadSavedSet();
      syncToolbarButton();

      var shell = document.getElementById('exam-shell');
      if (shell && typeof MutationObserver !== 'undefined') {
        var scheduled = false;
        new MutationObserver(function () {
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(function () {
            scheduled = false;
            syncToolbarButton();
          });
        }).observe(shell, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
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
