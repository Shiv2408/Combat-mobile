import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Shield, Trophy, Building2, Search, MapPin, Target, Users as UsersIcon, Eye } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'fighters' | 'promoters' | 'gyms'>('fighters');
  const [searchQuery, setSearchQuery] = useState('');

  const allFighters = useQuery(api.users.getAllFighters);
  const allPromoters = useQuery(api.users.getAllPromoters);
  const allGyms = useQuery(api.users.getAllGyms);

  const getFilteredData = () => {
    let data: any[] = [];
    
    switch (activeTab) {
      case 'fighters':
        data = allFighters || [];
        break;
      case 'promoters':
        data = allPromoters || [];
        break;
      case 'gyms':
        data = allGyms || [];
        break;
    }

    if (!searchQuery) return data;

    return data.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const name = activeTab === 'gyms' 
        ? item.gymName?.toLowerCase() || ''
        : `${item.firstName} ${item.lastName}`.toLowerCase();
      const fightName = item.fightName?.toLowerCase() || '';
      const gym = item.gym?.toLowerCase() || '';
      
      return name.includes(searchLower) || 
             fightName.includes(searchLower) || 
             gym.includes(searchLower);
    });
  };

  const handleUserPress = (user: any) => {
    router.push(`/user-profile?id=${user._id}`);
  };

  const filteredData = getFilteredData();

  const tabs = [
    { key: 'fighters', label: 'Fighters', icon: Shield, count: allFighters?.length || 0 },
    { key: 'promoters', label: 'Promoters', icon: Trophy, count: allPromoters?.length || 0 },
    { key: 'gyms', label: 'Gyms', icon: Building2, count: allGyms?.length || 0 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <UsersIcon size={32} color="#1a1a1a" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subtitle}>Connect with the fighting world</Text>
          </View>
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

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.key as any)}
                activeOpacity={0.8}
              >
                <IconComponent 
                  size={20} 
                  color={isActive ? '#1a1a1a' : '#FFD700'} 
                  strokeWidth={2.5}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
                <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredData.length} {activeTab} found
          </Text>
        </View>

        {/* Content List */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.memberCard}
                onPress={() => handleUserPress(item)}
                activeOpacity={0.9}
              >
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {activeTab === 'gyms' 
                      ? item.gymName?.[0] || 'G'
                      : `${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`
                    }
                  </Text>
                </View>

                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>
                      {activeTab === 'gyms' 
                        ? item.gymName 
                        : (item.fightName || `${item.firstName} ${item.lastName}`)
                      }
                    </Text>
                    <View style={[
                      styles.roleBadge,
                      activeTab === 'fighters' ? styles.fighterBadge :
                      activeTab === 'promoters' ? styles.promoterBadge : styles.gymBadge
                    ]}>
                      {activeTab === 'fighters' ? (
                        <Shield size={12} color="#1a1a1a" strokeWidth={2.5} />
                      ) : activeTab === 'promoters' ? (
                        <Trophy size={12} color="#1a1a1a" strokeWidth={2.5} />
                      ) : (
                        <Building2 size={12} color="#1a1a1a" strokeWidth={2.5} />
                      )}
                      <Text style={styles.roleBadgeText}>
                        {activeTab === 'fighters' ? 'Fighter' : 
                         activeTab === 'promoters' ? 'Promoter' : 'Gym'}
                      </Text>
                    </View>
                  </View>

                  {activeTab === 'fighters' && item.fightName && (
                    <Text style={styles.realName}>
                      {item.firstName} {item.lastName}
                    </Text>
                  )}

                  <View style={styles.memberDetails}>
                    {item.gym && activeTab !== 'gyms' && (
                      <View style={styles.memberDetail}>
                        <MapPin size={14} color="#ccc" />
                        <Text style={styles.memberDetailText}>{item.gym}</Text>
                      </View>
                    )}

                    {activeTab === 'fighters' && item.disciplines && item.disciplines.length > 0 && (
                      <View style={styles.disciplinesContainer}>
                        {item.disciplines.slice(0, 2).map((discipline: string, index: number) => (
                          <View key={index} style={styles.disciplineTag}>
                            <Text style={styles.disciplineText}>{discipline}</Text>
                          </View>
                        ))}
                        {item.disciplines.length > 2 && (
                          <Text style={styles.moreDisciplines}>
                            +{item.disciplines.length - 2} more
                          </Text>
                        )}
                      </View>
                    )}

                    {activeTab === 'gyms' && item.staff && (
                      <View style={styles.memberDetail}>
                        <UsersIcon size={14} color="#ccc" />
                        <Text style={styles.memberDetailText}>
                          {item.staff.length} staff member{item.staff.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.memberActions}>
                  <TouchableOpacity 
                    style={styles.viewProfileButton}
                    onPress={() => handleUserPress(item)}
                    activeOpacity={0.8}
                  >
                    <Eye size={16} color="#FFD700" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <UsersIcon size={64} color="#666" />
              <Text style={styles.emptyTitle}>No {activeTab} Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? `No ${activeTab} match "${searchQuery}"`
                  : `No ${activeTab} have joined yet`
                }
              </Text>
            </View>
          )}
          <View style={styles.bottomSpacing} />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  tabContainer: {
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
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  activeTabText: {
    color: '#1a1a1a',
  },
  tabBadge: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(26, 26, 26, 0.2)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  activeTabBadgeText: {
    color: '#1a1a1a',
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memberName: {
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
  gymBadge: {
    backgroundColor: '#2196F3',
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
  memberDetails: {
    gap: 6,
  },
  memberDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberDetailText: {
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
  memberActions: {
    marginLeft: 12,
  },
  viewProfileButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  bottomSpacing: {
    height: 100, // Extra space for tab bar
  },
});