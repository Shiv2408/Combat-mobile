import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Trophy, Users, Calendar, TrendingUp, Zap, Target, Chrome, UserPlus, Shield, Building2, Star, Award, MapPin, Clock, Dumbbell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';

export default function HomeScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  const fighterData = useQuery(
    api.fighters.getFighterProfile,
    user?.id && userData?.role === 'Fighter' ? { clerkId: user.id } : "skip"
  );

  const promoterData = useQuery(
    api.promoters.getPromoterProfile,
    user?.id && userData?.role === 'Promoter' ? { clerkId: user.id } : "skip"
  );

  const gymData = useQuery(
    api.gyms.getGymProfile,
    user?.id && userData?.role === 'Gym' ? { clerkId: user.id } : "skip"
  );

  const fighterStats = useQuery(
    api.fighters.getFighterStatistics,
    user?.id && userData?.role === 'Fighter' ? { clerkId: user.id } : "skip"
  );

  const allFighters = useQuery(api.fighters.getAllFighters, { limit: 10 });
  const allPromoters = useQuery(api.promoters.getAllPromoters, { limit: 10 });
  const allEvents = useQuery(api.events.getAllEvents);
  const recentFights = useQuery(api.fights.getRecentFights, { limit: 5 });

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#FFD700', '#FFA000']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#1a1a1a" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </LinearGradient>
      </View>
    );
  }

  const isFighter = userData.role === 'Fighter';
  const isPromoter = userData.role === 'Promoter';
  const isGym = userData.role === 'Gym';
  
  const totalFighters = Array.isArray(allFighters) ? allFighters.length : allFighters?.page?.length || 0;
  const totalPromoters = Array.isArray(allPromoters) ? allPromoters.length : 0;
  const totalEvents = allEvents?.length || 0;
  const upcomingEvents = allEvents?.filter(e => e.status === 'Upcoming').length || 0;

  const getDisplayName = () => {
    if (isFighter && fighterData?.fightName) {
      return fighterData.fightName;
    }
    if (isGym && gymData?.gymName) {
      return gymData.gymName;
    }
    if (isPromoter && promoterData?.companyName) {
      return promoterData.companyName;
    }
    return `${userData.firstName} ${userData.lastName}`;
  };

  const getProfileImage = () => {
    if (isFighter && fighterData?.profileImage) return fighterData.profileImage;
    if (isPromoter && promoterData?.bannerImage) return promoterData.bannerImage;
    if (isGym && gymData?.bannerImage) return gymData.bannerImage;
    return userData.profileImage;
  };

  const getRoleSpecificStats = () => {
    if (isFighter && fighterStats) {
      return [
        { label: 'Total Fights', value: fighterStats.totalFights || 0, color: '#FFD700', icon: Target },
        { label: 'Wins', value: fighterStats.wins || 0, color: '#4CAF50', icon: Trophy },
        { label: 'Win Rate', value: `${fighterStats.totalFights > 0 ? Math.round((fighterStats.wins / fighterStats.totalFights) * 100) : 0}%`, color: '#2196F3', icon: TrendingUp },
        { label: 'KO/TKO', value: fighterStats.koTkoWins || 0, color: '#FF6B6B', icon: Zap }
      ];
    } else if (isPromoter) {
      const promoterEvents = allEvents?.filter(e => e.promoterId === user?.id) || [];
      return [
        { label: 'Total Events', value: promoterEvents.length, color: '#FFD700', icon: Calendar },
        { label: 'Upcoming', value: promoterEvents.filter(e => e.status === 'Upcoming').length, color: '#4CAF50', icon: Clock },
        { label: 'Completed', value: promoterEvents.filter(e => e.status === 'Completed').length, color: '#2196F3', icon: Award },
        { label: 'Years Active', value: promoterData?.yearsExperience || 0, color: '#9C27B0', icon: Star }
      ];
    } else if (isGym) {
      return [
        { label: 'Staff Members', value: gymData?.staff?.length || 0, color: '#FFD700', icon: Users },
        { label: 'Disciplines', value: gymData?.disciplines?.length || 0, color: '#4CAF50', icon: Dumbbell },
        { label: 'Facilities', value: gymData?.facilities?.length || 0, color: '#2196F3', icon: Building2 },
        { label: 'Memberships', value: gymData?.membershipTypes?.length || 0, color: '#FF9800', icon: Star }
      ];
    }
    return [];
  };

  const getRoleSpecificActions = () => {
    if (isFighter) {
      return [
        {
          title: 'Fight Records',
          subtitle: 'Track your career',
          icon: Target,
          route: '/fight-records',
          gradient: ['#FF6B6B', '#FF8E53']
        },
        {
          title: 'Achievements',
          subtitle: 'Manage titles',
          icon: Trophy,
          route: '/achievements',
          gradient: ['#FFD700', '#FFA000']
        },
        {
          title: 'Training Log',
          subtitle: 'Track progress',
          icon: Dumbbell,
          route: '/training',
          gradient: ['#4CAF50', '#45A049']
        }
      ];
    } else if (isPromoter) {
      return [
        {
          title: 'Create Event',
          subtitle: 'Organize matches',
          icon: Calendar,
          route: '/create-event',
          gradient: ['#2196F3', '#1976D2']
        },
        {
          title: 'My Events',
          subtitle: 'Manage events',
          icon: Chrome,
          route: '/promoter-events',
          gradient: ['#FF9800', '#F57C00']
        },
        {
          title: 'Find Fighters',
          subtitle: 'Scout talent',
          icon: Users,
          route: '/scout-fighters',
          gradient: ['#9C27B0', '#7B1FA2']
        }
      ];
    } else {
      return [
        {
          title: 'Gym Members',
          subtitle: 'Manage members',
          icon: Users,
          route: '/gym-members',
          gradient: ['#9C27B0', '#7B1FA2']
        },
        {
          title: 'Staff Management',
          subtitle: 'Manage staff',
          icon: UserPlus,
          route: '/gym-staff',
          gradient: ['#607D8B', '#455A64']
        },
        {
          title: 'Facilities',
          subtitle: 'Equipment & spaces',
          icon: Building2,
          route: '/facilities',
          gradient: ['#795548', '#5D4037']
        }
      ];
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#FFD700', '#FFA000', '#FF8F00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{getDisplayName()}</Text>
            <View style={styles.roleContainer}>
              {isFighter && <Shield size={16} color="#1a1a1a" />}
              {isPromoter && <Trophy size={16} color="#1a1a1a" />}
              {isGym && <Building2 size={16} color="#1a1a1a" />}
              <Text style={styles.roleText}>{userData.role}</Text>
              {(isPromoter && promoterData?.isVerified) || (isGym && gymData?.isVerified) ? (
                <Star size={14} color="#1a1a1a" fill="#1a1a1a" />
              ) : null}
            </View>
            {isFighter && fighterData?.nickname && (
              <Text style={styles.nickname}>"{fighterData.nickname}"</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {getProfileImage() ? (
              <Image 
                source={{ uri: getProfileImage() }} 
                style={styles.profileImage}
              />
            ) : (
              <LinearGradient
                colors={['#2a2a2a', '#1a1a1a']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {userData.firstName?.[0]}{userData.lastName?.[0]}
                </Text>
              </LinearGradient>
            )}
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Global Stats Cards */}
      <View style={styles.globalStatsContainer}>
        <Text style={styles.sectionTitle}>Community Overview</Text>
        <View style={styles.statsGrid}>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statsCard}>
            <Users size={28} color="#FFD700" />
            <Text style={styles.statsNumber}>{totalFighters}</Text>
            <Text style={styles.statsLabel}>Active Fighters</Text>
          </LinearGradient>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statsCard}>
            <Trophy size={28} color="#FFD700" />
            <Text style={styles.statsNumber}>{totalPromoters}</Text>
            <Text style={styles.statsLabel}>Promoters</Text>
          </LinearGradient>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statsCard}>
            <Calendar size={28} color="#FFD700" />
            <Text style={styles.statsNumber}>{upcomingEvents}</Text>
            <Text style={styles.statsLabel}>Upcoming Events</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Personal Stats */}
      <View style={styles.personalStatsContainer}>
        <Text style={styles.sectionTitle}>Your Performance</Text>
        <LinearGradient
          colors={['#2a2a2a', '#1a1a1a']}
          style={styles.personalStatsCard}
        >
          <View style={styles.statsRow}>
            {getRoleSpecificStats().map((stat, index) => (
              <View key={`stat-${index}`} style={styles.personalStat}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={[styles.personalStatNumber, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.personalStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.primaryActionCard}
            onPress={() => router.push('/all-users')}
          >
            <LinearGradient
              colors={['#4CAF50', '#45A049']}
              style={styles.actionGradient}
            >
              <UserPlus size={32} color="#fff" />
              <Text style={styles.primaryActionTitle}>Browse Community</Text>
              <Text style={styles.primaryActionSubtitle}>Connect with fighters & promoters</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryActionCard}
            onPress={() => router.push('/all-events')}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.actionGradient}
            >
              <Calendar size={32} color="#fff" />
              <Text style={styles.primaryActionTitle}>Upcoming Events</Text>
              <Text style={styles.primaryActionSubtitle}>Discover fights near you</Text>
            </LinearGradient>
          </TouchableOpacity>

          {getRoleSpecificActions().map((action, index) => (
            <TouchableOpacity 
              key={`action-${index}`}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <LinearGradient
                colors={action.gradient as [string, string]}
                style={styles.actionGradient}
              >
                <action.icon size={28} color="#fff" />
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityFeed}>
          {recentFights?.slice(0, 3).map((fight, index) => (
            <LinearGradient
              key={`fight-${index}`}
              colors={['#2a2a2a', '#1a1a1a']}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <View style={[styles.activityIcon, { backgroundColor: fight.result === 'Win' ? '#4CAF50' : fight.result === 'Loss' ? '#F44336' : '#FF9800' }]}>
                  <Target size={20} color="#fff" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{fight.eventName}</Text>
                  <Text style={styles.activitySubtitle}>vs {fight.opponent}</Text>
                  <View style={styles.activityMeta}>
                    <MapPin size={12} color="#ccc" />
                    <Text style={styles.activityLocation}>{fight.city}, {fight.country}</Text>
                  </View>
                </View>
                <View style={[styles.resultBadge, { backgroundColor: fight.result === 'Win' ? '#4CAF50' : fight.result === 'Loss' ? '#F44336' : '#FF9800' }]}>
                  <Text style={styles.resultText}>{fight.result}</Text>
                </View>
              </View>
            </LinearGradient>
          ))}
          
          {/* Placeholder activities if no recent fights */}
          {(!recentFights || recentFights.length === 0) && (
            <>
              <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={[styles.activityIcon, { backgroundColor: '#FFD700' }]}>
                    <Zap size={20} color="#1a1a1a" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Profile Updated</Text>
                    <Text style={styles.activitySubtitle}>Enhanced your profile visibility</Text>
                  </View>
                  <Text style={styles.activityTime}>2h ago</Text>
                </View>
              </LinearGradient>
              
              <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={[styles.activityIcon, { backgroundColor: '#4CAF50' }]}>
                    <Users size={20} color="#fff" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>New Connection</Text>
                    <Text style={styles.activitySubtitle}>Connected with a local gym</Text>
                  </View>
                  <Text style={styles.activityTime}>1d ago</Text>
                </View>
              </LinearGradient>
            </>
          )}
        </View>
      </View>

      {/* Featured Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.featuredCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredOverlay}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Championship Night</Text>
                <Text style={styles.featuredSubtitle}>Main event this Saturday</Text>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>LIVE</Text>
                </View>
              </View>
            </LinearGradient>
          </LinearGradient>
          
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.featuredCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredOverlay}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Elite Training</Text>
                <Text style={styles.featuredSubtitle}>Professional preparation</Text>
                <View style={[styles.featuredBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.featuredBadgeText}>NEW</Text>
                </View>
              </View>
            </LinearGradient>
          </LinearGradient>
        </ScrollView>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  loadingGradient: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginTop: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  nickname: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(26, 26, 26, 0.2)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(26, 26, 26, 0.2)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  globalStatsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 6,
  },
  statsLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '600',
    textAlign: 'center',
  },
  personalStatsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  personalStatsCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  personalStat: {
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  personalStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  personalStatLabel: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  actionsGrid: {
    gap: 16,
  },
  primaryActionCard: {
    marginBottom: 8,
  },
  actionCard: {
    marginBottom: 8,
  },
  actionGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  activityFeed: {
    gap: 16,
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: '#ccc',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  featuredScroll: {
    marginLeft: -24,
    paddingLeft: 24,
  },
  featuredCard: {
    width: 300,
    height: 200,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
    position: 'relative',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  featuredBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});