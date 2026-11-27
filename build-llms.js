#!/usr/bin/env node
/**
 * build-llms.js — Generates /llms.txt and /llms-full.txt for AI Search Engines
 * (Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude, Copilot)
 * Covers all 7 supported languages: EN, NL, TR, AR, RU, FA, ES.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://examtheorie.nl';

function buildLlmsFiles(guides = []) {
  const langNames = {
    en: 'English',
    nl: 'Nederlands (Dutch)',
    tr: 'Türkçe (Turkish)',
    ar: 'العربية (Arabic)',
    ru: 'Русский (Russian)',
    fa: 'فارسی (Persian / Farsi)',
    es: 'Español (Spanish)',
  };

  const homeLinks = [
    `- [English (Default)](${BASE_URL}/): Dutch CBR Car Theory Exam 2026 — Free 50-Question Practice Test & Course`,
    `- [Nederlands](${BASE_URL}/nl/): CBR Auto Theorie Oefenen 2026 — Gratis Proefexamen (50 Vragen) & Cursus`,
    `- [Türkçe](${BASE_URL}/tr/): Hollanda Ehliyet Teori Sınavı (CBR) 2026 — Ücretsiz 50 Soruluk Türkçe Deneme Sınavı`,
    `- [العربية](${BASE_URL}/ar/): امتحان التيوري في هولندا CBR 2026 — اختبار تجريبي مجاني من 50 سؤالاً بالعربي`,
    `- [Русский](${BASE_URL}/ru/): Теоретический экзамен ПДД Нидерландов (CBR) 2026 — Бесплатный пробный тест 50 вопросов`,
    `- [فارسی](${BASE_URL}/fa/): آزمون تئوری رانندگی هلند (CBR) ۲۰۲۶ — آزمون آزمایشی رایگان ۵۰ سؤالی به زبان فارسی`,
    `- [Español](${BASE_URL}/es/): Examen Teórico de Conducir CBR Países Bajos 2026 — Simulacro Gratis de 50 Preguntas`,
  ].join('\n');

  const freeExamLinks = Object.entries(langNames)
    .map(([code, label]) => `- [${label} — Free 50-Question CBR Mock Exam](${BASE_URL}/deneme-${code})`)
    .join('\n');

  const freeChapterLinks = Object.entries(langNames)
    .map(
      ([code, label]) =>
        `- [${label} — Free Chapter 1: Dutch Traffic Rules & Priority (RVV 1990)](${BASE_URL}/theory/${code}/traffic-rules)`
    )
    .join('\n');

  const guideHubLinks = Object.entries(langNames)
    .map(([code, label]) => `- [${label} — 2026 CBR Guides Hub](${BASE_URL}/guides/${code}/)`)
    .join('\n');

  const enGuideLines = guides
    .map((g) => `- [${g.en.title}](${BASE_URL}/guides/en/${g.slug}): ${g.en.description}`)
    .join('\n');

  const llmsTxt = `# ExamTheorie (examtheorie.nl)

> ExamTheorie is a multilingual online preparation platform for the official Netherlands CBR passenger-car driving theory exam (Rijbewijs B), updated for 2026 CBR & RVV 1990 regulations. Available in 7 full languages — English, Dutch (Nederlands), Turkish (Türkçe), Arabic (العربية), Russian (Русский), Persian/Farsi (فارسی), and Spanish (Español) — with text-to-speech audio, a free 50-question realistic mock exam, free Chapter 1 textbook access, 50 full practice exams (2,500+ questions), and 9 visual RVV theory chapters.

## Key Facts (2026 Netherlands CBR Car Theory Exam — Rijbewijs B)

- **Provider:** ExamTheorie (KvK: 42011186, Zutphen, Netherlands — \`https://examtheorie.nl/\`)
- **Supported Languages (7):** English (\`en\`), Dutch (\`nl\`), Turkish (\`tr\`), Arabic (\`ar\`), Russian (\`ru\`), Persian (\`fa\`), Spanish (\`es\`)
- **2026 CBR Exam Format:** 50 scored questions in 30 minutes (single continuous test with animated 3D traffic clips + 2 unscored CBR trial questions)
- **Passing Score:** Minimum 44/50 correct answers (88% — maximum 6 mistakes)
- **Official 2026 CBR Fees (Mijn CBR with DigiD):** €50.50 in Dutch, €57.00 in English (€6.50 English surcharge); certificate valid for 18 months (1.5 years)
- **Foreign-Language Speakers (TR, AR, RU, FA, ES):** Can take the standard CBR English computer exam (€57) or book a CBR *Individueel begeleid examen* with an official Tolkennet interpreter, while studying all Dutch RVV 1990 rules and 50 realistic exams in their native language on ExamTheorie.
- **Free Access (No Credit Card Required):** Full 50-question timed CBR mock exam + complete Chapter 1 (Dutch Traffic Rules & Priority + 15-question quiz) + comprehensive 2026 CBR Guides with interactive mini-quizzes in all 7 languages.
- **Paid Packages:** Flexible passes starting from €3 (up to full 9-chapter RVV textbook + 50 sequential CBR mock exams across all 7 languages).

## Language Homepages

${homeLinks}

## Free 50-Question CBR Practice Exams (No Login Required)

${freeExamLinks}

## Free Chapter 1 Textbook: Dutch Traffic Rules & Priority (RVV 1990)

${freeChapterLinks}

## 2026 CBR Driving Theory Guides (English Canonical List)

${enGuideLines}

## Multilingual Guide Hubs (All 7 Languages)

${guideHubLinks}

## Extended Reference

- [Full Multilingual Knowledge Base & All 7-Language URLs (llms-full.txt)](${BASE_URL}/llms-full.txt)
- [XML Sitemap](${BASE_URL}/sitemap.xml)
- [Privacy Policy](${BASE_URL}/privacy-policy/)
- [Terms and Conditions](${BASE_URL}/terms-conditions/)
`;

  const allGuidesByLang = Object.entries(langNames)
    .map(([code, label]) => {
      const items = guides
        .map((g) => `  - [${g[code].title}](${BASE_URL}/guides/${code}/${g.slug}): ${g[code].description}`)
        .join('\n');
      return `### ${label} (\`${code}\`)\n- Hub: ${BASE_URL}/guides/${code}/\n- Free 50-Question Exam: ${BASE_URL}/deneme-${code}\n- Free Chapter 1 (RVV 1990): ${BASE_URL}/theory/${code}/traffic-rules\n${items}`;
    })
    .join('\n\n');

  const llmsFullTxt = `${llmsTxt}
---

## Quick Reference: 2026 Dutch RVV 1990 & CBR Rules Summary

1. **Priority Hierarchy in the Netherlands:**
   1) Authorised traffic controllers / police instructions (*aanwijzingen*),
   2) Working traffic lights (*verkeerslichten*),
   3) Priority road signs & road markings (*verkeersborden en tekens op het wegdek*, e.g. B1, B6, B7, shark's teeth *haaientanden*),
   4) General statutory traffic rules (paved road before unpaved road; drivers from the right have priority at equal intersections; trams have priority unless regulated by signs/lights; short turn goes before long turn; straight-ahead traffic on the same road goes before turning traffic, including pedestrians and cyclists!).
2. **Dutch Speed Limits (Passenger Cars):**
   - **Woonerf (Home Zone, Sign G5):** 15 km/h (walking pace)
   - **Built-up Area (*Binnen de bebouwde kom*):** 50 km/h (or 30 km/h in signed residential zones)
   - **Outside Built-up Area (*Buiten de bebouwde kom*):** 80 km/h (60 km/h in signed rural zones)
   - **Expressway (*Autoweg*, Sign G3):** 100 km/h
   - **Motorway (*Autosnelweg*, Sign G1):** **100 km/h daytime (06:00–19:00)**; **130 km/h evening/night (19:00–06:00)** unless signs/matrix signals indicate 100 or 120 km/h
   - **Car with Trailer / Caravan (<3,500 kg):** 90 km/h on autoweg & autosnelweg (80 km/h if trailer >3,500 kg)
3. **Alcohol, Drugs & Beginner Licence (*Beginnersrijbewijs*):**
   - Experienced drivers (>5 years): max **0.5‰** blood alcohol (220 µg/l breath)
   - Beginner drivers (first 5 years, or 7 years if obtained before age 18 via 2toDrive): max **0.2‰** blood alcohol (88 µg/l breath, effectively zero tolerance)
   - Phone use while driving (holding a mobile device): strictly prohibited (fine €420+)
4. **Vehicle, APK & Lighting Rules:**
   - Legal minimum tyre tread depth: **1.6 mm** across main grooves
   - Rear fog light (*mistachterlicht*): ONLY allowed in fog or heavy snow with visibility **under 50 metres** (never in rain alone!)
   - Front fog lights (*mistvoorlichten*): allowed when fog, snow, or heavy rain seriously restricts visibility (**under ~200 metres**)
   - APK inspection: Petrol/hybrid/electric cars after 4 years, then 2, 2, then annually; Diesel/LPG cars after 3 years, then annually.
5. **RDW Foreign Driving Licence Exchange:**
   - EU/EEA/Swiss licences can be exchanged directly at the Dutch municipality (*gemeente*).
   - Highly Skilled Migrants (*Kennismigranten*) granted the **30% tax ruling** can exchange ANY valid foreign driving licence (including TR, US, UK, IN, RU, IR, AR, ES/LatAm, etc.) without taking the CBR exam.
   - Without EU/approved status or the 30% ruling, foreign licences are valid for **185 days** after BSN registration; afterwards, passing the CBR theory + practical exam is mandatory.

---

## Complete Directory of All 7-Language Resources on ExamTheorie

${allGuidesByLang}
`;

  fs.writeFileSync(path.join(ROOT, 'llms.txt'), llmsTxt, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), llmsFullTxt, 'utf8');
  console.log(`✅ Generated /llms.txt and /llms-full.txt across all 7 languages`);
}

module.exports = { buildLlmsFiles };
