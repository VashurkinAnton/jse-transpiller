function(){
	function component(){
		return [
			<h1><text>Header 1</text></h1>,
			<h2><text>Header 2</text></h2>,
			<h3><text>Header 3</text></h3>,
			<h4><text>Header 4</text></h4>,
			<h5><text>Header 5</text></h5>,
			<h6><text>Header 6</text></h6>
		];
	}

	return <div class='data'>
		<component />
	</div>;
}