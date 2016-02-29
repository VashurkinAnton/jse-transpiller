var amdPack = require('amd-pack');

amdPack({input: './source/pipe-elm.js', output: './src/jse-pipe-elm.js', minify: false, name: 'JSE'});
amdPack({input: './source/tokenizer.js', output: './src/jse-tokenizer.js', minify: false, name: 'jseTokenizer'});
amdPack({input: './source/transpiler.js', output: './src/jse-transpiler.js', minify: false, name: 'jseTranspiller'});