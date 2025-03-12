import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Settings, Menu } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title?: string;
  showSettingsButton?: boolean;
  showMenuButton?: boolean;
  onSettingsPress?: () => void;
  onMenuPress?: () => void;
}

const Header = ({
  title = "JW Companion",
  showSettingsButton = true,
  showMenuButton = false,
  onSettingsPress,
  onMenuPress,
}: HeaderProps) => {
  const router = useRouter();

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push("/settings");
    }
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    }
  };

  // Empty component - banner removed
  return null;
};

export default Header;
