import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from 'convex/react';
import { ArrowLeft, Calendar, Clock, MapPin, Mail, Phone, Users, Shield, Share, ExternalLink } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;

  // For now, we'll get all events and find the one we need
  // In a real app, you'd have a getEventById query
  const allEvents = useQuery(api.events.getAllEvents);
  const event = allEvents?.find(e => e._id === eventId);

  if (!event) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Event Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return '#FFD700';
      case 'Live': return '#4CAF50';
      case 'Completed': return '#2196F3';
      case 'Cancelled': return '#F44336';
      default: return '#ccc';
    }
  };

  const handleContact = (type: 'email' | 'phone', value: string) => {
    if (type === 'email') {
      Linking.openURL(`mailto:${value}`);
    } else {
      Linking.openURL(`tel:${value}`);
    }
  };

  const handleShare = () => {
    Alert.alert('Share Event', 'Share functionality would be implemented here');
  };

  const handleDirections = () => {
    const address = `${event.street}, ${event.city}, ${event.country}`;
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

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
        <Text style={styles.title}>Event Details</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Share size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Event Hero */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(event.status) }
            ]}>
              <Text style={styles.statusText}>{event.status}</Text>
            </View>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.eventName}</Text>
          
          {event.description && (
            <Text style={styles.eventDescription}>{event.description}</Text>
          )}

          {/* Date & Time */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.infoRow}>
              <Calendar size={20} color="#FFD700" />
              <Text style={styles.infoText}>{event.eventDate}</Text>
            </View>
            {event.eventTime && (
              <View style={styles.infoRow}>
                <Clock size={20} color="#FFD700" />
                <Text style={styles.infoText}>{event.eventTime}</Text>
              </View>
            )}
          </View>

          {/* Venue */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Venue</Text>
            <View style={styles.infoRow}>
              <MapPin size={20} color="#FFD700" />
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{event.venue}</Text>
                <Text style={styles.venueAddress}>
                  {event.street && `${event.street}, `}
                  {event.city}, {event.country}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={handleDirections}
            >
              <ExternalLink size={16} color="#1a1a1a" />
              <Text style={styles.directionsText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Contact */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {event.email && (
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleContact('email', event.email)}
              >
                <Mail size={20} color="#FFD700" />
                <Text style={styles.contactText}>{event.email}</Text>
              </TouchableOpacity>
            )}
            {event.phoneNumber && (
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleContact('phone', event.phoneNumber)}
              >
                <Phone size={20} color="#FFD700" />
                <Text style={styles.contactText}>{event.phoneNumber}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Additional Info */}
          {(event.medics || event.sanctions) && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              {event.medics && (
                <View style={styles.infoRow}>
                  <Users size={20} color="#FFD700" />
                  <View>
                    <Text style={styles.infoLabel}>Medical Staff</Text>
                    <Text style={styles.infoText}>{event.medics}</Text>
                  </View>
                </View>
              )}
              {event.sanctions && (
                <View style={styles.infoRow}>
                  <Shield size={20} color="#FFD700" />
                  <View>
                    <Text style={styles.infoLabel}>Sanctioning Body</Text>
                    <Text style={styles.infoText}>{event.sanctions}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Get Tickets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Share size={20} color="#FFD700" />
              <Text style={styles.secondaryButtonText}>Share Event</Text>
            </TouchableOpacity>
          </View>
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  heroOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  eventInfo: {
    padding: 24,
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  eventDescription: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 4,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#ccc',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 8,
  },
  directionsText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    gap: 16,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#FFD700',
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