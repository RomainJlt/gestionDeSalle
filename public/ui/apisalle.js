const express = require("express"); 
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

// Connexion à la base de données
const db = new sqlite3.Database("database.db");

// Récupérer toutes les salles
router.get("/", (_req, res) => {
    db.all("SELECT * FROM salles", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Erreur lors de la récupération des salles." });
        } else {
            res.json(rows);
        }
    });
});

// Ajouter une nouvelle salle
router.post("/", (req, res) => {
    const { numero, etage, capacite, equipements, disponible } = req.body;
    if (!numero || etage == null || capacite == null || disponible == null) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    db.run(
        "INSERT INTO salles (numero, etage, capacite, equipements, disponible) VALUES (?, ?, ?, ?, ?)",
        [numero, etage, capacite, equipements || "", disponible],
        function (err) {
            if (err) {
                res.status(500).json({ error: "Erreur lors de l'ajout de la salle." });
            } else {
                res.json({ id: this.lastID, message: "Salle ajoutée avec succès." });
            }
        }
    );
});

// Modifier une salle
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { numero, etage, capacite, equipements, disponible } = req.body;

    db.run(
        "UPDATE salles SET numero = ?, etage = ?, capacite = ?, equipements = ?, disponible = ? WHERE id = ?",
        [numero, etage, capacite, equipements || "", disponible, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: "Erreur lors de la mise à jour de la salle." });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Salle non trouvée." });
            } else {
                res.json({ message: "Salle mise à jour avec succès." });
            }
        }
    );
});

// Supprimer une salle
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM salles WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(500).json({ error: "Erreur lors de la suppression de la salle." });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "Salle non trouvée." });
        } else {
            res.json({ message: "Salle supprimée avec succès." });
        }
    });
});

module.exports = router;
