import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, Target, Ruler, Weight, MapPin, Users, Dumbbell, Instagram, Facebook, Youtube, Twitter, Shield, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';
import ImagePicker from '@/components/ImagePicker';

const DISCIPLINES = ['Boxing', 'MMA', 'Kickboxing', 'Muay Thai', 'BJJ', 'Wrestling', 'Judo', 'Karate', 'Taekwondo'];
const STANCES = ['Orthodox', 'Southpaw', 'Switch'];

export default function FighterEditProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.users.updateUserProfile);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [fightName, setFightName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [reach, setReach] = useState('');
  const [gym, setGym] = useState('');
  const [headCoach, setHeadCoach] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [stance, setStance] = useState('');
  const [weightClass, setWeightClass] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bio, setBio] = useState('');
  const [nickname, setNickname] = useState('');
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
      setProfileImage(userData.profileImage || '');
      
      if (userData.roleData) {
        setFightName(userData.roleData.fightName || '');
        setAge(userData.roleData.age?.toString() || '');
        setHeight(userData.roleData.height?.toString() || '');
        setWeight(userData.roleData.weight?.toString() || '');
        setReach(userData.roleData.reach?.toString() || '');
        setGym(userData.roleData.gym || '');
        setHeadCoach(userData.roleData.headCoach || '');
        setSelectedDisciplines(userData.roleData.disciplines || []);
        setStance(userData.roleData.stance || '');
        setWeightClass(userData.roleData.weightClass || '');
        setBannerImage(userData.roleData.bannerImage || '');
        setBio(userData.roleData.bio || '');
        setNickname(userData.roleData.nickname || '');
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
        profileImage: profileImage || undefined,
      };

      const roleData: any = {};
      if (fightName.trim()) roleData.fightName = fightName.trim();
      if (age.trim()) roleData.age = parseInt(age);
      if (height.trim()) roleData.height = parseInt(height);
      if (weight.trim()) roleData.weight = parseInt(weight);
      if (reach.trim()) roleData.reach = parseInt(reach);
      if (gym.trim()) roleData.gym = gym.trim();
      if (headCoach.trim()) roleData.headCoach = headCoach.trim();
      if (selectedDisciplines.length > 0) roleData.disciplines = selectedDisciplines;
      if (stance) roleData.stance = stance;
      if (weightClass.trim()) roleData.weightClass = weightClass.trim();
      if (bannerImage) roleData.bannerImage = bannerImage;
      if (bio.trim()) roleData.bio = bio.trim();
      if (nickname.trim()) roleData.nickname = nickname.trim();

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

      Alert.alert('Success', 'Fighter profile updated successfully', [
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
          <Shield size={40} color="#4CAF50" />
          <Text style={styles.loadingText}>Loading Fighter Profile...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45a049', '#388e3c']}
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
            <Shield size={24} color="#fff" />
            <Text style={styles.title}>Fighter Profile</Text>
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
          {/* Profile Images */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Award size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Profile Images</Text>
            </View>

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
          </LinearGradient>

          {/* Basic Information */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <User size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First name *"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last name *"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#4CAF50" style={styles.inputIcon} />
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

            <View style={styles.inputContainer}>
              <Target size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Fight name (optional)"
                placeholderTextColor="#666"
                value={fightName}
                onChangeText={setFightName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Target size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nickname (optional)"
                placeholderTextColor="#666"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Age (optional)"
                placeholderTextColor="#666"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </LinearGradient>

          {/* Physical Stats */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Ruler size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Physical Stats</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ruler size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Height (inches)"
                  placeholderTextColor="#666"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Weight size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Weight (lbs)"
                  placeholderTextColor="#666"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ruler size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Reach (inches)"
                  placeholderTextColor="#666"
                  value={reach}
                  onChangeText={setReach}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Target size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Weight class"
                  placeholderTextColor="#666"
                  value={weightClass}
                  onChangeText={setWeightClass}
                />
              </View>
            </View>

            {/* Stance Selection */}
            <Text style={styles.inputLabel}>Fighting Stance</Text>
            <View style={styles.stanceContainer}>
              {STANCES.map((stanceOption) => (
                <TouchableOpacity
                  key={stanceOption}
                  style={[
                    styles.stanceButton,
                    stance === stanceOption && styles.stanceButtonSelected
                  ]}
                  onPress={() => setStance(stance === stanceOption ? '' : stanceOption)}
                >
                  <Text style={[
                    styles.stanceButtonText,
                    stance === stanceOption && styles.stanceButtonTextSelected
                  ]}>
                    {stanceOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>

          {/* Training Information */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Training Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Gym/Training facility (optional)"
                placeholderTextColor="#666"
                value={gym}
                onChangeText={setGym}
              />
            </View>

            <View style={styles.inputContainer}>
              <Users size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Head coach (optional)"
                placeholderTextColor="#666"
                value={headCoach}
                onChangeText={setHeadCoach}
              />
            </View>

            {/* Disciplines */}
            <Text style={styles.inputLabel}>Fighting Disciplines</Text>
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
                    color={selectedDisciplines.includes(discipline) ? '#fff' : '#4CAF50'} 
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
          </LinearGradient>

          {/* Bio */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <User size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Fighter Biography</Text>
            </View>

            <View style={styles.bioContainer}>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell us about your fighting journey, achievements, and goals..."
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
              <Instagram size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Social Media</Text>
            </View>

            <View style={styles.inputContainer}>
              <Instagram size={20} color="#E4405F" style={styles.inputIcon} />
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
              <Facebook size={20} color="#1877F2" style={styles.inputIcon} />
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
              <Youtube size={20} color="#FF0000" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="YouTube channel (optional)"
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
                placeholder="Twitter handle (optional)"
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
                colors={['#4CAF50', '#45a049']}
                style={styles.updateButtonGradient}
              >
                <Save size={20} color="#fff" />
                <Text style={styles.updateButtonText}>
                  {loading ? 'Updating...' : 'Update Fighter Profile'}
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
  stanceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stanceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  stanceButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  stanceButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  stanceButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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
    borderColor: '#4CAF50',
    gap: 6,
  },
  disciplineChipSelected: {
    backgroundColor: '#4CAF50',
  },
  disciplineChipText: {
    color: '#4CAF50',
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