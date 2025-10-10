import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { get, ref, remove } from "firebase/database";
import React, { useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../../../lib/firebaseConfig";
import { getStudentByComplaintId, StudentProfile, updateComplaintStatus } from "../../Ayesha/services/dbService";
import { colors } from "../constants/colors";

interface Complaint {
  id?: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  imageUrl?: string;
  status: string;
  createdBy: string;
  createdAt: number;
}

export default function ComplaintDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Complaint data state
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [complaintLoading, setComplaintLoading] = useState(true);
  const [complaintError, setComplaintError] = useState("");

  // Student profile state
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [studentError, setStudentError] = useState("");

  React.useEffect(() => {
    async function fetchComplaint() {
      setComplaintLoading(true);
      setComplaintError("");
      if (!id) {
        setComplaintError("No complaint ID");
        setComplaintLoading(false);
        return;
      }
      try {
        const complaintRef = ref(db, `complaints/${id}`);
        const complaintSnap = await get(complaintRef);

        if (!complaintSnap.exists()) {
          setComplaintError("Complaint not found");
          setComplaintLoading(false);
          return;
        }

        const complaintData = complaintSnap.val();
        setComplaint({ id: id as string, ...complaintData });
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setComplaintError("Failed to load complaint");
      }
      setComplaintLoading(false);
    }

    async function fetchStudent() {
      setStudentLoading(true);
      setStudentError("");
      if (!id) {
        setStudentError("No complaint ID");
        setStudentLoading(false);
        return;
      }
      const profile = await getStudentByComplaintId(id as string);
      console.log("[ComplaintDetails] getStudentByComplaintId result:", profile);
      if (profile) {
        setStudent(profile);
      } else {
        setStudentError("No student info found for this complaint. Please check if the complaint has a valid createdBy field and the student exists.");
      }
      setStudentLoading(false);
    }

    fetchComplaint();
    fetchStudent();
  }, [id]);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState("");
  const [showStatusPickers, setShowStatusPickers] = useState(false);

  // Update currentStatus when complaint loads
  React.useEffect(() => {
    if (complaint?.status) {
      setCurrentStatus(complaint.status);
    }
  }, [complaint?.status]);

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
    setShowStatusModal(false);
    // Update status in backend
    if (id && pendingStatusChange) {
      updateComplaintStatus(id as string, pendingStatusChange as any)
        .then(() => {
          // Optionally show a success message
        })
        .catch((err) => {
          // Optionally show an error message
          console.error(err);
        });
    }
  };

  const handleSaveChanges = () => {
  // No longer needed, status is updated in backend
  router.back();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    // Instantly delete complaint in backend (no modal from dbService)
    const deleteComplaintInstantly = async (complaintId: string) => {
      try {
        const complaintRef = ref(db, `complaints/${complaintId}`);
        await remove(complaintRef);
        // Optionally show a success message here
      } catch (err) {
        // Optionally show an error message here
        console.error(err);
      }
    };
    if (id) {
      deleteComplaintInstantly(id as string).then(() => {
        router.back();
      });
    } else {
      router.back();
    }
  };

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header removed as requested */}

      <View style={styles.content}>
  {/* Complaint Details Title */}
  <Text style={styles.headerTitle}>Complaint Details</Text>
  {/* Student Profile Section - Only Avatar, Name, Roll, and Details Button */}
  <View style={styles.studentCard}>
          <View style={styles.studentHeader}>
            {/* Avatar not shown; add here if needed in future */}
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student?.name || "-"}</Text>
              <Text style={styles.studentId}>Roll: {student?.roll || "-"}</Text>
            </View>
          </View>
          <View style={styles.studentContactSection}>
            <TouchableOpacity 
              style={[styles.contactButton, styles.detailsButton, styles.fullWidthButton]}
              onPress={() => setShowStudentDetailsModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonIcon}>👤</Text>
              <Text style={[styles.contactButtonText, styles.detailsButtonText]}>Student Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Complaint Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{complaint?.title || "Loading..."}</Text>
          {/* Complaint Image */}
          {complaint?.imageUrl && (
            <TouchableOpacity style={styles.imageContainer} onPress={() => setShowImageModal(true)} activeOpacity={0.8}>
              <Image source={{ uri: complaint.imageUrl }} style={styles.complaintImage} />
            </TouchableOpacity>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{complaint?.category || "N/A"}</Text>
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
            <Text style={styles.value}>{complaint?.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Place</Text>
            <Text style={styles.value}>{complaint?.zone || "Room 204, Building A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>
              {complaint?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.makeAsButton}
              onPress={() => setShowStatusPickers(!showStatusPickers)}
              activeOpacity={0.8}
            >
              <Text style={styles.makeAsButtonText}>Make as</Text>
            </TouchableOpacity>

            {showStatusPickers && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={currentStatus}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    if (itemValue !== currentStatus) {
                      setPendingStatusChange(itemValue);
                      setShowStatusModal(true);
                      setShowStatusPickers(false);
                    }
                  }}
                >
                  <Picker.Item label="Pending" value="Pending" />
                  <Picker.Item label="In Progress" value="In Progress" />
                  <Picker.Item label="Resolved" value="Resolved" />
                </Picker>
              </View>
            )}
          </View>


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

    {/* Image Zoom Modal */}
    {showImageModal && complaint?.imageUrl && (
      <View style={styles.imageModalOverlay}>
        <TouchableOpacity 
          style={styles.imageModalBackdrop}
          onPress={() => setShowImageModal(false)}
          activeOpacity={1}
        />
        <View style={styles.imageModalContainer}>
          <TouchableOpacity 
            style={styles.closeImageButton}
            onPress={() => setShowImageModal(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.closeImageButtonText}>×</Text>
          </TouchableOpacity>
          <Image 
            source={{ uri: complaint.imageUrl }} 
            style={styles.zoomedImage}
            resizeMode="contain"
          />
        </View>
      </View>
    )}

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

    {/* Student Details Modal */}
    {showStudentDetailsModal && (
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setShowStudentDetailsModal(false)}
          activeOpacity={1}
        />
        <View style={styles.studentDetailsModal}>
          <View style={styles.studentDetailsHeader}>
            <Text style={styles.studentDetailsTitle}>👤 Student Profile</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowStudentDetailsModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.studentDetailsContent} showsVerticalScrollIndicator={false}>
            <View style={styles.studentProfileSection}>
              {/* Avatar not shown; add here if needed in future */}
              <Text style={styles.studentDetailsName}>{student?.name || "-"}</Text>
              <Text style={styles.studentDetailsRoll}>Roll: {student?.roll || "-"}</Text>
            </View>

            <View style={styles.studentInfoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📧 Email</Text>
                <Text style={styles.infoValue}>{student?.email || "-"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🎓 Department</Text>
                <Text style={styles.infoValue}>{student?.department || "-"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📅 Batch</Text>
                <Text style={styles.infoValue}>{student?.batch || "-"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🏠 Hall</Text>
                <Text style={styles.infoValue}>{student?.hall || "-"}</Text>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => {
                  if (student?.email) {
                    const subject = encodeURIComponent("Regarding your complaint");
                    const body = encodeURIComponent("Hello,\n\nI am contacting you regarding your complaint submitted to the ISD system.\n\nBest regards,\nAdmin");
                    const mailtoUrl = `mailto:${student.email}?subject=${subject}&body=${body}`;
                    Linking.openURL(mailtoUrl);
                  }
                }}
                activeOpacity={0.8}
                disabled={!student?.email}
              >
                <Text style={styles.quickActionIcon}>✉️</Text>
                <Text style={styles.quickActionText}>Send Email</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  makeAsButton: {
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
  makeAsButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.roseTaupe,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    color: colors.textPrimary,
    fontSize: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '100%',
    height: 48,
  },
  container: {
    flex: 1,
    backgroundColor: colors.platinum2,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  studentCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 8,
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
    marginBottom: 2,
  },
  studentPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  studentContactSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    backgroundColor: colors.platinum,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsButton: {
    backgroundColor: colors.roseTaupe,
  },
  contactButtonIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  detailsButtonText: {
    color: colors.white,
  },
  iconOnlyButton: {
    paddingVertical: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  contactButtonIconLarge: {
    fontSize: 24,
  },
  fullWidthButton: {
    width: '100%',
    maxWidth: '100%',
  },
  card: {
    backgroundColor: colors.rosyBrown,
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 8,
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
  // Student Details Modal Styles
  studentDetailsModal: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '95%',
    maxWidth: 450,
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  studentDetailsHeader: {
    backgroundColor: colors.roseTaupe,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentDetailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    lineHeight: 22,
  },
  studentDetailsContent: {
    flex: 1,
    padding: 20,
  },
  studentProfileSection: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
    marginBottom: 20,
  },
  studentDetailsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  studentDetailsName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  studentDetailsRoll: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  studentInfoGrid: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.roseTaupe,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.roseTaupe,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  // Image Modal Styles
  imageModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 2000,
  },
  imageModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageModalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2001,
  },
  closeImageButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
  },
});