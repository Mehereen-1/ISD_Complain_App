import { push, ref, set } from "firebase/database";
import { db } from "../../../../lib/firebaseConfig";
export interface Admin {
  email: string;
  password: string;
  name?: string;
}

/**
 * Creates a new admin in Firebase Realtime Database
 */
export const createAdmin = async (admin: Admin): Promise<void> => {
  try {
    const adminRef = ref(db, "admins");
    const newAdminRef = push(adminRef);

    await set(newAdminRef, {
      email: admin.email,
      password: admin.password,
      name: admin.name || "",
    });

    console.log("✅ Admin created successfully!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    throw error;
  }
};
