 const canvas = document.getElementById("canvas");
 canvas.width = 512;
 canvas.height = 512;

 let context = canvas.getContext("2d")
 let start_background_color = "white"
 context.fillStyle = start_background_color;
 context.fillRect(0, 0, canvas.width, canvas.height);

 let draw_color = "white";
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
 	context.moveTo(event.clientX - canvas.offsetLeft,
 		event.clientY - canvas.offsetTop);
 	event.preventDefault();
 }

 function draw(event) {
 	if (is_drawing) {
 		context.lineTo(event.clientX - canvas.offsetLeft,
 			event.clientY - canvas.offsetTop);
 		context.strokeStyle = draw_color;
 		context.lineWidth = draw_width;
 		context.lineCap = "round";
 		context.lineJoin = "round";
 		context.stroke();
 	}
 	event.preventDefault();
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