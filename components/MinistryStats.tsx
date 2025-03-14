import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Pressable,
} from "react-native";
import {
  Clock,
  Calendar,
  Plus,
  TrendingUp,
  X,
  Save,
  ChevronDown,
  Edit,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useMinistryGoals } from "../lib/hooks/useMinistryGoals";
import { useMinistryTimeEntries } from "../lib/hooks/useMinistryTimeEntries";
import { useMinistryTypes } from "../lib/hooks/useMinistryTypes";

interface MinistryStatsProps {
  weeklyStats?: {
    hours: number;
  };
  monthlyStats?: {
    hours: number;
  };
  onAddTime?: (data: {
    date: string;
    hours: number;
    minutes: number;
    type: string;
  }) => void;
  onViewDetailedStats?: () => void;
}

const MinistryStats = ({
  weeklyStats = {
    hours: 0,
  },
  monthlyStats = {
    hours: 0,
  },
  onAddTime = () => {},
  onViewDetailedStats = () => {},
}: MinistryStatsProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"monthly">("monthly");
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState("Field Ministry");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Use Supabase hooks
  const {
    data: ministryGoalsData,
    isLoading: goalsLoading,
    addData: addGoal,
    updateData: updateGoal,
  } = useMinistryGoals();
  const {
    data: timeEntriesData,
    isLoading: entriesLoading,
    addData: addTimeEntry,
  } = useMinistryTimeEntries();
  const { data: ministryTypesData, isLoading: typesLoading } =
    useMinistryTypes();

  // Predefined ministry types (fallback if none in database)
  const defaultMinistryTypes = [
    { id: "1", name: "Field Ministry" },
    { id: "2", name: "LDC" },
  ];

  // Use types from database or fallback to defaults
  const ministryTypes =
    ministryTypesData && ministryTypesData.length > 0
      ? ministryTypesData
      : defaultMinistryTypes;

  // Listen for goal updates from database or localStorage
  useEffect(() => {
    // For web platform, still listen to localStorage events for backward compatibility
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const handleGoalsUpdated = () => {
        // Force component to re-render when goals are updated via localStorage
        setForceUpdate((prev) => prev + 1);
      };

      window.addEventListener("ministryGoalsUpdated", handleGoalsUpdated);

      return () => {
        window.removeEventListener("ministryGoalsUpdated", handleGoalsUpdated);
      };
    }
  }, []);

  // Function to get goal value and current progress
  const getGoalInfo = () => {
    // Always use monthly goals
    // First try to get goal from Supabase data
    if (ministryGoalsData && ministryGoalsData.length > 0) {
      const goal = ministryGoalsData.find(
        (g) => g.type === "Hours" && g.period === "monthly",
      );
      if (goal) return { target: goal.target, current: goal.current || 0 };
    }

    // Fallback to localStorage for backward compatibility
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        const savedGoals = localStorage.getItem("ministryGoals");
        if (savedGoals) {
          const goals = JSON.parse(savedGoals);
          const goal = goals.find(
            (g) => g.type === "Hours" && g.period === "monthly",
          );
          if (goal) return { target: goal.target, current: goal.current || 0 };
        }
      } catch (e) {
        console.error("Failed to parse saved goals", e);
      }
    }

    // If we reach here, check if there's any goal with the right type regardless of period
    if (ministryGoalsData && ministryGoalsData.length > 0) {
      const anyHoursGoal = ministryGoalsData.find((g) => g.type === "Hours");
      if (anyHoursGoal)
        return {
          target: anyHoursGoal.target,
          current: anyHoursGoal.current || 0,
        };
    }

    // Default values if no saved goals
    return {
      target: 24, // Default to 24 hours monthly goal
      current: stats.hours,
    };
  };

  // Re-calculate goal info when ministry goals data changes
  useEffect(() => {
    // Force re-render when ministry goals data changes
    setForceUpdate((prev) => prev + 1);

    // Always set view mode to monthly
    setViewMode("monthly");
  }, [ministryGoalsData]);

  const stats = monthlyStats;

  // Use the stats directly from the hook
  // Find the weekly and monthly stats from ministryStats
  useEffect(() => {
    // Force re-render
    setForceUpdate((prev) => prev + 1);

    // Update current value in goal info when stats change
    const updateGoalData = async () => {
      try {
        if (ministryGoalsData && ministryGoalsData.length > 0) {
          const hoursGoal = ministryGoalsData.find((g) => g.type === "Hours");
          if (hoursGoal) {
            // Add a small delay before updating goal
            await new Promise((resolve) => setTimeout(resolve, 100));
            await updateGoal(hoursGoal.id, { current: stats.hours || 0 });
          }
        }
      } catch (error) {
        console.error("Error updating goal data:", error);
      }
    };

    updateGoalData();
  }, [weeklyStats, monthlyStats, stats.hours, ministryGoalsData, updateGoal]);

  const goalInfo = getGoalInfo();

  // Use actual stats for current value, not the goal's current property
  const currentHours = stats.hours || 0;

  const handleAddTime = async () => {
    try {
      // Calculate total time in hours for stats display
      const totalHours = hours + minutes / 60;

      // Create time entry object
      const timeEntry = {
        date: selectedDate.toISOString().split("T")[0],
        hours: totalHours,
        minutes: minutes,
        ministry_type: selectedType,
        type: "monthly", // Always monthly
      };

      console.log("Saving ministry time entry:", timeEntry);

      // Add a small delay before database operations
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Save to Supabase
      const result = await addTimeEntry(timeEntry);
      console.log("Ministry time entry saved result:", result);

      // Add another delay before updating goals
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Also update the ministry stats directly
      // This ensures the UI updates immediately without requiring a page refresh
      if (ministryGoalsData && ministryGoalsData.length > 0) {
        const hoursGoal = ministryGoalsData.find((g) => g.type === "Hours");
        if (hoursGoal) {
          const newTotal = (hoursGoal.current || 0) + totalHours;
          await updateGoal(hoursGoal.id, { current: newTotal });
        }
      }

      // Force refresh of stats
      setForceUpdate((prev) => prev + 1);

      // Also call the prop function for backward compatibility
      onAddTime({
        date: selectedDate.toISOString().split("T")[0],
        hours,
        minutes,
        type: selectedType,
        ministryType: selectedType, // Track which ministry type was done
      });

      // Add a final delay before UI updates
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Close modal and reset form
      setShowAddTimeModal(false);
      setSelectedDate(new Date());
      setSelectedType("Field Ministry");
      setHours(0);
      setMinutes(0);
      setShowTypeSelector(false);

      // Reload the page to show updated stats
      router.replace("/ministry-time");
    } catch (error) {
      console.error("Error saving ministry time:", error);
    }
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const renderHoursButtons = () => {
    return (
      <View className="flex-row flex-wrap justify-center mb-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
          <TouchableOpacity
            key={`hour-${h}`}
            className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${hours === h ? "bg-primary-600" : "bg-gray-200"}`}
            onPress={() => setHours(h)}
          >
            <Text
              className={`text-lg ${hours === h ? "text-white font-medium" : "text-gray-700"}`}
            >
              {h}h
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMinutesButtons = () => {
    return (
      <View className="flex-row flex-wrap justify-center">
        {[0, 15, 30, 45].map((m) => (
          <TouchableOpacity
            key={`min-${m}`}
            className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${minutes === m ? "bg-primary-600" : "bg-gray-200"}`}
            onPress={() => setMinutes(m)}
          >
            <Text
              className={`text-lg ${minutes === m ? "text-white font-medium" : "text-gray-700"}`}
            >
              {m}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="w-full">
      <View className="items-center bg-primary-50 p-4 rounded-xl mb-5">
        <View className="flex-row items-center mb-1">
          <Clock size={16} color="#7E57C2" />
          <Text className="ml-2 text-neutral-600 text-xs">Total Hours</Text>
        </View>
        <Text className="text-2xl font-bold text-neutral-800">
          {stats.hours}
        </Text>
      </View>

      {/* Progress indicators */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-neutral-500">Hours Goal</Text>
          <Text className="text-xs text-primary-600 font-medium">
            {currentHours}/{goalInfo.target} hours
          </Text>
        </View>
        <View className="h-3 bg-secondary-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-600 rounded-full"
            style={{
              width: `${Math.min(100, (currentHours / goalInfo.target) * 100)}%`,
            }}
          />
        </View>
        <TouchableOpacity
          className="mt-2 flex-row items-center justify-end"
          onPress={() => router.push("/ministry-time?tab=goals")}
        >
          <Text className="text-xs text-primary-600">Edit Goal</Text>
          <Edit size={12} color="#7E57C2" className="ml-1" />
        </TouchableOpacity>
      </View>

      {/* Trend indicator */}
      <View className="flex-row items-center justify-between bg-secondary-100 p-4 rounded-xl mb-4">
        <View className="flex-row items-center">
          <TrendingUp size={18} color="#7E57C2" />
          <Text className="ml-2 text-neutral-700">
            This month vs last month
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-600 font-medium">No data available</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-primary-600 py-4 rounded-xl items-center mt-2 flex-1 mr-2"
          onPress={() => setShowAddTimeModal(true)}
        >
          <Text className="text-white font-medium">Add Time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primary-100 py-4 rounded-xl items-center mt-2 flex-1 ml-2"
          onPress={() => router.push("/ministry-time")}
        >
          <Text className="text-primary-700 font-medium">View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Add Time Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddTimeModal}
        onRequestClose={() => setShowAddTimeModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-4 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-primary-800">
                Add Ministry Time
              </Text>
              <TouchableOpacity onPress={() => setShowAddTimeModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date Selector */}
              <View className="mb-4">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Date
                </Text>
                <Pressable
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-800">
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </Pressable>
                {showDatePicker && Platform.OS === "android" && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {Platform.OS === "ios" && showDatePicker && (
                  <View className="mt-2 bg-white border border-gray-200 rounded-md p-2">
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      style={{ height: 120, width: "100%" }}
                    />
                    <View className="flex-row justify-end mt-2">
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        className="bg-primary-600 px-4 py-2 rounded-md"
                      >
                        <Text className="text-white font-medium">Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Type Selector */}
              <View className="mb-4">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Type
                </Text>
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                  onPress={() => setShowTypeSelector(!showTypeSelector)}
                >
                  <Text className="text-gray-800">{selectedType}</Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>

                {showTypeSelector && (
                  <View className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                    {ministryTypes.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        className={`p-3 ${selectedType === type.name ? "bg-primary-100" : "bg-white"} border-b border-gray-200`}
                        onPress={() => {
                          setSelectedType(type.name);
                          setShowTypeSelector(false);
                        }}
                      >
                        <Text
                          className={`${selectedType === type.name ? "text-primary-700 font-medium" : "text-gray-800"}`}
                        >
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Hours Selector */}
              <View className="mb-4">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Hours
                </Text>
                {renderHoursButtons()}
              </View>

              {/* Minutes Selector */}
              <View className="mb-6">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Minutes
                </Text>
                {renderMinutesButtons()}
              </View>

              {/* Total Time Display */}
              <View className="mb-6 bg-primary-50 p-4 rounded-lg items-center">
                <Text className="text-primary-700 font-medium mb-1">
                  Total Time
                </Text>
                <Text className="text-2xl font-bold text-primary-800">
                  {hours}h {minutes}m
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className="bg-primary-600 py-4 rounded-xl items-center mb-4 flex-row justify-center"
                onPress={handleAddTime}
              >
                <Save size={18} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">Save Time</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MinistryStats;
