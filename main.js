 //tj.js script
 var script = document.createElement("script");
 script.type = 'text/javascript';
 script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest';
 document.head.appendChild(script);


 var model = undefined;
 var canvas;
 var oCanvas = document.getElementById("oCanvas");


//color pallette click event
$(".color-field").on("click",function(element){
	draw_color = element.target.style.background;
})

//slider
$("#range-slider").on("input change", function() {
	canvas.freeDrawingBrush.width = this.value;
})



 function prepareCanvas() {
 	canvas = window._canvas = new fabric.Canvas('canvas');
 	canvas.backgroundColor = "white";
 	canvas.isDrawingMode = 1;
 	canvas.freeDrawingBrush.color = "#fb8a05" //lane
 	canvas.freeDrawingBrush.width = $("#range-slider").value
 	canvas.renderAll();
 	//setup listeners to start predicting when the mouse is up
 	canvas.on("mouse:up", function(e) {
 		//get img from drawing canvas => tf.predict => output canvas
 		const imgData = getImageData();
 		const pred = predict(imgData)
 		tf.browser.toPixels(pred, oCanvas)

 		//mousePressed = false;
 	});
 	/*canvas.on('mouse:down', function(e) {
        mousePressed = true
    });*/

 }


 //get current image data
 function getImageData() {
 	//const dpi = window.devicePixelRatio
 	const dpi = 1;
 	const x = 0 * dpi;
 	const y = 0 * dpi;
 	const w = canvas.width * dpi;
 	const h = canvas.height * dpi;
 	const imgData = canvas.contextContainer.getImageData(x, y, w, h);
 	return imgData;
 }

 //get prediction from tf
function predict(imgData) {
	return tf.tidy(() => {
		const oImg = model.predict(preprocess(imgData));
		//post process
		const postImg = postprocess(oImg);
		return postImg;
	})
}

//preprocessing
function preprocess(imgData) {
    return tf.tidy(() => {
        //convert to a tensor 
        const tensor = tf.browser.fromPixels(imgData).toFloat()
        //resize 
        const resized = tf.image.resizeBilinear(tensor, [256, 256])
                
        //normalize 
        const offset = tf.scalar(127.5);
        const normalized = resized.div(offset).sub(tf.scalar(1.0));

        //We add a dimension to get a batch shape 
        const batched = normalized.expandDims(0)
        
        return batched
    })
}

//post process
function postprocess(tensor){
     const w = canvas.width  
     const h = canvas.height 
     
     return tf.tidy(() => {
        //normalization factor  
        const scale = tf.scalar(0.5);
        
        //unnormalize and sqeeze 
        const squeezed = tensor.squeeze().mul(scale).add(scale)

        //resize to canvas size 
        const resized = tf.image.resizeBilinear(squeezed, [w, h])
        return resized
    })
}


//initial sample prediction
function samplePredict(imgName)
{
	var imgData = new Image;
	imgData.src = imgName
	imgData.onload = function () {
		const img = new fabric.Image(imgData, {
			scaleX: canvas.width / 256,
			scaleY: canvas.height / 256,
		});
		canvas.add(img);
		const pred = predict(imgData);
		tf.browser.toPixels(pred, oCanvas);
	}
}

//load model
async function start(imgName, modelPath) {
	//load the model
	model = await tf.loadLayersModel(modelPath);

	//status
	document.getElementById('status').innerHTML = "Model Loaded";

	//sample
	samplePredict(imgName);

	allowDrawing();
}

function allowDrawing(){
	canvas.isDrawingMode = 1; //neccessary?

	//allow clear
	$("#clear").prop("disabled",false);
	var slider = document.getElementById("range-slider");
	slider.oninput = function() {
		canvas.freeDrawingBrush.width = this.value;
	};
}

function erase() {
	canvas.clear();
	canvas.backgroundColor = "white";
}

//release resources when leaving page?
function release()
{
	if(model != undefined){
		model.dispose();
	}
}

window.onbeforeunload = function(e) {
	release();
}

 /*
 --------------------OLD CANVAS SCRIPT--------------------

 var canvas = document.getElementById("canvas");
 canvas.width = 256;
 canvas.height = 256;

 let context = canvas.getContext("2d")
 let start_background_color = "white"
 context.fillStyle = start_background_color;
 context.fillRect(0, 0, canvas.width, canvas.height);

 canvas.addEventListener("touchstart", startcanvas, false);
 canvas.addEventListener("touchmove", draw, false);
 canvas.addEventListener("mousedown", startcanvas, false);
 canvas.addEventListener("mousemove", draw, false);

 canvas.addEventListener("touchend",stop,false);

 function startcanvas(event) {
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
}*/

