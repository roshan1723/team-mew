import os
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model

# Constants
image_size = (224, 224)
num_classes = 20
images_folder = 'images'

# Load saved model
model = load_model('saved_model.h5')

# Get class labels
class_labels = sorted(os.listdir(images_folder))


def preprocess_image(image_path):
    img = load_img(image_path, target_size=image_size)
    img_array = img_to_array(img) / 255.0          # Scale pixel values to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


# select random images for testing
def select_random_images(num_images):
    selected_images = []
    for _ in range(num_images):

        # randomly select a folder
        folder_name = random.choice(os.listdir(images_folder))
        folder_path = os.path.join(images_folder, folder_name)

        # Randomly select an image from the folder
        image_name = random.choice(os.listdir(folder_path))
        image_path = os.path.join(folder_path, image_name)
        selected_images.append(image_path)
    return selected_images


def predict_random_images():

    test_images = select_random_images(30)

    # Test the model on selected images
    for image_path in test_images:
        processed_image = preprocess_image(image_path)
        
        # Make prediction
        prediction = model.predict(processed_image)
        predicted_class = np.argmax(prediction)
        
        print("          Image:", image_path)
        print("Predicted Class:", class_labels[predicted_class])
        print()

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
predict_jetson_images()

# predict random images from the dataset
# predict_random_images()

