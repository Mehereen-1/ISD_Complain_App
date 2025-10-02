import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

interface ComplaintCardProps {
  title: string;
  status: string;
  category: string;
  onPress: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ title, status, category, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.category}>Category: {category}</Text>
      <Text style={[styles.status, status === "Resolved" ? styles.resolved : styles.pending]}>
        Status: {status}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.deep,
    padding: 18,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 0,
    shadowColor: colors.deep,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff", // white text for deep card
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: colors.lightest,
    marginTop: 2,
    opacity: 0.85,
  },
  status: {
    fontSize: 13,
    marginTop: 8,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 0.5,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  resolved: {
    backgroundColor: "rgba(76,175,80,0.18)",
    color: "#C8E6C9",
  },
  pending: {
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#fff",
  },
});

export default ComplaintCard;
