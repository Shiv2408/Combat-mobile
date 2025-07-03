import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users, X, Grid3x3, List, ChartBar as BarChart3, Eye, Filter, Search, Star } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'upcoming'>('calendar');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');

  const allEvents = useQuery(api.events.getAllEvents);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEventsForDate = (date: Date) => {
    if (!allEvents) return [];

    const dateString = date.toISOString().split('T')[0];
    return allEvents.filter(event => event.eventDate === dateString);
  };

  const getUpcomingEvents = () => {
    if (!allEvents) return [];

    const now = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(now.getDate() + 14);

    return allEvents
      .filter(event => {
        const eventDate = new Date(event.eventDate);
        const matchesFilter = filterStatus === 'all' || event.status.toLowerCase() === filterStatus;

        if (viewMode === 'upcoming') {
          return eventDate >= now && eventDate <= twoWeeksFromNow && matchesFilter;
        }
        return matchesFilter;
      })
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    const eventsForDay = getEventsForDate(date);
    if (eventsForDay.length > 0) {
      setSelectedEvent(eventsForDay[0]);
      setModalVisible(true);
    }
  };

  const selectedDateString = selectedDate ? selectedDate.toString().split('T')[0] : '';

  const handleEventPress = (event: any) => {
    setModalVisible(false);
    router.push(`/event-details?id=${event._id}`);
  };

  const getEventDensity = () => {
    if (!allEvents) return { total: 0, upcoming: 0, thisMonth: 0, live: 0 };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const now = new Date();

    return {
      total: allEvents.length,
      upcoming: allEvents.filter(e => e.status === 'Upcoming' && new Date(e.eventDate) >= now).length,
      live: allEvents.filter(e => e.status === 'Live').length,
      thisMonth: allEvents.filter(e => {
        const eventDate = new Date(e.eventDate);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      }).length,
    };
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

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const eventsForDay = getEventsForDate(date);
      if (eventsForDay.length > 0) {
        return (
          <View style={styles.eventDots}>
            {eventsForDay.slice(0, 3).map((event, index) => (
              <View
                key={index}
                style={[
                  styles.eventDot,
                  { backgroundColor: getStatusColor(event.status) }
                ]}
              />
            ))}
            {eventsForDay.length > 3 && (
              <Text style={styles.moreEvents}>+{eventsForDay.length - 3}</Text>
            )}
          </View>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const eventsForDay = getEventsForDate(date);
      if (eventsForDay.length > 0) {
        return 'has-events';
      }
    }
    return '';
  };

  const eventDensity = getEventDensity();
  const upcomingEvents = getUpcomingEvents();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#FFD700', '#FFA000', '#FF8F00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <CalendarIcon size={32} color="#1a1a1a" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Event Calendar</Text>
              <Text style={styles.subtitle}>Discover upcoming fights & events</Text>
            </View>
            <View style={styles.headerStats}>
              <Text style={styles.headerStatsNumber}>{eventDensity.upcoming}</Text>
              <Text style={styles.headerStatsLabel}>Upcoming</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Event Density Stats */}
        <View style={styles.densitySection}>
          <View style={styles.densityHeader}>
            <BarChart3 size={24} color="#FFD700" />
            <Text style={styles.densityTitle}>Event Overview</Text>
          </View>
          <View style={styles.densityGrid}>
            <View style={styles.densityCard}>
              <Text style={styles.densityNumber}>{eventDensity.total}</Text>
              <Text style={styles.densityLabel}>Total Events</Text>
            </View>
            <View style={styles.densityCard}>
              <Text style={[styles.densityNumber, { color: '#4CAF50' }]}>{eventDensity.upcoming}</Text>
              <Text style={styles.densityLabel}>Upcoming</Text>
            </View>
            <View style={styles.densityCard}>
              <Text style={[styles.densityNumber, { color: '#FF9800' }]}>{eventDensity.live}</Text>
              <Text style={styles.densityLabel}>Live Now</Text>
            </View>
            <View style={styles.densityCard}>
              <Text style={[styles.densityNumber, { color: '#2196F3' }]}>{eventDensity.thisMonth}</Text>
              <Text style={styles.densityLabel}>This Month</Text>
            </View>
          </View>
        </View>

        {/* View Mode Selector */}
        <View style={styles.viewModeSelector}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'calendar' && styles.activeViewMode]}
            onPress={() => setViewMode('calendar')}
            activeOpacity={0.8}
          >
            <Grid3x3 size={18} color={viewMode === 'calendar' ? '#1a1a1a' : '#FFD700'} />
            <Text style={[styles.viewModeText, viewMode === 'calendar' && styles.activeViewModeText]}>
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'upcoming' && styles.activeViewMode]}
            onPress={() => setViewMode('upcoming')}
            activeOpacity={0.8}
          >
            <List size={18} color={viewMode === 'upcoming' ? '#1a1a1a' : '#FFD700'} />
            <Text style={[styles.viewModeText, viewMode === 'upcoming' && styles.activeViewModeText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'calendar' ? (
          /* Calendar View */
          <View style={styles.calendarContainer}>
            <View style={styles.calendarWrapper}>
              <Calendar
                onDayPress={(day) => handleDatePress(new Date(day.dateString))}
                markedDates={{
                  [selectedDateString]: {
                    selected: true,
                    marked: true,
                    selectedColor: '#FFD700'
                  }
                }}
                theme={{
                  calendarBackground: '#fff',
                  selectedDayBackgroundColor: '#FFD700',
                  todayTextColor: '#FF9800',
                  arrowColor: '#FFD700',
                  monthTextColor: '#000',
                  dayTextColor: '#333'
                }}
              />

            </View>

            {/* Calendar Legend */}
            <View style={styles.calendarLegend}>
              <Text style={styles.legendTitle}>Event Status</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
                  <Text style={styles.legendText}>Upcoming</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>Live</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
                  <Text style={styles.legendText}>Completed</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                  <Text style={styles.legendText}>Cancelled</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* Upcoming Events View */
          <View style={styles.upcomingContainer}>
            {/* Filter Buttons */}
            <View style={styles.filterContainer}>

              <View style={styles.filterButtons}>
                {(['all', 'upcoming', 'live', 'completed'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      filterStatus === status && styles.activeFilterButton
                    ]}
                    onPress={() => setFilterStatus(status)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterStatus === status && styles.activeFilterButtonText
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Events List */}
            <View style={styles.eventsList}>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <TouchableOpacity
                    key={event._id}
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event)}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#2a2a2a', '#1a1a1a']}
                      style={styles.eventCardGradient}
                    >
                      <View style={styles.eventCardHeader}>
                        <Image
                          source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=100' }}
                          style={styles.eventCardImage}
                        />
                        <View style={styles.eventCardInfo}>
                          <Text style={styles.eventCardTitle}>{event.eventName}</Text>
                          <View style={[
                            styles.eventCardStatus,
                            { backgroundColor: getStatusColor(event.status) }
                          ]}>
                            <Text style={styles.eventCardStatusText}>{event.status}</Text>
                          </View>
                        </View>
                        <View style={styles.eventCardArrow}>
                          <Eye size={16} color="#FFD700" />
                        </View>
                      </View>

                      <View style={styles.eventCardDetails}>
                        <View style={styles.eventCardDetail}>
                          <CalendarIcon size={14} color="#FFD700" />
                          <Text style={styles.eventCardDetailText}>
                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>

                        {event.eventTime && (
                          <View style={styles.eventCardDetail}>
                            <Clock size={14} color="#FFD700" />
                            <Text style={styles.eventCardDetailText}>{event.eventTime}</Text>
                          </View>
                        )}

                        <View style={styles.eventCardDetail}>
                          <MapPin size={14} color="#FFD700" />
                          <Text style={styles.eventCardDetailText}>
                            {event.venue}, {event?.address?.city}
                          </Text>
                        </View>
                      </View>

                      {event.description && (
                        <Text style={styles.eventCardDescription} numberOfLines={2}>
                          {event.description}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <CalendarIcon size={64} color="#666" />
                  <Text style={styles.emptyTitle}>No Events Found</Text>
                  <Text style={styles.emptySubtitle}>
                    {filterStatus === 'all'
                      ? 'No events scheduled for the next two weeks'
                      : `No ${filterStatus} events found`
                    }
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/all-events')}
            activeOpacity={0.8}
          >
            <CalendarIcon size={20} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>View All Events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/all-users')}
            activeOpacity={0.8}
          >
            <Users size={20} color="#1a1a1a" />
            <Text style={styles.actionButtonText}>Browse Community</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Events Preview */}
        {allEvents && allEvents.length > 0 && (
          <View style={styles.featuredSection}>
            <View style={styles.featuredHeader}>
              <Star size={24} color="#FFD700" />
              <Text style={styles.sectionTitle}>Featured Events</Text>
            </View>
            <View style={styles.featuredCards}>
              {allEvents.slice(0, 3).map((event) => (
                <TouchableOpacity
                  key={event._id}
                  style={styles.featuredCard}
                  onPress={() => handleEventPress(event)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=300' }}
                    style={styles.featuredCardImage}
                  />
                  <View style={styles.featuredCardOverlay}>
                    <View style={[
                      styles.featuredCardStatus,
                      { backgroundColor: getStatusColor(event.status) }
                    ]}>
                      <Text style={styles.featuredCardStatusText}>{event.status}</Text>
                    </View>
                    <Text style={styles.featuredCardTitle}>{event.eventName}</Text>
                    <Text style={styles.featuredCardDate}>{event.eventDate}</Text>
                    <Text style={styles.featuredCardVenue}>{event.venue}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Event Detail Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
        >
          {selectedEvent && (
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['#1a1a1a', '#2a2a2a']}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Event Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.8}
                  >
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{selectedEvent.eventName}</Text>

                  <View style={styles.eventDetailRow}>
                    <CalendarIcon size={20} color="#FFD700" />
                    <Text style={styles.eventDetailText}>
                      {selectedEvent.eventDate} {selectedEvent.eventTime && `at ${selectedEvent.eventTime}`}
                    </Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <MapPin size={20} color="#FFD700" />
                    <Text style={styles.eventDetailText}>
                      {selectedEvent.venue}, {selectedEvent.city}, {selectedEvent.country}
                    </Text>
                  </View>

                  {selectedEvent.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionTitle}>Description</Text>
                      <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.viewFullButton}
                    onPress={() => handleEventPress(selectedEvent)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewFullButtonText}>View Full Details</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        </Modal>
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
  },
  headerStats: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  headerStatsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerStatsLabel: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  // content: {
  //   flex: 1,
  //   paddingHorizontal: 24,
  //   paddingTop: 24,
  // },
  densitySection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  densityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  densityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  densityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  densityCard: {
    alignItems: 'center',
    flex: 1,
  },
  densityNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  densityLabel: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'center',
    fontWeight: '500',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeViewMode: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  activeViewModeText: {
    color: '#1a1a1a',
  },
  calendarContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  eventDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreEvents: {
    fontSize: 8,
    color: '#666',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  calendarLegend: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#ccc',
  },
  upcomingContainer: {
    marginBottom: 24,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
  },
  activeFilterButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  eventsList: {
    gap: 16,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  eventCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventCardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  eventCardInfo: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  eventCardStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  eventCardStatusText: {
    fontSize: 10,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  eventCardArrow: {
    padding: 8,
  },
  eventCardDetails: {
    gap: 8,
    marginBottom: 12,
  },
  eventCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventCardDetailText: {
    fontSize: 14,
    color: '#ccc',
  },
  eventCardDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 100,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredCards: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredCard: {
    width: 250,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredCardImage: {
    width: '100%',
    height: '100%',
  },
  featuredCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
  },
  featuredCardStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredCardStatusText: {
    fontSize: 10,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  featuredCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featuredCardDate: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 2,
  },
  featuredCardVenue: {
    fontSize: 12,
    color: '#ccc',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  eventDetails: {
    gap: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventDetailText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  viewFullButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  viewFullButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});