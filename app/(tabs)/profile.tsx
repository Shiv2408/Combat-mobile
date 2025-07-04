import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import FighterProfile from '../profile/fighter-profile';
import PromoterProfile from '../profile/promoter-profile';
import GymProfile from '../profile/gym-profile';
import React from 'react';

export default function ProfileScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Render appropriate profile based on user role
  if (userData.role === 'Fighter') {
    return <FighterProfile userData={userData} />;
  } else if (userData.role === 'Gym') {
    return <GymProfile userData={userData} user={user} />;
  } else {
    return <PromoterProfile userData={userData} />;
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
  },
});