 const canvas = document.getElementById("canvas");
 canvas.width = 512;
 canvas.height = 512;

 let context = canvas.getContext("2d")
 let start_background_color = "white"
 context.fillStyle = start_background_color;
 context.fillRect(0, 0, canvas.width, canvas.height);

 let draw_color = "#fb8a05"; //lane
 let draw_width = "55";
 let is_drawing = false;

 function change_color(element){
 	draw_color = element.style.background;
 }


 canvas.addEventListener("touchstart", start, false);
 canvas.addEventListener("touchmove", draw, false);
 canvas.addEventListener("mousedown", start, false);
 canvas.addEventListener("mousemove", draw, false);

 canvas.addEventListener("touchend",stop,false);
 canvas.addEventListener("mouseup",stop,false);
 canvas.addEventListener("mouseout",stop,false )

 function start(event) {
 	is_drawing = true;
 	context.beginPath();
 	context.moveTo(getX(event), getY(event));
 	event.preventDefault();
 }

 function draw(event) {
 	if (is_drawing) {
 		context.lineTo(getX(event), getY(event));
 		context.strokeStyle = draw_color;
 		context.lineWidth = draw_width;
 		context.lineCap = "round";
 		context.lineJoin = "round";
 		context.stroke();
 	}
 	event.preventDefault();
 }

 function getX(event) {
 	if (event.pageX == undefined) {return event.targetTouches[0].pageX -
 	canvas.offsetLeft} //i.e. if no click event is registered, check for touch event
 	else {return event.pageX - canvas.offsetLeft}
 }

 function getY(event) {
 	if (event.pageY == undefined) {return event.targetTouches[0].pageY -
 	canvas.offsetTop} //i.e. if no click event is registered, check for touch event
 	else {return event.pageY - canvas.offsetTop}
 }
 
 function stop(event) {
 	if (is_drawing){
 		context.stroke();
 		context.closePath();
 		is_drawing = false;
 	}
 	event.preventDefault();
 }

function clear_canvas(){
		context.fillStyle = start_background_color;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillRect(0, 0, canvas.width, canvas.height);
}

