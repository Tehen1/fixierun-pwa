# FixieRun PWA

Application Progressive Web App pour le suivi d'activités vélo.

## Fonctionnalités

- Suivi des performances en temps réel
- Fonctionnement hors ligne
- Installation sur appareil (PWA)
- Synchronisation des données lorsque la connexion revient
- Interface responsive

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/tehen1/fixierun-pwa.git
```

2. Accéder au dossier :
```bash
cd fixierun-pwa
```

## Déploiement sur GitHub Pages

1. Pousser le code sur GitHub
2. Aller dans Settings → Pages
3. Configurer :
   - Source : Deploy from a branch
   - Branch : main / (root)
4. L'application sera disponible à l'adresse :
   `https://tehen1.github.io/fixierun-pwa/`

## Développement

Pour tester localement :
```bash
npx serve .
```

## Tests

Exécuter les tests Lighthouse :
```bash
npx lighthouse https://tehen1.github.io/fixierun-pwa/ --output html
```

## Technologies

- HTML5
- CSS3
- JavaScript
- Service Workers
- Web App Manifest
# fixierun-pwa
