import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Complaint, listenComplaints } from '../Ayesha/services/dbService';
import { colors } from './colors';

const STATUS_OPTIONS = ['All', 'To Do', 'In Progress', 'Done'];

export default function ComplaintsFeed() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const unsubscribe = listenComplaints((data) => {
      // Sort by most recent first
      const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
      setComplaints(sortedData);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return colors.danger;
      case 'In Progress': return colors.warning;
      case 'Done': return colors.success;
      default: return colors.primaryLight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'To Do': return '⏳';
      case 'In Progress': return '🔄';
      case 'Done': return '✅';
      default: return '📋';
    }
  };

  // Filter complaints based on selected status
  const filteredComplaints = selectedStatus === 'All'
    ? complaints
    : complaints.filter(c => c.status === selectedStatus);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📰 All Complaints Feed</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              selectedStatus === status && styles.activeFilterButton
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedStatus === status && styles.activeFilterButtonText
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView 
        style={styles.feedContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredComplaints.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No complaints yet</Text>
            <Text style={styles.emptySubText}>Be the first to submit one!</Text>
          </View>
        ) : (
          filteredComplaints.map((complaint) => (
            <View key={complaint.id} style={styles.complaintCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.complaintTitle}>{complaint.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusIcon(complaint.status)} {complaint.status}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.complaintDescription}>{complaint.description}</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.createdBy}>👤 {complaint.createdBy}</Text>
                <Text style={styles.createdAt}>
                  📅 {new Date(complaint.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 2,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: colors.textLight,
  },
  feedContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  complaintCard: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  complaintDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdBy: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  createdAt: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});