import * as React from 'react';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function printSingleFirestoreEntry() {
  const docRef = doc(firestore, 'things', 'yphUl3Yg8fW6avBEzNqZ');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    printSingleFirestoreEntry(); // Call the function on app start
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Summary" component={HomeScreen} />
        <Tab.Screen name="History" component={ReportScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
