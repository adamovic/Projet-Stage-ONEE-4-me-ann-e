import os
import pypdf

html_path = r"c:\Users\PROBOOK2\Documents\2026-07-11\rapport_stage.html"
pdf_path = r"c:\Users\PROBOOK2\Documents\2026-07-11\Rapport_Stage_4eme_Annee.pdf"

# Read HTML and ensure @page { size: A4; margin: 0; } is present
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace css to add @page rule
style_addition = """
    @page {
      size: A4 portrait;
      margin: 0;
    }
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 0;
        background: white;
      }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-before: always !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
        height: 297mm !important;
        width: 210mm !important;
        padding: 16mm 20mm 15mm 25mm !important;
        box-sizing: border-box !important;
      }
      .page:first-child {
        page-break-before: avoid !important;
      }
      .no-print { display: none !important; }
    }
"""

# Replace @media print section
import re
new_content = re.sub(r"@media print\s*\{[^}]*\}", style_addition, content, flags=re.DOTALL)
if "@page {" not in new_content:
    new_content = new_content.replace("<style>", "<style>\n    @page { size: A4 portrait; margin: 0; }\n")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated CSS with @page { size: A4 portrait; margin: 0; }")
