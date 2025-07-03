import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Trophy, Calendar, Users, Target, Zap, LogIn, UserPlus, ArrowRight, MapPin, Clock, Building2, Star, TrendingUp } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import AuthModal from '../components/AuthModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isNavigating, setIsNavigating] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [randomCards, setRandomCards] = useState<{
    fighter: any;
    event: any;
    gym: any;
  } | null>(null);
  
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Fetch data for statistics and random cards
  const allFighters = useQuery(api.fighters.getAllFighters, { limit: 50 });
  const allEvents = useQuery(api.events.getAllEvents);
  const allGyms = useQuery(api.gyms.getAllGyms, { limit: 50 });

  // Handle initial load completion
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Handle navigation after authentication
  useEffect(() => {
    if (initialLoadComplete && user && userData && !isNavigating) {
      setIsNavigating(true);
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

  // Generate random cards when data is available
  useEffect(() => {
    if (allFighters && allEvents && allGyms) {
      const fightersArray = Array.isArray(allFighters) ? allFighters : allFighters?.page || [];
      const gymsArray = Array.isArray(allGyms) ? allGyms : [];
      
      const randomFighter = fightersArray.length > 0 
        ? fightersArray[Math.floor(Math.random() * fightersArray.length)]
        : null;
      
      const randomEvent = allEvents.length > 0 
        ? allEvents[Math.floor(Math.random() * allEvents.length)]
        : null;
      
      const randomGym = gymsArray.length > 0 
        ? gymsArray[Math.floor(Math.random() * gymsArray.length)]
        : null;

      setRandomCards({
        fighter: randomFighter,
        event: randomEvent,
        gym: randomGym
      });
    }
  }, [allFighters, allEvents, allGyms]);

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
                Welcome back, {userData.roleData?.fightName || userData.roleData?.gymName || userData.firstName}!
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

  // Calculate statistics
  const totalFighters = Array.isArray(allFighters) ? allFighters.length : allFighters?.page?.length || 0;
  const totalEvents = allEvents?.length || 0;
  const totalGyms = Array.isArray(allGyms) ? allGyms.length : 0;
  const upcomingEvents = allEvents?.filter(e => e.status === 'Upcoming').length || 0;

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

      {/* Dynamic Statistics Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsHeader}>
          <TrendingUp size={32} color="#FFD700" />
          <Text style={styles.statsTitle}>Live Community Stats</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.statGradient}
            >
              <Shield size={28} color="#1a1a1a" />
              <Text style={styles.statNumber}>{totalFighters}</Text>
              <Text style={styles.statLabel}>Active Fighters</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.statGradient}
            >
              <Calendar size={28} color="#fff" />
              <Text style={[styles.statNumber, { color: '#fff' }]}>{upcomingEvents}</Text>
              <Text style={[styles.statLabel, { color: '#fff' }]}>Upcoming Events</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.statGradient}
            >
              <Building2 size={28} color="#fff" />
              <Text style={[styles.statNumber, { color: '#fff' }]}>{totalGyms}</Text>
              <Text style={[styles.statLabel, { color: '#fff' }]}>Training Gyms</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Random Featured Cards Section */}
      {randomCards && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Today</Text>
          <Text style={styles.sectionSubtitle}>
            Discover amazing fighters, events, and gyms from our community
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
            {/* Random Fighter Card */}
            {randomCards.fighter && (
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => handleProtectedAction(() => router.push(`/user-profile?id=${randomCards.fighter.clerkId}`))}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardAvatar}>
                    <Text style={styles.cardAvatarText}>
                      {randomCards.fighter.firstName?.[0]}{randomCards.fighter.lastName?.[0]}
                    </Text>
                  </View>
                  <View style={styles.cardBadge}>
                    <Shield size={12} color="#1a1a1a" />
                    <Text style={styles.cardBadgeText}>Fighter</Text>
                  </View>
                </View>
                
                <Text style={styles.cardTitle}>
                  {randomCards.fighter.fightName || `${randomCards.fighter.firstName} ${randomCards.fighter.lastName}`}
                </Text>
                
                {randomCards.fighter.gym && (
                  <View style={styles.cardDetail}>
                    <MapPin size={14} color="#ccc" />
                    <Text style={styles.cardDetailText}>{randomCards.fighter.gym}</Text>
                  </View>
                )}
                
                {randomCards.fighter.disciplines && randomCards.fighter.disciplines.length > 0 && (
                  <View style={styles.disciplinesContainer}>
                    {randomCards.fighter.disciplines.slice(0, 2).map((discipline: string, index: number) => (
                      <View key={index} style={styles.disciplineTag}>
                        <Text style={styles.disciplineText}>{discipline}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.cardFooter}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.cardFooterText}>Featured Fighter</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Random Event Card */}
            {randomCards.event && (
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => handleProtectedAction(() => router.push(`/event-details?id=${randomCards.event._id}`))}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=100' }}
                    style={styles.cardImage}
                  />
                  <View style={[styles.cardBadge, { backgroundColor: '#4CAF50' }]}>
                    <Calendar size={12} color="#fff" />
                    <Text style={[styles.cardBadgeText, { color: '#fff' }]}>Event</Text>
                  </View>
                </View>
                
                <Text style={styles.cardTitle}>{randomCards.event.eventName}</Text>
                
                <View style={styles.cardDetail}>
                  <Clock size={14} color="#ccc" />
                  <Text style={styles.cardDetailText}>{randomCards.event.eventDate}</Text>
                </View>
                
                <View style={styles.cardDetail}>
                  <MapPin size={14} color="#ccc" />
                  <Text style={styles.cardDetailText}>
                    {randomCards.event.venue}, {randomCards.event.city}
                  </Text>
                </View>
                
                <View style={styles.cardFooter}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.cardFooterText}>Featured Event</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Random Gym Card */}
            {randomCards.gym && (
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => handleProtectedAction(() => router.push(`/user-profile?id=${randomCards.gym.clerkId}`))}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardAvatar}>
                    <Text style={styles.cardAvatarText}>
                      {randomCards.gym.gymName?.[0] || 'G'}
                    </Text>
                  </View>
                  <View style={[styles.cardBadge, { backgroundColor: '#2196F3' }]}>
                    <Building2 size={12} color="#fff" />
                    <Text style={[styles.cardBadgeText, { color: '#fff' }]}>Gym</Text>
                  </View>
                </View>
                
                <Text style={styles.cardTitle}>{randomCards.gym.gymName}</Text>
                
                {randomCards.gym.address?.city && (
                  <View style={styles.cardDetail}>
                    <MapPin size={14} color="#ccc" />
                    <Text style={styles.cardDetailText}>
                      {randomCards.gym.address.city}, {randomCards.gym.address.country}
                    </Text>
                  </View>
                )}
                
                {randomCards.gym.disciplines && randomCards.gym.disciplines.length > 0 && (
                  <View style={styles.disciplinesContainer}>
                    {randomCards.gym.disciplines.slice(0, 2).map((discipline: string, index: number) => (
                      <View key={index} style={styles.disciplineTag}>
                        <Text style={styles.disciplineText}>{discipline}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.cardFooter}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.cardFooterText}>Featured Gym</Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

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
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    backgroundColor: '#2a2a2a',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  featuredSection: {
    paddingVertical: 60,
    paddingLeft: 24,
  },
  cardsContainer: {
    marginTop: 32,
  },
  featuredCard: {
    width: 280,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardDetailText: {
    fontSize: 14,
    color: '#ccc',
  },
  disciplinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  disciplineTag: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  disciplineText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  cardFooterText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
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
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 80,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
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