import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {styles} from '../Styles';

const HistoryEntry = ({ entry }) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.entryContainer}>
      <View style={styles.reportRow}>
        <View style={styles.reportCell}>
          <Text style={styles.reportValue}>{entry.foodName}</Text>
        </View>
        <View style={styles.reportCell}>
          <Text style={styles.reportValue}>{entry.mass} grams</Text>
        </View>
        <View style={styles.reportCell}>
          <Text style={styles.reportValueTime}>{entry.dateTime}</Text>
        </View>
      </View>
      {expanded && (
        <View style={styles.reportRow}>
          <View style={styles.nutritionalInfoContainer}>
          
          <Text style={styles.reportHeader}>Category</Text>
          <Text style={styles.reportDetails}>Calories</Text>
          <Text style={styles.reportDetails}>Carbohydrates</Text>
          <Text style={styles.reportDetails}>Sodium</Text>
          <Text style={styles.reportDetails}>Protein</Text>
          <Text style={styles.reportDetails}>Total Fat</Text>
          <Text style={styles.reportDetails}>Sugar</Text>
          <Text style={styles.reportDetails}>Fiber</Text>
          <Text style={styles.reportDetails}>Cholesterol</Text>
          <Text style={styles.reportDetails}>Calcium</Text>
          <Text style={styles.reportDetails}>Iron</Text>
          <Text style={styles.reportDetails}>Saturated Fat</Text>
          <Text style={styles.reportDetails}>Trans Fat</Text>

          </View>
          <View style={styles.nutritionalInfoContainer}>
          <Text style={styles.reportHeader}>Amount (grams)</Text>
          {Object.entries(entry.nutritionalInfo).map(([category, value]) => (
            <View key={category}>
              <Text style={styles.reportDetailsRight}>{value}</Text>
            </View>
          ))}
          
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};


export default function HomeScreen() {
  //TEMPORARY EXAMPLES
  food1 = {
    foodName: 'Apple',
    dateTime: '4/13/24 - 3:32pm',
    mass: 150,
    nutritionalInfo: {
      Calories: 52,
      Protein: 0.3,
      Tot_Carbs: 0.2,
      Sodium: 1,
      Tot_Fat: 0,
      Tot_Sugar: 0.4,
      Fiber: 6.8,
      Cholesterol: 0,
      Calcium: 0,
      Iron: 12,
      Sat_Fat: 0,
      Trans_Fat: 0,
    },
  }
  food2 = {
    foodName: 'Cucumber',
    dateTime: '4/13/24 - 4:23pm',
    mass: 490,
    nutritionalInfo: {
      Calories: 10,
      Protein: 0.3,
      Tot_Carbs: 0.2,
      Sodium: 1,
      Tot_Fat: 0,
      Tot_Sugar: 0.4,
      Fiber: 6.8,
      Cholesterol: 0,
      Calcium: 0,
      Iron: 12,
      Sat_Fat: 0,
      Trans_Fat: 0,
    },
  }
  food3 = {
    foodName: 'Orange',
    dateTime: '4/13/24 - 4:24pm',
    mass: 70,
    nutritionalInfo: {
      Calories: 1367,
      Protein: 0.3,
      Tot_Carbs: 0.2,
      Sodium: 1,
      Tot_Fat: 0,
      Tot_Sugar: 0.4,
      Fiber: 6.8,
      Cholesterol: 0,
      Calcium: 0,
      Iron: 12,
      Sat_Fat: 0,
      Trans_Fat: 0,
    },
  }
  //END TEMP EXAMPLES
  const [history, setHistory] = React.useState([
    food3,
    food2,
    food1,
  ]);
  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) => <HistoryEntry entry={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
