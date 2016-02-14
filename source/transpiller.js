var jsnTokenizer = require('./tokenizer.js');

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

module.exports = {
	parse: function(source){
		return jsnTokenizer.parse(source);
	},
	setPipeElmName: function(newPipeElmName){
		pipeElmName = newPipeElmName;
	}
};