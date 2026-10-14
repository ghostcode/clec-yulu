import json
from collections import Counter
cands = json.load(open("candidates.json", encoding="utf-8"))
print("total:", len(cands))
print(Counter(c["kind"] for c in cands))
print("----- 原则标题 / 强句 / 宝典金句 -----")
for c in cands:
    if c["kind"] in ("原则标题","强句","宝典金句"):
        print(f"[{c['kind']}] {c['content'][:70]}")
print("----- 本节要点 数量:", sum(1 for c in cands if c['kind']=='要点'), "-----")
for c in cands:
    if c["kind"]=="要点":
        print("•", c["content"][:80].replace("\n"," "))
