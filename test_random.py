import os
import numpy as np
from PIL import Image
import onnxruntime as rt
import random

# Preprocess image
def preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.resize(image_size)
    img_array = np.array(img).astype(np.float32) / 255.0  # Scale pixel values to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Make prediction using ONNX Runtime
def predict_image(image_path):
    # Preprocess image
    img_array = preprocess_image(image_path)

    # Run inference
    input_name = sess.get_inputs()[0].name
    output_name = sess.get_outputs()[0].name
    result = sess.run([output_name], {input_name: img_array})

    # Get predicted class
    predicted_class = np.argmax(result)

    return class_labels[predicted_class]

# Predict images from random subfolders in 'images' folder
def predict_random_images():
    subfolders = os.listdir(images_folder)
    true_labels = []
    predicted_labels = []
    for subfolder in subfolders:
        images_in_subfolder = os.listdir(os.path.join(images_folder, subfolder))
        image_path = os.path.join(images_folder, subfolder, np.random.choice(images_in_subfolder))
        predicted_class = predict_image(image_path)
        predicted_labels.append(predicted_class)
        true_labels.append(subfolder)
        print("Image:", os.path.basename(image_path))
        print("Predicted Class:", predicted_class)
        print("True Class:", subfolder)
        print()

    # Calculate accuracy
    accuracy = np.mean(np.array(true_labels) == np.array(predicted_labels))
    print("Accuracy:", accuracy)


image_size = (224, 224)
num_classes = 20
images_folder = 'images'

# load ONNX model (converted from TF)
sess = rt.InferenceSession("saved_model.onnx")

# get class labels
class_labels = sorted(os.listdir(images_folder))

# predict random images from the dataset
predict_random_images()


