import React, { createContext, useContext, ReactNode } from "react";
import { Colors, createTextStyles, Fonts } from "../constants/theme";

interface ThemeContextType {
  theme: typeof Colors;
  textStyles: ReturnType<typeof createTextStyles>;
  fontLight: { fontFamily: string };
  fontRegular: { fontFamily: string };
  fontBold: { fontFamily: string };
  fontSemiBold: { fontFamily: string };
  fontExtraBold: { fontFamily: string };
}

const ThemeContext = createContext<ThemeContextType>({
  theme: Colors,
  textStyles: createTextStyles(),
  fontLight: { fontFamily: "PPNeueMachina-Light" },
  fontRegular: { fontFamily: "PPNeueMachina-Regular" },
  fontBold: { fontFamily: "PPNeueMachina-Bold" },
  fontSemiBold: { fontFamily: "PPNeueMachina-Regular" },
  fontExtraBold: { fontFamily: "PPNeueMachina-Bold" },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = Colors;
  const textStyles = createTextStyles();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        textStyles,
        fontLight: Fonts.light,
        fontRegular: Fonts.regular,
        fontBold: Fonts.bold,
        fontSemiBold: Fonts.semiBold,
        fontExtraBold: Fonts.extraBold,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
