import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react-native";

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  category: "prayer" | "study" | "ministry" | "meeting" | "other";
  streak: number;
  completedToday: boolean;
  lastCompleted: string;
  progress: number;
}

interface HabitListProps {
  habits?: Habit[];
  onHabitPress?: (habit: Habit) => void;
  onToggleComplete?: (habit: Habit, completed: boolean) => void;
}

const HabitList = ({
  habits = [],
  onHabitPress = () => {},
  onToggleComplete = () => {},
}: HabitListProps) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>(habits);

  const handleToggleComplete = (habit: Habit) => {
    const updatedHabits = localHabits.map((h) => {
      if (h.id === habit.id) {
        const updated = {
          ...h,
          completedToday: !h.completedToday,
          lastCompleted: h.completedToday
            ? h.lastCompleted
            : new Date().toISOString().split("T")[0],
          streak: h.completedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
        };
        onToggleComplete(updated, updated.completedToday);
        return updated;
      }
      return h;
    });
    setLocalHabits(updatedHabits);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prayer":
        return "bg-primary-100 text-primary-700";
      case "study":
        return "bg-primary-100 text-primary-700";
      case "ministry":
        return "bg-primary-100 text-primary-700";
      case "meeting":
        return "bg-primary-100 text-primary-700";
      default:
        return "bg-secondary-200 text-neutral-700";
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return <Clock size={16} color="#7E57C2" />;
      case "weekly":
        return <Calendar size={16} color="#7E57C2" />;
      case "monthly":
        return <TrendingUp size={16} color="#7E57C2" />;
      default:
        return <Clock size={16} color="#7E57C2" />;
    }
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow-card w-full">
      <Text className="text-xl font-semibold mb-5 text-neutral-800">
        My Spiritual Habits
      </Text>

      <ScrollView className="w-full">
        {localHabits.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-neutral-500 text-center">
              No habits created yet. Add a new habit to get started.
            </Text>
          </View>
        ) : (
          localHabits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              className="flex-row items-center p-4 mb-4 bg-secondary-100 rounded-xl shadow-sm"
              onPress={() => onHabitPress(habit)}
            >
              <TouchableOpacity
                onPress={() => handleToggleComplete(habit)}
                className="mr-3"
              >
                {habit.completedToday ? (
                  <CheckCircle2 size={24} color="#7E57C2" />
                ) : (
                  <Circle size={24} color="#D1D5DB" strokeWidth={1.5} />
                )}
              </TouchableOpacity>

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-neutral-800">
                    {habit.name}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="flex-row items-center mr-2">
                      {getFrequencyIcon(habit.frequency)}
                      <Text className="text-xs text-primary-600 ml-1 capitalize font-medium">
                        {habit.frequency}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#7E57C2" />
                  </View>
                </View>

                <Text className="text-xs text-neutral-500 mb-3">
                  {habit.description}
                </Text>

                <View className="w-full bg-secondary-200 h-2 rounded-full overflow-hidden">
                  <View
                    className={`h-full ${habit.completedToday ? "bg-primary-600" : "bg-primary-400"}`}
                    style={{ width: `${habit.progress * 100}%` }}
                  />
                </View>

                <View className="flex-row justify-between mt-2">
                  <View className="flex-row items-center">
                    <TrendingUp size={14} color="#7E57C2" />
                    <Text className="text-xs text-primary-600 ml-1 font-medium">
                      {habit.streak} day streak
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getCategoryColor(habit.category).split(" ")[0]}`}
                  >
                    <Text
                      className={`text-xs ${getCategoryColor(habit.category).split(" ")[1]} font-medium`}
                    >
                      {habit.category.charAt(0).toUpperCase() +
                        habit.category.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HabitList;
