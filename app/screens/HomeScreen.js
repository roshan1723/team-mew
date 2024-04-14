import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {styles} from '../Styles';
import axios from 'axios';

export default function HomeScreen() {
  const [foodname, setFood] = React.useState(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  // EXAMPLE CODE FOR MAKING AN API CALL - not currently functioning
  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.example.com/data');
      console.log(response.data);
      setFood(data.foodname);
    } 
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // END EXAMPLE CODE

  const handleButtonPress = () => {
    alert('Food modification to be added in a future patch');
  };

  return (
    <View style={styles.summary}>
      {foodname !== null ? <Text style={styles.name}>Food: {foodname}</Text> : <Text style={styles.name}>No food identified</Text>}
      <TouchableOpacity onPress={handleButtonPress} style={styles.modifybutton}>
        <Text style={styles.modifybuttonText}>✎  Edit Food</Text>
      </TouchableOpacity>
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
        <View style={styles.rowEnd}>
          <Text style={styles.cell}>Potassium</Text>
          <Text style={styles.cell}>0</Text>
        </View>
      </View>

      

    </View>

  );
}

