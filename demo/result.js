function s(i){
	return (function(){var elm = Elm();elm.open("span");elm.text(i);return elm.close(); })();
}
function hr(){
	return (function(){var elm = Elm();return elm.open.bind({selfClosing:true})("hr");})();
}
var n = (function(){var elm = Elm();elm.open("div",{"onclick":function(){console.log('on click')}});
 for(var i = 0; i < 2; i++){
  var span1 = s(i + 1);
  var span0 = s(i);

  elm.text(i);elm.text(":Custom text ");elm.text(i + 1);
  elm.text(span0);
  elm.text(span1);
  elm.open.bind({selfClosing:true})("hr");
 }
return elm.close(); })();