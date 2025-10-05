import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

interface ProfileSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  autoAssign: boolean;
}

export default function ProfileTab() {
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    autoAssign: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState(profileSettings);

  const adminInfo = {
    name: "Admin User",
    email: "admin@university.edu",
    role: "System Administrator",
    department: "IT Support",
    joinDate: "January 2023",
    totalResolved: 247,
    averageTime: "2.5 hours",
    rating: 4.8,
  };

  const handleSettingChange = (key: keyof ProfileSettings, value: boolean) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    setProfileSettings(tempSettings);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setTempSettings(profileSettings);
    setIsEditing(false);
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange 
  }: {
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E3E0E0', true: colors.roseTaupe }}
        thumbColor={value ? colors.white : '#f4f3f4'}
        disabled={!isEditing}
      />
    </View>
  );

  return (
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

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminInfo.totalResolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminInfo.averageTime}</Text>
            <Text style={styles.statLabel}>Avg Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminInfo.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingsHeader}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity
            style={[
              styles.editButton,
              isEditing && styles.editButtonActive
            ]}
            onPress={() => isEditing ? saveSettings() : setIsEditing(true)}
          >
            <Text style={[
              styles.editButtonText,
              isEditing && styles.editButtonTextActive
            ]}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <SettingRow
            title="Email Notifications"
            subtitle="Receive complaint updates via email"
            value={tempSettings.emailNotifications}
            onValueChange={(value) => handleSettingChange('emailNotifications', value)}
          />
          
          <SettingRow
            title="Push Notifications"
            subtitle="Get instant notifications on your device"
            value={tempSettings.pushNotifications}
            onValueChange={(value) => handleSettingChange('pushNotifications', value)}
          />
          
          <SettingRow
            title="Dark Mode"
            subtitle="Switch to dark theme interface"
            value={tempSettings.darkMode}
            onValueChange={(value) => handleSettingChange('darkMode', value)}
          />
          
          <SettingRow
            title="Auto Assignment"
            subtitle="Automatically assign new complaints"
            value={tempSettings.autoAssign}
            onValueChange={(value) => handleSettingChange('autoAssign', value)}
          />
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEditing}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsList}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View Reports</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>Contact Support</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Backup Data</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionText}>Sign Out</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.roseTaupe,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonActive: {
    backgroundColor: colors.roseTaupe,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  editButtonTextActive: {
    color: colors.white,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtons: {
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionsContainer: {
    marginBottom: 24,
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
});