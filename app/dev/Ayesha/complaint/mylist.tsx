// app/complaint/myList.tsx
import { Colors } from "@/app/theme/colors";
import { auth } from "@/lib/firebaseConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { Complaint, deleteComplaintByUser, listenUserComplaints } from "../services/dbService";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsubscribe = listenUserComplaints(uid, (data) => {
      setComplaints(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this complaint?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const uid = auth.currentUser?.uid;
              if (!uid) {
                Alert.alert("Error", "You must be logged in to delete complaints.");
                return;
              }
              const complaint = complaints.find(c => c.id === id);
              if (!complaint) {
                Alert.alert("Error", "Complaint not found.");
                return;
              }
              deleteComplaintByUser(uid, id, complaint);
              Alert.alert("Success", "Complaint deleted successfully!");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Could not delete complaint.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Complaints</Text>
      {complaints.length === 0 ? (
        <Text style={styles.empty}>No complaints yet. Create one!</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Category: {item.category}</Text>
              <Text>Zone: {item.zone}</Text>
              {item.imageUrl ? <Text>Image: {item.imageUrl}</Text> : null}
              <Text>Status: {item.status}</Text>
              <Button
                title="Delete"
                color={Colors.dark}
                onPress={() => handleDelete(item.id!)}
              />
            </View>
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Create New Complaint"
          color={Colors.mediumLight}
          onPress={() => router.push("/dev/Ayesha/complaint/form")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  empty: { textAlign: "center", marginTop: 20, color: Colors.medium },
  card: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  buttonContainer: { marginVertical: 10 },
});
