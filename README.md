# pix2pix Implementation with tensorflow.js

Try the live demo [here](https://wongkj12.github.io/drawSR/)

![sample gif](/docs/sample.gif)

This project was based on this tensorflow implementation of pix2pix: [https://github.com/affinelayer/pix2pix-tensorflow](https://github.com/affinelayer/pix2pix-tensorflow). 

**NOTE: The code in pix2pix-tensorflow in this repo was modified slightly to work with Tensorflow 2.1.0 . The original code works with Tensorflow 1.4.1**


## How I trained the pix2pix model from scratch
1. Prepare data (create image pairs)
2. Train the model with /pix2pix-tensorflow
3. Test the model
4. Export the model
5. Convert to Keras then port to tensorflow.js
6. Run model in browser app

For steps 1 - 4, I followed 
For steps 5 & 6, I referred to this tutorial: [https://blog.usejournal.com/fast-pix2pix-in-the-browser-287d9858a5e4](https://blog.usejournal.com/fast-pix2pix-in-the-browser-287d9858a5e4).

## Data Prep
Using OpenCV, I split this labelling of Summoner's Rift into 143 unique 256x256 slices, each corresponding to a slice of their target output. After data augmentation (4 rotations), this created 572 images, of which i used 472 for training and 100 for testing.

![labelling2](/docs/labelling2.png)

I followed [affinelayer](https://github.com/affinelayer)'s instructions [here](https://github.com/affinelayer/pix2pix-tensorflow#creating-your-own-dataset) on how to combine the input & target images into the 512x256 image-pair format required for the pix2pix model.

## Training
'python pix2pix-tensorflow/pix2pix.py --mode train --output_dir train_output --input_dir train --max_epochs 200 --which_direction AtoB'

Training was stopped after ~100+ epochs as the model didn't look like it was improving much past 70 epochs. I sticked to the default of '--ngf 64 --ndf 64' (number of generator & discriminator filters in the first conv layer) which resulted in a pretty large model size (212 MB). Training took about ~6 hours on my PC running on GTX 950.

