// services/dbService.ts
import { get, onValue, push, ref, remove, set, update } from "firebase/database";
import { Alert } from "react-native";
import { db } from "../../../../lib/firebaseConfig";

// ---------------------- Interfaces ----------------------
export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  roll: string;
  department: string;
  batch: string;
  hall: string;
  createdAt: number;
}

export type ComplaintStatus = "Pending" | "In Progress" | "Solved";

export interface Complaint {
  id?: string;
  title: string;
  description: string;
  category: string; // chosen from predefined list
  zone: string;     // chosen from predefined list
  imageUrl?: string;
  status: ComplaintStatus;
  createdBy: string; // uid of student
  createdAt: number;
}

// ---------------------- Student Profile ----------------------
export const createStudentProfile = async (student: StudentProfile) => {
  const studentRef = ref(db, `students/${student.uid}`);
  await set(studentRef, {
    ...student,
    createdAt: student.createdAt || Date.now(),
  });
};

export const editProfile = async (uid: string, updates: Partial<StudentProfile>) => {
  const studentRef = ref(db, `students/${uid}`);
  await update(studentRef, updates);
};

// ---------------------- Complaints ----------------------

// Add a new complaint
export const addComplaint = async (complaint: Complaint): Promise<string> => {
  const complaintRef = push(ref(db, "complaints"));
  await set(complaintRef, {
    ...complaint,
    status: "Pending",
    createdAt: Date.now(),
  });
  return complaintRef.key!;
};

// Display all complaints (admin use)
export const listenAllComplaints = (callback: (data: Complaint[]) => void) => {
  const complaintsRef = ref(db, "complaints");
  return onValue(complaintsRef, (snapshot) => {
    console.log('listenAllComplaints: received data update');
    const data = snapshot.val() || {};
    const list: Complaint[] = Object.entries(data).map(([id, val]: [string, any]) => ({
      id,
      ...val,
    }));
    console.log('listenAllComplaints: complaint count =', list.length);
    callback(list);
  });
};

// Display complaints of the current user
export const listenUserComplaints = (uid: string, callback: (data: Complaint[]) => void) => {
  const complaintsRef = ref(db, "complaints");
  return onValue(complaintsRef, (snapshot) => {
    console.log('listenUserComplaints: received data update for uid:', uid);
    const data = snapshot.val() || {};
    const list: Complaint[] = Object.entries(data)
      .map(([id, val]: [string, any]) => ({ id, ...val }))
      .filter((complaint) => complaint.createdBy === uid);
    console.log('listenUserComplaints: user complaint count =', list.length);
    callback(list);
  });
};

// Display complaints filtered by category
export const listenComplaintsByCategory = (category: string, callback: (data: Complaint[]) => void) => {
  const complaintsRef = ref(db, "complaints");
  return onValue(complaintsRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list: Complaint[] = Object.entries(data)
      .map(([id, val]: [string, any]) => ({ id, ...val }))
      .filter((complaint) => complaint.category === category);
    callback(list);
  });
};


// Delete complaint by the student who created it
export const deleteUserComplaint = async (uid: string, id: string) => {
  console.log('deleteUserComplaint called with uid:', uid, 'id:', id);
  
  if (!id) {
    console.log('❌ Error: Complaint ID is required');
    throw new Error("Complaint ID is required");
  }
  
  const complaintRef = ref(db, `complaints/${id}`);
  console.log('📍 Database path:', `complaints/${id}`);
  const snapshot = await get(complaintRef);
  console.log('📊 Snapshot exists:', snapshot.exists());
  
  if (snapshot.exists()) {
    const complaint = snapshot.val();
    console.log('📄 Found complaint data:', complaint);
    console.log('🔍 Authorization check: complaint.createdBy =', complaint.createdBy, ', uid =', uid);
    
    if (complaint.createdBy === uid) {
      console.log('✅ User authorized - proceeding with delete');
      await remove(complaintRef);
      console.log('🎉 Complaint deleted successfully from Firebase');
      return true;
    } else {
      console.log('❌ Authorization failed - user can only delete own complaints');
      throw new Error("Unauthorized: You can only delete your own complaints.");
    }
  } else {
    console.log('❌ Complaint not found in database');
    throw new Error("Complaint not found");
  }
  
};

export const deleteComplaintByUser = async (uid: string, id: string, complaint: Complaint) => {
  console.log('🔄 deleteComplaintByUser called with:');
  console.log('   👤 uid:', uid);
  console.log('   📝 id:', id);
  console.log('   📋 complaint title:', complaint.title);
  
  if (!uid) {
    console.log('❌ Error: No user ID provided');
    throw new Error("You must be logged in to delete complaints.");
  }

  if (!id) {
    console.log('❌ Error: No complaint ID provided');
    throw new Error("Complaint ID is missing.");
  }

  console.log('➡️ Calling deleteUserComplaint...');
  await deleteUserComplaint(uid, id);
  console.log('✅ deleteComplaintByUser completed successfully');
};

// Delete complaint by the admin
export const deleteComplaintByAdmin = (id: string) => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this complaint as an admin?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const complaintRef = ref(db, `complaints/${id}`);
            await remove(complaintRef);
            Alert.alert("Success", "Complaint deleted successfully!");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Could not delete complaint.");
          }
        },
      },
    ]
  );
};

// Update complaint status (admin only)
export const updateComplaintStatus = async (id: string, status: ComplaintStatus) => {
  await update(ref(db, `complaints/${id}`), { status });
};
//User Update Complaint
export const updateComplaint = async (id: string, updatedData: Partial<Complaint>) => {
  const complaintRef = ref(db, `complaints/${id}`);
  await update(complaintRef, {
    ...updatedData,
    updatedAt: Date.now(), // optional field to track updates
  });
};