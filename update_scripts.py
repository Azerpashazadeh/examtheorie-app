import os

# 1. Yeni CSS Bloğu
new_css = """/* 1. Tüm Tarayıcı Boşluklarını Sıfırla */
        html,
        body {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 80px;
            width: 100%;
            overflow-x: hidden;
            /* Sağ tarafta boşluk yüzünden kayma oluşmasını engeller */
        }

        body {
            font-family: "Trirong", serif;
            line-height: 1.2;
            /* Genişliği belirtiyoruz */
            width: 75%;
            /* ÖNEMLİ: Üst-alt 0, sağ-sol otomatik yaparak ortalar */
            margin: 0 auto !important;
            display: block;
            padding: 15px;
            box-sizing: border-box;
        }

        /* 1. Masaüstü (Geniş ekranlar) */
        @media (min-width: 1025px) {
            body {
                width: 75%;
            }
        }

        /* 2. Tabletler (768px - 1024px arası) */
        @media (min-width: 768px) and (max-width: 1024px) {
            body {
                width: 95%;
            }
        }

        /* 3. Mobil Telefonlar (767px ve altı) */
        @media (max-width: 767px) {
            body {
                width: 96%;
            }
        }"""

# 2. Yeni Güvenlik Scripti
new_security_script = """<script>
        // 1. Sağ tık menüsünü tamamen kapatır (CTRL+U'ya oradan ulaşımı da keser)
        document.addEventListener('contextmenu', event => event.preventDefault());        // 2. Klavye üzerinden tüm arka kapıları kilitler
        document.onkeydown = function (e) {
            // F12 tuşu
            if (e.keyCode == 123) return false;            // CTRL+U (Kaynağı Görüntüle)
            if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;            // CTRL+S (Sayfayı Kaydet)
            if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) return false;            // CTRL+SHIFT+I, J ve C (İncele ve Konsol araçları)
            if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) return false;
        };        // 3. Metin seçmeyi ve kopyalamayı da engelle (İçerik çalınmasın)
        document.addEventListener('selectstart', e => e.preventDefault());
        document.addEventListener('copy', e => e.preventDefault());
    </script>"""

for root, dirs, files in os.walk("."):
    for file in files:
        # test- ile başlamayan .html dosyaları
        if not file.startswith("test-") and file.endswith(".html"):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                modified = False

                # --- İŞLEM 1: CSS GÜNCELLEME (Parça bazlı) ---
                # Eski CSS'in başlangıcını hedef alıyoruz
                css_start_marker = "html, body {"
                css_end_marker = "font-family: \"Trirong\", serif;"
                
                if css_start_marker in content and "overflow: hidden !important;" in content:
                    # <style> tagından sonraki ilk html, body bloğunu bulup değiştirelim
                    # Çok karmaşık regex yerine basit replace deneyelim (boşluklar dahil)
                    # Eğer tam bloğu bulamazsak bile genel temizlik yapacak
                    import re
                    content = re.sub(r'html, body\s*\{.*?\}\s*body\s*\{.*?font-family:\s*"Trirong",\s*serif;.*?\}', new_css, content, flags=re.DOTALL)
                    modified = True

                # --- İŞLEM 2: SCRIPT GÜNCELLEME (Parça bazlı) ---
                if 'window.addEventListener("scroll"' in content:
                    # <script> bloğunun başlangıç ve bitişini bulalım
                    start_idx = content.find('<script>\nwindow.addEventListener("scroll"')
                    if start_idx == -1: # Alternatif başlangıç
                        start_idx = content.find('<script>\r\nwindow.addEventListener("scroll"')
                    
                    end_idx = content.find('</script>', start_idx)
                    
                    if start_idx != -1 and end_idx != -1:
                        old_block = content[start_idx:end_idx+9] # </script> dahil
                        content = content.replace(old_block, new_security_script)
                        modified = True

                if modified:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Başarıyla Güncellendi: {file_path}")

            except Exception as e:
                print(f"Hata oluştu ({file}): {e}")
