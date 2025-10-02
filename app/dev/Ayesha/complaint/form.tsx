import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../../../lib/firebaseConfig";
import { addComplaint } from "../services/dbService";

export default function ComplaintFormScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!auth.currentUser) return;

    await addComplaint({
      title,
      description,
      status: "To Do",
      createdBy: auth.currentUser.uid,
      createdAt: Date.now(),
    });

    setTitle("");
    setDescription("");
    router.push("/dev/Ayesha/complaint/list"); // go to list after adding
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Complaint</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Submit Complaint" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
});
