#!/usr/bin/env node
/**
 * build-seo.js — ExamTheorie Comprehensive Multilingual SEO Builder
 *
 * 1. Pre-renders & generates 4 dedicated, crawlable language homepages:
 *      - /index.html       (EN + x-default)
 *      - /nl/index.html    (NL)
 *      - /tr/index.html    (TR)
 *      - /ar/index.html    (AR, RTL)
 *    with localized <title>, <meta description>, canonical, reciprocal hreflang,
 *    OpenGraph + og:image, Twitter Cards, and Schema.org @graph JSON-LD
 *    (WebSite, EducationalOrganization, Course, FAQPage).
 * 2. Optimizes the 4 public Free Practice Exam pages (/deneme-{en,nl,tr,ar})
 *    and 4 public Chapter 1 Theory pages (/theory/{en,nl,tr,ar}/traffic-rules)
 *    with clean extensionless canonicals, hreflang, meta descriptions, and JSON-LD.
 * 3. Fixes broken canonicals/hreflangs on /privacy-policy/ and /terms-conditions/.
 * 4. Marks gated/auth-guarded/test/inactive pages as noindex, nofollow (preventing
 *    Google Soft-404 penalties) and strips dead/mixed-content moatads.com scripts.
 * 5. Generates a clean, reciprocal-hreflang sitemap.xml and robots.txt.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.cwd();
const BASE_URL = 'https://examtheorie.nl';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const TODAY = '2026-11-25';
const ALL_LANGS = ['en', 'nl', 'tr', 'ar', 'ru', 'fa', 'es'];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

const HOME_META = {
  en: {
    lang: 'en',
    dir: 'ltr',
    ogLocale: 'en_US',
    urlPath: '/',
    title: 'Dutch CBR Driving Theory Exam 2026 — Free 50-Question Practice Test | ExamTheorie',
    description:
      'Pass your 2026 Netherlands CBR car theory exam (Rijbewijs B) in 7 languages (EN, NL, TR, AR, RU, FA, ES). Try a free 50-question CBR mock test + Chapter 1 traffic rules today.',
    courseName: 'Dutch CBR Car Driving Theory Course & 50 Practice Exams (Rijbewijs B)',
  },
  nl: {
    lang: 'nl',
    dir: 'ltr',
    ogLocale: 'nl_NL',
    urlPath: '/nl/',
    title: 'CBR Auto Theorie Oefenen 2026 — Gratis Proefexamen (50 Vragen) | ExamTheorie',
    description:
      'Slaag in één keer voor je CBR auto theorie-examen (Rijbewijs B) in 2026. Oefen gratis een volledig CBR proefexamen van 50 vragen + Hoofdstuk 1 verkeersregels in 7 talen (NL, EN, TR, AR, RU, FA & ES).',
    courseName: 'CBR Auto Theorie Cursus & 50 Oefenexamens (Rijbewijs B)',
  },
  tr: {
    lang: 'tr',
    dir: 'ltr',
    ogLocale: 'tr_TR',
    urlPath: '/tr/',
    title: 'Hollanda Ehliyet Teori Sınavı (CBR) 2026 — Ücretsiz Türkçe Deneme Sınavı | ExamTheorie',
    description:
      '2026 güncel Hollanda CBR B sınıfı ehliyet teori sınavına Türkçe ve 7 dilde (TR, NL, EN, AR, RU, FA, ES) hazırlanın. 50 soruluk ücretsiz CBR deneme sınavını ve 1. bölümü hemen çözün!',
    courseName: 'Hollanda CBR B Ehliyet Teori Eğitimi ve 50 Deneme Sınavı',
  },
  ar: {
    lang: 'ar',
    dir: 'rtl',
    ogLocale: 'ar_AR',
    urlPath: '/ar/',
    title: 'امتحان التيوري في هولندا CBR 2026 — اختبار تجريبي مجاني بالعربي | ExamTheorie',
    description:
      'استعد لامتحان نظرية القيادة الهولندي CBR (الفئة B) لعام 2026 بـ 7 لغات (العربية، الهولندية، الإنجليزية، التركية، الروسية، الفارسية والإسبانية). ابدأ الآن باختبار CBR تجريبي مجاني من 50 سؤالاً.',
    courseName: 'دورة نظرية القيادة الهولندية CBR و50 اختباراً تجريبياً (الفئة B)',
  },
  ru: {
    lang: 'ru',
    dir: 'ltr',
    ogLocale: 'ru_RU',
    urlPath: '/ru/',
    title: 'Экзамен ПДД Нидерландов (CBR) 2026 — Бесплатный тест 50 вопросов на русском | ExamTheorie',
    description:
      'Сдайте теоретический экзамен по вождению CBR 2026 в Нидерландах (категория B) с первой попытки на русском и 7 языках. Пройдите бесплатный пробный тест CBR из 50 вопросов и Главу 1 ПДД!',
    courseName: 'Курс теории вождения CBR Нидерландов и 50 пробных экзаменов (Rijbewijs B)',
  },
  fa: {
    lang: 'fa',
    dir: 'rtl',
    ogLocale: 'fa_IR',
    urlPath: '/fa/',
    title: 'آزمون تئوری رانندگی هلند (CBR) ۲۰۲۶ — آزمون آزمایشی رایگان فارسی | ExamTheorie',
    description:
      'قبولی در اولین تلاش در آزمون تئوری گواهینامه رانندگی هلند CBR 2026 (پایه B) به زبان فارسی و ۷ زبان. همین امروز آزمون آزمایشی رایگان ۵۰ سؤالی CBR و فصل ۱ قوانین را شروع کنید!',
    courseName: 'دوره تئوری رانندگی هلند CBR و ۵۰ آزمون آزمایشی (Rijbewijs B)',
  },
  es: {
    lang: 'es',
    dir: 'ltr',
    ogLocale: 'es_ES',
    urlPath: '/es/',
    title: 'Examen Teórico de Conducir CBR Países Bajos 2026 — Test Gratis en Español | ExamTheorie',
    description:
      'Aprueba tu examen teórico de conducir CBR 2026 en los Países Bajos (Rijbewijs B) a la primera en español y 7 idiomas. Haz gratis un examen de prueba CBR de 50 preguntas + Capítulo 1 hoy.',
    courseName: 'Curso Teórico de Conducir CBR Países Bajos y 50 Exámenes de Práctica (Rijbewijs B)',
  },
};

const DENEME_META = {
  en: {
    file: 'deneme-en.html',
    url: `${BASE_URL}/deneme-en`,
    homeUrl: `${BASE_URL}/`,
    homeLabel: 'Home',
    ogLocale: 'en_US',
    title: 'Free Dutch CBR Car Theory Practice Exam 2026 (50 Questions) | ExamTheorie',
    description:
      'Take a realistic, free 50-question, 30-minute Dutch CBR car theory practice test (Rijbewijs B) in English with pass/fail score (44/50) and detailed answer explanations.',
  },
  nl: {
    file: 'deneme-nl.html',
    url: `${BASE_URL}/deneme-nl`,
    homeUrl: `${BASE_URL}/nl/`,
    homeLabel: 'Home',
    ogLocale: 'nl_NL',
    title: 'Gratis CBR Auto Theorie Proefexamen 2026 (50 Vragen) | ExamTheorie',
    description:
      'Maak direct een gratis CBR auto theorie oefenexamen van 50 vragen (30 minuten, slaaggrens 44/50) met directe foutanalyse volgens de nieuwste 2026 CBR-richtlijnen.',
  },
  tr: {
    file: 'deneme-tr.html',
    url: `${BASE_URL}/deneme-tr`,
    homeUrl: `${BASE_URL}/tr/`,
    homeLabel: 'Ana Sayfa',
    ogLocale: 'tr_TR',
    title: 'Ücretsiz Hollanda CBR Ehliyet Deneme Sınavı 2026 (50 Soru Türkçe) | ExamTheorie',
    description:
      '50 soruluk, 30 dakikalık gerçek formatlı ücretsiz Hollanda CBR B ehliyet teori deneme sınavını Türkçe çözün; 44/50 geçme barajı ve detaylı soru açıklamalarıyla kendinizi test edin.',
  },
  ar: {
    file: 'deneme-ar.html',
    url: `${BASE_URL}/deneme-ar`,
    homeUrl: `${BASE_URL}/ar/`,
    homeLabel: 'الرئيسية',
    ogLocale: 'ar_AR',
    title: 'اختبار التيوري الهولندي CBR التجريبي مجاناً 2026 (50 سؤالاً بالعربي) | ExamTheorie',
    description:
      'جرّب مجاناً اختبار نظرية القيادة الهولندي CBR الكامل المكون من 50 سؤالاً خلال 30 دقيقة باللغة العربية مع النتيجة الفورية وشرح مفصل لكل سؤال.',
  },
  ru: {
    file: 'deneme-ru.html',
    url: `${BASE_URL}/deneme-ru`,
    homeUrl: `${BASE_URL}/ru/`,
    homeLabel: 'Главная',
    ogLocale: 'ru_RU',
    title: 'Бесплатный пробный экзамен ПДД Нидерландов CBR 2026 (50 вопросов на русском) | ExamTheorie',
    description:
      'Пройдите реалистичный бесплатный пробный экзамен CBR (Rijbewijs B) из 50 вопросов за 30 минут на русском языке с проходным баллом 44/50 и подробным разбором ответов.',
  },
  fa: {
    file: 'deneme-fa.html',
    url: `${BASE_URL}/deneme-fa`,
    homeUrl: `${BASE_URL}/fa/`,
    homeLabel: 'صفحه اصلی',
    ogLocale: 'fa_IR',
    title: 'آزمون آزمایشی رایگان تئوری رانندگی هلند CBR ۲۰۲۶ (۵۰ سؤال فارسی) | ExamTheorie',
    description:
      'آزمون آزمایشی رایگان و واقعی ۵۰ سؤالی (۳۰ دقیقه) تئوری خودرو CBR هلند را به زبان فارسی با حد نصاب قبولی ۴۴ از ۵۰ و پاسخ‌نامه تشریحی کامل امتحان کنید.',
  },
  es: {
    file: 'deneme-es.html',
    url: `${BASE_URL}/deneme-es`,
    homeUrl: `${BASE_URL}/es/`,
    homeLabel: 'Inicio',
    ogLocale: 'es_ES',
    title: 'Examen Teórico CBR Países Bajos Gratis 2026 (50 Preguntas en Español) | ExamTheorie',
    description:
      'Realiza gratis un examen de práctica realista de 50 preguntas y 30 minutos para el teórico de coche CBR neerlandés (Rijbewijs B) en español con nota 44/50 y explicaciones detalladas.',
  },
};

const CHAPTER1_META = {
  en: {
    file: 'theory/en/traffic-rules.html',
    url: `${BASE_URL}/theory/en/traffic-rules`,
    homeUrl: `${BASE_URL}/`,
    homeLabel: 'Home',
    ogLocale: 'en_US',
    title: 'Dutch Traffic Rules & Priority (RVV 1990) — CBR Theory Chapter 1 | ExamTheorie',
    description:
      'Complete free guide to Dutch traffic rules (RVV 1990) for the CBR car theory exam: road position, overtaking, priority at intersections, trams, cyclists, speed limits, roundabouts & 15-question quiz.',
  },
  nl: {
    file: 'theory/nl/traffic-rules.html',
    url: `${BASE_URL}/theory/nl/traffic-rules`,
    homeUrl: `${BASE_URL}/nl/`,
    homeLabel: 'Home',
    ogLocale: 'nl_NL',
    title: 'Verkeersregels & Voorrang (RVV 1990) — CBR Auto Theorie Hoofdstuk 1 | ExamTheorie',
    description:
      'Gratis volledig overzicht van de Nederlandse verkeersregels (RVV 1990) voor je CBR auto theorie-examen: plaats op de weg, inhalen, voorrang, trams, rotondes, maximumsnelheden + gratis oefenquiz.',
  },
  tr: {
    file: 'theory/tr/traffic-rules.html',
    url: `${BASE_URL}/theory/tr/traffic-rules`,
    homeUrl: `${BASE_URL}/tr/`,
    homeLabel: 'Ana Sayfa',
    ogLocale: 'tr_TR',
    title: 'Hollanda Trafik Kuralları ve Geçiş Üstünlüğü (RVV 1990) — CBR Teori Bölüm 1 | ExamTheorie',
    description:
      'Hollanda CBR ehliyet sınavı için ücretsiz Türkçe Trafik Kuralları (RVV 1990) rehberi: kavşaklarda öncelik, tramvay ve bisiklet kuralları, hız sınırları, otoyollar, aydınlatma ve 15 soruluk konu testi.',
  },
  ar: {
    file: 'theory/ar/traffic-rules.html',
    url: `${BASE_URL}/theory/ar/traffic-rules`,
    homeUrl: `${BASE_URL}/ar/`,
    homeLabel: 'الرئيسية',
    ogLocale: 'ar_AR',
    title: 'قواعد المرور والأولوية في هولندا (RVV 1990) — نظري CBR الفصل الأول | ExamTheorie',
    description:
      'دليل شامل ومجاني باللغة العربية لقواعد المرور الهولندية (RVV 1990) لامتحان التيوري CBR: قواعد الأولوية في التقاطعات، الترام والدراجات، حدود السرعة، الطرق السريعة واختبار تدريبي من 15 سؤالاً.',
  },
  ru: {
    file: 'theory/ru/traffic-rules.html',
    url: `${BASE_URL}/theory/ru/traffic-rules`,
    homeUrl: `${BASE_URL}/ru/`,
    homeLabel: 'Главная',
    ogLocale: 'ru_RU',
    title: 'Правила дорожного движения и приоритета Нидерландов (RVV 1990) — Теория CBR Глава 1 | ExamTheorie',
    description:
      'Бесплатное полное руководство по правилам дорожного движения Нидерландов (RVV 1990) для экзамена CBR на русском: приоритет на перекрестках, трамваи, велосипедисты, скорость, круговое движение и тест из 15 вопросов.',
  },
  fa: {
    file: 'theory/fa/traffic-rules.html',
    url: `${BASE_URL}/theory/fa/traffic-rules`,
    homeUrl: `${BASE_URL}/fa/`,
    homeLabel: 'صفحه اصلی',
    ogLocale: 'fa_IR',
    title: 'قوانین راهنمایی و رانندگی و حق تقدم هلند (RVV 1990) — تئوری CBR فصل ۱ | ExamTheorie',
    description:
      'راهنمای کامل و رایگان قوانین راهنمایی و رانندگی هلند (RVV 1990) به زبان فارسی برای آزمون تئوری CBR: حق تقدم در تقاطع‌ها، تراموا و دوچرخه‌سواران، محدودیت سرعت، میدان‌ها و آزمون ۱۵ سؤالی.',
  },
  es: {
    file: 'theory/es/traffic-rules.html',
    url: `${BASE_URL}/theory/es/traffic-rules`,
    homeUrl: `${BASE_URL}/es/`,
    homeLabel: 'Inicio',
    ogLocale: 'es_ES',
    title: 'Normas de Tráfico y Prioridad en los Países Bajos (RVV 1990) — Teoría CBR Capítulo 1 | ExamTheorie',
    description:
      'Guía gratuita y completa de las normas de tráfico neerlandesas (RVV 1990) en español para el examen CBR: posición en la calzada, adelantamientos, prioridad, tranvías, ciclistas, límites de velocidad y test de 15 preguntas.',
  },
};

function buildHreflangTags(urlMap, xDefaultUrl, indent = '    ') {
  const lines = Object.entries(urlMap).map(
    ([code, href]) => `${indent}<link rel="alternate" hreflang="${code}" href="${href}" />`
  );
  lines.push(`${indent}<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`);
  return lines.join('\n');
}

function stripDeadThirdPartyScripts(html) {
  return html.replace(
    /[ \t]*<script[^>]+src=["']https?:\/\/js\.moatads\.com\/[^"']+["'][^>]*><\/script>\r?\n?/gi,
    ''
  );
}

// ── 1. Build 4 Pre-rendered Language Homepages ───────────────────────────────

function extractDictionaries(indexHtml) {
  const extractConst = (name) => {
    const startRe = new RegExp(`const\\s+${name}\\s*=\\s*\\{`);
    const match = startRe.exec(indexHtml);
    if (!match) throw new Error(`Could not find const ${name} in index.html`);
    let i = match.index + match[0].length - 1;
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let prev = '';
    for (; i < indexHtml.length; i++) {
      const ch = indexHtml[i];
      if (prev !== '\\') {
        if (!inDouble && !inTemplate && ch === "'") inSingle = !inSingle;
        else if (!inSingle && !inTemplate && ch === '"') inDouble = !inDouble;
        else if (!inSingle && !inDouble && ch === '`') inTemplate = !inTemplate;
      }
      if (!inSingle && !inDouble && !inTemplate) {
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) {
            const objCode = indexHtml.slice(match.index + match[0].length - 1, i + 1);
            return vm.runInNewContext(`(${objCode})`);
          }
        }
      }
      prev = ch === '\\' && prev === '\\' ? '' : ch;
    }
    throw new Error(`Unclosed brace in const ${name}`);
  };

  return {
    I18N: extractConst('I18N'),
    THEORY_I18N: extractConst('THEORY_I18N'),
    SEO_HUB_I18N: extractConst('SEO_HUB_I18N'),
  };
}

function prerenderMarkup(markup, lang, dicts) {
  const i18n = dicts.I18N[lang];
  const theory = dicts.THEORY_I18N[lang];
  const seo = dicts.SEO_HUB_I18N[lang];

  let out = markup;

  // Replace inner text of elements with data-i18n="key" (non-self-closing tags)
  out = out.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (full, openTag, tagName, key, inner, closeTag) => {
      if (i18n[key] === undefined) return full;
      // Preserve leading emoji prefix on mobile menu buttons if desired, or write clean text
      return `${openTag}${escapeHtml(i18n[key])}${closeTag}`;
    }
  );

  // Replace inner HTML of elements with data-i18n-html="key"
  out = out.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (full, openTag, tagName, key, inner, closeTag) => {
      if (i18n[key] === undefined) return full;
      return `${openTag}${i18n[key]}${closeTag}`;
    }
  );

  // Replace placeholder on inputs with data-i18n-ph="key"
  out = out.replace(
    /<input\b([^>]*\bdata-i18n-ph="([^"]+)"[^>]*)>/g,
    (full, attrs, key) => {
      if (i18n[key] === undefined) return full;
      const val = escapeAttr(i18n[key]);
      if (/\bplaceholder="[^"]*"/.test(attrs)) {
        return `<input${attrs.replace(/\bplaceholder="[^"]*"/, `placeholder="${val}"`)}>`;
      }
      return `<input${attrs} placeholder="${val}">`;
    }
  );

  // Replace inner text of elements with data-theory-i18n="key"
  out = out.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-theory-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (full, openTag, tagName, key, inner, closeTag) => {
      if (theory[key] === undefined) return full;
      return `${openTag}${escapeHtml(theory[key])}${closeTag}`;
    }
  );

  // Replace inner text of elements with data-seo-i18n="key"
  out = out.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-seo-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (full, openTag, tagName, key, inner, closeTag) => {
      if (seo[key] === undefined) return full;
      return `${openTag}${escapeHtml(seo[key])}${closeTag}`;
    }
  );

  // Update active class on .lang-opt links
  out = out.replace(
    /<a\s+class="lang-opt(?:\s+active)?"\s+href="([^"]+)"\s+data-lang="([^"]+)">/g,
    (full, href, dLang) =>
      `<a class="lang-opt${dLang === lang ? ' active' : ''}" href="${href}" data-lang="${dLang}">`
  );

  // Localize crawlable hrefs for hero button, free cards, featured chapter, and logo
  const freeExamHref = `/deneme-${lang}`;
  const freeChHref = `/theory/${lang}/traffic-rules`;
  const homeHref = HOME_META[lang].urlPath;

  out = out.replace(
    /(<a\s+class="logo"\s+href=")[^"]+(")/,
    `$1${homeHref}$2`
  );
  out = out.replace(
    /(id="heroStartLink"\s+href=")[^"]+(")/,
    `$1${freeExamHref}$2`
  );
  out = out.replace(
    /(id="seoFreeExamLink"\s+href=")[^"]+(")/,
    `$1${freeExamHref}$2`
  );
  out = out.replace(
    /(id="seoFreeChapterLink"\s+href=")[^"]+(")/,
    `$1${freeChHref}$2`
  );
  out = out.replace(
    /(id="featuredChapterCard"\s+href=")[^"]+(")/,
    `$1${freeChHref}$2`
  );
  out = out.replace(
    /(id="seoGuidesHubLink"\s+href=")[^"]+(")/,
    `$1/guides/${lang}/$2`
  );
  out = out.replace(
    /(id="seoGuide1Link"\s+href=")[^"]+(")/,
    `$1/guides/${lang}/cbr-theory-exam-2026$2`
  );
  out = out.replace(
    /(id="seoGuide2Link"\s+href=")[^"]+(")/,
    `$1/guides/${lang}/dutch-traffic-signs-rvv$2`
  );
  out = out.replace(
    /(id="seoGuide3Link"\s+href=")[^"]+(")/,
    `$1/guides/${lang}/cbr-hazard-perception-priority$2`
  );
  out = out.replace(
    /(id="seoGuide4Link"\s+href=")[^"]+(")/,
    `$1/guides/${lang}/exchange-foreign-driving-licence-netherlands$2`
  );

  // Localize Sign In buttons in static HTML
  out = out.replace(
    /(id="signinBtn"[^>]*>)[^<]*(<\/button>)/,
    `$1${escapeHtml(i18n.nav_signin)}$2`
  );
  out = out.replace(
    /(id="mobSigninBtn"[^>]*>)[^<]*(<\/button>)/,
    `$1${escapeHtml(i18n.nav_signin)}$2`
  );

  return out;
}

function buildHomeJsonLd(lang, meta, seoDict) {
  const canonical = `${BASE_URL}${meta.urlPath}`;
  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    '@type': 'Question',
    name: seoDict[`faq${n}_q`],
    acceptedAnswer: {
      '@type': 'Answer',
      text: seoDict[`faq${n}_a`],
    },
  }));

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${BASE_URL}/#organization`,
        name: 'ExamTheorie',
        url: `${BASE_URL}/`,
        logo: `${BASE_URL}/web-app-manifest-512x512.png`,
        image: OG_IMAGE,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: 'ExamTheorie',
        inLanguage: ['nl', 'en', 'tr', 'ar', 'ru', 'fa', 'es'],
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
      {
        '@type': 'Course',
        '@id': `${canonical}#course`,
        name: meta.courseName,
        description: meta.description,
        url: canonical,
        inLanguage: lang,
        provider: { '@id': `${BASE_URL}/#organization` },
        availableLanguage: ['nl', 'en', 'tr', 'ar', 'ru', 'fa', 'es'],
        offers: [
          {
            '@type': 'Offer',
            name: 'Free CBR Practice Exam & Chapter 1',
            price: '0',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/deneme-${lang}`,
          },
          {
            '@type': 'Offer',
            name: 'Daily CBR Access (from 1 day)',
            price: '3.00',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: canonical,
          },
          {
            '@type': 'Offer',
            name: '30-Day Premium CBR Pass',
            price: '24.99',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: canonical,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqs,
      },
    ],
  };

  return JSON.stringify(graph);
}

function buildHomeSeoHead(lang) {
  const meta = HOME_META[lang];
  const canonical = `${BASE_URL}${meta.urlPath}`;
  const urlMap = {
    en: `${BASE_URL}/`,
    nl: `${BASE_URL}/nl/`,
    tr: `${BASE_URL}/tr/`,
    ar: `${BASE_URL}/ar/`,
    ru: `${BASE_URL}/ru/`,
    fa: `${BASE_URL}/fa/`,
    es: `${BASE_URL}/es/`,
  };
  const hreflangs = buildHreflangTags(urlMap, `${BASE_URL}/`, '    ');

  return `    <!-- ═══ SEO (auto-generated by build-seo.js) ═══ -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <link rel="canonical" href="${canonical}" />
${hreflangs}
    <meta property="og:title" content="${escapeAttr(meta.title)}" />
    <meta property="og:description" content="${escapeAttr(meta.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="ExamTheorie" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${meta.ogLocale}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(meta.title)}" />
    <meta name="twitter:description" content="${escapeAttr(meta.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
    <!-- ═══ /SEO ═══ -->`;
}

function buildHomepages() {
  const indexPath = path.join(ROOT, 'index.html');
  let raw = fs.readFileSync(indexPath, 'utf8');

  // Fix www.examtheorie.nl inside terms_consent strings in JS as well
  raw = raw
    .replace(/https:\/\/www\.examtheorie\.nl\/terms-conditions/g, 'https://examtheorie.nl/terms-conditions/')
    .replace(/https:\/\/www\.examtheorie\.nl\/privacy-policy/g, 'https://examtheorie.nl/privacy-policy/');

  // Strip any previous JSON-LD block we added so runs are 100% idempotent
  raw = raw.replace(/\s*<script type="application\/ld\+json" id="et-jsonld">[\s\S]*?<\/script>/g, '');

  const dicts = extractDictionaries(raw);

  const scriptMarker = '<script>\n        /* ─── RESET BANNER i18n ─── */';
  const scriptMarkerCrlf = '<script>\r\n        /* ─── RESET BANNER i18n ─── */';
  let splitIdx = raw.indexOf(scriptMarker);
  if (splitIdx === -1) splitIdx = raw.indexOf(scriptMarkerCrlf);
  if (splitIdx === -1) throw new Error('Could not locate main inline <script> marker in index.html');

  const htmlBeforeScript = raw.slice(0, splitIdx);
  const scriptAndTail = raw.slice(splitIdx);

  for (const lang of ALL_LANGS) {
    const meta = HOME_META[lang];
    let headAndBody = prerenderMarkup(htmlBeforeScript, lang, dicts);

    // Update <html> tag attributes
    const pageLangAttr = lang === 'en' ? '' : ` data-page-lang="${lang}"`;
    const dirAttr = meta.dir === 'rtl' ? ' dir="rtl"' : '';
    headAndBody = headAndBody.replace(
      /<html\b[^>]*>/i,
      `<html lang="${meta.lang}"${dirAttr}${pageLangAttr}>`
    );

    // Update <body> class for RTL languages (Arabic & Persian)
    headAndBody = headAndBody.replace(
      /<body\b[^>]*>/i,
      meta.dir === 'rtl' ? '<body class="ar">' : '<body>'
    );

    // Update <title>
    headAndBody = headAndBody.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHtml(meta.title)}</title>`
    );

    // Update SEO head block + inject JSON-LD right after it
    const jsonLd = buildHomeJsonLd(lang, meta, dicts.SEO_HUB_I18N[lang]);
    const seoBlock = `${buildHomeSeoHead(lang)}\n    <script type="application/ld+json" id="et-jsonld">${jsonLd}</script>`;
    headAndBody = headAndBody.replace(
      /[ \t]*<!-- ═══ SEO \((?:auto-generated by [^\)]+)\) ═══ -->[\s\S]*?<!-- ═══ \/SEO ═══ -->/,
      seoBlock
    );

    const finalHtml = headAndBody + scriptAndTail;

    // Validate inline JS syntax before writing
    const mainScriptMatch = scriptAndTail.match(/^<script>([\s\S]*?)<\/script>/);
    if (!mainScriptMatch) throw new Error(`Inline script check failed for ${lang}`);
    new Function(mainScriptMatch[1]);

    const outPath = lang === 'en'
      ? path.join(ROOT, 'index.html')
      : path.join(ROOT, lang, 'index.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, finalHtml, 'utf8');
    console.log(`✅ Built homepage [${lang.toUpperCase()}]: ${path.relative(ROOT, outPath)}`);
  }
}

// ── 2. Optimize Public Free Practice Exam Pages (/deneme-*) ──────────────────

function updateDenemePages() {
  const urlMap = {
    en: DENEME_META.en.url,
    nl: DENEME_META.nl.url,
    tr: DENEME_META.tr.url,
    ar: DENEME_META.ar.url,
    ru: DENEME_META.ru.url,
    fa: DENEME_META.fa.url,
    es: DENEME_META.es.url,
  };
  const hreflangs = buildHreflangTags(urlMap, DENEME_META.en.url, '');

  for (const [lang, meta] of Object.entries(DENEME_META)) {
    const fp = path.join(ROOT, meta.file);
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    html = stripDeadThirdPartyScripts(html);
    html = html.replace(/\s*<script type="application\/ld\+json" id="et-jsonld">[\s\S]*?<\/script>/g, '');

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Quiz',
          name: meta.title,
          description: meta.description,
          url: meta.url,
          inLanguage: lang,
          educationalAlignment: {
            '@type': 'AlignmentObject',
            alignmentType: 'educationalSubject',
            targetName: 'CBR Rijbewijs B Theorie-examen',
          },
          provider: {
            '@type': 'EducationalOrganization',
            name: 'ExamTheorie',
            url: `${BASE_URL}/`,
          },
          isAccessibleForFree: true,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: meta.homeLabel, item: meta.homeUrl },
            { '@type': 'ListItem', position: 2, name: meta.title, item: meta.url },
          ],
        },
      ],
    });

    const newHeadStart = `<head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport"/><title>${escapeHtml(meta.title)}</title>
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="description" content="${escapeAttr(meta.description)}" />
<link rel="canonical" href="${meta.url}" />
${hreflangs}
<meta property="og:title" content="${escapeAttr(meta.title)}" />
<meta property="og:description" content="${escapeAttr(meta.description)}" />
<meta property="og:url" content="${meta.url}" />
<meta property="og:site_name" content="ExamTheorie" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="${meta.ogLocale}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeAttr(meta.title)}" />
<meta name="twitter:description" content="${escapeAttr(meta.description)}" />
<meta name="twitter:image" content="${OG_IMAGE}" />
<script type="application/ld+json" id="et-jsonld">${jsonLd}</script>`;

    html = html.replace(
      /<head>[\s\S]*?(?=<style id="exam-design">)/,
      newHeadStart
    );

    // Upgrade generic alt="Resim" / alt="Soru Resmi" & add lazy loading for hidden questions (2..50)
    const qPrefixMap = {
      en: 'CBR Practice Question',
      nl: 'CBR Oefenvraag',
      tr: 'CBR Deneme Sorusu',
      ar: 'سؤال CBR التدريبي',
      ru: 'Практический вопрос CBR',
      fa: 'سؤال آزمایشی CBR',
      es: 'Pregunta de práctica CBR',
    };
    const qPrefix = qPrefixMap[lang] || 'CBR Question';

    html = html.replace(
      /'<img src="' \+ soru\.resim \+ '" alt="[^"]*">'/g,
      `'<img src="' + soru.resim + '" alt="${qPrefix} ' + (soruIndex + 1) + '" decoding="async">'`
    );

    html = html.replace(
      /`<img src="\$\{question\.resim\}" alt="(?:Resim|CBR[^"]*)"[^>`]*><br>`/g,
      '`<img src="${question.resim}" alt="' +
        qPrefix +
        ' ${index + 1}: ${(question.soru || \'\').replace(/"/g, \'&quot;\').slice(0, 90)}" loading="${index === 0 ? \'eager\' : \'lazy\'}" decoding="async" class="question-image"><br>`'
    );

    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✅ Optimized free practice exam: ${meta.file}`);
  }
}

// ── 3. Optimize Public Chapter 1 Pages & Set noindex on Gated Theory Pages ───

function updateTheoryDirectory() {
  const ch1UrlMap = {
    en: CHAPTER1_META.en.url,
    nl: CHAPTER1_META.nl.url,
    tr: CHAPTER1_META.tr.url,
    ar: CHAPTER1_META.ar.url,
    ru: CHAPTER1_META.ru.url,
    fa: CHAPTER1_META.fa.url,
    es: CHAPTER1_META.es.url,
  };
  const ch1Hreflangs = buildHreflangTags(ch1UrlMap, CHAPTER1_META.en.url, '    ');

  for (const [lang, meta] of Object.entries(CHAPTER1_META)) {
    const fp = path.join(ROOT, meta.file);
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    html = html.replace(/\s*<script type="application\/ld\+json" id="et-jsonld">[\s\S]*?<\/script>/g, '');

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: meta.title,
          description: meta.description,
          url: meta.url,
          inLanguage: lang,
          isAccessibleForFree: true,
          author: { '@type': 'Organization', name: 'ExamTheorie', url: `${BASE_URL}/` },
          publisher: {
            '@type': 'Organization',
            name: 'ExamTheorie',
            logo: { '@type': 'ImageObject', url: `${BASE_URL}/web-app-manifest-512x512.png` },
          },
          image: OG_IMAGE,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: meta.homeLabel, item: meta.homeUrl },
            { '@type': 'ListItem', position: 2, name: meta.title, item: meta.url },
          ],
        },
      ],
    });

    const seoBlock = `    <!-- ═══ SEO (auto-generated by build-seo.js) ═══ -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="description" content="${escapeAttr(meta.description)}" />
    <link rel="canonical" href="${meta.url}" />
