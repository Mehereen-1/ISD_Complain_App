// services/authService.ts
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { auth } from "../../../../lib/firebaseConfig";
import { createUserProfile, UserProfile } from "./dbService";
// Sign up
export const signUp = async (email: string, password: string, name?: string): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = userCredential.user;

  // Build UserProfile object
  const appUser: UserProfile = {
    uid: user.uid,
    name: name || "Anonymous",
    email: user.email || "",
    role: "user",
    createdAt: Date.now(),
  };

  // Save user profile in Realtime DB
  await createUserProfile(appUser);

  return appUser;
};

// Sign in
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign out
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Auth state listener
export const subscribeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
