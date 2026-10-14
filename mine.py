import re, json

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

sheng = read("extract_shengjing.txt").split("\n")
bao = read("extract_baodian.txt").split("\n")

out = []

# 1) 完整 "本节要点" 块（she决策圣经）
for i, l in enumerate(sheng):
    s = l.strip()
    if s.startswith("本节要点") or s.startswith("本节重点"):
        buf = []
        j = i+1
        while j < len(sheng):
            t = sheng[j].strip()
            if t.startswith("══") or t.startswith("────") or (t.startswith("第") and re.match(r'^第.{1,8}[章篇]$', t)):
                break
            if t and not t.startswith("图") and not t.startswith("表"):
                buf.append(t)
            j += 1
        joined = " ".join(buf).strip()
        if 10 < len(joined) < 200:
            out.append({"kind": "要点", "content": joined})

# 2) 各编号原则的开篇强句（"N. 标题" 后的前2行）
for i, l in enumerate(sheng):
    s = l.strip()
    m = re.match(r'^(\d+)\.\s+(.+)$', s)
    if m and 4 <= len(s) <= 40:
        title = m.group(2)
        # 后续2行有内容
        lines_after = []
        for j in range(i+1, min(i+4, len(sheng))):
            t = sheng[j].strip()
            if t and not t.startswith(("图","表","────","══")) and len(t) > 6:
                lines_after.append(t)
        if lines_after:
            out.append({"kind":"原则", "title":title, "lead": " ".join(lines_after[:2])})

# 3) 正文中的格言式句子：以 。！ 结尾，长度 16-58，含关键词
kw = ["富有","快乐","钱","投资","复利","风险","杠杆","时间","市场","认知","资产","资本","财富","退休","现金","指数","崩盘","危机","自由","使命","知识","传承","消费","抵押","税","未来","当下","方向","选择"]
for i, l in enumerate(sheng + bao):
    s = l.strip()
    if not s or s.startswith(("图","表","──","══","第")):
        continue
    # 取句末标点前的整句
    for sent in re.split(r'[。！？]', s):
        sent = sent.strip()
        if 16 <= len(sent) <= 58 and any(k in sent for k in kw):
            # 避免列表式/含数字公式
            if sent.count("=") == 0 and "http" not in sent:
                out.append({"kind":"语句", "content": sent})

json.dump(out, open("mine_raw.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("raw candidates:", len(out))
# 统计
from collections import Counter
print(Counter(x["kind"] for x in out))
