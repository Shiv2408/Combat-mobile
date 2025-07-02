import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { router } from 'expo-router';
import { Shield, Trophy, Building2, ArrowRight } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RoleSelectionScreen() {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<'Fighter' | 'Promoter' | 'Gym' | null>(null);
  const [gymName, setGymName] = useState('');
  const [loading, setLoading] = useState(false);
  const createUser = useMutation(api.users.createUser);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    if (selectedRole === 'Gym' && !gymName.trim()) {
      Alert.alert('Error', 'Please enter a gym name');
      return;
    }

    setLoading(true);
    try {
      const userData: any = {
        clerkId: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        role: selectedRole,
      };

      if (selectedRole === 'Gym') {
        userData.gymName = gymName.trim();
      }

      await createUser(userData);

      Alert.alert(
        'Welcome to Combat Domain!',
        `Your ${selectedRole.toLowerCase()} profile has been created successfully. Let's get started!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              setTimeout(() => {
                router.replace('/(tabs)');
              }, 300);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role: 'Fighter' | 'Promoter' | 'Gym') => {
    switch (role) {
      case 'Fighter':
        return 'Build your fighting career, track records, and connect with promoters worldwide';
      case 'Promoter':
        return 'Organize events, discover talent, and create unforgettable fighting experiences';
      case 'Gym':
        return 'Manage your facility, train fighters, and build a thriving fighting community';
    }
  };

  const getRoleFeatures = (role: 'Fighter' | 'Promoter' | 'Gym') => {
    switch (role) {
      case 'Fighter':
        return [
          'Track detailed fight records',
          'Showcase achievements & titles',
          'Connect with promoters',
          'Build your reputation',
          'Manage training data'
        ];
      case 'Promoter':
        return [
          'Organize fight events',
          'Scout new talent',
          'Manage event logistics',
          'Promote matches',
          'Build your brand'
        ];
      case 'Gym':
        return [
          'Manage gym operations',
          'Add staff members',
          'Train fighters',
          'Track member progress',
          'Build community'
        ];
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Shield size={40} color="#1a1a1a" />
        </View>
        <Text style={styles.title}>Choose Your Path</Text>
        <Text style={styles.subtitle}>Select your role in the fighting world</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.firstName}! Let's set up your profile.
          </Text>

          {/* Role Cards */}
          {(['Fighter', 'Promoter', 'Gym'] as const).map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.roleCard, selectedRole === role && styles.selectedCard]}
              onPress={() => setSelectedRole(role)}
              activeOpacity={0.9}
            >
              <View style={styles.roleCardContent}>
                <View style={[styles.roleIcon, selectedRole === role && styles.selectedIcon]}>
                  {role === 'Fighter' && <Shield size={32} color={selectedRole === role ? '#1a1a1a' : '#FFD700'} />}
                  {role === 'Promoter' && <Trophy size={32} color={selectedRole === role ? '#1a1a1a' : '#FFD700'} />}
                  {role === 'Gym' && <Building2 size={32} color={selectedRole === role ? '#1a1a1a' : '#FFD700'} />}
                </View>
                
                <View style={styles.roleInfo}>
                  <Text style={[styles.roleTitle, selectedRole === role && styles.selectedText]}>
                    {role}
                  </Text>
                  <Text style={[styles.roleDescription, selectedRole === role && styles.selectedDescription]}>
                    {getRoleDescription(role)}
                  </Text>
                </View>

                {selectedRole === role && (
                  <View style={styles.selectedIndicator}>
                    <ArrowRight size={20} color="#FFD700" />
                  </View>
                )}
              </View>

              {selectedRole === role && (
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>What you can do:</Text>
                  <View style={styles.features}>
                    {getRoleFeatures(role).map((feature, index) => (
                      <Text key={index} style={styles.feature}>
                        • {feature}
                      </Text>
                    ))}
                  </View>

                  {role === 'Gym' && (
                    <View style={styles.gymNameContainer}>
                      <Text style={styles.inputLabel}>Gym Name *</Text>
                      <TextInput
                        style={styles.gymNameInput}
                        placeholder="Enter your gym name"
                        placeholderTextColor="#666"
                        value={gymName}
                        onChangeText={setGymName}
                      />
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedRole || loading) && styles.buttonDisabled,
            ]}
            onPress={handleRoleSelection}
            disabled={!selectedRole || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={20} color="#1a1a1a" />
                <Text style={styles.loadingText}>Creating your profile...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.submitButtonText}>
                  {selectedRole ? `Join as ${selectedRole}` : 'Select Role'}
                </Text>
                <ArrowRight size={20} color="#1a1a1a" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.note}>
            You can update your profile information after joining
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  content: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  roleCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#FFD700',
    backgroundColor: '#333',
    transform: [{ scale: 1.02 }],
  },
  roleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIcon: {
    backgroundColor: '#FFD700',
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  selectedText: {
    color: '#FFD700',
  },
  roleDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#fff',
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  featuresContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 12,
  },
  features: {
    gap: 6,
  },
  feature: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  gymNameContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  gymNameInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});