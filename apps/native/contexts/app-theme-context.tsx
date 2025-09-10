import type { ThemeConfig } from "heroui-native";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MMKV } from "react-native-mmkv";
import { pastelThemes, type ThemeId } from "../themes/pastel-themes";

const storage = new MMKV();
const THEME_STORAGE_KEY = "fitsense_theme_id";

interface AppThemeContextType {
  currentThemeId: ThemeId;
  currentTheme: ThemeConfig | undefined;
  setThemeById: (id: ThemeId) => void;
  syncThemeFromUser: (userThemeId?: string) => void;
  availableThemes: typeof pastelThemes;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined,
);
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize theme from storage or default
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    const storedTheme = storage.getString(THEME_STORAGE_KEY) as ThemeId;
    return storedTheme || "default";
  });

  const setThemeById = useCallback((id: ThemeId) => {
    setCurrentThemeId(id);
    storage.set(THEME_STORAGE_KEY, id);
  }, []);

  const syncThemeFromUser = useCallback(
    (userThemeId?: string) => {
      if (userThemeId && userThemeId !== currentThemeId) {
        const validThemeId = userThemeId as ThemeId;
        setCurrentThemeId(validThemeId);
        storage.set(THEME_STORAGE_KEY, validThemeId);
      }
    },
    [currentThemeId],
  );

  const currentTheme = useMemo(() => {
    const theme = pastelThemes.find((t) => t.id === currentThemeId);
    return theme?.config;
  }, [currentThemeId]);

  const value = useMemo(
    () => ({
      currentThemeId,
      currentTheme,
      setThemeById,
      syncThemeFromUser,
      availableThemes: pastelThemes,
    }),
    [currentThemeId, currentTheme, setThemeById, syncThemeFromUser],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
};
