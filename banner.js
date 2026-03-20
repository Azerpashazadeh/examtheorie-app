(function () {
    // ── Kapatıldıysa bir daha gösterme ──
    if (sessionStorage.getItem('et_banner_closed')) return;

    const messages = {
        en: "🔧 <strong>Site update in progress.</strong> You may experience login issues until 21 Mar 2026, 09:00. If Google Sign-In fails, use <em>Forgot Password</em> to set a password and continue.",
        tr: "🔧 <strong>Site güncelleniyor.</strong> 21 Mart 2026 saat 09:00'a kadar girişlerde sorun yaşanabilir. Google ile giriş sorunu yaşarsanız <em>Şifremi Unuttum</em> seçeneğiyle şifre belirleyip devam edebilirsiniz.",
        nl: "🔧 <strong>Site-update bezig.</strong> Tot 21 mrt 2026 om 09:00 kunt u inlogproblemen ondervinden. Als inloggen via Google mislukt, gebruik dan <em>Wachtwoord vergeten</em> om een wachtwoord in te stellen.",
        ar: "🔧 <strong>تحديث الموقع جارٍ.</strong> قد تواجه مشكلات في تسجيل الدخول حتى 21 مارس 2026 الساعة 09:00. إذا فشل تسجيل الدخول عبر Google، استخدم <em>نسيت كلمة المرور</em> لتعيين كلمة مرور والمتابعة."
    };

    // Mevcut dili al (ExamTheorie localStorage key'i)
    const lang = localStorage.getItem('et_lang') || 'en';
    const isRtl = lang === 'ar';
    const msg = messages[lang] || messages['en'];

    const style = document.createElement('style');
    style.textContent = `
        #et-banner {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 99999;
            background: rgba(180, 70, 0, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 160, 50, 0.45);
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
            padding: 13px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            animation: etBannerIn .4s ease both;
            direction: ${isRtl ? 'rtl' : 'ltr'};
        }
        @keyframes etBannerIn {
            from { opacity: 0; transform: translateY(-100%); }
            to   { opacity: 1; transform: translateY(0); }
        }
        #et-banner-text {
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.82);
            line-height: 1.55;
            text-align: center;
            flex: 1;
            max-width: 780px;
        }
        #et-banner-text strong {
            color: #ffe0b0;
            font-weight: 600;
        }
        #et-banner-text em {
            font-style: normal;
            color: rgba(255,255,255,0.95);
            font-weight: 500;
            text-decoration: underline;
            text-underline-offset: 2px;
        }
        #et-banner-close {
            flex-shrink: 0;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.55);
            font-size: 16px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all .2s;
            font-family: sans-serif;
        }
        #et-banner-close:hover {
            background: rgba(255,255,255,0.16);
            color: #fff;
        }
        @media (max-width: 600px) {
            #et-banner { padding: 12px 14px; gap: 10px; }
            #et-banner-text { font-size: 12px; text-align: ${isRtl ? 'right' : 'left'}; }
        }
    `;
    document.head.appendChild(style);

    const banner = document.createElement('div');
    banner.id = 'et-banner';
    banner.innerHTML = `
        <div id="et-banner-text">${msg}</div>
        <button id="et-banner-close" aria-label="Close">✕</button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);

    // Navbar'ı aşağı it (sabit navbar ile çakışmasın)
    function adjustNavbar() {
        const h = banner.offsetHeight;
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.transition = 'top .3s ease';
            navbar.style.top = (14 + h) + 'px';
        }
    }
    adjustNavbar();
    window.addEventListener('resize', adjustNavbar);

    // Kapat
    document.getElementById('et-banner-close').addEventListener('click', function () {
        banner.style.transition = 'opacity .3s, transform .3s';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(function () {
            banner.remove();
            style.remove();
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.style.top = '14px';
            window.removeEventListener('resize', adjustNavbar);
        }, 300);
        sessionStorage.setItem('et_banner_closed', '1');
    });
})();
