import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import ConvexClerkProvider from '@/providers/ConvexClerkProvider';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ConvexClerkProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="all-events" />
        <Stack.Screen name="all-users" />
        <Stack.Screen name="user-profile" />
        <Stack.Screen name="event-details" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="create-event" />
        <Stack.Screen name="promoter-events" />
        <Stack.Screen name="fight-records" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ConvexClerkProvider>
  );
}