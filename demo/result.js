function component(items){
	return [
		(function(Elm){var elm = Elm();elm.open("h1");elm.text("Header 1");return elm.close(); }).call(this, JSE),
		(function(Elm){var elm = Elm();elm.open("h2");elm.text("Header 2");return elm.close(); }).call(this, JSE),
		(function(Elm){var elm = Elm();elm.open("h3");elm.text("Header 3");return elm.close(); }).call(this, JSE),
		(function(Elm){var elm = Elm();elm.open("h4");elm.text("Header 4");return elm.close(); }).call(this, JSE),
		(function(Elm){var elm = Elm();elm.open("h5");elm.text("Header 5");return elm.close(); }).call(this, JSE),
		(function(Elm){var elm = Elm();elm.open("h6");elm.text("Header 6");return elm.close(); }).call(this, JSE)
	];
}

var a = (function(Elm){var elm = Elm();elm.open("div",{"class":"data"});
	elm.component("component",component);elm.close();
return elm.close(); }).call(this, JSE);

document.body.appendChild(a);
