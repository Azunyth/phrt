var fs = require('fs');

module.exports.random = function(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports.filterQuotes = function(str) {
    var regQuote = /^\"(.*)\"$/;

    return str.replace(regQuote, '$1');
}

module.exports.sanitize = function(str, replacement) {
    replacement = replacement || ' ';

    return this.filterQuotes(str).replace(/;|,|\//g, replacement);
}

module.exports.read = function(file) {
	return fs.readFileSync(file, 'utf8');
}

module.exports.shuffleArray = function(array) {
    var i = 0
    , j = 0
    , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array;
}

module.exports.replaceAt = function(word, idx, replacement) {
    return word.substr(0, idx) + replacement+ word.substr(idx + replacement.length);
}

module.exports.hideLettersInWord = function(word) {
    var nbLetterHidden = Math.ceil(word.length/2);
    var positions = [];

    for(var i = 0; i < word.length; i++ ) {
        positions.push(i);
    }

    var positionShuffled = this.shuffleArray(positions);

    for(var i=0; i < nbLetterHidden; i++) {
        word = this.replaceAt(word, positionShuffled[i], "*");
    }

    return word;
}
