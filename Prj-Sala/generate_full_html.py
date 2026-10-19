import os

output_path = r"c:\Users\PROBOOK2\Documents\2026-07-11\rapport_stage.html"

pages = []

def make_page(content, header_right, page_num_str):
    return f"""<div class="page">
  <div class="page-header-line">
    <span>Rapport de Stage de Fin d'Année — 4<sup>ème</sup> Année EMSI</span>
    <strong>{header_right}</strong>
  </div>
  <div class="page-content">
{content}
  </div>
  <div class="page-footer-line">
    <span>Adam EL MERABET — EMSI / ONEE</span>
    <span class="page-num">{page_num_str}</span>
  </div>
</div>"""

# ==================== PAGE 1: COVER ====================
p1 = """<div class="page">
  <div class="cover-container">
    <div class="cover-header">
      <div class="cover-school">
        ÉCOLE MAROCAINE DES SCIENCES DE L'INGÉNIEUR<br/>
        <span class="cover-school-sub">EMSI Casablanca — Membre de Honoris United Universities</span><br/>
        <span class="cover-school-sub">Filière : Intelligence Artificielle & Data</span>
      </div>
      <div style="font-size:12pt; font-weight:bold; color:var(--primary); font-family:Arial;">EMSI / ONEE</div>
    </div>
    
    <div class="cover-body">
      <div style="font-size:11pt; font-weight:bold; color:var(--primary); margin-bottom:2mm;">OFFICE NATIONAL DE L'ÉLECTRICITÉ ET DE L'EAU POTABLE</div>
      <div style="font-size:9.5pt; color:#475569; margin-bottom:4mm;">Branche Électricité — Direction des Systèmes d'Information (DSI)</div>
      
      <div class="cover-badge">RAPPORT DE STAGE DE FIN D'ANNÉE — 4<sup>ÈME</sup> ANNÉE</div>
      <div style="font-size:10pt; color:#334155; margin-bottom:3mm;">Pour l'obtention du passage au Cycle Supérieur d'Ingénieur d'État</div>
      
      <div class="cover-title-box">
        <div class="cover-title">GESTION DES RESSOURCES PARTAGÉES (SALA)</div>
        <div class="cover-subtitle">Développement d'une plateforme web intelligente de gestion centralisée : réservation des salles de réunion et gestion du parc automobile</div>
      </div>
      
      <table class="cover-info-table">
        <tr><td class="label">Réalisé par :</td><td><strong>Adam EL MERABET</strong></td></tr>
        <tr><td class="label">Filière & Année :</td><td>4<sup>ème</sup> Année Ingénierie Intelligence Artificielle & Data</td></tr>
        <tr><td class="label">Encadrant Professionnel (ONEE) :</td><td>M. Mouaad EL MASLOUHI (DSI / ONEE)</td></tr>
        <tr><td class="label">Encadrant Académique (EMSI) :</td><td>M. Zakaria KHATAR (EMSI Casablanca)</td></tr>
        <tr><td class="label">Organisme d'Accueil :</td><td>Office National de l'Électricité et de l'Eau Potable (ONEE)</td></tr>
        <tr><td class="label">Période du Stage :</td><td>Du 01 Juillet 2026 au 31 Août 2026</td></tr>
        <tr><td class="label">Année Universitaire :</td><td>2025 / 2026</td></tr>
      </table>
    </div>
    
    <div class="cover-footer">
      École Marocaine des Sciences de l'Ingénieur — Site Casablanca — Année Académique 2025/2026
    </div>
  </div>
</div>"""
pages.append(p1)

# ==================== PAGE 2: DÉDICACE ====================
p2 = make_page("""
    <h1 class="chapter-title">Dédicace</h1>
    <div style="margin-top:20mm; text-align:center; font-style:italic; font-size:11pt; line-height:2.2; color:#334155;">
      <p>À mes chers parents, dont le soutien indéfectible, la patience et les encouragements constants ont été le socle sur lequel j'ai pu construire chacune de mes réussites académiques. Vous avez su, par vos sacrifices silencieux, me donner les moyens d'aller au bout de mes ambitions.</p>
      <br/>
      <p>À mes frères et sœurs, pour leur présence rassurante et leurs mots justes dans les moments de doute.</p>
      <br/>
      <p>À mes professeurs de l'EMSI Casablanca, qui ont façonné ma pensée d'ingénieur et m'ont transmis bien plus que des connaissances techniques : une rigueur et une exigence que je m'efforcerai de porter tout au long de ma carrière.</p>
      <br/>
      <p>À toute l'équipe de l'ONEE qui m'a accueilli avec bienveillance et professionalisme durant ces deux mois, et qui a fait de ce stage une expérience humaine autant que technique.</p>
      <br/>
      <p>Je dédie ce modeste travail, fruit de deux mois d'apprentissage intense, à toutes les personnes qui croient en la valeur du travail bien fait.</p>
    </div>
""", "Dédicace", "ii")
pages.append(p2)

