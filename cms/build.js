/**
 * CMS Build Script
 * Génère les pages HTML statiques à partir des données JSON et du template dans site/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  contentDir: path.join(__dirname, 'content', 'members'),
  siteDir: path.join(__dirname, 'site'),
  outputDir: path.join(__dirname, '..', 'docs'),
  year: new Date().getFullYear()
};

/**
 * Simple template engine - remplace les placeholders {{variable}} et {{{variable}}}
 */
class TemplateEngine {
  constructor(template) {
    this.template = template;
  }

  render(data) {
    let result = this.template;
    
    // Triple braces = raw HTML (pas d'escape)
    result = result.replace(/{{{(\w+)}}}/g, (match, key) => {
      const value = data[key];
      return value !== undefined ? value : '';
    });
    
    // Double braces = escaped HTML
    result = result.replace(/{{(\w+)}}/g, (match, key) => {
      const value = data[key];
      if (value === undefined) return '';
      return this.escapeHtml(String(value));
    });
    
    return result;
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
  }
}

/**
 * Génère les liens de langue
 */
function generateLanguageLinks(languages, currentCode, pageName) {
  if (!languages || languages.length <= 1) {
    return '';
  }
  
  let html = '<div class="navigationHeader language">';
  languages.forEach(lang => {
    const isCurrent = lang.code === currentCode;
    const href = lang.code ? `${pageName}-${lang.code}` : pageName;
    const currentClass = isCurrent ? 'currentpage' : '';
    html += `<a class="${currentClass}" href="${href}">${lang.name}</a>`;
  });
  html += '</div>';
  return html;
}

/**
 * Génère les informations de contact
 */
function generateContactInfo(member) {
  let html = '';
  
  if (member.phoneNumber) {
    html += `&nbsp;<p>Tel:</p><h2><span class="texthighlightcolor"><div class="icon icon-phone"></div>${member.phoneNumber}</span></h2>`;
  }
  
  if (member.emailAddress) {
    html += `&nbsp;<p>Courriel:</p><h2><span class="texthighlightcolor"><a href="mailto:${member.emailAddress}"><div class="icon icon-envelope"></div>${member.emailAddress}</a></span></h2>`;
  }
  
  if (member.webSite) {
    html += `&nbsp;<p>Liens:</p><h2><span class="texthighlightcolor"><a href="${member.webSite}"><div class="icon icon-globe"></div>Site web</a></span></h2>`;
  }
  
  return html;
}

/**
 * Génère les sections de contenu
 */
function generateSections(pageData) {
  if (!pageData || !pageData.sections) {
    return '';
  }
  
  let html = '';
  
  pageData.sections.forEach(section => {
    if (section.title) {
      html += `
      <div class="section cf">
        <div class="header lightgray">
          <h3><span>${section.title}</span></h3>
        </div>
      </div>`;
    }
    
    if (section.description) {
      html += `
      <div class="sectiontext">
        ${section.description}
      </div>`;
    }
  });
  
  return html;
}

/**
 * Charge le template depuis cms/site/
 */
function loadTemplate() {
  const templatePath = path.join(CONFIG.siteDir, 'member.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template non trouvé: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Copie les assets (css, img) vers le répertoire de sortie
 */
function copyAssets() {
  console.log('Copie des assets...');
  
  // CSS
  const cssSource = path.join(CONFIG.siteDir, 'css');
  const cssDest = path.join(CONFIG.outputDir, 'css');
  copyDirectory(cssSource, cssDest);
  
  // Images
  const imgSource = path.join(CONFIG.siteDir, 'img');
  const imgDest = path.join(CONFIG.outputDir, 'img');
  copyDirectory(imgSource, imgDest);
  
  console.log('  ✓ Assets copiés');
}

/**
 * Copie récursive d'un répertoire
 */
function copyDirectory(source, dest) {
  if (!fs.existsSync(source)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Génère les pages pour un membre
 */
function generateMemberPages(memberData, template) {
  const member = JSON.parse(memberData);
  
  member.languages.forEach(lang => {
    const templateData = {
      name: member.name,
      photo: member.photo,
      academic: lang.academic,
      year: CONFIG.year,
      languageLinks: generateLanguageLinks(member.languages, lang.code, member.pageName),
      contactInfo: generateContactInfo(member),
      sections: generateSections(lang.page)
    };
    
    const engine = new TemplateEngine(template);
    const html = engine.render(templateData);
    
    // Nom du fichier de sortie
    const outputName = lang.code 
      ? `${member.pageName}-${lang.code}.html`
      : `${member.pageName}.html`;
    
    const outputPath = path.join(CONFIG.outputDir, outputName);
    fs.writeFileSync(outputPath, html, 'utf-8');
    
    console.log(`  ✓ ${outputName}`);
  });
}

/**
 * Fonction principale de build
 */
function build() {
  console.log('='.repeat(60));
  console.log('CMS Build - Génération du site');
  console.log('='.repeat(60));
  console.log();
  
  // Créer le répertoire de sortie
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Copier les assets
  copyAssets();
  console.log();
  
  // Charger le template depuis cms/site/
  console.log('Chargement du template...');
  const memberTemplate = loadTemplate();
  console.log('  ✓ Template chargé depuis cms/site/member.html');
  console.log();
  
  // Traiter tous les fichiers JSON
  console.log('Génération des pages membres...');
  const files = fs.readdirSync(CONFIG.contentDir)
    .filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(CONFIG.contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      generateMemberPages(content, memberTemplate);
    } catch (err) {
      console.error(`  ✗ Erreur dans ${file}:`, err.message);
    }
  }
  
  console.log();
  console.log('='.repeat(60));
  console.log(`Build terminé! ${files.length} membres traités.`);
  console.log(`Sortie: ${CONFIG.outputDir}`);
  console.log('='.repeat(60));
}

// Exécuter le build
if (require.main === module) {
  build();
}

module.exports = { build, TemplateEngine };
