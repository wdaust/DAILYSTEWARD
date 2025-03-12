import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { Moon, Sun, Palette } from "lucide-react-native";

interface AppearanceSettingsProps {
  darkMode?: boolean;
  onDarkModeChange?: (enabled: boolean) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

const AppearanceSettings = ({
  darkMode = false,
  onDarkModeChange = () => {},
  currentTheme = "Default",
  onThemeChange = () => {},
}: AppearanceSettingsProps) => {
  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const themes = [
    { name: "Default", color: "#3b82f6" },
    { name: "Calm", color: "#10b981" },
    { name: "Serene", color: "#8b5cf6" },
    { name: "Warm", color: "#f59e0b" },
  ];

  const handleDarkModeToggle = (value: boolean) => {
    setIsDarkMode(value);
    onDarkModeChange(value);
  };

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  return (
    <View className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-card w-full">
      <Text className="text-xl font-semibold mb-5 text-neutral-800 dark:text-white">
        Appearance Settings
      </Text>

      {/* Dark/Light Mode Toggle */}
      <View className="flex-row items-center justify-between mb-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center">
          {isDarkMode ? (
            <Moon
              size={22}
              color={isDarkMode ? "#fff" : "#374151"}
              className="mr-3"
            />
          ) : (
            <Sun
              size={22}
              color={isDarkMode ? "#fff" : "#374151"}
              className="mr-3"
            />
          )}
          <Text className="text-base text-gray-800 dark:text-white">
            Dark Mode
          </Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
          trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Color Theme Selection */}
      <View className="mb-4">
        <View className="flex-row items-center mb-3">
          <Palette
            size={22}
            color={isDarkMode ? "#fff" : "#374151"}
            className="mr-2"
          />
          <Text className="text-base text-gray-800 dark:text-white">
            Color Theme
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          <View className="flex-row space-x-3 py-2">
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.name}
                onPress={() => handleThemeSelection(theme.name)}
                className={`p-3 rounded-lg ${selectedTheme === theme.name ? "border-2 border-blue-500" : "border border-gray-300 dark:border-gray-600"}`}
              >
                <View className="items-center">
                  <View
                    style={{ backgroundColor: theme.color }}
                    className="w-12 h-12 rounded-full mb-2"
                  />
                  <Text className="text-sm text-gray-800 dark:text-white">
                    {theme.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Current Theme Display */}
      <View className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          Current theme:{" "}
          <Text className="font-bold text-gray-800 dark:text-white">
            {selectedTheme}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default AppearanceSettings;
