import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'new' | 'status' | 'resolved';
  read: boolean;
}

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Complaint Received",
      message: "A new maintenance request has been submitted for Room 204",
      time: "5 minutes ago",
      type: "new",
      read: false,
    },
    {
      id: "2",
      title: "Complaint Resolved",
      message: "Wi-Fi issue in Building A has been successfully resolved",
      time: "2 hours ago",
      type: "resolved",
      read: false,
    },
    {
      id: "3",
      title: "Status Updated",
      message: "Leaky tap complaint is now in progress",
      time: "1 day ago",
      type: "status",
      read: true,
    },
    {
      id: "4",
      title: "New Complaint Received",
      message: "Street light issue reported near main entrance",
      time: "2 days ago",
      type: "new",
      read: true,
    },
    {
      id: "5",
      title: "Complaint Resolved",
      message: "Noise complaint from dormitory has been resolved",
      time: "3 days ago",
      type: "resolved",
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new': return '🔔';
      case 'resolved': return '✅';
      case 'status': return '🔄';
      default: return '📢';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
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
          style={[
            styles.notificationCard,
            !notification.read && styles.unreadCard
          ]}
          onPress={() => markAsRead(notification.id)}
          activeOpacity={0.8}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </Text>
              <View style={styles.notificationInfo}>
                <Text style={[
                  styles.notificationTitle,
                  !notification.read && styles.unreadTitle
                ]}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={styles.unreadBadge} />}
            </View>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(notification.id)}
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