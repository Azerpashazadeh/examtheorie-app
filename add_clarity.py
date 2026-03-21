import os
import glob

CLARITY_SCRIPT = """<!-- Microsoft Clarity -->
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vz9ccypxk4");
</script>"""

MARKER = "vz9ccypxk4"  # Zaten eklenmiş mi kontrol için

html_files = glob.glob("**/*.html", recursive=True)
updated = 0
skipped = 0

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Zaten eklenmiş mi?
    if MARKER in content:
        print(f"SKIP (already has Clarity): {filepath}")
        skipped += 1
        continue

    # </head> varsa oraya ekle, yoksa <body>'nin hemen sonrasına
    if "</head>" in content:
        new_content = content.replace("</head>", f"{CLARITY_SCRIPT}\n</head>", 1)
    elif "<body" in content:
        idx = content.find("<body")
        idx = content.find(">", idx) + 1
        new_content = content[:idx] + f"\n{CLARITY_SCRIPT}" + content[idx:]
    else:
        print(f"SKIP (no <head> or <body>): {filepath}")
        skipped += 1
        continue

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"UPDATED: {filepath}")
    updated += 1

print(f"\n✅ Done! Updated: {updated} | Skipped: {skipped} | Total: {len(html_files)}")
