import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Trophy, CreditCard as Edit, Mail, Calendar, MapPin, User, Users, CalendarPlus, Phone, Globe, Shield, Award, Star, Building, Clock, CircleCheck as CheckCircle, ExternalLink, Activity, TrendingUp, Target, Briefcase, Instagram, Facebook, Youtube, Twitter, Linkedin } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function PromoterProfile() {
  const { user } = useUser();
  
  const userData = useQuery(
    api.promoters.getPromoterProfile,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const promoterStats = useQuery(
    api.promoters.getPromoterStatistics,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const recentEvents = useQuery(
    api.promoters.getPromoterEventsDetailed,
    user?.id ? { clerkId: user.id, status: undefined } : "skip"
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
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading Promoter Profile...</Text>
      </View>
    );
  }

  const handleCall = () => {
    if (userData.phoneNumber) {
      Linking.openURL(`tel:${userData.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (userData.website) {
      Linking.openURL(userData.website.startsWith('http') ? userData.website : `https://${userData.website}`);
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

  const handleSocialLink = (platform: string, handle: string | undefined) => {
      if (!handle) return;
      let url = '';
      switch (platform) {
        case 'instagram':
          url = `https://instagram.com/${handle.replace('@', '')}`;
          break;
        case 'facebook':
          url = `https://facebook.com/${handle}`;
          break;
        case 'youtube':
          url = `https://youtube.com/${handle}`;
          break;
        case 'twitter':
          url = `https://twitter.com/${handle.replace('@', '')}`;
          break;
        case 'linkedin':
          url = `https://linkedin.com/in/${handle}`;
          break;
      }
      if (url) {
        Linking.openURL(url);
      }
    };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
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
                <CheckCircle size={24} color="#4A90E2" />
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
              <Briefcase size={20} color="#fff" />
              <Text style={styles.role}>Event Promoter</Text>
              {userData.isVerified && (
                <Shield size={16} color="#fff" style={styles.verifiedIcon} />
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
        {/* Quick Stats Overview */}
        {promoterStats && (
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStatsGrid}>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{promoterStats.totalEvents}</Text>
                <Text style={styles.quickStatLabel}>Total Events</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatValue, { color: '#4CAF50' }]}>{promoterStats.completedEvents}</Text>
                <Text style={styles.quickStatLabel}>Completed</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatValue, { color: '#FFD700' }]}>{promoterStats.upcomingEvents}</Text>
                <Text style={styles.quickStatLabel}>Upcoming</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={[styles.quickStatValue, { color: '#2196F3' }]}>{userData.yearsExperience || 0}</Text>
                <Text style={styles.quickStatLabel}>Years Exp.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bio Section */}
        {userData.bio && (
          <View style={styles.bioCard}>
            <View style={styles.cardTitleContainer}>
              <User size={20} color="#4A90E2" />
              <Text style={styles.cardTitle}>About</Text>
            </View>
            <Text style={styles.bioText}>{userData.bio}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <View style={styles.cardTitleContainer}>
            <Target size={20} color="#4A90E2" />
            <Text style={styles.cardTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/create-event')}
            >
              <CalendarPlus size={24} color="#4A90E2" />
              <Text style={styles.actionText}>New Event</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/promoter-events')}
            >
              <Trophy size={24} color="#4A90E2" />
              <Text style={styles.actionText}>My Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/editProfile/PromoterEditProfile')}
            >
              <Edit size={24} color="#4A90E2" />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Overview */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Activity size={20} color="#4A90E2" />
              <Text style={styles.cardTitle}>Professional Overview</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/editProfile/PromoterEditProfile')}
            >
              <Edit size={18} color="#4A90E2" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.professionalGrid}>
            {userData.yearsExperience && (
              <View style={styles.professionalItem}>
                <Clock size={18} color="#4A90E2" />
                <View style={styles.professionalContent}>
                  <Text style={styles.professionalValue}>{userData.yearsExperience} Years</Text>
                  <Text style={styles.professionalLabel}>Experience</Text>
                </View>
              </View>
            )}
            
            <View style={styles.professionalItem}>
              <Shield size={18} color="#4A90E2" />
              <View style={styles.professionalContent}>
                <Text style={[styles.professionalValue, {
                  color: userData.isVerified ? '#4CAF50' : '#FF9800'
                }]}>
                  {userData.isVerified ? 'Verified' : 'Pending'}
                </Text>
                <Text style={styles.professionalLabel}>Status</Text>
              </View>
            </View>

            {userData.licenseNumber && (
              <View style={styles.professionalItem}>
                <Award size={18} color="#4A90E2" />
                <View style={styles.professionalContent}>
                  <Text style={styles.professionalValue}>{userData.licenseNumber}</Text>
                  <Text style={styles.professionalLabel}>License</Text>
                </View>
              </View>
            )}

            {promoterStats && (
              <View style={styles.professionalItem}>
                <TrendingUp size={18} color="#4A90E2" />
                <View style={styles.professionalContent}>
                  <Text style={styles.professionalValue}>{promoterStats.totalEvents}</Text>
                  <Text style={styles.professionalLabel}>Events Organized</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.infoCard}>
          <View style={styles.cardTitleContainer}>
            <Mail size={20} color="#4A90E2" />
            <Text style={styles.cardTitle}>Contact Information</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Mail size={20} color="#4A90E2" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Personal Email</Text>
              <Text style={styles.contactValue}>{userData.email}</Text>
            </View>
          </View>

          {userData.businessEmail && (
            <TouchableOpacity style={styles.contactItem} onPress={handleBusinessEmail}>
              <Building size={20} color="#4A90E2" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Business Email</Text>
                <Text style={styles.contactValue}>{userData.businessEmail}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {userData.phoneNumber && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Phone size={20} color="#4A90E2" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{userData.phoneNumber}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {userData.website && (
            <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
              <Globe size={20} color="#4A90E2" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>{userData.website}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {getFullAddress() && (
            <View style={styles.contactItem}>
              <MapPin size={20} color="#4A90E2" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Business Address</Text>
                <Text style={styles.contactValue}>{getFullAddress()}</Text>
              </View>
            </View>
          )}

          <View style={styles.contactItem}>
            <Calendar size={20} color="#4A90E2" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Member Since</Text>
              <Text style={styles.contactValue}>
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
            <View style={styles.cardTitleContainer}>
              <Star size={20} color="#4A90E2" />
              <Text style={styles.cardTitle}>Event Specialties</Text>
            </View>
            <View style={styles.specialtiesContainer}>
              {userData.specialties.map((specialty: string, index: number) => (
                <View key={index} style={styles.specialtyTag}>
                  <Award size={16} color="#fff" />
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Event Statistics */}
        {promoterStats && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <TrendingUp size={20} color="#4A90E2" />
                <Text style={styles.cardTitle}>Event Statistics</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/promoter-events')}
              >
                <Trophy size={18} color="#4A90E2" />
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.eventStatsContainer}>
              <View style={styles.eventStatsGrid}>
                <View style={styles.eventStatItem}>
                  <Text style={styles.eventStatValue}>{promoterStats.totalEvents}</Text>
                  <Text style={styles.eventStatLabel}>Total Events</Text>
                </View>
                <View style={styles.eventStatItem}>
                  <Text style={[styles.eventStatValue, { color: '#4CAF50' }]}>{promoterStats.completedEvents}</Text>
                  <Text style={styles.eventStatLabel}>Completed</Text>
                </View>
                <View style={styles.eventStatItem}>
                  <Text style={[styles.eventStatValue, { color: '#FFD700' }]}>{promoterStats.upcomingEvents}</Text>
                  <Text style={styles.eventStatLabel}>Upcoming</Text>
                </View>
                <View style={styles.eventStatItem}>
                  <Text style={[styles.eventStatValue, { color: '#FF5722' }]}>{promoterStats.cancelledEvents}</Text>
                  <Text style={styles.eventStatLabel}>Cancelled</Text>
                </View>
              </View>

              {promoterStats.nextEvent && (
                <View style={styles.nextEventContainer}>
                  <Text style={styles.nextEventTitle}>Next Event</Text>
                  <View style={styles.nextEventCard}>
                    <Text style={styles.nextEventName}>{promoterStats.nextEvent.eventName}</Text>
                    <Text style={styles.nextEventDate}>
                      {new Date(promoterStats.nextEvent.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.nextEventVenue}>{promoterStats.nextEvent.venue}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Recent Events Preview */}
        {recentEvents && recentEvents.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Calendar size={20} color="#4A90E2" />
                <Text style={styles.cardTitle}>Recent Events</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/promoter-events')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ExternalLink size={16} color="#4A90E2" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.eventsPreview}>
              {recentEvents.slice(0, 3).map((event) => (
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
                                   event.status === 'Completed' ? '#4CAF50' : 
                                   event.status === 'Live' ? '#FF5722' : '#FF9800'
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
            <View style={styles.cardTitleContainer}>
              <Users size={20} color="#4A90E2" />
              <Text style={styles.cardTitle}>Social Media & Marketing</Text>
            </View>
              {userData.socials?.instagram && (
                <TouchableOpacity 
                  style={styles.socialItem}
                  onPress={() => handleSocialLink('instagram', userData.socials?.instagram)}
                >
                  <Instagram size={24} color="#E4405F" />
                  <Text style={styles.socialText}>@{userData.socials.instagram}</Text>
                </TouchableOpacity>
              )}
              {userData.socials?.facebook && (
                <TouchableOpacity 
                  style={styles.socialItem}
                  onPress={() => handleSocialLink('facebook', userData.socials?.facebook)}
                >
                  <Facebook size={24} color="#1877F2" />
                  <Text style={styles.socialText}>{userData.socials.facebook}</Text>
                </TouchableOpacity>
              )}
              {userData.socials?.youtube && (
                <TouchableOpacity 
                  style={styles.socialItem}
                  onPress={() => handleSocialLink('youtube', userData.socials?.youtube)}
                >
                  <Youtube size={24} color="#FF0000" />
                  <Text style={styles.socialText}>{userData.socials.youtube}</Text>
                </TouchableOpacity>
              )}
              {userData.socials?.twitter && (
                <TouchableOpacity 
                  style={styles.socialItem}
                  onPress={() => handleSocialLink('twitter', userData.socials?.twitter)}
                >
                  <Twitter size={24} color="#1DA1F2" />
                  <Text style={styles.socialText}>@{userData.socials.twitter}</Text>
                </TouchableOpacity>
              )}
              {userData.socials?.linkedin && (
                <TouchableOpacity 
                  style={styles.socialItem}
                  onPress={() => handleSocialLink('linkedin', userData.socials?.linkedin)}
                >
                  <Linkedin size={24} color="#0077B5" />
                  <Text style={styles.socialText}>{userData.socials.linkedin}</Text>
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
    backgroundColor: '#4A90E2',
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
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
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
    fontSize: 18,
    color: '#4A90E2',
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  role: {
    fontSize: 16,
    color: '#fff',
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
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    color: '#4A90E2',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  bioCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  bioText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginTop: 16,
  },
  actionsCard: {
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
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
    color: '#4A90E2',
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
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  professionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  professionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    gap: 12,
  },
  professionalContent: {
    flex: 1,
  },
  professionalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 2,
  },
  professionalLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '500',
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
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  specialtyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  specialtyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventStatsContainer: {
    gap: 20,
  },
  eventStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
  },
  eventStatItem: {
    alignItems: 'center',
  },
  eventStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  eventStatLabel: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '500',
  },
  nextEventContainer: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
  },
  nextEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  nextEventCard: {
    alignItems: 'center',
  },
  nextEventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
    textAlign: 'center',
  },
  nextEventDate: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 4,
    textAlign: 'center',
  },
  nextEventVenue: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
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
    color: '#4A90E2',
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
    color: '#fff',
  },
  socialsContainer: {
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
});