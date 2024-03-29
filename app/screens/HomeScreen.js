import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {styles} from '../Styles';


export default function HomeScreen() {
  const [foodname, setFood] = React.useState(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  // EXAMPLE CODE FOR MAKING AN API CALL - not currently functioning
  const fetchData = async () => { 
    try {
      const response = await fetch('https://api.example.com/data');

      const data = await response.json();
      setFood(data.foodname);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // END EXAMPLE CODE

  return (
    <View style={styles.summary}>
      {foodname !== null ? <Text style={styles.name}>Food: {foodname}</Text> : <Text style={styles.name}>No food identified</Text>}

      <View style={styles.table}>
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
        <View style={styles.row}>
          <Text style={styles.cell}>Potassium</Text>
          <Text style={styles.cell}>0</Text>
        </View>
      </View>
      
    </View>

  );
}

