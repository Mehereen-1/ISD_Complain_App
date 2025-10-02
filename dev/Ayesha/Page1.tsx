import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { signUp } from "../../app/services/authService";
import { UserProfile } from "../../app/services/dbService";

export default function SignupTestScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleSignUp = async () => {
    try {
      const newUser = await signUp(email, password, name);
      setUser(newUser);
      setMessage("Signup successful!");
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Test</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignUp} />

      {message && <Text style={styles.message}>{message}</Text>}

      {user && (
        <View style={styles.userContainer}>
          <Text>UID: {user.uid}</Text>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {user.role}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
  message: { marginTop: 15, fontSize: 16, color: "green", textAlign: "center" },
  userContainer: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: "#aaa", borderRadius: 5 },
});
