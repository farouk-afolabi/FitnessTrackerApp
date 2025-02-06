import { firestore } from '../firebase';  // Import Firestore instance
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';  // Modular imports for Firestore

// Fetch user data from Firestore using the user's UID
export const getUserFromFirestore = async (uid) => {
  try {
    const userRef = doc(firestore, 'FitnessMembers', uid);  // Access Firestore document using 'doc'
    const docSnap = await getDoc(userRef);  // Use 'getDoc' to fetch the document
    if (docSnap.exists()) {
      return docSnap.data();  // Return the user data
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Error fetching user data: ' + error.message);
  }
};

// Update user data in Firestore
export const updateUserInFirestore = async (userData) => {
  try {
    const userRef = doc(firestore, 'FitnessMembers', userData.uid);  // Access Firestore document using 'doc'
    await updateDoc(userRef, {
      displayName: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
    });
  } catch (error) {
    throw new Error('Error updating user data: ' + error.message);
  }
};

// Save a goal to Firestore
export const saveGoalToFirestore = async (goalType, goalValue, uid) => {
  try {
    const goalsRef = collection(firestore, 'goals');  // Reference the 'goals' collection in Firestore

    // Add a new goal document to the 'goals' collection
    await addDoc(goalsRef, {
      userId: uid,             // Associate the goal with the authenticated user
      goalType: goalType,      // Store the goal type (e.g., Steps, Calories)
      goalValue: goalValue,    // Store the goal value (e.g., 10000 steps)
      timestamp: new Date(),   // Store the timestamp when the goal is set
    });

    console.log('Goal saved successfully');
  } catch (error) {
    console.error('Error saving goal to Firestore:', error);
    throw new Error('Failed to save goal');
  }
};

// Fetch goals for a user from Firestore
export const getGoalsFromFirestore = async (uid) => {
  try {
    const goalsRef = collection(firestore, 'goals');  // Reference the 'goals' collection
    const q = query(goalsRef, where('userId', '==', uid));  // Query goals based on userId

    const querySnapshot = await getDocs(q);  // Fetch all documents for the user
    const goals = [];
    querySnapshot.forEach((doc) => {
      goals.push(doc.data());  // Add each goal document data to the goals array
    });

    return goals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw new Error('Failed to fetch goals');
  }
};
