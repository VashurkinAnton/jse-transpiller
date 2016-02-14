var JSE = require('../source/pipe-elm.js');

console.log(JSON.stringify(<span id={1+2} class="string">
	<p>
		for(var i = 0; i < 10; i++){
			<span>
				<text>even:</text>
				if(i % 2 === 0){
					<text>true</text>
				}else{
					<text>false</text>
				}
			</span>
			${<hr class="hr" data-even={i % 2 === 0}>}
		}
	</p>
	<text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, repudiandae.</text>
</span>, true, 2));