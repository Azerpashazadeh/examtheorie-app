/**
 * guides-extra.js — ExamTheorie Phase 3 SEO & Engagement Expansion
 * 1. 3 New High-Intent Pillar Guides × 7 Languages (= 21 new canonical pages)
 *    covering public summaries of Locked Chapters 3–9 + CBR Booking / Tolkennet / Faalangst / 2toDrive.
 * 2. Interactive 3-Question CBR Mini Practice Quiz Widget + Schema.org Quiz JSON-LD
 *    for ALL 7 Guides × 7 Languages (= 49 article pages).
 * 3. Public 9-Chapter Curriculum Overview section on all 7 Guide Hub pages.
 */

const MINI_QUIZ_UI = {
  en: {
    badge: '⚡ Quick 3-Question CBR Check',
    heading: 'Test Yourself on This Topic (Instant Feedback)',
    sub: 'Click an answer on each question below — just like the real 2026 CBR exam.',
    correct: '✓ Correct!',
    wrong: '✕ Not quite — Correct answer:',
    scoreLabel: 'Your score:',
    retry: '↻ Reset Mini Quiz',
    fullCta: 'Try Full 50-Question Free Exam →',
  },
  nl: {
    badge: '⚡ Snelle CBR Kennischeck (3 Vragen)',
    heading: 'Test Direct je Kennis over dit Onderwerp',
    sub: 'Klik op een antwoord bij elke vraag voor directe CBR-uitleg.',
    correct: '✓ Goed!',
    wrong: '✕ Helaas — Juiste antwoord:',
    scoreLabel: 'Je score:',
    retry: '↻ Opnieuw proberen',
    fullCta: 'Start Volledig Gratis Proefexamen (50 Vragen) →',
  },
  tr: {
    badge: '⚡ Hızlı 3 Soruluk CBR Mini Testi',
    heading: 'Bu Konuda Kendinizi Hemen Test Edin',
    sub: 'Aşağıdaki 3 gerçek CBR sorusunda şıklara tıklayın, doğru cevabı ve açıklamayı anında görün.',
    correct: '✓ Doğru!',
    wrong: '✕ Yanlış — Doğru cevap:',
    scoreLabel: 'Skorunuz:',
    retry: '↻ Mini Testi Sıfırla',
    fullCta: '50 Soruluk Ücretsiz Denemeye Geç →',
  },
  ar: {
    badge: '⚡ اختبار CBR سريع من 3 أسئلة',
    heading: 'اختبر معلوماتك فوراً في هذا الموضوع',
    sub: 'اضغط على الإجابة الصحيحة لكل سؤال للحصول على التقييم والشرح الفوري.',
    correct: '✓ إجابة صحيحة!',
    wrong: '✕ إجابة خاطئة — الصحيح هو:',
    scoreLabel: 'نتيجتك:',
    retry: '↻ إعادة الاختبار المصغر',
    fullCta: 'ابدأ الاختبار المجاني الكامل (50 سؤالاً) ←',
  },
  ru: {
    badge: '⚡ Быстрый мини-тест CBR (3 вопроса)',
    heading: 'Проверьте себя по этой теме прямо сейчас',
    sub: 'Нажмите на вариант ответа в каждом вопросе, чтобы мгновенно увидеть правильный ответ и разбор.',
    correct: '✓ Верно!',
    wrong: '✕ Неверно — Правильный ответ:',
    scoreLabel: 'Ваш результат:',
    retry: '↻ Сбросить мини-тест',
    fullCta: 'Пройти бесплатный экзамен из 50 вопросов →',
  },
  fa: {
    badge: '⚡ مینی‌آزمون سریع ۳ سؤالی CBR',
    heading: 'اطلاعات خود را در این مبحث همین حالا بسنجید',
    sub: 'روی گزینه مورد نظر در هر سؤال کلیک کنید تا پاسخ صحیح و توضیح آن را فوراً ببینید.',
    correct: '✓ کاملاً درست!',
    wrong: '✕ نادرست — پاسخ صحیح:',
    scoreLabel: 'امتیاز شما:',
    retry: '↻ شروع مجدد مینی‌آزمون',
    fullCta: 'شروع آزمون رایگان ۵۰ سؤالی ←',
  },
  es: {
    badge: '⚡ Mini Test Rápido CBR (3 Preguntas)',
    heading: 'Pon a Prueba lo Aprendido al Instante',
    sub: 'Haz clic en una respuesta en cada pregunta para ver la corrección inmediata.',
    correct: '✓ ¡Correcto!',
    wrong: '✕ Incorrecto — Respuesta correcta:',
    scoreLabel: 'Tu puntuación:',
    retry: '↻ Reiniciar mini test',
    fullCta: 'Hacer simulacro gratis de 50 preguntas →',
  },
};