# ==================== PAGE 3: REMERCIEMENTS ====================
p3 = make_page("""
    <h1 class="chapter-title">Remerciements</h1>
    <div style="font-size:10.5pt; line-height:1.75; text-align:justify; margin-top:4mm;">
      <p>Au terme de ce stage de fin d'année de 4ème année, il m'est agréable d'acquitter une dette de reconnaissance auprès de toutes les personnes dont l'intervention a favorisé son aboutissement.</p>
      
      <p>Je tiens tout d'abord à exprimer ma profonde gratitude à mon encadrant professionnel, <strong>M. Mouaad EL MASLOUHI</strong>, pour la qualité de son encadrement, sa disponibilité de tous les instants et la confiance qu'il m'a accordée dès les premiers jours de mon intégration au sein de la Direction des Systèmes d'Information de l'Office National de l'Électricité et de l'Eau Potable (ONEE). Ses conseils avisés, sa rigueur méthodologique et sa vision métier ont considérablement enrichi la portée de ce projet.</p>
      
      <p>Mes remerciements les plus sincères vont également à mon encadrant académique, <strong>M. Zakaria KHATAR</strong>, pour le suivi attentif qu'il a assuré tout au long de ce stage, pour ses remarques constructives lors des points d'étape, et pour la pédagogie avec laquelle il a su orienter mes réflexions vers une démarche d'ingénierie logicielle rigoureuse.</p>
      
      <p>Je remercie également l'ensemble du corps professoral et administratif de l'<strong>EMSI Casablanca</strong> pour la qualité de la formation d'ingénieur dispensée durant ces quatre années, formation qui m'a permis d'aborder ce stage avec les compétences techniques et méthodologiques nécessaires.</p>
      
      <p>J'adresse aussi mes vifs remerciements à l'ensemble des collaborateurs de l'ONEE, et en particulier aux membres de la DSI, pour leur accueil chaleureux, leur esprit d'équipe et leur disponibilité à répondre à mes questions.</p>
      
      <p>Enfin, je ne saurais oublier de remercier les membres du jury qui me font l'honneur d'évaluer ce travail, ainsi que toute personne ayant contribué, de près ou de loin, à la réalisation de ce rapport.</p>
    </div>
""", "Remerciements", "iii")
pages.append(p3)

