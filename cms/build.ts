/**
 * CMS Build Script
 * Génère les pages HTML statiques à partir des données JSON et du template dans site/
 */

import * as fs from 'fs';
import * as path from 'path';

// Interfaces
interface ConfigData {
  contentDir: string;
  siteDir: string;
  outputDir: string;
  member: {
    template: string;
  };
  team: {
    template: string;
    output: string;
    memberOrder: string[];
  };
  staticPages: string[];
}

interface Language {
  code: string;
  name: string;
  academic?: string;
  summary?: string;
  page?: {
    title?: string;
    sections?: Section[];
  };
}

interface Section {
  title?: string;
  description?: string;
}

interface Member {
  name: string;
  pageName: string;
  photo: string;
  phoneNumber?: string;
  emailAddress?: string;
  webSite?: string;
  languages: Language[];
}

interface TemplateData {
  [key: string]: string | undefined;
}

// Configuration
const configPath = path.join(__dirname, 'config.json');
const configData: ConfigData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const CONFIG = {
  contentDir: path.join(__dirname, configData.contentDir),
  siteDir: path.join(__dirname, configData.siteDir),
  outputDir: path.join(__dirname, configData.outputDir),
  year: new Date().getFullYear()
};

/**
 * Simple template engine - remplace les placeholders {{variable}} et {{{variable}}}
 */
class TemplateEngine {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  render(data: TemplateData): string {
    let result = this.template;
    
    // Triple braces = raw HTML (pas d'escape)
    result = result.replace(/{{{(\w+)}}}/g, (match: string, key: string) => {
      const value = data[key];
      return value !== undefined ? value : '';
    });
    
    // Double braces = escaped HTML
    result = result.replace(/{{(\w+)}}/g, (match: string, key: string) => {
      const value = data[key];
      if (value === undefined) return '';
      return this.escapeHtml(String(value));
    });
    
    return result;
  }

