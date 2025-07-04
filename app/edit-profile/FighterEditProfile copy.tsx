import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, Target, Ruler, Weight, MapPin, Users, Dumbbell, Instagram, Facebook, Youtube, Twitter, Zap, Shield, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';
import ImagePicker from '@/components/ImagePicker';

const DISCIPLINES = ['Boxing', 'MMA', 'Kickboxing', 'Muay Thai', 'BJJ', 'Wrestling', 'Judo', 'Karate', 'Taekwondo', 'Sambo', 'Krav Maga'];
const WEIGHT_CLASSES = ['Strawweight', 'Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight', 'Super Heavyweight'];
const STANCES = ['Orthodox', 'Southpaw', 'Switch'];

export default function FighterEditProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.fighters.getFighterProfile,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateUser = useMutation(api.fighters.updateFighterProfile);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [fightName, setFightName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [reach, setReach] = useState('');
  const [weightClass, setWeightClass] = useState('');
  const [stance, setStance] = useState('');
  const [gym, setGym] = useState('');
  const [headCoach, setHeadCoach] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setFightName(userData.fightName || '');
      setNickname(userData.nickname || '');
      setAge(userData.age?.toString() || '');
      setHeight(userData.height?.toString() || '');
      setWeight(userData.weight?.toString() || '');
      setReach(userData.reach?.toString() || '');
      setWeightClass(userData.weightClass || '');
      setStance(userData.stance || '');
      setGym(userData.gym || '');
      setHeadCoach(userData.headCoach || '');
      setSelectedDisciplines(userData.disciplines || []);
      setProfileImage(userData.profileImage || '');
      setBannerImage(userData.bannerImage || '');
      setBio(userData.bio || '');
      setInstagram(userData.socials?.instagram || '');
      setFacebook(userData.socials?.facebook || '');
      setYoutube(userData.socials?.youtube || '');
      setTwitter(userData.socials?.twitter || '');
      setIsActive(userData.isActive ?? true);
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

    setLoading(true);

    try {
      const updateData: any = {
        clerkId: user.id,
      };

      if (fightName.trim()) updateData.fightName = fightName.trim();
      if (nickname.trim()) updateData.nickname = nickname.trim();
      if (age.trim()) updateData.age = parseInt(age);
      if (height.trim()) updateData.height = parseInt(height);
      if (weight.trim()) updateData.weight = parseInt(weight);
      if (reach.trim()) updateData.reach = parseInt(reach);
      if (weightClass) updateData.weightClass = weightClass;
      if (stance) updateData.stance = stance;
      if (gym.trim()) updateData.gym = gym.trim();
      if (headCoach.trim()) updateData.headCoach = headCoach.trim();
      if (selectedDisciplines.length > 0) updateData.disciplines = selectedDisciplines;
      if (profileImage) updateData.profileImage = profileImage;
      if (bannerImage) updateData.bannerImage = bannerImage;
      if (bio.trim()) updateData.bio = bio.trim();
      updateData.isActive = isActive;

      const socials: any = {};
      if (instagram.trim()) socials.instagram = instagram.trim();
      if (facebook.trim()) socials.facebook = facebook.trim();
      if (youtube.trim()) socials.youtube = youtube.trim();
      if (twitter.trim()) socials.twitter = twitter.trim();
      if (Object.keys(socials).length > 0) updateData.socials = socials;

      await updateUser(updateData);

      Alert.alert('Success', 'Fighter profile updated successfully', [
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
          <Activity size={40} color="#FFD700" />
          <Text style={styles.loadingText}>Loading Fighter Profile...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFD700', '#FFA000', '#FF8F00']}
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
            <Shield size={24} color="#1a1a1a" />
            <Text style={styles.title}>Fighter Profile</Text>
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
          {/* Profile Images */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Zap size={20} color="#FFD700" />
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

          {/* Fighter Identity */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <User size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Fighter Identity</Text>
            </View>

            <View style={styles.inputContainer}>
              <User size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First name *"
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
                placeholder="Last name *"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Target size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Fight name"
                placeholderTextColor="#666"
                value={fightName}
                onChangeText={setFightName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Zap size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nickname"
                placeholderTextColor="#666"
                value={nickname}
                onChangeText={setNickname}
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
                editable={false}
              />
            </View>
          </LinearGradient>

          {/* Physical Stats */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Physical Stats</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <User size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor="#666"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ruler size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Height (in)"
                  placeholderTextColor="#666"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Weight size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Weight (lbs)"
                  placeholderTextColor="#666"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ruler size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Reach (in)"
                  placeholderTextColor="#666"
                  value={reach}
                  onChangeText={setReach}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Weight Class Selector */}
            <Text style={styles.inputLabel}>Weight Class</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <View style={styles.optionsContainer}>
                {WEIGHT_CLASSES.map((wc) => (
                  <TouchableOpacity
                    key={wc}
                    style={[
                      styles.optionChip,
                      weightClass === wc && styles.optionChipSelected
                    ]}
                    onPress={() => setWeightClass(weightClass === wc ? '' : wc)}
                  >
                    <Text style={[
                      styles.optionChipText,
                      weightClass === wc && styles.optionChipTextSelected
                    ]}>
                      {wc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Stance Selector */}
            <Text style={styles.inputLabel}>Fighting Stance</Text>
            <View style={styles.stanceContainer}>
              {STANCES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.stanceChip,
                    stance === s && styles.stanceChipSelected
                  ]}
                  onPress={() => setStance(stance === s ? '' : s)}
                >
                  <Text style={[
                    styles.stanceChipText,
                    stance === s && styles.stanceChipTextSelected
                  ]}>
                    {s}
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
              <MapPin size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Training Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Gym/Training facility"
                placeholderTextColor="#666"
                value={gym}
                onChangeText={setGym}
              />
            </View>

            <View style={styles.inputContainer}>
              <Users size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Head coach"
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
          </LinearGradient>

          {/* Bio */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.sectionHeader}>
              <User size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Biography</Text>
            </View>

            <View style={styles.bioContainer}>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell your story as a fighter..."
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
                placeholder="Instagram username"
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
                placeholder="Facebook profile"
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

          {/* Status & Actions */}
          <LinearGradient
            colors={['#2a2a2a', '#1f1f1f']}
            style={styles.form}
          >
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Fighter Status</Text>
              <TouchableOpacity
                style={[styles.statusToggle, isActive && styles.statusToggleActive]}
                onPress={() => setIsActive(!isActive)}
              >
                <View style={[styles.statusIndicator, isActive && styles.statusIndicatorActive]} />
                <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
                  {isActive ? 'Active' : 'Inactive'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.updateButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA000']}
                style={styles.updateButtonGradient}
              >
                <Save size={20} color="#1a1a1a" />
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
  horizontalScroll: {
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 24,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  optionChipSelected: {
    backgroundColor: '#FFD700',
  },
  optionChipText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#1a1a1a',
  },
  stanceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  stanceChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  stanceChipSelected: {
    backgroundColor: '#FFD700',
  },
  stanceChipText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  stanceChipTextSelected: {
    color: '#1a1a1a',
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
    gap: 6,
  },
  disciplineChipSelected: {
    backgroundColor: '#FFD700',
  },
  disciplineChipText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  disciplineChipTextSelected: {
    color: '#1a1a1a',
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#444',
  },
  statusToggleActive: {
    backgroundColor: '#4CAF50',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  statusIndicatorActive: {
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusTextActive: {
    color: '#fff',
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
});