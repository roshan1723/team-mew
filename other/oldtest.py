import os
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model
import tf2onnx
import onnx


image_size = (224, 224)
num_classes = 20
images_folder = 'images'

# Load saved model
model = load_model('saved_model.h5')

# Convert the Keras model to ONNX format
onnx_model, _ = tf2onnx.convert.from_keras(model)
onnx.save_model(onnx_model, 'saved_model.onnx')

# Get class labels
class_labels = sorted(os.listdir(images_folder))


def preprocess_image(image_path):
    img = load_img(image_path, target_size=image_size)
    img_array = img_to_array(img) / 255.0          # Scale pixel values to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


# predict all images from 'image_jetson' folder
def predict_jetson_images():
    jetson_images = [os.path.join('jetson_images', img) for img in os.listdir('jetson_images')]
    for image_path in jetson_images:
        # Preprocess the image
        processed_image = preprocess_image(image_path)
        
        # Make prediction
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction)
        
        print("Image:", os.path.basename(image_path))
        print("Predicted Class:", class_labels[predicted_class])
        print()




images_folder = 'jetson_images'
files = os.listdir(images_folder)

# predict images from 'image_jetson' folder 
predict_jetson_images() # uses original TF model

