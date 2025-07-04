import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, Building2, Phone, Globe, MapPin, Users, Dumbbell, Instagram, Facebook, Youtube, Twitter, Clock, DollarSign, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';
import ImagePicker from '@/components/ImagePicker';

const DISCIPLINES = ['Boxing', 'MMA', 'Kickboxing', 'Muay Thai', 'BJJ', 'Wrestling', 'Judo', 'Karate', 'Taekwondo'];
const FACILITIES = ['Boxing Ring', 'MMA Cage', 'Heavy Bags', 'Speed Bags', 'Mats', 'Weight Room', 'Cardio Equipment', 'Locker Rooms', 'Showers', 'Parking'];
const STAFF_ROLES = ['Head Coach', 'Coach', 'Trainer', 'Assistant Coach', 'Manager'];

export default function GymEditProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.users.updateUserProfile);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gymName, setGymName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bio, setBio] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      
      if (userData.roleData) {
        setGymName(userData.roleData.gymName || '');
        setBusinessEmail(userData.roleData.businessEmail || '');
        setPhoneNumber(userData.roleData.phoneNumber || '');
        setWebsite(userData.roleData.website || '');
        setStreet(userData.roleData.address?.street || '');
        setCity(userData.roleData.address?.city || '');
        setState(userData.roleData.address?.state || '');
        setCountry(userData.roleData.address?.country || '');
        setZipCode(userData.roleData.address?.zipCode || '');
        setBannerImage(userData.roleData.bannerImage || '');
        setBio(userData.roleData.bio || '');
        setSelectedDisciplines(userData.roleData.disciplines || []);
        setSelectedFacilities(userData.roleData.facilities || []);
        setInstagram(userData.roleData.socials?.instagram || '');
        setFacebook(userData.roleData.socials?.facebook || '');
        setYoutube(userData.roleData.socials?.youtube || '');
        setTwitter(userData.roleData.socials?.twitter || '');
      }
    }
  }, [userData]);

  const toggleDiscipline = (discipline: string) => {
    setSelectedDisciplines(prev => 
      prev.includes(discipline) 
        ? prev.filter(d => d !== discipline)
        : [...prev, discipline]
    );
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSave = async () => {
    if (!user || !userData) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !gymName.trim()) {
      Alert.alert('Error', 'Please fill in required fields (Name, Email, and Gym Name)');
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

      const roleData: any = {};
      roleData.gymName = gymName.trim();
      if (businessEmail.trim()) roleData.businessEmail = businessEmail.trim();
      if (phoneNumber.trim()) roleData.phoneNumber = phoneNumber.trim();
      if (website.trim()) roleData.website = website.trim();
      if (bannerImage) roleData.bannerImage = bannerImage;
      if (bio.trim()) roleData.bio = bio.trim();
      if (selectedDisciplines.length > 0) roleData.disciplines = selectedDisciplines;
      if (selectedFacilities.length > 0) roleData.facilities = selectedFacilities;

      const address: any = {};
      if (street.trim()) address.street = street.trim();
      if (city.trim()) address.city = city.trim();
      if (state.trim()) address.state = state.trim();
      if (country.trim()) address.country = country.trim();
      if (zipCode.trim()) address.zipCode = zipCode.trim();
      if (Object.keys(address).length > 0) roleData.address = address;

      const socials: any = {};
      if (instagram.trim()) socials.instagram = instagram.trim();
      if (facebook.trim()) socials.facebook = facebook.trim();
      if (youtube.trim()) socials.youtube = youtube.trim();
      if (twitter.trim()) socials.twitter = twitter.trim();
      if (Object.keys(socials).length > 0) roleData.socials = socials;

      if (Object.keys(roleData).length > 0) {
        updateData.roleData = roleData;
      }

      await updateUser(updateData);

      Alert.alert('Success', 'Gym profile updated successfully', [
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
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.loadingGradient}
        >
          <Building2 size={40} color="#2196F3" />
          <Text style={styles.loadingText}>Loading Gym Profile...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2', '#1565C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Building2 size={24} color="#fff" />
            <Text style={styles.title}>Gym Profile</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Save size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Banner Image */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Award size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Gym Branding</Text>
            </View>

            <Text style={styles.inputLabel}>Gym Banner</Text>
            <ImagePicker
              value={bannerImage}
              onImageChange={(uri) => setBannerImage(uri || '')}
              placeholder="Upload gym banner"
              aspectRatio={[16, 9]}
            />
          </LinearGradient>

          {/* Basic Information */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Building2 size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Gym Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Owner first name *"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Owner last name *"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Building2 size={20} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Gym name *"
                placeholderTextColor="#666"
                value={gymName}
                onChangeText={setGymName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Personal email *"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Business email"
                placeholderTextColor="#666"
                value={businessEmail}
                onChangeText={setBusinessEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Phone size={20} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor="#666"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Globe size={20} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Website"
                  placeholderTextColor="#666"
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </LinearGradient>

          {/* Address Information */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Gym Address</Text>
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#2196F3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Street address"
                placeholderTextColor="#666"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#666"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="State/Province"
                  placeholderTextColor="#666"
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="#666"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#2196F3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ZIP/Postal Code"
                  placeholderTextColor="#666"
                  value={zipCode}
                  onChangeText={setZipCode}
                />
              </View>
            </View>
          </LinearGradient>

          {/* Disciplines & Facilities */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Dumbbell size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Training Programs</Text>
            </View>

            {/* Disciplines */}
            <Text style={styles.inputLabel}>Disciplines Offered</Text>
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
                    color={selectedDisciplines.includes(discipline) ? '#fff' : '#2196F3'} 
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

            {/* Facilities */}
            <Text style={styles.inputLabel}>Facilities & Equipment</Text>
            <View style={styles.disciplinesGrid}>
              {FACILITIES.map((facility) => (
                <TouchableOpacity
                  key={facility}
                  style={[
                    styles.disciplineChip,
                    selectedFacilities.includes(facility) && styles.disciplineChipSelected
                  ]}
                  onPress={() => toggleFacility(facility)}
                >
                  <Award 
                    size={16} 
                    color={selectedFacilities.includes(facility) ? '#fff' : '#2196F3'} 
                  />
                  <Text style={[
                    styles.disciplineChipText,
                    selectedFacilities.includes(facility) && styles.disciplineChipTextSelected
                  ]}>
                    {facility}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>

          {/* Bio */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Building2 size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Gym Description</Text>
            </View>

            <View style={styles.bioContainer}>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell us about your gym, training philosophy, and what makes you unique..."
                placeholderTextColor="#666"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </LinearGradient>

          {/* Social Media */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Instagram size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Social Media</Text>
            </View>

            <View style={styles.inputContainer}>
              <Instagram size={20} color="#E4405F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Instagram handle"
                placeholderTextColor="#666"
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Facebook size={20} color="#1877F2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Facebook page"
                placeholderTextColor="#666"
                value={facebook}
                onChangeText={setFacebook}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Youtube size={20} color="#FF0000" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="YouTube channel"
                placeholderTextColor="#666"
                value={youtube}
                onChangeText={setYoutube}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Twitter size={20} color="#1DA1F2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Twitter handle"
                placeholderTextColor="#666"
                value={twitter}
                onChangeText={setTwitter}
                autoCapitalize="none"
              />
            </View>
          </LinearGradient>

          {/* Update Button */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <TouchableOpacity
              style={[styles.updateButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.updateButtonGradient}
              >
                <Save size={20} color="#fff" />
                <Text style={styles.updateButtonText}>
                  {loading ? 'Updating...' : 'Update Gym Profile'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
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
  loadingGradient: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 16,
  },
  header: {
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
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#333',
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
    borderColor: '#2196F3',
    gap: 6,
  },
  disciplineChipSelected: {
    backgroundColor: '#2196F3',
  },
  disciplineChipText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  disciplineChipTextSelected: {
    color: '#fff',
  },
  bioContainer: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 16,
    backgroundColor: '#333',
    padding: 16,
  },
  bioInput: {
    fontSize: 16,
    color: '#fff',
    minHeight: 100,
  },
  updateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  updateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});