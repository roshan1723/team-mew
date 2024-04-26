import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhbabwCfGqORtZBuJ-so5tPaT2n1V6ekM",
  authDomain: "team-mew.firebaseapp.com",
  databaseURL: "https://team-mew-default-rtdb.firebaseio.com",
  projectId: "team-mew",
  storageBucket: "team-mew.appspot.com",
  messagingSenderId: "188350895735",
  appId: "1:188350895735:web:84a8e3c20ce3605af0d872",
  measurementId: "G-LYH77D92FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const foods = [
  { FoodID: 1, FoodName: 'Radish',        Calories: 160,  Tot_Fat: 1, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.39, Tot_Carbs: 34, Fiber: 16, Tot_Sugar: 18.6, Protein: 6.8, Calcium: 0.25, Iron: 0.0034, Potassium: 2.33 , mass: 1000 },
  { FoodID: 2, FoodName: 'Avocado',       Calories: 1600, Tot_Fat: 147, Sat_Fat: 21.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.07, Tot_Carbs: 85.4, Fiber: 67, Tot_Sugar: 6.6, Protein: 20, Calcium: 0.12, Iron: 0.0055, Potassium: 4.85 , mass: 1000 },
  { FoodID: 3, FoodName: 'Mango',         Calories: 600,  Tot_Fat: 3.8, Sat_Fat: 0.9, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 150, Fiber: 16, Tot_Sugar: 137, Protein: 8.2, Calcium: 0.11, Iron: 0.0016, Potassium: 1.68 , mass: 1000 },
  { FoodID: 4, FoodName: 'Cucumber',      Calories: 150,  Tot_Fat: 1.1, Sat_Fat: 0.4, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.02, Tot_Carbs: 36.3, Fiber: 5, Tot_Sugar: 16.7, Protein: 6.5, Calcium: 0.16, Iron: 0.0028, Potassium: 1.47 , mass: 1000 },
  { FoodID: 5, FoodName: 'Watermelon',    Calories: 300,  Tot_Fat: 1.5, Sat_Fat: 0.2, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 75.5, Fiber: 4, Tot_Sugar: 62, Protein: 6.1, Calcium: 0.07, Iron: 0.0024, Potassium: 1.12 , mass: 1000 },
  { FoodID: 6, FoodName: 'Orange',        Calories: 470,  Tot_Fat: 1.2, Sat_Fat: 0.2, Trans_Fat: 0, Cholesterol: 0, Sodium: 0, Tot_Carbs: 118, Fiber: 24, Tot_Sugar: 93.5, Protein: 9.4, Calcium: 0.4, Iron: 0.001, Potassium: 1.81 , mass: 1000 },
  { FoodID: 7, FoodName: 'Grape',         Calories: 690,  Tot_Fat: 1.6, Sat_Fat: 0.5, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.02, Tot_Carbs: 181, Fiber: 9, Tot_Sugar: 155, Protein: 7.2, Calcium: 0.1, Iron: 0.0036, Potassium: 1.91 , mass: 1000 },
  { FoodID: 8, FoodName: 'Cauliflower',   Calories: 250,  Tot_Fat: 2.8, Sat_Fat: 1.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.3, Tot_Carbs: 49.7, Fiber: 20, Tot_Sugar: 19.1, Protein: 19.2, Calcium: 0.22, Iron: 0.0042, Potassium: 2.99 , mass: 1000 },
  { FoodID: 9, FoodName: 'Tomato',        Calories: 180,  Tot_Fat: 2, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.05, Tot_Carbs: 38.9, Fiber: 12, Tot_Sugar: 26.3, Protein: 8.8, Calcium: 0.1, Iron: 0.0027, Potassium: 2.37 , mass: 1000 },
  { FoodID: 10, FoodName: 'Apple',        Calories: 520,  Tot_Fat: 1.7, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 138, Fiber: 24, Tot_Sugar: 104, Protein: 2.6, Calcium: 0.06, Iron: 0.0012, Potassium: 1.07 , mass: 1000 },
  { FoodID: 11, FoodName: 'Cabbage',      Calories: 250,  Tot_Fat: 1, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.18, Tot_Carbs: 58, Fiber: 25, Tot_Sugar: 32, Protein: 12.8, Calcium: 0.4, Iron: 0.0047, Potassium: 1.7 , mass: 1000 },
  { FoodID: 12, FoodName: 'Pumpkin',      Calories: 260,  Tot_Fat: 1, Sat_Fat: 0.5, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 65, Fiber: 5, Tot_Sugar: 27.6, Protein: 10, Calcium: 0.21, Iron: 0.008, Potassium: 3.4 , mass: 1000 },
  { FoodID: 13, FoodName: 'Bell Pepper',  Calories: 260,  Tot_Fat: 3, Sat_Fat: 0.6, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.04, Tot_Carbs: 60.3, Fiber: 21, Tot_Sugar: 41, Protein: 9.9, Calcium: 0.07, Iron: 0.0043, Potassium: 2.11 , mass: 1000 },
  { FoodID: 14, FoodName: 'Corn Kernel',  Calories: 1130, Tot_Fat: 14.2, Sat_Fat: 1.5, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.04, Tot_Carbs: 259, Fiber: 26, Tot_Sugar: 33.6, Protein: 26.2, Calcium: 0.05, Iron: 0.0039, Potassium: 2.76 , mass: 1000 },
  { FoodID: 15, FoodName: 'Bean',         Calories: 3330, Tot_Fat: 8.5, Sat_Fat: 2.2, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.16, Tot_Carbs: 603, Fiber: 152, Tot_Sugar: 21.1, Protein: 234, Calcium: 2.4, Iron: 0.104, Potassium: 18 , mass: 1000 },
  { FoodID: 16, FoodName: 'Strawberry',   Calories: 320,  Tot_Fat: 3, Sat_Fat: 0.2, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 76.8, Fiber: 20, Tot_Sugar: 48.9, Protein: 6.7, Calcium: 0.16, Iron: 0.0041, Potassium: 1.52 , mass: 1000 },
  { FoodID: 17, FoodName: 'Potato',       Calories: 770,  Tot_Fat: 0.9, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.06, Tot_Carbs: 175, Fiber: 21, Tot_Sugar: 8.2, Protein: 20.5, Calcium: 0.12, Iron: 0.0081, Potassium: 4.25 , mass: 1000 },
  { FoodID: 18, FoodName: 'Broccoli',     Calories: 340,  Tot_Fat: 3.7, Sat_Fat: 1.1, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.33, Tot_Carbs: 66.4, Fiber: 26, Tot_Sugar: 17, Protein: 28.2, Calcium: 0.47, Iron: 0.0073, Potassium: 3.16 , mass: 1000 },
  { FoodID: 19, FoodName: 'Carrot',       Calories: 410,  Tot_Fat: 2.4, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.69, Tot_Carbs: 95.8, Fiber: 28, Tot_Sugar: 47.4, Protein: 9.3, Calcium: 0.33, Iron: 0.003, Potassium: 3.2 , mass: 1000 },
  { FoodID: 20, FoodName: 'Pear',         Calories: 570,  Tot_Fat: 1.4, Sat_Fat: 0.3, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 152, Fiber: 31, Tot_Sugar: 97.5, Protein: 3.6, Calcium: 0.09, Iron: 0.0028, Potassium: 1.16 , mass: 1000 },
  { FoodID: 21, FoodName: 'Banana',       Calories: 890,  Tot_Fat: 3.3, Sat_Fat: 1.1, Trans_Fat: 0, Cholesterol: 0, Sodium: 0.01, Tot_Carbs: 228, Fiber: 26, Tot_Sugar: 122, Protein: 10, Calcium: 0.05, Iron: 0.0026, Potassium: 3.58 , mass: 1000 },
  { FoodID: 22, FoodName: 'Plutonium',    Calories: 2e13, Tot_Fat: 0  , Sat_Fat: 0,   Trans_Fat: 0, Cholesterol: 0, Sodium: 0   , Tot_Carbs: 0  , Fiber: 0 , Tot_Sugar: 0  , Protein: 0  , Calcium: 0   , Iron: 0    , Potassium: 0    , mass: 1000}
];
  

const AddValues = () => {
  useEffect(() => {
    const addData = async () => {
      for (const food of foods) {
        const docRef = doc(firestore, "nutritionalinfo", food.FoodName.toLowerCase());
        try {
          await setDoc(docRef, food);
          console.log(`Document written for ${food.FoodName}`);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    };

    addData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Data has been added to Firestore!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AddValues;
