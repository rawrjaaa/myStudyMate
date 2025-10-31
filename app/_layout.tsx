import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from './context/AppContext';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <AppProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="screens/todo" options={{ headerShown: false }} />
            <Stack.Screen name="screens/timer" options={{ headerShown: false }} />
            <Stack.Screen name="screens/notes" options={{ headerShown: false }} />
            <Stack.Screen name="screens/NoteDetailScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/CalendarScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/DreamScreen" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppProvider>
    </PaperProvider>
  );
}
