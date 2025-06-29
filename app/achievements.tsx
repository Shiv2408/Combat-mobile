import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Award, Trophy, Calendar, Users, CreditCard as Edit, Trash2, Crown } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import DatePicker from '@/components/DatePicker';

export default function AchievementsScreen() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  const achievements = useQuery(
    api.achievements.getFighterAchievements,
    userData ? { fighterId: userData._id } : "skip"
  );

  const addAchievement = useMutation(api.achievements.addAchievement);
  const updateAchievement = useMutation(api.achievements.updateAchievement);
  const deleteAchievement = useMutation(api.achievements.deleteAchievement);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [opponent, setOpponent] = useState('');
  const [dateWon, setDateWon] = useState('');
  const [lastDefenceDate, setLastDefenceDate] = useState('');
  const [isCurrentlyHeld, setIsCurrentlyHeld] = useState(true);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setTitle('');
    setOrganisation('');
    setOpponent('');
    setDateWon('');
    setLastDefenceDate('');
    setIsCurrentlyHeld(true);
    setNotes('');
    setEditingAchievement(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (achievement: any) => {
    setEditingAchievement(achievement);
    setTitle(achievement.title);
    setOrganisation(achievement.organisation);
    setOpponent(achievement.opponent);
    setDateWon(achievement.dateWon);
    setLastDefenceDate(achievement.lastDefenceDate || '');
    setIsCurrentlyHeld(achievement.isCurrentlyHeld);
    setNotes(achievement.notes || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!userData || !title.trim() || !organisation.trim() || !opponent.trim() || !dateWon.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const achievementData = {
        title: title.trim(),
        organisation: organisation.trim(),
        opponent: opponent.trim(),
        dateWon: dateWon.trim(),
        lastDefenceDate: lastDefenceDate.trim() || undefined,
        isCurrentlyHeld,
        notes: notes.trim() || undefined,
      };

      if (editingAchievement) {
        await updateAchievement({
          achievementId: editingAchievement._id,
          ...achievementData,
        });
      } else {
        await addAchievement({
          fighterId: userData._id,
          ...achievementData,
        });
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error saving achievement:', error);
      Alert.alert('Error', 'Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (achievementId: string) => {
    Alert.alert(
      'Delete Achievement',
      'Are you sure you want to delete this achievement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAchievement({ achievementId: achievementId as any });
            } catch (error) {
              console.error('Error deleting achievement:', error);
              Alert.alert('Error', 'Failed to delete achievement');
            }
          },
        },
      ]
    );
  };

  const handleOpponentPress = (opponentName: string) => {
    // Navigate to opponent profile (to be implemented)
    Alert.alert('Profile', `View ${opponentName}'s profile`);
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
          <Text style={styles.title}>Achievements</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
          >
            <Plus size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Achievements List */}
      <ScrollView style={styles.content}>
        {achievements && achievements.length > 0 ? (
          achievements.map((achievement) => (
            <View key={achievement._id} style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <View style={styles.achievementInfo}>
                  <View style={styles.titleContainer}>
                    <Crown size={20} color="#FFD700" />
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    {achievement.isCurrentlyHeld && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.organisation}>{achievement.organisation}</Text>
                </View>
                <View style={styles.achievementActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(achievement)}
                  >
                    <Edit size={16} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(achievement._id)}
                  >
                    <Trash2 size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.achievementDetails}>
                <View style={styles.detailRow}>
                  <Users size={16} color="#ccc" />
                  <Text style={styles.detailLabel}>Defeated:</Text>
                  <TouchableOpacity onPress={() => handleOpponentPress(achievement.opponent)}>
                    <Text style={styles.opponentName}>{achievement.opponent}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailRow}>
                  <Calendar size={16} color="#ccc" />
                  <Text style={styles.detailLabel}>Won:</Text>
                  <Text style={styles.detailValue}>{achievement.dateWon}</Text>
                </View>

                {achievement.lastDefenceDate && (
                  <View style={styles.detailRow}>
                    <Trophy size={16} color="#ccc" />
                    <Text style={styles.detailLabel}>Last Defence:</Text>
                    <Text style={styles.detailValue}>{achievement.lastDefenceDate}</Text>
                  </View>
                )}

                {achievement.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>{achievement.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Award size={64} color="#666" />
            <Text style={styles.emptyTitle}>No Achievements Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first championship or title to showcase your accomplishments
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
              <Text style={styles.emptyButtonText}>Add Achievement</Text>
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
              {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
            </Text>
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              <Text style={[styles.saveText, loading && styles.disabledText]}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Championship Details</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Title/Championship Name *"
                placeholderTextColor="#666"
                value={title}
                onChangeText={setTitle}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Organisation (e.g., UFC, Bellator) *"
                placeholderTextColor="#666"
                value={organisation}
                onChangeText={setOrganisation}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Opponent Defeated *"
                placeholderTextColor="#666"
                value={opponent}
                onChangeText={setOpponent}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Dates</Text>
              
              <Text style={styles.inputLabel}>Date Won *</Text>
              <DatePicker
                value={dateWon}
                onDateChange={setDateWon}
                placeholder="Select date won"
              />
              
              <Text style={styles.inputLabel}>Last Defence Date (optional)</Text>
              <DatePicker
                value={lastDefenceDate}
                onDateChange={setLastDefenceDate}
                placeholder="Select last defence date"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    isCurrentlyHeld && styles.selectedStatusButton
                  ]}
                  onPress={() => setIsCurrentlyHeld(true)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    isCurrentlyHeld && styles.selectedStatusButtonText
                  ]}>
                    Currently Held
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    !isCurrentlyHeld && styles.selectedStatusButton
                  ]}
                  onPress={() => setIsCurrentlyHeld(false)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    !isCurrentlyHeld && styles.selectedStatusButtonText
                  ]}>
                    Former Champion
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes (optional)"
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
  achievementCard: {
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
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  currentText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  organisation: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  achievementActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  achievementDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#ccc',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  opponentName: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  notesText: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
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
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  selectedStatusButton: {
    backgroundColor: '#FFD700',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '500',
  },
  selectedStatusButtonText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});