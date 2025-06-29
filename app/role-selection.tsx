import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { router } from 'expo-router';
import { Shield, Trophy, Building2 } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
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
        'Success!',
        `Welcome to the fighting community as a ${selectedRole}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Shield size={40} color="#FFD700" />
        </View>
        <Text style={styles.title}>Choose Your Path</Text>
        <Text style={styles.subtitle}>Select your role in the fighting world</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Fighter Card */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'Fighter' && styles.selectedCard]}
            onPress={() => setSelectedRole('Fighter')}
          >
            <View style={[styles.roleIcon, selectedRole === 'Fighter' && styles.selectedIcon]}>
              <Shield size={32} color={selectedRole === 'Fighter' ? '#1a1a1a' : '#FFD700'} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'Fighter' && styles.selectedText]}>
              Fighter
            </Text>
            <Text style={[styles.roleDescription, selectedRole === 'Fighter' && styles.selectedDescription]}>
              Showcase your skills, find matches, and build your fighting career
            </Text>
            <View style={styles.features}>
              <Text style={[styles.feature, selectedRole === 'Fighter' && styles.selectedFeature]}>
                • Track fight records
              </Text>
              <Text style={[styles.feature, selectedRole === 'Fighter' && styles.selectedFeature]}>
                • Connect with promoters
              </Text>
              <Text style={[styles.feature, selectedRole === 'Fighter' && styles.selectedFeature]}>
                • Build your reputation
              </Text>
            </View>
          </TouchableOpacity>

          {/* Promoter Card */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'Promoter' && styles.selectedCard]}
            onPress={() => setSelectedRole('Promoter')}
          >
            <View style={[styles.roleIcon, selectedRole === 'Promoter' && styles.selectedIcon]}>
              <Trophy size={32} color={selectedRole === 'Promoter' ? '#1a1a1a' : '#FFD700'} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'Promoter' && styles.selectedText]}>
              Promoter
            </Text>
            <Text style={[styles.roleDescription, selectedRole === 'Promoter' && styles.selectedDescription]}>
              Organize events, discover talent, and promote exciting matches
            </Text>
            <View style={styles.features}>
              <Text style={[styles.feature, selectedRole === 'Promoter' && styles.selectedFeature]}>
                • Organize fight events
              </Text>
              <Text style={[styles.feature, selectedRole === 'Promoter' && styles.selectedFeature]}>
                • Scout new talent
              </Text>
              <Text style={[styles.feature, selectedRole === 'Promoter' && styles.selectedFeature]}>
                • Manage fighters
              </Text>
            </View>
          </TouchableOpacity>

          {/* Gym Owner Card */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'Gym' && styles.selectedCard]}
            onPress={() => setSelectedRole('Gym')}
          >
            <View style={[styles.roleIcon, selectedRole === 'Gym' && styles.selectedIcon]}>
              <Building2 size={32} color={selectedRole === 'Gym' ? '#1a1a1a' : '#FFD700'} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'Gym' && styles.selectedText]}>
              Gym Owner
            </Text>
            <Text style={[styles.roleDescription, selectedRole === 'Gym' && styles.selectedDescription]}>
              Manage your gym, train fighters, and build a fighting community
            </Text>
            <View style={styles.features}>
              <Text style={[styles.feature, selectedRole === 'Gym' && styles.selectedFeature]}>
                • Manage gym operations
              </Text>
              <Text style={[styles.feature, selectedRole === 'Gym' && styles.selectedFeature]}>
                • Add staff members
              </Text>
              <Text style={[styles.feature, selectedRole === 'Gym' && styles.selectedFeature]}>
                • Train fighters
              </Text>
            </View>

            {selectedRole === 'Gym' && (
              <View style={styles.gymNameContainer}>
                <TextInput
                  style={styles.gymNameInput}
                  placeholder="Enter gym name"
                  placeholderTextColor="#666"
                  value={gymName}
                  onChangeText={setGymName}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedRole || loading) && styles.buttonDisabled,
            ]}
            onPress={handleRoleSelection}
            disabled={!selectedRole || loading}
          >
            {loading ? (
              <LoadingSpinner size={20} color="#1a1a1a" />
            ) : (
              <Text style={styles.submitButtonText}>
                {selectedRole ? `Join as ${selectedRole}` : 'Select Role'}
              </Text>
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
    backgroundColor: '#FFD700',
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
    paddingTop: 40,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },
  roleCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
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
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedIcon: {
    backgroundColor: '#FFD700',
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  selectedText: {
    color: '#FFD700',
  },
  roleDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  selectedDescription: {
    color: '#fff',
  },
  features: {
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  selectedFeature: {
    color: '#FFD700',
  },
  gymNameContainer: {
    width: '100%',
    marginTop: 16,
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
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
