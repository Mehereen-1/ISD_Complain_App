import { useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../lib/firebaseConfig.js'; // adjust path if needed
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
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.backgroundLight,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.primary,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.white,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
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
});