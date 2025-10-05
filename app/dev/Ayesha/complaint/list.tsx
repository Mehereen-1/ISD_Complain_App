import { Colors } from "@/app/theme/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { Complaint, deleteComplaintByAdmin, deleteComplaintByUser, listenAllComplaints } from "../services/dbService";

export default function ComplaintListScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const unsubscribe = listenAllComplaints((data) => {
      setComplaints(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Complaints</Text>
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
              color="red"
              onPress={() => {
                // Replace 'userId' with the actual user id, e.g., from auth.currentUser?.uid
                const userId = ""; // TODO: get the current user's uid
                deleteComplaintByUser(userId, item.id!, item);
              }}
            />
            <Button
              title="Delete"
              color="blue"
              onPress={() => {deleteComplaintByAdmin(item.id!)}}
            />

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
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  buttonContainer: { marginVertical: 5 },
});
