/**
 * HomeScreen component for the kitchen scale app.
 * This component displays information about the detected food and its nutritional values.
 * Users can edit food information and save nutritional data to history.
 */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { styles } from '../Styles';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns'; 

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
  const [foodname, setFood] = React.useState('');
  const [mass, setMass] = React.useState('0');
  const [nutritionalInfo, setNutritionalInfo] = React.useState({});
  // const [newValues, setNewValues] = useState({});

  console.log("started homescreen");
  React.useEffect(() => {
    fetchData();
  }, []);

  // Subscribe to changes in food data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, "current", "food"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setFood(data.foodname);
        setMass(data.mass.toString());  // Assuming mass is a number and needs to be converted to string for TextInputy
        console.log("subscribe: Data updated from Firestore");
        
      } else {
        console.log("subscribe: No such document!");
      }
    }, (error) => {
      console.error("subscribe: Error fetching data: ", error);
    });

    return () => unsubscribe();  // This will unsubscribe from the document when the component unmounts
  }, []);

  // Fetch food data from Firestore
  const fetchData = async () => {
    try {
      const foodRef = doc(firestore, "current", "food");
      const foodDoc = await getDoc(foodRef);
      if (foodDoc.exists()) {
        const data = foodDoc.data();
        console.log("current fetched: ");
        console.log(data);

        
        //CASE SENSITIVE
        setFood(capitalizeFirstLetter(data.foodname));
        setMass(data.mass.toString());
        const nutritionRef = doc(firestore, "nutritionalinfo", data.foodname.toLowerCase());
        const nutritionDoc = await getDoc(nutritionRef);
        if (nutritionDoc.exists()) {
          const nutritionalData = nutritionDoc.data();
          const scaledData = scaleNutritionalValues(nutritionalData, data.mass);
          setNutritionalInfo(scaledData);
        } else {
          console.error("Invalid food type: ", data.foodname);
          Alert.alert("There is no stored information about that food, please try again.")
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  //Calculates nutritional information based on detected food and mass using data from the Edamam Nutrition Analysis API
  const scaleNutritionalValues = (nutritionData, mass) => {
    return Object.keys(nutritionData).reduce((acc, key) => {
      if (typeof nutritionData[key] === 'number') {
        acc[key] = (nutritionData[key] * mass) / 1000;
      } else {
        acc[key] = nutritionData[key];
      }
      return acc;
    }, {});
  };

  // Handle correction of food information from the app
  const handleModify = async () => {
    try {
      await setDoc(doc(firestore, "current", "food"), {
        foodname: capitalizeFirstLetter(foodname),
        mass: parseInt(mass)  // Convert back to number before saving
      });
      alert('Food information updated successfully.');
      setMass(mass);  // Convert back to string for TextInput
      fetchData();  // Update data
    } catch (error) {
      console.error('Error saving food information:', error);
    } 
    
  };

  // Handle saving nutritional information to history
  const handleUpdatePress = async () => {

    try {
      // Format the current date and time
      console.log("updating history");
      console.log(nutritionalInfo);
      const now = new Date();
      const dateTimeFormat = format(now, 'M-dd-HH-mm-ss'); // 'H-mm-ss' represents hours, minutes, and seconds with hyphens

      // Add the new calculated data to the 'history' collection
      await setDoc(doc(firestore, "history", dateTimeFormat), nutritionalInfo);
      alert('Nutritional information saved to history.');
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  // Handle refreshing data
  const handleRefresh = async () => {
    fetchData();
  };

  // Capitalize first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <View style={styles.summary}>
      {foodname ? <Text style={styles.name}>{capitalizeFirstLetter(foodname)}</Text> : <Text style={styles.name}>No food identified</Text>}
      
        <TouchableOpacity onPress={handleRefresh} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>⟳ Refresh</Text>
        </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={setFood}
        value={foodname}
        placeholder="Enter food name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setMass}
        value={mass.toString()}
        keyboardType="numeric"
        placeholder="Enter mass"
      />

      <View style={styles.buttonRow}>
      <TouchableOpacity onPress={handleModify} style={styles.modifybutton}>
        <Text style={styles.modifybuttonText}>✎ Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUpdatePress} style={styles.modifybutton}>
        <Text style={styles.modifybuttonText}>↓ Save</Text>
      </TouchableOpacity>
      </View>


      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Calories</Text>
          <Text style={styles.cell}>{nutritionalInfo.Calories}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Protein</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Protein*1).toFixed(2))} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Carbohydrates</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Tot_Carbs*1).toFixed(2))} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sodium</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Sodium*1000).toFixed(2))} mg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Fat</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Tot_Fat*1000).toFixed(2))} mg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sugar</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Tot_Sugar*1).toFixed(2))} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Fiber</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Fiber*1).toFixed(2))} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Calcium</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Calcium*1000).toFixed(2))} mg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Iron</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Iron*1000000).toFixed(2))} µg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Saturated Fat</Text>
          <Text style={styles.cell}>{parseFloat((nutritionalInfo.Sat_Fat*1000).toFixed(2))} mg</Text>
        </View>


      </View>
      

    </View>

    
  );
}
