import cv2
import imutils
from imutils.perspective import four_point_transform
from imutils import contours
import subprocess
import time
import os
import glob
import pytesseract
import argparse
from PIL import Image
import onnxruntime as rt
import numpy as np
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
#import Jetson.GPIO as GPIO

def crop_image(image_path, left_crop, right_crop, bottom_crop, top_crop):
    """Returns a cropped image based on the parameters given for the four cardinal directions
    
    :param image_path: String for path to image.
    :type image_path: String
    :param left_crop: Int for how many pixels to crop on left side
    :type left_crop: Int
    :param right_crop: Int for how many pixels to crop on right side
    :type right_crop: Int
    :param bottom_crop: Int for how many pixels to crop on bottom side
    :type bottom_crop: Int
    :param top_crop: Int for how many pixels to crop on top side
    :type top_crop: Int
    :return The new cropped image as a variable.
    :rtype: openCV image

    When taking an image using the camera, both the numbers on the scale and the food above it need to be analyzed by seperate models. Cropping the image so that
    it focuses on the specific object it needs to identify is what the crop image is used for. Because the camera is securely fastened on the scale, these crop 
    values are already known and can be applied to every image used. This function is called twice with these already set values to crop the images for the 
    number and food recognition models to most accurately identify. 
    """

    # Load the image
    image = cv2.imread(image_path)

    # Get image dimensions
    height, width = image.shape[:2]

    # Calculate the width of the cropped region
    crop_width = width - (left_crop + right_crop)

    # Calculate the height of the cropped region
    crop_height = height - (top_crop + bottom_crop)

    # Crop the image
    cropped_image = image[top_crop:height-bottom_crop, left_crop:width-right_crop]

    return cropped_image

