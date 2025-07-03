import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, Building, Phone, Globe, MapPin, Clock, Users, Dumbbell, Instagram, Facebook, Youtube, Twitter, Award, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';
import ImagePicker from '@/components/ImagePicker';

const SERVICES = ['Boxing Training', 'MMA Training', 'Kickboxing', 'Muay Thai', 'BJJ Classes', 'Wrestling', 'Personal Training', 'Group Classes', 'Youth Programs', 'Competition Prep', 'Fitness Classes', 'Strength & Conditioning'];
const AMENITIES = ['Locker Rooms', 'Showers', 'Parking', 'Pro Shop', 'Nutrition Bar', 'Recovery Room', 'Sauna', 'Equipment Rental', 'WiFi', 'Air Conditioning', 'Sound System', 'Video Analysis'];

export default function GymEditProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.gyms.getGymProfile,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.gyms.updateGymProfile);

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
  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bio, setBio] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [establishedYear, setEstablishedYear] = useState('');
  const [membershipFee, setMembershipFee] = useState('');
  const [openingHours, setOpeningHours] = useState('');
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
    }
  }, [userData]);

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
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
      if (selectedServices.length > 0) updateData.services = selectedServices;
      if (selectedAmenities.length > 0) updateData.amenities = selectedAmenities;
      if (establishedYear.trim()) updateData.establishedYear = parseInt(establishedYear);
      if (membershipFee.trim()) updateData.membershipFee = parseFloat(membershipFee);
      if (openingHours.trim()) updateData.openingHours = openingHours.trim();

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
          <Dumbbell size={40} color="#E74C3C" />
          <Text style={styles.loadingText}>Loading Gym Profile...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E74C3C', '#C0392B', '#A93226']}
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
            <Dumbbell size={24} color="#fff" />
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
          {/* Gym Images */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Star size={20} color="#E74C3C" />
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
              <Building size={20} color="#E74C3C" />
              <Text style={styles.sectionTitle}>Gym Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#E74C3C" style={styles.inputIcon} />
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
              <User size={20} color="#E74C3C" style={styles.inputIcon} />
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
              <Building size={20} color="#E74C3C" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Gym name"
                placeholderTextColor="#666"
                value={gymName}
                onChangeText={setGymName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#E74C3C" style={styles.inputIcon} />
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
              <Mail size={20} color="#E74C3C" style={styles.inputIcon} />
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
                <Phone size={20} color="#E74C3C" style={styles.inputIcon} />
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
                <Globe size={20} color="#E74C3C" style={styles.inputIcon} />
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
              <MapPin size={20} color="#E74C3C" />
              <Text style={styles.sectionTitle}>Gym Location</Text>
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#E74C3C" style={styles.inputIcon} />
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
                <MapPin size={20} color="#E74C3C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#666"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#E74C3C" style={styles.inputIcon} />
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
                <MapPin size={20} color="#E74C3C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="#666"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <MapPin size={20} color="#E74C3C" style={styles.inputIcon} />
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

          {/* Business Details */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Award size={20} color="#E74C3C" />
              <Text style={styles.sectionTitle}>Business Details</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Award size={20} color="#E74C3C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Established year"
                  placeholderTextColor="#666"
                  value={establishedYear}
                  onChangeText={setEstablishedYear}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Users size={20} color="#E74C3C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Monthly fee ($)"
                  placeholderTextColor="#666"
                  value={membershipFee}
                  onChangeText={setMembershipFee}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Clock size={20} color="#E74C3C" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Opening hours (e.g., Mon-Fri 6AM-10PM)"
                placeholderTextColor="#666"
                value={openingHours}
                onChangeText={setOpeningHours}
              />
            </View>
          </LinearGradient>

          {/* Services */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Dumbbell size={20} color="#E74C3C" />
              <Text style={styles.sectionTitle}>Training Services</Text>
            </View>

            <View style={styles.servicesGrid}>
              {SERVICES.map((service) => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.serviceChip,
                    selectedServices.includes(service) && styles.serviceChipSelected
                  ]}
                  onPress={() => toggleService(service)}
                >
                  <Dumbbell 
                    size={16} 
                    color={selectedServices.includes(service) ? '#fff' : '#E74C3C'} 
                  />
                  <Text style={[
                    styles.serviceChipText,
                    selectedServices.includes(service) && styles.serviceChipTextSelected
                  ]}>
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>

          {/* Amenities */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Star size={20} color="#E74C3C" />
              <Text style={styles.sectionTitle}>Gym Amenities</Text>
            </View>

            <View style={styles.amenitiesGrid}>
              {AMENITIES.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityChip,
                    selectedAmenities.includes(amenity) && styles.amenityChipSelected
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <Star 
                    size={16} 
                    color={selectedAmenities.includes(amenity) ? '#fff' : '#E74C3C'} 
                  />
                  <Text style={[
                    styles.amenityChipText,
                    selectedAmenities.includes(amenity) && styles.amenityChipTextSelected
                  ]}>
                    {amenity}
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
              <User size={20} color="#E74C3C" />
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
              <Instagram size={20} color="#E74C3C" />
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
                colors={['#E74C3C', '#C0392B']}
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E74C3C',
    gap: 6,
  },
  serviceChipSelected: {
    backgroundColor: '#E74C3C',
  },
  serviceChipText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '500',
  },
  serviceChipTextSelected: {
    color: '#fff',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E74C3C',
    gap: 6,
  },
  amenityChipSelected: {
    backgroundColor: '#E74C3C',
  },
  amenityChipText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '500',
  },
  amenityChipTextSelected: {
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