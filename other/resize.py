import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
from PIL import Image

# resizes all images in each subfolder to the target size
def resize_images(in_folder, out_folder, target_size=(224, 224)):
    os.makedirs(out_folder, exist_ok=True)

    # loop through each subfolder in the main folder
    food_folders = [f for f in os.listdir(in_folder) if os.path.isdir(os.path.join(in_folder, f))]

    # get the relative path and create a subfolder
    for folder in food_folders:
        in_subfolder = os.path.join(in_folder, folder)
        out_subfolder = os.path.join(out_folder, folder)
        os.makedirs(out_subfolder, exist_ok=True)

        # loop through each jpg in folder
        jpg_files = [f for f in os.listdir(in_subfolder) if f.lower().endswith(".jpg") or f.lower().endswith(".jpeg")]

        # write to the output folder
        for jpg in jpg_files:
            img = Image.open(os.path.join(in_subfolder, jpg)).resize(target_size)
            img.save(os.path.join(out_subfolder, jpg))


print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))
print("TensorFlow version:", tf.__version__)
resize_images("images_subset", "images_resized")


