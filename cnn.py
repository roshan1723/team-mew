import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import LearningRateScheduler
from tensorflow.keras import layers, models

# define constants
batch_size = 64
epochs = 20
image_size = (224, 224)
num_classes = 20
data_folder = 'images'

print("Foods:")
print("------------------")
for folder in os.listdir(data_folder):
    print(folder)
print()

# data augmentation and preprocessing
datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=90,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=[.8, 1],
    horizontal_flip=True,
    vertical_flip=True,
    fill_mode='reflect',
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
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.GlobalAveragePooling2D(),            # flatten the 3D output to 1D
    layers.Dense(1024, activation='relu'),      # add a fully connected layer
    layers.Dropout(0.5),                        # regularization 
    layers.Dense(256, activation='relu'),    
    layers.Dropout(0.2),                                
    layers.Dense(128, activation='relu'),                              
    layers.Dense(num_classes, activation='softmax')  # output layer for classification
])

# model.summary()

# define learning rate schedule
def lr_schedule(epoch, lr):
    if (epoch == 5):
        return lr * 0.1
    
    if (epoch == 15):
        return lr * 0.1
    
    else:
        return lr

# compile the model
optimizer = tf.keras.optimizers.Adam(learning_rate=0.0001)
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])
lr_scheduler = LearningRateScheduler(lr_schedule)

# train the model on local data
print("\nTraining model ...")
model.fit(
    generator,
    steps_per_epoch=generator.samples // batch_size,
    epochs=epochs,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // batch_size,
    callbacks=[lr_scheduler]
)

# evaluate the model
loss, accuracy = model.evaluate(validation_generator)
print(f'Validation accuracy: {accuracy}')

# save the model to a file
model.save('saved_model.h5')


