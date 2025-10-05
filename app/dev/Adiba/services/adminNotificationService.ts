import { onValue, push, ref, remove, set } from "firebase/database";
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
  const notifRef = push(ref(db, "adminNotifications"));
  await set(notifRef, { ...notif });
  return notifRef.key!;
};

// Listen to all admin notifications in real time
export const listenAdminNotifications = (callback: (data: AdminNotification[]) => void) => {
  const notifRef = ref(db, "adminNotifications");
  return onValue(notifRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list: AdminNotification[] = Object.entries(data).map(([id, val]: [string, any]) => ({
      id,
      ...val,
    }));
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
