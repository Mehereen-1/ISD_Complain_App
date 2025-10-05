import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

// Import dev screens (replace with actual files later)
import AdibaPage from './dev/Adiba/Page3';
//import AyeshaPage from './dev/Ayesha/Page1';
import AyeshaPage from './dev/Ayesha/homepage';
import RajorshiPage from './dev/Rajorshi/Page2';
const Tab = createBottomTabNavigator();

// Fallback screen if someone hasn’t made theirs yet
function Placeholder({ name }: { name: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{name} screen not ready yet 🚧</Text>
    </View>
  );
}

export default function App() {
  return (

      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Adiba"
          component={AdibaPage || (() => <Placeholder name="Adiba" />)}
        />
        <Tab.Screen
          name="Ayesha"
          component={AyeshaPage || (() => <Placeholder name="Ayesha" />)}
        />
        <Tab.Screen
          name="Rajorshi"
          component={RajorshiPage || (() => <Placeholder name="Rajorshi" />)}
        />
      </Tab.Navigator>
  );
}