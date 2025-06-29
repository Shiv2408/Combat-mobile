import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users, X, Grid3x3, List, ChartBar as BarChart3, Eye } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 48) / 7; // 7 days, 48px for padding

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  
  const allEvents = useQuery(api.events.getAllEvents);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    if (!allEvents || !day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return allEvents.filter(event => event.eventDate === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDatePress = (day: number) => {
    const eventsForDay = getEventsForDate(day);
    if (eventsForDay.length > 0) {
      setSelectedEvent(eventsForDay[0]); // Show first event for now
      setModalVisible(true);
    }
  };

  const handleEventPress = (event: any) => {
    setModalVisible(false);
    router.push(`/event-details?id=${event._id}`);
  };

  const getEventDensity = () => {
    if (!allEvents) return { total: 0, upcoming: 0, thisMonth: 0 };
    
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return {
      total: allEvents.length,
      upcoming: allEvents.filter(e => e.status === 'Upcoming').length,
      thisMonth: allEvents.filter(e => {
        const eventDate = new Date(e.eventDate);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      }).length,
    };
  };

  const days = getDaysInMonth(currentDate);
  const eventDensity = getEventDensity();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <CalendarIcon size={32} color="#1a1a1a" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Event Calendar</Text>
            <Text style={styles.subtitle}>Discover upcoming fights</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              <Text style={[styles.densityNumber, { color: '#2196F3' }]}>{eventDensity.thisMonth}</Text>
              <Text style={styles.densityLabel}>This Month</Text>
            </View>
          </View>
        </View>

        {/* View Mode Selector */}
        <View style={styles.viewModeSelector}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'month' && styles.activeViewMode]}
            onPress={() => setViewMode('month')}
            activeOpacity={0.8}
          >
            <Grid3x3 size={18} color={viewMode === 'month' ? '#1a1a1a' : '#FFD700'} />
            <Text style={[styles.viewModeText, viewMode === 'month' && styles.activeViewModeText]}>
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'week' && styles.activeViewMode]}
            onPress={() => setViewMode('week')}
            activeOpacity={0.8}
          >
            <BarChart3 size={18} color={viewMode === 'week' ? '#1a1a1a' : '#FFD700'} />
            <Text style={[styles.viewModeText, viewMode === 'week' && styles.activeViewModeText]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
            onPress={() => setViewMode('list')}
            activeOpacity={0.8}
          >
            <List size={18} color={viewMode === 'list' ? '#1a1a1a' : '#FFD700'} />
            <Text style={[styles.viewModeText, viewMode === 'list' && styles.activeViewModeText]}>
              List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
            activeOpacity={0.8}
          >
            <ChevronLeft size={24} color="#FFD700" />
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
            activeOpacity={0.8}
          >
            <ChevronRight size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {dayNames.map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              const eventsForDay = day ? getEventsForDate(day) : [];
              const hasEvents = eventsForDay.length > 0;
              const isToday = day && 
                day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() && 
                currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    hasEvents && styles.dayWithEvents,
                    isToday && styles.todayCell,
                  ]}
                  onPress={() => day && handleDatePress(day)}
                  disabled={!day || !hasEvents}
                  activeOpacity={hasEvents ? 0.8 : 1}
                >
                  {day && (
                    <>
                      <Text style={[
                        styles.dayText,
                        hasEvents && styles.dayTextWithEvents,
                        isToday && styles.todayText,
                      ]}>
                        {day}
                      </Text>
                      {hasEvents && (
                        <View style={styles.eventIndicator}>
                          <View style={styles.eventDot} />
                          {eventsForDay.length > 1 && (
                            <Text style={styles.eventCount}>+{eventsForDay.length - 1}</Text>
                          )}
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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

        {/* Upcoming Events Preview */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {allEvents?.slice(0, 3).map((event) => (
            <TouchableOpacity 
              key={event._id} 
              style={styles.eventPreview}
              onPress={() => handleEventPress(event)}
              activeOpacity={0.9}
            >
              <View style={styles.eventPreviewContent}>
                <Text style={styles.eventPreviewTitle}>{event.eventName}</Text>
                <View style={styles.eventPreviewDetails}>
                  <View style={styles.eventPreviewDetail}>
                    <CalendarIcon size={14} color="#FFD700" />
                    <Text style={styles.eventPreviewText}>{event.eventDate}</Text>
                  </View>
                  <View style={styles.eventPreviewDetail}>
                    <MapPin size={14} color="#FFD700" />
                    <Text style={styles.eventPreviewText}>{event.venue}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.eventPreviewArrow}>
                <Eye size={16} color="#FFD700" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Event Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedEvent && (
          <View style={styles.modalContainer}>
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

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
            </ScrollView>
          </View>
        )}
      </Modal>
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
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  densityLabel: {
    fontSize: 12,
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  monthYear: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendar: {
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
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dayHeader: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
    margin: 2,
  },
  dayWithEvents: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  todayCell: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dayText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  dayTextWithEvents: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  eventCount: {
    fontSize: 8,
    color: '#FFD700',
    fontWeight: 'bold',
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
  upcomingSection: {
    marginBottom: 100, // Extra space for tab bar
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  eventPreview: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  eventPreviewContent: {
    flex: 1,
  },
  eventPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  eventPreviewDetails: {
    gap: 4,
  },
  eventPreviewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventPreviewText: {
    fontSize: 14,
    color: '#ccc',
  },
  eventPreviewArrow: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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