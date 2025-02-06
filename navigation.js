import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './screens/Login';
import Login from './screens/Dashboard';
import Register from './screens/Register';
import Profile from './screens/Profile';
import ProgressStats from './screens/ProgressStats';
import SetGoals from './screens/SetGoals';
import TrackActivity from './screens/TrackActivity';



const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProgressStats" component={ProgressStats} />
        <Stack.Screen name="SetGoals" component = {SetGoals} />
        <Stack.Screen name="TrackActivity" component= {TrackActivity} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}