import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // 'light', 'dark', 'system'
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('cash');
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const storedTheme = await AsyncStorage.getItem('theme');
    const storedPaymentMethod = await AsyncStorage.getItem('defaultPaymentMethod');
    const storedAutoPrint = await AsyncStorage.getItem('autoPrintReceipt');
    if (storedTheme) setTheme(storedTheme);
    if (storedPaymentMethod) setDefaultPaymentMethod(storedPaymentMethod);
    if (storedAutoPrint) setAutoPrintReceipt(storedAutoPrint === 'true');
  };

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const updateDefaultPaymentMethod = async (method) => {
    setDefaultPaymentMethod(method);
    await AsyncStorage.setItem('defaultPaymentMethod', method);
  };

  const updateAutoPrintReceipt = async (enabled) => {
    setAutoPrintReceipt(enabled);
    await AsyncStorage.setItem('autoPrintReceipt', enabled.toString());
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      defaultPaymentMethod,
      autoPrintReceipt,
      updateTheme,
      updateDefaultPaymentMethod,
      updateAutoPrintReceipt,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
