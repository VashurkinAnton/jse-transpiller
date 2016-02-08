function s(i){
	return <span>${i}</span>;
}
function hr(){
	return <hr>
}
var n = <div onclick={function(){console.log('on click')}} dontRemoveMePleace>
 for(var i = 0; i < 2; i++){
  var span1 = s(i + 1);
  var span0 = s(i);

  ${i}<text>:Custom text ${i + 1}</text>
  ${span0}
  ${span1}
  <hr>
 }
</div>;