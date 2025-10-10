import { Picker } from "@react-native-picker/picker"; // install this package: expo install @react-native-picker/picker
import { default as React, useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Complaint, listenComplaintsByCategory } from "../services/dbService";

export default function ComplaintsByCategoryScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Example predefined categories (can come from DB too)
  const categories = ["Electrical", "Plumbing", "Cleaning", "WiFi", "Other"];

  useEffect(() => {
    if (!selectedCategory) return;

    const unsubscribe = listenComplaintsByCategory(selectedCategory, (data) => {
      setComplaints(data);
    });

    return () => unsubscribe();
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints by Category</Text>

      {/* Category Dropdown */}
      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(value) => setSelectedCategory(value)}
      >
        <Picker.Item label="Select a Category" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      {/* Complaint List */}
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Zone: {item.zone}</Text>
            <Text>Status: {item.status}</Text>
            {item.imageUrl ? <Text>Image: {item.imageUrl}</Text> : null}
          </View>
        )}
        ListEmptyComponent={
          selectedCategory ? (
            <Text style={styles.emptyText}>No complaints in this category</Text>
          ) : (
            <Text style={styles.emptyText}>Select a category to view complaints</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  emptyText: { marginTop: 20, fontStyle: "italic", color: "#666" },
});
