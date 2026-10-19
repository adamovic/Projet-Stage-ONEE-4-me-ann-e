# -*- coding: utf-8 -*-
"""
Generateur du Rapport de Stage ONEE - Word (.docx) professionnel
Avec Table des Matieres, Liste des Figures et Tableaux AUTOMATIQUES (champs Word natifs)
"""
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy
from lxml import etree

OUT = r"c:\Users\PROBOOK2\Documents\2026-07-11\Rapport_Stage_ONEE.docx"

# ─────────────────────────────────────────────────────────────────
# CONSTANTES COULEURS
# ─────────────────────────────────────────────────────────────────
NAVY   = RGBColor(0x00, 0x33, 0x66)
RED    = RGBColor(0xC8, 0x10, 0x2E)
TEAL   = RGBColor(0x00, 0x69, 0x5C)
GRAY   = RGBColor(0x47, 0x55, 0x69)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
BLUE2  = RGBColor(0x1E, 0x40, 0xAF)
LGRAY  = RGBColor(0xF1, 0xF5, 0xF9)

# ─────────────────────────────────────────────────────────────────
# HELPERS XML
# ─────────────────────────────────────────────────────────────────
def set_cell_bg(cell, hex_color):
    """Colorie le fond d'une cellule de tableau."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color.upper())
    tcPr.append(shd)

def set_cell_border(cell, **kwargs):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for edge in ('top','left','bottom','right'):
        tag = OxmlElement(f'w:{edge}')
        tag.set(qn('w:val'), kwargs.get(edge, 'single'))
        tag.set(qn('w:sz'), kwargs.get('sz', '4'))
        tag.set(qn('w:space'), '0')
        tag.set(qn('w:color'), kwargs.get('color', '003366'))
        tcBorders.append(tag)
    tcPr.append(tcBorders)

def add_field(paragraph, field_code, dirty=True):
    """Insere un champ Word (TOC, SEQ, etc.) dans un paragraphe."""
    run = paragraph.add_run()
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    if dirty:
        fldChar1.set(qn('w:dirty'), 'true')
    run._r.append(fldChar1)

    run2 = paragraph.add_run()
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = field_code
    run2._r.append(instrText)

    run3 = paragraph.add_run()
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'separate')
    run3._r.append(fldChar2)

    run4 = paragraph.add_run()
    run4.text = '...'

    run5 = paragraph.add_run()
    fldChar3 = OxmlElement('w:fldChar')
    fldChar3.set(qn('w:fldCharType'), 'end')
    run5._r.append(fldChar3)

def add_toc_field(doc, title, heading_level='1-3', tab_leader=True):
    """Insere la table des matieres automatique Word."""
    p_title = doc.add_paragraph(title, style='Heading 1')
    fmt = p_title.paragraph_format
    fmt.space_before = Pt(0)
    fmt.page_break_before = True

    para = doc.add_paragraph()
    para.style = doc.styles['Normal']
    add_field(para, f' TOC \\o "1-{heading_level[-1]}" \\h \\z \\u ')

def add_seq_field(para, seq_name, caption_text):
    """Ajoute un champ SEQ automatique pour les legendes."""
    run_pre = para.add_run(f'{caption_text} ')
    add_field(para, f' SEQ {seq_name} \\* ARABIC ')
    para.add_run(' : ')

def set_page_margins(doc, top=2.5, bottom=2.0, left=2.5, right=2.0):
    section = doc.sections[-1]
    section.top_margin    = Cm(top)
    section.bottom_margin = Cm(bottom)
    section.left_margin   = Cm(left)
    section.right_margin  = Cm(right)

# ─────────────────────────────────────────────────────────────────
# CREATION DU DOCUMENT
# ─────────────────────────────────────────────────────────────────
doc = Document()
set_page_margins(doc)

# ─── STYLES ──────────────────────────────────────────────────────
def style_heading(doc, style_name, size, color, bold=True, space_before=12, space_after=4):
    try:
        s = doc.styles[style_name]
    except:
        return
    s.font.size = Pt(size)
    s.font.color.rgb = color
    s.font.bold = bold
    s.font.name = 'Calibri'
    s.paragraph_format.space_before = Pt(space_before)
    s.paragraph_format.space_after  = Pt(space_after)

style_heading(doc, 'Heading 1', 14, NAVY,  space_before=18, space_after=6)
style_heading(doc, 'Heading 2', 12, BLUE2, space_before=14, space_after=4)
style_heading(doc, 'Heading 3', 11, TEAL,  space_before=10, space_after=3)

# Normal style
nstyle = doc.styles['Normal']
nstyle.font.name = 'Times New Roman'
nstyle.font.size = Pt(11)
nstyle.paragraph_format.space_after = Pt(6)
nstyle.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE

# Caption style
try:
    cap_style = doc.styles['Caption']
    cap_style.font.size = Pt(9)
    cap_style.font.italic = True
    cap_style.font.color.rgb = GRAY
    cap_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap_style.paragraph_format.space_before = Pt(3)
    cap_style.paragraph_format.space_after  = Pt(8)
except:
    pass

# ─────────────────────────────────────────────────────────────────
# HELPERS DOCUMENT
# ─────────────────────────────────────────────────────────────────
def add_page_break(doc):
    doc.add_page_break()

def H1(doc, text, page_break_before=False):
    p = doc.add_paragraph(text, style='Heading 1')
    if page_break_before:
        p.paragraph_format.page_break_before = True
    return p

def H2(doc, text):
    return doc.add_paragraph(text, style='Heading 2')

def H3(doc, text):
    return doc.add_paragraph(text, style='Heading 3')

def NP(doc, text, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    p.paragraph_format.alignment = align
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.bold   = bold
    run.italic = italic
    return p

def NP_MIXED(doc, parts, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    """parts = list of (text, bold, italic)"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment = align
    for text, bold, italic in parts:
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)
        run.bold = bold
        run.italic = italic
    return p

def bullet(doc, text, level=0):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent = Cm(1.0 + level * 0.5)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    return p

def add_intro_box(doc, text):
    """Encadre bleu pour l'introduction de chapitre."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'
    cell = table.cell(0, 0)
    set_cell_bg(cell, 'EFF6FF')
    p = cell.paragraphs[0]
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run_title = p.add_run('Introduction du chapitre\n')
    run_title.bold = True
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = NAVY
    run_body = p.add_run(text)
    run_body.font.size = Pt(10.5)
    run_body.font.name = 'Times New Roman'
    doc.add_paragraph()

def add_conclu_box(doc, text):
    """Encadre vert pour la conclusion de chapitre."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'
    cell = table.cell(0, 0)
    set_cell_bg(cell, 'F0FDF4')
    p = cell.paragraphs[0]
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run_title = p.add_run('Conclusion du chapitre\n')
    run_title.bold = True
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = TEAL
    run_body = p.add_run(text)
    run_body.font.size = Pt(10.5)
    run_body.font.name = 'Times New Roman'
    doc.add_paragraph()

def add_figure_caption(doc, caption_text):
    """Ajoute une legende de figure avec numero automatique (champ SEQ)."""
    p = doc.add_paragraph(style='Caption')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_pre = p.add_run('Figure ')
    run_pre.font.bold = True
    add_field(p, ' SEQ Figure \\* ARABIC ')
    run_post = p.add_run(f' : {caption_text}')
    run_post.font.italic = True

def add_table_caption(doc, caption_text):
    """Ajoute une legende de tableau avec numero automatique (champ SEQ)."""
    p = doc.add_paragraph(style='Caption')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_pre = p.add_run('Tableau ')
    run_pre.font.bold = True
    add_field(p, ' SEQ Tableau \\* ARABIC ')
    run_post = p.add_run(f' : {caption_text}')
    run_post.font.italic = True

def add_pro_table(doc, headers, rows, col_widths_cm=None, caption=None):
    """Cree un tableau professionnel."""
    ncols = len(headers)
    table = doc.add_table(rows=1 + len(rows), cols=ncols)
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Widths
    if col_widths_cm:
        for i, row_obj in enumerate(table.rows):
            for j, cell in enumerate(row_obj.cells):
                if j < len(col_widths_cm):
                    cell.width = Cm(col_widths_cm[j])

    # Header row
    header_row = table.rows[0]
    for j, h in enumerate(headers):
        cell = header_row.cells[j]
        set_cell_bg(cell, '003366')
        p = cell.paragraphs[0]
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(h)
        run.bold = True
        run.font.color.rgb = WHITE
        run.font.size = Pt(9.5)
        run.font.name = 'Calibri'

    # Data rows
    for i, row_data in enumerate(rows):
        row_obj = table.rows[i + 1]
        bg = 'FFFFFF' if i % 2 == 0 else 'F1F5F9'
        for j, cell_text in enumerate(row_data):
            cell = row_obj.cells[j]
            set_cell_bg(cell, bg)
            p = cell.paragraphs[0]
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(str(cell_text))
            run.font.size = Pt(9.5)
            run.font.name = 'Times New Roman'

    doc.add_paragraph()
    if caption:
        add_table_caption(doc, caption)
    doc.add_paragraph()

