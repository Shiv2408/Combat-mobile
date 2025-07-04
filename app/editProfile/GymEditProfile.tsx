import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, Building, Phone, Globe, MapPin, Clock, Users, Dumbbell, Instagram, Facebook, Youtube, Twitter, Award, Star, Plus, X, Target, Activity, Trash2, Edit3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';
import ImagePicker from '@/components/ImagePicker';

interface StaffMember {
  name: string;
  role: 'Head Coach' | 'Coach' | 'Trainer' | 'Assistant Coach' | 'Manager';
  discipline?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
}

interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export default function GymEditProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.gyms.getGymProfile,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.gyms.updateGymProfile);

  // Basic Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gymName, setGymName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  
  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Images & Bio
  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bio, setBio] = useState('');

  // Social Media
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');

  // New Fields
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [operatingHours, setOperatingHours] = useState<OperatingHours>({});

  // Modal States
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [editingStaffIndex, setEditingStaffIndex] = useState<number | null>(null);

  // Form States for Modals
  const [newDiscipline, setNewDiscipline] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [staffForm, setStaffForm] = useState<StaffMember>({
    name: '',
    role: 'Coach',
    discipline: '',
    email: '',
    phoneNumber: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);

  // Predefined options
  const disciplineOptions = [
    'Boxing', 'MMA', 'Muay Thai', 'Brazilian Jiu-Jitsu', 'Wrestling', 
    'Kickboxing', 'Karate', 'Taekwondo', 'Judo', 'CrossFit', 
    'Powerlifting', 'Olympic Weightlifting', 'Bodybuilding', 'Yoga', 'Pilates'
  ];

  const facilityOptions = [
    'Boxing Ring', 'MMA Cage', 'Heavy Bags', 'Speed Bags', 'Double End Bags',
    'Free Weights', 'Cardio Equipment', 'Squat Racks', 'Bench Press',
    'Cable Machines', 'Mats', 'Locker Rooms', 'Showers', 'Sauna',
    'Recovery Room', 'Pro Shop', 'Parking'
  ];

  const roleOptions: StaffMember['role'][] = [
    'Head Coach', 'Coach', 'Trainer', 'Assistant Coach', 'Manager'
  ];

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setGymName(userData.gymName || '');
      setBusinessEmail(userData.businessEmail || '');
      setPhoneNumber(userData.phoneNumber || '');
      setWebsite(userData.website || '');
      setStreet(userData.address?.street || '');
      setCity(userData.address?.city || '');
      setState(userData.address?.state || '');
      setCountry(userData.address?.country || '');
      setZipCode(userData.address?.zipCode || '');
      setProfileImage(userData.profileImage || '');
      setBannerImage(userData.bannerImage || '');
      setBio(userData.bio || '');
      setInstagram(userData.socials?.instagram || '');
      setFacebook(userData.socials?.facebook || '');
      setYoutube(userData.socials?.youtube || '');
      setTwitter(userData.socials?.twitter || '');
      setDisciplines(userData.disciplines || []);
      setFacilities(userData.facilities || []);
      setStaff(userData.staff || []);
      setOperatingHours(userData.operatingHours || {});
    }
  }, [userData]);

  const handleAddDiscipline = () => {
    if (newDiscipline.trim() && !disciplines.includes(newDiscipline.trim())) {
      setDisciplines([...disciplines, newDiscipline.trim()]);
      setNewDiscipline('');
      setShowDisciplineModal(false);
    }
  };

  const handleRemoveDiscipline = (index: number) => {
    setDisciplines(disciplines.filter((_, i) => i !== index));
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
      setShowFacilityModal(false);
    }
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleAddStaff = () => {
    if (staffForm.name.trim()) {
      if (editingStaffIndex !== null) {
        const updatedStaff = [...staff];
        updatedStaff[editingStaffIndex] = { ...staffForm };
        setStaff(updatedStaff);
        setEditingStaffIndex(null);
      } else {
        setStaff([...staff, { ...staffForm }]);
      }
      setStaffForm({
        name: '',
        role: 'Coach',
        discipline: '',
        email: '',
        phoneNumber: '',
        bio: ''
      });
      setShowStaffModal(false);
    }
  };

  const handleEditStaff = (index: number) => {
    setStaffForm({ ...staff[index] });
    setEditingStaffIndex(index);
    setShowStaffModal(true);
  };

  const handleRemoveStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleOperatingHoursChange = (day: string, hours: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: hours
    }));
  };

  const handleSave = async () => {
    if (!user || !userData) return;

    setLoading(true);

    try {
      const updateData: any = {
        clerkId: user.id,
      };

      if (gymName.trim()) updateData.gymName = gymName.trim();
      if (businessEmail.trim()) updateData.businessEmail = businessEmail.trim();
      if (phoneNumber.trim()) updateData.phoneNumber = phoneNumber.trim();
      if (website.trim()) updateData.website = website.trim();
      if (profileImage) updateData.profileImage = profileImage;
      if (bannerImage) updateData.bannerImage = bannerImage;
      if (bio.trim()) updateData.bio = bio.trim();

      const address: any = {};
      if (street.trim()) address.street = street.trim();
      if (city.trim()) address.city = city.trim();
      if (state.trim()) address.state = state.trim();
      if (country.trim()) address.country = country.trim();
      if (zipCode.trim()) address.zipCode = zipCode.trim();
      if (Object.keys(address).length > 0) updateData.address = address;

      const socials: any = {};
      if (instagram.trim()) socials.instagram = instagram.trim();
      if (facebook.trim()) socials.facebook = facebook.trim();
      if (youtube.trim()) socials.youtube = youtube.trim();
      if (twitter.trim()) socials.twitter = twitter.trim();
      if (Object.keys(socials).length > 0) updateData.socials = socials;

      if (disciplines.length > 0) updateData.disciplines = disciplines;
      if (facilities.length > 0) updateData.facilities = facilities;
      if (staff.length > 0) updateData.staff = staff;
      if (Object.keys(operatingHours).length > 0) updateData.operatingHours = operatingHours;

      await updateUser(updateData);

      Alert.alert('Success', 'Gym profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
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
          <Dumbbell size={40} color="#FFD700" />
          <Text style={styles.loadingText}>Loading Gym Profile...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Dumbbell size={24} color="#1a1a1a" />
            <Text style={styles.title}>Edit Gym Profile</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Save size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Gym Images */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Star size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Gym Branding</Text>
            </View>

            <Text style={styles.inputLabel}>Gym Banner</Text>
            <ImagePicker
              value={bannerImage}
              onImageChange={(uri) => setBannerImage(uri || '')}
              placeholder="Upload gym banner"
              aspectRatio={[16, 9]}
            />

            <Text style={styles.inputLabel}>Gym Logo</Text>
            <ImagePicker
              value={profileImage}
              onImageChange={(uri) => setProfileImage(uri || '')}
              placeholder="Upload gym logo"
              aspectRatio={[1, 1]}
            />
          </LinearGradient>

          {/* Gym Information */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Building size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Gym Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Owner first name *"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Owner last name *"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Building size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Gym name"
                placeholderTextColor="#666"
                value={gymName}
                onChangeText={setGymName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Personal email *"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#FFD700" style={styles.inputIcon} />
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
                <Phone size={20} color="#FFD700" style={styles.inputIcon} />
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
                <Globe size={20} color="#FFD700" style={styles.inputIcon} />
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
              <MapPin size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Gym Location</Text>
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
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
                <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#666"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
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
                <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="#666"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
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

          {/* Operating Hours */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Operating Hours</Text>
            </View>

            {dayNames.map((day, index) => (
              <View key={day} style={styles.inputContainer}>
                <Clock size={20} color="#FFD700" style={styles.inputIcon} />
                <Text style={styles.dayLabel}>{dayLabels[index]}</Text>
                <TextInput
                  style={[styles.input, { flex: 2 }]}
                  placeholder="e.g., 6:00 AM - 10:00 PM or Closed"
                  placeholderTextColor="#666"
                  value={operatingHours[day as keyof OperatingHours] || ''}
                  onChangeText={(text) => handleOperatingHoursChange(day, text)}
                />
              </View>
            ))}
          </LinearGradient>

          {/* Training Disciplines */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Target size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Training Disciplines</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowDisciplineModal(true)}
              >
                <Plus size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {disciplines.map((discipline, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{discipline}</Text>
                  <TouchableOpacity onPress={() => handleRemoveDiscipline(index)}>
                    <X size={16} color="#1a1a1a" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Facilities & Equipment */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Facilities & Equipment</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowFacilityModal(true)}
              >
                <Plus size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {facilities.map((facility, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{facility}</Text>
                  <TouchableOpacity onPress={() => handleRemoveFacility(index)}>
                    <X size={16} color="#1a1a1a" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Staff Management */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Users size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Staff Members</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowStaffModal(true)}
              >
                <Plus size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>

            {staff.map((member, index) => (
              <View key={index} style={styles.staffCard}>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{member.name}</Text>
                  <Text style={styles.staffRole}>{member.role}</Text>
                  {member.discipline && (
                    <Text style={styles.staffDiscipline}>{member.discipline}</Text>
                  )}
                </View>
                <View style={styles.staffActions}>
                  <TouchableOpacity
                    style={styles.editStaffButton}
                    onPress={() => handleEditStaff(index)}
                  >
                    <Edit3 size={16} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteStaffButton}
                    onPress={() => handleRemoveStaff(index)}
                  >
                    <Trash2 size={16} color="#FF5722" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </LinearGradient>

          {/* Bio */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <User size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>About Your Gym</Text>
            </View>

            <View style={styles.bioContainer}>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell us about your gym's philosophy, training approach, and what makes it special..."
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
              <Instagram size={20} color="#FFD700" />
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
                colors={['#FFD700', '#FFA500']}
                style={styles.updateButtonGradient}
              >
                <Save size={20} color="#1a1a1a" />
                <Text style={styles.updateButtonText}>
                  {loading ? 'Updating...' : 'Update Gym Profile'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Discipline Modal */}
      <Modal
        visible={showDisciplineModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDisciplineModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Training Discipline</Text>
              <TouchableOpacity onPress={() => setShowDisciplineModal(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {disciplineOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    disciplines.includes(option) && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    if (!disciplines.includes(option)) {
                      setDisciplines([...disciplines, option]);
                    }
                    setShowDisciplineModal(false);
                  }}
                  disabled={disciplines.includes(option)}
                >
                  <Text style={[
                    styles.optionText,
                    disciplines.includes(option) && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Or add custom discipline..."
                placeholderTextColor="#666"
                value={newDiscipline}
                onChangeText={setNewDiscipline}
              />
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={handleAddDiscipline}
              >
                <Plus size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Facility Modal */}
      <Modal
        visible={showFacilityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFacilityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Facility/Equipment</Text>
              <TouchableOpacity onPress={() => setShowFacilityModal(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {facilityOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    facilities.includes(option) && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    if (!facilities.includes(option)) {
                      setFacilities([...facilities, option]);
                    }
                    setShowFacilityModal(false);
                  }}
                  disabled={facilities.includes(option)}
                >
                  <Text style={[
                    styles.optionText,
                    facilities.includes(option) && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Or add custom facility..."
                placeholderTextColor="#666"
                value={newFacility}
                onChangeText={setNewFacility}
              />
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={handleAddFacility}
              >
                <Plus size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Staff Modal */}
      <Modal
        visible={showStaffModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStaffModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingStaffIndex !== null ? 'Edit Staff Member' : 'Add Staff Member'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowStaffModal(false);
                setEditingStaffIndex(null);
                setStaffForm({
                  name: '',
                  role: 'Coach',
                  discipline: '',
                  email: '',
                  phoneNumber: '',
                  bio: ''
                });
              }}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.staffFormContainer}>
              <View style={styles.inputContainer}>
                <User size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name *"
                  placeholderTextColor="#666"
                  value={staffForm.name}
                  onChangeText={(text) => setStaffForm({...staffForm, name: text})}
                />
              </View>

              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleContainer}>
                {roleOptions.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      staffForm.role === role && styles.roleOptionSelected
                    ]}
                    onPress={() => setStaffForm({...staffForm, role})}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      staffForm.role === role && styles.roleOptionTextSelected
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputContainer}>
                <Target size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Specialty/Discipline"
                  placeholderTextColor="#666"
                  value={staffForm.discipline}
                  onChangeText={(text) => setStaffForm({...staffForm, discipline: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={staffForm.email}
                  onChangeText={(text) => setStaffForm({...staffForm, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor="#666"
                  value={staffForm.phoneNumber}
                  onChangeText={(text) => setStaffForm({...staffForm, phoneNumber: text})}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.bioContainer}>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Bio/Experience..."
                  placeholderTextColor="#666"
                  value={staffForm.bio}
                  onChangeText={(text) => setStaffForm({...staffForm, bio: text})}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleAddStaff}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.modalSaveButtonGradient}
                >
                  <Save size={20} color="#1a1a1a" />
                  <Text style={styles.modalSaveButtonText}>
                    {editingStaffIndex !== null ? 'Update Staff Member' : 'Add Staff Member'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  saveButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
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
    flex: 1,
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#333',
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
  dayLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 80,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  staffRole: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 2,
  },
  staffDiscipline: {
    fontSize: 12,
    color: '#ccc',
  },
  staffActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editStaffButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  deleteStaffButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
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
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  optionItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: '#444',
    opacity: 0.6,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#ccc',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
  },
  addCustomButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 12,
  },
  staffFormContainer: {
    maxHeight: 400,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  roleOptionSelected: {
    backgroundColor: '#FFD700',
  },
  roleOptionText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  roleOptionTextSelected: {
    color: '#1a1a1a',
  },
  modalSaveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  modalSaveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  modalSaveButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});