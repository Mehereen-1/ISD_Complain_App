import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "./dev/Adiba/constants/colors";

export default function ComplaintDetails() {
  const router = useRouter();
  const {
    id,
    title,
    category,
    status: initialStatus,
    createdAt,
    timestamp,
    image,
    studentName,
    studentId,
    studentEmail,
    studentAvatar
  } = useLocalSearchParams();

  const [currentStatus, setCurrentStatus] = useState(initialStatus as string);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return colors.white;
      case "In Progress": return colors.white;
      case "Pending": return colors.white;
      default: return colors.white;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "Resolved": return colors.success;
      case "In Progress": return colors.mountbattenPink;
      case "Pending": return colors.roseTaupe;
      default: return colors.roseTaupe;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending": return "In Progress";
      case "In Progress": return "Resolved";
      case "Resolved": return "Resolved";
      default: return "Pending";
    }
  };

  const handleStatusChange = () => {
    const nextStatus = getNextStatus(currentStatus);
    
    if (nextStatus === currentStatus) {
      return; // Already resolved, do nothing
    }

    setPendingStatusChange(nextStatus);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    setCurrentStatus(pendingStatusChange);
    setHasUnsavedChanges(true);
    setShowStatusModal(false);
  };

  const handleSaveChanges = () => {
    // Save the status update to localStorage so admin dashboard can pick it up
    const existingUpdates = localStorage.getItem('complaintStatusUpdates');
    const updates = existingUpdates ? JSON.parse(existingUpdates) : {};
    updates[id as string] = { status: currentStatus };
    localStorage.setItem('complaintStatusUpdates', JSON.stringify(updates));
    
    setHasUnsavedChanges(false);
    
    // Navigate back to dashboard with updated status
    router.back();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    
    // Save the deleted complaint ID to localStorage so admin dashboard can remove it
    const existingDeleted = localStorage.getItem('deletedComplaints');
    const deletedIds = existingDeleted ? JSON.parse(existingDeleted) : [];
    deletedIds.push(id as string);
    localStorage.setItem('deletedComplaints', JSON.stringify(deletedIds));
    
    // Navigate back to dashboard immediately
    router.back();
  };

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <Text style={styles.headerSubtitle}>ID: #{id}</Text>
      </View>

      <View style={styles.content}>
        {/* Student Profile Section */}
        <View style={styles.studentCard}>
          <View style={styles.studentHeader}>
            <Image source={{ uri: studentAvatar as string }} style={styles.studentAvatar} />
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{studentName}</Text>
              <Text style={styles.studentId}>ID: {studentId}</Text>
              <Text style={styles.studentEmail}>{studentEmail}</Text>
            </View>
          </View>
        </View>

        {/* Main Complaint Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          {/* Complaint Image */}
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image as string }} style={styles.complaintImage} />
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(currentStatus) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(currentStatus) }]}>
                {currentStatus}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>{createdAt}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.primaryButton]} 
              onPress={handleStatusChange}
              activeOpacity={0.7}
              disabled={currentStatus === "Resolved"}
            >
              <Text style={styles.buttonText}>
                {currentStatus === "Resolved" ? "Already Resolved" : `Mark as ${getNextStatus(currentStatus)}`}
              </Text>
            </TouchableOpacity>

            {hasUnsavedChanges && (
              <TouchableOpacity 
                style={[styles.saveButton]}
                onPress={handleSaveChanges}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>💾 Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.secondaryButton, {marginBottom: 16}]}
            activeOpacity={0.7}
            onPress={() => {/* Add Comment functionality - to be implemented */}}
          >
            <Text style={styles.secondaryButtonText}>Add Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.deleteButton, {alignSelf: 'center'}]} 
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete Complaint</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

    {/* Status Change Confirmation Modal */}
    {showStatusModal && (
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setShowStatusModal(false)}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Status</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Change status from "{currentStatus}" to "{pendingStatusChange}"?
            </Text>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowStatusModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmButton}
              onPress={confirmStatusChange}
              activeOpacity={0.8}
            >
              <Text style={styles.modalConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setShowDeleteModal(false)}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🗑️ Delete Complaint</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this complaint? This action cannot be undone.
            </Text>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowDeleteModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalDeleteButton}
              onPress={confirmDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.platinum2,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  studentCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.platinum,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.rosyBrown,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.rosyBrown,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 24,
    lineHeight: 32,
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  complaintImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mountbattenPink,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.platinum2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: 15,
    color: colors.white,
    lineHeight: 22,
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.roseTaupe,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.roseTaupe,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.mountbattenPink,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.mountbattenPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  deleteContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
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
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.roseTaupe,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});