  private escapeHtml(text: string): string {
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
function generateLanguageLinks(languages: Language[], currentCode: string, pageName: string): string {
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
function generateContactInfo(member: Member): string {
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
function generateSections(pageData: Language['page']): string {
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
 * Charge le template de membre depuis cms/site/
 */
function loadMemberTemplate(): string {
  const templatePath = path.join(CONFIG.siteDir, configData.member.template);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template non trouvé: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Charge le template de la page équipe depuis cms/site/
 */
function loadTeamTemplate(): string {
  const templatePath = path.join(CONFIG.siteDir, configData.team.template);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template non trouvé: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Génère le HTML d'un membre pour la page team
 */
function generateTeamMemberHtml(member: Member, langCode: string): string {
  // Trouver la langue correspondante
  const lang = member.languages.find(l => l.code === langCode);
  if (!lang) return '';

  const pageName = langCode ? `${member.pageName}-${langCode}` : member.pageName;
  const academic = lang.academic || '';
  const summary = lang.summary || '';

  return `<a href="${pageName}"><img src="${member.photo}"/></a>
    <div class="member-description">
      <h3><span><a href="${pageName}">${member.name}</a></span></h3>
      <h1><span>${academic}</span></h1>
      <p><span>${summary}</span></p>
    </div>
    <div class="detailLink memberLink"><a href="${pageName}">détails</a></div>`;
}

/**
 * Vérifie que tous les membres dans content/members sont présents dans memberOrder
 */
function validateMemberOrder(): void {
  const memberOrder = configData.team.memberOrder;
  const memberOrderSet = new Set(memberOrder);
  const files = fs.readdirSync(CONFIG.contentDir).filter(f => f.endsWith('.json'));
  const missingMembers: string[] = [];

  for (const file of files) {
    if (!memberOrderSet.has(file)) {
      missingMembers.push(file);
    }
  }

  if (missingMembers.length > 0) {
    console.error(`  ✗ ERREUR: Les membres suivants ne sont pas dans memberOrder:`);
    for (const member of missingMembers) {
      console.error(`    - ${member}`);
    }
    throw new Error(`Membres manquants dans memberOrder: ${missingMembers.join(', ')}`);
  }
}

/**
 * Génère la page team.html avec tous les membres
 */
function generateTeamPage(teamTemplate: string): void {
  console.log('Génération de la page équipe...');

  // Vérifier que tous les membres sont dans memberOrder
  validateMemberOrder();

  const memberOrder = configData.team.memberOrder;
  let membersHtml = '';
  let processedCount = 0;

  for (let i = 0; i < memberOrder.length; i++) {
    const fileName = memberOrder[i];
    const filePath = path.join(CONFIG.contentDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ Fichier non trouvé: ${fileName}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const member: Member = JSON.parse(content);

    // Utiliser la langue par défaut (sans code) pour la page team
    const memberContent = generateTeamMemberHtml(member, '');

    const column = processedCount % 2;

    if (column === 0) {
      // Première colonne - ouvre le div cf
      membersHtml += `<div class="cf"><div class="col1_50_50 section cf memberIntroRow2Col">${memberContent}</div>`;
    } else {
      // Deuxième colonne - ferme le div cf
      membersHtml += `<div class="col2_50_50 section cf memberIntroRow2Col">${memberContent}</div></div>`;
    }

    processedCount++;
  }

  // Si le nombre de membres traités est impair, fermer le dernier div cf
  if (processedCount % 2 !== 0) {
    membersHtml += '</div>';
  }

  const templateData: TemplateData = {
    members: membersHtml,
    year: String(CONFIG.year)
  };

  const engine = new TemplateEngine(teamTemplate);
  const html = engine.render(templateData);

  const outputPath = path.join(CONFIG.outputDir, configData.team.output);
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`  ✓ ${configData.team.output}`);
}

/**
 * Copie les assets (css, img) vers le répertoire de sortie
 */
function copyAssets(): void {
  console.log('Copie des assets...');
  
  // CSS
  const cssSource = path.join(CONFIG.siteDir, 'css');
  const cssDest = path.join(CONFIG.outputDir, 'css');
  copyDirectory(cssSource, cssDest);
  
  // Images générales du site (bannières, etc. - pas les photos membres)
  const imgSource = path.join(CONFIG.siteDir, 'img');
  const imgDest = path.join(CONFIG.outputDir, 'img');
  
  // Créer le dossier img s'il n'existe pas
  if (!fs.existsSync(imgDest)) {
    fs.mkdirSync(imgDest, { recursive: true });
  }
  
  // Copier seulement les images générales du site (pas les photos de membres)
  const entries = fs.readdirSync(imgSource, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && SITE_IMAGES.includes(entry.name)) {
      const srcPath = path.join(imgSource, entry.name);
      const destPath = path.join(imgDest, entry.name);
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  console.log('  ✓ Assets copiés');
}

/**
 * Copie les pages statiques du site
 */
function copyStaticPages(): void {
  console.log('Copie des pages statiques...');
  
  const staticPages = configData.staticPages;
  
  for (const page of staticPages) {
    const srcPath = path.join(CONFIG.siteDir, page);
    const destPath = path.join(CONFIG.outputDir, page);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ ${page}`);
    }
  }
}

/**
 * Copie récursive d'un répertoire
 */
function copyDirectory(source: string, dest: string): void {
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
 * Liste des images générales du site (pas des membres)
 */
const SITE_IMAGES: string[] = [
  'bg-banner.png', 'bg-intro.jpg', 'banner1.jpg', 'banner2.jpg', 'banner3.jpg',
  'banner4.jpg', 'banner5.jpg', 'banner6.jpg', 'building.jpg', 'assurance.jpg',
  'father-son.jpg', 'food.jpg', 'happy-couple.jpg', 'happy-familly.jpg',
  'mother-daughter.jpg', 'older-people.jpg', 'placeholder.jpg', 'sexuality.jpg',
  'client1.jpg'
];

/**
 * Récupère la liste des photos des membres actifs
 */
function getMemberPhotos(): Set<string> {
  const photos = new Set<string>();
  const files = fs.readdirSync(CONFIG.contentDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(CONFIG.contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const member: Member = JSON.parse(content);
    if (member.photo) {
      // Extraire juste le nom du fichier (ex: "img/andrea-riddle.jpg" -> "andrea-riddle.jpg")
      const photoName = path.basename(member.photo);
      photos.add(photoName);
    }
  }
  
  return photos;
}

/**
 * Récupère la liste des membres actifs avec leurs langues
 */
function getActiveMembers(): Set<string> {
  const members = new Set<string>();
  const files = fs.readdirSync(CONFIG.contentDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(CONFIG.contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const member: Member = JSON.parse(content);
    
    // Ajouter la page principale
    members.add(`${member.pageName}.html`);
    
    // Ajouter les pages de langue
    if (member.languages) {
      member.languages.forEach(lang => {
        if (lang.code) {
          members.add(`${member.pageName}-${lang.code}.html`);
        }
      });
    }
  }
  
  return members;
}

/**
 * Supprime les anciens fichiers des membres qui n'existent plus
 */
function cleanupOldFiles(activeMembers: Set<string>, activePhotos: Set<string>): void {
  console.log('Nettoyage des anciens fichiers...');
  
  // Patterns de fichiers à ne pas supprimer (pages statiques du site)
  const protectedFiles = [
    'index.html', 'team.html', 'services.html', 'contact.html', 
    'career.html', 'links.html', '.htaccess', 'CNAME'
  ];
  
  // Nettoyer les pages HTML
  if (fs.existsSync(CONFIG.outputDir)) {
    const entries = fs.readdirSync(CONFIG.outputDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        if (!protectedFiles.includes(entry.name) && !activeMembers.has(entry.name)) {
          const filePath = path.join(CONFIG.outputDir, entry.name);
          fs.unlinkSync(filePath);
          console.log(`  ✗ Supprimé: ${entry.name}`);
        }
      }
    }
  }
  
  // Nettoyer les photos des membres
  const imgDir = path.join(CONFIG.outputDir, 'img');
  if (fs.existsSync(imgDir)) {
    const entries = fs.readdirSync(imgDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        // Ne supprimer que les photos de membres (pas les images générales du site)
        // Une photo de membre correspond à un fichier dans activePhotos
        if (!SITE_IMAGES.includes(entry.name) && !activePhotos.has(entry.name)) {
          const filePath = path.join(imgDir, entry.name);
          fs.unlinkSync(filePath);
          console.log(`  ✗ Supprimé photo: img/${entry.name}`);
        }
      }
    }
  }
  
  console.log('  ✓ Nettoyage terminé');
}

/**
 * Génère les pages pour un membre
 */
function generateMemberPages(memberData: string, template: string): void {
  const member: Member = JSON.parse(memberData);
  
  member.languages.forEach(lang => {
    const templateData: TemplateData = {
      name: member.name,
      photo: member.photo,
      academic: lang.academic,
      year: String(CONFIG.year),
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
 * Copie les photos des membres
 */
function copyMemberPhotos(activePhotos: Set<string>): void {
  console.log('Copie des photos des membres...');
  
  const siteImgDir = path.join(CONFIG.siteDir, 'img');
  const outputImgDir = path.join(CONFIG.outputDir, 'img');
  
  if (!fs.existsSync(outputImgDir)) {
    fs.mkdirSync(outputImgDir, { recursive: true });
  }
  
  for (const photoName of activePhotos) {
    const srcPath = path.join(siteImgDir, photoName);
    const destPath = path.join(outputImgDir, photoName);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  console.log(`  ✓ ${activePhotos.size} photos copiées`);
}

/**
 * Fonction principale de build
 */
function build(): void {
  console.log('='.repeat(60));
  console.log('CMS Build - Génération du site');
  console.log('='.repeat(60));
  console.log();
  
  // Créer le répertoire de sortie
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Récupérer la liste des membres et photos actifs
  const activeMembers = getActiveMembers();
  const activePhotos = getMemberPhotos();
  
  // Nettoyer les anciens fichiers
  cleanupOldFiles(activeMembers, activePhotos);
  console.log();
  
  // Copier les assets (CSS, images générales)
  copyAssets();
  console.log();
  
  // Copier les pages statiques
  copyStaticPages();
  console.log();
  
  // Copier les photos des membres actifs
  copyMemberPhotos(activePhotos);
  console.log();
  
  // Charger le template de membre depuis cms/site/
  console.log('Chargement du template membre...');
  const memberTemplate = loadMemberTemplate();
  console.log(`  ✓ Template chargé depuis cms/site/${configData.member.template}`);
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
      console.error(`  ✗ Erreur dans ${file}:`, (err as Error).message);
    }
  }

  console.log();

  // Charger le template de la page team
  const teamTemplate = loadTeamTemplate();

  // Générer la page team
  generateTeamPage(teamTemplate);
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

export { build, TemplateEngine };
