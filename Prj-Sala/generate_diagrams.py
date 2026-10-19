import os
import math
from PIL import Image, ImageDraw, ImageFont

img_dir = r"c:\Users\PROBOOK2\Documents\2026-07-11\images"
os.makedirs(img_dir, exist_ok=True)

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

def draw_arrow(draw, start, end, fill="#003366", width=2):
    draw.line([start, end], fill=fill, width=width)
    x1, y1 = start
    x2, y2 = end
    angle = math.atan2(y2 - y1, x2 - x1)
    head_len = 12
    draw.polygon([
        (x2, y2),
        (x2 - head_len * math.cos(angle - math.pi/6), y2 - head_len * math.sin(angle - math.pi/6)),
        (x2 - head_len * math.cos(angle + math.pi/6), y2 - head_len * math.sin(angle + math.pi/6))
    ], fill=fill)

# 1. DIAGRAMME ARCHITECTURE RESERVATION SALLES
w, h = 1400, 900
img1 = Image.new("RGB", (w, h), "#F8FAFC")
draw1 = ImageDraw.Draw(img1)

try:
    font_title = ImageFont.truetype("arial.ttf", 22)
    font_header = ImageFont.truetype("arialbd.ttf", 16)
    font_bold = ImageFont.truetype("arialbd.ttf", 13)
    font_norm = ImageFont.truetype("arial.ttf", 12)
    font_small = ImageFont.truetype("arial.ttf", 10)
except:
    font_title = font_header = font_bold = font_norm = font_small = ImageFont.load_default()

