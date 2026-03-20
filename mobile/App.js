import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/db/database';

export default function App() {
  React.useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </SettingsProvider>
    </AuthProvider>
  );
    }
