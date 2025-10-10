// app/auth/signIn.tsx
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../../../lib/firebaseConfig"; // your initialized firebase
import { signIn } from "../services/authService"; // adjust if services folder path changed

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    
    try {
      await signIn(email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/dev/Rajorshi/Page2"); // Navigate to main Rajorshi page
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You are already logged in as:</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
        <Button
          title="Go to Main App"
          onPress={() => router.replace("/dev/Rajorshi/Page2")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button
        title="Go to Sign Up"
        onPress={() => router.push("/dev/Ayesha/auth/signUp")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, alignItems: "center" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, width: "100%" },
  email: { fontSize: 16, marginBottom: 20, color: "green" },
});
