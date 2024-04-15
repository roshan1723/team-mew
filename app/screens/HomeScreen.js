import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { styles } from '../Styles';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const foodRef = doc(firestore, "current", "food");
      const foodDoc = await getDoc(foodRef);
      if (foodDoc.exists()) {
        const data = foodDoc.data();
        setFood(data.foodname);
        setMass(data.mass);
        const nutritionRef = doc(firestore, "nutritionalinfo", data.foodname);
        const nutritionDoc = await getDoc(nutritionRef);
        if (nutritionDoc.exists()) {
          setNutritionalInfo(nutritionDoc.data());
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefreshPress = async () => {
    const newValues = Object.keys(nutritionalInfo).reduce((acc, key) => {
      if (typeof nutritionalInfo[key] === 'number') {
        acc[key] = (nutritionalInfo[key] * mass) / 100;
      } else {
        acc[key] = nutritionalInfo[key];
      }
      return acc;
    }, {});

    try {
      // Add the new calculated data to the 'history' collection
      await setDoc(doc(firestore, "history", foodname), newValues);
      alert('Nutritional information updated and added to history.');
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  return (
    <View style={styles.summary}>
      {foodname ? <Text style={styles.name}>Food: {foodname}</Text> : <Text style={styles.name}>No food identified</Text>}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => alert('Food modification to be added in a future patch')} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>✎ Edit Food</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRefreshPress} style={styles.modifybutton}>
          <Text style={styles.modifybuttonText}>⟳ Refresh</Text>
        </TouchableOpacity>
      </View>
      {Object.entries(nutritionalInfo).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.cell}>{key}</Text>
          <Text style={styles.cell}>{value}</Text>
        </View>
      ))}
          {<View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Calories</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Fat</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Saturated Fat</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Trans Fat</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Cholesterol</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Sodium</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Carbs</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Fiber</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Sugars</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Protein</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Calcium</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Iron</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.rowEnd}>
          <Text style={styles.cell}>Potassium</Text>
          <Text style={styles.cell}>0</Text>
        </View>
      </View> }
    </View>

    
  );
}