# ==================== PAGE 4: RÉSUMÉ & ABSTRACT ====================
p4 = make_page("""
    <h1 class="chapter-title">Résumé</h1>
    <p>Ce rapport présente le travail réalisé dans le cadre d'un stage de fin d'année de 4<sup>ème</sup> année d'ingénieur (filière IA & Data à l'EMSI Casablanca) d'une durée de deux mois effectué au sein de l'Office National de l'Électricité et de l'Eau Potable (ONEE), du 01 juillet au 31 août 2026. L'objectif de ce stage était de concevoir et développer une plateforme web intelligente (nommée SALA) dédiée à la gestion centralisée des ressources et moyens partagés de l'Office, en particulier la réservation des salles de réunion et la gestion du parc automobile.</p>
    <p>Face aux limites constatées dans les processus actuels (manuels et dispersés), ce projet propose une solution unifiée s'appuyant sur une architecture trois tiers moderne combinant un frontend React.js avec Material Design 3, un backend Python développé avec le framework FastAPI exposant une API REST sécurisée par jetons JWT, et un SGBD Microsoft SQL Server / MySQL.</p>
    <p>La plateforme couvre l'authentification sécurisée, la réservation intelligente de salles avec détection de conflits, la gestion complète des véhicules, chauffeurs, missions, carburant et maintenance, ainsi que des tableaux de bord décisionnels enrichis par une brique d'IA pour les suggestions automatiques.</p>
    <p><strong>Mots clés :</strong> Gestion des ressources partagées, réservation de salles, gestion du parc automobile, React.js, FastAPI, SQL Server, architecture trois tiers, intelligence artificielle, aide à la décision, ONEE.</p>
    
    <div style="height:1.5px; background:linear-gradient(90deg, var(--primary), transparent); margin:3mm 0;"></div>
    
    <h1 class="chapter-title" style="background:#00695c;">Abstract</h1>
    <p>This report presents the work carried out as part of a two-month 4th-year engineering internship (Artificial Intelligence & Data major at EMSI Casablanca) completed at the Office National de l'Électricité et de l'Eau Potable (ONEE), from July 1st to August 31st, 2026. The purpose of this internship was to design and develop an intelligent web platform (SALA) dedicated to the centralized management of the Office's shared resources, with a particular focus on meeting room booking and vehicle fleet management.</p>
    <p>In response to current manual process limitations, this project proposes a unified solution built on a modern three-tier architecture combining a React.js frontend styled with Material Design 3, a Python FastAPI backend exposing a REST API secured through JWT tokens, and a Microsoft SQL Server relational database.</p>
    <p>The system encompasses room booking, vehicle fleet management, driver dispatching, fuel tracking, maintenance alerts, and AI-driven decision-support dashboards.</p>
    <p><strong>Keywords :</strong> Shared resource management, meeting room booking, fleet management, React.js, FastAPI, SQL Server, three-tier architecture, artificial intelligence, decision support, ONEE.</p>
""", "Résumé / Abstract", "iv")
pages.append(p4)

