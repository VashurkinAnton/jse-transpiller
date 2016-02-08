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
	return 'elm.text('+text+');';
});

jsnTokenizer.onCloseTag(function(tag){
	if(tag.rootEnd){
		skipNextDelimeter = true;
		return 'return elm.close(); }).call(this, ' + pipeElmName + ');';
	}
});

jsnTokenizer.onOpenTag(function(tag){
	var text = '';
	if(tag.root){
		text += '(function(Elm){var elm = Elm();';
	}
	var attrs = Object.keys(tag.attrs).map(function(key){
		if(tag.attrs[key]['type'] === 'string'){
			return '"'+tag.attrs[key].name+'":"'+tag.attrs[key].value+'"';
		}else{
			return '"'+tag.attrs[key].name+'":'+tag.attrs[key].value;
		}
	}).join(',');
	var bind = [];
	if(tag.selfClosing){
		bind.push('selfClosing:true');
		if(tag.root){
			text += 'return ';
		}
	}
	bind = bind.join(',');
	text += 'elm.open';
	if(bind){
		text += '.bind({'+bind+'})';
	}
	text +='("'+tag.name+'"';
	if(attrs){
		text += ',{'+attrs+'});';
	}else{
		text += ');';
	}
	if(tag.selfClosing && tag.root){
		text += '}).call(this, ' + pipeElmName + ');';
		skipNextDelimeter = true;
	}
	return text;
});

module.exports = {
	parse: function(source){
		return jsnTokenizer.parse(source);
	},
	setPipeElmName: function(newPipeElmName){
		pipeElmName = newPipeElmName;
	}
};