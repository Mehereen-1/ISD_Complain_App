import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from './SplashScreen';
import SignIn from './dev/Ayesha/auth/signIn';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Signup" component={SignIn} />
    </Stack.Navigator>
  );
}
