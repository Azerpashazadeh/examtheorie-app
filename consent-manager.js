(function () {
'use strict';
const PIXEL_ID='1428784185551460', CLARITY_ID='vz9ccypxk4', KEY='et_consent_v1';
const T={
en:{title:'Your privacy matters',body:'Optional analytics and advertising cookies help us improve the site and measure our ads. Choose which categories to allow.',a:'Analytics (Microsoft Clarity)',m:'Advertising (Meta Pixel)',r:'Reject optional',s:'Settings',y:'Accept all',save:'Save choices',prefs:'Optional cookies',settings:'Cookie settings'},
tr:{title:'Gizliliğiniz önemli',body:'İsteğe bağlı analiz ve reklam çerezleri sitemizi geliştirmemize ve reklamlarımızı ölçmemize yardımcı olur. İzin vereceğiniz kategorileri seçin.',a:'Analiz (Microsoft Clarity)',m:'Reklam (Meta Pixel)',r:'İsteğe bağlıları reddet',s:'Ayarlar',y:'Tümünü kabul et',save:'Tercihleri kaydet',prefs:'İsteğe bağlı çerezler',settings:'Çerez ayarları'},
nl:{title:'Uw privacy is belangrijk',body:'Optionele analytische en advertentiecookies helpen ons de site te verbeteren en advertenties te meten. Kies welke categorieën u toestaat.',a:'Analytics (Microsoft Clarity)',m:'Advertenties (Meta Pixel)',r:'Optioneel weigeren',s:'Instellingen',y:'Alles accepteren',save:'Keuzes opslaan',prefs:'Optionele cookies',settings:'Cookie-instellingen'},
ar:{title:'خصوصيتك مهمة',body:'تساعدنا ملفات تعريف الارتباط الاختيارية للتحليلات والإعلانات على تحسين الموقع وقياس الإعلانات. اختر الفئات التي تسمح بها.',a:'التحليلات (Microsoft Clarity)',m:'الإعلانات (Meta Pixel)',r:'رفض الاختيارية',s:'الإعدادات',y:'قبول الكل',save:'حفظ الاختيارات',prefs:'ملفات تعريف الارتباط الاختيارية',settings:'إعدادات ملفات تعريف الارتباط'}
};
function lang(){let x=localStorage.getItem('et_lang')||(document.documentElement.lang||'en').slice(0,2).toLowerCase();return T[x]?x:'en'}
function read(){try{let x=JSON.parse(localStorage.getItem(KEY)||'null');return x?{analytics:x.analytics===true,marketing:x.marketing===true}:null}catch(_){return null}}
function clarity(ok){
 if(!window.clarity)window.clarity=function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};
 window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:ok?'granted':'denied'});
 if(!ok||document.querySelector('script[data-et-clarity]'))return;
 const s=document.createElement('script');s.async=true;s.src='https://www.clarity.ms/tag/'+CLARITY_ID;s.dataset.etClarity='1';document.head.appendChild(s);
}
function initPixel(){
 if(!window.fbq){(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');window.fbq('consent','revoke');window.fbq('set','autoConfig',false,PIXEL_ID);window.fbq('init',PIXEL_ID)}
}
function pixel(ok){if(!ok){if(window.fbq)window.fbq('consent','revoke');return}initPixel();window.fbq('consent','grant');window.fbq('track','PageView')}
function apply(c){clarity(c.analytics);pixel(c.marketing)}
function save(c){const v={analytics:!!c.analytics,marketing:!!c.marketing,savedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(v));apply(v)}
function mount(){
 const t=T[lang()],rtl=lang()==='ar',style=document.createElement('style');
 style.textContent=`#et-cookie{position:fixed;z-index:2147483000;inset:auto 16px 16px;max-width:760px;margin:auto;padding:20px;color:#f7f9ff;background:rgba(16,39,75,.76);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid #ffffff38;border-radius:18px;box-shadow:0 12px 48px #0006;font:14px/1.55 system-ui,sans-serif;direction:${rtl?'rtl':'ltr'}}#et-cookie h2{margin:0 0 6px;font-size:20px}#et-cookie p{margin:0 0 14px;color:#d8e3f5}#et-cookie .actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}#et-cookie button,#et-cookie-settings{border:0;border-radius:10px;padding:10px 14px;cursor:pointer;font:600 14px system-ui,sans-serif}#et-cookie .secondary{background:#fff;color:#14294c}#et-cookie .primary{background:#ff9417;color:#fff}#et-cookie fieldset{border:1px solid #ffffff38;border-radius:12px;margin:10px 0 14px;padding:10px 14px}#et-cookie label{display:flex;align-items:center;gap:8px;padding:5px 0}#et-cookie input{width:18px;height:18px;accent-color:#ff9417}#et-cookie-settings{display:inline-flex;align-items:center;margin:0 12px;padding:0;background:transparent;color:rgba(255,255,255,.75);box-shadow:none;text-decoration:underline;text-underline-offset:3px;font:500 12px system-ui,sans-serif}#et-cookie-settings:hover{color:rgba(255,255,255,.95)}#et-cookie-settings:focus-visible{outline:2px solid #fff;outline-offset:3px;border-radius:2px}body.ar .footer #et-cookie-settings{margin-right:12px;margin-left:0}@media(max-width:600px){#et-cookie{inset:auto 8px 8px;padding:16px}#et-cookie .actions{justify-content:stretch}#et-cookie button{flex:1 1 auto}}`;
 document.head.appendChild(style);
 const box=document.createElement('section');box.id='et-cookie';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.innerHTML='<h2></h2><p></p><fieldset hidden><legend></legend><label><input type="checkbox" name="a"><span></span></label><label><input type="checkbox" name="m"><span></span></label></fieldset><div class="actions"><button class="secondary reject"></button><button class="secondary manage"></button><button class="primary accept"></button><button class="primary save" hidden></button></div>';document.body.appendChild(box);
 const st=document.createElement('button');st.id='et-cookie-settings';st.type='button';st.textContent=t.settings;const settingsHost=document.querySelector('.footer p:last-child');if(settingsHost)settingsHost.appendChild(st);else document.body.appendChild(st);
 box.querySelector('h2').textContent=t.title;box.querySelector('p').textContent=t.body;box.querySelector('legend').textContent=t.prefs;
 box.querySelector('label:nth-of-type(1) span').textContent=t.a;box.querySelector('label:nth-of-type(2) span').textContent=t.m;
 const r=box.querySelector('.reject'),mg=box.querySelector('.manage'),ac=box.querySelector('.accept'),sv=box.querySelector('.save'),fs=box.querySelector('fieldset'),a=box.querySelector('[name=a]'),m=box.querySelector('[name=m]');
 r.textContent=t.r;mg.textContent=t.s;ac.textContent=t.y;sv.textContent=t.save;
 function open(manage){let c=read()||{analytics:false,marketing:false};a.checked=c.analytics;m.checked=c.marketing;fs.hidden=!manage;mg.hidden=manage;ac.hidden=manage;sv.hidden=!manage;box.hidden=false;st.style.display='none'}
 function close(){box.hidden=true;st.style.display='block'}
 r.onclick=()=>{save({analytics:false,marketing:false});close()};
 ac.onclick=()=>{save({analytics:true,marketing:true});close()};
 mg.onclick=()=>open(true);st.onclick=()=>open(true);
 sv.onclick=()=>{save({analytics:a.checked,marketing:m.checked});close()};
 const c=read();if(c){apply(c);close()}else open(false);
}
window.examTheorieConsent={trackPurchase:function(value,currency){const c=read(),n=Number(value);if(!c||!c.marketing||!window.fbq||!Number.isFinite(n)||n<=0)return false;window.fbq('track','Purchase',{value:n,currency:currency||'EUR'});return true}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
