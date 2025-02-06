// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAaMOXMFASLhg31GPCIIRiJCok0dlKLChE",
  authDomain: "fitnesstrackerapp-d4c74.firebaseapp.com",
  projectId: "fitnesstrackerapp-d4c74",
  storageBucket: "fitnesstrackerapp-d4c74.firebasestorage.app",
  messagingSenderId: "651623105820",
  appId: "1:651623105820:web:144ef67411b04a9ca7a6d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });


// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);




export { auth, firestore};

