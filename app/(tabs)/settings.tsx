import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { LogOut, CreditCard as Edit, Shield, CircleHelp as HelpCircle, Bell, Moon, Settings as SettingsIcon } from 'lucide-react-native';

export default function SettingsScreen() {
  const { signOut } = useAuth();

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
              // User will be redirected to homepage automatically
              router.replace('/');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
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
      onPress: () => router.push('/edit-profile'),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.'),
    },
    {
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: Shield,
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.'),
    },
    {
      title: 'Dark Mode',
      subtitle: 'Toggle dark mode theme',
      icon: Moon,
      onPress: () => Alert.alert('Coming Soon', 'Theme settings will be available soon.'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      onPress: () => Alert.alert('Support', 'Contact us at support@combatdomain.com'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <SettingsIcon size={32} color="#1a1a1a" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
              activeOpacity={0.8}
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
            activeOpacity={0.8}
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
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
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
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  signOutText: {
    color: '#FF4444',
  },
});