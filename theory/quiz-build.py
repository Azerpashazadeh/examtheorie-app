"""Build embedded, localized quiz banks without changing chapter prose.
Run from the repository root: python -X utf8 theory/quiz-build.py
Requires beautifulsoup4 only at build time; deployed quizzes have no dependencies.
"""
from pathlib import Path
from bs4 import BeautifulSoup
import json, re
ROOT = Path(__file__).resolve().parent
LANGS = ['en','tr','nl','ar']
BANKS = {lang:{} for lang in LANGS}

def q(chapter, source, prompts, options, answer=0, explanation=None):
    prompts=prompts.split(' || ')
    assert len(prompts)==4
    opts = options.split(' || ') if isinstance(options,str) else options
    if len(opts)==1: opts=opts*4
    assert len(opts)==4
    for i,lang in enumerate(LANGS):
        choices=opts[i].split(' | ')
        assert len(choices)==4 and len(set(choices))==4,(chapter,prompts[i],choices)
        BANKS[lang].setdefault(chapter,[]).append(dict(q=prompts[i],opts=choices,ans=answer,source=source,
            exp=explanation.split(' || ')[i] if explanation else choices[answer]))

def number(chapter, source, prompts, choices, answer=0):
    q(chapter,source,prompts,[choices]*4,answer)

# Localized editorial banks live next to this builder for review.
exec((ROOT/'quiz-questions.py').read_text(encoding='utf-8'))
LABELS = json.loads((ROOT/'quiz-labels.json').read_text(encoding='utf-8'))
for lang in LANGS:
    for path in sorted((ROOT/lang).glob('*.html')):
        original=path.read_text(encoding='utf-8')
        # Idempotently remove only our previous injection.
        original=re.sub(r'\n?<!-- CHAPTER QUIZ START -->.*?<!-- CHAPTER QUIZ END -->\n?', '',original,flags=re.S)
        original=re.sub(r'<link[^>]+data-chapter-quiz[^>]*>\n?','',original)
        soup=BeautifulSoup(original,'html.parser')
        chapter=path.stem
        if chapter=='traffic-sign-catalogue':
            # One recognition question per distinct meaning; ambiguous identical
            # D/K variants and duplicate L3 graphics are not repeated.
            cards=[];seen=set()
            for card in soup.select('.sign-card'):
                code=card.select_one('.sign-code');name=card.select_one('.sign-name');img=card.select_one('img')
                if not(code and name and img):continue
                code=code.get_text(' ',strip=True);name=name.get_text(' ',strip=True)
                if code=='L3' and any(c['code']=='L3' for c in cards):continue
                if name in seen:continue
                seen.add(name);cards.append(dict(code=code,name=name,image=img['src']))
            bank=[]
            for c in cards:
                candidates=[x for x in cards if x['name']!=c['name'] and x['code'][0]==c['code'][0]]
                candidates += [x for x in cards if x['name']!=c['name'] and x not in candidates]
                # Neighbouring signs in the same category make meaningful distractors.
                choices=[c['name']]+[x['name'] for x in candidates[:3]]
                bank.append(dict(q=LABELS[lang]['signQuestion'],opts=choices,ans=0,
                    exp=c['code']+' — '+c['name'],topic=c['code'][0],image=c['image'],code=c['code']))
        elif chapter=='traffic-rules' and lang=='en':
            # Preserve the user's existing 50-question bank.
            match=re.search(r'const ALL_QUESTIONS=(\[.*?\]);',original,re.S)
            if match: bank=json.loads(match[1])
            else: bank=json.loads((ROOT/'traffic-rules-en-bank.json').read_text(encoding='utf-8'))
            (ROOT/'traffic-rules-en-bank.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            # Remove the old standalone quiz, preserving the chapter and first style.
            original=re.sub(r'<style>\s*#quiz-overlay.*?</style>\s*','',original,flags=re.S)
            original=re.sub(r'<button id="fab-quiz".*?</script>\s*','',original,flags=re.S)
        else:
            bank=BANKS[lang][chapter]
        assert bank and len({x['q']+(x.get('code','')) for x in bank})==len(bank),(lang,chapter)
        for item in bank:
            if item.get('source'):
                section=soup.find(id=item['source']);assert section,(path,item['source'])
                heading=section.find(['h2','h3'])
                item['topic']=heading.get_text(' ',strip=True) if heading else chapter
                # The complete section remains one click away from feedback.
            assert len(item['opts'])==4 and len(set(item['opts']))==4
            assert 0<=item['ans']<4
        data=json.dumps(dict(labels=LABELS[lang],questions=bank),ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
        injection='\n<!-- CHAPTER QUIZ START -->\n<script type="application/json" id="chapter-quiz-data">'+data+'</script>\n<script src="../assets/chapter-quiz.js" defer></script>\n<!-- CHAPTER QUIZ END -->\n'
        original=original.replace('</head>','<link rel="stylesheet" href="../assets/chapter-quiz.css" data-chapter-quiz="true">\n</head>')
        original=original.replace('</body>',injection+'</body>')
        path.write_text(original,encoding='utf-8')
        print(lang,chapter,len(bank),'questions')
