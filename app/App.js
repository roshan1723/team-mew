import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import BluetoothScreen from './screens/BluetoothScreen';
import SettingsScreen from './screens/SettingsScreen';
import {styles} from './Styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#500000',tabBarInactiveTintColor: '#AFAFAF'}}>
        <Tab.Screen name="Summary" component={HomeScreen} options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,}}/>
        <Tab.Screen name="History" component={ReportScreen} options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

