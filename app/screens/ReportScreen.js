import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../Styles';

const HistoryEntry = ({ entry }) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.reportBg}>
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
            <View style={styles.tableRow}>
              <Text style={[styles.reportHeader, styles.column]}>Category</Text>
              <Text style={[styles.reportHeader, styles.column]}>Amount (grams)</Text>
            </View>
            
            {Object.entries(entry.nutritionalInfo).map(([category, value]) => (
              
              <View key={category} style={styles.tableRow}>
                

                <Text style={[styles.reportDetails, styles.column]}>{category}</Text>
                

                <Text style={[styles.reportDetails, styles.column]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  //TEMPORARY EXAMPLES
  const food1 = {
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
  const food2 = {
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
  const food3 = {
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

