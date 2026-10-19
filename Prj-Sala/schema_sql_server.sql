-- ============================================================
-- SCHÉMA RELATIONNEL SQL SERVER — SALA Réunion
-- Application de Gestion des Salles de Réunion
-- ============================================================
-- Auteur  : Généré automatiquement depuis le modèle de données
-- Version : 1.0
-- SGBD    : Microsoft SQL Server 2019+
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- 0. CRÉATION DE LA BASE DE DONNÉES
-- ════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SALA_Reunion')
BEGIN
    CREATE DATABASE SALA_Reunion
    COLLATE French_CI_AS;
END
GO

USE SALA_Reunion;
GO

-- ════════════════════════════════════════════════════════════
-- 1. TABLE : Entite (Directions / Départements)
-- ════════════════════════════════════════════════════════════
-- Référentiel des entités organisationnelles de l'office
-- ────────────────────────────────────────────────────────────
CREATE TABLE Entite (
    id_entite       INT             IDENTITY(1,1)   NOT NULL,
    nom_entite      NVARCHAR(100)   NOT NULL,
    description     NVARCHAR(500)   NULL,
    active          BIT             NOT NULL        DEFAULT 1,
    date_creation   DATETIME2       NOT NULL        DEFAULT GETDATE(),

    CONSTRAINT PK_Entite        PRIMARY KEY (id_entite),
    CONSTRAINT UQ_Entite_Nom    UNIQUE (nom_entite)
);
GO

-- ════════════════════════════════════════════════════════════
-- 2. TABLE : Utilisateur (Collaborateurs / Administrateurs)
-- ════════════════════════════════════════════════════════════
-- Comptes utilisateurs avec authentification
-- ────────────────────────────────────────────────────────────
CREATE TABLE Utilisateur (
    id_utilisateur  INT             IDENTITY(1,1)   NOT NULL,
    matricule       VARCHAR(20)     NOT NULL,
    prenom          NVARCHAR(50)    NOT NULL,
    nom             NVARCHAR(50)    NOT NULL,
    email           NVARCHAR(150)   NOT NULL,
    mot_de_passe    NVARCHAR(256)   NOT NULL,       -- Hash du mot de passe
    role            VARCHAR(10)     NOT NULL         DEFAULT 'user',
    id_entite       INT             NOT NULL,
    actif           BIT             NOT NULL         DEFAULT 1,
    date_creation   DATETIME2       NOT NULL         DEFAULT GETDATE(),
    date_modification DATETIME2     NULL,

    CONSTRAINT PK_Utilisateur           PRIMARY KEY (id_utilisateur),
    CONSTRAINT UQ_Utilisateur_Matricule UNIQUE (matricule),
    CONSTRAINT UQ_Utilisateur_Email     UNIQUE (email),
    CONSTRAINT CK_Utilisateur_Role      CHECK (role IN ('user', 'admin')),
    CONSTRAINT FK_Utilisateur_Entite    FOREIGN KEY (id_entite)
                                        REFERENCES Entite(id_entite)
);
GO

