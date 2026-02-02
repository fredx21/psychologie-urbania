const fs = require('fs');
const path = require('path');

// Simple XML parser for this specific structure
function parseXML(xmlString) {
    const result = { Team: { Member: [] } };
    
    // Parse Members
    const memberRegex = /<Member>([\s\S]*?)<\/Member>/g;
    let match;
    
    while ((match = memberRegex.exec(xmlString)) !== null) {
        const memberXml = match[1];
        const member = {};
        
        // Name
        const nameMatch = memberXml.match(/<Name>(.*?)<\/Name>/s);
        if (nameMatch) member.name = nameMatch[1].trim();
        
        // PhoneNumber
        const phoneMatch = memberXml.match(/<PhoneNumber>(.*?)<\/PhoneNumber>/s);
        if (phoneMatch) member.phoneNumber = phoneMatch[1].trim();
        
        // EmailAddress
        const emailMatch = memberXml.match(/<EmailAddress>(.*?)<\/EmailAddress>/s);
        if (emailMatch) member.emailAddress = emailMatch[1].trim();
        
        // Photo
        const photoMatch = memberXml.match(/<Photo>(.*?)<\/Photo>/s);
        if (photoMatch) member.photo = photoMatch[1].trim();
        
        // WebSite (optional)
        const webSiteMatch = memberXml.match(/<WebSite>(.*?)<\/WebSite>/s);
        if (webSiteMatch) member.webSite = webSiteMatch[1].trim();
        
        // PageName
        const pageNameMatch = memberXml.match(/<PageName>(.*?)<\/PageName>/s);
        if (pageNameMatch) member.pageName = pageNameMatch[1].trim();
        
        // Languages
        member.languages = [];
        const langRegex = /<Language name="(.*?)" code="(.*?)">([\s\S]*?)<\/Language>/g;
        let langMatch;
        
        while ((langMatch = langRegex.exec(memberXml)) !== null) {
            const language = {
                name: langMatch[1],
                code: langMatch[2]
            };
            
            const langContent = langMatch[3];
            
            // Academic
            const academicMatch = langContent.match(/<Academic>(.*?)<\/Academic>/s);
            if (academicMatch) language.academic = academicMatch[1].trim();
            
            // Summary
            const summaryMatch = langContent.match(/<Summary>(.*?)<\/Summary>/s);
            if (summaryMatch) language.summary = summaryMatch[1].trim();
            
            // Page
            const pageMatch = langContent.match(/<Page>([\s\S]*?)<\/Page>/s);
            if (pageMatch) {
                language.page = { sections: [] };
                
                const sectionRegex = /<Section>([\s\S]*?)<\/Section>/g;
                let sectionMatch;
                
                while ((sectionMatch = sectionRegex.exec(pageMatch[1])) !== null) {
                    const section = {};
                    
                    // Title (optional)
                    const titleMatch = sectionMatch[1].match(/<Title>(.*?)<\/Title>/s);
                    if (titleMatch) section.title = titleMatch[1].trim();
                    
                    // Description - keep HTML tags intact
                    const descMatch = sectionMatch[1].match(/<Description>([\s\S]*?)<\/Description>/s);
                    if (descMatch) {
                        // Extract content between Description tags, keeping all HTML
                        let descContent = descMatch[1];
                        // Remove leading/trailing whitespace but keep structure
                        section.description = descContent.trim();
                    }
                    
                    language.page.sections.push(section);
                }
            }
            
            member.languages.push(language);
        }
        
        result.Team.Member.push(member);
    }
    
    return result;
}

// Main function
function main() {
    const xmlPath = path.join(__dirname, 'members.xml');
    const outputDir = path.join(__dirname, 'output', 'members-json');
    
    // Read XML file
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    
    // Parse XML
    const data = parseXML(xmlContent);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create one JSON file per member
    data.Team.Member.forEach(member => {
        const fileName = `${member.pageName}.json`;
        const filePath = path.join(outputDir, fileName);
        
        // Pretty print JSON
        const jsonContent = JSON.stringify(member, null, 2);
        fs.writeFileSync(filePath, jsonContent, 'utf8');
        
        console.log(`Created: ${fileName}`);
    });
    
    console.log(`\nTotal members processed: ${data.Team.Member.length}`);
    console.log(`Output directory: ${outputDir}`);
}

main();
