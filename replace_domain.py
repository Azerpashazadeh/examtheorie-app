import os

OLD = 'oefenen.examtheorie.nl'
NEW = 'examtheorie.nl'

SKIP_EXTENSIONS = {'.yml', '.yaml', '.py'}

report_ok = []
report_skipped = []
report_error = []

for root, dirs, files in os.walk('.'):
    # Skip .git folder
    dirs[:] = [d for d in dirs if d != '.git']

    for filename in files:
        filepath = os.path.join(root, filename)

        # Skip excluded extensions
        _, ext = os.path.splitext(filename)
        if ext.lower() in SKIP_EXTENSIONS:
            report_skipped.append(f"{filepath} (excluded extension)")
            continue

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
                report_skipped.append(filepath)

        except Exception as e:
            report_error.append(f"{filepath}: {str(e)}")

with open('replace-domain-report.txt', 'w', encoding='utf-8') as r:
    r.write("=" * 60 + "\n")
    r.write("DOMAIN REPLACE REPORT\n")
    r.write(f"  {OLD}  =>  {NEW}\n")
    r.write("=" * 60 + "\n\n")

    r.write(f"CHANGED ({len(report_ok)} files):\n")
    for line in report_ok:
        r.write(f"  - {line}\n")

    r.write(f"\nSKIPPED ({len(report_skipped)} files - string not found or excluded):\n")
    for line in report_skipped:
        r.write(f"  - {line}\n")

    r.write(f"\nERRORS ({len(report_error)} files):\n")
    for line in report_error:
        r.write(f"  - {line}\n")

    r.write("\n" + "=" * 60 + "\n")
    r.write(f"TOTAL: {len(report_ok)} changed, {len(report_skipped)} skipped, {len(report_error)} errors\n")

print(open('replace-domain-report.txt').read())