def capture_and_process_images(number_path, food_path):
    """Returns nothing, but does post the number and food information onto a firebase database.

    :param number_path: String for the path of the number image locally.
    :type number_path: String
    :param food_path: String for the path of the food image locally.
    :type food_path: String
    :return: None
    :rtype: None
    
    A function that takes in the image path of both a number for the weight and food and runs the separate models on the appropriate images.
    This function is the bulk of the recognition code as it handles both the food and number recognition as well as posting the data to a Firestore 
    database. It essentially takes the images from both the number path and food path, forms the predictions on both values and posts them to the database
    for the app to receive. 
    """

    def capture_image(path):
        """Returns the path of the image that was just taken after saving it to the local storage

        :param path: String for the image path locally
        :type path: String
        :return: String
        :rtype: String
        
        A function that takes a picture with the Nvidia Jetson Ubuntu operating system and saves it to a designated image path.
        This creates a subprocess for taking an image, takes the image and saves it under a set name with the path from the input
        """

        # Start the camera
        camera_process = subprocess.Popen(['nvgstcapture-1.0'], stdin=subprocess.PIPE)
        time.sleep(2)

        # Capture image
        camera_process.stdin.write(b'j\n')
        camera_process.stdin.flush()
        time.sleep(.5)

        # Terminate camera process
        camera_process.terminate()
        camera_process.wait()

        # Find the first JPG file in the project folder
        jpg_files = glob.glob("*.jpg")
        if jpg_files:
            os.rename(jpg_files[0], path)
            print("Image captured successfully")

        else:
            print("Error: No JPG files found in the project folder")

        # Crop the images for the number and food images so that the models focus on the correct objects
        if path == number_path:
            cropped_image = crop_image(path, 240, 320, 90, 300)
        else:
            cropped_image = crop_image(path, 100, 200, 0, 0)

        # Save the cropped image
        cv2.imwrite(path, cropped_image)

    # Take pictures for both the number and food recognition models
    capture_image(number_path)
    capture_image(food_path)

    # Predict food name using ONNX Runtime
    def predict_image(image_path):
        """Returns the class of the predicted food

        :param image_path: String for the path of the image
        :type image_path: String
        :return: String
        :rtype: String
        
        A function that uses an image and outputs a prediction of which food it is using a Tensorflow model.
        This is done by preprocessing the image, and sending it to the Tensorflow model converted to ONNX to make a prediction and returns that prediction
        """

        # Preprocess image
        img = Image.open(image_path)
        img = img.resize(image_size)
        img_array = np.array(img).astype(np.float32) / 255.0  # Scale pixel values to [0, 1]
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # Run inference
        input_name = sess.get_inputs()[0].name
        output_name = sess.get_outputs()[0].name
        result = sess.run([output_name], {input_name: img_array})

        # Get predicted class
        predicted_class = np.argmax(result)

        # Return predicted food name
        return class_labels[predicted_class]

    class_labels = sorted(os.listdir(images_folder))

    # Load ONNX model (converted from TF)
    sess = rt.InferenceSession("models/model_10foods.onnx")

    # Predict food name
    food_name = predict_image(food_path)
    print(food_name)

    numberFound = True

    # define the dictionary of digit segments so we can identify
    # each digit on the thermostat
    DIGITS_LOOKUP = {
        (1, 1, 1, 0, 1, 1, 1): 0,
        (0, 0, 1, 0, 0, 1, 0): 1,
        (1, 0, 1, 1, 1, 0, 1): 2,
        (1, 0, 1, 1, 0, 1, 1): 3,
        (0, 1, 1, 1, 0, 1, 0): 4,
        (1, 1, 0, 1, 0, 1, 1): 5,
        (1, 1, 0, 1, 1, 1, 1): 6,
        (1, 0, 1, 0, 0, 1, 0): 7,
        (1, 1, 1, 1, 1, 1, 1): 8,
        (1, 1, 1, 1, 0, 1, 1): 9,
    }

    # load the cropped image of the thermostat screen
    image = cv2.imread(number_path)

    # pre-process the image by converting it to grayscale and applying Gaussian blur
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # threshold the image to obtain binary image
    _, thresh = cv2.threshold(blurred, 73, 255, cv2.THRESH_BINARY)

    # Perform morphological dilation to enhance white regions
    kernel_dilate = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))
    thresh = cv2.dilate(thresh, kernel_dilate, iterations=1)

    # Perform morphological closing to close any segments with gaps between each segments
    kernel_vertical = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 10))  # Larger kernel size
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel_vertical)

    # find contours in the dilated image to map out each segment for each digit
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    # initialize list to store digit contours
    digitCnts = []

    # loop over the contours to filter out the digit contours
    for c in cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        # if the contour is sufficiently large, it must be a digit
        if w >= 0 and (h >= 30 and h <= 200):
            digitCnts.append(c)
            cv2.drawContours(image, [c], -1, (0, 255, 0), 2)  # draw contour on the original image

    #Stores the regions of each digit
    digits = []
    # check if any contours were found
    if digitCnts:
        # sort the contours from left to right
        digitCnts = contours.sort_contours(digitCnts, method="left-to-right")[0]
        
   
        # loop over the digit area candidates
        for digNum, c in enumerate(digitCnts):
            # extract the digit ROI
            (x, y, w, h) = cv2.boundingRect(c)
            roi = thresh[y:y + h, x:x + w]

            # if the width is significantly smaller than the height, it's likely a '1'
            if w < 0.20 * h:
                digit = 1
            else:
                # compute the width and height of each of the 7 segments
                (roiH, roiW) = roi.shape
                (dW, dH) = (int(roiW * 0.5), int(roiH * 0.1))
                dHC = int(roiH * 0.05)

                # define the set of 7 segments
                segments = [
                    ((0, 0), (w, dH)),                          # top
                    ((0, 0), (dW, h // 2)),                     # top-left
                    ((w - dW, 0), (w, h // 2)),                 # top-right
                    ((0, (h // 2) - dHC), (w, (h // 2) + dHC)), # center
                    ((0, h // 2), (dW, h)),                     # bottom-left
                    ((w - dW, h // 2), (w, h)),                 # bottom-right
                    ((0, h - dH), (w, h))                       # bottom
                ]

                # initialize list to store segment status (on/off)
                on = [0] * len(segments)

                # loop over the segments
                for (i, ((xA, yA), (xB, yB))) in enumerate(segments):
                    # extract the segment ROI
                    segROI = roi[yA:yB, xA:xB]
                    # cv2_imshow(segROI)
                    # count the total number of thresholded pixels in the segment
                    total = cv2.countNonZero(segROI)
                    area = (xB - xA) * (yB - yA)
                    # if the total number of non-zero pixels is greater than
                    # a certain threshold of the area, mark the segment as "on"
                    print("Segment: ", i, " Area: ", total / float(area))
                    if (total / float(area) >= 0.4) and (i != 0 and i != 3 and i != 6):
                        on[i] = 1
                        print("ON!")
                    if (total / float(area) >= 0.2) and (i == 0 or i == 3 or i == 6) and (digNum == 0 and len(digitCnts) >= 3):
                        print("ON!")
                        on[i] = 1
                    elif (total / float(area) >= 0.5) and (i == 0 or i == 3 or i == 6):
                        print("ON!")
                        on[i] = 1

                # lookup the digit based on the segment status
                try:
                    digit = DIGITS_LOOKUP[tuple(on)]
                except KeyError as e:
                    # If the digit is not recognized, print the error and set digit to None
                    print(f"KeyError occurred: {e}")
                    numberFound = False;
                    digit = None

            # store the identified digit
            digits.append(digit)

            # output the image of the bounding box and the prediction
            # cv2_imshow(roi)
            print(f"Digit {digNum+1} prediction:", digit)

        # display the identified digits
        print("Digits:", digits)
    
    else:
        numberFound = False
        print("no digits found")

    if numberFound == True:
        number = int(''.join(map(str, digits)))
    else:
        number = 0
        print("No numbers found, try again")

    # Create dictionary with digits and predicted food name
    data = {
        "foodname": food_name,
        "mass": number
    }

    # Write data to JSON file
    output_json_path = 'result.json'
    with open(output_json_path, "w") as json_file:
        json.dump(data, json_file)


    # Connect to Firestore database
    db = firestore.client()

    def update_firestore_from_json(json_file_path):
        """Returns nothing, but posts the data from the stored JSON file to a Firestore database

        :param json_file_path: String for the path location of the Json file locally.
        :type json_file_path: String
        :return: None
        :rtype: None

        A function that posts a JSON file to the firestone database as long as it matches the same template as designated."""

        # Read the JSON file
        with open(json_file_path, 'r') as file:
            data = json.load(file)

        # Access the document
        doc_ref = db.collection('current').document('food')

        # Update the document with data from JSON
        doc_ref.set({
            'foodname': data['foodname'],
            'mass': data['mass']
        })
        print(f"Data posted to Firestore: {data}")

    # Path to the JSON file
    json_file_path = 'result.json'

    # Call the function with the path to the JSON file
    update_firestore_from_json(json_file_path)


# Path to the Firebase credentials
cred = credentials.Certificate('team-mew-firebase-adminsdk-guhb7-3dfcbf2936.json')

# Initialize the Firebase admin app
firebase_admin.initialize_app(cred)

# Define paths
number_path = 'number_image/capture0.jpg'
food_path = 'food_image/capture0.jpg'
images_folder = "images"  # Adjust this to the folder containing the food images
image_size = (224, 224)  # Adjust this to the input size of the ONNX model

# Setup GPIO inputs on physical pin 15
pin = 15

#GPIO.setmode(GPIO.BOARD)
#GPIO.setup(pin, GPIO.IN)

# Infinite loop that checks if button is pressed, if it is then run the functions to predict food and number of current image taken
while True:
    #x = GPIO.input(pin)

    #if x == 0:
        capture_and_process_images(number_path, food_path)
        time.sleep(1)

