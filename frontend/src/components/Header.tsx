import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
  Image,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  onExit: () => void;
  onSoundToggle: () => void;
  isSoundOn: boolean;
  hideBottomBorder?: boolean;
  leftIconSource?: ImageSourcePropType;
  rightIconSource?: ImageSourcePropType;
  extraRightIconSource?: ImageSourcePropType;
  onExtraRightPress?: () => void;
  titleComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  respectSafeAreaTop?: boolean;
  helpIcon?: boolean;
  stretchContainer?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onExit,
  onSoundToggle,
  isSoundOn,
  hideBottomBorder = true,
  leftIconSource,
  rightIconSource,
  extraRightIconSource,
  onExtraRightPress,
  titleComponent,
  containerStyle,
  titleStyle,
  respectSafeAreaTop = true,
  helpIcon = false,
  stretchContainer = false,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
      return;
    }
    onExit();
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: "transparent",
          borderBottomColor: theme.border,
          borderBottomWidth: hideBottomBorder ? 0 : StyleSheet.hairlineWidth,
          paddingTop: respectSafeAreaTop ? insets.top + 8 : 8,
        },
        stretchContainer && styles.stretchContainer,
        containerStyle,
      ]}
    >
      <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
        {leftIconSource ? (
          <Image
            source={leftIconSource}
            style={styles.customIcon}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="close" size={24} color={theme.text} opacity={0.5} />
        )}
      </TouchableOpacity>

      {titleComponent ? (
        <View style={styles.titleSlot}>{titleComponent}</View>
      ) : (
        <Text
          style={[styles.title, { color: theme.text }, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}

      {helpIcon && (
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.helpIcon}
        >
          <Ionicons
            name="help-circle"
            size={24}
            color={theme.text}
            opacity={0.5}
          />
        </TouchableOpacity>
      )}

      <View style={styles.rightActions}>
        {extraRightIconSource && (
          <TouchableOpacity
            onPress={onExtraRightPress}
            style={styles.iconButton}
            disabled={!onExtraRightPress}
          >
            <Image
              source={extraRightIconSource}
              style={styles.customIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onSoundToggle} style={styles.iconButton}>
          {rightIconSource ? (
            <Image
              source={rightIconSource}
              style={styles.customIcon}
              resizeMode="contain"
            />
          ) : (
            <Ionicons
              name={isSoundOn ? "volume-high" : "volume-mute"}
              size={24}
              color={theme.text}
              opacity={0.5}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  iconButton: {
    padding: 8,
    width: 44,
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  titleSlot: {
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  customIcon: {
    width: 24,
    height: 24,
  },
  helpIcon: {
    width: 24,
    height: 24,
  },
  stretchContainer: {
    alignSelf: "stretch",
    width: "100%",
    position: "relative",
  },
});
