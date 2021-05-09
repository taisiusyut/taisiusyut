import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DialogContainer } from './components/Dialog';
import { AuthProvider } from './hooks/useAuth';
import { useCachedResources } from './hooks/useCachedResources';
import { useColorScheme } from './hooks/useColorScheme';
import { ThemeProvider } from './styles/ThemeProvider';
import { Navigation } from './navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
            <DialogContainer />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}
