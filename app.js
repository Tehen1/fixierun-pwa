// Configuration de base de l'application FixieRun PWA
console.log('Application FixieRun initialisée');

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker enregistré avec succès:', registration.scope);
            })
            .catch(error => {
                console.log('Échec de l\'enregistrement du ServiceWorker:', error);
            });
    });
}

// Logique principale de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Chargement initial de l'application
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>FixieRun PWA</h1>
        <p>Application de suivi d'activité vélo</p>
        <div id="content"></div>
    `;

    // Simulation de données
    const mockData = {
        distance: '25 km',
        duration: '1h15',
        calories: '850 kcal'
    };

    // Affichage des données
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="stats">
            <p>Distance: ${mockData.distance}</p>
            <p>Durée: ${mockData.duration}</p>
            <p>Calories: ${mockData.calories}</p>
        </div>
    `;
});

// Gestion du mode hors ligne
window.addEventListener('offline', () => {
    document.getElementById('app').innerHTML += `
        <div class="offline-notice">
            Mode hors ligne activé - certaines fonctionnalités peuvent être limitées
        </div>
    `;
});