${ch1Hreflangs}
    <meta property="og:title" content="${escapeAttr(meta.title)}" />
    <meta property="og:description" content="${escapeAttr(meta.description)}" />
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:site_name" content="ExamTheorie" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="${meta.ogLocale}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(meta.title)}" />
    <meta name="twitter:description" content="${escapeAttr(meta.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <!-- ═══ /SEO ═══ -->
    <script type="application/ld+json" id="et-jsonld">${jsonLd}</script>`;

    html = html.replace(
      /[ \t]*<!-- ═══ SEO \((?:auto-generated by [^\)]+)\) ═══ -->[\s\S]*?<!-- ═══ \/SEO ═══ -->/,
      seoBlock
    );

    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✅ Optimized public Chapter 1: ${meta.file}`);
  }

  // Mark gated Chapters 2–6 & Reference Supplements as noindex, nofollow
  for (const lang of ALL_LANGS) {
    const dir = path.join(ROOT, 'theory', lang);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.endsWith('.html') || entry === 'traffic-rules.html') continue;
      const fp = path.join(dir, entry);
      let html = fs.readFileSync(fp, 'utf8');
      const noindexBlock = `    <!-- ═══ SEO (auto-generated by build-seo.js) ═══ -->
    <meta name="robots" content="noindex, nofollow" />
    <!-- ═══ /SEO ═══ -->`;
      if (/<!-- ═══ SEO \(auto-generated/.test(html)) {
        html = html.replace(
          /[ \t]*<!-- ═══ SEO \((?:auto-generated by [^\)]+)\) ═══ -->[\s\S]*?<!-- ═══ \/SEO ═══ -->/,
          noindexBlock
        );
      } else if (!/name=["']robots["']/i.test(html)) {
        html = html.replace(/<\/title>/i, `</title>\n${noindexBlock}`);
      }
      fs.writeFileSync(fp, html, 'utf8');
    }
  }
  console.log('✅ Marked 56 gated theory/* chapters as noindex, nofollow');
}

