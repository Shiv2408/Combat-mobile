import { useState, useEffect,useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Shield, Trophy, Building2, Search, Users as UsersIcon } from 'lucide-react-native';
import { api } from '@/convex/_generated/api';
import { LinearGradient } from 'expo-linear-gradient';
import FighterCard from '../components/FighterCard';
import PromoterCard from '../components/PromoterCard';
import GymCard from '../components/GymCard';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'fighters' | 'promoters' | 'gyms'>('fighters');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const allFighters = useQuery(api.users.getAllFighters);
  const allPromoters = useQuery(api.users.getAllPromoters);
  const allGyms = useQuery(api.users.getAllGyms);

  const handleTabChange = (newTab: 'fighters' | 'promoters' | 'gyms') => {
    if (newTab === activeTab) return;
    
    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change tab
      setActiveTab(newTab);
      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

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
    { key: 'fighters', label: 'Fighters', icon: Shield, count: allFighters?.length || 0, gradient: ['#4CAF50', '#45a049'] as const },
    { key: 'promoters', label: 'Promoters', icon: Trophy, count: allPromoters?.length || 0, gradient: ['#FF9800', '#f57c00'] as const },
    { key: 'gyms', label: 'Gyms', icon: Building2, count: allGyms?.length || 0, gradient: ['#2196F3', '#1976d2'] as const },
  ];

  const renderCard = (item: any, index: number) => {
    const cardProps = {
      key: `${activeTab}-${item._id}-${index}`,
      onPress: handleUserPress,
    };

    switch (activeTab) {
      case 'fighters':
        return <FighterCard {...cardProps} fighter={item} />;
      case 'promoters':
        return <PromoterCard {...cardProps} promoter={item} />;
      case 'gyms':
        return <GymCard {...cardProps} gym={item} />;
      default:
        return null;
    }
  };

  // Check if data is still loading
  const isLoading = allFighters === undefined || allPromoters === undefined || allGyms === undefined;

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#FFD700', '#FFA000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <UsersIcon size={32} color="#1a1a1a" strokeWidth={2.5} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subtitle}>Connect with the fighting world</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.totalMembers}>
              {(allFighters?.length || 0) + (allPromoters?.length || 0) + (allGyms?.length || 0)}
            </Text>
            <Text style={styles.totalMembersLabel}>Members</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <LinearGradient
            colors={['#2a2a2a', '#333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchGradient}
          >
            <Search size={20} color="#FFD700" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, fight name, or gym..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </LinearGradient>
        </View>

        {/* Enhanced Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => handleTabChange(tab.key as any)}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <LinearGradient
                    colors={tab.gradient}
                    style={styles.activeTabGradient}
                  >
                    <IconComponent size={20} color="#1a1a1a" strokeWidth={2.5} />
                    <Text style={styles.activeTabText}>{tab.label}</Text>
                    <View style={styles.activeTabBadge}>
                      <Text style={styles.activeTabBadgeText}>{tab.count}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <>
                    <IconComponent size={20} color="#666" strokeWidth={2.5} />
                    <Text style={styles.tabText}>{tab.label}</Text>
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{tab.count}</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {isLoading ? 'Loading...' : `${filteredData.length} ${activeTab} found`}
          </Text>
          <View style={styles.resultsLine} />
        </View>

        {/* Enhanced Content List */}
        <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View style={styles.loadingState}>
                <Text style={styles.loadingText}>Loading {activeTab}...</Text>
              </View>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => renderCard(item, index))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={['#333', '#2a2a2a']}
                    style={styles.emptyIconGradient}
                  >
                    <UsersIcon size={64} color="#666" strokeWidth={1.5} />
                  </LinearGradient>
                </View>
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
        </Animated.View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 26, 26, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  headerStats: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalMembers: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalMembersLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  searchContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  activeTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
    flex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tabBadge: {
    backgroundColor: '#404040',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(26, 26, 26, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999',
  },
  activeTabBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  resultsCount: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  resultsLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100,
  },
});