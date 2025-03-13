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

  // Re-calculate goal info when ministry goals data changes
  useEffect(() => {
    // Force re-render when ministry goals data changes
    setForceUpdate((prev) => prev + 1);

    // Always set view mode to monthly
    setViewMode("monthly");
  }, [ministryGoalsData]);

  const stats = monthlyStats;

  const handleAddTime = async () => {
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

    // Save to Supabase
    await addTimeEntry(timeEntry);

    // Also call the prop function for backward compatibility
    onAddTime({
      date: selectedDate.toISOString().split("T")[0],
      hours,
      minutes,
      type: selectedType,
      ministryType: selectedType, // Track which ministry type was done
    });

    setShowAddTimeModal(false);
    // Reset form
    setSelectedDate(new Date());
    setSelectedType("Field Ministry");
    setHours(0);
    setMinutes(0);
    setShowTypeSelector(false);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
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

  const goalInfo = getGoalInfo();

  // Use actual stats for current value, not the goal's current property
  const currentHours = stats.hours || 0;

  return (
    <View className="bg-white p-6 rounded-2xl shadow-card w-full">
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <Calendar size={20} color="#7E57C2" className="mr-2" />
          <Text className="text-xl font-semibold text-neutral-800">
            Ministry Time
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary-600 p-2 rounded-full"
          onPress={() => setShowAddTimeModal(true)}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
          <Text className="text-primary-600 font-medium">+12%</Text>
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
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
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
