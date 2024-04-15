import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, getDocs, collection} from 'firebase/firestore';
// import { firebaseConfig } from '../firebaseConfig'; // Your Firebase configuration

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

const HistoryScreen = () => {
    const [historyData, setHistoryData] = useState([]);
  
    useEffect(() => {
      const fetchHistoryData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'history'));
          const historyItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHistoryData(historyItems);
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      };
  
      fetchHistoryData();
  
      return () => {}; // Clean-up function
    }, []);
  
    return (
      <View>
        <Text>History</Text>
        <FlatList
          data={historyData}
          renderItem={({ item }) => (
            <View>
              {Object.keys(item).map((key) => (<Text key={key}>{key}: {item[key]}</Text>))}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };
  
  export default HistoryScreen;