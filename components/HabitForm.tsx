import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from "react-native";
import {
  Clock,
  Bell,
  Check,
  X,
  Target,
  ChevronDown,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface HabitFormProps {
  onSave: (habit: HabitData) => Promise<void>;
  onCancel: () => void;
  initialData?: HabitData;
}

interface HabitData {
  id?: string;
  title: string;
  frequency: {
    type: "daily" | "weekly" | "monthly";
    days?: string[];
    times?: number;
  };
  reminders: {
    enabled: boolean;
    time?: string | null;
  };
  notes?: string;
  showOnDashboard?: boolean;
}

const HabitForm = ({
  onSave,
  onCancel,
  initialData = {
    title: "",
    frequency: {
      type: "daily",
      days: [],
      times: 1,
    },
    reminders: {
      enabled: false,
      time: "08:00",
    },
    notes: "",
    showOnDashboard: true,
  },
}: HabitFormProps) => {
  const [habitData, setHabitData] = useState<HabitData>({
    ...initialData,
    showOnDashboard: initialData.showOnDashboard !== false, // Default to true if undefined
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerDate, setTimePickerDate] = useState(() => {
    // Initialize with the time from initialData or default to 8:00 AM
    const timeString = initialData.reminders?.time || "08:00";
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours || 8);
    date.setMinutes(minutes || 0);
    return date;
  });

  const weekDays = [
    { id: "sun", label: "Sun" },
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "sat", label: "Sat" },
  ];

  const handleSave = async () => {
    // Validate form data
    if (!habitData.title.trim()) {
      Alert.alert("Error", "Please enter a habit title");
      return;
    }

    try {
      // Ensure time is properly formatted
      const formattedData = {
        ...habitData,
        reminders: {
          ...habitData.reminders,
          // Only include time if reminders are enabled
          time: habitData.reminders.enabled
            ? habitData.reminders.time || "08:00"
            : null,
        },
      };

      console.log("Saving habit data:", formattedData);
      await onSave(formattedData);
      console.log("Habit saved successfully");
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Error", "Failed to save habit. Please try again.");
    }
  };

  const toggleDay = (day: string) => {
    const days = habitData.frequency.days || [];
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];

    setHabitData({
      ...habitData,
      frequency: {
        ...habitData.frequency,
        days: newDays,
      },
    });
  };

  // Format time for display (12-hour format with AM/PM)
  const formatTimeForDisplay = (timeString: string | null | undefined) => {
    if (!timeString) return "08:00 AM";

    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle time picker change
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");

    if (selectedTime) {
      console.log("Time selected:", selectedTime);
      setTimePickerDate(selectedTime);

      // Store time in 24-hour format
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      console.log("Formatted time string:", timeString);

      // Update the habit data with the new time
      setHabitData({
        ...habitData,
        reminders: {
          ...habitData.reminders,
          time: timeString,
          enabled: true, // Automatically enable reminders when time is set
        },
      });
    }
  };

  return (
    <View className="flex-1 bg-white p-4 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-xl font-bold mb-6 text-center text-primary-700">
            {initialData.id ? "Edit Habit" : "Create New Habit"}
          </Text>

          {/* Title Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 text-gray-700">
              Habit Title
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 bg-gray-50"
              placeholder="Enter habit title"
              value={habitData.title}
              onChangeText={(text) =>
                setHabitData({ ...habitData, title: text })
              }
            />
          </View>

          {/* Frequency Settings */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Frequency
            </Text>
            <View className="flex-row mb-3">
              <TouchableOpacity
                onPress={() =>
                  setHabitData({
                    ...habitData,
                    frequency: { ...habitData.frequency, type: "daily" },
                  })
                }
                className={`flex-1 py-2 mr-2 rounded-md ${habitData.frequency.type === "daily" ? "bg-primary-600" : "bg-gray-200"}`}
              >
                <Text
                  className={`text-center ${habitData.frequency.type === "daily" ? "text-white" : "text-gray-800"}`}
                >
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setHabitData({
                    ...habitData,
                    frequency: { ...habitData.frequency, type: "weekly" },
                  })
                }
                className={`flex-1 py-2 mr-2 rounded-md ${habitData.frequency.type === "weekly" ? "bg-primary-600" : "bg-gray-200"}`}
              >
                <Text
                  className={`text-center ${habitData.frequency.type === "weekly" ? "text-white" : "text-gray-800"}`}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setHabitData({
                    ...habitData,
                    frequency: { ...habitData.frequency, type: "monthly" },
                  })
                }
                className={`flex-1 py-2 rounded-md ${habitData.frequency.type === "monthly" ? "bg-primary-600" : "bg-gray-200"}`}
              >
                <Text
                  className={`text-center ${habitData.frequency.type === "monthly" ? "text-white" : "text-gray-800"}`}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>

            {habitData.frequency.type === "weekly" && (
              <View className="mb-3">
                <Text className="text-sm mb-2 text-gray-600">Select days:</Text>
                <View className="flex-row justify-between">
                  {weekDays.map((day) => (
                    <TouchableOpacity
                      key={day.id}
                      onPress={() => toggleDay(day.id)}
                      className={`w-10 h-10 rounded-full items-center justify-center ${(habitData.frequency.days || []).includes(day.id) ? "bg-primary-600" : "bg-gray-200"}`}
                    >
                      <Text
                        className={`${(habitData.frequency.days || []).includes(day.id) ? "text-white" : "text-gray-800"}`}
                      >
                        {day.label[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {habitData.frequency.type === "monthly" && (
              <View className="mb-3">
                <Text className="text-sm mb-2 text-gray-600">
                  Times per month:
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() =>
                      setHabitData({
                        ...habitData,
                        frequency: {
                          ...habitData.frequency,
                          times: Math.max(
                            1,
                            (habitData.frequency.times || 1) - 1,
                          ),
                        },
                      })
                    }
                    className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                  >
                    <Text className="text-xl">-</Text>
                  </TouchableOpacity>
                  <Text className="mx-4 text-lg">
                    {habitData.frequency.times || 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setHabitData({
                        ...habitData,
                        frequency: {
                          ...habitData.frequency,
                          times: (habitData.frequency.times || 1) + 1,
                        },
                      })
                    }
                    className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
                  >
                    <Text className="text-xl text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Dashboard Settings */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Target size={18} color="#4B5563" />
                <Text className="text-sm font-medium ml-2 text-gray-700">
                  Show on Dashboard
                </Text>
              </View>
              <Switch
                value={habitData.showOnDashboard}
                onValueChange={(value) =>
                  setHabitData({
                    ...habitData,
                    showOnDashboard: value,
                  })
                }
                trackColor={{ false: "#D1D5DB", true: "#7E57C2" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            <Text className="text-xs text-gray-500 mb-3 ml-1">
              Display this habit in the Quick Habits section on the dashboard
            </Text>
          </View>

          {/* Reminders */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Bell size={18} color="#4B5563" />
                <Text className="text-sm font-medium ml-2 text-gray-700">
                  Reminders
                </Text>
              </View>
              <Switch
                value={habitData.reminders.enabled}
                onValueChange={(value) =>
                  setHabitData({
                    ...habitData,
                    reminders: {
                      ...habitData.reminders,
                      enabled: value,
                    },
                  })
                }
                trackColor={{ false: "#D1D5DB", true: "#7E57C2" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            {habitData.reminders.enabled && (
              <View className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <Text className="text-sm mb-2 text-gray-600">
                  Reminder time:
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="flex-row items-center justify-between border border-gray-300 rounded-md p-3 bg-white active:bg-gray-100"
                  accessible={true}
                  accessibilityLabel="Select reminder time"
                  accessibilityRole="button"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <Clock size={18} color="#4B5563" />
                    <Text className="ml-2 text-gray-700">
                      {formatTimeForDisplay(habitData.reminders.time)}
                    </Text>
                  </View>
                  <ChevronDown size={16} color="#4B5563" />
                </TouchableOpacity>

                {/* Time Picker for iOS */}
                {Platform.OS === "ios" && showTimePicker && (
                  <View className="mt-3 bg-white border border-gray-200 rounded-md p-2">
                    <DateTimePicker
                      testID="timePicker"
                      value={timePickerDate}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={handleTimeChange}
                      style={{ height: 120, width: "100%" }}
                    />
                    <View className="flex-row justify-end mt-2">
                      <TouchableOpacity
                        onPress={() => setShowTimePicker(false)}
                        className="bg-primary-600 px-4 py-2 rounded-md"
                      >
                        <Text className="text-white font-medium">Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Time Picker for Android */}
            {Platform.OS === "android" && showTimePicker && (
              <DateTimePicker
                testID="timePickerAndroid"
                value={timePickerDate}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Notes */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-1 text-gray-700">
              Notes (Optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 bg-gray-50"
              placeholder="Add any additional notes"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={habitData.notes}
              onChangeText={(text) =>
                setHabitData({ ...habitData, notes: text })
              }
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 mr-2 py-3 bg-gray-200 rounded-md items-center justify-center flex-row"
            >
              <X size={18} color="#4B5563" />
              <Text className="ml-2 font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 ml-2 py-3 bg-primary-600 rounded-md items-center justify-center flex-row"
            >
              <Check size={18} color="#FFFFFF" />
              <Text className="ml-2 font-medium text-white">Save Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HabitForm;
