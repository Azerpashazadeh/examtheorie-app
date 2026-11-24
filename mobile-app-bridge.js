/**
 * mobile-app-bridge.js — ExamTheorie Android App Bridge
 *
 * Activates ONLY inside the native Android Capacitor app (or ?app=android test mode).
 * Regular desktop and mobile web browsers execute zero overrides and remain 100% unchanged.
 */
(function () {
    'use strict';

    const isNativeApp = () => {
        try {
            const detected =
                /ExamTheorieAndroid/i.test(navigator.userAgent || '') ||
                Boolean(window.Capacitor?.isNativePlatform?.()) ||
                new URLSearchParams(window.location.search).get('app') === 'android' ||
                sessionStorage.getItem('et_native_app') === '1';
            if (detected) {
                try {
                    sessionStorage.setItem('et_native_app', '1');
                } catch (_) {}
            }
            return detected;
        } catch (_) {
            return false;
        }
    };

    // Zero side effects on regular web browsers
    if (!isNativeApp()) return;

    document.documentElement.classList.add('et-native-app');

    const OAUTH_REDIRECT_URI = 'nl.examtheorie.app://auth-callback';
    const SUPPORTED_LANGS = ['en', 'nl', 'tr', 'ar'];

    const BRIDGE_I18N = {
        en: {
            back: '← Back',
            exitExamConfirm: 'Exit this exam? Your current exam answers will not be saved.',
            guestTitle: 'Member Sign-In Required',
            guestDescTests: 'Sign in with your ExamTheorie account to access all 50 CBR practice exams and sync your progress across devices, or try the free practice content below.',
            guestDescTheory: 'Sign in with your ExamTheorie account to unlock all CBR theory chapters and reference guides, or try the free practice content below.',
            signInBtn: 'Sign In to Your Account',
            memberTitle: 'Active Membership Required',
            memberDescTests: 'This feature requires an active ExamTheorie membership on your account. If your membership was recently activated, tap Refresh Account Status below.',
            memberDescTheory: 'Full theory chapters require an active ExamTheorie membership on your account. If your membership was recently activated, tap Refresh Account Status below.',
            refreshBtn: '🔄 Refresh Account Status',
            refreshingBtn: '⏳ Checking...',
            refreshUnlocked: '✅ Active membership found! Content unlocked.',
            refreshNotFound: 'ℹ️ No active membership found on this account yet.',
            freeExamBtn: 'Try Free Practice Exam (50 Questions)',
            freeChapterBtn: 'Read Free Chapter 1 (Traffic Rules)',
            syncNote: 'Account progress syncs automatically across devices',
            howStep1Title: 'Sign In or Start Free',
            howStep1Desc: 'Log in with your account or start right away with the free mock exam.',
            faqFreeQ: 'Can I try a free CBR driving theory practice test?'
        },
        nl: {
            back: '← Terug',
            exitExamConfirm: 'Dit examen verlaten? Je huidige antwoorden worden niet opgeslagen.',
            guestTitle: 'Inloggen Vereist',
            guestDescTests: 'Log in met je ExamTheorie-account om toegang te krijgen tot alle 50 CBR-oefenexamens en je voortgang te synchroniseren, of probeer hieronder de gratis oefeninhoud.',
            guestDescTheory: 'Log in met je ExamTheorie-account om alle CBR-theoriehoofdstukken en naslagwerken te openen, of probeer hieronder de gratis oefeninhoud.',
            signInBtn: 'Inloggen op je Account',
            memberTitle: 'Actief Lidmaatschap Vereist',
            memberDescTests: 'Voor deze functie is een actief ExamTheorie-lidmaatschap op je account vereist. Als je lidmaatschap onlangs is geactiveerd, tik dan hieronder op Accountstatus vernieuwen.',
            memberDescTheory: 'Voor volledige theoriehoofdstukken is een actief ExamTheorie-lidmaatschap op je account vereist. Als je lidmaatschap onlangs is geactiveerd, tik dan hieronder op Accountstatus vernieuwen.',
            refreshBtn: '🔄 Accountstatus vernieuwen',
            refreshingBtn: '⏳ Controleren...',
            refreshUnlocked: '✅ Actief lidmaatschap gevonden! Inhoud ontgrendeld.',
            refreshNotFound: 'ℹ️ Nog geen actief lidmaatschap gevonden op dit account.',
            freeExamBtn: 'Gratis Proefexamen Maken (50 Vragen)',
            freeChapterBtn: 'Lees Gratis Hoofdstuk 1 (Verkeersregels)',
            syncNote: 'Voortgang wordt automatisch gesynchroniseerd met je account',
            howStep1Title: 'Log In of Start Gratis',
            howStep1Desc: 'Log in met je account of begin direct met het gratis proefexamen.',
            faqFreeQ: 'Kan ik gratis een CBR theorie-examen oefenen?'
        },
        tr: {
            back: '← Geri',
            exitExamConfirm: 'Sınavdan çıkmak istiyor musunuz? Mevcut cevaplarınız kaydedilmeyecektir.',
            guestTitle: 'Üye Girişi Gerekli',
            guestDescTests: 'Tüm 50 CBR deneme sınavına erişmek ve ilerlemenizi cihazlar arasında eşitlemek için ExamTheorie hesabınızla giriş yapın veya aşağıdaki ücretsiz içerikleri deneyin.',
            guestDescTheory: 'Tüm CBR teori bölümlerine ve rehberlere erişmek için ExamTheorie hesabınızla giriş yapın veya aşağıdaki ücretsiz içerikleri deneyin.',
            signInBtn: 'Hesabına Giriş Yap',
            memberTitle: 'Aktif Üyelik Gerekli',
            memberDescTests: 'Bu özellik için hesabınızda aktif bir ExamTheorie üyeliği gereklidir. Üyeliğiniz yeni tanımlandıysa aşağıdaki Hesap Durumunu Yenile düğmesine dokunun.',
            memberDescTheory: 'Tüm teori bölümlerine erişmek için hesabınızda aktif bir ExamTheorie üyeliği gereklidir. Üyeliğiniz yeni tanımlandıysa aşağıdaki Hesap Durumunu Yenile düğmesine dokunun.',
            refreshBtn: '🔄 Hesap Durumunu Yenile',
            refreshingBtn: '⏳ Kontrol ediliyor...',
            refreshUnlocked: '✅ Aktif üyelik bulundu! İçerikler açıldı.',
            refreshNotFound: 'ℹ️ Bu hesapta henüz aktif bir üyelik bulunamadı.',
            freeExamBtn: 'Ücretsiz Deneme Sınavını Çöz (50 Soru)',
            freeChapterBtn: 'Ücretsiz 1. Bölümü Oku (Trafik Kuralları)',
            syncNote: 'İlerlemeniz tüm cihazlarınızda otomatik olarak eşitlenir',
            howStep1Title: 'Giriş Yap veya Ücretsiz Başla',
            howStep1Desc: 'Hesabınla giriş yap veya ücretsiz deneme sınavıyla hemen başla.',
            faqFreeQ: 'Ücretsiz Türkçe CBR deneme sınavı çözebilir miyim?'
        },
        ar: {
            back: 'رجوع →',
            exitExamConfirm: 'هل تريد الخروج من هذا الاختبار؟ لن يتم حفظ إجاباتك الحالية.',
            guestTitle: 'تسجيل الدخول مطلوب',
            guestDescTests: 'سجّل الدخول بحساب ExamTheorie الخاص بك للوصول إلى جميع اختبارات CBR الـ 50 ومزامنة تقدمك عبر الأجهزة، أو جرّب المحتوى المجاني أدناه.',
            guestDescTheory: 'سجّل الدخول بحساب ExamTheorie الخاص بك لفتح جميع فصول النظرية والمراجع، أو جرّب المحتوى المجاني أدناه.',
            signInBtn: 'تسجيل الدخول إلى حسابك',
            memberTitle: 'يلزم وجود عضوية نشطة',
            memberDescTests: 'تتطلب هذه الميزة عضوية ExamTheorie نشطة على حسابك. إذا تم تفعيل عضويتك مؤخراً، اضغط على تحديث حالة الحساب أدناه.',
            memberDescTheory: 'تتطلب فصول النظرية الكاملة عضوية ExamTheorie نشطة على حسابك. إذا تم تفعيل عضويتك مؤخراً، اضغط على تحديث حالة الحساب أدناه.',
            refreshBtn: '🔄 تحديث حالة الحساب',
            refreshingBtn: '⏳ جارٍ التحقق...',
            refreshUnlocked: '✅ تم العثور على عضوية نشطة! تم فتح المحتوى.',
            refreshNotFound: 'ℹ️ لم يتم العثور على عضوية نشطة في هذا الحساب بعد.',
            freeExamBtn: 'جرّب الاختبار التجريبي المجاني (50 سؤالاً)',
            freeChapterBtn: 'اقرأ الفصل الأول المجاني (قواعد المرور)',
            syncNote: 'تتم مزامنة تقدمك تلقائياً عبر جميع أجهزتك',
            howStep1Title: 'سجّل الدخول أو ابدأ مجاناً',
            howStep1Desc: 'سجّل الدخول بحسابك أو ابدأ فوراً بالاختبار التجريبي المجاني.',
            faqFreeQ: 'هل يمكنني تجربة اختبار CBR مجاني باللغة العربية؟'
        }
    };

    /* ─── GLOBAL LEXICAL ACCESSORS (index.html uses top-level const/let) ─── */
    function getSupabase() {
        if (window._supabase) return window._supabase;
        try {
            if (typeof _supabase !== 'undefined' && _supabase) {
                window._supabase = _supabase;
                return _supabase;
            }
        } catch (_) {}
        return null;
    }

    function getCurrentUser() {
        try {
            if (typeof currentUser !== 'undefined' && currentUser) return currentUser;
        } catch (_) {}
        return window.currentUser || null;
    }

    function getCurrentLang() {
        let lang = 'en';
        try {
            if (typeof currentLang !== 'undefined' && currentLang) lang = currentLang;
            else lang = localStorage.getItem('et_lang') || document.documentElement.getAttribute('data-page-lang') || (document.documentElement.lang || 'en').slice(0, 2);
        } catch (_) {}
        lang = String(lang || 'en').toLowerCase().slice(0, 2);
        return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
    }

    function t() {
        return BRIDGE_I18N[getCurrentLang()] || BRIDGE_I18N.en;
    }

    /* ─── STRICT READER-MODE CSS (Zero external pricing / checkout UI) ─── */
    function injectReaderStyles() {
        if (document.getElementById('et-native-bridge-styles')) return;
        const style = document.createElement('style');
        style.id = 'et-native-bridge-styles';
        style.textContent = `
            html.et-native-app #pricing,
            html.et-native-app #pricing-ol,
            html.et-native-app [data-i18n="nav_prices"],
            html.et-native-app [data-i18n="btn_prices"],
            html.et-native-app a[href*="#pricing"],
            html.et-native-app a[href*="open=pricing"],
            html.et-native-app .btn-buy,
            html.et-native-app #btnDailyBuy,
            html.et-native-app .daily-picker-wrap,
            html.et-native-app .pricing-grid {
                display: none !important;
            }
            html.et-native-app,
            html.et-native-app body {
                overflow-x: hidden;
            }
            html.et-native-app .hamburger {
                width: 38px;
                height: 38px;
                padding: 0;
                align-items: center;
                justify-content: center;
            }
            html.et-native-app .hamburger.open span:nth-child(1) {
                transform: translateY(7px) rotate(45deg) !important;
            }
            html.et-native-app .hamburger.open span:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg) !important;
            }
            @media (max-width: 480px) {
                html.et-native-app .mobile-menu {
                    top: 74px !important;
                    max-height: calc(100dvh - 86px) !important;
                }
            }
            html.et-native-app #userChip.visible {
                width: 34px !important;
                height: 34px !important;
                min-width: 34px !important;
                padding: 0 !important;
                border-radius: 50% !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.28), rgba(0, 102, 255, 0.38)) !important;
                border: 1px solid rgba(0, 212, 255, 0.45) !important;
                font-size: 0 !important;
                cursor: pointer !important;
                flex-shrink: 0 !important;
            }
            html.et-native-app #userChip.visible #userName {
                font-size: 12px !important;
                font-weight: 800 !important;
                letter-spacing: 0.4px !important;
                color: #ffffff !important;
                line-height: 1 !important;
            }
            #et-native-overlay {
                position: fixed;
                inset: 0;
                z-index: 2147483640;
                background: #04091a;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            #et-native-overlay iframe {
                width: 100%;
                height: 100%;
                flex: 1;
                border: 0;
                background: #04091a;
            }
            #et-overlay-loader {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #04091a;
                z-index: 2;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }
            #et-overlay-loader .et-spin {
                width: 38px;
                height: 38px;
                border: 3px solid rgba(0, 212, 255, 0.2);
                border-top-color: #00d4ff;
                border-radius: 50%;
                animation: etBridgeSpin 0.75s linear infinite;
            }
            @keyframes etBridgeSpin {
                to { transform: rotate(360deg); }
            }
            #et-overlay-back-btn {
                position: fixed;
                top: calc(env(safe-area-inset-top, 0px) + 10px);
                left: 12px;
                z-index: 2147483646;
                height: 34px;
                padding: 0 13px;
                border-radius: 999px;
                border: 1px solid rgba(0, 212, 255, 0.42);
                background: rgba(4, 9, 26, 0.84);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                color: #ffffff;
                font-family: 'Poppins', system-ui, -apple-system, sans-serif;
                font-size: 12.5px;
                font-weight: 600;
                line-height: 1;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                -webkit-tap-highlight-color: transparent;
            }
            #et-overlay-back-btn.is-rtl {
                left: auto;
                right: 12px;
                direction: rtl;
            }
            #et-overlay-back-btn:active {
                transform: scale(0.96);
            }
            .et-reader-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 100%;
            }
            .et-reader-btn-primary {
                width: 100%;
                padding: 14px 16px;
                font-size: 14.5px;
                font-weight: 700;
                font-family: inherit;
                border-radius: 14px;
                border: none;
                cursor: pointer;
                color: #fff;
                background: linear-gradient(135deg, #00d4ff, #0066ff);
                box-shadow: 0 8px 24px rgba(0, 102, 255, 0.35);
            }
            .et-reader-btn-secondary {
                width: 100%;
                padding: 12px 16px;
                font-size: 13.5px;
                font-weight: 600;
                font-family: inherit;
                border-radius: 13px;
                border: 1px solid rgba(0, 212, 255, 0.32);
                background: rgba(0, 212, 255, 0.1);
                color: #ccf4ff;
                cursor: pointer;
            }
            .et-reader-btn-ghost {
                width: 100%;
                padding: 11px 16px;
                font-size: 13px;
                font-weight: 500;
                font-family: inherit;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.16);
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.85);
                cursor: pointer;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    injectReaderStyles();

    /* ─── OVERLAY ENGINE (Preserves window.opener/e.source & session sync) ─── */
    let activeOverlay = null;
    let activeIframe = null;
    let activeOverlayUrl = '';
    let overlayHistoryPushed = false;
    let closingFromPopState = false;

    const origWindowOpen = window.open ? window.open.bind(window) : null;

    function isHomePath(pathname) {
        const p = (pathname || '/').replace(/\/+$/, '') || '/';
        return (
            p === '/' ||
            p === '/index.html' ||
            p === '/nl' ||
            p === '/nl/index.html' ||
            p === '/tr' ||
            p === '/tr/index.html' ||
            p === '/ar' ||
            p === '/ar/index.html'
        );
    }

    function isExamPath(urlStr) {
        return /\/(test-|deneme-)/i.test(urlStr || '');
    }

    function isInternalOverlayCandidate(urlObj) {
        if (!urlObj) return false;
        const host = (urlObj.hostname || '').toLowerCase();
        const isSameSite =
            urlObj.origin === window.location.origin ||
            host === 'examtheorie.nl' ||
            host === 'www.examtheorie.nl' ||
            host === 'azerpashazadeh.github.io';
        if (!isSameSite) return false;
        if (urlObj.searchParams.get('open') === 'pricing' || urlObj.hash === '#pricing') {
            return 'pricing';
        }
        if (host !== 'azerpashazadeh.github.io' && isHomePath(urlObj.pathname)) {
            return false;
        }
        return true;
    }

    function normalizeInternalUrl(urlObj) {
        const host = (urlObj.hostname || '').toLowerCase();
        if (
            (host === 'examtheorie.nl' || host === 'www.examtheorie.nl') &&
            window.location.protocol.startsWith('http') &&
            window.location.hostname !== host
        ) {
            return new URL(urlObj.pathname + urlObj.search + urlObj.hash, window.location.origin).href;
        }
        if (host === 'www.examtheorie.nl' && window.location.hostname === 'examtheorie.nl') {
            return new URL(urlObj.pathname + urlObj.search + urlObj.hash, window.location.origin).href;
        }
        return urlObj.href;
    }

    function isExamActivelyRunning() {
        if (!activeIframe || !isExamPath(activeOverlayUrl)) return false;
        try {
            const doc = activeIframe.contentDocument;
            if (!doc) return true;
            const quizBtn = doc.getElementById('quizButton1');
            // Still on welcome screen before starting
            if (quizBtn && quizBtn.style.display !== 'none' && !quizBtn.classList.contains('hidden')) {
                return false;
            }
            const scoreView = doc.getElementById('viewResultContainerId');
            const finalView = doc.getElementById('finalResultContainerId');
            const isVisible = (el) => el && !el.classList.contains('hidden') && el.style.display !== 'none';
            // Already submitted / viewing results
            if (isVisible(scoreView) || isVisible(finalView)) {
                return false;
            }
            return true;
        } catch (_) {
            // Cross-origin fallback (e.g. legacy quiz host): confirm to be safe
            return true;
        }
    }

    function closeOverlay(force) {
        if (!activeOverlay) return true;
        if (!force && isExamActivelyRunning()) {
            const ok = window.confirm(t().exitExamConfirm);
            if (!ok) return false;
        }

        const overlayToRemove = activeOverlay;
        activeOverlay = null;
        activeIframe = null;
        activeOverlayUrl = '';

        try {
            if (document.fullscreenElement) {
                document.exitFullscreen?.().catch?.(() => {});
            }
        } catch (_) {}

        overlayToRemove.remove();

        if (overlayHistoryPushed && !closingFromPopState) {
            overlayHistoryPushed = false;
            try {
                window.history.back();
            } catch (_) {}
        } else {
            overlayHistoryPushed = false;
        }

        // Refresh test buttons & account progress cleanly upon returning
        try {
            if (typeof buildTestButtons === 'function') void buildTestButtons(false);
            if (getCurrentUser() && typeof fetchProgressFromSupabase === 'function') {
                void fetchProgressFromSupabase().then(() => {
                    if (typeof buildTestButtons === 'function') void buildTestButtons(false);
                });
            }
        } catch (_) {}

        return true;
    }

    function decorateSameOriginIframe(iframe, backBtn) {
        try {
            const win = iframe.contentWindow;
            const doc = iframe.contentDocument;
            if (!win || !doc) return;

            const loc = win.location;
            if (loc && loc.origin === window.location.origin && isHomePath(loc.pathname)) {
                const params = new URLSearchParams(loc.search || '');
                const reason = params.get('reason');
                const openParam = params.get('open');
                closeOverlay(true);
                if (reason === 'login' && typeof openModal === 'function') {
                    openModal('si');
                } else if (reason === 'plan' && typeof showPaywall === 'function') {
                    showPaywall('tests');
                } else if (openParam === 'theory' && typeof openPassengerCar === 'function') {
                    openPassengerCar();
                }
                return;
            }

            // Hide any pricing links inside guide or theory pages for Google Play Reader compliance
            if (doc.head && !doc.getElementById('et-iframe-reader-style')) {
                const st = doc.createElement('style');
                st.id = 'et-iframe-reader-style';
                st.textContent = `
                    a[href*="open=pricing"],
                    a[href*="#pricing"] {
                        display: none !important;
                    }
                `;
                doc.head.appendChild(st);
            }

            // If exam page already rendered its own header exit button, hide duplicate floating pill
            const hasInPageExit = Boolean(doc.querySelector('.et-mobile-exit-btn'));
            if (backBtn) {
                backBtn.style.display = hasInPageExit ? 'none' : 'inline-flex';
            }
        } catch (_) {
            // Cross-origin iframe: keep parent floating back button visible
            if (backBtn) backBtn.style.display = 'inline-flex';
        }
    }

    function openInOverlay(targetHref) {
        if (activeOverlay) {
            closeOverlay(true);
        }

        const lang = getCurrentLang();
        const overlay = document.createElement('div');
        overlay.id = 'et-native-overlay';

        const loader = document.createElement('div');
        loader.id = 'et-overlay-loader';
        loader.innerHTML = '<div class="et-spin"></div>';

        const backBtn = document.createElement('button');
        backBtn.id = 'et-overlay-back-btn';
        backBtn.type = 'button';
        backBtn.textContent = t().back;
        if (lang === 'ar') backBtn.classList.add('is-rtl');
        backBtn.addEventListener('click', () => {
            closeOverlay(false);
        });

        const iframe = document.createElement('iframe');
        iframe.setAttribute('allow', 'fullscreen; autoplay');
        iframe.src = targetHref;

        iframe.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) loader.remove();
            }, 220);
            if (activeIframe === iframe) {
                try {
                    activeOverlayUrl = iframe.contentWindow?.location?.href || targetHref;
                } catch (_) {
                    activeOverlayUrl = targetHref;
                }
                decorateSameOriginIframe(iframe, backBtn);
            }
        });

        overlay.appendChild(loader);
        overlay.appendChild(backBtn);
        overlay.appendChild(iframe);
        document.body.appendChild(overlay);

        activeOverlay = overlay;
        activeIframe = iframe;
        activeOverlayUrl = targetHref;

        try {
            window.history.pushState({ etOverlay: true }, '');
            overlayHistoryPushed = true;
        } catch (_) {
            overlayHistoryPushed = false;
        }

        // Return iframe.contentWindow synchronously so dynamicQuizWindows.add(quizWindow) registers e.source
        return iframe.contentWindow;
    }

    function openExternalCleanly(href) {
        if (window.Capacitor?.Plugins?.Browser?.open) {
            window.Capacitor.Plugins.Browser.open({ url: href }).catch(() => {
                if (origWindowOpen) origWindowOpen(href, '_system');
            });
            return null;
        }
        return origWindowOpen ? origWindowOpen(href, '_blank', 'noopener') : null;
    }

    // Override window.open for openTest(), openTheoryLink(), and any internal popup calls
    window.open = function (url, target, features) {
        if (!url) return origWindowOpen ? origWindowOpen(url, target, features) : null;
        let parsed;
        try {
            parsed = new URL(url, window.location.href);
        } catch (_) {
            return origWindowOpen ? origWindowOpen(url, target, features) : null;
        }

        const candidate = isInternalOverlayCandidate(parsed);
        if (candidate === 'pricing') {
            if (typeof window.showPaywall === 'function') window.showPaywall('tests');
            return null;
        }
        if (candidate === true) {
            return openInOverlay(normalizeInternalUrl(parsed));
        }
        return openExternalCleanly(parsed.href);
    };

    // Intercept <a target="_blank"> and internal exam/theory/guide links
    document.addEventListener(
        'click',
        (e) => {
            const anchor = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (!anchor) return;
            const rawHref = anchor.getAttribute('href') || '';
            if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) return;

            let parsed;
            try {
                parsed = new URL(rawHref, window.location.href);
            } catch (_) {
                return;
            }

            if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') return;

            const candidate = isInternalOverlayCandidate(parsed);
            if (candidate === 'pricing') {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.showPaywall === 'function') window.showPaywall('tests');
                return;
            }

            const isBlank = (anchor.getAttribute('target') || '').toLowerCase() === '_blank';
            const isInternalContentPath = /^\/(deneme-|test-|theory\/|guides\/|privacy-policy|terms-conditions)/i.test(parsed.pathname);

            if (candidate === true && (isBlank || isInternalContentPath)) {
                // Skip if anchor already has an inline onclick handler that calls openTheoryLink/openDenemeTest
                const inlineOnclick = anchor.getAttribute('onclick') || '';
                if (/openTheoryLink|openDenemeTest/.test(inlineOnclick)) return;
                e.preventDefault();
                e.stopPropagation();
                openInOverlay(normalizeInternalUrl(parsed));
                return;
            }

            if (!candidate && isBlank) {
                e.preventDefault();
                e.stopPropagation();
                openExternalCleanly(parsed.href);
            }
        },
        true
    );

    // Listen for closeExamOverlay message from test-*.html / deneme-*.html
    window.addEventListener('message', (e) => {
        const d = e.data || {};
        if (d.action !== 'closeExamOverlay') return;
        const fromActiveIframe = activeIframe && e.source === activeIframe.contentWindow;
        const allowedOrigin =
            e.origin === window.location.origin ||
            /^https:\/\/(www\.)?examtheorie\.nl$/i.test(e.origin || '') ||
            e.origin === 'https://azerpashazadeh.github.io';
        if (!fromActiveIframe && !allowedOrigin) return;
        closeOverlay(Boolean(d.force));
    });

    // Browser history popstate (swipe-back / history.back)
    window.addEventListener('popstate', () => {
        if (!activeOverlay) return;
        closingFromPopState = true;
        const closed = closeOverlay(false);
        closingFromPopState = false;
        if (!closed) {
            try {
                window.history.pushState({ etOverlay: true }, '');
                overlayHistoryPushed = true;
            } catch (_) {}
        }
    });

    /* ─── HARDWARE BACK BUTTON (Capacitor App Plugin) ─── */
    function closeActiveModalOrDrawer() {
        if (activeOverlay) {
            try {
                const quizDialog = activeIframe?.contentDocument?.querySelector('dialog[open]');
                if (quizDialog && typeof quizDialog.close === 'function') {
                    quizDialog.close();
                    return true;
                }
            } catch (_) {}
            closeOverlay(false);
            return true;
        }

        const paywall = document.getElementById('paywall-modal');
        if (paywall?.classList.contains('active') && typeof closePaywall === 'function') {
            closePaywall();
            return true;
        }

        for (const id of ['si', 'su', 'fp', 'np']) {
            const modal = document.getElementById(id + '-modal');
            if (modal?.classList.contains('active') && typeof closeModal === 'function') {
                closeModal(id);
                return true;
            }
        }

        const resetBanner = document.getElementById('reset-banner');
        if (resetBanner?.classList.contains('active') && typeof closeResetBanner === 'function') {
            closeResetBanner();
            return true;
        }

        const pricingOl = document.getElementById('pricing-ol');
        if (pricingOl?.classList.contains('active') && typeof closePricing === 'function') {
            closePricing();
            return true;
        }

        const pcOl = document.getElementById('pc-ol');
        if (pcOl?.classList.contains('active') && typeof closePassengerCar === 'function') {
            closePassengerCar();
            return true;
        }

        const mobMenu = document.getElementById('mob-menu');
        if (mobMenu?.classList.contains('open') && typeof closeMob === 'function') {
            closeMob();
            return true;
        }

        return false;
    }

    /* ─── READER-MODE PAYWALL & PAGE ADAPTATION (EN / NL / TR / AR) ─── */
    let lastPaywallGroup = 'tests';

    function startFreeMockExamFromBridge() {
        const lang = getCurrentLang();
        if (typeof closePaywall === 'function') closePaywall();
        const url = new URL('/deneme-' + lang, window.location.origin).href;
        openInOverlay(url);
    }

    function startFreeChapterFromBridge() {
        const lang = getCurrentLang();
        if (typeof closePaywall === 'function') closePaywall();
        const url = new URL('/theory/' + lang + '/traffic-rules', window.location.origin).href;
        openInOverlay(url);
    }

    async function refreshMembershipStatus(btnEl) {
        const strings = t();
        if (btnEl) {
            btnEl.disabled = true;
            btnEl.textContent = strings.refreshingBtn;
        }
        try {
            const sb = getSupabase();
            if (sb?.auth?.refreshSession) {
                try {
                    await sb.auth.refreshSession();
                } catch (_) {}
            }
            if (typeof fetchUserAccess === 'function') await fetchUserAccess();
            if (typeof fetchProgressFromSupabase === 'function') await fetchProgressFromSupabase();
            if (typeof buildTestButtons === 'function') await buildTestButtons(false);
            if (typeof updateNavbarUser === 'function') updateNavbarUser();

            const unlocked =
                typeof canAccess === 'function' &&
                (canAccess(lastPaywallGroup) || canAccess('tests') || canAccess('theory'));
            if (unlocked) {
                if (typeof closePaywall === 'function') closePaywall();
                if (typeof showNotification === 'function') {
                    showNotification(strings.refreshUnlocked, 'success');
                }
                return;
            }
            if (typeof showNotification === 'function') {
                showNotification(strings.refreshNotFound, 'info');
            }
        } catch (err) {
            console.error('Membership status refresh failed:', err);
        } finally {
            if (btnEl) {
                btnEl.disabled = false;
                btnEl.textContent = strings.refreshBtn;
            }
        }
    }

    function renderReaderPaywall(groupId) {
        lastPaywallGroup = groupId || lastPaywallGroup || 'tests';
        const modal = document.getElementById('paywall-modal');
        if (!modal) return;
        const box = modal.querySelector('.auth-box');
        if (!box) return;

        const strings = t();
        const lang = getCurrentLang();
        const user = getCurrentUser();
        const isTests = lastPaywallGroup === 'tests';

        box.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
        box.innerHTML = '';

        const closeEl = document.createElement('div');
        closeEl.className = 'm-close';
        closeEl.textContent = '×';
        closeEl.onclick = () => {
            if (typeof closePaywall === 'function') closePaywall();
            else {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        const iconEl = document.createElement('div');
        iconEl.style.cssText = 'font-size:44px;margin-bottom:14px;';
        iconEl.textContent = user ? '👤' : '🔐';

        const titleEl = document.createElement('h2');
        titleEl.style.cssText = 'font-size:21px;font-weight:800;margin-bottom:10px;color:#fff;';
        titleEl.textContent = user ? strings.memberTitle : strings.guestTitle;

        const descEl = document.createElement('p');
        descEl.id = 'paywall-group-msg';
        descEl.style.cssText = 'color:rgba(255,255,255,0.74);font-size:13.8px;line-height:1.6;margin-bottom:24px;';
        descEl.textContent = user
            ? (isTests ? strings.memberDescTests : strings.memberDescTheory)
            : (isTests ? strings.guestDescTests : strings.guestDescTheory);

        const actionsWrap = document.createElement('div');
        actionsWrap.className = 'et-reader-actions';

        if (!user) {
            const signInBtn = document.createElement('button');
            signInBtn.type = 'button';
            signInBtn.className = 'et-reader-btn-primary';
            signInBtn.textContent = strings.signInBtn;
            signInBtn.onclick = () => {
                if (typeof closePaywall === 'function') closePaywall();
                if (typeof openModal === 'function') openModal('si');
            };
            actionsWrap.appendChild(signInBtn);
        } else {
            const refreshBtn = document.createElement('button');
            refreshBtn.type = 'button';
            refreshBtn.className = 'et-reader-btn-primary';
            refreshBtn.textContent = strings.refreshBtn;
            refreshBtn.onclick = () => refreshMembershipStatus(refreshBtn);
            actionsWrap.appendChild(refreshBtn);
        }

        const freeExamBtn = document.createElement('button');
        freeExamBtn.type = 'button';
        freeExamBtn.className = 'et-reader-btn-secondary';
        freeExamBtn.textContent = strings.freeExamBtn;
        freeExamBtn.onclick = startFreeMockExamFromBridge;
        actionsWrap.appendChild(freeExamBtn);

        const freeChapterBtn = document.createElement('button');
        freeChapterBtn.type = 'button';
        freeChapterBtn.className = 'et-reader-btn-ghost';
        freeChapterBtn.textContent = strings.freeChapterBtn;
        freeChapterBtn.onclick = startFreeChapterFromBridge;
        actionsWrap.appendChild(freeChapterBtn);

        const noteEl = document.createElement('p');
        noteEl.style.cssText = 'margin-top:16px;font-size:11.5px;color:rgba(255,255,255,0.42);';
        noteEl.textContent = strings.syncNote;

        box.appendChild(closeEl);
        box.appendChild(iconEl);
        box.appendChild(titleEl);
        box.appendChild(descEl);
        box.appendChild(actionsWrap);
        box.appendChild(noteEl);
    }

    function applyReaderDOMAdjustments() {
        const strings = t();

        // Update How-It-Works step 1 so it does not prompt choosing a paid package
        const h1t = document.querySelector('[data-i18n="h1t"]');
        const h1d = document.querySelector('[data-i18n="h1d"]');
        if (h1t) h1t.textContent = strings.howStep1Title;
        if (h1d) h1d.textContent = strings.howStep1Desc;

        // Remove payment-specific FAQ item (iDEAL / card / package pricing) & clean "before buying"
        const faq4Summary = document.querySelector('[data-seo-i18n="faq4_q"]');
        if (faq4Summary) {
            const details = faq4Summary.closest('details');
            if (details) details.style.display = 'none';
        }
        const faq5Summary = document.querySelector('[data-seo-i18n="faq5_q"]');
        if (faq5Summary) {
            const details = faq5Summary.closest('details');
            if (details) details.style.display = 'none';
        }
        const faq2Summary = document.querySelector('[data-seo-i18n="faq2_q"]');
        if (faq2Summary) {
            faq2Summary.textContent = strings.faqFreeQ;
        }

        // Ensure pricing overlay is closed if ever triggered via URL query
        const pricingOl = document.getElementById('pricing-ol');
        if (pricingOl?.classList.contains('active')) {
            pricingOl.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Keep active paywall modal synced with current language & login state
        const paywallModal = document.getElementById('paywall-modal');
        if (paywallModal?.classList.contains('active')) {
            renderReaderPaywall(lastPaywallGroup);
        }
    }

    /* ─── GOOGLE OAUTH VIA CHROME CUSTOM TABS + DEEP LINK SESSION EXCHANGE ─── */
    const handledAuthUrls = new Set();

    async function handleOAuthCallbackUrl(rawUrl) {
        if (!rawUrl || typeof rawUrl !== 'string') return;
        const isCustomCallback = rawUrl.startsWith(OAUTH_REDIRECT_URI);
        const isHttpsCallback =
            /^https?:\/\/(www\.)?examtheorie\.nl/i.test(rawUrl) &&
            /(access_token=|refresh_token=|code=|error_description=)/.test(rawUrl);

        if (!isCustomCallback && !isHttpsCallback) return;
        if (handledAuthUrls.has(rawUrl)) return;
        handledAuthUrls.add(rawUrl);

        try {
            await window.Capacitor?.Plugins?.Browser?.close?.();
        } catch (_) {}

        const sb = getSupabase();
        if (!sb?.auth) return;

        try {
            const hashIdx = rawUrl.indexOf('#');
            const queryIdx = rawUrl.indexOf('?');
            const hashStr = hashIdx !== -1 ? rawUrl.slice(hashIdx + 1) : '';
            const queryStr =
                queryIdx !== -1
                    ? rawUrl.slice(queryIdx + 1, hashIdx !== -1 && hashIdx > queryIdx ? hashIdx : undefined)
                    : '';

            const hashParams = new URLSearchParams(hashStr);
            const queryParams = new URLSearchParams(queryStr);

            const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
            const code = queryParams.get('code') || hashParams.get('code');

            if (accessToken && refreshToken) {
                const { error } = await sb.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
                if (error) throw error;
            } else if (code && typeof sb.auth.exchangeCodeForSession === 'function') {
                const { error } = await sb.auth.exchangeCodeForSession(code);
                if (error) throw error;
            } else {
                return;
            }

            if (typeof closeModal === 'function') {
                closeModal('si');
                closeModal('su');
            }
            if (typeof checkAuth === 'function') {
                await checkAuth();
            }
            const paywallModal = document.getElementById('paywall-modal');
            if (paywallModal?.classList.contains('active')) {
                if (typeof canAccess === 'function' && (canAccess(lastPaywallGroup) || canAccess('tests') || canAccess('theory'))) {
                    if (typeof closePaywall === 'function') closePaywall();
                } else {
                    renderReaderPaywall(lastPaywallGroup);
                }
            }
        } catch (err) {
            console.error('Native Google OAuth callback error:', err);
            if (typeof showNotification === 'function') {
                showNotification('Google sign-in could not be completed. Please try again.', 'error');
            }
        }
    }

    async function nativeSignInWithGoogle() {
        const sb = getSupabase();
        if (!sb?.auth) return;
        try {
            localStorage.setItem('et_lang', getCurrentLang());
        } catch (_) {}

        try {
            const { data, error } = await sb.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: OAUTH_REDIRECT_URI,
                    skipBrowserRedirect: true
                }
            });
            if (error) {
                alert('❌ Google sign-in error: ' + error.message);
                return;
            }
            if (data?.url) {
                if (window.Capacitor?.Plugins?.Browser?.open) {
                    await window.Capacitor.Plugins.Browser.open({ url: data.url });
                } else {
                    window.location.href = data.url;
                }
            }
        } catch (err) {
            console.error('Native signInWithGoogle failed:', err);
            alert('❌ Google sign-in error. Please try again.');
        }
    }

    /* ─── LIVE FOREGROUND SYNC (Web <-> App real-time progress parity) ─── */
    let lastResumeSyncAt = 0;
    async function syncAccountAndProgressOnResume() {
        const now = Date.now();
        if (now - lastResumeSyncAt < 1500) return;
        lastResumeSyncAt = now;

        const sb = getSupabase();
        if (!sb) return;

        try {
            if (!getCurrentUser() && typeof checkAuth === 'function') {
                await checkAuth();
                return;
            }
            if (getCurrentUser()) {
                await Promise.all([
                    typeof fetchProgressFromSupabase === 'function' ? fetchProgressFromSupabase() : Promise.resolve(),
                    typeof fetchUserAccess === 'function' ? fetchUserAccess() : Promise.resolve()
                ]);
                if (typeof buildTestButtons === 'function') await buildTestButtons(false);
                if (typeof updateNavbarUser === 'function') updateNavbarUser();
            }
        } catch (err) {
            console.error('Foreground sync error:', err);
        }
    }

    /* ─── INSTALL OVERRIDES & CAPACITOR LISTENERS ─── */
    function installHomepageHooks() {
        getSupabase();

        // Override Google OAuth to use Chrome Custom Tabs (avoids 403 disallowed_useragent)
        window.signInWithGoogle = nativeSignInWithGoogle;

        // Open Free Practice Exam in overlay so session/navigation stays seamless
        window.openDenemeTest = function () {
            const lang = getCurrentLang();
            openInOverlay(new URL('/deneme-' + lang, window.location.origin).href);
        };

        // Reader-only mode overrides: disable pricing/payment flows cleanly
        window.openPricing = function () {
            if (typeof window.showPaywall === 'function') window.showPaywall('tests');
        };
        window.startPayment = function () {
            if (typeof window.showPaywall === 'function') window.showPaywall('tests');
        };
        window.startDailyPayment = function () {
            if (typeof window.showPaywall === 'function') window.showPaywall('tests');
        };

        window.showPaywall = function (groupId) {
            lastPaywallGroup = groupId || 'tests';
            renderReaderPaywall(lastPaywallGroup);
            const modal = document.getElementById('paywall-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        if (typeof window.applyLang === 'function' && !window.applyLang.__etNativeWrapped) {
            const origApplyLang = window.applyLang;
            const wrappedApplyLang = function (lang) {
                const res = origApplyLang.apply(this, arguments);
                applyReaderDOMAdjustments();
                if (activeOverlay) {
                    const backBtn = document.getElementById('et-overlay-back-btn');
                    if (backBtn) {
                        backBtn.textContent = t().back;
                        backBtn.classList.toggle('is-rtl', getCurrentLang() === 'ar');
                    }
                }
                return res;
            };
            wrappedApplyLang.__etNativeWrapped = true;
            window.applyLang = wrappedApplyLang;
        }

        if (typeof window.updateNavbarUser === 'function' && !window.updateNavbarUser.__etNativeWrapped) {
            const origUpdateNav = window.updateNavbarUser;
            const computeInitials = function (u, fallbackText) {
                const raw = String(
                    u?.user_metadata?.full_name ||
                    u?.user_metadata?.name ||
                    (u?.email || '').split('@')[0] ||
                    fallbackText ||
                    ''
                ).replace(/…|\.\.\./g, '').trim();
                if (!raw) return 'U';
                const parts = raw.split(/[\s._-]+/).filter(Boolean);
                if (parts.length >= 2) {
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                }
                return parts[0].slice(0, 2).toUpperCase();
            };
            let isApplyingInitials = false;
            const applyInitialsChip = function () {
                if (isApplyingInitials) return;
                const chip = document.getElementById('userChip');
                const nameSpan = document.getElementById('userName');
                if (!chip || !nameSpan) return;

                if (!chip.__etTapBound) {
                    chip.__etTapBound = true;
                    chip.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        if (typeof window.toggleMenu === 'function') window.toggleMenu();
                    });
                }
                if (!chip.__etObserverBound && typeof MutationObserver !== 'undefined') {
                    chip.__etObserverBound = true;
                    const obs = new MutationObserver(() => applyInitialsChip());
                    obs.observe(chip, { attributes: true, childList: true, characterData: true, subtree: true });
                }

                const user = getCurrentUser();
                const isVisible = Boolean(user) || chip.classList.contains('visible');
                if (!isVisible) return;

                const currentText = (nameSpan.textContent || '').trim();
                const initials = computeInitials(user, currentText);
                if (currentText !== initials) {
                    isApplyingInitials = true;
                    nameSpan.textContent = initials;
                    isApplyingInitials = false;
                }
            };
            const wrappedUpdateNav = function () {
                const res = origUpdateNav.apply(this, arguments);
                applyInitialsChip();
                const paywallModal = document.getElementById('paywall-modal');
                if (paywallModal?.classList.contains('active')) {
                    renderReaderPaywall(lastPaywallGroup);
                }
                return res;
            };
            wrappedUpdateNav.__etNativeWrapped = true;
            window.updateNavbarUser = wrappedUpdateNav;
            applyInitialsChip();
        }

        applyReaderDOMAdjustments();
    }

    function registerNativeListeners() {
        const AppPlugin = window.Capacitor?.Plugins?.App;
        if (AppPlugin?.addListener) {
            AppPlugin.addListener('backButton', ({ canGoBack }) => {
                if (closeActiveModalOrDrawer()) return;
                if (canGoBack) {
                    window.history.back();
                } else {
                    AppPlugin.minimizeApp?.();
                }
            });

            AppPlugin.addListener('appUrlOpen', (event) => {
                if (event?.url) void handleOAuthCallbackUrl(event.url);
            });

            AppPlugin.addListener('appStateChange', ({ isActive }) => {
                if (isActive) void syncAccountAndProgressOnResume();
            });
        }

        if (AppPlugin?.getLaunchUrl) {
            AppPlugin.getLaunchUrl()
                .then((res) => {
                    if (res?.url) void handleOAuthCallbackUrl(res.url);
                })
                .catch(() => {});
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                void syncAccountAndProgressOnResume();
            }
        });
    }

    registerNativeListeners();

    if (typeof window.applyLang === 'function') {
        installHomepageHooks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            installHomepageHooks();
            setTimeout(applyReaderDOMAdjustments, 50);
        });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            installHomepageHooks();
            setTimeout(applyReaderDOMAdjustments, 50);
        });
        setTimeout(applyReaderDOMAdjustments, 50);
    }
})();
