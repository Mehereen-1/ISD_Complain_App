import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import dev screens (replace with actual files later)
//import AyeshaPage from './dev/Ayesha/Page1';
const Tab = createBottomTabNavigator();

// Fallback screen if someone hasn’t made theirs yet
function Placeholder({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> ISD Complaint App</Text>
      <Text style={styles.subtitle}>Choose your developer section</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.adibaButton]} 
          onPress={navigateToAdiba}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}> Adiba's Section</Text>
          <Text style={styles.buttonSubtext}>Admin Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.ayeshaButton]} 
          onPress={navigateToAyesha}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}> Ayesha's Section</Text>
          <Text style={styles.buttonSubtext}>Authentication</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.rajorshiButton]} 
          onPress={navigateToRajorshi}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}> Rajorshi's Section</Text>
          <Text style={styles.buttonSubtext}>Page 2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  adibaButton: {
    backgroundColor: '#BB94A2',
  },
  ayeshaButton: {
    backgroundColor: '#8FA68E',
  },
  rajorshiButton: {
    backgroundColor: '#6B8CAE',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
  },
});
