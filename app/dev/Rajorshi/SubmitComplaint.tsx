import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../../../lib/firebaseConfig';
import { addComplaint } from '../Ayesha/services/dbService';
import { colors } from './colors';

// Example categories and zones (replace with your actual lists)
const categories = [
  'Hostel',
  'Mess',
  'Academics',
  'Transport',
  'Other'
];
const zones = [
  'North Zone',
  'South Zone',
  'East Zone',
  'West Zone'
];

export default function SubmitComplaint() {
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    category: categories[0],
    zone: zones[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a complaint.');
      return;
    }
    if (!complaint.title.trim() || !complaint.description.trim() || !complaint.category || !complaint.zone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await addComplaint({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        zone: complaint.zone,
        status: 'Pending',
        createdBy: user.uid,
        createdAt: Date.now(),
      });
      setComplaint({ title: '', description: '', category: categories[0], zone: zones[0] });
      Alert.alert('Success', 'Complaint submitted successfully!');
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📝 Submit New Complaint</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Complaint Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter complaint title"
          value={complaint.title}
          onChangeText={(text) => setComplaint({ ...complaint, title: text })}
          editable={!loading}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={complaint.category}
            onValueChange={(itemValue) =>
              setComplaint({ ...complaint, category: itemValue })
            }
            enabled={!loading}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Zone</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={complaint.zone}
            onValueChange={(itemValue) =>
              setComplaint({ ...complaint, zone: itemValue })
            }
            enabled={!loading}
            style={styles.picker}
          >
            {zones.map((zone) => (
              <Picker.Item key={zone} label={zone} value={zone} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your complaint in detail"
          value={complaint.description}
          onChangeText={(text) => setComplaint({ ...complaint, description: text })}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!loading}
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.textLight} size="small" />
              <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                Submitting...
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Submit Complaint</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: colors.textPrimary,
  },
  form: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: colors.backgroundLight,
    color: colors.textPrimary,
  },
  textArea: {
    height: 120,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.backgroundLight,
    overflow: 'hidden',
  },
  picker: {
    color: colors.textPrimary,
    height: 48,
    width: '100%',
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  submitButtonText: {
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});