# ==================== PAGE 5: TABLE DES MATIÈRES (Partie 1) ====================
p5 = make_page("""
    <h1 class="chapter-title">Table des Matières (1/2)</h1>
    <table class="toc-table">
      <tr><td class="toc-ch">Dédicace</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">ii</td></tr>
      <tr><td class="toc-ch">Remerciements</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">iii</td></tr>
      <tr><td class="toc-ch">Résumé / Abstract</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">iv</td></tr>
      <tr><td class="toc-ch">Table des Matières</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">v</td></tr>
      <tr><td class="toc-ch">Liste des Figures</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">vii</td></tr>
      <tr><td class="toc-ch">Liste des Tableaux</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">viii</td></tr>
      <tr><td class="toc-ch">Liste des Abréviations</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">ix</td></tr>
      
      <tr><td class="toc-ch">Introduction Générale</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">1</td></tr>
      
      <tr><td class="toc-ch">Chapitre 1 : Présentation de l'Organisme d'Accueil (ONEE)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">2</td></tr>
      <tr><td class="toc-sec">1.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">2</td></tr>
      <tr><td class="toc-sec">1.2 Présentation générale de l'ONEE</td><td><span class="toc-dots"></span></td><td class="toc-pg">2</td></tr>
      <tr><td class="toc-sec">1.3 Les missions actuelles de l'ONEE (Production, Transport, Gestion)</td><td><span class="toc-dots"></span></td><td class="toc-pg">2</td></tr>
      <tr><td class="toc-sec">1.4 Évolution de l'organisation du secteur électrique (Distribution partagée)</td><td><span class="toc-dots"></span></td><td class="toc-pg">3</td></tr>
      <tr><td class="toc-sec">1.5 Organisation générale et principales directions de l'ONEE</td><td><span class="toc-dots"></span></td><td class="toc-pg">3</td></tr>
      <tr><td class="toc-sec">1.6 Direction des Systèmes d'Information (DSI) et service d'accueil</td><td><span class="toc-dots"></span></td><td class="toc-pg">4</td></tr>
      <tr><td class="toc-sec">1.7 Ressources et fonctionnement du service</td><td><span class="toc-dots"></span></td><td class="toc-pg">4</td></tr>
      <tr><td class="toc-sec">1.8 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">4</td></tr>
      
      <tr><td class="toc-ch">Chapitre 2 : Analyse de l'Existant et Spécification des Besoins</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">5</td></tr>
      <tr><td class="toc-sec">2.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">5</td></tr>
      <tr><td class="toc-sec">2.2 Description du processus actuel de gestion des salles</td><td><span class="toc-dots"></span></td><td class="toc-pg">5</td></tr>
      <tr><td class="toc-sec">2.3 Description du processus actuel de gestion des véhicules</td><td><span class="toc-dots"></span></td><td class="toc-pg">5</td></tr>
      <tr><td class="toc-sec">2.4 Problèmes rencontrés et synthèse de l'existant</td><td><span class="toc-dots"></span></td><td class="toc-pg">6</td></tr>
      <tr><td class="toc-sec">2.5 Analyse critique de l'existant</td><td><span class="toc-dots"></span></td><td class="toc-pg">6</td></tr>
      <tr><td class="toc-sec">2.6 Besoins fonctionnels (Module Salles & Module Véhicules)</td><td><span class="toc-dots"></span></td><td class="toc-pg">7</td></tr>
      <tr><td class="toc-sec">2.7 Besoins non fonctionnels</td><td><span class="toc-dots"></span></td><td class="toc-pg">8</td></tr>
      <tr><td class="toc-sec">2.8 Contraintes du projet et solution proposée</td><td><span class="toc-dots"></span></td><td class="toc-pg">8</td></tr>
      <tr><td class="toc-sec">2.9 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">8</td></tr>
      
      <tr><td class="toc-ch">Chapitre 3 : Étude Fonctionnelle et Modélisation UML</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">9</td></tr>
      <tr><td class="toc-sec">3.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">9</td></tr>
      <tr><td class="toc-sec">3.2 Identification des acteurs du système</td><td><span class="toc-dots"></span></td><td class="toc-pg">9</td></tr>
      <tr><td class="toc-sec">3.3 Diagramme de cas d'utilisation global</td><td><span class="toc-dots"></span></td><td class="toc-pg">9</td></tr>
      <tr><td class="toc-sec">3.4 Description détaillée des cas d'utilisation principaux</td><td><span class="toc-dots"></span></td><td class="toc-pg">10</td></tr>
      <tr><td class="toc-sec">3.5 Diagrammes de séquence (Réservation salle, Affectation véhicule, Auth JWT)</td><td><span class="toc-dots"></span></td><td class="toc-pg">11</td></tr>
      <tr><td class="toc-sec">3.6 Diagramme de classes métier</td><td><span class="toc-dots"></span></td><td class="toc-pg">12</td></tr>
      <tr><td class="toc-sec">3.7 Règles de gestion</td><td><span class="toc-dots"></span></td><td class="toc-pg">12</td></tr>
      <tr><td class="toc-sec">3.8 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">13</td></tr>
    </table>
""", "Table des Matières", "v")
pages.append(p5)

