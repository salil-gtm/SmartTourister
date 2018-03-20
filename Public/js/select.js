// font-family: 'Changa', sans-serif; */
// /* font-family: 'Cairo', sans-serif; */
// /* font-family: 'Amiri', serif; */
// /* font-family: 'Rakkas', cursive; */
// /* font-family: 'Jomhuria', cursive; */
// /* font-family: 'Mirza', cursive; */
// /* font-family: 'Harmattan', sans-serif; */
// /* font-family: 'El Messiri', sans-serif; */
// /* font-family: 'Lateef', cursive;
var objs = document.getElementsByClassName('item');
for(var i=0;i<objs.length;++i){
	objs[i].addEventListener('click', function(){
		this.classList.toggle("selecteditem");
	})
}
var array = [];
var submitBtn = function(){
	var items = document.querySelectorAll('.selecteditem > p');
	for(var i=0;i< items.length;++i){
		array.push(items[i].innerText);
		console.log(items[i].innerText);
	}
	array = JSON.stringify(array);
	console.log(array);
	document.getElementById('idHidden').value = array;
	document.getElementById('selectForm').submit();
}
