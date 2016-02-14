var extend = require('../include/extend.js');
var shimes = {
 'react': function(tree, React, components){
  return React.createElement(tree.isComponent ? components[tree.tag] : tree.tag, tree.attrs, (tree.children || []).map(function(child){
     if(typeof child === 'string'){
       return child;
      }else{
       return shimes['react'](child, React, components);
      }
  }));
 },
 'DOM': function(tree, DOM, components){
 	if(tree.isComponent){
 		var node;
 		var childrens = [];
	 	for(var i = 0, len = (tree.children || []).length; i < len; i++){
		 	if(typeof tree.children[i] === 'string'){
		 		childrens.push(DOM.createTextNode(tree.children[i]));
		 	}else if(tree.children[i] instanceof HTMLElement){
		 		childrens.push(tree.children[i]);
		 	}else{
	 			childrens.push(shimes['DOM'](tree.children[i], DOM, components)); 
		 	}
	 	}
 		if(components[tree.tag] instanceof Function){
 			node = components[tree.tag](tree.attrs, childrens);
 			if(!node){
 				console.warn(tree.tag, 'return not DOM element. Autofixing: container replaced for div element.');
 				node = shimes['DOM']({tag: 'div', attrs: tree.attrs, childrens}, DOM, components);
 			}
 		}else{
 			console.warn(tree.tag, 'is not a componet function. Autofixing: container replaced for div element.');
 			node = shimes['DOM']({tag: 'div', attrs: tree.attrs, childrens}, DOM, components);
 		}
 	}else{
	 	var node = DOM.createElement(tree.tag);
	 	var textField = tree.tag === 'input' || tree.tag === 'textarea';
	 	if(tree.attrs){
	 		for(var i = 0, k = Object.keys(tree.attrs), key = k[0], value=tree.attrs[key], l = k.length; i < l; i++, key = k[i], value=tree.attrs[key]){
	 			if((key in node) || (textField && key === 'value')){
	 				node[key] = value;
	 			}else{
	 				node.setAttribute(key, value);
	 			}
	 		}
	 	}
	 	for(var i = 0, len = (tree.children || []).length; i < len; i++){
		 	if(typeof tree.children[i] === 'string'){
		 		node.appendChild(DOM.createTextNode(tree.children[i]));
		 	}else if(tree.children[i] instanceof HTMLElement){
		 		node.appendChild(tree.children[i]);
		 	}else{
	 			node.appendChild(shimes['DOM'](tree.children[i], DOM, components)); 
		 	}
	 	}
 	}
 	return node;
 }
}

module.exports = function(){
	var elements = [];
	var current = -1;
	var components = {};
	var self = {};
	
	if(typeof React === 'object'){
		self.shim = {name: 'react', worker: React};
	}else if(typeof document === 'object'){
		self.shim = {name: 'DOM', worker: document};
	}
	
	self.component = function(name, component, attrs){
		components[name] = component;
		self.open(name, attrs);
	}
	self.open = function(tagName, attrs){
		if(Array.isArray(attrs)){
			attrs = extend.apply(this, attrs);
		}
		var node = {tag: tagName, attrs: attrs || null, children: []};
		if(elements[current]){
			elements[current]['children'].push(node);
		}
		if(!this.selfClosing){
			elements.push(node);
			current += 1;
		}else if(current === -1){
			if(self.shim){
				return shimes[self.shim.name](node, self.shim.worker, components);
			}else{
				return node;
			}
		}
	}
	self.close = function(){
		current -= 1;
		if(self.shim && current === -1){
			return shimes[self.shim.name](elements.pop(), self.shim.worker, components);
		}else{
			return elements.pop();
		}
	}
	self.text = function(data){
		elements[current]['children'].push(data);
	}
	return self;
}