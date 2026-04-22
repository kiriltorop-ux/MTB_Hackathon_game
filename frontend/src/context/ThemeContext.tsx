import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Colors, createTextStyles, Fonts } from "../constants/theme";

interface ThemeContextType {
  theme: typeof Colors.light | typeof Colors.dark;
  textStyles: ReturnType<typeof createTextStyles>;
  fontLight: { fontFamily: string };
  fontRegular: { fontFamily: string };
  fontBold: { fontFamily: string };
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: Colors.dark,
  textStyles: createTextStyles(true),
  fontLight: { fontFamily: "PPNeueMachina-Light" },
  fontRegular: { fontFamily: "PPNeueMachina-Regular" },
  fontBold: { fontFamily: "PPNeueMachina-Bold" },
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isDark, setIsDark] = useState(true); // По умолчанию тёмная тема

  // Можно загружать сохранённую тему из AsyncStorage
  useEffect(() => {
    // TODO: загрузить сохранённую тему
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = isDark ? Colors.dark : Colors.light;
  const textStyles = createTextStyles(isDark);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        textStyles,
        fontLight: Fonts.light,
        fontRegular: Fonts.regular,
        fontBold: Fonts.bold,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
