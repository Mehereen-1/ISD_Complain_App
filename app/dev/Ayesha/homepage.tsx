// app/index.tsx
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../../../lib/firebaseConfig";
import { logout } from "./services/authService";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    if (!currentUser) {
        Alert.alert("Error", "You need to log in first before logging out.");
        return;
      }
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully");
      setCurrentUser(null);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Button title="Go to Sign In" onPress={() => router.push("/dev/Ayesha/auth/signIn")} />
      <Button title="Go to Sign Up" onPress={() => router.push("/dev/Ayesha/auth/signUp")} />
      <Button title="Go to Complaint List" onPress={() => router.push("/dev/Ayesha/complaint/list")} />
      <Button title="Go to Complaint Form" onPress={() => router.push("/dev/Ayesha/complaint/form")} />
      <Button title="Delete Complain by User" onPress={() => router.push("/dev/Ayesha/complaint/list")} />
      <Button title="My Complaints" onPress={() => router.push("/dev/Ayesha/complaint/mylist")} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
});
