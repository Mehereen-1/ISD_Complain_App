import { Colors } from "@/app/theme/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Complaint, deleteComplaintByAdmin, deleteComplaintByUser, getStudentByComplaintId, listenAllComplaints } from "../services/dbService";

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
            {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: 200, height: 200, marginVertical: 5, borderRadius: 5 }}
            />
) : null}
            <Text style={styles.status}>Status: {item.status}</Text>
            <Button
              title="View Complainer"
              color={Colors.mediumLight}
               onPress={async () => {
                try {
                  const student = await getStudentByComplaintId(item.id!);
                  if (student) {
                    Alert.alert(
                      "Complainer Details",
                      `Name: ${student.name}\nEmail: ${student.email}\nDepartment: ${student.department ?? "N/A"}\nRoll: ${student.roll ?? "N/A"}`
                    );
                  } else {
                    Alert.alert("Not Found", "Could not find student details for this complaint.");
                  }
                } catch (err) {
                  console.error(err);
                  Alert.alert("Error", "Failed to fetch student details.");
                }
  }}
            />
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
  status: { marginTop: 10, color: "green" },
});
