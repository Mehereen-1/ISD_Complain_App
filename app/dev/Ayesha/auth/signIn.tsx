// app/auth/signIn.tsx
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../../../lib/firebaseConfig"; // your initialized firebase
import { colors } from "../../Adiba/constants/colors";
import { signIn } from "../services/authService"; // adjust if services folder path changed

// export default function SignIn() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSignIn = async () => {
//     try {
//       await signIn(email, password);
//       router.replace("/dev/Ayesha/complaint/list"); // navigate to complaint list
//     } catch (err: any) {
//       Alert.alert("Error", err.message);
//     }
//   };

//   if (currentUser) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>You are already logged in as:</Text>
//         <Text style={styles.email}>{currentUser.email}</Text>
//         <Button
//           title="Go to Complaints"
//           onPress={() => router.replace("/dev/Ayesha/complaint/list")}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign In</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Sign In" onPress={handleSignIn} />
//       <Button
//         title="Go to Sign Up"
//         onPress={() => router.push("/dev/Ayesha/auth/signUp")}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20, alignItems: "center" },
//   title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, width: "100%" },
//   email: { fontSize: 16, marginBottom: 20, color: "green" },
// });


// ...existing code...
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
      await signIn(email, password);
      router.replace("/dev/Ayesha/complaint/list");
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
          title="Go to Complaints"
          onPress={() => router.replace("/dev/Ayesha/complaint/list")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          style={styles.linkText}
          onPress={() => router.push("/dev/Ayesha/auth/signUp")}
        >
          Don't have an account? Sign Up
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.platinum,
    paddingTop: 40,
    paddingHorizontal: 0,
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
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  email: { fontSize: 16, marginBottom: 20, color: "green" },
});