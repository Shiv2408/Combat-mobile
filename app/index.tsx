import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Trophy, Calendar, Users, Target, Zap, LogIn, UserPlus, ArrowRight } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import AuthModal from '../components/AuthModel';

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isNavigating, setIsNavigating] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Handle initial load completion
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 500); // Small delay to ensure smooth loading
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Handle navigation after authentication
  useEffect(() => {
    if (initialLoadComplete && user && userData && !isNavigating) {
      setIsNavigating(true);
      // Smooth transition delay
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 300);
    }
  }, [initialLoadComplete, user, userData, isNavigating]);

  // If user is authenticated but no profile data, redirect to role selection
  useEffect(() => {
    if (initialLoadComplete && user && userData === null && !isNavigating) {
      setIsNavigating(true);
      setTimeout(() => {
        router.replace('/role-selection');
      }, 300);
    }
  }, [initialLoadComplete, user, userData, isNavigating]);

  // Enhanced loading screen
  if (!isLoaded || !initialLoadComplete || (user && isNavigating)) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <View style={styles.logoContainer}>
              <Shield size={60} color="#FFD700" />
            </View>
            <Text style={styles.loadingTitle}>Combat Domain</Text>
            <ActivityIndicator size="large" color="#FFD700" style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>
              {user ? 'Preparing your dashboard...' : 'Loading your fighting community...'}
            </Text>
            {user && userData && (
              <Text style={styles.loadingSubtext}>
                Welcome back, {userData?.fightName || userData.firstName}!
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  // If user is authenticated and has profile data, they shouldn't see this screen
  if (user && userData) {
    return null;
  }

  const handleAuthAction = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalVisible(true);
  };

  const handleProtectedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      setAuthMode('signin');
      setAuthModalVisible(true);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.brandContainer}>
            <View style={styles.logo}>
              <Shield size={50} color="#FFD700" />
            </View>
            <Text style={styles.logoText}>Combat Domain</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            The Ultimate Fighting{'\n'}Community Platform
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Connect fighters, promoters, and fans in one powerful platform. 
            Track records, organize events, and build your fighting legacy.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => handleAuthAction('signup')}
              activeOpacity={0.8}
            >
              <UserPlus size={20} color="#1a1a1a" />
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <ArrowRight size={16} color="#1a1a1a" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleAuthAction('signin')}
              activeOpacity={0.8}
            >
              <LogIn size={20} color="#FFD700" />
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.heroImageOverlay} />
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Combat Domain?</Text>
        <Text style={styles.sectionSubtitle}>
          Everything you need to succeed in the fighting world
        </Text>
        
        <View style={styles.featuresGrid}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleProtectedAction(() => router.push('/(tabs)'))}
            activeOpacity={0.9}
          >
            <View style={styles.featureIconContainer}>
              <Shield size={32} color="#FFD700" />
            </View>
            <Text style={styles.featureTitle}>Fighter Profiles</Text>
            <Text style={styles.featureDescription}>
              Create comprehensive fighter profiles with records, achievements, and career stats
            </Text>
            <View style={styles.featureArrow}>
              <ArrowRight size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleProtectedAction(() => router.push('/create-event'))}
            activeOpacity={0.9}
          >
            <View style={styles.featureIconContainer}>
              <Trophy size={32} color="#FFD700" />
            </View>
            <Text style={styles.featureTitle}>Event Management</Text>
            <Text style={styles.featureDescription}>
              Organize and promote fighting events with complete venue and participant management
            </Text>
            <View style={styles.featureArrow}>
              <ArrowRight size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleProtectedAction(() => router.push('/(tabs)/calendar'))}
            activeOpacity={0.9}
          >
            <View style={styles.featureIconContainer}>
              <Calendar size={32} color="#FFD700" />
            </View>
            <Text style={styles.featureTitle}>Event Calendar</Text>
            <Text style={styles.featureDescription}>
              Never miss a fight with our comprehensive calendar of upcoming events
            </Text>
            <View style={styles.featureArrow}>
              <ArrowRight size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleProtectedAction(() => router.push('/(tabs)/community'))}
            activeOpacity={0.9}
          >
            <View style={styles.featureIconContainer}>
              <Users size={32} color="#FFD700" />
            </View>
            <Text style={styles.featureTitle}>Community</Text>
            <Text style={styles.featureDescription}>
              Connect with fighters, promoters, and fans from around the world
            </Text>
            <View style={styles.featureArrow}>
              <ArrowRight size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleProtectedAction(() => router.push('/fight-records'))}
            activeOpacity={0.9}
          >
            <View style={styles.featureIconContainer}>
              <Target size={32} color="#FFD700" />
            </View>
            <Text style={styles.featureTitle}>Fight Records</Text>
            <Text style={styles.featureDescription}>
              Track detailed fight history with wins, losses, methods, and video links
            </Text>
            <View style={styles.featureArrow}>
              <ArrowRight size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleProtectedAction(() => router.push('/all-events'))}
            activeOpacity={0.9}
          >
            <View style={styles.featureIconContainer}>
              <Zap size={32} color="#FFD700" />
            </View>
            <Text style={styles.featureTitle}>Real-time Updates</Text>
            <Text style={styles.featureDescription}>
              Get instant updates on fight results, event changes, and community activity
            </Text>
            <View style={styles.featureArrow}>
              <ArrowRight size={16} color="#FFD700" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Join the Community</Text>
        <Text style={styles.sectionSubtitle}>
          Thousands of fighters and promoters trust Combat Domain
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Active Fighters</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Events Organized</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Promoters</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of fighters and promoters building their legacy
        </Text>
        
        <View style={styles.ctaButtons}>
          <TouchableOpacity 
            style={styles.ctaPrimaryButton}
            onPress={() => handleAuthAction('signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaPrimaryButtonText}>Create Account</Text>
            <ArrowRight size={20} color="#1a1a1a" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.ctaSecondaryButton}
            onPress={() => handleAuthAction('signin')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaSecondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom spacing for better scrolling */}
      <View style={styles.bottomSpacing} />

      <AuthModal 
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        initialMode={authMode}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 32,
    textAlign: 'center',
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
  },
  hero: {
    minHeight: 700,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
    position: 'relative',
  },
  heroContent: {
    flex: 1,
    zIndex: 2,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    lineHeight: 50,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ccc',
    lineHeight: 26,
    marginBottom: 50,
  },
  heroButtons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 26,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 16,
  },
  featureArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  statsSection: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 80,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 26,
  },
  ctaButtons: {
    width: '100%',
    gap: 16,
  },
  ctaPrimaryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaPrimaryButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaSecondaryButton: {
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  ctaSecondaryButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});