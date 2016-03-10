var nativeTags = require('../include/native-tags.js');
var isWhiteSpace = require('../include/whitespaces.js');
var invalidChar = require('../include/invalidCharsFromName.js');
var stringSymbols = {'"': 1, "'": 1, '`': 1};

var extend = require('../include/extend.js');

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
					emit('text', textToken, !!isText);
				}
				return popContext();
			}
		}
		if(stringSymbols[ch]){
			var res = skipString(source, cursor);
			textToken += res.string;
			cursor = res.cursor - 1;
			ch = '';
		}if(ch === '$' && source[cursor + 1] === '{'){
			if(textToken){
				emit('text', textToken, !!isText);
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
						emit('text', textToken, !!isText);
						textToken = '';
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
		emit('text', textToken, !!isText);
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