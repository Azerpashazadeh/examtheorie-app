import os
import re

# Yeni, tertemiz buton kodumuz
new_btn_code = """var viewBtn = document.getElementById("viewResult");
if (viewBtn) {
    var old = viewBtn.onclick;
    viewBtn.onclick = function (ev) {
        if (old) old(ev);
        setCompleted();
        notifyNewSystem();
    };
}"""

for root, dirs, files in os.walk("."):
    for file in files:
        # test- ile başlayan, .html olan ve test-1-en.html OLMAYANLAR
        if file.startswith("test-") and file.endswith(".html") and file != "test-1-en.html":
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Eğer notifyNewSystem çağrısı zaten varsa, bu dosya güncellenmiştir, atla.
            if "notifyNewSystem();" in content:
                continue

            # REGEX AÇIKLAMASI:
            # Başlangıç: var viewBtn = document.getElementById("viewResult");
            # Ara: Herhangi bir karakter (satır atlamaları dahil)
            # Bitiş: setCompleted(); followed by }; followed by }
            # Not: Boşluklar ( \s* ) her iki durumda da tolere edilir.
            pattern = r'var viewBtn = document\.getElementById\("viewResult"\);.*?\n\s+setCompleted\(\);\s*};\s*}'
            
            # re.DOTALL sayesinde satır atlamalarını da kapsar
            new_content = re.sub(pattern, new_btn_code, content, flags=re.DOTALL)

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"BAŞARIYLA GÜNCELLENDİ: {file_path}")
            else:
                print(f"Eşleşme bulunamadı (boşluk farkı olabilir): {file_path}")
