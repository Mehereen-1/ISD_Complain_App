// app/dev/Ayesha/auth/signIn.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { signIn } from "../services/authService";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.push("/dev/Ayesha/complaint/list");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.light }]}>
      <Text style={[styles.title, { color: Colors.dark }]}>Sign In!</Text>
      <TextInput
        style={[styles.input, { borderColor: Colors.medium, color: Colors.dark }]}
        placeholder="Email"
        placeholderTextColor={Colors.dark}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: Colors.medium, color: Colors.dark }]}
        placeholder="Password"
        placeholderTextColor={Colors.dark}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign In" color={Colors.medium} onPress={handleSignIn} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Sign Up"
          color={Colors.mediumLight}
          onPress={() => router.push("/dev/Ayesha/auth/signUp")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8 },
  buttonContainer: { marginVertical: 5 },
});