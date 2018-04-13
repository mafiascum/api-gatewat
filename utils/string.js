const foldCase = require('fold-case');
const unhomoglyph = require('unhomoglyph');

function utf8CleanString(input) {
    const sanitizeMap = new Map([
        ["'", "ʹ"],
        ['!', 'Ãâ'],
        ['?', '╩ö'],
        ['ø', 'o̷'],
        ['â', 'ú'],
        ['æ', 'ae']
    ]);
    
    return foldCase(input.normalize('NFKC'))
    .split('')
    .map(character => sanitizeMap.has(character) ? sanitizeMap.get(character) : character)
    .join('')
    .replace(/(?:[\x00-\x1F\x7F]+|(?:\xC2[\x80-\x9F])+)/, '')
    .replace(/ {2,}/, ' ');
}

module.exports = {
    utf8CleanString
};