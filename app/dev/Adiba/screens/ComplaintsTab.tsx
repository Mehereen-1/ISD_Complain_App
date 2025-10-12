import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Complaint,
  listenAllComplaints
} from "../../Ayesha/services/dbService";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/FilterBar";
import { colors } from "../constants/colors";

// ...existing code...

export default function ComplaintsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const prevComplaintIdsRef = React.useRef<string[]>([]);
  const [newComplaintNotif, setNewComplaintNotif] = useState<string | null>(null);

  const filters = ["All", "Pending", "In Progress", "Resolved"];

  useEffect(() => {
    // Listen to all complaints in realtime
    const unsubscribe = listenAllComplaints((data) => {
      setComplaints(data);
      const currentIds = data.map(c => c.id).filter((id): id is string => typeof id === 'string');
      // Detect new complaint
      if (prevComplaintIdsRef.current.length > 0 && currentIds.length > prevComplaintIdsRef.current.length) {
        // Find new complaint(s)
        const newIds = currentIds.filter(id => !prevComplaintIdsRef.current.includes(id));
        if (newIds.length > 0) {
          const newComplaint = data.find(c => c.id === newIds[0]);
          if (newComplaint) {
            setNewComplaintNotif(`New complaint received: ${newComplaint.title}`);
            // Add admin notification in DB with complaintId
            import("../services/adminNotificationService").then(({ addAdminNotification }) => {
              addAdminNotification({
                type: "new",
                title: "New Complaint Received",
                message: `Complaint: ${newComplaint.title}`,
                time: Date.now(),
                read: false,
                complaintId: newComplaint.id,
              });
            });
          }
        }
      }
      prevComplaintIdsRef.current = currentIds;
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const filteredComplaints =
    selectedFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === selectedFilter);

  const handleComplaintPress = (complaint: Complaint) => {
    router.push({
      pathname: "/dev/Adiba/screens/ComplaintDetails",
      params: {
        id: complaint.id,
        title: complaint.title,
        category: complaint.category,
        status: complaint.status,
        createdAt: complaint.createdAt,
        image: complaint.imageUrl,
        studentName: complaint.createdBy,
        // Add more fields if needed
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(40, insets.bottom + 12) }} edges={["top", "left", "right", "bottom"]}>
    <>
      {/* Toast for new complaint notification */}
      {newComplaintNotif && (
        <View style={{position: 'absolute', top: 60, left: 0, right: 0, zIndex: 999, alignItems: 'center'}}>
          <View style={{backgroundColor: colors.roseTaupe, padding: 12, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4}}>
            <Text style={{color: colors.white, fontWeight: '700'}}>{newComplaintNotif}</Text>
          </View>
        </View>
      )}
      {/* Filter Bar */}
      <View style={styles.filterSection}>
        <FilterBar
          filters={filters}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
      </View>

      {/* Complaints List */}
      <View style={styles.complaintsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === "All" ? "All Complaints" : `${selectedFilter} Complaints`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {filteredComplaints.map((item) => (
          <ComplaintCard
            key={item.id}
            title={item.title}
            category={item.category}
            status={item.status}
            createdAt={item.createdAt}
            onPress={() => handleComplaintPress(item)}
          />
        ))}

        {filteredComplaints.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No complaints found</Text>
            <Text style={styles.emptySubtitle}>
              There are no {selectedFilter.toLowerCase()} complaints at this time.
            </Text>
          </View>
        )}
      </View>
    </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 16,
  },
  complaintsSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});