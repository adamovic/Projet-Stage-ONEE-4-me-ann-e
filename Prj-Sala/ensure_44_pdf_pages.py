import os
import re

html_path = r"c:\Users\PROBOOK2\Documents\2026-07-11\rapport_stage.html"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the style section to enforce strict break-after for each page
css_fix = """
    @page {
      size: A4 portrait;
      margin: 0mm;
    }
    @media print {
      html, body {
        width: 210mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .page {
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 16mm 20mm 15mm 25mm !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
      }
      .no-print { display: none !important; }
    }
"""

content = re.sub(r"@media print\s*\{[^}]*\}", css_fix, content, flags=re.DOTALL)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated HTML print CSS rules.")
