(function (root, factory, getModules) {
    
	var __Dependencies = getModules();
	var require = function(name){
		return __Dependencies[name];
	}
    if (typeof define === 'function' && define.amd) {
        define([], function(){factory(require)});
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        root.jseTranspiler = factory(require);
  }
}(this, function (require) {
	var jsnTokenizer = require('/jse-transpiller/source/tokenizer.js');
	var skipNextDelimeter = false;
	var pipeElmName = 'JSE';
	function escape(str){
		return str.replace(/["\\]/ig, function(ch){
			if(ch === '\\'){
				return '\\\\';
			}else if(ch === '"'){
				return '\\"';
			}
		});
	}
	jsnTokenizer.onText(function(text, context){
		if(context){
			return 'elm.text("'+escape(text)+'");';
		}else{
			if(skipNextDelimeter){
				text = text.replace(/^[\n\t\r\b\v\f ]*;/,'');
				skipNextDelimeter = false;
			}
			return text;
		}
	});
	jsnTokenizer.onExpression(function(text){
		return 'elm.text(' + text + ');';
	});
	jsnTokenizer.onOpenTag(function(tag){
		var text = '';
		if(tag.root){
			text += '(function(Elm){var elm = Elm();';
		}
		var oneObjectAttrs = true;
		var attrs = [];
		var attrsBuffer = [];
		for(var i = 0, len = tag.attrs.length; i < len; i++){
			var attr = tag.attrs[i];
			if(attr['type'] === 'string'){
				attrsBuffer.push('"'+attr.name+'":"'+attr.value+'"')
			}else if(attr['type'] === 'expression'){
				attrsBuffer.push('"'+attr.name+'":'+attr.value);
			}else{
				attrs.push('{'+attrsBuffer.join(',')+'}');
				attrs.push(attr.value);
				
				attrsBuffer = [];
				oneObjectAttrs = false;
			}
		}
		if(attrsBuffer.length !== 0){
			attrs.push('{'+attrsBuffer.join(',')+'}');
		}
		attrs = attrs.join(',');
		var bind = [];
		if(tag.selfClosing){
			bind.push('selfClosing:true');
			if(tag.root){
				text += 'return ';
			}
		}
		bind = bind.join(',');
		if(tag.native){
			text += 'elm.open';
		}else{
			text += 'elm.component';
		}
		
		if(bind){
			text += '.bind({'+bind+'})';
		}
		
		if(tag.native){
			text +='("'+tag.name+'"';
		}else{
			text += '("'+tag.name+'",'+tag.name;
		}
		if(attrs){
			if(oneObjectAttrs){
				text += ','+attrs+');';
			}else{
				text += ',['+attrs+']);';
			}
		}else{
			text += ');';
		}
		if(tag.selfClosing && tag.root){
			text += '}).call(this, ' + pipeElmName + ')';
			skipNextDelimeter = true;
		}
		return text;
	});
	jsnTokenizer.onCloseTag(function(tag){
		if(tag.root){
			return 'return elm.close(); }).call(this, ' + pipeElmName + ')';
		}else{
			return 'elm.close();';
		}
	});
	return  {
		parse: function(source){
			return jsnTokenizer.parse(source);
		},
		setPipeElmName: function(newPipeElmName){
			pipeElmName = newPipeElmName;
		}
	};
}, function(){
	var __Dependencies = {};
	var require = function(name){
		return __Dependencies[name];
	}
	var _exports = function(path, module){__Dependencies[path] = module};
	//Module file: /jse-transpiller/include/extend.js
	(function(){
		var module = {};
		Object.defineProperty(module, 'exports', {
			get: function(){
				return {};
			},
			set: _exports.bind(null, '/jse-transpiller/include/extend.js')
		});
		module.exports = function(){
			var obj = arguments[0];
			for(var argvIndex = 0; argvIndex < arguments.length; argvIndex++){
				for(var keyIndex = 0, keys = Object.keys(arguments[argvIndex] || {}); keyIndex < keys.length; keyIndex++){
					obj[keys[keyIndex]] = arguments[argvIndex][keys[keyIndex]];
				}
			}
			return obj;
		}
	}());
	//Module file: /jse-transpiller/include/invalidCharsFromName.js
	(function(){
		var module = {};
		Object.defineProperty(module, 'exports', {
			get: function(){
				return {};
			},
			set: _exports.bind(null, '/jse-transpiller/include/invalidCharsFromName.js')
		});
		module.exports = {
			"`": 1,
			"~": 1,
			"!": 1,
			"@": 1,
			"#": 1,
			"%": 1,
			"^": 1,
			"&": 1,
			"*": 1,
			"(": 1,
			")": 1,
			"=": 1,
			"+": 1,
			"\\": 1,
			"|": 1,
			"/": 1,
			",": 1,
			"<": 1,
			">": 1,
			"?": 1,
			'"': 1,
			";": 1,
			":": 1,
			"'": 1,
			"{": 1,
			"}": 1,
			"[": 1,
			"]": 1
		}
	}());
	//Module file: /jse-transpiller/include/whitespaces.js
	(function(){
		var module = {};
		Object.defineProperty(module, 'exports', {
			get: function(){
				return {};
			},
			set: _exports.bind(null, '/jse-transpiller/include/whitespaces.js')
		});
		module.exports = {
			'\n': 1,
			'\r': 1,
			'\t': 1,
			'\b': 1,
			' ': 1,
			'\v': 1,
			'\f': 1
		}
	}());
	//Module file: /jse-transpiller/include/native-tags.js
	(function(){
		var module = {};
		Object.defineProperty(module, 'exports', {
			get: function(){
				return {};
			},
			set: _exports.bind(null, '/jse-transpiller/include/native-tags.js')
		});
		module.exports = {
			"a": 0,
			"abbr": 0,
			"acronym": 0,
			"address": 0,
			"applet": 0,
			"area": 1,
			"article": 0,
			"aside": 0,
			"audio": 0,
			"b": 0,
			"base": 1,
			"basefont": 0,
			"bdi": 0,
			"bdo": 0,
			"big": 0,
			"blockquote": 0,
			"body": 0,
			"br": 1,
			"button": 0,
			"canvas": 0,
			"caption": 0,
			"command": 1,
			"center": 0,
			"cite": 0,
			"code": 0,
			"col": 1,
			"colgroup": 0,
			"datalist": 0,
			"dd": 0,
			"del": 0,
			"details": 0,
			"dfn": 0,
			"dialog": 0,
			"dir": 0,
			"div": 0,
			"dl": 0,
			"dt": 0,
			"em": 0,
			"embed": 1,
			"fieldset": 0,
			"figcaption": 0,
			"figure": 0,
			"font": 0,
			"footer": 0,
			"form": 0,
			"frame": 0,
			"frameset": 0,
			"h1": 0,
			"h2": 0,
			"h3": 0,
			"h4": 0,
			"h5": 0,
			"h6": 0,
			"head": 0,
			"header": 0,
			"hr": 1,
			"html": 0,
			"i": 0,
			"iframe": 0,
			"img": 1,
			"input": 1,
			"ins": 0,
			"kbd": 0,
			"keygen": 1,
			"label": 0,
			"legend": 0,
			"li": 0,
			"link": 1,
			"main": 0,
			"map": 0,
			"mark": 0,
			"menu": 0,
			"menuitem": 0,
			"meta": 1,
			"meter": 0,
			"nav": 0,
			"noframes": 0,
			"noscript": 0,
			"object": 0,
			"ol": 0,
			"optgroup": 0,
			"option": 0,
			"output": 0,
			"p": 0,
			"param": 1,
			"pre": 0,
			"progress": 0,
			"q": 0,
			"rp": 0,
			"rt": 0,
			"ruby": 0,
			"s": 0,
			"samp": 0,
			"script": 0,
			"section": 0,
			"select": 0,
			"small": 0,
			"source": 1,
			"span": 0,
			"strike": 0,
			"strong": 0,
			"style": 0,
			"sub": 0,
			"summary": 0,
			"sup": 0,
			"table": 0,
			"tbody": 0,
			"td": 0,
			"textarea": 0,
			"tfoot": 0,
			"th": 0,
			"thead": 0,
			"time": 0,
			"title": 0,
			"tr": 0,
			"track": 1,
			"tt": 0,
			"u": 0,
			"ul": 0,
			"var": 0,
			"video": 0,
			"wbr": 1
		};
	}());
	//Module file: /jse-transpiller/source/tokenizer.js
	(function(){
		var module = {};
		Object.defineProperty(module, 'exports', {
			get: function(){
				return {};
			},
			set: _exports.bind(null, '/jse-transpiller/source/tokenizer.js')
		});
		var nativeTags = require('/jse-transpiller/include/native-tags.js');
		var isWhiteSpace = require('/jse-transpiller/include/whitespaces.js');
		var invalidChar = require('/jse-transpiller/include/invalidCharsFromName.js');
		var stringSymbols = {'"': 1, "'": 1, '`': 1};
		var extend = require('/jse-transpiller/include/extend.js');
		function skipString(source, cursor, removeQuotes){
			var isString = true, ch;
			var quote = source[cursor];
			var string = '';
			cursor += 1;
			while(isString && (ch = source[cursor])){
				if(ch === quote){
					isString = false;
					if(removeQuotes){
						ch = '';
					}
				}else if(ch === '\\'){
					string += '\\';
					cursor += 1;
				}
				string += ch;
				cursor += 1;
			}
			if(removeQuotes){
				return {cursor: cursor, string: string};
			}else{
				return {cursor: cursor, string: quote + string};
			}
		}
		function skipWhiteSpaces(source, cursor){
			var ch;
			while(ch = source[cursor]){
				if(!isWhiteSpace[ch]){
					break;
				}
				cursor += 1;
			}
			return cursor;
		}
		function skipExpression(source, cursor){
			var expression = tokenazer(source, true, cursor + 1);
			return {cursor: expression['cursor'], string: expression['text']}
			/*while(ch = source[cursor]){
				if(ch === '{'){
					quoteCount += 1;
				}else if(ch === '}'){
					quoteCount -= 1;
				}
				if(!quoteCount){
					break;
				}
				string += ch;
				cursor += 1;
			}
			return {cursor: cursor, string: string};*/
		}
		function parseTag(source, cursor, isChild){
			var part_1 = parseTagName(source, cursor + 1), part_2 = {}, tag = {};
			if(part_1.name){
				part_2 = parseTagAttrs(source, part_1.cursor);
			}
			extend(tag, part_1, part_2);
			return {cursor: tag.cursor, tag: tag.name ? tag : null};
		}
		function parseTagName(source, cursor){
			var ch, name = '';
			var open = true;
			cursor = skipWhiteSpaces(source, cursor);
			if(source[cursor] === '/'){
				open = false;
				cursor = skipWhiteSpaces(source, cursor + 1);
			}
			while(ch = source[cursor]){
				if(isWhiteSpace[ch] || ch === '>'){
					break;
				}else if(invalidChar[ch]){
					//add some err or warning
					//add cheking if is operator < TODO(1)
					name = '';
					break;
				}
				
				name += ch;	
				cursor += 1;
			}
			if(name){
				var tag = {
					name: name, 
					cursor: cursor,
					open: open,
					selfClosing: false
				};
				tag['native'] = nativeTags[name] !== undefined;
				if(tag['native']){
					tag['selfClosing'] = !!nativeTags[name];
				}else{
					tag['native'] = name.indexOf('-') !== -1;
				}
				return tag
			}else{
				return {
					cursor: cursor
				}
			}
		}
		var contextIndex = -1;
		var context = [];
		function pushContext(){
			contextIndex += 1;
			return context.push({
				text: '',
				tagContext: 0,
				braceCounter: 0, 
				cursor: 0
			});
		}
		function popContext(){
			contextIndex -= 1;
			return context.pop();
		}
		function parseTagAttrs(source, cursor){
			var stringChars = {"'": 1, '"': 1};
			var ch, attrs = [];
			var name = '';
			var valueOpenCh;
			var selfClosing = false;
			var isAttrName = true // if true - isAttrName attr name if flase - isAttrName attr value
		 	while(ch = source[cursor]){
		 		if(ch === '/'){
		 			cursor = skipWhiteSpaces(source, cursor + 1);
		 			if(source[cursor] !== '>'){
		 				//error: symbols after self closing
		 			}else{
		 				selfClosing = true;
		 			}
		 			if(name !== ''){
		 				attrs.push({
		 					name: name,
		 					value: 'true',
		 					type: 'expression'
		 				});
		 			}
		 			break;
		 		}else if(ch === '>'){
		 			break;
		 		}
				if(isAttrName){
					if((isWhiteSpace[ch] || ch === '=') && name !== ''){
						isAttrName = false;
					}else if(ch === '{' && name === ''){
						var res = skipString(source, cursor, true);
						attrs.push({
							value: res.string,
							type: 'extend'
						});
						cursor = res.cursor - 1;
					}else if(!invalidChar[ch]){
						if(!isWhiteSpace[ch]){
							name += ch;	
						}
					}else{
						// error: invalid name
					}
				}else{
					cursor = skipWhiteSpaces(source, cursor);
					ch = source[cursor];
					if(stringChars[ch]){
						var res = skipString(source, cursor, true);
						cursor = res.cursor - 1;
						attrs.push({
							name: name,
							value: res.string,
							type: 'string'
						});
						name = '';
					}else if(ch === '{'){
						var res = skipExpression(source, cursor);
						cursor = res.cursor;
						attrs.push({
							name: name,
							value: res.string,
							type: 'expression'
						});
						name = '';
					}else{
						attrs.push({
							name: name,
							value: 'true',
							type: 'expression'
						});
						name = ch;
					}
					isAttrName = true;
				}
				cursor += 1;
			}
			var tag = { attrs: attrs, cursor: cursor };
			if(selfClosing){
				tag['selfClosing'] = selfClosing;
			}
			return tag;
		}
		function tokenazer(source, insideBraces, cursor){
			pushContext();
			if(insideBraces){
				context[contextIndex]['braceCounter'] += 1;
			}
			cursor = cursor || 0;
			var textToken = '', ch;
			var isText = 0;
			while(ch = source[cursor]){
				if(insideBraces){
					if(ch === '}'){
						context[contextIndex]['braceCounter'] -= 1;
					}else if(ch === '{'){
						context[contextIndex]['braceCounter'] += 1;
					}
					if(!context[contextIndex]['braceCounter']){
						context[contextIndex]['cursor'] = cursor;
						if(textToken !== ''){
							emit('text', textToken);
						}
						return popContext();
					}
				}
				if(stringSymbols[ch]){
					var res = skipString(source, cursor);
					textToken += res.string;
					cursor = res.cursor - 1;
					ch = '';
				}if(ch === '
	}()); && source[cursor + 1] === '{'){
					if(textToken){
						emit('text', textToken);
					}
					var res = skipExpression(source, cursor + 1);
					emit('expression', res.string);
					cursor = res.cursor + 1;
					textToken = '';
					ch = '';
				}else if(ch === '<'){
					var res = parseTag(source, cursor);
					if(res.tag){
						cursor = res.cursor + 1;
						if(textToken){
							if(!isText){
								emit('text', textToken);
								textToken = '';
							}else{
								emit('text', textToken, true);
								textToken = '';
							}
						}
						if(res.tag.open){
							if(!context[contextIndex]['tagContext']){
								res.tag.root = true;
							}
							if(!res.tag.selfClosing){
								context[contextIndex]['tagContext'] += 1;
							}
							if(res.tag.name !== 'text'){
								emit('openTag', res.tag);
							}else{
								isText += 1;
							}
						}else{
							if(!res.tag.selfClosing){
								context[contextIndex]['tagContext'] -= 1;
							}
							if(res.tag.name !== 'text'){
								if(!context[contextIndex]['tagContext']){
									res.tag.root = true;
								}
								emit('closeTag', res.tag);
							}else{
								isText -= 1;
							}
						}
						ch = '';
					}else{
						cursor += 1;	
					}
				}else{
					cursor += 1;
				}
				textToken += ch;
			}
			if(textToken !== ''){
				emit('text', textToken);
			}
			context[contextIndex]['cursor'] = cursor;
			return popContext();
		}
		var listeners = {
			openTag: [], 
			closeTag: [], 
			text: [],
			error: [],
			expression: []
		};
		function emit(type, data, _context){
			for (var i = 0; i < listeners[type].length; i++) {
				var listenerResult = listeners[type][i](data, _context);
				if(listenerResult){
					context[contextIndex]['text'] += listenerResult;
				}
			}
		};
		var buffer = '';
		function addListener(listenerType, listener){
			if(listener instanceof Function){
				listeners[listenerType].push(listener);
				return true;
			}
			return false;
		}
		function removeListener(listenerType, listener){
			var listenerIndex = listeners[listenerType].indexOf(listener);
			if(listenerIndex !== -1){
				listeners[listenerType].splice(listenerIndex, 0);
				return true;
			}
			return false;
		}
		module.exports = {
			onOpenTag: addListener.bind(this, 'openTag'),
			onCloseTag: addListener.bind(this, 'closeTag'),
			onText: addListener.bind(this, 'text'),
			onError: addListener.bind(this, 'error'),
			onExpression: addListener.bind(this, 'expression'),
			offOpenTag: removeListener.bind(this, 'openTag'),
			offCloseTag: removeListener.bind(this, 'closeTag'),
			offText: removeListener.bind(this, 'text'),
			offError: removeListener.bind(this, 'error'),
			offExpression: removeListener.bind(this, 'expression'),
			write: function(string){
				buffer += string;
			},
			end: function(){
				return tokenazer(buffer)['text'];
			},
			parse: function(string){
				return tokenazer(string)['text'];
			}
		};
	}());
	return __Dependencies;
}));