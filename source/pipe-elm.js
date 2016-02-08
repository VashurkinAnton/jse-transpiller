module.exports = function(){
	var self = {};
	var pointer = [];
	var current = -1;
	function setText(data){
		if(data instanceof HTMLElement){
			return data;
		}else if(typeof data === 'string' || typeof data === 'number'){
			return document.createTextNode(''+data);
		}
	}
	self.open = function(tagName, attrs){
		var node = document.createElement(tagName);
		if(attrs){
			for(var i = 0, k = Object.keys(attrs), key = k[0], value=attrs[key], l = k.length; i < l; i++, key = k[i], value=attrs[key]){
				if(key in node){
					node[key] = value;
				}else{
					node.setAttribute(key, value);
				}
			}
		}
		if(pointer[current]){
			pointer[current].appendChild(node);
		}
		if(!this.selfClosing){
			pointer.push(node);
			current += 1;
		}
		return node;
	}
	self.close = function(){
		current -= 1;
		return pointer.pop();
	}
	self.text = function(data){
		if(Array.isArray(data)){
			for(var i = 0, len = data.length; i < len; i++){
				var res = setText(data[i]);
				if(res){
					pointer[current].appendChild(res);
				}
			}
		}else{
			var res = setText(data);
			if(res){
				pointer[current].appendChild(res);
			}
		}
	}
	return self;
}