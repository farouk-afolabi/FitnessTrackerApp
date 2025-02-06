import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { signOut } from "firebase/auth";
import { auth, firestore } from '../firebase'; 
import { getDoc, doc } from 'firebase/firestore';

const Dashboard = ({ route, navigation }) => {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    
    const fitnessStats = {
      steps: 10500,
      calories: 350,
      activeMinutes: 45,
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userDoc = await getDoc(doc(firestore, 'FitnessMembers', currentUser.uid));
                    if (userDoc.exists()) {
                        setFirstName(userDoc.data().firstName);
                    }
                } catch (error) {
                    console.log("Error fetching user data:", error);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth).then(() => {
                navigation.navigate('Main');
            });
        } catch (error) {
            console.log("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out");
        }
    };

    const displayName = firstName || 'Guest'; // Display first name or 'Guest'

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/images/background.jpg")}
                resizeMode="cover"
                style={styles.background}
            >  
                <Text style={styles.title}>Welcome, {displayName}!</Text>

                <View style={styles.statsContainer}>
                    <Text style={styles.statsTitle}>Fitness Stats</Text>
                    <Text style={styles.statsText}>Steps: {fitnessStats.steps}</Text>
                    <Text style={styles.statsText}>Calories: {fitnessStats.calories} kcal</Text>
                    <Text style={styles.statsText}>Active Minutes: {fitnessStats.activeMinutes} min</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.customButton, styles.trackActivity]}
                        onPress={() => navigation.navigate('TrackActivity')}
                    >
                        <Text style={styles.buttonText}>Track Activity</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.customButton, styles.viewProgress]}
                        onPress={() => navigation.navigate('ProgressStats')}
                    >
                        <Text style={styles.buttonText}>View Progress</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.customButton, styles.setGoals]}
                        onPress={() => navigation.navigate('SetGoals')}
                    >
                        <Text style={styles.buttonText}>Set Goals</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.customButton, styles.profile]}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.buttonText}>Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.logoutContainer}>
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    background: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00FF00',
    },
    statsContainer: {
        marginVertical: 20,
        alignItems: 'flex-start',
        width: '100%',
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    statsText: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    customButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#007AFF',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    trackActivity: {
        backgroundColor: '#FFA500',
    },
    viewProgress: {
        backgroundColor: '#2196F3',
    },
    setGoals: {
        backgroundColor: '#8BC34A',
    },
    profile: {
        backgroundColor: '#9C27B0',
    },
    logoutContainer: {
        marginTop: 20,
        width: '30%',
    },
});

export default Dashboard;
