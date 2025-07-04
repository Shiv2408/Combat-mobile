import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from 'convex/react';
import { ArrowLeft, Shield, Trophy, MapPin, Calendar, Users, Dumbbell, Mail, Instagram, Facebook, Youtube } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;

  // For now, we'll get all users and find the one we need
  // In a real app, you'd have a getUserById query
  const allFighters = useQuery(api.users.getAllFighters);
  const allPromoters = useQuery(api.users.getAllPromoters);
  
  const allUsers = [
    ...(allFighters || []),
    ...(allPromoters || [])
  ];
  
  const user = allUsers.find(u => u._id === userId);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </View>
    );
  }

  const isFighter = user.role === 'Fighter';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {user.role === 'Fighter' && 'fightName' in user && user.fightName
              ? user.fightName
              : `${user.firstName} ${user.lastName}`}
          </Text>
          {user.role === 'Fighter' && 'fightName' in user && user.fightName && (
            <Text style={styles.realName}>
              {user.firstName} {user.lastName}
            </Text>
          )}
          <View style={styles.roleContainer}>
            {isFighter ? (
              <Shield size={20} color="#1a1a1a" />
            ) : (
              <Trophy size={20} color="#1a1a1a" />
            )}
            <Text style={styles.role}>{user.role}</Text>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          
          <View style={styles.infoItem}>
            <Mail size={20} color="#FFD700" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Calendar size={20} color="#FFD700" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {isFighter && 'age' in user && user.age && (
            <View style={styles.infoItem}>
              <Users size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{user.age} years old</Text>
              </View>
            </View>
          )}

          {'gym' in user && user.gym && (
            <View style={styles.infoItem}>
              <MapPin size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gym</Text>
                <Text style={styles.infoValue}>{user.gym}</Text>
              </View>
            </View>
          )}

          {'headCoach' in user && user.headCoach && (
            <View style={styles.infoItem}>
              <Users size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Head Coach</Text>
                <Text style={styles.infoValue}>{user.headCoach}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Fighter Specific Info */}
        {isFighter && (
          <>
            {/* Physical Stats */}
            {'height' in user && 'weight' in user && (user.height || user.weight) && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Physical Stats</Text>
                <View style={styles.statsRow}>
                  {user.height && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{user.height}"</Text>
                      <Text style={styles.statLabel}>Height</Text>
                    </View>
                  )}
                  {user.weight && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{user.weight} lbs</Text>
                      <Text style={styles.statLabel}>Weight</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Disciplines */}
            {'disciplines' in user && Array.isArray(user.disciplines) && user.disciplines.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Fighting Disciplines</Text>
                <View style={styles.disciplinesContainer}>
                  {user.disciplines.map((discipline, index) => (
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
        {user.socials && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Social Media</Text>
            {user.socials.instagram && (
              <TouchableOpacity style={styles.socialItem}>
                <Instagram size={24} color="#E4405F" />
                <Text style={styles.socialText}>@{user.socials.instagram}</Text>
              </TouchableOpacity>
            )}
            {user.socials.facebook && (
              <TouchableOpacity style={styles.socialItem}>
                <Facebook size={24} color="#1877F2" />
                <Text style={styles.socialText}>{user.socials.facebook}</Text>
              </TouchableOpacity>
            )}
            {user.socials.youtube && (
              <TouchableOpacity style={styles.socialItem}>
                <Youtube size={24} color="#FF0000" />
                <Text style={styles.socialText}>{user.socials.youtube}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Contact Button */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Mail size={20} color="#1a1a1a" />
            <Text style={styles.contactButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#FFD700',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  realName: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  role: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
    fontSize: 14,
    color: '#ccc',
  },
  disciplinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  disciplineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  disciplineText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  socialText: {
    fontSize: 16,
    color: '#fff',
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
  },
});