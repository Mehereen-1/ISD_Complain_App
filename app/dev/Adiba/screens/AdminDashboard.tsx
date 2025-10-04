import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import ComplaintsTab from "./ComplaintsTab";
import NotificationsTab from "./NotificationsTab";
import ProfileTab from "./ProfileTab";





export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("complaints");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Complaint Received",
      message: "A new maintenance request has been submitted",
      time: "5 minutes ago",
      isRead: false,
      type: "new"
    },
    {
      id: "2", 
      title: "Complaint Resolved",
      message: "Wi-Fi issue in Building A has been resolved",
      time: "2 hours ago",
      isRead: false,
      type: "resolved"
    },
    {
      id: "3",
      title: "Status Updated", 
      message: "Leaky tap complaint is now in progress",
      time: "1 day ago",
      isRead: false,
      type: "updated"
    }
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const navItems = [
    { name: "complaints", icon: "📋", label: "Complaints" },
    { name: "notifications", icon: "🔔", label: "Notifications" },
    { name: "profile", icon: "👤", label: "Profile" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "complaints":
        return <ComplaintsTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <ComplaintsTab />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationPress = () => {
    if (activeTab === "notifications") {
      setShowNotificationDropdown(!showNotificationDropdown);
    } else {
      setActiveTab("notifications");
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setShowNotificationDropdown(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
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
              onPress={item.name === "notifications" ? handleNotificationPress : () => setActiveTab(item.name)}
              activeOpacity={0.8}
            >
              <View style={styles.navIconContainer}>
                <Text style={[
                  styles.navIcon,
                  activeTab === item.name && styles.navIconActive
                ]}>
                  {item.icon}
                </Text>
                {item.name === "notifications" && unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.navText,
                activeTab === item.name && styles.navTextActive
              ]}>
                {item.label}
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



  navIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

});