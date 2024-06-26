/**
 * HistoryEntry component for displaying and managing historical data.
 * This component fetches and displays historical entries from Firestore.
 * Users can expand entries to view detailed nutritional information and delete entries.
 */
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from '../Styles';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

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
    fetchHistoryData();

    // const unsubscribe = onSnapshot(doc(firestore, 'current', 'food'), (doc) => {
    const unsubscribe = onSnapshot(collection(firestore, 'history'), (querySnapshot) => {
      //add additional logic if want to do something with the food document
      // console.log('Current food document updated:', doc.data());
      fetchHistoryData(); // Refresh history data on any change in the food document
    });

    return () => unsubscribe();  // Clean up the subscription
  }, []);

  // Fetch past data from Firestore database
  const fetchHistoryData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'history'));
      const historyItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistoryData(historyItems.reverse());
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Toggle popout of each individual item in history
  const toggleExpanded = (itemId) => {
    setExpandedItem(itemId === expandedItem ? null : itemId);
  };

  // Handle deletion of history items
  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, 'history', itemId));
      fetchHistoryData(); // Refresh the list after deleting
      Alert.alert('Delete Successful', 'The item has been deleted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the history item.');
      console.error('Error deleting history item:', error);
    }
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
              <Text style={styles.reportValue}>{item.mass}g</Text>
            </View>
            <View style={styles.reportCell}>
              <Text style={styles.reportValueTime}>{item.id}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>✖</Text>
            </TouchableOpacity>
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
                <Text style={[styles.reportDetails, styles.column]}>{parseFloat(item.Protein.toFixed(2))} g</Text>
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
