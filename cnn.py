import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2, ResNet50
from tensorflow.keras.callbacks import LearningRateScheduler
from tensorflow.keras import layers, models
import pickle

# define constants
batch_size = 64
epochs = 50
image_size = (224, 224)
num_classes = 101
data_folder = 'images'

# data augmentation and preprocessing
datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2
)

# load and prepare dataset
generator = datagen.flow_from_directory(
    data_folder,
    target_size=image_size,
    batch_size=batch_size,
    class_mode='categorical',
    subset='training' 
)

validation_generator = datagen.flow_from_directory(
    data_folder,
    target_size=image_size,
    batch_size=batch_size,
    class_mode='categorical',
    subset='validation'
)

# load pretrained model 
base_model = MobileNetV2(input_shape=(image_size[0], image_size[1], 3), include_top=False, weights='imagenet')

# freeze layers
for layer in base_model.layers:
    layer.trainable = False

# create new model on top of base model
model = models.Sequential([
    base_model,
    # layers.Conv2D(32, (3, 3), activation='relu'),
    # layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.GlobalAveragePooling2D(),         # Flatten the 3D output to 1D
    layers.Dense(256, activation='relu'),    # Add a fully connected layer
    layers.Dropout(0.6),                     # Regularization
    # layers.Dense(512, activation='relu'),   
    # layers.Dropout(0.4),                     
    layers.Dense(num_classes, activation='softmax')  # Output layer for classification
])

model.summary()

# define learning rate schedule
def lr_schedule(epoch, lr):
    if (epoch == 10):
        return lr * 0.1
    
    else:
        return lr

# compile the model
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])
lr_scheduler = LearningRateScheduler(lr_schedule)

# train the model on local data
model.fit(
    generator,
    steps_per_epoch=generator.samples // batch_size,
    epochs=epochs,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // batch_size,
    callbacks=[lr_scheduler]
)

# Save test_generator and datagen to a file
model.save('saved_model.h5')
saved_data = {'test_generator': validation_generator, 'datagen': datagen}
with open('saved_data.pkl', 'wb') as file:
    pickle.dump(saved_data, file)
print(f"Test generator and datagen saved")

# evaluate the model
loss, accuracy = model.evaluate(validation_generator)
print(f'Validation accuracy: {accuracy}')
