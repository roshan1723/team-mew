import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import { styles } from '../Styles';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Assume Firebase is initialized elsewhere if you are splitting across files
const firestore = getFirestore();

const Meals = () => {
  const [historyData, setHistoryData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});
  const [expandedMeal, setExpandedMeal] = useState(null);

  useEffect(() => {
    fetchHistoryData();
    fetchMealData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'history'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistoryData(items);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchMealData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'meals'));
      const meals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMealData(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const confirmSelection = async () => {
    const selectedItems = historyData.filter(item => selectedIds[item.id]);
    const aggregatedNutrients = selectedItems.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'number' && key !== 'mass') {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});

    try {
      await addDoc(collection(firestore, 'meals'), {
        ...aggregatedNutrients,
        timestamp: serverTimestamp()
      });
      Alert.alert('Success', 'Meal created successfully');
      setSelectedIds({}); // Clear selection after saving
    } catch (error) {
      Alert.alert('Error', 'Failed to create meal');
      console.error('Error creating meal:', error);
    }
  };

  const toggleExpandedMeal = (id) => {
    setExpandedMeal(prev => prev === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={historyData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, selectedIds[item.id] ? styles.selectedItem : null]}
            onPress={() => toggleSelection(item.id)}
          >
            <Text style={styles.itemText}>{item.FoodName} - {item.mass}g</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            <Button title="Confirm Selection" onPress={confirmSelection} />
            <Text style={styles.header}>Meals</Text>
          </>
        }
      />
      <FlatList
        data={mealData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpandedMeal(item.id)} style={styles.entryContainer}>
            <Text style={styles.itemText}>{item.title || 'Meal at ' + new Date(item.timestamp?.seconds * 1000).toLocaleTimeString()}</Text>
            {expandedMeal === item.id && (
              <View style={styles.nutritionalInfoContainer}>
                {Object.keys(item).filter(key => key !== 'title' && key !== 'id' && key !== 'timestamp').map(key => (
                  <View style={styles.tableRow} key={key}>
                    <Text style={styles.reportDetails}>{key}</Text>
                    <Text style={styles.reportDetails}>{item[key]}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Meals;
