import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../Styles';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  // const [newValues, setNewValues] = useState({});

  console.log("started homescreen");
  React.useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (foodname && mass && Object.keys(nutritionalInfo).length > 0) {
  //     console.log("Triggering update after data is set.");
  //     handleUpdatePress();
  //   }
  // }, [foodname, mass, nutritionalInfo]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, "current", "food"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setFood(data.foodname);
        setMass(data.mass.toString());  // Assuming mass is a number and needs to be converted to string for TextInputy
        console.log("subscribe: Data updated from Firestore");
        // handleUpdatePress();
        
      } else {
        console.log("subscribe: No such document!");
      }
    }, (error) => {
      console.error("subscribe: Error fetching data: ", error);
    });

    return () => unsubscribe();  // This will unsubscribe from the document when the component unmounts
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
        setFood(capitalizeFirstLetter(data.foodname));
        setMass(data.mass);
        const nutritionRef = doc(firestore, "nutritionalinfo", data.foodname.toLowerCase());
        const nutritionDoc = await getDoc(nutritionRef);
        if (nutritionDoc.exists()) {
          const nutritionalData = nutritionDoc.data();
          // console.log("nutritional info fetched: ");
          // console.log(nutritionDoc.data());
          const scaledData = scaleNutritionalValues(nutritionalData, data.mass);
          setNutritionalInfo(scaledData);
        } else {
          console.error("couldnt find current : ", data.foodname);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
    // handleUpdatePress();
  };

  const handleUpdatePress = async () => {

    try {
      // Format the current date and time
      console.log("updating history");
      console.log(nutritionalInfo);
      const now = new Date();
      const dateTimeFormat = format(now, 'M-dd-HH-mm-ss'); // 'H-mm-ss' represents hours, minutes, and seconds with hyphens

      // Add the new calculated data to the 'history' collection
      await setDoc(doc(firestore, "history", dateTimeFormat), nutritionalInfo);
      alert('Nutritional information updated and added to history.');
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  const handleRefresh = async () => {
    fetchData();
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View style={styles.summary}>
      {foodname ? <Text style={styles.name}>{foodname}</Text> : <Text style={styles.name}>No food identified</Text>}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleModify} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>✎ Edit Food</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpdatePress} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}> Update</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRefresh} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>⟳ Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.name}>Edit Food Information</Text> */}
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
      {/* <TouchableOpacity onPress={handleModify} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity> */}



<View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Calories</Text>
          <Text style={styles.cell}>{nutritionalInfo.Calories}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Protein</Text>
          <Text style={styles.cell}>{nutritionalInfo.Protein.toFixed(2)} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Carbohydrates</Text>
          <Text style={styles.cell}>{nutritionalInfo.Tot_Carbs.toFixed(2)} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sodium</Text>
          <Text style={styles.cell}>{((nutritionalInfo.Sodium)*(1000)).toFixed(2)} mg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Fat</Text>
          <Text style={styles.cell}>{((nutritionalInfo.Tot_Fat)*1000).toFixed(2)} mg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sugar</Text>
          <Text style={styles.cell}>{nutritionalInfo.Tot_Sugar.toFixed(2)} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Fiber</Text>
          <Text style={styles.cell}>{nutritionalInfo.Fiber.toFixed(2)} g</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Calcium</Text>
          <Text style={styles.cell}>{((nutritionalInfo.Calcium)*(1000).toFixed(2))} mg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Iron</Text>
          <Text style={styles.cell}>{((nutritionalInfo.Iron)*(1000000)).toFixed(2)} µg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Saturated Fat</Text>
          <Text style={styles.cell}>{((nutritionalInfo.Sat_Fat)*(1000).toFixed(2))} mg</Text>
        </View>


      </View>
      

    </View>

    
  );
}