# ==================== PAGE 6: TABLE DES MATIÈRES (Partie 2) ====================
p6 = make_page("""
    <h1 class="chapter-title">Table des Matières (2/2)</h1>
    <table class="toc-table">
      <tr><td class="toc-ch">Chapitre 4 : Conception Technique et Architectures Logicielle & Physique</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">14</td></tr>
      <tr><td class="toc-sec">4.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">14</td></tr>
      <tr><td class="toc-sec">4.2 Architecture logicielle globale 3-Tiers</td><td><span class="toc-dots"></span></td><td class="toc-pg">14</td></tr>
      <tr><td class="toc-sec">4.3 Architecture détaillée — Module de Réservation des Salles</td><td><span class="toc-dots"></span></td><td class="toc-pg">15</td></tr>
      <tr><td class="toc-sec">4.4 Architecture détaillée — Module de Gestion du Parc Automobile</td><td><span class="toc-dots"></span></td><td class="toc-pg">16</td></tr>
      <tr><td class="toc-sec">4.5 Architecture logique du backend FastAPI</td><td><span class="toc-dots"></span></td><td class="toc-pg">17</td></tr>
      <tr><td class="toc-sec">4.6 Choix technologiques et justifications</td><td><span class="toc-dots"></span></td><td class="toc-pg">18</td></tr>
      <tr><td class="toc-sec">4.7 Sécurité réseau et authentification JWT</td><td><span class="toc-dots"></span></td><td class="toc-pg">18</td></tr>
      <tr><td class="toc-sec">4.8 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">18</td></tr>
      
      <tr><td class="toc-ch">Chapitre 5 : Conception de la Base de Données</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">19</td></tr>
      <tr><td class="toc-sec">5.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">19</td></tr>
      <tr><td class="toc-sec">5.2 Modèle Conceptuel de Données (MCD)</td><td><span class="toc-dots"></span></td><td class="toc-pg">19</td></tr>
      <tr><td class="toc-sec">5.3 Modèle Logique de Données (MLD)</td><td><span class="toc-dots"></span></td><td class="toc-pg">19</td></tr>
      <tr><td class="toc-sec">5.4 Modèle Physique de Données (MPD) et Schéma relationnel</td><td><span class="toc-dots"></span></td><td class="toc-pg">20</td></tr>
      <tr><td class="toc-sec">5.5 Description détaillée des tables principales</td><td><span class="toc-dots"></span></td><td class="toc-pg">21</td></tr>
      <tr><td class="toc-sec">5.6 Contraintes et intégrité référentielle</td><td><span class="toc-dots"></span></td><td class="toc-pg">22</td></tr>
      <tr><td class="toc-sec">5.7 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">22</td></tr>
      
      <tr><td class="toc-ch">Chapitre 6 : Réalisation et Développement des Modules</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">23</td></tr>
      <tr><td class="toc-sec">6.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">23</td></tr>
      <tr><td class="toc-sec">6.2 Pipeline de réalisation du projet & organisation des dossiers</td><td><span class="toc-dots"></span></td><td class="toc-pg">23</td></tr>
      <tr><td class="toc-sec">6.3 Frontend React.js et Design System Material Design 3</td><td><span class="toc-dots"></span></td><td class="toc-pg">24</td></tr>
      <tr><td class="toc-sec">6.4 Module Assistant de Réservation Intelligente (Wizard 10 étapes)</td><td><span class="toc-dots"></span></td><td class="toc-pg">25</td></tr>
      <tr><td class="toc-sec">6.5 Module de Gestion du Parc Automobile (Missions, Carburant, Maintenance)</td><td><span class="toc-dots"></span></td><td class="toc-pg">26</td></tr>
      <tr><td class="toc-sec">6.6 Module Tableau de Bord et Statistiques KPI</td><td><span class="toc-dots"></span></td><td class="toc-pg">27</td></tr>
      <tr><td class="toc-sec">6.7 Module d'Intelligence Artificielle et d'aide à la décision</td><td><span class="toc-dots"></span></td><td class="toc-pg">27</td></tr>
      <tr><td class="toc-sec">6.8 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">27</td></tr>
      
      <tr><td class="toc-ch">Chapitre 7 : Tests, Validation et Déploiement</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">28</td></tr>
      <tr><td class="toc-sec">7.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">28</td></tr>
      <tr><td class="toc-sec">7.2 Stratégie générale de tests (Unitaires, Fonctionnels, Intégration)</td><td><span class="toc-dots"></span></td><td class="toc-pg">28</td></tr>
      <tr><td class="toc-sec">7.3 Tests de performance et sécurité</td><td><span class="toc-dots"></span></td><td class="toc-pg">29</td></tr>
      <tr><td class="toc-sec">7.4 Procédure de déploiement et mise en production</td><td><span class="toc-dots"></span></td><td class="toc-pg">30</td></tr>
      <tr><td class="toc-sec">7.5 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">30</td></tr>
      
      <tr><td class="toc-ch">Chapitre 8 : Intelligence Artificielle et Perspectives d'Évolution</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">31</td></tr>
      <tr><td class="toc-sec">8.1 Introduction du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">31</td></tr>
      <tr><td class="toc-sec">8.2 Rôle de l'IA dans la plateforme (Suggestions & Détection pro active)</td><td><span class="toc-dots"></span></td><td class="toc-pg">31</td></tr>
      <tr><td class="toc-sec">8.3 Tableaux de bord intelligents et indicateurs KPI</td><td><span class="toc-dots"></span></td><td class="toc-pg">32</td></tr>
      <tr><td class="toc-sec">8.4 Perspectives Machine Learning & Business Intelligence</td><td><span class="toc-dots"></span></td><td class="toc-pg">32</td></tr>
      <tr><td class="toc-sec">8.5 Conclusion du chapitre</td><td><span class="toc-dots"></span></td><td class="toc-pg">32</td></tr>
      
      <tr><td class="toc-ch">Conclusion Générale</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">33</td></tr>
      <tr><td class="toc-ch">Bibliographie et Webographie</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">34</td></tr>
      <tr><td class="toc-ch">Annexes</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">35</td></tr>
    </table>
""", "Table des Matières", "vi")
pages.append(p6)

