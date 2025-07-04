import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Calendar, Clock, MapPin, Mail, Phone, CreditCard as Edit, Trash2, Users } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function PromoterEventsScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  const events = useQuery(
    api.events.getPromoterEvents,
    userData ? { promoterId: userData._id } : "skip"
  );

  const deleteEvent = useMutation(api.events.deleteEvent);

  const handleDelete = async (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent({ eventId: eventId as any });
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return '#FFD700';
      case 'Live': return '#4CAF50';
      case 'Completed': return '#2196F3';
      case 'Cancelled': return '#F44336';
      default: return '#ccc';
    }
  };

  if (!userData || userData.role !== 'Promoter') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Promoter profile required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>My Events</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/create-event')}
          >
            <Plus size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
      <ScrollView style={styles.content}>
        {events && events.length > 0 ? (
          events.map((event) => (
            <View key={event._id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{event.eventName}</Text>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                      <Text style={styles.statusText}>{event.status}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.eventActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {/* Navigate to edit event */}}
                  >
                    <Edit size={16} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(event._id)}
                  >
                    <Trash2 size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#ccc" />
                  <Text style={styles.detailText}>{event.eventDate}</Text>
                  {event.eventTime && (
                    <>
                      <Clock size={16} color="#ccc" style={styles.clockIcon} />
                      <Text style={styles.detailText}>{event.eventTime}</Text>
                    </>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={16} color="#ccc" />
                  <Text style={styles.detailText}>
                    {event.venue}
                    {event.address?.city && `, ${event.address.city}`}
                    {event.address?.country && `, ${event.address.country}`}
                  </Text>
                </View>

                {event.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{event.description}</Text>
                  </View>
                )}

               

                {(event.medics || event.sanctions) && (
                  <View style={styles.additionalInfo}>
                    {event.medics && (
                      <View style={styles.infoItem}>
                        <Users size={14} color="#ccc" />
                        <Text style={styles.infoText}>Medical: {event.medics}</Text>
                      </View>
                    )}
                    {event.sanctions && (
                      <View style={styles.infoItem}>
                        <Text style={styles.infoText}>Sanctioned by: {event.sanctions}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#666" />
            <Text style={styles.emptyTitle}>No Events Created</Text>
            <Text style={styles.emptySubtitle}>
              Create your first event to start organizing fights and building your promotion
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={() => router.push('/create-event')}
            >
              <Text style={styles.emptyButtonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  headerContent: {
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  eventDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clockIcon: {
    marginLeft: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#ccc',
  },
  descriptionContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#FFD700',
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#ccc',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 100,
  },
});