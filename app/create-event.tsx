import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Mail, Phone, FileText, Users, Shield } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function CreateEventScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const createEvent = useMutation(api.events.createEvent);

  const [loading, setLoading] = useState(false);

  // Form state
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [medics, setMedics] = useState('');
  const [sanctions, setSanctions] = useState('');

  const handleSave = async () => {
    if (!userData || !eventName.trim() || !eventDate.trim() || !venue.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        promoterId: userData._id,
        eventName: eventName.trim(),
        eventDate: eventDate.trim(),
        eventTime: eventTime.trim(),
        description: description.trim() || undefined,
        venue: venue.trim(),
        street: street.trim(),
        city: city.trim(),
        country: country.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        medics: medics.trim() || undefined,
        sanctions: sanctions.trim() || undefined,
      });

      Alert.alert(
        'Success!',
        'Event created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (!userData || userData.role !== 'Promoter') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Promoter profile required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Event</Text>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={[styles.saveButtonText, loading && styles.disabledText]}>
              {loading ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Event Details */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Event Information</Text>

            <View style={styles.inputContainer}>
              <Calendar size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Event Name *"
                placeholderTextColor="#666"
                value={eventName}
                onChangeText={setEventName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Calendar size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Event Date (e.g., 2024-03-15) *"
                placeholderTextColor="#666"
                value={eventDate}
                onChangeText={setEventDate}
              />
            </View>

            <View style={styles.inputContainer}>
              <Clock size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Event Time (e.g., 19:00)"
                placeholderTextColor="#666"
                value={eventTime}
                onChangeText={setEventTime}
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Event Description"
                placeholderTextColor="#666"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Venue Information */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Venue Information</Text>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Venue Name *"
                placeholderTextColor="#666"
                value={venue}
                onChangeText={setVenue}
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor="#666"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="City"
                  placeholderTextColor="#666"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Country"
                  placeholderTextColor="#666"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contact Email *"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Medical & Sanctions */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Medical & Sanctions</Text>

            <View style={styles.inputContainer}>
              <Users size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Medical Staff/Services"
                placeholderTextColor="#666"
                value={medics}
                onChangeText={setMedics}
              />
            </View>

            <View style={styles.inputContainer}>
              <Shield size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sanctioning Body"
                placeholderTextColor="#666"
                value={sanctions}
                onChangeText={setSanctions}
              />
            </View>
          </View>

          {/* Create Button */}
          <View style={styles.form}>
            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Creating Event...' : 'Create Event'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              * Required fields. You can edit event details after creation.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#FFD700',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
  },
  saveButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  form: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  createButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 100,
  },
});