import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../lib/firebaseConfig.js'; // adjust path if needed
import { StudentProfile, editProfile } from '../Ayesha/services/dbService';
import { colors } from './colors';

export default function UserProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        Alert.alert('Error', 'You must be logged in.');
        return;
      }
      const snapshot = await get(ref(db, `students/${user.uid}`));
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await editProfile(profile.uid, {
        name: profile.name,
        roll: profile.roll,
        department: profile.department,
        batch: profile.batch,
        hall: profile.hall,
      });
      Alert.alert('Success', 'Profile updated!');
    } catch (err) {
      Alert.alert('Error', 'Could not update profile.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Profile not found.</Text>
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
  },
});