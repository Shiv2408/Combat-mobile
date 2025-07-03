import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Trophy, CreditCard as Edit, Mail, Calendar, MapPin, User, Users, CalendarPlus, Phone, Globe, Shield, Award, Star, Building, Clock, CircleCheck as CheckCircle, ExternalLink } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

interface PromoterProfileProps {
  userData: any;
}

export default function PromoterProfile({ userData }: PromoterProfileProps) {
  const promoterEvents = useQuery(
    api.events.getPromoterEvents,
    { promoterId: userData._id }
  );

  const handleCall = () => {
    if (userData.phoneNumber) {
      Linking.openURL(`tel:${userData.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (userData.website) {
      Linking.openURL(userData.website);
    }
  };

  const handleBusinessEmail = () => {
    if (userData.businessEmail) {
      Linking.openURL(`mailto:${userData.businessEmail}`);
    }
  };

  const getFullAddress = () => {
    if (!userData.address) return null;
    const { street, city, state, country, zipCode } = userData.address;
    const parts = [street, city, state, zipCode, country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Enhanced Header with Banner */}
      <View style={styles.header}>
        {userData.bannerImage ? (
          <Image source={{ uri: userData.bannerImage }} style={styles.bannerImage} />
        ) : (
          <View style={styles.defaultBanner}>
            <View style={styles.bannerPattern} />
          </View>
        )}
        <View style={styles.bannerOverlay} />
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData.bannerImage ? (
              <Image source={{ uri: userData.bannerImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {userData.firstName?.[0]}{userData.lastName?.[0]}
                </Text>
              </View>
            )}
            {userData.isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={24} color="#FFD700" />
              </View>
            )}
          </View>
          
          <View style={styles.nameSection}>
            <Text style={styles.name}>
              {`${userData.firstName} ${userData.lastName}`}
            </Text>
            {userData.companyName && (
              <Text style={styles.companyName}>{userData.companyName}</Text>
            )}
            <View style={styles.roleContainer}>
              <Trophy size={20} color="#1a1a1a" />
              <Text style={styles.role}>Event Promoter</Text>
              {userData.isVerified && (
                <Shield size={16} color="#1a1a1a" style={styles.verifiedIcon} />
              )}
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { 
                backgroundColor: userData.isActive ? '#4CAF50' : '#FF5722' 
              }]} />
              <Text style={styles.statusText}>
                {userData.isActive ? 'Active Promoter' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Bio Section */}
        {userData.bio && (
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{userData.bio}</Text>
          </View>
        )}

        {/* Professional Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Professional Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Calendar size={24} color="#FFD700" />
              <Text style={styles.statValue}>{promoterEvents?.length || 0}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{userData.yearsExperience || 0}</Text>
              <Text style={styles.statLabel}>Years Experience</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={24} color="#FF9800" />
              <Text style={styles.statValue}>
                {promoterEvents?.filter(e => e.status === 'Completed').length || 0}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/create-event')}
            >
              <CalendarPlus size={24} color="#FFD700" />
              <Text style={styles.actionText}>New Event</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/promoter-events')}
            >
              <Trophy size={24} color="#4CAF50" />
              <Text style={styles.actionText}>My Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/editProfile/PromoterEditProfile')}
            >
              <Edit size={24} color="#2196F3" />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleBusinessEmail}>
            <Mail size={20} color="#FFD700" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Business Email</Text>
              <Text style={styles.contactValue}>
                {userData.businessEmail || userData.email}
              </Text>
            </View>
            <ExternalLink size={16} color="#ccc" />
          </TouchableOpacity>

          {userData.phoneNumber && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Phone size={20} color="#4CAF50" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{userData.phoneNumber}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {userData.website && (
            <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
              <Globe size={20} color="#2196F3" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>{userData.website}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {getFullAddress() && (
            <View style={styles.contactItem}>
              <MapPin size={20} color="#FF9800" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Business Address</Text>
                <Text style={styles.contactValue}>{getFullAddress()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Professional Credentials */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Professional Credentials</Text>
          
          <View style={styles.credentialItem}>
            <Award size={20} color="#FFD700" />
            <View style={styles.credentialContent}>
              <Text style={styles.credentialLabel}>Verification Status</Text>
              <View style={styles.verificationStatus}>
                <Text style={[styles.credentialValue, {
                  color: userData.isVerified ? '#4CAF50' : '#FF5722'
                }]}>
                  {userData.isVerified ? 'Verified Promoter' : 'Pending Verification'}
                </Text>
                {userData.isVerified && (
                  <CheckCircle size={16} color="#4CAF50" style={styles.checkIcon} />
                )}
              </View>
            </View>
          </View>

          {userData.licenseNumber && (
            <View style={styles.credentialItem}>
              <Shield size={20} color="#2196F3" />
              <View style={styles.credentialContent}>
                <Text style={styles.credentialLabel}>License Number</Text>
                <Text style={styles.credentialValue}>{userData.licenseNumber}</Text>
              </View>
            </View>
          )}

          <View style={styles.credentialItem}>
            <Calendar size={20} color="#9C27B0" />
            <View style={styles.credentialContent}>
              <Text style={styles.credentialLabel}>Member Since</Text>
              <Text style={styles.credentialValue}>
                {new Date(userData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Event Specialties */}
        {userData.specialties && userData.specialties.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Event Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {userData.specialties.map((specialty: string, index: number) => (
                <View key={index} style={styles.specialtyTag}>
                  <Star size={16} color="#1a1a1a" />
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Events Preview */}
        {promoterEvents && promoterEvents.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Events</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/promoter-events')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ExternalLink size={16} color="#FFD700" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.eventsPreview}>
              {promoterEvents.slice(0, 3).map((event) => (
                <View key={event._id} style={styles.eventPreviewItem}>
                  <View style={styles.eventPreviewInfo}>
                    <Text style={styles.eventPreviewTitle}>{event.eventName}</Text>
                    <Text style={styles.eventPreviewDate}>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.eventPreviewVenue}>{event.venue}</Text>
                  </View>
                  <View style={[styles.eventStatusBadge, {
                    backgroundColor: event.status === 'Upcoming' ? '#FFD700' : 
                                   event.status === 'Completed' ? '#4CAF50' : '#FF9800'
                  }]}>
                    <Text style={styles.eventStatusText}>{event.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Social Media */}
        {userData.socials && Object.values(userData.socials).some(Boolean) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Social Media Presence</Text>
            <View style={styles.socialsGrid}>
              {userData.socials.instagram && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/instagram-new.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
              )}
              {userData.socials.facebook && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/facebook-new.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              )}
              {userData.socials.youtube && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/youtube-play.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>YouTube</Text>
                </TouchableOpacity>
              )}
              {userData.socials.twitter && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/twitter.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Twitter</Text>
                </TouchableOpacity>
              )}
              {userData.socials.linkedin && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/linkedin.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>LinkedIn</Text>
                </TouchableOpacity>
              )}
            </View>
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
    height: 350,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  defaultBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD700',
    position: 'relative',
  },
  bannerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileSection: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
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
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 4,
  },
  nameSection: {
    alignItems: 'center',
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
  companyName: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 6,
    fontWeight: '700',
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  bioCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  bioText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  statsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  actionsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  viewAllText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  contactContent: {
    marginLeft: 16,
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  credentialContent: {
    marginLeft: 16,
    flex: 1,
  },
  credentialLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  credentialValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginLeft: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  specialtyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  specialtyText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  eventsPreview: {
    gap: 12,
  },
  eventPreviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
  },
  eventPreviewInfo: {
    flex: 1,
  },
  eventPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  eventPreviewDate: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 2,
  },
  eventPreviewVenue: {
    fontSize: 12,
    color: '#ccc',
  },
  eventStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  eventStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  socialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    minWidth: '45%',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});