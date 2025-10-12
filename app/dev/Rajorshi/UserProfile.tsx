import { useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../lib/firebaseConfig.js'; // adjust path if needed
import { logout } from '../Ayesha/services/authService';
import { StudentProfile, createStudentProfile, editProfile } from '../Ayesha/services/dbService';
import { colors } from './colors';

export default function UserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch profile when user is available
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetching profile for user:', currentUser?.uid);
      
      if (!currentUser) {
        console.log('No current user found');
        setLoading(false);
        Alert.alert('Error', 'You must be logged in.');
        return;
      }
      
      try {
        const snapshot = await get(ref(db, `students/${currentUser.uid}`));
        console.log('Profile snapshot exists:', snapshot.exists());
        
        if (snapshot.exists()) {
          const profileData = snapshot.val();
          console.log('Profile data:', profileData);
          setProfile(profileData);
        } else {
          console.log('No profile found, creating default profile');
          // Create a default profile if it doesn't exist
          const defaultProfile: StudentProfile = {
            uid: currentUser.uid,
            name: '',
            email: currentUser.email || '',
            roll: '',
            department: '',
            batch: '',
            hall: '',
            createdAt: Date.now(),
          };
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile.');
      }
      
      setLoading(false);
    };
    
    if (currentUser) {
      fetchProfile();
    } else if (currentUser === null) {
      // User is definitely not logged in
      setLoading(false);
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!profile || !currentUser) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    
    setSaving(true);
    try {
      console.log('Saving profile for user:', currentUser.uid);
      
      // Check if profile exists, if not create it
      const snapshot = await get(ref(db, `students/${currentUser.uid}`));
      if (!snapshot.exists()) {
        console.log('Creating new profile');
        // Create new profile
        await createStudentProfile({
          uid: currentUser.uid,
          name: profile.name,
          email: currentUser.email || '',
          roll: profile.roll,
          department: profile.department,
          batch: profile.batch,
          hall: profile.hall,
          createdAt: Date.now(),
        });
      } else {
        console.log('Updating existing profile');
        // Update existing profile
        await editProfile(profile.uid, {
          name: profile.name,
          roll: profile.roll,
          department: profile.department,
          batch: profile.batch,
          hall: profile.hall,
        });
      }
      Alert.alert('Success', 'Profile updated!');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Could not update profile.');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              Alert.alert("Success", "Logged out successfully");
              router.replace('/dev/Ayesha/auth/signIn');
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>You must be logged in to view your profile.</Text>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => {
            router.push('/dev/Ayesha/auth/signIn');
          }}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load profile.</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            // Trigger useEffect to reload
            setCurrentUser(auth.currentUser);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      
      <Text style={styles.title}>👤 My Profile</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={name => setProfile({ ...profile, name })}
      />
      <Text style={styles.label}>Roll</Text>
      <TextInput
        style={styles.input}
        value={profile.roll}
        onChangeText={roll => setProfile({ ...profile, roll })}
      />
      <Text style={styles.label}>Department</Text>
      <TextInput
        style={styles.input}
        value={profile.department}
        onChangeText={department => setProfile({ ...profile, department })}
      />
      <Text style={styles.label}>Batch</Text>
      <TextInput
        style={styles.input}
        value={profile.batch}
        onChangeText={batch => setProfile({ ...profile, batch })}
      />
      <Text style={styles.label}>Hall</Text>
      <TextInput
        style={styles.input}
        value={profile.hall}
        onChangeText={hall => setProfile({ ...profile, hall })}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    padding: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: colors.backgroundLight,
    flexGrow: 1,
    minHeight: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
    marginTop: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    fontSize: 16,
    minHeight: 44,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    minHeight: 48,
  },
  saveButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    minHeight: 44,
  },
  loginButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
    padding: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 40,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 48,
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});