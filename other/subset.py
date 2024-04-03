import os
import shutil
import random

# Set constants
source_folder = 'images'
destination_folder = 'images_subset'
folder_cap = 5
images_cap = 2000

# Create the destination folder if it doesn't exist
os.makedirs(destination_folder, exist_ok=True)

# Get a list of all folders in the source directory
all_folders = [folder for folder in os.listdir(source_folder) if os.path.isdir(os.path.join(source_folder, folder))]
selected_folders = random.sample(all_folders, min(folder_cap, len(all_folders)))

# Clear out the existing data in the destination folder
shutil.rmtree(destination_folder, ignore_errors=True)
os.makedirs(destination_folder)

print(f"created '{folder_cap}' food folders.")

# Copy the selected folders to the destination folder and copy a random subset of images
for folder in selected_folders:
    source_path = os.path.join(source_folder, folder)
    destination_path = os.path.join(destination_folder, folder)

    # Create an empty folder
    os.makedirs(destination_path, exist_ok=True)

    # Print the name of the folder
    print(f"{folder}")

    # Get a list of all images in the source folder
    images = [image for image in os.listdir(source_path) if image.lower().endswith('.jpg') or image.lower().endswith('.jpeg')]

    for i in range(images_cap):
        image = images[i]
        source_image_path = os.path.join(source_path, image)
        destination_image_path = os.path.join(destination_path, image)
        shutil.copy2(source_image_path, destination_image_path)

print(f"copied {images_cap} images to each folder in '{destination_folder}'.")
