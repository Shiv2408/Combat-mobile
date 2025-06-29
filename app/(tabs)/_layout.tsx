import { Tabs } from 'expo-router';
import { Chrome as Home, User, Settings, Calendar, Users } from 'lucide-react-native';
import AuthGuard from '@/components/AuthGuard';

export default function TabLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#2a2a2a',
            borderTopWidth: 1,
            borderTopColor: '#444',
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ size, color }) => (
              <Calendar size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarIcon: ({ size, color }) => (
              <Users size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ size, color }) => (
              <Settings size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}