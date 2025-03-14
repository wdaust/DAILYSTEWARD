import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Moon, Sun, Smartphone } from "lucide-react-native";
import { useTheme } from "../lib/theme";

interface AppearanceSettingsProps {}

const AppearanceSettings = ({}: AppearanceSettingsProps) => {
  const { themeMode, isDarkMode, setThemeMode } = useTheme();

  return (
    <View
      className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-2xl shadow-card w-full`}
    >
      <Text
        className={`text-xl font-semibold mb-5 ${isDarkMode ? "text-white" : "text-neutral-800"}`}
      >
        Appearance Settings
      </Text>

      {/* Theme Mode Options */}
      <Text
        className={`text-base font-medium mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        Theme Mode
      </Text>

      {/* Light Mode Option */}
      <TouchableOpacity
        className={`flex-row items-center justify-between py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        onPress={() => setThemeMode("light")}
      >
        <View className="flex-row items-center">
          <Sun
            size={22}
            color={isDarkMode ? "#fff" : "#374151"}
            className="mr-3"
          />
          <Text
            className={`text-base ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Light Mode
          </Text>
        </View>
        <View className="h-5 w-5 rounded-full border-2 border-primary-600 items-center justify-center">
          {themeMode === "light" && (
            <View className="h-3 w-3 rounded-full bg-primary-600" />
          )}
        </View>
      </TouchableOpacity>

      {/* Dark Mode Option */}
      <TouchableOpacity
        className={`flex-row items-center justify-between py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        onPress={() => setThemeMode("dark")}
      >
        <View className="flex-row items-center">
          <Moon
            size={22}
            color={isDarkMode ? "#fff" : "#374151"}
            className="mr-3"
          />
          <Text
            className={`text-base ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Dark Mode
          </Text>
        </View>
        <View className="h-5 w-5 rounded-full border-2 border-primary-600 items-center justify-center">
          {themeMode === "dark" && (
            <View className="h-3 w-3 rounded-full bg-primary-600" />
          )}
        </View>
      </TouchableOpacity>

      {/* System Mode Option */}
      <TouchableOpacity
        className={`flex-row items-center justify-between py-3 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        onPress={() => setThemeMode("system")}
      >
        <View className="flex-row items-center">
          <Smartphone
            size={22}
            color={isDarkMode ? "#fff" : "#374151"}
            className="mr-3"
          />
          <Text
            className={`text-base ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            System Mode
          </Text>
        </View>
        <View className="h-5 w-5 rounded-full border-2 border-primary-600 items-center justify-center">
          {themeMode === "system" && (
            <View className="h-3 w-3 rounded-full bg-primary-600" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AppearanceSettings;
