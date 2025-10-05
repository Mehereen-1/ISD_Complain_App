// app/auth/signUp.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../Adiba/constants/colors";
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
      router.replace("/dev/Ayesha/homepage");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Sign Up</Text>
      </View>
      <View style={styles.tabRow}>
        <View style={styles.tab}>
          <Text
            style={styles.tabText}
            onPress={() => router.push("/dev/Ayesha/auth/signIn")}
          >
            Sign In
          </Text>
        </View>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, { color: colors.white }]}>Sign Up</Text>
        </View>
      </View>
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.formLabel}>Roll</Text>
        <TextInput
          style={styles.input}
          placeholder="Roll"
          value={roll}
          onChangeText={setRoll}
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.formLabel}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.formLabel}>Batch</Text>
        <TextInput
          style={styles.input}
          placeholder="Batch"
          value={batch}
          onChangeText={setBatch}
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.formLabel}>Hall</Text>
        <TextInput
          style={styles.input}
          placeholder="Hall"
          value={hall}
          onChangeText={setHall}
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.formLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.buttonRow}>
          <Button title="Sign Up" color={colors.roseTaupe} onPress={handleSignUp} />
        </View>
        <Text
          style={styles.linkText}
          onPress={() => router.push("/dev/Ayesha/auth/signIn")}
        >
          Already have an account? Sign In
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.platinum,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: colors.rosyBrown,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: colors.textPrimary,
  },
  tabText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  formCard: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  formLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.rosyBrown,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.platinum,
    color: colors.textPrimary,
  },
  buttonRow: {
    marginTop: 10,
    marginBottom: 10,
  },
  linkText: {
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
