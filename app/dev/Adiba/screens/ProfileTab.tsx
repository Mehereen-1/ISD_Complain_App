import * as authService from "@/app/dev/Ayesha/services/authService";
import { router } from 'expo-router';
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../constants/colors";

export default function ProfileTab() {
  const adminEmail = "admin@university.edu";
  const adminPass = "admin101";

  const adminInfo = {
    name: "Admin User",
    email: adminEmail,
    role: "System Administrator",
    department: "IT Support",
    joinDate: "January 2023",
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const insets = useSafeAreaInsets();



  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await authService.logout();
      router.push('/dev/Ayesha/auth/signIn');
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: Math.max(40, insets.bottom + 12) }]} edges={["top","left","right","bottom"]}>
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {adminInfo.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{adminInfo.name}</Text>
          <Text style={styles.profileEmail}>{adminInfo.email}</Text>
          <Text style={styles.profileRole}>{adminInfo.role} • {adminInfo.department}</Text>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.actionsList}>
          <TouchableOpacity style={[styles.actionItem, {borderBottomWidth: 0}]} onPress={handleLogout}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionText}>Logout</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setShowLogoutModal(false)}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🚪 Logout</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowLogoutModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalLogoutButton}
              onPress={confirmLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.modalLogoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.roseTaupe,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.roseTaupe,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  actionsList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  actionArrow: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    backgroundColor: colors.rosyBrown,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
  },
  modalText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.platinum,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalLogoutButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.roseTaupe,
  },
  modalLogoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
// ...existing code...
});