import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

interface ComplaintCardProps {
  title: string;
  status: string;
  category: string;
  createdAt: string;
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor() }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Category</Text>
          <Text style={styles.category}>{category}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{createdAt}</Text>
        </View>
        <Text style={styles.arrow}>Details</Text>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.platinum2,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  category: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 14,
    color: colors.platinum2,
    fontWeight: '600',
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  time: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
});

export default ComplaintCard;
