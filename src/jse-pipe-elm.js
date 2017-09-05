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
        root.JSE = factory(require);
  }
}(this, function (require) {
	var extend_ = require('/jse-transpiller/include/extend.js');
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
					var child = shimes['DOM'](tree.children[i], DOM, components);
					if (Array.isArray(child)) {
		 				child.forEach(function (c) { node.appendChild(c); });
					} else {
		 				node.appendChild(child);
					}
			 	}
		 	}
	 	}
	 	return node;
	 }
	}
	return  function(){
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
			if (components[tagName]) {
				node.isComponent = true;
			}
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
	return __Dependencies;
}));
