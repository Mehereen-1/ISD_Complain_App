import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import {
  AdminNotification,
  deleteAdminNotification,
  listenAdminNotifications,
  markAdminNotificationRead
} from "../services/adminNotificationService";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: number;
  type: 'new' | 'status' | 'resolved';
  read: boolean;
}

interface NotificationsTabProps {
  setUnreadCount?: (count: number) => void;
}

export default function NotificationsTab({ setUnreadCount }: NotificationsTabProps) {
  const router = require('expo-router').useRouter();
  const insets = useSafeAreaInsets();
  // Helper to extract complaint ID from notification
  function getComplaintId(notification: AdminNotification): string | null {
    // If notification has complaintId field, use it
    if ((notification as any).complaintId) return (notification as any).complaintId;
    // Otherwise, try to extract from message (legacy)
    const match = notification.message.match(/ID: ([^\s)]+)/);
    return match ? match[1] : null;
  }
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  React.useEffect(() => {
    const unsubscribe = listenAdminNotifications((data) => {
      // Show all notifications, sorted by time (newest first)
      const sorted = data.sort((a, b) => b.time - a.time);
      setNotifications(sorted);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new': return '🔔';
      case 'resolved': return '✅';
      case 'status': return '🔄';
      default: return '📢';
    }
  };

  const markAsRead = (id: string) => {
    markAdminNotificationRead(id);
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markAdminNotificationRead(n.id!);
    });
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
  deleteAdminNotification(id);
  setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  // Update unread count in parent if prop provided
  React.useEffect(() => {
    if (setUnreadCount) setUnreadCount(unreadCount);
  }, [unreadCount, setUnreadCount]);

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: Math.max(40, insets.bottom + 12) }]} edges={["top", "left", "right", "bottom"]}>
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.sectionSubtitle}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={[styles.notificationCard, !notification.read && styles.unreadCard]}
          onPress={() => {
            markAsRead(notification.id!);
            const complaintId = getComplaintId(notification);
            if (complaintId) {
              router.push({
                pathname: "/dev/Adiba/screens/ComplaintDetails",
                params: { id: complaintId },
              });
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </Text>
              <View style={styles.notificationInfo}>
                <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationTime}>{new Date(notification.time).toLocaleString()}</Text>
              </View>
              {!notification.read && <View style={styles.unreadBadge} />}
            </View>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(notification.id!)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      {notifications.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>
            You're all caught up! New notifications will appear here.
          </Text>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
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
  markAllButton: {
    backgroundColor: colors.roseTaupe,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.roseTaupe,
    backgroundColor: '#fafafa',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 12,
    color: colors.roseTaupe,
    fontWeight: '500',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.roseTaupe,
    marginLeft: 8,
  },
  notificationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginLeft: 32,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
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