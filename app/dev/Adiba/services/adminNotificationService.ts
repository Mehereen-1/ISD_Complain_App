import { get, onValue, push, ref, remove, set } from "firebase/database";
import { db } from "../../../../lib/firebaseConfig";

export interface AdminNotification {
  id?: string;
  type: "new" | "status" | "resolved";
  title: string;
  message: string;
  time: number;
  read: boolean;
  complaintId?: string;
}

// Add a notification to the database
export const addAdminNotification = async (notif: Omit<AdminNotification, "id">) => {
  const notifRef = ref(db, "adminNotifications");
  const snapshot = await get(notifRef);
  const existingNotifications = snapshot.val() || {};

  // Fix type mismatch in `some` method
  const isDuplicate = Object.values(existingNotifications).some(
    (existingNotif) => {
      const notifTyped = existingNotif as AdminNotification; // Explicitly cast to AdminNotification
      return notifTyped.complaintId === notif.complaintId && notifTyped.type === notif.type;
    }
  );

  if (isDuplicate) {
    console.log("Duplicate notification detected. Skipping addition.");
    return null;
  }

  const newNotifRef = push(notifRef);
  await set(newNotifRef, {
    ...notif,
    message: notif.title, // Only include the complaint title in the message
  });
  return newNotifRef.key!;
};

// Listen to all admin notifications in real time
export const listenAdminNotifications = (callback: (data: AdminNotification[]) => void) => {
  const notifRef = ref(db, "adminNotifications");
  return onValue(notifRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list: AdminNotification[] = Object.entries(data)
      .map(([id, val]: [string, any]) => ({ id, ...val }))
      .sort((a, b) => b.time - a.time); // Sort by time in descending order

    callback(list);
  });
};

// Mark notification as read
export const markAdminNotificationRead = async (id: string) => {
  await set(ref(db, `adminNotifications/${id}/read`), true);
};

// Delete notification
export const deleteAdminNotification = async (id: string) => {
  await remove(ref(db, `adminNotifications/${id}`));
};
