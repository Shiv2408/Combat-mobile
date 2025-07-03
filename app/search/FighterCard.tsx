import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { MapPin, Eye, Zap, Target, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';

interface FighterCardProps {
  fighter: any;
  onPress: (fighter: any) => void;
}

export default function FighterCard({ fighter, onPress }: FighterCardProps) {
  const fighterStats = useQuery(api.fighters.getFighterStatistics, { clerkId: fighter.clerkId });
  
  const winRate = fighterStats && fighterStats.totalFights > 0 
    ? Math.round((fighterStats.wins / fighterStats.totalFights) * 100) 
    : 0;

  return (
    <TouchableOpacity
      style={styles.enhancedMemberCard}
      onPress={() => onPress(fighter)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#2a2a2a', '#1a1a1a', '#0f0f0f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.fighterAvatarContainer}>
            {fighter.profileImage ? (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: fighter.profileImage }} 
                  style={styles.fighterImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(255, 215, 0, 0.2)']}
                  style={styles.imageOverlay}
                />
              </View>
            ) : (
              <LinearGradient
                colors={['#FFD700', '#FFA000', '#FF8F00']}
                style={styles.fighterAvatar}
              >
                <Text style={styles.memberAvatarText}>
                  {`${fighter.firstName?.[0] || ''}${fighter.lastName?.[0] || ''}`}
                </Text>
              </LinearGradient>
            )}
            <View style={styles.statusIndicator} />
          </View>

          <View style={styles.fighterInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.fightName} numberOfLines={1}>
                {fighter.fightName || `${fighter.firstName} ${fighter.lastName}`}
              </Text>
              {fighter.nickname && (
                <Text style={styles.nickname}>"{fighter.nickname}"</Text>
              )}
            </View>
            
            {fighter.fightName && (
              <Text style={styles.realName}>
                {fighter.firstName} {fighter.lastName}
              </Text>
            )}

            <View style={styles.infoRow}>
              {fighter.gym && (
                <View style={styles.gymInfo}>
                  <MapPin size={12} color="#FFD700" />
                  <Text style={styles.gymText} numberOfLines={1}>{fighter.gym}</Text>
                </View>
              )}
              
              {fighter.weightClass && (
                <View style={styles.weightClassBadge}>
                  <Text style={styles.weightClassText}>{fighter.weightClass}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={() => onPress(fighter)}>
            <Eye size={20} color="#FFD700" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Fighter Stats */}
        {fighterStats && (
          <View style={styles.statsContainer}>
            <View style={styles.mainStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{fighterStats.totalFights}</Text>
                <Text style={styles.statLabel}>Fights</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{fighterStats.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#F44336' }]}>{fighterStats.losses}</Text>
                <Text style={styles.statLabel}>Losses</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FFD700' }]}>{winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
            </View>

            {fighterStats.totalFights > 0 && (
              <View style={styles.winMethods}>
                <Text style={styles.methodsTitle}>Victory Methods</Text>
                <View style={styles.methodsContainer}>
                  {fighterStats.koTkoWins > 0 && (
                    <View style={[styles.methodBadge, { backgroundColor: '#FF6B6B' }]}>
                      <Zap size={12} color="#fff" />
                      <Text style={styles.methodText}>{fighterStats.koTkoWins} KO/TKO</Text>
                    </View>
                  )}
                  {fighterStats.submissionWins > 0 && (
                    <View style={[styles.methodBadge, { backgroundColor: '#4ECDC4' }]}>
                      <Target size={12} color="#fff" />
                      <Text style={styles.methodText}>{fighterStats.submissionWins} Sub</Text>
                    </View>
                  )}
                  {fighterStats.decisionWins > 0 && (
                    <View style={[styles.methodBadge, { backgroundColor: '#45B7D1' }]}>
                      <Award size={12} color="#fff" />
                      <Text style={styles.methodText}>{fighterStats.decisionWins} Dec</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Disciplines */}
        {fighter.disciplines && fighter.disciplines.length > 0 && (
          <View style={styles.disciplinesSection}>
            <View style={styles.disciplinesContainer}>
              {fighter.disciplines.slice(0, 4).map((discipline: string, index: number) => (
                <View key={index} style={styles.enhancedDisciplineTag}>
                  <Text style={styles.disciplineText}>{discipline}</Text>
                </View>
              ))}
              {fighter.disciplines.length > 4 && (
                <View style={styles.moreDisciplinesContainer}>
                  <Text style={styles.moreDisciplines}>
                    +{fighter.disciplines.length - 4}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  enhancedMemberCard: {
    marginBottom: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  cardGradient: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  fighterAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  fighterImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fighterAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#1a1a1a',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  memberAvatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  fighterInfo: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 6,
  },
  fightName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  nickname: {
    fontSize: 14,
    color: '#FFD700',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  realName: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 10,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gymInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  gymText: {
    fontSize: 13,
    color: '#ccc',
    fontWeight: '500',
    flex: 1,
  },
  weightClassBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  weightClassText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '600',
  },
  viewButton: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#333',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#444',
  },
  statsContainer: {
    marginBottom: 16,
  },
  mainStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#555',
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '600',
  },
  winMethods: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#444',
  },
  methodsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  methodText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  disciplinesSection: {
    marginTop: 8,
  },
  disciplinesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  enhancedDisciplineTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  disciplineText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  moreDisciplinesContainer: {
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#666',
  },
  moreDisciplines: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '600',
  },
});