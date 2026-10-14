import re
def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()
sheng = read("extract_shengjing.txt").split("\n")
buf=[]
capturing=False
for l in sheng:
    s=l.strip()
    if s.startswith("本节要点") or s.startswith("本节重点"):
        capturing=True; buf=[]; continue
    if capturing:
        if s.startswith("══") or s.startswith("────") or (s.startswith("第") and re.match(r'^第.{1,8}[章篇]$', s)):
            capturing=False
            if buf: print("▪ "+" ".join(buf)[:300]); print()
            buf=[]
        elif s and not s.startswith("图") and not s.startswith("表") and not s.startswith("-----"):
            buf.append(s)
# 收尾
if buf: print("▪ "+" ".join(buf)[:300])
