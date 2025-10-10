import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../Adiba/constants/colors"; // your existing color palette
import { createAdmin } from "../services/adminService"; // path to your adminService.js

export default function AdminRegister() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      await createAdmin({email, password, name});
      Alert.alert("Success", "Admin registered successfully!");
      setEmail("");
      setPassword("");
      setName("");
      router.replace("/dev/Ayesha/homepage");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to register admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Registration</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Registering..." : "Register Admin"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.platinum,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.rosyBrown,
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.roseTaupe,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: 20,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
});
