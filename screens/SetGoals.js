import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveGoalToFirestore } from '../utils/firestoreHelpers'; // Import the Firestore helper function
import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth'; // Firebase Authentication to fetch user ID

const SetGoals = ({ navigation }) => {
  const [goalType, setGoalType] = useState(''); // Default to empty or first item
  const [goalValue, setGoalValue] = useState('');

  // Function to handle goal setting
  const handleSetGoals = async () => {
    if (!goalType || !goalValue || parseFloat(goalValue) <= 0) {
      Alert.alert('Error', 'Please enter a valid goal type and positive value.');
      return;
    }

    try {
      // Get the current authenticated user ID
      const userId = getAuth().currentUser.uid;

      // Save the goal to Firestore
      await saveGoalToFirestore(goalType, parseFloat(goalValue), userId);
      Alert.alert('Success', 'Goal set successfully!');
      navigation.navigate('Profile'); // Navigate back to Profile screen
    } catch (error) {
      console.error('Error setting goals:', error);
      Alert.alert('Error', 'Failed to set goals. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Goals</Text>

      <Text style={styles.label}>Select Goal Type:</Text>
      <Picker
        selectedValue={goalType}
        onValueChange={(itemValue) => setGoalType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Goal Type" value="" />
        <Picker.Item label="Steps" value="Steps" />
        <Picker.Item label="Calories" value="Calories" />
        <Picker.Item label="Distance" value="Distance" />
        <Picker.Item label="Workout Duration" value="Workout Duration" />
      </Picker>

      <Text style={styles.label}>Enter Goal Value:</Text>
      <TextInput
        style={styles.input}
        placeholder={`Enter value (e.g., ${goalType === 'Calories' ? '2000 kcal' : '10000'})`}
        value={goalValue}
        onChangeText={setGoalValue}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSetGoals}>
        <Text style={styles.buttonText}>Set Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SetGoals;
