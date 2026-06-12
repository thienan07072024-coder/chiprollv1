const fs = require('fs');
const path = 'C:/Users/Asus/Desktop/ROLL/chip-roll/src/data/swords.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/icon: '.*?',/g, (match, offset, string) => {
    // Find rarity above this line
    const beforeStr = string.substring(0, offset);
    const rarityMatch = beforeStr.match(/rarity: '(.*?)'/g);
    if (rarityMatch) {
        const rarity = rarityMatch[rarityMatch.length - 1].split(\"'\")[1];
        return \image: '/assets/swords/\.png',\;
    }
    return match;
});
fs.writeFileSync(path, content);
console.log('Updated swords.ts');
