import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Button, Modal } from 'react-native';
import { styles } from '../Styles';
import { getFirestore, collection, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const firestore = getFirestore();

const Meals = () => {
  const [historyData, setHistoryData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);

  useEffect(() => {
    // Setup real-time listeners for history and meals collections
    const unsubscribeHistory = onSnapshot(collection(firestore, 'history'), (snapshot) => {
      const updatedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
      setHistoryData(updatedHistory);
    }, error => {
      console.error('Error listening to history updates:', error);
    });

    const unsubscribeMeals = onSnapshot(collection(firestore, 'meals'), (snapshot) => {
      const updatedMeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
      setMealData(updatedMeals);
    }, error => {
      console.error('Error listening to meals updates:', error);
    });

    return () => {
      unsubscribeHistory();
      unsubscribeMeals();
    };
  }, []);

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

    const mealName = format(new Date(), 'M-dd-HH-mm-ss');
    try {
      await setDoc(doc(firestore, "meals", mealName), {
        ...aggregatedNutrients,
        timestamp: serverTimestamp()
      });
      Alert.alert('Success', 'Meal created successfully');
      setSelectedIds({});
      setModalVisible(false);
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
      <Button title="Create Meal" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select History Items</Text>
          <FlatList
            data={historyData}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, selectedIds[item.id] ? styles.selectedItem : styles.item]}
                onPress={() => toggleSelection(item.id)}
              >
                <Text style={styles.itemText}>{item.FoodName} - {item.mass}g</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
          <Button title="Confirm Selection" onPress={confirmSelection} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <FlatList
        data={mealData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpandedMeal(item.id)} style={styles.entryContainer}>
            <Text style={styles.itemText}>{item.title || 'Meal at ' + new Date(item.timestamp?.seconds * 1000).toLocaleTimeString()}</Text>
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
