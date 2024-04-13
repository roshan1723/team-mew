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
          <Text style={styles.reportValue}>{entry.dateTime}</Text>
        </View>
      </View>
      {expanded && (
        <View style={styles.reportRow}>
          <View style={styles.nutritionalInfoContainer}>
          
          <Text>Calories:</Text>
          <Text>Carbohydrates:</Text>
          <Text>Sodium:</Text>
          <Text>Protein:</Text>
          <Text>Total Fat:</Text>
          <Text>Sugar:</Text>
          <Text>Fiber:</Text>
          <Text>Cholesterol:</Text>
          <Text>Calcium:</Text>
          <Text>Iron:</Text>
          <Text>Saturated Fat:</Text>
          <Text>Trans Fat:</Text>

          </View>
          <View style={styles.nutritionalInfoContainer}>
          
          {Object.entries(entry.nutritionalInfo).map(([category, value]) => (
            <View key={category} style={styles.nutritionalInfoRow}>
              <Text style={styles.nutritionalInfoValue}>{value}</Text>
            </View>
          ))}
          
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};


export default function HomeScreen() {
  const [history, setHistory] = React.useState([
    {
      foodName: 'Apple',
      dateTime: '4/13/24 - 6:32pm',
      mass: 150,
      nutritionalInfo: {
        Calories: 52,
        Protein: 0.3,
        Tot_Carbs: 0.2,
        Sodium: 1,
        Tot_Fat: 0.3,
        Tot_Sugar: 0.3,
        Fiber: 0.3,
        Cholesterol: 0.3,
        Calcium: 0.3,
        Iron: 0.3,
        Sat_Fat: 0.3,
        Trans_Fat: 0.3,
      },
    },
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
