/**
 * auth-guard.js — ExamTheorie Sayfa Koruma Sistemi
 */

(function() {
    'use strict';

    // 🟢 NETLIFY KONTROLÜ: Netlify üzerinden çalışıyorsa hiçbir kontrol yapma ve çık
    if (window.location.hostname.includes('netlify')) {
        return;
    }

    const SUPABASE_URL = 'https://rvbcsakzfadhtlfeigus.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YmNzYWt6ZmFkaHRsZmVpZ3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjE0NTAsImV4cCI6MjA4NjkzNzQ1MH0.jU0Yt5pMurD9vhZeDTQCasQLkz-saZlhWekXDgUegRs';
    const HOME_URL     = 'https://examtheorie.nl';

    // Sayfa bilgilerini URL'den ayrıştır
    const path      = window.location.pathname;
    const testMatch = path.match(/\/test-(\d+)-(en|tr|nl|ar)\.html/);
    
    const isTest    = !!testMatch;
    const testNum   = isTest ? parseInt(testMatch[1]) : null;
    const lang      = isTest ? testMatch[2] : null;
    const GROUP     = isTest ? 'tests' : 'theory';

    // Sayfayı kontrol bitene kadar gizle
    document.documentElement.style.visibility = 'hidden';

    // Yükleme ekranını oluştur
    const loader = document.createElement('div');
    loader.id = 'et-guard-loader';
    loader.innerHTML = `
        <div style="position:fixed; inset:0; z-index:99999; background:rgba(0,8,25,0.97); display:flex; align-items:center; justify-content:center; font-family:sans-serif;">
            <div style="text-align:center;">
                <div style="width:40px; height:40px; border:3px solid rgba(0,212,255,0.2); border-top-color:#00d4ff; border-radius:50%; animation:spin .8s linear infinite; margin:0 auto 15px;"></div>
                <p style="color:#fff; opacity:0.7; font-size:14px;">Kontrol ediliyor...</p>
            </div>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        </div>
    `;
    
    if (document.body) {
        document.body.appendChild(loader);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(loader));
    }

    function redirectHome(reason) {
        const params = new URLSearchParams({
            redirect: window.location.href,
            reason: reason // 'login' | 'plan' | 'completed'
        });
        window.location.replace(`${HOME_URL}?${params.toString()}`);
    }

    async function checkAccess() {
        try {
            // 1. Supabase SDK Yükle
            if (typeof supabase === 'undefined') {
                await new Promise(resolve => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }

            const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

            // 2. Oturum Kontrolü
            const { data: { session } } = await client.auth.getSession();
            if (!session?.user) {
                redirectHome('login');
                return;
            }

            // 3. Genel Erişim/Plan Kontrolü
            const { data: accessData, error: accessError } = await client
                .from('user_access')
                .select('group_id')
                .eq('user_id', session.user.id);

            if (accessError || !accessData || accessData.length === 0) {
                redirectHome('plan');
                return;
            }

            const groups = accessData.map(r => r.group_id);
            const hasGroupAccess = groups.includes(GROUP) || groups.includes('all');

            if (!hasGroupAccess) {
                redirectHome('plan');
                return;
            }

            // 4. Test Tamamlanma Kontrolü (B-kodu Entegrasyonu)
            if (isTest && testNum) {
                const { data: testData, error: testError } = await client
                    .from('user_progress')
                    .select('test_number')
                    .eq('user_id', session.user.id)
                    .eq('language', lang)
                    .eq('test_number', testNum)
                    .maybeSingle();

                if (!testError && testData) {
                    redirectHome('completed');
                    return;
                }
            }

            // ✅ HER ŞEY YOLUNDA — Sayfayı göster
            document.documentElement.style.visibility = 'visible';
            const loaderEl = document.getElementById('et-guard-loader');
            if (loaderEl) loaderEl.remove();

        } catch (err) {
            console.error('Auth guard error:', err);
            redirectHome('login');
        }
    }

    checkAccess();
})();
