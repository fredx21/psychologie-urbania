/**
 * Script de génération des pages HTML des membres à partir des fichiers JSON
 * Remplace l'ancien système XSL/XML
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  jsonDir: path.join(__dirname, 'output', 'members-json'),
  outputDir: path.join(__dirname, 'docs'),
  currentYear: new Date().getFullYear()
};

/**
 * Remplace les caractères | par des <br/> dans le texte
 * Équivalent à la fonction replace-linefeed dans common.xsl
 * @param {string} text - Texte à traiter
 * @returns {string} - Texte avec les | remplacés par <br/>
 */
function replaceLineFeed(text) {
  if (!text) return '';
  return text.replace(/\|/g, '<br/>');
}

/**
 * Génère le HTML pour les liens de langue
 * @param {Array} languages - Tableau des langues
 * @param {string} currentCode - Code de la langue courante
 * @param {string} pageName - Nom de la page
 * @returns {string} - HTML des liens de langue
 */
function generateLanguageLinks(languages, currentCode, pageName) {
  if (languages.length <= 1) {
    return '';
  }

  let html = '<div class="navigationHeader language">';

  languages.forEach(lang => {
    const isCurrent = lang.code === currentCode;
    const href = lang.code === '' ? pageName : `${pageName}-${lang.code}`;

    html += `<a class="${isCurrent ? 'currentpage' : ''}" href="${href}">${lang.name}</a>`;
  });

  html += '</div>';
  return html;
}

/**
 * Génère le HTML pour les informations de contact
 * @param {Object} member - Données du membre
 * @returns {string} - HTML des informations de contact
 */
function generateContactInfo(member) {
  let html = '';

  // Téléphone
  if (member.phoneNumber) {
    html += `&nbsp;<p>Tel:</p><h2><span class="texthighlightcolor"><div class="icon icon-phone"></div>${member.phoneNumber}</span></h2>`;
  }

  // Email
  if (member.emailAddress) {
    html += `&nbsp;<p>Courriel:</p><h2><span class="texthighlightcolor"><a href="mailto:${member.emailAddress}"><div class="icon icon-envelope"></div>${member.emailAddress}</a></span></h2>`;
  }

  // Site web
  if (member.webSite) {
    html += `&nbsp;<p>Liens:</p><h2><span class="texthighlightcolor"><a href="${member.webSite}"><div class="icon icon-globe"></div>Site web</a></span></h2>`;
  }

  return html;
}

/**
 * Génère le HTML pour les sections du contenu
 * @param {Object} pageData - Données de la page
 * @returns {string} - HTML des sections
 */
function generateSections(pageData) {
  if (!pageData || !pageData.sections) {
    return '';
  }

  let html = '';

  pageData.sections.forEach(section => {
    // Titre de section (si présent)
    if (section.title) {
      html += `
      <div class="section cf">
        <div class="header lightgray">
          <h3>
            <span>${section.title}</span>
          </h3>
        </div>
      </div>`;
    }

    // Contenu de la section
    if (section.description) {
      const processedDescription = replaceLineFeed(section.description);
      html += `
      <div class="sectiontext">
        ${processedDescription}
      </div>`;
    }
  });

  return html;
}

/**
 * Génère le HTML complet d'une page membre
 * @param {Object} member - Données du membre
 * @param {Object} language - Données de la langue courante
 * @param {Array} allLanguages - Toutes les langues disponibles
 * @returns {string} - HTML complet de la page
 */
function generateMemberPage(member, language, allLanguages) {
  const languageLinks = generateLanguageLinks(allLanguages, language.code, member.pageName);
  const contactInfo = generateContactInfo(member);
  const sections = generateSections(language.page);

  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="author" content="Frederic Savard" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Clinique de psychologie Urbania</title>
  <link rel="stylesheet" href="css/ui.css" />
  <link rel="stylesheet" href="css/style.css" />
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-40245323-1', 'psychologie-urbania.com');
    ga('send', 'pageview');
  </script>
</head>
<body>
  <div class="introContainer">
    <div id="intro">
      <div class="logo">Clinique de Psychologie Urbania</div>
      <div class="navigationHeader">
        <p><span><a href="./">accueil</a><a class="currentpage" href="team">équipe</a><a href="services">services</a><a href="career">carrière</a><a href="contact">contact</a><a href="links">liens</a></span></p>
      </div>
    </div>
  </div>
  <div class="mainContainer">
    <div class="content">
      <div class="header">
        ${languageLinks}
        <h3>
          <span>${member.name}, <span>${language.academic}</span></span>
        </h3>
      </div>
      <div class="cf">
        <div class="col2_66_33">
          <div class="section cf"><div class="memberPhotoWrap"><div class="memberPhoto" style="background-image:url('${member.photo}')"></div></div></div>
          <div class="section cf">
            <div id="contactus">
              <h1>
                <span>Contact</span>
              </h1>
              ${contactInfo}
            </div>
          </div>
        </div>
        <div class="col1_66_33">
          ${sections}
          <hr/>
          <div class="sectiontext warning">
            NOTE: Les informations présentées sur cette page sont sous la responsabilité de leur auteur. La Clinique de psychologie Urbania n'intervient pas dans le contenu des pages personnelles ni dans la pratique des professionnels.
          </div>
        </div>
      </div>
      <hr/>
      <div class="sectiontext copyright">
        Copyright ${CONFIG.currentYear} © Clinique de Psychologie Urbania. Tous droits réservés.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Traite un fichier JSON de membre et génère les pages HTML
 * @param {string} filename - Nom du fichier JSON
 */
function processMemberFile(filename) {
  const filepath = path.join(CONFIG.jsonDir, filename);
  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const member = JSON.parse(fileContent);

  console.log(`Traitement de: ${member.name}`);

  // Générer une page pour chaque langue
  member.languages.forEach(language => {
    const html = generateMemberPage(member, language, member.languages);

    // Déterminer le nom du fichier de sortie
    const outputFilename = language.code === ''
      ? `${member.pageName}.html`
      : `${member.pageName}-${language.code}.html`;

    const outputPath = path.join(CONFIG.outputDir, outputFilename);

    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`  ✓ Généré: ${outputFilename}`);
  });
}

/**
 * Fonction principale
 */
function main() {
  console.log('='.repeat(60));
  console.log('Génération des pages HTML des membres');
  console.log('Source: JSON -> Destination: docs/');
  console.log('='.repeat(60));
  console.log();

  // Vérifier que le dossier de sortie existe
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Lire tous les fichiers JSON
  const files = fs.readdirSync(CONFIG.jsonDir)
    .filter(file => file.endsWith('.json'));

  console.log(`${files.length} fichier(s) JSON trouvé(s)`);
  console.log();

  // Traiter chaque fichier
  files.forEach(filename => {
    try {
      processMemberFile(filename);
    } catch (error) {
      console.error(`  ✗ Erreur lors du traitement de ${filename}:`, error.message);
    }
  });

  console.log();
  console.log('='.repeat(60));
  console.log('Génération terminée !');
  console.log('='.repeat(60));
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { main, generateMemberPage, replaceLineFeed };
