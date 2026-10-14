import re
lines = open("extract_shengjing.txt", encoding="utf-8").read().split("\n")
# find 理财铁律 headings and print following 3 substantive lines
pat = re.compile(r'理财铁律[一二三四五六七八]')
out=[]
for i,l in enumerate(lines):
    if pat.search(l) and "目录" not in l:
        out.append(("H", l.strip()))
        cnt=0
        for j in range(i+1, min(i+30,len(lines))):
            s=lines[j].strip()
            if not s or s.startswith("图") or s.startswith("-----"): 
                continue
            out.append(("  ", s[:80]))
            cnt+=1
            if cnt>=3: break
import json
print("\n".join(f"{tag} {t}" for tag,t in out))
