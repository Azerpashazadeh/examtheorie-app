import os

OLD = 'var urlParts = window.location.pathname.match(/test-(\\d+)-(\\w+)\\.html/);'
NEW = 'var urlParts = window.location.pathname.match(/test-(\\d+)-(\\w+)/);'

report_ok = []
report_skipped = []
report_notfound = []
report_error = []

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d != '.git']

    for filename in files:
        # Only process .html files with "test-" in name
        if not filename.endswith('.html') or 'test-' not in filename:
            continue

        filepath = os.path.join(root, filename)

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                original = f.read()

            if OLD in original:
                count = original.count(OLD)
                new_content = original.replace(OLD, NEW)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                report_ok.append(f"{filepath} ({count} replacement(s))")
            else:
                report_skipped.append(f"{filepath} (pattern not found)")

        except Exception as e:
            report_error.append(f"{filepath}: {str(e)}")

with open('urlparts-fix-report.txt', 'w', encoding='utf-8') as r:
    r.write("=" * 60 + "\n")
    r.write("URLPARTS REGEX FIX REPORT\n")
    r.write("=" * 60 + "\n\n")
    r.write(f"OLD: {OLD}\n")
    r.write(f"NEW: {NEW}\n\n")

    r.write(f"FIXED ({len(report_ok)} files):\n")
    for line in report_ok:
        r.write(f"  - {line}\n")

    r.write(f"\nSKIPPED ({len(report_skipped)} files):\n")
    for line in report_skipped:
        r.write(f"  - {line}\n")

    r.write(f"\nERRORS ({len(report_error)} files):\n")
    for line in report_error:
        r.write(f"  - {line}\n")

    r.write("\n" + "=" * 60 + "\n")
    r.write(f"TOTAL: {len(report_ok)} fixed, {len(report_skipped)} skipped, {len(report_error)} errors\n")

print(open('urlparts-fix-report.txt').read())
