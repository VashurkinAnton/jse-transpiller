module.exports = function(){
	var obj = arguments[0];
	for(var argvIndex = 0; argvIndex < arguments.length; argvIndex++){
		for(var keyIndex = 0, keys = Object.keys(arguments[argvIndex] || {}); keyIndex < keys.length; keyIndex++){
			obj[keys[keyIndex]] = arguments[argvIndex][keys[keyIndex]];
		}
	}
	return obj;
}