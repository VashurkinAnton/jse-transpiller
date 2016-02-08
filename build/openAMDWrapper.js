(function (root, factory) {
	// Configuration
	var exportName = '%moduleName%';
	var dependenciesNames = [];

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(exportName, dependenciesNames, factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		var resolvedDependencies = dependenciesNames.map(function (name) {
			return require(name);
		});
		module.exports = factory.apply(root, resolvedDependencies);
	} else {
		// Browser globals (root is window)
		var resolvedDependencies = dependenciesNames.map(function (name) {
			return root[name];
		});
		root[exportName] = factory.apply(root, resolvedDependencies);
	}

// Dependencies passed as arguments
}(this, function(){