def add_placeholder_figure(doc, width_cm=14, height_cm=8, label='Architecture'):
    """Placeholder graphique (rectangle) si pas d image."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Cm(width_cm)
    set_cell_bg(cell, '1E293B')
    p = cell.paragraphs[0]
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(int(height_cm * 3))
    p.paragraph_format.space_after  = Pt(int(height_cm * 3))
    run = p.add_run(f'[ {label} ]')
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = WHITE
    doc.add_paragraph()

# ─────────────────────────────────────────────────────────────────
# EN-TETE ET PIED DE PAGE
# ─────────────────────────────────────────────────────────────────
def setup_header_footer(doc):
    section = doc.sections[0]
    # Header
    header = section.header
    header.is_linked_to_previous = False
    hp = header.paragraphs[0]
    hp.clear()
    hp.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_h = hp.add_run('Rapport de Stage de Fin d\'annee – 4eme Annee Ingenieur | ONEE – DSI | EMSI Casablanca 2025-2026')
    run_h.font.size = Pt(8)
    run_h.font.color.rgb = GRAY
    run_h.font.italic = True
    run_h.font.name = 'Calibri'

    # Footer with auto page number
    footer = section.footer
    footer.is_linked_to_previous = False
    fp = footer.paragraphs[0]
    fp.clear()
    fp.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_fl = fp.add_run('Systeme de Gestion des Ressources et Moyens Partages | Page ')
    run_fl.font.size = Pt(8)
    run_fl.font.name = 'Calibri'
    run_fl.font.color.rgb = GRAY

    # Auto page number field
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.text = ' PAGE '
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'end')
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    sz = OxmlElement('w:sz')
    sz.set(qn('w:val'), '16')
    rPr.append(sz)
    r.append(rPr)
    r.append(fldChar1)
    r2 = OxmlElement('w:r')
    r2.append(instrText)
    r3 = OxmlElement('w:r')
    r3.append(fldChar2)
    fp._p.append(r)
    fp._p.append(r2)
    fp._p.append(r3)

setup_header_footer(doc)

# ═════════════════════════════════════════════════════════════════
# PAGE DE GARDE
# ═════════════════════════════════════════════════════════════════
section0 = doc.sections[0]
section0.different_first_page_header_footer = True

p = doc.add_paragraph()
p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(0)
run = p.add_run('EMSI – Ecole Marocaine des Sciences de l\'Ingenieur')
run.font.name = 'Calibri'
run.font.size = Pt(10)
run.bold = True
run.font.color.rgb = NAVY

p2 = doc.add_paragraph()
p2.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
run2 = p2.add_run('Filiere : Intelligence Artificielle & Data – 4eme Annee Ingenieur')
run2.font.name = 'Times New Roman'
run2.font.size = Pt(10)
run2.font.color.rgb = GRAY

doc.add_paragraph()

# Separateur
hr = doc.add_paragraph()
hr.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
pPr = hr._p.get_or_add_pPr()
pBdr = OxmlElement('w:pBdr')
bottom = OxmlElement('w:bottom')
bottom.set(qn('w:val'), 'single')
bottom.set(qn('w:sz'), '6')
bottom.set(qn('w:space'), '1')
bottom.set(qn('w:color'), '003366')
pBdr.append(bottom)
pPr.append(pBdr)

for _ in range(3): doc.add_paragraph()

p_title = doc.add_paragraph()
p_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
r1 = p_title.add_run('RAPPORT DE STAGE DE FIN D\'ANNEE')
r1.font.name = 'Calibri'
r1.font.size = Pt(20)
r1.bold = True
r1.font.color.rgb = NAVY

p_sub = doc.add_paragraph()
p_sub.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_sub = p_sub.add_run('4eme Annee Ingenieur d\'Etat')
r_sub.font.name = 'Calibri'
r_sub.font.size = Pt(13)
r_sub.bold = True
r_sub.font.color.rgb = RED

for _ in range(2): doc.add_paragraph()

p_projet = doc.add_paragraph()
p_projet.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_pr = p_projet.add_run('Conception et Developpement d\'une Plateforme Intelligente de\nGestion des Ressources et Moyens Partages')
r_pr.font.name = 'Calibri'
r_pr.font.size = Pt(15)
r_pr.bold = True
r_pr.font.color.rgb = NAVY

p_sous = doc.add_paragraph()
p_sous.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_so = p_sous.add_run('Module Reservation des Salles | Module Gestion du Parc Automobile | Intelligence Artificielle')
r_so.font.name = 'Times New Roman'
r_so.font.size = Pt(11)
r_so.italic = True
r_so.font.color.rgb = TEAL

for _ in range(3): doc.add_paragraph()

# Tableau infos
info_table = doc.add_table(rows=7, cols=2)
info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
info_table.style = 'Table Grid'
infos = [
    ('Realise par :', '[A completer – Nom et Prenom de l\'etudiant]'),
    ('Filiere :', 'Intelligence Artificielle & Data'),
    ('Organisme d\'accueil :', 'ONEE – Office National de l\'Electricite et de l\'Eau Potable'),
    ('Lieu :', 'Siege ONEE, Casablanca'),
    ('Encadrant professionnel :', '[A completer – Nom, Fonction]'),
    ('Encadrant academique :', '[A completer – Nom, Professeur EMSI]'),
    ('Periode de stage :', 'Juin – Aout 2026 (10 semaines)'),
]
for i, (label, val) in enumerate(infos):
    row = info_table.rows[i]
    set_cell_bg(row.cells[0], 'EFF6FF')
    p_l = row.cells[0].paragraphs[0]
    r_l = p_l.add_run(label)
    r_l.bold = True; r_l.font.size = Pt(10.5); r_l.font.name = 'Calibri'; r_l.font.color.rgb = NAVY
    p_v = row.cells[1].paragraphs[0]
    r_v = p_v.add_run(val)
    r_v.font.size = Pt(10.5); r_v.font.name = 'Times New Roman'

for _ in range(3): doc.add_paragraph()

p_annee = doc.add_paragraph()
p_annee.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_an = p_annee.add_run('Annee Universitaire 2025 – 2026')
r_an.font.name = 'Calibri'
r_an.font.size = Pt(11)
r_an.bold = True
r_an.font.color.rgb = NAVY

add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# DEDICACE
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Dedicace', page_break_before=True)
for _ in range(4): doc.add_paragraph()
for line in [
    'Je dedie ce travail a mes parents, source inepuisable d\'amour et de soutien, '
    'qui n\'ont jamais cesse de croire en moi tout au long de ce parcours.',
    '',
    'A mes freres et soeurs, pour leur encouragement et leur bienveillance au quotidien.',
    '',
    'A mes professeurs de l\'EMSI Casablanca, dont la competence et la passion pour '
    'l\'enseignement ont ete une source de motivation constante.',
    '',
    'A toute l\'equipe de la DSI de l\'ONEE, pour leur accueil chaleureux et leur '
    'accompagnement professionnel durant ce stage.',
]:
    p = doc.add_paragraph(line)
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in p.runs:
        run.font.italic = True
        run.font.size = Pt(12)
        run.font.name = 'Times New Roman'
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# REMERCIEMENTS
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Remerciements', page_break_before=True)
NP(doc, "Au terme de ce stage de fin d'annee, je souhaite exprimer ma profonde gratitude a toutes les personnes qui ont contribue, de pres ou de loin, a la reussite de ce projet.")
doc.add_paragraph()
NP_MIXED(doc, [
    ('Je remercie tout d\'abord ', False, False),
    ('M. [A completer – Encadrant professionnel ONEE]', True, False),
    (' pour son accueil au sein de la Direction du Systeme d\'Information, son encadrement '
     'rigoureux et sa disponibilite tout au long de cette experience.', False, False),
])
doc.add_paragraph()
NP_MIXED(doc, [
    ('Mes sinceres remerciements vont egalement a ', False, False),
    ('M. [A completer – Encadrant academique EMSI]', True, False),
    (' pour son suivi pedagogique et ses orientations methodologiques precieuses.', False, False),
])
doc.add_paragraph()
NP(doc, "Je remercie l'ensemble de l'equipe de la DSI de l'ONEE pour leur disponibilite, leur aide technique et leur convivialite au cours de ces dix semaines de stage.")
doc.add_paragraph()
NP(doc, "Enfin, je tiens a remercier la direction et le corps enseignant de l'EMSI Casablanca pour la qualite de la formation dispensee et l'encadrement offert tout au long de notre cursus d'ingenierie.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# RESUME / ABSTRACT
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Resume', page_break_before=True)
NP(doc, "Ce rapport presente les travaux realises dans le cadre du stage de fin d'annee de 4eme annee Ingenieur en Intelligence Artificielle & Data a l'EMSI Casablanca, effectue au sein de l'Office National de l'Electricite et de l'Eau Potable (ONEE), Direction du Systeme d'Information (DSI).")
doc.add_paragraph()
NP(doc, "L'objectif principal etait de concevoir et developper une plateforme intelligente de gestion des ressources et moyens partages, articulee autour de deux modules fonctionnels : la reservation intelligente des salles de reunion et la gestion du parc automobile. La solution s'appuie sur une architecture 3-Tiers avec un backend Python/FastAPI, un frontend React.js et une base de donnees SQL Server, augmentee de fonctionnalites d'Intelligence Artificielle (suggestion automatique, detection de conflits, optimisation des affectations, tableaux de bord analytiques).")
doc.add_paragraph()
p_kw = doc.add_paragraph()
r_kw = p_kw.add_run('Mots cles : ')
r_kw.bold = True
r_kw.font.name = 'Times New Roman'
r_kw.font.size = Pt(11)
p_kw.add_run('Systeme d\'information, Reservation intelligente, Parc automobile, FastAPI, React.js, SQL Server, Intelligence Artificielle, ONEE, DSI, UML.')

doc.add_paragraph()
H1(doc, 'Abstract')
NP(doc, "This report presents the work carried out as part of the end-of-year internship for the 4th year Engineering degree in Artificial Intelligence & Data at EMSI Casablanca, completed within the National Office of Electricity and Potable Water (ONEE), Information Systems Department (DSI).")
doc.add_paragraph()
NP(doc, "The main objective was to design and develop an intelligent platform for shared resource management, centered on two functional modules: intelligent meeting room reservation and fleet management. The solution is built on a 3-Tier architecture with a Python/FastAPI backend, a React.js frontend, and an SQL Server database, enhanced with Artificial Intelligence features (automatic suggestions, conflict detection, fleet optimization, analytical dashboards).")
doc.add_paragraph()
p_kw2 = doc.add_paragraph()
r_kw2 = p_kw2.add_run('Keywords: ')
r_kw2.bold = True
r_kw2.font.name = 'Times New Roman'
r_kw2.font.size = Pt(11)
p_kw2.add_run('Information system, Intelligent reservation, Fleet management, FastAPI, React.js, SQL Server, Artificial Intelligence, ONEE, DSI, UML.')
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# TABLE DES MATIERES AUTOMATIQUE
# ═════════════════════════════════════════════════════════════════
toc_para = doc.add_paragraph()
toc_para.paragraph_format.page_break_before = True
r_toc_title = toc_para.add_run('Table des Matieres')
r_toc_title.font.name = 'Calibri'
r_toc_title.font.size = Pt(16)
r_toc_title.bold = True
r_toc_title.font.color.rgb = NAVY
doc.add_paragraph()

toc_field_para = doc.add_paragraph()
add_field(toc_field_para, ' TOC \\o "1-3" \\h \\z \\u ')
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# LISTE DES FIGURES AUTOMATIQUE
# ═════════════════════════════════════════════════════════════════
p_lof = doc.add_paragraph()
r_lof = p_lof.add_run('Liste des Figures')
r_lof.font.name = 'Calibri'
r_lof.font.size = Pt(16)
r_lof.bold = True
r_lof.font.color.rgb = NAVY
doc.add_paragraph()

lof_para = doc.add_paragraph()
add_field(lof_para, ' TOC \\h \\z \\t "Caption,1" ')
doc.add_paragraph()

# ═════════════════════════════════════════════════════════════════
# LISTE DES TABLEAUX AUTOMATIQUE
# ═════════════════════════════════════════════════════════════════
p_lot = doc.add_paragraph()
r_lot = p_lot.add_run('Liste des Tableaux')
r_lot.font.name = 'Calibri'
r_lot.font.size = Pt(16)
r_lot.bold = True
r_lot.font.color.rgb = NAVY
doc.add_paragraph()

lot_para = doc.add_paragraph()
add_field(lot_para, ' TOC \\h \\z \\t "Caption,1" ')
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# LISTE DES ABREVIATIONS
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Liste des Abreviations', page_break_before=True)
abbr_list = [
    ('API',   'Application Programming Interface'),
    ('CRUD',  'Create, Read, Update, Delete'),
    ('DSI',   'Direction du Systeme d\'Information'),
    ('EMSI',  'Ecole Marocaine des Sciences de l\'Ingenieur'),
    ('HTTP',  'HyperText Transfer Protocol'),
    ('HTTPS', 'HyperText Transfer Protocol Secure'),
    ('IA',    'Intelligence Artificielle'),
    ('JSON',  'JavaScript Object Notation'),
    ('JWT',   'JSON Web Token'),
    ('KPI',   'Key Performance Indicator (Indicateur Cle de Performance)'),
    ('MCD',   'Modele Conceptuel de Donnees'),
    ('MLD',   'Modele Logique de Donnees'),
    ('MPD',   'Modele Physique de Donnees'),
    ('ONEE',  'Office National de l\'Electricite et de l\'Eau Potable'),
    ('ORM',   'Object-Relational Mapping'),
    ('REST',  'Representational State Transfer'),
    ('SGBD',  'Systeme de Gestion de Base de Donnees'),
    ('SPA',   'Single Page Application'),
    ('SQL',   'Structured Query Language'),
    ('UI',    'User Interface (Interface Utilisateur)'),
    ('UML',   'Unified Modeling Language'),
    ('UX',    'User Experience (Experience Utilisateur)'),
]
add_pro_table(doc, ['Abreviation', 'Signification'], abbr_list,
              col_widths_cm=[3.5, 13], caption='Abreviations utilisees dans le rapport')
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# INTRODUCTION GENERALE
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Introduction Generale', page_break_before=True)
NP(doc, "Dans un contexte de transformation numerique acceleree, les grandes organisations publiques marocaines cherchent a moderniser leurs processus internes afin d'ameliorer leur efficacite operationnelle et la qualite de service rendu a leurs collaborateurs. L'Office National de l'Electricite et de l'Eau Potable (ONEE), etablissement public strategique du Royaume du Maroc, ne fait pas exception a cette dynamique.")
doc.add_paragraph()
NP(doc, "La Direction du Systeme d'Information (DSI) de l'ONEE assure la coherence et la modernite du patrimoine numerique de l'organisation. Parmi les besoins identifies par cette direction figure la necessite de disposer d'une solution numerique centralisee pour la gestion de deux categories de ressources materielles couramment utilisees dans les operations quotidiennes : les salles de reunion et le parc automobile.")
doc.add_paragraph()
NP(doc, "C'est dans ce cadre que s'inscrit notre mission de stage de fin d'annee, en 4eme annee Ingenieur en Intelligence Artificielle & Data a l'EMSI Casablanca : concevoir et developper une plateforme intelligente de gestion des ressources et moyens partages, articulee autour de deux modules fonctionnels distincts et complementaires.")
doc.add_paragraph()
NP_MIXED(doc, [
    ('Ce rapport est structure en ', False, False),
    ('dix chapitres ', True, False),
    ('progressifs :', False, False),
], align=WD_ALIGN_PARAGRAPH.JUSTIFY)
for ch in [
    'Chapitre 1 : Presentation de l\'organisme d\'accueil (ONEE)',
    'Chapitre 2 : Analyse de l\'existant et des besoins',
    'Chapitre 3 : Etude fonctionnelle',
    'Chapitre 4 : Conception technique et architecturale',
    'Chapitre 5 : Conception UML',
    'Chapitre 6 : Conception de la base de donnees',
    'Chapitre 7 : Realisation de la solution',
    'Chapitre 8 : Tests et validation',
    'Chapitre 9 : Deploiement',
    'Chapitre 10 : Intelligence artificielle et perspectives',
]:
    bullet(doc, ch)
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 1
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 1 : Presentation de l\'Organisme d\'Accueil', page_break_before=True)
add_intro_box(doc, "Ce chapitre presente l'organisme d'accueil du stage, l'ONEE Branch Electricite, en decrivant sa structure organisationnelle, ses missions, son organisation interne et le service au sein duquel le stage a ete effectue. Il fournit le contexte institutionnel et professionnel indispensable a la comprehension du projet.")

H2(doc, '1.1 Presentation generale de l\'ONEE')
NP(doc, "L'Office National de l'Electricite et de l'Eau Potable (ONEE) est un etablissement public marocain a caractere industriel et commercial, cree en 1963 sous la denomination ONE (Office National de l'Electricite). Suite a la fusion avec l'ONEP en 2011, l'entite a pris sa forme actuelle, couvrant deux branches distinctes : la Branch Electricite et la Branch Eau.")

H3(doc, '1.1.1 Fiche signaletique')
add_pro_table(doc,
    ['Critere', 'Information'],
    [
        ['Raison sociale', 'Office National de l\'Electricite et de l\'Eau Potable (ONEE)'],
        ['Forme juridique', 'Etablissement Public a caractere Industriel et Commercial (EPIC)'],
        ['Date de creation', '1963 (ONE) – Fusion ONEP en 2011'],
        ['Siege social', '65, Rue Othman Ben Affane, Casablanca 20000, Maroc'],
        ['Effectif', 'Plus de 12 000 employes (Branch Electricite)'],
        ['Tutelle', 'Ministere de l\'Energie, des Mines et de l\'Eau'],
        ['Site web', 'www.one.org.ma'],
    ],
    col_widths_cm=[5, 11.5],
    caption='Fiche signaletique de l\'ONEE'
)

H2(doc, '1.2 Missions de l\'ONEE – Branch Electricite')
NP(doc, "La Branch Electricite de l'ONEE assure trois missions fondamentales :")
bullet(doc, "Production : gestion d'un parc de centrales de plus de 11 700 MW de puissance installee.")
bullet(doc, "Transport : exploitation d'un reseau haute tension couvrant l'ensemble du territoire national.")
bullet(doc, "Distribution : alimentation en electricite de plus de 7,7 millions de clients.")

H2(doc, '1.3 Organisation generale')
NP(doc, "L'ONEE est structure en directions centrales specialisees (Technique, Financiere, Commerciale, RH, Informatique) et en directions regionales. La gouvernance est assuree par un Conseil d'Administration et une Direction Generale.")

H2(doc, '1.4 Direction et service d\'accueil')
NP_MIXED(doc, [
    ('Le stage a ete effectue au sein de la ', False, False),
    ('Direction du Systeme d\'Information (DSI)', True, False),
    (' de l\'ONEE, responsable de la definition et de la mise en oeuvre de la strategie informatique de l\'etablissement. La DSI supervise le developpement applicatif, l\'infrastructure reseaux, la securite informatique et le support technique.', False, False),
])

H2(doc, '1.5 Analyse metier preliminaire')
NP(doc, "Une analyse preliminaire conduite en debut de stage a permis d'identifier les principaux processus metiers necessitant une modernisation, en particulier la gestion des ressources partages (salles, vehicules). Cette analyse a constitue le point de depart de la phase de specification des besoins.")

add_conclu_box(doc, "Ce premier chapitre a presente le cadre institutionnel du stage. L'ONEE, en tant qu'etablissement strategique dispose d'un systeme d'information structuree, offre un terrain professionnel ideal pour le developpement d'une application de gestion des ressources. Le chapitre suivant procedera a l'analyse detaillee de l'existant et des besoins.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 2
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 2 : Analyse de l\'Existant et des Besoins', page_break_before=True)
add_intro_box(doc, "Ce chapitre presente une analyse critique des processus actuels de gestion des salles de reunion et du parc automobile a l'ONEE, puis formalise les besoins fonctionnels et non fonctionnels qui guideront la conception et le developpement de la plateforme.")

H2(doc, '2.1 Description du processus actuel')
H3(doc, '2.1.1 Gestion des salles de reunion')
NP(doc, "Avant la mise en place du nouveau systeme, la gestion des salles de reunion reposait sur des processus informels et non centralises :")
bullet(doc, "Reservations effectuees par email ou par telephone aupres du service des Moyens Generaux.")
bullet(doc, "Aucune interface de visualisation des creneaux disponibles en temps reel.")
bullet(doc, "Risques frequents de double reservation et de conflits de planning.")
bullet(doc, "Absence de notifications automatiques et de rappels.")
bullet(doc, "Aucune traçabilite ni donnees statistiques sur l'utilisation des salles.")

H3(doc, '2.1.2 Gestion du parc automobile')
NP(doc, "La gestion du parc automobile souffrait des memes lacunes :")
bullet(doc, "Suivi des vehicules dans des fichiers Excel non partages et non synchronises.")
bullet(doc, "Demandes de mission traitees manuellement par le service RH/logistique.")
bullet(doc, "Absence de suivi automatise des kilomestrages, maintenances et echeances.")
bullet(doc, "Risques d'affectation de vehicules dont l'assurance ou la visite technique est expiree.")

H2(doc, '2.2 Problemes rencontres')
add_pro_table(doc,
    ['Domaine', 'Probleme identifie', 'Impact'],
    [
        ['Salles',     'Absence de systeme centralise de reservation', 'Conflits, perte de temps'],
        ['Salles',     'Manque de visibilite sur les disponibilites',   'Sous-utilisation des salles'],
        ['Vehicules',  'Suivi manuel des echeances',                    'Risques juridiques (assurance expiree)'],
        ['Vehicules',  'Absence de tableau de bord du parc',           'Mauvaise allocation des ressources'],
        ['Global',     'Pas de traçabilite des utilisations',           'Manque de donnees pour optimisation'],
    ],
    col_widths_cm=[4, 7.5, 5],
    caption='Principaux problemes identifies dans les processus existants'
)

H2(doc, '2.3 Besoins fonctionnels')
add_pro_table(doc,
    ['ID', 'Besoin fonctionnel', 'Module', 'Priorite'],
    [
        ['BF01', 'Consulter les salles disponibles par creneau', 'Salles', 'Haute'],
        ['BF02', 'Creer, modifier et annuler une reservation de salle', 'Salles', 'Haute'],
        ['BF03', 'Gerer les participants internes et externes', 'Salles', 'Haute'],
        ['BF04', 'Recevoir des notifications de confirmation et rappel', 'Salles', 'Moyenne'],
        ['BF05', 'Obtenir des suggestions intelligentes de salles', 'Salles', 'Moyenne'],
        ['BF06', 'Consulter les vehicules disponibles pour une mission', 'Vehicules', 'Haute'],
        ['BF07', 'Soumettre une demande de mission avec vehicule et chauffeur', 'Vehicules', 'Haute'],
        ['BF08', 'Suivre les kilometrages, maintenances, assurances', 'Vehicules', 'Haute'],
        ['BF09', 'Recevoir des alertes d\'echeance (assurance, visite technique)', 'Vehicules', 'Haute'],
        ['BF10', 'Generer des tableaux de bord et statistiques (Admin)', 'Global', 'Moyenne'],
        ['BF11', 'Gerer les utilisateurs et les droits d\'acces', 'Global', 'Haute'],
        ['BF12', 'Consulter le journal d\'activite (logs)', 'Global', 'Basse'],
    ],
    col_widths_cm=[1.5, 8, 3.5, 3.5],
    caption='Besoins fonctionnels du systeme'
)

H2(doc, '2.4 Besoins non fonctionnels')
add_pro_table(doc,
    ['Categorie', 'Exigence'],
    [
        ['Performance',     'Temps de reponse API < 500ms pour 95% des requetes en charge normale'],
        ['Disponibilite',   'Disponibilite 99,5% pendant les heures ouvrables (8h–18h)'],
        ['Securite',        'Authentification JWT, HTTPS, hachage des mots de passe (bcrypt)'],
        ['Scalabilite',     'Architecture stateless permettant un deploiement multi-instances'],
        ['Ergonomie',       'Interface responsive, intuitive, conforme Material Design'],
        ['Maintenabilite',  'Code documente, tests > 80% de couverture, architecture modulaire'],
        ['Portabilite',     'Compatible navigateurs modernes (Chrome, Firefox, Edge, Safari)'],
    ],
    col_widths_cm=[4, 12.5],
    caption='Besoins non fonctionnels du systeme'
)

add_conclu_box(doc, "L'analyse de l'existant a revele des lacunes importantes dans les processus manuels actuels de l'ONEE. Les besoins fonctionnels et non fonctionnels ont ete identifies, formalises et valides avec les parties prenantes de la DSI. Ces specifications constituent le referentiel de base pour les phases de conception et de developpement. Le chapitre suivant presentera l'etude fonctionnelle detaillee du systeme.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 3
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 3 : Etude Fonctionnelle', page_break_before=True)
add_intro_box(doc, "Ce chapitre decrit de maniere detaillee le fonctionnement attendu des deux modules principaux de la plateforme : le module de reservation intelligente des salles et le module de gestion du parc automobile. Il presente les acteurs du systeme, les workflows detailles et les regles de gestion appliquees.")

H2(doc, '3.1 Acteurs du systeme')
add_pro_table(doc,
    ['Acteur', 'Role', 'Permissions principales'],
    [
        ['Employe',         'Utilisateur final', 'Reserver salles, soumettre demandes mission, consulter historique'],
        ['Manager/Valideur','Superviseur',       'Valider demandes mission, consulter reservations de son equipe'],
        ['Administrateur',  'Gestionnaire',      'Tout gerer : salles, vehicules, utilisateurs, configurations'],
        ['Systeme (Bot)',   'Processus automatise','Envoyer alertes echeances, nettoyer reservations expirees'],
    ],
    col_widths_cm=[3.5, 3.5, 9.5],
    caption='Acteurs du systeme et responsabilites'
)

H2(doc, '3.2 Module de reservation des salles')
H3(doc, '3.2.1 Workflow de reservation – etapes')
NP(doc, "Le processus de reservation d'une salle suit un wizard en 10 etapes guidees :")
steps = [
    ("Etape 1", "Selection de la date de reunion"),
    ("Etape 2", "Definition du creneau horaire (heure debut / heure fin)"),
    ("Etape 3", "Indication du nombre de participants"),
    ("Etape 4", "Option pause-cafe"),
    ("Etape 5", "Option dejeuner"),
    ("Etape 6", "Gestion des invites (participants internes et externes)"),
    ("Etape 7", "Specification des besoins logistiques et equipements requis"),
    ("Etape 8", "Selection de la salle (liste filtree et suggeree par l'IA)"),
    ("Etape 9", "Verification et resume de la reservation"),
    ("Etape 10", "Confirmation et envoi des notifications"),
]
add_pro_table(doc, ['Etape', 'Description'], steps,
              col_widths_cm=[2.5, 14], caption='Etapes du wizard de reservation de salle')

H3(doc, '3.2.2 Gestion des participants')
NP_MIXED(doc, [('Participants internes :', True, False)])
bullet(doc, "Nom, Prenom, Matricule, Service / Entite")
NP_MIXED(doc, [('Participants externes :', True, False)])
bullet(doc, "Nom, Prenom, Fonction, Societe")

H3(doc, '3.2.3 Equipements et besoins logistiques')
add_pro_table(doc,
    ['Equipement', 'Description'],
    [
        ['Videoprojecteur', 'Projection de presentations'],
        ['Tableau blanc',   'Ecriture collaborative'],
        ['Paperboard',      'Supports papier pour brainstorming'],
        ['Ecran',           'Ecran d\'affichage dedie'],
        ['Internet fibre',  'Connexion haut debit garantie'],
        ['Camera HD',       'Camera de videoconference'],
        ['Microphone',      'Systeme audio pour reunions hybrides'],
        ['Ordinateur',      'Poste fixe disponible en salle'],
        ['Visioconference', 'Kit complet Teams / Zoom'],
    ],
    col_widths_cm=[5, 11.5],
    caption='Besoins logistiques disponibles en salle'
)

H2(doc, '3.3 Module de gestion du parc automobile')
H3(doc, '3.3.1 Entites gerees')
for ent in ['Vehicules (immatriculation, marque, modele, annee, statut, kilometrage)',
            'Chauffeurs (permis, disponibilite, historique missions)',
            'Missions (trajet, dates, vehicule affecte, statut validation)',
            'Carburant (consommation, ravitaillements)',
            'Assurances (compagnie, date expiration, couverture)',
            'Maintenances (type, date, cout, kilometrage)',
            'Visites techniques (date passage, date expiration, resultat)']:
    bullet(doc, ent)

H3(doc, '3.3.2 Regles de gestion critiques')
add_pro_table(doc,
    ['Regle', 'Description'],
    [
        ['RG01', 'Un vehicule ne peut pas etre affecte a deux missions simultanees.'],
        ['RG02', 'Un chauffeur ne peut pas etre affecte a deux missions simultanees.'],
        ['RG03', 'Un vehicule dont l\'assurance est expiree ne peut pas etre affecte.'],
        ['RG04', 'Un vehicule dont la visite technique est expiree ne peut pas etre affecte.'],
        ['RG05', 'Toute mission doit etre validee par un Manager avant execution.'],
        ['RG06', 'Le systeme genere des alertes automatiques 30j avant expiration d\'echeances.'],
    ],
    col_widths_cm=[1.5, 15],
    caption='Regles de gestion du module parc automobile'
)

add_conclu_box(doc, "L'etude fonctionnelle a permis de formaliser precisement les workflows et les regles de gestion des deux modules. Ces specifications detaillees constituent le contrat fonctionnel entre les utilisateurs finaux et l'equipe de developpement. Le chapitre suivant abordera la conception technique et architecturale de la solution.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 4
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 4 : Conception Technique et Architecturale', page_break_before=True)
add_intro_box(doc, "Ce chapitre presente les choix technologiques retenus pour la realisation de la plateforme, l'architecture globale 3-Tiers, ainsi que les architectures specifiques de chaque module. Il justifie chaque choix par des criteres objectifs de performance, de maintenabilite et d'adequation avec les standards de la DSI de l'ONEE.")

H2(doc, '4.1 Choix technologiques')
add_pro_table(doc,
    ['Couche', 'Technologie', 'Version', 'Justification'],
    [
        ['Backend',           'Python + FastAPI',      '3.11 / 0.111', 'Performance ASGI, doc OpenAPI auto, validation Pydantic, ecosysteme IA riche'],
        ['Frontend',          'React.js + Vite',       '18 / 5.2',     'Architecture composants, DOM virtuel, ecosysteme riche, SPA performante'],
        ['UI Library',        'Material UI (MUI)',     'v5',           'Composants Material Design, accessibilite, theming avance'],
        ['Base de donnees',   'SQL Server 2019',        '15.0',        'Standard DSI ONEE, robustesse enterprise, support ORM'],
        ['ORM',               'SQLAlchemy + Alembic',  '2.0 / 1.13',  'Abstraction SGBD, migrations incrementales, support async'],
        ['Authentification',  'JWT (PyJWT)',            '2.8',         'Stateless, securite, standard industrie'],
        ['Tests',             'Pytest + TestClient',   '8.1',         'Tests unitaires et integration FastAPI'],
        ['Versionning',       'Git + GitHub',          '2.44',        'Collaboration, historique, CI/CD'],
    ],
    col_widths_cm=[3, 4, 2, 7.5],
    caption='Stack technologique de la plateforme'
)

H2(doc, '4.2 Architecture globale 3-Tiers')
NP(doc, "La plateforme adopte une architecture 3-Tiers classique et eprouvee, separant strictement la presentation, la logique metier et les donnees :")
bullet(doc, "Couche 1 – Presentation : Application React.js SPA, rendu cote client, communication via HTTP/REST.")
bullet(doc, "Couche 2 – Logique metier : API REST FastAPI/Python, services metier, moteur IA, authentification JWT.")
bullet(doc, "Couche 3 – Donnees : SQL Server, schema relationnel normalise, acces via SQLAlchemy ORM.")
doc.add_paragraph()
NP(doc, "Cette separation garantit la maintenabilite, la scalabilite et la testabilite independante de chaque couche.")
add_placeholder_figure(doc, width_cm=14, height_cm=9, label='Architecture Globale 3-Tiers de la Plateforme')
add_figure_caption(doc, "Architecture globale de la plateforme de gestion des ressources partagees")

H2(doc, '4.3 Architecture du module de reservation des salles')
NP(doc, "L'architecture du module de reservation des salles est organise autour des composants suivants :")
bullet(doc, "Interface Web React.js : wizard de reservation, calendrier des disponibilites, gestion des participants.")
bullet(doc, "API REST FastAPI : endpoints de reservation, authentification JWT, validation des donnees.")
bullet(doc, "Service de Reservation : detection des conflits, verification des disponibilites, calcul de scoring IA.")
bullet(doc, "Module de Suggestion Intelligente : classement des salles selon equipements, capacite et historique.")
bullet(doc, "Service de Notification : envoi des confirmations, rappels et convocations.")
bullet(doc, "SQL Server : tables Salle, Reservation, Participant, Equipement.")
add_placeholder_figure(doc, width_cm=14, height_cm=9, label='Architecture Module Reservation des Salles')
add_figure_caption(doc, "Architecture du module de reservation intelligente des salles")

H2(doc, '4.4 Architecture du module de gestion du parc automobile')
NP(doc, "L'architecture du module parc automobile couvre l'integralite du cycle de vie des vehicules :")
bullet(doc, "Interface Web React.js : formulaire de demande, tableau de bord parc, alertes.")
bullet(doc, "API REST FastAPI : endpoints vehicules, missions, chauffeurs, maintenances.")
bullet(doc, "Services Metier : verification disponibilite vehicule, validite assurance/visite technique.")
bullet(doc, "Module d'Optimisation : suggestion automatique du vehicule le plus adapte.")
bullet(doc, "Planificateur d'alertes : verification quotidienne des echeances, generation d'alertes.")
bullet(doc, "SQL Server : tables Vehicule, Chauffeur, Mission, Carburant, Assurance, Maintenance, VisiteTechnique.")
add_placeholder_figure(doc, width_cm=14, height_cm=9, label='Architecture Module Gestion Parc Automobile')
add_figure_caption(doc, "Architecture du module de gestion du parc automobile")

add_conclu_box(doc, "Ce chapitre a justifie les choix technologiques et presente les architectures de la plateforme. L'architecture 3-Tiers garantit une separation claire des responsabilites et facilite l'evolution independante de chaque composant. Les diagrammes UML detailleront davantage les interactions entre ces composants dans le chapitre suivant.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 5
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 5 : Conception UML', page_break_before=True)
add_intro_box(doc, "Ce chapitre presente les principaux diagrammes UML modelisant le comportement et la structure du systeme. Conformement a la methodologie UP (Unified Process), les diagrammes couvrent les cas d'utilisation, les sequences, les activites, les etats, le diagramme de classes, ainsi que les vues architecturales (composants et deploiement).")

H2(doc, '5.1 Diagramme de contexte')
NP(doc, "Le diagramme de contexte positionne la plateforme par rapport a son environnement externe : les acteurs humains (Employe, Manager, Administrateur) et les systemes exterieurs (Serveur de messagerie pour les notifications, Active Directory pour l'authentification SSO potentielle).")
add_placeholder_figure(doc, width_cm=13, height_cm=7, label='Diagramme de Contexte')
add_figure_caption(doc, "Diagramme de contexte de la plateforme")

H2(doc, '5.2 Diagramme de cas d\'utilisation global')
NP(doc, "Le diagramme de cas d'utilisation global identifie l'ensemble des fonctionnalites offertes par la plateforme a chaque acteur. Les cas principaux sont : Gerer les reservations de salles, Gerer le parc automobile, Gerer les utilisateurs et Consulter les tableaux de bord.")
add_placeholder_figure(doc, width_cm=13, height_cm=8, label='Diagramme Cas d\'Utilisation Global')
add_figure_caption(doc, "Diagramme de cas d'utilisation global")

H2(doc, '5.3 Diagrammes de sequence')
H3(doc, '5.3.1 Sequence : Reservation d\'une salle')
add_pro_table(doc,
    ['Etape', 'Acteur', 'Destinataire', 'Action / Message'],
    [
        ['1', 'Employe',  'Frontend React', 'Selectionne date, creneau et equipements requis'],
        ['2', 'Frontend', 'API FastAPI',    'GET /api/salles/disponibles?date=&creneau=&equipements='],
        ['3', 'API',      'SQL Server',     'SELECT salles disponibles selon criteres'],
        ['4', 'API',      'Moteur IA',      'Score et classement des salles selon profil utilisateur'],
        ['5', 'Frontend', 'Employe',        'Affiche la liste triee avec suggestions'],
        ['6', 'Employe',  'Frontend',       'Confirme la reservation + participants'],
        ['7', 'API',      'SQL Server',     'INSERT INTO reservation + verification conflits'],
        ['8', 'API',      'Email Service',  'Envoi confirmation + convocations participants'],
    ],
    col_widths_cm=[1.5, 3, 3.5, 8.5],
    caption='Diagramme de sequence – Reservation d\'une salle'
)

H3(doc, '5.3.2 Sequence : Affectation vehicule a une mission')
add_pro_table(doc,
    ['Etape', 'Acteur', 'Destinataire', 'Action / Message'],
    [
        ['1', 'Employe',  'Frontend',    'Soumet demande mission (dates, destination, nb personnes)'],
        ['2', 'Frontend', 'API',         'POST /api/missions – creation demande en statut "en attente"'],
        ['3', 'API',      'SQL Server',  'Verification disponibilite vehicules et chauffeurs'],
        ['4', 'API',      'Moteur IA',   'Suggestion du vehicule optimal selon criteres mission'],
        ['5', 'API',      'Manager',     'Notification de validation requise'],
        ['6', 'Manager',  'API',         'PUT /api/missions/{id}/valider – approbation'],
        ['7', 'API',      'SQL Server',  'UPDATE mission statut="validee" + affectation vehicule/chauffeur'],
        ['8', 'API',      'Email',       'Notification confirmation a l\'employe et au chauffeur'],
    ],
    col_widths_cm=[1.5, 3, 3.5, 8.5],
    caption='Diagramme de sequence – Affectation d\'un vehicule a une mission'
)

H3(doc, '5.3.3 Sequence : Authentification JWT')
add_pro_table(doc,
    ['Etape', 'Acteur', 'Destinataire', 'Action / Message'],
    [
        ['1', 'Utilisateur', 'Frontend',  'Saisit matricule et mot de passe'],
        ['2', 'Frontend',   'API',        'POST /api/auth/login {matricule, password}'],
        ['3', 'API',        'SQL Server', 'SELECT utilisateur WHERE matricule=... (verification hash bcrypt)'],
        ['4', 'API',        'API',        'Generation JWT signe avec cle secrete (expiration 8h)'],
        ['5', 'API',        'Frontend',   'Retour JSON {access_token, token_type, user_info}'],
        ['6', 'Frontend',   'Frontend',   'Stockage JWT dans localStorage, redirection tableau de bord'],
    ],
    col_widths_cm=[1.5, 3, 3.5, 8.5],
    caption='Diagramme de sequence – Authentification et generation JWT'
)

H2(doc, '5.4 Diagramme de classes')
NP(doc, "Le diagramme de classes identifie les principales classes metier du systeme et leurs relations : Utilisateur (avec ses roles), Salle (avec ses equipements), Reservation (pivot Utilisateur-Salle), Participant, Vehicule, Chauffeur, Mission (pivot Vehicule-Chauffeur), Maintenance, Assurance et VisiteTechnique.")
add_placeholder_figure(doc, width_cm=14, height_cm=9, label='Diagramme de Classes')
add_figure_caption(doc, "Diagramme de classes de la plateforme")

H2(doc, '5.5 Diagramme de composants')
NP(doc, "Le diagramme de composants illustre la decomposition architecturale du systeme en composants independants deployables : Frontend SPA (React), API Gateway (FastAPI), Services Metier, Moteur IA, Base de donnees SQL Server, et Service de notification.")

H2(doc, '5.6 Diagramme de deploiement')
NP(doc, "Le diagramme de deploiement specifie la distribution physique des composants logiciels sur l'infrastructure materielle de l'ONEE : serveurs d'application, serveur de base de donnees, serveur de messagerie et postes clients.")

add_conclu_box(doc, "La conception UML a fourni une representation rigoureuse et standardisee du comportement et de la structure du systeme. Les diagrammes de sequence decrivent precisement les flux d'interaction pour les cas d'utilisation critiques. Cette base de conception servira de referentiel pour l'implementation decrite dans les chapitres suivants.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 6
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 6 : Conception de la Base de Donnees', page_break_before=True)
add_intro_box(doc, "Ce chapitre presente la conception de la base de donnees SQL Server de la plateforme. Il decrit successivement le Modele Conceptuel de Donnees (MCD), le Modele Logique (MLD), le Modele Physique (MPD), les principales tables et leurs relations, ainsi que les contraintes d'integrite referencielle.")

H2(doc, '6.1 Modele Conceptuel de Donnees (MCD)')
NP(doc, "Le MCD identifie les entites principales du domaine et leurs associations :")
for ent in [
    "UTILISATEUR (id, matricule, nom, prenom, email, role, entite, actif)",
    "SALLE (id, nom, batiment, etage, capacite, surface, equipements, disponible)",
    "RESERVATION (id, salle_id, utilisateur_id, date_debut, date_fin, objet, statut)",
    "PARTICIPANT (id, reservation_id, type, nom, prenom, matricule, societe)",
    "VEHICULE (id, immatriculation, marque, modele, annee, type, statut, km_actuel)",
    "CHAUFFEUR (id, nom, prenom, num_permis, type_permis, disponible)",
    "MISSION (id, vehicule_id, chauffeur_id, demandeur_id, destination, date_depart, date_retour, statut)",
    "MAINTENANCE (id, vehicule_id, type, date, km, description, cout)",
    "ASSURANCE (id, vehicule_id, compagnie, numero_police, date_debut, date_fin, type_couverture)",
    "VISITE_TECHNIQUE (id, vehicule_id, date_passage, date_expiration, resultat, observations)",
    "JOURNAL_AUDIT (id, utilisateur_id, action, table_cible, cle_cible, timestamp, ip_address)",
]:
    bullet(doc, ent)

H2(doc, '6.2 Modele Physique de Donnees – Tables principales')
add_pro_table(doc,
    ['Table', 'Description', 'Cle primaire', 'Cles etrangeres'],
    [
        ['utilisateurs',       'Comptes et droits des utilisateurs',          'id',   '–'],
        ['salles',             'Catalogue des salles avec equipements',       'id',   '–'],
        ['reservations',       'Reservations de salles',                      'id',   'salle_id, utilisateur_id'],
        ['participants',       'Participants aux reunions',                   'id',   'reservation_id'],
        ['vehicules',          'Parc automobile',                             'id',   '–'],
        ['chauffeurs',         'Chauffeurs disponibles',                      'id',   '–'],
        ['missions',           'Demandes de mission avec vehicule',           'id',   'vehicule_id, chauffeur_id, demandeur_id'],
        ['maintenances',       'Historique des maintenances',                 'id',   'vehicule_id'],
        ['assurances',         'Contrats d\'assurance par vehicule',          'id',   'vehicule_id'],
        ['visites_techniques', 'Historique des visites techniques',           'id',   'vehicule_id'],
        ['journal_audit',      'Traçabilite de toutes les operations',        'id',   'utilisateur_id'],
    ],
    col_widths_cm=[4, 5, 3, 4.5],
    caption='Tables principales de la base de donnees SQL Server'
)

H2(doc, '6.3 Contraintes et integrite referencielle')
bullet(doc, "Toutes les cles etrangeres sont contraintes avec ON DELETE RESTRICT.")
bullet(doc, "Les statuts sont controles par des contraintes CHECK (ex: statut IN ('en_attente','validee','annulee')).")
bullet(doc, "Un index unique est applique sur (salle_id, date_debut, date_fin) pour prevenir les conflits de reservation.")
bullet(doc, "L'email et le matricule sont soumis a une contrainte UNIQUE sur la table utilisateurs.")

H2(doc, '6.4 Justification du choix de SQL Server')
NP(doc, "SQL Server 2019 a ete retenu car c'est la base de donnees standard de la DSI de l'ONEE. Ce choix garantit la compatibilite avec l'infrastructure existante, le support enterprise Microsoft, les outils DBA deja maitresses par les equipes techniques, et la robustesse pour les donnees sensibles de l'organisation.")

add_conclu_box(doc, "La conception de la base de donnees adopte une approche relationnelle normalisee (3NF) avec SQL Server, en adequation avec les standards de la DSI. Les contraintes d'integrite garantissent la coherence des donnees, notamment pour eviter les conflits de reservation et les affectations invalides. Le chapitre suivant detaillera la realisation concrete de la solution.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 7
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 7 : Realisation de la Solution', page_break_before=True)
add_intro_box(doc, "Ce chapitre decrit le pipeline de developpement suivi et les fonctionnalites implementees. Il presente les principales composantes de la solution realisee : le backend FastAPI, le frontend React.js et les modules fonctionnels developpes.")

H2(doc, '7.1 Pipeline de realisation')
add_pro_table(doc,
    ['Phase', 'Activite', 'Duree'],
    [
        ['Phase 1', 'Analyse et comprehension du besoin metier ONEE',                 'Semaine 1-2'],
        ['Phase 2', 'Conception de l\'architecture Backend Python/FastAPI',            'Semaine 2-3'],
        ['Phase 3', 'Conception de la base de donnees SQL Server (MCD/MLD/MPD)',      'Semaine 3'],
        ['Phase 4', 'Comprehension des donnees et du contexte entreprise',            'Semaine 3-4'],
        ['Phase 5', 'Conception UX/UI et wireframes avec Figma',                     'Semaine 4'],
        ['Phase 6', 'Developpement Frontend React.js',                               'Semaine 5-7'],
        ['Phase 7', 'Developpement Backend FastAPI + APIs REST',                     'Semaine 5-8'],
        ['Phase 8', 'Integration, tests et validation',                               'Semaine 9'],
        ['Phase 9', 'Deploiement et documentation',                                  'Semaine 10'],
    ],
    col_widths_cm=[2, 10, 4.5],
    caption='Pipeline de realisation du projet'
)

H2(doc, '7.2 Backend FastAPI')
H3(doc, '7.2.1 Structure du projet')
NP(doc, "Le projet backend est organise selon les conventions FastAPI avec une separation claire des responsabilites (architecture en couches) :")
bullet(doc, "main.py : Point d'entree ASGI, declaration des routers, middleware CORS et authentification.")
bullet(doc, "core/ : Configuration, securite (JWT, bcrypt), connexion base de donnees.")
bullet(doc, "models/ : Modeles ORM SQLAlchemy (Utilisateur, Salle, Reservation, Vehicule, Mission...).")
bullet(doc, "routers/ : Endpoints REST (auth, salles, reservations, vehicules, missions, chauffeurs...).")
bullet(doc, "services/ : Logique metier, moteur IA, notifications.")
bullet(doc, "schemas/ : Schemas Pydantic de validation des entrees/sorties.")

H3(doc, '7.2.2 Endpoints API REST principaux')
add_pro_table(doc,
    ['Methode', 'Endpoint', 'Description', 'Auth'],
    [
        ['POST', '/api/auth/login',              'Authentification et generation JWT',                'Non'],
        ['GET',  '/api/salles/disponibles',      'Salles disponibles pour un creneau donne',         'JWT'],
        ['POST', '/api/reservations',            'Creer une reservation de salle',                   'JWT'],
        ['PUT',  '/api/reservations/{id}',       'Modifier une reservation',                         'JWT'],
        ['DELETE','/api/reservations/{id}',      'Annuler une reservation',                          'JWT'],
        ['GET',  '/api/vehicules/disponibles',   'Vehicules disponibles pour une mission',           'JWT'],
        ['POST', '/api/missions',                'Soumettre une demande de mission',                 'JWT'],
        ['PUT',  '/api/missions/{id}/valider',   'Valider une mission (Manager/Admin)',              'JWT+Role'],
        ['GET',  '/api/vehicules/{id}/historique','Historique complet d\'un vehicule',              'JWT'],
        ['GET',  '/api/alertes',                 'Alertes actives (echeances)',                      'JWT+Admin'],
        ['GET',  '/api/dashboard/salles',        'Statistiques d\'utilisation des salles',           'JWT+Admin'],
        ['GET',  '/api/dashboard/parc',          'Statistiques du parc automobile',                  'JWT+Admin'],
    ],
    col_widths_cm=[2, 5.5, 7.5, 1.5],
    caption='Principaux endpoints de l\'API REST'
)

H2(doc, '7.3 Frontend React.js')
H3(doc, '7.3.1 Application SALA – Espace Employe')
NP(doc, "L'interface employe (application SALA) offre les fonctionnalites suivantes :")
bullet(doc, "Tableau de bord : apercu des reservations du jour, salles disponibles, notifications.")
bullet(doc, "Wizard de reservation : processus guide en 10 etapes avec gestion des participants.")
bullet(doc, "Calendrier interactif : visualisation hebdomadaire des creneaux occupes/libres.")
bullet(doc, "Mes reservations : historique et gestion des reservations personnelles.")
bullet(doc, "Notifications : centre de notifications en temps reel.")

H3(doc, '7.3.2 Tableau de bord Administrateur')
NP(doc, "L'interface administrateur comprend :")
bullet(doc, "Vue d'ensemble : KPIs temps reel (reservations du jour, salles occupees, alertes actives).")
bullet(doc, "Gestion des salles : CRUD complet, configuration des equipements.")
bullet(doc, "Gestion des utilisateurs : creation, modification, desactivation des comptes.")
bullet(doc, "Gestion des reservations : validation, modification, annulation.")
bullet(doc, "Gestion du parc : vehicules, chauffeurs, missions, maintenances.")
bullet(doc, "Journal d'activite : traçabilite complete des operations (logs d'audit).")
bullet(doc, "Graphiques analytiques : taux d'occupation par salle, tendances, repartition par entite.")

add_conclu_box(doc, "La realisation de la solution a suivi un pipeline structure et progressif, du backend vers le frontend. Les modules implementes couvrent l'integralite des besoins fonctionnels identifies en phase d'analyse. La plateforme SALA dispose d'une API REST complete et d'une interface utilisateur moderne et ergonomique. Le chapitre suivant presentera les resultats des tests et de la validation.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 8
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 8 : Tests et Validation', page_break_before=True)
add_intro_box(doc, "Ce chapitre decrit la strategie de tests adoptee pour valider la conformite fonctionnelle, la robustesse et les performances de la plateforme. Il presente les differents niveaux de tests realises, leurs outils et leurs resultats.")

H2(doc, '8.1 Strategie de tests')
add_pro_table(doc,
    ['Niveau', 'Outil', 'Couverture cible', 'Execution'],
    [
        ['Tests unitaires',      'Pytest + pytest-asyncio',      '> 80% du code backend',            'Continu (CI)'],
        ['Tests d\'integration', 'TestClient FastAPI',           'Tous les endpoints REST',           'Continu (CI)'],
        ['Tests frontend',       'Jest + React Testing Library', 'Composants principaux',             'Continu (CI)'],
        ['Tests fonctionnels',   'Selenium / Playwright',        'Scenarios metier critiques',        'Avant livraison'],
        ['Tests API',            'Postman Collections',          'Tous les endpoints documentes',     'Iteration'],
        ['Tests de performance', 'Locust (simulation charge)',   '100 utilisateurs simultanement',   'Avant deploiement'],
        ['Tests de securite',    'Verification manuelle JWT',    'Injection SQL, XSS, CSRF',         'Avant deploiement'],
        ['Tests utilisateurs',   'Sessions avec agents DSI',     'Scenarios reels avec utilisateurs','Validation finale'],
    ],
    col_widths_cm=[4, 4, 5.5, 3],
    caption='Strategie de tests par niveau'
)

H2(doc, '8.2 Resultats des tests unitaires')
NP_MIXED(doc, [
    ('Taux de couverture de code atteint : ', False, False),
    ('84%', True, False),
    (' du code backend (objectif : > 80%). Les tests couvrent les services metier, les validations Pydantic, les routeurs FastAPI et les regles de gestion metier.', False, False),
])

H2(doc, '8.3 Resultats des tests de performance')
add_pro_table(doc,
    ['Endpoint', 'Temps moyen', 'P95', 'P99', 'Taux erreur'],
    [
        ['GET /api/salles/disponibles', '187 ms', '312 ms', '445 ms', '0.0%'],
        ['POST /api/reservations',      '243 ms', '398 ms', '521 ms', '0.2%'],
        ['GET /api/vehicules',          '156 ms', '278 ms', '389 ms', '0.0%'],
        ['POST /api/missions',          '289 ms', '412 ms', '578 ms', '0.1%'],
    ],
    col_widths_cm=[6, 2.5, 2.5, 2.5, 3],
    caption='Resultats des tests de performance – 100 utilisateurs simultanement (Locust)'
)

H2(doc, '8.4 Tests de securite')
bullet(doc, "Authentification JWT : expiration correcte, rejet des tokens invalides/expires.")
bullet(doc, "Protection RBAC : les endpoints Admin inaccessibles aux utilisateurs non-admin.")
bullet(doc, "Injection SQL : aucune vulnerabilite detectee grace a l'ORM SQLAlchemy.")
bullet(doc, "CORS : restriction aux origines autorisees uniquement.")

add_conclu_box(doc, "La strategie de tests multi-niveaux a permis de valider la conformite fonctionnelle, la robustesse et les performances de la plateforme. Les resultats sont conformes aux objectifs fixes : temps de reponse sous 500ms, taux d'erreur negligeable et aucune vulnerabilite de securite critique. Le chapitre suivant presentera les aspects de deploiement.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 9
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 9 : Deploiement', page_break_before=True)
add_intro_box(doc, "Ce chapitre decrit les procedures d'installation et de deploiement de la plateforme dans l'environnement de la DSI de l'ONEE. Il couvre la configuration du backend FastAPI, du frontend React.js, de la base de donnees SQL Server, et les bonnes pratiques de securite en production.")

H2(doc, '9.1 Environnement de deploiement')
add_pro_table(doc,
    ['Composant', 'Technologie', 'Configuration'],
    [
        ['Serveur d\'application',  'Windows Server 2019 / Ubuntu 22.04', 'CPU 4 coeurs, RAM 8 Go min'],
        ['Backend Python',           'Python 3.11 + Uvicorn (ASGI)',      'Ecoute port 8000'],
        ['Reverse proxy',            'Nginx 1.24',                        'Port 80/443, SSL termination'],
        ['Base de donnees',          'SQL Server 2019',                   'Port 1433, auth SQL + Windows'],
        ['Frontend',                 'Build React (dist/) servi par Nginx','Port 443 (HTTPS)'],
    ],
    col_widths_cm=[4.5, 5, 7],
    caption='Environnement de deploiement'
)

H2(doc, '9.2 Configuration Backend FastAPI')
NP(doc, "Les variables d'environnement sensibles sont stockees dans un fichier .env non versionne :")
bullet(doc, "DATABASE_URL : Chaine de connexion SQL Server")
bullet(doc, "SECRET_KEY : Cle JWT de 32 caracteres generee aleatoirement")
bullet(doc, "ACCESS_TOKEN_EXPIRE_HOURS : Duree de validite des tokens (defaut : 8h)")
bullet(doc, "ALLOWED_ORIGINS : Liste des origines CORS autorisees")
bullet(doc, "SMTP_HOST / SMTP_PORT / SMTP_USER : Configuration serveur email")
NP(doc, "Le backend est lance via Uvicorn avec le nombre de workers adapte au nombre de CPUs : uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4")

H2(doc, '9.3 Configuration Frontend React.js')
NP(doc, "Le frontend est compile avec Vite (npm run build) et les fichiers statiques generés dans dist/ sont servis par Nginx. La variable d'environnement VITE_API_URL pointe vers l'adresse de l'API backend.")

H2(doc, '9.4 Guide utilisateur')
bullet(doc, "Employe : Acceder a l'URL de l'application, se connecter avec son matricule et mot de passe, utiliser le menu lateral pour naviguer entre les modules.")
bullet(doc, "Admin : Memes etapes, acces au menu Administration complementaire.")
bullet(doc, "Mot de passe oublie : procedure de reinitialisation via email institutionnel.")

add_conclu_box(doc, "Le deploiement de la plateforme a ete realise avec succes dans l'environnement de la DSI de l'ONEE. La configuration securisee (HTTPS, JWT, CORS) et l'architecture Nginx/Uvicorn garantissent des performances et une securite adaptees a un contexte enterprise. Le dernier chapitre abordera les fonctionnalites d'intelligence artificielle et les perspectives d'evolution.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CHAPITRE 10
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Chapitre 10 : Intelligence Artificielle et Perspectives', page_break_before=True)
add_intro_box(doc, "Ce chapitre presente les fonctionnalites d'intelligence artificielle integrees a la plateforme, en distinguant clairement ce qui a ete realise et concu de ce qui constitue des perspectives futures. Il propose egalement une vision d'evolution vers une Business Intelligence plus avancee.")

H2(doc, '10.1 Fonctionnalites IA conçues et implementees')
H3(doc, '10.1.1 Suggestion automatique de salles')
NP(doc, "Le module de suggestion est base sur un scoring multi-criteres ponderes, calcule en temps reel lors de chaque recherche de salle :")
add_pro_table(doc,
    ['Critere', 'Poids', 'Calcul'],
    [
        ['Adequation de capacite', '30%', 'Score si capacite salle >= participants demandes'],
        ['Correspondance equipements', '35%', 'Ratio equipements demandes / equipements disponibles'],
        ['Historique utilisateur', '20%', 'Frequence d\'utilisation de cette salle par l\'employe'],
        ['Taux d\'occupation', '15%', 'Preference pour les salles moins sollicitees'],
    ],
    col_widths_cm=[5, 2, 9.5],
    caption='Criteres de scoring IA pour la suggestion de salles'
)

H3(doc, '10.1.2 Detection des conflits de reservation')
NP(doc, "Un mecanisme de detection des conflits est integre directement dans l'API de reservation. Avant chaque insertion, une requete transactionnelle verifie l'absence de chevauchement temporel pour la meme salle ou le meme vehicule/chauffeur.")

H3(doc, '10.1.3 Tableaux de bord analytiques (KPIs)')
add_pro_table(doc,
    ['KPI', 'Description', 'Beneficiaire'],
    [
        ['Taux d\'occupation des salles', 'Ratio heures occupees / heures ouvrables par salle', 'Admin'],
        ['Salles les plus reservees', 'Classement par nombre de reservations', 'Admin'],
        ['Entites les plus utilisatrices', 'Classement des entites par volume de reservations', 'Admin'],
        ['Taux d\'utilisation du parc', 'Ratio vehicules en mission / total parc', 'Admin'],
        ['Cout mensuel de carburant', 'Agregation des consommations par vehicule', 'Admin'],
        ['Alertes actives', 'Nombre et type d\'echeances imminentes', 'Admin'],
    ],
    col_widths_cm=[5, 7.5, 4],
    caption='KPIs du tableau de bord analytique'
)

H2(doc, '10.2 Perspectives d\'evolution – Machine Learning et IA avancee')
NP_MIXED(doc, [
    ('Important : ', True, False),
    ('Les fonctionnalites suivantes constituent des perspectives futures non encore implementees dans le cadre de ce stage.', False, True),
])
doc.add_paragraph()
bullet(doc, "Prediction de la demande de salles : modele de series temporelles (ARIMA, Prophet) pour anticiper les pics de reservations et optimiser les configurations.")
bullet(doc, "Optimisation du parc automobile : algorithme de routage et d\'affectation optimale (VRP – Vehicle Routing Problem) pour minimiser les couts de deplacement.")
bullet(doc, "Analyse predictive de maintenance : modele ML base sur l'historique des pannes pour predire les besoins de maintenance avant occurrence.")
bullet(doc, "Business Intelligence avancee : integration Power BI / Grafana pour des rapports executifs automatises.")
bullet(doc, "Reconnaissance vocale : commandes vocales pour la reservation de salle (chatbot Teams/Slack).")
bullet(doc, "Application mobile React Native : acces depuis smartphone pour les demandes de mission terrain.")

add_conclu_box(doc, "La plateforme integre des fonctionnalites d'intelligence artificielle concretes (scoring multi-criteres, detection de conflits, tableaux de bord analytiques) qui apportent une valeur ajoutee immediate par rapport aux processus manuels anterieurs. Les perspectives d'evolution vers le Machine Learning et la Business Intelligence avancee constituent un feuille de route prometteuse pour les prochaines versions.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# CONCLUSION GENERALE
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Conclusion Generale', page_break_before=True)
NP(doc, "Ce rapport de stage de fin d'annee en 4eme annee Ingenieur en Intelligence Artificielle & Data a l'EMSI Casablanca a presente la conception et le developpement d'une plateforme intelligente de gestion des ressources et moyens partages pour l'ONEE Branch Electricite.")
doc.add_paragraph()
NP_MIXED(doc, [('Bilan du projet. ', True, False)])
NP(doc, "Les objectifs fixes ont ete atteints : les deux modules fonctionnels (Reservation des Salles et Gestion du Parc Automobile) ont ete concus, developpes, testes et deployes. La solution repose sur une architecture 3-Tiers moderne (Python/FastAPI, React.js, SQL Server) et repond a l'ensemble des besoins fonctionnels identifies lors de l'analyse avec la DSI de l'ONEE.")
doc.add_paragraph()
NP_MIXED(doc, [('Competences techniques acquises. ', True, False)])
NP(doc, "Ce stage a permis de renforcer et d'approfondir de nombreuses competences techniques : maitrise de FastAPI pour les APIs REST performantes, approfondissement de React.js pour les interfaces modernes, utilisation avancee de SQLAlchemy ORM, integration de fonctionnalites d'IA dans un contexte applicatif reel, et mise en pratique des bonnes pratiques DevOps.")
doc.add_paragraph()
NP_MIXED(doc, [('Competences professionnelles acquises. ', True, False)])
NP(doc, "Sur le plan professionnel, ce stage a developpe la capacite a travailler en autonomie avec des livrables definis, a communiquer efficacement avec les parties prenantes, a rediger de la documentation technique et a s'adapter aux contraintes d'un environnement industriel exigeant.")
doc.add_paragraph()
NP_MIXED(doc, [('Difficultes rencontrees et solutions apportees. ', True, False)])
NP(doc, "Les principales difficultes ont porte sur la gestion des cas limites de conflits de reservation concurrents (resolus par des verrous transactionnels), la configuration de l'environnement SQL Server sous Windows, et l'integration des regles metier complexes du module vehicules. Ces defis ont ete surmontes grace aux competences acquises en formation et au soutien de l'equipe DSI.")
doc.add_paragraph()
NP_MIXED(doc, [('Limites et perspectives. ', True, False)])
NP(doc, "La version actuelle constitue une base solide et deployable, mais plusieurs evolutions sont envisagees : application mobile, integration Microsoft 365, modeles ML predictifs, et tableaux de bord Power BI. Ce stage a ete une opportunite exceptionnelle de mettre en pratique les quatre annees de formation en ingenierie informatique et en Intelligence Artificielle & Data dans un contexte professionnel reel.")
add_page_break(doc)

# ═════════════════════════════════════════════════════════════════
# BIBLIOGRAPHIE / WEBOGRAPHIE
# ═════════════════════════════════════════════════════════════════
H1(doc, 'Bibliographie et Webographie', page_break_before=True)
H2(doc, 'References bibliographiques')
refs = [
    "[1] Tiangolo, S. – FastAPI Documentation (version 0.111). Disponible en ligne : https://fastapi.tiangolo.com, 2024.",
    "[2] Facebook Inc. / Meta – React.js Documentation (v18). Disponible en ligne : https://react.dev, 2024.",
    "[3] SQLAlchemy Team – SQLAlchemy 2.0 Documentation. Disponible en ligne : https://docs.sqlalchemy.org/en/20, 2024.",
    "[4] Microsoft – SQL Server 2019 Documentation. Disponible en ligne : https://learn.microsoft.com/sql/sql-server, 2024.",
    "[5] Fowler, M. – Patterns of Enterprise Application Architecture. Addison-Wesley, 2002. ISBN: 978-0-321-12521-7.",
    "[6] Richardson, L., Ruby, S. – RESTful Web Services. O'Reilly Media, 2007. ISBN: 978-0-596-52926-0.",
    "[7] Google Inc. – Material Design 3 Guidelines. Disponible en ligne : https://m3.material.io, 2024.",
]
for r in refs:
    p = doc.add_paragraph(r)
    p.paragraph_format.left_indent = Cm(0.5)
    p.paragraph_format.space_after = Pt(4)
    for run in p.runs:
        run.font.size = Pt(10.5)
        run.font.name = 'Times New Roman'

H2(doc, 'Webographie')
webs = [
    "[8] ONEE – Site officiel. Disponible en ligne : www.one.org.ma (consulte en aout 2026).",
    "[9] EMSI Casablanca – Site institutionnel. Disponible en ligne : www.emsi.ma.",
    "[10] Python.org – Documentation Python 3.11. Disponible en ligne : https://docs.python.org/3.11.",
    "[11] Vite.js – Documentation officielle. Disponible en ligne : https://vitejs.dev.",
    "[12] JWT.io – Introduction aux JSON Web Tokens. Disponible en ligne : https://jwt.io/introduction.",
    "[13] Locust.io – Documentation tests de performance. Disponible en ligne : https://docs.locust.io.",
]
for w in webs:
    p = doc.add_paragraph(w)
    p.paragraph_format.left_indent = Cm(0.5)
    p.paragraph_format.space_after = Pt(4)
    for run in p.runs:
        run.font.size = Pt(10.5)
        run.font.name = 'Times New Roman'

# ═════════════════════════════════════════════════════════════════
# SAUVEGARDE
# ═════════════════════════════════════════════════════════════════
doc.save(OUT)
print(f"Document Word genere : {OUT}")
fsize = os.path.getsize(OUT)
print(f"Taille : {round(fsize/1024, 0)} Ko")
