// services/dbService.ts
import { onValue, push, ref, remove, set, update } from "firebase/database";
import { db } from "../../lib/firebaseConfig";

export interface Complaint {
  id?: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  createdBy: string;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  createdAt: number;
}

export const createUserProfile = async (user: UserProfile) => {
  const userRef = ref(db, `users/${user.uid}`);
  await set(userRef, {
    ...user,
    createdAt: user.createdAt || Date.now(),
  });
};

// Add a new complaint
export const addComplaint = async (complaint: Complaint): Promise<string> => {
  const complaintRef = push(ref(db, "complaints"));
  await set(complaintRef, {
    ...complaint,
    status: "To Do",
    createdAt: Date.now(),
  });
  return complaintRef.key!;
};

// Listen to all complaints in realtime
export const listenComplaints = (callback: (data: Complaint[]) => void) => {
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

// Update complaint status
export const updateComplaintStatus = async (id: string, status: "To Do" | "In Progress" | "Done") => {
  await update(ref(db, `complaints/${id}`), { status });
};

// Delete complaint
export const deleteComplaint = async (id: string) => {
  await remove(ref(db, `complaints/${id}`));
};
