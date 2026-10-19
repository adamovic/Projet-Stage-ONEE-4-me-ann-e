import os
import math
from PIL import Image, ImageDraw, ImageFont

img_dir = r"c:\Users\PROBOOK2\Documents\2026-07-11\images"
os.makedirs(img_dir, exist_ok=True)

w, h = 1200, 1600
img = Image.new("RGB", (w, h), "#F8FAFC")
draw = ImageDraw.Draw(img)

try:
    font_title = ImageFont.truetype("arialbd.ttf", 24)
    font_header = ImageFont.truetype("arialbd.ttf", 16)
    font_sub = ImageFont.truetype("arialbd.ttf", 14)
    font_bold = ImageFont.truetype("arialbd.ttf", 12)
    font_norm = ImageFont.truetype("arial.ttf", 11)
    font_small = ImageFont.truetype("arial.ttf", 9)
    font_italic = ImageFont.truetype("ariali.ttf", 10)
except:
    font_title = font_header = font_sub = font_bold = font_norm = font_small = font_italic = ImageFont.load_default()

def draw_rounded_rect(draw, box, radius, fill, outline=None, width=1):
    x1, y1, x2, y2 = [int(v) for v in box]
    radius = int(radius)
    width = int(width)
    draw.rectangle([x1+radius, y1, x2-radius, y2], fill=fill)
    draw.rectangle([x1, y1+radius, x2, y2-radius], fill=fill)
    draw.ellipse([x1, y1, x1+2*radius, y1+2*radius], fill=fill)
    draw.ellipse([x2-2*radius, y1, x2, y1+2*radius], fill=fill)
    draw.ellipse([x1, y2-2*radius, x1+2*radius, y2], fill=fill)
    draw.ellipse([x2-2*radius, y2-2*radius, x2, y2], fill=fill)
    if outline:
        draw.arc([x1, y1, x1+2*radius, y1+2*radius], 180, 270, fill=outline, width=width)
        draw.arc([x2-2*radius, y1, x2, y1+2*radius], 270, 360, fill=outline, width=width)
        draw.arc([x2-2*radius, y2-2*radius, x2, y2], 0, 90, fill=outline, width=width)
        draw.arc([x1, y2-2*radius, x1+2*radius, y2], 90, 180, fill=outline, width=width)
        draw.line([x1+radius, y1, x2-radius, y1], fill=outline, width=width)
        draw.line([x1+radius, y2, x2-radius, y2], fill=outline, width=width)
        draw.line([x1, y1+radius, x1, y2-radius], fill=outline, width=width)
        draw.line([x2, y1+radius, x2, y2-radius], fill=outline, width=width)

def draw_ellipse_uc(draw, cx, cy, rx, ry, text, fill="#EBF3FA", outline="#2563EB", width=2, text_color="#1E3A8A"):
    box = [cx - rx, cy - ry, cx + rx, cy + ry]
    draw.ellipse(box, fill=fill, outline=outline, width=width)
    lines = text.split("\n")
    total_h = len(lines) * 16
    start_y = cy - total_h / 2 + 2
    for line in lines:
        draw.text((cx, start_y), line, fill=text_color, font=font_norm, anchor="mt")
        start_y += 16

