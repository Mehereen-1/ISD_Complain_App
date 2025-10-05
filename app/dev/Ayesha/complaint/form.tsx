import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { auth } from "../../../../lib/firebaseConfig";
import { addComplaint, Complaint } from "../services/dbService";
import { pickAndUploadImage } from "../services/uploadImageToCloudinary";

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

  const pickImage = async () => {
    const url = await pickAndUploadImage();
    if (url) {
      setImageUrl(url);
      Alert.alert("Success", "Image uploaded successfully!");
    } else {
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const handleSubmit = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage("You must be logged in to submit a complaint.");
      return;
    }

    setLoading(true);

    try {

      console.log("🔥 PICKED IMAGE URL:", imageUrl);


      const newComplaint: Complaint = {
      title: title || "",          // never undefined
      description: description || "",
      category: category || "Other",
      zone: zone || "Zone A",
      imageUrl: imageUrl,    // empty string if no image
      status: "Pending",
      createdBy: currentUser.uid,
      createdAt: Date.now(),
};

      const complaintId = await addComplaint(newComplaint);
      console.log("New complaint object:", newComplaint);

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

      <Button title="Pick an Image" onPress={pickImage} />
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}

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
