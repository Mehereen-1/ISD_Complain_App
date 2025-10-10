import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

interface ComplaintCardProps {
  title: string;
  status: string;
  category: string;
  createdAt: number | string;
  onPress: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ title, status, category, createdAt, onPress }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Resolved": return colors.white;
      case "In Progress": return colors.white;
      case "Pending": return colors.white;
      default: return colors.white;
    }
  };

  const getStatusBackgroundColor = () => {
    switch (status) {
      case "Resolved": return colors.success;
      case "In Progress": return colors.mountbattenPink;
      case "Pending": return colors.roseTaupe;
      default: return colors.roseTaupe;
    }
  };

  // Format createdAt for display
  let createdAtDisplay = "";
  if (typeof createdAt === "number") {
    const date = new Date(createdAt);
    createdAtDisplay = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } else if (typeof createdAt === "string") {
    createdAtDisplay = createdAt;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>CATEGORY</Text>
            <Text style={styles.category}>{category}</Text>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor() }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.detailsText}>DETAILS</Text>
          <Text style={styles.timeText}>{createdAtDisplay}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.rosyBrown,
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.rosyBrown,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    lineHeight: 24,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  categoryContainer: {
    marginTop: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.platinum2,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  category: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  detailsText: {
    fontSize: 12,
    color: colors.platinum2,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default ComplaintCard;
