import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Search, Filter, Calendar, MapPin, Clock, Mail, Phone, Users } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function AllEventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Upcoming' | 'Live' | 'Completed' | 'Cancelled'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const allEvents = useQuery(api.events.getAllEvents);

  const filteredEvents = (allEvents || []).filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.address?.country?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleEventPress = (event: any) => {
    router.push(`/event-details?id=${event._id}`);
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

  const statusFilters = ['All', 'Upcoming', 'Live', 'Completed', 'Cancelled'] as const;

  const getEventStats = () => {
    if (!allEvents) return { total: 0, upcoming: 0, live: 0, completed: 0 };
    
    return {
      total: allEvents.length,
      upcoming: allEvents.filter(e => e.status === 'Upcoming').length,
      live: allEvents.filter(e => e.status === 'Live').length,
      completed: allEvents.filter(e => e.status === 'Completed').length,
    };
  };

  const stats = getEventStats();

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
          <View style={styles.headerText}>
            <Text style={styles.title}>All Events</Text>
            <Text style={styles.subtitle}>{filteredEvents.length} events</Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, venues, or locations..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filter by Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.statusFilters}>
                {statusFilters.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusFilter,
                      selectedStatus === status && styles.selectedStatusFilter
                    ]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text style={[
                      styles.statusFilterText,
                      selectedStatus === status && styles.selectedStatusFilterText
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Calendar size={20} color="#FFD700" />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={20} color="#FFD700" />
            <Text style={styles.statNumber}>{stats.upcoming}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.live}</Text>
            <Text style={styles.statLabel}>Live</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Events List */}
        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <TouchableOpacity
                key={event._id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventHeader}>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{event.eventName}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(event.status) }
                    ]}>
                      <Text style={styles.statusText}>{event.status}</Text>
                    </View>
                  </View>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=100' }}
                    style={styles.eventImage}
                  />
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Calendar size={16} color="#FFD700" />
                    <Text style={styles.eventDetailText}>
                      {event.eventDate} {event.eventTime && `at ${event.eventTime}`}
                    </Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <MapPin size={16} color="#FFD700" />
                    <Text style={styles.eventDetailText}>
                      {event.venue}, {event.address?.city}, {event.address?.country}
                    </Text>
                  </View>

                  {event.description && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}

                  <View style={styles.eventFooter}>
                    {/* <View style={styles.contactInfo}>
                      {event.email && (
                        <View style={styles.contactItem}>
                          <Mail size={12} color="#ccc" />
                          <Text style={styles.contactText}>{event.email}</Text>
                        </View>
                      )}
                      {event.phoneNumber && (
                        <View style={styles.contactItem}>
                          <Phone size={12} color="#ccc" />
                          <Text style={styles.contactText}>{event.phoneNumber}</Text>
                        </View>
                      )}
                    </View> */}
                    
                    <TouchableOpacity 
                      style={styles.viewDetailsButton}
                      onPress={() => handleEventPress(event)}
                    >
                      <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={64} color="#666" />
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? `No events match "${searchQuery}"`
                  : `No ${selectedStatus.toLowerCase()} events found`
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },
  filtersContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
  },
  selectedStatusFilter: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  statusFilterText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  selectedStatusFilterText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#ccc',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
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
    marginRight: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  eventDetails: {
    gap: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
  eventDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#ccc',
  },
  viewDetailsButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewDetailsText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: '600',
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
  },
});