# ==================== PAGE 7: LISTE DES FIGURES ====================
p7 = make_page("""
    <h1 class="chapter-title">Liste des Figures</h1>
    <table class="toc-table">
      <tr><td class="toc-ch">Figure 1.1 — Frise chronologique de l'historique de l'ONEE (1963-2012)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">2</td></tr>
      <tr><td class="toc-ch">Figure 1.2 — Organigramme simplifié des principales directions de l'ONEE</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">3</td></tr>
      <tr><td class="toc-ch">Figure 2.1 — Cartographie du processus actuel de réservation des salles (existant)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">5</td></tr>
      <tr><td class="toc-ch">Figure 2.2 — Cartographie du processus actuel de gestion des véhicules (existant)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">5</td></tr>
      <tr><td class="toc-ch">Figure 3.1 — Diagramme de cas d'utilisation global du module de réservation des salles</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">9</td></tr>
      <tr><td class="toc-ch">Figure 3.2 — Diagramme de séquence : Réservation d'une salle de réunion</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">11</td></tr>
      <tr><td class="toc-ch">Figure 3.3 — Diagramme de séquence : Affectation d'un véhicule à une mission</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">11</td></tr>
      <tr><td class="toc-ch">Figure 3.4 — Diagramme de séquence : Authentification et génération du jeton JWT</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">11</td></tr>
      <tr><td class="toc-ch">Figure 3.5 — Diagramme de classes du domaine fonctionnel des réunions</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">12</td></tr>
      <tr style="background:#eff6ff;"><td class="toc-ch">Figure 4.1 — Architecture logicielle 3-Tiers du module de Réservation des Salles</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">15</td></tr>
      <tr style="background:#e0f2f1;"><td class="toc-ch">Figure 4.2 — Architecture logicielle 3-Tiers du module de Gestion du Parc Automobile</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">16</td></tr>
      <tr><td class="toc-ch">Figure 5.1 — Modèle Conceptuel de Données (MCD) global du système</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">19</td></tr>
      <tr><td class="toc-ch">Figure 5.2 — Schéma relationnel complet de la base de données (18 tables)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">20</td></tr>
      <tr><td class="toc-ch">Figure 6.1 — Écran d'accueil et tableau de bord général (Espace Employé SALA)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">24</td></tr>
      <tr><td class="toc-ch">Figure 6.2 — Portail de connexion sécurisé par jeton JWT</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">24</td></tr>
      <tr><td class="toc-ch">Figure 6.3 — Assistant Wizard 10 étapes : Étape 1 - Sélection de la date</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">25</td></tr>
      <tr><td class="toc-ch">Figure 6.4 — Assistant Wizard 10 étapes : Étape 2 - Définition du créneau horaire</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">25</td></tr>
      <tr><td class="toc-ch">Figure 6.5 — Assistant Wizard 10 étapes : Étape 8 - Sélection de la salle disponible</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">25</td></tr>
      <tr><td class="toc-ch">Figure 6.6 — Assistant Wizard 10 étapes : Étape 10 - Écran récapitulatif & confirmation</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">25</td></tr>
      <tr><td class="toc-ch">Figure 6.7 — Interface de planning des missions et d'affectation des véhicules</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">26</td></tr>
      <tr><td class="toc-ch">Figure 6.8 — Tableau de bord statistique avec indicateurs KPI et graphiques</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">27</td></tr>
    </table>
""", "Liste des Figures", "vii")
pages.append(p7)

