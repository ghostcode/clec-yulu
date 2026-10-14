import re, json

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

sheng = read("extract_shengjing.txt").split("\n")
bao = read("extract_baodian.txt").split("\n")

# 已使用的文本（用于去重）
used = set()
import json as J
# 读取当前 quotes.js 中的 text 字段做粗去重
qjs = read("clec-quotes/src/quotes.js")
for m in re.findall(r"text:/s*'([^']+)'", qjs):
    used.add(m)

def clean(s):
    return s.replace("\u200b","").replace("﻿","").strip()

cands = []  # (score, kind, text)

# A) 本节要点 / 本节重点 块（切块成单点，每点独立成句）
for src, lines in [("sheng", sheng), ("bao", bao)]:
    cap=False; buf=[]
    for l in lines:
        s=clean(l)
        if s.startswith("本节要点") or s.startswith("本节重点"):
            cap=True; buf=[]; continue
        if cap:
            if s.startswith("══") or s.startswith("────") or (s.startswith("第") and re.match(r'^第.{1,8}[章篇]$', s)):
                cap=False
                txt=" ".join(buf)
                # 按 ，。； 切分单点
                for part in re.split(r'[。；]', txt):
                    part=clean(part)
                    if 14<=len(part)<=54 and not re.search(r'\d', part.replace('20','').replace('21','').replace('19','')):
                        if part not in used:
                            cands.append((5,"要点",part))
                buf=[]
            elif s and not s.startswith(("图","表","-----","PAGE")):
                buf.append(s)

# B) 宝典 序言/人生篇 强句：含核心表述的句子
bao_txt = "\n".join(bao)
for para in re.split(r'\n\s*\n', bao_txt):
    for sent in re.split(r'[。！？]', para):
        sent=clean(sent)
        if 14<=len(sent)<=56 and any(k in sent for k in ["富有","快乐","财富","投资","复利","时间","自由","使命","认知","传承","消费","资本","风险","选择","未来","当下","知识"]):
            if sent not in used and not re.search(r'\d', sent):
                cands.append((3,"宝典",sent))

# C) shengjing 正文格言句（含关键词、长度适中、无数字公式）
KW = ["富有","快乐","钱","投资","复利","风险","杠杆","时间","市场","认知","资产","资本","财富","退休","现金","指数","崩盘","危机","自由","使命","知识","传承","消费","抵押","税","未来","当下","方向","选择","卖出","持有"]
for l in sheng:
    s=clean(l)
    if not s or s.startswith(("图","表","──","══","第","PAGE","----")):
        continue
    for sent in re.split(r'[。！？]', s):
        sent=clean(sent)
        if 14<=len(sent)<=54 and any(k in sent for k in KW):
            if sent not in used and not re.search(r'\d', sent):
                cands.append((2,"语句",sent))

# 去重（同文本只留最高分）
best={}
for sc,kind,t in cands:
    if t not in best or sc>best[t][0]:
        best[t]=(sc,kind)
uniq=[(sc,kind,t) for t,(sc,kind) in best.items()]
uniq.sort(reverse=True)

json.dump([{"score":sc,"kind":kind,"text":t} for sc,kind,t in uniq],
          open("mine2.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("候选总数:", len(uniq))
from collections import Counter
print(Counter(k for _,k,_ in uniq))
print("\n===== 前 90 条候选 =====")
for i,(sc,kind,t) in enumerate(uniq[:90]):
    print(f"{i+1:2d}. [{kind}] {t}")
