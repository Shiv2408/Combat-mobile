import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { ArrowLeft, Search, Filter, Shield, Trophy, MapPin, Target, Users as UsersIcon } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function AllUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Fighter' | 'Promoter'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const allFighters = useQuery(api.users.getAllFighters);
  const allPromoters = useQuery(api.users.getAllPromoters);

  const allUsers = [
    ...(allFighters || []).map(user => ({ ...user, role: 'Fighter' as const })),
    ...(allPromoters || []).map(user => ({ ...user, role: 'Promoter' as const }))
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ('fightName' in user && user.fightName && user.fightName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.role === 'Fighter' && user.gym && user.gym.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleUserPress = (user: any) => {
    router.push(`/user-profile?id=${user._id}`);
  };

  const roleFilters = ['All', 'Fighter', 'Promoter'] as const;

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
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subtitle}>{filteredUsers.length} members</Text>
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
            placeholder="Search by name, fight name, or gym..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filter by Role</Text>
            <View style={styles.roleFilters}>
              {roleFilters.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleFilter,
                    selectedRole === role && styles.selectedRoleFilter
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[
                    styles.roleFilterText,
                    selectedRole === role && styles.selectedRoleFilterText
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Shield size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{allFighters?.length || 0}</Text>
            <Text style={styles.statLabel}>Fighters</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{allPromoters?.length || 0}</Text>
            <Text style={styles.statLabel}>Promoters</Text>
          </View>
          <View style={styles.statCard}>
            <UsersIcon size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{allUsers.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Users List */}
        <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TouchableOpacity
                key={user._id}
                style={styles.userCard}
                onPress={() => handleUserPress(user)}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.userHeader}>
                    <Text style={styles.userName}>
                      {user.role === 'Fighter' && user.fightName
                        ? user.fightName
                        : `${user.firstName} ${user.lastName}`}
                    </Text>
                    <View style={[
                      styles.roleBadge,
                      user.role === 'Fighter' ? styles.fighterBadge : styles.promoterBadge
                    ]}>
                      {user.role === 'Fighter' ? (
                        <Shield size={12} color="#1a1a1a" />
                      ) : (
                        <Trophy size={12} color="#1a1a1a" />
                      )}
                      <Text style={styles.roleBadgeText}>{user.role}</Text>
                    </View>
                  </View>

                  {user.role === 'Fighter' && user.fightName && (
                    <Text style={styles.realName}>
                      {user.firstName} {user.lastName}
                    </Text>
                  )}

                  <View style={styles.userDetails}>
                    {user.role === 'Fighter' && 'gym' in user && user.gym && (
                      <View style={styles.userDetail}>
                        <MapPin size={14} color="#ccc" />
                        <Text style={styles.userDetailText}>{user.gym}</Text>
                      </View>
                    )}

                    {user.role === 'Fighter' && user.disciplines && user.disciplines.length > 0 && (
                      <View style={styles.disciplinesContainer}>
                        {user.disciplines.slice(0, 2).map((discipline, index) => (
                          <View key={index} style={styles.disciplineTag}>
                            <Text style={styles.disciplineText}>{discipline}</Text>
                          </View>
                        ))}
                        {user.disciplines.length > 2 && (
                          <Text style={styles.moreDisciplines}>
                            +{user.disciplines.length - 2} more
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.userActions}>
                  <TouchableOpacity 
                    style={styles.viewProfileButton}
                    onPress={() => handleUserPress(user)}
                  >
                    <Target size={16} color="#FFD700" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <UsersIcon size={64} color="#666" />
              <Text style={styles.emptyTitle}>No Users Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? `No users match "${searchQuery}"`
                  : `No ${selectedRole.toLowerCase()}s found`
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
  roleFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  roleFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
  },
  selectedRoleFilter: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  roleFilterText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  selectedRoleFilterText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  fighterBadge: {
    backgroundColor: '#4CAF50',
  },
  promoterBadge: {
    backgroundColor: '#FF9800',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  realName: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  userDetails: {
    gap: 6,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userDetailText: {
    fontSize: 14,
    color: '#ccc',
  },
  disciplinesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  disciplineTag: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  disciplineText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '500',
  },
  moreDisciplines: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  userActions: {
    marginLeft: 12,
  },
  viewProfileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
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