const MINI_QUIZZES = {
  'cbr-theory-exam-2026': {
    en: [
      { q: 'How many scored questions must you answer correctly to pass the 2026 CBR car theory exam?', opts: ['At least 44 out of 50 (88%)', 'At least 35 out of 50 (70%)', 'At least 48 out of 50 (96%)'], ans: 0, exp: 'You need 44/50 correct answers (maximum 6 mistakes) within 30 minutes.' },
      { q: 'How long does your passed CBR car theory certificate remain valid?', opts: ['1.5 years (18 months)', '6 months', '5 years'], ans: 0, exp: 'A passed CBR theory certificate is valid for 18 months to pass your practical driving exam.' },
      { q: 'What is the official 2026 Mijn CBR fee for taking the car theory exam in English?', opts: ['€57.00 (€50.50 + €6.50 English surcharge)', '€50.50 with no surcharge', '€115.00'], ans: 0, exp: 'Booking directly via Mijn CBR with DigiD costs €50.50 in Dutch or €57.00 in English.' },
    ],
    nl: [
      { q: 'Hoeveel van de 50 vragen moet je minimaal goed hebben om te slagen voor het CBR auto theorie-examen in 2026?', opts: ['Minimaal 44 van de 50 (max. 6 fouten)', 'Minimaal 38 van de 50', 'Minimaal 48 van de 50'], ans: 0, exp: 'De slaaggrens bij het CBR is 44 goed uit 50 tellende vragen binnen 30 minuten.' },
      { q: 'Hoe lang blijft een behaald CBR theoriecertificaat voor de auto geldig?', opts: ['1,5 jaar (18 maanden)', '1 jaar', 'Onbeperkt'], ans: 0, exp: 'Je theoriecertificaat is 1,5 jaar (18 maanden) geldig voor je praktijkexamen.' },
      { q: 'Wat kost het standaard Nederlandstalige CBR auto theorie-examen in 2026 via Mijn CBR?', opts: ['€50,50 (€57,00 in het Engels)', '€25,00', '€95,00'], ans: 0, exp: 'Rechtstreeks reserveren via Mijn CBR met DigiD kost €50,50 in het Nederlands en €57,00 in het Engels.' },
    ],
    tr: [
      { q: '2026 Hollanda CBR otomobil teori sınavından geçmek için 50 sorudan en az kaçını doğru yapmalısınız?', opts: ['En az 44 doğru (en fazla 6 yanlış)', 'En az 35 doğru', 'En az 48 doğru'], ans: 0, exp: '50 puanlanan sorudan en az 44 doğru (%88 başarı) gerekir.' },
      { q: 'Kazandığınız CBR teori sınavı sertifikası ne kadar süre geçerlidir?', opts: ['1,5 yıl (18 ay)', '6 ay', '3 yıl'], ans: 0, exp: 'Teori belgeniz 18 ay geçerlidir; direksiyon sınavını bu sürede geçmelisiniz.' },
      { q: 'Mijn CBR üzerinden İngilizce otomobil teori sınavının 2026 resmi ücreti nedir?', opts: ['€57,00 (€50,50 taban + €6,50 İngilizce farkı)', '€50,50', '€110,00'], ans: 0, exp: 'DigiD ile doğrudan Mijn CBR üzerinden Felemenkçe €50,50, İngilizce €57,00 ödenir.' },
    ],
    ar: [
      { q: 'كم سؤالاً يجب الإجابة عنه بشكل صحيح من أصل 50 للنجاح في امتحان التيوري CBR لعام 2026؟', opts: ['44 سؤالاً على الأقل (حد أقصى 6 أخطاء)', '35 سؤالاً على الأقل', '48 سؤالاً على الأقل'], ans: 0, exp: 'يشترط النجاح تحقيق 44 إجابة صحيحة من 50 خلال 30 دقيقة.' },
      { q: 'ما هي مدة صلاحية شهادة امتحان النظري CBR بعد النجاح؟', opts: ['سنة ونصف (18 شهراً)', '6 أشهر فقط', '3 سنوات'], ans: 0, exp: 'تظل شهادة النظري صالحة لمدة 18 شهراً لإتمام الامتحان العملي.' },
      { q: 'كم تبلغ الرسوم الرسمية لامتحان CBR باللغة الإنجليزية عبر Mijn CBR في 2026؟', opts: ['57.00 يورو (50.50 + 6.50 رسوم الإنجليزية)', '50.50 يورو', '110.00 يورو'], ans: 0, exp: 'الحجز المباشر عبر Mijn CBR باستخدام DigiD يكلف 50.50 يورو بالهولندية و57.00 يورو بالإنجليزية.' },
    ],
    ru: [
      { q: 'Сколько правильных ответов из 50 нужно набрать для сдачи теоретического экзамена CBR в 2026 году?', opts: ['Минимум 44 из 50 (не более 6 ошибок)', 'Минимум 35 из 50', 'Минимум 48 из 50'], ans: 0, exp: 'Проходной балл составляет 44 из 50 зачетных вопросов за 30 минут.' },
      { q: 'Сколько времени действует сертификат о сдаче теории CBR?', opts: ['1,5 года (18 месяцев)', '6 месяцев', '3 года'], ans: 0, exp: 'Сертификат теории действителен 18 месяцев для сдачи практического экзамена.' },
      { q: 'Сколько стоит официальный экзамен CBR на английском языке через Mijn CBR в 2026 году?', opts: ['€57,00 (€50,50 + €6,50 доплата за английский)', '€50,50', '€110,00'], ans: 0, exp: 'При прямой записи через Mijn CBR с DigiD экзамен стоит €50,50 на нидерландском и €57,00 на английском.' },
    ],
    fa: [
      { q: 'برای قبولی در آزمون تئوری خودرو CBR در سال ۲۰۲۶ حداقل به چند پاسخ صحیح از ۵۰ سؤال نیاز دارید؟', opts: ['حداقل ۴۴ از ۵۰ (حداکثر ۶ غلط)', 'حداقل ۳۵ از ۵۰', 'حداقل ۴۸ از ۵۰'], ans: 0, exp: 'حد نصاب قبولی ۴۴ پاسخ درست از ۵۰ سؤال در مدت ۳۰ دقیقه است.' },
      { q: 'مدرک قبولی آزمون تئوری CBR تا چه مدت اعتبار دارد؟', opts: ['۱٫۵ سال (۱۸ ماه)', '۶ ماه', '۳ سال'], ans: 0, exp: 'گواهی تئوری به مدت ۱۸ ماه برای قبولی در آزمون عملی معتبر است.' },
      { q: 'هزینه رسمی آزمون تئوری CBR به زبان انگلیسی در سامانه Mijn CBR در سال ۲۰۲۶ چقدر است؟', opts: ['۵۷ یورو (۵۰٫۵۰ پایه + ۶٫۵۰ انگلیسی)', '۵۰٫۵۰ یورو', '۱۱۰ یورو'], ans: 0, exp: 'رزرو مستقیم با DigiD در Mijn CBR به زبان هلندی ۵۰٫۵۰ یورو و به انگلیسی ۵۷ یورو است.' },
    ],
    es: [
      { q: '¿Cuántas respuestas correctas sobre 50 necesitas para aprobar el examen teórico CBR en 2026?', opts: ['Al menos 44 de 50 (máximo 6 fallos)', 'Al menos 35 de 50', 'Al menos 48 de 50'], ans: 0, exp: 'Necesitas un mínimo de 44 aciertos de 50 preguntas puntuables en 30 minutos.' },
      { q: '¿Cuánto tiempo es válido el certificado teórico aprobado del CBR?', opts: ['1,5 años (18 meses)', '6 meses', '3 años'], ans: 0, exp: 'El aprobado teórico tiene una validez de 18 meses para superar el examen práctico.' },
      { q: '¿Cuál es la tasa oficial de Mijn CBR en 2026 para hacer el examen en inglés?', opts: ['57,00 € (50,50 € base + 6,50 € suplemento inglés)', '50,50 €', '110,00 €'], ans: 0, exp: 'Reservar directamente en Mijn CBR con DigiD cuesta 50,50 € en neerlandés y 57,00 € en inglés.' },
    ],
  },

  'dutch-traffic-signs-rvv': {
    en: [
      { q: 'What is the crucial legal difference between sign B6 (inverted triangle) and sign B7 (STOP)?', opts: ['B7 requires a full stop even if the road is clear; B6 requires giving way to crossing drivers', 'Both require a full stop at all times', 'B6 applies to pedestrians too'], ans: 0, exp: 'At B7 (STOP) your wheels must come to a complete halt; at B6 you yield to crossing drivers without stopping if clear.' },
      { q: 'Under sign E1 (No Parking), what are you still permitted to do?', opts: ['Stop briefly to let passengers board/alight or load/unload goods', 'Park for up to 15 minutes with hazard lights', 'Nothing — stopping is completely forbidden'], ans: 0, exp: 'E1 prohibits parking, whereas E2 (crossed X) prohibits both parking and stopping.' },
      { q: 'What is the maximum speed inside a Dutch Woonerf (Home Zone, sign G5)?', opts: ['15 km/h (walking pace)', '30 km/h', '50 km/h'], ans: 0, exp: 'Sign G5 sets a strict 15 km/h limit and parking is allowed only in spaces marked with a P.' },
    ],
    nl: [
      { q: 'Wat is het verschil tussen bord B6 (voorrang verlenen) en bord B7 (STOP)?', opts: ['Bij B7 moet je altijd volledig stoppen; bij B6 verleen je voorrang aan kruisende bestuurders', 'Bij beide borden moet je altijd stoppen', 'B6 geldt ook voor voetgangers'], ans: 0, exp: 'Bij B7 moet je altijd volledig tot stilstand komen, ook als er geen verkeer aankomt.' },
      { q: 'Wat mag je nog wél doen voorbij bord E1 (parkeerverbod)?', opts: ['Kort stilstaan om passagiers in/uit te laten stappen of goederen te laden/lossen', '10 minuten parkeren met alarmlichten', 'Helemaal niets, ook niet stilstaan'], ans: 0, exp: 'E1 verbiedt alleen parkeren; pas bij bord E2 (rood kruis) geldt een volledig stopverbod.' },
      { q: 'Wat is de maximumsnelheid in een erf (bord G5)?', opts: ['15 km/u (stapvoets)', '30 km/u', '50 km/u'], ans: 0, exp: 'In een erf geldt een maximumsnelheid van 15 km/u en parkeren mag alleen in P-vakken.' },
    ],
    tr: [
      { q: 'B6 (ters üçgen yol ver) ile B7 (STOP) levhası arasındaki temel fark nedir?', opts: ['B7’de yol boş olsa bile tam durmak zorunludur; B6’da kesişen sürücülere yol verilir', 'İkisinde de her zaman durulur', 'B6 yayalara da öncelik verir'], ans: 0, exp: 'B7 (STOP) tekerleklerin tamamen durmasını şart koşar; B6’da yol boşsa durmadan dikkatlice geçilebilir.' },
      { q: 'E1 (Park Yasaktır — tek çizgi) levhasının olduğu tarafta hangisi serbesttir?', opts: ['Yolcu indirme-bindirme veya yük boşaltma için kısa süreli duraklamak', 'Dörtlüleri yakıp 10 dakika markete girmek', 'Hiçbir şekilde durulamaz'], ans: 0, exp: 'E1 yalnızca park etmeyi yasaklar; hem durmayı hem parkı yasaklayan levha çift çarpılı E2’dir.' },
      { q: 'G5 (Woonerf / Yaşam Alanı) levhası bulunan bölgede azami hız sınırı kaçtır?', opts: ['15 km/s', '30 km/s', '50 km/s'], ans: 0, exp: 'Woonerf (G5) içinde azami hız 15 km/s’dir ve yalnızca P işaretli ceplere park edilebilir.' },
    ],
    ar: [
      { q: 'ما الفرق القانوني الأساسي بين الإشارة B6 (مثلث مقلوب) والإشارة B7 (STOP)؟', opts: ['عند B7 يجب التوقف التام حتى لو كان الطريق خالياً؛ وعند B6 تعطي الأولوية للسائقين المتقاطعين', 'كلتاهما توجبان التوقف التام دائماً', 'B6 تمنح الأولوية للمشاة أيضاً'], ans: 0, exp: 'إشارة B7 تلزمك بإيقاف المركبة تماماً، بينما B6 تلزمك بإعطاء الأولوية دون توقف إجباري إذا خلا الطريق.' },
      { q: 'ماذا يُسمح لك بفعله بعد إشارة E1 (ممنوع الوقوف الطويل/الركن)؟', opts: ['التوقف اللحظي لصعود أو نزول الركاب أو تحميل وتفريغ البضائع فوراً', 'الركن لمدة 10 دقائق مع تشغيل الغمازات الرباعية', 'يُمنع التوقف نهائياً'], ans: 0, exp: 'E1 تمنع الركن فقط، أما منع التوقف والركن معاً فيكون بإشارة E2 ذات الخطين المتقاطعين.' },
      { q: 'ما هي السرعة القصوى داخل منطقة السكن المشتركة (Woonerf - إشارة G5)؟', opts: ['15 كم/ساعة', '30 كم/ساعة', '50 كم/ساعة'], ans: 0, exp: 'السرعة القصوى في منطقة G5 هي 15 كم/ساعة ويُسمح بالركن فقط داخل المربعات التي تحمل حرف P.' },
    ],
    ru: [
      { q: 'В чем главное отличие знака B6 (уступите дорогу) от знака B7 (STOP)?', opts: ['При B7 полная остановка обязательна даже на пустой дороге; при B6 нужно уступить пересекающим водителям', 'Оба знака требуют полной остановки всегда', 'B6 дает приоритет и пешеходам'], ans: 0, exp: 'Знак B7 требует полной остановки колес в любом случае, а B6 — только уступить дорогу пересекающим водителям.' },
      { q: 'Что разрешено в зоне действия знака E1 (стоянка запрещена — одна черта)?', opts: ['Короткая остановка для посадки/высадки пассажиров или погрузки/разгрузки', 'Парковка до 10 минут с аварийкой', 'Любая остановка запрещена'], ans: 0, exp: 'Знак E1 запрещает только стоянку (парковку); остановку запрещает знак E2 с крестом.' },
      { q: 'Какова максимальная скорость в жилой зоне Woonerf (знак G5)?', opts: ['15 км/ч', '30 км/ч', '50 км/ч'], ans: 0, exp: 'В жилой зоне G5 действует лимит 15 км/ч, а парковка разрешена только на местах с буквой P.' },
    ],
    fa: [
      { q: 'تفاوت اصلی قانونی بین تابلوی B6 (مثلث واژگون حق تقدم) و B7 (STOP) چیست؟', opts: ['در B7 حتی اگر جاده خالی باشد توقف کامل الزامی است؛ در B6 باید به رانندگان متقاطع راه بدهید', 'در هر دو تابلو همیشه باید کامل بایستید', 'B6 به عابران پیاده هم حق تقدم می‌دهد'], ans: 0, exp: 'در تابلوی B7 چرخ‌ها باید کاملاً از حرکت بایستند، اما در B6 اگر مسیر خالی باشد توقف اجباری نیست.' },
      { q: 'در محدوده تابلوی E1 (پارک ممنوع — یک خط مورب) چه کاری مجاز است؟', opts: ['توقف کوتاه برای سوار/پیاده کردن مسافر یا بارگیری و تخلیه فوری بار', 'پارک ۱۰ دقیقه‌ای با فلاشر روشن', 'هرگونه توقف مطلقاً ممنوع است'], ans: 0, exp: 'تابلوی E1 فقط پارک کردن را ممنوع می‌کند؛ توقف کامل تنها با تابلوی ضربدردار E2 ممنوع می‌شود.' },
      { q: 'حداکثر سرعت مجاز در منطقه مسکونی Woonerf (تابلوی G5) چقدر است؟', opts: ['۱۵ کیلومتر بر ساعت', '۳۰ کیلومتر بر ساعت', '۵۰ کیلومتر بر ساعت'], ans: 0, exp: 'در محدوده G5 حداکثر سرعت ۱۵ کیلومتر بر ساعت است و پارک فقط در خانه‌های دارای حرف P مجاز است.' },
    ],
    es: [
      { q: '¿Cuál es la diferencia clave entre la señal B6 (ceda el paso) y la B7 (STOP)?', opts: ['Con B7 debes detenerte por completo aunque no venga nadie; con B6 cedes el paso a conductores transversales', 'Ambas obligan a parar siempre', 'B6 da prioridad también a peatones'], ans: 0, exp: 'La señal B7 exige detención total obligatoria; la B6 solo exige ceder el paso si se aproxima otro conductor.' },
      { q: 'Bajo la señal E1 (prohibido estacionar), ¿qué maniobra sí está permitida?', opts: ['Parar brevemente para subir/bajar pasajeros o cargar/descargar mercancía al instante', 'Aparcar 10 minutos con luces de emergencia', 'Está prohibido parar en cualquier caso'], ans: 0, exp: 'E1 prohíbe estacionar, mientras que E2 (aspa doble) prohíbe tanto parar como estacionar.' },
      { q: '¿Cuál es la velocidad máxima en una zona residencial Woonerf (señal G5)?', opts: ['15 km/h', '30 km/h', '50 km/h'], ans: 0, exp: 'En una zona G5 el límite legal es de 15 km/h y solo se puede aparcar en plazas marcadas con una P.' },
    ],
  },

  'cbr-hazard-perception-priority': {
    en: [
      { q: 'At an unmarked equal intersection in the Netherlands, a cyclist approaches from your right and a car from your left. Who goes first?', opts: ['The cyclist from the right (all drivers from the right have priority)', 'Your car because motor vehicles go before bicycles', 'The car from the left'], ans: 0, exp: 'Under RVV 1990, cyclists are legally drivers (bestuurders), so a cyclist from the right has full priority at equal intersections.' },
      { q: 'You are turning right at an intersection while a pedestrian continues straight ahead on the same road. Who goes first?', opts: ['The pedestrian (rechtdoor op dezelfde weg gaat voor)', 'You, because pedestrians only have priority on zebra crossings', 'Whoever arrives first'], ans: 0, exp: 'Straight-ahead traffic on the same road — including pedestrians and cyclists — always has priority over turning drivers!' },
      { q: 'At around 50 km/h when a child steps toward the curb between parked cars, what is usually the safest CBR action?', opts: ['Release the accelerator immediately (gas loslaten) and prepare to brake', 'Sound the horn and keep constant speed', 'Swerve into the oncoming lane'], ans: 0, exp: 'For potential developing hazards, releasing the gas reduces speed smoothly and positions your foot over the brake.' },
    ],
    nl: [
      { q: 'Op een gelijkwaardig kruispunt komt een fietser van rechts en een auto van links. Wie mag eerst?', opts: ['De fietser van rechts (alle bestuurders van rechts hebben voorrang)', 'Jij, want motorvoertuigen gaan voor fietsers', 'De auto van links'], ans: 0, exp: 'Fietsers zijn volgens het RVV bestuurders; op een gelijkwaardig kruispunt heeft elke bestuurder van rechts voorrang.' },
      { q: 'Je slaat rechtsaf terwijl een voetganger op dezelfde weg rechtdoor loopt. Wie gaat voor?', opts: ['De voetganger (rechtdoor op dezelfde weg gaat voor)', 'Jij, want er ligt geen zebrapad', 'Degene die het snelst is'], ans: 0, exp: 'Rechtdoorgaand verkeer op dezelfde weg — dus óók voetgangers! — gaat altijd voor afslaande bestuurders.' },
      { q: 'Je rijdt 50 km/u en ziet tussen geparkeerde auto’s een bal de stoep op rollen, nog niet op de rijbaan. Wat doe je?', opts: ['Direct gas loslaten en rembereid zijn', 'Vol in de ankers (noodstop)', 'Gewoon doorrijden met 50 km/u'], ans: 0, exp: 'Bij een dreigend (latent) gevaar laat je direct gas los zodat je snelheid daalt en je direct kunt remmen als een kind volgt.' },
    ],
    tr: [
      { q: 'Eşdeğer (levhasız) bir Hollanda kavşağında sağınızdan bisikletli, solunuzdan otomobil geliyor. İlk geçiş hakkı kimindir?', opts: ['Sağdan gelen bisikletlinin (sağdan gelen tüm sürücüler önceliklidir)', 'Motorlu araç olduğunuz için sizin', 'Soldan gelen otomobilin'], ans: 0, exp: 'RVV 1990’a göre bisikletliler de sürücüdür (bestuurder); eşdeğer kavşakta sağdan gelen bisikletli otomobilden önce geçer.' },
      { q: 'Sağa dönerken aynı yol üzerinde düz yürümeye devam eden bir yaya var (yaya geçidi yok). Kim önce geçer?', opts: ['Yaya (aynı yolda düz giden dönene göre önceliklidir)', 'Yaya geçidi olmadığı için otomobil', 'Korna çalan'], ans: 0, exp: '“Rechtdoor op dezelfde weg gaat voor” kuralı yayaları da kapsar; dönüş yapan sürücü aynı yolda düz giden yayaya yol vermelidir.' },
      { q: '50 km/s hızla giderken park etmiş araçların arasından kaldırım kenarına bir top yuvarlandığını gördünüz. Doğru CBR tepkisi nedir?', opts: ['Derhal gazı bırakmak (gas loslaten) ve frene hazır olmak', 'Sabit hızla devam etmek', 'Korna çalıp hızlanmak'], ans: 0, exp: 'Potansiyel tehlikelerde (topun arkasından çocuk çıkma ihtimali) hemen gaz kesilip ayak frene hazırlanır.' },
    ],
    ar: [
      { q: 'في تقاطع متكافئ بدون إشارات في هولندا، يقترب دراج من يمينك وسيارة من يسارك. لمن الأولوية؟', opts: ['للدراج القادم من اليمين (جميع السائقين من اليمين لهم الأولوية)', 'لسيارتك لأنها مركبة آلية', 'للسيارة القادمة من اليسار'], ans: 0, exp: 'يُعد راكب الدراجة سائقاً (bestuurder) في القانون الهولندي، لذا يتمتع بالأولوية الكاملة عند قدومه من اليمين.' },
      { q: 'أنت تنعطف يميناً بينما يواصل أحد المشاة السير في خط مستقيم على نفس الطريق. من يمر أولاً؟', opts: ['الماشي (السير المستقيم على نفس الطريق له الأولوية)', 'أنت، لعدم وجود ممر مشاة مخطط', 'الأسرع وصولاً'], ans: 0, exp: 'قاعدة "السير المستقيم على نفس الطريق يمر أولاً" تشمل المشاة والدراجين والمركبات على حد سواء.' },
      { q: 'تقود بسرعة 50 كم/ساعة وتدحرجت كرة على الرصيف بين السيارات المتوقفة. ما هو التصرف الصحيح في امتحان CBR؟', opts: ['رفع القدم عن الوقود فوراً والاستعداد للفرملة', 'الاستمرار بنفس السرعة', 'استخدام المنبه وزيادة السرعة'], ans: 0, exp: 'عند ظهور خطر محتمل (احتمال خروج طفل خلف الكرة)، يجب رفع القدم عن الوقود فوراً والاستعداد للفرملة.' },
    ],
    ru: [
      { q: 'На равнозначном перекрестке без знаков справа приближается велосипедист, а слева — автомобиль. Кто проедет первым?', opts: ['Велосипедист справа (помеха справа действует для всех водителей)', 'Вы, так как автомобиль главнее велосипеда', 'Автомобиль слева'], ans: 0, exp: 'По правилам RVV 1990 велосипедист является водителем (bestuurder), поэтому справа он имеет полный приоритет.' },
      { q: 'Вы поворачиваете направо, а пешеход идет прямо по той же дороге (зебры нет). Кто имеет преимущество?', opts: ['Пешеход (движение прямо по той же дороге главнее поворота)', 'Вы, так как нет пешеходного перехода', 'Тот, кто быстрее'], ans: 0, exp: 'Правило «прямо по той же дороге — первым» распространяется на всех участников движения, включая пешеходов.' },
      { q: 'Вы едете 50 км/ч и видите мяч на тротуаре между припаркованными машинами. Какое действие правильное на экзамене CBR?', opts: ['Немедленно отпустить газ и приготовиться тормозить', 'Продолжать движение с прежней скоростью', 'Посигналить и ускориться'], ans: 0, exp: 'При потенциальной опасности (за мячом может выбежать ребенок) нужно сразу отпустить педаль газа.' },
    ],
    fa: [
      { q: 'در یک تقاطع هم‌عرض بدون تابلو در هلند، دوچرخه‌سواری از راست و خودرویی از چپ نزدیک می‌شود. حق تقدم با کیست؟', opts: ['دوچرخه‌سوار سمت راست (حق تقدم با تمام رانندگان از سمت راست است)', 'شما، چون خودرو موتوری هستید', 'خودروی سمت چپ'], ans: 0, exp: 'در قانون RVV هلند دوچرخه‌سوار هم راننده (bestuurder) محسوب می‌شود و از سمت راست حق تقدم کامل دارد.' },
      { q: 'هنگام گردش به راست، عابر پیاده‌ای در همان خیابان مستقیم ادامه مسیر می‌دهد (خط عابر نیست). چه کسی اول عبور می‌کند؟', opts: ['عابر پیاده (حرکت مستقیم در همان خیابان بر گردش مقدم است)', 'شما، چون خط عابر پیاده وجود ندارد', 'هر کس زودتر برسد'], ans: 0, exp: 'قانون «حرکت مستقیم در همان جاده مقدم است» شامل عابران پیاده هم می‌شود.' },
      { q: 'با سرعت ۵۰ کیلومتر بر ساعت می‌رانید و توپی را کنار جدول بین خودروهای پارک‌شده می‌بینید. واکنش صحیح CBR چیست؟', opts: ['فوراً رها کردن پدال گاز و آماده باش روی ترمز', 'ادامه حرکت با سرعت ثابت', 'بوق زدن و افزایش سرعت'], ans: 0, exp: 'در خطرهای احتمالی (احتمال دویدن کودک دنبال توپ) باید بلافاصله گاز را رها کرد.' },
    ],
    es: [
      { q: 'En un cruce sin señalizar en Países Bajos se acerca un ciclista por tu derecha y un coche por tu izquierda. ¿Quién pasa primero?', opts: ['El ciclista de la derecha (todos los conductores por la derecha tienen prioridad)', 'Tu coche por ser vehículo de motor', 'El coche de la izquierda'], ans: 0, exp: 'Según el RVV 1990 los ciclistas son conductores (bestuurders) y tienen prioridad cuando vienen por la derecha.' },
      { q: 'Giras a la derecha mientras un peatón sigue recto por la misma calle (sin paso de cebra). ¿Quién tiene prioridad?', opts: ['El peatón (quien sigue recto en la misma vía pasa antes que quien gira)', 'Tú, porque no hay paso de cebra', 'El primero en llegar'], ans: 0, exp: 'La regla neerlandesa "rechtdoor op dezelfde weg gaat voor" protege también a los peatones frente a vehículos que giran.' },
      { q: 'Circulas a 50 km/h y ves rodar un balón en la acera entre coches aparcados. ¿Cuál es la respuesta correcta en el CBR?', opts: ['Soltar el acelerador de inmediato y prepararse para frenar', 'Mantener la velocidad constante', 'Tocar el claxon y acelerar'], ans: 0, exp: 'Ante un peligro potencial (un niño detrás del balón), suelta el acelerador para reducir velocidad con suavidad.' },
    ],
  },

  'exchange-foreign-driving-licence-netherlands': {
    en: [
      { q: 'How long may you drive in the Netherlands with a valid non-EU foreign driving licence after registering at the municipality (BSN)?', opts: ['185 days (approx. 6 months)', '2 years', '30 days'], ans: 0, exp: 'Non-EU/EEA licences remain valid for 185 days from your official municipal registration date in the Netherlands.' },
      { q: 'Which tax status allows expats of ANY nationality to exchange a valid foreign driving licence at the RDW without taking the CBR exams?', opts: ['The 30% ruling (30%-regeling) for Highly Skilled Migrants', 'Any student residence permit', 'A tourist Schengen visa'], ans: 0, exp: 'Holders of a valid Beschikking 30%-regeling from the Belastingdienst can exchange any valid foreign licence via their gemeente/RDW.' },
      { q: 'Where do you submit your RDW foreign driving licence exchange application in person?', opts: ['At your local Dutch municipality (Gemeente) desk', 'Directly at a CBR exam hall', 'At the police station'], ans: 0, exp: 'You file the exchange request and Gezondheidsverklaring at your local Gemeente, which forwards the application to the RDW.' },
    ],
    nl: [
      { q: 'Hoe lang mag je na inschrijving bij de gemeente (BSN) in Nederland rijden met een geldig rijbewijs van buiten de EU/EVA?', opts: ['185 dagen (circa 6 maanden)', '2 jaar', '30 dagen'], ans: 0, exp: 'Na inschrijving in de BRP mag je nog maximaal 185 dagen met een niet-EU rijbewijs rijden.' },
      { q: 'Welke regeling geeft kennismigranten uit élk land het recht om hun geldige rijbewijs zonder CBR-examen om te wisselen?', opts: ['De 30%-regeling van de Belastingdienst', 'Een studentenvisum', 'Een toeristenvisum'], ans: 0, exp: 'Met een geldige Beschikking 30%-regeling kan een geldig buitenlands rijbewijs uit elk land via de gemeente/RDW worden omgewisseld.' },
      { q: 'Waar dien je een aanvraag voor het omwisselen van een buitenlands rijbewijs persoonlijk in?', opts: ['Bij je eigen Nederlandse gemeente (burgerzaken)', 'Direct bij een CBR-examencentrum', 'Op het politiebureau'], ans: 0, exp: 'Je dient de aanvraag in bij de gemeente waar je staat ingeschreven; de gemeente stuurt deze door naar de RDW.' },
    ],
    tr: [
      { q: 'Hollanda’da belediyeye (BSN) kaydolduktan sonra AB dışı (ör. Türkiye) geçerli ehliyetinizle en fazla kaç gün araç kullanabilirsiniz?', opts: ['185 gün (yaklaşık 6 ay)', '2 yıl', '30 gün'], ans: 0, exp: 'AB dışı ehliyetler belediye tescil (BRP) tarihinden itibaren 185 gün geçerlidir; sonrasında Hollanda ehliyeti şarttır.' },
      { q: 'Hangi vergi avantajına sahip çalışanlar hangi ülkeden olursa olsun yabancı ehliyetini CBR sınavına girmeden RDW üzerinden değiştirebilir?', opts: ['%30 Vergi Avantajı (30%-regeling / Kennismigrant)', 'Öğrenci oturum izni', 'Turist vizesi'], ans: 0, exp: 'Belastingdienst onaylı %30 kuralı (30%-regeling) belgesi olan nitelikli göçmenler Türk ehliyetini sınavsız değiştirebilir.' },
      { q: 'RDW ehliyet değişim başvurusu şahsen nereye teslim edilir?', opts: ['Kayıtlı olduğunuz Hollanda Belediyesi’ne (Gemeente)', 'Doğrudan CBR sınav salonuna', 'Polis merkezine'], ans: 0, exp: 'Başvuru ve sağlık beyanı (Gezondheidsverklaring) sonrası evraklar kayıtlı olunan Gemeente gişesine teslim edilir.' },
    ],
    ar: [
      { q: 'كم يوماً يُسمح لك بالقيادة في هولندا برخصة أجنبية من خارج الاتحاد الأوروبي بعد التسجيل في البلدية (BSN)؟', opts: ['185 يوماً (حوالي 6 أشهر)', 'سنتان', '30 يوماً'], ans: 0, exp: 'تبقى الرخصة الأجنبية صالحة لمدة 185 يوماً من تاريخ تسجيل السكن في البلدية الهولندية.' },
      { q: 'ما هو الإعفاء الضريبي الذي يتيح للعمالة الماهرة استبدال أي رخصة قيادة أجنبية عبر RDW دون خوض امتحانات CBR؟', opts: ['قاعدة الـ 30% الضريبية (30%-regeling)', 'تأشيرة الدراسة', 'تأشيرة السياحة'], ans: 0, exp: 'حاملو قرار 30%-regeling الساري من مصلحة الضرائب يمكنهم استبدال رخصتهم الأجنبية مباشرة بدون اختبار.' },
      { q: 'أين تُقدَّم معاملة استبدال رخصة القيادة الأجنبية شخصياً؟', opts: ['لدى البلدية المحلية (Gemeente) المسجل فيها', 'في قاعة امتحانات CBR مباشرة', 'في مركز الشرطة'], ans: 0, exp: 'تُقدَّم المعاملة في البلدية (Gemeente) وهي تقوم بإرسالها رسمياً إلى هيئة RDW.' },
    ],
    ru: [
      { q: 'Сколько дней после регистрации в муниципалитете (BSN) можно ездить в Нидерландах с правами стран вне ЕС?', opts: ['185 дней (около 6 месяцев)', '2 года', '30 дней'], ans: 0, exp: 'Водительское удостоверение стран вне ЕС действует 185 дней с даты регистрации по месту жительства (BRP).' },
      { q: 'Какой налоговый статус позволяет обменять права любой страны в RDW без сдачи экзаменов CBR?', opts: ['Налоговое правило 30% (30%-regeling для kennismigrant)', 'Студенческий ВНЖ', 'Туристическая виза'], ans: 0, exp: 'Обладатели действующего решения 30%-regeling от налоговой службы обменивают права без экзаменов.' },
      { q: 'Куда лично подается заявление на обмен иностранного водительского удостоверения?', opts: ['В ваш местный муниципалитет (Gemeente)', 'Непосредственно в экзаменационный центр CBR', 'В полицейский участок'], ans: 0, exp: 'Заявление подается в муниципалитет (Gemeente), который пересылает документы в RDW.' },
    ],
    fa: [
      { q: 'پس از ثبت آدرس در شهرداری هلند (دریافت BSN)، تا چند روز می‌توانید با گواهینامه غیراروپایی رانندگی کنید؟', opts: ['۱۸۵ روز (حدود ۶ ماه)', '۲ سال', '۳۰ روز'], ans: 0, exp: 'گواهینامه‌های خارج از اتحادیه اروپا تا ۱۸۵ روز پس از ثبت در شهرداری معتبر هستند.' },
      { q: 'کدام قانون مالیاتی به متخصصان خارجی اجازه می‌دهد گواهینامه هر کشوری را بدون آزمون CBR تعویض کنند؟', opts: ['قانون معافیت مالیاتی ۳۰ درصد (30%-regeling)', 'اقامت دانشجویی', 'ویزای توریستی'], ans: 0, exp: 'دارندگان تأییدیه معتبر 30%-regeling از اداره مالیات هلند می‌توانند گواهینامه خود را مستقیم در RDW تعویض کنند.' },
      { q: 'درخواست تعویض گواهینامه خارجی را باید حضوری به کجا تحویل دهید؟', opts: ['به شهرداری محل سکونت خود (Gemeente)', 'مستقیماً به مرکز آزمون CBR', 'به اداره پلیس'], ans: 0, exp: 'درخواست در شهرداری (Gemeente) ثبت شده و از آنجا برای بررسی به سازمان RDW ارسال می‌شود.' },
    ],
    es: [
      { q: '¿Cuántos días puedes conducir en Países Bajos con un permiso extracomunitario válido tras empadronarte (BSN)?', opts: ['185 días (unos 6 meses)', '2 años', '30 días'], ans: 0, exp: 'Los permisos de fuera de la UE/EEE son válidos durante 185 días desde el registro municipal en Países Bajos.' },
      { q: '¿Qué régimen fiscal permite canjear un permiso extranjero de cualquier país en la RDW sin hacer exámenes del CBR?', opts: ['La regla fiscal del 30 % (30%-regeling para migrantes altamente cualificados)', 'Un visado de estudiante', 'Un visado de turista'], ans: 0, exp: 'Con la resolución vigente de la 30%-regeling de Belastingdienst puedes canjear tu carné directamente.' },
      { q: '¿Dónde se presenta presencialmente la solicitud de canje del permiso de conducir?', opts: ['En tu ayuntamiento neerlandés (Gemeente)', 'Directamente en el centro de examen CBR', 'En la comisaría de policía'], ans: 0, exp: 'El trámite se inicia en tu Gemeente, que remite el expediente y tu Gezondheidsverklaring a la RDW.' },
    ],
  },

  'cbr-speed-limits-motorways-environmental-zones': {
    en: [
      { q: 'What is the standard daytime maximum speed on Dutch motorways (autosnelwegen, sign G1) between 06:00 and 19:00?', opts: ['100 km/h', '130 km/h', '120 km/h'], ans: 0, exp: 'Between 06:00 and 19:00 the nationwide motorway limit is 100 km/h; 130 km/h applies only from 19:00 to 06:00 where not restricted.' },
      { q: 'What is the maximum speed on a Dutch motorway for a passenger car towing a light trailer or caravan (<3,500 kg)?', opts: ['90 km/h', '100 km/h', '80 km/h'], ans: 0, exp: 'Cars towing a trailer or caravan with a permissible mass up to 3,500 kg may drive up to 90 km/h on autowegen and autosnelwegen.' },
      { q: 'What is the legal blood alcohol limit for a beginner driver (beginnersrijbewijs, first 5 years) in the Netherlands?', opts: ['0.2‰ (88 µg/l breath)', '0.5‰ (220 µg/l breath)', '0.8‰'], ans: 0, exp: 'Novice drivers face a strict 0.2‰ limit (effectively zero alcohol) for their first 5 years — or 7 years if licensed at age 17.' },
    ],
    nl: [
      { q: 'Wat is overdag tussen 06:00 en 19:00 uur de standaard maximumsnelheid op een Nederlandse autosnelweg (bord G1)?', opts: ['100 km/u', '130 km/u', '120 km/u'], ans: 0, exp: 'Tussen 06:00 en 19:00 uur geldt overal op de autosnelweg maximaal 100 km/u; pas tussen 19:00 en 06:00 uur geldt 130 km/u (tenzij anders aangegeven).' },
      { q: 'Hoe hard mag een personenauto met een aanhangwagen of caravan (tot 3.500 kg) op de autosnelweg rijden?', opts: ['90 km/u', '100 km/u', '80 km/u'], ans: 0, exp: 'Met een aanhanger t/m 3.500 kg toegestane maximum massa is de limiet 90 km/u op autowegen en autosnelwegen.' },
      { q: 'Wat is de maximale alcohollimiet voor een beginnend bestuurder (eerste 5 jaar)?', opts: ['0,2 promille (88 µg/l)', '0,5 promille (220 µg/l)', '0,8 promille'], ans: 0, exp: 'Voor beginnende bestuurders geldt 0,2 promille (nagenoeg nul tolerantie), tegenover 0,5 promille voor ervaren bestuurders.' },
    ],
    tr: [
      { q: 'Hollanda otoyollarında (autosnelweg, G1) gündüz 06:00 ile 19:00 saatleri arasında standart azami hız sınırı kaçtır?', opts: ['100 km/s', '130 km/s', '120 km/s'], ans: 0, exp: '06:00–19:00 arası tüm otoyollarda sınır 100 km/s’dir; 130 km/s yalnızca 19:00–06:00 arasında (aksi belirtilmedikçe) geçerlidir.' },
      { q: '3.500 kg altı hafif römork veya karavan çeken bir binek otomobil Hollanda otoyolunda en fazla kaç km/s hızla gidebilir?', opts: ['90 km/s', '100 km/s', '80 km/s'], ans: 0, exp: '3.500 kg’a kadar römork/karavan çeken otomobiller autoweg ve autosnelweg üzerinde en fazla 90 km/s yapabilir.' },
      { q: 'Hollanda’da acemi sürücüler (ilk 5 yıl — beginnersrijbewijs) için yasal alkol sınırı kaç promildir?', opts: ['0,2 promil (88 µg/l)', '0,5 promil (220 µg/l)', '0,8 promil'], ans: 0, exp: 'İlk 5 yıl (17 yaşında ehliyet alanlarda 7 yıl) sınır 0,2 promildir; deneyimli sürücülerde ise 0,5 promildir.' },
    ],
    ar: [
      { q: 'ما هي السرعة القصوى القياسية نهاراً (من 06:00 إلى 19:00) على الطرق السريعة الهولندية (Autosnelweg - G1)؟', opts: ['100 كم/ساعة', '130 كم/ساعة', '120 كم/ساعة'], ans: 0, exp: 'بين الساعة 06:00 و19:00 تبلغ السرعة القصوى 100 كم/ساعة، وتصبح 130 كم/ساعة ليلاً فقط من 19:00 إلى 06:00 إن لم تُقيَّد بلوحة.' },
      { q: 'ما هي السرعة القصوى لسيارة ركاب تجر مقطورة أو كرفاناً خفيفاً (أقل من 3500 كجم) على الطريق السريع؟', opts: ['90 كم/ساعة', '100 كم/ساعة', '80 كم/ساعة'], ans: 0, exp: 'يُسمح للسيارات التي تجر مقطورة حتى 3500 كجم بالسير بسرعة 90 كم/ساعة على الطرق السريعة (Autoweg & Autosnelweg).' },
      { q: 'ما هو الحد القانوني للكحول في الدم للسائق المبتدئ (أول 5 سنوات - Beginnersrijbewijs) في هولندا؟', opts: ['0.2 بروميل (88 ميكروغرام/لتر)', '0.5 بروميل (220 ميكروغرام/لتر)', '0.8 بروميل'], ans: 0, exp: 'يخضع السائق المبتدئ لحد صارم يبلغ 0.2 بروميل فقط خلال أول 5 سنوات من حصوله على الرخصة.' },
    ],
    ru: [
      { q: 'Какова стандартная дневная максимальная скорость на автомагистралях Нидерландов (G1) с 06:00 до 19:00?', opts: ['100 км/ч', '130 км/ч', '120 км/ч'], ans: 0, exp: 'С 06:00 до 19:00 на всех автомагистралях действует лимит 100 км/ч; 130 км/ч разрешено только с 19:00 до 06:00 при отсутствии ограничений.' },
      { q: 'С какой максимальной скоростью легковой автомобиль с прицепом или караваном (до 3500 кг) может ехать по автомагистрали?', opts: ['90 км/ч', '100 км/ч', '80 км/ч'], ans: 0, exp: 'С прицепом полной массой до 3500 кг разрешено двигаться до 90 км/ч на autoweg и autosnelweg.' },
      { q: 'Какова допустимая норма алкоголя для начинающего водителя (первые 5 лет — beginnersrijbewijs) в Нидерландах?', opts: ['0,2 промилле (88 мкг/л)', '0,5 промилле (220 мкг/л)', '0,8 промилле'], ans: 0, exp: 'Для начинающих водителей действует строгий порог 0,2 промилле (для опытных водителей со стажем более 5 лет — 0,5‰).' },
    ],
    fa: [
      { q: 'حداکثر سرعت استاندارد روزانه (ساعت ۰۶:۰۰ تا ۱۹:۰۰) در آزادراه‌های هلند (Autosnelweg - G1) چقدر است؟', opts: ['۱۰۰ کیلومتر بر ساعت', '۱۳۰ کیلومتر بر ساعت', '۱۲۰ کیلومتر بر ساعت'], ans: 0, exp: 'بین ساعت ۰۶:۰۰ تا ۱۹:۰۰ سقف سرعت ۱۰۰ کیلومتر بر ساعت است و ۱۳۰ کیلومتر بر ساعت فقط بین ۱۹:۰۰ تا ۰۶:۰۰ اعمال می‌شود.' },
      { q: 'حداکثر سرعت خودروی سواری دارای یدک‌کش یا کاروان سبک (زیر ۳۵۰۰ کیلوگرم) در آزادراه چقدر است؟', opts: ['۹۰ کیلومتر بر ساعت', '۱۰۰ کیلومتر بر ساعت', '۸۰ کیلومتر بر ساعت'], ans: 0, exp: 'خودروهای دارای یدک‌کش تا ۳۵۰۰ کیلوگرم مجازند حداکثر ۹۰ کیلومتر بر ساعت در جاده‌های سریع‌السیر و آزادراه‌ها برانند.' },
      { q: 'حد مجاز الکل خون برای رانندگان تازه‌کار (۵ سال اول — Beginnersrijbewijs) در هلند چقدر است؟', opts: ['۰٫۲ پرومیل (۸۸ میکروگرم)', '۰٫۵ پرومیل (۲۲۰ میکروگرم)', '۰٫۸ پرومیل'], ans: 0, exp: 'برای رانندگان تازه‌کار در ۵ سال اول سقف الکل ۰٫۲ پرومیل است (در برابر ۰٫۵ پرومیل برای رانندگان باتجربه).' },
    ],
    es: [
      { q: '¿Cuál es la velocidad máxima diurna estándar (de 06:00 a 19:00) en las autopistas neerlandesas (autosnelweg, G1)?', opts: ['100 km/h', '130 km/h', '120 km/h'], ans: 0, exp: 'De 06:00 a 19:00 el límite general en autopista es de 100 km/h; 130 km/h solo rige de 19:00 a 06:00 donde esté permitido.' },
      { q: '¿A qué velocidad máxima puede circular por autopista un turismo con remolque o caravana ligera (<3.500 kg)?', opts: ['90 km/h', '100 km/h', '80 km/h'], ans: 0, exp: 'Los turismos con remolque de hasta 3.500 kg tienen un límite de 90 km/h en autovías y autopistas.' },
      { q: '¿Cuál es la tasa máxima de alcoholemia para un conductor novel (primeros 5 años) en Países Bajos?', opts: ['0,2 ‰ (88 µg/l en aire)', '0,5 ‰ (220 µg/l en aire)', '0,8 ‰'], ans: 0, exp: 'Durante los primeros 5 años de carné (7 años si se obtuvo con 17), el límite es de 0,2 ‰.' },
    ],
  },

  'cbr-vehicle-apk-lights-trailers-law': {
    en: [
      { q: 'When are you legally allowed to switch on your rear fog light (mistachterlicht) in the Netherlands?', opts: ['Only during fog or heavy snowfall when visibility is less than 50 metres', 'Whenever it rains heavily on the motorway', 'Whenever visibility drops below 200 metres'], ans: 0, exp: 'Rear fog lights dazzle following drivers and are permitted ONLY in fog or snow with visibility <50m — never in rain!' },
      { q: 'What is the legal minimum tyre tread depth for a passenger car in the Netherlands (APK requirement)?', opts: ['1.6 mm across the main grooves', '2.5 mm', '4.0 mm'], ans: 0, exp: 'Below 1.6 mm tread depth a tyre is illegal and fails the APK inspection immediately.' },
      { q: 'A RED warning light illuminates on your dashboard while driving. What must you do?', opts: ['Stop safely as soon as possible and switch off the engine', 'Drive home calmly and book a garage check next week', 'Ignore it until the next APK inspection'], ans: 0, exp: 'Red dashboard warning lights indicate immediate danger or critical mechanical/safety failure — stop safely at once.' },
    ],
    nl: [
      { q: 'Wanneer mag je in Nederland het mistachterlicht voeren?', opts: ['Alleen bij mist of sneeuwval met een zicht van minder dan 50 meter', 'Bij zware regenval op de snelweg', 'Zodra het zicht minder is dan 200 meter'], ans: 0, exp: 'Mistachterlicht mag uitsluitend bij mist of sneeuwval bij zicht <50 meter; bij regen is het verboden vanwege verblinding!' },
      { q: 'Wat is de wettelijke minimale profieldiepte van autobanden in Nederland?', opts: ['1,6 mm in de hoofdgroeven', '2,5 mm', '4,0 mm'], ans: 0, exp: 'De wettelijke APK-minimumgrens voor personenautobanden is 1,6 mm.' },
      { q: 'Tijdens het rijden gaat er een ROOD controlelampje op je dashboard branden. Wat moet je doen?', opts: ['Zo snel mogelijk veilig stoppen en de motor uitzetten', 'Rustig doorrijden naar de dichtstbijzijnde garage volgende week', 'Alleen snelheid verlagen naar 80 km/u'], ans: 0, exp: 'Een rood waarschuwingslampje betekent direct gevaar of ernstige schade (bijv. oliedruk of remsysteem): direct veilig stoppen!' },
    ],
    tr: [
      { q: 'Hollanda’da arka sis farını (mistachterlicht) yalnızca hangi durumda yakmanıza izin verilir?', opts: ['Sadece sis veya yoğun kar yağışında görüş mesafesi 50 metrenin altına düştüğünde', 'Şiddetli yağmur yağdığında her zaman', 'Görüş mesafesi 200 metrenin altına düştüğünde'], ans: 0, exp: 'Arka sis farı yalnızca sis veya karda görüş <50 m iken yakılabilir; yağmurda yakılması göz kamaştırdığı için yasaktır!' },
      { q: 'Hollanda’da binek otomobil lastiklerinin yasal asgari diş derinliği kaç milimetredir?', opts: ['1,6 mm', '2,5 mm', '4,0 mm'], ans: 0, exp: 'Ana oluklarda yasal alt sınır 1,6 mm’dir; bunun altındaki lastik APK muayenesinden kalır ve cezaya tabidir.' },
      { q: 'Sürüş sırasında gösterge panelinde KIRMIZI bir uyarı lambası yanarsa ne yapmalısınız?', opts: ['En kısa sürede güvenli bir yerde durup motoru kapatmak', 'Eve kadar yavaşça devam etmek', 'Bir sonraki APK muayenesini beklemek'], ans: 0, exp: 'Kırmızı lamba acil tehlike (yağ basıncı, fren arızası vb.) demektir; derhal güvenli şekilde durulmalıdır (turuncu lamba kontrol gerektirir).' },
    ],
    ar: [
      { q: 'متى يُسمح قانوناً بتشغيل مصباح الضباب الخلفي (mistachterlicht) في هولندا؟', opts: ['فقط عند الضباب أو تساقط الثلوج الكثيف عندما تقل الرؤية عن 50 متراً', 'عند هطول الأمطار الغزيرة دائماً', 'عندما تقل الرؤية عن 200 متر'], ans: 0, exp: 'يُمنع تشغيل ضوء الضباب الخلفي أثناء المطر لأنه يبهر السائقين خلفك؛ ويُسمح به فقط في الضباب أو الثلج تحت 50 متراً.' },
      { q: 'ما هو الحد الأدنى القانوني لعمق نقشة إطارات السيارة في هولندا (فحص APK)؟', opts: ['1.6 ملم', '2.5 ملم', '4.0 ملم'], ans: 0, exp: 'الحد الأدنى القانوني في الشقوق الرئيسية للإطار هو 1.6 ملم.' },
      { q: 'أضاء مصباح تحذير أحمر في لوحة العدادات أثناء القيادة. ماذا يجب عليك فعله؟', opts: ['التوقف بأمان في أقرب مكان ممكن وإيقاف المحرك فوراً', 'مواصلة القيادة بهدوء إلى المنزل', 'تجاهله حتى موعد فحص APK القادم'], ans: 0, exp: 'الضوء الأحمر يعني خطراً فورياً على السلامة أو المحرك (مثل ضغط الزيت أو الفرامل) ويلزم التوقف الآمن فوراً.' },
    ],
    ru: [
      { q: 'Когда в Нидерландах разрешено включать задний противотуманный фонарь (mistachterlicht)?', opts: ['Только в туман или сильный снегопад при видимости менее 50 метров', 'При любом сильном дожде на трассе', 'При видимости менее 200 метров'], ans: 0, exp: 'Задний противотуманный фонарь запрещено включать в дождь! Он разрешен только в туман или снег при видимости <50 м.' },
      { q: 'Какова минимальная законная глубина протектора шин легкового автомобиля в Нидерландах?', opts: ['1,6 мм', '2,5 мм', '4,0 мм'], ans: 0, exp: 'Минимальная допустимая глубина основных канавок протектора составляет 1,6 мм.' },
      { q: 'Во время движения на приборной панели загорелся КРАСНЫЙ индикатор. Ваши действия?', opts: ['Как можно скорее безопасно остановиться и заглушить двигатель', 'Спокойно доехать до дома', 'Подождать следующего техосмотра APK'], ans: 0, exp: 'Красный сигнал означает критическую неисправность (тормоза, давление масла, перегрев) — нужно немедленно безопасно остановиться.' },
    ],
    fa: [
      { q: 'در هلند چه زمانی اجازه دارید چراغ مه‌شکن عقب (mistachterlicht) را روشن کنید؟', opts: ['فقط در مه یا بارش برف سنگین زمانی که دید کمتر از ۵۰ متر است', 'در بارندگی شدید در آزادراه', 'زمانی که دید کمتر از ۲۰۰ متر باشد'], ans: 0, exp: 'روشن کردن مه‌شکن عقب در باران ممنوع است؛ فقط در مه یا برف با دید زیر ۵۰ متر مجاز است.' },
      { q: 'حداقل عمق قانونی آج لاستیک خودروی سواری در هلند (معاینه فنی APK) چند میلی‌متر است؟', opts: ['۱٫۶ میلی‌متر', '۲٫۵ میلی‌متر', '۴٫۰ میلی‌متر'], ans: 0, exp: 'حداقل عمق قانونی شیارهای اصلی تایر در هلند ۱٫۶ میلی‌متر است.' },
      { q: 'هنگام رانندگی یک چراغ هشدار قرمز در پشت آمپر روشن می‌شود. چه کاری باید انجام دهید؟', opts: ['در اولین محل ایمن توقف کرده و موتور را خاموش کنید', 'با سرعت کم تا خانه ادامه دهید', 'تا زمان معاینه فنی بعدی صبر کنید'], ans: 0, exp: 'چراغ قرمز نشانه خطر فوری (ترمز، فشار روغن یا دمای موتور) است و باید بلافاصله در محلی امن بایستید.' },
    ],
    es: [
      { q: '¿Cuándo está permitido encender la luz antiniebla trasera (mistachterlicht) en Países Bajos?', opts: ['Solo con niebla o nevada intensa cuando la visibilidad sea inferior a 50 metros', 'Con lluvia intensa en autopista', 'Cuando la visibilidad baje de 200 metros'], ans: 0, exp: 'Está prohibido usar el antiniebla trasero con lluvia; solo se permite con niebla o nieve y visibilidad <50 m.' },
      { q: '¿Cuál es la profundidad mínima legal del dibujo de los neumáticos en Países Bajos?', opts: ['1,6 mm', '2,5 mm', '4,0 mm'], ans: 0, exp: 'El mínimo legal exigido en la inspección APK es de 1,6 mm en las ranuras principales.' },
      { q: 'Se enciende un testigo ROJO en el cuadro de instrumentos mientras conduces. ¿Qué debes hacer?', opts: ['Detenerte de forma segura lo antes posible y apagar el motor', 'Seguir conduciendo despacio hasta casa', 'Esperar a la próxima revisión APK'], ans: 0, exp: 'Un testigo rojo indica peligro grave o avería crítica (frenos, presión de aceite); debes parar con seguridad de inmediato.' },
    ],
  },

  'cbr-booking-digid-interpreter-faalangst-2todrive': {
    en: [
      { q: 'At what minimum age may young candidates already take the CBR car theory exam under the Dutch 2toDrive scheme?', opts: ['16 years old', '17 years old', '18 years old'], ans: 0, exp: 'Under 2toDrive you can take your CBR theory test at 16, start driving lessons at 16.5, and take the practical test at 17.' },
      { q: 'How can Turkish, Arabic, Russian, Persian, or Spanish speakers take the CBR theory exam if they prefer their native language?', opts: ['Book a CBR Individueel begeleid examen with an official Tolkennet interpreter', 'Switch the standard CBR touchscreen to any language for free', 'Bring a friend or family member into the exam room'], ans: 0, exp: 'Standard CBR computer exams are in Dutch or English; for other languages you book an individual CBR exam with a certified Tolkennet interpreter.' },
      { q: 'What must you bring to the CBR exam centre on exam day besides your reservation confirmation?', opts: ['A valid identity document (passport, EU ID card, or Dutch residence card)', 'Only a photo of your ID on your phone', 'Your driving school contract'], ans: 0, exp: 'Without a physical, valid, undamaged ID document, CBR refuses admission without refund.' },
    ],
    nl: [
      { q: 'Vanaf welke leeftijd mag je in Nederland al het CBR auto theorie-examen afleggen via 2toDrive?', opts: ['Vanaf 16 jaar', 'Vanaf 17 jaar', 'Vanaf 18 jaar'], ans: 0, exp: 'Met 2toDrive mag je vanaf 16 jaar theorie-examen doen, vanaf 16,5 rijlessen volgen en vanaf 17 jaar praktijkexamen doen.' },
      { q: 'Hoe kun je het CBR auto theorie-examen afleggen in bijvoorbeeld het Turks, Arabisch, Russisch, Perzisch of Spaans?', opts: ['Via een Individueel begeleid examen bij het CBR met een officiële tolk (Tolkennet)', 'Door op het standaard CBR-scherm zelf de taal te wijzigen', 'Door een familielid mee te nemen als vertaler'], ans: 0, exp: 'Het standaard klassikale examen is alleen in het Nederlands of Engels; voor andere talen boek je een individueel examen met een beëdigde tolk.' },
      { q: 'Wat moet je verplicht fysiek meenemen naar het CBR-examencentrum op de dag van je theorie-examen?', opts: ['Een geldig identiteitsbewijs (paspoort, ID-kaart of verblijfsdocument)', 'Alleen een kopie of foto op je telefoon', 'Je DigiD-wachtwoord op papier'], ans: 0, exp: 'Zonder origineel en geldig identiteitsbewijs word je niet toegelaten en krijg je geen examengeld terug.' },
    ],
    tr: [
      { q: 'Hollanda 2toDrive sistemi kapsamında genç adaylar CBR otomobil teori sınavına en erken kaç yaşında girebilir?', opts: ['16 yaşında', '17 yaşında', '18 yaşında'], ans: 0, exp: '2toDrive ile 16 yaşında teori sınavına girilebilir, 16,5 yaşında direksiyon dersine başlanır ve 17 yaşında ehliyet alınabilir.' },
      { q: 'CBR teori sınavına Türkçe girmek isteyen bir aday sınavı nasıl alabilir?', opts: ['CBR’dan “Individueel begeleid examen” (bireysel sınav) alıp resmi Tolkennet tercümanı talep ederek', 'Standart bilgisayar ekranından ücretsiz Türkçe seçerek', 'Sınava yanında bir akrabasını götürerek'], ans: 0, exp: 'Standart CBR ekranlı sınav sadece Felemenkçe ve İngilizcedir; Türkçe sınav resmi Tolkennet tercümanlı bireysel sınav ile mümkündür.' },
      { q: 'Sınav günü CBR merkezine giderken yanınızda mutlaka fiziksel olarak ne bulunmalıdır?', opts: ['Geçerli orijinal kimlik belgesi (pasaport, AB kimliği veya Hollanda oturum kartı)', 'Telefonda kimlik fotoğrafı', 'Sürücü kursu faturası'], ans: 0, exp: 'Geçerli fiziksel kimlik belgesi olmadan CBR sınava kesinlikle almaz ve ücret iadesi yapmaz.' },
    ],
    ar: [
      { q: 'في أي عمر يمكن للشباب التقدم لامتحان النظري CBR للسيارة ضمن نظام 2toDrive في هولندا؟', opts: ['من عمر 16 عاماً', 'من عمر 17 عاماً', 'من عمر 18 عاماً'], ans: 0, exp: 'يتيح نظام 2toDrive تقديم امتحان النظري في سن 16، وبدء دروس القيادة في 16.5، وامتحان العملي في سن 17.' },
      { q: 'كيف يمكن للمتحدث بالعربية تقديم امتحان التيوري CBR باللغة العربية؟', opts: ['حجز امتحان فردي (Individueel begeleid examen) لدى CBR مع مترجم رسمي معتمد من Tolkennet', 'تغيير لغة شاشة الامتحان العادي مجاناً', 'اصطحاب صديق أو قريب للترجمة'], ans: 0, exp: 'الامتحان الجماعي العادي متوفر بالهولندية والإنجليزية فقط؛ وللعربية يُحجز امتحان فردي مع مترجم رسمي.' },
      { q: 'ما هي الوثيقة الإلزامية التي يجب إحضارها فعلياً يوم الامتحان في مركز CBR؟', opts: ['إثبات هوية أصلي ساري المفعول (جواز سفر أو بطاقة إقامة هولندية)', 'صورة الهوية على الهاتف فقط', 'عقد مدرسة القيادة'], ans: 0, exp: 'بدون وثيقة هوية أصلية صالحة يُرفض دخولك القاعة ولا تُسترد رسوم الامتحان.' },
    ],
    ru: [
      { q: 'С какого минимального возраста в Нидерландах можно сдавать теоретический экзамен CBR по программе 2toDrive?', opts: ['С 16 лет', 'С 17 лет', 'С 18 лет'], ans: 0, exp: 'По системе 2toDrive теорию можно сдавать с 16 лет, учиться вождению с 16,5 лет, а сдавать практику — с 17 лет.' },
      { q: 'Как сдать теоретический экзамен CBR на русском языке?', opts: ['Записаться на индивидуальный экзамен CBR (Individueel begeleid examen) с официальным переводчиком Tolkennet', 'Переключить язык на обычном экзамене на русский', 'Привести с собой друга-переводчика'], ans: 0, exp: 'Обычный компьютерный экзамен проводится только на нидерландском и английском; для русского нужен индивидуальный экзамен с аккредитованным переводчиком.' },
      { q: 'Какой документ обязательно нужно иметь при себе в оригинале в день экзамена в центре CBR?', opts: ['Действующее удостоверение личности (паспорт, ID-карта или ВНЖ Нидерландов)', 'Фотографию паспорта в телефоне', 'Договор с автошколой'], ans: 0, exp: 'Без физического оригинала действительного удостоверения личности допуск к экзамену невозможен без возврата оплаты.' },
    ],
    fa: [
      { q: 'در طرح 2toDrive هلند، نوجوانان از چه سنی می‌توانند در آزمون تئوری خودرو CBR شرکت کنند؟', opts: ['از ۱۶ سالگی', 'از ۱۷ سالگی', 'از ۱۸ سالگی'], ans: 0, exp: 'در طرح 2toDrive از ۱۶ سالگی آزمون تئوری، از ۱۶٫۵ سالگی کلاس عملی و از ۱۷ سالگی آزمون شهری مجاز است.' },
      { q: 'متقاضیان فارسی‌زبان چگونه می‌توانند آزمون تئوری CBR را به زبان فارسی بدهند؟', opts: ['رزرو آزمون انفرادی (Individueel begeleid examen) در CBR همراه با مترجم رسمی Tolkennet', 'انتخاب زبان فارسی روی مانیتور آزمون عادی', 'بردن یکی از اعضای خانواده به جلسه آزمون'], ans: 0, exp: 'آزمون کامپیوتری استاندارد فقط به هلندی و انگلیسی است؛ برای زبان فارسی باید آزمون انفرادی با مترجم رسمی رزرو شود.' },
      { q: 'در روز آزمون CBR همراه داشتن اصل کدام مدرک کاملاً الزامی است؟', opts: ['مدرک شناسایی معتبر و فیزیکی (پاسپورت یا کارت اقامت هلند)', 'فقط عکس مدرک روی موبایل', 'قرارداد آموزشگاه رانندگی'], ans: 0, exp: 'بدون اصل مدرک شناسایی معتبر اجازه ورود به جلسه داده نمی‌شود و هزینه آزمون نیز سوخت می‌شود.' },
    ],
    es: [
      { q: '¿A partir de qué edad se puede hacer el examen teórico de coche del CBR con el programa 2toDrive?', opts: ['Desde los 16 años', 'Desde los 17 años', 'Desde los 18 años'], ans: 0, exp: 'Con 2toDrive puedes examinarte de teórica a los 16 años, dar clases prácticas a los 16,5 y examinarte de práctica a los 17.' },
      { q: '¿Cómo se puede realizar el examen teórico del CBR en español?', opts: ['Reservando un examen individual (Individueel begeleid examen) con intérprete oficial de Tolkennet', 'Cambiando gratis el idioma de la pantalla estándar a español', 'Llevando a un familiar para traducir'], ans: 0, exp: 'El examen estándar por ordenador solo está en neerlandés o inglés; para español se reserva sesión individual con intérprete jurado.' },
      { q: '¿Qué documento físico debes llevar obligatoriamente al centro del CBR el día del examen?', opts: ['Un documento de identidad original y en vigor (pasaporte, DNI europeo o tarjeta de residencia)', 'Solo una foto del documento en el móvil', 'El recibo de la autoescuela'], ans: 0, exp: 'Sin documento de identidad físico y vigente no podrás entrar al examen ni recuperar la tasa.' },
    ],
  },
};

