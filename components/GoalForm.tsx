import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Flag, Check, X, ChevronDown, AlertCircle } from "lucide-react-native";

interface GoalFormProps {
  onSave?: (goal: GoalData) => void;
  onCancel?: () => void;
  initialData?: GoalData;
}

interface GoalData {
  id?: string;
  title: string;
  description: string;
  category: "spiritual" | "ministry" | "personal" | "family" | "other";
  notes?: string;
  subGoals: { id?: string; title: string; completed: boolean }[];
}

const GoalForm = ({
  onSave = () => {},
  onCancel = () => {},
  initialData = {
    title: "",
    description: "",
    category: "spiritual",
    notes: "",
    subGoals: [],
  },
}: GoalFormProps) => {
  const [goalData, setGoalData] = useState<GoalData>(initialData);
  const [newSubGoal, setNewSubGoal] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    { id: "spiritual", label: "Spiritual" },
    { id: "ministry", label: "Ministry" },
    { id: "personal", label: "Personal" },
    { id: "family", label: "Family" },
    { id: "other", label: "Other" },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!goalData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!goalData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(goalData);
    }
  };

  const handleAddSubGoal = () => {
    if (newSubGoal.trim()) {
      setGoalData({
        ...goalData,
        subGoals: [
          ...goalData.subGoals,
          { title: newSubGoal.trim(), completed: false },
        ],
      });
      setNewSubGoal("");
    }
  };

  const handleRemoveSubGoal = (index: number) => {
    const updatedSubGoals = [...goalData.subGoals];
    updatedSubGoals.splice(index, 1);
    setGoalData({ ...goalData, subGoals: updatedSubGoals });
  };

  return (
    <View className="flex-1 bg-white p-4 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-xl font-bold mb-6 text-center text-primary-700">
            {initialData.id ? "Edit Goal" : "Create New Goal"}
          </Text>

          {/* Title Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 text-gray-700">
              Goal Title*
            </Text>
            <TextInput
              className={`border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-md p-3 bg-gray-50`}
              placeholder="Enter goal title"
              value={goalData.title}
              onChangeText={(text) => setGoalData({ ...goalData, title: text })}
            />
            {errors.title && (
              <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
            )}
          </View>

          {/* Description Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 text-gray-700">
              Description*
            </Text>
            <TextInput
              className={`border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md p-3 bg-gray-50`}
              placeholder="Enter goal description"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={goalData.description}
              onChangeText={(text) =>
                setGoalData({ ...goalData, description: text })
              }
            />
            {errors.description && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.description}
              </Text>
            )}
          </View>

          {/* Category Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Category*
            </Text>
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() =>
                    setGoalData({
                      ...goalData,
                      category: category.id as any,
                    })
                  }
                  className={`mr-2 mb-2 px-3 py-2 rounded-full ${goalData.category === category.id ? "bg-primary-600" : "bg-gray-200"}`}
                >
                  <Text
                    className={`${goalData.category === category.id ? "text-white" : "text-gray-800"}`}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Deadline field removed */}

          {/* Sub-goals Section */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Sub-goals
            </Text>

            {/* Add new sub-goal */}
            <View className="flex-row mb-3">
              <TextInput
                className="flex-1 border border-gray-300 rounded-l-md p-3 bg-gray-50"
                placeholder="Add a sub-goal"
                value={newSubGoal}
                onChangeText={setNewSubGoal}
              />
              <TouchableOpacity
                className="bg-primary-600 px-4 items-center justify-center rounded-r-md"
                onPress={handleAddSubGoal}
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>

            {/* Sub-goals list */}
            <View className="bg-gray-50 rounded-lg p-2">
              {goalData.subGoals.length === 0 ? (
                <Text className="text-gray-500 text-center py-4">
                  No sub-goals added yet
                </Text>
              ) : (
                goalData.subGoals.map((subGoal, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between py-3 border-b border-gray-100"
                  >
                    <Text className="flex-1 text-gray-800">
                      {subGoal.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSubGoal(index)}
                      className="p-2"
                    >
                      <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Notes Input */}
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
              value={goalData.notes}
              onChangeText={(text) => setGoalData({ ...goalData, notes: text })}
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
              <Text className="ml-2 font-medium text-white">Save Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GoalForm;
