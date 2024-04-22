import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../Styles';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { format } from 'date-fns'; // Make sure to install date-fns if not already installed using npm install date-fns


// import { firebaseConfig } from '../firebaseConfig'; // Your Firebase configuration

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

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function HomeScreen() {
  const [foodname, setFood] = React.useState(null);
  const [mass, setMass] = React.useState(0);
  const [nutritionalInfo, setNutritionalInfo] = React.useState({});

  console.log("started homescreen");
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const foodRef = doc(firestore, "current", "food");
      const foodDoc = await getDoc(foodRef);
      if (foodDoc.exists()) {
        const data = foodDoc.data();
        console.log("current fetched: ");
        console.log(data);

        
        //CASE SENSITIVE
        setFood(data.foodname);
        setMass(data.mass);
        const nutritionRef = doc(firestore, "nutritionalinfo", data.foodname.toLowerCase());
        const nutritionDoc = await getDoc(nutritionRef);
        if (nutritionDoc.exists()) {
          setNutritionalInfo(nutritionDoc.data());
          console.log("nutritional info fetched: ");
          console.log(nutritionDoc.data());
        } else {
          console.error("couldnt find current : ", data.foodname);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleModify = async () => {
    try {
      await setDoc(doc(firestore, "current", "food"), {
        foodname: foodname,
        mass: parseInt(mass)  // Convert back to number before saving
      });
      alert('Food information updated successfully.');
      fetchData();  // Update data
    } catch (error) {
      console.error('Error saving food information:', error);
    }
    //call handleUpdatePress
    handleUpdatePress();
  };

  const handleUpdatePress = async () => {
    const newValues = Object.keys(nutritionalInfo).reduce((acc, key) => {
      if (typeof nutritionalInfo[key] === 'number') {
        acc[key] = (nutritionalInfo[key] * mass) / 1000;
      } else {
        acc[key] = nutritionalInfo[key];
      }
      return acc;
    }, {});

    try {
      // Format the current date and time
      const now = new Date();
      const dateTimeFormat = format(now, 'M-dd-HH-mm-ss'); // 'H-mm-ss' represents hours, minutes, and seconds with hyphens

      // Add the new calculated data to the 'history' collection
      await setDoc(doc(firestore, "history", dateTimeFormat), newValues);
      alert('Nutritional information updated and added to history.');
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  return (
    <View style={styles.summary}>
      {foodname ? <Text style={styles.name}>Food: {foodname}</Text> : <Text style={styles.name}>No food identified</Text>}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleModify} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>✎ Edit Food</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpdatePress} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>⟳ Update</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setFood}
        value={foodname}
        placeholder="Enter food name, first letter capitalized"
      />
      <TextInput
        style={styles.input}
        onChangeText={setMass}
        value={mass}
        keyboardType="numeric"
        placeholder="Enter mass"
      />

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Calories</Text>
          <Text style={styles.cell}>{nutritionalInfo.Calories}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Protein</Text>
          <Text style={styles.cell}>{nutritionalInfo.Protein}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Carbohydrates</Text>
          <Text style={styles.cell}>{nutritionalInfo.Tot_Carbs}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sodium</Text>
          <Text style={styles.cell}>{nutritionalInfo.Sodium}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Fat</Text>
          <Text style={styles.cell}>{nutritionalInfo.Tot_Fat}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sugar</Text>
          <Text style={styles.cell}>{nutritionalInfo.Tot_Sugar}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Fiber</Text>
          <Text style={styles.cell}>{nutritionalInfo.Fiber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Calcium</Text>
          <Text style={styles.cell}>{nutritionalInfo.Calcium}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Iron</Text>
          <Text style={styles.cell}>{nutritionalInfo.Iron}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Saturated Fat</Text>
          <Text style={styles.cell}>{nutritionalInfo.Sat_Fat}</Text>
        </View>


      </View>
    </View>

    
  );
}
