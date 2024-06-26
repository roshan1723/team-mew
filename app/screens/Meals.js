/**
 * Meals component for managing meal creation and viewing.
 * This component allows users to select items from the history to create a meal.
 * It also displays existing meals with aggregated nutritional information.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Button, Modal, TextInput } from 'react-native';
import { styles } from '../Styles';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const firestore = getFirestore();

const Meals = () => {
  const [historyData, setHistoryData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [mealName, setMealName] = useState('');

  useEffect(() => {
    // Setup real-time listeners for history and meals collections
    const unsubscribeHistory = onSnapshot(collection(firestore, 'history'), (snapshot) => {
      const updatedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
      setHistoryData(updatedHistory);
    }, error => {
      console.error('Error listening to history updates:', error);
    });
  
    const unsubscribeMeals = onSnapshot(collection(firestore, 'meals'), (snapshot) => {
      const updatedMeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                        .sort((a, b) => a.timestamp - b.timestamp)
                                        .reverse(); 
      setMealData(updatedMeals);
    }, error => {
      console.error('Error listening to meals updates:', error);
    });
  
    return () => {
      unsubscribeHistory();
      unsubscribeMeals();
    };
  }, []);
  

  const handleDelete = async (mealId) => {
    try {
      await deleteDoc(doc(firestore, 'meals', mealId));
      Alert.alert('Delete Successful', 'The meal has been deleted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the meal.');
      console.error('Error deleting meal:', error);
    }
  };

  // Toggle selection of history item
  const toggleSelection = (id) => {
    setSelectedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Confirm selection and create a meal from selected history items
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

    if (!mealName) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    try {
      await setDoc(doc(firestore, "meals", mealName), {
        ...aggregatedNutrients,
        timestamp: serverTimestamp()
      });
      Alert.alert('Success', 'Meal created successfully');
      setSelectedIds({});
      setModalVisible(false);
      setMealName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create meal');
      console.error('Error creating meal:', error);
    }
  };

  // Toggle expansion of meal details
  const toggleExpandedMeal = (id) => {
    setExpandedMeal(prev => prev === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Button title="Create Meal" onPress={() => setModalVisible(true)} style={styles.createMealButton} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Enter Meal Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setMealName(text)}
              value={mealName}
              placeholder="Enter meal name"
            />
            <Text style={styles.modalHeaderText}>Select History Items</Text>
            <FlatList
              data={historyData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    selectedIds[item.id] ? styles.selectedItem : null,
                  ]}
                  onPress={() => toggleSelection(item.id)}
                >
                  <Text style={styles.itemText}>
                    {item.FoodName} - {item.mass}g
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Confirm Selection"
                onPress={confirmSelection}
                disabled={!Object.keys(selectedIds).length}
              />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={mealData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpandedMeal(item.id)} style={styles.entryContainer}>
            <View style={styles.reportRow}>
              <View style={styles.reportCell}>
                <Text style={styles.reportValue}>{item.id}</Text>
                <Text style={styles.reportValueTime}>{new Date(item.timestamp?.seconds * 1000).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>✖</Text>
              </TouchableOpacity>
            </View>
            {expandedMeal === item.id && (
              <View style={styles.reportRow}>
                <View style={styles.nutritionalInfoContainer}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.reportHeader, styles.column]}>Category</Text>
                    <Text style={[styles.reportHeader, styles.column]}>Amount</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={[styles.reportDetails, styles.column]}>Calories</Text>
                    <Text style={[styles.reportDetails, styles.column]}>{parseFloat(item.Calories.toFixed(2))}</Text>
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
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Meals;
