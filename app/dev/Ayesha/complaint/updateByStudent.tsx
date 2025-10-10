import { auth } from "@/lib/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Complaint, listenUserComplaints, updateComplaint } from "../services/dbService";

export default function UpdateComplaintsScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const predefinedCategories = ["Plumbing", "Electrical", "Cleaning", "Other"];


  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [zone, setZone] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsubscribe = listenUserComplaints(uid, (data) => {
      setComplaints(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setTitle(complaint.title);
    setDescription(complaint.description);
    setCategory(complaint.category);
    setZone(complaint.zone);
  };

  const handleUpdate = async () => {
    if (!selectedComplaint) {
      Alert.alert("Error", "No complaint selected.");
      return;
    }

    try {
      await updateComplaint(selectedComplaint.id!, {
        title,
        description,
        category,
        zone,
      });
      Alert.alert("Success", "Complaint updated successfully!");
      setSelectedComplaint(null); // reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setZone("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update complaint.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Complaints</Text>

      {/* Complaint List */}
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectComplaint(item)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Zone: {item.zone}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Update Form (only if a complaint is selected) */}
      {selectedComplaint && (
        <View style={styles.form}>
          <Text style={styles.subheading}>Update Complaint</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        {predefinedCategories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

          <TextInput
            style={styles.input}
            placeholder="Zone"
            value={zone}
            onChangeText={setZone}
          />

          <Button title="Update Complaint" onPress={handleUpdate} />
          <Button title="Cancel" color="grey" onPress={() => setSelectedComplaint(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  form: { marginTop: 20, padding: 15, borderWidth: 1, borderRadius: 6, borderColor: "#aaa" },
  subheading: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});
