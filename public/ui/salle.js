document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/salles")
        .then(response => response.json())
        .then(data => afficherSalles(data))
        .catch(error => console.error("Erreur lors de la récupération des salles:", error));
});

function afficherSalles(salles) {
    const tableBody = document.getElementById("sallesTable");
    tableBody.innerHTML = ""; // On nettoie le tableau avant d'ajouter les nouvelles données

    salles.forEach(salle => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${salle.id}</td>
            <td>${salle.numero_de_salle}</td>
            <td>${salle.etage}</td>
            <td>${salle.capacite}</td>
            <td>${salle.equipements ? salle.equipements.split(',').join(", ") : "Aucun"}</td>
            <td>${salle.disponibilite ? "✅ Disponible" : "❌ Occupée"}</td>
            <td>
                <button class="btn btn-primary" onclick="editerSalle(${salle.id})">Éditer</button>
                <button class="btn btn-danger" onclick="supprimerSalle(${salle.id})">Supprimer</button>
            </td>
            <td>
                <button class="btn btn-primary" onclick="reserverSalle(${salle.id})">Réserver</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
