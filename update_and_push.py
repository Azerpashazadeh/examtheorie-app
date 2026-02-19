import os
import shutil
import subprocess
from bs4 import BeautifulSoup

# Eski bağlantı
old_link = "https://www.examtheorie.nl/eng-test-and-theory-menu"

# Diller ve ön ekler
prefix_map = {
    "tr-": "tr",
    "nl-": "nl",
    "ar-": "ar",
    "ru-": "ru",
    "fa-": "fa"
}

base_dir = os.getcwd()

# 1️⃣ Eski kopyaları sil
for filename in os.listdir(base_dir):
    if filename.startswith(tuple(prefix_map.keys())) and filename.endswith(".html"):
        os.remove(os.path.join(base_dir, filename))
        print(f"Silindi: {filename}")

# 2️⃣ Yeni kopyaları oluştur ve linkleri düzenle
for filename in os.listdir(base_dir):
    if filename.endswith(".html") and not filename.startswith(tuple(prefix_map.keys())):
        original_path = os.path.join(base_dir, filename)
        
        for prefix, lang_code in prefix_map.items():
            new_name = f"{prefix}{filename}"
            new_path = os.path.join(base_dir, new_name)

            # Dosya içeriğini oku
            with open(original_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Link değiştir
            new_link = f"https://www.examtheorie.nl/{lang_code}-test-and-theory-menu"
            content = content.replace(old_link, new_link)

            # HTML Beautify (opsiyonel ama istenmiş)
            soup = BeautifulSoup(content, "html.parser")
            pretty_html = soup.prettify()

            # Yeni dosyayı yaz
            with open(new_path, "w", encoding="utf-8") as f:
                f.write(pretty_html)

            print(f"Oluşturuldu ve düzenlendi: {new_name}")

# 3️⃣ Git ile commit ve push
print("\nGit işlemleri başlatılıyor...")
subprocess.run(["git", "add", "."], check=True)
subprocess.run(["git", "commit", "-m", "Dil kopyaları güncellendi ve linkler düzenlendi"], check=True)
subprocess.run(["git", "push", "origin", "main"], check=True)

print("\n✅ Tüm işlemler tamamlandı ve GitHub'a yüklendi!")
