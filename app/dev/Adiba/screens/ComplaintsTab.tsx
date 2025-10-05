import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/FilterBar";
import { colors } from "../constants/colors";

const mockComplaints = [
  {
    id: "1",
    title: "Leaky tap in Room 204",
    category: "Maintenance",
    status: "Pending",
    createdAt: "1 day ago",
    timestamp: "2025-10-03T08:30:00Z",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    student: {
      name: "John Doe",
      id: "STU001",
      email: "john.doe@university.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    }
  },
  {
    id: "2",
    title: "Noise complaint from neighbors",
    category: "Community",
    status: "Resolved",
    createdAt: "3 days ago",
    timestamp: "2025-10-01T14:20:00Z",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
    student: {
      name: "Jane Smith",
      id: "STU002",
      email: "jane.smith@university.edu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
    }
  },
  {
    id: "3",
    title: "Street light broken near entrance",
    category: "Infrastructure",
    status: "In Progress",
    createdAt: "1 day ago",
    timestamp: "2025-10-03T05:15:00Z",
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400",
    student: {
      name: "Mike Johnson",
      id: "STU003",
      email: "mike.johnson@university.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    }
  },
  {
    id: "4",
    title: "Wi-Fi connectivity issues",
    category: "Technical",
    status: "Pending",
    createdAt: "3 days ago",
    timestamp: "2025-10-01T03:45:00Z",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
    student: {
      name: "Sarah Wilson",
      id: "STU004",
      email: "sarah.wilson@university.edu",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
    }
  },
];

export default function ComplaintsTab() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [complaints, setComplaints] = useState(mockComplaints);

  const filters = ["All", "Pending", "In Progress", "Resolved"];

  // Check for status updates
  useEffect(() => {
    const checkForUpdates = () => {
      const updatedStatuses = localStorage.getItem('complaintStatusUpdates');
      if (updatedStatuses) {
        const updates = JSON.parse(updatedStatuses);
        setComplaints(prev => prev.map(complaint => {
          const update = updates[complaint.id];
          return update ? { ...complaint, status: update.status } : complaint;
        }));
        localStorage.removeItem('complaintStatusUpdates');
      }

      const deletedComplaints = localStorage.getItem('deletedComplaints');
      if (deletedComplaints) {
        const deletedIds = JSON.parse(deletedComplaints);
        setComplaints(prev => prev.filter(complaint => !deletedIds.includes(complaint.id)));
        localStorage.removeItem('deletedComplaints');
      }
    };

    checkForUpdates();
    const interval = setInterval(checkForUpdates, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredComplaints =
    selectedFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === selectedFilter);

  const handleComplaintPress = (complaint: any) => {
    router.push({
      pathname: "/dev/Adiba/screens/ComplaintDetails",
      params: {
        id: complaint.id,
        title: complaint.title,
        category: complaint.category,
        status: complaint.status,
        createdAt: complaint.createdAt,
        timestamp: complaint.timestamp,
        image: complaint.image,
        studentName: complaint.student.name,
        studentId: complaint.student.id,
        studentEmail: complaint.student.email,
        studentAvatar: complaint.student.avatar,
      },
    });
  };

  return (
    <>
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