# Header banner
draw_rounded_rect(draw1, (30, 20, w-30, 70), 8, fill="#003366", outline="#002244")
draw1.text((w//2, 45), "ARCHITECTURE DÉTAILLÉE — MODULE DE RÉSERVATION DES SALLES DE RÉUNION", fill="white", font=font_title, anchor="mm")

# Layer 1: Client / Presentation (Top)
draw_rounded_rect(draw1, (40, 90, w-40, 260), 10, fill="#EFF6FF", outline="#93C5FD", width=2)
draw1.text((60, 105), "COUCHE PRÉSENTATION — FRONTEND (REACT.JS / MATERIAL DESIGN 3)", fill="#1E40AF", font=font_header)

clients = [
    ("Espace Employé", ["Assistant Réservation Wizard (10 Étapes)", "Consultation Disponibilités & Plannings", "Demandes Services (Pause Café / Déjeuner)", "Mes Réservations & Annulations"], 60, 135, 460, 245),
    ("Espace Gestionnaire Salles", ["Validation / Refus des Demandes", "Gestion Référentiel Salles & Équipements", "Planning Consolidé par Bâtiment", "Gestion des Incidents & Alertes"], 490, 135, 890, 245),
    ("Espace Administrateur", ["Gestion Utilisateurs & Rôles (RBAC)", "Tableau de Bord KPI Global", "Journal d'Audit & Historique", "Paramétrage Système & Services"], 920, 135, 1340, 245)
]

for title, items, x1, y1, x2, y2 in clients:
    draw_rounded_rect(draw1, (x1, y1, x2, y2), 6, fill="white", outline="#BFDBFE", width=2)
    draw1.text((x1+10, y1+10), title, fill="#1E3A8A", font=font_bold)
    y_off = y1 + 30
    for it in items:
        draw1.text((x1+15, y_off), f"• {it}", fill="#334155", font=font_small)
        y_off += 16

# Layer 2: API Gateway / Communication
draw_rounded_rect(draw1, (40, 280, w-40, 330), 8, fill="#F0FDF4", outline="#86EFAC", width=2)
draw1.text((w//2, 305), "API REST — PROTOCOLE HTTPS / MESSAGES JSON / AUTHENTIFICATION JWT (BEARER TOKEN)", fill="#166534", font=font_header, anchor="mm")

# Layer 3: Métier / Backend (Middle)
draw_rounded_rect(draw1, (40, 350, w-40, 580), 10, fill="#FEF3C7", outline="#FCD34D", width=2)
draw1.text((60, 365), "COUCHE MÉTIER — BACKEND API REST (FASTAPI / PYTHON & LOGIQUE MÉTIER)", fill="#92400E", font=font_header)

services_salles = [
    ("Auth & Security Service", ["JWT Token Handler", "Password Hash (Bcrypt)", "Role Manager (RBAC)"], 60, 395, 340, 560),
    ("Booking Engine Service", ["Vérification Conflits Horaires", "Gestion Statuts (Attente/Confirmé)", "Calcul Durées & Créneaux"], 360, 395, 660, 560),
    ("AI Suggestion Engine", ["Score d'Adéquation Capacité", "Habitudes de Réservation", "Répartition de Charge Salles"], 680, 395, 980, 560),
    ("Logistics & Services", ["Gestion Pause-Café & Repas", "Filtrage Équipements Requis", "Convocation PDF & Emails"], 1000, 395, 1340, 560)
]

for title, items, x1, y1, x2, y2 in services_salles:
    draw_rounded_rect(draw1, (x1, y1, x2, y2), 6, fill="white", outline="#FDE68A", width=2)
    draw1.text((x1+10, y1+12), title, fill="#B45309", font=font_bold)
    y_off = y1 + 35
    for it in items:
        draw1.text((x1+15, y_off), f"✓ {it}", fill="#451A03", font=font_norm)
        y_off += 22

# Layer 4: Database (Bottom)
draw_rounded_rect(draw1, (40, 600, w-40, 830), 10, fill="#F3E8FF", outline="#D8B4FE", width=2)
draw1.text((60, 615), "COUCHE DONNÉES — SGBD RELATIONNEL (MICROSOFT SQL SERVER / MYSQL)", fill="#6B21A8", font=font_header)

tables_salles = [
    ("UTILISATEUR", "id_user (PK), matricule, nom, email, id_role (FK)"),
    ("SALLE", "id_salle (PK), nom, capacite, etage, id_batiment (FK)"),
    ("RESERVATION", "id_res (PK), date, heure_deb, heure_fin, statut, id_salle, id_user"),
    ("EQUIPEMENT", "id_eq (PK), libelle, description, quantite"),
    ("SERVICES_LOGISTIQUE", "id_service (PK), pause_cafe, repas, id_res (FK)"),
    ("JOURNAL_AUDIT", "id_log (PK), action, date_action, details, id_user (FK)")
]

grid_cols = [60, 480, 900]
grid_rows = [645, 735]
idx = 0
for r in grid_rows:
    for c in grid_cols:
        if idx < len(tables_salles):
            tname, tdesc = tables_salles[idx]
            draw_rounded_rect(draw1, (c, r, c+410, r+75), 6, fill="white", outline="#C084FC", width=2)
            draw1.text((c+10, r+10), f"TABLE : {tname}", fill="#581C87", font=font_bold)
            draw1.text((c+10, r+35), tdesc, fill="#4C1D95", font=font_small)
            idx += 1

# Arrows
draw_arrow(draw1, (w//2, 260), (w//2, 280), fill="#2563EB", width=3)
draw_arrow(draw1, (w//2, 330), (w//2, 350), fill="#16A34A", width=3)
draw_arrow(draw1, (w//2, 580), (w//2, 600), fill="#9333EA", width=3)

# Footer
draw1.text((w//2, 860), "Figure 4.1 — Architecture logicielle 3-Tiers du module de Réservation des Salles de Réunion (Plateforme SALA)", fill="#475569", font=font_norm, anchor="mm")

img1.save(os.path.join(img_dir, "architecture_reservation_salles.png"))
print("Successfully generated architecture_reservation_salles.png")

# 2. DIAGRAMME ARCHITECTURE GESTION VEHICULES
img2 = Image.new("RGB", (w, h), "#F8FAFC")
draw2 = ImageDraw.Draw(img2)

# Header banner
draw_rounded_rect(draw2, (30, 20, w-30, 70), 8, fill="#004D40", outline="#00251A")
draw2.text((w//2, 45), "ARCHITECTURE DÉTAILLÉE — MODULE DE GESTION DU PARC AUTOMOBILE", fill="white", font=font_title, anchor="mm")

# Layer 1: Client / Presentation
draw_rounded_rect(draw2, (40, 90, w-40, 260), 10, fill="#E0F2F1", outline="#80CBC4", width=2)
draw2.text((60, 105), "COUCHE PRÉSENTATION — FRONTEND (REACT.JS / MATERIAL DESIGN 3 / DASHBOARDS)", fill="#004D40", font=font_header)

clients_v = [
    ("Demandeur de Mission", ["Formulaire Demande de Véhicule", "Sélection Destination & Dates", "Consultation Statut Demande", "Historique des Déplacements"], 60, 135, 460, 245),
    ("Gestionnaire du Parc", ["Affectation Véhicule & Chauffeur", "Suivi Maintenance & Délais IT/Assurance", "Gestion des Pleins de Carburant", "Valider/Clôturer les Missions"], 490, 135, 890, 245),
    ("Chauffeur / Agent Service", ["Planning des Missions Affectées", "Saisie Kilométrage Départ/Retour", "Signalement des Anomalies / Panne", "Fiche de Suivi Véhicule"], 920, 135, 1340, 245)
]

for title, items, x1, y1, x2, y2 in clients_v:
    draw_rounded_rect(draw2, (x1, y1, x2, y2), 6, fill="white", outline="#4DB6AC", width=2)
    draw2.text((x1+10, y1+10), title, fill="#00695C", font=font_bold)
    y_off = y1 + 30
    for it in items:
        draw2.text((x1+15, y_off), f"• {it}", fill="#004D40", font=font_small)
        y_off += 16

# Layer 2: API Gateway
draw_rounded_rect(draw2, (40, 280, w-40, 330), 8, fill="#ECFDF5", outline="#6EE7B7", width=2)
draw2.text((w//2, 305), "API REST FLOTTE AUTOMOBILE — ENDPOINTS /VEHICULES, /MISSIONS, /CARBURANT, /MAINTENANCE", fill="#047857", font=font_header, anchor="mm")

# Layer 3: Métier / Backend
draw_rounded_rect(draw2, (40, 350, w-40, 580), 10, fill="#FFF7ED", outline="#FDBA74", width=2)
draw2.text((60, 365), "COUCHE MÉTIER & SERVICE PARC — BACKEND FASTAPI (PYTHON METIER & MODULES ANALYTIQUES)", fill="#C2410C", font=font_header)

services_veh = [
    ("Fleet Availability Service", ["Contrôle Disponibilité Véhicules", "Vérification Permis Chauffeurs", "Anti-Chevauchement Missions"], 60, 395, 340, 560),
    ("Mission Workflow Engine", ["Validation Hiérarchique Mission", "Ordre de Mission Automatique", "Calcul Kilométrage Parcouru"], 360, 395, 660, 560),
    ("Compliance & Alert Manager", ["Alertes Contrôle Technique (V.T)", "Échéances Assurances Véhicules", "Maintenance Préventive (Vidange)"], 680, 395, 980, 560),
    ("Fuel & Cost Analytics", ["Calcul Consommation L/100km", "Suivi Coût Kilométrique Moyen", "Reporting Statistiques Parc"], 1000, 395, 1340, 560)
]

for title, items, x1, y1, x2, y2 in services_veh:
    draw_rounded_rect(draw2, (x1, y1, x2, y2), 6, fill="white", outline="#FFD8A8", width=2)
    draw2.text((x1+10, y1+12), title, fill="#9A3412", font=font_bold)
    y_off = y1 + 35
    for it in items:
        draw2.text((x1+15, y_off), f"✓ {it}", fill="#7C2D12", font=font_norm)
        y_off += 22

# Layer 4: Database
draw_rounded_rect(draw2, (40, 600, w-40, 830), 10, fill="#F0F9FF", outline="#7DD3FC", width=2)
draw2.text((60, 615), "COUCHE DONNÉES — PERSISTANCE BASE DE DONNÉES RELATIONNELLE (SQL SERVER / MYSQL)", fill="#0369A1", font=font_header)

tables_veh = [
    ("VEHICULE", "id_vehicule (PK), immatriculation, marque, modele, kilometrage, statut"),
    ("CHAUFFEUR", "id_chauffeur (PK), num_permis, validite_permis, id_user (FK)"),
    ("MISSION", "id_mission (PK), destination, date_dep, date_ret, id_vehicule, id_chauffeur"),
    ("CARBURANT", "id_plein (PK), date, litres, cout, km_compteur, id_vehicule (FK)"),
    ("MAINTENANCE", "id_maint (PK), type, date, km, cout, prestataire, id_vehicule (FK)"),
    ("ASSURANCE_VT", "id_doc (PK), type_doc, date_echeance, statut, id_vehicule (FK)")
]

idx = 0
for r in grid_rows:
    for c in grid_cols:
        if idx < len(tables_veh):
            tname, tdesc = tables_veh[idx]
            draw_rounded_rect(draw2, (c, r, c+410, r+75), 6, fill="white", outline="#38BDF8", width=2)
            draw2.text((c+10, r+10), f"TABLE : {tname}", fill="#075985", font=font_bold)
            draw2.text((c+10, r+35), tdesc, fill="#0C4A6E", font=font_small)
            idx += 1

# Arrows
draw_arrow(draw2, (w//2, 260), (w//2, 280), fill="#00796B", width=3)
draw_arrow(draw2, (w//2, 330), (w//2, 350), fill="#D97706", width=3)
draw_arrow(draw2, (w//2, 580), (w//2, 600), fill="#0284C7", width=3)

# Footer
draw2.text((w//2, 860), "Figure 4.2 — Architecture logicielle 3-Tiers du module de Gestion du Parc Automobile et des Véhicules de Service", fill="#475569", font=font_norm, anchor="mm")

img2.save(os.path.join(img_dir, "architecture_gestion_vehicules.png"))
print("Successfully generated architecture_gestion_vehicules.png")
