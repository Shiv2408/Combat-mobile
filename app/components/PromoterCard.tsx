import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from 'convex/react';
import { Trophy, Building2, Eye, Calendar, Clock, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/convex/_generated/api';

interface PromoterCardProps {
  promoter: any;
  onPress: (promoter: any) => void;
}

export default function PromoterCard({ promoter, onPress }: PromoterCardProps) {
  const promoterEvents = useQuery(api.events.getPromoterEvents, { promoterId: promoter._id });
  
  const totalEvents = promoterEvents?.length || 0;
  const upcomingEvents = promoterEvents?.filter(event => new Date(event.eventDate) > new Date()).length || 0;
  const recentEvent = promoterEvents?.[0]; // Most recent event

  return (
    <TouchableOpacity
      style={styles.enhancedMemberCard}
      onPress={() => onPress(promoter)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#2a2a2a', '#1f1f1f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.promoterAvatarContainer}>
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.promoterAvatar}
            >
              <Trophy size={24} color="#1a1a1a" strokeWidth={2.5} />
            </LinearGradient>
            <View style={styles.statusIndicator} />
          </View>

          <View style={styles.promoterInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.promoterName}>
                {`${promoter.firstName} ${promoter.lastName}`}
              </Text>
              <View style={styles.promoterBadge}>
                <Trophy size={12} color="#1a1a1a" strokeWidth={2.5} />
                <Text style={styles.roleBadgeText}>Promoter</Text>
              </View>
            </View>

            {promoter.gym && (
              <View style={styles.gymInfo}>
                <Building2 size={14} color="#FF9800" />
                <Text style={styles.gymText}>{promoter.gym}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={() => onPress(promoter)}>
            <Eye size={18} color="#FF9800" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Promoter Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalEvents}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{upcomingEvents}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.activityIndicator}>
                <Activity size={16} color="#4CAF50" />
              </View>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>

          {recentEvent && (
            <View style={styles.recentEventContainer}>
              <Text style={styles.recentEventTitle}>Latest Event</Text>
              <View style={styles.recentEventInfo}>
                <Calendar size={14} color="#FF9800" />
                <Text style={styles.recentEventText}>{recentEvent.eventName}</Text>
              </View>
              <View style={styles.recentEventInfo}>
                <Clock size={14} color="#ccc" />
                <Text style={styles.recentEventDate}>
                  {new Date(recentEvent.eventDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>
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
  promoterAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  promoterAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9800',
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
  promoterInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  promoterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  promoterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FF9800',
    gap: 5,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
  activityIndicator: {
    padding: 4,
  },
  recentEventContainer: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 16,
  },
  recentEventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  recentEventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  recentEventText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  recentEventDate: {
    fontSize: 14,
    color: '#ccc',
  },
});