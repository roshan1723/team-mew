import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import pickle
import random
import os

# Define constants
batch_size = 32
saved_data_file = 'saved_data.pkl'
saved_model_file = 'saved_model.h5'
num_test_images = 10

# Load saved data (test_generator and datagen)
with open(saved_data_file, 'rb') as file:
    saved_data = pickle.load(file)
test_generator, datagen = saved_data['test_generator'], saved_data['datagen']

# Load the trained model
model = load_model(saved_model_file)

# Evaluate the model on the test data
loss, accuracy = model.evaluate(test_generator)
print(f'Trained prediction accuracy: {accuracy}')

# Test the predictor on 10 random images
random_indexes = random.sample(range(len(test_generator.filenames)), num_test_images)

for idx in random_indexes:
    # Load the image
    image_path = os.path.join(test_generator.directory, test_generator.filenames[idx])
    image = load_img(image_path, target_size=test_generator.image_shape)
    input_array = img_to_array(image)
    input_array = np.expand_dims(input_array, axis=0) / 255.0  # Normalize the image

    # Get the true label
    true_label = os.path.dirname(test_generator.filenames[idx])

    # Make predictions
    predictions = model.predict(input_array)
    predicted_label = test_generator.class_indices.keys()[np.argmax(predictions)]

    # Display the image
    image.show()

    # Print the true and predicted labels
    print(f'True Label: {true_label}')
    print(f'Predicted Label: {predicted_label}')
    print('\n' + '-'*30 + '\n')  # Separate the results for better readability