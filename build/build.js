var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

var reME = /module\.exports[\b\t\n\r ]*=[\b\t\n\r ]*/;
var openAMD = fs.readFileSync(path.resolve(__dirname,'./openAMDWrapper.js'), 'utf-8');
var closeAMD = fs.readFileSync(path.resolve(__dirname,'./closeAMDWrapper.js'), 'utf-8');

function includeRequire(source, rootDir){
	(source.match(/require\('?"?[^\']*'?"?\)/ig) || []).forEach(function(_require){
		var _path = _require.replace(/require\('?"?/, '').replace(/'?"?\)/, '');
		var inludeFile = fs.readFileSync(path.resolve(__dirname, rootDir, _path), 'utf-8').replace(reME, '').replace(/\;[\b\n\t\r ]*$/, '');
		
		source = source.replace(_require, inludeFile);
	});
	return source;
}


var tokenizer = fs.readFileSync(path.resolve(__dirname, '../source/tokenizer.js'), 'utf-8');
tokenizer = includeRequire(tokenizer, '../source');

tokenizer = tokenizer.replace(reME, 'return ');
fs.writeFileSync(
	path.resolve(__dirname, '../src/jse-tokenizer.js'), 
	uglify.minify(openAMD.replace('%moduleName%', 'jseTokenizer') + tokenizer + closeAMD, {fromString: true}).code,
	'utf-8'
);
var transpiller = fs.readFileSync(path.resolve(__dirname, '../source/transpiller.js'), 'utf-8');
transpiller = transpiller.replace(reME, 'return ').split('require(\'./tokenizer.js\')');
transpiller.splice(1, 0, '(function(){', tokenizer, '}())');
transpiller.splice(0,0, openAMD.replace('%moduleName%', 'jseTranspiller'));
transpiller.push(closeAMD);
transpiller = transpiller.join('');

fs.writeFileSync(
	path.resolve(__dirname, '../src/jse-transpiller.js'),
	uglify.minify(transpiller, {fromString: true}).code,
	'utf-8'
);

var jsePipeElm = fs.readFileSync(path.resolve(__dirname, '../source/pipe-elm.js'), 'utf-8');
jsePipeElm = includeRequire(jsePipeElm, '../source');
jsePipeElm = jsePipeElm.replace(reME, 'return ');
jsePipeElm = openAMD.replace('%moduleName%', 'JSE') + jsePipeElm + closeAMD;

fs.writeFileSync(
	path.resolve(__dirname, '../src/jse-pipe-elm.js'),
	jsePipeElm,//uglify.minify(jsePipeElm, {fromString: true}).code,
	'utf-8'
);