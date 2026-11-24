#!/usr/bin/env node
/**
 * build-guides.js — Generates 20 High-Intent Multilingual SEO Guide Pages
 * (4 Guide Hubs + 16 Pillar CBR/RVV/RDW Guides across EN, NL, TR, AR)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://examtheorie.nl';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const TODAY = '2026-11-18';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 12 Official Dutch RVV 1990 Vector Road Signs (Zero External HTTP Requests!)
const RVV_SIGNS_SVG = {
  A1_50: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="36" fill="#fff" stroke="#dc2626" stroke-width="8"/><text x="40" y="50" text-anchor="middle" fill="#0f172a" font-size="28" font-weight="800" font-family="sans-serif">50</text></svg>`,
  B1: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><polygon points="40,4 76,40 40,76 4,40" fill="#fff" stroke="#0f172a" stroke-width="2"/><polygon points="40,15 65,40 40,65 15,40" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/></svg>`,
  B6: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><polygon points="8,12 72,12 40,70" fill="#fff" stroke="#dc2626" stroke-width="8" stroke-linejoin="round"/></svg>`,
  B7: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><polygon points="26,6 54,6 74,26 74,54 54,74 26,74 6,54 6,26" fill="#dc2626" stroke="#fff" stroke-width="3"/><text x="40" y="47" text-anchor="middle" fill="#fff" font-size="19" font-weight="900" font-family="sans-serif">STOP</text></svg>`,
  C1: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="35" fill="#fff" stroke="#dc2626" stroke-width="9"/></svg>`,
  C2: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="36" fill="#dc2626" stroke="#fff" stroke-width="3"/><rect x="15" y="33" width="50" height="14" rx="2" fill="#fff"/></svg>`,
  D2: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="36" fill="#1d4ed8" stroke="#fff" stroke-width="3"/><line x1="25" y1="25" x2="52" y2="52" stroke="#fff" stroke-width="6" stroke-linecap="round"/><polyline points="36,54 54,54 54,36" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  E1: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="35" fill="#1d4ed8" stroke="#dc2626" stroke-width="8"/><line x1="16" y1="16" x2="64" y2="64" stroke="#dc2626" stroke-width="8"/></svg>`,
  E2: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="35" fill="#1d4ed8" stroke="#dc2626" stroke-width="8"/><line x1="16" y1="16" x2="64" y2="64" stroke="#dc2626" stroke-width="8"/><line x1="64" y1="16" x2="16" y2="64" stroke="#dc2626" stroke-width="8"/></svg>`,
  G3: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><rect x="10" y="6" width="60" height="68" rx="6" fill="#1d4ed8" stroke="#fff" stroke-width="3"/><path d="M24,38 L30,22 L50,22 L56,38 Z" fill="#fff"/><rect x="20" y="36" width="40" height="16" rx="3" fill="#fff"/><rect x="29" y="25" width="22" height="10" rx="1.5" fill="#1d4ed8"/><circle cx="26" cy="44" r="3.2" fill="#1d4ed8"/><circle cx="54" cy="44" r="3.2" fill="#1d4ed8"/></svg>`,
  G5: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><rect x="8" y="8" width="64" height="64" rx="6" fill="#1d4ed8" stroke="#fff" stroke-width="3"/><polygon points="16,38 16,25 27,16 38,25 38,38" fill="#fff"/><circle cx="54" cy="24" r="4" fill="#fff"/><line x1="54" y1="29" x2="54" y2="45" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="43" cy="44" r="3" fill="#fff"/><rect x="18" y="52" width="32" height="10" rx="2" fill="#fff"/></svg>`,
  G11: `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true"><circle cx="40" cy="40" r="36" fill="#1d4ed8" stroke="#fff" stroke-width="3"/><circle cx="26" cy="48" r="9" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="54" cy="48" r="9" fill="none" stroke="#fff" stroke-width="3.2"/><polyline points="26,48 36,33 50,33 54,48 38,48 26,48" fill="none" stroke="#fff" stroke-width="3"/></svg>`,
};

function renderSignsShowcase(labels) {
  const items = [
    ['A1', RVV_SIGNS_SVG.A1_50, labels.a1],
    ['B1', RVV_SIGNS_SVG.B1, labels.b1],
    ['B6', RVV_SIGNS_SVG.B6, labels.b6],
    ['B7', RVV_SIGNS_SVG.B7, labels.b7],
    ['C1', RVV_SIGNS_SVG.C1, labels.c1],
    ['C2', RVV_SIGNS_SVG.C2, labels.c2],
    ['D2', RVV_SIGNS_SVG.D2, labels.d2],
    ['E1', RVV_SIGNS_SVG.E1, labels.e1],
    ['E2', RVV_SIGNS_SVG.E2, labels.e2],
    ['G3', RVV_SIGNS_SVG.G3, labels.g3],
    ['G5', RVV_SIGNS_SVG.G5, labels.g5],
    ['G11', RVV_SIGNS_SVG.G11, labels.g11],
  ];
  return `<div class="sign-grid">${items
    .map(
      ([code, svg, desc]) =>
        `<div class="sign-card"><div class="sign-icon">${svg}</div><div><span class="sign-code">${code}</span><p>${desc}</p></div></div>`
    )
    .join('')}</div>`;
}

const UI_CHROME = {
  en: {
    dir: 'ltr',
    ogLocale: 'en_US',
    homeUrl: '/',
    homeLabel: 'Home',
    hubTitle: '2026 Netherlands CBR Driving Theory Guides',
    hubMetaTitle: 'Netherlands CBR Driving Theory Guides 2026 — Exam Rules, Signs & RDW | ExamTheorie',
    hubDesc: 'Free, up-to-date 2026 guides for passing the Dutch CBR car theory exam (Rijbewijs B): exam format & fees, RVV traffic signs, priority rules, hazard perception, and RDW foreign licence exchange.',
    hubLabel: 'CBR Guides',
    freeBtn: 'Free 50-Question Test',
    pkgBtn: 'View Packages',
    ctaHead: 'Ready to Test Your CBR Knowledge?',
    ctaBody: 'Start with our full 50-question, 30-minute Dutch CBR practice exam or study Chapter 1 (Traffic Rules) completely free — available in English, Dutch, Turkish, and Arabic.',
    ctaPrimary: 'Start Free 50-Question Mock Exam →',
    ctaSecondary: 'Read Free Chapter 1 (RVV Rules) →',
    ctaPackages: 'See All 50 Exam Packages (from €3) →',
    relatedHead: 'More CBR Preparation Guides',
    faqHead: 'Frequently Asked Questions',
    readMore: 'Read Full Guide →',
    updated: 'Updated for 2026 CBR & RVV Rules',
  },
  nl: {
    dir: 'ltr',
    ogLocale: 'nl_NL',
    homeUrl: '/nl/',
    homeLabel: 'Home',
    hubTitle: 'CBR Auto Theorie Gidsen & Uitleg (2026)',
    hubMetaTitle: 'CBR Auto Theorie Gidsen 2026 — Verkeersborden, Voorrang, Kosten & RDW | ExamTheorie',
    hubDesc: 'Gratis uitgebreide 2026 CBR theorie-gidsen voor Rijbewijs B: de nieuwe 50-vragen opzet, CBR kosten, RVV verkeersborden, voorrangsregels, gevaarherkenning en rijbewijs omwisselen.',
    hubLabel: 'CBR Gidsen',
    freeBtn: 'Gratis Proefexamen (50 Vragen)',
    pkgBtn: 'Pakketprijzen',
    ctaHead: 'Direct Gratis Oefenen voor je CBR Theorie-examen?',
    ctaBody: 'Maak nu gratis een volledig CBR oefenexamen van 50 vragen (30 minuten) of bestudeer gratis Hoofdstuk 1 (Verkeersregels) — beschikbaar in het Nederlands, Engels, Turks en Arabisch.',
    ctaPrimary: 'Start Gratis CBR Proefexamen →',
    ctaSecondary: 'Lees Gratis Hoofdstuk 1 →',
    ctaPackages: 'Bekijk Alle 50 Oefenexamens (vanaf €3) →',
    relatedHead: 'Meer CBR Theorie Gidsen',
    faqHead: 'Veelgestelde Vragen',
    readMore: 'Lees Volledige Gids →',
    updated: 'Bijgewerkt volgens 2026 CBR & RVV richtlijnen',
  },
  tr: {
    dir: 'ltr',
    ogLocale: 'tr_TR',
    homeUrl: '/tr/',
    homeLabel: 'Ana Sayfa',
    hubTitle: '2026 Hollanda CBR Ehliyet Teori Rehberleri',
    hubMetaTitle: 'Hollanda CBR Ehliyet Rehberleri 2026 — Sınav Kuralları, Levhalar ve RDW | ExamTheorie',
    hubDesc: '2026 güncel Hollanda B sınıfı ehliyet (CBR teori sınavı) Türkçe rehberleri: 50 soruluk yeni sınav sistemi, CBR ücretleri, Hollanda trafik levhaları, kavşak öncelikleri ve RDW ehliyet değişimi.',
    hubLabel: 'CBR Rehberleri',
    freeBtn: 'Ücretsiz 50 Soruluk Deneme',
    pkgBtn: 'Paket Fiyatları',
    ctaHead: 'Kendinizi Gerçek CBR Sınavında Test Etmeye Hazır mısınız?',
    ctaBody: '50 soruluk, 30 dakikalık ücretsiz Türkçe CBR deneme sınavını hemen çözün veya 1. Bölümü (Hollanda Trafik Kuralları) ücretsiz çalışın.',
    ctaPrimary: 'Ücretsiz 50 Soruluk Denemeye Başla →',
    ctaSecondary: 'Ücretsiz 1. Bölümü Oku →',
    ctaPackages: '50 Sınavlık Paketleri Gör (€3’dan başlayan) →',
    relatedHead: 'Diğer Hollanda Ehliyet Rehberleri',
    faqHead: 'Sıkça Sorulan Sorular',
    readMore: 'Rehberin Tamamını Oku →',
    updated: '2026 Güncel CBR ve RVV Mevzuatına Uygun',
  },
  ar: {
    dir: 'rtl',
    ogLocale: 'ar_AR',
    homeUrl: '/ar/',
    homeLabel: 'الرئيسية',
    hubTitle: 'أدلة امتحان التيوري الهولندي CBR الشاملة (2026)',
    hubMetaTitle: 'أدلة امتحان التيوري في هولندا CBR 2026 — القواعد، الإشارات واستبدال الرخصة | ExamTheorie',
    hubDesc: 'أدلة مجانية محدّثة لعام 2026 باللغة العربية لاجتياز امتحان نظرية القيادة الهولندي CBR: نظام الـ 50 سؤالاً، الرسوم الرسمية، إشارات المرور، قواعد الأولوية واستبدال الرخصة الأجنبية عبر RDW.',
    hubLabel: 'أدلة CBR',
    freeBtn: 'اختبار مجاني (50 سؤالاً)',
    pkgBtn: 'أسعار الباقات',
    ctaHead: 'هل أنت مستعد لاختبار معلوماتك في امتحان CBR؟',
    ctaBody: 'ابدأ الآن بحل اختبار CBR التجريبي المجاني المكون من 50 سؤالاً خلال 30 دقيقة باللغة العربية أو ادرس الفصل الأول مجاناً.',
    ctaPrimary: 'ابدأ الاختبار التجريبي المجاني ←',
    ctaSecondary: 'اقرأ الفصل الأول مجاناً ←',
    ctaPackages: 'عرض باقات الـ 50 اختباراً (ابتداءً من 3€) ←',
    relatedHead: 'مزيد من أدلة امتحان CBR',
    faqHead: 'الأسئلة الشائعة',
    readMore: 'اقرأ الدليل الكامل ←',
    updated: 'محدّث وفق قواعد CBR و RVV لعام 2026',
  },
};

const GUIDES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 1: 2026 CBR CAR THEORY EXAM COMPLETE GUIDE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'cbr-theory-exam-2026',
    tag: 'CBR 2026',
    en: {
      title: '2026 Dutch CBR Car Theory Exam Guide: 50 Questions, Costs & Passing Score',
      metaTitle: 'Dutch CBR Car Theory Exam 2026 — 50 Questions, Costs (€50.50/€57) & Pass Mark | ExamTheorie',
      description: 'Complete 2026 guide to the Netherlands CBR car theory test (Rijbewijs B): integrated 50-question format, 44/50 pass score, official €50.50 / €57.00 English fees, 1.5-year validity & exam tips.',
      lead: 'The Dutch CBR overhauled the passenger-car theory exam (Rijbewijs B) into a single continuous 50-question exam with animated traffic clips. Here is everything you need to know about the 2026 format, official fees, languages, and how to pass on your first attempt.',
      body: `
        <h2>1. How the New Integrated 50-Question CBR Exam Works</h2>
        <p>Previously, the CBR car theory test was split into separate blocks (25 static hazard perception photos with a strict 8-second timer, 12 knowledge questions, and 28 insight questions) where failing a single block meant failing the entire test. Under the current integrated CBR structure, all topics are woven into <strong>one continuous exam of 50 scored questions in 30 minutes</strong> (plus 2 unscored trial questions used by CBR for quality testing).</p>
        <div class="callout"><strong>2026 Passing Score:</strong> You must answer at least <strong>44 out of 50 questions correctly (88%)</strong>. That means you are allowed a maximum of <strong>6 mistakes</strong> across the entire exam.</div>
        <ul>
          <li><strong>Dynamic Animated Videos:</strong> Static hazard photos have been replaced with short animated video situations viewed from the driver’s seat so you can judge moving cyclists, pedestrians, speed changes, and blind spots realistically.</li>
          <li><strong>Flexible Time Budget:</strong> You receive 30 minutes total for the whole exam (an average of ~36 seconds per question) and can review or navigate calmly without an 8-second panic countdown.</li>
          <li><strong>Question Formats Tested:</strong> Single-choice (A/B/C), multiple-answer checkboxes, drag-and-drop priority ordering, click-the-hazard/image selection, yes/no questions, and numeric input (e.g. speed limit in km/h).</li>
        </ul>

        <h2>2. Official 2026 CBR Car Theory Exam Costs (Tarieven)</h2>
        <p>Booking directly via <strong>Mijn CBR</strong> using your personal <strong>DigiD</strong> avoids third-party booking markups. Official 2026 CBR rates for the passenger-car theory exam are:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Exam Type (Rijbewijs B)</th><th>2026 Official CBR Fee</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>Standard CBR Theory Exam (Dutch)</td><td><strong>€ 50.50</strong></td><td>Standard touchscreen exam at any CBR centre</td></tr>
            <tr><td>CBR Theory Exam in English</td><td><strong>€ 57.00</strong></td><td>€ 50.50 base fee + € 6.50 English language surcharge</td></tr>
            <tr><td>Evening / Weekend Surcharge</td><td><strong>+ € 6.25</strong></td><td>Applies to slots from 18:00 or on weekends</td></tr>
            <tr><td>Extra-Time Exam (e.g. Dyslexia)</td><td><strong>+ € 13.50</strong></td><td>Provides 15 extra minutes (45 min total)</td></tr>
            <tr><td>Individually Guided / Interpreter Exam</td><td><strong>€ 118.50</strong></td><td>Required if taking the test with an official Turkish/Arabic interpreter (+ interpreter fee)</td></tr>
          </tbody>
        </table></div>

        <h2>3. Can You Take the CBR Exam in English, Turkish, or Arabic?</h2>
        <p>At CBR exam centres, standard computer exams are offered directly in <strong>Dutch</strong> and <strong>English</strong>. If your strongest language is <strong>Turkish</strong> or <strong>Arabic</strong>, you have two smart strategies used by thousands of candidates in the Netherlands:</p>
        <ol>
          <li><strong>Study in your native language + English/Dutch on ExamTheorie:</strong> Learn every RVV 1990 traffic rule deeply in Turkish or Arabic first, then switch our practice exams to English or Dutch for the final days so you save over €100 in interpreter fees and take the standard €50.50 / €57.00 test confidently.</li>
          <li><strong>Book an Individually Guided Exam with an Official Interpreter:</strong> Book an individual CBR slot (€118.50) and arrange a certified interpreter through TolkenNet.</li>
        </ol>

        <h2>4. How Long Is Your CBR Theory Certificate Valid?</h2>
        <p>Once you pass, your CBR theory result is registered electronically and remains valid for <strong>exactly 1.5 years (18 months)</strong> from the pass date. You must pass your practical driving test within those 18 months; CBR cannot extend an expired theory certificate under any circumstances.</p>
      `,
      faqs: [
        ['How many mistakes can you make on the 2026 CBR car theory exam?', 'You can make a maximum of 6 mistakes: you need at least 44 correct answers out of 50 scored questions (88%) within 30 minutes.'],
        ['How much does the CBR car theory exam cost in English in 2026?', 'In 2026, the official CBR car theory exam in English costs €57.00 (€50.50 base tariff plus €6.50 English surcharge) when booked directly at Mijn CBR with DigiD.'],
        ['How long is the Dutch driving theory certificate valid?', 'Your passed CBR theory certificate is valid for 1.5 years (18 months). You must complete and pass your practical driving test before it expires.'],
      ],
    },
    nl: {
      title: 'CBR Auto Theorie-examen 2026: 50 Vragen, Kosten & Slaaggrens',
      metaTitle: 'CBR Auto Theorie-examen 2026 — 50 Vragen, Kosten (€50,50) & Slaaggrens | ExamTheorie',
      description: 'Alles over het vernieuwde CBR auto theorie-examen (Rijbewijs B) in 2026: 50 doorlopende vragen, maximaal 6 fouten (44/50), officiële CBR kosten (€50,50 / €57,00) en 1,5 jaar geldigheid.',
      lead: 'Het CBR heeft het auto theorie-examen (Rijbewijs B) samengevoegd tot één doorlopend examen van 50 vragen met realistische animatievideo’s. Lees hier precies hoe de nieuwe opzet werkt, wat het examen in 2026 kost en hoe je in één keer slaagt.',
      body: `
        <h2>1. Nieuwe Opzet: Één Doorlopend Examen van 50 Vragen</h2>
        <p>Waar het CBR-examen vroeger uit losse onderdelen met aparte zakgrenzen bestond (waaronder 25 stilstaande gevaarherkenningsfoto’s met 8 seconden bedenktijd), maak je nu <strong>één geïntegreerd examen van 50 tellende vragen binnen 30 minuten</strong> (plus 2 onzichtbare testvragen van het CBR die niet meetellen voor je score).</p>
        <div class="callout"><strong>Slaaggrens 2026:</strong> Je bent geslaagd bij minimaal <strong>44 van de 50 vragen goed (88%)</strong>. Je mag over het hele examen dus maximaal <strong>6 fouten</strong> maken.</div>
        <ul>
          <li><strong>Dynamische animatiefilmpjes:</strong> Stilstaande foto’s bij gevaarherkenning zijn vervangen door korte bewegende verkeerssituaties vanuit bestuurdersperspectief, zodat je snelheid, fietsers, voetgangers en dode hoeken realistisch beoordeelt.</li>
          <li><strong>30 minuten totaaltijd:</strong> Gemiddeld heb je 36 seconden per vraag zonder stressvolle 8-secondentimer per losse foto.</li>
          <li><strong>Vraagvormen bij het CBR:</strong> Meerkeuzevragen, sleepvragen (volgorde van voorrang), klikvragen (aanwijzen op beeld), ja/nee-vragen en invulvragen (zoals maximumsnelheid in km/u).</li>
        </ul>

        <h2>2. Officiële CBR Kosten Auto Theorie-examen (2026)</h2>
        <p>Reserveer je theorie-examen altijd rechtstreeks via <strong>Mijn CBR</strong> met je eigen <strong>DigiD</strong> om extra bemiddelingskosten van commerciële aanmeldwebsites te voorkomen:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Soort CBR Examen (Rijbewijs B)</th><th>CBR Tarief 2026</th><th>Toelichting</th></tr></thead>
          <tbody>
            <tr><td>Standaard theorie-examen Nederlands</td><td><strong>€ 50,50</strong></td><td>Regulier examen op het CBR-examencentrum</td></tr>
            <tr><td>Theorie-examen in het Engels</td><td><strong>€ 57,00</strong></td><td>€ 50,50 basistarief + € 6,50 toeslag Engels</td></tr>
            <tr><td>Avond- of weekendtoeslag</td><td><strong>+ € 6,25</strong></td><td>Voor tijdsloten vanaf 18:00 uur of in het weekend</td></tr>
            <tr><td>Examen met extra tijd</td><td><strong>+ € 13,50</strong></td><td>15 minuten extra tijd (bijv. bij dyslexie)</td></tr>
            <tr><td>Individueel begeleid examen / tolk</td><td><strong>€ 118,50</strong></td><td>Persoonlijke afname of examen met officiële tolk (excl. tolkkosten)</td></tr>
          </tbody>
        </table></div>

        <h2>3. Oefenen in 4 Talen (NL, EN, TR & AR)</h2>
        <p>Bij het CBR kun je het standaard touchscreen-examen in het <strong>Nederlands</strong> of <strong>Engels</strong> afleggen; voor andere talen (zoals Turks of Arabisch) boek je een individueel begeleid examen met gecertificeerde tolk. Op ExamTheorie kun je op elk moment wisselen tussen Nederlands, Engels, Turks en Arabisch om elk lastig RVV-begrip volledig te begrijpen.</p>

        <h2>4. Geldigheid van je Theoriecertificaat (1,5 Jaar)</h2>
        <p>Zodra je slaagt, is je CBR-theoriecertificaat exact <strong>1,5 jaar (18 maanden)</strong> geldig vanaf de examendatum. Binnen die 18 maanden moet je geslaagd zijn voor het praktijkexamen; verlengen is bij het CBR wettelijk niet mogelijk.</p>
      `,
      faqs: [
        ['Hoeveel fouten mag je maken bij het CBR auto theorie-examen in 2026?', 'Je mag maximaal 6 fouten maken: je moet minimaal 44 van de 50 tellende vragen goed beantwoorden binnen 30 minuten.'],
        ['Wat kost het CBR auto theorie-examen in 2026?', 'Via Mijn CBR kost het Nederlandstalige auto theorie-examen €50,50 en het Engelstalige examen €57,00 (exclusief eventuele avond-/weekendtoeslag van €6,25).'],
        ['Hoelang blijft mijn behaalde CBR theorie geldig?', 'Je theoriecertificaat is exact 1,5 jaar (18 maanden) geldig vanaf de dag waarop je geslaagd bent.'],
      ],
    },
    tr: {
      title: '2026 Hollanda CBR Ehliyet Teori Sınavı Rehberi: 50 Soru, Ücretler ve Geçme Barajı',
      metaTitle: '2026 Hollanda CBR Ehliyet Teori Sınavı — 50 Soru, Ücret (€50,50/€57) ve Baraj | ExamTheorie',
      description: '2026 güncel Hollanda CBR B sınıfı ehliyet teori sınavı rehberi: yeni 50 soruluk birleşik sistem, 44/50 geçme barajı, resmi €50,50 / €57,00 sınav ücretleri, tercüman kuralları ve 1,5 yıl geçerlilik.',
      lead: 'Hollanda’da ehliyet veren resmi kurum CBR, B sınıfı otomobil teori sınavını animasyonlu videolar içeren tek parça 50 soruluk yeni bir sisteme dönüştürdü. 2026 sınav formatını, resmi CBR ücretlerini, dil seçeneklerini ve ilk girişte geçme taktiklerini adım adım inceleyin.',
      body: `
        <h2>1. Yeni Birleşik 50 Soruluk CBR Sınav Sistemi Nasıl İşliyor?</h2>
        <p>Eski sistemde CBR sınavı ayrı barajları olan üç ayrı bölümden (8 saniye süreli 25 sabit tehlike fotoğrafı, bilgi ve kavrama soruları) oluşuyordu ve tek bir bölümde takılan aday tüm sınavdan kalıyordu. Güncel sistemde tüm konular <strong>30 dakika süren, kesintisiz 50 puanlı soruluk tek bir sınavda</strong> birleştirildi (ayrıca CBR kalite ölçümü için puana etki etmeyen 2 deneme sorusu ekler).</p>
        <div class="callout"><strong>2026 Geçme Barajı:</strong> Sınavı geçmek için 50 sorudan en az <strong>44 doğru (%88 başarı)</strong> yapmanız gerekir; yani tüm sınav boyunca en fazla <strong>6 yanlış</strong> hakkınız vardır.</div>
        <ul>
          <li><strong>Hareketli Animasyon Videoları:</strong> Eski 8 saniyelik sabit fotoğraflar yerine artık sürücü koltuğu açısından kısa animasyon videoları izletilir; bisikletlilerin, yayaların ve hız değişimlerinin akışını gerçekçi biçimde değerlendirirsiniz.</li>
          <li><strong>30 Dakika Toplam Süre:</strong> Soru başına ortalama 36 saniyeniz vardır; panik sayacı olmadan kendi temponuzda ilerleyebilirsiniz.</li>
          <li><strong>Soru Tipleri:</strong> Çoktan seçmeli tek doğru, çoklu işaretleme, sürükle-bırak geçiş sırası (voorrang), görsel üzerinde tıklama, evet/hayır ve sayısal hız limiti yazma soruları çıkar.</li>
        </ul>

        <h2>2. 2026 Resmi CBR Teori Sınavı Ücretleri</h2>
        <p>Aracı sitelere fazladan komisyon ödememek için randevunuzu doğrudan <strong>Mijn CBR</strong> üzerinden kişisel <strong>DigiD</strong> hesabınızla alın. 2026 resmi CBR B sınıfı teori sınavı ücretleri şöyledir:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Sınav Türü (B Sınıfı Otomobil)</th><th>2026 Resmi CBR Ücreti</th><th>Açıklama</th></tr></thead>
          <tbody>
            <tr><td>Standart Felemenkçe Teori Sınavı</td><td><strong>€ 50,50</strong></td><td>Tüm CBR merkezlerinde dokunmatik ekranlı sınav</td></tr>
            <tr><td>İngilizce Teori Sınavı</td><td><strong>€ 57,00</strong></td><td>€ 50,50 taban ücret + € 6,50 İngilizce farkı</td></tr>
            <tr><td>Akşam (18:00+) / Hafta Sonu Farkı</td><td><strong>+ € 6,25</strong></td><td>Akşam veya hafta sonu seansları için eklenir</td></tr>
            <tr><td>Ek Süreli Sınav</td><td><strong>+ € 13,50</strong></td><td>Toplam 15 dakika ek süre (ör. disleksi)</td></tr>
            <tr><td>Bireysel Gözetmenli / Tercümanlı Sınav</td><td><strong>€ 118,50</strong></td><td>Resmi Türkçe tercümanla girilen bireysel sınav (+ tercüman ücreti)</td></tr>
          </tbody>
        </table></div>

        <h2>3. Türkçe Hazırlık mı, İngilizce/Felemenkçe Sınav mı, Tercüman mı?</h2>
        <p>CBR sınav merkezlerinde standart ekran sınavı doğrudan <strong>Felemenkçe</strong> ve <strong>İngilizce</strong> yapılır; <strong>Türkçe</strong> girmek isteyen adaylar ise bireysel sınav (€118,50) + yeminli tercüman seçeneğini kullanabilir. Hollanda’daki Türk adayların en çok tercih ettiği ekonomik yöntem şudur: Konuları ve tüm 50 deneme sınavını önce ExamTheorie’de <strong>anadiliniz Türkçe ile %100 kavrayıp</strong>, sınava son birkaç gün kala soruları Felemenkçe veya İngilizce modda çözerek yüzlerce euro tercüman masrafı ödemeden standart sınava girmektir.</p>

        <h2>4. Teori Sertifikası Kaç Yıl Geçerlidir?</h2>
        <p>CBR teori sınavını geçtiğiniz gün sonucunuz sisteme işlenir ve <strong>tam 1,5 yıl (18 ay)</strong> boyunca geçerli kalır. Direksiyon (praktijkexamen) sınavınızı bu 18 ay içinde geçmeniz zorunludur; süre dolarsa sertifika uzatılamaz.</p>
      `,
      faqs: [
        ['2026 Hollanda CBR teori sınavında kaç yanlış hakkı var?', '50 puanlı sorudan en az 44 doğru yapmanız gerekir; yani en fazla 6 yanlış hakkınız vardır.'],
        ['2026 CBR ehliyet teori sınavı ücreti ne kadar?', 'Mijn CBR üzerinden doğrudan alındığında Felemenkçe sınav €50,50, İngilizce sınav ise €57,00 tutarındadır.'],
        ['CBR teori sınavını geçtikten sonra sertifika ne kadar süre geçerlidir?', 'Teori sertifikanız sınavı geçtiğiniz tarihten itibaren tam 1,5 yıl (18 ay) geçerlidir.'],
      ],
    },
    ar: {
      title: 'دليل امتحان التيوري الهولندي CBR لعام 2026: 50 سؤالاً، الرسوم ودرجة النجاح',
      metaTitle: 'امتحان التيوري في هولندا CBR 2026 — 50 سؤالاً، الرسوم (50.50€) ودرجة النجاح | ExamTheorie',
      description: 'الدليل الكامل المحدّث لعام 2026 لامتحان نظرية القيادة الهولندي CBR (الفئة B): نظام الـ 50 سؤالاً المدمج، النجاح من 44، الرسوم الرسمية (50.50€ / 57.00€)، المترجم وصلاحية الشهادة.',
      lead: 'قام معهد CBR الهولندي بتحديث امتحان نظرية القيادة للسيارات (الفئة B) ليصبح امتحاناً متصلاً واحداً مكوناً من 50 سؤالاً يتضمن مقاطع فيديو متحركة. تعرّف على نظام 2026 والرسوم الرسمية وخيارات اللغة وكيفية النجاح من المرة الأولى.',
      body: `
        <h2>1. كيف يعمل نظام امتحان CBR المدمج الجديد (50 سؤالاً)؟</h2>
        <p>في السابق كان الامتحان مقسماً إلى أقسام منفصلة مع عدّاد 8 ثوانٍ لصور تمييز المخاطر الثابتة. أما الآن فقد دمج CBR جميع المحاور في <strong>امتحان واحد متصل يضم 50 سؤالاً محتسباً خلال 30 دقيقة</strong> (بالإضافة إلى سؤالين تجريبيين غير محتسبين لأغراض الجودة).</p>
        <div class="callout"><strong>درجة النجاح لعام 2026:</strong> يجب الإجابة بشكل صحيح على <strong>44 سؤالاً على الأقل من أصل 50 (88%)</strong>، أي يُسمح لك بحد أقصى <strong>6 أخطاء فقط</strong>.</div>
        <ul>
          <li><strong>مقاطع فيديو متحركة واقعية:</strong> استُبدلت الصور الثابتة بمشاهد متحركة قصيرة من منظور السائق لتقييم سرعة المركبات والدراجات الهوائية والمشاة والنقاط العمياء بدقة.</li>
          <li><strong>30 دقيقة للامتحان بالكامل:</strong> لديك في المتوسط 36 ثانية لكل سؤال دون توتر عدّاد الـ 8 ثوانٍ القديم.</li>
          <li><strong>أنواع الأسئلة:</strong> اختيار من متعدد، سحب وإفلات لترتيب الأولوية، النقر على الصورة، أسئلة نعم/لا، وإدخال رقمي مثل حدود السرعة.</li>
        </ul>

        <h2>2. رسوم امتحان التيوري CBR الرسمية لعام 2026</h2>
        <p>احجز موعدك مباشرة عبر موقع <strong>Mijn CBR</strong> باستخدام حساب <strong>DigiD</strong> الخاص بك لتجنب عمولات المواقع الوسيطة:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>نوع الامتحان (الفئة B)</th><th>رسوم CBR لعام 2026</th><th>ملاحظات</th></tr></thead>
          <tbody>
            <tr><td>الامتحان القياسي باللغة الهولندية</td><td><strong>50.50 €</strong></td><td>امتحان شاشة لمس في جميع مراكز CBR</td></tr>
            <tr><td>الامتحان باللغة الإنجليزية</td><td><strong>57.00 €</strong></td><td>50.50 € رسوم أساسية + 6.50 € رسوم اللغة الإنجليزية</td></tr>
            <tr><td>رسوم المساء (بعد 18:00) أو عطلة نهاية الأسبوع</td><td><strong>+ 6.25 €</strong></td><td>تُضاف للمواعيد المسائية وعطلة الأسبوع</td></tr>
            <tr><td>امتحان بوقت إضافي</td><td><strong>+ 13.50 €</strong></td><td>يمنح 15 دقيقة إضافية</td></tr>
            <tr><td>امتحان فردي مع مشرف / مترجم معتمد</td><td><strong>118.50 €</strong></td><td>مطلوب عند التقدم باللغة العربية عبر مترجم معتمد (+ أجر المترجم)</td></tr>
          </tbody>
        </table></div>

        <h2>3. كيف تستعد بالعربية وتوفر تكاليف المترجم؟</h2>
        <p>يُقدَّم الامتحان القياسي في مراكز CBR باللغتين <strong>الهولندية</strong> و<strong>الإنجليزية</strong>، بينما يتطلب التقدم بالعربية حجز امتحان فردي مع مترجم. عبر منصة ExamTheorie يمكنك فهم جميع القواعد والـ 50 اختباراً باللغة العربية أولاً، ثم التدرب على نفس الواجهة بالهولندية أو الإنجليزية قبل موعدك لتوفير مئات اليوروهات.</p>

        <h2>4. مدة صلاحية شهادة التيوري (سنة ونصف)</h2>
        <p>تظل نتيجة نجاحك في امتحان التيوري صالحة لمدة <strong>سنة ونصف (18 شهراً)</strong> بالضبط من تاريخ النجاح، ويجب اجتياز الامتحان العملي خلالها لأن الصلاحية غير قابلة للتمديد.</p>
      `,
      faqs: [
        ['كم خطأ يُسمح به في امتحان التيوري CBR لعام 2026؟', 'يُسمح بـ 6 أخطاء كحد أقصى؛ إذ يجب تحقيق 44 إجابة صحيحة على الأقل من أصل 50 سؤالاً خلال 30 دقيقة.'],
        ['كم تبلغ تكلفة امتحان التيوري في هولندا لعام 2026؟', 'تبلغ الرسوم الرسمية عبر Mijn CBR نحو 50.50 يورو باللغة الهولندية و57.00 يورو باللغة الإنجليزية.'],
        ['ما هي مدة صلاحية شهادة النظري CBR؟', 'تكون الشهادة صالحة لمدة 18 شهراً (سنة ونصف) من يوم النجاح.'],
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 2: DUTCH TRAFFIC SIGNS & MEANINGS (RVV 1990 VISUAL GUIDE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'dutch-traffic-signs-rvv',
    tag: 'RVV 1990',
    en: {
      title: 'Dutch Traffic Signs & Meanings (RVV 1990): Top CBR Road Signs Visual Guide',
      metaTitle: 'Dutch Traffic Signs & Meanings (RVV 1990) — Visual CBR Exam Guide | ExamTheorie',
      description: 'Master Dutch road signs (RVV 1990 Series A–L) for the CBR theory exam: visual overview of priority signs (B1, B6), C1 vs C2 entry bans, E1 vs E2 parking rules, Autoweg & Erf.',
      lead: 'Traffic signs under Annex 1 of the Dutch RVV 1990 are organized into categories A through L. Recognizing shapes, border colors, and sub-plates (onderborden) instantly will earn you easy points on your CBR theory test.',
      body: `
        <h2>1. The 12 Most Tested Dutch Road Signs on the CBR Exam</h2>
        <p>Memorize these essential RVV signs — CBR tests them constantly in combination with cyclists, trams, and speed questions:</p>
        ${renderSignsShowcase({
          a1: 'Maximum speed limit (e.g. 50 km/h inside built-up areas).',
          b1: 'Priority road (Voorrangsweg): drivers on this road have priority at intersections.',
          b6: 'Give way (Verleen voorrang) to all drivers on the intersecting road.',
          b7: 'STOP: come to a complete halt and yield to drivers on the crossing road.',
          c1: 'Closed in BOTH directions for all vehicles, riders, and persons leading animals.',
          c2: 'One-way street: entry prohibited from THIS direction (watch for uitgezonderd fietsers).',
          d2: 'Mandatory direction: all drivers must pass the sign on the side the arrow points.',
          e1: 'No parking (Parkeerverbod) on this side of the carriageway — brief passenger drop-off is allowed.',
          e2: 'No stopping or waiting (Verbod stil te staan) — not even for 5 seconds to drop someone off.',
          g3: 'Autoweg (expressway): default max speed 100 km/h; minimum permitted capability 50 km/h.',
          g5: 'Erf (home zone / woonerf): max walking pace 15 km/h; pedestrians may use the full width.',
          g11: 'Compulsory cycle path (Verplicht fietspad): closed to motor vehicles.',
        })}

        <h2>2. Overview of RVV 1990 Sign Categories (Series A to L)</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Series</th><th>Category</th><th>Visual Shape & Color Rule</th></tr></thead>
          <tbody>
            <tr><td><strong>A</strong></td><td>Speed Limits</td><td>Round white sign with red border (A1) or blue square advisory speed (A4)</td></tr>
            <tr><td><strong>B</strong></td><td>Priority (Voorrang)</td><td>Yellow diamond (B1), inverted triangle (B6), red octagon STOP (B7)</td></tr>
            <tr><td><strong>C</strong></td><td>Prohibitions (Geslotenverklaring)</td><td>Round white sign with red border (or solid red C2) banning specific vehicles</td></tr>
            <tr><td><strong>D</strong></td><td>Mandatory Direction</td><td>Round blue sign with white arrows (e.g. roundabouts D1, keep right D2)</td></tr>
            <tr><td><strong>E</strong></td><td>Parking & Stopping</td><td>Blue circle with red border & diagonal cross (E1/E2) or blue P plates (E4–E10)</td></tr>
            <tr><td><strong>F</strong></td><td>Other Prohibitions</td><td>Overtaking bans (F1), oncoming priority (F5/F6), U-turn ban (F7)</td></tr>
            <tr><td><strong>G</strong></td><td>Traffic Rules & Zones</td><td>Autosnelweg (G1, 130/100 km/h), Autoweg (G3, 100 km/h), Erf (G5, 15 km/h), paths</td></tr>
            <tr><td><strong>H / J / K / L</strong></td><td>Built-up Area, Warnings, Direction & Info</td><td>Blue place-name (H1 = 50 km/h), red warning triangle (J), route & lane info (K/L)</td></tr>
          </tbody>
        </table></div>

        <h2>3. Three Classic CBR Sign Traps to Watch Out For</h2>
        <ul>
          <li><strong>Trap 1 — E1 (No Parking) vs E2 (No Stopping):</strong> At <strong>E1</strong> (single diagonal bar), you <em>may</em> briefly stop to let a passenger get in/out or load/unload goods immediately. At <strong>E2</strong> (red X), stopping voluntarily is completely prohibited. Also remember: both E1 and E2 apply only to the <em>carriageway (rijbaan)</em> on that side unless marked as a <code>Zone</code> — parking bays remain usable at E1!</li>
          <li><strong>Trap 2 — C1 vs C2 + Onderbord "uitgezonderd fietsers":</strong> A narrow Dutch street with <strong>C2</strong> and a white sub-plate showing a bicycle means cars cannot enter from your side, <em>and</em> cyclists are legally riding toward you from the opposite direction.</li>
          <li><strong>Trap 3 — Round Red Advisory vs Mandatory Speed:</strong> Round white-with-red-border <strong>A1</strong> = legal maximum speed; square blue <strong>A4</strong> = advisory speed (adviesnelheid); overhead motorway matrix speed has an immediate legal maximum!</li>
        </ul>
      `,
      faqs: [
        ['What is the difference between Dutch road signs E1 and E2?', 'Sign E1 (one red diagonal stripe) prohibits parking, but you may stop briefly to pick up/drop off passengers or load/unload goods immediately. Sign E2 (red X) prohibits both parking and stopping voluntarily.'],
        ['What is the speed limit at a Dutch G5 Erf (woonerf) sign?', 'Inside an Erf (sign G5), the maximum speed limit is walking pace: 15 km/h, and parking is only allowed in spaces marked with a P.'],
        ['Do traffic signs override normal priority rules in the Netherlands?', 'Yes. Under RVV 1990, traffic signs and road markings (such as B6 and haaientanden) always override default equal-intersection rules like right-before-left.'],
      ],
    },
    nl: {
      title: 'Nederlandse Verkeersborden Betekenis (RVV 1990): CBR Overzicht',
      metaTitle: 'Nederlandse Verkeersborden Betekenis (RVV 1990) — CBR Oefengids | ExamTheorie',
      description: 'Leer de belangrijkste Nederlandse RVV 1990 verkeersborden (serie A t/m L) voor het CBR theorie-examen: voorrangsborden B1/B6, C1 vs C2, parkeerverbod E1 vs E2, Autoweg en Erf.',
      lead: 'De verkeersborden in Nederland zijn in Bijlage 1 van het RVV 1990 ingedeeld in de series A tot en met L. Wie de vormen, kleuren en bekende CBR-instinkers kent, pakt direct waardevolle punten op het examen.',
      body: `
        <h2>1. De 12 Meest Gevraagde CBR Verkeersborden</h2>
        <p>Deze twaalf borden komen vrijwel in elk CBR auto theorie-examen terug:</p>
        ${renderSignsShowcase({
          a1: 'Maximumsnelheid (bijv. 50 km/u binnen de bebouwde kom).',
          b1: 'Voorrangsweg: bestuurders op deze weg hebben voorrang op kruisende wegen.',
          b6: 'Verleen voorrang aan alle bestuurders op de kruisende weg.',
          b7: 'STOP: verplicht volledig stoppen én voorrang verlenen aan bestuurders op de kruisende weg.',
          c1: 'Gesloten in beide richtingen voor voertuigen, ruiters en geleiders van rij- of trekdieren of vee.',
          c2: 'Eenrichtingsweg: in deze richting gesloten (let vaak op onderbord uitgezonderd fietsers).',
          d2: 'Gebod voor alle bestuurders het bord voorbij te gaan aan de zijde die de pijl aangeeft.',
          e1: 'Parkeerverbod aan deze zijde van de rijbaan (onmiddellijk in-/uitstappen of laden/lossen mag wel).',
          e2: 'Verbod stil te staan aan deze zijde van de rijbaan (ook niet kort om iemand uit te laten stappen).',
          g3: 'Autoweg: standaard maximumsnelheid 100 km/u; minimum vereiste snelheid 50 km/u.',
          g5: 'Erf (woonerf): stapvoets rijden (max. 15 km/u) en alleen parkeren in vakken met een P.',
          g11: 'Verplicht fietspad: verboden voor motorvoertuigen.',
        })}

        <h2>2. Alle RVV Bordenseries (A t/m L) Snel Herkennen</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Serie</th><th>Betekenis</th><th>Vorm & Kleurkenmerk</th></tr></thead>
          <tbody>
            <tr><td><strong>A</strong></td><td>Snelheid</td><td>Rond wit bord met rode rand (A1) of blauw vierkant adviessnelheid (A4)</td></tr>
            <tr><td><strong>B</strong></td><td>Voorrang</td><td>Gele ruit (B1), omgekeerde driehoek (B6), achthoekig STOP-bord (B7)</td></tr>
            <tr><td><strong>C</strong></td><td>Geslotenverklaring</td><td>Rond wit bord met rode rand (of rood met witte balk C2)</td></tr>
            <tr><td><strong>D</strong></td><td>Rijrichting</td><td>Rond blauw gebodsbord met witte pijl (bijv. rotonde D1, rechts passeren D2)</td></tr>
            <tr><td><strong>E</strong></td><td>Parkeren en Stilstaan</td><td>Blauw met rode rand en schuine streep (E1) of kruis (E2), blauwe P-borden</td></tr>
            <tr><td><strong>F</strong></td><td>Overige geboden/verboden</td><td>Inhaalverbod (F1), voorrang bij versmalling (F5/F6), keerverbod (F7)</td></tr>
            <tr><td><strong>G</strong></td><td>Verkeersregels</td><td>Autosnelweg (G1), Autoweg (G3), Erf (G5), fietspaden en voetpaden</td></tr>
            <tr><td><strong>H / J / K / L</strong></td><td>Bebouwde kom, Gevaar, Bewegwijzering & Info</td><td>Blauw plaatsnaambord H1 (50 km/u), rode gevaardriehoek (J), rijstrookinfo (L)</td></tr>
          </tbody>
        </table></div>

        <h2>3. Drie Klassieke CBR Instinkers bij Verkeersborden</h2>
        <ul>
          <li><strong>Instinker 1 — E1 (Parkeerverbod) vs E2 (Stilstaanverbod):</strong> Bij <strong>E1</strong> mag je wél kort stoppen voor het onmiddellijk in- en uitstappen van passagiers of direct laden en lossen van goederen, én je mag in parkeervakken langs de rijbaan parkeren (tenzij het een parkeerverbodszone is buiten vakken). Bij <strong>E2</strong> mag je helemaal niet vrijwillig op de rijbaan stoppen.</li>
          <li><strong>Instinker 2 — Onderborden ("uitgezonderd"):</strong> Een bord C2 met onderbord <em>uitgezonderd fietsers en bromfietsers</em> betekent dat jij er met de auto niet in mag én dat je tegemoetkomende fietsers uit die straat moet verwachten.</li>
          <li><strong>Instinker 3 — Adviessnelheid (A4) vs Matrixbord:</strong> Een blauw vierkant bord met <code>50</code> is een adviessnelheid, maar een elektronisch matrixbord boven de rijstrook toont een <strong>wettelijk verplichte maximumsnelheid</strong>!</li>
        </ul>
      `,
      faqs: [
        ['Wat is het verschil tussen bord E1 en bord E2?', 'Bord E1 (één schuine streep) verbiedt parkeren op de rijbaan, maar direct in-/uitstappen en laden/lossen mag wel. Bord E2 (rood kruis) verbiedt ook vrijwillig stilstaan op de rijbaan.'],
        ['Hoe hard mag je rijden bij bord G5 (Erf)?', 'Op een erf geldt een wettelijke maximumsnelheid van 15 km/u (stapvoets).'],
        ['Geldt bord E1 ook voor parkeervakken?', 'Nee, een los bord E1 geldt alleen voor de rijbaan aan die zijde; in officiële parkeervakken of op een parkeerhaven mag je daar gewoon parkeren.'],
      ],
    },
    tr: {
      title: 'Hollanda Trafik Levhaları ve Anlamları (RVV 1990): Görselli CBR Rehberi',
      metaTitle: 'Hollanda Trafik Levhaları ve Anlamları (RVV 1990 Türkçe) — CBR Rehberi | ExamTheorie',
      description: 'Hollanda CBR ehliyet sınavında en çok sorulan RVV 1990 (A–L serisi) trafik levhaları ve Türkçe anlamları: B1/B6 öncelik, C1–C2 giriş yasağı, E1–E2 park/duraklama, Autoweg ve Erf.',
      lead: 'Hollanda RVV 1990 yönetmeliğindeki trafik levhaları A’dan L’ye kadar harf serilerine ayrılır. Levhaların şekillerini, alt ek tabelaları (onderbord) ve CBR sınav tuzaklarını bilmek sınavda doğrudan net kazandırır.',
      body: `
        <h2>1. CBR Sınavında En Çok Çıkan 12 Hollanda Trafik Levhası</h2>
        <p>Aşağıdaki 12 temel RVV levhası neredeyse her CBR teori sınavında karşınıza çıkar:</p>
        ${renderSignsShowcase({
          a1: 'Azami hız sınırı (ör. yerleşim yeri içinde 50 km/sa).',
          b1: 'Ana yol (Voorrangsweg): bu yoldaki sürücüler kavşaklarda geçiş üstünlüğüne sahiptir.',
          b6: 'Yol ver (Verleen voorrang): kesişen yoldaki tüm sürücülere (bisikletliler dahil) yol verin.',
          b7: 'STOP: çizgide tamamen durun ve kesişen yoldaki sürücülere yol verin.',
          c1: 'Her iki yönde tüm araçlara, atlılara ve hayvan güdenlere kapalı yol.',
          c2: 'Tek yön giriş yasağı: bu yönden giriş yasak (alttaki uitgezonderd bisiklet levhasına dikkat!).',
          d2: 'Mecburi yön: tüm sürücüler levhayı okun gösterdiği taraftan geçmelidir.',
          e1: 'Park yasağı (Parkeerverbod): yolcu indirip bindirmek veya hemen yük indirmek serbesttir.',
          e2: 'Duraklama ve park yasağı (Verbod stil te staan): yolcu indirmek için bile durulamaz.',
          g3: 'Autoweg (Ekspres yol): standart azami hız 100 km/sa; en az 50 km/sa yapabilen araçlar girebilir.',
          g5: 'Erf (Yaşam alanı / woonerf): azami hız 15 km/sa; sadece P işaretli ceplere park edilir.',
          g11: 'Zorunlu bisiklet yolu (Verplicht fietspad): otomobil ve motosikletlere kapalıdır.',
        })}

        <h2>2. RVV 1990 Levha Serileri (A – L) Özet Tablosu</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Seri</th><th>Kategori</th><th>Şekil ve Renk Kuralı</th></tr></thead>
          <tbody>
            <tr><td><strong>A</strong></td><td>Hız Sınırları</td><td>Kırmızı çerçeveli yuvarlak (A1 yasal sınır) / Mavi kare (A4 tavsiye hızı)</td></tr>
            <tr><td><strong>B</strong></td><td>Geçiş Üstünlüğü (Voorrang)</td><td>Sarı eşkenar dörtgen (B1), ters üçgen (B6), sekizgen STOP (B7)</td></tr>
            <tr><td><strong>C</strong></td><td>Giriş Yasakları</td><td>Kırmızı çerçeveli beyaz daire (veya beyaz şeritli kırmızı C2)</td></tr>
            <tr><td><strong>D</strong></td><td>Mecburi Yön</td><td>Beyaz oklu mavi yuvarlak levhalar (döner kavşak D1, sağdan geç D2)</td></tr>
            <tr><td><strong>E</strong></td><td>Park ve Duraklama</td><td>Kırmızı çerçeveli mavi daire tek çizgi (E1), çarpı (E2) ve mavi P levhaları</td></tr>
            <tr><td><strong>F</strong></td><td>Diğer Yasaklar</td><td>Sollama yasağı (F1), daralan yolda öncelik (F5/F6), U dönüşü yasağı (F7)</td></tr>
            <tr><td><strong>G</strong></td><td>Yol Türleri ve Kurallar</td><td>Otoyol (G1), Autoweg (G3), Erf (G5), bisiklet ve yaya yolları</td></tr>
            <tr><td><strong>H / J / K / L</strong></td><td>Yerleşim Yeri, Tehlike ve Bilgi</td><td>Mavi şehir tabelası H1 (50 km/sa), kırmızı üçgen tehlike (J), şerit bilgisi (L)</td></tr>
          </tbody>
        </table></div>

        <h2>3. CBR Sınavında En Çok Düşülen 3 Levha Tuzağı</h2>
        <ul>
          <li><strong>Tuzak 1 — E1 (Park Yasağı) ile E2 (Duraklama Yasağı) Farkı:</strong> <strong>E1</strong> (tek çapraz çizgi) levhasında hemen yolcu indirip bindirmek veya yük boşaltmak için kısa süre durabilirsiniz ve yol kenarındaki resmi park ceplerine park edebilirsiniz. <strong>E2</strong> (çarpı işareti) levhasında ise taşıt yolunda isteğe bağlı duraklamak bile yasaktır.</li>
          <li><strong>Tuzak 2 — C2 + "uitgezonderd fietsers" Ek Tabelası:</strong> Hollanda sokaklarında çok yaygındır; otomobille o sokağa giremezsiniz ve sokaktan karşı yönden bisikletli çıkacağını hesaba katmalısınız.</li>
          <li><strong>Tuzak 3 — Mavi Kare Tavsiye Hızı (A4) vs Otoyol Matrix Tabelası:</strong> Mavi kare içindeki hız sadece tavsiyedir; otoyol üzerindeki elektronik matrix tabeladaki hız ise <strong>yasal zorunlu üst sınırdır</strong>!</li>
        </ul>
      `,
      faqs: [
        ['Hollanda E1 ve E2 levhaları arasındaki fark nedir?', 'E1 (tek çizgi) sadece park etmeyi yasaklar; yolcu indirip bindirmek veya hemen yük indirmek serbesttir. E2 (çarpı) ise taşıt yolunda kısa süreli duraklamayı da yasaklar.'],
        ['G5 (Erf / Yaşam Alanı) levhasında hız sınırı kaçtır?', 'Erf bölgesinde azami hız sınırı yürüme hızı olan 15 km/sa’tir ve yalnızca P işaretli alanlara park edilebilir.'],
        ['E1 park yasağı levhası yol kenarındaki park ceplerini kapsar mı?', 'Hayır, tek başına E1 levhası sadece o taraftaki taşıt yolunu (rijbaan) kapsar; özel ayrılmış park ceplerine park edilebilir.'],
      ],
    },
    ar: {
      title: 'إشارات المرور في هولندا ومعانيها (RVV 1990): الدليل المصوّر لامتحان CBR',
      metaTitle: 'إشارات المرور في هولندا ومعانيها بالعربي (RVV 1990) — دليل CBR | ExamTheorie',
      description: 'تعرّف على أهم إشارات وشواخص المرور الهولندية (RVV 1990 الفئات A–L) لامتحان التيوري CBR بالعربي: لوحات الأولوية B1 وB6، الفرق بين C1 وC2 وبين E1 وE2 ومناطق Erf وAutoweg.',
      lead: 'تُصنَّف إشارات المرور الهولندية وفق لائحة RVV 1990 في مجموعات من A إلى L. فهم أشكال الإشارات واللوحات الإضافية (onderborden) يمنحك نقاطاً مضمونة في امتحان CBR.',
      body: `
        <h2>1. أهم 12 إشارة مرور متكررة في امتحان CBR</h2>
        <p>تتكرر هذه الشواخص الاثنتا عشرة في معظم اختبارات التيوري الهولندية:</p>
        ${renderSignsShowcase({
          a1: 'الحد الأقصى للسرعة (مثل 50 كم/ساعة داخل المناطق السكنية).',
          b1: 'طريق ذو أولوية (Voorrangsweg): للسائقين على هذا الطريق حق الأولوية في التقاطعات.',
          b6: 'أعطِ الأولوية لجميع السائقين (بما في ذلك الدراجات) على الطريق المتقاطع.',
          b7: 'قف (STOP): التوقف التام الإلزامي وإعطاء الأولوية للسائقين على الطريق المتقاطع.',
          c1: 'مغلق في كلا الاتجاهين أمام جميع المركبات والفرسان وقادة الحيوانات.',
          c2: 'طريق باتجاه واحد: ممنوع الدخول من هذا الاتجاه (انتبه للوحة استثناء الدراجات).',
          d2: 'اتجاه إلزامي: يجب على جميع السائقين تجاوز الإشارة من الجهة التي يشير إليها السهم.',
          e1: 'ممنوع الوقوف الطويل/الركن (يُسمح بالتوقف اللحظي لإنزال راكب أو تحميل البضائع فوراً).',
          e2: 'ممنوع التوقف والانتظار نهائياً على قارعة الطريق حتى لثوانٍ معدودة.',
          g3: 'طريق سريع إقليمي (Autoweg): السرعة القصوى الافتراضية 100 كم/ساعة.',
          g5: 'منطقة سكنية مشتركة (Erf): السرعة القصوى 15 كم/ساعة والركن فقط في مواقف P.',
          g11: 'مسار دراجات إلزامي (Verplicht fietspad): مغلق أمام السيارات.',
        })}

        <h2>2. ملخص فئات إشارات المرور الهولندية (A إلى L)</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>الفئة</th><th>الموضوع</th><th>الشكل واللون المميز</th></tr></thead>
          <tbody>
            <tr><td><strong>A</strong></td><td>حدود السرعة</td><td>دائرة بيضاء بإطار أحمر (إلزامي) أو مربع أزرق (سرعة استرشادية A4)</td></tr>
            <tr><td><strong>B</strong></td><td>الأولوية (Voorrang)</td><td>معين أصفر (B1)، مثلث مقلوب (B6)، مثمّن أحمر STOP (B7)</td></tr>
            <tr><td><strong>C</strong></td><td>منع الدخول</td><td>دائرة بيضاء بإطار أحمر أو دائرة حمراء بخط أبيض أفقي (C2)</td></tr>
            <tr><td><strong>D</strong></td><td>الاتجاه الإلزامي</td><td>دائرة زرقاء بأسهم بيضاء (الدوار D1، المرور يميناً D2)</td></tr>
            <tr><td><strong>E</strong></td><td>الركن والتوقف</td><td>دائرة زرقاء بإطار أحمر وخط مائل واحد (E1) أو علامة X (E2)</td></tr>
            <tr><td><strong>F</strong></td><td>ممنوعات أخرى</td><td>منع التجاوز (F1)، الأولوية في الطرق الضيقة (F5/F6)</td></tr>
            <tr><td><strong>G</strong></td><td>أنواع الطرق</td><td>الطريق السريع (G1)، Autoweg (G3)، منطقة Erf (G5)، مسارات الدراجات</td></tr>
            <tr><td><strong>H / J / K / L</strong></td><td>المدن والتحذير والإرشاد</td><td>لوحة اسم المدينة الزرقاء H1 (50 كم/ساعة)، مثلث التحذير الأحمر (J)</td></tr>
          </tbody>
        </table></div>

        <h2>3. أشهر 3 خدع في أسئلة إشارات المرور في CBR</h2>
        <ul>
          <li><strong>الخدعة 1 — الفرق بين E1 وE2:</strong> عند الإشارة <strong>E1</strong> يُسمح لك بالتوقف الفوري لصعود أو نزول الركاب أو تفريغ البضائع، كما يُسمح بالركن داخل جيوب المواقف المخصصة. أما عند <strong>E2</strong> فيُمنع التوقف الاختياري تماماً على قارعة الطريق.</li>
          <li><strong>الخدعة 2 — لوحة الاستثناء "uitgezonderd fietsers":</strong> تحت إشارة C2 تعني أنه يُمنع دخول السيارات ولكن يُسمح للدراجات بالدخول بالاتجاه المعاكس.</li>
          <li><strong>الخدعة 3 — السرعة على اللوحات الإلكترونية فوق الطريق السريع:</strong> اللوحات الإلكترونية (Matrixborden) تمثل حداً أقصى إلزامياً قانونياً للسرعة وليس مجرد نصيحة!</li>
        </ul>
      `,
      faqs: [
        ['ما الفرق بين إشارة E1 وإشارة E2 في هولندا؟', 'إشارة E1 تمنع الركن فقط وتسمح بالتوقف اللحظي لركوب/نزول الركاب أو التحميل الفوري، بينما إشارة E2 (علامة X) تمنع الركن والتوقف معاً على قارعة الطريق.'],
        ['كم تبلغ السرعة القصوى عند إشارة G5 (منطقة Erf)؟', 'الحد الأقصى للسرعة داخل منطقة Erf هو سرعة المشي أي 15 كم/ساعة فقط.'],
        ['هل تنطبق إشارة E1 على مواقف السيارات المخصصة بجانب الطريق؟', 'لا، إشارة E1 المفردة تنطبق على قارعة الطريق فقط، ويُسمح بالركن في المواقف المحددة بجانبها.'],
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 3: CBR HAZARD PERCEPTION & DUTCH PRIORITY RULES (VOORRANG)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'cbr-hazard-perception-priority',
    tag: 'VOORRANG',
    en: {
      title: 'CBR Hazard Perception & Dutch Priority Rules (Voorrang) Explained',
      metaTitle: 'Dutch Priority Rules (Voorrang) & CBR Hazard Perception Guide 2026 | ExamTheorie',
      description: 'Master Dutch intersection priority rules (RVV 1990) and CBR animated hazard perception: trams, cyclists, shark teeth (haaientanden), equal junctions, exits (uitrit) & turning rules.',
      lead: 'Priority questions (voorrang) and hazard perception account for roughly half of the mistakes on the CBR car theory exam. Follow this exact 4-step Dutch legal hierarchy to solve every intersection question accurately.',
      body: `
        <h2>1. The 4-Level Dutch Traffic Hierarchy</h2>
        <p>Whenever multiple rules seem to conflict at an intersection, Dutch law applies this strict top-to-bottom order:</p>
        <ol>
          <li><strong>Instructions from authorized traffic controllers</strong> (police, verkeersregelaars) — override everything, even red traffic lights.</li>
          <li><strong>Working traffic lights</strong> — override road signs and shark teeth placed at the same junction.</li>
          <li><strong>Traffic signs & road markings</strong> (e.g. B1, B6, STOP, <em>haaientanden</em>) — override default equal-junction rules.</li>
          <li><strong>General traffic rules (RVV 1990)</strong> — apply when there are no controllers, working lights, or priority signs.</li>
        </ol>

        <h2>2. Equal Intersections (Gelijkwaardige Kruispunten) & Trams</h2>
        <p>At a paved intersection with no priority signs, lights, or shark teeth:</p>
        <ul>
          <li><strong>Drivers from the right have priority</strong> (<em>rechts gaat voor</em>) — remember that <strong>cyclists, moped riders, and horse riders ARE drivers (bestuurders)</strong> under Dutch law! Pedestrians are <em>not</em> drivers, so at an equal intersection a pedestrian crossing a side road from your right does not get priority under right-before-left.</li>
          <li><strong>The Tram Exception:</strong> At an equal intersection, a <strong>tram ALWAYS has priority</strong> — whether it approaches from the left or the right, and even if the tram is turning! A tram only yields when facing a red light, B6 sign, STOP sign, or <em>haaientanden</em>.</li>
          <li><strong>Unpaved Roads:</strong> Drivers emerging from an unpaved dirt/forest track (<em>onverharde weg</em>) must yield to all drivers on a paved road.</li>
        </ul>

        <h2>3. Turning Rules: "Rechtdoor op dezelfde weg gaat voor"</h2>
        <div class="callout"><strong>Golden Turning Rule (RVV Art. 18):</strong> Drivers who turn left or right must give way to <strong>ALL road users continuing straight on the same road</strong> — <em>including pedestrians and cyclists!</em></div>
        <ul>
          <li>If a cyclist rides straight in the cycle lane beside you while you turn right, the cyclist goes first (always check your right mirror and right shoulder blind spot — <em>dode hoek</em>).</li>
          <li>If a pedestrian walks straight along the sidewalk of the main road you are currently driving on and crosses the side street you are turning into, <strong>the pedestrian goes first</strong> because you are both on the same road.</li>
          <li><strong>Short turn before long turn (Korte bocht gaat voor lange bocht):</strong> If you turn right and an oncoming vehicle turns left into the same street, you go first.</li>
        </ul>

        <h2>4. Exits (Uitrit) & Special Manoeuvres (Bijzondere Verrichtingen — Art. 54)</h2>
        <p>When performing a special manoeuvre — leaving an <strong>uitrit</strong> (driveway / continuous raised sidewalk across an exit), pulling away from the curb, reversing, doing a U-turn, or changing lanes — you must yield to <strong>ALL other road users, including pedestrians</strong>.</p>

        <h2>5. Winning Strategy for Animated CBR Hazard Perception</h2>
        <ul>
          <li><strong>Immediate Braking Triggers:</strong> Children or balls near parked vans, obscured intersections with less than clear stopping sight, cyclists swerving around obstacles/open car doors, or brake lights ahead on wet/icy asphalt.</li>
          <li><strong>Releasing the Accelerator (Anticipating):</strong> Approaching a blind bend, busy bus stop where passengers might cross, amber traffic lights, or narrowing residential streets.</li>
        </ul>
      `,
      faqs: [
        ['Does a tram always have priority in the Netherlands?', 'At an equal intersection without signs or markings, yes — a tram always has priority from left or right, even when turning. However, if the tram faces shark teeth (haaientanden), a B6/STOP sign, or a red light, the tram must yield.'],
        ['Who must you yield to when leaving an uitrit (exit construction)?', 'Under RVV Article 54, when leaving an uitrit (recognizable by a continuous sidewalk and sloped curbstones), you must yield to ALL road users — including pedestrians walking on the sidewalk.'],
        ['Do cyclists from the right have priority at an unmarked Dutch intersection?', 'Yes! Under Dutch law, cyclists are classified as drivers (bestuurders), so at an equal intersection cyclists approaching from your right have priority.'],
      ],
    },
    nl: {
      title: 'CBR Gevaarherkenning & Nederlandse Voorrangsregels Uitgelegd',
      metaTitle: 'Voorrangsregels & CBR Gevaarherkenning Tips 2026 — Tram, Uitrit & Haaientanden | ExamTheorie',
      description: 'Beheers alle Nederlandse voorrangsregels (RVV 1990) en dynamische CBR gevaarherkenning: gelijkwaardige kruispunten, trams, fietsers, rechtdoor op dezelfde weg, haaientanden en uitrit.',
      lead: 'Voorrangsvragen en gevaarherkenning zorgen samen voor bijna de helft van alle fouten op het CBR auto theorie-examen. Met dit vaste 4-stappenplan los je elke kruispuntvraag foutloos op.',
      body: `
        <h2>1. De Vaste Hiërarchie in het Nederlandse Verkeer</h2>
        <p>Pas bij elk kruispunt altijd deze wettelijke volgorde toe van hoog naar laag:</p>
        <ol>
          <li><strong>Aanwijzingen van bevoegde verkeersregelaars / politie</strong> — gaan boven verkeerslichten, borden én regels.</li>
          <li><strong>Werkende verkeerslichten</strong> — gaan boven verkeersborden en haaientanden op dat kruispunt.</li>
          <li><strong>Verkeerstekens en wegmarkeringen</strong> (zoals B1, B6, STOP en <em>haaientanden</em>) — gaan boven de algemene verkeersregels.</li>
          <li><strong>Verkeersregels (RVV 1990)</strong> — gelden op gelijkwaardige kruispunten zonder werkende lichten of tekens.</li>
        </ol>

        <h2>2. Gelijkwaardig Kruispunt, Fietsers en de Tram</h2>
        <ul>
          <li><strong>Bestuurders van rechts gaan voor:</strong> Let op het woord <em>bestuurders</em>! Fietsers, bromfietsers, gehandicaptenvoertuigen en ruiters zijn óók bestuurders en hebben van rechts gewoon voorrang. Voetgangers zijn géén bestuurders.</li>
          <li><strong>De bijzondere positie van de tram:</strong> Op een gelijkwaardig kruispunt heeft een <strong>tram altijd voorrang</strong> — ongeacht of hij van links of van rechts komt en zelfs als de tram afslaat! Alleen bij haaientanden, bord B6/B7 of een rood licht moet de tram voorrang verlenen.</li>
          <li><strong>Onverharde weg:</strong> Bestuurders uit een onverharde weg moeten voorrang verlenen aan alle bestuurders op de verharde weg.</li>
        </ul>

        <h2>3. Afslaan: "Rechtdoor op dezelfde weg gaat voor" (Art. 18 RVV)</h2>
        <div class="callout"><strong>Belangrijk verschil:</strong> Bij afslaan laat je <strong>ál het rechtdoorgaande verkeer op dezelfde weg</strong> voorgaan — dus <em>óók voetgangers en fietsers!</em></div>
        <ul>
          <li>Sla je rechtsaf terwijl een fietser rechts naast je op de fietsstrook rechtdoor rijdt? De fietser gaat voor (controleer altijd spiegel én dode hoek over je rechterschouder).</li>
          <li>Loopt een voetganger op het trottoir langs jouw weg rechtdoor over de zijstraat waar jij in wilt draaien? Dan gaat de voetganger vóór. Loopt de voetganger daarentegen al langs de <em>kruisende</em> zijstraat (zonder zebrapad), dan zit hij niet op dezelfde weg.</li>
          <li><strong>Korte bocht gaat voor lange bocht:</strong> Rechtsafslaand verkeer gaat voor tegemoetkomend linksafslaand verkeer.</li>
        </ul>

        <h2>4. Uitrit en Bijzondere Verrichtingen (Art. 54 RVV)</h2>
        <p>Bij het verlaten van een <strong>uitrit</strong> (herkenbaar aan een doorlopend trottoir en schuine inritblokken), wegrijden, achteruitrijden, keren of wisselen van rijstrook moet je <strong>álle overige weggebruikers (inclusief voetgangers!)</strong> voor laten gaan.</p>

        <h2>5. Slim Scoren bij Bewegende CBR Gevaarherkenning</h2>
        <ul>
          <li><strong>Direct remmen / snelheid sterk verlagen:</strong> Bij direct of onoverzichtelijk gevaar zoals een rollende bal of kind tussen geparkeerde busjes, openslaande autoportieren vlak naast fietsers, of remlichten op nat/glad wegdek.</li>
          <li><strong>Gas loslaten / anticiperen:</strong> Bij potentiële risico’s zoals een onoverzichtelijke bocht, een halte met wachtende buspassagiers of naderende versmallingen.</li>
        </ul>
      `,
      faqs: [
        ['Wanneer moet een tram voorrang verlenen?', 'Alleen wanneer de tram haaientanden, een voorrangsbord B6, een STOP-bord B7 of een rood verkeerslicht voor zich heeft. Op een gelijkwaardig kruispunt gaat de tram altijd voor.'],
        ['Moet je voetgangers voor laten gaan bij een uitrit?', 'Ja! Bij het verlaten van een uitrit (doorlopende stoep) verricht je een bijzondere manoeuvre en moet je alle weggebruikers — inclusief voetgangers — voor laten gaan.'],
        ['Geldt "rechts gaat voor" ook voor voetgangers?', 'Nee, op een gelijkwaardig kruispunt geldt "bestuurders van rechts gaan voor". Voetgangers hebben wél voorrang op een zebrapad, bij een uitrit en wanneer jij afslaat terwijl zij rechtdoor gaan op dezelfde weg.'],
      ],
    },
    tr: {
      title: 'CBR Tehlike Algılama ve Hollanda Kavşak Öncelik Kuralları (Voorrang)',
      metaTitle: 'Hollanda Geçiş Üstünlüğü (Voorrang) ve CBR Tehlike Algılama Rehberi | ExamTheorie',
      description: 'Hollanda CBR ehliyet sınavı için geçiş üstünlüğü (RVV 1990) ve animasyonlu tehlike algılama kuralları: eşit kavşaklarda tramvay ve bisikletli önceliği, haaientanden, dönüş kuralı ve uitrit.',
      lead: 'CBR teori sınavında adayların yaptığı hataların yaklaşık yarısı kavşak önceliği (voorrang) ve tehlike algılama sorularından kaynaklanır. Bu 4 adımlı Hollanda öncelik hiyerarşisiyle tüm kavşak sorularını hatasız çözebilirsiniz.',
      body: `
        <h2>1. Hollanda Trafiğinde 4 Kademeli Öncelik Hiyerarşisi</h2>
        <p>Bir kavşakta birden fazla kural çakışıyorsa her zaman yukarıdan aşağıya şu sıra uygulanır:</p>
        <ol>
          <li><strong>Yetkili trafik görevlisi / polis talimatları</strong> — kırmızı ışık dahil her şeyin üstündedir.</li>
          <li><strong>Çalışan trafik ışıkları</strong> — kavşaktaki levhaların ve yerdeki köpek dişlerinin üstündedir.</li>
          <li><strong>Trafik levhaları ve yol çizgileri</strong> (B1, B6, STOP ve <em>haaientanden</em>) — genel sağdan gelme kuralının üstündedir.</li>
          <li><strong>Genel trafik kuralları (RVV 1990)</strong> — ışık ve levha olmayan eşit haklı kavşaklarda geçerlidir.</li>
        </ol>

        <h2>2. Eşit Haklı Kavşaklar (Gelijkwaardig Kruispunt), Bisikletliler ve Tramvay</h2>
        <ul>
          <li><strong>Sağdan gelen sürücüler önceliklidir:</strong> Hollanda yasasında <strong>bisikletliler, mopedler ve atlılar da "sürücü" (bestuurder)</strong> sayılır! Sağınızdan gelen bisikletliye mutlaka yol vermelisiniz. Yayalar ise sürücü sayılmaz.</li>
          <li><strong>Tramvay İstisnası:</strong> İşaretsiz eşit haklı kavşakta <strong>tramvay her zaman ilk geçer</strong> — soldan gelse de, sağdan gelse de, dönüş yapıyor olsa da! Tramvay yalnızca kendi önünde <em>haaientanden</em>, B6/STOP levhası veya kırmızı ışık varsa bekler.</li>
          <li><strong>Toprak / Kaplamasız Yol (Onverharde weg):</strong> Toprak yoldan asfalt yola çıkan sürücü herkese yol verir.</li>
        </ul>

        <h2>3. Dönüş Kuralı: "Aynı Yolda Düz Giden Önceliklidir" (RVV Madde 18)</h2>
        <div class="callout"><strong>Altın Dönüş Kuralı:</strong> Sağa veya sola dönerken <strong>aynı yolda düz devam eden TÜM yol kullanıcılarına (yayalar ve bisikletliler dahil!)</strong> yol vermelisiniz.</div>
        <ul>
          <li>Sağa dönerken sağınızdaki kırmızı bisiklet şeridinde düz giden bisikletli sizden önce geçer (sağ ayna + omuz üstü kör nokta <em>dode hoek</em> kontrolü şarttır).</li>
          <li>Bulunduğunuz caddenin kaldırımında sizinle aynı doğrultuda yürüyüp döneceğiniz yan sokağın ağzından karşıya geçen yayaya yol vermelisiniz. Ancak zaten yan sokakta yürüyen ve yaya geçidi olmayan bir yaya "aynı yolda" olmadığı için bu kurala girmez (tıpkı ürettiğimiz kavşak görselindeki senaryo!).</li>
          <li><strong>Kısa dönüş uzun dönüşten önceliklidir:</strong> Sağa dönen araç, karşıdan gelip aynı sokağa sola dönen araçtan önce geçer.</li>
        </ul>

        <h2>4. Çıkış Yapısı (Uitrit) ve Özel Manevralar (RVV Madde 54)</h2>
        <p>Kaldırımın kesintisiz devam ettiği bir otopark/sokak çıkışından (<strong>uitrit</strong>) çıkarken, park yerinden kalkarken, geri giderken, U dönüşü yaparken veya şerit değiştirirken <strong>kaldırımdaki yayalar dahil tüm yol kullanıcılarına</strong> yol vermek zorundasınız.</p>

        <h2>5. Animasyonlu CBR Tehlike Algılama İpuçları</h2>
        <ul>
          <li><strong>Derhal Fren (Remmen):</strong> Park etmiş minibüslerin arasından yola yuvarlanan top veya çocuk, kapısı açılan araç yanındaki bisikletli, ıslak zeminde öndeki fren lambaları.</li>
          <li><strong>Gazı Bırakma (Gas loslaten):</strong> Görüşü kapalı viraj, durakta bekleyen otobüs veya daralan sokak girişi.</li>
        </ul>
      `,
      faqs: [
        ['Hollanda’da tramvay her zaman öncelikli midir?', 'Levha ve çizgi olmayan eşit haklı kavşaklarda evet — tramvay soldan gelse veya dönse bile ilk geçer. Ancak tramvayın önünde haaientanden (köpek dişleri), B6/STOP levhası veya kırmızı ışık varsa tramvay yol vermek zorundadır.'],
        ['Uitrit (kesintisiz kaldırımlı çıkış) noktasından çıkarken yayalara yol verilir mi?', 'Evet! Uitrit çıkışı özel manevra (RVV Madde 54) sayıldığı için kaldırımda yürüyen yayalar dahil herkese yol vermelisiniz.'],
        ['Eşit kavşakta sağdan gelen bisikletliye yol vermek zorunlu mu?', 'Evet, Hollanda’da bisikletliler yasal olarak sürücü (bestuurder) kabul edilir ve eşit haklı kavşakta sağdan geldiklerinde önceliklidir.'],
      ],
    },
    ar: {
      title: 'تمييز المخاطر وقواعد الأولوية في هولندا (Voorrang) لامتحان CBR',
      metaTitle: 'قواعد الأولوية في هولندا (Voorrang) وتمييز المخاطر في امتحان CBR | ExamTheorie',
      description: 'أتقن قواعد الأولوية في التقاطعات الهولندية (RVV 1990) وأسئلة تمييز المخاطر المتحركة في امتحان CBR: الترام، الدراجات الهوائية، أسنان القرش (haaientanden)، مخارج الطرق والانعطاف.',
      lead: 'تشكّل أسئلة الأولوية في التقاطعات وتمييز المخاطر قرابة نصف الأخطاء في امتحان التيوري CBR. اتبع هذا التسلسل القانوني المكون من 4 خطوات لحل أي سؤال تقاطع بثقة تامة.',
      body: `
        <h2>1. التسلسل الهرمي للأولوية في المرور الهولندي</h2>
        <p>عند وجود أكثر من عنصر في التقاطع، يُطبَّق القانون الهولندي بالترتيب التالي من الأعلى إلى الأدنى:</p>
        <ol>
          <li><strong>تعليمات منظمي المرور المعتمدين والشرطة</strong> — تعلو فوق الإشارات الضوئية والشواخص.</li>
          <li><strong>الإشارات الضوئية العاملة</strong> — تعلو فوق لوحات الأولوية وأسنان القرش.</li>
          <li><strong>شواخص المرور وعلامات الطريق</strong> (مثل B1 وB6 وSTOP و<em>haaientanden</em>) — تعلو فوق القواعد العامة.</li>
          <li><strong>قواعد المرور العامة (RVV 1990)</strong> — تُطبَّق في التقاطعات المتكافئة الخالية من العلامات.</li>
        </ol>

        <h2>2. التقاطعات المتكافئة والدراجات الهوائية والترام</h2>
        <ul>
          <li><strong>الأولوية للسائق القادم من اليمين:</strong> تذكّر أن راكبي <strong>الدراجات الهوائية والدراجات الصغيرة والخيول يُصنَّفون قانونياً كسائقين (bestuurders)</strong> ولهم حق الأولوية عند قدومهم من اليمين، بينما المشاة ليسوا سائقين.</li>
          <li><strong>قاعدة الترام الخاصة:</strong> في التقاطع المتكافئ (بدون إشارات أو أسنان قرش) يمتلك <strong>الترام الأولوية دائماً</strong> سواء جاء من اليمين أو اليسار وحتى لو كان ينعطف! ولا يتنازل الترام عن الأولوية إلا إذا وُجدت أمامه أسنان قرش أو إشارة B6/STOP أو إشارة ضوئية حمراء.</li>
          <li><strong>الطريق غير المعبّد:</strong> السائق الخارج من طريق ترابي يجب أن يعطي الأولوية لجميع السائقين على الطريق المعبّد.</li>
        </ul>

        <h2>3. قاعدة الانعطاف: "المستمر بخط مستقيم على نفس الطريق له الأولوية"</h2>
        <div class="callout"><strong>القاعدة الذهبية للانعطاف (المادة 18):</strong> عند الانعطاف يميناً أو يساراً يجب إعطاء الأولوية <strong>لجميع مستخدمي الطريق المستمرين بخط مستقيم على نفس الطريق — بمن فيهم المشاة والدراجات!</strong></div>
        <ul>
          <li>عند الانعطاف يميناً بوجود دراجة تسير بخط مستقيم في المسار الأحمر بجانبك، تمر الدراجة أولاً (تحقق دائماً من المرآة والنقطة العمياء <em>dode hoek</em>).</li>
          <li>الانعطاف القصير (يميناً) يسبق الانعطاف الطويل (يساراً) للسيارة القادمة من المقابل.</li>
        </ul>

        <h2>4. مخارج الكراجات والأرصفة المستمرة (Uitrit) والمناورات الخاصة</h2>
        <p>عند الخروج من مخرج يتميز باستمرار الرصيف (<strong>uitrit</strong>)، أو الانطلاق من التوقف، أو الرجوع للخلف، أو الدوران للخلف، أو تغيير المسار، يجب إعطاء الأولوية <strong>لجميع مستخدمي الطريق بما في ذلك المشاة</strong>.</p>
      `,
      faqs: [
        ['متى يجب على الترام إعطاء الأولوية في هولندا؟', 'يفقد الترام أولويته فقط إذا كان أمامه مثلثات أسنان القرش (haaientanden) أو إشارة B6 أو STOP أو إشارة ضوئية حمراء. أما في التقاطع المتكافئ فله الأولوية دائماً.'],
        ['هل يجب إعطاء الأولوية للمشاة عند الخروج من مخرج (Uitrit)؟', 'نعم، وفق المادة 54 من لائحة RVV يُعد الخروج من مخرج رصيف مستمر مناورة خاصة توجب إعطاء الأولوية لجميع مستخدمي الطريق بمن فيهم المشاة.'],
        ['هل للدراجة الهوائية القادمة من اليمين أولوية في تقاطع بدون إشارات؟', 'نعم بالتأكيد، لأن الدراجات الهوائية تُعد قانونياً من فئة السائقين (bestuurders).'],
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 4: EXCHANGING A FOREIGN DRIVING LICENCE IN NL (RDW 185 DAYS & CBR)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'exchange-foreign-driving-licence-netherlands',
    tag: 'RDW · 185 DAYS',
    en: {
      title: 'Exchanging a Foreign Driving Licence in the Netherlands (RDW) vs Taking the CBR Exam',
      metaTitle: 'Exchange Foreign Driving Licence Netherlands (RDW 185 Days & 30% Ruling) | ExamTheorie',
      description: 'Moving to the Netherlands with a foreign driving licence? Understand the RDW 185-day rule, EU vs non-EU exchange list, 30% ruling exception, and step-by-step CBR exam process.',
      lead: 'Whether you can drive in the Netherlands with your foreign licence or exchange it at the municipality (RDW) depends on where it was issued and whether you hold the 30% tax ruling. Here are the exact rules so you never get caught driving uninsured after the 185-day deadline.',
      body: `
        <h2>1. The RDW 185-Day Rule for Non-EU Driving Licences</h2>
        <p>If you move to the Netherlands and register at a Dutch municipality (BRP) holding a valid driving licence issued <strong>outside the EU/EFTA</strong> (for example from Turkey, the US, India, Syria, Morocco, Brazil, South Africa, etc.), you may drive in the Netherlands with that licence for <strong>a maximum of 185 days (approx. 6 months)</strong> from your municipal registration date.</p>
        <div class="callout"><strong>Critical Warning:</strong> Once those 185 days expire, driving with an unexchanged non-EU licence is illegal and leaves you uninsured. Also note that while RDW processes an exchange application, your original licence is sent to RDW and you may not drive until you pick up your Dutch card.</div>

        <h2>2. Who Can Exchange Directly at RDW Without Taking a CBR Exam?</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Your Situation</th><th>Can You Exchange Directly?</th><th>What You Need to Do</th></tr></thead>
          <tbody>
            <tr><td><strong>EU / EFTA / EEA Licence</strong></td><td><strong>Yes</strong> (valid up to 15 years from issue)</td><td>Drive until expiry or exchange anytime at your Gemeente</td></tr>
            <tr><td><strong>30% Tax Ruling Holder (Expat Scheme)</strong></td><td><strong>Yes — from ANY country</strong></td><td>Apply at Gemeente with valid <em>Beschikking 30%-regeling</em> + CBR <em>Gezondheidsverklaring</em></td></tr>
            <tr><td><strong>Selected Bilateral RDW Countries</strong> (e.g. UK, Canada, Japan, Taiwan, Israel, Singapore — check RDW category list)</td><td><strong>Yes</strong> (specific categories)</td><td>Apply at Gemeente + CBR <em>Gezondheidsverklaring</em></td></tr>
            <tr><td><strong>All Other Non-EU Licences without 30% Ruling</strong> (e.g. Turkey, Syria, Iraq, USA, India, etc.)</td><td><strong>No direct exchange</strong></td><td>Must pass the <strong>CBR Car Theory Exam</strong> + <strong>CBR Practical Exam</strong></td></tr>
          </tbody>
        </table></div>

        <h2>3. Step-by-Step Roadmap If You Need to Take the CBR Exams</h2>
        <p>Good news: because you already know how to drive, getting your Dutch <em>Rijbewijs B</em> is much faster and cheaper than starting as a beginner — often requiring only a handful of familiarization lessons with a local driving school (<em>rijschool</em>) to master Dutch cyclist/mirror habits!</p>
        <ol>
          <li><strong>Start Preparing for the CBR Theory Exam Immediately:</strong> Don’t wait until day 180! Use ExamTheorie to study RVV priority rules and complete all 50 realistic CBR practice exams in English, Dutch, Turkish, or Arabic.</li>
          <li><strong>Book Your Theory Exam via Mijn CBR (DigiD):</strong> Standard Dutch (€50.50) or English (€57.00).</li>
          <li><strong>Submit Your CBR Health Declaration (Gezondheidsverklaring):</strong> Required before your driving school can book your practical exam.</li>
          <li><strong>Authorize a Rijschool & Pass the Practical Exam:</strong> Once passed, collect your Dutch driving licence at your municipality within 5 working days!</li>
        </ol>
      `,
      faqs: [
        ['How long can I drive in the Netherlands with a non-EU driving licence?', 'You can drive for up to 185 days from the date you first register as a resident in a Dutch municipality (BRP), provided your foreign licence remains valid.'],
        ['Can I exchange my non-EU driving licence if I have the 30% ruling?', 'Yes. With a valid Belastingdienst 30% ruling decision letter (Beschikking bewijsregel) and a CBR Gezondheidsverklaring, RDW allows you to exchange a valid driving licence from any country without taking a CBR exam.'],
        ['What happens if my country is not on the RDW list and I do not have the 30% ruling?', 'You cannot exchange your licence directly; you must pass the standard CBR car theory exam (50 questions) and the CBR practical driving test through a Dutch driving school.'],
      ],
    },
    nl: {
      title: 'Buitenlands Rijbewijs Omwisselen in Nederland (RDW 185 Dagen) of CBR Examen',
      metaTitle: 'Buitenlands Rijbewijs Omwisselen Nederland (RDW 185 Dagen & 30%-Regeling) | ExamTheorie',
      description: 'Verhuisd naar Nederland met een buitenlands rijbewijs? Lees alles over de RDW 185-dagenregeling, de 30%-regeling voor expats en wanneer je CBR theorie- en praktijkexamen moet doen.',
      lead: 'Of je een buitenlands rijbewijs bij de gemeente en RDW kunt omwisselen zonder examen hangt af van het land van afgifte én of je onder de 30%-regeling valt. Voorkom boetes na de 185-dagengrens met dit heldere overzicht.',
      body: `
        <h2>1. De 185-Dagenregeling na Inschrijving bij de Gemeente (BRP)</h2>
        <p>Schrijf je je in bij een Nederlandse gemeente met een geldig rijbewijs van <strong>buiten de EU/EVA</strong> (bijvoorbeeld uit Turkije, Marokko, Syrië, de VS, Suriname of India)? Dan mag je vanaf de datum van je BRP-inschrijving maximaal <strong>185 dagen (circa 6 maanden)</strong> met dat rijbewijs in Nederland rijden.</p>
        <div class="callout"><strong>Let op tijdens de aanvraag:</strong> Na 185 dagen mag je niet meer met een niet-omgewisseld rijbewijs rijden. Ook tijdens de beoordeling van een omwisselingsaanvraag bij de RDW lever je je originele pasje in en mag je tijdelijk niet zelf rijden totdat je het Nederlandse rijbewijs ophaalt.</div>

        <h2>2. Wie Mag Omwisselen bij de RDW en Wie Moet naar het CBR?</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Situatie</th><th>Direct Omwisselen Mogelijk?</th><th>Vereiste Stappen</th></tr></thead>
          <tbody>
            <tr><td><strong>EU / EVA Rijbewijs</strong></td><td><strong>Ja</strong> (tot 15 jaar na afgifte geldig)</td><td>Omwisselen via de gemeente wanneer gewenst of vóór verloopdatum</td></tr>
            <tr><td><strong>30%-Regeling (Kennismigrant / Expat)</strong></td><td><strong>Ja — uit elk land</strong></td><td>Aanvragen bij gemeente met geldige <em>Beschikking 30%-regeling</em> + CBR <em>Gezondheidsverklaring</em></td></tr>
            <tr><td><strong>Specifieke RDW-verdragslanden</strong> (o.a. VK, Canada, Japan, Israël, Taiwan)</td><td><strong>Ja</strong> (voor specifieke categorieën)</td><td>Aanvragen bij gemeente + CBR <em>Gezondheidsverklaring</em></td></tr>
            <tr><td><strong>Overige niet-EU landen zonder 30%-regeling</strong> (o.a. Turkije, Syrië, VS, India)</td><td><strong>Nee</strong></td><td>Regulier <strong>CBR auto theorie-examen</strong> + <strong>CBR praktijkexamen</strong> afleggen</td></tr>
          </tbody>
        </table></div>

        <h2>3. Stappenplan als je het CBR Examen Moet Afleggen</h2>
        <p>Omdat je al rijervaring hebt, hoef je meestal geen volledig lespakket van 40 lessen te volgen; enkele gerichte rijlessen voor het Nederlandse kijkgedrag (spiegels, fietspaden en dode hoek) volstaan vaak na het behalen van je theorie:</p>
        <ol>
          <li><strong>Start op tijd met CBR theorie oefenen</strong> (wacht niet tot dag 180) in het Nederlands, Engels, Turks of Arabisch op ExamTheorie.</li>
          <li><strong>Boek je theorie-examen via Mijn CBR</strong> met DigiD (€50,50 NL / €57,00 EN).</li>
          <li><strong>Vul je CBR Gezondheidsverklaring in</strong> op Mijn CBR en machtig een rijschool voor het praktijkexamen.</li>
        </ol>
      `,
      faqs: [
        ['Hoelang mag ik met een rijbewijs van buiten de EU in Nederland rijden?', 'Maximaal 185 dagen vanaf de dag dat je staat ingeschreven in een Nederlandse gemeente (BRP), mits het rijbewijs nog geldig is.'],
        ['Kan ik elk buitenlands rijbewijs omwisselen met de 30%-regeling?', 'Ja, met een geldige Beschikking 30%-regeling van de Belastingdienst en een CBR Gezondheidsverklaring kun je een geldig rijbewijs uit elk land omwisselen.'],
        ['Kan ik een Turks of Amerikaans rijbewijs zonder 30%-regeling omwisselen?', 'Nee, zonder de 30%-regeling staan deze landen niet op de RDW-omwissellijst voor rijbewijs B en moet je het CBR theorie- en praktijkexamen behalen.'],
      ],
    },
    tr: {
      title: 'Hollanda’da Yabancı ve Türk Ehliyeti Değişimi (RDW 185 Gün) ve CBR Süreci',
      metaTitle: 'Hollanda Türk Ehliyeti Geçerli mi? RDW 185 Gün Kuralı, %30 Vergi ve CBR | ExamTheorie',
      description: 'Hollanda’ya taşındığınızda Türk veya AB dışı ehliyetinizle kaç gün araç kullanabilirsiniz? RDW 185 gün kuralı, 30% ruling ile sınavsız ehliyet değişimi ve CBR sınav adımları.',
      lead: 'Hollanda’ya yerleştiğinizde mevcut ehliyetinizi sınavsız değiştirebilmeniz, ehliyetin verildiği ülkeye ve %30 vergi avantajına (30% ruling) sahip olup olmadığınıza bağlıdır. Ceza yememek ve 185 günlük süreyi kaçırmamak için tüm resmi kuralları özetledik.',
      body: `
        <h2>1. RDW 185 Gün Kuralı Nedir?</h2>
        <p>Hollanda’da bir belediyeye (Gemeente / BRP) ikamet kaydı yaptırdığınız andan itibaren, Türkiye dahil <strong>AB/EFTA dışı bir ülkeden alınmış geçerli ehliyetinizle en fazla 185 gün (yaklaşık 6 ay)</strong> araç kullanabilirsiniz. Turist olarak bulunanlarda bu sınır ikamet kaydı olmadığı sürece farklıdır; ancak oturum/ikamet kaydı başladığı gün 185 günlük sayaç çalışmaya başlar.</p>
        <div class="callout"><strong>Önemli Uyarı:</strong> 185. gün dolduğunda Hollanda ehliyetiniz yoksa trafiğe çıkmak yasa dışıdır ve olası kazada sigorta kapsamı dışında kalırsınız. Ayrıca belediyeye ehliyet değişim (omwisselen) başvurusu yaptığınızda eski ehliyetiniz RDW’ye gönderildiği için yeni kartınız çıkana kadar geçici olarak araç kullanamazsınız.</div>

        <h2>2. Kimler Sınavsız Ehliyet Değiştirebilir, Kimler CBR Sınavına Girmelidir?</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Durumunuz</th><th>Sınavsız Değişim (RDW) Var mı?</th><th>Yapmanız Gereken İşlem</th></tr></thead>
          <tbody>
            <tr><td><strong>AB / AEA Ülkesi Ehliyeti</strong></td><td><strong>Evet</strong> (verilişten itibaren 15 yıla kadar geçerli)</td><td>Süre dolmadan belediyeden doğrudan Hollanda ehliyetine çevrilir</td></tr>
            <tr><td><strong>30% Ruling (%30 Vergi Avantajı / Kennismigrant) Sahipleri</strong></td><td><strong>Evet — Türk ehliyeti dahil tüm ülkeler!</strong></td><td>Belastingdienst <em>Beschikking 30%-regeling</em> belgesi + CBR <em>Gezondheidsverklaring</em> ile belediyeye başvuru</td></tr>
            <tr><td><strong>RDW Anlaşmalı Seçili Ülkeler</strong> (İngiltere, Kanada, Japonya, İsrail vb.)</td><td><strong>Evet</strong></td><td>Belediye başvurusu + CBR sağlık beyanı</td></tr>
            <tr><td><strong>30% Ruling Olmadan Türk veya Diğer AB Dışı Ehliyet</strong> (Aile birleşimi, serbest meslek, öğrenci vb.)</td><td><strong>Hayır (Sınavsız çevrilemez)</strong></td><td><strong>CBR Teori Sınavı</strong> + <strong>CBR Direksiyon Sınavı</strong> ile Hollanda ehliyeti alınır</td></tr>
          </tbody>
        </table></div>

        <h2>3. CBR Sınavına Girecekler İçin En Hızlı Yol Haritası</h2>
        <p>Halihazırda araç kullanmayı bildiğiniz için sıfırdan başlayan bir aday gibi 35–40 ders almanıza gerek yoktur! Hollanda’daki sürücü kursları (<em>rijschool</em>) deneyimli sürücülere ayna kontrolü, kör nokta (<em>dode hoek</em>) ve bisikletli önceliği alışkanlıklarını kazandıran kısa hızlandırılmış pratik paketler sunar:</p>
        <ol>
          <li><strong>185 Gün Dolmadan Teoriye Hemen Başlayın:</strong> ExamTheorie üzerinde kuralları Türkçe öğrenip 50 gerçek formatlı CBR denemesini çözün.</li>
          <li><strong>DigiD ile Mijn CBR Üzerinden Randevu Alın:</strong> Standart Felemenkçe (€50,50) veya İngilizce (€57,00) sınava girin.</li>
          <li><strong>CBR Sağlık Beyanı (Gezondheidsverklaring) Doldurun:</strong> Pratik sınav kaydı için Mijn CBR’den doldurulur.</li>
          <li><strong>Sürücü Kursu Yetkilendirmesi ve Pratik Sınav:</strong> Sınavı geçtikten sonra 5 iş günü içinde belediyeden Hollanda B ehliyetinizi teslim alın!</li>
        </ol>
      `,
      faqs: [
        ['Hollanda’da Türk ehliyeti kaç ay geçerlidir?', 'Belediyeye (BRP) ikamet kaydı yaptırdığınız tarihten itibaren geçerli Türk ehliyetinizle en fazla 185 gün (yaklaşık 6 ay) araç kullanabilirsiniz.'],
        ['30% ruling (yüzde 30 vergi indirimi) varsa Türk ehliyetini sınavsız değiştirebilir miyim?', 'Evet! Belastingdienst tarafından verilen geçerli 30% ruling onay belgesi (Beschikking) ve CBR sağlık beyanı ile Türk ehliyetinizi sınava girmeden Hollanda ehliyetine çevirebilirsiniz.'],
        ['30% ruling yoksa Türk ehliyeti nasıl Hollanda ehliyetine çevrilir?', '30% ruling olmadan doğrudan değişim yapılamaz; önce 50 soruluk CBR teori sınavını, ardından bir sürücü kursu aracılığıyla CBR direksiyon sınavını geçmeniz gerekir.'],
      ],
    },
    ar: {
      title: 'استبدال رخصة القيادة الأجنبية في هولندا (RDW قاعدة 185 يوماً) وامتحان CBR',
      metaTitle: 'استبدال رخصة القيادة الأجنبية في هولندا RDW — قاعدة 185 يوماً وقاعدة 30% | ExamTheorie',
      description: 'كم يوماً يحق لك القيادة برخصتك الأجنبية في هولندا؟ تعرّف على قاعدة 185 يوماً لدى RDW، شروط الاستبدال بدون امتحان عبر قاعدة 30% الضريبية، وخطوات امتحان CBR.',
      lead: 'تعتمد إمكانية استبدال رخصة قيادتك الأجنبية في البلدية (RDW) دون امتحان على دولة الإصدار وما إذا كنت تتمتع بميزة الضرائب 30% (30%-regeling). إليك القواعد الرسمية الكاملة لتجنب الغرامات بعد انتهاء مهلة الـ 185 يوماً.',
      body: `
        <h2>1. ما هي قاعدة الـ 185 يوماً في هولندا؟</h2>
        <p>عند تسجيل عنوان سكنك في بلدية هولندية (BRP) وأنت تحمل رخصة قيادة سارية صادرة من <strong>خارج الاتحاد الأوروبي</strong> (مثل سوريا، العراق، مصر، المغرب، تركيا، الأردن أو الخليج)، يحق لك القيادة بها في هولندا لمدة <strong>أقصاها 185 يوماً (نحو 6 أشهر)</strong> من تاريخ تسجيلك في البلدية.</p>
        <div class="callout"><strong>تنبيه مهم:</strong> بعد مرور 185 يوماً تُصبح القيادة بالرخصة الأجنبية غير المستبدلة مخالفة قانونية وتفقد التغطية التأمينية. كما لا يُسمح لك بالقيادة مؤقتاً أثناء فترة فحص طلب الاستبدال لدى RDW حتى تستلم البطاقة الهولندية.</div>

        <h2>2. من يحق له الاستبدال المباشر ومن يجب عليه دخول امتحان CBR؟</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>الحالة</th><th>هل يمكن الاستبدال بدون امتحان؟</th><th>الإجراء المطلوب</th></tr></thead>
          <tbody>
            <tr><td><strong>رخص دول الاتحاد الأوروبي (EU/EFTA)</strong></td><td><strong>نعم</strong> (صالحة حتى 15 سنة من الإصدار)</td><td>تُستبدل مباشرة عبر البلدية</td></tr>
            <tr><td><strong>حاملو قرار ميزة 30% الضريبية (30%-regeling)</strong></td><td><strong>نعم — من أي دولة في العالم</strong></td><td>تقديم قرار الضرائب الرسمي + الإقرار الصحي <em>Gezondheidsverklaring</em> لدى البلدية</td></tr>
            <tr><td><strong>دول الاتفاقيات الخاصة مع RDW</strong> (مثل بريطانيا، كندا، اليابان)</td><td><strong>نعم</strong></td><td>طلب استبدال عبر البلدية + الإقرار الصحي</td></tr>
            <tr><td><strong>جميع الرخص العربية وغير الأوروبية الأخرى بدون قاعدة 30%</strong></td><td><strong>لا يوجد استبدال مباشر</strong></td><td>يجب اجتياز <strong>امتحان التيوري CBR</strong> ثم <strong>الامتحان العملي CBR</strong></td></tr>
          </tbody>
        </table></div>

        <h2>3. أسرع خطة للحصول على الرخصة الهولندية عبر CBR</h2>
        <p>بما أنك تجيد القيادة مسبقاً، فلن تحتاج إلى عشرات الدروس العملية؛ يكفيك عادةً عدد قليل من الحصص التدريبية للتأقلم مع أسلوب المراقبة الهولندي ومسارات الدراجات بعد اجتياز التيوري:</p>
        <ol>
          <li><strong>ابدأ التحضير لامتحان التيوري مبكراً</strong> قبل انتهاء مهلة الـ 185 يوماً عبر الاختبارات الـ 50 في منصة ExamTheorie بالعربية والهولندية والإنجليزية.</li>
          <li><strong>احجز موعد امتحان التيوري عبر Mijn CBR</strong> بحساب DigiD (50.50€ بالهولندية أو 57.00€ بالإنجليزية، أو مع مترجم).</li>
          <li><strong>قدّم الإقرار الصحي (Gezondheidsverklaring)</strong> عبر موقع CBR واحجز الامتحان العملي عن طريق مدرسة قيادة معتمدة.</li>
        </ol>
      `,
      faqs: [
        ['كم شهراً يمكنني القيادة برخصة أجنبية في هولندا؟', 'يحق لك القيادة لمدة 185 يوماً (حوالي 6 أشهر) من تاريخ أول تسجيل لك في البلدية الهولندية (BRP) بشرط سريان صلاحية الرخصة.'],
        ['هل يمكن استبدال الرخصة العربية بدون امتحان في حال وجود قاعدة 30%؟', 'نعم، إذا كنت تملك قرار 30%-regeling ساري المفعول من مصلحة الضرائب الهولندية مع الإقرار الصحي من CBR يمكنك استبدال رخصتك السارية من أي دولة دون امتحان.'],
        ['ماذا أفعل بعد انتهاء الـ 185 يوماً إذا لم أكن مشمولاً بقاعدة 30%؟', 'يجب التوقف عن القيادة بالرخصة الأجنبية واجتياز امتحان التيوري CBR (50 سؤالاً) ثم الامتحان العملي للحصول على الرخصة الهولندية.'],
      ],
    },
  },
];

const GUIDE_CSS = `
:root{--bg:#f8fafc;--card:#ffffff;--border:rgba(15,23,42,.09);--cyan:#0061ff;--orange:#ff6b00;--text:#0f172a;--muted:#475569}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Outfit','Poppins',system-ui,-apple-system,sans-serif;background:radial-gradient(circle at 12% 8%,rgba(0,97,255,.10),transparent 42%),radial-gradient(circle at 88% 12%,rgba(255,107,0,.11),transparent 40%),var(--bg);color:var(--text);line-height:1.75;min-height:100vh}
body[dir="rtl"]{font-family:'Noto Sans Arabic','Outfit','Poppins',system-ui,sans-serif}
a{color:var(--cyan)}
html.et-native-app a[href*="open=pricing"]{display:none!important}
.topbar{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);background:rgba(255,255,255,.88);border-bottom:1px solid var(--border);box-shadow:0 8px 24px rgba(15,23,42,.05);padding:12px 20px}
.topbar-inner{max-width:1040px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.logo{font-weight:900;font-size:21px;color:#0f172a;text-decoration:none;letter-spacing:-.03em}
.logo span{color:var(--cyan)}
.nav-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.lang-bar{display:inline-flex;gap:3px;padding:3px;border-radius:11px;background:#f1f5f9;border:1px solid rgba(15,23,42,.06)}
.lang-bar a{text-decoration:none;color:#64748b;font-size:12px;font-weight:700;padding:5px 10px;border-radius:8px;transition:all .15s}
.lang-bar a:hover{color:#0f172a}
.lang-bar a.active{background:#ffffff;color:#0f172a;box-shadow:0 2px 6px rgba(15,23,42,.08)}
.btn-top{text-decoration:none;font-size:12.5px;font-weight:800;padding:8px 15px;border-radius:11px;background:linear-gradient(135deg,#ff6b00,#ff8800);color:#fff;white-space:nowrap;box-shadow:0 6px 16px rgba(255,107,0,.26)}
.wrap{max-width:900px;margin:0 auto;padding:34px 20px 80px}
.crumbs{font-size:13px;color:#64748b;margin-bottom:18px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.crumbs a{color:#64748b;text-decoration:none;font-weight:500}
.crumbs a:hover{color:var(--cyan)}
.eyebrow{display:inline-block;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--cyan);background:rgba(0,97,255,.09);border:1px solid rgba(0,97,255,.2);padding:4px 12px;border-radius:999px;margin-bottom:14px}
h1{font-size:clamp(26px,4.4vw,42px);font-weight:900;line-height:1.15;letter-spacing:-.02em;margin-bottom:16px;color:#0b132b}
body[dir="rtl"] h1{letter-spacing:0;line-height:1.25}
.lead{font-size:clamp(15.5px,2vw,18px);color:var(--muted);margin-bottom:28px;line-height:1.7}
.article-body h2{font-size:clamp(20px,2.8vw,25px);font-weight:800;color:#0b132b;margin:38px 0 14px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.article-body p{margin-bottom:16px;color:#334155;font-size:15.5px}
.article-body ul,.article-body ol{margin:0 0 20px 22px;color:#334155;font-size:15.5px}
body[dir="rtl"] .article-body ul,body[dir="rtl"] .article-body ol{margin:0 22px 20px 0}
.article-body li{margin-bottom:10px}
.article-body strong{color:#0f172a}
.callout{background:#eff6ff;border:1px solid rgba(0,97,255,.22);border-inline-start:4px solid var(--cyan);border-radius:14px;padding:16px 20px;margin:22px 0;color:#1e293b;font-size:15px}
.table-wrap{overflow-x:auto;margin:20px 0 26px;border-radius:16px;border:1px solid var(--border);background:var(--card);box-shadow:0 10px 28px rgba(15,23,42,.05)}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{padding:13px 16px;text-align:start;border-bottom:1px solid #e2e8f0}
th{background:#f8fafc;color:#0f172a;font-weight:800}
td{color:#334155}
tr:last-child td{border-bottom:0}
.sign-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:22px 0 28px}
.sign-card{display:flex;align-items:center;gap:14px;padding:14px;border-radius:16px;background:var(--card);border:1px solid var(--border);box-shadow:0 8px 22px rgba(15,23,42,.04)}
.sign-icon{flex-shrink:0}
.sign-code{display:inline-block;font-size:11.5px;font-weight:800;color:var(--cyan);margin-bottom:3px}
.sign-card p{margin:0;font-size:13.5px;line-height:1.45;color:#475569}
.cta-box{margin:40px 0;padding:30px 28px;border-radius:24px;background:linear-gradient(135deg,#eff6ff 0%,#fff7ed 100%);border:1px solid rgba(0,97,255,.2);box-shadow:0 18px 44px rgba(15,23,42,.06);text-align:center}
.cta-box h2{font-size:23px;color:#0b132b;margin-bottom:10px;border:0;padding:0}
.cta-box p{color:#475569;max-width:640px;margin:0 auto 22px;font-size:15px}
.cta-btns{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.btn-p{text-decoration:none;padding:13px 24px;border-radius:14px;background:linear-gradient(135deg,#ff6b00,#ff8800);color:#fff;font-weight:800;font-size:14.5px;box-shadow:0 10px 24px rgba(255,107,0,.28)}
.btn-s{text-decoration:none;padding:13px 22px;border-radius:14px;background:#ffffff;border:1.5px solid #cbd5e1;color:#0f172a;font-weight:700;font-size:14px;box-shadow:0 4px 12px rgba(15,23,42,.04)}
.btn-s:hover{border-color:var(--cyan);color:var(--cyan)}
.faq-list{display:flex;flex-direction:column;gap:11px;margin-top:14px}
.faq-item{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 8px 22px rgba(15,23,42,.04)}
.faq-item summary{cursor:pointer;padding:16px 18px;font-weight:700;color:#0f172a;list-style:none;display:flex;justify-content:space-between;gap:12px}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item p{padding:12px 18px 16px;margin:0;color:#475569;font-size:14.5px;border-top:1px solid #f1f5f9}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:18px}
.g-card{display:flex;flex-direction:column;justify-content:space-between;gap:10px;padding:22px;border-radius:20px;background:var(--card);border:1px solid var(--border);box-shadow:0 12px 30px rgba(15,23,42,.05);text-decoration:none;color:#0f172a;transition:transform .2s,border-color .2s,box-shadow .2s}
.g-card:hover{transform:translateY(-3px);border-color:rgba(0,97,255,.35);box-shadow:0 18px 40px rgba(0,97,255,.11)}
.g-card h3{font-size:17.5px;font-weight:800;line-height:1.35;color:#0f172a}
.g-card p{font-size:13.5px;color:#475569;line-height:1.55}
.g-card span.more{font-size:13px;font-weight:800;color:#ff6b00}
footer{text-align:center;padding:30px 20px;border-top:1px solid #e2e8f0;color:#64748b;font-size:13px}
footer a{color:#475569;text-decoration:none;margin:0 8px;font-weight:500}
footer a:hover{color:var(--cyan)}
`;

function renderLangBar(activeLang, pathForLangFn) {
  return ['en', 'tr', 'nl', 'ar']
    .map(
      (l) =>
        `<a href="${pathForLangFn(l)}" class="${l === activeLang ? 'active' : ''}">${l.toUpperCase()}</a>`
    )
    .join('');
}

function buildGuidePages() {
  const generatedUrls = []; // For sitemap integration

  // 1. Build 16 Guide Articles (4 guides × 4 langs)
  for (const guide of GUIDES) {
    const urlMap = {
      en: `${BASE_URL}/guides/en/${guide.slug}`,
      nl: `${BASE_URL}/guides/nl/${guide.slug}`,
      tr: `${BASE_URL}/guides/tr/${guide.slug}`,
      ar: `${BASE_URL}/guides/ar/${guide.slug}`,
    };
    const hreflangTags = Object.entries(urlMap)
      .map(([c, u]) => `  <link rel="alternate" hreflang="${c}" href="${u}" />`)
      .concat([`  <link rel="alternate" hreflang="x-default" href="${urlMap.en}" />`])
      .join('\n');

    for (const lang of ['en', 'nl', 'tr', 'ar']) {
      const ui = UI_CHROME[lang];
      const data = guide[lang];
      const canonical = urlMap[lang];
      const hubUrl = `/guides/${lang}/`;
      const pricingUrl = lang === 'en' ? '/?open=pricing' : `/${lang}/?open=pricing`;

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: data.title,
            description: data.description,
            url: canonical,
            inLanguage: lang,
            datePublished: TODAY,
            dateModified: TODAY,
            isAccessibleForFree: true,
            image: OG_IMAGE,
            author: { '@type': 'Organization', name: 'ExamTheorie', url: `${BASE_URL}/` },
            publisher: {
              '@type': 'Organization',
              name: 'ExamTheorie',
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/web-app-manifest-512x512.png` },
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: data.faqs.map(([q, a]) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: ui.homeLabel, item: `${BASE_URL}${ui.homeUrl}` },
              { '@type': 'ListItem', position: 2, name: ui.hubLabel, item: `${BASE_URL}${hubUrl}` },
              { '@type': 'ListItem', position: 3, name: data.title, item: canonical },
            ],
          },
        ],
      });

      const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug);
      const relatedHtml = otherGuides
        .map(
          (g) => `
          <a class="g-card" href="/guides/${lang}/${g.slug}">
            <div>
              <span class="eyebrow" style="margin-bottom:8px">${esc(g.tag)}</span>
              <h3>${esc(g[lang].title)}</h3>
              <p style="margin-top:8px">${esc(g[lang].description)}</p>
            </div>
            <span class="more">${esc(ui.readMore)}</span>
          </a>`
        )
        .join('');

      const faqHtml = data.faqs
        .map(
          ([q, a], idx) => `
          <details class="faq-item"${idx === 0 ? ' open' : ''}>
            <summary>${esc(q)}</summary>
            <p>${esc(a)}</p>
          </details>`
        )
        .join('');

      const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${ui.dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(data.metaTitle)}</title>
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="description" content="${esc(data.description)}" />
  <link rel="canonical" href="${canonical}" />
${hreflangTags}
  <meta property="og:title" content="${esc(data.metaTitle)}" />
  <meta property="og:description" content="${esc(data.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="ExamTheorie" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="${ui.ogLocale}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(data.metaTitle)}" />
  <meta name="twitter:description" content="${esc(data.description)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <script type="application/ld+json">${jsonLd}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Poppins:wght@400;600;700;800;900${lang === 'ar' ? '&family=Noto+Sans+Arabic:wght@400;600;700;800' : ''}&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <style>${GUIDE_CSS}</style>
</head>
<body dir="${ui.dir}">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="logo" href="${ui.homeUrl}">Exam<span>Theorie</span></a>
      <div class="nav-actions">
        <nav class="lang-bar" aria-label="Language">${renderLangBar(lang, (l) => `/guides/${l}/${guide.slug}`)}</nav>
        <a class="btn-top" href="/deneme-${lang}">${esc(ui.freeBtn)}</a>
      </div>
    </div>
  </header>

  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="${ui.homeUrl}">${esc(ui.homeLabel)}</a>
      <span>›</span>
      <a href="${hubUrl}">${esc(ui.hubLabel)}</a>
      <span>›</span>
      <span>${esc(guide.tag)}</span>
    </nav>

    <article class="article-body">
      <span class="eyebrow">${esc(guide.tag)} · ${esc(ui.updated)}</span>
      <h1>${esc(data.title)}</h1>
      <p class="lead">${esc(data.lead)}</p>

      ${data.body}

      <div class="cta-box">
        <h2>${esc(ui.ctaHead)}</h2>
        <p>${esc(ui.ctaBody)}</p>
        <div class="cta-btns">
          <a class="btn-p" href="/deneme-${lang}">${esc(ui.ctaPrimary)}</a>
          <a class="btn-s" href="/theory/${lang}/traffic-rules">${esc(ui.ctaSecondary)}</a>
          <a class="btn-s" href="${pricingUrl}">${esc(ui.ctaPackages)}</a>
        </div>
      </div>

      <h2>${esc(ui.faqHead)}</h2>
      <div class="faq-list">${faqHtml}</div>

      <h2>${esc(ui.relatedHead)}</h2>
      <div class="cards-grid">${relatedHtml}</div>
    </article>
  </main>

  <footer>
    <p>© 2026 ExamTheorie · <a href="${ui.homeUrl}">${esc(ui.homeLabel)}</a> · <a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms-conditions/">Terms &amp; Conditions</a></p>
  </footer>
  <script src="/consent-manager.js?v=1" defer></script>
  <script src="/mobile-app-bridge.js?v=8" defer></script>
</body>
</html>`;

      const outFile = path.join(ROOT, 'guides', lang, `${guide.slug}.html`);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, html, 'utf8');
    }

    generatedUrls.push({
      priority: '0.85',
      changefreq: 'monthly',
      urls: urlMap,
      xDefault: urlMap.en,
    });
  }

  // 2. Build 4 Language Guide Hub Index Pages (/guides/{en,nl,tr,ar}/index.html)
  const hubUrlMap = {
    en: `${BASE_URL}/guides/en/`,
    nl: `${BASE_URL}/guides/nl/`,
    tr: `${BASE_URL}/guides/tr/`,
    ar: `${BASE_URL}/guides/ar/`,
  };
  const hubHreflangs = Object.entries(hubUrlMap)
    .map(([c, u]) => `  <link rel="alternate" hreflang="${c}" href="${u}" />`)
    .concat([`  <link rel="alternate" hreflang="x-default" href="${hubUrlMap.en}" />`])
    .join('\n');

  for (const lang of ['en', 'nl', 'tr', 'ar']) {
    const ui = UI_CHROME[lang];
    const canonical = hubUrlMap[lang];
    const pricingUrl = lang === 'en' ? '/?open=pricing' : `/${lang}/?open=pricing`;

    const cards = GUIDES.map(
      (g) => `
      <a class="g-card" href="/guides/${lang}/${g.slug}">
        <div>
          <span class="eyebrow" style="margin-bottom:8px">${esc(g.tag)}</span>
          <h3>${esc(g[lang].title)}</h3>
          <p style="margin-top:8px">${esc(g[lang].description)}</p>
        </div>
        <span class="more">${esc(ui.readMore)}</span>
      </a>`
    ).join('');

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: ui.hubTitle,
          description: ui.hubDesc,
          url: canonical,
          inLanguage: lang,
          hasPart: GUIDES.map((g) => ({
            '@type': 'Article',
            headline: g[lang].title,
            url: `${BASE_URL}/guides/${lang}/${g.slug}`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: ui.homeLabel, item: `${BASE_URL}${ui.homeUrl}` },
            { '@type': 'ListItem', position: 2, name: ui.hubLabel, item: canonical },
          ],
        },
      ],
    });

    const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${ui.dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(ui.hubMetaTitle)}</title>
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="description" content="${esc(ui.hubDesc)}" />
  <link rel="canonical" href="${canonical}" />
${hubHreflangs}
  <meta property="og:title" content="${esc(ui.hubMetaTitle)}" />
  <meta property="og:description" content="${esc(ui.hubDesc)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="ExamTheorie" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${ui.ogLocale}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(ui.hubMetaTitle)}" />
  <meta name="twitter:description" content="${esc(ui.hubDesc)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <script type="application/ld+json">${jsonLd}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Poppins:wght@400;600;700;800;900${lang === 'ar' ? '&family=Noto+Sans+Arabic:wght@400;600;700;800' : ''}&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <style>${GUIDE_CSS}</style>
</head>
<body dir="${ui.dir}">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="logo" href="${ui.homeUrl}">Exam<span>Theorie</span></a>
      <div class="nav-actions">
        <nav class="lang-bar" aria-label="Language">${renderLangBar(lang, (l) => `/guides/${l}/`)}</nav>
        <a class="btn-top" href="/deneme-${lang}">${esc(ui.freeBtn)}</a>
      </div>
    </div>
  </header>

  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="${ui.homeUrl}">${esc(ui.homeLabel)}</a>
      <span>›</span>
      <span>${esc(ui.hubLabel)}</span>
    </nav>

    <span class="eyebrow">${esc(ui.updated)}</span>
    <h1>${esc(ui.hubTitle)}</h1>
    <p class="lead">${esc(ui.hubDesc)}</p>

    <div class="cards-grid">${cards}</div>

    <div class="cta-box">
      <h2>${esc(ui.ctaHead)}</h2>
      <p>${esc(ui.ctaBody)}</p>
      <div class="cta-btns">
        <a class="btn-p" href="/deneme-${lang}">${esc(ui.ctaPrimary)}</a>
        <a class="btn-s" href="/theory/${lang}/traffic-rules">${esc(ui.ctaSecondary)}</a>
        <a class="btn-s" href="${pricingUrl}">${esc(ui.ctaPackages)}</a>
      </div>
    </div>
  </main>

  <footer>
    <p>© 2026 ExamTheorie · <a href="${ui.homeUrl}">${esc(ui.homeLabel)}</a> · <a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms-conditions/">Terms &amp; Conditions</a></p>
  </footer>
  <script src="/consent-manager.js?v=1" defer></script>
  <script src="/mobile-app-bridge.js?v=8" defer></script>
</body>
</html>`;

    const outHub = path.join(ROOT, 'guides', lang, 'index.html');
    fs.mkdirSync(path.dirname(outHub), { recursive: true });
    fs.writeFileSync(outHub, html, 'utf8');
  }

  generatedUrls.unshift({
    priority: '0.85',
    changefreq: 'weekly',
    urls: hubUrlMap,
    xDefault: hubUrlMap.en,
  });

  console.log(`✅ Built 20 multilingual SEO guide pages (4 hubs + 16 pillar guides)`);
  return generatedUrls;
}

module.exports = { buildGuidePages };

if (require.main === module) {
  buildGuidePages();
}
