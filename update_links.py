import os
import re

ROOT = '.'
NEW_URL = 'https://examtheorie.nl/'
NEW_URL_NO_SLASH = 'https://examtheorie.nl'

test_files_updated = 0
theory_files_updated = 0

# Teori dosyalarında aranacak geri dön metinleri
BACK_TEXTS = [
    'Genel bakışa dön',
    'Geri Dön',
    'Back to overview',
    'Terug naar overzicht',
    'العودة إلى النظرة العامة',
]

for filename in os.listdir(ROOT):
    if not filename.endswith('.html'):
        continue

    filepath = os.path.join(ROOT, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original

    if filename.startswith('test-'):
        # btnExternalLink onclick URL'sini değiştir
        new_content = re.sub(
            r'(onclick=")window\.open\(\'[^\']+\',\s*\'_blank\'\)(")',
            lambda m: m.group(1) + f"window.open('{NEW_URL}', '_blank')" + m.group(2),
            content
        )
        if new_content != content:
            content = new_content
            test_files_updated += 1
            print(f'✅ [test] {filename}')

    else:
        # Teori dosyaları — geri dön bağlantılarını güncelle
        changed = False
        for text in BACK_TEXTS:
            pattern = r'(<a\b[^>]*\bhref=")[^"]*(")((?:[^>]*)>)\s*' + re.escape(text) + r'\s*</a>'
            replacement = r'\g<1>' + NEW_URL_NO_SLASH + r'\2\3' + text + r'</a>'
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            if new_content != content:
                content = new_content
                changed = True

        if changed:
            theory_files_updated += 1
            print(f'✅ [theory] {filename}')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print(f'\n📊 Sonuç:')
print(f'   test-* dosyaları güncellendi: {test_files_updated}')
print(f'   teori dosyaları güncellendi:  {theory_files_updated}')
print(f'   toplam: {test_files_updated + theory_files_updated}')
