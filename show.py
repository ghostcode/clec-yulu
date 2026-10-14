import json
data = json.load(open("mine_raw.json", encoding="utf-8"))
print("======== 原则开篇强句 (51) ========")
for d in data:
    if d["kind"] == "原则":
        print(f"【{d['title']}】{d.get('lead','')[:120]}")
print("\n======== 要点块 ========")
for d in data:
    if d["kind"] == "要点":
        print(d["content"][:200])
