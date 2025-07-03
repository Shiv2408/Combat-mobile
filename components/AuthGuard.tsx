import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Shield, LogIn, UserPlus, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a1a', '#2a2a2a']}
          style={styles.loadingGradient}
        >
          <View style={styles.logoContainer}>
            <Shield size={60} color="#FFD700" />
          </View>
          <Text style={styles.loadingTitle}>Combat Domain</Text>
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a1a', '#2a2a2a']}
          style={styles.gradient}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Shield size={80} color="#FFD700" />
              <View style={styles.logoGlow} />
            </View>
            
            <Text style={styles.title}>Access Restricted</Text>
            <Text style={styles.subtitle}>
              Join the ultimate fighting community platform to access exclusive features, 
              connect with fighters worldwide, and build your combat legacy.
            </Text>

            {/* Feature Highlights */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Shield size={24} color="#FFD700" />
                <Text style={styles.featureText}>Fighter Profiles & Records</Text>
              </View>
              <View style={styles.featureItem}>
                <UserPlus size={24} color="#FFD700" />
                <Text style={styles.featureText}>Event Management</Text>
              </View>
              <View style={styles.featureItem}>
                <LogIn size={24} color="#FFD700" />
                <Text style={styles.featureText}>Community Network</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/sign-up' as any)}
              activeOpacity={0.8}
            >
              <UserPlus size={20} color="#1a1a1a" />
              <Text style={styles.primaryButtonText}>Join Combat Domain</Text>
              <ArrowRight size={16} color="#1a1a1a" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/sign-in' as any)}
              activeOpacity={0.8}
            >
              <LogIn size={20} color="#FFD700" />
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => router.push('/')}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>

          {/* Background Image */}
          <View style={styles.backgroundImageContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.backgroundImage}
            />
            <View style={styles.backgroundOverlay} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 24,
    marginBottom: 16,
  },
  loadingText: {
    color: '#ccc',
    fontSize: 16,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 2,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    maxWidth: 400,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    gap: 12,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
    gap: 16,
    zIndex: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    gap: 12,
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  homeButtonText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    opacity: 0.3,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
  },
});