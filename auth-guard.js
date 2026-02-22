/**
 * auth-guard.js — ExamTheorie Sayfa Koruma Sistemi
 * 
 * Bu dosyayı tüm teori ve test sayfalarına ekle:
 * <script src="https://oefenen.examtheorie.nl/auth-guard.js"></script>
 * 
 * Çalışma mantığı:
 * 1. Kullanıcı oturum açmış mı? → Hayır → Ana siteye yönlendir
 * 2. Aktif planı var mı?         → Hayır → Ana siteye yönlendir (paywall açılır)
 * 3. Planı bu sayfaya erişebilir mi? → Hayır → Ana siteye yönlendir
 * 4. Her şey OK → Sayfa gösterilir
 */

(function() {
    'use strict';

    const SUPABASE_URL = 'https://rvbcsakzfadhtlfeigus.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YmNzYWt6ZmFkaHRsZmVpZ3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjE0NTAsImV4cCI6MjA4NjkzNzQ1MH0.jU0Yt5pMurD9vhZeDTQCasQLkz-saZlhWekXDgUegRs';
    const HOME_URL     = 'https://oefenen.examtheorie.nl';

    // Sayfa tipini URL'den belirle
    const path     = window.location.pathname;
    const isTest   = /\/test-\d+-(en|tr|nl|ar)\.html/.test(path);
    const isTheory = !isTest && path.endsWith('.html');
    const GROUP    = isTest ? 'tests' : 'theory';

    // Sayfayı hemen gizle — kontrol bitene kadar
    document.documentElement.style.visibility = 'hidden';

    // Yükleme göstergesi
    const loader = document.createElement('div');
    loader.id = 'et-guard-loader';
    loader.innerHTML = `
        <div style="
            position:fixed; inset:0; z-index:99999;
            background:rgba(0,8,25,0.97);
            display:flex; align-items:center; justify-content:center;
            font-family:'Poppins',sans-serif;
        ">
            <div style="text-align:center;">
                <div style="
                    width:48px; height:48px; border-radius:50%;
                    border:3px solid rgba(0,212,255,0.2);
                    border-top-color:#00d4ff;
                    animation:spin .8s linear infinite;
                    margin:0 auto 16px;
                "></div>
                <p style="color:rgba(255,255,255,0.6); font-size:14px;">Verifying access...</p>
            </div>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        </div>
    `;
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(loader);
    });

    // Ana siteye yönlendir
    function redirectHome(reason) {
        const params = new URLSearchParams({
            redirect: window.location.href,
            reason: reason  // 'login' | 'plan' | 'access'
        });
        window.location.replace(`${HOME_URL}?${params.toString()}`);
    }

    // Erişim kontrolü
    async function checkAccess() {
        try {
            // Supabase SDK'yı bekle (CDN'den yükleniyorsa)
            if (typeof supabase === 'undefined') {
                await new Promise(resolve => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }

            const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

            // 1. Oturum kontrolü
            const { data: { session } } = await client.auth.getSession();
            if (!session?.user) {
                redirectHome('login');
                return;
            }

            // 2. Plan + erişim kontrolü
            const { data, error } = await client
                .from('user_access')
                .select('group_id')
                .eq('user_id', session.user.id);

            if (error || !data || data.length === 0) {
                redirectHome('plan');
                return;
            }

            // 3. Bu gruba erişim var mı?
            const groups = data.map(r => r.group_id);
            const hasAccess = groups.includes(GROUP) || groups.includes('all');

            if (!hasAccess) {
                redirectHome('plan');
                return;
            }

            // ✅ Erişim tamam — sayfayı göster
            document.documentElement.style.visibility = 'visible';
            const loaderEl = document.getElementById('et-guard-loader');
            if (loaderEl) loaderEl.remove();

        } catch (err) {
            console.error('Auth guard error:', err);
            // Hata durumunda ana siteye yönlendir
            redirectHome('login');
        }
    }

    checkAccess();

})();