# ==================== PAGE 8: LISTE DES TABLEAUX ====================
p8 = make_page("""
    <h1 class="chapter-title">Liste des Tableaux</h1>
    <table class="toc-table">
      <tr><td class="toc-ch">Tableau 1.1 — Principales directions centrales de l'ONEE et leurs domaines</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">3</td></tr>
      <tr><td class="toc-ch">Tableau 2.1 — Synthèse des problèmes identifiés dans les processus existants</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">6</td></tr>
      <tr><td class="toc-ch">Tableau 2.2 — Spécification des besoins fonctionnels du système</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">7</td></tr>
      <tr><td class="toc-ch">Tableau 3.1 — Acteurs du système et leurs responsabilités principales</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">9</td></tr>
      <tr><td class="toc-ch">Tableau 3.2 — Fiche descriptive du cas d'utilisation « Réserver une salle »</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">10</td></tr>
      <tr><td class="toc-ch">Tableau 4.1 — Organisation des couches logicielles du backend FastAPI</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">17</td></tr>
      <tr><td class="toc-ch">Tableau 4.2 — Matrice de justification des choix technologiques du projet</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">18</td></tr>
      <tr><td class="toc-ch">Tableau 5.1 — Extrait du Modèle Physique de Données (MPD) et indexation</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">20</td></tr>
      <tr><td class="toc-ch">Tableau 6.1 — Étapes du pipeline de réalisation suivi durant le stage</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">23</td></tr>
      <tr><td class="toc-ch">Tableau 6.2 — Parcours de réservation en 10 étapes conçu sous Figma</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">25</td></tr>
      <tr><td class="toc-ch">Tableau 6.3 — Extrait des principaux endpoints de l'API REST FastAPI</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">26</td></tr>
      <tr><td class="toc-ch">Tableau 7.1 — Synthèse des tests unitaires réalisés sur le backend Pytest</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">28</td></tr>
      <tr><td class="toc-ch">Tableau 7.2 — Résultats des tests de charge sous Locust (Simulations d'utilisateurs)</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">29</td></tr>
      <tr><td class="toc-ch">Tableau 8.1 — Principaux indicateurs de performance KPI intégrés au tableau de bord</td><td class="toc-ch"><span class="toc-dots"></span></td><td class="toc-pg">32</td></tr>
    </table>
""", "Liste des Tableaux", "viii")
pages.append(p8)

# ==================== PAGE 9: LISTE DES ABRÉVIATIONS ====================
p9 = make_page("""
    <h1 class="chapter-title">Liste des Abréviations</h1>
    <table class="data-table">
      <thead>
        <tr><th style="width:25%;">Abréviation</th><th>Signification & Description</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>API</strong></td><td>Application Programming Interface — Interface de programmation applicative</td></tr>
        <tr><td><strong>BI</strong></td><td>Business Intelligence — Informatique décisionnelle et analyse de données</td></tr>
        <tr><td><strong>CRUD</strong></td><td>Create, Read, Update, Delete — Opérations de base sur la persistance de données</td></tr>
        <tr><td><strong>DSI</strong></td><td>Direction des Systèmes d'Information (ONEE)</td></tr>
        <tr><td><strong>EMSI</strong></td><td>École Marocaine des Sciences de l'Ingénieur (Casablanca)</td></tr>
        <tr><td><strong>EPIC</strong></td><td>Établissement Public à Caractère Industriel et Commercial</td></tr>
        <tr><td><strong>HTTP / HTTPS</strong></td><td>HyperText Transfer Protocol (Secure) — Protocole de communication web sécurisé</td></tr>
        <tr><td><strong>IA / ML</strong></td><td>Intelligence Artificielle / Machine Learning (Apprentissage Automatique)</td></tr>
        <tr><td><strong>IHM / UI</strong></td><td>Interface Homme-Machine / User Interface (Interface Utilisateur)</td></tr>
        <tr><td><strong>JSON</strong></td><td>JavaScript Object Notation — Format standard d'échange de données léger</td></tr>
        <tr><td><strong>JWT</strong></td><td>JSON Web Token — Jeton de sécurité pour l'authentification stateless</td></tr>
        <tr><td><strong>KPI</strong></td><td>Key Performance Indicator — Indicateur clé de performance décisionnelle</td></tr>
        <tr><td><strong>MCD / MLD / MPD</strong></td><td>Modèle Conceptuel / Logique / Physique de Données (Méthodologie Merise)</td></tr>
        <tr><td><strong>ONE / ONEP / ONEE</strong></td><td>Office National de l'Électricité / Eau Potable / Fusion ONEE (2012)</td></tr>
        <tr><td><strong>ORM</strong></td><td>Object-Relational Mapping — Mapping objet-relationnel (ex: SQLAlchemy)</td></tr>
        <tr><td><strong>RBAC</strong></td><td>Role-Based Access Control — Contrôle d'accès basé sur les rôles utilisateur</td></tr>
        <tr><td><strong>REST</strong></td><td>Representational State Transfer — Style architectural des API web</td></tr>
        <tr><td><strong>SGBD</strong></td><td>Système de Gestion de Base de Données (ex: Microsoft SQL Server)</td></tr>
        <tr><td><strong>SPA</strong></td><td>Single Page Application — Application web à page unique (React.js)</td></tr>
        <tr><td><strong>UML</strong></td><td>Unified Modeling Language — Langage de modélisation unifié du génie logiciel</td></tr>
      </tbody>
    </table>
""", "Liste des Abréviations", "ix")
pages.append(p9)

