// app/auth/signUp.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { signUp } from "../services/authService";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [hall, setHall] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!name || !roll || !department || !batch || !hall || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await signUp(email, password, name, roll, department, batch, hall);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/dev/Ayesha/homepage"); // Redirect to homepage or dashboard
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Sign Up</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Roll" value={roll} onChangeText={setRoll} />
      <TextInput style={styles.input} placeholder="Department" value={department} onChangeText={setDepartment} />
      <TextInput style={styles.input} placeholder="Batch" value={batch} onChangeText={setBatch} />
      <TextInput style={styles.input} placeholder="Hall" value={hall} onChangeText={setHall} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Sign Up" onPress={handleSignUp} />
      <View style={{ marginTop: 10 }}>
        <Button title="Already have an account? Sign In" onPress={() => router.push("/dev/Ayesha/auth/signIn")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E3E0E0", // Platinum theme background
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#8F696A", // Rose Taupe
  },
  input: {
    borderWidth: 1,
    borderColor: "#AC8A9A", // Mountbatten Pink
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
});
