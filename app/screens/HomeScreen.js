import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const [foodname, setFood] = React.useState(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  // EXAMPLE CODE FOR MAKING AN API CALL - not currently functioning
  const fetchData = async () => { 
    try {
      const response = await fetch('https://api.example.com/data');

      const data = await response.json();
      setFood(data.foodname);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // END EXAMPLE CODE

  return (
    <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center', marginTop:20 }}>
      {foodname !== null ? <Text>Food: {foodname}</Text> : <Text>No food identified</Text>}


    </View>
  );
}
