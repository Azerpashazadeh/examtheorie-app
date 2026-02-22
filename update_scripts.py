import os

old_code = """var viewBtn = document.getElementById("viewResult");
            if (viewBtn) {
                var old = viewBtn.onclick;
                viewBtn.onclick = function (ev) {
                    if (old) old(ev);
                    try {
                        window.parent.postMessage(
                            { action: "updateProgress", testNumber: TEST_NUMBER, lang: "en" },
                            "https://www.examtheorie.nl"
                        );
                    } catch (e) { }
                    setCompleted();
                };
            }"""

new_btn_code = """var viewBtn = document.getElementById("viewResult");
if (viewBtn) {
    var old = viewBtn.onclick;
    viewBtn.onclick = function (ev) {
        if (old) old(ev);
        setCompleted();
        notifyNewSystem();
    };
}"""

notify_func = """
<script>
function notifyNewSystem() {
    var urlParts = window.location.pathname.match(/test-(\d+)-(\w+)\.html/);
    if (urlParts) {
        var testNumber = parseInt(urlParts[1], 10);
        var lang       = urlParts[2];
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    action: 'testCompleted',
                    testNumber: testNumber,
                    lang: lang
                }, 'https://oefenen.examtheorie.nl');
                console.log('✅ Test ' + testNumber + ' (' + lang + ') bildirildi');
            } catch (e) {
                console.error('❌ PostMessage hatası:', e);
            }
        }
    }
}
</script>
"""

for root, dirs, files in os.walk("."):
    for file in files:
        if file.startswith("test-") and file.endswith(".html") and file != "test-1-en.html":
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if old_code in content:
                content = content.replace(old_code, new_btn_code)
            if "function notifyNewSystem()" not in content:
                content = content.replace("</body>", notify_func + "\n</body>")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)