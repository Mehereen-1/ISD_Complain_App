import { get, ref } from "firebase/database";
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../../lib/firebaseConfig.js'; // Adjust if needed
import { Complaint, listenAllComplaints, StudentProfile } from '../Ayesha/services/dbService';
import { colors } from './colors';

const STATUS_OPTIONS = ['All', 'Pending', 'In Progress', 'Solved'];

export default function ComplaintsFeed() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [studentProfiles, setStudentProfiles] = useState<{ [uid: string]: StudentProfile }>({});

  useEffect(() => {
    const unsubscribe = listenAllComplaints((data) => {
      const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
      setComplaints(sortedData);
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch all student profiles once
    const fetchProfiles = async () => {
      const snapshot = await get(ref(db, "students"));
      if (snapshot.exists()) {
        setStudentProfiles(snapshot.val());
      }
    };
    fetchProfiles();
  }, []);

  const onRefresh = () => setRefreshing(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return colors.danger;
      case 'In Progress': return colors.warning;
      case 'Solved': return colors.success;
      default: return colors.primaryLight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'In Progress': return '🔄';
      case 'Solved': return '✅';
      default: return '📋';
    }
  };

  const filteredComplaints = selectedStatus === 'All'
    ? complaints
    : complaints.filter(c => c.status === selectedStatus);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📰 All Complaints Feed</Text>
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
          filteredComplaints.map((complaint) => {
            const student = studentProfiles[complaint.createdBy];
            return (
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
                  <View>
                    <Text style={styles.createdBy}>
                      👤 {student ? student.name : complaint.createdBy}
                    </Text>
                    {student && (
                      <>
                        <Text style={styles.studentInfo}>Roll: {student.roll}</Text>
                        <Text style={styles.studentInfo}>Dept: {student.department}</Text>
                        <Text style={styles.studentInfo}>Batch: {student.batch}</Text>
                        <Text style={styles.studentInfo}>Hall: {student.hall}</Text>
                      </>
                    )}
                  </View>
                  <Text style={styles.createdAt}>
                    📅 {new Date(complaint.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })
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
  studentInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});