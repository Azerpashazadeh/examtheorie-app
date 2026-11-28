/*!
 * ExamTheorie — Saved Difficult Questions ("Zorlandığım Sorular") Homepage Card
 * Non-invasive modular widget for index.html & {nl,tr,ar,ru,fa,es}/index.html.
 */
(function () {
  'use strict';

  try {
    var SUPPORTED = ['en', 'nl', 'tr', 'ar', 'ru', 'fa', 'es'];

    var I18N = {
      tr: {
        title: 'Zorlandığım Sorular',
        countBadge: '{n} Soru',
        emptyHint: 'Sınav çözerken zorlandığınız sorularda "⭐ Zorlandıklarıma Ekle"ye basın; burada özel testiniz oluşsun.',
        readyHint: 'Kaydettiğiniz zor sorulardan oluşan süresiz, anında açıklamalı özel alıştırma testiniz hazır.',
        startBtn: '🎯 Alıştırma Testini Başlat →'
      },
      nl: {
        title: 'Mijn Lastige Vragen',
        countBadge: '{n} vragen',
        emptyHint: 'Klik tijdens een examen op "⭐ Opslaan als lastige vraag" om hier je eigen oefentoets op te bouwen.',
        readyHint: 'Je persoonlijke oefentoets zonder tijdslimiet met directe uitleg staat klaar.',
        startBtn: '🎯 Oefentoets starten →'
      },
      en: {
        title: 'My Difficult Questions',
        countBadge: '{n} Saved',
        emptyHint: 'Click "⭐ Save to Difficult Questions" inside any exam to build your personal practice quiz here.',
        readyHint: 'Practice your bookmarked questions untimed with instant answer checks and explanations.',
        startBtn: '🎯 Start Practice Quiz →'
      },
      ar: {
        title: 'أسئلتي الصعبة',
        countBadge: '{n} سؤال',
        emptyHint: 'اضغط على "⭐ حفظ في الأسئلة الصعبة" داخل أي اختبار لتكوين اختبارك التدريبي الخاص هنا.',
        readyHint: 'تدرّب على أسئلتك المحفوظة بدون وقت مع التحقق الفوري والشرح المفصل.',
        startBtn: '🎯 ابدأ الاختبار التدريبي ←'
      },
      ru: {
        title: 'Мои сложные вопросы',
        countBadge: '{n} вопр.',
        emptyHint: 'Нажимайте «⭐ В сложные вопросы» в экзамене, чтобы собрать здесь персональную тренировку.',
        readyHint: 'Персональный тест без таймера с мгновенной проверкой и разбором готов.',
        startBtn: '🎯 Начать тренировку →'
      },
      fa: {
        title: 'سؤالات دشوار من',
        countBadge: '{n} سؤال',
        emptyHint: 'در حین آزمون روی «⭐ ذخیره در سؤالات دشوار» بزنید تا آزمون تمرینی شخصی شما اینجا ساخته شود.',
        readyHint: 'آزمون تمرینی بدون زمان با بررسی فوری پاسخ و توضیحات آماده است.',
        startBtn: '🎯 شروع آزمون تمرینی ←'
      },
      es: {
        title: 'Mis Preguntas Difíciles',
        countBadge: '{n} guardadas',
        emptyHint: 'Pulsa "⭐ Guardar en preguntas difíciles" en cualquier examen para crear tu test personalizado aquí.',
        readyHint: 'Practica tus preguntas guardadas sin límite de tiempo y con explicación instantánea.',
        startBtn: '🎯 Iniciar práctica →'
      }
    };

    function getActiveLang() {
      try {
        if (typeof currentLang === 'string' && SUPPORTED.indexOf(currentLang) >= 0) return currentLang;
      } catch (_) {}
      var docLang = String(document.documentElement.lang || 'en').toLowerCase().split('-')[0];
      return SUPPORTED.indexOf(docLang) >= 0 ? docLang : 'en';
    }

    function getCurrentUserObj() {
      try {
        if (typeof currentUser !== 'undefined' && currentUser) return currentUser;
      } catch (_) {}
      return null;
    }

    function getSupabaseClient() {
      try {
        if (typeof _supabase !== 'undefined' && _supabase) return _supabase;
      } catch (_) {}
      return null;
    }

    function injectStyles() {
      if (document.getElementById('et-savedq-home-styles')) return;
      var st = document.createElement('style');
      st.id = 'et-savedq-home-styles';
      st.textContent = [
        '.et-savedq-card{margin:10px 0 14px;padding:12px 14px;border-radius:14px;border:1.5px dashed #cbd5e1;background:linear-gradient(135deg,#f8fafc,#f1f5f9);transition:all .2s ease}',
        '.et-savedq-card.has-items{border-style:solid;border-color:#f59e0b;background:linear-gradient(135deg,#fffbeb 0%,#eff6ff 100%);box-shadow:0 6px 18px rgba(245,158,11,.12)}',
        '.et-savedq-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}',
        '.et-savedq-title{display:flex;align-items:center;gap:6px;font-family:Outfit,Inter,sans-serif;font-weight:800;font-size:14px;color:#0f172a}',
        '.et-savedq-badge{font-size:11.5px;font-weight:800;padding:3px 9px;border-radius:999px;background:#e2e8f0;color:#475569;white-space:nowrap}',
        '.et-savedq-card.has-items .et-savedq-badge{background:#fef3c7;color:#b45309;border:1px solid #fde68a}',
        '.et-savedq-desc{font-size:12px;line-height:1.45;color:#475569;margin:0}',
        '.et-savedq-cta{margin-top:9px;width:100%;border:0;border-radius:10px;padding:9px 14px;background:linear-gradient(135deg,#0061ff,#0095ff);color:#ffffff;font-family:Outfit,Inter,sans-serif;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,97,255,.22);transition:transform .15s,box-shadow .15s}',
        '.et-savedq-cta:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,97,255,.3)}'
      ].join('\n');
      document.head.appendChild(st);
    }

    var cardEl = null;
    var countCache = new Map(); // userId:lang -> number
    var fetchToken = 0;

    function ensureCardMounted() {
      if (cardEl && document.body.contains(cardEl)) return cardEl;
      var grid = document.getElementById('testBtnGrid');
      if (!grid || !grid.parentNode) return null;
      cardEl = document.createElement('div');
      cardEl.id = 'etSavedQuestionsCard';
      cardEl.className = 'et-savedq-card';
      grid.parentNode.insertBefore(cardEl, grid);
      return cardEl;
    }

    function openSavedPractice() {
      var lang = getActiveLang();
      var usr = getCurrentUserObj();
      if (!usr) {
        try { if (typeof openModal === 'function') { openModal('si'); return; } } catch (_) {}
      }
      try {
        if (typeof canAccess === 'function' && !canAccess('tests')) {
          if (typeof showPaywall === 'function') { showPaywall('tests'); return; }
        }
      } catch (_) {}
      window.open('/saved-practice.html?lang=' + encodeURIComponent(lang), '_blank');
    }

    function renderCard(count) {
      var el = ensureCardMounted();
      if (!el) return;
      var lang = getActiveLang();
      var T = I18N[lang] || I18N.en;
      var isRtl = lang === 'ar' || lang === 'fa';
      el.dir = isRtl ? 'rtl' : 'ltr';
      el.classList.toggle('has-items', count > 0);

      el.innerHTML = '';
      var top = document.createElement('div');
      top.className = 'et-savedq-top';

      var title = document.createElement('div');
      title.className = 'et-savedq-title';
      title.innerHTML = '<span>⭐</span><span>' + T.title + '</span>';

      var badge = document.createElement('span');
      badge.className = 'et-savedq-badge';
      badge.textContent = T.countBadge.replace('{n}', String(count));

      top.appendChild(title);
      top.appendChild(badge);
      el.appendChild(top);

      var desc = document.createElement('p');
      desc.className = 'et-savedq-desc';
      desc.textContent = count > 0 ? T.readyHint : T.emptyHint;
      el.appendChild(desc);

      if (count > 0) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'et-savedq-cta';
        btn.textContent = T.startBtn;
        btn.onclick = openSavedPractice;
        el.appendChild(btn);
      }
    }

    async function refreshCount() {
      var el = ensureCardMounted();
      if (!el) return;
      var usr = getCurrentUserObj();
      var sb = getSupabaseClient();
      var lang = getActiveLang();

      if (!usr || !sb) {
        renderCard(0);
        return;
      }

      var cacheKey = usr.id + ':' + lang;
      if (countCache.has(cacheKey)) {
        renderCard(countCache.get(cacheKey));
      }

      var myToken = ++fetchToken;
      try {
        var res = await sb
          .from('user_saved_questions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', usr.id)
          .eq('language', lang);
        if (myToken !== fetchToken) return;
        var n = (res && typeof res.count === 'number') ? res.count : 0;
        countCache.set(cacheKey, n);
        renderCard(n);
      } catch (e) {
        renderCard(countCache.get(cacheKey) || 0);
      }
    }

    function init() {
      injectStyles();
      refreshCount();

      var sb = getSupabaseClient();
      if (sb && sb.auth && typeof sb.auth.onAuthStateChange === 'function') {
        sb.auth.onAuthStateChange(function () {
          countCache.clear();
          setTimeout(refreshCount, 120);
        });
      }

      window.addEventListener('message', function (e) {
        var d = e && e.data;
        if (d && d.action === 'savedQuestionsUpdated') {
          countCache.clear();
          refreshCount();
        }
      });

      window.addEventListener('focus', function () {
        countCache.clear();
        refreshCount();
      });

      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
          countCache.clear();
          refreshCount();
        }
      });

      // Re-render immediately whenever buildTestButtons() rebuilds #testBtnGrid (e.g. language switch)
      var grid = document.getElementById('testBtnGrid');
      if (grid && typeof MutationObserver !== 'undefined') {
        var pending = false;
        new MutationObserver(function () {
          if (pending) return;
          pending = true;
          requestAnimationFrame(function () {
            pending = false;
            refreshCount();
          });
        }).observe(grid, { childList: true });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (err) {
    console.warn('saved-questions-home init skipped:', err);
  }
})();
