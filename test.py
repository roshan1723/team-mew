import os
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model
import subprocess
import time


def preprocess_image(image_path):
    img = load_img(image_path, target_size=image_size)
    img_array = img_to_array(img) / 255.0          # Scale pixel values to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


# predict all images from 'image_jetson' folder
def predict_jetson_image(image_path):
    jetson_images = [os.path.join('jetson_image', img) for img in os.listdir('jetson_image')]
    for image_path in jetson_images:
        # Preprocess the image
        processed_image = preprocess_image(image_path)
        
        # Make prediction
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction)
        
        print("Image:", os.path.basename(image_path))
        print("Model Prediction:", class_labels[predicted_class])
        print()

def capture_image(output_path):
    # start the camera
    camera_process = subprocess.Popen(['nvgstcapture-1.0'], stdin=subprocess.PIPE)
    time.sleep(1)

    # take picture
    camera_process.communicate(input=b'j\n')

    time.sleep(1)

    # quit camera
    camera_process.communicate(input=b'q\n')
    camera_process.wait()

    # Rename the captured image to the desired output path
    os.rename('capt0000.jpg', output_path)
    print("Image captured\n")



image_size = (224, 224)
num_classes = 20
images_folder = 'images'

# Load saved model
model = load_model('saved_model.h5')

# Get class labels
class_labels = sorted(os.listdir(images_folder))
printf("Class labels created", class_labels)

# capture image with Jetson
output_path = "jetson_image"
capture_image(output_path)

# predict image with model
predict_jetson_image(output_path)

