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
