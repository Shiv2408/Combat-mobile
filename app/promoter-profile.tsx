import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Trophy, CreditCard as Edit, Mail, Calendar, MapPin, User, Users, CalendarPlus } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

interface PromoterProfileProps {
  userData: any;
}

export default function PromoterProfile({ userData }: PromoterProfileProps) {
  const promoterEvents = useQuery(
    api.events.getPromoterEvents,
    { promoterId: userData._id }
  );

  return (
    <ScrollView style={styles.container}>
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
            {`${userData.firstName} ${userData.lastName}`}
          </Text>
          <View style={styles.roleContainer}>
            <Trophy size={20} color="#1a1a1a" />
            <Text style={styles.role}>{userData.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Promoter Events Card */}
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
              <Text style={styles.statValue}>{promoterEvents?.length || 0}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FFD700' }]}>
                {promoterEvents?.filter(e => e.status === 'Upcoming').length || 0}
              </Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {promoterEvents?.filter(e => e.status === 'Completed').length || 0}
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

        {/* Recent Events Summary */}
        {promoterEvents && promoterEvents.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Recent Events</Text>
            <View style={styles.eventsContainer}>
              {promoterEvents.slice(0, 3).map((event) => (
                <View key={event._id} style={styles.eventItem}>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.eventName}</Text>
                    <Text style={styles.eventDate}>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.eventLocation}>{event.venue}</Text>
                  </View>
                  <View style={[styles.statusBadge, {
                    backgroundColor: event.status === 'Upcoming' ? '#FFD700' : 
                                   event.status === 'Completed' ? '#4CAF50' : '#FF9800'
                  }]}>
                    <Text style={styles.statusText}>{event.status}</Text>
                  </View>
                </View>
              ))}
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

          {userData.age && (
            <View style={styles.infoItem}>
              <User size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{userData.age} years old</Text>
              </View>
            </View>
          )}

          {userData.companyName && (
            <View style={styles.infoItem}>
              <Users size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.infoValue}>{userData.companyName}</Text>
              </View>
            </View>
          )}

          {userData.location && (
            <View style={styles.infoItem}>
              <MapPin size={20} color="#FFD700" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{userData.location}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Business Information */}
        {(userData.yearsInBusiness || userData.promotionStyle) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Business Information</Text>
            
            <View style={styles.businessStatsContainer}>
              {userData.yearsInBusiness && (
                <View style={styles.businessStatItem}>
                  <Text style={styles.businessStatValue}>{userData.yearsInBusiness}</Text>
                  <Text style={styles.businessStatLabel}>Years in Business</Text>
                </View>
              )}
              
              {userData.promotionStyle && (
                <View style={styles.businessInfoItem}>
                  <Text style={styles.businessInfoLabel}>Promotion Style</Text>
                  <Text style={styles.businessInfoValue}>{userData.promotionStyle}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Specialties */}
        {userData.specialties && userData.specialties.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Event Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {userData.specialties.map((specialty: string, index: number) => (
                <View key={index} style={styles.specialtyTag}>
                  <Trophy size={16} color="#1a1a1a" />
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Social Media */}
        {userData.socials && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Social Media</Text>
            {userData.socials.instagram && (
              <TouchableOpacity style={styles.socialItem}>
                <Image
                  source={{ uri: 'https://img.icons8.com/fluency/48/instagram-new.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>@{userData.socials.instagram}</Text>
              </TouchableOpacity>
            )}
            {userData.socials.facebook && (
              <TouchableOpacity style={styles.socialItem}>
                <Image
                  source={{ uri: 'https://img.icons8.com/fluency/48/facebook-new.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>{userData.socials.facebook}</Text>
              </TouchableOpacity>
            )}
            {userData.socials.youtube && (
              <TouchableOpacity style={styles.socialItem}>
                <Image
                  source={{ uri: 'https://img.icons8.com/fluency/48/youtube-play.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>{userData.socials.youtube}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  eventsContainer: {
    gap: 12,
    marginTop: 16,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: '#ccc',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a1a1a',
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
  businessStatsContainer: {
    marginTop: 16,
  },
  businessStatItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  businessStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  businessStatLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  businessInfoItem: {
    marginBottom: 12,
  },
  businessInfoLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  businessInfoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  specialtyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
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
});