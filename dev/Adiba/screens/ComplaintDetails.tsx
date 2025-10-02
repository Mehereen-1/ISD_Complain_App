import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

const ComplaintDetails = ({ route }: any) => {
  const { complaint } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.card}>
        <Text style={styles.title}>{complaint.title}</Text>
        <Text style={styles.category}>Category: {complaint.category}</Text>
        <Text style={[styles.status, complaint.status === "Resolved" ? styles.resolved : styles.pending]}>
          Status: {complaint.status}
        </Text>
        {/* Optional: Add description */}
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet eros
          nec justo dignissim lacinia.
        </Text>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>Mark as Resolved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Add Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightest,
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.light,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.deep,
  },
  category: {
    fontSize: 16,
    color: colors.medium,
    marginTop: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  resolved: {
    color: "#2E7D32", // green for resolved
  },
  pending: {
    color: colors.deep, // deep red for pending
  },
  description: {
    fontSize: 14,
    color: "#333333",
    marginTop: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: colors.deep,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: colors.medium,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ComplaintDetails;
