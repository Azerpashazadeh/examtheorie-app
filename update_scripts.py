import os
import re

for root, dirs, files in os.walk("."):
    for file in files:
        # test- ile başlayan, .html olan ve test-1-en.html OLMAYANLAR
        if file.startswith("test-") and file.endswith(".html") and file != "test-1-en.html":
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Eğer dosya zaten temizlenmişse (başlangıç cümlesi yoksa) atla.
            if 'const display = document.querySelector(".coordinateDisplay");' not in content:
                continue

            # REGEX MANTIĞI:
            # Başlangıç: const display ... .coordinateDisplay");
            # Ara: Her türlü karakter (satır atlamaları dahil)
            # Bitiş: }, 2000); \s* }); (yani işaretin kaldırıldığı setTimeout'un sonu)
            pattern = r'const display = document\.querySelector\("\.coordinateDisplay"\);.*?\s*\}\s*,\s*2000\s*\)\s*;\s*\}\s*\)\s*;'
            
            # Eşleşen bloğu bul ve tamamen sil (boşlukla değiştir)
            new_content = re.sub(pattern, "", content, flags=re.DOTALL)

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"TEMİZLENDİ: {file_path}")
            else:
                print(f"Eşleşme bulunamadı: {file_path}")
