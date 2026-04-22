import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Header } from "./Header";
import { useTheme } from "../context/ThemeContext";

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  showSound?: boolean;
  showHeader?: boolean;
  headerTransparent?: boolean;
  hideHeaderBottomBorder?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  title,
  showHeader = true,
  hideHeaderBottomBorder = true,
}) => {
  const { theme } = useTheme();
  const [isSoundOn, setIsSoundOn] = useState(true);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.content}>{children}</View>
      {showHeader && (
        <View style={styles.headerOverlay}>
          <Header
            title={title ? title : ""}
            onExit={() => router.back()}
            onSoundToggle={() => setIsSoundOn(!isSoundOn)}
            isSoundOn={isSoundOn}
            hideBottomBorder={hideHeaderBottomBorder}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