// ── 4. Fix Legal Pages & Clean Gated/Test/Inactive Root HTML Pages ───────────

function updateLegalPages() {
  const legals = [
    {
      file: 'privacy-policy/index.html',
      url: `${BASE_URL}/privacy-policy/`,
      title: 'Privacy Policy — ExamTheorie',
      desc: 'Privacy Policy and GDPR data protection information for ExamTheorie (examtheorie.nl).',
    },
    {
      file: 'terms-conditions/index.html',
      url: `${BASE_URL}/terms-conditions/`,
      title: 'Terms and Conditions — ExamTheorie',
      desc: 'Terms and Conditions for ExamTheorie (examtheorie.nl) CBR driving theory courses and practice exam packages.',
    },
  ];

  for (const item of legals) {
    const fp = path.join(ROOT, item.file);
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    html = html.replace(/href="https:\/\/www\.examtheorie\.nl\/?"/g, 'href="https://examtheorie.nl/"');
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${item.title}</title>`);
    const seoBlock = `    <!-- ═══ SEO (auto-generated by build-seo.js) ═══ -->
    <meta name="robots" content="index, follow" />
    <meta name="description" content="${escapeAttr(item.desc)}" />
    <link rel="canonical" href="${item.url}" />
    <meta property="og:title" content="${escapeAttr(item.title)}" />
    <meta property="og:description" content="${escapeAttr(item.desc)}" />
    <meta property="og:url" content="${item.url}" />
    <meta property="og:site_name" content="ExamTheorie" />
    <meta property="og:type" content="website" />
    <!-- ═══ /SEO ═══ -->`;

    if (/<!-- ═══ SEO \(auto-generated/.test(html)) {
      html = html.replace(
        /[ \t]*<!-- ═══ SEO \((?:auto-generated by [^\)]+)\) ═══ -->[\s\S]*?<!-- ═══ \/SEO ═══ -->/,
        seoBlock
      );
    } else {
      html = html.replace(/<\/title>/i, `</title>\n${seoBlock}`);
    }
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✅ Fixed legal page SEO & canonical: ${item.file}`);
  }
}

