import fitz, time, os

files = {
    "shengjing": "理财圣经CLEC版-v3.4.1.pdf",
    "baodian": "CLEC宝典_SC_V1.14.2.pdf",
}

for key, path in files.items():
    t0 = time.time()
    doc = fitz.open(path)
    n = doc.page_count
    out = f"extract_{key}.txt"
    with open(out, "w", encoding="utf-8") as f:
        f.write(f"# SOURCE: {path}\n# PAGES: {n}\n\n")
        for i, page in enumerate(doc):
            txt = page.get_text("text")
            if txt.strip():
                f.write(f"\n----- PAGE {i+1} -----\n")
                f.write(txt)
    doc.close()
    print(f"{key}: {n} pages, {os.path.getsize(out)//1024} KB, {time.time()-t0:.1f}s")
