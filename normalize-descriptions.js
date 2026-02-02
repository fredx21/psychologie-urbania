const fs = require('fs');
const path = require('path');

const inputDir = 'output/members-json';

// Fonction pour normaliser une chaîne de caractères
function normalizeText(text) {
  if (typeof text !== 'string') return text;
  // Remplacer \r\n et les espaces qui suivent par une seule espace
  return text.replace(/\r\n\s*/g, ' ');
}

// Fonction récursive pour traiter tous les objets
function processObject(obj) {
  if (typeof obj === 'string') {
    return normalizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      result[key] = processObject(obj[key]);
    }
    return result;
  }
  
  return obj;
}

// Lire tous les fichiers JSON du répertoire
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du répertoire:', err);
    process.exit(1);
  }

  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  console.log(`Traitement de ${jsonFiles.length} fichiers JSON...`);

  jsonFiles.forEach(file => {
    const filePath = path.join(inputDir, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Traiter les données pour normaliser toutes les descriptions
      const normalizedData = processObject(data);
      
      // Écrire le fichier avec indentation de 2 espaces
      fs.writeFileSync(filePath, JSON.stringify(normalizedData, null, 2), 'utf8');
      
      console.log(`✓ ${file} traité`);
    } catch (error) {
      console.error(`✗ Erreur lors du traitement de ${file}:`, error.message);
    }
  });

  console.log('Terminé !');
});
