console.log("Loading Java script");




var dirty = 0;
var SaveData = function(){
	dirty = 0;
	var description = document.getElementById('discription').value;
	console.log("Clicked save button");
	 ajax.post('/saveDiscription', {description: description}, function() {});
}
