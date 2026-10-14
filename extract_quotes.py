import re, json

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

# ---------- 理财圣经: 原则标题 + 本节要点 ----------
text = read("extract_shengjing.txt")
lines = text.split("\n")

candidates = []  # each: {kind, content}

# 1) 原则标题: 形如 "269→1. 富有是天赋" 在原始txt里是 "1. 富有是天赋"
# 这些出现在目录和正文。正文里是独立短行。
# 我们用正则匹配 "^\d+\. .+" 且该行不长
sec_re = re.compile(r'^\d+\.\s+(.+)$')

# 2) 本节要点 块
i = 0
n = len(lines)
while i < n:
    line = lines[i].strip()
    # 本节要点 块
    if line.startswith("本节要点") or line.startswith("本节重点"):
        j = i+1
        buf = []
        while j < n:
            l2 = lines[j].strip()
            if l2.startswith("══") or l2.startswith("────") or (l2.startswith("第") and re.match(r'^第.+[章篇]$', l2)):
                break
            if l2 and not l2.startswith("图"):
                buf.append(l2)
            j += 1
        if buf:
            candidates.append({"kind":"要点", "content":"\n".join(buf)})
        i = j
        continue
    m = sec_re.match(line)
    if m and len(line) <= 40 and "..." not in line:
        candidates.append({"kind":"原则标题", "content":m.group(1).strip()})
    i += 1

# 理财圣经 序言/开篇 强句
for kw in ["富有是天赋，快乐是人权", "有钱是正常的", "消费是一种道德", "你只要方向对了", "觉知，就是一切的起点"]:
    if kw in text:
        candidates.append({"kind":"强句", "content":kw})

# ---------- 宝典: 序言 + 人生篇 金句 (手动关键词抽取) ----------
bao = read("extract_baodian.txt")
for kw in ["富有是天赋，快乐是人权", "知识最大的价值，不在于被拥有，而在于被传承",
           "财富只是工具，不是目的", "永远从未来看现在", "活在当下、珍惜当下、快乐地活在当下",
           "投资其实可以很简单", "愿你不只是变得富有，更愿你成为一个自由、快乐、充满爱与智慧的人",
           "富有其实是一件非常简单的事情", "真正的困难，从来不是如何赚更多钱"]:
    if kw in bao:
        candidates.append({"kind":"宝典金句", "content":kw})

with open("candidates.json","w",encoding="utf-8") as f:
    json.dump(candidates, f, ensure_ascii=False, indent=1)

# 打印统计
from collections import Counter
print(Counter(c[kind] for c in candidates for kind in [c["kind"]]))
print("total candidates:", len(candidates))
# 输出原则标题与要点预览
for c in candidates:
    if c["kind"] in ("原则标题","强句","宝典金句"):
        print(f"[{c['kind']}] {c['content'][:60]}")
