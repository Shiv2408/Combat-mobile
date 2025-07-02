import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Building2, Users as UsersIcon, Eye } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GymCardProps {
  gym: any;
  onPress: (gym: any) => void;
}

export default function GymCard({ gym, onPress }: GymCardProps) {
  return (
    <TouchableOpacity
      style={styles.enhancedMemberCard}
      onPress={() => onPress(gym)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#2a2a2a', '#1f1f1f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.gymAvatarContainer}>
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.gymAvatar}
            >
              <Building2 size={24} color="#1a1a1a" strokeWidth={2.5} />
            </LinearGradient>
            <View style={styles.statusIndicator} />
          </View>

          <View style={styles.gymInfoSection}>
            <View style={styles.nameContainer}>
              <Text style={styles.gymName}>{gym.gymName}</Text>
              <View style={styles.gymBadge}>
                <Building2 size={12} color="#1a1a1a" strokeWidth={2.5} />
                <Text style={styles.roleBadgeText}>Gym</Text>
              </View>
            </View>

            {gym.staff && (
              <View style={styles.staffInfo}>
                <UsersIcon size={14} color="#2196F3" />
                <Text style={styles.staffText}>
                  {gym.staff.length} staff member{gym.staff.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={() => onPress(gym)}>
            <Eye size={18} color="#2196F3" strokeWidth={2.5} />
          </TouchableOpacity>
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
  gymAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  gymAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
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
  gymInfoSection: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gymName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  gymBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    gap: 5,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  staffText: {
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
});