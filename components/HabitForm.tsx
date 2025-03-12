import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import {
  Calendar,
  Clock,
  Bell,
  Check,
  Plus,
  X,
  Target,
} from "lucide-react-native";

interface HabitFormProps {
  onSave?: (habit: HabitData) => void;
  onCancel?: () => void;
  initialData?: HabitData;
  isVisible?: boolean;
}

interface HabitData {
  id?: string;
  title: string;
  type: string;
  frequency: {
    type: "daily" | "weekly" | "custom";
    days?: string[];
    times?: number;
  };
  reminders: {
    enabled: boolean;
    time?: string;
  };
  notes?: string;
  showOnDashboard?: boolean;
}

const HabitForm = ({
  onSave = () => {},
  onCancel = () => {},
  initialData = {
    title: "",
    type: "prayer",
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
  isVisible = true,
}: HabitFormProps) => {
  const [habitData, setHabitData] = useState<HabitData>(initialData);

  if (!isVisible) return null;

  const habitTypes = [
    { id: "prayer", label: "Prayer" },
    { id: "bible_study", label: "Bible Study" },
    { id: "meeting_prep", label: "Meeting Preparation" },
    { id: "ministry", label: "Ministry" },
    { id: "meditation", label: "Meditation" },
    { id: "other", label: "Other" },
  ];

  const weekDays = [
    { id: "sun", label: "Sun" },
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "sat", label: "Sat" },
  ];

  const handleSave = () => {
    // Validate form data here
    if (!habitData.title.trim()) {
      // Show error message
      return;
    }
    onSave(habitData);
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

  return (
    <View className="flex-1 bg-white p-4 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-xl font-bold mb-6 text-center text-blue-800">
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

          {/* Habit Type Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Habit Type
            </Text>
            <View className="flex-row flex-wrap">
              {habitTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setHabitData({ ...habitData, type: type.id })}
                  className={`mr-2 mb-2 px-3 py-2 rounded-full ${habitData.type === type.id ? "bg-blue-600" : "bg-gray-200"}`}
                >
                  <Text
                    className={`${habitData.type === type.id ? "text-white" : "text-gray-800"}`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
                className={`flex-1 py-2 mr-2 rounded-md ${habitData.frequency.type === "daily" ? "bg-blue-600" : "bg-gray-200"}`}
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
                className={`flex-1 py-2 mr-2 rounded-md ${habitData.frequency.type === "weekly" ? "bg-blue-600" : "bg-gray-200"}`}
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
                    frequency: { ...habitData.frequency, type: "custom" },
                  })
                }
                className={`flex-1 py-2 rounded-md ${habitData.frequency.type === "custom" ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <Text
                  className={`text-center ${habitData.frequency.type === "custom" ? "text-white" : "text-gray-800"}`}
                >
                  Custom
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
                      className={`w-10 h-10 rounded-full items-center justify-center ${(habitData.frequency.days || []).includes(day.id) ? "bg-blue-600" : "bg-gray-200"}`}
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

            {habitData.frequency.type === "custom" && (
              <View className="mb-3">
                <Text className="text-sm mb-2 text-gray-600">
                  Times per week:
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
                    className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                  >
                    <Text className="text-xl">+</Text>
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
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={habitData.showOnDashboard ? "#2563EB" : "#F3F4F6"}
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
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={habitData.reminders.enabled ? "#2563EB" : "#F3F4F6"}
              />
            </View>

            {habitData.reminders.enabled && (
              <View className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <Text className="text-sm mb-2 text-gray-600">
                  Reminder time:
                </Text>
                <View className="flex-row items-center">
                  <Clock size={18} color="#4B5563" />
                  <TextInput
                    className="ml-2 border border-gray-300 rounded-md p-2 bg-white flex-1"
                    placeholder="08:00"
                    value={habitData.reminders.time}
                    onChangeText={(text) =>
                      setHabitData({
                        ...habitData,
                        reminders: {
                          ...habitData.reminders,
                          time: text,
                        },
                      })
                    }
                  />
                </View>
              </View>
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
              className="flex-1 ml-2 py-3 bg-blue-600 rounded-md items-center justify-center flex-row"
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
