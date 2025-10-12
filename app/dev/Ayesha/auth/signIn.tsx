// app/auth/signIn.tsx
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from "../../../../lib/firebaseConfig"; // your initialized firebase
import { colors } from "../../Adiba/constants/colors";
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
  try {
    // Sign in the user with Firebase Auth
    await signIn(email, password);

    // Get the current user
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");

    // Check if the user exists in the 'admins' table
    const adminRef = ref(db, "admins");
    const snapshot = await get(adminRef);

    let isAdmin = false;
    snapshot.forEach((child) => {
      const admin = child.val();
      if (admin.email === user.email) {
        isAdmin = true;
      }
    });

    // Navigate based on role
    if (isAdmin) {
      router.replace("/dev/Adiba/screens/AdminDashboard");
    } else {
      router.replace("/dev/Rajorshi/Page2");
    }
  } catch (err: any) {
    Alert.alert("Error", err.message);
  }
};
  return (
    <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: colors.platinum }}
          contentContainerStyle={styles.container}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.formCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome</Text>
          </View>
          <View style={styles.tabRow}>
            <View style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, { color: colors.white }]}>Sign In</Text>
            </View>
            <View style={styles.tab}>
              <Text
                style={styles.tabText}
                onPress={() => router.push("/dev/Ayesha/auth/signUp")}
              >
                Sign Up
              </Text>
            </View>
          </View>
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.formLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.buttonRow}>
              <Button title="Sign In" color={colors.roseTaupe} onPress={handleSignIn} />
            </View>
             <Text
              style={styles.forgotPasswordText}
            >
              Forgot Password?
            </Text>

            <Text
              style={styles.linkText}
              onPress={() => router.push("/dev/Ayesha/auth/signUp")}
            >
              Don't have an account? Sign Up
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.platinum,
    paddingTop: 40,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',             // center and limit width
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
},

  header: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    justifyContent: "center",
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
    marginBottom: 5,
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
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  email: { fontSize: 16, marginBottom: 20, color: "green" },
  forgotPasswordText: {
  color: colors.textPrimary,
  textAlign: "center",
  marginBottom: 10,
  textDecorationLine: "underline",
  fontWeight: "bold",
},
});