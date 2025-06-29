import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, Target, Ruler, Weight, MapPin, Users, Dumbbell, Instagram, Facebook, Youtube } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import DatePicker from '@/components/DatePicker';
import ImagePicker from '@/components/ImagePicker';

const DISCIPLINES = ['Boxing', 'MMA', 'Kickboxing', 'Muay Thai', 'BJJ', 'Wrestling', 'Judo', 'Karate', 'Taekwondo'];

export default function EditProfileScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.users.updateUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [fightName, setFightName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gym, setGym] = useState('');
  const [headCoach, setHeadCoach] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setFightName(userData.fightName || '');
      setAge(userData.age?.toString() || '');
      setHeight(userData.height?.toString() || '');
      setWeight(userData.weight?.toString() || '');
      setGym(userData.gym || '');
      setHeadCoach(userData.headCoach || '');
      setSelectedDisciplines(userData.disciplines || []);
      setProfileImage(userData.profileImage || '');
      setBannerImage(userData.bannerImage || '');
      setInstagram(userData.socials?.instagram || '');
      setFacebook(userData.socials?.facebook || '');
      setYoutube(userData.socials?.youtube || '');
    }
  }, [userData]);

  const toggleDiscipline = (discipline: string) => {
    setSelectedDisciplines(prev => 
      prev.includes(discipline) 
        ? prev.filter(d => d !== discipline)
        : [...prev, discipline]
    );
  };

  const handleSave = async () => {
    if (!user || !userData) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in required fields (Name and Email)');
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        clerkId: user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      };

      if (fightName.trim()) updateData.fightName = fightName.trim();
      if (age.trim()) updateData.age = parseInt(age);
      if (height.trim()) updateData.height = parseInt(height);
      if (weight.trim()) updateData.weight = parseInt(weight);
      if (gym.trim()) updateData.gym = gym.trim();
      if (headCoach.trim()) updateData.headCoach = headCoach.trim();
      if (selectedDisciplines.length > 0) updateData.disciplines = selectedDisciplines;
      if (profileImage) updateData.profileImage = profileImage;
      if (bannerImage) updateData.bannerImage = bannerImage;

      const socials: any = {};
      if (instagram.trim()) socials.instagram = instagram.trim();
      if (facebook.trim()) socials.facebook = facebook.trim();
      if (youtube.trim()) socials.youtube = youtube.trim();
      if (Object.keys(socials).length > 0) updateData.socials = socials;

      await updateUser(updateData);

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isFighter = userData.role === 'Fighter';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Save size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Images */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Profile Images</Text>

            <Text style={styles.inputLabel}>Banner Image</Text>
            <ImagePicker
              value={bannerImage}
              onImageChange={(uri) => setBannerImage(uri || '')}
              placeholder="Upload banner image"
              aspectRatio={[16, 9]}
            />

            <Text style={styles.inputLabel}>Profile Picture</Text>
            <ImagePicker
              value={profileImage}
              onImageChange={(uri) => setProfileImage(uri || '')}
              placeholder="Upload profile picture"
              aspectRatio={[1, 1]}
            />
          </View>

          {/* Basic Information */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputContainer}>
              <User size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First name *"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last name *"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address *"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {isFighter && (
              <View style={styles.inputContainer}>
                <Target size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Fight name (optional)"
                  placeholderTextColor="#666"
                  value={fightName}
                  onChangeText={setFightName}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <User size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Age (optional)"
                placeholderTextColor="#666"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Fighter Specific Fields */}
          {isFighter && (
            <>
              {/* Physical Stats */}
              <View style={styles.form}>
                <Text style={styles.sectionTitle}>Physical Stats</Text>

                <View style={styles.inputContainer}>
                  <Ruler size={20} color="#FFD700" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Height in inches (optional)"
                    placeholderTextColor="#666"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Weight size={20} color="#FFD700" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight in lbs (optional)"
                    placeholderTextColor="#666"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Training Information */}
              <View style={styles.form}>
                <Text style={styles.sectionTitle}>Training Information</Text>

                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Gym/Training facility (optional)"
                    placeholderTextColor="#666"
                    value={gym}
                    onChangeText={setGym}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Users size={20} color="#FFD700" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Head coach (optional)"
                    placeholderTextColor="#666"
                    value={headCoach}
                    onChangeText={setHeadCoach}
                  />
                </View>
              </View>

              {/* Disciplines */}
              <View style={styles.form}>
                <Text style={styles.sectionTitle}>Fighting Disciplines</Text>
                <View style={styles.disciplinesGrid}>
                  {DISCIPLINES.map((discipline) => (
                    <TouchableOpacity
                      key={discipline}
                      style={[
                        styles.disciplineChip,
                        selectedDisciplines.includes(discipline) && styles.disciplineChipSelected
                      ]}
                      onPress={() => toggleDiscipline(discipline)}
                    >
                      <Dumbbell 
                        size={16} 
                        color={selectedDisciplines.includes(discipline) ? '#1a1a1a' : '#FFD700'} 
                      />
                      <Text style={[
                        styles.disciplineChipText,
                        selectedDisciplines.includes(discipline) && styles.disciplineChipTextSelected
                      ]}>
                        {discipline}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Social Media */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Social Media</Text>

            <View style={styles.inputContainer}>
              <Instagram size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Instagram username (optional)"
                placeholderTextColor="#666"
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Facebook size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Facebook profile (optional)"
                placeholderTextColor="#666"
                value={facebook}
                onChangeText={setFacebook}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Youtube size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="YouTube channel (optional)"
                placeholderTextColor="#666"
                value={youtube}
                onChangeText={setYoutube}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Role Info */}
          <View style={styles.form}>
            <View style={styles.roleInfo}>
              <Text style={styles.roleLabel}>Role</Text>
              <Text style={styles.roleValue}>{userData.role}</Text>
              <Text style={styles.roleNote}>
                Role cannot be changed. Contact support if you need to change your role.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.updateButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
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
    padding: 8,
  },
  buttonDisabled: {
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
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
  disciplinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  disciplineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  disciplineChipSelected: {
    backgroundColor: '#FFD700',
  },
  disciplineChipText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  disciplineChipTextSelected: {
    color: '#1a1a1a',
  },
  roleInfo: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  roleValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
  },
  roleNote: {
    fontSize: 12,
    color: '#ccc',
    fontStyle: 'italic',
  },
  updateButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});