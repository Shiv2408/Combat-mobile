import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';

interface DatePickerProps {
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  style?: any;
}

export default function DatePicker({ value, onDateChange, placeholder = "Select date", style }: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(date);
    onDateChange(formattedDate);
    setShowPicker(false);
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Calendar size={20} color="#FFD700" />
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {formatDisplayDate(value)}
        </Text>
        <ChevronDown size={20} color="#ccc" />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPicker(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => {
              handleDateSelect(selectedDate);
            }}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            {/* Month Navigation */}
            <View style={styles.monthHeader}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateMonth('prev')}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              
              <Text style={styles.monthYear}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </Text>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateMonth('next')}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

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
              {generateCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !!day && styles.dayWithNumber,
                    day === selectedDate.getDate() &&
                    selectedDate.getMonth() === new Date(selectedDate).getMonth() &&
                    !!day && styles.selectedDay
                  ]}
                  onPress={() => {
                    if (day) {
                      const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                      setSelectedDate(newDate);
                    }
                  }}
                  disabled={!day}
                >
                  {day && (
                    <Text style={[
                      styles.dayText,
                      day === selectedDate.getDate() && 
                      selectedDate.getMonth() === new Date(selectedDate).getMonth() && 
                      styles.selectedDayText
                    ]}>
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#444',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  placeholderText: {
    color: '#666',
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
  cancelText: {
    fontSize: 16,
    color: '#F44336',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  doneText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  navButtonText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
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
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayWithNumber: {
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: '#FFD700',
  },
  dayText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
});