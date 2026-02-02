# CMS - Clinique de Psychologie Urbania

Système de gestion de contenu simple pour générer les pages du site web.

## Structure

```
cms/
├── content/               # Données (JSON)
│   └── members/           # Fichiers des membres
│       ├── AndreaRiddle.json
│       ├── FranciscaGagne.json
│       └── ... (17 fichiers)
├── site/                  # Template + assets (visualisable en local)
│   ├── member.html        # Template avec données exemple
│   ├── css/               # Feuilles de style
│   │   ├── ui.css
│   │   ├── style.css
│   │   └── fonts/         # Icônes
│   ├── img/               # Images des membres
│   └── js/                # Scripts JavaScript
└── build.js               # Générateur
```

## Fonctionnement

### 1. Modifier le template

Éditez `cms/site/member.html` pour changer l'apparence des pages.

Le template contient des données exemple (Andrea Riddle) et s'ouvre directement dans le navigateur pour tester le rendu avec CSS.

### 2. Syntaxe des templates

- `{{variable}}` - Variable simple (HTML échappé)
- `{{{variable}}}` - Variable HTML brut (non échappé)

Variables disponibles :
- `{{name}}` - Nom du membre
- `{{photo}}` - Chemin de la photo
- `{{academic}}` - Titre académique
- `{{{languageLinks}}}` - Liens de changement de langue
- `{{{contactInfo}}}` - Téléphone, email
- `{{{sections}}}` - Contenu des sections
- `{{year}}` - Année courante

### 3. Modifier les données

Les données des membres sont dans `cms/content/members/*.json`.

### 4. Générer le site

```bash
npm run build
```

Cela va :
1. Copier les assets (CSS, images) de `cms/site/` vers `docs/`
2. Générer les pages HTML pour chaque membre
3. Sauvegarder dans `docs/` (19 pages pour 17 membres)

## Commandes

```bash
# Générer le site
npm run build

# Générer + serveur local
npm run dev
```

## Workflow de développement

1. Ouvrez `cms/site/member.html` dans le navigateur
2. Modifiez le template et rafraîchissez pour voir les changements
3. Lancez `npm run build` pour générer le site final
4. Déployez le contenu de `docs/`
