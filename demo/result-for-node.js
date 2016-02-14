var JSE = require('../source/pipe-elm.js');

console.log(JSON.stringify((function(Elm){var elm = Elm();elm.open("span",{"id":1+2,"class":"string"});
	elm.open("p");
		for(var i = 0; i < 10; i++){
			elm.open("span");
				elm.text("even:");
				if(i % 2 === 0){
					elm.text("true");
				}else{
					elm.text("false");
				}
			elm.close();
			elm.text((function(Elm){var elm = Elm();return elm.open.bind({selfClosing:true})("hr",{"class":"hr","data-even":i % 2 === 0});}).call(this, JSE));
		}
	elm.close();
	elm.text("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, repudiandae.");
return elm.close(); }).call(this, JSE), true, 2));