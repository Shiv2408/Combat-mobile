import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Shield, Trophy, CreditCard as Edit, Mail, Calendar, MapPin, User, Dumbbell, Users, Target, Award, Crown, CalendarPlus, Building2 } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function ProfileScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  const userStats = useQuery(
    api.users.getUserStats,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const fighterStats = useQuery(
    api.fights.getFighterStats,
    userData && userData.role === 'Fighter' ? { fighterId: userData.clerkId } : "skip"
  );

  const achievements = useQuery(
    api.achievements.getFighterAchievements,
    userData && userData.role === 'Fighter' ? { fighterId: userData.clerkId } : "skip"
  );

  const promoterEvents = useQuery(
    api.events.getPromoterEvents,
    userData && userData.role === 'Promoter' ? { promoterId: userData.clerkId } : "skip"
  );

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const isFighter = userData.role === 'Fighter';
  const isPromoter = userData.role === 'Promoter';
  const isGym = userData.role === 'Gym';
  const currentAchievements = achievements?.filter(a => a.isCurrentlyHeld) || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header with Banner */}
      <View style={styles.header}>
        {userData.roleData?.bannerImage ? (
          <Image source={{ uri: userData.roleData.bannerImage }} style={styles.bannerImage} />
        ) : (
          <View style={styles.defaultBanner} />
        )}
        <View style={styles.bannerOverlay} />
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {userData.firstName?.[0]}{userData.lastName?.[0]}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {isFighter && userData.roleData?.fightName 
              ? userData.roleData.fightName 
              : isGym && userData.roleData?.gymName
              ? userData.roleData.gymName
              : `${userData.firstName} ${userData.lastName}`
            }
          </Text>
          {isFighter && userData.roleData?.fightName && (
            <Text style={styles.realName}>
              {userData.firstName} {userData.lastName}
            </Text>
          )}
          <View style={styles.roleContainer}>
            {isFighter ? (
              <Shield size={20} color="#1a1a1a" />
            ) : isPromoter ? (
              <Trophy size={20} color="#1a1a1a" />
            ) : (
              <Building2 size={20} color="#1a1a1a" />
            )}
            <Text style={styles.role}>{userData.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Fighter Stats Card */}
        {isFighter && fighterStats && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Fight Record</Text>
              <TouchableOpacity
                style={styles.viewRecordsButton}
                onPress={() => router.push('/fight-records')}
              >
                <Award size={18} color="#FFD700" />
                <Text style={styles.viewRecordsText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{fighterStats.totalFights}</Text>
                <Text style={styles.statLabel}>Total Fights</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>{fighterStats.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F44336' }]}>{fighterStats.losses}</Text>
                <Text style={styles.statLabel}>Losses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#FF9800' }]}>{fighterStats.draws}</Text>
                <Text style={styles.statLabel}>Draws</Text>
              </View>
            </View>

            {fighterStats.winStreak > 0 && (
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>
                  🔥 {fighterStats.winStreak} fight win streak
                </Text>
              </View>
            )}

            <View style={styles.winMethodsContainer}>
              <Text style={styles.winMethodsTitle}>Win Methods</Text>
              <View style={styles.winMethodsGrid}>
                <View style={styles.winMethodItem}>
                  <Text style={styles.winMethodValue}>{fighterStats.koTkoWins}</Text>
                  <Text style={styles.winMethodLabel}>KO/TKO</Text>
                </View>
                <View style={styles.winMethodItem}>
                  <Text style={styles.winMethodValue}>{fighterStats.submissionWins}</Text>
                  <Text style={styles.winMethodLabel}>Submission</Text>
                </View>
                <View style={styles.winMethodItem}>
                  <Text style={styles.winMethodValue}>{fighterStats.decisionWins}</Text>
                  <Text style={styles.winMethodLabel}>Decision</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Fighter Achievements Card */}
        {isFighter && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Achievements</Text>
              <TouchableOpacity
                style={styles.viewRecordsButton}
                onPress={() => router.push('/achievements')}
              >
                <Crown size={18} color="#FFD700" />
                <Text style={styles.viewRecordsText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {currentAchievements.length > 0 ? (
              <View style={styles.achievementsContainer}>
                {currentAchievements.slice(0, 3).map((achievement) => (
                  <View key={achievement._id} style={styles.achievementItem}>
                    <Crown size={16} color="#FFD700" />
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementOrg}>{achievement.organisation}</Text>
                    </View>
                  </View>
                ))}
                {currentAchievements.length > 3 && (
                  <Text style={styles.moreAchievements}>
                    +{currentAchievements.length - 3} more titles
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.noAchievements}>
                <Text style={styles.noAchievementsText}>No current titles</Text>
                <TouchableOpacity 
                  style={styles.addAchievementButton}
                  onPress={() => router.push('/achievements')}
                >
                  <Text style={styles.addAchievementText}>Add Achievement</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Promoter Events Card */}
        {isPromoter && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Events</Text>
              <TouchableOpacity
                style={styles.viewRecordsButton}
                onPress={() => router.push('/promoter-events')}
              >
                <CalendarPlus size={18} color="#FFD700" />
                <Text style={styles.viewRecordsText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats?.totalEvents || 0}</Text>
                <Text style={styles.statLabel}>Total Events</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#FFD700' }]}>
                  {userStats?.upcomingEvents || 0}
                </Text>
                <Text style={styles.statLabel}>Upcoming</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                  {userStats?.completedEvents || 0}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => router.push('/create-event')}
            >
              <CalendarPlus size={20} color="#1a1a1a" />
              <Text style={styles.createEventText}>Create New Event</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Gym Stats Card */}
        {isGym && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Gym Overview</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats?.totalMembers || 0}</Text>
                <Text style={styles.statLabel}>Active Members</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                  {userData.roleData?.staff?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Staff</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#2196F3' }]}>
                  {userData.roleData?.disciplines?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Disciplines</Text>
              </View>
            </View>
          </View>
        )}

        {/* Basic Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Edit size={18} color="#FFD700" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <Mail size={20} color="#FFD700" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Calendar size={20} color="#FFD700" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(userData.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {userData.roleData?.age && (
            <View style={styles.infoItem}>
              <User size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{userData.roleData.age} years old</Text>
              </View>
            </View>
          )}

          {userData.roleData?.gym && (
            <View style={styles.infoItem}>
              <MapPin size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gym</Text>
                <Text style={styles.infoValue}>{userData.roleData.gym}</Text>
              </View>
            </View>
          )}

          {userData.roleData?.headCoach && (
            <View style={styles.infoItem}>
              <Users size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Head Coach</Text>
                <Text style={styles.infoValue}>{userData.roleData.headCoach}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Fighter Specific Info */}
        {isFighter && userData.roleData && (
          <>
            {/* Physical Stats */}
            {(userData.roleData.height || userData.roleData.weight) && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Physical Stats</Text>
                <View style={styles.statsRow}>
                  {userData.roleData.height && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userData.roleData.height}"</Text>
                      <Text style={styles.statLabel}>Height</Text>
                    </View>
                  )}
                  {userData.roleData.weight && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userData.roleData.weight} lbs</Text>
                      <Text style={styles.statLabel}>Weight</Text>
                    </View>
                  )}
                  {userData.roleData.reach && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userData.roleData.reach}"</Text>
                      <Text style={styles.statLabel}>Reach</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Disciplines */}
            {userData.roleData.disciplines && userData.roleData.disciplines.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Fighting Disciplines</Text>
                <View style={styles.disciplinesContainer}>
                  {userData.roleData.disciplines.map((discipline, index) => (
                    <View key={index} style={styles.disciplineTag}>
                      <Dumbbell size={16} color="#1a1a1a" />
                      <Text style={styles.disciplineText}>{discipline}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Social Media */}
        {userData.roleData?.socials && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Social Media</Text>
            {userData.roleData.socials.instagram && (
              <TouchableOpacity style={styles.socialItem}>
                <Image
                  source={{ uri: 'https://img.icons8.com/fluency/48/instagram-new.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>@{userData.roleData.socials.instagram}</Text>
              </TouchableOpacity>
            )}
            {userData.roleData.socials.facebook && (
              <TouchableOpacity style={styles.socialItem}>
                <Image
                  source={{ uri: 'https://img.icons8.com/fluency/48/facebook-new.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>{userData.roleData.socials.facebook}</Text>
              </TouchableOpacity>
            )}
            {userData.roleData.socials.youtube && (
              <TouchableOpacity style={styles.socialItem}>
                <Image
                  source={{ uri: 'https://img.icons8.com/fluency/48/youtube-play.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>{userData.roleData.socials.youtube}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </View>
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
    position: 'relative',
    height: 300,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  defaultBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD700',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  profileSection: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  realName: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 12,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  role: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 4,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  infoCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  editButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewRecordsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  viewRecordsText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  streakContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  winMethodsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 16,
  },
  winMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  winMethodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  winMethodItem: {
    alignItems: 'center',
  },
  winMethodValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  winMethodLabel: {
    fontSize: 11,
    color: '#ccc',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  achievementInfo: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  achievementOrg: {
    fontSize: 12,
    color: '#FFD700',
  },
  moreAchievements: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noAchievements: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noAchievementsText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  addAchievementButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addAchievementText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  createEventText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  disciplinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  disciplineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disciplineText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialText: {
    fontSize: 16,
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});