def draw_actor(draw, cx, cy, name, fill="#FEF3C7", outline="#D97706", text_color="#92400E"):
    # Stick figure / Card representation
    card_w, card_h = 160, 46
    draw_rounded_rect(draw, (cx-card_w//2, cy-card_h//2, cx+card_w//2, cy+card_h//2), 8, fill=fill, outline=outline, width=2)
    # Head & body icon inside card on left
    draw.ellipse([cx-card_w//2+10, cy-12, cx-card_w//2+26, cy+4], fill=outline)
    draw.text((cx+10, cy), name, fill=text_color, font=font_bold, anchor="mm")

def draw_dashed_line(draw, start, end, fill="#64748B", width=1, dash_len=6):
    x1, y1 = start
    x2, y2 = end
    dist = math.hypot(x2 - x1, y2 - y1)
    if dist == 0:
        return
    dashes = int(dist / dash_len)
    for i in range(0, dashes, 2):
        s_pct = i / dashes
        e_pct = min((i + 1) / dashes, 1.0)
        p1 = (x1 + (x2 - x1) * s_pct, y1 + (y2 - y1) * s_pct)
        p2 = (x1 + (x2 - x1) * e_pct, y1 + (y2 - y1) * e_pct)
        draw.line([p1, p2], fill=fill, width=width)

def draw_arrow(draw, start, end, fill="#475569", width=2):
    draw.line([start, end], fill=fill, width=width)
    x1, y1 = start
    x2, y2 = end
    angle = math.atan2(y2 - y1, x2 - x1)
    head_len = 10
    draw.polygon([
        (x2, y2),
        (x2 - head_len * math.cos(angle - math.pi/6), y2 - head_len * math.sin(angle - math.pi/6)),
        (x2 - head_len * math.cos(angle + math.pi/6), y2 - head_len * math.sin(angle + math.pi/6))
    ], fill=fill)

def draw_generalization_arrow(draw, start, end, fill="#1E293B"):
    # Draw line with hollow triangle at end
    x1, y1 = start
    x2, y2 = end
    angle = math.atan2(y2 - y1, x2 - x1)
    tri_len = 12
    tx = x2 - tri_len * math.cos(angle)
    ty = y2 - tri_len * math.sin(angle)
    draw.line([start, (tx, ty)], fill=fill, width=2)
    p1 = (x2, y2)
    p2 = (x2 - tri_len * math.cos(angle - math.pi/6), y2 - tri_len * math.sin(angle - math.pi/6))
    p3 = (x2 - tri_len * math.cos(angle + math.pi/6), y2 - tri_len * math.sin(angle + math.pi/6))
    draw.polygon([p1, p2, p3], fill="white", outline=fill)

# Draw System Boundary
draw_rounded_rect(draw, (320, 90, 1150, 1550), 16, fill="#FFFFFF", outline="#0F172A", width=3)
draw.text((735, 120), "Système SALA — Plateforme de Gestion des Réunions & Réservations", fill="#0F172A", font=font_header, anchor="mm")

# Title Bar
draw_rounded_rect(draw, (40, 20, w-40, 70), 8, fill="#0F172A", outline="#020617")
draw.text((w//2, 45), "DIAGRAMME DE CAS D'UTILISATION (UML) — SALA PLATFORM", fill="white", font=font_title, anchor="mm")

# Actors positioning (Left)
# 1. Collaborateur / Demandeur (Base)
# 2. Directeur Exécutif
# 3. Directeur Général
# 4. Administrateur / Moyens Généraux

actors_info = [
    ("Directeur Général", 140, 320, "#EFF6FF", "#2563EB", "#1E40AF"),
    ("Directeur Exécutif", 140, 640, "#FEF3C7", "#D97706", "#92400E"),
    ("Collaborateur / Cadre", 140, 980, "#F0FDF4", "#16A34A", "#15803D"),
    ("Administrateur", 140, 1340, "#FDF2F8", "#DB2777", "#9D174D")
]

for name, ax, ay, f, o, tc in actors_info:
    draw_actor(draw, ax, ay, name, fill=f, outline=o, text_color=tc)

# Generalization arrows between hierarchical actors
# Collaborateur <- Directeur Exécutif <- Directeur Général
draw_generalization_arrow(draw, (140, 615), (140, 345))
draw_generalization_arrow(draw, (140, 955), (140, 665))
draw_generalization_arrow(draw, (140, 1315), (140, 1005))

# System Use Cases (Right side)
# Shared Auth Use Case
draw_ellipse_uc(draw, 980, 780, 105, 28, "S'authentifier\n(JWT Token)", fill="#F1F5F9", outline="#475569", width=2, text_color="#334155")

# Sub-includes for Reservation
draw_ellipse_uc(draw, 1000, 280, 110, 26, "Sélectionner Date &\nCréneau horaire", fill="#EFF6FF", outline="#60A5FA", width=1, text_color="#1E40AF")
draw_ellipse_uc(draw, 1000, 360, 110, 26, "Sélectionner Salle\n& Équipements", fill="#EFF6FF", outline="#60A5FA", width=1, text_color="#1E40AF")

# Use Cases for Collaborateur / Cadre
uc_collab = [
    (540, 230, 120, 28, "Créer une réservation\n(Wizard 10 étapes)"),
    (540, 305, 120, 26, "Ajouter des participants"),
    (540, 375, 120, 26, "Demander prestations\n(Pause-café / Déjeuner)"),
    (540, 445, 120, 26, "Exprimer besoins\nlogistiques & tech"),
    (540, 515, 120, 26, "Consulter ses\nréservations & statut"),
    (540, 585, 120, 26, "Modifier / Annuler\nune réservation"),
    (540, 655, 120, 26, "Consulter planning &\ndisponibilités salles")
]

# Use Cases for Directeur Exécutif
uc_exec = [
    (540, 740, 125, 28, "Valider / Prioriser les\ndemandes de son pôle"),
    (540, 815, 125, 28, "Réserver des espaces\nprioritaires / VIP"),
    (540, 890, 125, 28, "Consulter tableau de bord\nde son département")
]

# Use Cases for Directeur Général
uc_dg = [
    (540, 980, 130, 28, "Droit de préemption &\nRéservation Salon Conseil"),
    (540, 1055, 130, 28, "Consulter indicateurs &\nStatistiques globales (KPI)"),
    (540, 1130, 130, 28, "Consulter rapports &\nAudit d'activité globale")
]

# Use Cases for Administrateur
uc_admin = [
    (540, 1225, 125, 26, "Gérer les utilisateurs\n& Rôles (RBAC)"),
    (540, 1295, 125, 26, "Gérer le catalogue\ndes salles & matériel"),
    (540, 1365, 125, 26, "Gérer les prestations\n& Services généraux"),
    (540, 1435, 125, 26, "Consulter le journal\nd'audit & Logs système")
]

all_ucs = [
    (uc_collab, "#EFF6FF", "#3B82F6", "#1E3A8A"),
    (uc_exec, "#FEF3C7", "#F59E0B", "#92400E"),
    (uc_dg, "#EDE9FE", "#8B5CF6", "#5B21B6"),
    (uc_admin, "#FCE7F3", "#EC4899", "#9D174D")
]

for uc_group, f, o, tc in all_ucs:
    for cx, cy, rx, ry, text in uc_group:
        draw_ellipse_uc(draw, cx, cy, rx, ry, text, fill=f, outline=o, width=2, text_color=tc)
        # Connect to S'authentifier via dashed <<include>>
        draw_dashed_line(draw, (cx + rx, cy), (980 - 105, 780), fill="#94A3B8", width=1)

# Connect wizard inclusions
draw_dashed_line(draw, (540 + 120, 230), (1000 - 110, 280), fill="#3B82F6", width=1)
draw.text((790, 240), "<<include>>", fill="#1D4ED8", font=font_italic, anchor="mm")

draw_dashed_line(draw, (540 + 120, 230), (1000 - 110, 360), fill="#3B82F6", width=1)
draw.text((790, 285), "<<include>>", fill="#1D4ED8", font=font_italic, anchor="mm")

# Connect actors to their direct primary use cases
# 1. Collaborateur to his UCs
for cx, cy, rx, ry, text in uc_collab:
    draw_arrow(draw, (220, 980), (cx - rx, cy), fill="#16A34A", width=1)

# 2. Directeur Exécutif to his specific UCs
for cx, cy, rx, ry, text in uc_exec:
    draw_arrow(draw, (220, 640), (cx - rx, cy), fill="#D97706", width=2)

# 3. Directeur Général to his specific UCs
for cx, cy, rx, ry, text in uc_dg:
    draw_arrow(draw, (220, 320), (cx - rx, cy), fill="#2563EB", width=2)

# 4. Administrateur to his specific UCs
for cx, cy, rx, ry, text in uc_admin:
    draw_arrow(draw, (220, 1340), (cx - rx, cy), fill="#DB2777", width=2)

# Footer caption
draw.text((w//2, 1575), "Figure — Diagramme de Cas d'Utilisation UML : Rôles Directeur Général, Directeur Exécutif, Collaborateur & Administrateur", fill="#64748B", font=font_norm, anchor="mm")

output_path = os.path.join(img_dir, "diagramme_cas_utilisation_sala.png")
img.save(output_path, dpi=(300, 300))
print(f"Diagram successfully generated at: {output_path}")