const CURRICULUM_BOX = {
  en: {
    badge: '📚 Complete 9-Chapter RVV 1990 Curriculum Overview',
    title: 'What Is Covered Across All 9 CBR Theory Chapters?',
    desc: 'Chapter 1 is 100% free in full textbook format. Below is a public overview of Chapters 2–9 so you can review every CBR exam domain and jump straight to our free topic guides or unlock all 9 full textbook chapters + 50 mock exams:',
    colCh: 'Chapter',
    colTopic: 'Core CBR Exam Rules Covered',
    colAccess: 'Public Guide / Access',
    freeFull: 'Read Full Chapter 1 Free →',
    guideSum: 'Read Public Summary Guide →',
    rows: [
      ['Ch. 1 — Traffic Rules (RVV 1990)', 'Road position, overtaking, equal intersections, right-of-way, trams, cyclists & roundabouts', '/theory/en/traffic-rules', true],
      ['Ch. 2 & Cat. — Traffic Signs & Markings', 'RVV A–L road signs, B6 vs B7, E1 vs E2, traffic lights, matrix lane X/arrows & shark’s teeth', '/guides/en/dutch-traffic-signs-rvv', false],
      ['Ch. 3 — Speed, Motorways & Eco-Zones', '100 km/h daytime vs 130 km/h night, 15 km/h woonerf, 90 km/h trailers, Milieuzone & Zero-Emissie', '/guides/en/cbr-speed-limits-motorways-environmental-zones', false],
      ['Ch. 4 — Safety, Alcohol & Hazard Perception', '0.5‰ vs 0.2‰ beginner alcohol limit, drugs/medication, fatigue, blind spots & brake/release-gas logic', '/guides/en/cbr-hazard-perception-priority', false],
      ['Ch. 5 — Road Traffic Act & Licences', 'Wegenverkeerswet Art. 5/6, beginner licence 2-point rule, insurance (WA), APK schedule & documents', '/guides/en/cbr-vehicle-apk-lights-trailers-law', false],
      ['Ch. 6–8 — Vehicle, Lights, Trailers & Controllers', '1.6 mm tyre tread, fog lights (<50m/<200m), red vs amber warnings, 750 kg trailers, police & convoys', '/guides/en/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
  nl: {
    badge: '📚 Volledig Overzicht van Alle 9 CBR Theorie-hoofdstukken',
    title: 'Wat Leer je in de 9 Hoofdstukken van de CBR Auto Theorie?',
    desc: 'Hoofdstuk 1 is volledig gratis te lezen. Hieronder vind je de openbare samenvattingen van Hoofdstuk 2 t/m 9 zodat je alle CBR-onderwerpen direct kunt doornemen:',
    colCh: 'Hoofdstuk',
    colTopic: 'Belangrijkste CBR Examenregels',
    colAccess: 'Gratis Gids / Toegang',
    freeFull: 'Lees Hoofdstuk 1 Gratis →',
    guideSum: 'Lees Openbare Samenvatting →',
    rows: [
      ['Hfdst. 1 — Verkeersregels (RVV 1990)', 'Plaats op de weg, inhalen, voorrang op kruispunten, trams, fietsers en rotondes', '/theory/nl/traffic-rules', true],
      ['Hfdst. 2 & Cat. — Verkeersborden & Tekens', 'RVV-groepen A–L, B6 vs B7, E1 vs E2, verkeerslichten, matrixborden en haaientanden', '/guides/nl/dutch-traffic-signs-rvv', false],
      ['Hfdst. 3 — Snelheid, Snelweg & Milieuzones', '100 km/u (06–19u) vs 130 km/u, 15 km/u erf, 90 km/u aanhanger, milieuzone & zero-emissie', '/guides/nl/cbr-speed-limits-motorways-environmental-zones', false],
      ['Hfdst. 4 — Veiligheid, Alcohol & Gevaarherkenning', '0,5‰ vs 0,2‰ beginnerslimiet, medicijnen/drugs, vermoeidheid, dode hoek en remmen/gas loslaten', '/guides/nl/cbr-hazard-perception-priority', false],
      ['Hfdst. 5 — Wegenverkeerswet & Rijbewijs', 'WVW art. 5/6, beginnersrijbewijs (2 punten), WA-verzekering, APK-schema en documenten', '/guides/nl/cbr-vehicle-apk-lights-trailers-law', false],
      ['Hfdst. 6–8 — Voertuig, Verlichting & Aanwijzingen', '1,6 mm bandenprofiel, mistlicht (<50m/<200m), rode/gele lampjes, aanhangers en verkeersregelaars', '/guides/nl/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
  tr: {
    badge: '📚 9 Bölümlük CBR Teori Müfredatı Genel Özeti',
    title: '9 CBR Teori Bölümünün Tamamında Hangi Konular Var?',
    desc: '1. Bölüm tam metin olarak tamamen ücretsizdir. Diğer kilitli teori bölümlerinin (Bölüm 2–9) sınavda en çok çıkan kurallarını aşağıdaki ücretsiz özet rehberlerimizden hemen inceleyebilirsiniz:',
    colCh: 'Bölüm',
    colTopic: 'Sınavda Çıkan Temel Kurallar',
    colAccess: 'Ücretsiz Özet / Erişim',
    freeFull: '1. Bölümü Ücretsiz Oku →',
    guideSum: 'Ücretsiz Bölüm Özetini Oku →',
    rows: [
      ['Bölüm 1 — Trafik Kuralları (RVV 1990)', 'Yoldaki konum, sollama, eşdeğer kavşaklarda öncelik, tramvay, bisikletliler ve döner kavşaklar', '/theory/tr/traffic-rules', true],
      ['Bölüm 2 & Kat. — Trafik Levhaları ve Çizgiler', 'A–L levha grupları, B6/B7 farkı, E1/E2 park kuralları, trafik ışıkları, otoyol matris ekranları ve köpekbalığı dişleri', '/guides/tr/dutch-traffic-signs-rvv', false],
      ['Bölüm 3 — Hız Sınırları, Otoyol ve Çevre Bölgeleri', '06–19 arası 100 km/s vs 130 km/s, woonerf 15 km/s, römork 90 km/s, Milieuzone & Sıfır Emisyon bölgeleri', '/guides/tr/cbr-speed-limits-motorways-environmental-zones', false],
      ['Bölüm 4 — Güvenlik, Alkol ve Tehlike Algısı', '0,5‰ vs acemi sürücü 0,2‰ alkol sınırı, ilaç/uyuşturucu, yorgunluk, kör nokta ve fren/gaz bırakma mantığı', '/guides/tr/cbr-hazard-perception-priority', false],
      ['Bölüm 5 — Karayolları Kanunu ve Ehliyet Kuralları', 'Wegenverkeerswet Madde 5/6, acemi ehliyet 2 ceza puanı sistemi, WA sigorta ve APK muayene takvimi', '/guides/tr/cbr-vehicle-apk-lights-trailers-law', false],
      ['Bölüm 6–8 — Araç, Aydınlatma, Römork ve Görevliler', '1,6 mm lastik diş derinliği, sis farları (<50m/<200m), kırmızı/sarı ikaz ışıkları, 750 kg römork ve trafik görevlileri', '/guides/tr/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
  ar: {
    badge: '📚 ملخص شامل لجميع فصول منهج CBR التسعة',
    title: 'ماذا تغطي فصول نظرية القيادة الهولندية التسعة؟',
    desc: 'الفصل الأول متاح بالكامل مجاناً، وفي الجدول التالي تجد الملخصات العامة المجانية للفصول من 2 إلى 9 مع أهم القواعد التي تتكرر في امتحان CBR:',
    colCh: 'الفصل',
    colTopic: 'أهم قواعد امتحان CBR المشمولة',
    colAccess: 'الملخص المجاني',
    freeFull: 'اقرأ الفصل الأول مجاناً ←',
    guideSum: 'اقرأ ملخص الفصل المجاني ←',
    rows: [
      ['الفصل 1 — قواعد المرور (RVV 1990)', 'الموقع على الطريق، التجاوز، الأولوية في التقاطعات، الترام، الدراجات والدوارات', '/theory/ar/traffic-rules', true],
      ['الفصل 2 — إشارات المرور وعلامات الطريق', 'مجموعات الإشارات A–L، الفرق بين B6 وB7 وE1 وE2، الإشارات الضوئية وأسنان القرش', '/guides/ar/dutch-traffic-signs-rvv', false],
      ['الفصل 3 — حدود السرعة والمناطق البيئية', '100 كم/س نهاراً مقابل 130 ليلاً، 15 كم/س في السكن، 90 للمقطورة ومناطق Milieuzone', '/guides/ar/cbr-speed-limits-motorways-environmental-zones', false],
      ['الفصل 4 — السلامة والكحول وإدراك المخاطر', 'حد الكحول 0.5‰ مقابل 0.2‰ للمبتدئين، التعب، النقطة العمياء وقرار الفرملة أو رفع الوقود', '/guides/ar/cbr-hazard-perception-priority', false],
      ['الفصل 5 — قانون السير والرخصة وفحص APK', 'قانون الطرق الهولندي، نظام النقطتين للمبتدئين، التأمين الإلزامي ومواعيد فحص APK', '/guides/ar/cbr-vehicle-apk-lights-trailers-law', false],
      ['الفصول 6–8 — المركبة والأضواء والمقطورات والمنظمون', 'عمق الإطار 1.6 ملم، ضوء الضباب (<50م)، أضواء التحذير الحمراء والصفراء وتعليمات الشرطة', '/guides/ar/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
  ru: {
    badge: '📚 Обзор всех 9 глав курса теории CBR (RVV 1990)',
    title: 'Что входит в 9 глав теории вождения CBR Нидерландов?',
    desc: 'Глава 1 полностью открыта бесплатно. Ниже представлены бесплатные открытые конспекты Глав 2–9 по всем темам экзамена CBR:',
    colCh: 'Глава',
    colTopic: 'Ключевые правила экзамена CBR',
    colAccess: 'Бесплатный конспект',
    freeFull: 'Читать Главу 1 бесплатно →',
    guideSum: 'Читать конспект темы →',
    rows: [
      ['Глава 1 — Правила движения (RVV 1990)', 'Положение на дороге, обгон, равнозначные перекрестки, трамваи, велосипедисты и круги', '/theory/ru/traffic-rules', true],
      ['Глава 2 — Дорожные знаки и разметка', 'Категории знаков A–L, разница B6/B7 и E1/E2, светофоры, матричные табло и «акульи зубы»', '/guides/ru/dutch-traffic-signs-rvv', false],
      ['Глава 3 — Скорость, автомагистрали и экозоны', '100 км/ч днем и 130 км/ч ночью, 15 км/ч woonerf, 90 км/ч с прицепом и зоны Milieuzone', '/guides/ru/cbr-speed-limits-motorways-environmental-zones', false],
      ['Глава 4 — Безопасность, алкоголь и опасности', 'Норма 0,5‰ и 0,2‰ для новичков, лекарства, усталость, слепые зоны и торможение/сброс газа', '/guides/ru/cbr-hazard-perception-priority', false],
      ['Глава 5 — Закон о дорожном движении и APK', 'Wegenverkeerswet, штрафные баллы новичка, страховка WA и график техосмотра APK', '/guides/ru/cbr-vehicle-apk-lights-trailers-law', false],
      ['Главы 6–8 — Автомобиль, свет, прицепы и регулировщики', 'Протектор 1,6 мм, противотуманные фонари (<50 м), красные/желтые индикаторы и регулировщики', '/guides/ru/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
  fa: {
    badge: '📚 مرور کامل سرفصل‌های ۹ گانه تئوری CBR هلند',
    title: 'در ۹ فصل کتاب تئوری رانندگی CBR چه مباحثی آموزش داده می‌شود؟',
    desc: 'متن کامل فصل ۱ کاملاً رایگان است. در جدول زیر نیز خلاصه عمومی و رایگان فصل‌های ۲ تا ۹ برای مرور تمام نکات کلیدی آزمون CBR در دسترس شماست:',
    colCh: 'فصل',
    colTopic: 'مهم‌ترین قوانین امتحانی CBR',
    colAccess: 'خلاصه رایگان',
    freeFull: 'مطالعه رایگان فصل ۱ ←',
    guideSum: 'مطالعه خلاصه رایگان مبحث ←',
    rows: [
      ['فصل ۱ — قوانین راهنمایی و رانندگی (RVV 1990)', 'موقعیت در جاده، سبقت، تقاطع‌های هم‌عرض، تراموا، دوچرخه‌سواران و میدان‌ها', '/theory/fa/traffic-rules', true],
      ['فصل ۲ — تابلوها، چراغ‌ها و خط‌کشی‌ها', 'گروه‌های تابلویی A تا L، تفاوت B6/B7 و E1/E2، تابلوهای ماتریسی و دندان‌های کوسه', '/guides/fa/dutch-traffic-signs-rvv', false],
      ['فصل ۳ — محدودیت سرعت، آزادراه و مناطق زیست‌محیطی', 'سرعت ۱۰۰ در روز و ۱۳۰ در شب، ۱۵ در Woonerf، سرعت ۹۰ با یدک‌کش و Milieuzone', '/guides/fa/cbr-speed-limits-motorways-environmental-zones', false],
      ['فصل ۴ — ایمنی، الکل و تشخیص خطر', 'سقف الکل ۰٫۵‰ و ۰٫۲‰ برای تازه‌کارها، خستگی، نقطه کور و منطق ترمز/رها کردن گاز', '/guides/fa/cbr-hazard-perception-priority', false],
      ['فصل ۵ — قانون ترافیک، گواهینامه و معاینه فنی APK', 'قانون Wegenverkeerswet، سیستم ۲ امتیازی تازه‌کارها، بیمه اجباری WA و زمان‌بندی APK', '/guides/fa/cbr-vehicle-apk-lights-trailers-law', false],
      ['فصل‌های ۶ تا ۸ — فنی خودرو، چراغ‌ها، یدک‌کش و مأموران', 'آج ۱٫۶ میلی‌متری تایر، چراغ مه‌شکن (<۵۰ متر)، چراغ‌های قرمز/نارنجی و پلیس ترافیک', '/guides/fa/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
  es: {
    badge: '📚 Resumen Público del Temario Completo de 9 Capítulos CBR',
    title: '¿Qué Incluyen los 9 Capítulos del Temario Teórico CBR?',
    desc: 'El Capítulo 1 completo es 100 % gratuito. A continuación tienes los resúmenes abiertos de los Capítulos 2 a 9 con todas las reglas clave de examen:',
    colCh: 'Capítulo',
    colTopic: 'Reglas Clave del Examen CBR',
    colAccess: 'Resumen Gratis',
    freeFull: 'Leer Capítulo 1 Gratis →',
    guideSum: 'Leer Resumen Público →',
    rows: [
      ['Cap. 1 — Normas de Tráfico (RVV 1990)', 'Posición en la calzada, adelantamientos, prioridad en cruces, tranvías, ciclistas y glorietas', '/theory/es/traffic-rules', true],
      ['Cap. 2 — Señales, Semáforos y Marcas Viales', 'Categorías RVV A–L, diferencia B6/B7 y E1/E2, paneles матриx en autopista y dientes de tiburón', '/guides/es/dutch-traffic-signs-rvv', false],
      ['Cap. 3 — Límites de Velocidad y Zonas Ambientales', '100 km/h de día vs 130 km/h de noche, 15 km/h en woonerf, 90 km/h con remolque y Milieuzone', '/guides/es/cbr-speed-limits-motorways-environmental-zones', false],
      ['Cap. 4 — Seguridad, Alcohol y Percepción de Peligros', 'Tasa 0,5 ‰ vs 0,2 ‰ noveles, fármacos, fatiga, ángulo muerto y frenar vs soltar gas', '/guides/es/cbr-hazard-perception-priority', false],
      ['Cap. 5 — Ley de Tráfico, Permisos e Inspección APK', 'Wegenverkeerswet, sistema de 2 puntos para noveles, seguro obligatorio WA y plazos APK', '/guides/es/cbr-vehicle-apk-lights-trailers-law', false],
      ['Cap. 6–8 — Vehículo, Luces, Remolques y Agentes', 'Dibujo mínimo 1,6 mm, luz antiniebla (<50 m), testigos rojos/ámbar y agentes de tráfico', '/guides/es/cbr-vehicle-apk-lights-trailers-law', false],
    ],
  },
};

const EXTRA_CSS = `
.mini-quiz{margin:36px 0;padding:26px 24px;border-radius:22px;background:linear-gradient(145deg,#ffffff 0%,#f8fafc 100%);border:1.5px solid rgba(0,97,255,.22);box-shadow:0 16px 38px rgba(15,23,42,.06)}
.mini-quiz h2{margin:8px 0 6px!important;border:0!important;padding:0!important;font-size:clamp(19px,2.6vw,23px)!important}
.mini-quiz .mq-sub{color:#475569;font-size:14.5px;margin-bottom:18px}
.mq-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px 18px;margin-bottom:14px}
.mq-q{font-weight:800;font-size:15px;color:#0f172a;margin-bottom:11px}
.mq-opts{display:flex;flex-direction:column;gap:8px}
.mq-btn{text-align:start;font-family:inherit;font-size:14px;font-weight:600;color:#1e293b;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:11px;padding:10px 14px;cursor:pointer;transition:all .15s}
.mq-btn:hover:not(:disabled){border-color:#0061ff;background:#eff6ff;color:#0061ff}
.mq-btn.is-correct{background:#dcfce7!important;border-color:#16a34a!important;color:#14532d!important}
.mq-btn.is-wrong{background:#fee2e2!important;border-color:#dc2626!important;color:#7f1d1d!important}
.mq-fb{display:none;margin-top:10px;padding:10px 13px;border-radius:10px;font-size:13.5px;line-height:1.55}
.mq-fb.ok{display:block;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.mq-fb.bad{display:block;background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.mq-foot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid #e2e8f0}
.mq-score{font-weight:800;font-size:14.5px;color:#0f172a}
.mq-actions{display:flex;gap:10px;flex-wrap:wrap}
.mq-reset{font-family:inherit;font-size:13px;font-weight:700;padding:9px 14px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#334155;cursor:pointer}
.curr-box{margin:34px 0;padding:28px 24px;border-radius:24px;background:#ffffff;border:1px solid rgba(15,23,42,.1);box-shadow:0 14px 36px rgba(15,23,42,.05)}
.curr-box h2{font-size:clamp(20px,2.8vw,25px);font-weight:800;color:#0b132b;margin:8px 0 10px}
.curr-box p.curr-lead{color:#475569;font-size:15px;margin-bottom:18px}
`;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMiniQuizHtml(slug, lang) {
  const items = MINI_QUIZZES[slug]?.[lang];
  const ui = MINI_QUIZ_UI[lang];
  if (!items || !ui) return '';

  const cards = items
    .map((item, qIdx) => {
      const opts = item.opts
        .map(
          (opt, oIdx) =>
            `<button type="button" class="mq-btn" data-q="${qIdx}" data-opt="${oIdx}">${esc(opt)}</button>`
        )
        .join('');
      return `
        <div class="mq-card" data-ans="${item.ans}" data-correct-text="${esc(item.opts[item.ans])}" data-exp="${esc(item.exp)}">
          <div class="mq-q">${qIdx + 1}. ${esc(item.q)}</div>
          <div class="mq-opts">${opts}</div>
          <div class="mq-fb" aria-live="polite"></div>
        </div>`;
    })
    .join('');

  return `
      <section class="mini-quiz" id="cbr-mini-quiz" data-ok="${esc(ui.correct)}" data-bad="${esc(ui.wrong)}">
        <span class="eyebrow">${esc(ui.badge)}</span>
        <h2>${esc(ui.heading)}</h2>
        <p class="mq-sub">${esc(ui.sub)}</p>
        ${cards}
        <div class="mq-foot">
          <div class="mq-score">${esc(ui.scoreLabel)} <span id="mqScoreVal">0</span> / ${items.length}</div>
          <div class="mq-actions">
            <button type="button" class="mq-reset" id="mqResetBtn">${esc(ui.retry)}</button>
            <a class="btn-p" style="padding:9px 16px;font-size:13px" href="/deneme-${lang}">${esc(ui.fullCta)}</a>
          </div>
        </div>
      </section>
      <script>
      (function(){
        var root=document.getElementById('cbr-mini-quiz');
        if(!root)return;
        var scoreEl=document.getElementById('mqScoreVal');
        var resetBtn=document.getElementById('mqResetBtn');
        var score=0;
        root.addEventListener('click',function(e){
          var btn=e.target.closest('.mq-btn');
          if(!btn||btn.disabled)return;
          var card=btn.closest('.mq-card');
          var ans=Number(card.getAttribute('data-ans'));
          var chosen=Number(btn.getAttribute('data-opt'));
          var btns=card.querySelectorAll('.mq-btn');
          btns.forEach(function(b,idx){
            b.disabled=true;
            if(idx===ans)b.classList.add('is-correct');
          });
          var fb=card.querySelector('.mq-fb');
          if(chosen===ans){
            score++;
            scoreEl.textContent=String(score);
            fb.className='mq-fb ok';
            fb.textContent=root.getAttribute('data-ok')+' '+card.getAttribute('data-exp');
          }else{
            btn.classList.add('is-wrong');
            fb.className='mq-fb bad';
            fb.textContent=root.getAttribute('data-bad')+' '+card.getAttribute('data-correct-text')+' — '+card.getAttribute('data-exp');
          }
        });
        if(resetBtn){
          resetBtn.addEventListener('click',function(){
            score=0;
            scoreEl.textContent='0';
            root.querySelectorAll('.mq-card').forEach(function(card){
              card.querySelectorAll('.mq-btn').forEach(function(b){b.disabled=false;b.classList.remove('is-correct','is-wrong');});
              var fb=card.querySelector('.mq-fb');
              fb.className='mq-fb';
              fb.textContent='';
            });
          });
        }
      })();
      </script>`;
}

function buildMiniQuizSchema(slug, lang, canonicalUrl, title) {
  const items = MINI_QUIZZES[slug]?.[lang];
  if (!items) return null;
  return {
    '@type': 'Quiz',
    name: `${title} — CBR Practice Check`,
    url: `${canonicalUrl}#cbr-mini-quiz`,
    inLanguage: lang,
    educationalLevel: 'Beginner',
    hasPart: items.map((it) => ({
      '@type': 'Question',
      eduQuestionType: 'Multiple choice',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.opts[it.ans],
      },
    })),
  };
}

function renderCurriculumOverviewHtml(lang) {
  const c = CURRICULUM_BOX[lang];
  if (!c) return '';
  const rowsHtml = c.rows
    .map(
      ([ch, topic, link, isFullFree]) =>
        `<tr><td><strong>${esc(ch)}</strong></td><td>${esc(topic)}</td><td><a href="${link}" style="font-weight:700;text-decoration:none">${esc(isFullFree ? c.freeFull : c.guideSum)}</a></td></tr>`
    )
    .join('');
  return `
    <section class="curr-box">
      <span class="eyebrow">${esc(c.badge)}</span>
      <h2>${esc(c.title)}</h2>
      <p class="curr-lead">${esc(c.desc)}</p>
      <div class="table-wrap" style="margin-bottom:0">
        <table>
          <thead><tr><th>${esc(c.colCh)}</th><th>${esc(c.colTopic)}</th><th>${esc(c.colAccess)}</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </section>`;
}

const EXTRA_GUIDES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 5: DUTCH SPEED LIMITS, MOTORWAYS, ENVIRONMENTAL ZONES & ALCOHOL (CH 3 & 4)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'cbr-speed-limits-motorways-environmental-zones',
    tag: 'Speed & Safety',
    en: {
      title: 'Dutch Speed Limits, Motorways (100/130 km/h), Alcohol & Environmental Zones (2026)',
      metaTitle: 'Netherlands Speed Limits 2026 — 100 vs 130 km/h, Trailers, Alcohol & Milieuzone | ExamTheorie',
      description: 'Complete 2026 CBR summary of Chapters 3 & 4: Dutch speed limits (15/30/50/80/100/130 km/h), caravan/trailer 90 km/h limit, Milieuzone & Zero-Emissie zones, and 0.2‰ vs 0.5‰ alcohol limits.',
      lead: 'Speed limits, motorway rules, environmental zones, and alcohol/drug thresholds appear in almost every 2026 CBR car theory exam. This public summary of Chapters 3 and 4 covers every exact number you must memorize.',
      body: `
        <h2>1. Complete 2026 Dutch Speed Limit Table (Passenger Cars &amp; Trailers)</h2>
        <p>Unless traffic signs or overhead electronic matrix panels indicate a lower limit, the statutory RVV 1990 speed limits in the Netherlands are:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Road Type &amp; RVV Sign</th><th>Passenger Car</th><th>Car + Light Trailer (&le;3,500 kg)</th></tr></thead>
          <tbody>
            <tr><td><strong>Woonerf / Home Zone (G5)</strong></td><td>15 km/h (walking pace)</td><td>15 km/h</td></tr>
            <tr><td><strong>Built-up Area (H1 — Binnen bebouwde kom)</strong></td><td>50 km/h (or signed 30 km/h zone)</td><td>50 km/h (or 30 km/h)</td></tr>
            <tr><td><strong>Outside Built-up Area (H2 — Buiten bebouwde kom)</strong></td><td>80 km/h (or signed 60 km/h zone)</td><td>80 km/h (or 60 km/h)</td></tr>
            <tr><td><strong>Expressway / Autoweg (G3)</strong></td><td>100 km/h</td><td><strong>90 km/h</strong></td></tr>
            <tr><td><strong>Motorway / Autosnelweg (G1) — 06:00 to 19:00</strong></td><td><strong>100 km/h</strong></td><td><strong>90 km/h</strong></td></tr>
            <tr><td><strong>Motorway / Autosnelweg (G1) — 19:00 to 06:00</strong></td><td><strong>130 km/h</strong> (unless signed 100/120)</td><td><strong>90 km/h</strong> (80 km/h if trailer &gt;3,500 kg)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>CBR Exam Trap:</strong> A speed painted on the asphalt alone is only a reminder — legal speed limits come from road type, RVV signs (A1), or overhead electronic matrix signs (which always override roadside A1 signs when lower!).</div>

        <h2>2. Motorway Rules, Rush-Hour Lanes (Spitsstrook) &amp; Hard Shoulder</h2>
        <ul>
          <li><strong>Minimum Entry Speed Requirement:</strong> To use an <em>autoweg</em> (G3), your vehicle must be legally capable of and allowed to drive at least <strong>50 km/h</strong>; on an <em>autosnelweg</em> (G1), at least <strong>60 km/h</strong> (there is no fixed statutory minimum driving speed in congestion, provided you do not endanger traffic under Article 5 WVW).</li>
          <li><strong>Hard Shoulder (Vluchtstrook):</strong> Use ONLY in genuine emergencies (breakdown or acute medical crisis) — never to make a phone call, check navigation, or let a passenger out.</li>
          <li><strong>Rush-Hour Lane (Spitsstrook):</strong> When green overhead arrows open a rush-hour lane on the right, you may (and should, under the keep-right rule) cross the solid white edge line to drive there. A red X means the lane is strictly closed.</li>
        </ul>

        <h2>3. Environmental Zones (Milieuzone) &amp; Zero-Emission Zones (2026)</h2>
        <p>Many Dutch cities enforce clean-air zones signed with C22a (<em>Milieuzone</em>, primarily restricting older diesel cars below Euro 4/5 depending on municipality) and C22c (<em>Zero-emissiezone</em> for commercial vans and lorries). Passenger cars running on petrol, hybrid, LPG, or electric power are currently unaffected by standard diesel passenger-car milieuzones, but always read the emission sub-plate beneath the sign.</p>

        <h2>4. Alcohol (0.2‰ vs 0.5‰), Drugs, Medication &amp; Fatigue</h2>
        <ul>
          <li><strong>Beginner Drivers (Beginnersrijbewijs — first 5 years, or 7 years if obtained at age 17):</strong> Maximum <strong>0.2‰</strong> blood alcohol (88 &micro;g/l breath) — less than one standard glass!</li>
          <li><strong>Experienced Drivers (&gt;5 years):</strong> Maximum <strong>0.5‰</strong> blood alcohol (220 &micro;g/l breath).</li>
          <li><strong>Medication Stickers &amp; Drugs:</strong> Driving under yellow/red warning-label medication that impairs reaction time, or illegal drugs (zero tolerance; combining drugs + alcohol multiplies crash risk exponentially), is a criminal offence under Article 8 WVW.</li>
          <li><strong>2-Second Following Distance:</strong> Maintain at least <strong>2 seconds</strong> of distance in dry weather (more in rain, fog, or behind lorries) and take a 15-minute break every 2 hours of continuous driving.</li>
        </ul>`,
      faqs: [
        ['When can you drive 130 km/h in the Netherlands?', 'Only on motorways (autosnelwegen, sign G1) between 19:00 and 06:00 where no 100 km/h or 120 km/h sign restricts the speed. Between 06:00 and 19:00 the nationwide motorway limit is 100 km/h.'],
        ['How fast may a car with a caravan drive on a Dutch motorway?', 'Up to 90 km/h if the trailer or caravan has a maximum authorized mass up to 3,500 kg (80 km/h if over 3,500 kg).'],
        ['What is the alcohol limit for new drivers in the Netherlands?', '0.2 promille (88 µg/l breath) during the first 5 years after obtaining your first driving licence (7 years if obtained before age 18).'],
      ],
    },
    nl: {
      title: 'Maximumsnelheden Nederland, Snelweg (100/130), Alcohol & Milieuzones (2026)',
      metaTitle: 'Maximumsnelheden CBR 2026 — 100/130 km/u, Aanhanger, Alcohol & Milieuzone | ExamTheorie',
      description: 'Openbare samenvatting van Hoofdstuk 3 & 4 voor het CBR theorie-examen 2026: alle snelheden (15/50/80/100/130 km/u), caravan 90 km/u, spitsstrook, milieuzones en alcohollimiet (0,2‰ vs 0,5‰).',
      lead: 'Maximumsnelheden, snelwegregels, milieuzones en alcoholgrenzen komen in vrijwel elk CBR auto theorie-examen terug. Dit overzicht vat alle exacte getallen uit Hoofdstuk 3 en 4 helder samen.',
      body: `
        <h2>1. Alle Nederlandse Maximumsnelheden op een Rij (2026)</h2>
        <p>Tenzij verkeersborden of elektronische matrixborden een lagere snelheid aangeven, gelden volgens het RVV 1990 de volgende limieten:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Wegtype &amp; Bord</th><th>Personenauto</th><th>Auto + Aanhanger (&le;3.500 kg)</th></tr></thead>
          <tbody>
            <tr><td><strong>Erf / Woonerf (G5)</strong></td><td>15 km/u (stapvoets)</td><td>15 km/u</td></tr>
            <tr><td><strong>Binnen de bebouwde kom (H1)</strong></td><td>50 km/u (of 30 km/u-zone)</td><td>50 km/u (of 30 km/u)</td></tr>
            <tr><td><strong>Buiten de bebouwde kom (H2)</strong></td><td>80 km/u (of 60 km/u-zone)</td><td>80 km/u (of 60 km/u)</td></tr>
            <tr><td><strong>Autoweg (G3)</strong></td><td>100 km/u</td><td><strong>90 km/u</strong></td></tr>
            <tr><td><strong>Autosnelweg (G1) — 06:00 tot 19:00 uur</strong></td><td><strong>100 km/u</strong></td><td><strong>90 km/u</strong></td></tr>
            <tr><td><strong>Autosnelweg (G1) — 19:00 tot 06:00 uur</strong></td><td><strong>130 km/u</strong> (tenzij 100/120 op bord)</td><td><strong>90 km/u</strong> (80 km/u boven 3.500 kg)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>CBR Examenstrikvraag:</strong> Een getal dat alleen op het asfalt is geschilderd is géén officieel A1-bord. En een lagere snelheid op een elektronisch matrixbord boven de rijstrook gaat altijd vóór een vast bord langs de weg!</div>

        <h2>2. Snelwegregels, Spitsstrook en Vluchtstrook</h2>
        <ul>
          <li><strong>Toelatingssnelheid:</strong> Om een <em>autoweg</em> (G3) op te mogen moet een voertuig minimaal <strong>50 km/u</strong> kunnen én mogen rijden; op een <em>autosnelweg</em> (G1) is dat minimaal <strong>60 km/u</strong>.</li>
          <li><strong>Vluchtstrook:</strong> Alleen gebruiken in echte noodgevallen (pech of medische noodsituatie) — nooit om te bellen of de route in te stellen.</li>
          <li><strong>Spitsstrook:</strong> Bij een groene pijl boven de spitsstrook mag (en moet, vanwege rechts houden!) je over de doorgetrokken witte kantstreep rijden. Bij een rood kruis is de strook gesloten.</li>
        </ul>

        <h2>3. Milieuzones en Zero-emissiezones</h2>
        <p>Nederlandse steden gebruiken bord C22a (<em>Milieuzone</em>, gericht op oudere dieselvoertuigen afhankelijk van emissieklasse) en bord C22c (<em>Zero-emissiezone</em> voor bestel- en vrachtauto’s). Controleer altijd het onderbord met de toegestane emissieklassen.</p>

        <h2>4. Alcohol (0,2‰ vs 0,5‰), Drugs en Volgafstand</h2>
        <ul>
          <li><strong>Beginnend bestuurder (eerste 5 jaar, of 7 jaar bij rijbewijs op je 17e):</strong> Maximaal <strong>0,2 promille</strong> (88 &micro;g/l uitgeademde lucht).</li>
          <li><strong>Ervaren bestuurder (&gt;5 jaar):</strong> Maximaal <strong>0,5 promille</strong> (220 &micro;g/l).</li>
          <li><strong>2-secondenregel:</strong> Houd bij droog weer minimaal <strong>2 seconden</strong> volgafstand en neem elke 2 uur rijden minstens 15 minuten pauze.</li>
        </ul>`,
      faqs: [
        ['Wanneer mag je 130 km/u rijden op de Nederlandse snelweg?', 'Alleen tussen 19:00 en 06:00 uur op autosnelwegen waar geen bord 100 of 120 km/u staat. Overdag tussen 06:00 en 19:00 uur is de limiet overal maximaal 100 km/u.'],
        ['Hoe hard mag je met een caravan onder 3.500 kg op de snelweg?', 'Maximaal 90 km/u op zowel autowegen als autosnelwegen (boven 3.500 kg toegestane maximummassa geldt 80 km/u).'],
        ['Wat is de alcoholgrens voor een beginnende bestuurder?', 'Maximaal 0,2 promille (88 µg/l) gedurende de eerste 5 jaar (7 jaar als je op je 17e slaagt).'],
      ],
    },
    tr: {
      title: 'Hollanda Hız Sınırları (100/130 km/s), Otoyol, Alkol ve Çevre Bölgeleri (2026)',
      metaTitle: 'Hollanda Hız Sınırları 2026 — 100/130 km/s, Karavan, Alkol (0,2‰) ve Milieuzone | ExamTheorie',
      description: '2026 CBR teori sınavı Bölüm 3 ve 4 Türkçe özeti: Hollanda hız sınırları (15/50/80/100/130 km/s), karavan/römork 90 km/s kuralı, emniyet şeridi, Milieuzone ve 0,2‰ acemi alkol sınırı.',
      lead: 'Hız sınırları, gündüz/gece otoyol farkı, çevre bölgeleri (Milieuzone) ve alkol promil sınırları her CBR sınavında mutlaka sorulur. Kilitli 3. ve 4. bölümlerin en kritik sınav sayılarını tek tabloda topladık.',
      body: `
        <h2>1. 2026 Hollanda Hız Sınırları Tablosu (Otomobil ve Römork)</h2>
        <p>Trafik levhası veya elektronik otoyol matris ekranı daha düşük bir hız göstermediği sürece Hollanda genel hız sınırları şöyledir:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Yol Türü ve Levha</th><th>Binek Otomobil</th><th>Otomobil + Römork/Karavan (&le;3.500 kg)</th></tr></thead>
          <tbody>
            <tr><td><strong>Woonerf / Yaşam Alanı (G5)</strong></td><td>15 km/s (yürüme hızı)</td><td>15 km/s</td></tr>
            <tr><td><strong>Yerleşim Yeri İçi (H1 — Bebouwde kom)</strong></td><td>50 km/s (veya 30 km/s bölgesi)</td><td>50 km/s (veya 30 km/s)</td></tr>
            <tr><td><strong>Yerleşim Yeri Dışı (H2 — Buiten bebouwde kom)</strong></td><td>80 km/s (veya 60 km/s bölgesi)</td><td>80 km/s (veya 60 km/s)</td></tr>
            <tr><td><strong>Ekspres Yol / Autoweg (G3)</strong></td><td>100 km/s</td><td><strong>90 km/s</strong></td></tr>
            <tr><td><strong>Otoyol / Autosnelweg (G1) — 06:00–19:00 arası</strong></td><td><strong>100 km/s</strong></td><td><strong>90 km/s</strong></td></tr>
            <tr><td><strong>Otoyol / Autosnelweg (G1) — 19:00–06:00 arası</strong></td><td><strong>130 km/s</strong> (100/120 levhası yoksa)</td><td><strong>90 km/s</strong> (&gt;3.500 kg ise 80 km/s)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>CBR Tuzak Sorusu:</strong> Asfalt üzerine boyanmış hız rakamı tek başına yasal A1 hız levhası yerine geçmez. Ayrıca otoyolda tepedeki elektronik matris ekranda yazan düşük hız her zaman yol kenarındaki sabit levhadan üstündür!</div>

        <h2>2. Otoyol Giriş Şartı, Emniyet Şeridi (Vluchtstrook) ve Zirve Şeridi (Spitsstrook)</h2>
        <ul>
          <li><strong>Yola Giriş Asgari Hız Yeteneği:</strong> <em>Autoweg</em> (G3) yoluna girecek aracın en az <strong>50 km/s</strong>, <em>Autosnelweg</em> (G1) otoyoluna girecek aracın en az <strong>60 km/s</strong> hız yapabilmesi ve buna yasal izni olması şarttır.</li>
          <li><strong>Emniyet Şeridi (Vluchtstrook):</strong> Yalnızca gerçek arıza veya tıbbi acil durumda kullanılır; telefonla konuşmak veya navigasyon ayarlamak için durmak ağır cezaya tabidir.</li>
          <li><strong>Zirve Saat Şeridi (Spitsstrook):</strong> Yukarıda yeşil ok yandığında sağdaki düz beyaz çizgi geçilerek bu şerit kullanılır (sağdan gitme kuralı gereği). Kırmızı çarpı (X) yanıyorsa şerit kesinlikle kapalıdır.</li>
        </ul>

        <h2>3. Çevre Bölgeleri (Milieuzone ve Zero-Emissie)</h2>
        <p>Büyük Hollanda şehirlerinde C22a (<em>Milieuzone</em> — eski Euro sınıfı dizel araç kısıtlaması) ve C22c (<em>Zero-emissiezone</em> — ticari kamyonet ve kamyonlar için sıfır emisyon) levhaları bulunur; giriş izni her zaman alt levhadaki emisyon sınıfına göre belirlenir.</p>

        <h2>4. Alkol Sınırları (0,2‰ ve 0,5‰), İlaçlar ve 2 Saniye Takip Mesafesi</h2>
        <ul>
          <li><strong>Acemi Sürücüler (İlk 5 yıl — 17 yaşında ehliyet alanlarda 7 yıl):</strong> Azami <strong>0,2 promil</strong> (88 &micro;g/l nefes) — neredeyse sıfır tolerans!</li>
          <li><strong>Deneyimli Sürücüler (5 yıldan fazla):</strong> Azami <strong>0,5 promil</strong> (220 &micro;g/l nefes).</li>
          <li><strong>Takip Mesafesi ve Mola:</strong> Kuru havada öndeki araçla en az <strong>2 saniye</strong> mesafe bırakın ve her 2 saatlik sürüşte en az 15 dakika dinlenme molası verin.</li>
        </ul>`,
      faqs: [
        ['Hollanda otoyollarında ne zaman 130 km/s hız yapılabilir?', 'Yalnızca 19:00 ile 06:00 saatleri arasında, 100 veya 120 km/s kısıtlama levhası bulunmayan otoyol (G1) kesimlerinde. Gündüz 06:00–19:00 arası sınır her yerde 100 km/s’dir.'],
        ['Karavan veya römork çeken otomobil otoyolda en fazla kaçla gidebilir?', 'Römorkun azami yüklü ağırlığı 3.500 kg’ı geçmiyorsa autoweg ve otoyolda azami hız 90 km/s’dir (3.500 kg üzeriyse 80 km/s).'],
        ['Hollanda’da yeni ehliyet alanlar için alkol sınırı kaçtır?', 'İlk 5 yıl boyunca (17 yaşında başlayanlarda 7 yıl) azami 0,2 promildir.'],
      ],
    },
    ar: {
      title: 'حدود السرعة في هولندا (100/130 كم/س)، الطرق السريعة، الكحول والمناطق البيئية (2026)',
      metaTitle: 'حدود السرعة في هولندا 2026 — 100/130 كم/س، المقطورة وحد الكحول 0.2‰ | ExamTheorie',
      description: 'ملخص مجاني للفصلين 3 و4 لامتحان التيوري الهولندي CBR لعام 2026: جدول السرعات (15/50/80/100/130 كم/س)، سرعة المقطورة 90 كم/س، المناطق البيئية وحد الكحول 0.2‰ للمبتدئين.',
      lead: 'تتكرر أسئلة السرعات النهارية والليلية، وحارة الطوارئ، والمناطق البيئية، وحدود الكحول في كل امتحان CBR تقريباً. إليك الملخص الشامل لأهم أرقام الفصلين 3 و4.',
      body: `
        <h2>1. جدول حدود السرعة الرسمية في هولندا لعام 2026</h2>
        <p>ما لم تفرض اللوحات أو الشاشات الإلكترونية العلوية سرعة أقل، تطبق الحدود القانونية التالية:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>نوع الطريق والإشارة</th><th>سيارة ركاب</th><th>سيارة + مقطورة خفيفة (&le;3500 كجم)</th></tr></thead>
          <tbody>
            <tr><td><strong>منطقة سكنية مشتركة Woonerf (G5)</strong></td><td>15 كم/س</td><td>15 كم/س</td></tr>
            <tr><td><strong>داخل المناطق العمرانية (H1)</strong></td><td>50 كم/س (أو منطقة 30 كم/س)</td><td>50 كم/س (أو 30 كم/س)</td></tr>
            <tr><td><strong>خارج المناطق العمرانية (H2)</strong></td><td>80 كم/س (أو منطقة 60 كم/س)</td><td>80 كم/س (أو 60 كم/س)</td></tr>
            <tr><td><strong>طريق سريع فرعي Autoweg (G3)</strong></td><td>100 كم/س</td><td><strong>90 كم/س</strong></td></tr>
            <tr><td><strong>طريق سريع Autosnelweg (G1) — 06:00 إلى 19:00</strong></td><td><strong>100 كم/س</strong></td><td><strong>90 كم/س</strong></td></tr>
            <tr><td><strong>طريق سريع Autosnelweg (G1) — 19:00 إلى 06:00</strong></td><td><strong>130 كم/س</strong> (إن لم توجد لوحة 100/120)</td><td><strong>90 كم/س</strong> (80 كم/س فوق 3500 كجم)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>فخ امتحاني شهير:</strong> الرقم المرسوم على الأسفلت وحده ليس إشارة سرعة إلزامية، والشاشة الإلكترونية العلوية فوق المسار تتغلب دائماً على اللوحة المعدنية الجانبية إذا أظهرت سرعة أقل!</div>

        <h2>2. قواعد الطريق السريع وحارة الطوارئ (Vluchtstrook) وحارة الذروة (Spitsstrook)</h2>
        <ul>
          <li><strong>السرعة الدنيا المسموح بها لدخول الطريق:</strong> لدخول <em>Autoweg</em> يجب أن تكون المركبة قادرة ومسموحاً لها بالسير بسرعة <strong>50 كم/س</strong> على الأقل، ولدخول <em>Autosnelweg</em> بسرعة <strong>60 كم/س</strong> على الأقل.</li>
          <li><strong>حارة الطوارئ (Vluchtstrook):</strong> تُستخدم فقط في حالات العطل المفاجئ أو الطوارئ الطبية القصوى.</li>
          <li><strong>حارة الذروة (Spitsstrook):</strong> عند إضاءة السهم الأخضر يُسمح بعبور الخط الأبيض المتصل لاستخدام المسار؛ أما علامة X الحمراء فتعني أن المسار مغلق تماماً.</li>
        </ul>

        <h2>3. المناطق البيئية (Milieuzone) وحدود الكحول (0.2‰ مقابل 0.5‰)</h2>
        <ul>
          <li><strong>السائق المبتدئ (أول 5 سنوات — أو 7 سنوات لمن حصل عليها بعمر 17):</strong> الحد الأقصى للكحول <strong>0.2 بروميل</strong> (88 ميكروغرام/لتر).</li>
          <li><strong>السائق المتمرس (أكثر من 5 سنوات):</strong> الحد الأقصى <strong>0.5 بروميل</strong> (220 ميكروغرام/لتر).</li>
          <li><strong>مسافة الأمان:</strong> حافظ على مسافة زمنية لا تقل عن <strong>ثانيتين (2 ثانية)</strong> في الطقس الجاف، وخذ استراحة 15 دقيقة كل ساعتين قيادة.</li>
        </ul>`,
      faqs: [
        ['متى يُسمح بالقيادة بسرعة 130 كم/ساعة في هولندا؟', 'فقط بين الساعة 19:00 و06:00 على الطرق السريعة (G1) التي لا تحمل لوحة تقييد 100 أو 120 كم/س. أما نهاراً (06:00–19:00) فالحد الأقصى 100 كم/س.'],
        ['كم تبلغ السرعة القصوى للسيارة مع كرفان أقل من 3500 كجم؟', '90 كم/ساعة على كل من Autoweg وAutosnelweg.'],
        ['ما هو حد الكحول للسائق الجديد في هولندا؟', '0.2 بروميل فقط خلال السنوات الخمس الأولى من الرخصة.'],
      ],
    },
    ru: {
      title: 'Ограничения скорости в Нидерландах (100/130 км/ч), алкоголь и экозоны (2026)',
      metaTitle: 'Скоростной режим Нидерландов 2026 — 100/130 км/ч, прицепы, алкоголь 0,2‰ | ExamTheorie',
      description: 'Открытый конспект Глав 3 и 4 для экзамена CBR 2026 на русском: таблица скоростей (15/50/80/100/130 км/ч), прицеп 90 км/ч, полоса пик, зоны Milieuzone и лимит алкоголя 0,2‰.',
      lead: 'Скоростные лимиты днем и ночью, правила автомагистралей, экологические зоны и нормы алкоголя встречаются почти в каждом билете CBR. Здесь собраны все точные цифры из Глав 3 и 4.',
      body: `
        <h2>1. Полная таблица скоростных ограничений в Нидерландах (2026)</h2>
        <p>Если дорожные знаки или электронные матричные табло над полосой не указывают меньшую скорость, действуют следующие лимиты RVV 1990:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Тип дороги и знак</th><th>Легковой автомобиль</th><th>Авто + прицеп/караван (&le;3500 кг)</th></tr></thead>
          <tbody>
            <tr><td><strong>Жилая зона Woonerf (G5)</strong></td><td>15 км/ч</td><td>15 км/ч</td></tr>
            <tr><td><strong>В населенном пункте (H1)</strong></td><td>50 км/ч (или зона 30 км/ч)</td><td>50 км/ч (или 30 км/ч)</td></tr>
            <tr><td><strong>Вне населенного пункта (H2)</strong></td><td>80 км/ч (или зона 60 км/ч)</td><td>80 км/ч (или 60 км/ч)</td></tr>
            <tr><td><strong>Скоростная дорога Autoweg (G3)</strong></td><td>100 км/ч</td><td><strong>90 км/ч</strong></td></tr>
            <tr><td><strong>Автомагистраль Autosnelweg (G1) — 06:00–19:00</strong></td><td><strong>100 км/ч</strong></td><td><strong>90 км/ч</strong></td></tr>
            <tr><td><strong>Автомагистраль Autosnelweg (G1) — 19:00–06:00</strong></td><td><strong>130 км/ч</strong> (если нет знаков 100/120)</td><td><strong>90 км/ч</strong> (80 км/ч свыше 3500 кг)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>Ловушка на экзамене CBR:</strong> Цифра скорости, просто нарисованная краской на асфальте, не заменяет знак A1. А меньшая скорость на электронном табло над полосой всегда имеет приоритет над обычным знаком у обочины!</div>

        <h2>2. Автомагистрали, аварийная полоса (Vluchtstrook) и полоса час-пик (Spitsstrook)</h2>
        <ul>
          <li><strong>Допуск на трассу:</strong> Для въезда на <em>autoweg</em> (G3) ТС должно быть способно и иметь право ехать минимум <strong>50 км/ч</strong>, а на <em>autosnelweg</em> (G1) — минимум <strong>60 км/ч</strong>.</li>
          <li><strong>Аварийная полоса (Vluchtstrook):</strong> Разрешена исключительно при поломке или экстренной медицинской ситуации.</li>
          <li><strong>Полоса час-пик (Spitsstrook):</strong> При зеленой стрелке сверху разрешено пересечь сплошную белую краевую линию и ехать по правой полосе. Красный крест (X) полностью закрывает полосу.</li>
        </ul>

        <h2>3. Экологические зоны (Milieuzone) и нормы алкоголя (0,2‰ против 0,5‰)</h2>
        <ul>
          <li><strong>Начинающий водитель (первые 5 лет, либо 7 лет при получении прав в 17 лет):</strong> Максимум <strong>0,2 промилле</strong> (88 мкг/л).</li>
          <li><strong>Опытный водитель (стаж &gt;5 лет):</strong> Максимум <strong>0,5 промилле</strong> (220 мкг/л).</li>
          <li><strong>Дистанция 2 секунды:</strong> Соблюдайте дистанцию не менее <strong>2 секунд</strong> в сухую погоду и делайте перерыв 15 минут каждые 2 часа за рулем.</li>
        </ul>`,
      faqs: [
        ['Когда на автомагистралях Нидерландов разрешено ехать 130 км/ч?', 'Только с 19:00 до 06:00 на участках без знаков 100 или 120 км/ч. Днем с 06:00 до 19:00 действует общий лимит 100 км/ч.'],
        ['С какой скоростью можно ехать с караваном до 3500 кг по автомагистрали?', 'Максимум 90 км/ч как на autoweg, так и на autosnelweg.'],
        ['Какова допустимая норма алкоголя для новичка в Нидерландах?', 'Не более 0,2 промилле в течение первых 5 лет стажа.'],
      ],
    },
    fa: {
      title: 'محدودیت سرعت در هلند (۱۰۰/۱۳۰ کیلومتر)، آزادراه‌ها، الکل و مناطق زیست‌محیطی (۲۰۲۶)',
      metaTitle: 'جدول سرعت در هلند ۲۰۲۶ — ۱۰۰ و ۱۳۰، کاروان، سقف الکل ۰٫۲‰ و Milieuzone | ExamTheorie',
      description: 'خلاصه رایگان فصل‌های ۳ و ۴ برای آزمون تئوری CBR هلند ۲۰۲۶: جدول کامل سرعت‌ها (۱۵/۵۰/۸۰/۱۰۰/۱۳۰)، سرعت ۹۰ با یدک‌کش، خط اضطراری و حد مجاز الکل ۰٫۲ پرومیل.',
      lead: 'سؤالات مربوط به سرعت روز و شب در آزادراه، خطوط اضطراری، مناطق زیست‌محیطی و حد مجاز الکل تقریباً در تمام آزمون‌های CBR تکرار می‌شوند. تمام اعداد کلیدی فصل‌های ۳ و ۴ را اینجا مرور کنید.',
      body: `
        <h2>۱. جدول کامل محدودیت سرعت در هلند (۲۰۲۶)</h2>
        <p>مگر آنکه تابلوها یا نمایشگرهای الکترونیکی بالای خط سرعت کمتری را نشان دهند، قوانین سرعت RVV 1990 به شرح زیر است:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>نوع جاده و تابلو</th><th>خودروی سواری</th><th>خودرو + کاروان/یدک‌کش (&le;۳۵۰۰ کیلوگرم)</th></tr></thead>
          <tbody>
            <tr><td><strong>منطقه مسکونی Woonerf (G5)</strong></td><td>۱۵ کیلومتر بر ساعت</td><td>۱۵ کیلومتر بر ساعت</td></tr>
            <tr><td><strong>داخل مناطق شهری (H1)</strong></td><td>۵۰ کیلومتر بر ساعت (یا محدوده ۳۰)</td><td>۵۰ کیلومتر بر ساعت (یا ۳۰)</td></tr>
            <tr><td><strong>خارج از مناطق شهری (H2)</strong></td><td>۸۰ کیلومتر بر ساعت (یا محدوده ۶۰)</td><td>۸۰ کیلومتر بر ساعت (یا ۶۰)</td></tr>
            <tr><td><strong>بزرگراه Autoweg (G3)</strong></td><td>۱۰۰ کیلومتر بر ساعت</td><td><strong>۹۰ کیلومتر بر ساعت</strong></td></tr>
            <tr><td><strong>آزادراه Autosnelweg (G1) — ۰۶:۰۰ تا ۱۹:۰۰</strong></td><td><strong>۱۰۰ کیلومتر بر ساعت</strong></td><td><strong>۹۰ کیلومتر بر ساعت</strong></td></tr>
            <tr><td><strong>آزادراه Autosnelweg (G1) — ۱۹:۰۰ تا ۰۶:۰۰</strong></td><td><strong>۱۳۰ کیلومتر بر ساعت</strong> (در نبود تابلوی ۱۰۰/۱۲۰)</td><td><strong>۹۰ کیلومتر بر ساعت</strong> (۸۰ بالای ۳۵۰۰ کیلوگرم)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>نکته امتحانی CBR:</strong> عدد سرعت نقاشی‌شده روی آسفالت به‌تنهایی حکم تابلوی A1 را ندارد؛ همچنین سرعت کمتر روی تابلوهای الکترونیکی ماتریسی بالای خط همیشه بر تابلوی فلزی کنار جاده ارجحیت دارد!</div>

        <h2>۲. قوانین آزادراه، شانه خاکی/اضطراری (Vluchtstrook) و خط اوج ترافیک (Spitsstrook)</h2>
        <ul>
          <li><strong>حداقل توان سرعت ورود:</strong> برای ورود به <em>Autoweg</em> وسیله نقلیه باید حداقل توان و مجوز <strong>۵۰ کیلومتر بر ساعت</strong> و برای <em>Autosnelweg</em> حداقل <strong>۶۰ کیلومتر بر ساعت</strong> را داشته باشد.</li>
          <li><strong>خط اضطراری (Vluchtstrook):</strong> فقط در صورت خرابی واقعی خودرو یا اورژانس پزشکی مجاز است.</li>
          <li><strong>خط ساعات شلوغی (Spitsstrook):</strong> با روشن شدن فلش سبز بالای خط می‌توانید از خط سفید ممتد عبور کرده و در آن برانید؛ علامت ضربدر قرمز (X) یعنی خط کاملاً بسته است.</li>
        </ul>

        <h2>۳. مناطق زیست‌محیطی (Milieuzone) و حد مجاز الکل (۰٫۲‰ در برابر ۰٫۵‰)</h2>
        <ul>
          <li><strong>راننده تازه‌کار (۵ سال اول — یا ۷ سال برای افراد ۱۷ ساله):</strong> حداکثر <strong>۰٫۲ پرومیل</strong> (۸۸ میکروگرم در لیتر هوای بازدم).</li>
          <li><strong>راننده باتجربه (بیش از ۵ سال):</strong> حداکثر <strong>۰٫۵ پرومیل</strong> (۲۲۰ میکروگرم).</li>
          <li><strong>فاصله طولی ۲ ثانیه:</strong> در هوای خشک حداقل <strong>۲ ثانیه</strong> فاصله با خودروی جلویی حفظ کنید و هر ۲ ساعت رانندگی ۱۵ دقیقه استراحت نمایید.</li>
        </ul>`,
      faqs: [
        ['چه ساعاتی در آزادراه‌های هلند می‌توان ۱۳۰ کیلومتر بر ساعت رانندگی کرد؟', 'فقط بین ساعت ۱۹:۰۰ تا ۰۶:۰۰ در بخش‌هایی که تابلوی ۱۰۰ یا ۱۲۰ وجود ندارد. در طول روز (۰۶:۰۰ تا ۱۹:۰۰) سقف سرعت همه جا ۱۰۰ است.'],
        ['حداکثر سرعت خودرو با کاروان زیر ۳۵۰۰ کیلوگرم در آزادراه چقدر است؟', 'حداکثر ۹۰ کیلومتر بر ساعت در Autoweg و Autosnelweg.'],
        ['سقف مجاز الکل برای رانندگان جدید در هلند چقدر است؟', 'در ۵ سال اول گواهینامه حداکثر ۰٫۲ پرومیل است.'],
      ],
    },
    es: {
      title: 'Límites de Velocidad en Países Bajos (100/130 km/h), Alcohol y Zonas Ambientales (2026)',
      metaTitle: 'Límites de Velocidad CBR 2026 — 100/130 km/h, Remolques, Alcohol 0,2‰ y Milieuzone | ExamTheorie',
      description: 'Resumen gratuito de los Capítulos 3 y 4 del examen teórico CBR 2026: velocidades en Países Bajos (15/50/80/100/130 km/h), caravana 90 km/h, carril hora punta y alcoholemia 0,2 ‰.',
      lead: 'Los límites de velocidad diurnos y nocturnos, las normas de autopista, las zonas ambientales y las tasas de alcohol aparecen en casi todos los exámenes del CBR. Aquí tienes todas las cifras clave de los Capítulos 3 y 4.',
      body: `
        <h2>1. Tabla Oficial de Límites de Velocidad en Países Bajos (2026)</h2>
        <p>Salvo que una señal vertical o un panel electrónico superior indique una velocidad inferior, rigen los siguientes límites del RVV 1990:</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Tipo de Vía y Señal</th><th>Turismo</th><th>Turismo + Remolque Ligero (&le;3.500 kg)</th></tr></thead>
          <tbody>
            <tr><td><strong>Zona residencial Woonerf (G5)</strong></td><td>15 km/h</td><td>15 km/h</td></tr>
            <tr><td><strong>Dentro de poblado (H1)</strong></td><td>50 km/h (o zona 30 km/h)</td><td>50 km/h (o 30 km/h)</td></tr>
            <tr><td><strong>Fuera de poblado (H2)</strong></td><td>80 km/h (o zona 60 km/h)</td><td>80 km/h (o 60 km/h)</td></tr>
            <tr><td><strong>Autovía / Autoweg (G3)</strong></td><td>100 km/h</td><td><strong>90 km/h</strong></td></tr>
            <tr><td><strong>Autopista / Autosnelweg (G1) — 06:00 a 19:00</strong></td><td><strong>100 km/h</strong></td><td><strong>90 km/h</strong></td></tr>
            <tr><td><strong>Autopista / Autosnelweg (G1) — 19:00 a 06:00</strong></td><td><strong>130 km/h</strong> (salvo señal 100/120)</td><td><strong>90 km/h</strong> (80 km/h si supera 3.500 kg)</td></tr>
          </tbody>
        </table></div>
        <div class="callout"><strong>Trampa habitual del CBR:</strong> Un número pintado sobre el asfalto no equivale por sí solo a una señal A1. Además, un límite inferior en un panel electrónico sobre el carril prevalece siempre sobre las señales fijas laterales.</div>

        <h2>2. Autopistas, Arcén de Emergencia (Vluchtstrook) y Carril Hora Punta (Spitsstrook)</h2>
        <ul>
          <li><strong>Velocidad mínima de acceso:</strong> Para entrar en una <em>autoweg</em> (G3) el vehículo debe poder y tener permitido alcanzar al menos <strong>50 km/h</strong>; en una <em>autosnelweg</em> (G1), al menos <strong>60 km/h</strong>.</li>
          <li><strong>Arcén (Vluchtstrook):</strong> Solo puede utilizarse en caso de avería real o emergencia médica aguda.</li>
          <li><strong>Carril hora punta (Spitsstrook):</strong> Cuando una flecha verde superior lo habilita, puedes cruzar la línea blanca continua derecha para circular por él; una X roja prohíbe su uso.</li>
        </ul>

        <h2>3. Zonas Ambientales (Milieuzone) y Tasas de Alcoholemia (0,2 ‰ vs 0,5 ‰)</h2>
        <ul>
          <li><strong>Conductor novel (primeros 5 años — o 7 años si se obtuvo a los 17):</strong> Máximo <strong>0,2 ‰</strong> en sangre (88 &micro;g/l en aire espirado).</li>
          <li><strong>Conductor experimentado (&gt;5 años):</strong> Máximo <strong>0,5 ‰</strong> en sangre (220 &micro;g/l).</li>
          <li><strong>Regla de los 2 segundos:</strong> Mantén al menos <strong>2 segundos</strong> de distancia de seguridad en seco y descansa 15 minutos cada 2 horas de conducción.</li>
        </ul>`,
      faqs: [
        ['¿Cuándo se puede circular a 130 km/h en Países Bajos?', 'Solo entre las 19:00 y las 06:00 en tramos de autopista (G1) sin restricción de 100 o 120 km/h. De 06:00 a 19:00 el límite general es de 100 km/h.'],
        ['¿Cuál es el límite en autopista para un coche con caravana de menos de 3.500 kg?', '90 km/h tanto en autoweg como en autosnelweg.'],
        ['¿Cuál es la tasa máxima de alcohol para conductores noveles?', '0,2 promille durante los primeros 5 años de permiso.'],
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 6: VEHICLE RULES, APK, TYRES, LIGHTS, TRAILERS & TRAFFIC LAW (CH 5–8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'cbr-vehicle-apk-lights-trailers-law',
    tag: 'Vehicle & Law',
    en: {
      title: 'Dutch Vehicle Rules, APK Inspection, Car Lights, Tyres & Road Traffic Law (2026)',
      metaTitle: 'CBR Vehicle & Law Guide 2026 — APK, 1.6mm Tyres, Fog Lights & Trailers | ExamTheorie',
      description: 'Public summary of CBR Theory Chapters 5–8: Wegenverkeerswet, APK schedule, 1.6 mm tyre tread, rear fog light (<50m), red vs amber dashboard lights, 750 kg trailers & traffic controllers.',
      lead: 'Every CBR car theory exam tests technical vehicle safety, lighting rules, load/trailer limits, and the Dutch Road Traffic Act (Wegenverkeerswet 1994). Here is the complete public cheat-sheet for Chapters 5 through 8.',
      body: `
        <h2>1. Car Lighting Rules: Dipped Beam, Fog Lights (&lt;50 m vs &lt;200 m) &amp; Dashboard Warnings</h2>
        <ul>
          <li><strong>Dipped Headlights (Dimlicht):</strong> Mandatory at night and during daytime whenever visibility is poor (rain, fog, snow, tunnels). Daytime running lights (DRL) do NOT illuminate your tail lights in many cars!</li>
          <li><strong>Front Fog Lights (Mistvoorlichten):</strong> Allowed ONLY when fog, snowfall, or heavy rain seriously restricts visibility (generally <strong>under 200 metres</strong>).</li>
          <li><strong>Rear Fog Light (Mistachterlicht):</strong> Allowed <strong>ONLY during fog or heavy snowfall when visibility is less than 50 metres</strong> — strictly forbidden in rain alone because reflection dazzles drivers behind you!</li>
          <li><strong>Dashboard Warning Lights:</strong> A <strong>RED</strong> warning light (oil pressure, brakes, battery/alternator, coolant temperature) means <em>stop safely immediately and switch off the engine</em>. An <strong>AMBER/YELLOW</strong> light (engine check, tyre pressure TPMS, low washer fluid) means <em>check or visit a workshop soon</em>.</li>
        </ul>

        <h2>2. Tyres (1.6 mm), Mirrors, APK Inspection Schedule &amp; Mandatory Documents</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Requirement</th><th>2026 Dutch Legal Rule (Rijbewijs B)</th></tr></thead>
          <tbody>
            <tr><td><strong>Minimum Tyre Tread Depth</strong></td><td><strong>1.6 mm</strong> across all main grooves (winter replacement recommended around 4 mm)</td></tr>
            <tr><td><strong>APK — Petrol / Hybrid / Electric Cars</strong></td><td>First APK after <strong>4 years</strong>, then after <strong>2 years</strong>, another <strong>2 years</strong>, then <strong>every year</strong> (4-2-2-1)</td></tr>
            <tr><td><strong>APK — Diesel / LPG / CNG Cars</strong></td><td>First APK after <strong>3 years</strong>, then <strong>every year</strong> (3-1-1-1)</td></tr>
            <tr><td><strong>Mandatory Documents When Driving</strong></td><td>Valid physical Driving Licence + Registration Card (<em>Kentekenbewijs</em>) + minimum WA Third-Party Liability Insurance registered in RDW</td></tr>
          </tbody>
        </table></div>

        <h2>3. Trailers (750 kg Rule), White vs Yellow Number Plates &amp; Protruding Loads</h2>
        <ul>
          <li><strong>Licence Category B Trailer Limit:</strong> With a standard B licence you may tow any trailer up to <strong>750 kg</strong> authorized mass, OR a heavier trailer provided the combined maximum authorized mass (car + trailer) does not exceed <strong>3,500 kg</strong>.</li>
          <li><strong>Number Plates on Trailers:</strong> Trailers &le;750 kg carry a <strong>white</strong> repeater plate matching the towing car; trailers &gt;750 kg have their own registration and a <strong>yellow</strong> number plate + independent breakaway cable/auxiliary coupling.</li>
          <li><strong>Load Projection:</strong> Roof/car loads may never project past the front bumper of a passenger car, and at most <strong>1.00 metre</strong> behind the rear axle/vehicle (up to max 5 m behind rear axle on trailers with a red-and-white marker board if &gt;1 m). Width on paved roads max <strong>2.55 m</strong>.</li>
        </ul>

        <h2>4. Road Traffic Act (Art. 5 &amp; 6 WVW), Beginner Points &amp; Special Convoys</h2>
        <ul>
          <li><strong>Article 5 WVW:</strong> General duty never to cause danger or unnecessary hindrance on the road. <strong>Article 6 WVW:</strong> Causing a serious injury or fatal crash through culpable/reckless driving (criminal offence).</li>
          <li><strong>Beginner Licence (2 Strikes):</strong> Serious traffic offences (tailgating, >30 km/h speeding, >40 km/h on motorways, causing danger) earn penalty points; at <strong>2 points</strong> within 5 years, your licence is suspended for a mandatory CBR driving competence investigation.</li>
          <li><strong>Emergency Vehicles &amp; Military Columns:</strong> Always yield immediately to vehicles using <strong>both blue flashing lights AND a two-tone siren</strong>. Never cut through a military motor convoy (first vehicle: two blue flags/lights; intermediate: one blue; final vehicle: one green) once the lead vehicle has entered an equal intersection or traffic light!</li>
        </ul>`,
      faqs: [
        ['May you use your rear fog light during heavy rain on the motorway?', 'No! In the Netherlands, the rear fog light is permitted ONLY in fog or heavy snow when visibility is below 50 metres. Using it in rain is illegal.'],
        ['How often does a petrol or electric car need an APK inspection in the Netherlands?', 'Following the 4-2-2-1 rule: 4 years after first registration, then after 2 years, another 2 years, and annually thereafter.'],
        ['When does a trailer need its own yellow registration plate?', 'Whenever the trailer’s maximum authorized mass (toegestane maximummassa) exceeds 750 kg. Up to 750 kg it uses a white plate with the towing car’s registration.'],
      ],
    },
    nl: {
      title: 'Voertuigregels, APK-schema, Verlichting, Banden (1,6 mm) & Aanhangers (2026)',
      metaTitle: 'CBR Voertuig & Wet Gids 2026 — APK, Mistlicht, Banden & Aanhanger | ExamTheorie',
      description: 'Openbare samenvatting van CBR Hoofdstuk 5 t/m 8: mistachterlicht (<50m), rode vs gele dashboardlampjes, 1,6 mm bandenprofiel, APK (4-2-2-1), 750 kg aanhanger en Wegenverkeerswet.',
      lead: 'Elk CBR auto theorie-examen bevat vragen over verlichting, dashboardlampjes, APK, bandenprofiel, aanhangers en de Wegenverkeerswet. Dit openbare overzicht vat Hoofdstuk 5 t/m 8 compleet samen.',
      body: `
        <h2>1. Autoverlichting: Dimlicht, Mistlicht (&lt;50 m vs &lt;200 m) &amp; Dashboardlampjes</h2>
        <ul>
          <li><strong>Dimlicht:</strong> Verplicht bij nacht én overdag bij slecht zicht (regen, mist, sneeuw, tunnels). Let op: bij dagrijverlichting (DRL) branden je achterlichten vaak niet!</li>
          <li><strong>Mistvoorlichten:</strong> Alleen toegestaan als mist, sneeuwval of regen het zicht ernstig belemmert (globaal <strong>minder dan 200 meter</strong>).</li>
          <li><strong>Mistachterlicht:</strong> <strong>Uitsluitend toegestaan bij mist of sneeuwval met zicht minder dan 50 meter</strong> — bij regen altijd verboden!</li>
          <li><strong>Controlelampjes op het dashboard:</strong> <strong>ROOD</strong> = direct gevaar (oliedruk, remmen, koelvloeistof, accu): <em>direct veilig stoppen en motor uitzetten</em>. <strong>ORANJE/GEEL</strong> = controle nodig (motormanagement, bandenspanning): <em>binnenkort laten nakijken</em>.</li>
        </ul>

        <h2>2. Bandenprofiel (1,6 mm), APK-keuring &amp; Verplichte Documenten</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Onderdeel</th><th>Wettelijke Eis in Nederland (Rijbewijs B)</th></tr></thead>
          <tbody>
            <tr><td><strong>Minimale profieldiepte banden</strong></td><td><strong>1,6 mm</strong> in de hoofdgroeven</td></tr>
            <tr><td><strong>APK — Benzine / Hybride / Elektrisch</strong></td><td>Na <strong>4 jaar</strong>, daarna na <strong>2 jaar</strong>, nog eens <strong>2 jaar</strong>, daarna <strong>elk jaar</strong> (4-2-2-1)</td></tr>
            <tr><td><strong>APK — Diesel / LPG</strong></td><td>Na <strong>3 jaar</strong>, daarna <strong>elk jaar</strong> (3-1-1-1)</td></tr>
            <tr><td><strong>Verplicht bij je tijdens het rijden</strong></td><td>Geldig fysiek rijbewijs + kentekencard + geldige WA-verzekering geregistreerd bij de RDW</td></tr>
          </tbody>
        </table></div>

        <h2>3. Aanhangers (750 kg-grens), Witte vs Gele Kentekenplaat &amp; Lading</h2>
        <ul>
          <li><strong>Rijbewijs B met aanhanger:</strong> Je mag altijd een aanhanger t/m <strong>750 kg</strong> toegestane maximummassa trekken, óf een zwaardere aanhanger zolang auto + aanhanger samen maximaal <strong>3.500 kg</strong> bedragen.</li>
          <li><strong>Kentekenplaat:</strong> Tot en met 750 kg voert de aanhanger een <strong>witte</strong> plaat met het kenteken van de trekkende auto; boven 750 kg heeft de aanhanger een eigen kenteken en <strong>gele</strong> plaat.</li>
        </ul>

        <h2>4. Wegenverkeerswet (Art. 5 &amp; 6), Beginnerspunten &amp; Voorrangsvoertuigen</h2>
        <ul>
          <li><strong>Artikel 5 &amp; 6 WVW:</strong> Artikel 5 verbiedt gevaar of hinder op de weg; Artikel 6 bestraft het door schuld veroorzaken van een ongeval met zwaar letsel of dood.</li>
          <li><strong>Beginnersrijbewijs:</strong> Bij <strong>2 strafpunten</strong> binnen 5 jaar wordt je rijbewijs geschorst voor een rijvaardigheidsonderzoek bij het CBR.</li>
          <li><strong>Voorrangsvoertuigen &amp; Militaire colonnes:</strong> Verleen direct vrije doorgang aan voertuigen met <strong>blauw zwaailicht én tweetonige sirene</strong>, en doorkruis nooit een militaire colonne (blauw-blauw-groen) zodra het eerste voertuig is begonnen met oversteken.</li>
        </ul>`,
      faqs: [
        ['Mag je het mistachterlicht aanzetten bij zware regen op de snelweg?', 'Nee, nooit! Het mistachterlicht mag alleen bij mist of sneeuwval wanneer het zicht minder is dan 50 meter.'],
        ['Wanneer moet een benzine- of elektrische auto voor het eerst naar de APK?', 'Na 4 jaar vanaf de eerste toelating, daarna na 2 jaar, weer na 2 jaar en vervolgens jaarlijks (4-2-2-1).'],
        ['Wanneer heeft een aanhangwagen een eigen gele kentekenplaat nodig?', 'Zodra de toegestane maximummassa van de aanhangwagen hoger is dan 750 kg.'],
      ],
    },
    tr: {
      title: 'Hollanda Araç Kuralları, APK Muayenesi, Sis Farları, Lastik (1,6 mm) ve Römork (2026)',
      metaTitle: 'CBR Araç, APK, Aydınlatma ve Trafik Kanunu Rehberi 2026 | ExamTheorie',
      description: 'CBR Teori Bölüm 5–8 ücretsiz Türkçe özeti: arka sis farı (<50 m), kırmızı/sarı gösterge ışıkları, 1,6 mm lastik dişi, APK takvimi (4-2-2-1), 750 kg römork ve askeri konvoy kuralları.',
      lead: 'CBR ehliyet teori sınavında aydınlatma, gösterge ikaz ışıkları, APK muayene yılları, römork plakaları ve Karayolları Kanunu (Wegenverkeerswet) her sınavda çıkar. Bölüm 5–8’in tüm kritik kurallarını burada bulabilirsiniz.',
      body: `
        <h2>1. Aydınlatma Kuralları: Kısa Far, Sis Farları (&lt;50 m / &lt;200 m) ve Gösterge Lambaları</h2>
        <ul>
          <li><strong>Kısa Far (Dimlicht):</strong> Gece ve gündüz görüşün düştüğü her durumda (yağmur, sis, kar, tünel) zorunludur. Gündüz sürüş farlarında (DRL) arka lambaların yanmadığını unutmayın!</li>
          <li><strong>Ön Sis Farı (Mistvoorlichten):</strong> Sis, kar veya şiddetli yağmur görüşü ciddi biçimde kısıtladığında (yaklaşık <strong>200 metrenin altında</strong>) kullanılabilir.</li>
          <li><strong>Arka Sis Farı (Mistachterlicht):</strong> <strong>Yalnızca sis veya yoğun kar yağışında görüş 50 metrenin altına düştüğünde</strong> açılabilir — yağmurda açılması arkadaki sürücüyü kör ettiği için kesinlikle yasaktır!</li>
          <li><strong>Gösterge Paneli İkaz Lambaları:</strong> <strong>KIRMIZI</strong> lamba (yağ basıncı, fren, hararet, akü/şarj) = <em>derhal güvenli bir yerde durup motoru kapatın</em>. <strong>TURUNCU/SARI</strong> lamba (motor arıza, lastik basıncı) = <em>en kısa sürede kontrol ettirin</em>.</li>
        </ul>

        <h2>2. Lastik Diş Derinliği (1,6 mm), APK Muayene Takvimi ve Zorunlu Belgeler</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Kural Başlığı</th><th>2026 Hollanda Yasal Şartı (B Sınıfı)</th></tr></thead>
          <tbody>
            <tr><td><strong>Asgari Lastik Diş Derinliği</strong></td><td>Ana oluklarda en az <strong>1,6 mm</strong></td></tr>
            <tr><td><strong>APK — Benzinli / Hibrit / Elektrikli</strong></td><td>İlk muayene <strong>4. yılda</strong>, sonra <strong>2 yıl</strong>, tekrar <strong>2 yıl</strong>, ardından <strong>her yıl</strong> (4-2-2-1 kuralı)</td></tr>
            <tr><td><strong>APK — Dizel / LPG</strong></td><td>İlk muayene <strong>3. yılda</strong>, ardından <strong>her yıl</strong> (3-1-1-1 kuralı)</td></tr>
            <tr><td><strong>Araçta Bulunması Zorunlu Belgeler</strong></td><td>Geçerli fiziksel Ehliyet + Ruhsat Kartı (<em>Kentekenbewijs</em>) + RDW kayıtlı zorunlu WA trafik sigortası</td></tr>
          </tbody>
        </table></div>

        <h2>3. Römorklar (750 kg Kuralı), Beyaz/Sarı Plaka ve Yük Taşması</h2>
        <ul>
          <li><strong>B Ehliyet ile Römork:</strong> B sınıfı ehliyetle azami yüklü ağırlığı <strong>750 kg’a kadar</strong> her römorku veya otomobil + römork toplam azami ağırlığı <strong>3.500 kg’ı aşmayan</strong> daha ağır römorkları çekebilirsiniz.</li>
          <li><strong>Beyaz ve Sarı Plaka Farkı:</strong> 750 kg ve altı römorklara çeken aracın plakasını taşıyan <strong>beyaz plaka</strong>, 750 kg üstü römorklara ise kendi ruhsatlı <strong>sarı plakası</strong> takılır.</li>
        </ul>

        <h2>4. Karayolları Kanunu (Madde 5 ve 6), Acemi Ehliyet Puanı ve Özel Konvoylar</h2>
        <ul>
          <li><strong>WVW Madde 5 ve 6:</strong> Madde 5 trafiği tehlikeye atmayı veya gereksiz engellemeyi yasaklar; Madde 6 kusurlu sürüşle ağır yaralanmalı/ölümlü kazaya sebebiyet verme suçunu düzenler.</li>
          <li><strong>Acemi Ehliyet (2 Ceza Puanı):</strong> İlk 5 yılda ağır ihlallerden <strong>2 puan</strong> alınırsa ehliyet askıya alınır ve CBR yeterlilik incelemesi uygulanır.</li>
          <li><strong>Geçiş Üstünlüğü Olan Araçlar ve Askeri Konvoy:</strong> <strong>Mavi tepe lambası VE çift tonlu sireni</strong> aynı anda açık araçlara derhal yol verin; ilk aracı kavşağa girmiş askeri konvoyun (mavi-mavi-yeşil bayrak/ışık) arasına asla girmeyin.</li>
        </ul>`,
      faqs: [
        ['Şiddetli yağmurda otoyolda arka sis farı yakılabilir mi?', 'Hayır, kesinlikle yasaktır! Arka sis farı yalnızca sis veya kar yağışında görüş 50 metrenin altına indiğinde yakılabilir.'],
        ['Benzinli veya elektrikli bir otomobil ilk APK muayenesine ne zaman girer?', '4-2-2-1 kuralına göre trafiğe çıkıştan 4 yıl sonra ilk kez, ardından iki kez 2 yılda bir, sonrasında her yıl girer.'],
        ['Römorklarda ne zaman sarı plaka zorunludur?', 'Römorkun azami yüklü ağırlığı (toegestane maximummassa) 750 kg’ı aştığında kendi ruhsatı ve sarı plakası zorunludur.'],
      ],
    },
    ar: {
      title: 'قواعد المركبة في هولندا، فحص APK، الأضواء، الإطارات (1.6 ملم) والمقطورات (2026)',
      metaTitle: 'دليل المركبة وفحص APK وأضواء الضباب في امتحان CBR 2026 | ExamTheorie',
      description: 'ملخص مجاني للفصول 5–8 من نظرية CBR: ضوء الضباب الخلفي (<50م)، أضواء التحذير الحمراء والصفراء، عمق الإطارات 1.6 ملم، جدول فحص APK وقواعد المقطورات 750 كجم.',
      lead: 'يتضمن كل امتحان نظري CBR أسئلة حول الأضواء، لوحة العدادات، فحص APK الدوري، المقطورات وقانون السير الهولندي. إليك الملخص الشامل للفصول من 5 إلى 8.',
      body: `
        <h2>1. قواعد الإضاءة: الضوء المنخفض، أضواء الضباب (&lt;50 م) وأضواء لوحة العدادات</h2>
        <ul>
          <li><strong>الضوء المنخفض (Dimlicht):</strong> إلزامي ليلاً وكذلك نهاراً عند ضعف الرؤية (المطر، الضباب، الثلج، الأنفاق).</li>
          <li><strong>ضوء الضباب الأمامي:</strong> يُسمح به عند انخفاض الرؤية بشدة بسبب الضباب أو الثلج أو المطر الغزير (أقل من <strong>200 متر</strong> تقريباً).</li>
          <li><strong>ضوء الضباب الخلفي (Mistachterlicht):</strong> يُسمح به <strong>فقط في الضباب أو الثلج الكثيف عندما تقل الرؤية عن 50 متراً</strong> — ويُمنع منعاً باتاً في المطر!</li>
          <li><strong>أضواء التحذير:</strong> الضوء <strong>الأحمر</strong> يعني خطراً فورياً يستوجب التوقف الآمن فوراً وإيقاف المحرك؛ الضوء <strong>الأصفر/البرتقالي</strong> يعني ضرورة الفحص قريباً.</li>
        </ul>

        <h2>2. الإطارات (1.6 ملم)، مواعيد فحص APK والوثائق الإلزامية</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>البند</th><th>القاعدة القانونية في هولندا (الفئة B)</th></tr></thead>
          <tbody>
            <tr><td><strong>الحد الأدنى لعمق نقشة الإطارات</strong></td><td><strong>1.6 ملم</strong> في القنوات الرئيسية</td></tr>
            <tr><td><strong>فحص APK — بنزين / هجين / كهرباء</strong></td><td>بعد <strong>4 سنوات</strong>، ثم سنتين، ثم سنتين، ثم <strong>سنوياً</strong> (4-2-2-1)</td></tr>
            <tr><td><strong>فحص APK — ديزل / غاز LPG</strong></td><td>بعد <strong>3 سنوات</strong>، ثم <strong>سنوياً</strong> (3-1-1-1)</td></tr>
            <tr><td><strong>الوثائق المطلوبة أثناء القيادة</strong></td><td>رخصة قيادة أصلية سارية + بطاقة تسجيل المركبة (<em>Kentekenbewijs</em>) + تأمين إلزامي WA</td></tr>
          </tbody>
        </table></div>

        <h2>3. المقطورات (750 كجم)، اللوحة البيضاء مقابل الصفراء ومركبات الطوارئ</h2>
        <ul>
          <li><strong>رخصة B مع المقطورة:</strong> تسمح بجر مقطورة حتى <strong>750 كجم</strong>، أو مقطورة أثقل بشرط ألا يتجاوز الوزن الأقصى المسموح به للسيارة والمقطورة معاً <strong>3500 كجم</strong>.</li>
          <li><strong>لون اللوحة:</strong> حتى 750 كجم تحمل المقطورة <strong>لوحة بيضاء</strong> برقم السيارة؛ وفوق 750 كجم تحمل <strong>لوحة صفراء</strong> مستقلة.</li>
          <li><strong>مركبات الطوارئ والأرتال العسكرية:</strong> أفسح الطريق فوراً للمركبات التي تشغل <strong>الضوء الأزرق مع الصفارة الثنائية</strong> معاً، ولا تقطع رتلاً عسكرياً بدأ أوله بعبور التقاطع.</li>
        </ul>`,
      faqs: [
        ['هل يجوز تشغيل ضوء الضباب الخلفي أثناء المطر الغزير؟', 'لا، يُمنع ذلك قانوناً! يُسمح به فقط في الضباب أو الثلج عندما تقل الرؤية عن 50 متراً.'],
        ['متى تخضع سيارة البنزين أو الكهرباء لأول فحص APK؟', 'بعد 4 سنوات من أول تسجيل، ثم كل سنتين مرتين، وبعدها سنوياً (4-2-2-1).'],
        ['متى تحتاج المقطورة إلى لوحة صفراء خاصة بها؟', 'عندما يتجاوز وزنها الأقصى المسموح به 750 كجم.'],
      ],
    },
    ru: {
      title: 'Требования к авто, техосмотр APK, фары, шины (1,6 мм) и прицепы (2026)',
      metaTitle: 'Автомобиль, APK, фары и закон ПДД на экзамене CBR 2026 | ExamTheorie',
      description: 'Бесплатный конспект Глав 5–8 теории CBR: задний противотуманный фонарь (<50 м), красные/желтые индикаторы, шины 1,6 мм, график APK (4-2-2-1) и прицепы 750 кг.',
      lead: 'В каждом экзамене CBR есть вопросы по световым приборам, индикаторам приборной панели, техосмотру APK, прицепам и Закону о дорожном движении. Ниже — полный конспект Глав 5–8.',
      body: `
        <h2>1. Световые приборы: ближний свет, противотуманки (&lt;50 м) и приборная панель</h2>
        <ul>
          <li><strong>Ближний свет (Dimlicht):</strong> Обязателен ночью и днем при плохой видимости (дождь, туман, снег, тоннели). Помните: при дневных ходовых огнях (DRL) задние габариты часто не горят!</li>
          <li><strong>Передние противотуманные фары:</strong> Разрешены при сильном ухудшении видимости из-за тумана, снегопада или ливня (ориентировочно <strong>менее 200 м</strong>).</li>
          <li><strong>Задний противотуманный фонарь (Mistachterlicht):</strong> Разрешен <strong>ТОЛЬКО в туман или снегопад при видимости менее 50 метров</strong> — в дождь строго запрещен!</li>
          <li><strong>Индикаторы панели:</strong> <strong>КРАСНЫЙ</strong> = немедленно безопасно остановиться и заглушить мотор; <strong>ЖЕЛТЫЙ/ОРАНЖЕВЫЙ</strong> = проверить автомобиль в ближайшее время.</li>
        </ul>

        <h2>2. Протектор шин (1,6 мм), график техосмотра APK и обязательные документы</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Параметр</th><th>Законное требование в Нидерландах (категория B)</th></tr></thead>
          <tbody>
            <tr><td><strong>Минимальная глубина протектора</strong></td><td><strong>1,6 мм</strong> в основных канавках</td></tr>
            <tr><td><strong>APK — бензин / гибрид / электромобиль</strong></td><td>Через <strong>4 года</strong>, затем <strong>2 года</strong>, еще <strong>2 года</strong>, далее <strong>ежегодно</strong> (4-2-2-1)</td></tr>
            <tr><td><strong>APK — дизель / газ LPG</strong></td><td>Через <strong>3 года</strong>, далее <strong>ежегодно</strong> (3-1-1-1)</td></tr>
            <tr><td><strong>Обязательные документы с собой</strong></td><td>Оригинал водительских прав + карточка регистрации (<em>Kentekenbewijs</em>) + страховка WA в базе RDW</td></tr>
          </tbody>
        </table></div>

        <h2>3. Прицепы (правило 750 кг), белые/желтые номера и спецтранспорт</h2>
        <ul>
          <li><strong>Категория B с прицепом:</strong> Можно буксировать любой прицеп до <strong>750 кг</strong> либо более тяжелый прицеп, если сумма разрешенных максимальных масс авто и прицепа не превышает <strong>3500 кг</strong>.</li>
          <li><strong>Номерной знак прицепа:</strong> До 750 кг — <strong>белый</strong> дублирующий номер тягача; свыше 750 кг — собственный техпаспорт и <strong>желтый</strong> номер.</li>
          <li><strong>Спецтранспорт и военные колонны:</strong> Немедленно уступайте машинам с включенными <strong>синими маячками И двухтональной сиреной</strong>; запрещено пересекать военную колонну после въезда головной машины на перекресток.</li>
        </ul>`,
      faqs: [
        ['Можно ли включать задний противотуманный фонарь в сильный дождь?', 'Нет, категорически запрещено! Только в туман или снег при видимости менее 50 метров.'],
        ['Как часто бензиновый или электрический автомобиль проходит техосмотр APK?', 'По схеме 4-2-2-1: через 4 года с даты выпуска, затем дважды раз в 2 года, после чего ежегодно.'],
        ['Когда прицепу нужен собственный желтый номерной знак?', 'Если разрешенная максимальная масса прицепа превышает 750 кг.'],
      ],
    },
    fa: {
      title: 'قوانین فنی خودرو در هلند، معاینه فنی APK، چراغ‌ها، تایر (۱٫۶ میلی‌متر) و یدک‌کش (۲۰۲۶)',
      metaTitle: 'راهنمای فنی خودرو، APK، چراغ مه‌شکن و قانون ترافیک در آزمون CBR 2026 | ExamTheorie',
      description: 'خلاصه رایگان فصل‌های ۵ تا ۸ تئوری CBR: چراغ مه‌شکن عقب (<۵۰ متر)، چراغ‌های قرمز و نارنجی داشبورد، آج ۱٫۶ میلی‌متری تایر، برنامه APK و قوانین یدک‌کش ۷۵۰ کیلوگرمی.',
      lead: 'در هر آزمون تئوری CBR سؤالاتی درباره چراغ‌های خودرو، هشدارهای پشت آمپر، معاینه فنی APK، یدک‌کش‌ها و قانون ترافیک هلند مطرح می‌شود. این راهنما تمام نکات کلیدی فصل‌های ۵ تا ۸ را پوشش می‌دهد.',
      body: `
        <h2>۱. قوانین چراغ‌ها: نور پایین، مه‌شکن (&lt;۵۰ متر) و چراغ‌های هشدار داشبورد</h2>
        <ul>
          <li><strong>نور پایین (Dimlicht):</strong> در شب و همچنین در روز هنگام کاهش دید (باران، مه، برف، تونل) الزامی است. توجه کنید در چراغ روز (DRL) معمولاً چراغ‌های عقب روشن نمی‌شوند!</li>
          <li><strong>مه‌شکن جلو:</strong> هنگام کاهش شدید دید بر اثر مه، برف یا باران سنگین (زیر حدود <strong>۲۰۰ متر</strong>) مجاز است.</li>
          <li><strong>مه‌شکن عقب (Mistachterlicht):</strong> <strong>فقط در مه یا بارش برف سنگین با دید کمتر از ۵۰ متر</strong> مجاز است — روشن کردن آن در باران مطلقاً ممنوع است!</li>
          <li><strong>چراغ‌های پشت آمپر:</strong> چراغ <strong>قرمز</strong> = خطر فوری، بلافاصله در محلی امن بایستید و موتور را خاموش کنید؛ چراغ <strong>زرد/نارنجی</strong> = نیاز به بررسی فنی در اولین فرصت.</li>
        </ul>

        <h2>۲. آج لاستیک (۱٫۶ میلی‌متر)، زمان‌بندی معاینه فنی APK و مدارک الزامی</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>مورد</th><th>قانون رسمی هلند در سال ۲۰۲۶ (پایه B)</th></tr></thead>
          <tbody>
            <tr><td><strong>حداقل عمق آج تایر</strong></td><td><strong>۱٫۶ میلی‌متر</strong> در شیارهای اصلی</td></tr>
            <tr><td><strong>APK — خودروهای بنزینی / هیبریدی / برقی</strong></td><td>پس از <strong>۴ سال</strong>، سپس <strong>۲ سال</strong>، دوباره <strong>۲ سال</strong> و بعد <strong>هر سال</strong> (۴-۲-۲-۱)</td></tr>
            <tr><td><strong>APK — خودروهای دیزلی / گازسوز LPG</strong></td><td>پس از <strong>۳ سال</strong> و سپس <strong>هر سال</strong> (۳-۱-۱-۱)</td></tr>
            <tr><td><strong>مدارک الزامی همراه راننده</strong></td><td>اصل گواهینامه معتبر + کارت خودرو (<em>Kentekenbewijs</em>) + بیمه شخص ثالث اجباری WA</td></tr>
          </tbody>
        </table></div>

        <h2>۳. یدک‌کش‌ها (مرز ۷۵۰ کیلوگرم)، پلاک سفید و زرد و خودروهای امدادی</h2>
        <ul>
          <li><strong>گواهینامه B با یدک‌کش:</strong> مجاز به کشیدن هر یدک‌کش تا <strong>۷۵۰ کیلوگرم</strong>، یا یدک‌کش سنگین‌تر به شرط آنکه مجموع حداکثر وزن مجاز خودرو و یدک‌کش از <strong>۳۵۰۰ کیلوگرم</strong> بیشتر نشود.</li>
          <li><strong>پلاک سفید در برابر زرد:</strong> تا ۷۵۰ کیلوگرم پلاک <strong>سفید</strong> هم‌شماره خودرو نصب می‌شود؛ بالای ۷۵۰ کیلوگرم یدک‌کش کارت مستقل و پلاک <strong>زرد</strong> دارد.</li>
          <li><strong>خودروهای امدادی و کاروان نظامی:</strong> به خودروهای دارای <strong>چراغ گردان آبی و آژیر دوصدایی</strong> هم‌زمان فوراً راه بدهید و هرگز از میان کاروان نظامی در حال عبور از تقاطع رد نشوید.</li>
        </ul>`,
      faqs: [
        ['آیا در باران شدید می‌توان چراغ مه‌شکن عقب را روشن کرد؟', 'خیر، کاملاً ممنوع است! فقط در مه یا برف با دید زیر ۵۰ متر مجاز است.'],
        ['خودروی بنزینی یا برقی چه زمانی باید اولین معاینه فنی APK را انجام دهد؟', 'طبق قانون ۴-۲-۲-۱: چهار سال پس از تولید، سپس دو بار هر ۲ سال و بعد سالانه.'],
        ['چه زمانی یدک‌کش به پلاک زرد مستقل نیاز دارد؟', 'زمانی که حداکثر وزن مجاز آن بیش از ۷۵۰ کیلوگرم باشد.'],
      ],
    },
    es: {
      title: 'Normas del Vehículo en Países Bajos, Inspección APK, Luces, Neumáticos (1,6 mm) y Remolques (2026)',
      metaTitle: 'Guía CBR de Vehículo, APK, Luz Antiniebla y Remolques 2026 | ExamTheorie',
      description: 'Resumen gratuito de los Capítulos 5–8 del teórico CBR: antiniebla trasero (<50 m), testigos rojos y ámbar, neumáticos 1,6 mm, calendario APK (4-2-2-1) y remolques de 750 kg.',
      lead: 'Todos los exámenes teóricos del CBR incluyen preguntas sobre alumbrado, testigos del salpicadero, inspección APK, neumáticos, remolques y la Ley de Tráfico. Aquí tienes el resumen completo de los Capítulos 5 a 8.',
      body: `
        <h2>1. Alumbrado: Luz de Cruce, Antiniebla (&lt;50 m vs &lt;200 m) y Testigos del Cuadro</h2>
        <ul>
          <li><strong>Luz de cruce (Dimlicht):</strong> Obligatoria de noche y de día con mala visibilidad (lluvia, niebla, nieve, túneles). ¡Recuerda que con las luces diurnas (DRL) a menudo no se encienden las luces traseras!</li>
          <li><strong>Antiniebla delantero:</strong> Permitido cuando niebla, nieve o lluvia intensa reduzcan gravemente la visibilidad (aprox. <strong>menos de 200 m</strong>).</li>
          <li><strong>Antiniebla trasero (Mistachterlicht):</strong> Permitido <strong>ÚNICAMENTE con niebla o nevada intensa y visibilidad inferior a 50 metros</strong> — ¡prohibido con lluvia!</li>
          <li><strong>Testigos del salpicadero:</strong> <strong>ROJO</strong> = peligro inmediato, detente con seguridad al instante y apaga el motor; <strong>ÁMBAR/AMARILLO</strong> = revisión necesaria próximamente.</li>
        </ul>

        <h2>2. Neumáticos (1,6 mm), Calendario APK y Documentación Obligatoria</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Elemento</th><th>Norma Legal en Países Bajos (Permiso B)</th></tr></thead>
          <tbody>
            <tr><td><strong>Dibujo mínimo del neumático</strong></td><td><strong>1,6 mm</strong> en las ranuras principales</td></tr>
            <tr><td><strong>APK — Gasolina / Híbrido / Eléctrico</strong></td><td>A los <strong>4 años</strong>, luego <strong>2 años</strong>, otros <strong>2 años</strong> y después <strong>anual</strong> (4-2-2-1)</td></tr>
            <tr><td><strong>APK — Diésel / GLP</strong></td><td>A los <strong>3 años</strong> y después <strong>anual</strong> (3-1-1-1)</td></tr>
            <tr><td><strong>Documentación obligatoria al volante</strong></td><td>Permiso de conducir físico vigente + tarjeta de matriculación (<em>Kentekenbewijs</em>) + seguro obligatorio WA</td></tr>
          </tbody>
        </table></div>

        <h2>3. Remolques (Regla de 750 kg), Matrícula Blanca vs Amarilla y Vehículos Prioritarios</h2>
        <ul>
          <li><strong>Permiso B con remolque:</strong> Puedes arrastrar cualquier remolque de hasta <strong>750 kg</strong> de MMA, o uno más pesado siempre que la suma de las MMA de coche + remolque no supere <strong>3.500 kg</strong>.</li>
          <li><strong>Color de matrícula:</strong> Hasta 750 kg lleva matrícula <strong>blanca</strong> repetidora del coche; por encima de 750 kg lleva documentación propia y matrícula <strong>amarilla</strong>.</li>
          <li><strong>Vehículos prioritarios y convoyes militares:</strong> Cede el paso de inmediato a vehículos con <strong>luz azul Y sirena bitonal</strong> activas, y no cortes nunca un convoy militar que ya haya iniciado el cruce.</li>
        </ul>`,
      faqs: [
        ['¿Se puede encender el antiniebla trasero con lluvia fuerte?', '¡No, nunca! Solo está permitido con niebla o nevada cuando la visibilidad sea menor de 50 metros.'],
        ['¿Cada cuánto pasa la APK un coche de gasolina o eléctrico?', 'Según la pauta 4-2-2-1: a los 4 años, luego dos veces cada 2 años y a partir de ahí anualmente.'],
        ['¿Cuándo necesita un remolque matrícula amarilla propia?', 'Cuando su masa máxima autorizada supere los 750 kg.'],
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE 7: MIJN CBR BOOKING, DIGID, INTERPRETER (TOLKENNET), FAALANGST & 2TODRIVE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'cbr-booking-digid-interpreter-faalangst-2todrive',
    tag: 'Booking & Languages',
    en: {
      title: 'How to Book Your CBR Theory Exam with DigiD: Foreign Languages, Interpreter, Extra Time & 2toDrive (2026)',
      metaTitle: 'Book CBR Theory Exam 2026 — Mijn CBR DigiD, Interpreter (Tolkennet), Extra Time & 2toDrive | ExamTheorie',
      description: 'Step-by-step 2026 guide to booking your CBR car theory exam via Mijn CBR without middleman fees, taking the exam in Turkish/Arabic/Russian/Persian/Spanish with an interpreter, extra-time exam & 2toDrive.',
      lead: 'Many candidates accidentally overpay €30–€60 on unofficial booking websites or wonder how to take the CBR exam in Turkish, Arabic, Russian, Persian, or Spanish. Here is the official 2026 booking and exam-options guide.',
      body: `
        <h2>1. How to Book Official CBR Theory Exam Directly via Mijn CBR (Avoid Broker Fees!)</h2>
        <p>Commercial third-party websites often rank in Google Ads and charge €80–€110 for a €50.50 exam. Always book directly on the official government portal <strong>mijn.cbr.nl</strong>:</p>
        <ol>
          <li>Log in at <strong>mijn.cbr.nl</strong> with your personal <strong>DigiD</strong> (via the DigiD app).</li>
          <li>Choose <em>Theorie-examen reserveren &rarr; Personenauto (Rijbewijs B)</em>.</li>
          <li>Select language (<strong>Nederlands €50.50</strong> or <strong>Engels €57.00</strong>), your preferred CBR exam centre (e.g. Amsterdam, Rotterdam, Utrecht, Eindhoven, Rijswijk, Arnhem, Zwolle), date, and time slot, then pay via <strong>iDEAL</strong>.</li>
          <li>Need to change your date? On Mijn CBR you can move your appointment free of charge up to 7 days before the exam (or take an earlier slot if one opens).</li>
        </ol>

        <h2>2. Taking the CBR Exam in Turkish, Arabic, Russian, Persian, or Spanish (Tolkennet Interpreter)</h2>
        <div class="callout"><strong>Can I take the CBR exam in my own language?</strong> Standard touchscreen exams in the group hall are available ONLY in <strong>Dutch</strong> and <strong>English</strong>. However, if you prefer Turkish, Arabic, Russian, Persian (Farsi), Spanish, Polish, Ukrainian, or another language, you have two smart strategies:</div>
        <ul>
          <li><strong>Option A (Most Popular &amp; Cheapest — €57):</strong> Study all Dutch RVV rules and 50 realistic exams in your native language + English on <strong>ExamTheorie</strong> so you understand every trap 100%, then sit the standard English touchscreen exam at Mijn CBR for just €57.00.</li>
          <li><strong>Option B (Individueel Begeleid Examen + Official Interpreter):</strong> Book an <em>Individueel begeleid examen</em> (individual supervised exam) through CBR (or your driving school) and order a certified interpreter via <strong>Tolkennet</strong> at least 14 days in advance. A CBR employee sits with you in a private room while the sworn interpreter translates each question and answer choice aloud. (Family/friends are never permitted to translate.)</li>
        </ul>

        <h2>3. Extra-Time Exam (Theorie-examen Extra Tijd) &amp; Anxiety / Dyslexia Support</h2>
        <p>Candidates with dyslexia, ADHD, reading difficulties, or severe test anxiety can book the <strong>Theorie-examen met extra tijd</strong> directly on Mijn CBR (no medical certificate required!). You receive <strong>15 extra minutes (45 minutes total instead of 30)</strong> and free audio read-aloud via headphones in Dutch or English. For the practical driving test, CBR also offers a dedicated <strong>Faalangst-examen</strong> (80 minutes including a calming time-out option).</p>

        <h2>4. 2toDrive: Theory at 16, Driving Lessons at 16.5 &amp; Practical Exam at 17</h2>
        <ul>
          <li><strong>From 16 years old:</strong> You may sit the official CBR car theory exam (certificate valid for 1.5 years).</li>
          <li><strong>From 16.5 years old:</strong> You may start practical driving lessons and apply for your begeleiderspas (accompanying coach pass, naming 1 to 5 experienced coaches aged 27+ with 5+ years of clean driving licence).</li>
          <li><strong>From 17 years old:</strong> Pass your CBR practical test and drive accompanied by your registered coach until your 18th birthday, after which you drive independently!</li>
        </ul>`,
      faqs: [
        ['How do I avoid overpaying when booking my CBR theory exam?', 'Only book at the official portal mijn.cbr.nl using your DigiD and iDEAL (€50.50 Dutch / €57.00 English). Avoid commercial intermediary sites at the top of search ads.'],
        ['Can I take the CBR theory exam with a Turkish, Arabic, Russian, Persian, or Spanish interpreter?', 'Yes. You book an Individueel begeleid examen at CBR and book a sworn interpreter exclusively through Tolkennet at least 2 weeks before your exam date.'],
        ['Do I need a doctor’s note to book the CBR Extra-Time theory exam?', 'No medical note is needed for the Extra-Time theory exam: anyone who wants 15 extra minutes and audio headphones can select it directly on Mijn CBR for a small CBR surcharge.'],
      ],
    },
    nl: {
      title: 'CBR Theorie-examen Reserveren met DigiD: Talen, Tolk (Tolkennet), Extra Tijd & 2toDrive (2026)',
      metaTitle: 'CBR Theorie Reserveren 2026 — Mijn CBR, Tolk, Extra Tijd & 2toDrive | ExamTheorie',
      description: 'Stap-voor-stap uitleg CBR theorie-examen reserveren via Mijn CBR zonder tussenpersoon, examen met tolk (Turks, Arabisch, Russisch, Perzisch, Spaans), extra tijd en 2toDrive vanaf 16 jaar.',
      lead: 'Veel kandidaten betalen per ongeluk €30 tot €60 te veel via commerciële boekingssites of weten niet hoe het examen met tolk, extra tijd of 2toDrive precies werkt. Dit is het officiële overzicht voor 2026.',
      body: `
        <h2>1. Rechtstreeks Reserveren via Mijn CBR (Voorkom Extra Bemiddelingskosten!)</h2>
        <p>Reserveer je CBR auto theorie-examen altijd zelf rechtstreeks op <strong>mijn.cbr.nl</strong> met je persoonlijke <strong>DigiD</strong>:</p>
        <ol>
          <li>Log in op <strong>mijn.cbr.nl</strong> met de DigiD-app.</li>
          <li>Kies <em>Theorie-examen reserveren &rarr; Personenauto (B)</em>.</li>
          <li>Kies de taal (<strong>Nederlands €50,50</strong> of <strong>Engels €57,00</strong>), je CBR-locatie, datum en tijdstip en reken af met <strong>iDEAL</strong>.</li>
          <li>Verzetten? Tot 7 dagen vóór je examen kun je via Mijn CBR gratis van datum wisselen (en binnen 7 dagen altijd gratis vervroegen als er een plek vrijkomt).</li>
        </ol>

        <h2>2. CBR Examen in een Andere Taal (Turks, Arabisch, Russisch, Perzisch of Spaans via Tolk)</h2>
        <div class="callout"><strong>Welke talen biedt het CBR standaard aan?</strong> Het klassikale touchscreen-examen is uitsluitend beschikbaar in het <strong>Nederlands</strong> en <strong>Engels</strong>. Spreek je liever Turks, Arabisch, Russisch, Perzisch (Farsi) of Spaans? Dan zijn er twee routes:</div>
        <ul>
          <li><strong>Route A (Meest gekozen &amp; voordeligst — €57):</strong> Leer de volledige Nederlandse RVV-theorie en oefen alle 50 examens eerst haarscherp in je moedertaal én Nederlands/Engels op <strong>ExamTheorie</strong>, en leg daarna het reguliere Nederlandse (€50,50) of Engelse (€57,00) CBR-examen af.</li>
          <li><strong>Route B (Individueel begeleid examen met officiële tolk):</strong> Reserveer bij het CBR een <em>Individueel begeleid examen</em> en boek uiterlijk 14 dagen vooraf een professionele tolk via <strong>Tolkennet</strong>. Een eigen familielid of vriend mag nooit tolken.</li>
        </ul>

        <h2>3. Theorie-examen met Extra Tijd, Dyslexie &amp; Faalangst</h2>
        <p>Heb je dyslexie, moeite met lezen of last van examenspanning? Via Mijn CBR kun je zonder doktersverklaring kiezen voor een <strong>Theorie-examen met extra tijd</strong>: je krijgt <strong>15 minuten extra (45 in plaats van 30 minuten)</strong> plus voorleesgeluid via oordopjes. Voor het praktijkexamen bestaat daarnaast het speciale <strong>Faalangst-examen</strong> met time-out mogelijkheid.</p>

        <h2>4. 2toDrive: Theorie vanaf 16 Jaar, Rijles op 16,5 &amp; Praktijkexamen op je 17e</h2>
        <ul>
          <li><strong>Vanaf 16 jaar:</strong> Je mag officieel CBR auto theorie-examen doen (1,5 jaar geldig).</li>
          <li><strong>Vanaf 16,5 jaar:</strong> Starten met rijlessen en je begeleiderspas aanvragen bij 2toDrive (1 t/m 5 coaches van minimaal 27 jaar met 5+ jaar rijbewijs).</li>
          <li><strong>Vanaf 17 jaar:</strong> Praktijkexamen doen en tot je 18e verjaardag rijden met je coach naast je!</li>
        </ul>`,
      faqs: [
        ['Hoe voorkom ik dat ik te veel betaal voor mijn CBR theorie-examen?', 'Boek uitsluitend rechtstreeks op mijn.cbr.nl met je eigen DigiD (€50,50 Nederlands / €57,00 Engels) en vermijd commerciële tussenpersonen in zoekadvertenties.'],
        ['Kan ik het CBR theorie-examen met een tolk doen?', 'Ja, via een Individueel begeleid examen bij het CBR in combinatie met een officiële tolk van Tolkennet (minimaal 2 weken vooraf reserveren).'],
        ['Heb ik een medische verklaring nodig voor een theorie-examen met extra tijd?', 'Nee, iedereen kan zonder verklaring op Mijn CBR kiezen voor een theorie-examen met 15 minuten extra tijd en audio-ondersteuning.'],
      ],
    },
    tr: {
      title: 'DigiD ile CBR Teori Sınavı Randevusu Nasıl Alınır? Tercümanlı Sınav, Ek Süre ve 2toDrive (2026)',
      metaTitle: 'CBR Sınav Randevusu Alma 2026 — Mijn CBR DigiD, Türkçe Tercüman, Ek Süre & 2toDrive | ExamTheorie',
      description: '2026 güncel Mijn CBR üzerinden komisyonsuz ehliyet teori sınavı randevusu alma, Tolkennet resmi Türkçe tercümanlı CBR sınavı, ek süreli sınav (extra tijd) ve 16 yaş 2toDrive rehberi.',
      lead: 'Pek çok aday Google reklamlarındaki aracı sitelere yanlışlıkla 30–60 € fazladan komisyon ödüyor veya CBR sınavına Türkçe nasıl girebileceğini merak ediyor. İşte 2026 resmi CBR randevu ve sınav seçenekleri rehberi.',
      body: `
        <h2>1. Mijn CBR Üzerinden Komisyonsuz Resmi Randevu Alma (Adım Adım)</h2>
        <p>Aracı sitelere €85–€110 ödemek yerine randevunuzu doğrudan resmi devlet portalı <strong>mijn.cbr.nl</strong> üzerinden 2 dakikada alın:</p>
        <ol>
          <li><strong>mijn.cbr.nl</strong> adresine kişisel <strong>DigiD</strong> uygulamanızla giriş yapın.</li>
          <li><em>Theorie-examen reserveren &rarr; Personenauto (B)</em> seçeneğine tıklayın.</li>
          <li>Sınav dilini (<strong>Felemenkçe €50,50</strong> veya <strong>İngilizce €57,00</strong>), size en yakın CBR merkezini (Amsterdam, Rotterdam, Utrecht, Eindhoven, Rijswijk, Arnhem vb.), tarih ve saati seçip <strong>iDEAL</strong> ile ödeyin.</li>
          <li>Tarih değişikliği: Sınavdan 7 gün öncesine kadar Mijn CBR üzerinden ücretsiz tarih değiştirebilirsiniz (son 7 gün içinde de boşalan daha erken bir saate ücretsiz çekebilirsiniz).</li>
        </ol>

        <h2>2. CBR Sınavına Türkçe Girilebilir mi? (İngilizce Sınav vs Resmi Tolkennet Tercümanı)</h2>
        <div class="callout"><strong>Önemli Bilgi:</strong> Standart grup salonundaki dokunmatik ekranlı CBR sınavı yalnızca <strong>Felemenkçe</strong> ve <strong>İngilizce</strong> olarak yapılır. Ancak Türkçe konuşan adaylar için iki net yol vardır:</div>
        <ul>
          <li><strong>1. Yol (En Ekonomik ve En Çok Tercih Edilen — €57):</strong> Hollanda trafik kurallarının tamamını ve 50 gerçekçi sınavı <strong>ExamTheorie</strong> üzerinde kendi ana dilinizde (Türkçe + sesli okuma) ve İngilizce/Felemenkçe terimlerle iyice öğrenip Mijn CBR üzerinden €57,00’ya standart İngilizce (veya €50,50 Felemenkçe) sınava girmek.</li>
          <li><strong>2. Yol (Bireysel Tercümanlı Sınav — Individueel Begeleid Examen):</strong> CBR’dan <em>Individueel begeleid examen</em> (bireysel gözetimli sınav) randevusu alıp sınavdan en az 14 gün önce <strong>Tolkennet</strong> üzerinden yeminli Türkçe tercüman sipariş etmek. Özel odada CBR görevlisi eşliğinde tercüman her soruyu Türkçe okur (akraba veya arkadaş tercüman olarak kabul edilmez).</li>
        </ul>

        <h2>3. Ek Süreli Sınav (Extra Tijd), Sesli Okuma ve Heyecan Sınavı (Faalangst)</h2>
        <p>Okuma güçlüğü, dikkat dağınıklığı veya yoğun sınav stresi yaşayan adaylar herhangi bir doktor raporu gerekmeden Mijn CBR üzerinden <strong>Theorie-examen met extra tijd</strong> seçebilir: 30 dakika yerine <strong>45 dakika süre (+15 dk ek süre)</strong> ve kulaklıkla sesli okuma verilir. Direksiyon sınavı için de mola hakkı sunan özel <strong>Faalangst-examen</strong> mevcuttur.</p>

        <h2>4. 2toDrive: 16 Yaşında Teori Sınavı, 17 Yaşında Ehliyet!</h2>
        <ul>
          <li><strong>16 yaşından itibaren:</strong> Resmi CBR otomobil teori sınavına girilebilir (sertifika 1,5 yıl geçerlidir).</li>
          <li><strong>16,5 yaşından itibaren:</strong> Direksiyon derslerine başlanabilir ve refakatçi kartı (<em>begeleiderspas</em>) başvurusu yapılabilir.</li>
          <li><strong>17 yaşından itibaren:</strong> Direksiyon sınavını geçip 18 yaşına kadar kayıtlı refakatçi (coach) eşliğinde araç kullanılabilir.</li>
        </ul>`,
      faqs: [
        ['CBR teori sınavı randevusunda fazladan komisyon ödememek için nereden başvurulmalı?', 'Yalnızca resmi mijn.cbr.nl adresinden kendi DigiD hesabınızla başvurun (€50,50 Felemenkçe / €57,00 İngilizce). Reklamlardaki özel aracı sitelerden kaçının.'],
        ['CBR teori sınavına Türkçe tercümanla nasıl girilir?', 'CBR’dan Individueel begeleid examen (bireysel sınav) alıp sınavdan en az 2 hafta önce resmi Tolkennet kurumundan Türkçe tercüman rezervasyonu yaparak girilebilir.'],
        ['Ek süreli (45 dakikalık) CBR teori sınavı için doktor raporu şart mı?', 'Hayır, teori sınavında ek süre (+15 dakika) ve kulaklık desteği için doktor raporu istenmez; Mijn CBR üzerinden doğrudan seçilebilir.'],
      ],
    },
    ar: {
      title: 'كيفية حجز امتحان التيوري CBR عبر DigiD: المترجم الرسمي بالعربي، الوقت الإضافي ونظام 2toDrive (2026)',
      metaTitle: 'حجز امتحان CBR 2026 عبر Mijn CBR — مترجم عربي، وقت إضافي و2toDrive | ExamTheorie',
      description: 'دليل عملي لعام 2026 لحجز امتحان نظرية القيادة CBR مباشرة عبر Mijn CBR بدون سماسرة، تقديم الامتحان بالعربية عبر مترجم Tolkennet، الوقت الإضافي ونظام 2toDrive من سن 16.',
      lead: 'يدفع كثير من المتقدمين مبالغ إضافية كبيرة لمواقع الوساطة التجارية أو يتساءلون عن كيفية تقديم امتحان CBR باللغة العربية. إليك الدليل الرسمي الكامل لعام 2026.',
      body: `
        <h2>1. الحجز الرسمي المباشر عبر Mijn CBR باستخدام DigiD (بدون عمولات إضافية)</h2>
        <p>تجنب مواقع الوساطة التي تتقاضى 85–110 يورو، واحجز مباشرة عبر البوابة الحكومية الرسمية <strong>mijn.cbr.nl</strong>:</p>
        <ol>
          <li>سجّل الدخول إلى <strong>mijn.cbr.nl</strong> عبر تطبيق <strong>DigiD</strong>.</li>
          <li>اختر <em>Theorie-examen reserveren &rarr; Personenauto (B)</em>.</li>
          <li>حدد اللغة (<strong>الهولندية 50.50€</strong> أو <strong>الإنجليزية 57.00€</strong>)، ومركز CBR الأقرب إليك، والتاريخ والوقت، ثم ادفع عبر <strong>iDEAL</strong>.</li>
        </ol>

        <h2>2. تقديم امتحان CBR باللغة العربية: الخيار الإنجليزي مقابل المترجم الرسمي (Tolkennet)</h2>
        <div class="callout"><strong>معلومة هامة:</strong> يتوفر الامتحان الجماعي القياسي على الشاشات باللغتين <strong>الهولندية</strong> و<strong>الإنجليزية</strong> فقط، لكن أمام المتحدثين بالعربية خياران واضحان:</div>
        <ul>
          <li><strong>الخيار الأول (الأسرع والأوفر — 57€):</strong> دراسة جميع القواعد والـ 50 اختباراً باللغة العربية مع النطق الصوتي والمصطلحات الإنجليزية/الهولندية على منصة <strong>ExamTheorie</strong> حتى الإتقان التام، ثم دخول الامتحان القياسي بالإنجليزية مقابل 57.00€ فقط.</li>
          <li><strong>الخيار الثاني (امتحان فردي مع مترجم عربي معتمد):</strong> حجز امتحان فردي (<em>Individueel begeleid examen</em>) لدى CBR وطلب مترجم عربي محلف عبر مؤسسة <strong>Tolkennet</strong> قبل الموعد بـ 14 يوماً على الأقل (لا يُسمح باصطحاب قريب أو صديق للترجمة).</li>
        </ul>

        <h2>3. امتحان الوقت الإضافي (Extra Tijd) ونظام 2toDrive للشباب (من سن 16)</h2>
        <ul>
          <li><strong>الوقت الإضافي (45 دقيقة بدلاً من 30):</strong> يمكنك اختيار <em>Theorie-examen met extra tijd</em> مباشرة عبر Mijn CBR دون الحاجة لتقرير طبي، مع سماعات قراءة صوتية.</li>
          <li><strong>نظام 2toDrive:</strong> يتيح التقدم لامتحان النظري من عمر <strong>16 عاماً</strong>، وبدء دروس القيادة في <strong>16.5 عاماً</strong>، واجتياز العملي والقيادة برفقة مدرب مسجل في سن <strong>17 عاماً</strong>.</li>
        </ul>`,
      faqs: [
        ['كيف أتجنب دفع رسوم مضاعفة عند حجز امتحان CBR؟', 'احجز حصرياً عبر الموقع الرسمي mijn.cbr.nl بحساب DigiD الخاص بك (50.50€ للهولندية / 57.00€ للإنجليزية).'],
        ['هل يمكنني دخول امتحان النظري CBR بمترجم عربي؟', 'نعم، عبر حجز امتحان فردي (Individueel begeleid examen) لدى CBR وحجز مترجم رسمي معتمد من Tolkennet قبل أسبوعين على الأقل.'],
        ['هل يشترط تقرير طبي لحجز امتحان الوقت الإضافي؟', 'لا، لا يُطلب أي تقرير طبي للحصول على 15 دقيقة إضافية في الامتحان النظري عبر Mijn CBR.'],
      ],
    },
    ru: {
      title: 'Как записаться на экзамен CBR через DigiD: переводчик на русский, доп. время и 2toDrive (2026)',
      metaTitle: 'Запись на экзамен CBR 2026 — Mijn CBR, переводчик Tolkennet, доп. время и 2toDrive | ExamTheorie',
      description: 'Пошаговая инструкция 2026: запись на теоретический экзамен CBR через Mijn CBR без переплат, сдача с официальным русским переводчиком Tolkennet, дополнительное время и программа 2toDrive с 16 лет.',
      lead: 'Многие кандидаты переплачивают 30–60 € сайтам-посредникам из рекламы или ищут способ сдать теорию CBR на русском языке. Разбираем официальные правила записи и форматы экзамена 2026 года.',
      body: `
        <h2>1. Прямая запись через Mijn CBR с помощью DigiD (без посредников!)</h2>
        <p>Записывайтесь только на официальном государственном портале <strong>mijn.cbr.nl</strong>:</p>
        <ol>
          <li>Войдите на <strong>mijn.cbr.nl</strong> через приложение <strong>DigiD</strong>.</li>
          <li>Выберите <em>Theorie-examen reserveren &rarr; Personenauto (B)</em>.</li>
          <li>Укажите язык (<strong>нидерландский €50,50</strong> или <strong>английский €57,00</strong>), экзаменационный центр CBR, дату и время, и оплатите через <strong>iDEAL</strong>.</li>
        </ol>

        <h2>2. Как сдать экзамен CBR русскоязычному кандидату (Английский против Переводчика Tolkennet)</h2>
        <div class="callout"><strong>Важно знать:</strong> Стандартный групповой экзамен на сенсорном экране проводится только на <strong>нидерландском</strong> и <strong>английском</strong> языках. У русскоязычных кандидатов есть два удобных пути:</div>
        <ul>
          <li><strong>Вариант А (Самый популярный и выгодный — €57):</strong> Изучить все правила RVV и прорешать 50 экзаменов на русском языке (плюс английские/нидерландские термины) на <strong>ExamTheorie</strong>, после чего уверенно сдать стандартный английский экзамен в CBR за €57,00.</li>
          <li><strong>Вариант Б (Индивидуальный экзамен с присяжным переводчиком):</strong> Оформить <em>Individueel begeleid examen</em> в CBR и минимум за 14 дней заказать аккредитованного русского переводчика через службу <strong>Tolkennet</strong> (приводить родственников или друзей запрещено).</li>
        </ul>

        <h2>3. Экзамен с дополнительным временем (Extra Tijd) и программа 2toDrive (с 16 лет)</h2>
        <ul>
          <li><strong>Дополнительное время (+15 минут = 45 минут):</strong> Выбирается прямо в Mijn CBR без медицинской справки, включает аудиоозвучку вопросов в наушниках.</li>
          <li><strong>2toDrive:</strong> Сдача теории разрешена уже с <strong>16 лет</strong>, уроки вождения — с <strong>16,5 лет</strong>, а практический экзамен и вождение с наставником — с <strong>17 лет</strong>.</li>
        </ul>`,
      faqs: [
        ['Как не переплатить посредникам при записи на теорию CBR?', 'Бронируйте экзамен исключительно на официальном портале mijn.cbr.nl через DigiD (€50,50 на нидерландском / €57,00 на английском).'],
        ['Можно ли сдать теорию CBR с русским переводчиком?', 'Да, для этого бронируется индивидуальный экзамен (Individueel begeleid examen) в CBR и официальный переводчик через Tolkennet минимум за 2 недели.'],
        ['Нужна ли справка от врача для экзамена с дополнительным временем?', 'Нет, медицинская справка не требуется — опцию Extra Tijd можно выбрать самостоятельно в Mijn CBR.'],
      ],
    },
    fa: {
      title: 'نحوه ثبت‌نام آزمون تئوری CBR با DigiD: مترجم رسمی فارسی، وقت اضافه و طرح 2toDrive (۲۰۲۶)',
      metaTitle: 'ثبت‌نام آزمون CBR 2026 در Mijn CBR — مترجم فارسی Tolkennet، وقت اضافه و 2toDrive | ExamTheorie',
      description: 'راهنمای گام‌به‌گام ۲۰۲۶ برای رزرو مستقیم آزمون تئوری CBR در Mijn CBR بدون واسطه، شرکت در آزمون با مترجم رسمی فارسی (Tolkennet)، آزمون وقت اضافه و طرح 2toDrive از ۱۶ سالگی.',
      lead: 'بسیاری از داوطلبان به‌اشتباه ۳۰ تا ۶۰ یورو اضافه به سایت‌های واسطه تبلیغاتی می‌پردازند یا می‌خواهند بدانند چطور می‌توان آزمون تئوری CBR را به زبان فارسی داد. این راهنمای رسمی ۲۰۲۶ تمام روش‌ها را توضیح می‌دهد.',
      body: `
        <h2>۱. رزرو مستقیم و بدون واسطه در سامانه رسمی Mijn CBR با DigiD</h2>
        <p>همیشه مستقیماً از درگاه رسمی <strong>mijn.cbr.nl</strong> ثبت‌نام کنید:</p>
        <ol>
          <li>با اپلیکیشن <strong>DigiD</strong> وارد سایت <strong>mijn.cbr.nl</strong> شوید.</li>
          <li>گزینه <em>Theorie-examen reserveren &rarr; Personenauto (B)</em> را انتخاب کنید.</li>
          <li>زبان آزمون (<strong>هلندی ۵۰٫۵۰ یورو</strong> یا <strong>انگلیسی ۵۷٫۰۰ یورو</strong>)، شهر مرکز CBR، تاریخ و ساعت را انتخاب کرده و با <strong>iDEAL</strong> پرداخت نمایید.</li>
        </ol>

        <h2>۲. شرکت در آزمون CBR برای فارسی‌زبانان (آزمون انگلیسی یا مترجم رسمی Tolkennet)</h2>
        <div class="callout"><strong>نکته مهم:</strong> آزمون گروهی استاندارد روی مانیتور فقط به زبان‌های <strong>هلندی</strong> و <strong>انگلیسی</strong> برگزار می‌شود، اما فارسی‌زبانان دو راه عالی پیش رو دارند:</div>
        <ul>
          <li><strong>روش اول (محبوب‌ترین و کم‌هزینه‌ترین — ۵۷ یورو):</strong> مطالعه کامل قوانین RVV و حل ۵۰ آزمون شبیه‌سازی‌شده به زبان فارسی با تلفظ صوتی و اصطلاحات انگلیسی/هلندی در <strong>ExamTheorie</strong>، و سپس شرکت در آزمون استاندارد انگلیسی CBR تنها با ۵۷ یورو.</li>
          <li><strong>روش دوم (آزمون انفرادی با مترجم رسمی فارسی):</strong> رزرو آزمون انفرادی (<em>Individueel begeleid examen</em>) در CBR و درخواست مترجم رسمی فارسی از مؤسسه <strong>Tolkennet</strong> حداقل ۱۴ روز پیش از آزمون (همراه بردن خویشاوند یا دوست به‌عنوان مترجم ممنوع است).</li>
        </ul>

        <h2>۳. آزمون با وقت اضافه (Extra Tijd) و طرح 2toDrive برای نوجوانان ۱۶ ساله</h2>
        <ul>
          <li><strong>وقت اضافه (۴۵ دقیقه به‌جای ۳۰ دقیقه):</strong> بدون نیاز به گواهی پزشکی مستقیماً در Mijn CBR قابل انتخاب است و هدفون روخوانی صوتی نیز دارد.</li>
          <li><strong>طرح 2toDrive:</strong> امکان شرکت در آزمون تئوری از <strong>۱۶ سالگی</strong>، شروع کلاس رانندگی از <strong>۱۶٫۵ سالگی</strong> و گرفتن گواهینامه در <strong>۱۷ سالگی</strong> (رانندگی همراه مربی ثبت‌شده تا ۱۸ سالگی).</li>
        </ul>`,
      faqs: [
        ['چگونه هنگام رزرو آزمون CBR هزینه اضافی به سایت‌های واسطه ندهیم؟', 'فقط از سایت رسمی mijn.cbr.nl با حساب DigiD خود ثبت‌نام کنید (۵۰٫۵۰ یورو هلندی / ۵۷ یورو انگلیسی).'],
        ['آیا امکان شرکت در آزمون تئوری CBR با مترجم فارسی وجود دارد؟', 'بله، با رزرو آزمون انفرادی (Individueel begeleid examen) در CBR و هماهنگی مترجم رسمی از طریق Tolkennet حداقل ۲ هفته قبل از آزمون.'],
        ['آیا برای آزمون وقت اضافه (۴۵ دقیقه‌ای) نیاز به گواهی پزشک است؟', 'خیر، هر داوطلبی می‌تواند بدون مدرک پزشکی گزینه وقت اضافه را در Mijn CBR انتخاب کند.'],
      ],
    },
    es: {
      title: 'Cómo Reservar el Examen Teórico CBR con DigiD: Intérprete en Español, Tiempo Extra y 2toDrive (2026)',
      metaTitle: 'Reservar Examen CBR 2026 en Mijn CBR — Intérprete Español, Tiempo Extra y 2toDrive | ExamTheorie',
      description: 'Guía paso a paso 2026 para reservar tu examen teórico CBR directamente en Mijn CBR sin intermediarios, examinarte con intérprete oficial en español (Tolkennet), tiempo extra y 2toDrive.',
      lead: 'Muchos aspirantes pagan por error entre 30 y 60 € de más en webs intermediarias o desconocen cómo hacer el examen del CBR con intérprete en español. Aquí tienes todas las opciones oficiales para 2026.',
      body: `
        <h2>1. Reserva Oficial Directa en Mijn CBR con DigiD (¡Sin Comisiones!)</h2>
        <p>Reserva siempre directamente en el portal oficial <strong>mijn.cbr.nl</strong>:</p>
        <ol>
          <li>Inicia sesión en <strong>mijn.cbr.nl</strong> con tu aplicación <strong>DigiD</strong>.</li>
          <li>Elige <em>Theorie-examen reserveren &rarr; Personenauto (B)</em>.</li>
          <li>Selecciona el idioma (<strong>neerlandés 50,50 €</strong> o <strong>inglés 57,00 €</strong>), el centro de examen CBR, la fecha y hora, y paga mediante <strong>iDEAL</strong>.</li>
        </ol>

        <h2>2. Examinarse del CBR para Hispanohablantes (Inglés vs Intérprete Oficial Tolkennet)</h2>
        <div class="callout"><strong>Dato clave:</strong> El examen estándar en pantalla táctil solo se ofrece en <strong>neerlandés</strong> e <strong>inglés</strong>. Como hispanohablante tienes dos opciones excelentes:</div>
        <ul>
          <li><strong>Opción A (La más rápida y económica — 57 €):</strong> Estudiar toda la normativa RVV y los 50 exámenes reales en español (con audio y términos clave en inglés/neerlandés) en <strong>ExamTheorie</strong>, y presentarte al examen estándar en inglés por solo 57,00 €.</li>
          <li><strong>Opción B (Examen individual con intérprete oficial en español):</strong> Solicitar un <em>Individueel begeleid examen</em> en el CBR y reservar un intérprete jurado de español a través de <strong>Tolkennet</strong> con al menos 14 días de antelación (no se permite llevar familiares o amigos).</li>
        </ul>

        <h2>3. Examen con Tiempo Extra (Extra Tijd) y Programa 2toDrive (desde los 16 años)</h2>
        <ul>
          <li><strong>Tiempo extra (45 minutos en lugar de 30):</strong> Se puede elegir directamente en Mijn CBR sin certificado médico e incluye auriculares con lectura de voz.</li>
          <li><strong>2toDrive:</strong> Permite hacer el examen teórico desde los <strong>16 años</strong>, iniciar clases prácticas a los <strong>16,5</strong> y aprobar el práctico a los <strong>17 años</strong> conduciendo acompañado hasta los 18.</li>
        </ul>`,
      faqs: [
        ['¿Cómo evito pagar sobrecostes al reservar mi examen teórico CBR?', 'Reserva únicamente en la web oficial mijn.cbr.nl con tu propio DigiD (50,50 € en neerlandés / 57,00 € en inglés).'],
        ['¿Puedo hacer el examen teórico CBR con un intérprete de español?', 'Sí, reservando un Individueel begeleid examen en el CBR junto con un intérprete oficial de Tolkennet al menos 2 semanas antes.'],
        ['¿Hace falta justificante médico para pedir el examen con tiempo extra?', 'No, cualquier candidato puede seleccionar la modalidad de 45 minutos directamente en Mijn CBR sin informe médico.'],
      ],
    },
  },
];

module.exports = {
  EXTRA_GUIDES,
  EXTRA_CSS,
  renderMiniQuizHtml,
  buildMiniQuizSchema,
  renderCurriculumOverviewHtml,
};
