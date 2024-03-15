import numpy as np
import os
import random
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dropout, Conv2D, MaxPooling2D, Flatten, Dense, InputLayer
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import pickle
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore", category=Warning, message="TensorFlow device initialization")



# create Convolutional Neural Network
def create_cnn_model(X, y):

    # get shape of input data
    input_shape = X[0].shape
    num_classes = len(set(y))
    print("input shape   : ", input_shape)
    print("unique classes: ", num_classes)

    # construct cnn model
    model = Sequential()
    model.add(InputLayer(input_shape=input_shape))
    model.add(Conv2D(32, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Conv2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2, 2)))
    model.add(Flatten())
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))  # dropout for regularization
    model.add(Dense(num_classes, activation='softmax'))
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    # set training parameters
    model.epochs = 15
    model.batch_size = 16
    model.validation_split = 0.2

    return model


# load image data and create features (arrays of pixels) and labels (food names)
def load_data(dir, jpg_cap=1000, food_cap=105):
    print("\nLoading images ...")
    food_folders = [f for f in os.listdir(dir) if os.path.isdir(os.path.join(dir, f))]
    data = []
    foods_found = 0
    jps_found = 0

    for folder in food_folders:
        if foods_found >= food_cap:
            break

        food_folder = os.path.join(dir, folder)
        jpg_files = [f for f in os.listdir(food_folder) if f.lower().endswith(".jpg")][:jpg_cap]

        if jpg_files:
            foods_found += 1
            jps_found += len(jpg_files)

            # load each jpg in the folder
            img_arrays = [preprocess_image(os.path.join(food_folder, file)) for file in jpg_files]
            labels = [folder] * len(img_arrays)

            # create list of tuples of features and labels
            data.extend(zip(img_arrays, labels))

    print("foods found:", foods_found)
    print("jps per food:", jps_found / foods_found)
    print("total jpgs found:", jps_found)
    return data


# loads and preprocesses an image
def preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.convert('RGB')

    # Convert the image to a NumPy array and preprocess
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    return img_array


# split image data into training and testing sets
def split_data(data, test_size=0.2, random_state=42):
    np.random.seed(random_state)
    np.random.shuffle(data)

    split_index = int((1 - test_size) * len(data))
    training_data, testing_data = data[:split_index], data[split_index:]

    return training_data, testing_data


# X = array of pixels from food image
# y = target food name
def get_features_and_labels(training_data, testing_data):
    print("\nExtracting feature and labels ...")

    X_train, y_train = zip(*training_data)
    X_test, y_test = zip(*testing_data)

    # Convert features to numpy array
    X_train = np.vstack(X_train)
    X_test = np.vstack(X_test)
    
    # normalize RGB values
    X_train /= 255.0
    X_test /= 255.0

    # create a mapping from food category to numerical label
    label_mapping = {label: idx for idx, label in enumerate(set(y_train))}
    
    # convert string labels to numerical labels
    y_train = np.array([label_mapping[label] for label in y_train])
    y_test = np.array([label_mapping[label] for label in y_test])

    print("training examples:", len(X_train), "\ntesting examples :", len(X_test))
    return X_train, y_train, X_test, y_test


# train the CNN
def train_model(model, X_train, y_train):
    print("\nTraining model ...")

    history = {'loss': [], 'accuracy': [], 'val_loss': [], 'val_accuracy': []}

    for epoch in range(model.epochs):
        # shuffle the training data at the beginning of each epoch
        indices = np.arange(len(X_train))
        np.random.shuffle(indices)
        X_train_shuffled = X_train[indices]
        y_train_shuffled = y_train[indices]

        # training loop
        for start in range(0, len(X_train_shuffled), model.batch_size):
            end = start + model.batch_size
            X_batch = X_train_shuffled[start:end]
            y_batch = y_train_shuffled[start:end]

            # train on batch
            history_batch = model.train_on_batch(X_batch, y_batch)
            history['loss'].append(history_batch[0])
            history['accuracy'].append(history_batch[1])

        # evaluate on validation set
        val_loss, val_acc = model.evaluate(X_train_shuffled[:int(len(X_train_shuffled) * model.validation_split)],
                                           y_train_shuffled[:int(len(X_train_shuffled) * model.validation_split)], verbose=0)
        history['val_loss'].append(val_loss)
        history['val_accuracy'].append(val_acc)

        print(f'Epoch {epoch + 1}/{model.epochs}, Loss: {val_loss:.4f}, Accuracy: {val_acc*100:.4f}%')

    return history


def test_predictor(model, X_test, y_test, num_samples=50):
    print("\nTesting predictor ...")

    # randomly select samples
    random_indices = random.sample(range(len(X_test)), min(num_samples, len(X_test)))

    correct_guesses = 0

    for idx in random_indices:
        test_image = X_test[idx]
        true_label = y_test[idx]

        # reshape the image for prediction
        test_image = np.expand_dims(test_image, axis=0)

        # get the model's prediction
        predictions = model.predict(test_image, verbose=0)
        predicted_label = np.argmax(predictions)

        # print the true label and the model's prediction
        # print(f"\nTrue Label: {true_label}")
        # print(f"Predicted Label: {predicted_label}")

        # display the image
        #

        if true_label == predicted_label:
            correct_guesses += 1

    accuracy = correct_guesses / num_samples
    print(f"Final accuracy: {accuracy * 100:.2f}%")

# train and evaluate the CNN
def main():

    # load the image data
    data = load_data('images_subset', 100, 16)
    training_data, testing_data = split_data(data)

    # extract features and label vectors
    X_train, y_train, X_test, y_test = get_features_and_labels(training_data, testing_data)

    # Create and compile the CNN model
    cnn = create_cnn_model(X_train, y_train)

    # Train the model
    history = train_model(cnn, X_train, y_train)

    # Plot training history
    plt.plot(history['accuracy'], label='Training Accuracy')
    plt.plot(history['val_accuracy'], label='Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.show()

    # evaluate with testing data
    test_predictor(cnn, X_test, y_test)

    return 0

if __name__ == "__main__":
    main()