import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { api } from '@/convex/_generated/api';
import FighterEditProfile from './edit-profile/FighterEditProfile';
import PromoterEditProfile from './edit-profile/PromoterEditProfile';
import GymEditProfile from './edit-profile/GymEditProfile';

export default function EditProfileScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (userData === null) {
      // User not found, redirect to role selection
      router.replace('/role-selection');
    }
  }, [userData]);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Render role-specific edit profile component
  switch (userData.role) {
    case 'Fighter':
      return <FighterEditProfile />;
    case 'Promoter':
      return <PromoterEditProfile />;
    case 'Gym':
      return <GymEditProfile />;
    default:
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unknown user role</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
  },
});