import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { 
  Shield, 
  Edit, 
  Mail, 
  Calendar, 
  MapPin, 
  User, 
  Dumbbell, 
  Users, 
  Award, 
  Crown,
  Target,
  Ruler,
  Weight,
  Activity,
  TrendingUp,
  Clock,
  Star,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Twitter
} from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function FighterProfile() {
  const { user } = useUser();
  
  const userData = useQuery(
    api.fighters.getFighterProfile,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const fighterStats = useQuery(
    api.fighters.getFighterStatistics,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Please sign in to view your profile</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading Fighter Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Banner */}
      <View style={styles.header}>
        {userData.bannerImage ? (
          <Image source={{ uri: userData.bannerImage }} style={styles.bannerImage} />
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
            {userData.fightName || `${userData.firstName} ${userData.lastName}`}
          </Text>
          {userData.nickname && (
            <Text style={styles.nickname}>"{userData.nickname}"</Text>
          )}
          <View style={styles.roleContainer}>
            <Shield size={20} color="#1a1a1a" />
            <Text style={styles.role}>Fighter</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Stats Overview */}
        {fighterStats && (
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStatsGrid}>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{fighterStats.totalFights}</Text>
                <Text style={styles.quickStatLabel}>Fights</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatValue, { color: '#4CAF50' }]}>{fighterStats.wins}</Text>
                <Text style={styles.quickStatLabel}>Wins</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatValue, { color: '#F44336' }]}>{fighterStats.losses}</Text>
                <Text style={styles.quickStatLabel}>Losses</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatValue, { color: '#FF9800' }]}>{fighterStats.draws}</Text>
                <Text style={styles.quickStatLabel}>Draws</Text>
              </View>
            </View>
          </View>
        )}

        {/* Fighter Identity Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <User size={20} color="#FFD700" />
              <Text style={styles.cardTitle}>Fighter Identity</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/editProfile/FighterEditProfile')}
            >
              <Edit size={18} color="#FFD700" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.identityGrid}>
            <View style={styles.identityItem}>
              <Text style={styles.identityLabel}>Legal Name</Text>
              <Text style={styles.identityValue}>
                {userData.firstName} {userData.lastName}
              </Text>
            </View>
            {userData.fightName && (
              <View style={styles.identityItem}>
                <Text style={styles.identityLabel}>Fight Name</Text>
                <Text style={styles.identityValue}>{userData.fightName}</Text>
              </View>
            )}
            {userData.nickname && (
              <View style={styles.identityItem}>
                <Text style={styles.identityLabel}>Nickname</Text>
                <Text style={styles.identityValue}>"{userData.nickname}"</Text>
              </View>
            )}
          </View>
        </View>

        {/* Physical Stats Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardTitleContainer}>
            <Activity size={20} color="#FFD700" />
            <Text style={styles.cardTitle}>Physical Statistics</Text>
          </View>

          <View style={styles.physicalStatsGrid}>
            {userData.age && (
              <View style={styles.physicalStatItem}>
                <User size={18} color="#FFD700" />
                <View style={styles.physicalStatContent}>
                  <Text style={styles.physicalStatValue}>{userData.age}</Text>
                  <Text style={styles.physicalStatLabel}>Years Old</Text>
                </View>
              </View>
            )}
            {userData.height && (
              <View style={styles.physicalStatItem}>
                <Ruler size={18} color="#FFD700" />
                <View style={styles.physicalStatContent}>
                  <Text style={styles.physicalStatValue}>{userData.height}"</Text>
                  <Text style={styles.physicalStatLabel}>Height</Text>
                </View>
              </View>
            )}
            {userData.weight && (
              <View style={styles.physicalStatItem}>
                <Weight size={18} color="#FFD700" />
                <View style={styles.physicalStatContent}>
                  <Text style={styles.physicalStatValue}>{userData.weight} lbs</Text>
                  <Text style={styles.physicalStatLabel}>Weight</Text>
                </View>
              </View>
            )}
            {userData.reach && (
              <View style={styles.physicalStatItem}>
                <Target size={18} color="#FFD700" />
                <View style={styles.physicalStatContent}>
                  <Text style={styles.physicalStatValue}>{userData.reach}"</Text>
                  <Text style={styles.physicalStatLabel}>Reach</Text>
                </View>
              </View>
            )}
          </View>

          {(userData.weightClass || userData.stance) && (
            <View style={styles.additionalStatsContainer}>
              {userData.weightClass && (
                <View style={styles.additionalStatChip}>
                  <Text style={styles.additionalStatText}>{userData.weightClass}</Text>
                </View>
              )}
              {userData.stance && (
                <View style={styles.additionalStatChip}>
                  <Text style={styles.additionalStatText}>{userData.stance} Stance</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Fight Record Card */}
        {fighterStats && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Award size={20} color="#FFD700" />
                <Text style={styles.cardTitle}>Fight Record</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/fight-records')}
              >
                <TrendingUp size={18} color="#FFD700" />
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recordStatsContainer}>
              <View style={styles.recordMainStats}>
                <View style={styles.recordStatItem}>
                  <Text style={styles.recordStatValue}>{fighterStats.totalFights}</Text>
                  <Text style={styles.recordStatLabel}>Total Fights</Text>
                </View>
                <View style={styles.recordStatItem}>
                  <Text style={[styles.recordStatValue, { color: '#4CAF50' }]}>{fighterStats.wins}</Text>
                  <Text style={styles.recordStatLabel}>Wins</Text>
                </View>
                <View style={styles.recordStatItem}>
                  <Text style={[styles.recordStatValue, { color: '#F44336' }]}>{fighterStats.losses}</Text>
                  <Text style={styles.recordStatLabel}>Losses</Text>
                </View>
                <View style={styles.recordStatItem}>
                  <Text style={[styles.recordStatValue, { color: '#FF9800' }]}>{fighterStats.draws}</Text>
                  <Text style={styles.recordStatLabel}>Draws</Text>
                </View>
              </View>

              <View style={styles.winMethodsContainer}>
                <Text style={styles.winMethodsTitle}>Win Methods Breakdown</Text>
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

              {fighterStats.winStreak > 0 && (
                <View style={styles.streakContainer}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.streakText}>
                    {fighterStats.winStreak} Fight Win Streak
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Achievements Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Crown size={20} color="#FFD700" />
              <Text style={styles.cardTitle}>Achievements & Titles</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/achievements')}
            >
              <Crown size={18} color="#FFD700" />
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsPlaceholder}>
            <Crown size={40} color="#666" />
            <Text style={styles.achievementsPlaceholderText}>No achievements yet</Text>
            <Text style={styles.achievementsPlaceholderSubtext}>
              Start competing to earn titles and recognition
            </Text>
            <TouchableOpacity 
              style={styles.addAchievementButton}
              onPress={() => router.push('/achievements')}
            >
              <Text style={styles.addAchievementText}>Add Achievement</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Training Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardTitleContainer}>
            <MapPin size={20} color="#FFD700" />
            <Text style={styles.cardTitle}>Training Information</Text>
          </View>

          <View style={styles.trainingInfoContainer}>
            {userData.gym && (
              <View style={styles.trainingInfoItem}>
                <MapPin size={20} color="#FFD700" />
                <View style={styles.trainingInfoContent}>
                  <Text style={styles.trainingInfoLabel}>Training Facility</Text>
                  <Text style={styles.trainingInfoValue}>{userData.gym}</Text>
                </View>
              </View>
            )}

            {userData.headCoach && (
              <View style={styles.trainingInfoItem}>
                <Users size={20} color="#FFD700" />
                <View style={styles.trainingInfoContent}>
                  <Text style={styles.trainingInfoLabel}>Head Coach</Text>
                  <Text style={styles.trainingInfoValue}>{userData.headCoach}</Text>
                </View>
              </View>
            )}

            {(!userData.gym && !userData.headCoach) && (
              <View style={styles.emptyTrainingInfo}>
                <Text style={styles.emptyTrainingText}>No training information added</Text>
                <TouchableOpacity
                  style={styles.addInfoButton}
                  onPress={() => router.push('/editProfile/FighterEditProfile')}
                >
                  <Text style={styles.addInfoText}>Add Training Info</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Fighting Disciplines Card */}
        {userData.disciplines && userData.disciplines.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardTitleContainer}>
              <Dumbbell size={20} color="#FFD700" />
              <Text style={styles.cardTitle}>Fighting Disciplines</Text>
            </View>
            <View style={styles.disciplinesContainer}>
              {userData.disciplines.map((discipline: string, index: number) => (
                <View key={index} style={styles.disciplineTag}>
                  <Dumbbell size={16} color="#1a1a1a" />
                  <Text style={styles.disciplineText}>{discipline}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Biography Card */}
        {userData.bio && (
          <View style={styles.infoCard}>
            <View style={styles.cardTitleContainer}>
              <User size={20} color="#FFD700" />
              <Text style={styles.cardTitle}>Biography</Text>
            </View>
            <Text style={styles.bioText}>{userData.bio}</Text>
          </View>
        )}

        {/* Social Media Card */}
        {userData.socials && Object.keys(userData.socials).length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardTitleContainer}>
              <Globe size={20} color="#FFD700" />
              <Text style={styles.cardTitle}>Social Media</Text>
            </View>
            
            <View style={styles.socialMediaContainer}>
              {userData.socials.instagram && (
                <TouchableOpacity style={styles.socialItem}>
                  <Instagram size={24} color="#E4405F" />
                  <Text style={styles.socialText}>@{userData.socials.instagram}</Text>
                </TouchableOpacity>
              )}
              {userData.socials.facebook && (
                <TouchableOpacity style={styles.socialItem}>
                  <Facebook size={24} color="#1877F2" />
                  <Text style={styles.socialText}>{userData.socials.facebook}</Text>
                </TouchableOpacity>
              )}
              {userData.socials.youtube && (
                <TouchableOpacity style={styles.socialItem}>
                  <Youtube size={24} color="#FF0000" />
                  <Text style={styles.socialText}>{userData.socials.youtube}</Text>
                </TouchableOpacity>
              )}
              {userData.socials.twitter && (
                <TouchableOpacity style={styles.socialItem}>
                  <Twitter size={24} color="#1DA1F2" />
                  <Text style={styles.socialText}>@{userData.socials.twitter}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Account Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardTitleContainer}>
            <Mail size={20} color="#FFD700" />
            <Text style={styles.cardTitle}>Account Information</Text>
          </View>

          <View style={styles.accountInfoContainer}>
            <View style={styles.accountInfoItem}>
              <Mail size={20} color="#FFD700" />
              <View style={styles.accountInfoContent}>
                <Text style={styles.accountInfoLabel}>Email Address</Text>
                <Text style={styles.accountInfoValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.accountInfoItem}>
              <Calendar size={20} color="#FFD700" />
              <View style={styles.accountInfoContent}>
                <Text style={styles.accountInfoLabel}>Member Since</Text>
                <Text style={styles.accountInfoValue}>
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.accountInfoItem}>
              <Activity size={20} color="#FFD700" />
              <View style={styles.accountInfoContent}>
                <Text style={styles.accountInfoLabel}>Profile Status</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusIndicator, userData.isActive && styles.statusIndicatorActive]} />
                  <Text style={[styles.statusText, userData.isActive && styles.statusTextActive]}>
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 16,
    textAlign: 'center',
  },
  header: {
    position: 'relative',
    height: 320,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  nickname: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  role: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 6,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  quickStatsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#333',
    gap: 4,
  },
  editButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#333',
    gap: 4,
  },
  viewAllText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  identityGrid: {
    gap: 16,
  },
  identityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  identityLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
    fontWeight: '500',
  },
  identityValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  physicalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  physicalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    gap: 12,
  },
  physicalStatContent: {
    flex: 1,
  },
  physicalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  physicalStatLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '500',
  },
  additionalStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  additionalStatChip: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  additionalStatText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  recordStatsContainer: {
    gap: 20,
  },
  recordMainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
  },
  recordStatItem: {
    alignItems: 'center',
  },
  recordStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  recordStatLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '500',
  },
  winMethodsContainer: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
  },
  winMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
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
    fontWeight: '500',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  streakText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  achievementsPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  achievementsPlaceholderText: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: '600',
  },
  achievementsPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  addAchievementButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addAchievementText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  trainingInfoContainer: {
    marginTop: 16,
    gap: 16,
  },
  trainingInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  trainingInfoContent: {
    flex: 1,
  },
  trainingInfoLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
    fontWeight: '500',
  },
  trainingInfoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  emptyTrainingInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  emptyTrainingText: {
    fontSize: 16,
    color: '#ccc',
  },
  addInfoButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addInfoText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  disciplinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  disciplineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  disciplineText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginTop: 16,
  },
  socialMediaContainer: {
    gap: 16,
    marginTop: 16,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  socialText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  accountInfoContainer: {
    gap: 16,
    marginTop: 16,
  },
  accountInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  accountInfoContent: {
    flex: 1,
  },
  accountInfoLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
    fontWeight: '500',
  },
  accountInfoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  statusIndicatorActive: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
});