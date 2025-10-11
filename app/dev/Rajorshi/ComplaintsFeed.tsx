import { useRouter } from 'expo-router';
import { get, ref } from "firebase/database";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../../lib/firebaseConfig.js'; // Adjust if needed
import { Complaint, deleteComplaintByUser, listenAllComplaints, StudentProfile } from '../Ayesha/services/dbService';
import { colors } from './colors';

const STATUS_OPTIONS = ['All', 'Pending', 'In Progress', 'Resolved'];

export default function ComplaintsFeed() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [studentProfiles, setStudentProfiles] = useState<{ [uid: string]: StudentProfile }>({});
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUserUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('ComplaintsFeed: Setting up listener for all complaints');
    const unsubscribe = listenAllComplaints((data) => {
      console.log('ComplaintsFeed: received updated data, count =', data.length);
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

  const handleDelete = async (complaint: Complaint) => {
    if (!currentUserUid) {
      Alert.alert('Error', 'You must be logged in to delete complaints.');
      return;
    }
    
    if (!complaint.id) {
      Alert.alert('Error', 'Invalid complaint ID.');
      return;
    }
    
    Alert.alert(
      'Delete Complaint', 
      'Are you sure you want to delete this complaint?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚀 ComplaintsFeed: Starting delete process');
              console.log('👤 Current user:', currentUserUid);
              console.log('📝 Complaint ID:', complaint.id);
              console.log('🏗️ Complaint createdBy:', complaint.createdBy);
              console.log('✅ User match:', currentUserUid === complaint.createdBy);
              
              await deleteComplaintByUser(currentUserUid, complaint.id!, complaint);
              
              console.log('✅ ComplaintsFeed: Delete completed successfully');
              Alert.alert('Success', 'Complaint deleted successfully.');
            } catch (error) {
              console.error('❌ ComplaintsFeed: Delete error:', error);
              Alert.alert('Error', `Failed to delete: ${(error as Error).message}`);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return colors.danger;
      case 'In Progress': return colors.warning;
      case 'Resolved': return colors.success;
      case 'Solved': return colors.success;
      default: return colors.primaryLight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'In Progress': return '🔄';
      case 'Resolved': return '✅';
      case 'Solved': return '✅';
      default: return '📋';
    }
  };

  const filteredComplaints = selectedStatus === 'All'
    ? complaints
    : complaints.filter(c => c.status === selectedStatus);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
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
                  <View style={styles.headerRight}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                      <Text style={styles.statusText}>
                        {getStatusIcon(complaint.status)} {complaint.status}
                      </Text>
                    </View>
                    {currentUserUid === complaint.createdBy && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(complaint)}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Text style={styles.complaintDescription}>{complaint.description}</Text>
                
                {/* Display image if available */}
                {complaint.imageUrl && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: complaint.imageUrl }} style={styles.complaintImage} />
                  </View>
                )}
                
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
    padding: 12,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 2,
    marginVertical: 2,
    minHeight: 32,
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
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
    padding: 12,
    marginBottom: 10,
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
    marginBottom: 6,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  complaintDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.dangerLight,
  },
  deleteButtonText: {
    fontSize: 16,
    color: colors.danger,
  },
  imageContainer: {
    marginVertical: 8,
    alignItems: 'center',
  },
  complaintImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
    padding: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 40,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});