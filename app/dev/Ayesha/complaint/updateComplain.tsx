import { Colors } from "@/app/theme/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    Complaint,
    listenAllComplaints,
    updateComplaintStatus,
} from "../services/dbService";


export default function ComplaintListScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const unsubscribe = listenAllComplaints((data) => {
      setComplaints(data);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: "Pending" | "In Progress" | "Solved") => {
    try {
      await updateComplaintStatus(id, status);
      Alert.alert("Success", `Complaint marked as ${status}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update complaint status.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Complaints</Text>

      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Zone: {item.zone}</Text>
            {item.imageUrl ? <Text>Image: {item.imageUrl}</Text> : null}
            <Text>Status: {item.status}</Text>

            <View style={styles.buttonRow}>
              <Button
                title="Solved"
                color="green"
                onPress={() => handleStatusUpdate(item.id!, "Solved")}
              />
              <Button
                title="Pending"
                color="red"
                onPress={() => handleStatusUpdate(item.id!, "Pending")}
              />
              <Button
                title="In Progress"
                color="orange"
                onPress={() => handleStatusUpdate(item.id!, "In Progress")}
              />
            </View>
          </View>
        )}
      />

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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonContainer: { marginVertical: 15 },
});
