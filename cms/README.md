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
├── site/                  # Template + assets + pages statiques
│   ├── member.html        # Template avec données exemple
│   ├── index.html         # Page d'accueil
│   ├── services.html      # Page services
│   ├── contact.html       # Page contact
│   ├── career.html        # Page carrière
│   ├── links.html         # Page liens
│   ├── css/               # Feuilles de style
│   │   ├── ui.css
│   │   ├── style.css
│   │   └── fonts/         # Icônes
│   ├── img/               # Images
│   └── js/                # Scripts JavaScript
└── build.js               # Générateur
```

**Note:** `team.html` est générée automatiquement et n'est pas dans `cms/site/`.

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

1. **Nettoyer** les anciens fichiers (pages et photos des membres supprimés)
2. Copier les assets (CSS, images générales) de `cms/site/` vers `docs/`
3. Copier les pages statiques (index, services, contact, career, links)
4. Copier les photos des membres actifs
5. Générer les pages HTML pour chaque membre
6. Sauvegarder dans `docs/` (19 pages pour 17 membres)

### Supprimer un membre

1. Supprimez le fichier JSON dans `cms/content/members/`
2. Supprimez la photo dans `cms/site/img/`
3. Lancez `npm run build`

Le build supprimera automatiquement :

- La page HTML du membre
- La photo du membre dans `docs/img/`

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
