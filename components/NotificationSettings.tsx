import React, { useState } from "react";
import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native";
import {
  Bell,
  BellOff,
  Clock,
  Calendar,
  BookOpen,
  MessageSquare,
} from "lucide-react-native";

interface NotificationSettingsProps {
  // Props with default values
  enabled?: boolean;
  reminderTypes?: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    icon: React.ReactNode;
  }>;
}

const NotificationSettings = ({
  enabled = true,
  reminderTypes = [
    {
      id: "bible-reading",
      name: "Bible Reading",
      description: "Daily reminders for your Bible reading schedule",
      enabled: true,
      icon: <BookOpen size={22} color="#4A5568" />,
    },
    {
      id: "prayer-time",
      name: "Prayer Time",
      description: "Reminders for your scheduled prayer times",
      enabled: true,
      icon: <Clock size={22} color="#4A5568" />,
    },
    {
      id: "meeting-prep",
      name: "Meeting Preparation",
      description: "Reminders to prepare for congregation meetings",
      enabled: false,
      icon: <Calendar size={22} color="#4A5568" />,
    },
    {
      id: "journal",
      name: "Journal Reminders",
      description: "Reminders to write in your spiritual journal",
      enabled: false,
      icon: <MessageSquare size={22} color="#4A5568" />,
    },
  ],
}: NotificationSettingsProps) => {
  const [masterEnabled, setMasterEnabled] = useState(enabled);
  const [notifications, setNotifications] = useState(reminderTypes);

  const toggleMasterSwitch = () => {
    setMasterEnabled(!masterEnabled);
    // When master switch is toggled off, all individual notifications are disabled
    if (masterEnabled) {
      setNotifications(
        notifications.map((item) => ({ ...item, enabled: false })),
      );
    } else {
      // When turned back on, restore previous state (for simplicity in this example)
      setNotifications(reminderTypes);
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications(
      notifications.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  return (
    <View className="bg-white p-6 rounded-2xl shadow-card w-full h-full">
      <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <View className="flex-row items-center">
          {masterEnabled ? (
            <Bell size={24} color="#4A5568" />
          ) : (
            <BellOff size={24} color="#9CA3AF" />
          )}
          <Text className="text-lg font-semibold ml-3 text-neutral-800">
            Notification Settings
          </Text>
        </View>
        <Switch
          value={masterEnabled}
          onValueChange={toggleMasterSwitch}
          trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
          thumbColor={masterEnabled ? "#3B82F6" : "#9CA3AF"}
        />
      </View>

      {masterEnabled ? (
        <ScrollView className="flex-1">
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggleNotification(item.id)}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center flex-1 mr-4">
                <View className="mr-3">{item.icon}</View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">{item.name}</Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleNotification(item.id)}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={item.enabled ? "#3B82F6" : "#9CA3AF"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center py-10">
          <BellOff size={48} color="#9CA3AF" />
          <Text className="text-center text-gray-500 mt-4 px-6">
            Notifications are currently disabled. Toggle the switch above to
            enable notification settings.
          </Text>
        </View>
      )}
    </View>
  );
};

export default NotificationSettings;
