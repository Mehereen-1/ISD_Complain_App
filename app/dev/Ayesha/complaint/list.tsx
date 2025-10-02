import { Colors } from "@/app/theme/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { Complaint, listenComplaints } from "../services/dbService";

export default function ComplaintListScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const unsubscribe = listenComplaints((data) => {
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
            <Text>Status: {item.status}</Text>
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
