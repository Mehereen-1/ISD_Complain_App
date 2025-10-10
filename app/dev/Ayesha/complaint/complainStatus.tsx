import { Picker } from "@react-native-picker/picker"; // install this package: expo install @react-native-picker/picker
import { default as React, useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Complaint, listenComplaintsByStatus } from "../services/dbService";

export default function ComplaintsByStatusScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Example predefined categories (can come from DB too)
  const categories = ["Pending", "In Progress", "Solved"];

  useEffect(() => {
    if (!selectedStatus) return;

    const unsubscribe = listenComplaintsByStatus(selectedStatus, (data) => {
      setComplaints(data);
    });

    return () => unsubscribe();
  }, [selectedStatus]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints by Status</Text>

      {/* Category Dropdown */}
      <Picker
        selectedValue={selectedStatus}
        style={styles.picker}
        onValueChange={(value) => setSelectedStatus(value)}
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
          selectedStatus ? (
            <Text style={styles.emptyText}>No complaints in this status</Text>
          ) : (
            <Text style={styles.emptyText}>Select a status to view complaints</Text>
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
