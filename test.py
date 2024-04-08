import os
import subprocess
import time
import numpy as np
from PIL import Image
import onnxruntime as rt


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

# Predict all images from 'jetson_images' folder
def predict_jetson_images():
    jetson_images = [os.path.join('jetson_images', img) for img in os.listdir('jetson_images')]
    for image_path in jetson_images:
        predicted_class = predict_image(image_path)
        print("Image:", os.path.basename(image_path))
        print("Predicted Class:", predicted_class)
        print()


# use the jetson cmd line to capture an image
def capture_image():

    # start the camera
    camera_process = subprocess.Popen(['nvgstcapture-1.0'], stdin=subprocess.PIPE)
    time.sleep(2)

    # capture image
    camera_process.communicate(input=b'j\n')
    time.sleep(2)

    # quit camera
    camera_process.communicate(input=b'q\n')
    camera_process.wait()

    jetson_image_path = "need to check what it is on jetson" 

    # check if the image is missing
    if not os.path.exists(jetson_image_path):
        print("Error: Captured image file not found.")
        return

    # save the file to the project folder
    os.rename(jetson_image_path, 'camera_image/capture0')
    print("Image captured successfully")



image_size = (224, 224)
num_classes = 20
images_folder = 'images'

# load ONNX model (converted from TF)
sess = rt.InferenceSession("saved_model.onnx")

# get class labels
class_labels = sorted(os.listdir(images_folder))

# Predict images from 'jetson_images' folder
predict_jetson_images()




