import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Trophy, Users, Calendar, TrendingUp, Zap, Target, Chrome, UserPlus, Shield, Building2 } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function HomeScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  const userStats = useQuery(
    api.users.getUserStats,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const allFighters = useQuery(api.fighters.getAllFighters, { limit: 10 });
  const allPromoters = useQuery(api.promoters.getAllPromoters, { limit: 10 });
  const allEvents = useQuery(api.events.getAllEvents);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isFighter = userData.role === 'Fighter';
  const isPromoter = userData.role === 'Promoter';
  const isGym = userData.role === 'Gym';

  // Type for Gym roleData
  type GymRoleData = {
    gymName?: string;
    staff?: any[];
    disciplines?: any[];
    // add other gym-specific fields if needed
  };

  function isGymRoleData(roleData: any): roleData is GymRoleData {
    return roleData && Array.isArray(roleData.staff);
  }
  
  const totalFighters = Array.isArray(allFighters) ? allFighters.length : allFighters?.page?.length || 0;
  const totalPromoters = Array.isArray(allPromoters) ? allPromoters.length : 0;
  const totalEvents = allEvents?.length || 0;
  const upcomingEvents = allEvents?.filter(e => e.status === 'Upcoming').length || 0;

  const getDisplayName = () => {
    if (
      isFighter &&
      userData.roleData &&
      'fightName' in userData.roleData &&
      typeof userData.roleData.fightName === 'string'
    ) {
      return userData.roleData.fightName;
    }
    if (
      isGym &&
      userData.roleData &&
      'gymName' in userData.roleData &&
      typeof userData.roleData.gymName === 'string'
    ) {
      return userData.roleData.gymName;
    }
    return `${userData.firstName} ${userData.lastName}`;
  };

  const getRoleSpecificActions = () => {
    if (isFighter) {
      return [
        {
          title: 'Fight Records',
          subtitle: 'Track your career',
          icon: Target,
          route: '/fight-records',
          color: '#4CAF50'
        },
        {
          title: 'Achievements',
          subtitle: 'Manage titles',
          icon: Trophy,
          route: '/achievements',
          color: '#FFD700'
        }
      ];
    } else if (isPromoter) {
      return [
        {
          title: 'Create Event',
          subtitle: 'Organize matches',
          icon: Calendar,
          route: '/create-event',
          color: '#2196F3'
        },
        {
          title: 'My Events',
          subtitle: 'Manage events',
          icon: Chrome,
          route: '/promoter-events',
          color: '#FF9800'
        }
      ];
    } else {
      return [
        {
          title: 'Gym Members',
          subtitle: 'Manage members',
          icon: Users,
          route: '/gym-members',
          color: '#9C27B0'
        },
        {
          title: 'Staff',
          subtitle: 'Manage staff',
          icon: UserPlus,
          route: '/gym-staff',
          color: '#607D8B'
        }
      ];
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{getDisplayName()}</Text>
            <View style={styles.roleContainer}>
              {isFighter && <Shield size={16} color="#1a1a1a" />}
              {isPromoter && <Trophy size={16} color="#1a1a1a" />}
              {isGym && <Building2 size={16} color="#1a1a1a" />}
              <Text style={styles.roleText}>{userData.role}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.firstName?.[0]}{userData.lastName?.[0]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Users size={24} color="#FFD700" />
          <Text style={styles.statsNumber}>{totalFighters}</Text>
          <Text style={styles.statsLabel}>Fighters</Text>
        </View>
        <View style={styles.statsCard}>
          <Trophy size={24} color="#FFD700" />
          <Text style={styles.statsNumber}>{totalPromoters}</Text>
          <Text style={styles.statsLabel}>Promoters</Text>
        </View>
        <View style={styles.statsCard}>
          <Calendar size={24} color="#FFD700" />
          <Text style={styles.statsNumber}>{upcomingEvents}</Text>
          <Text style={styles.statsLabel}>Events</Text>
        </View>
      </View>

      {/* Personal Stats */}
      {userStats && (
        <View style={styles.personalStatsContainer}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.personalStatsCard}>
            {isFighter && (
              <>
                <View style={styles.personalStat}>
                  <Text style={styles.personalStatNumber}>{userStats.totalFights || 0}</Text>
                  <Text style={styles.personalStatLabel}>Total Fights</Text>
                </View>
                <View style={styles.personalStat}>
                  <Text style={[styles.personalStatNumber, { color: '#4CAF50' }]}>{userStats.wins || 0}</Text>
                  <Text style={styles.personalStatLabel}>Wins</Text>
                </View>
                <View style={styles.personalStat}>
                  <Text style={[styles.personalStatNumber, { color: '#FFD700' }]}>{userStats.currentTitles || 0}</Text>
                  <Text style={styles.personalStatLabel}>Titles</Text>
                </View>
              </>
            )}
            {isPromoter && (
              <>
                <View style={styles.personalStat}>
                  <Text style={styles.personalStatNumber}>{userStats.totalEvents || 0}</Text>
                  <Text style={styles.personalStatLabel}>Total Events</Text>
                </View>
                <View style={styles.personalStat}>
                  <Text style={[styles.personalStatNumber, { color: '#4CAF50' }]}>{userStats.upcomingEvents || 0}</Text>
                  <Text style={styles.personalStatLabel}>Upcoming</Text>
                </View>
                <View style={styles.personalStat}>
                  <Text style={[styles.personalStatNumber, { color: '#4CAF50' }]}>
                    {isGymRoleData(userData.roleData) ? userData.roleData.staff.length : 0}
                  </Text>
                  <Text style={styles.personalStatLabel}>Staff</Text>
                </View>
              </>
            )}
            {isGym && (
              <>
                <View style={styles.personalStat}>
                  <Text style={styles.personalStatNumber}>{userStats.totalMembers || 0}</Text>
                  <Text style={styles.personalStatLabel}>Members</Text>
                </View>
                <View style={styles.personalStat}>
                  <Text style={[styles.personalStatNumber, { color: '#4CAF50' }]}>{userData.roleData?.staff?.length || 0}</Text>
                  <Text style={styles.personalStatLabel}>Staff</Text>
                </View>
                <View style={styles.personalStat}>
                  <Text style={[styles.personalStatNumber, { color: '#2196F3' }]}>{userData.roleData?.disciplines?.length || 0}</Text>
                  <Text style={styles.personalStatLabel}>Disciplines</Text>
                </View>
              </>
            )}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/all-users')}
          >
            <UserPlus size={32} color="#FFD700" />
            <Text style={styles.actionTitle}>Browse Community</Text>
            <Text style={styles.actionSubtitle}>Find fighters & promoters</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/all-events')}
          >
            <Calendar size={32} color="#FFD700" />
            <Text style={styles.actionTitle}>View Events</Text>
            <Text style={styles.actionSubtitle}>Discover upcoming fights</Text>
          </TouchableOpacity>

          {getRoleSpecificActions().map((action, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route)}
            >
              <action.icon size={32} color={action.color} />
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.featuredCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Championship Night</Text>
              <Text style={styles.featuredSubtitle}>Main event this Saturday</Text>
            </View>
          </View>
          <View style={styles.featuredCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Training Camp</Text>
              <Text style={styles.featuredSubtitle}>Elite preparation program</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Zap size={20} color="#FFD700" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Profile Updated</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Users size={20} color="#FFD700" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Fighter Joined</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Trophy size={20} color="#FFD700" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Event Scheduled</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
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
    paddingBottom: 100,
  },
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
  header: {
    backgroundColor: '#FFD700',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  personalStatsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  personalStatsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  personalStat: {
    alignItems: 'center',
  },
  personalStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  personalStatLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  featuredCard: {
    width: 280,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#ccc',
  },
  bottomSpacing: {
    height: 40,
  },
});