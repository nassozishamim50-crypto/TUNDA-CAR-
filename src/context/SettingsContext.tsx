import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminSettings } from '../types';
import { settingsService, DEFAULT_ADMIN_SETTINGS } from '../services/settings.service';

interface SettingsContextType {
  settings: AdminSettings;
  updateSettings: (
    newSettings: Partial<AdminSettings>,
    adminUser?: string
  ) => Promise<{ success: boolean; settings?: AdminSettings; errors?: Record<string, string> }>;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_ADMIN_SETTINGS,
  updateSettings: async () => ({ success: false }),
  refreshSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => settingsService.getSettings());

  useEffect(() => {
    const unsubscribe = settingsService.subscribe((updated) => {
      setSettings(updated);
    });
    return unsubscribe;
  }, []);

  const refreshSettings = () => {
    setSettings(settingsService.getSettings());
  };

  const handleUpdate = async (newSettings: Partial<AdminSettings>, adminUser?: string) => {
    const res = await settingsService.updateSettings(newSettings, adminUser);
    if (res.success && res.settings) {
      setSettings(res.settings);
    }
    return res;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings: handleUpdate,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
