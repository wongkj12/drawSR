 //tf.js script
 var script = document.createElement("script");
 script.type = 'text/javascript';
 script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest';
 document.head.appendChild(script);


 const model_input_size = 256;
 var model = undefined;
 var canvas;
 var oCanvas = document.getElementById("oCanvas");

 //slider
 $("#range-slider").on("change", function() {
 	canvas.freeDrawingBrush.width = parseInt(this.value);
 });

 function prepareCanvas() {
 	canvas = window._canvas = new fabric.Canvas('canvas');
 	canvas.backgroundColor = "white";
 	canvas.isDrawingMode = 0; //dont allow first
 	canvas.freeDrawingBrush.color = "#fb8a05" //lane

 	canvas.freeDrawingBrush.width = 55;
 	canvas.renderAll();
 	//setup listeners to start predicting when the mouse is up
 	canvas.on("mouse:up", function(e) {
 		//get img from drawing canvas => tf.predict => output canvas
 		setTimeout(function(){
 			const imgData = getImageData();
 			const pred = predict(imgData)
 			tf.browser.toPixels(pred, oCanvas)
 		}, 300); //waits 300ms before getting imgdata for canvas to update
 	});

 }


 //get current image data
 function getImageData() {
 	const dpi = window.devicePixelRatio;
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
		console.log("Predicting...")
		const oImg = model.apply(
			preprocess(imgData),
			{training: true}
		); 
		const postImg = postprocess(oImg);
		return postImg;
		});

}

//preprocessing
function preprocess(imgData) {
    return tf.tidy(() => {
        //convert to a tensor 
        const tensor = tf.browser.fromPixels(imgData).toFloat()
        //resize 
        const resized = tf.image.resizeBilinear(tensor, [model_input_size, model_input_size])
        console.log("resized.shape is " + resized.shape);
              
        //normalize 
        const offset = tf.scalar(0.5*model_input_size);
        const normalized = resized.div(offset).sub(tf.scalar(1.0));
        console.log("normalized.shape is " + normalized.shape);

        //Add a dimension to get a batch shape 
        const batched = normalized.expandDims(0)
        console.log("batched.shape is " + batched.shape);
        
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

function random_sample()
{
	var imgData = new Image;
	rand = Math.floor(Math.random() * 13) + 1;
	imgData.src = "random_images/" + rand + ".png";
	imgData.onload = function () {
		const img = new fabric.Image(imgData, {
			scaleX: canvas.width / model_input_size,
			scaleY: canvas.height / model_input_size,
		});
		erase();
		canvas.add(img);
		const pred = predict(imgData);
		tf.browser.toPixels(pred,oCanvas);
	}
}
	

//initial sample prediction
function samplePredict(imgName)
{
	var imgData = new Image;
	imgData.src = imgName
	imgData.onload = function () {
		const img = new fabric.Image(imgData, {
			scaleX: canvas.width / model_input_size,
			scaleY: canvas.height / model_input_size,
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

	//sample
	samplePredict(imgName);

	//status
	document.getElementById('status').innerHTML = "Model Loaded!";
	document.getElementById('loader1').style.display = "none"

	allowDrawing();
}

function allowDrawing(){
	canvas.isDrawingMode = 1;

	//allow clear
	$("#clear").prop("disabled",false);

	var slider = document.getElementById("range-slider");

	$(".color-field").on("click",function(element){
		canvas.freeDrawingBrush.color = element.target.style.background;
	});

}

function erase() {
	canvas.clear();
	canvas.backgroundColor = "white";
}

function release()
{
	if(model != undefined){
		model.dispose();
	}
}

window.onbeforeunload = function(e) {
	release();
}

 