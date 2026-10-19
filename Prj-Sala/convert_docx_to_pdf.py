# -*- coding: utf-8 -*-
import os
import sys
import win32com.client

docx_path = r"c:\Users\PROBOOK2\Documents\2026-07-11\Rapport_Stage_ONEE.docx"
pdf_path = r"c:\Users\PROBOOK2\Documents\2026-07-11\Rapport_Stage_ONEE.pdf"

# Resolve absolute paths
docx_path = os.path.abspath(docx_path)
pdf_path = os.path.abspath(pdf_path)

print(f"Opening Word to convert:\n  Input:  {docx_path}\n  Output: {pdf_path}")

word = None
try:
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    
    # Prevent Word dialogs/alerts from blocking execution
    word.DisplayAlerts = 0 
    
    doc = word.Documents.Open(docx_path)
    
    print("Updating fields (TOC, List of Figures, List of Tables, Page Numbers)...")
    doc.Fields.Update()
    
    # Update specific Tables of Contents and Figures
    for table in doc.TablesOfContents:
        table.Update()
    for table in doc.TablesOfFigures:
        table.Update()
        
    print("Exporting to PDF...")
    # wdFormatPDF = 17
    doc.SaveAs(pdf_path, FileFormat=17)
    
    print("Saving updated docx...")
    doc.Close(SaveChanges=True)
    
    print("Conversion completed successfully!")
    
    # Check PDF size and page count
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    print(f"PDF Pages: {len(reader.pages)}")
    print(f"PDF Size: {round(os.path.getsize(pdf_path)/1024, 1)} KB")

except Exception as e:
    print(f"ERROR: {e}")
    if word is not None:
        try:
            word.Quit()
        except:
            pass
    sys.exit(1)
finally:
    if word is not None:
        try:
            word.Quit()
        except:
            pass
