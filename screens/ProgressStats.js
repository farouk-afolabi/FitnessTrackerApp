import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { auth } from '../firebase';
import { getUserFromFirestore } from '../utils/firestoreHelpers'; 

const ProgressStats = () => {
  const [progressData, setProgressData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (auth.currentUser) {
      fetchProgressData();
    } else {
      Alert.alert("Error", "User is not logged in.");
    }
  }, []);

  const fetchProgressData = async () => {
    try {
      const user = await getUserFromFirestore(auth.currentUser.uid);
      setProgressData(user.progressData || {}); 
    } catch (error) {
      console.error('Error fetching progress data:', error);
      Alert.alert("Error", "Failed to fetch progress data.");
    } finally {
      setIsLoading(false); 
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Fetching your progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      {progressData && Object.keys(progressData).length > 0 ? (
        Object.entries(progressData).map(([key, value], index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statLabel}>{key}:</Text>
            <Text style={styles.statValue}>{value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No progress data available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',  // Use a consistent font for better readability
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statLabel: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
    fontFamily: 'Roboto', // Keeping font consistent
  },
  statValue: {
    fontWeight: '500',
    color: '#6200ea',
    fontSize: 16,
    fontFamily: 'Roboto', // Consistency across UI
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ea',
    textAlign: 'center',
  },
});

export default ProgressStats;
