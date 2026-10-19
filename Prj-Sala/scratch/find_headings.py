# -*- coding: utf-8 -*-
import re

tex_path = r"c:\Users\PROBOOK2\Downloads\Rapport_ONEE_Adam_EL_MERABET (1).tex"

with open(tex_path, "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx, line in enumerate(lines):
    if "\\chapter" in line or "\\section" in line or "\\subsection" in line:
        print(f"L{idx+1}: {line.strip()}")
