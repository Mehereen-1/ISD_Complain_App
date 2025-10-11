import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../../../lib/firebaseConfig.js';
import {
  Complaint,
  deleteComplaintByUser,
  listenUserComplaints,
  updateComplaint
} from '../Ayesha/services/dbService';
import { pickAndUploadImage } from '../Ayesha/services/uploadImageToCloudinary';
import { colors } from './colors';

export default function MyComplaints() {
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUserUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUserUid) return; // Don't listen if not logged in
    console.log('Setting up listener for user:', currentUserUid);
    const unsubscribe = listenUserComplaints(currentUserUid, (data) => {
      console.log('MyComplaints: received updated data, count =', data.length);
      const userComplaints = data.sort((a, b) => b.createdAt - a.createdAt);
      setMyComplaints(userComplaints);
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, [currentUserUid]);

  const onRefresh = () => setRefreshing(true);

  const handleDelete = async (complaint: Complaint) => {
    console.log('🏁 handleDelete called with:', {
      currentUserUid,
      complaintId: complaint.id,
      complaintTitle: complaint.title,
      complaintCreatedBy: complaint.createdBy
    });

    if (!currentUserUid) {
      console.log('❌ No current user - user must be logged in');
      Alert.alert('Error', 'You must be logged in to delete complaints.');
      return;
    }
    
    if (!complaint.id) {
      console.log('❌ No complaint ID found');
      Alert.alert('Error', 'Invalid complaint ID.');
      return;
    }

    // Additional authorization check at the UI level
    if (complaint.createdBy !== currentUserUid) {
      console.log('❌ Unauthorized - user does not own this complaint');
      Alert.alert('Error', 'You can only delete your own complaints.');
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
              console.log('🚀 MyComplaints: Starting delete process');
              console.log('👤 Current user:', currentUserUid);
              console.log('📝 Complaint ID:', complaint.id);
              console.log('📋 Complaint title:', complaint.title);
              console.log('🏗️ Complaint createdBy:', complaint.createdBy);
              
              await deleteComplaintByUser(currentUserUid, complaint.id!, complaint);
              
              console.log('✅ MyComplaints: Delete completed successfully');
              // Don't show success alert - user will see the complaint disappear from the list
            } catch (error) {
              console.error('❌ MyComplaints: Delete error:', error);
              Alert.alert('Error', `Failed to delete: ${(error as Error).message}`);
            }
          },
        },
      ]
    );
  };

  // --- EDIT FEATURE ---
  const startEdit = (complaint: Complaint) => {
    setEditingId(complaint.id!);
    setEditTitle(complaint.title);
    setEditDescription(complaint.description);
    setEditImageUrl(complaint.imageUrl || null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditImageUrl(null);
    setIsUploadingImage(false);
  };

  const handleImagePick = async () => {
    try {
      setIsUploadingImage(true);
      const imageUrl = await pickAndUploadImage();
      if (imageUrl) {
        setEditImageUrl(imageUrl);
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setEditImageUrl(null)
        }
      ]
    );
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
        imageUrl: editImageUrl || undefined, // Use undefined instead of null for Firebase
      });
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
      setEditImageUrl(null);
      setIsUploadingImage(false);
      Alert.alert('Success', 'Complaint updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update complaint');
    }
  };

  // Only use the three allowed statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return colors.danger;         // red
      case 'In Progress': return colors.warning;    // yellow/orange
      case 'Solved': return colors.success;         // green
      default: return colors.background;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Pending': return colors.white;
      case 'In Progress': return colors.textPrimary;
      case 'Solved': return colors.white;
      default: return colors.textPrimary;
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: myComplaints.length,
      pending: myComplaints.filter(c => c.status === 'Pending').length,
      inProgress: myComplaints.filter(c => c.status === 'In Progress').length,
      solved: myComplaints.filter(c => c.status === 'Resolved').length,
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
                        onPress={() => handleDelete(complaint)}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
              {editingId === complaint.id ? (
                <>
                  <TextInput
                    style={[styles.editInput, { height: 80 }]}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    placeholder="Description"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                  
                  {/* Image editing section */}
                  <View style={styles.imageEditSection}>
                    <Text style={styles.imageEditLabel}>Image:</Text>
                    
                    {editImageUrl ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: editImageUrl }} style={styles.imagePreview} />
                        <View style={styles.imageActions}>
                          <TouchableOpacity 
                            style={styles.imageActionButton}
                            onPress={handleImagePick}
                            disabled={isUploadingImage}
                          >
                            <Text style={styles.imageActionText}>
                              {isUploadingImage ? '⏳' : '🔄'} Replace
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.imageActionButton, styles.removeButton]}
                            onPress={removeImage}
                          >
                            <Text style={styles.imageActionText}>🗑️ Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addImageButton}
                        onPress={handleImagePick}
                        disabled={isUploadingImage}
                      >
                        <Text style={styles.addImageText}>
                          {isUploadingImage ? '⏳ Uploading...' : '📷 Add Image'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.complaintDescription}>{complaint.description}</Text>
                  
                  {/* Display image if available */}
                  {complaint.imageUrl && (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: complaint.imageUrl }} style={styles.complaintImage} />
                    </View>
                  )}
                </>
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
                  <Text style={[
                    styles.statusButtonText,
                    { color: getStatusTextColor(complaint.status) }
                  ]}>
                    {complaint.status}
                  </Text>
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
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    marginLeft: 8,
    // Add a border for better visibility
    borderWidth: 1,
    borderColor: colors.textSecondary,
    // Optionally add shadow for elevation
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  statusButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  imageContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  complaintImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  // Image editing styles
  imageEditSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  imageEditLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  imageActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  removeButton: {
    backgroundColor: colors.danger,
  },
  imageActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addImageButton: {
    padding: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addImageText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});