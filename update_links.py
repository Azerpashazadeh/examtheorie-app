import os
import re

ROOT = '.'
NEW_URL = 'https://examtheorie.nl/'
NEW_URL_NO_SLASH = 'https://examtheorie.nl'

test_files_updated = 0
theory_files_updated = 0
test_files_skipped = 0
theory_files_skipped = 0

# Teori dosyalarında aranacak geri dön metinleri
BACK_TEXTS = [
    'Genel bakışa dön',
    'Geri Dön',
    'Back to overview',
    'Terug naar overzicht',
    'العودة إلى النظرة العامة',
    'العودة إلى نظرة عامة',
]

for filename in os.listdir(ROOT):
    if not filename.endswith('.html'):
        continue

    filepath = os.path.join(ROOT, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original

    if filename.startswith('test-'):
        # Zaten examtheorie.nl/ olan onclick'lere dokunma
        # Sadece eski URL içerenleri değiştir
        new_content = re.sub(
            r"(onclick=\")window\.open\('(?!https://examtheorie\.nl/)[^']+',\s*'_blank'\)(\")",
            lambda m: m.group(1) + f"window.open('{NEW_URL}', '_blank')" + m.group(2),
            content
        )
        if new_content != content:
            content = new_content
            test_files_updated += 1
            print(f'✅ [test] {filename}')
        else:
            test_files_skipped += 1

    else:
        changed = False

        # 1) Sadece eski domain subpage'lerine giden linkleri değiştir
        # examtheorie.nl/ ile biten (root) veya examtheorie.nl olmayan linklere dokunma
        new_content = re.sub(
            r'(<a[^>]*href=")https://(?:www\.)?(?:oefenen\.)?examtheorie\.nl/[^"]+(")',
            r'\g<1>' + NEW_URL_NO_SLASH + r'\2',
            content
        )
        if new_content != content:
            content = new_content
            changed = True

        # 2) Metin bazlı — edge case'ler için
        for text in BACK_TEXTS:
            flexible_text = r'\s+'.join(re.escape(word) for word in text.split())
            pattern = r'(<a\b[^>]*\bhref=")(?!' + re.escape(NEW_URL_NO_SLASH) + r')[^"]*(")((?:[^>]*)>)\s*' + flexible_text + r'\s*</a>'
            replacement = r'\g<1>' + NEW_URL_NO_SLASH + r'\2\3' + text + r'</a>'
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            if new_content != content:
                content = new_content
                changed = True

        if changed:
            theory_files_updated += 1
            print(f'✅ [theory] {filename}')
        else:
            theory_files_skipped += 1

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print(f'\n📊 Sonuç:')
print(f'   test-* güncellendi: {test_files_updated}  |  zaten hazır: {test_files_skipped}')
print(f'   teori  güncellendi: {theory_files_updated}  |  zaten hazır: {theory_files_skipped}')
print(f'   toplam güncellenen: {test_files_updated + theory_files_updated}')
