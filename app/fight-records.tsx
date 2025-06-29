import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Trophy, Calendar, MapPin, Target, Clock, Youtube } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

const FIGHT_METHODS = [
  'KO', 'TKO', 'Submission', 'Decision', 'Technical Decision', 
  'DQ', 'No Contest', 'Draw'
];

export default function FightRecordsScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  const fightRecords = useQuery(
    api.fights.getFighterRecords,
    userData ? { fighterId: userData._id } : "skip"
  );

  const addFightRecord = useMutation(api.fights.addFightRecord);
  const updateFightRecord = useMutation(api.fights.updateFightRecord);
  const deleteFightRecord = useMutation(api.fights.deleteFightRecord);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingFight, setEditingFight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [eventName, setEventName] = useState('');
  const [fightDate, setFightDate] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [opponent, setOpponent] = useState('');
  const [result, setResult] = useState<'Win' | 'Loss' | 'Draw'>('Win');
  const [method, setMethod] = useState('');
  const [round, setRound] = useState('');
  const [time, setTime] = useState('');
  const [gymName, setGymName] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setEventName('');
    setFightDate('');
    setCountry('');
    setCity('');
    setOpponent('');
    setResult('Win');
    setMethod('');
    setRound('');
    setTime('');
    setGymName('');
    setYoutubeLink('');
    setNotes('');
    setEditingFight(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (fight: any) => {
    setEditingFight(fight);
    setEventName(fight.eventName);
    setFightDate(fight.fightDate);
    setCountry(fight.country);
    setCity(fight.city);
    setOpponent(fight.opponent);
    setResult(fight.result);
    setMethod(fight.method);
    setRound(fight.round?.toString() || '');
    setTime(fight.time || '');
    setGymName(fight.gymName || '');
    setYoutubeLink(fight.youtubeLink || '');
    setNotes(fight.notes || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!userData || !eventName.trim() || !opponent.trim() || !method.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const fightData = {
        eventName: eventName.trim(),
        fightDate: fightDate.trim(),
        country: country.trim(),
        city: city.trim(),
        opponent: opponent.trim(),
        result,
        method: method.trim(),
        round: round ? parseInt(round) : undefined,
        time: time.trim() || undefined,
        gymName: gymName.trim() || undefined,
        youtubeLink: youtubeLink.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      if (editingFight) {
        await updateFightRecord({
          fightId: editingFight._id,
          ...fightData,
        });
      } else {
        await addFightRecord({
          fighterId: userData._id,
          ...fightData,
        });
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error saving fight record:', error);
      Alert.alert('Error', 'Failed to save fight record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fightId: string) => {
    Alert.alert(
      'Delete Fight Record',
      'Are you sure you want to delete this fight record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFightRecord({ fightId: fightId as any });
            } catch (error) {
              console.error('Error deleting fight record:', error);
              Alert.alert('Error', 'Failed to delete fight record');
            }
          },
        },
      ]
    );
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Win': return '#4CAF50';
      case 'Loss': return '#F44336';
      case 'Draw': return '#FF9800';
      default: return '#ccc';
    }
  };

  if (!userData || userData.role !== 'Fighter') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Fighter profile required.</Text>
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
          <Text style={styles.title}>Fight Records</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
          >
            <Plus size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fight Records List */}
      <ScrollView style={styles.content}>
        {fightRecords && fightRecords.length > 0 ? (
          fightRecords.map((fight) => (
            <View key={fight._id} style={styles.fightCard}>
              <View style={styles.fightHeader}>
                <View style={styles.fightInfo}>
                  <Text style={styles.eventName}>{fight.eventName}</Text>
                  <Text style={styles.fightDate}>{fight.fightDate}</Text>
                </View>
                <View style={styles.fightActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(fight)}
                  >
                    <Edit size={16} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(fight._id)}
                  >
                    <Trash2 size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fightDetails}>
                <View style={styles.resultContainer}>
                  <Trophy size={20} color={getResultColor(fight.result)} />
                  <Text style={[styles.result, { color: getResultColor(fight.result) }]}>
                    {fight.result}
                  </Text>
                  <Text style={styles.method}>via {fight.method}</Text>
                </View>

                <View style={styles.opponentContainer}>
                  <Target size={16} color="#ccc" />
                  <Text style={styles.opponent}>vs {fight.opponent}</Text>
                </View>

                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#ccc" />
                  <Text style={styles.location}>{fight.city}, {fight.country}</Text>
                </View>

                {(fight.round || fight.time) && (
                  <View style={styles.timeContainer}>
                    <Clock size={16} color="#ccc" />
                    <Text style={styles.timeText}>
                      {fight.round && `Round ${fight.round}`}
                      {fight.round && fight.time && ' - '}
                      {fight.time}
                    </Text>
                  </View>
                )}

                {fight.youtubeLink && (
                  <TouchableOpacity style={styles.youtubeContainer}>
                    <Youtube size={16} color="#FF0000" />
                    <Text style={styles.youtubeText}>Watch Fight</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Trophy size={64} color="#666" />
            <Text style={styles.emptyTitle}>No Fight Records</Text>
            <Text style={styles.emptySubtitle}>
              Add your first fight record to start tracking your career
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
              <Text style={styles.emptyButtonText}>Add Fight Record</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingFight ? 'Edit Fight' : 'Add Fight Record'}
            </Text>
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              <Text style={[styles.saveText, loading && styles.disabledText]}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Event Name *"
                placeholderTextColor="#666"
                value={eventName}
                onChangeText={setEventName}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Fight Date (e.g., 2024-03-15)"
                placeholderTextColor="#666"
                value={fightDate}
                onChangeText={setFightDate}
              />
              
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Country"
                  placeholderTextColor="#666"
                  value={country}
                  onChangeText={setCountry}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="City"
                  placeholderTextColor="#666"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Fight Details</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Opponent Name *"
                placeholderTextColor="#666"
                value={opponent}
                onChangeText={setOpponent}
              />

              <View style={styles.resultSelector}>
                <Text style={styles.inputLabel}>Result</Text>
                <View style={styles.resultButtons}>
                  {(['Win', 'Loss', 'Draw'] as const).map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.resultButton,
                        result === r && styles.selectedResultButton,
                        result === r && { backgroundColor: getResultColor(r) }
                      ]}
                      onPress={() => setResult(r)}
                    >
                      <Text style={[
                        styles.resultButtonText,
                        result === r && styles.selectedResultButtonText
                      ]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Method (e.g., KO, TKO, Submission) *"
                placeholderTextColor="#666"
                value={method}
                onChangeText={setMethod}
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Round"
                  placeholderTextColor="#666"
                  value={round}
                  onChangeText={setRound}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Time (e.g., 2:45)"
                  placeholderTextColor="#666"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Additional Info</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Gym Name"
                placeholderTextColor="#666"
                value={gymName}
                onChangeText={setGymName}
              />
              
              <TextInput
                style={styles.input}
                placeholder="YouTube Link"
                placeholderTextColor="#666"
                value={youtubeLink}
                onChangeText={setYoutubeLink}
                autoCapitalize="none"
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes"
                placeholderTextColor="#666"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
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
  fightCard: {
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
  fightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  fightInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  fightDate: {
    fontSize: 14,
    color: '#ccc',
  },
  fightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  fightDetails: {
    gap: 12,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  result: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  method: {
    fontSize: 14,
    color: '#ccc',
  },
  opponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  opponent: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    fontSize: 14,
    color: '#ccc',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#ccc',
  },
  youtubeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  youtubeText: {
    fontSize: 14,
    color: '#FF0000',
    fontWeight: '500',
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
  saveText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.6,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  resultSelector: {
    marginBottom: 16,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  selectedResultButton: {
    backgroundColor: '#FFD700',
  },
  resultButtonText: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '500',
  },
  selectedResultButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});