/*!
 * ExamTheorie Shared TTS Core Engine (v1)
 * Supports 7 languages (en, nl, tr, ar, ru, fa, es) & 2 voices (capella, orion).
 * Non-invasive plug-and-play module with 1-line kill switch & 3-tier cache:
 *   1. Browser Memory Blob Cache (0 ms)
 *   2. Cloudflare R2 CDN (/tts-audio/v1/{lang}/{voice}/{hash32}.mp3)
 *   3. Local Gemini Web TTS Studio (http://127.0.0.1:3456) on localhost dev
 */
(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    enabled: true, // Master kill-switch: set false to disable TTS everywhere instantly
    cdnBaseUrl: '/tts-audio',
    localStudioUrl: 'http://127.0.0.1:3456',
    allowLocalStudioOnLocalhost: true,
    maxMemoryBlobs: 260
  };

  var CFG = Object.assign({}, DEFAULT_CONFIG, window.ET_TTS_CONFIG || {});
  if (!CFG.enabled) {
    window.ExamTheorieTTS = { enabled: false, stop: function () {} };
    return;
  }

  var LOCALE_BY_SHORT = {
    en: 'en-US',
    nl: 'nl-NL',
    tr: 'tr-TR',
    ar: 'ar-SA',
    fa: 'fa-IR',
    es: 'es-ES',
    ru: 'ru-RU'
  };

  var I18N = {
    en: {
      readQuestion: 'Read Question',
      readQuestionShort: 'Question',
      readWithOptions: 'Read + Options',
      readWithOptionsShort: '+ Options',
      readExplanation: 'Listen Explanation',
      readOptionTitle: 'Listen to this option',
      stop: 'Stop',
      pause: 'Pause',
      resume: 'Resume',
      loading: 'Loading…',
      voiceLabel: 'Voice',
      female: 'Female',
      male: 'Male',
      speedLabel: 'Speed',
      autoRead: 'Auto-read questions',
      settingsTitle: 'Voice Settings',
      audiobookListen: 'Listen to Chapter',
      audiobookTitle: 'Audiobook Player',
      listenSection: 'Listen section',
      listenCard: 'Listen',
      prevPart: 'Previous',
      nextPart: 'Next',
      partOf: '{cur} / {total}',
      unavailable: 'Audio is not cached yet for this text.'
    },
    nl: {
      readQuestion: 'Lees vraag voor',
      readQuestionShort: 'Vraag',
      readWithOptions: 'Vraag + opties',
      readWithOptionsShort: '+ Opties',
      readExplanation: 'Beluister uitleg',
      readOptionTitle: 'Beluister dit antwoord',
      stop: 'Stop',
      pause: 'Pauze',
      resume: 'Hervat',
      loading: 'Laden…',
      voiceLabel: 'Stem',
      female: 'Vrouw',
      male: 'Man',
      speedLabel: 'Snelheid',
      autoRead: 'Automatisch voorlezen',
      settingsTitle: 'Steminstellingen',
      audiobookListen: 'Hoofdstuk beluisteren',
      audiobookTitle: 'Audioboek-speler',
      listenSection: 'Sectie beluisteren',
      listenCard: 'Luister',
      prevPart: 'Vorige',
      nextPart: 'Volgende',
      partOf: '{cur} / {total}',
      unavailable: 'Audio voor deze tekst is nog niet beschikbaar.'
    },
    tr: {
      readQuestion: 'Soruyu Oku',
      readQuestionShort: 'Soru',
      readWithOptions: 'Soru + Şıklar',
      readWithOptionsShort: '+ Şıklar',
      readExplanation: 'Açıklamayı Dinle',
      readOptionTitle: 'Bu şıkkı dinle',
      stop: 'Durdur',
      pause: 'Duraklat',
      resume: 'Devam Et',
      loading: 'Yükleniyor…',
      voiceLabel: 'Ses Karakteri',
      female: 'Kadın',
      male: 'Erkek',
      speedLabel: 'Okuma Hızı',
      autoRead: 'Soruları otomatik oku',
      settingsTitle: 'Ses Ayarları',
      audiobookListen: 'Konuyu Dinle (Sesli Kitap)',
      audiobookTitle: 'Sesli Kitap Oynatıcı',
      listenSection: 'Bölümü dinle',
      listenCard: 'Dinle',
      prevPart: 'Önceki',
      nextPart: 'Sonraki',
      partOf: '{cur} / {total}',
      unavailable: 'Bu metin için ses kaydı henüz hazır değil.'
    },
    ar: {
      readQuestion: 'اقرأ السؤال',
      readQuestionShort: 'السؤال',
      readWithOptions: 'السؤال + الخيارات',
      readWithOptionsShort: '+ الخيارات',
      readExplanation: 'استمع إلى الشرح',
      readOptionTitle: 'استمع إلى هذا الخيار',
      stop: 'إيقاف',
      pause: 'إيقاف مؤقت',
      resume: 'متابعة',
      loading: 'جارٍ التحميل…',
      voiceLabel: 'الصوت',
      female: 'أنثى',
      male: 'ذكر',
      speedLabel: 'السرعة',
      autoRead: 'قراءة الأسئلة تلقائياً',
      settingsTitle: 'إعدادات الصوت',
      audiobookListen: 'استمع إلى الفصل',
      audiobookTitle: 'مشغل الكتاب الصوتي',
      listenSection: 'استمع للقسم',
      listenCard: 'استمع',
      prevPart: 'السابق',
      nextPart: 'التالي',
      partOf: '{cur} / {total}',
      unavailable: 'الصوت غير متوفر لهذا النص بعد.'
    },
    ru: {
      readQuestion: 'Озвучить вопрос',
      readQuestionShort: 'Вопрос',
      readWithOptions: 'Вопрос + ответы',
      readWithOptionsShort: '+ Ответы',
      readExplanation: 'Прослушать разбор',
      readOptionTitle: 'Прослушать этот вариант',
      stop: 'Стоп',
      pause: 'Пауза',
      resume: 'Продолжить',
      loading: 'Загрузка…',
      voiceLabel: 'Голос',
      female: 'Женский',
      male: 'Мужской',
      speedLabel: 'Скорость',
      autoRead: 'Авточтение вопросов',
      settingsTitle: 'Настройки озвучки',
      audiobookListen: 'Слушать главу',
      audiobookTitle: 'Аудиокнига',
      listenSection: 'Слушать раздел',
      listenCard: 'Слушать',
      prevPart: 'Назад',
      nextPart: 'Далее',
      partOf: '{cur} / {total}',
      unavailable: 'Озвучка для этого текста ещё не загружена.'
    },
    fa: {
      readQuestion: 'خواندن سؤال',
      readQuestionShort: 'سؤال',
      readWithOptions: 'سؤال + گزینه‌ها',
      readWithOptionsShort: '+ گزینه‌ها',
      readExplanation: 'شنیدن توضیح',
      readOptionTitle: 'شنیدن این گزینه',
      stop: 'توقف',
      pause: 'مکث',
      resume: 'ادامه',
      loading: 'در حال بارگذاری…',
      voiceLabel: 'صدا',
      female: 'زن',
      male: 'مرد',
      speedLabel: 'سرعت',
      autoRead: 'خوانش خودکار سؤالات',
      settingsTitle: 'تنظیمات صدا',
      audiobookListen: 'شنیدن فصل (کتاب صوتی)',
      audiobookTitle: 'پخش‌کننده کتاب صوتی',
      listenSection: 'شنیدن بخش',
      listenCard: 'شنیدن',
      prevPart: 'قبلی',
      nextPart: 'بعدی',
      partOf: '{cur} / {total}',
      unavailable: 'فایل صوتی این متن هنوز آماده نشده است.'
    },
    es: {
      readQuestion: 'Leer pregunta',
      readQuestionShort: 'Pregunta',
      readWithOptions: 'Pregunta + opciones',
      readWithOptionsShort: '+ Opciones',
      readExplanation: 'Escuchar explicación',
      readOptionTitle: 'Escuchar esta opción',
      stop: 'Detener',
      pause: 'Pausar',
      resume: 'Continuar',
      loading: 'Cargando…',
      voiceLabel: 'Voz',
      female: 'Mujer',
      male: 'Hombre',
      speedLabel: 'Velocidad',
      autoRead: 'Lectura automática',
      settingsTitle: 'Ajustes de voz',
      audiobookListen: 'Escuchar capítulo',
      audiobookTitle: 'Modo Audiolibro',
      listenSection: 'Escuchar sección',
      listenCard: 'Escuchar',
      prevPart: 'Anterior',
      nextPart: 'Siguiente',
      partOf: '{cur} / {total}',
      unavailable: 'El audio de este texto aún no está disponible.'
    }
  };

  var PREFS_STORAGE_KEY = 'et_tts_prefs_v1';
  var prefs = loadPrefs();
  var prefListeners = new Set();
  var stateListeners = new Set();
  var blobCache = new Map(); // objectKey -> blobUrl
  var inFlightMap = new Map(); // objectKey -> Promise<string>

  var isLocalHost = (function () {
    if (typeof location === 'undefined') return false;
    var h = location.hostname || '';
    return h === 'localhost' || h === '127.0.0.1';
  })();

  function loadPrefs() {
    var base = { voice: 'capella', rate: 1, autoRead: false, readScope: 'question' };
    try {
      var raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (parsed && (parsed.voice === 'capella' || parsed.voice === 'orion')) {
        base.voice = parsed.voice;
      } else if (parsed && parsed.voice === 'ursa') {
        base.voice = 'capella';
      }
      var r = Number(parsed && parsed.rate);
      if ([0.9, 1, 1.15, 1.25].indexOf(r) !== -1) {
        base.rate = r;
      }
      if (parsed && typeof parsed.autoRead === 'boolean') {
        base.autoRead = parsed.autoRead;
      }
      if (parsed && (parsed.readScope === 'question' || parsed.readScope === 'question_options')) {
        base.readScope = parsed.readScope;
      }
    } catch (_) {}
    return base;
  }

  function savePrefs(patch) {
    var changed = false;
    if (patch.voice && (patch.voice === 'capella' || patch.voice === 'orion') && patch.voice !== prefs.voice) {
      prefs.voice = patch.voice;
      changed = true;
    }
    if (patch.rate !== undefined) {
      var r = Number(patch.rate);
      if ([0.9, 1, 1.15, 1.25].indexOf(r) !== -1 && r !== prefs.rate) {
        prefs.rate = r;
        changed = true;
        if (audioEl) {
          audioEl.playbackRate = r;
        }
      }
    }
    if (typeof patch.autoRead === 'boolean' && patch.autoRead !== prefs.autoRead) {
      prefs.autoRead = patch.autoRead;
      changed = true;
    }
    if (patch.readScope && (patch.readScope === 'question' || patch.readScope === 'question_options') && patch.readScope !== prefs.readScope) {
      prefs.readScope = patch.readScope;
      changed = true;
    }
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) {}
    if (changed) {
      prefListeners.forEach(function (fn) {
        try { fn(Object.assign({}, prefs)); } catch (_) {}
      });
    }
    return Object.assign({}, prefs);
  }

  function detectPageShortLang() {
    if (typeof document !== 'undefined') {
      var docLang = (document.documentElement && document.documentElement.lang || '').trim().toLowerCase().slice(0, 2);
      if (LOCALE_BY_SHORT[docLang]) return docLang;
    }
    if (typeof location !== 'undefined') {
      var m = (location.pathname || '').match(/(?:deneme-|test-|\/)(en|nl|tr|ar|ru|fa|es)(?:\b|\.html|\/|$)/i);
      if (m && LOCALE_BY_SHORT[m[1].toLowerCase()]) return m[1].toLowerCase();
    }
    return 'en';
  }

  function resolveLocale(rawLang) {
    var short = String(rawLang || detectPageShortLang()).trim().toLowerCase().slice(0, 2);
    if (!LOCALE_BY_SHORT[short]) short = 'en';
    return { shortLang: short, locale: LOCALE_BY_SHORT[short] };
  }

  function getStrings(rawLang) {
    var short = resolveLocale(rawLang).shortLang;
    return I18N[short] || I18N.en;
  }

  function isRtlLang(rawLang) {
    var short = resolveLocale(rawLang).shortLang;
    return short === 'ar' || short === 'fa';
  }

  function canonicalizeTtsKeyText(rawText) {
    return String(rawText || '')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

  // Pure-JS UTF-8 SHA-256 fallback (guarantees identical digest even outside WebCrypto secure contexts)
  var K256 = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function sha256HexSync(str) {
    var bytes = new TextEncoder().encode(str);
    var l = bytes.length;
    var bitLenHi = Math.floor((l * 8) / 0x100000000);
    var bitLenLo = (l * 8) >>> 0;
    var padLen = ((l + 9 + 63) & ~63);
    var buf = new Uint8Array(padLen);
    buf.set(bytes);
    buf[l] = 0x80;
    var dv = new DataView(buf.buffer);
    dv.setUint32(padLen - 8, bitLenHi, false);
    dv.setUint32(padLen - 4, bitLenLo, false);

    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    var h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    var w = new Int32Array(64);

    for (var i = 0; i < padLen; i += 64) {
      for (var j = 0; j < 16; j++) w[j] = dv.getInt32(i + j * 4, false);
      for (var j2 = 16; j2 < 64; j2++) {
        var x = w[j2 - 15], y = w[j2 - 2];
        var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
        var s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
        w[j2] = (w[j2 - 16] + s0 + w[j2 - 7] + s1) | 0;
      }
      var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      for (var t = 0; t < 64; t++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + K256[t] + w[t]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
      h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
    }

    function hex8(n) { return (n >>> 0).toString(16).padStart(8, '0'); }
    return hex8(h0) + hex8(h1) + hex8(h2) + hex8(h3) + hex8(h4) + hex8(h5) + hex8(h6) + hex8(h7);
  }

  function computeCacheKeySync(rawText, options) {
    var opts = options || {};
    var canonicalText = canonicalizeTtsKeyText(rawText);
    var loc = resolveLocale(opts.language);
    var voice = opts.voice === 'orion' ? 'orion' : (opts.voice === 'capella' ? 'capella' : prefs.voice);
    var mode = 'bard';
    var ext = 'mp3';
    var payload = 'v1|' + loc.locale + '|' + voice + '|' + mode + '|' + ext + '|' + canonicalText;
    var hash32 = sha256HexSync(payload).slice(0, 32);
    return {
      canonicalText: canonicalText,
      shortLang: loc.shortLang,
      locale: loc.locale,
      voice: voice,
      mode: mode,
      ext: ext,
      hash32: hash32,
      objectKey: 'v1/' + loc.shortLang + '/' + voice + '/' + hash32 + '.' + ext
    };
  }

  function storeBlobInCache(objectKey, blob) {
    if (blobCache.has(objectKey)) {
      return blobCache.get(objectKey);
    }
    if (blobCache.size >= CFG.maxMemoryBlobs) {
      var oldestKey = blobCache.keys().next().value;
      var oldestUrl = blobCache.get(oldestKey);
      blobCache.delete(oldestKey);
      try { URL.revokeObjectURL(oldestUrl); } catch (_) {}
    }
    var url = URL.createObjectURL(blob);
    blobCache.set(objectKey, url);
    return url;
  }

  async function tryFetchAudioBlob(url, fetchOpts) {
    try {
      var res = await fetch(url, fetchOpts || { method: 'GET' });
      if (!res.ok) return null;
      var ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.indexOf('text/html') !== -1 || ct.indexOf('application/json') !== -1) {
        return null;
      }
      var blob = await res.blob();
      if (!blob || blob.size < 128) return null;
      return blob;
    } catch (_) {
      return null;
    }
  }

  async function resolveAudioUrl(rawText, options) {
    var opts = options || {};
    var keyInfo = computeCacheKeySync(rawText, opts);
    if (!keyInfo.canonicalText) {
      throw new Error('Empty text');
    }

    if (blobCache.has(keyInfo.objectKey)) {
      return blobCache.get(keyInfo.objectKey);
    }

    if (inFlightMap.has(keyInfo.objectKey)) {
      return inFlightMap.get(keyInfo.objectKey);
    }

    var job = (async function () {
      var studioBase = (CFG.localStudioUrl || '').replace(/\/+$/, '');
      var cdnBase = (CFG.cdnBaseUrl || '').replace(/\/+$/, '');

      // 1. On localhost development, check local studio disk cache first (1 ms)
      if (isLocalHost && CFG.allowLocalStudioOnLocalhost && studioBase) {
        var localCachedBlob = await tryFetchAudioBlob(studioBase + '/tts-cache/' + keyInfo.objectKey);
        if (localCachedBlob) {
          return storeBlobInCache(keyInfo.objectKey, localCachedBlob);
        }
      }

      // 2. Check Cloudflare R2 / CDN endpoint
      if (cdnBase) {
        var cdnBlob = await tryFetchAudioBlob(cdnBase + '/' + keyInfo.objectKey);
        if (cdnBlob) {
          return storeBlobInCache(keyInfo.objectKey, cdnBlob);
        }
      }

      // 3. On localhost development (when not prefetch-only if disabled), synthesize live via local Gemini Web TTS Studio
      if (isLocalHost && CFG.allowLocalStudioOnLocalhost && studioBase && !opts.cdnOnly) {
        var liveBlob = await tryFetchAudioBlob(studioBase + '/api/tts/exam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: keyInfo.canonicalText,
            language: keyInfo.locale,
            voice: keyInfo.voice,
            mode: keyInfo.mode,
            audioFormat: 1
          })
        });
        if (liveBlob) {
          return storeBlobInCache(keyInfo.objectKey, liveBlob);
        }
      }

      throw new Error(getStrings(keyInfo.shortLang).unavailable);
    })().finally(function () {
      inFlightMap.delete(keyInfo.objectKey);
    });

    inFlightMap.set(keyInfo.objectKey, job);
    return job;
  }

  function prefetchAudio(rawText, options) {
    var opts = Object.assign({ cdnOnly: !isLocalHost }, options || {});
    var keyInfo = computeCacheKeySync(rawText, opts);
    if (!keyInfo.canonicalText || blobCache.has(keyInfo.objectKey) || inFlightMap.has(keyInfo.objectKey)) {
      return;
    }
    resolveAudioUrl(rawText, opts).catch(function () {});
  }

  // Shared <audio> player & sequential queue state
  var audioEl = typeof Audio !== 'undefined' ? new Audio() : null;
  if (audioEl) {
    audioEl.preload = 'auto';
  }

  var playback = {
    runId: 0,
    ownerId: null,
    status: 'idle', // 'idle' | 'loading' | 'playing' | 'paused' | 'error'
    queue: [],
    itemIndex: 0,
    errorMessage: ''
  };

  function emitState() {
    var snapshot = {
      ownerId: playback.ownerId,
      status: playback.status,
      itemIndex: playback.itemIndex,
      totalItems: playback.queue.length,
      errorMessage: playback.errorMessage
    };
    stateListeners.forEach(function (fn) {
      try { fn(snapshot); } catch (_) {}
    });
  }

  function stop() {
    playback.runId += 1;
    var prevItem = playback.queue[playback.itemIndex];
    if (prevItem && typeof prevItem.onEnd === 'function') {
      try { prevItem.onEnd(); } catch (_) {}
    }
    if (audioEl) {
      try {
        audioEl.pause();
        audioEl.removeAttribute('src');
        audioEl.load();
      } catch (_) {}
    }
    playback.ownerId = null;
    playback.status = 'idle';
    playback.queue = [];
    playback.itemIndex = 0;
    playback.errorMessage = '';
    emitState();
  }

  async function playQueueIndex(myRunId, idx) {
    if (myRunId !== playback.runId) return;
    if (idx >= playback.queue.length) {
      stop();
      return;
    }

    playback.itemIndex = idx;
    var item = playback.queue[idx];
    playback.status = 'loading';
    playback.errorMessage = '';
    emitState();

    // Warm next item in queue while current loads/plays
    if (idx + 1 < playback.queue.length) {
      var nextItem = playback.queue[idx + 1];
      prefetchAudio(nextItem.text, { language: nextItem.language, voice: nextItem.voice });
    }

    try {
      var blobUrl = await resolveAudioUrl(item.text, {
        language: item.language,
        voice: item.voice
      });
      if (myRunId !== playback.runId) return;

      if (typeof item.onStart === 'function') {
        try { item.onStart(idx); } catch (_) {}
      }

      await new Promise(function (resolve, reject) {
        if (!audioEl || myRunId !== playback.runId) {
          resolve();
          return;
        }
        var settled = false;
        function cleanup() {
          audioEl.removeEventListener('ended', onEnded);
          audioEl.removeEventListener('error', onError);
        }
        function onEnded() {
          if (settled) return;
          settled = true;
          cleanup();
          resolve();
        }
        function onError() {
          if (settled) return;
          settled = true;
          cleanup();
          reject(new Error('Audio playback error'));
        }
        audioEl.addEventListener('ended', onEnded);
        audioEl.addEventListener('error', onError);
        audioEl.src = blobUrl;
        audioEl.playbackRate = prefs.rate;
        var p = audioEl.play();
        playback.status = 'playing';
        emitState();
        if (p && typeof p.catch === 'function') {
          p.catch(function (err) {
            if (settled) return;
            settled = true;
            cleanup();
            reject(err);
          });
        }
      });

      if (typeof item.onEnd === 'function') {
        try { item.onEnd(idx); } catch (_) {}
      }

      if (myRunId !== playback.runId) return;
      await playQueueIndex(myRunId, idx + 1);
    } catch (err) {
      if (typeof item.onEnd === 'function') {
        try { item.onEnd(idx); } catch (_) {}
      }
      if (myRunId !== playback.runId) return;
      playback.status = 'error';
      playback.errorMessage = (err && err.message) || 'Audio error';
      emitState();
      setTimeout(function () {
        if (myRunId === playback.runId && playback.status === 'error') {
          stop();
        }
      }, 2800);
    }
  }

  function toggleOrPlayQueue(ownerId, items, options) {
    var opts = options || {};
    if (playback.ownerId === ownerId) {
      if (playback.status === 'playing' && audioEl) {
        audioEl.pause();
        playback.status = 'paused';
        emitState();
        return;
      }
      if (playback.status === 'paused' && audioEl) {
        audioEl.playbackRate = prefs.rate;
        audioEl.play().then(function () {
          playback.status = 'playing';
          emitState();
        }).catch(function () { stop(); });
        return;
      }
      if (playback.status === 'loading') {
        stop();
        return;
      }
    }

    stop();
    var normalizedQueue = (items || [])
      .map(function (it) {
        if (typeof it === 'string') {
          return {
            text: it,
            language: opts.language,
            voice: opts.voice || prefs.voice
          };
        }
        return {
          text: it.text,
          language: it.language || opts.language,
          voice: it.voice || opts.voice || prefs.voice,
          onStart: it.onStart,
          onEnd: it.onEnd
        };
      })
      .filter(function (it) {
        return Boolean(canonicalizeTtsKeyText(it.text));
      });

    if (!normalizedQueue.length) return;

    playback.runId += 1;
    var myRunId = playback.runId;
    playback.ownerId = ownerId;
    playback.queue = normalizedQueue;
    playback.itemIndex = 0;
    playQueueIndex(myRunId, 0);
  }

  function jumpInActiveQueue(delta) {
    if (!playback.ownerId || !playback.queue.length) return;
    var nextIdx = Math.max(0, Math.min(playback.queue.length - 1, playback.itemIndex + delta));
    var prevItem = playback.queue[playback.itemIndex];
    if (prevItem && typeof prevItem.onEnd === 'function') {
      try { prevItem.onEnd(playback.itemIndex); } catch (_) {}
    }
    if (audioEl) {
      try { audioEl.pause(); } catch (_) {}
    }
    playback.runId += 1;
    playQueueIndex(playback.runId, nextIdx);
  }

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('pagehide', stop);
    window.addEventListener('beforeunload', stop);
  }

  window.ExamTheorieTTS = {
    enabled: true,
    config: CFG,
    getPrefs: function () { return Object.assign({}, prefs); },
    setPrefs: savePrefs,
    onPrefsChange: function (fn) { prefListeners.add(fn); return function () { prefListeners.delete(fn); }; },
    onStateChange: function (fn) { stateListeners.add(fn); return function () { stateListeners.delete(fn); }; },
    getState: function () {
      return {
        ownerId: playback.ownerId,
        status: playback.status,
        itemIndex: playback.itemIndex,
        totalItems: playback.queue.length,
        errorMessage: playback.errorMessage
      };
    },
    detectPageShortLang: detectPageShortLang,
    resolveLocale: resolveLocale,
    getStrings: getStrings,
    isRtlLang: isRtlLang,
    canonicalizeTtsKeyText: canonicalizeTtsKeyText,
    computeCacheKeySync: computeCacheKeySync,
    resolveAudioUrl: resolveAudioUrl,
    prefetchAudio: prefetchAudio,
    toggleOrPlayQueue: toggleOrPlayQueue,
    jumpInActiveQueue: jumpInActiveQueue,
    stop: stop
  };
})();
