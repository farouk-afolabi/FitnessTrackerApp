import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [location, setLocation] = useState(null);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState({ location: true, bio: true, image: false });

  // Fetch location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Permission to access location was denied.');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoading((prev) => ({ ...prev, location: false }));
      }
    };

    fetchLocation();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'FitnessMembers', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setBio(data.bio || 'No bio available.');
            setProfileImage(data.profileImage || null);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      } finally {
        setIsLoading((prev) => ({ ...prev, bio: false }));
      }
    };

    fetchUserData();
  }, [user]);

  // Handle bio save
  const handleSaveBio = async () => {
    if (!bio.trim()) {
      Alert.alert('Error', 'Bio cannot be empty.');
      return;
    }

    try {
      await setDoc(doc(firestore, 'FitnessMembers', user.uid), { bio }, { merge: true });
      Alert.alert('Success', 'Your bio has been updated!');
    } catch (error) {
      console.error('Error saving bio:', error);
      Alert.alert('Error', 'Failed to update bio.');
    }
  };

  // Handle image picker
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission to access media library was denied.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await saveProfileImage(result.assets[0].uri);
    }
  };

  const saveProfileImage = async (uri) => {
    setIsLoading((prev) => ({ ...prev, image: true }));
    try {
      await setDoc(doc(firestore, 'FitnessMembers', user.uid), { profileImage: uri }, { merge: true });
      Alert.alert('Success', 'Profile image updated!');
    } catch (error) {
      console.error('Error saving profile image:', error);
      Alert.alert('Error', 'Failed to save profile image.');
    } finally {
      setIsLoading((prev) => ({ ...prev, image: false }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
          <Text style={styles.imageButtonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user?.email}</Text>
      </View>

      {/* Location */}
      {isLoading.location ? (
        <ActivityIndicator size="small" color="#6200ea" />
      ) : location ? (
        <Text style={styles.info}>
          Location: {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
        </Text>
      ) : (
        <Text style={styles.info}>Location unavailable</Text>
      )}

      {/* Bio Section */}
      <Text style={styles.label}>Bio:</Text>
      <TextInput
        style={styles.bioInput}
        placeholder="Tell us about yourself..."
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Button title="Save Bio" onPress={handleSaveBio} color="#6200ea" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bioInput: {
    height: 100,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 15,
  },
});

export default Profile;
