// services/dbService.ts
import { get, onValue, push, ref, remove, set, update } from "firebase/database";
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
    const data = snapshot.val() || {};
    const list: Complaint[] = Object.entries(data).map(([id, val]: [string, any]) => ({
      id,
      ...val,
    }));
    callback(list);
  });
};

// Display complaints of the current user
export const listenUserComplaints = (uid: string, callback: (data: Complaint[]) => void) => {
  const complaintsRef = ref(db, "complaints");
  return onValue(complaintsRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list: Complaint[] = Object.entries(data)
      .map(([id, val]: [string, any]) => ({ id, ...val }))
      .filter((complaint) => complaint.createdBy === uid);
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
  const complaintRef = ref(db, `complaints/${id}`);
  const snapshot = await get(complaintRef);
  if (snapshot.exists()) {
    const complaint = snapshot.val();
    if (complaint.createdBy === uid) {
      await remove(complaintRef);
      return true;
    } else {
      throw new Error("Unauthorized: You can only delete your own complaints.");
    }
  }
  return false;
};

// Delete complaint by the admin
export const deleteComplaintByAdmin = async (id: string) => {
  const complaintRef = ref(db, `complaints/${id}`);
  await remove(complaintRef);
};

// Update complaint status (admin only)
export const updateComplaintStatus = async (id: string, status: ComplaintStatus) => {
  await update(ref(db, `complaints/${id}`), { status });
};
