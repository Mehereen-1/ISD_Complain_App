import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();

  const handleAdminDashboard = () => {
    // Navigate to Adiba's AdminDashboard
    router.push("/dev/Adiba/screens/AdminDashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Adiba's Home Screen</Text>
      <Text style={styles.subtitle}>Welcome to the app! 🚀</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAdminDashboard}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Go to Admin Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#BB94A2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;