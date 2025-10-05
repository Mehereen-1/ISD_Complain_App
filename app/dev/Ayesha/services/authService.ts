// services/authService.ts
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../../../../lib/firebaseConfig";
import { createStudentProfile, StudentProfile } from "./dbService";
// Sign up
export const signUp = async (
  email: string,
  password: string,
  name: string,
  roll: string,
  department: string,
  batch: string,
  hall: string
): Promise<StudentProfile> => {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = userCredential.user;

  // Build StudentProfile object
  const student: StudentProfile = {
    uid: user.uid,
    name,
    email: user.email || "",
    roll,
    department,
    batch,
    hall,
    createdAt: Date.now(),
  };

  // Save StudentProfile in Realtime DB
  await createStudentProfile(student);

  return student;
};

// Sign in
export const signIn = async (email: string, password: string): Promise<StudentProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user: User = userCredential.user;

  // Fetch student profile from DB
  const studentRef = ref(db, `students/${user.uid}`);
  const snapshot = await get(studentRef);

  if (!snapshot.exists()) {
    throw new Error("No student profile found for this account.");
  }

  const profile = snapshot.val();

  const student: StudentProfile = {
    uid: user.uid,
    ...profile,
  };

  return student;
};

// Sign out
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Auth state listener
export const subscribeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