function cleanRootGatedAndTestPages() {
  const publicRootFiles = new Set([
    'index.html',
    'deneme-en.html',
    'deneme-nl.html',
    'deneme-tr.html',
    'deneme-ar.html',
    'deneme-ru.html',
    'deneme-fa.html',
    'deneme-es.html',
  ]);

  let noindexCount = 0;
  let moatCleanedCount = 0;

  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    if (publicRootFiles.has(entry.name)) continue;

    const fp = path.join(ROOT, entry.name);
    let html = fs.readFileSync(fp, 'utf8');
    const beforeMoat = html;
    html = stripDeadThirdPartyScripts(html);
    if (html !== beforeMoat) moatCleanedCount++;

    const noindexBlock = `    <!-- ═══ SEO (auto-generated by build-seo.js) ═══ -->
    <meta name="robots" content="noindex, nofollow" />
    <!-- ═══ /SEO ═══ -->`;

    if (/<!-- ═══ SEO \(auto-generated/.test(html)) {
      html = html.replace(
        /[ \t]*<!-- ═══ SEO \((?:auto-generated by [^\)]+)\) ═══ -->[\s\S]*?<!-- ═══ \/SEO ═══ -->/,
        noindexBlock
      );
    } else if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
      html = html.replace(
        /<meta\s+name=["']robots["'][^>]*>/gi,
        '<meta name="robots" content="noindex, nofollow" />'
      );
    } else if (/<\/title>/i.test(html)) {
      html = html.replace(/<\/title>/i, `</title><meta name="robots" content="noindex, nofollow" />`);
    } else if (/<head>/i.test(html)) {
      html = html.replace(/<head>/i, '<head><meta name="robots" content="noindex, nofollow" />');
    }

    fs.writeFileSync(fp, html, 'utf8');
    noindexCount++;
  }

  console.log(`✅ Cleaned ${noindexCount} gated/test/inactive root HTML files (noindex, nofollow)`);
  console.log(`✅ Removed dead moatads.com script tags from ${moatCleanedCount} test files`);
}

