import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/FilterBar";
import { colors } from "../constants/colors";

const mockComplaints = [
  { id: "1", title: "Leaky tap", category: "Maintenance", status: "Pending" },
  { id: "2", title: "Noise complaint", category: "Community", status: "Resolved" },
  { id: "3", title: "Street light broken", category: "Maintenance", status: "Pending" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Pending", "Resolved"];

  const filteredComplaints =
    selectedFilter === "All"
      ? mockComplaints
      : mockComplaints.filter((c) => c.status === selectedFilter);

  const handleComplaintPress = (complaint: any) => {
    router.push({
      pathname: "/complaint-details",
      params: {
        id: complaint.id,
        title: complaint.title,
        category: complaint.category,
        status: complaint.status,
      },
    });
  };

  return (
    <View style={styles.container}>
      <FilterBar
        filters={filters}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {selectedFilter === "All" ? "All Complaints" : `${selectedFilter} Complaints`}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
        </Text>

        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ComplaintCard
              title={item.title}
              category={item.category}
              status={item.status}
              onPress={() => handleComplaintPress(item)} createdAt={""}            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No complaints found</Text>
              <Text style={styles.emptySubtitle}>
                There are no {selectedFilter.toLowerCase()} complaints at this time.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightest,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.deep,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.medium,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.deep,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.medium,
    textAlign: 'center',
    lineHeight: 20,
  },
});
