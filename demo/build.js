var jsnTranspiler = require('../source/transpiler.js').parse;
var fs = require('fs');
var path = require('path');

var file = fs.readFileSync(path.join(__dirname, 'test.jsx'), 'utf-8');
var res;
console.time('jsn');
res = jsnTranspiler(file);
console.timeEnd('jsn');
fs.writeFileSync(path.join(__dirname, 'result.js'), res, 'utf-8');
