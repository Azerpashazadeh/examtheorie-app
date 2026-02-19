import os
import shutil

prefixes = ["tr-", "nl-", "ar-", "ru-", "fa-"]
base_dir = os.getcwd()

for filename in os.listdir(base_dir):
    if filename.endswith(".html"):
        for prefix in prefixes:
            new_name = f"{prefix}{filename}"
            new_path = os.path.join(base_dir, new_name)
            if not os.path.exists(new_path):
                shutil.copy(os.path.join(base_dir, filename), new_path)
                print(f"Oluşturuldu: {new_name}")
            else:
                print(f"Atlandı (zaten var): {new_name}")

print("İşlem tamamlandı!")
