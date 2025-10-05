import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Complaint,
  deleteUserComplaint,
  listenUserComplaints,
  updateComplaint // for editing title/desc
} from '../Ayesha/services/dbService';
import { colors } from './colors';

// Replace with actual user UID from auth
const currentUserUid = 'student-uid';

export default function MyComplaints() {
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const unsubscribe = listenUserComplaints(currentUserUid, (data) => {
      const userComplaints = data.sort((a, b) => b.createdAt - a.createdAt);
      setMyComplaints(userComplaints);
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, []);

  const onRefresh = () => setRefreshing(true);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Complaint',
      'Are you sure you want to delete this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserComplaint(currentUserUid, id);
              Alert.alert('Success', 'Complaint deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete complaint');
            }
          }
        }
      ]
    );
  };

  // --- EDIT FEATURE ---
  const startEdit = (complaint: Complaint) => {
    setEditingId(complaint.id!);
    setEditTitle(complaint.title);
    setEditDescription(complaint.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim() || !editDescription.trim()) {
      Alert.alert('Error', 'Title and description cannot be empty');
      return;
    }
    try {
      await updateComplaint(id, {
        title: editTitle,
        description: editDescription,
      });
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
      Alert.alert('Success', 'Complaint updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update complaint');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return colors.danger;
      case 'In Progress': return colors.warning;
      case 'Solved': return colors.success;
      default: return colors.background;
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: myComplaints.length,
      pending: myComplaints.filter(c => c.status === 'Pending').length,
      inProgress: myComplaints.filter(c => c.status === 'In Progress').length,
      solved: myComplaints.filter(c => c.status === 'Solved').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 My Complaints</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.dangerLight }]}>
          <Text style={[styles.statNumber, { color: colors.danger }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{stats.solved}</Text>
          <Text style={styles.statLabel}>Solved</Text>
        </View>
      </View>
      <ScrollView
        style={styles.complaintsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {myComplaints.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No complaints yet</Text>
            <Text style={styles.emptySubText}>Submit your first complaint!</Text>
          </View>
        ) : (
          myComplaints.map((complaint) => (
            <View key={complaint.id} style={styles.complaintCard}>
              <View style={styles.cardHeader}>
                {editingId === complaint.id ? (
                  <>
                    <TextInput
                      style={styles.editInput}
                      value={editTitle}
                      onChangeText={setEditTitle}
                      placeholder="Title"
                      placeholderTextColor={colors.textSecondary}
                    />
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity onPress={() => saveEdit(complaint.id!)} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>💾</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>✖️</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.complaintTitle}>{complaint.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => startEdit(complaint)}
                      >
                        <Text style={styles.editButtonText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(complaint.id!)}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
              {editingId === complaint.id ? (
                <TextInput
                  style={[styles.editInput, { height: 80 }]}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              ) : (
                <Text style={styles.complaintDescription}>{complaint.description}</Text>
              )}
              <Text style={styles.createdAt}>
                📅 {new Date(complaint.createdAt).toLocaleDateString()}
              </Text>
              {/* Status badge (read-only for students) */}
              <View style={styles.statusSection}>
                <Text style={styles.statusLabel}>Status:</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(complaint.status) }
                ]}>
                  <Text style={styles.statusButtonText}>{complaint.status}</Text>
                </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  complaintsContainer: {
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
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: colors.textPrimary,
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundLight,
    marginBottom: 6,
    flex: 1,
  },
  saveButton: {
    padding: 8,
    backgroundColor: colors.success,
    borderRadius: 6,
    marginRight: 4,
  },
  saveButtonText: {
    fontSize: 18,
    color: colors.textLight,
  },
  cancelButton: {
    padding: 8,
    backgroundColor: colors.danger,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 18,
    color: colors.textLight,
  },
  complaintDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  createdAt: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    color: colors.textPrimary,
  },
  statusButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    opacity: 0.7,
  },
  activeStatus: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  statusButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
});