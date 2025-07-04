import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Dumbbell, CreditCard as Edit, Mail, Calendar, MapPin, Phone, Globe, Shield, Award, Star, Clock, CircleCheck as CheckCircle, ExternalLink, Users, CreditCard, Settings, Target, Activity, TrendingUp, UserPlus } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

interface GymProfileProps {
  userData: any;
  user: any;
}

export default function GymProfile({ userData, user }: GymProfileProps) {
  // Get gym profile data
  const gymData = useQuery(
    api.gyms.getGymProfile, 
    user?.id && userData?.role === 'Gym' ? { clerkId: user.id } : "skip"
  );

  // Get gym statistics
  const gymStats = useQuery(
    api.gyms.getGymStatistics, 
    user?.id && userData?.role === 'Gym' ? { clerkId: user.id } : "skip"
  );

  // Use gymData if available, otherwise fall back to userData
  const profileData = gymData || userData;

  const handleCall = () => {
    if (profileData.phoneNumber) {
      Linking.openURL(`tel:${profileData.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (profileData.website) {
      Linking.openURL(profileData.website);
    }
  };

  const handleBusinessEmail = () => {
    if (profileData.businessEmail) {
      Linking.openURL(`mailto:${profileData.businessEmail}`);
    }
  };

  const getFullAddress = () => {
    if (!profileData.address) return null;
    const { street, city, state, country, zipCode } = profileData.address;
    const parts = [street, city, state, zipCode, country].filter(Boolean);
    return parts.join(', ');
  };

  const formatOperatingHours = (day: string, hours: string) => {
    if (!hours) return 'Closed';
    return hours;
  };

  const getDayAbbreviation = (day: string) => {
    const abbreviations: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };
    return abbreviations[day] || day;
  };

  // Get gym location for display
  const getLocationDisplay = () => {
    if (!profileData.address) return 'Location not specified';
    const { city, state, country } = profileData.address;
    const parts = [city, state, country].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
  };

  // Loading state
  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading gym profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Enhanced Header with Banner */}
      <View style={styles.header}>
        {profileData.bannerImage ? (
          <Image source={{ uri: profileData.bannerImage }} style={styles.bannerImage} />
        ) : (
          <View style={styles.defaultBanner}>
            <View style={styles.bannerPattern}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                style={styles.bannerImage}
              />
            </View>
          </View>
        )}
        <View style={styles.bannerOverlay} />
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileData.profileImage ? (
              <Image source={{ uri: profileData.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Dumbbell size={48} color="#1a1a1a" />
              </View>
            )}
            {profileData.isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={24} color="#FFD700" />
              </View>
            )}
          </View>
          
          <View style={styles.nameSection}>
            <Text style={styles.name}>{profileData.gymName || 'Gym Name'}</Text>
            <View style={styles.roleContainer}>
              <Dumbbell size={20} color="#1a1a1a" />
              <Text style={styles.role}>Fitness Center</Text>
              {profileData.isVerified && (
                <Shield size={16} color="#1a1a1a" style={styles.verifiedIcon} />
              )}
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#FFD700" />
              <Text style={styles.locationText}>{getLocationDisplay()}</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { 
                backgroundColor: profileData.isActive ? '#4CAF50' : '#FF5722' 
              }]} />
              <Text style={styles.statusText}>
                {profileData.isActive ? 'Open for Business' : 'Temporarily Closed'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Bio Section */}
        {profileData.bio && (
          <View style={styles.bioCard}>
            <View style={styles.bioHeader}>
              <Star size={20} color="#FFD700" />
              <Text style={styles.bioTitle}>About {profileData.gymName}</Text>
            </View>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>
        )}

        {/* Enhanced Gym Stats Card with Real Data */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <TrendingUp size={24} color="#FFD700" />
            <Text style={styles.cardTitle}>Gym Statistics</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Users size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{gymStats?.totalMembers || 0}</Text>
              <Text style={styles.statLabel}>Active Members</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Target size={24} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>{gymStats?.disciplinesOffered || profileData.disciplines?.length || 0}</Text>
              <Text style={styles.statLabel}>Disciplines</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Activity size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{gymStats?.facilitiesCount || profileData.facilities?.length || 0}</Text>
              <Text style={styles.statLabel}>Facilities</Text>
            </View>
          </View>
          
          {/* Additional Stats Row */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <UserPlus size={24} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>{gymStats?.allTimeMembers || 0}</Text>
              <Text style={styles.statLabel}>All-Time Members</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Users size={24} color="#9C27B0" />
              </View>
              <Text style={styles.statValue}>{gymStats?.staffCount || profileData.staff?.length || 0}</Text>
              <Text style={styles.statLabel}>Staff Members</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <CreditCard size={24} color="#E91E63" />
              </View>
              <Text style={styles.statValue}>{gymStats?.membershipTypes || profileData.membershipTypes?.length || 0}</Text>
              <Text style={styles.statLabel}>Membership Plans</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity Card */}
        {gymStats?.recentJoins && gymStats.recentJoins.length > 0 && (
          <View style={styles.recentActivityCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <UserPlus size={20} color="#4CAF50" />
                <Text style={styles.cardTitle}>Recent Members</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.countText}>{gymStats.recentJoins.length}</Text>
              </View>
            </View>
            <View style={styles.recentMembersList}>
              {gymStats.recentJoins.slice(0, 5).map((member: any, index: number) => (
                <View key={index} style={styles.recentMemberItem}>
                  <View style={styles.memberAvatar}>
                    <Users size={16} color="#4CAF50" />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>New Member</Text>
                    <Text style={styles.memberJoinDate}>
                      Joined {new Date(member.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.memberStatus}>
                    <Text style={styles.activeStatus}>Active</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/')}
            >
              <View style={styles.actionIconContainer}>
                <CreditCard size={24} color="#FFD700" />
              </View>
              <Text style={styles.actionText}>Memberships</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/')}
            >
              <View style={styles.actionIconContainer}>
                <Clock size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/editProfile/GymEditProfile')}
            >
              <View style={styles.actionIconContainer}>
                <Settings size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Training Disciplines - Enhanced Card Layout */}
        {profileData.disciplines && profileData.disciplines.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Target size={20} color="#FFD700" />
                <Text style={styles.cardTitle}>Training Disciplines</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{profileData.disciplines.length}</Text>
              </View>
            </View>
            <View style={styles.disciplinesGrid}>
              {profileData.disciplines.map((discipline: string, index: number) => (
                <View key={index} style={styles.disciplineCard}>
                  <View style={styles.disciplineIconContainer}>
                    <Target size={20} color="#FFD700" />
                  </View>
                  <View style={styles.disciplineContent}>
                    <Text style={styles.disciplineText}>{discipline}</Text>
                    <Text style={styles.disciplineSubtext}>Combat Sport</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Facilities & Equipment - Enhanced Card Layout */}
        {profileData.facilities && profileData.facilities.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Activity size={20} color="#4CAF50" />
                <Text style={styles.cardTitle}>Facilities & Equipment</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.countText}>{profileData.facilities.length}</Text>
              </View>
            </View>
            <View style={styles.facilitiesGrid}>
              {profileData.facilities.map((facility: string, index: number) => (
                <View key={index} style={styles.facilityCard}>
                  <View style={styles.facilityIconContainer}>
                    <Activity size={18} color="#4CAF50" />
                  </View>
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityText}>{facility}</Text>
                    <Text style={styles.facilitySubtext}>Professional Grade</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Staff Members - Enhanced Card Layout */}
        {profileData.staff && profileData.staff.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Users size={20} color="#FF9800" />
                <Text style={styles.cardTitle}>Our Expert Team</Text>
              </View>
              <View style={styles.actionButtonsContainer}>
                <View style={[styles.countBadge, { backgroundColor: '#FF9800' }]}>
                  <Text style={styles.countText}>{profileData.staff.length}</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => router.push('/')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <ExternalLink size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.staffGrid}>
              {profileData.staff.map((member: any, index: number) => (
                <View key={index} style={styles.staffCard}>
                  <View style={styles.staffCardHeader}>
                    <View style={styles.staffAvatar}>
                      <Users size={24} color="#FF9800" />
                    </View>
                    <View style={styles.staffRoleBadge}>
                      <Text style={styles.staffRoleBadgeText}>{member.role}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.staffCardContent}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    {member.discipline && (
                      <View style={styles.staffDisciplineContainer}>
                        <Target size={14} color="#FFD700" />
                        <Text style={styles.staffDiscipline}>Specializes in {member.discipline}</Text>
                      </View>
                    )}
                    {member.bio && member.bio.trim() ? (
                      <Text style={styles.staffBio} numberOfLines={2}>
                        {member.bio}
                      </Text>
                    ) : (
                      <Text style={styles.staffBio} numberOfLines={2}>
                        Experienced {member.role.toLowerCase()} dedicated to helping members achieve their fitness goals.
                      </Text>
                    )}
                  </View>

                  <View style={styles.staffCardFooter}>
                    {member.email && member.email.trim() && (
                      <TouchableOpacity 
                        style={styles.staffContactButton}
                        onPress={() => Linking.openURL(`mailto:${member.email}`)}
                      >
                        <Mail size={14} color="#FFD700" />
                        <Text style={styles.contactButtonText}>Email</Text>
                      </TouchableOpacity>
                    )}
                    {member.phoneNumber && member.phoneNumber.trim() && (
                      <TouchableOpacity 
                        style={styles.staffContactButton}
                        onPress={() => Linking.openURL(`tel:${member.phoneNumber}`)}
                      >
                        <Phone size={14} color="#4CAF50" />
                        <Text style={styles.contactButtonText}>Call</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Operating Hours */}
        {profileData.operatingHours && Object.keys(profileData.operatingHours).length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardTitleContainer}>
              <Clock size={20} color="#2196F3" />
              <Text style={styles.cardTitle}>Operating Hours</Text>
            </View>
            <View style={styles.hoursContainer}>
              {Object.entries(profileData.operatingHours).map(([day, hours]) => (
                <View key={day} style={styles.hourItem}>
                  <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>{getDayAbbreviation(day)}</Text>
                    <Text style={styles.dayFullText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  </View>
                  <Text style={[styles.hoursText, {
                    color: hours ? '#fff' : '#888'
                  }]}>
                    {formatOperatingHours(day, hours as string)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.infoCard}>
          <View style={styles.cardTitleContainer}>
            <Mail size={20} color="#E91E63" />
            <Text style={styles.cardTitle}>Contact Information</Text>
          </View>
          
          {profileData.businessEmail && (
            <TouchableOpacity style={styles.contactItem} onPress={handleBusinessEmail}>
              <Mail size={20} color="#FFD700" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Business Email</Text>
                <Text style={styles.contactValue}>{profileData.businessEmail}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {profileData.phoneNumber && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Phone size={20} color="#4CAF50" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{profileData.phoneNumber}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {profileData.website && (
            <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
              <Globe size={20} color="#2196F3" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>{profileData.website}</Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          )}

          {getFullAddress() && (
            <View style={styles.contactItem}>
              <MapPin size={20} color="#FF9800" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>{getFullAddress()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Gym Information */}
        <View style={styles.infoCard}>
          <View style={styles.cardTitleContainer}>
            <Award size={20} color="#FFD700" />
            <Text style={styles.cardTitle}>Gym Information</Text>
          </View>
          
          <View style={styles.credentialItem}>
            <Shield size={20} color={profileData.isVerified ? '#4CAF50' : '#FF5722'} />
            <View style={styles.credentialContent}>
              <Text style={styles.credentialLabel}>Verification Status</Text>
              <View style={styles.verificationStatus}>
                <Text style={[styles.credentialValue, {
                  color: profileData.isVerified ? '#4CAF50' : '#FF5722'
                }]}>
                  {profileData.isVerified ? 'Verified Gym' : 'Pending Verification'}
                </Text>
                {profileData.isVerified && (
                  <CheckCircle size={16} color="#4CAF50" style={styles.checkIcon} />
                )}
              </View>
            </View>
          </View>

          <View style={styles.credentialItem}>
            <Calendar size={20} color="#9C27B0" />
            <View style={styles.credentialContent}>
              <Text style={styles.credentialLabel}>Established</Text>
              <Text style={styles.credentialValue}>
                {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.credentialItem}>
            <Activity size={20} color="#2196F3" />
            <View style={styles.credentialContent}>
              <Text style={styles.credentialLabel}>Status</Text>
              <Text style={[styles.credentialValue, {
                color: profileData.isActive ? '#4CAF50' : '#FF5722'
              }]}>
                {profileData.isActive ? 'Currently Operating' : 'Temporarily Closed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Social Media */}
        {profileData.socials && Object.values(profileData.socials).some(Boolean) && (
          <View style={styles.infoCard}>
            <View style={styles.cardTitleContainer}>
              <Star size={20} color="#E91E63" />
              <Text style={styles.cardTitle}>Follow Us</Text>
            </View>
            <View style={styles.socialsGrid}>
              {profileData.socials.instagram && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/instagram-new.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
              )}
              {profileData.socials.facebook && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/facebook-new.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              )}
              {profileData.socials.youtube && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/youtube-play.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>YouTube</Text>
                </TouchableOpacity>
              )}
              {profileData.socials.twitter && (
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/fluency/48/twitter.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Twitter</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    position: 'relative',
    height: 380,
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
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
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
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
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
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  recentActivityCard: {
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
  recentMembersList: {
    gap: 12,
  },
  recentMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  memberJoinDate: {
    fontSize: 12,
    color: '#ccc',
  },
  memberStatus: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  actionsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  actionIconContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  countBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  disciplinesGrid: {
    gap: 12,
  },
  disciplineCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  disciplineIconContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  disciplineContent: {
    flex: 1,
  },
  disciplineText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  disciplineSubtext: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  facilitiesGrid: {
    gap: 12,
  },
  facilityCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  facilityIconContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  facilityContent: {
    flex: 1,
  },
  facilityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  facilitySubtext: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  staffGrid: {
    gap: 16,
  },
  staffCard: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  staffCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  staffRoleBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  staffRoleBadgeText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  staffCardContent: {
    marginBottom: 12,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  staffDisciplineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  staffDiscipline: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '500',
  },
  staffBio: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 18,
  },
  staffCardFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  staffContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#444',
    flex: 1,
    justifyContent: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  hoursContainer: {
    gap: 8,
    marginTop: 16,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    minWidth: 40,
  },
  dayFullText: {
    fontSize: 12,
    color: '#ccc',
    marginLeft: 8,
  },
  hoursText: {
    fontSize: 14,
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
  socialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
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