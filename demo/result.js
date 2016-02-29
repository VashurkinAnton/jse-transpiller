function(){
	function component(){
		return [
			(function(Elm){var elm = Elm();elm.open("h1");elm.text("Header 1");return elm.close(); }).call(this, JSE),
			(function(Elm){var elm = Elm();elm.component("h2",h2);elm.text("Header 2");return elm.close(); }).call(this, JSE),
			(function(Elm){var elm = Elm();elm.component("h3",h3);elm.text("Header 3");return elm.close(); }).call(this, JSE),
			(function(Elm){var elm = Elm();elm.component("h4",h4);elm.text("Header 4");return elm.close(); }).call(this, JSE),
			(function(Elm){var elm = Elm();elm.component("h5",h5);elm.text("Header 5");return elm.close(); }).call(this, JSE),
			(function(Elm){var elm = Elm();elm.component("h6",h6);elm.text("Header 6");return elm.close(); }).call(this, JSE)
		];
	}

	return (function(Elm){var elm = Elm();elm.open("div",{"class":"data"});
		elm.component.bind({selfClosing:true})("component",component);
	return elm.close(); }).call(this, JSE);
}