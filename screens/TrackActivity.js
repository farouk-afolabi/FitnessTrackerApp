import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Pedometer from 'expo-sensors';
import { auth, firestore } from '../firebase'; // Ensure Firebase is configured
import { doc, updateDoc } from 'firebase/firestore';

const TrackActivity = ({ navigation }) => {
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [subscriptions, setSubscriptions] = useState({ location: null, pedometer: null });

  useEffect(() => {
    const initializePermissions = async () => {
      try {
        const locationPermission = await Location.requestForegroundPermissionsAsync();
        if (!locationPermission.granted) {
          Alert.alert('Permission Denied', 'Location permission is required to track activity.');
          return;
        }

        const pedometerAvailable = await Pedometer.isAvailableAsync();
        if (!pedometerAvailable) {
          Alert.alert('Error', 'Pedometer is not available on this device.');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Error', 'Failed to initialize activity tracking.');
      }
    };

    initializePermissions();

    return () => stopTracking(); // Cleanup on component unmount
  }, []);

  const startTracking = async () => {
    try {
      setIsTracking(true);

      const locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 100 },
        (location) => setLocationData(location)
      );

      const pedometerSubscription = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });

      setSubscriptions({ location: locationSubscription, pedometer: pedometerSubscription });
    } catch (error) {
      console.error('Start tracking error:', error);
      Alert.alert('Error', 'Failed to start tracking.');
    }
  };

  const stopTracking = () => {
    setIsTracking(false);

    if (subscriptions.location) {
      subscriptions.location.remove();
    }
    if (subscriptions.pedometer) {
      subscriptions.pedometer.remove();
    }

    setSubscriptions({ location: null, pedometer: null });
  };

  const saveActivityToFirestore = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const activityData = {
        type: activityType.trim(),
        duration: parseInt(duration, 10),
        location: locationData
          ? {
              latitude: locationData.coords.latitude,
              longitude: locationData.coords.longitude,
            }
          : null,
        steps: stepCount,
        timestamp: new Date().toISOString(),
      };

      await updateDoc(doc(firestore, 'FitnessMembers', userId), {
        [`activities.${Date.now()}`]: activityData,
      });

      Alert.alert('Success', 'Activity tracked successfully!');
    } catch (error) {
      console.error('Save activity error:', error);
      Alert.alert('Error', 'Failed to save activity.');
    }
  };

  const handleTrackActivity = async () => {
    if (!activityType.trim() || !duration || isNaN(duration) || Number(duration) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid activity type and duration.');
      return;
    }

    await saveActivityToFirestore();
    stopTracking();
    navigation.navigate('ProgressStats'); // Navigate to Progress Stats screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Activity</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter activity type (e.g., Running, Walking)"
        value={activityType}
        onChangeText={setActivityType}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      {isTracking ? (
        <>
          <Text style={styles.dataTitle}>Current Steps:</Text>
          <Text style={styles.dataValue}>{stepCount}</Text>

          <Text style={styles.dataTitle}>Last Known Location:</Text>
          <Text style={styles.dataValue}>
            Latitude: {locationData?.coords.latitude || 'N/A'}, Longitude: {locationData?.coords.longitude || 'N/A'}
          </Text>

          <Button title="Stop Tracking" onPress={stopTracking} color="#e53935" />
        </>
      ) : (
        <Button title="Start Tracking" onPress={startTracking} color="#6200ea" />
      )}

      <Button
        title="Save Activity"
        onPress={handleTrackActivity}
        color="#4caf50"
        disabled={!isTracking}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ea',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dataTitle: {
    fontSize: 18,
    marginTop: 10,
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
  },
});

export default TrackActivity;
