/**
 * Script de génération des pages HTML des membres à partir des fichiers JSON
 * Remplace l'ancien système XSL/XML en utilisant un template HTML
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  jsonDir: path.join(__dirname, 'output', 'members-json'),
  outputDir: path.join(__dirname, 'docs'),
  templatePath: path.join(__dirname, 'templates', 'member-template.html'),
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
 * Génère le HTML complet d'une page membre en utilisant le template
 * @param {Object} member - Données du membre
 * @param {Object} language - Données de la langue courante
 * @param {Array} allLanguages - Toutes les langues disponibles
 * @param {string} template - Contenu du template HTML
 * @returns {string} - HTML complet de la page
 */
function generateMemberPage(member, language, allLanguages, template) {
  // Remplacer tous les placeholders dans le template
  let html = template;

  html = html.replace(/{{NAME}}/g, member.name);
  html = html.replace(/{{ACADEMIC}}/g, language.academic);
  html = html.replace(/{{PHOTO}}/g, member.photo);
  html = html.replace(/{{YEAR}}/g, CONFIG.currentYear);

  // Remplacer les blocs dynamiques
  html = html.replace('{{LANGUAGE_LINKS}}', generateLanguageLinks(allLanguages, language.code, member.pageName));
  html = html.replace('{{CONTACT_INFO}}', generateContactInfo(member));
  html = html.replace('{{SECTIONS}}', generateSections(language.page));

  return html;
}

/**
 * Traite un fichier JSON de membre et génère les pages HTML
 * @param {string} filename - Nom du fichier JSON
 * @param {string} template - Contenu du template HTML
 */
function processMemberFile(filename, template) {
  const filepath = path.join(CONFIG.jsonDir, filename);
  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const member = JSON.parse(fileContent);

  console.log(`Traitement de: ${member.name}`);

  // Générer une page pour chaque langue
  member.languages.forEach(language => {
    const html = generateMemberPage(member, language, member.languages, template);

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

  // Charger le template
  if (!fs.existsSync(CONFIG.templatePath)) {
    console.error(`Erreur: Le template n'existe pas: ${CONFIG.templatePath}`);
    process.exit(1);
  }

  const template = fs.readFileSync(CONFIG.templatePath, 'utf-8');
  console.log(`Template chargé: ${CONFIG.templatePath}`);
  console.log();

  // Lire tous les fichiers JSON
  const files = fs.readdirSync(CONFIG.jsonDir)
    .filter(file => file.endsWith('.json'));

  console.log(`${files.length} fichier(s) JSON trouvé(s)`);
  console.log();

  // Traiter chaque fichier
  files.forEach(filename => {
    try {
      processMemberFile(filename, template);
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
