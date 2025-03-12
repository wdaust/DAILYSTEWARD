import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  Target,
  ChevronRight,
  CheckCircle,
  Circle,
  Flag,
  Calendar,
  TrendingUp,
} from "lucide-react-native";

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: "spiritual" | "ministry" | "personal" | "family" | "other";
  progress: number;
  subGoals: SubGoal[];
}

interface GoalListProps {
  goals?: Goal[];
  onGoalPress?: (goal: Goal) => void;
  onToggleSubGoal?: (goalId: string, subGoalId: string) => void;
}

const GoalList = ({
  goals = [],

  onGoalPress = () => {},
  onToggleSubGoal = () => {},
}: GoalListProps) => {
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  const toggleExpand = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  const handleToggleSubGoal = (goalId: string, subGoalId: string) => {
    onToggleSubGoal(goalId, subGoalId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "spiritual":
        return "bg-primary-100 text-primary-700";
      case "ministry":
        return "bg-green-100 text-green-700";
      case "personal":
        return "bg-purple-100 text-purple-700";
      case "family":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow-card w-full">
      <Text className="text-xl font-semibold mb-5 text-neutral-800">
        My Spiritual Goals
      </Text>

      <ScrollView className="w-full">
        {goals.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-neutral-500 text-center">
              No goals created yet. Add a new goal to get started.
            </Text>
          </View>
        ) : (
          goals.map((goal) => (
            <View key={goal.id} className="mb-4">
              <TouchableOpacity
                className="flex-row items-center p-3 bg-secondary-100 rounded-xl border border-secondary-200"
                onPress={() => toggleExpand(goal.id)}
              >
                <View className="mr-3 p-2 rounded-full bg-primary-100">
                  <Flag size={20} color="#7E57C2" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-neutral-800">
                      {goal.title}
                    </Text>
                    <View className="flex-row items-center">
                      <View
                        className={`px-2 py-1 rounded-full mr-2 ${getCategoryColor(goal.category).split(" ")[0]}`}
                      >
                        <Text
                          className={`text-xs ${getCategoryColor(goal.category).split(" ")[1]} font-medium`}
                        >
                          {goal.category.charAt(0).toUpperCase() +
                            goal.category.slice(1)}
                        </Text>
                      </View>
                      <ChevronRight
                        size={16}
                        color="#7E57C2"
                        style={{
                          transform: [
                            {
                              rotate:
                                expandedGoalId === goal.id ? "90deg" : "0deg",
                            },
                          ],
                        }}
                      />
                    </View>
                  </View>

                  <Text className="text-xs text-neutral-500 mb-2">
                    {goal.description}
                  </Text>

                  <View className="w-full bg-secondary-200 h-2 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${goal.progress * 100}%` }}
                    />
                  </View>

                  <View className="flex-row justify-between mt-2">
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#7E57C2" />
                      <Text className="text-xs text-primary-600 ml-1 font-medium">
                        Due: {formatDate(goal.deadline)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <TrendingUp size={14} color="#7E57C2" />
                      <Text className="text-xs text-primary-600 ml-1 font-medium">
                        {Math.round(goal.progress * 100)}% complete
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Sub-goals section */}
              {expandedGoalId === goal.id && (
                <View className="mt-2 ml-12 bg-secondary-100 p-3 rounded-xl border border-secondary-200">
                  <Text className="font-medium text-neutral-700 mb-2">
                    Sub-goals:
                  </Text>
                  {goal.subGoals.map((subGoal) => (
                    <TouchableOpacity
                      key={subGoal.id}
                      className="flex-row items-center py-2 border-b border-secondary-200"
                      onPress={() => handleToggleSubGoal(goal.id, subGoal.id)}
                    >
                      {subGoal.completed ? (
                        <CheckCircle size={18} color="#7E57C2" />
                      ) : (
                        <Circle size={18} color="#D1D5DB" />
                      )}
                      <Text
                        className={`ml-2 ${subGoal.completed ? "text-neutral-500 line-through" : "text-neutral-800"}`}
                      >
                        {subGoal.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    className="mt-3 flex-row items-center justify-center py-3 bg-gray-100 rounded-lg"
                    onPress={() => onGoalPress(goal)}
                  >
                    <Text className="text-primary-600 font-medium">
                      View Goal Details
                    </Text>
                    <ChevronRight size={16} color="#7E57C2" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default GoalList;
