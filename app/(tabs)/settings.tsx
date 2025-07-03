import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { LogOut, CreditCard as Edit, Shield, CircleHelp as HelpCircle, Bell, Moon } from 'lucide-react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react'; // or your query hook
import { api } from '@/convex/_generated/api'; // adjust path if needed
export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : "skip");

   const handleEditProfile = () => {
    if (!userData) return;

    const role = userData.role;

    if (role === 'Fighter') {
      router.push('/editProfile/FighterEditProfile');
    } else if (role === 'Promoter') {
      router.push('/editProfile/PromoterEditProfile');
    } else if (role === 'Gym') {
      router.push('/editProfile/GymEditProfile');
    } else {
      Alert.alert("Unknown Role", "We couldn't determine your profile type.");
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
     {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: Edit,
      onPress: handleEditProfile,
    },
    {
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      onPress: () => {},
    },
    {
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: Shield,
      onPress: () => {},
    },
    {
      title: 'Dark Mode',
      subtitle: 'Toggle dark mode theme',
      icon: Moon,
      onPress: () => {},
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <option.icon size={20} color="#FFD700" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            style={[styles.optionItem, styles.signOutItem]}
            onPress={handleSignOut}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, styles.signOutIcon]}>
                <LogOut size={20} color="#FF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, styles.signOutText]}>Sign Out</Text>
                <Text style={styles.optionSubtitle}>Sign out of your account</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  optionItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  signOutItem: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  signOutIcon: {
    backgroundColor: '#FF4444',
  },
  signOutText: {
    color: '#FF4444',
  },
});