# ==================== PAGE 10 (Page 1): INTRODUCTION GÉNÉRALE ====================
p10 = make_page("""
    <h1 class="chapter-title">Introduction Générale</h1>
    
    <h2>Contexte général et enjeu stratégique</h2>
    <p>La transformation numérique constitue aujourd'hui l'un des leviers stratégiques majeurs pour les grandes organisations publiques et privées. Elle conditionne leur capacité à améliorer l'efficacité de leurs processus internes, à réduire leurs coûts de fonctionnement et à offrir un meilleur service à leurs usagers comme à leurs collaborateurs. Les établissements publics marocains, à l'image de l'Office National de l'Électricité et de l'Eau Potable (ONEE), s'inscrivent pleinement dans cette dynamique en engageant des chantiers de modernisation de leurs systèmes d'information.</p>
    <p>Parmi ces processus figurent la gestion des ressources partagées, c'est-à-dire l'ensemble des moyens matériels et logistiques mutualisés entre plusieurs directions ou collaborateurs. Deux catégories de ressources partagées se distinguent particulièrement par leur caractère critique et leur fréquence d'utilisation quotidienne : les salles de réunion, indispensables à la coordination interne, et le parc automobile, essentiel à la mobilité des équipes techniques sur l'ensemble du territoire national.</p>
    <p>C'est dans ce contexte que s'inscrit le présent stage de fin d'année de 4<sup>ème</sup> année d'ingénieur (filière IA & Data à l'EMSI Casablanca), réalisé au sein de la Direction des Systèmes d'Information de l'ONEE du 01 juillet au 31 août 2026. L'objectif était de concevoir, développer et déployer une plateforme web intelligente unifiant la gestion de ces deux catégories de ressources.</p>

    <h2>Problématique centrale</h2>
    <p>Avant le lancement de ce projet, la gestion des salles de réunion et des véhicules reposait sur des outils manuels et dispersés (tableurs Excel, échanges par courriel, registres papier). Cette situation engendrait des conflits d'occupation fréquents, un manque de traçabilité, des pertes de temps considérables pour les gestionnaires et une incapacité à exploiter l'historique des données à des fins d'optimisation.</p>

    <h2>Objectifs du stage</h2>
    <ul>
      <li>Digitaliser intégralement le processus de réservation des salles et d'affectation des véhicules ;</li>
      <li>Concevoir une architecture trois tiers robuste, sécurisée et scalable basée sur React.js et FastAPI ;</li>
      <li>Modéliser et implémenter la base de données relationnelle sous SQL Server selon la démarche Merise / UML ;</li>
      <li>Intégrer des fonctionnalités d'intelligence artificielle apportant une réelle valeur décisionnelle ;</li>
      <li>Garantir la sécurité à travers une authentification JWT et une gestion fine des rôles (RBAC).</li>
    </ul>

    <h2>Structure du rapport</h2>
    <p>Le rapport s'articule autour de 8 chapitres : le cadre d'accueil (Ch. 1), l'analyse des besoins (Ch. 2), l'étude fonctionnelle UML (Ch. 3), la conception technique et les architectures (Ch. 4), la conception de la base de données (Ch. 5), la réalisation logicielle (Ch. 6), les tests et le déploiement (Ch. 7), et enfin la dimension IA et les perspectives d'évolution (Ch. 8).</p>
""", "Introduction Générale", "1")
pages.append(p10)

# Write out progress to print script running status
print(f"Added preliminary pages 1 to 10.")
''')
