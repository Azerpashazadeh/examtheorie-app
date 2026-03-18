import os

langs = ['en', 'tr', 'ar', 'nl']
numbers = range(1, 51)

report_ok = []
report_skipped = []
report_notfound = []
report_error = []

NEW_CSS = """
    /* Fixed bottom overlay - always aligned with button container */
    #bottom-overlay {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #085dc4;
      pointer-events: none;
      z-index: 1;
    }

    @media (max-width: 768px) {
      #bottom-overlay {
        height: 11.75vh;
      }
    }
"""

for lang in langs:
    for num in numbers:
        filename = f"test-{num}-{lang}.html"

        if not os.path.exists(filename):
            report_notfound.append(filename)
            continue

        try:
            with open(filename, 'r', encoding='utf-8') as f:
                original = f.read()

            content = original
            changes = []

            # CHANGE 1: .overlay desktop - remove bottom inset
            old1 = '        inset 0 -60px 0 0 #085dc4,\n        /* Alt kenar i\u00e7in 60px kal\u0131nl\u0131k */\n        inset 50px 0 0 0 #085dc4,'
            new1 = '        inset 50px 0 0 0 #085dc4,'
            if old1 in content:
                content = content.replace(old1, new1)
                changes.append('overlay desktop bottom removed')

            # CHANGE 2: .overlay mobile - remove bottom inset
            old2 = '          inset -5px 0 0 0 #085dc4,\n          /* Sa\u011f kenar */\n          inset 0 calc(-11.75vh) 0 0 #085dc4;\n        /* Alt kenar */\n      }\n    }\n\n    .overlay-thin-top {'
            new2 = '          inset -5px 0 0 0 #085dc4;\n        /* Sa\u011f kenar */\n      }\n    }\n\n    .overlay-thin-top {'
            if old2 in content:
                content = content.replace(old2, new2)
                changes.append('overlay mobile bottom removed')

            # CHANGE 3: .overlay-thin-top desktop - remove bottom inset
            old3 = '        inset 0 -60px 0 0 #085dc4,\n        /* Alt kenar */\n        inset 50px 0 0 0 #085dc4,'
            new3 = '        inset 50px 0 0 0 #085dc4,'
            if old3 in content:
                content = content.replace(old3, new3)
                changes.append('overlay-thin-top desktop bottom removed')

            # CHANGE 4: .overlay-thin-top mobile - remove bottom inset
            old4 = '          inset 0 calc(-11.75vh) 0 0 #085dc4,\n          /* Alt kenar */\n          inset 5px 0 0 0 #085dc4,'
            new4 = '          inset 5px 0 0 0 #085dc4,'
            if old4 in content:
                content = content.replace(old4, new4)
                changes.append('overlay-thin-top mobile bottom removed')

            # CHANGE 5: Add #bottom-overlay CSS
            if '#bottom-overlay' not in content:
                marker = '    /*M\u00fcveqqeti kordinat M\u00fcveqqeti kordinat M\u00fcveqqeti kordinat M\u00fcveqqeti kordinat M\u00fcveqqeti kordinat */'
                if marker in content:
                    content = content.replace(marker, NEW_CSS + marker, 1)
                    changes.append('bottom-overlay CSS added')
                else:
                    content = content.replace('</style>', NEW_CSS + '  </style>', 1)
                    changes.append('bottom-overlay CSS added (fallback)')

            # CHANGE 6: Add <div id="bottom-overlay"> in HTML
            if '<div id="bottom-overlay">' not in content:
                old6a = '<div class="overlay"></div>\n\n  <!-- Fullscreen Toggle Button -->'
                new6a = '<div class="overlay"></div>\n  <div id="bottom-overlay"></div>\n\n  <!-- Fullscreen Toggle Button -->'
                if old6a in content:
                    content = content.replace(old6a, new6a)
                    changes.append('bottom-overlay div added')
                else:
                    content = content.replace(
                        '<div class="overlay"></div>',
                        '<div class="overlay"></div>\n  <div id="bottom-overlay"></div>',
                        1
                    )
                    changes.append('bottom-overlay div added (fallback)')

            if content == original:
                report_skipped.append(f"{filename} (no matching patterns found)")
            else:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                report_ok.append(f"{filename}: {', '.join(changes)}")

        except Exception as e:
            report_error.append(f"{filename}: {str(e)}")

with open('overlay-fix-report.txt', 'w', encoding='utf-8') as r:
    r.write("=" * 60 + "\n")
    r.write("OVERLAY FIX REPORT\n")
    r.write("=" * 60 + "\n\n")

    r.write(f"FIXED ({len(report_ok)} files):\n")
    for line in report_ok:
        r.write(f"  - {line}\n")

    r.write(f"\nSKIPPED ({len(report_skipped)} files):\n")
    for line in report_skipped:
        r.write(f"  - {line}\n")

    r.write(f"\nNOT FOUND ({len(report_notfound)} files):\n")
    for line in report_notfound:
        r.write(f"  - {line}\n")

    r.write(f"\nERRORS ({len(report_error)} files):\n")
    for line in report_error:
        r.write(f"  - {line}\n")

    r.write("\n" + "=" * 60 + "\n")
    r.write(f"TOTAL: {len(report_ok)} fixed, {len(report_skipped)} skipped, {len(report_notfound)} not found, {len(report_error)} errors\n")

print(open('overlay-fix-report.txt').read())