// ── 5. Generate Multilingual sitemap.xml & robots.txt ────────────────────────

function generateSitemapAndRobots(extraClusters = []) {
  const clusters = [
    {
      priority: '1.0',
      changefreq: 'weekly',
      urls: {
        en: `${BASE_URL}/`,
        nl: `${BASE_URL}/nl/`,
        tr: `${BASE_URL}/tr/`,
        ar: `${BASE_URL}/ar/`,
        ru: `${BASE_URL}/ru/`,
        fa: `${BASE_URL}/fa/`,
        es: `${BASE_URL}/es/`,
      },
      xDefault: `${BASE_URL}/`,
    },
    {
      priority: '0.9',
      changefreq: 'weekly',
      urls: {
        en: `${BASE_URL}/deneme-en`,
        nl: `${BASE_URL}/deneme-nl`,
        tr: `${BASE_URL}/deneme-tr`,
        ar: `${BASE_URL}/deneme-ar`,
        ru: `${BASE_URL}/deneme-ru`,
        fa: `${BASE_URL}/deneme-fa`,
        es: `${BASE_URL}/deneme-es`,
      },
      xDefault: `${BASE_URL}/deneme-en`,
    },
    {
      priority: '0.9',
      changefreq: 'monthly',
      urls: {
        en: `${BASE_URL}/theory/en/traffic-rules`,
        nl: `${BASE_URL}/theory/nl/traffic-rules`,
        tr: `${BASE_URL}/theory/tr/traffic-rules`,
        ar: `${BASE_URL}/theory/ar/traffic-rules`,
        ru: `${BASE_URL}/theory/ru/traffic-rules`,
        fa: `${BASE_URL}/theory/fa/traffic-rules`,
        es: `${BASE_URL}/theory/es/traffic-rules`,
      },
      xDefault: `${BASE_URL}/theory/en/traffic-rules`,
    },
    ...extraClusters,
  ];

  const entries = [];

  for (const cluster of clusters) {
    const xhtmlLinks = Object.entries(cluster.urls)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`)
      .concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${cluster.xDefault}" />`])
      .join('\n');

    for (const href of Object.values(cluster.urls)) {
      entries.push(`  <url>
    <loc>${href}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${cluster.changefreq}</changefreq>
    <priority>${cluster.priority}</priority>
${xhtmlLinks}
  </url>`);
    }
  }

  for (const legalUrl of [`${BASE_URL}/privacy-policy/`, `${BASE_URL}/terms-conditions/`]) {
    entries.push(`  <url>
    <loc>${legalUrl}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`✅ Generated multilingual sitemap.xml (${entries.length} clean canonical URLs) & robots.txt`);
}

// ── Run All Steps ────────────────────────────────────────────────────────────

const { buildGuidePages } = require('./build-guides.js');

buildHomepages();
updateDenemePages();
updateTheoryDirectory();
updateLegalPages();
cleanRootGatedAndTestPages();
const guideClusters = buildGuidePages();
generateSitemapAndRobots(guideClusters);
console.log('\n🎯 ExamTheorie SEO build completed successfully!');
