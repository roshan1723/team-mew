import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../Styles';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

const HistoryEntry = () => {
  const [expandedItem, setExpandedItem] = React.useState(null);
  const [historyData, setHistoryData] = React.useState([]);

  React.useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'history'));
        const historyItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistoryData(historyItems.reverse());
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistoryData();

    return () => {}; 
  }, []);

  const toggleExpanded = (itemId) => {
    setExpandedItem(itemId === expandedItem ? null : itemId);
  };

  return (
    <FlatList
      data={historyData}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => toggleExpanded(item.id)} style={styles.entryContainer}>
          <View style={styles.reportRow}>
            <View style={styles.reportCell}>
              <Text style={styles.reportValue}>{item.FoodName}</Text>
            </View>
            <View style={styles.reportCell}>
              <Text style={styles.reportValue}>{item.mass}</Text>
            </View>
            <View style={styles.reportCell}>
              <Text style={styles.reportValueTime}>{item.id}</Text>
            </View>
          </View>
          {expandedItem === item.id && (
            <View style={styles.reportRow}>
              <View style={styles.nutritionalInfoContainer}>
                <View style={styles.tableRow}>
                  <Text style={[styles.reportHeader, styles.column]}>Category</Text>
                  <Text style={[styles.reportHeader, styles.column]}>Amount</Text>
                </View>
                <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Calories</Text>
                <Text style={[styles.reportDetails, styles.column]}>{item.Calories}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Protein</Text>
                <Text style={[styles.reportDetails, styles.column]}>{item.Protein.toFixed(2)} g</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Carbohydrates</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat(item.Tot_Carbs.toFixed(2))} g</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Sodium</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat((item.Sodium*1000).toFixed(2))} mg</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Total Fat</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat((item.Tot_Fat*1000).toFixed(2))} mg</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Sugar</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat(item.Tot_Sugar.toFixed(2))} g</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Fiber</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat(item.Fiber.toFixed(2))} g</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Calcium</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat((item.Calcium*1000).toFixed(2))} mg</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Iron</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat((item.Iron*1000000).toFixed(2))} µg</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.reportDetails, styles.column]}>Saturated Fat</Text>
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat((item.Sat_Fat*1000).toFixed(2))} mg</Text>
              </View>
            </View>
            </View>
          )}
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default HistoryEntry;
