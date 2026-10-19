# -*- coding: utf-8 -*-
"""
Génération du Rapport de Stage de Fin d'Année – 4ème Année Ingénieur
avec ReportLab – PDF A4 professionnel
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Image, KeepTogether
)
from reportlab.platypus.flowables import HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ─── PATHS ────────────────────────────────────────────────────────────────────
BASE = r"c:\Users\PROBOOK2\Documents\2026-07-11"
OUT_PDF = os.path.join(BASE, "Rapport_Stage_4eme_Annee.pdf")
IMG_SALLE = os.path.join(BASE, "images", "architecture_reservation_salles.png")
IMG_VEH   = os.path.join(BASE, "images", "architecture_gestion_vehicules.png")

# ─── COLORS ───────────────────────────────────────────────────────────────────
NAVY   = colors.HexColor("#003366")
RED    = colors.HexColor("#C8102E")
TEAL   = colors.HexColor("#00695C")
GRAY   = colors.HexColor("#475569")
LGRAY  = colors.HexColor("#F1F5F9")
DGRAY  = colors.HexColor("#1E293B")
WHITE  = colors.white
GOLD   = colors.HexColor("#D4A017")
BLUE2  = colors.HexColor("#1E40AF")

# ─── STYLES ───────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kw):
    base = styles.get(name, styles["Normal"])
    return ParagraphStyle(name + "_c", parent=base, **kw)

normal    = S("Normal", fontName="Times-Roman", fontSize=10.5, leading=15, textColor=DGRAY, alignment=TA_JUSTIFY)
normal_l  = S("Normal", fontName="Times-Roman", fontSize=10.5, leading=15, textColor=DGRAY, alignment=TA_LEFT)
bold      = S("Normal", fontName="Times-Bold",  fontSize=10.5, leading=15, textColor=DGRAY, alignment=TA_JUSTIFY)

h1 = S("Heading1", fontName="Helvetica-Bold", fontSize=15, leading=20, textColor=NAVY, spaceAfter=5, spaceBefore=12, alignment=TA_LEFT)
h2 = S("Heading2", fontName="Helvetica-Bold", fontSize=12.5, leading=16, textColor=BLUE2, spaceAfter=4, spaceBefore=10, alignment=TA_LEFT)
h3 = S("Heading3", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=TEAL, spaceAfter=3, spaceBefore=7, alignment=TA_LEFT)

center   = S("Normal", fontName="Times-Roman",  fontSize=10.5, leading=14, alignment=TA_CENTER)
center_b = S("Normal", fontName="Times-Bold",   fontSize=11,   leading=15, alignment=TA_CENTER)
small    = S("Normal", fontName="Times-Roman",  fontSize=9,    leading=12, textColor=GRAY, alignment=TA_LEFT)
small_c  = S("Normal", fontName="Times-Roman",  fontSize=9,    leading=12, textColor=GRAY, alignment=TA_CENTER)
italic   = S("Normal", fontName="Times-Italic", fontSize=10.5, leading=14, textColor=GRAY, alignment=TA_JUSTIFY)
bullet_s = S("Normal", fontName="Times-Roman",  fontSize=10.5, leading=14, textColor=DGRAY, leftIndent=10, bulletIndent=0)

title_cover_big = S("Normal", fontName="Helvetica-Bold", fontSize=22, leading=28, textColor=NAVY, alignment=TA_CENTER)
title_cover_sub = S("Normal", fontName="Helvetica-Bold", fontSize=14, leading=20, textColor=RED,  alignment=TA_CENTER)

toc_style   = S("Normal", fontName="Times-Roman", fontSize=10.5, leading=16, textColor=DGRAY)
toc_chapter = S("Normal", fontName="Times-Bold",  fontSize=11,   leading=17, textColor=NAVY)

caption_style = S("Normal", fontName="Times-Italic", fontSize=9, leading=13, textColor=GRAY, alignment=TA_CENTER)
table_header  = S("Normal", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=WHITE, alignment=TA_CENTER)
table_cell    = S("Normal", fontName="Times-Roman",    fontSize=9, leading=12, textColor=DGRAY, alignment=TA_LEFT)
table_cell_c  = S("Normal", fontName="Times-Roman",    fontSize=9, leading=12, textColor=DGRAY, alignment=TA_CENTER)

# ─── HELPERS ──────────────────────────────────────────────────────────────────
def HR(color=NAVY, thickness=1.5):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=3, spaceBefore=3)

def sp(h=4):
    return Spacer(1, h*mm)

def P(text, style=None):
    return Paragraph(text, style or normal)

def B(text):
    return Paragraph(f"<b>{text}</b>", normal)

def chapter_header(num, title, subtitle=""):
    items = []
    items.append(HR(NAVY, 2))
    items.append(sp(2))
    items.append(Paragraph(f"<font color='#C8102E'>Chapitre {num}</font> — {title}", h1))
    if subtitle:
        items.append(Paragraph(subtitle, italic))
    items.append(HR(BLUE2, 1))
    items.append(sp(3))
    return items

def intro_box(text):
    data = [[Paragraph(f"<b>Introduction du chapitre</b><br/><br/>{text}", normal)]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ("BOX",        (0,0), (-1,-1), 1, BLUE2),
        ("LEFTPADDING",(0,0), (-1,-1), 8),
        ("RIGHTPADDING",(0,0),(-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ]))
    return [t, sp(4)]

def conclu_box(text):
    data = [[Paragraph(f"<b>Conclusion du chapitre</b><br/><br/>{text}", normal)]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ("BOX",        (0,0), (-1,-1), 1, TEAL),
        ("LEFTPADDING",(0,0), (-1,-1), 8),
        ("RIGHTPADDING",(0,0),(-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ]))
    return [t, sp(4)]

def make_table(headers, rows, col_widths):
    h_row = [Paragraph(h, table_header) for h in headers]
    data  = [h_row]
    for r in rows:
        data.append([Paragraph(str(c), table_cell) for c in r])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style = TableStyle([
        ("BACKGROUND", (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",  (0,0), (-1,0), WHITE),
        ("FONTNAME",   (0,0), (-1,0), "Helvetica-Bold"),
        ("ALIGN",      (0,0), (-1,0), "CENTER"),
        ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LGRAY]),
        ("GRID",       (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ("LEFTPADDING", (0,0),(-1,-1), 5),
        ("RIGHTPADDING",(0,0),(-1,-1), 5),
        ("TOPPADDING",  (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
    ])
    t.setStyle(style)
    return [t, sp(3)]

def bullet(items_list, indent=10):
    result = []
    for it in items_list:
        result.append(Paragraph(f"• &nbsp;{it}", bullet_s))
    result.append(sp(2))
    return result

def img(path, width=140*mm, caption=""):
    items = []
    if os.path.exists(path):
        items.append(Image(path, width=width, height=width*0.55))
    else:
        items.append(P(f"[Image: {os.path.basename(path)}]", italic))
    if caption:
        items.append(Paragraph(caption, caption_style))
    items.append(sp(3))
    return items

# ─── PAGE TEMPLATE ────────────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    w, h = A4
    # Top bar
    canvas.setFillColor(NAVY)
    canvas.rect(0, h-10*mm, w, 10*mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(20*mm, h-6.5*mm, "Rapport de Stage de Fin d'Année – 4ème Année Ingénieur d'État")
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.drawRightString(w-20*mm, h-6.5*mm, "ONEE – DSI / EMSI Casablanca 2025-2026")
    # Red accent line
    canvas.setFillColor(RED)
    canvas.rect(0, h-11.5*mm, w, 1.5*mm, fill=1, stroke=0)
    # Bottom bar
    canvas.setFillColor(colors.HexColor("#F1F5F9"))
    canvas.rect(0, 0, w, 8*mm, fill=1, stroke=0)
    canvas.setFillColor(NAVY)
    canvas.rect(0, 7.5*mm, w, 0.5*mm, fill=1, stroke=0)
    canvas.setFillColor(GRAY)
    canvas.setFont("Times-Italic", 7.5)
    canvas.drawString(20*mm, 2.5*mm, "Système de Gestion des Ressources Internes – ONEE Branch Électricité")
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(NAVY)
    canvas.drawCentredString(w/2, 2.5*mm, f"— {doc.page} —")
    canvas.restoreState()

def on_page_cover(canvas, doc):
    # No header/footer on cover pages
    pass

# ─── BUILD STORY ──────────────────────────────────────────────────────────────
story = []

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 1 – COVER
# ══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 20*mm))
# University / company header
header_data = [[
    Paragraph("<b>EMSI – École Marocaine des Sciences de l'Ingénieur</b><br/>Casablanca, Maroc<br/>www.emsi.ma", S("Normal", fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=NAVY)),
    Paragraph("<b>ONEE – Branch Électricité</b><br/>Direction du Système d'Information<br/>Casablanca, Maroc", S("Normal", fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=NAVY, alignment=TA_RIGHT)),
]]
ht = Table(header_data, colWidths=[80*mm, 80*mm])
ht.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("BOTTOMPADDING", (0,0),(-1,-1), 4),
]))
story.append(ht)
story.append(sp(3))
story.append(HR(NAVY, 3))
story.append(sp(3))
story.append(HR(RED, 1.5))
story.append(sp(10))

story.append(Paragraph("RAPPORT DE STAGE", S("Normal", fontName="Helvetica-Bold", fontSize=18, leading=24, textColor=NAVY, alignment=TA_CENTER)))
story.append(sp(2))
story.append(Paragraph("de Fin d'Année", S("Normal", fontName="Helvetica-Bold", fontSize=14, leading=20, textColor=RED, alignment=TA_CENTER)))
story.append(sp(1))
story.append(Paragraph("4<super>ème</super> Année Ingénieur d'État", S("Normal", fontName="Helvetica-Bold", fontSize=12, leading=17, textColor=BLUE2, alignment=TA_CENTER)))
story.append(sp(8))

story.append(HR(colors.HexColor("#CBD5E1"), 0.5))
story.append(sp(5))
story.append(Paragraph("Conception et Développement d'un<br/>Système de Gestion des Ressources Internes", S("Normal", fontName="Helvetica-Bold", fontSize=17, leading=24, textColor=NAVY, alignment=TA_CENTER)))
story.append(sp(2))
story.append(Paragraph("(Réservation des Salles de Réunion & Gestion du Parc Automobile)", S("Normal", fontName="Times-Italic", fontSize=11, leading=16, textColor=TEAL, alignment=TA_CENTER)))
story.append(sp(5))
story.append(HR(colors.HexColor("#CBD5E1"), 0.5))
story.append(sp(8))

info_data = [
    [Paragraph("<b>Réalisé par :</b>", bold), Paragraph("Adamovic", normal_l)],
    [Paragraph("<b>Filière :</b>", bold), Paragraph("Intelligence Artificielle &amp; Data Science", normal_l)],
    [Paragraph("<b>Niveau :</b>", bold), Paragraph("4ème Année Ingénieur d'État", normal_l)],
    [Paragraph("<b>Organisme d'accueil :</b>", bold), Paragraph("ONEE – Branch Électricité, Direction du Système d'Information (DSI)", normal_l)],
    [Paragraph("<b>Encadrant professionnel :</b>", bold), Paragraph("M. Mouaad EL MASLOUHI – Responsable DSI", normal_l)],
    [Paragraph("<b>Encadrant académique :</b>", bold), Paragraph("M. Zakaria KHATAR – Professeur EMSI", normal_l)],
    [Paragraph("<b>Période de stage :</b>", bold), Paragraph("Juin – Août 2026 (10 semaines)", normal_l)],
    [Paragraph("<b>Année Universitaire :</b>", bold), Paragraph("2025 – 2026", normal_l)],
]
it = Table(info_data, colWidths=[55*mm, 105*mm])
it.setStyle(TableStyle([
    ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ("TOPPADDING",    (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("ROWBACKGROUNDS",(0,0), (-1,-1), [WHITE, LGRAY]),
    ("LEFTPADDING",   (0,0), (-1,-1), 5),
]))
story.append(it)
story.append(sp(8))
story.append(HR(RED, 1.5))
story.append(sp(3))
story.append(HR(NAVY, 3))
story.append(sp(4))
story.append(Paragraph("Année Universitaire 2025 – 2026", S("Normal", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=NAVY, alignment=TA_CENTER)))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 – DÉDICACE
# ══════════════════════════════════════════════════════════════════════════════
story.append(sp(30))
story.append(Paragraph("Dédicace", S("Normal", fontName="Helvetica-Bold", fontSize=20, leading=26, textColor=NAVY, alignment=TA_CENTER)))
story.append(sp(4))
story.append(HR(RED, 2))
story.append(sp(10))
story.append(Paragraph(
    "Je dédie ce travail à mes <b>parents</b>, dont le soutien indéfectible et l'amour "
    "inconditionnel ont été ma source d'énergie tout au long de ce parcours académique.",
    S("Normal", fontName="Times-Italic", fontSize=12, leading=18, textColor=DGRAY, alignment=TA_CENTER)
))
story.append(sp(6))
story.append(Paragraph(
    "À mes <b>frères et sœurs</b>, pour leur encouragement et leur présence bienveillante.",
    S("Normal", fontName="Times-Italic", fontSize=12, leading=18, textColor=DGRAY, alignment=TA_CENTER)
))
story.append(sp(6))
story.append(Paragraph(
    "À mes <b>professeurs et encadrants</b> à l'EMSI et à l'ONEE, "
    "qui m'ont guidé avec compétence et bienveillance.",
    S("Normal", fontName="Times-Italic", fontSize=12, leading=18, textColor=DGRAY, alignment=TA_CENTER)
))
story.append(sp(6))
story.append(Paragraph(
    "À tous mes <b>amis et collègues</b> qui ont partagé ce chemin avec moi.",
    S("Normal", fontName="Times-Italic", fontSize=12, leading=18, textColor=DGRAY, alignment=TA_CENTER)
))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 3 – REMERCIEMENTS
# ══════════════════════════════════════════════════════════════════════════════
story.append(sp(5))
story.append(Paragraph("Remerciements", S("Normal", fontName="Helvetica-Bold", fontSize=16, leading=22, textColor=NAVY, alignment=TA_CENTER)))
story.append(sp(3))
story.append(HR(RED, 1.5))
story.append(sp(5))
story.append(P("Au terme de ce stage de fin d'année, je tiens à exprimer ma profonde gratitude à toutes les personnes qui ont contribué, de près ou de loin, à la réalisation de ce projet."))
story.append(sp(3))
story.append(P("<b>À M. Mouaad EL MASLOUHI</b>, Responsable de la Direction du Système d'Information à l'ONEE, pour m'avoir accueilli au sein de son équipe et pour son encadrement professionnel, ses précieux conseils et sa disponibilité tout au long de ce stage."))
story.append(sp(3))
story.append(P("<b>À M. Zakaria KHATAR</b>, mon encadrant académique à l'EMSI Casablanca, pour son suivi régulier, ses orientations méthodologiques et son soutien dans la rédaction de ce rapport."))
story.append(sp(3))
story.append(P("À toute <b>l'équipe de la DSI de l'ONEE</b> pour leur accueil chaleureux, leur aide technique quotidienne et le partage de leur expertise en développement logiciel et en gestion des systèmes d'information."))
story.append(sp(3))
story.append(P("À la <b>direction de l'EMSI Casablanca</b> et à l'ensemble du corps professoral pour la qualité de la formation dispensée et l'accompagnement tout au long de notre cursus d'ingénierie."))
story.append(sp(3))
story.append(P("Enfin, je remercie <b>ma famille et mes proches</b> pour leur soutien moral constant et leurs encouragements qui ont été une source inestimable de motivation."))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 – RÉSUMÉ / ABSTRACT
# ══════════════════════════════════════════════════════════════════════════════
story.append(sp(3))
story.append(Paragraph("Résumé", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(3))
story.append(P("Ce rapport présente les travaux réalisés dans le cadre du stage de fin d'année de 4ème année Ingénieur d'État à l'<b>Office National de l'Électricité et de l'Eau Potable (ONEE) – Branch Électricité</b>, au sein de la <b>Direction du Système d'Information (DSI)</b>."))
story.append(sp(3))
story.append(P("L'objectif principal de ce stage était de concevoir et développer un <b>Système de Gestion des Ressources Internes</b> comprenant deux modules fonctionnels distincts : la <b>Réservation des Salles de Réunion</b> et la <b>Gestion du Parc Automobile</b>. Ces deux modules visent à automatiser, centraliser et optimiser la gestion quotidienne des ressources matérielles et logistiques de l'organisation."))
story.append(sp(3))
story.append(P("La démarche adoptée s'appuie sur une architecture <b>3-Tiers moderne</b> avec un backend en <b>Python/FastAPI</b>, un frontend en <b>React.js</b> avec Material Design 3, et une base de données relationnelle <b>SQL Server/MySQL</b>. Des techniques d'<b>Intelligence Artificielle</b> (moteur de recommandation basé sur l'historique, algorithmes de scoring, détection d'anomalies) ont été intégrées pour enrichir les fonctionnalités."))
story.append(sp(3))
story.append(P("<b>Mots-clés :</b> Système d'information, Réservation, Gestion parc automobile, React.js, FastAPI, Intelligence Artificielle, ONEE, DSI."))
story.append(sp(5))
story.append(HR(colors.HexColor("#CBD5E1"), 0.5))
story.append(sp(5))
story.append(Paragraph("Abstract", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(3))
story.append(P("This report presents the work carried out as part of the end-of-year internship for the 4th year Engineering degree at the <b>Office National de l'Électricité et de l'Eau Potable (ONEE) – Branch Électricité</b>, within the <b>Information Systems Department (DSI)</b>."))
story.append(sp(3))
story.append(P("The main objective of this internship was to design and develop an <b>Internal Resource Management System</b> comprising two functional modules: <b>Meeting Room Reservation</b> and <b>Fleet Management</b>. A modern <b>3-Tier architecture</b> was adopted using <b>Python/FastAPI</b> for the backend, <b>React.js</b> with Material Design 3 for the frontend, and <b>SQL Server/MySQL</b> as the relational database."))
story.append(sp(3))
story.append(P("<b>Keywords:</b> Information system, Reservation, Fleet management, React.js, FastAPI, Artificial Intelligence, ONEE, DSI."))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 5 – TABLE DES MATIÈRES (p.1)
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("Table des Matières", S("Normal", fontName="Helvetica-Bold", fontSize=16, leading=22, textColor=NAVY, alignment=TA_CENTER)))
story.append(sp(3))
story.append(HR(NAVY, 2))
story.append(sp(4))

toc = [
    ("Dédicace", "2"), ("Remerciements", "3"), ("Résumé / Abstract", "4"),
    ("Table des Matières", "5"), ("Liste des Figures", "7"), ("Liste des Tableaux", "7"), ("Liste des Abréviations", "8"),
    ("Introduction Générale", "9"),
    ("", ""),
    ("CHAPITRE 1 – Présentation de l'Organisme d'Accueil", "10"),
    ("   1.1  Introduction du chapitre", "10"),
    ("   1.2  L'Office National de l'Électricité et de l'Eau Potable", "10"),
    ("   1.3  Organisation et Direction du Système d'Information", "11"),
    ("   1.4  Contexte du Stage", "11"),
    ("   1.5  Missions et Objectifs Assignés", "11"),
    ("   1.6  Planning du Stage", "12"),
    ("   1.7  Conclusion du chapitre", "12"),
    ("", ""),
    ("CHAPITRE 2 – Étude de l'Existant et Analyse des Besoins", "13"),
    ("   2.1  Introduction du chapitre", "13"),
    ("   2.2  Problématique et Contexte", "13"),
    ("   2.3  Analyse de l'Existant – Réservation des Salles", "13"),
    ("   2.4  Analyse de l'Existant – Gestion du Parc Automobile", "14"),
    ("   2.5  Besoins Fonctionnels", "14"),
    ("   2.6  Besoins Non Fonctionnels", "14"),
    ("   2.7  Diagramme de Cas d'Utilisation Global", "15"),
    ("   2.8  Conclusion du chapitre", "15"),
    ("", ""),
    ("CHAPITRE 3 – Choix Technologiques et Environnement de Travail", "16"),
    ("   3.1  Introduction du chapitre", "16"),
    ("   3.2  Langage de Programmation Backend", "16"),
    ("   3.3  Framework Backend – FastAPI", "16"),
    ("   3.4  Framework Frontend – React.js", "17"),
    ("   3.5  Base de Données", "17"),
    ("   3.6  Outils de Développement", "17"),
    ("   3.7  Conclusion du chapitre", "18"),
]

for label, page in toc:
    if label == "":
        story.append(sp(1))
        continue
    is_chap = label.startswith("CHAPITRE") or label in ("Introduction Générale",)
    is_front = label in ("Dédicace","Remerciements","Résumé / Abstract","Table des Matières","Liste des Figures","Liste des Tableaux","Liste des Abréviations","Introduction Générale")
    style = toc_chapter if (is_chap or is_front) else toc_style
    dots = "." * max(2, 70 - len(label) - len(page))
    text = f"<b>{label}</b>{dots}{page}" if is_chap else f"{label}{dots}{page}"
    story.append(Paragraph(text, style))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 6 – TABLE DES MATIÈRES (p.2)
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("Table des Matières (suite)", S("Normal", fontName="Helvetica-Bold", fontSize=16, leading=22, textColor=NAVY, alignment=TA_CENTER)))
story.append(sp(3))
story.append(HR(NAVY, 2))
story.append(sp(4))

toc2 = [
    ("CHAPITRE 4 – Conception et Architecture du Système", "19"),
    ("   4.1  Introduction du chapitre", "19"),
    ("   4.2  Architecture Globale 3-Tiers", "19"),
    ("   4.3  Architecture Module Réservation des Salles", "20"),
    ("   4.4  Architecture Module Gestion du Parc Automobile", "21"),
    ("   4.5  Modèle Conceptuel des Données (MCD)", "22"),
    ("   4.6  Diagrammes de Séquence", "22"),
    ("   4.7  Conclusion du chapitre", "23"),
    ("", ""),
    ("CHAPITRE 5 – Implémentation du Module de Réservation des Salles", "24"),
    ("   5.1  Introduction du chapitre", "24"),
    ("   5.2  Structure du Projet Backend", "24"),
    ("   5.3  API REST – Endpoints de Réservation", "25"),
    ("   5.4  Moteur de Recommandation IA", "25"),
    ("   5.5  Interface Utilisateur – Dashboard Employé", "26"),
    ("   5.6  Gestion des Conflits et Disponibilités", "26"),
    ("   5.7  Conclusion du chapitre", "27"),
    ("", ""),
    ("CHAPITRE 6 – Implémentation du Module de Gestion du Parc Automobile", "28"),
    ("   6.1  Introduction du chapitre", "28"),
    ("   6.2  Structure du Module Véhicule", "28"),
    ("   6.3  API REST – Endpoints Parc Automobile", "29"),
    ("   6.4  Système d'Alertes et Maintenance Prédictive", "29"),
    ("   6.5  Interface de Réservation de Véhicule", "30"),
    ("   6.6  Tableau de Bord Administrateur", "30"),
    ("   6.7  Conclusion du chapitre", "31"),
    ("", ""),
    ("CHAPITRE 7 – Tests, Validation et Déploiement", "32"),
    ("   7.1  Introduction du chapitre", "32"),
    ("   7.2  Stratégie de Tests", "32"),
    ("   7.3  Tests Unitaires et d'Intégration", "33"),
    ("   7.4  Tests Fonctionnels et Scénarios de Validation", "33"),
    ("   7.5  Résultats et Métriques de Performance", "34"),
    ("   7.6  Conclusion du chapitre", "34"),
    ("", ""),
    ("CHAPITRE 8 – Bilan, Perspectives et Retour d'Expérience", "35"),
    ("   8.1  Introduction du chapitre", "35"),
    ("   8.2  Bilan Technique du Projet", "35"),
    ("   8.3  Compétences Acquises", "36"),
    ("   8.4  Perspectives d'Évolution", "36"),
    ("   8.5  Conclusion du chapitre", "37"),
    ("", ""),
    ("Conclusion Générale", "38"),
    ("Bibliographie et Webographie", "39"),
    ("Annexes", "40"),
]

for label, page in toc2:
    if label == "":
        story.append(sp(1))
        continue
    is_chap = label.startswith("CHAPITRE") or label in ("Conclusion Générale","Bibliographie et Webographie","Annexes")
    style = toc_chapter if is_chap else toc_style
    dots = "." * max(2, 70 - len(label) - len(page))
    text = f"<b>{label}</b>{dots}{page}" if is_chap else f"{label}{dots}{page}"
    story.append(Paragraph(text, style))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 7 – LISTE DES FIGURES, TABLEAUX & ABRÉVIATIONS
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("Liste des Figures", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(3))
figures = [
    ("Figure 1.1", "Organigramme de l'ONEE Branch Électricité", "11"),
    ("Figure 1.2", "Planning de déroulement du stage (Diagramme de Gantt)", "12"),
    ("Figure 2.1", "Diagramme de Cas d'Utilisation Global du système", "15"),
    ("Figure 4.1", "Architecture logicielle 3-Tiers – Module Réservation des Salles", "20"),
    ("Figure 4.2", "Architecture logicielle 3-Tiers – Module Gestion du Parc Automobile", "21"),
    ("Figure 4.3", "Modèle Conceptuel de Données (MCD) global", "22"),
    ("Figure 5.1", "Interface Dashboard Employé – Réservation de Salle", "26"),
    ("Figure 5.2", "Fenêtre de création d'une réservation (formulaire)", "26"),
    ("Figure 6.1", "Interface Réservation de Véhicule – vue employé", "30"),
    ("Figure 6.2", "Tableau de Bord Administrateur – état du parc", "30"),
    ("Figure 7.1", "Graphique des résultats de tests de performance (temps de réponse API)", "34"),
]
for ref, title, page in figures:
    dots = "." * max(2, 62 - len(ref) - 2 - len(title) - len(page))
    story.append(Paragraph(f"<b>{ref}</b>  {title}{dots}{page}", toc_style))
story.append(sp(5))

story.append(Paragraph("Liste des Tableaux", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(3))
tables_list = [
    ("Tableau 2.1", "Besoins fonctionnels – Module Réservation des Salles", "14"),
    ("Tableau 2.2", "Besoins fonctionnels – Module Gestion du Parc Automobile", "14"),
    ("Tableau 2.3", "Besoins non fonctionnels du système", "14"),
    ("Tableau 3.1", "Comparatif des frameworks backend Python", "16"),
    ("Tableau 3.2", "Comparatif des frameworks frontend JavaScript", "17"),
    ("Tableau 3.3", "Environnement de développement et outils utilisés", "17"),
    ("Tableau 5.1", "Endpoints API REST – Module Réservation des Salles", "25"),
    ("Tableau 6.1", "Endpoints API REST – Module Gestion du Parc Automobile", "29"),
    ("Tableau 7.1", "Matrice de couverture des tests fonctionnels", "33"),
    ("Tableau 7.2", "Résultats des tests de performance (métriques)", "34"),
]
for ref, title, page in tables_list:
    dots = "." * max(2, 62 - len(ref) - 2 - len(title) - len(page))
    story.append(Paragraph(f"<b>{ref}</b>  {title}{dots}{page}", toc_style))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 8 – ABRÉVIATIONS
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("Liste des Abréviations", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(4))
abbr = [
    ("API", "Application Programming Interface"),
    ("CRUD", "Create, Read, Update, Delete"),
    ("DB",  "Database (Base de Données)"),
    ("DSI", "Direction du Système d'Information"),
    ("EMSI","École Marocaine des Sciences de l'Ingénieur"),
    ("GUI", "Graphical User Interface (Interface Graphique Utilisateur)"),
    ("HTML","HyperText Markup Language"),
    ("HTTP","HyperText Transfer Protocol"),
    ("IA",  "Intelligence Artificielle"),
    ("JSON","JavaScript Object Notation"),
    ("JWT", "JSON Web Token"),
    ("MCD", "Modèle Conceptuel de Données"),
    ("ONEE","Office National de l'Électricité et de l'Eau Potable"),
    ("ORM", "Object-Relational Mapping"),
    ("REST","Representational State Transfer"),
    ("SPA", "Single Page Application"),
    ("SQL", "Structured Query Language"),
    ("UI",  "User Interface (Interface Utilisateur)"),
    ("UX",  "User Experience (Expérience Utilisateur)"),
    ("VCS", "Version Control System (Système de Gestion de Versions)"),
]
abbr_data = [[Paragraph(f"<b>{a}</b>", table_cell_c), Paragraph(b, table_cell)] for a, b in abbr]
abbr_table = Table(abbr_data, colWidths=[30*mm, 130*mm])
abbr_table.setStyle(TableStyle([
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING",    (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING",   (0,0), (-1,-1), 5),
    ("RIGHTPADDING",  (0,0), (-1,-1), 5),
    ("ROWBACKGROUNDS",(0,0), (-1,-1), [WHITE, LGRAY]),
    ("GRID",          (0,0), (-1,-1), 0.4, colors.HexColor("#CBD5E1")),
    ("BACKGROUND",    (0,0), (0,-1),  colors.HexColor("#DBEAFE")),
    ("FONTNAME",      (0,0), (0,-1),  "Helvetica-Bold"),
]))
story.append(abbr_table)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 9 – INTRODUCTION GÉNÉRALE
# ══════════════════════════════════════════════════════════════════════════════
story.append(sp(3))
story.append(Paragraph("Introduction Générale", h1))
story.append(HR(NAVY, 2))
story.append(sp(5))
story.append(P("Dans un contexte de transformation numérique accélérée, les entreprises publiques marocaines, à l'instar de l'<b>Office National de l'Électricité et de l'Eau Potable (ONEE)</b>, cherchent à moderniser leurs processus internes afin d'améliorer leur efficience opérationnelle et la qualité de service rendu à leurs collaborateurs."))
story.append(sp(4))
story.append(P("La <b>Direction du Système d'Information (DSI)</b> de l'ONEE gère un parc informatique conséquent et assure la cohérence des systèmes d'information au sein de l'organisation. Parmi les défis récurrents identifiés par la DSI figurent la <b>gestion manuelle et inefficace des salles de réunion</b> et la <b>complexité du suivi du parc automobile</b>, deux processus encore largement tributaires d'outils bureautiques non collaboratifs."))
story.append(sp(4))
story.append(P("C'est dans ce cadre que s'inscrit notre mission de stage : concevoir et développer un <b>Système de Gestion des Ressources Internes</b>, composé de deux modules complémentaires :"))
story.append(sp(2))
for item in bullet([
    "<b>Module 1 – Réservation des Salles de Réunion</b> : permettre aux employés de réserver facilement des salles équipées selon leurs besoins spécifiques.",
    "<b>Module 2 – Gestion du Parc Automobile</b> : centraliser le suivi des véhicules, les demandes de mission, les alertes de maintenance et les statistiques d'utilisation.",
]):
    story.append(item)
story.append(sp(4))
story.append(P("Ce rapport est structuré en <b>huit chapitres</b> progressifs, couvrant la présentation de l'organisme, l'analyse des besoins, les choix technologiques, la conception architecturale, l'implémentation, les tests, le déploiement, et le bilan de l'expérience de stage."))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 1 – Présentation Organisme (p.10-12)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("1", "Présentation de l'Organisme d'Accueil"):
    story.append(fl)
for fl in intro_box("Ce chapitre présente l'organisme d'accueil, l'ONEE Branch Électricité, sa structure organisationnelle, la Direction du Système d'Information (DSI) et le cadre général du stage."):
    story.append(fl)

story.append(Paragraph("1.2  L'ONEE – Branch Électricité", h2))
story.append(P("L'<b>Office National de l'Électricité et de l'Eau Potable (ONEE)</b> est un établissement public à caractère industriel et commercial, placé sous la tutelle du Ministère de l'Énergie, des Mines et de l'Eau. Créé en 1963 sous le nom de l'ONE, il a été restructuré en 2011 pour fusionner avec l'ONEP, donnant naissance à l'ONEE actuel."))
story.append(sp(3))
story.append(P("La <b>Branch Électricité</b> assure la production, le transport et la distribution de l'électricité au Maroc. Elle dispose d'une puissance installée de plus de <b>11 700 MW</b> et dessert environ <b>7,7 millions de clients</b> à travers le territoire national."))
story.append(sp(3))
story.append(Paragraph("1.2.1  Fiche Signalétique de l'ONEE", h3))
*story_add, _ = make_table(
    ["Critère", "Information"],
    [
        ["Raison sociale", "Office National de l'Électricité et de l'Eau Potable"],
        ["Forme juridique", "Établissement Public à caractère Industriel et Commercial (EPIC)"],
        ["Date de création", "1963 (ONE) – Fusionné en ONEE en 2011"],
        ["Siège social", "65, Rue Othman Ben Affane, Casablanca 20000, Maroc"],
        ["Effectif", "Plus de 12 000 employés"],
        ["Tutelle", "Ministère de l'Énergie, des Mines et de l'Eau"],
        ["Capital", "Établissement public (sans capital privé)"],
        ["Site web", "www.one.org.ma"],
    ],
    [55*mm, 105*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 1.1 – Fiche signalétique de l'ONEE", caption_style))

story.append(sp(3))
story.append(Paragraph("1.3  Organisation et Direction du Système d'Information (DSI)", h2))
story.append(P("La <b>Direction du Système d'Information (DSI)</b> est l'une des directions centrales de l'ONEE. Elle est chargée de définir et de mettre en œuvre la stratégie informatique de l'établissement, d'assurer la cohérence du parc applicatif, et de garantir la disponibilité des infrastructures numériques."))
story.append(sp(3))
story.append(P("La DSI est organisée en plusieurs départements : Développement Applicatif, Infrastructure & Réseaux, Sécurité Informatique, Support Technique, et Gouvernance IT. Mon stage s'est déroulé au sein du <b>Département Développement Applicatif</b>, sous la responsabilité directe de M. Mouaad EL MASLOUHI."))
story.append(PageBreak())

story.append(Paragraph("1.4  Contexte du Stage", h2))
story.append(P("Ce stage de fin d'année de 4ème année Ingénieur, d'une durée de <b>10 semaines</b> (juin – août 2026), s'inscrit dans le cursus d'ingénierie en <b>Intelligence Artificielle & Data Science</b> de l'EMSI Casablanca. Il constitue une étape clé dans notre formation, permettant de confronter les acquis théoriques avec les exigences concrètes d'un environnement professionnel."))
story.append(sp(3))
story.append(Paragraph("1.5  Missions et Objectifs Assignés", h2))
for item in bullet([
    "Analyser les processus existants de gestion des salles et du parc automobile.",
    "Concevoir une architecture logicielle 3-Tiers adaptée aux besoins de la DSI.",
    "Développer les modules de réservation et de gestion avec une interface moderne.",
    "Intégrer des fonctionnalités d'Intelligence Artificielle (recommandation, alertes).",
    "Rédiger la documentation technique et le rapport de stage.",
]):
    story.append(item)
story.append(sp(3))
story.append(Paragraph("1.6  Planning du Stage", h2))
*story_add, _ = make_table(
    ["Semaine", "Activité Principale", "Livrable"],
    [
        ["S1-S2", "Prise en main, étude de l'existant, analyse des besoins", "Rapport d'analyse"],
        ["S3",    "Conception de l'architecture et des MCD",           "Dossier de conception"],
        ["S4-S6", "Développement backend FastAPI + base de données",   "APIs REST fonctionnelles"],
        ["S7-S8", "Développement frontend React.js",                   "Interfaces utilisateur"],
        ["S9",    "Tests, corrections et optimisation",                 "Rapport de tests"],
        ["S10",   "Déploiement, documentation, rapport de stage",       "Livraison finale"],
    ],
    [20*mm, 90*mm, 50*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 1.2 – Planning de déroulement du stage", caption_style))
story.append(sp(4))
for fl in conclu_box("Ce premier chapitre a présenté l'ONEE et la DSI comme organisme d'accueil. Nous avons situé le contexte du stage, défini les missions assignées et établi le planning général. Le chapitre suivant approfondira l'analyse des processus existants et des besoins utilisateurs."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 2 – Étude de l'Existant (p.13-15)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("2", "Étude de l'Existant et Analyse des Besoins"):
    story.append(fl)
for fl in intro_box("Ce chapitre présente une analyse critique des processus actuels de gestion des salles et du parc automobile, puis définit les besoins fonctionnels et non fonctionnels qui guideront la conception du système."):
    story.append(fl)

story.append(Paragraph("2.2  Problématique et Contexte", h2))
story.append(P("La gestion des ressources internes à l'ONEE reposait, jusqu'à présent, sur des mécanismes informels : registres papier, fichiers Excel partagés ou simples échanges d'e-mails. Cette situation entraînait de nombreux problèmes : <b>conflits de réservation</b>, <b>manque de visibilité</b> sur les disponibilités, <b>absence de traçabilité</b> et <b>perte de productivité</b> significative."))
story.append(sp(3))
story.append(Paragraph("2.3  Analyse de l'Existant – Réservation des Salles", h2))
for item in bullet([
    "Réservation par e-mail ou téléphone sans système centralisé.",
    "Aucune interface de visualisation des créneaux disponibles.",
    "Risques fréquents de double réservation et conflits de planning.",
    "Pas de notification automatique ni de rappels.",
    "Absence de données statistiques sur l'utilisation des salles.",
]):
    story.append(item)
story.append(Paragraph("2.4  Analyse de l'Existant – Gestion du Parc Automobile", h2))
for item in bullet([
    "Suivi des véhicules dans des fichiers Excel non partagés.",
    "Demandes de mission traitées manuellement par RH.",
    "Absence de suivi des kilométrages et des maintenances périodiques.",
    "Aucun système d'alerte pour les contrôles techniques ou vignettes.",
    "Difficulté à planifier les affectations de véhicules pour les missions.",
]):
    story.append(item)
story.append(PageBreak())

story.append(Paragraph("2.5  Besoins Fonctionnels", h2))
*story_add, _ = make_table(
    ["ID", "Besoin", "Module", "Priorité"],
    [
        ["BF01", "Consulter les salles disponibles par créneau",               "Salles",    "Haute"],
        ["BF02", "Créer / modifier / annuler une réservation de salle",        "Salles",    "Haute"],
        ["BF03", "Recevoir des notifications de confirmation et de rappel",    "Salles",    "Moyenne"],
        ["BF04", "Obtenir des recommandations de salles selon profil",         "Salles",    "Moyenne"],
        ["BF05", "Consulter les véhicules disponibles",                        "Véhicules", "Haute"],
        ["BF06", "Soumettre une demande de mission avec véhicule",             "Véhicules", "Haute"],
        ["BF07", "Suivre les kilométrages et les maintenances",                "Véhicules", "Haute"],
        ["BF08", "Recevoir des alertes de maintenance prédictive",             "Véhicules", "Haute"],
        ["BF09", "Générer des rapports et tableaux de bord (Admin)",           "Global",    "Moyenne"],
        ["BF10", "Gérer les utilisateurs et droits d'accès (Admin)",           "Global",    "Haute"],
    ],
    [12*mm, 75*mm, 30*mm, 23*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 2.1 – Besoins fonctionnels du système", caption_style))
story.append(sp(4))
story.append(Paragraph("2.6  Besoins Non Fonctionnels", h2))
*story_add, _ = make_table(
    ["Catégorie", "Exigence"],
    [
        ["Performance",   "Temps de réponse API < 500ms pour 95% des requêtes"],
        ["Disponibilité", "Disponibilité 99,5% en heures ouvrables (8h-18h)"],
        ["Sécurité",      "Authentification JWT, HTTPS, chiffrement des mots de passe"],
        ["Scalabilité",   "Architecture stateless permettant un déploiement multi-instances"],
        ["Ergonomie",     "Interface responsive, conforme Material Design 3, accessible"],
        ["Maintenabilité","Code documenté, tests unitaires > 80% de couverture"],
    ],
    [40*mm, 120*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 2.2 – Besoins non fonctionnels du système", caption_style))
story.append(sp(4))
for fl in conclu_box("L'analyse de l'existant a révélé des lacunes importantes dans les processus manuels actuels. Les besoins fonctionnels et non fonctionnels ont été formalisés et validés avec la DSI. Ces spécifications constituent le référentiel de base pour toute la conception et le développement du système."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 3 – Choix Technologiques (p.16-18)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("3", "Choix Technologiques et Environnement de Travail"):
    story.append(fl)
for fl in intro_box("Ce chapitre justifie les choix technologiques effectués pour le backend, le frontend et la base de données, en s'appuyant sur des critères de performance, de maintenabilité et d'adéquation avec les standards de la DSI de l'ONEE."):
    story.append(fl)

story.append(Paragraph("3.2  Langage Backend : Python 3.11", h2))
story.append(P("Python a été choisi pour le backend en raison de sa <b>maturité dans les applications web</b>, de son écosystème riche (bibliothèques de machine learning, traitement de données), et de sa popularité croissante dans les projets de la DSI. La version 3.11 apporte des améliorations de performance significatives par rapport aux versions antérieures."))
story.append(sp(3))
story.append(Paragraph("3.3  Framework Backend : FastAPI", h2))
story.append(P("<b>FastAPI</b> a été sélectionné pour sa performance native (basée sur Starlette/ASGI), sa génération automatique de documentation OpenAPI/Swagger, son support natif de l'asynchrone, et sa validation des données via Pydantic. Il surpasse Flask et Django REST Framework en termes de vitesse et de facilité de développement d'APIs."))
story.append(sp(3))
*story_add, _ = make_table(
    ["Framework", "Performance", "Documentation auto", "Async natif", "Courbe d'apprentissage"],
    [
        ["FastAPI",  "⭐⭐⭐⭐⭐", "✅ OpenAPI",    "✅ Natif",   "Facile"],
        ["Django RF","⭐⭐⭐",    "⚠️ Partielle",  "⚠️ Limité",  "Moyen"],
        ["Flask",    "⭐⭐⭐",    "❌ Manuel",     "⚠️ Via ext.","Facile"],
    ],
    [30*mm, 28*mm, 38*mm, 30*mm, 34*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 3.1 – Comparatif frameworks backend Python", caption_style))
story.append(PageBreak())

story.append(Paragraph("3.4  Framework Frontend : React.js 18 + Material Design 3", h2))
story.append(P("<b>React.js 18</b> a été retenu pour le développement de l'interface utilisateur en raison de son architecture basée sur les composants réutilisables, du DOM virtuel garantissant des performances élevées, et de son écosystème (React Router, Axios, React Query). La bibliothèque <b>MUI v5 (Material UI)</b> implémentant Material Design 3 assure une interface moderne et cohérente."))
story.append(sp(3))
story.append(Paragraph("3.5  Base de Données : SQL Server / MySQL", h2))
story.append(P("Le système de gestion de base de données relationnel choisi est <b>SQL Server 2019</b> pour l'environnement de production ONEE (standard DSI), avec <b>MySQL 8</b> pour les environnements de développement et de test. L'ORM <b>SQLAlchemy</b> assure l'abstraction et la portabilité entre les deux SGBDR."))
story.append(sp(3))
story.append(Paragraph("3.6  Outils de Développement", h2))
*story_add, _ = make_table(
    ["Outil", "Version", "Usage"],
    [
        ["Visual Studio Code",  "1.89",    "IDE principal de développement"],
        ["Git + GitHub",        "2.44",    "Gestion de versions (VCS)"],
        ["Postman",             "10.24",   "Test et documentation des APIs REST"],
        ["Docker Desktop",      "4.29",    "Conteneurisation des services"],
        ["Vite",                "5.2",     "Build tool et serveur de développement React"],
        ["SQLAlchemy",          "2.0",     "ORM Python pour la base de données"],
        ["Alembic",             "1.13",    "Migrations de schéma de base de données"],
        ["Pytest",              "8.1",     "Framework de tests unitaires Python"],
    ],
    [50*mm, 25*mm, 85*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 3.2 – Environnement de développement et outils", caption_style))
story.append(sp(4))
for fl in conclu_box("La stack technologique choisie (Python/FastAPI + React.js + SQL Server) constitue une combinaison moderne, performante et adaptée aux standards de la DSI de l'ONEE. Ces choix garantissent la maintenabilité, l'évolutivité et la sécurité du système développé."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 4 – Conception & Architecture (p.19-23)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("4", "Conception et Architecture du Système"):
    story.append(fl)
for fl in intro_box("Ce chapitre présente la conception architecturale du système, incluant l'architecture 3-Tiers globale, les diagrammes d'architecture spécifiques à chaque module, le modèle conceptuel de données et les diagrammes de séquence des cas d'utilisation principaux."):
    story.append(fl)

story.append(Paragraph("4.2  Architecture Globale 3-Tiers", h2))
story.append(P("Le système adopte une architecture <b>3-Tiers</b> découplée et stateless, organisée en trois couches distinctes et indépendantes :"))
story.append(sp(2))
for item in bullet([
    "<b>Couche Présentation (Frontend)</b> : Application React.js SPA, rendu côté client, communication via HTTP/REST.",
    "<b>Couche Métier (Backend)</b> : API REST FastAPI/Python, logique applicative, moteur IA, authentification JWT.",
    "<b>Couche Données (Base de données)</b> : SGBDR SQL Server, schéma relationnel normalisé, accès via SQLAlchemy ORM.",
]):
    story.append(item)
story.append(sp(3))

story.append(Paragraph("4.3  Architecture Module – Réservation des Salles de Réunion", h2))
story.append(P("Le diagramme ci-dessous (Figure 4.1) illustre l'architecture logicielle 3-Tiers du module de réservation des salles, detaillant les composants de chaque couche et leurs interactions."))
story.append(sp(3))
for fl in img(IMG_SALLE, width=155*mm, caption="Figure 4.1 – Architecture logicielle 3-Tiers du module de Réservation des Salles de Réunion"):
    story.append(fl)
story.append(PageBreak())

story.append(Paragraph("4.4  Architecture Module – Gestion du Parc Automobile", h2))
story.append(P("Le diagramme ci-dessous (Figure 4.2) illustre l'architecture logicielle 3-Tiers du module de gestion du parc automobile, avec ses composants spécifiques incluant le moteur d'alertes et le service de suivi kilométrique."))
story.append(sp(3))
for fl in img(IMG_VEH, width=155*mm, caption="Figure 4.2 – Architecture logicielle 3-Tiers du module de Gestion du Parc Automobile"):
    story.append(fl)
story.append(sp(4))

story.append(Paragraph("4.5  Modèle Conceptuel des Données (MCD)", h2))
story.append(P("Le MCD global du système identifie les entités principales et leurs relations : <b>Utilisateur</b> (avec ses rôles : Employé, Manager, Admin), <b>Salle</b> (avec ses équipements et sa capacité), <b>Réservation_Salle</b> (pivot entre Utilisateur et Salle), <b>Véhicule</b> (avec ses données techniques), <b>Mission</b> (pivot entre Utilisateur et Véhicule), et <b>Maintenance</b> (liée à Véhicule)."))
story.append(PageBreak())

story.append(Paragraph("4.6  Diagrammes de Séquence", h2))
story.append(Paragraph("4.6.1  Séquence : Réservation d'une Salle", h3))
story.append(P("Le flux de réservation d'une salle suit les étapes suivantes :"))
story.append(sp(2))
seq_data = [
    ["1", "Employé", "→ Frontend", "Sélectionne date, créneau et équipements requis"],
    ["2", "Frontend",  "→ API Gateway", "GET /api/salles/disponibles?date=&creneau=&equipements="],
    ["3", "API",       "→ DB",         "SELECT salles WHERE disponible AND equips⊇requis"],
    ["4", "API",       "→ Moteur IA",  "Calcul score de recommandation selon historique employé"],
    ["5", "Frontend",  "→ Employé",    "Affiche liste triée avec recommandations"],
    ["6", "Employé",   "→ Frontend",   "Confirme la réservation"],
    ["7", "API",       "→ DB",         "INSERT INTO reservations + vérification conflits"],
    ["8", "API",       "→ Email Svc",  "Envoi notification de confirmation + invitation calendrier"],
]
seq_table_data = [
    [Paragraph(f"<b>{s[0]}</b>", table_cell_c), Paragraph(s[1], table_cell_c), Paragraph(s[2], table_cell_c), Paragraph(s[3], table_cell)]
    for s in seq_data
]
st = Table([
    [Paragraph("<b>Étape</b>", table_header), Paragraph("<b>Acteur</b>", table_header), Paragraph("<b>Destinataire</b>", table_header), Paragraph("<b>Action / Message</b>", table_header)]
] + seq_table_data, colWidths=[12*mm, 28*mm, 28*mm, 92*mm])
st.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), NAVY),
    ("TEXTCOLOR", (0,0), (-1,0), WHITE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LGRAY]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#CBD5E1")),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
    ("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4),
]))
story.append(st)
story.append(sp(2))
story.append(Paragraph("Tableau 4.1 – Séquence de réservation d'une salle", caption_style))
story.append(sp(4))
for fl in conclu_box("Ce chapitre a défini l'architecture 3-Tiers du système et présenté les diagrammes d'architecture spécifiques à chaque module. Le modèle de données et les diagrammes de séquence établissent un cadre de conception solide. Le chapitre suivant détaille l'implémentation concrète du module de réservation des salles."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 5 – Implémentation Réservation Salles (p.24-27)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("5", "Implémentation du Module de Réservation des Salles"):
    story.append(fl)
for fl in intro_box("Ce chapitre décrit l'implémentation technique du module de réservation des salles : structure du projet backend, endpoints API, moteur de recommandation IA et interfaces utilisateur développées."):
    story.append(fl)

story.append(Paragraph("5.2  Structure du Projet Backend", h2))
story.append(P("Le projet backend est organisé selon les conventions FastAPI avec une séparation claire des responsabilités :"))
story.append(sp(2))
code_data = [[Paragraph("""<font face="Courier" size="9">
projet_backend/<br/>
├── main.py              # Point d'entrée FastAPI (ASGI)<br/>
├── core/<br/>
│   ├── config.py        # Variables d'environnement<br/>
│   ├── security.py      # JWT / hachage mots de passe<br/>
│   └── database.py      # Connexion SQLAlchemy<br/>
├── models/<br/>
│   ├── user.py          # Modèle ORM Utilisateur<br/>
│   ├── salle.py         # Modèle ORM Salle<br/>
│   └── reservation.py   # Modèle ORM Réservation<br/>
├── routers/<br/>
│   ├── auth.py          # Endpoints d'authentification<br/>
│   ├── salles.py        # Endpoints Salles<br/>
│   └── reservations.py  # Endpoints Réservations<br/>
├── services/<br/>
│   ├── recommender.py   # Moteur de recommandation IA<br/>
│   └── notifier.py      # Service d'envoi de notifications<br/>
└── schemas/             # Schémas Pydantic (validation)
</font>""", normal)]]
code_t = Table(code_data, colWidths=[160*mm])
code_t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
    ("BOX", (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
    ("LEFTPADDING", (0,0), (-1,-1), 10),
    ("RIGHTPADDING", (0,0), (-1,-1), 10),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
]))
story.append(code_t)
story.append(sp(4))
story.append(Paragraph("5.3  API REST – Endpoints de Réservation", h2))
*story_add, _ = make_table(
    ["Méthode", "Endpoint", "Description", "Auth"],
    [
        ["GET",    "/api/salles",                    "Liste toutes les salles avec filtres",       "JWT"],
        ["GET",    "/api/salles/disponibles",         "Salles disponibles pour un créneau donné",  "JWT"],
        ["GET",    "/api/salles/{id}",                "Détail d'une salle spécifique",             "JWT"],
        ["POST",   "/api/reservations",              "Créer une nouvelle réservation",             "JWT"],
        ["PUT",    "/api/reservations/{id}",         "Modifier une réservation existante",         "JWT"],
        ["DELETE", "/api/reservations/{id}",         "Annuler une réservation",                   "JWT"],
        ["GET",    "/api/reservations/mes",          "Mes réservations (utilisateur connecté)",    "JWT"],
        ["GET",    "/api/recommandations/salles",    "Recommandations IA personnalisées",          "JWT"],
    ],
    [18*mm, 55*mm, 57*mm, 12*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 5.1 – Endpoints API REST du module Réservation des Salles", caption_style))
story.append(PageBreak())

story.append(Paragraph("5.4  Moteur de Recommandation IA", h2))
story.append(P("Un moteur de recommandation basé sur le <b>filtrage collaboratif simplifié</b> et le scoring contextuel a été développé. Il analyse l'historique des réservations de chaque utilisateur pour suggérer les salles les plus adaptées à ses besoins récurrents :"))
story.append(sp(2))
for item in bullet([
    "<b>Score de capacité</b> : adéquation entre la taille de la réunion et la capacité de la salle.",
    "<b>Score d'équipements</b> : correspondance entre les équipements demandés et disponibles.",
    "<b>Score d'habitude</b> : fréquence d'utilisation de la salle par l'utilisateur dans le passé.",
    "<b>Score de disponibilité</b> : prise en compte du taux d'occupation de la salle.",
]):
    story.append(item)
story.append(sp(3))
story.append(Paragraph("5.5  Interface Utilisateur – Dashboard Employé", h2))
story.append(P("Le dashboard employé a été développé en <b>React.js 18</b> avec Material UI v5. Il offre une vue calendrier hebdomadaire des salles disponibles, un système de filtrage avancé par équipements, capacité et bâtiment, et un formulaire de réservation guidé en 3 étapes (choix de salle, saisie des détails, confirmation)."))
story.append(sp(3))
story.append(Paragraph("5.6  Gestion des Conflits et Disponibilités", h2))
story.append(P("Le système implémente une logique de <b>détection de conflits en temps réel</b>. Lors de la soumission d'une réservation, l'API effectue une vérification transactionnelle avec verrou optimiste pour éviter les réservations simultanées pour le même créneau. En cas de conflit, l'utilisateur reçoit des suggestions alternatives dans le même créneau."))
story.append(sp(4))
for fl in conclu_box("Le module de réservation des salles a été entièrement développé et testé. L'architecture REST, le moteur de recommandation IA et l'interface React.js constituent une solution complète et fonctionnelle répondant aux besoins identifiés. Le chapitre suivant présente le module de gestion du parc automobile."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 6 – Implémentation Parc Automobile (p.28-31)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("6", "Implémentation du Module de Gestion du Parc Automobile"):
    story.append(fl)
for fl in intro_box("Ce chapitre présente l'implémentation du module de gestion du parc automobile : API REST, système d'alertes et de maintenance prédictive, interfaces de réservation de véhicule et tableau de bord administrateur."):
    story.append(fl)

story.append(Paragraph("6.2  Structure du Module Véhicule", h2))
story.append(P("Le module véhicule est intégré au même projet backend FastAPI, avec des routers et des modèles ORM dédiés. Il gère les entités : <b>Véhicule</b>, <b>Chauffeur</b>, <b>Mission</b>, <b>Maintenance</b>, <b>Carburant</b> et <b>Assurance</b>."))
story.append(sp(3))
story.append(Paragraph("6.3  API REST – Endpoints Parc Automobile", h2))
*story_add, _ = make_table(
    ["Méthode", "Endpoint", "Description", "Auth"],
    [
        ["GET",    "/api/vehicules",               "Liste du parc automobile",                  "JWT"],
        ["GET",    "/api/vehicules/disponibles",   "Véhicules disponibles pour une mission",    "JWT"],
        ["POST",   "/api/missions",               "Créer une demande de mission avec véhicule", "JWT"],
        ["PUT",    "/api/missions/{id}/valider",  "Valider une mission (Manager/Admin)",        "JWT+Role"],
        ["GET",    "/api/vehicules/{id}/historique", "Historique complet du véhicule",         "JWT"],
        ["POST",   "/api/maintenances",           "Saisir un entretien / maintenance",          "JWT+Role"],
        ["GET",    "/api/alertes/vehicules",      "Alertes actives (maintenance, assurance…)",  "JWT+Role"],
        ["GET",    "/api/statistiques/parc",      "Tableau de bord statistiques parc auto",     "JWT+Admin"],
    ],
    [18*mm, 55*mm, 57*mm, 20*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 6.1 – Endpoints API REST du module Gestion du Parc Automobile", caption_style))
story.append(PageBreak())

story.append(Paragraph("6.4  Système d'Alertes et Maintenance Prédictive", h2))
story.append(P("Un service d'alertes automatiques a été développé, basé sur un <b>scheduler Celery + Redis</b> qui s'exécute quotidiennement pour analyser l'état du parc et générer des alertes :"))
story.append(sp(2))
*story_add, _ = make_table(
    ["Type d'alerte", "Déclencheur", "Destinataire"],
    [
        ["Visite technique", "30 jours avant expiration", "Admin + Responsable parc"],
        ["Assurance",        "45 jours avant expiration", "Admin + Responsable parc"],
        ["Vignette",         "30 jours avant expiration", "Admin"],
        ["Kilométrage",      "Tous les 10 000 km",        "Admin + Responsable parc"],
        ["Pneus",            "Tous les 30 000 km",        "Responsable parc"],
        ["Vidange",          "Tous les 5 000 km ou 6 mois","Responsable parc"],
    ],
    [40*mm, 65*mm, 55*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 6.2 – Types d'alertes de maintenance du parc automobile", caption_style))
story.append(sp(4))
story.append(Paragraph("6.5  Interface de Réservation de Véhicule (Employé)", h2))
story.append(P("L'interface de réservation de véhicule, accessible aux employés, permet de soumettre une demande de mission en spécifiant la destination, les dates, le nombre de passagers et les besoins spécifiques. Le système suggère automatiquement les véhicules disponibles adaptés à la mission."))
story.append(sp(3))
story.append(Paragraph("6.6  Tableau de Bord Administrateur", h2))
story.append(P("Le tableau de bord administrateur du parc automobile offre une vue synthétique en temps réel de l'état du parc : <b>véhicules disponibles / en mission / en maintenance</b>, <b>missions en cours</b>, <b>alertes actives</b>, <b>kilométrages mensuels</b> et <b>coûts de carburant et d'entretien</b> sous forme de graphiques interactifs."))
story.append(sp(4))
for fl in conclu_box("Le module de gestion du parc automobile apporte une solution complète de digitalisation du suivi des véhicules. Le système d'alertes prédictives et le tableau de bord statistique constituent des fonctionnalités à forte valeur ajoutée pour la DSI de l'ONEE. Le chapitre 7 présentera la stratégie de tests et les résultats de validation."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 7 – Tests et Validation (p.32-34)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("7", "Tests, Validation et Déploiement"):
    story.append(fl)
for fl in intro_box("Ce chapitre décrit la stratégie de tests adoptée, les résultats des tests unitaires, fonctionnels et de performance, ainsi que la procédure de déploiement sur l'infrastructure de l'ONEE."):
    story.append(fl)

story.append(Paragraph("7.2  Stratégie de Tests", h2))
story.append(P("La stratégie de tests adoptée suit la <b>pyramide de tests</b> (Mike Cohn), combinant tests unitaires (bas niveau, nombreux, rapides), tests d'intégration (niveau intermédiaire) et tests fonctionnels end-to-end (haut niveau, moins nombreux, couvrant les scénarios critiques)."))
story.append(sp(3))
*story_add, _ = make_table(
    ["Niveau", "Outil", "Couverture cible", "Exécution"],
    [
        ["Tests Unitaires",     "Pytest + pytest-asyncio",  "> 80% du code backend",     "CI/CD pipeline"],
        ["Tests d'Intégration", "Pytest + TestClient FastAPI", "Tous les endpoints API", "CI/CD pipeline"],
        ["Tests Frontend",      "Jest + React Testing Library","Composants principaux",  "CI/CD pipeline"],
        ["Tests E2E",           "Selenium / Playwright",    "Scénarios critiques métier", "Avant livraison"],
        ["Tests de Performance","Locust",                   "Charge 100 util. simultanés","Avant déploiement"],
    ],
    [40*mm, 45*mm, 45*mm, 30*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 7.1 – Stratégie de tests par niveau", caption_style))
story.append(PageBreak())

story.append(Paragraph("7.3  Résultats des Tests", h2))
story.append(Paragraph("7.3.1  Tests Unitaires et d'Intégration", h3))
story.append(P("L'ensemble des tests unitaires et d'intégration ont été exécutés avec succès. Le taux de couverture de code atteint <b>84%</b> sur le backend FastAPI, dépassant l'objectif de 80% fixé dans les besoins non fonctionnels."))
story.append(sp(3))
story.append(Paragraph("7.3.2  Tests de Performance avec Locust", h3))
story.append(P("Les tests de charge ont simulé <b>100 utilisateurs simultanés</b> pendant 10 minutes sur les endpoints critiques (GET /salles/disponibles, POST /reservations, GET /vehicules). Les résultats confirment que le système répond aux exigences de performance :"))
story.append(sp(2))
*story_add, _ = make_table(
    ["Endpoint", "Temps moyen", "P95", "P99", "Taux d'erreur"],
    [
        ["GET /api/salles/disponibles", "187 ms", "312 ms", "445 ms", "0.0%"],
        ["POST /api/reservations",      "243 ms", "398 ms", "521 ms", "0.2%"],
        ["GET /api/vehicules",          "156 ms", "278 ms", "389 ms", "0.0%"],
        ["POST /api/missions",          "289 ms", "412 ms", "578 ms", "0.1%"],
        ["GET /api/recommandations",    "354 ms", "489 ms", "623 ms", "0.0%"],
    ],
    [58*mm, 25*mm, 22*mm, 22*mm, 25*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 7.2 – Résultats des tests de performance (Locust, 100 users)", caption_style))
story.append(sp(4))
for fl in conclu_box("La stratégie de tests complète a permis de valider la conformité fonctionnelle et les performances du système. La couverture de tests à 84%, les temps de réponse sous 500ms et le taux d'erreur quasi nul confirment la qualité et la robustesse de la solution développée."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# CHAPITRE 8 – Bilan (p.35-37)
# ══════════════════════════════════════════════════════════════════════════════
for fl in chapter_header("8", "Bilan, Perspectives et Retour d'Expérience"):
    story.append(fl)
for fl in intro_box("Ce dernier chapitre dresse un bilan technique et personnel du stage, liste les compétences acquises et propose des perspectives d'évolution pour le système développé."):
    story.append(fl)

story.append(Paragraph("8.2  Bilan Technique du Projet", h2))
story.append(P("Le projet a été mené à son terme avec succès. Les deux modules fonctionnels ont été <b>développés, testés et présentés à la DSI</b> de l'ONEE. La solution livrée comprend :"))
story.append(sp(2))
*story_add, _ = make_table(
    ["Livrable", "Statut", "Commentaire"],
    [
        ["API REST Backend FastAPI",           "✅ Livré",    "32 endpoints, documentation OpenAPI générée"],
        ["Module Réservation des Salles",      "✅ Livré",    "CRUD complet + moteur IA + notifications"],
        ["Module Gestion Parc Automobile",     "✅ Livré",    "Suivi complet + alertes prédictives"],
        ["Interface React.js (Frontend)",      "✅ Livré",    "Dashboard employé + admin, responsive"],
        ["Base de données SQL Server",         "✅ Livré",    "Schéma normalisé 3NF, migrations Alembic"],
        ["Documentation technique",           "✅ Livrée",   "README, Swagger, schéma de base de données"],
        ["Tests unitaires (Pytest)",          "✅ Livré",    "84% de couverture de code"],
        ["Tests de performance (Locust)",     "✅ Livré",    "100 utilisateurs simultanés validés"],
    ],
    [65*mm, 20*mm, 75*mm]
)
story.extend(story_add)
story.append(Paragraph("Tableau 8.1 – Tableau de bord des livrables du projet", caption_style))
story.append(PageBreak())

story.append(Paragraph("8.3  Compétences Acquises", h2))
story.append(P("Ce stage m'a permis de développer et renforcer des compétences techniques et transversales importantes :"))
story.append(sp(2))
story.append(Paragraph("Compétences Techniques", h3))
for item in bullet([
    "Maîtrise de <b>FastAPI</b> pour le développement d'APIs REST performantes et documentées.",
    "Approfondissement de <b>React.js 18</b> et Material UI pour la création d'interfaces modernes.",
    "Utilisation avancée de <b>SQLAlchemy ORM</b> et des migrations Alembic.",
    "Intégration de techniques d'<b>Intelligence Artificielle</b> dans un contexte applicatif réel.",
    "Mise en pratique des bonnes pratiques DevOps : Docker, Git, CI/CD, tests automatisés.",
]):
    story.append(item)
story.append(Paragraph("Compétences Transversales", h3))
for item in bullet([
    "Gestion de projet en autonomie avec des livrables hebdomadaires.",
    "Communication professionnelle avec les parties prenantes (réunions de suivi DSI).",
    "Rédaction de documentation technique claire et structurée.",
    "Capacité d'adaptation à un environnement professionnel exigeant.",
]):
    story.append(item)
story.append(sp(3))
story.append(Paragraph("8.4  Perspectives d'Évolution", h2))
story.append(P("Plusieurs pistes d'amélioration ont été identifiées pour les évolutions futures du système :"))
story.append(sp(2))
for item in bullet([
    "<b>Application mobile</b> (React Native) pour la réservation depuis smartphone.",
    "<b>Intégration Microsoft Teams / Outlook</b> pour la synchronisation des calendriers.",
    "<b>Tableaux de bord analytiques avancés</b> avec Power BI ou Grafana.",
    "<b>Modèle ML de prédiction des besoins</b> en réservation basé sur les données historiques.",
    "<b>Module de gestion des équipements IT</b> (extension naturelle du système existant).",
    "<b>Système de QR-Code</b> sur chaque salle pour check-in / check-out rapide.",
]):
    story.append(item)
story.append(sp(4))
for fl in conclu_box("Ce stage de fin d'année constitue une expérience professionnelle enrichissante qui a permis de mettre en pratique l'ensemble des compétences acquises tout au long du cursus d'ingénierie. La mission confiée par la DSI de l'ONEE a été réalisée avec succès, posant les bases d'un système de gestion des ressources interne moderne et évolutif."):
    story.append(fl)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE – CONCLUSION GÉNÉRALE (p.38)
# ══════════════════════════════════════════════════════════════════════════════
story.append(sp(3))
story.append(Paragraph("Conclusion Générale", h1))
story.append(HR(NAVY, 2))
story.append(sp(5))
story.append(P("Ce rapport de stage de fin d'année de 4ème année Ingénieur d'État a présenté la conception et le développement d'un <b>Système de Gestion des Ressources Internes</b> pour l'<b>ONEE Branch Électricité</b>, au sein de la Direction du Système d'Information."))
story.append(sp(4))
story.append(P("Le projet s'est articulé autour de deux modules fonctionnels complémentaires : la <b>Réservation des Salles de Réunion</b> et la <b>Gestion du Parc Automobile</b>. Ces modules, développés sur une architecture <b>3-Tiers moderne</b> (Python/FastAPI, React.js, SQL Server), répondent aux besoins exprimés par les équipes de la DSI et apportent une valeur ajoutée concrète à l'organisation."))
story.append(sp(4))
story.append(P("L'intégration de techniques d'<b>Intelligence Artificielle</b> — moteur de recommandation, système d'alertes prédictives et scoring contextuel — différencie ce système des simples outils de réservation en lui conférant une dimension analytique et proactive."))
story.append(sp(4))
story.append(P("D'un point de vue personnel, ce stage a représenté une opportunité précieuse de confronter les connaissances académiques avec les réalités d'un environnement industriel. La rigueur méthodologique exigée, la qualité du code, la gestion des délais et la communication avec les parties prenantes constituent des apprentissages qui enrichiront ma future carrière d'ingénieur."))
story.append(sp(4))
story.append(P("Les perspectives d'évolution identifiées — notamment l'application mobile, l'intégration Microsoft 365 et les tableaux de bord analytiques avancés — ouvrent des voies prometteuses pour la continuité et l'enrichissement de ce projet au-delà du cadre de ce stage."))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE – BIBLIOGRAPHIE (p.39)
# ══════════════════════════════════════════════════════════════════════════════
story.append(sp(3))
story.append(Paragraph("Bibliographie et Webographie", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(5))
story.append(Paragraph("Ouvrages et Articles de Référence", h2))
refs = [
    "[1] Tiangolo S. – <i>FastAPI Documentation</i> – fastapi.tiangolo.com, 2024.",
    "[2] Facebook Inc. – <i>React.js Documentation</i> – react.dev, 2024.",
    "[3] Google Inc. – <i>Material Design 3 Guidelines</i> – m3.material.io, 2024.",
    "[4] Fowler M. – <i>Patterns of Enterprise Application Architecture</i> – Addison-Wesley, 2002.",
    "[5] SQLAlchemy Team – <i>SQLAlchemy Documentation 2.0</i> – docs.sqlalchemy.org, 2024.",
    "[6] Richardson L., Ruby S. – <i>RESTful Web Services</i> – O'Reilly, 2007.",
]
for r in refs:
    story.append(Paragraph(r, S("Normal", fontName="Times-Roman", fontSize=10.5, leading=15, textColor=DGRAY, leftIndent=10, spaceBefore=4)))
story.append(sp(5))
story.append(Paragraph("Webographie", h2))
webs = [
    "[7] ONEE – Site officiel – www.one.org.ma (consulté le 01/08/2026)",
    "[8] EMSI Casablanca – www.emsi.ma (consulté le 01/08/2026)",
    "[9] Stack Overflow Developer Survey 2024 – survey.stackoverflow.co/2024",
    "[10] Python.org – Documentation officielle Python 3.11 – docs.python.org/3.11",
    "[11] Docker Inc. – Documentation Docker – docs.docker.com",
    "[12] Locust.io – Documentation Locust – docs.locust.io",
    "[13] JWT.io – Introduction aux JSON Web Tokens – jwt.io/introduction",
]
for w in webs:
    story.append(Paragraph(w, S("Normal", fontName="Times-Roman", fontSize=10.5, leading=15, textColor=DGRAY, leftIndent=10, spaceBefore=4)))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# PAGE – ANNEXES (p.40-44)
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("Annexe A – Schéma de la Base de Données", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(4))
story.append(P("Le schéma relationnel complet de la base de données comprend les tables suivantes :"))
story.append(sp(3))
*story_add, _ = make_table(
    ["Table", "Colonnes Principales", "Relations"],
    [
        ["utilisateurs",  "id, nom, prenom, email, password_hash, role, département",                    "→ reservations_salles, missions"],
        ["salles",        "id, nom, bâtiment, etage, capacite, equipements (JSON), actif",               "→ reservations_salles"],
        ["reservations_salles","id, salle_id, utilisateur_id, date_debut, date_fin, objet, statut",     "← salles, utilisateurs"],
        ["vehicules",     "id, immatriculation, marque, modele, annee, type, statut, km_actuel",         "→ missions, maintenances"],
        ["chauffeurs",    "id, nom, prenom, permis, disponible",                                          "→ missions"],
        ["missions",      "id, vehicule_id, chauffeur_id, demandeur_id, destination, date_depart, statut","← vehicules, chauffeurs, utilisateurs"],
        ["maintenances",  "id, vehicule_id, type, date, km, description, cout",                          "← vehicules"],
        ["alertes",       "id, vehicule_id, type_alerte, date_echeance, statut, message",                 "← vehicules"],
    ],
    [35*mm, 75*mm, 50*mm]
)
story.extend(story_add)
story.append(PageBreak())

story.append(Paragraph("Annexe B – Exemples de Code Source", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(3))
story.append(Paragraph("B.1  Endpoint FastAPI – Disponibilité des Salles", h2))
code1 = """<font face="Courier" size="8.5">
@router.get("/disponibles", response_model=List[SalleSchema])<br/>
async def get_salles_disponibles(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;date_debut: datetime,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;date_fin: datetime,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;capacite_min: int = 1,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;equipements: List[str] = Query([]),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;db: AsyncSession = Depends(get_db),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;current_user: User = Depends(get_current_user)<br/>
):<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"\"\"Retourne les salles disponibles pour le créneau donné.\"\""<br/>
&nbsp;&nbsp;&nbsp;&nbsp;# Sous-requête : IDs des salles réservées sur ce créneau<br/>
&nbsp;&nbsp;&nbsp;&nbsp;reserved = select(Reservation.salle_id).where(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reservation.statut != "annulee",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reservation.date_debut &lt; date_fin,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reservation.date_fin &gt; date_debut<br/>
&nbsp;&nbsp;&nbsp;&nbsp;)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;query = select(Salle).where(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Salle.id.not_in(reserved),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Salle.capacite &gt;= capacite_min,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Salle.actif == True<br/>
&nbsp;&nbsp;&nbsp;&nbsp;)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;result = await db.execute(query)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;salles = result.scalars().all()<br/>
&nbsp;&nbsp;&nbsp;&nbsp;# Appliquer le filtre équipements &amp; scoring IA<br/>
&nbsp;&nbsp;&nbsp;&nbsp;return recommender.score_and_rank(salles, equipements, current_user)
</font>"""
code_data1 = [[Paragraph(code1, normal)]]
ct1 = Table(code_data1, colWidths=[160*mm])
ct1.setStyle(TableStyle([
    ("BACKGROUND", (0,0),(-1,-1), colors.HexColor("#1E293B")),
    ("BOX",(0,0),(-1,-1),1,NAVY),
    ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
    ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
    ("TEXTCOLOR",(0,0),(-1,-1),colors.HexColor("#E2E8F0")),
]))
story.append(ct1)
story.append(sp(2))
story.append(Paragraph("Extrait de code – Endpoint FastAPI GET /api/salles/disponibles", caption_style))
story.append(PageBreak())

story.append(Paragraph("Annexe C – Interfaces Utilisateur (Captures d'écran)", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(3))
story.append(Paragraph("C.1  Interface de Réservation des Salles (Vue Employé)", h2))
story.append(sp(2))
story.append(P("L'interface principale de réservation présente un calendrier hebdomadaire avec code couleur : <b style='color:green'>vert</b> pour les créneaux disponibles, <b style='color:orange'>orange</b> pour les créneaux partiellement occupés, et <b style='color:red'>rouge</b> pour les créneaux complets. Un panneau latéral permet de filtrer par bâtiment, capacité et équipements."))
story.append(sp(3))
story.append(Paragraph("C.2  Dashboard Administrateur – Vue d'Ensemble", h2))
story.append(sp(2))
story.append(P("Le tableau de bord administrateur offre une vision globale en temps réel : indicateurs clés (nombre de réservations du jour, salles occupées, missions actives, alertes en cours), graphiques d'utilisation par salle et par équipe, et liste des dernières demandes en attente de validation."))
story.append(sp(3))
story.append(Paragraph("C.3  Module Parc Automobile – Fiche Véhicule", h2))
story.append(sp(2))
story.append(P("La fiche véhicule centralise toutes les informations relatives à un véhicule : données techniques (immatriculation, marque, modèle, année), kilométrage actuel, état (disponible / en mission / en maintenance), historique des missions et des maintenances, prochaines alertes d'entretien, et documents associés (carte grise, assurance)."))
story.append(PageBreak())

story.append(Paragraph("Annexe D – Glossaire Technique", h1))
story.append(HR(NAVY, 1.5))
story.append(sp(4))
glossary = [
    ("3-Tiers",        "Architecture logicielle à 3 couches : Présentation, Métier, Données."),
    ("ASGI",           "Asynchronous Server Gateway Interface – interface serveur web asynchrone Python."),
    ("CI/CD",          "Intégration Continue / Déploiement Continu – automatisation du cycle de livraison logicielle."),
    ("Endpoint",       "Point d'entrée d'une API REST, identifié par une méthode HTTP et un chemin URL."),
    ("JWT",            "JSON Web Token – standard d'authentification stateless par jeton signé."),
    ("Lazy Loading",   "Chargement différé de composants React pour optimiser les performances initiales."),
    ("Migration",      "Script de modification incrémentale d'un schéma de base de données (Alembic)."),
    ("ORM",            "Object-Relational Mapping – correspondance entre objets Python et tables SQL."),
    ("Pydantic",       "Bibliothèque Python de validation et de sérialisation de données via annotations de type."),
    ("Scoring",        "Calcul d'un score numérique pour classer des résultats selon des critères pondérés."),
    ("Stateless",      "Architecture sans état côté serveur : chaque requête contient toute l'information nécessaire."),
    ("WebSocket",      "Protocole de communication bidirectionnel temps réel sur une connexion TCP unique."),
]
gloss_data = [[Paragraph(f"<b>{t}</b>", table_cell_c), Paragraph(d, table_cell)] for t, d in glossary]
gloss_table = Table(gloss_data, colWidths=[35*mm, 125*mm])
gloss_table.setStyle(TableStyle([
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
    ("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),
    ("ROWBACKGROUNDS",(0,0),(-1,-1),[WHITE, LGRAY]),
    ("GRID",(0,0),(-1,-1),0.4,colors.HexColor("#CBD5E1")),
    ("BACKGROUND",(0,0),(0,-1),colors.HexColor("#DBEAFE")),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
]))
story.append(gloss_table)

# ─── BUILD PDF ────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUT_PDF,
    pagesize=A4,
    leftMargin=25*mm,
    rightMargin=20*mm,
    topMargin=18*mm,
    bottomMargin=16*mm,
    title="Rapport de Stage de Fin d'Année – 4ème Année Ingénieur",
    author="Adamovic – EMSI Casablanca",
    subject="Système de Gestion des Ressources Internes – ONEE DSI",
)

doc.build(story, onFirstPage=on_page, onLaterPages=on_page)

import pypdf
reader = pypdf.PdfReader(OUT_PDF)
size = os.path.getsize(OUT_PDF)
print(f"\n*** PDF genere avec succes ! ***")
print(f"   Fichier : {OUT_PDF}")
print(f"   Pages   : {len(reader.pages)}")
print(f"   Taille  : {round(size/1024/1024, 2)} MB")
