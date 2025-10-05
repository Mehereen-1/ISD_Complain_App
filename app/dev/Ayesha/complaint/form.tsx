import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { auth } from "../../../../lib/firebaseConfig";
import { addComplaint, Complaint } from "../services/dbService";

const predefinedCategories = ["Plumbing", "Electrical", "Cleaning", "Other"];
const predefinedZones = ["Zone A", "Zone B", "Zone C", "Zone D"];

const ComplaintForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(predefinedCategories[0]);
  const [zone, setZone] = useState(predefinedZones[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage("You must be logged in to submit a complaint.");
      return;
    }

    setLoading(true);
    try {
      const newComplaint: Complaint = {
        title,
        description,
        category,
        zone,
        imageUrl,
        status: "Pending",
        createdBy: currentUser.uid,
        createdAt: Date.now(),
      };

      const complaintId = await addComplaint(newComplaint);
      setMessage(`Complaint submitted! ID: ${complaintId}`);

      setTitle("");
      setDescription("");
      setCategory(predefinedCategories[0]);
      setZone(predefinedZones[0]);
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>File a Complaint</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
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

      <Text>Zone</Text>
      <Picker
        selectedValue={zone}
        onValueChange={(itemValue) => setZone(itemValue)}
      >
        {predefinedZones.map((z) => (
          <Picker.Item key={z} label={z} value={z} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Button title={loading ? "Submitting..." : "Submit Complaint"} onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  message: { marginBottom: 10, color: "blue" },
});

export default ComplaintForm;
