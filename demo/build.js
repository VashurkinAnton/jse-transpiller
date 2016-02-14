var jsnTranspiler = require('../source/transpiller.js').parse;
var fs = require('fs');

var file = fs.readFileSync('./test.jsx', 'utf-8');
var res;
console.time('jsn');
res = jsnTranspiler(file);
console.timeEnd('jsn');
fs.writeFileSync('./result.js', res, 'utf-8');