var nativeTags = require('../include/native-tags.js');
var isWhiteSpace = require('../include/whitespaces.js');
var invalidChar = require('../include/invalidCharsFromName.js');
var stringSymbols = {'"': 1, "'": 1, '`': 1};

var extend = require('../include/extend.js');

function skipString(source, cursor, removeQuotes){
	var isString = true, ch;
	var openQuote = source[cursor];
	var string = '';
	cursor += 1;
	while(isString && (ch = source[cursor])){
		if(ch === openQuote){
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
		return {cursor: cursor, string: openQuote + string};
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
	var ch, quoteCount = 1, string = '';
	cursor += 1;
	while(ch = source[cursor]){
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
	return {cursor: cursor, string: string};
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
function parseTagAttrs(source, cursor){
	var stringChars = {"'": 1, '"': 1};
	var ch, attrs = [];
	var name = '';
	var valueOpenCh;
	var selfClosing = false;
	var wait = true // if true - wait attr name if flase - wait attr value
 	while(ch = source[cursor]){
 		if(ch === '/'){
 			cursor = skipWhiteSpaces(source, cursor + 1);
 			if(source[cursor] !== '>'){
 				//error: symbols after self closing
 			}else{
 				selfClosing = true;
 			}
 			break;
 		}else if(ch === '>'){
 			break;
 		}
		if(wait){
			if((isWhiteSpace[ch] || ch === '=') && name !== ''){
				wait = false;
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
				wait = true;
			}else if(ch === '{'){
				var res = skipExpression(source, cursor);
				cursor = res.cursor;
				attrs.push({
					name: name,
					value: res.string,
					type: 'expression'
				});
				name = '';
				wait = true;
			}else{
				//error: invalid value
			}
		}
		cursor += 1;
	}
	var tag = { attrs: attrs, cursor: cursor };
	if(selfClosing){
		tag['selfClosing'] = selfClosing;
	}
	return tag;
}
function parseExpression(source, cursor){
	var ch, string = '', quoteCount = 1; cursor += 1;
	while(ch = source[cursor]){
		if(stringSymbols[ch]){
			var res = skipString(source, cursor);
			string += res.string;
			cursor = res.cursor;
			ch = '';
		}else if(ch === '{'){
			quoteCount += 1;
		}else if(ch === '}'){
			quoteCount -= 1;
		}
		if(!quoteCount){
			cursor += 1;
			break;
		}
		string += ch;
		cursor += 1;
	}
	return {string: string, cursor: cursor};
}
var tagContext = 0;
function tokenazer(source){
	var cursor = 0, ch;
	var textToken = '';
	var isText = 0;
	while(ch = source[cursor]){
		if(stringSymbols[ch]){
			var res = skipString(source, cursor);
			textToken += res.string;
			cursor = res.cursor;
			ch = '';
		}else if(ch === '<'){
			var res = parseTag(source, cursor);
			if(res.tag){
				cursor = res.cursor + 1;
				if(textToken){
					if(!tagContext){
						emit('text', textToken);
					}else{
						var token = '';
						var skipBuffer = '';
						var i = 0;
						var maybeExpression = false;
						while(ch = textToken[i]){
							if(stringSymbols[ch]){
								var _res = skipString(textToken, i);
								token += _res.string;
								i = _res.cursor;
								ch = '';
							}else if(ch === '$'){
								maybeExpression = true;
								skipBuffer += ch;
								ch = '';
							}else if(isWhiteSpace[ch] && maybeExpression){
								skipBuffer += ch;
							}else if(ch === '{' && maybeExpression){
								if(!isText){
									emit('text', token);
								}else{
									emit('text', token, true); // text with tag context
								}
								var _res = parseExpression(textToken, i);
								i = _res.cursor;
								ch = '';
								maybeExpression = false;
								emit('expression', _res.string);
								skipBuffer = '';
								token = '';
							}else if(maybeExpression){
								maybeExpression = false;
								token += skipBuffer;
								skipBuffer = '';
							}
							token += ch;
							i += 1;
						}
						if(token){
							if(!isText){
								emit('text', token);
							}else{
								emit('text', token, true); // text with tag context
							}
						}
					}
				}
				if(res.tag.open){
					if(!tagContext){
						res.tag.root = true;
					}
					if(!res.tag.selfClosing){
						tagContext += 1;
					}
					if(res.tag.name !== 'text'){
						emit('openTag', res.tag);
					}else{
						isText += 1;
					}
				}else{
					if(!res.tag.selfClosing){
						tagContext -= 1;
					}
					if(res.tag.name !== 'text'){
						if(!tagContext){
							res.tag.rootEnd = true;
						}
						emit('closeTag', res.tag);
					}else{
						isText -= 1;
					}
				}
				textToken = '';
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
}

var listeners = {
	openTag: [], 
	closeTag: [], 
	text: [],
	error: [],
	expression: []
};
var parseResult = '';
function emit(type, data, context){
	for (var i = 0; i < listeners[type].length; i++) {
		var listenerResult = listeners[type][i](data, context);
		if(listenerResult){
			parseResult += listenerResult;
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
		tokenazer(buffer);
		
		var _parseResult = parseResult;
		parseResult = '';
		buffer = '';
		return _parseResult;
	},
	parse: function(string){
		tokenazer(string);

		var _parseResult = parseResult;
		parseResult = '';
		return _parseResult;
	}
};