-- ════════════════════════════════════════════════════════════
-- 3. TABLE : Batiment (Bâtiments de l'office)
-- ════════════════════════════════════════════════════════════
CREATE TABLE Batiment (
    id_batiment     INT             IDENTITY(1,1)   NOT NULL,
    nom_batiment    NVARCHAR(100)   NOT NULL,
    adresse         NVARCHAR(300)   NULL,
    actif           BIT             NOT NULL         DEFAULT 1,

    CONSTRAINT PK_Batiment      PRIMARY KEY (id_batiment),
    CONSTRAINT UQ_Batiment_Nom  UNIQUE (nom_batiment)
);
GO

-- ════════════════════════════════════════════════════════════
-- 4. TABLE : Salle (Salles de réunion)
-- ════════════════════════════════════════════════════════════
-- Inventaire des salles avec caractéristiques physiques
-- ────────────────────────────────────────────────────────────
CREATE TABLE Salle (
    id_salle        INT             IDENTITY(1,1)   NOT NULL,
    nom_salle       NVARCHAR(100)   NOT NULL,
    etage           NVARCHAR(50)    NOT NULL,
    id_batiment     INT             NOT NULL,
    capacite        INT             NOT NULL,
    surface         NVARCHAR(20)    NULL,           -- Ex: '42 m²'
    description     NVARCHAR(500)   NULL,
    image_url       NVARCHAR(500)   NULL,
    couleur_accent  VARCHAR(7)      NULL,           -- Code hex ex: '#078d91'
    disponible      BIT             NOT NULL         DEFAULT 1,
    date_creation   DATETIME2       NOT NULL         DEFAULT GETDATE(),

    CONSTRAINT PK_Salle             PRIMARY KEY (id_salle),
    CONSTRAINT UQ_Salle_Nom         UNIQUE (nom_salle),
    CONSTRAINT CK_Salle_Capacite    CHECK (capacite > 0),
    CONSTRAINT FK_Salle_Batiment    FOREIGN KEY (id_batiment)
                                    REFERENCES Batiment(id_batiment)
);
GO

-- ════════════════════════════════════════════════════════════
-- 5. TABLE : Equipement (Catalogue d'équipements)
-- ════════════════════════════════════════════════════════════
-- Référentiel des types d'équipements disponibles
-- ────────────────────────────────────────────────────────────
CREATE TABLE Equipement (
    id_equipement   INT             IDENTITY(1,1)   NOT NULL,
    code            VARCHAR(30)     NOT NULL,       -- Ex: 'projector', 'whiteboard'
    libelle         NVARCHAR(100)   NOT NULL,       -- Ex: 'Vidéoprojecteur'
    type_equipement NVARCHAR(50)    NULL,           -- Ex: 'Écran', 'Visioconférence'
    icone           NVARCHAR(10)    NULL,           -- Emoji ou code icône
    nom_modele      NVARCHAR(150)   NULL,           -- Ex: 'Écran 4K Samsung'
    quantite_totale INT             NOT NULL         DEFAULT 1,
    operationnel    BIT             NOT NULL         DEFAULT 1,
    date_creation   DATETIME2       NOT NULL         DEFAULT GETDATE(),

    CONSTRAINT PK_Equipement        PRIMARY KEY (id_equipement),
    CONSTRAINT UQ_Equipement_Code   UNIQUE (code)
);
GO

-- ════════════════════════════════════════════════════════════
-- 6. TABLE : Salle_Equipement (Équipements installés par salle)
-- ════════════════════════════════════════════════════════════
-- Table d'association N:N entre Salle et Equipement
-- ────────────────────────────────────────────────────────────
CREATE TABLE Salle_Equipement (
    id_salle        INT     NOT NULL,
    id_equipement   INT     NOT NULL,
    quantite        INT     NOT NULL    DEFAULT 1,

    CONSTRAINT PK_Salle_Equipement  PRIMARY KEY (id_salle, id_equipement),
    CONSTRAINT FK_SE_Salle          FOREIGN KEY (id_salle)
                                    REFERENCES Salle(id_salle)
                                    ON DELETE CASCADE,
    CONSTRAINT FK_SE_Equipement     FOREIGN KEY (id_equipement)
                                    REFERENCES Equipement(id_equipement)
                                    ON DELETE CASCADE
);
GO

-- ════════════════════════════════════════════════════════════
-- 7. TABLE : Reservation (Réservations de salles)
-- ════════════════════════════════════════════════════════════
-- Cœur métier : chaque réservation d'une salle par un utilisateur
-- ────────────────────────────────────────────────────────────
CREATE TABLE Reservation (
    id_reservation  INT             IDENTITY(1,1)   NOT NULL,
    id_salle        INT             NOT NULL,
    id_utilisateur  INT             NOT NULL,
    date_reunion    DATE            NOT NULL,
    heure_debut     TIME(0)         NOT NULL,
    heure_fin       TIME(0)         NOT NULL,
    objet           NVARCHAR(300)   NOT NULL,       -- Objet / motif de la réunion
    nb_participants INT             NOT NULL         DEFAULT 1,
    pause_cafe      BIT             NOT NULL         DEFAULT 0,
    details_cafe    NVARCHAR(500)   NULL,           -- Composition souhaitée
    dejeuner        BIT             NOT NULL         DEFAULT 0,
    type_dejeuner   NVARCHAR(50)    NULL,           -- 'Self Service' | 'Service à table'
    statut          VARCHAR(20)     NOT NULL         DEFAULT 'confirmed',
    date_creation   DATETIME2       NOT NULL         DEFAULT GETDATE(),
    date_modification DATETIME2     NULL,

    CONSTRAINT PK_Reservation           PRIMARY KEY (id_reservation),
    CONSTRAINT CK_Reservation_Horaire   CHECK (heure_fin > heure_debut),
    CONSTRAINT CK_Reservation_Statut    CHECK (statut IN ('confirmed', 'pending', 'cancelled')),
    CONSTRAINT CK_Reservation_Dejeuner  CHECK (type_dejeuner IS NULL 
                                                OR type_dejeuner IN ('Self Service', N'Service à table')),
    CONSTRAINT CK_Reservation_Participants CHECK (nb_participants >= 1),
    CONSTRAINT FK_Reservation_Salle     FOREIGN KEY (id_salle)
                                        REFERENCES Salle(id_salle),
    CONSTRAINT FK_Reservation_Utilisateur FOREIGN KEY (id_utilisateur)
                                        REFERENCES Utilisateur(id_utilisateur)
);
GO

-- ════════════════════════════════════════════════════════════
-- 8. TABLE : Reservation_Equipement (Équipements demandés)
-- ════════════════════════════════════════════════════════════
-- Équipements spécifiquement demandés pour une réservation
-- ────────────────────────────────────────────────────────────
CREATE TABLE Reservation_Equipement (
    id_reservation  INT     NOT NULL,
    id_equipement   INT     NOT NULL,

    CONSTRAINT PK_Reservation_Equipement PRIMARY KEY (id_reservation, id_equipement),
    CONSTRAINT FK_RE_Reservation    FOREIGN KEY (id_reservation)
                                    REFERENCES Reservation(id_reservation)
                                    ON DELETE CASCADE,
    CONSTRAINT FK_RE_Equipement     FOREIGN KEY (id_equipement)
                                    REFERENCES Equipement(id_equipement)
);
GO

-- ════════════════════════════════════════════════════════════
-- 9. TABLE : Participant (Invités internes et externes)
-- ════════════════════════════════════════════════════════════
-- Personnes invitées à une réunion (employés ou visiteurs)
-- ────────────────────────────────────────────────────────────
CREATE TABLE Participant (
    id_participant  INT             IDENTITY(1,1)   NOT NULL,
    id_reservation  INT             NOT NULL,
    type_participant VARCHAR(15)    NOT NULL,        -- 'employe' | 'visiteur'
    prenom          NVARCHAR(50)    NOT NULL,
    nom             NVARCHAR(50)    NOT NULL,
    matricule       VARCHAR(20)     NULL,            -- Pour les employés
    service         NVARCHAR(100)   NULL,            -- Pour les employés
    fonction        NVARCHAR(100)   NULL,            -- Pour les visiteurs
    societe         NVARCHAR(150)   NULL,            -- Pour les visiteurs

    CONSTRAINT PK_Participant       PRIMARY KEY (id_participant),
    CONSTRAINT CK_Participant_Type  CHECK (type_participant IN ('employe', 'visiteur')),
    CONSTRAINT FK_Participant_Reservation FOREIGN KEY (id_reservation)
                                    REFERENCES Reservation(id_reservation)
                                    ON DELETE CASCADE
);
GO

-- ════════════════════════════════════════════════════════════
-- 10. TABLE : Liste_Attente (Demandes en attente d'affectation)
-- ════════════════════════════════════════════════════════════
-- Demandes de réunion sans salle affectée
-- ────────────────────────────────────────────────────────────
CREATE TABLE Liste_Attente (
    id_attente      INT             IDENTITY(1,1)   NOT NULL,
    id_utilisateur  INT             NOT NULL,
    date_souhaitee  DATE            NOT NULL,
    heure_debut     TIME(0)         NOT NULL,
    heure_fin       TIME(0)         NOT NULL,
    nb_participants INT             NOT NULL         DEFAULT 1,
    objet           NVARCHAR(300)   NOT NULL,
    pause_cafe      BIT             NOT NULL         DEFAULT 0,
    statut          VARCHAR(20)     NOT NULL         DEFAULT 'pending',
    id_reservation  INT             NULL,            -- Rempli quand la demande est affectée
    date_creation   DATETIME2       NOT NULL         DEFAULT GETDATE(),
    date_traitement DATETIME2       NULL,

    CONSTRAINT PK_Liste_Attente         PRIMARY KEY (id_attente),
    CONSTRAINT CK_Attente_Horaire       CHECK (heure_fin > heure_debut),
    CONSTRAINT CK_Attente_Statut        CHECK (statut IN ('pending', 'approved', 'rejected')),
    CONSTRAINT FK_Attente_Utilisateur   FOREIGN KEY (id_utilisateur)
                                        REFERENCES Utilisateur(id_utilisateur),
    CONSTRAINT FK_Attente_Reservation   FOREIGN KEY (id_reservation)
                                        REFERENCES Reservation(id_reservation)
);
GO

-- ════════════════════════════════════════════════════════════
-- 11. TABLE : Notification (Notifications utilisateurs)
-- ════════════════════════════════════════════════════════════
CREATE TABLE Notification (
    id_notification INT             IDENTITY(1,1)   NOT NULL,
    id_utilisateur  INT             NOT NULL,
    type_notif      VARCHAR(20)     NOT NULL         DEFAULT 'info',
    titre           NVARCHAR(200)   NOT NULL,
    message         NVARCHAR(1000)  NOT NULL,
    lu              BIT             NOT NULL         DEFAULT 0,
    date_creation   DATETIME2       NOT NULL         DEFAULT GETDATE(),

    CONSTRAINT PK_Notification          PRIMARY KEY (id_notification),
    CONSTRAINT CK_Notification_Type     CHECK (type_notif IN ('success', 'info', 'warning', 'danger')),
    CONSTRAINT FK_Notification_Utilisateur FOREIGN KEY (id_utilisateur)
                                        REFERENCES Utilisateur(id_utilisateur)
                                        ON DELETE CASCADE
);
GO

-- ════════════════════════════════════════════════════════════
-- 12. TABLE : Journal_Activite (Logs d'audit)
-- ════════════════════════════════════════════════════════════
-- Traçabilité de toutes les actions dans le système
-- ────────────────────────────────────────────────────────────
CREATE TABLE Journal_Activite (
    id_log          INT             IDENTITY(1,1)   NOT NULL,
    action          VARCHAR(20)     NOT NULL,        -- 'create', 'update', 'delete', 'login'
    message         NVARCHAR(500)   NOT NULL,
    matricule_user  VARCHAR(20)     NOT NULL,        -- Matricule de l'utilisateur
    adresse_ip      VARCHAR(45)     NULL,
    date_action     DATETIME2       NOT NULL         DEFAULT GETDATE(),

    CONSTRAINT PK_Journal_Activite  PRIMARY KEY (id_log),
    CONSTRAINT CK_Log_Action        CHECK (action IN ('create', 'update', 'delete', 'login', 'logout'))
);
GO


-- ════════════════════════════════════════════════════════════
-- INDEX POUR LES PERFORMANCES
-- ════════════════════════════════════════════════════════════

-- Recherche rapide des réservations par date
CREATE NONCLUSTERED INDEX IX_Reservation_Date
    ON Reservation(date_reunion, statut)
    INCLUDE (id_salle, id_utilisateur, heure_debut, heure_fin);
GO

-- Recherche des réservations par utilisateur
CREATE NONCLUSTERED INDEX IX_Reservation_Utilisateur
    ON Reservation(id_utilisateur, date_reunion)
    INCLUDE (statut);
GO

-- Recherche des réservations par salle
CREATE NONCLUSTERED INDEX IX_Reservation_Salle
    ON Reservation(id_salle, date_reunion, statut);
GO

-- Vérification de conflit horaire (crucial pour éviter les chevauchements)
CREATE NONCLUSTERED INDEX IX_Reservation_Conflit
    ON Reservation(id_salle, date_reunion, heure_debut, heure_fin)
    WHERE statut = 'confirmed';
GO

-- Notifications non lues par utilisateur
CREATE NONCLUSTERED INDEX IX_Notification_NonLu
    ON Notification(id_utilisateur, lu)
    WHERE lu = 0;
GO

-- Liste d'attente par statut
CREATE NONCLUSTERED INDEX IX_Attente_Statut
    ON Liste_Attente(statut, date_souhaitee);
GO

-- Journal d'activité par date
CREATE NONCLUSTERED INDEX IX_Log_Date
    ON Journal_Activite(date_action DESC);
GO


-- ════════════════════════════════════════════════════════════
-- DONNÉES DE DÉMONSTRATION
-- ════════════════════════════════════════════════════════════

-- ── Entités ───────────────────────────────────────────────
INSERT INTO Entite (nom_entite) VALUES
    (N'Direction Générale'),
    (N'Direction Commerciale'),
    (N'Direction Financière'),
    (N'Direction RH'),
    (N'Direction Technique'),
    (N'Direction Juridique'),
    (N'Direction IT'),
    (N'Moyens Généraux'),
    (N'Direction Audit'),
    (N'Direction Communication'),
    (N'Direction Achats');
GO

-- ── Utilisateurs ──────────────────────────────────────────
-- Note : les mots de passe doivent être hashés en production
INSERT INTO Utilisateur (matricule, prenom, nom, email, mot_de_passe, role, id_entite, actif) VALUES
    ('CAD-1042', N'Yassine',  N'Amrani',     N'y.amrani@office.ma',     N'Cadre2026!',  'user',  2, 1),
    ('ADM-001',  N'Nadia',    N'El Fassi',   N'n.elfassi@office.ma',    N'Admin2026!',  'admin', 8, 1),
    ('CAD-2091', N'Mehdi',    N'Benhaddou',  N'm.benhaddou@office.ma',  N'Cadre2026!',  'user',  3, 1),
    ('CAD-3045', N'Houda',    N'Mansouri',   N'h.mansouri@office.ma',   N'Cadre2026!',  'user',  4, 1),
    ('CAD-1187', N'Omar',     N'Zekri',      N'o.zekri@office.ma',      N'Cadre2026!',  'user',  5, 0),
    ('CAD-2234', N'Sanaa',    N'Tahiri',     N's.tahiri@office.ma',     N'Cadre2026!',  'user',  6, 1),
    ('CAD-3302', N'Amine',    N'Cherkaoui',  N'a.cherkaoui@office.ma',  N'Cadre2026!',  'user',  7, 1);
GO

-- ── Bâtiments ─────────────────────────────────────────────
INSERT INTO Batiment (nom_batiment) VALUES
    (N'Bâtiment A'),
    (N'Bâtiment B'),
    (N'Direction Générale'),
    (N'Bâtiment C');
GO

-- ── Salles ────────────────────────────────────────────────
INSERT INTO Salle (nom_salle, etage, id_batiment, capacite, surface, description, image_url, couleur_accent, disponible) VALUES
    (N'Salle Atlas',   N'2e étage',   1, 14, N'42 m²', N'Grande salle de conférence équipée pour les réunions de direction avec visioconférence HD.', N'https://images.unsplash.com/photo-1497366754035-f200968a6e72', '#078d91', 1),
    (N'Salle Oasis',   N'RDC',        2,  8, N'24 m²', N'Salle agile conçue pour les petites équipes et les ateliers créatifs.',                       N'https://images.unsplash.com/photo-1497366811353-6870744d04b2', '#156aa3', 1),
    (N'Salle Horizon', N'4e étage',   3, 20, N'65 m²', N'Espace premium de la direction générale avec vue panoramique.',                               N'https://images.unsplash.com/photo-1497366216548-37526070297c', '#ef922f', 1),
    (N'Salle Sahara',  N'1er étage',  4,  6, N'18 m²', N'Petite salle de réunion intime pour les entretiens et réunions restreintes.',                 N'https://images.unsplash.com/photo-1524758631624-e2822e304c36', '#c25b14', 0),
    (N'Salle Rif',     N'3e étage',   1, 30, N'90 m²', N'Grande salle de formation et séminaires avec disposition flexible.',                          N'https://images.unsplash.com/photo-1431540015161-0bf868a2d407', '#1a7a8a', 1);
GO

-- ── Équipements ───────────────────────────────────────────
INSERT INTO Equipement (code, libelle, type_equipement, icone, nom_modele, quantite_totale) VALUES
    ('projector',   N'Vidéoprojecteur',  N'Projecteur',       N'📽️', N'Vidéoprojecteur Epson',          2),
    ('whiteboard',  N'Tableau blanc',    N'Tableau',          N'🪟', N'Tableau blanc magnétique',        5),
    ('paperboard',  N'Paperboard',       N'Tableau',          N'📋', NULL,                              3),
    ('interactive', N'Écran interactif', N'Écran',            N'🖥️', N'Écran 4K Samsung',               3),
    ('internet',    N'Internet',         N'Réseau',           N'🌐', N'Internet fibre',                 5),
    ('camera',      N'Caméra',           N'Caméra',           N'📷', N'Caméra Logitech 4K',             3),
    ('microphone',  N'Microphone',       N'Audio',            N'🎤', N'Microphone de table',            6),
    ('computer',    N'Ordinateur',       N'Informatique',     N'💻', NULL,                              3),
    ('visio',       N'Visioconférence',  N'Visioconférence',  N'📹', N'Système Teams Room',             2),
    ('other',       N'Autres',           N'Divers',           N'➕', NULL,                              0);
GO

-- ── Équipements par Salle ─────────────────────────────────
-- Salle Atlas : Écran 4K, Visioconférence, Tableau blanc, Microphone, Caméra HD, Internet
INSERT INTO Salle_Equipement (id_salle, id_equipement) VALUES
    (1, 4), (1, 9), (1, 2), (1, 7), (1, 6), (1, 5);

-- Salle Oasis : Teams Room, Tableau interactif, Paperboard, Internet
INSERT INTO Salle_Equipement (id_salle, id_equipement) VALUES
    (2, 9), (2, 4), (2, 3), (2, 5);

-- Salle Horizon : Double écran, Sonorisation, Caméra 360°, Visioconférence, Tableau blanc, Ordinateur
INSERT INTO Salle_Equipement (id_salle, id_equipement) VALUES
    (3, 4), (3, 7), (3, 6), (3, 9), (3, 2), (3, 8);

-- Salle Sahara : Écran, Paperboard, Internet
INSERT INTO Salle_Equipement (id_salle, id_equipement) VALUES
    (4, 4), (4, 3), (4, 5);

-- Salle Rif : Vidéoprojecteur, Tableau blanc, Microphone, Internet, Ordinateur
INSERT INTO Salle_Equipement (id_salle, id_equipement) VALUES
    (5, 1), (5, 2), (5, 7), (5, 5), (5, 8);
GO

-- ── Réservations de démonstration ─────────────────────────
INSERT INTO Reservation (id_salle, id_utilisateur, date_reunion, heure_debut, heure_fin, objet, nb_participants, pause_cafe, dejeuner, type_dejeuner, statut) VALUES
    (1, 1, CAST(GETDATE() AS DATE), '09:00', '11:00', N'Comité de pilotage Q3',       10, 1, 0, NULL,              'confirmed'),
    (2, 3, CAST(GETDATE() AS DATE), '14:00', '15:30', N'Revue budgétaire mensuelle',   5, 0, 0, NULL,              'confirmed'),
    (3, 2, CAST(GETDATE() AS DATE), '10:00', '12:00', N'Conseil de direction',         18, 1, 1, N'Service à table','confirmed'),
    (1, 4, DATEADD(DAY, 1, CAST(GETDATE() AS DATE)), '09:30', '11:30', N'Entretiens annuels RH',   8, 1, 0, NULL, 'confirmed'),
    (2, 1, DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), '11:00', '12:30', N'Point hebdomadaire équipe', 6, 0, 0, NULL, 'confirmed'),
    (5, 7, DATEADD(DAY, 3, CAST(GETDATE() AS DATE)), '08:30', '17:00', N'Formation Cybersécurité', 25, 1, 1, N'Self Service', 'confirmed'),
    (4, 6, DATEADD(DAY,-2, CAST(GETDATE() AS DATE)), '15:00', '16:30', N'Réunion contrats',          4, 0, 0, NULL, 'cancelled'),
    (1, 1, DATEADD(DAY,-5, CAST(GETDATE() AS DATE)), '10:00', '12:00', N'Réunion partenaires',      12, 1, 0, NULL, 'confirmed');
GO

-- ── Liste d'attente ───────────────────────────────────────
INSERT INTO Liste_Attente (id_utilisateur, date_souhaitee, heure_debut, heure_fin, nb_participants, objet, pause_cafe, statut) VALUES
    (3, DATEADD(DAY, 1, CAST(GETDATE() AS DATE)), '14:00', '16:00', 12, N'Présentation résultats S1', 1, 'pending'),
    (6, DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), '09:00', '11:00',  7, N'Atelier conformité RGPD',   0, 'pending');
GO

-- ── Notifications de démonstration ────────────────────────
INSERT INTO Notification (id_utilisateur, type_notif, titre, message, lu) VALUES
    (1, 'success', N'Réservation confirmée',   N'Votre réservation de la Salle Atlas est confirmée.',          0),
    (1, 'info',    N'Rappel de réunion',       N'Vous avez une réunion dans 30 minutes : Comité de pilotage.',  0),
    (1, 'warning', N'Demande en attente',      N'Votre demande de salle est en cours de traitement.',          1),
    (1, 'success', N'Pause-café validée',      N'La pause-café pour votre réunion a été confirmée.',           1),
    (1, 'info',    N'Nouveau créneau',         N'La Salle Horizon est maintenant disponible demain.',          1);
GO

-- ── Journal d'activité ────────────────────────────────────
INSERT INTO Journal_Activite (action, message, matricule_user, adresse_ip) VALUES
    ('create', N'Réservation Salle Atlas créée par Yassine Amrani',          'CAD-1042', '192.168.1.42'),
    ('login',  N'Connexion de Nadia El Fassi depuis 192.168.1.45',           'ADM-001',  '192.168.1.45'),
    ('update', N'Capacité de la Salle Rif modifiée : 25 → 30 personnes',     'ADM-001',  '192.168.1.45'),
    ('delete', N'Réservation #7 annulée par Sanaa Tahiri',                   'CAD-2234', '192.168.1.50'),
    ('create', N'Utilisateur Amine Cherkaoui ajouté à l''annuaire',          'ADM-001',  '192.168.1.45'),
    ('update', N'Statut de la demande #2 mis à jour : en attente',           'ADM-001',  '192.168.1.45');
GO


-- ════════════════════════════════════════════════════════════
-- VUES UTILES
-- ════════════════════════════════════════════════════════════

-- ── Vue : Réservations détaillées ─────────────────────────
CREATE VIEW v_Reservations_Detaillees AS
SELECT
    r.id_reservation,
    r.date_reunion,
    r.heure_debut,
    r.heure_fin,
    r.objet,
    r.nb_participants,
    r.pause_cafe,
    r.dejeuner,
    r.type_dejeuner,
    r.statut,
    r.date_creation,
    s.nom_salle,
    s.etage,
    b.nom_batiment,
    s.capacite,
    u.matricule,
    u.prenom + ' ' + u.nom     AS nom_complet,
    u.email,
    e.nom_entite                AS entite_utilisateur
FROM Reservation r
    INNER JOIN Salle s          ON r.id_salle = s.id_salle
    INNER JOIN Batiment b       ON s.id_batiment = b.id_batiment
    INNER JOIN Utilisateur u    ON r.id_utilisateur = u.id_utilisateur
    INNER JOIN Entite e         ON u.id_entite = e.id_entite;
GO

-- ── Vue : Salles avec nombre d'équipements ────────────────
CREATE VIEW v_Salles_Equipements AS
SELECT
    s.id_salle,
    s.nom_salle,
    s.etage,
    b.nom_batiment,
    s.capacite,
    s.surface,
    s.disponible,
    COUNT(se.id_equipement)     AS nb_equipements,
    STRING_AGG(eq.libelle, ', ') WITHIN GROUP (ORDER BY eq.libelle) AS equipements
FROM Salle s
    INNER JOIN Batiment b       ON s.id_batiment = b.id_batiment
    LEFT JOIN Salle_Equipement se ON s.id_salle = se.id_salle
    LEFT JOIN Equipement eq     ON se.id_equipement = eq.id_equipement
GROUP BY s.id_salle, s.nom_salle, s.etage, b.nom_batiment, s.capacite, s.surface, s.disponible;
GO

-- ── Vue : Statistiques du jour ────────────────────────────
CREATE VIEW v_Statistiques_Jour AS
SELECT
    (SELECT COUNT(*) FROM Salle WHERE disponible = 1)                                                AS salles_actives,
    (SELECT COUNT(*) FROM Salle)                                                                      AS total_salles,
    (SELECT COUNT(*) FROM Reservation WHERE date_reunion = CAST(GETDATE() AS DATE) AND statut = 'confirmed') AS reservations_jour,
    (SELECT COUNT(*) FROM Liste_Attente WHERE statut = 'pending')                                     AS demandes_en_attente,
    (SELECT COUNT(*) FROM Utilisateur WHERE actif = 1)                                                AS utilisateurs_actifs,
    (SELECT COUNT(*) FROM Utilisateur)                                                                AS total_utilisateurs;
GO


-- ════════════════════════════════════════════════════════════
-- PROCÉDURE : Vérification de conflit horaire
-- ════════════════════════════════════════════════════════════
CREATE PROCEDURE sp_Verifier_Conflit
    @id_salle       INT,
    @date_reunion   DATE,
    @heure_debut    TIME(0),
    @heure_fin      TIME(0),
    @conflit        BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM Reservation
        WHERE id_salle = @id_salle
          AND date_reunion = @date_reunion
          AND statut = 'confirmed'
          AND heure_debut < @heure_fin
          AND heure_fin > @heure_debut
    )
        SET @conflit = 1;
    ELSE
        SET @conflit = 0;
END;
GO


-- ════════════════════════════════════════════════════════════
-- FIN DU SCRIPT
-- ════════════════════════════════════════════════════════════
PRINT '✅ Base de données SALA_Reunion créée avec succès.';
PRINT '   • 12 tables créées';
PRINT '   • 7 index de performance';
PRINT '   • 3 vues utilitaires';
PRINT '   • 1 procédure stockée';
PRINT '   • Données de démonstration insérées';
GO
