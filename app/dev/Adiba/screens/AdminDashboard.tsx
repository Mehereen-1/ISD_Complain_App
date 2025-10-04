import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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



export default function AdminDashboard() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [complaints, setComplaints] = useState(mockComplaints);
  const [activeTab, setActiveTab] = useState("Complaints");

  const filters = ["All", "Pending", "In Progress", "Resolved"];
  const navItems = [
    { name: "Complaints", icon: "📋" },
    { name: "Notifications", icon: "🔔" },
    { name: "Profile", icon: "👤" }
  ];

  // Check for status updates
  useEffect(() => {
    const checkForUpdates = () => {
      // Check if there are any status updates in localStorage
      const updatedStatuses = localStorage.getItem('complaintStatusUpdates');
      if (updatedStatuses) {
        const updates = JSON.parse(updatedStatuses);
        setComplaints(prev => prev.map(complaint => {
          const update = updates[complaint.id];
          return update ? { ...complaint, status: update.status } : complaint;
        }));
        // Clear the updates after applying them
        localStorage.removeItem('complaintStatusUpdates');
      }

      // Check for deleted complaints
      const deletedComplaints = localStorage.getItem('deletedComplaints');
      if (deletedComplaints) {
        const deletedIds = JSON.parse(deletedComplaints);
        setComplaints(prev => prev.filter(complaint => !deletedIds.includes(complaint.id)));
        // Clear the deleted list after applying
        localStorage.removeItem('deletedComplaints');
      }
    };

    // Check on component mount
    checkForUpdates();

    // Set up interval to check periodically
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

  const renderComplaints = () => (
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

  const renderNotifications = () => (
    <View style={styles.contentContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text style={styles.sectionSubtitle}>Stay updated with latest alerts</Text>
      </View>
      
      <View style={styles.notificationCard}>
        <Text style={styles.notificationIcon}>🔔</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>New Complaint Received</Text>
          <Text style={styles.notificationText}>A new maintenance request has been submitted</Text>
          <Text style={styles.notificationTime}>5 minutes ago</Text>
        </View>
      </View>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationIcon}>✅</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>Complaint Resolved</Text>
          <Text style={styles.notificationText}>Wi-Fi issue in Building A has been resolved</Text>
          <Text style={styles.notificationTime}>2 hours ago</Text>
        </View>
      </View>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationIcon}>🔄</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>Status Updated</Text>
          <Text style={styles.notificationText}>Leaky tap complaint is now in progress</Text>
          <Text style={styles.notificationTime}>1 day ago</Text>
        </View>
      </View>
    </View>
  );

  const renderProfile = () => (
    <View style={styles.contentContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Admin Profile</Text>
        <Text style={styles.sectionSubtitle}>Manage your account settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageLarge}>
            <Text style={styles.profileInitialLarge}>A</Text>
          </View>
        </View>
        
        <Text style={styles.profileName}>Admin User</Text>
        <Text style={styles.profileEmail}>admin@university.edu</Text>
        <Text style={styles.profileRole}>System Administrator</Text>
      </View>

      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionIcon}>⚙️</Text>
          <Text style={styles.profileOptionText}>Settings</Text>
          <Text style={styles.profileOptionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionIcon}>📊</Text>
          <Text style={styles.profileOptionText}>Statistics</Text>
          <Text style={styles.profileOptionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionIcon}>🔐</Text>
          <Text style={styles.profileOptionText}>Change Password</Text>
          <Text style={styles.profileOptionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionIcon}>🚪</Text>
          <Text style={styles.profileOptionText}>Logout</Text>
          <Text style={styles.profileOptionArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Complaints":
        return renderComplaints();
      case "Notifications":
        return renderNotifications();
      case "Profile":
        return renderProfile();
      default:
        return renderComplaints();
    }
  };



  return (
    <View style={styles.container}>
      {/* Navigation Bar with Title and Tabs */}
      <View style={styles.navbar}>
        {/* Admin Dashboard Title on Left */}
        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>Admin Dashboard</Text>
        </View>
        
        {/* Navigation Tabs on Right */}
        <View style={styles.navTabsContainer}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.navItem,
                activeTab === item.name && styles.navItemActive
              ]}
              onPress={() => setActiveTab(item.name)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.navIcon,
                activeTab === item.name && styles.navIconActive
              ]}>
                {item.icon}
              </Text>
              <Text style={[
                styles.navText,
                activeTab === item.name && styles.navTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.platinum2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
    height: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.rosyBrown,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  navItemsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTitleContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  navTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    minWidth: 60,
  },
  navItemActive: {
    backgroundColor: colors.rosyBrown,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 20,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  navTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
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
  // Notification Styles
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.roseTaupe,
    fontWeight: '500',
  },
  // Profile Styles
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.rosyBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialLarge: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: colors.roseTaupe,
    fontWeight: '600',
  },
  profileOptions: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  profileOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  profileOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  profileOptionArrow: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});