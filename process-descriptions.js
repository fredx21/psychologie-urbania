const fs = require('fs');

// Read the XML file
const xmlContent = fs.readFileSync('members.xml', 'utf8');

// Function to process a Desciption element's content
function processDescriptionContent(content) {
    // Split by || to get raw paragraphs
    const parts = content.split('||');
    
    const paragraphs = [];
    let currentParagraph = '';
    
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        
        // Clean up leading/trailing whitespace
        part = part.trim();
        
        if (part === '') {
            // Empty part after ||, skip
            continue;
        }
        
        // If current paragraph is empty, start new one
        if (currentParagraph === '') {
            currentParagraph = part;
        } else {
            // Append to current paragraph with a space
            currentParagraph = currentParagraph + ' ' + part;
        }
        
        // If this is the last part or the next part would start fresh,
        // we need to check if this paragraph is complete
        // Look ahead to see if next non-empty part starts a new paragraph
        let hasNextParagraph = false;
        for (let j = i + 1; j < parts.length; j++) {
            if (parts[j].trim() !== '') {
                hasNextParagraph = true;
                break;
            }
        }
        
        // If this part ends with || or is the last part, finalize the paragraph
        if (content.indexOf(part + '||') !== -1 || i === parts.length - 1) {
            if (currentParagraph !== '') {
                paragraphs.push(currentParagraph);
                currentParagraph = '';
            }
        }
    }
    
    // Rebuild with <p> tags
    return paragraphs.map(p => `<p>${p}</p>`).join('\n');
}

// Pattern to match <Desciption>...</Desciption> tags with their content
const descriptionPattern = /<Desciption>\s*([\s\S]*?)\s*<\/Desciption>/g;

// Process the XML
const processedXML = xmlContent.replace(descriptionPattern, (match, content) => {
    const processedContent = processDescriptionContent(content);
    return `<Desciption>\n${processedContent}\n</Desciption>`;
});

// Write the processed XML
fs.writeFileSync('members.xml', processedXML, 'utf8');

console.log('Processing complete!');
