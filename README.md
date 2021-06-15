# pix2pix Implementation with tensorflow.js

Try the live demo [here](https://wongkj12.github.io/drawSR/)

!(/docs/sample.gif)

This project was based on this tensorflow implementation of pix2pix: [https://github.com/affinelayer/pix2pix-tensorflow](https://github.com/affinelayer/pix2pix-tensorflow). 

##How I trained the pix2pix model from scratch
1. Prepare data
	- Create image pairs
2. Train the model with /pix2pix-tensorflow
3. Test the model
4. Export the model
5. Convert to Keras then port to tensorflow.js
6. Run model in browser app

For steps 5 & 6, I referred to this tutorial: [https://blog.usejournal.com/fast-pix2pix-in-the-browser-287d9858a5e4](https://blog.usejournal.com/fast-pix2pix-in-the-browser-287d9858a5e4).

##Data prep
