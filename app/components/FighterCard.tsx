import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from 'convex/react';
import { Shield, MapPin, Eye, Zap, Target, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';

interface FighterCardProps {
  fighter: any;
  onPress: (fighter: any) => void;
}

export default function FighterCard({ fighter, onPress }: FighterCardProps) {
  const fighterStats = useQuery(api.fights.getFighterStats, { fighterId: fighter._id });
  
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
        colors={['#2a2a2a', '#1f1f1f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.fighterAvatarContainer}>
            <LinearGradient
              colors={['#FFD700', '#FFA000']}
              style={styles.fighterAvatar}
            >
              <Text style={styles.memberAvatarText}>
                {`${fighter.firstName?.[0] || ''}${fighter.lastName?.[0] || ''}`}
              </Text>
            </LinearGradient>
            <View style={styles.statusIndicator} />
          </View>

          <View style={styles.fighterInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.fightName}>
                {fighter.fightName || `${fighter.firstName} ${fighter.lastName}`}
              </Text>
              <View style={styles.fighterBadge}>
                <Shield size={12} color="#1a1a1a" strokeWidth={2.5} />
                <Text style={styles.roleBadgeText}>Fighter</Text>
              </View>
            </View>
            
            {fighter.fightName && (
              <Text style={styles.realName}>
                {fighter.firstName} {fighter.lastName}
              </Text>
            )}

            {fighter.gym && (
              <View style={styles.gymInfo}>
                <MapPin size={14} color="#FFD700" />
                <Text style={styles.gymText}>{fighter.gym}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={() => onPress(fighter)}>
            <Eye size={18} color="#FFD700" strokeWidth={2.5} />
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
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{fighterStats.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{fighterStats.losses}</Text>
                <Text style={styles.statLabel}>Losses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
            </View>

            {fighterStats.totalFights > 0 && (
              <View style={styles.winMethods}>
                <Text style={styles.methodsTitle}>Victory Methods</Text>
                <View style={styles.methodsContainer}>
                  {fighterStats.koTkoWins > 0 && (
                    <View style={styles.methodBadge}>
                      <Zap size={12} color="#FF6B6B" />
                      <Text style={styles.methodText}>{fighterStats.koTkoWins} KO/TKO</Text>
                    </View>
                  )}
                  {fighterStats.submissionWins > 0 && (
                    <View style={styles.methodBadge}>
                      <Target size={12} color="#4ECDC4" />
                      <Text style={styles.methodText}>{fighterStats.submissionWins} Sub</Text>
                    </View>
                  )}
                  {fighterStats.decisionWins > 0 && (
                    <View style={styles.methodBadge}>
                      <Award size={12} color="#45B7D1" />
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
              {fighter.disciplines.slice(0, 3).map((discipline: string, index: number) => (
                <View key={index} style={styles.enhancedDisciplineTag}>
                  <Text style={styles.disciplineText}>{discipline}</Text>
                </View>
              ))}
              {fighter.disciplines.length > 3 && (
                <Text style={styles.moreDisciplines}>
                  +{fighter.disciplines.length - 3} more
                </Text>
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
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 24,
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
  fighterAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  fighterInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fightName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  fighterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    gap: 5,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  realName: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 8,
    fontWeight: '500',
  },
  gymInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gymText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  viewButton: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsContainer: {
    marginBottom: 16,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '500',
  },
  winMethods: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 16,
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  methodText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  disciplinesSection: {
    marginTop: 8,
  },
  disciplinesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  enhancedDisciplineTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disciplineText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  moreDisciplines: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});