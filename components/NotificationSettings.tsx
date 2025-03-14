import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import {
  Bell,
  BellOff,
  Clock,
  Calendar,
  BookOpen,
  MessageSquare,
  ChevronRight,
  X,
  Target,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHabits } from "../lib/hooks/useHabits";
import {
  scheduleHabitReminder,
  cancelHabitReminder,
  configureNotifications,
} from "../lib/notifications";

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

  // Initialize notification permissions
  useEffect(() => {
    const initNotifications = async () => {
      await configureNotifications();
    };

    initNotifications();
  }, []);
  const [showHabitReminders, setShowHabitReminders] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerDate, setTimePickerDate] = useState(new Date());

  // Fetch habits data
  const {
    data: habits,
    isLoading: habitsLoading,
    updateData: updateHabit,
  } = useHabits();
  const [habitReminders, setHabitReminders] = useState<any[]>([]);

  // Initialize habit reminders when habits data is loaded
  useEffect(() => {
    if (habits && habits.length > 0) {
      const reminders = habits
        .filter((habit) => habit.reminderTime || habit.reminders?.enabled)
        .map((habit) => ({
          id: habit.id,
          name: habit.name,
          enabled: habit.reminders?.enabled || !!habit.reminderTime,
          time: habit.reminderTime || habit.reminders?.time || "08:00",
          frequency: habit.frequency || "daily",
        }));
      setHabitReminders(reminders);
    }
  }, [habits]);

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

  // Format time for display (12-hour format with AM/PM)
  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "08:00 AM";

    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle time picker change for habit reminders
  const handleTimeChange = async (event, selectedTime) => {
    try {
      if (Platform.OS === "android") {
        setShowTimePicker(false);
      }

      if (!selectedTime || !selectedHabit) return;

      // Set time picker date first and wait
      setTimePickerDate(selectedTime);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store time in 24-hour format
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      // Update habit reminder time in local state
      const updatedReminders = habitReminders.map((habit) =>
        habit.id === selectedHabit.id ? { ...habit, time: timeString } : habit,
      );
      setHabitReminders(updatedReminders);

      // Add a longer delay before database operations
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update habit in database first, then handle notifications separately
      await updateHabit(selectedHabit.id, {
        reminderTime: timeString,
        reminders: {
          enabled: true,
          time: timeString,
        },
      });

      // Add a longer delay before notification operations
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Find the full habit data
      const fullHabit = habits.find((h) => h.id === selectedHabit.id);
      if (fullHabit) {
        // Handle notifications in a separate try/catch
        try {
          // Cancel existing notification with a longer delay
          await cancelHabitReminder(fullHabit.id);

          // Add a significant delay before scheduling
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Schedule the new notification
          await scheduleHabitReminder({
            id: fullHabit.id,
            name: fullHabit.name,
            frequency: fullHabit.frequency,
            reminders: {
              enabled: true,
              time: timeString,
            },
          });
        } catch (notificationError) {
          console.error("Error handling notifications:", notificationError);
          // Continue execution even if notification handling fails
        }
      }
    } catch (outerError) {
      console.error("Outer error in handleTimeChange:", outerError);
    }
  };

  // Toggle habit reminder enabled state
  const toggleHabitReminder = async (id: string) => {
    try {
      const habit = habitReminders.find((h) => h.id === id);
      if (!habit) return;

      const updatedEnabled = !habit.enabled;

      // Update local state first
      const updatedReminders = habitReminders.map((h) =>
        h.id === id ? { ...h, enabled: updatedEnabled } : h,
      );
      setHabitReminders(updatedReminders);

      // Add a longer delay before database operations
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update habit in database first, completely separate from notification operations
      await updateHabit(id, {
        reminders: {
          enabled: updatedEnabled,
          time: habit.time,
        },
      });

      // Add a significant delay before notification operations
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle notifications in a completely separate operation
      if (updatedEnabled) {
        // Get the full habit data
        const fullHabit = habits.find((h) => h.id === id);
        if (fullHabit) {
          try {
            // Cancel any existing notifications first
            await cancelHabitReminder(id);

            // Add a significant delay between canceling and scheduling
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Schedule the new notification
            await scheduleHabitReminder({
              id: fullHabit.id,
              name: fullHabit.name,
              frequency: fullHabit.frequency,
              reminders: {
                enabled: true,
                time: habit.time,
              },
            });
          } catch (notificationError) {
            console.error("Error handling notifications:", notificationError);
            // Continue execution even if notification handling fails
          }
        }
      } else {
        // Just cancel the notification if disabling
        try {
          await cancelHabitReminder(id);
        } catch (cancelError) {
          console.error("Error canceling notification:", cancelError);
        }
      }
    } catch (outerError) {
      console.error("Error toggling habit reminder:", outerError);
    }
  };

  // Open time picker for a specific habit
  const openTimePicker = async (habit) => {
    try {
      // Add a delay before setting state to prevent stream issues
      await new Promise((resolve) => setTimeout(resolve, 300));

      setSelectedHabit(habit);

      // Set initial time
      const [hours, minutes] = (habit.time || "08:00").split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      setTimePickerDate(date);

      // Add another delay before showing the picker
      await new Promise((resolve) => setTimeout(resolve, 300));

      setShowTimePicker(true);
    } catch (error) {
      console.error("Error opening time picker:", error);
    }
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
          trackColor={{ false: "#D1D5DB", true: "#7E57C2" }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D1D5DB"
        />
      </View>

      {masterEnabled ? (
        <ScrollView className="flex-1">
          {/* System Notification Types */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3 px-1">
              System Notifications
            </Text>
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
                    <Text className="font-medium text-gray-800">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={item.enabled}
                  onValueChange={() => toggleNotification(item.id)}
                  trackColor={{ false: "#D1D5DB", true: "#7E57C2" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Habit Reminders Section */}
          <View className="mb-6">
            <TouchableOpacity
              className="flex-row justify-between items-center mb-3 px-1"
              onPress={() => setShowHabitReminders(!showHabitReminders)}
            >
              <Text className="text-base font-semibold text-gray-800">
                Habit Reminders
              </Text>
              <ChevronRight
                size={20}
                color="#7E57C2"
                style={{
                  transform: [
                    { rotate: showHabitReminders ? "90deg" : "0deg" },
                  ],
                }}
              />
            </TouchableOpacity>

            {showHabitReminders && (
              <View>
                {habitReminders.length === 0 ? (
                  <View className="py-4 items-center bg-gray-50 rounded-lg">
                    <Target size={24} color="#9CA3AF" />
                    <Text className="text-gray-500 text-center mt-2">
                      No habits with reminders found. Create habits with
                      reminders to see them here.
                    </Text>
                  </View>
                ) : (
                  habitReminders.map((habit) => (
                    <View
                      key={habit.id}
                      className="flex-row items-center justify-between py-3 px-1 border-b border-gray-100"
                    >
                      <View className="flex-1 mr-3">
                        <Text className="font-medium text-gray-800">
                          {habit.name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Clock size={14} color="#7E57C2" />
                          <TouchableOpacity
                            onPress={() => openTimePicker(habit)}
                          >
                            <Text className="ml-1 text-primary-600">
                              {formatTimeForDisplay(habit.time)}
                            </Text>
                          </TouchableOpacity>
                          <Text className="text-xs text-gray-500 ml-2 capitalize">
                            ({habit.frequency})
                          </Text>
                        </View>
                      </View>
                      <Switch
                        value={habit.enabled}
                        onValueChange={() => toggleHabitReminder(habit.id)}
                        trackColor={{ false: "#D1D5DB", true: "#7E57C2" }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#D1D5DB"
                      />
                    </View>
                  ))
                )}
              </View>
            )}
          </View>

          {/* Time Picker Modal for iOS */}
          {Platform.OS === "ios" && showTimePicker && selectedHabit && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showTimePicker}
              onRequestClose={() => setShowTimePicker(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-xl p-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-primary-800">
                      Set Reminder Time
                    </Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-base mb-2">{selectedHabit.name}</Text>

                  <DateTimePicker
                    testID="timePicker"
                    value={timePickerDate}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={handleTimeChange}
                    style={{ height: 120, width: "100%" }}
                  />

                  <TouchableOpacity
                    className="bg-primary-600 py-3 rounded-lg items-center mt-4"
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text className="text-white font-medium">Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Time Picker for Android */}
          {Platform.OS === "android" && showTimePicker && selectedHabit && (
            <DateTimePicker
              testID="timePicker"
              value={timePickerDate}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}
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
