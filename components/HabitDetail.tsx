import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit,
  Flame,
  MoreVertical,
  Target,
  Trash2,
} from "lucide-react-native";

interface HabitDetailProps {
  habit?: {
    id: string;
    name: string;
    description: string;
    type: "prayer" | "study" | "meeting" | "ministry" | "other";
    frequency: "daily" | "weekly" | "monthly";
    streak: number;
    completionHistory: {
      date: string;
      completed: boolean;
    }[];
    reminderTime?: string;
    createdAt: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string, date: string) => void;
}

const HabitDetail = ({
  habit = {
    id: "1",
    name: "Daily Prayer",
    description: "Start each day with a meaningful prayer",
    type: "prayer",
    frequency: "daily",
    streak: 7,
    completionHistory: [
      { date: "2023-06-01", completed: true },
      { date: "2023-06-02", completed: true },
      { date: "2023-06-03", completed: true },
      { date: "2023-06-04", completed: true },
      { date: "2023-06-05", completed: true },
      { date: "2023-06-06", completed: true },
      { date: "2023-06-07", completed: true },
      { date: "2023-06-08", completed: false },
      { date: "2023-06-09", completed: false },
      { date: "2023-06-10", completed: false },
    ],
    reminderTime: "07:00",
    createdAt: "2023-05-25",
  },
  onEdit = () => {},
  onDelete = () => {},
  onComplete = () => {},
}: HabitDetailProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [habitViewMode, setHabitViewMode] = useState<"week" | "month" | "year">(
    "week",
  );
  const today = new Date().toISOString().split("T")[0];
  const isTodayCompleted = habit.completionHistory.some(
    (h) => h.date === today && h.completed,
  );

  // Get completion rate
  const completionRate =
    (habit.completionHistory.filter((h) => h.completed).length /
      habit.completionHistory.length) *
    100;

  // Get habit icon based on type
  const getHabitIcon = (type: string) => {
    switch (type) {
      case "prayer":
        return <Target size={24} color="#4F46E5" />;
      case "study":
        return <Calendar size={24} color="#4F46E5" />;
      case "meeting":
        return <Calendar size={24} color="#4F46E5" />;
      case "ministry":
        return <Calendar size={24} color="#4F46E5" />;
      default:
        return <Target size={24} color="#4F46E5" />;
    }
  };

  return (
    <View className="flex-1 bg-white p-4 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with habit name and options */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            {getHabitIcon(habit.type)}
            <Text className="text-2xl font-bold ml-2 text-gray-800">
              {habit.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            className="p-2"
          >
            <MoreVertical size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Options menu */}
        {showOptions && (
          <View className="absolute right-2 top-14 bg-white shadow-md rounded-md z-10 p-2">
            <TouchableOpacity
              className="flex-row items-center p-2"
              onPress={() => {
                onEdit(habit.id);
                setShowOptions(false);
              }}
            >
              <Edit size={18} color="#4F46E5" />
              <Text className="ml-2 text-gray-800">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-2"
              onPress={() => {
                onDelete(habit.id);
                setShowOptions(false);
              }}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text className="ml-2 text-gray-800">Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Description */}
        <View className="mb-6 bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600">{habit.description}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-indigo-50 p-4 rounded-lg flex-1 mr-2 items-center">
            <Flame size={24} color="#4F46E5" />
            <Text className="text-2xl font-bold text-indigo-600 mt-1">
              {habit.streak}
            </Text>
            <Text className="text-gray-600 text-sm">Day Streak</Text>
          </View>
          <View className="bg-indigo-50 p-4 rounded-lg flex-1 ml-2 items-center">
            <CheckCircle size={24} color="#4F46E5" />
            <Text className="text-2xl font-bold text-indigo-600 mt-1">
              {Math.round(completionRate)}%
            </Text>
            <Text className="text-gray-600 text-sm">Completion</Text>
          </View>
        </View>

        {/* Frequency and Reminder */}
        <View className="mb-6 bg-gray-50 p-4 rounded-lg">
          <View className="flex-row items-center mb-3">
            <Calendar size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-800 capitalize">
              {habit.frequency} habit
            </Text>
          </View>
          {habit.reminderTime && (
            <View className="flex-row items-center">
              <Clock size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-800">
                Reminder at {habit.reminderTime}
              </Text>
            </View>
          )}
        </View>

        {/* Mark as complete button */}
        <Pressable
          className={`p-4 rounded-lg mb-6 flex-row justify-center items-center ${isTodayCompleted ? "bg-green-100" : "bg-indigo-600"}`}
          onPress={() => onComplete(habit.id, today)}
          disabled={isTodayCompleted}
        >
          <CheckCircle
            size={20}
            color={isTodayCompleted ? "#10B981" : "#FFFFFF"}
          />
          <Text
            className={`ml-2 font-bold ${isTodayCompleted ? "text-green-700" : "text-white"}`}
          >
            {isTodayCompleted ? "Completed Today" : "Mark as Complete"}
          </Text>
        </Pressable>

        {/* History */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3 text-gray-800">History</Text>

          <View className="bg-gray-50 rounded-lg p-3">
            <View className="flex-row mb-4">
              <TouchableOpacity
                className={`flex-1 py-2 mr-1 rounded-md ${habitViewMode === "week" ? "bg-indigo-600" : "bg-gray-200"}`}
                onPress={() => setHabitViewMode("week")}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center ${habitViewMode === "week" ? "text-white" : "text-gray-700"} font-medium`}
                >
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 mx-1 rounded-md ${habitViewMode === "month" ? "bg-indigo-600" : "bg-gray-200"}`}
                onPress={() => setHabitViewMode("month")}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center ${habitViewMode === "month" ? "text-white" : "text-gray-700"} font-medium`}
                >
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 ml-1 rounded-md ${habitViewMode === "year" ? "bg-indigo-600" : "bg-gray-200"}`}
                onPress={() => setHabitViewMode("year")}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center ${habitViewMode === "year" ? "text-white" : "text-gray-700"} font-medium`}
                >
                  Year
                </Text>
              </TouchableOpacity>
            </View>

            {/* Habit History Tiles */}
            {habitViewMode === "week" && (
              <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-500 text-xs">Mon</Text>
                  <Text className="text-gray-500 text-xs">Tue</Text>
                  <Text className="text-gray-500 text-xs">Wed</Text>
                  <Text className="text-gray-500 text-xs">Thu</Text>
                  <Text className="text-gray-500 text-xs">Fri</Text>
                  <Text className="text-gray-500 text-xs">Sat</Text>
                  <Text className="text-gray-500 text-xs">Sun</Text>
                </View>

                {/* Week 1 */}
                <View className="flex-row justify-between mb-2">
                  {[true, true, false, true, true, true, true].map(
                    (completed, index) => (
                      <TouchableOpacity
                        key={index}
                        className={`w-10 h-10 rounded-lg items-center justify-center ${completed ? "bg-green-500" : "bg-gray-100"}`}
                        onPress={() => console.log(`Pressed day ${index + 1}`)}
                      />
                    ),
                  )}
                </View>

                {/* Week 2 */}
                <View className="flex-row justify-between mb-2">
                  {[false, true, true, true, false, true, false].map(
                    (completed, index) => (
                      <TouchableOpacity
                        key={index}
                        className={`w-10 h-10 rounded-lg items-center justify-center ${completed ? "bg-green-500" : "bg-gray-100"}`}
                        onPress={() => console.log(`Pressed day ${index + 8}`)}
                      />
                    ),
                  )}
                </View>

                {/* Week 3 */}
                <View className="flex-row justify-between mb-2">
                  {[true, false, true, false, true, true, true].map(
                    (completed, index) => (
                      <TouchableOpacity
                        key={index}
                        className={`w-10 h-10 rounded-lg items-center justify-center ${completed ? "bg-green-500" : "bg-gray-100"}`}
                        onPress={() => console.log(`Pressed day ${index + 15}`)}
                      />
                    ),
                  )}
                </View>
              </View>
            )}

            {/* Month View */}
            {habitViewMode === "month" && (
              <View className="mb-4">
                <View className="flex-row flex-wrap justify-between">
                  {Array.from({ length: 30 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      className={`w-10 h-10 rounded-lg items-center justify-center m-1 ${Math.random() > 0.3 ? "bg-green-500" : "bg-gray-100"}`}
                    >
                      <Text
                        className={`text-xs ${Math.random() > 0.3 ? "text-white" : "text-gray-700"} font-medium`}
                      >
                        {i + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Year View */}
            {habitViewMode === "year" && (
              <View className="mb-4">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month, index) => {
                  const completedDays = Math.floor(Math.random() * 20) + 5;
                  const totalDays = 30;
                  return (
                    <View
                      key={index}
                      className="flex-row justify-between items-center mb-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <Text className="text-gray-700 w-16">{month}</Text>
                      <View className="flex-1 mx-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${(completedDays / totalDays) * 100}%`,
                          }}
                        />
                      </View>
                      <Text className="text-gray-700 text-xs">
                        {completedDays}/{totalDays}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-sm bg-green-500 mr-1" />
                <Text className="text-xs text-gray-600">Completed</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-sm bg-gray-100 mr-1" />
                <Text className="text-xs text-gray-600">Missed</Text>
              </View>
            </View>
          </View>

          <View className="mt-4 bg-gray-50 rounded-lg">
            <Text className="p-3 font-medium text-gray-700 border-b border-gray-200">
              Recent Activity
            </Text>
            {habit.completionHistory.slice(0, 5).map((entry, index) => (
              <View
                key={entry.date}
                className={`flex-row justify-between items-center p-3 ${index !== 0 ? "border-t border-gray-200" : ""}`}
              >
                <Text className="text-gray-800">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <View
                  className={`p-1 rounded ${entry.completed ? "bg-green-100" : "bg-gray-200"}`}
                >
                  <Text
                    className={
                      entry.completed ? "text-green-700" : "text-gray-600"
                    }
                  >
                    {entry.completed ? "Completed" : "Missed"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity className="flex-row items-center justify-center mt-3">
            <Text className="text-indigo-600 font-medium">
              View Full History
            </Text>
            <ChevronRight size={16} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HabitDetail;
