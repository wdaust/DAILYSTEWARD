import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Flag,
  Calendar,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  ChevronRight,
  Target,
  Save,
  X,
  Check,
} from "lucide-react-native";

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface GoalDetailProps {
  goal?: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    category: "spiritual" | "ministry" | "personal" | "family" | "other";
    progress: number;
    subGoals: SubGoal[];
    createdAt: string;
    notes?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleSubGoal?: (subGoalId: string) => void;
  onAddSubGoal?: (title: string) => void;
  onDeleteSubGoal?: (subGoalId: string) => void;
  onEditSubGoal?: (subGoalId: string, newTitle: string, notes?: string) => void;
}

const GoalDetail = ({
  goal = {
    id: "1",
    title: "Read Bible in One Year",
    description: "Complete reading the entire Bible in one year",
    deadline: "2023-12-31",
    category: "spiritual",
    progress: 0.35,
    subGoals: [
      { id: "1-1", title: "Read Genesis to Deuteronomy", completed: true },
      { id: "1-2", title: "Read Joshua to Esther", completed: false },
      { id: "1-3", title: "Read Job to Song of Solomon", completed: false },
      { id: "1-4", title: "Read Isaiah to Malachi", completed: false },
      { id: "1-5", title: "Read Matthew to John", completed: true },
      { id: "1-6", title: "Read Acts to Revelation", completed: false },
    ],
    createdAt: "2023-01-01",
    notes:
      "I want to develop a deeper understanding of the Bible by reading it completely through in a systematic way.",
  },
  onEdit = () => {},
  onDelete = () => {},
  onToggleSubGoal = () => {},
  onAddSubGoal = () => {},
  onDeleteSubGoal = () => {},
  onEditSubGoal = () => {},
}: GoalDetailProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [newSubGoal, setNewSubGoal] = useState("");
  const [addingSubGoal, setAddingSubGoal] = useState(false);
  const [editingSubGoalId, setEditingSubGoalId] = useState<string | null>(null);
  const [editedSubGoalTitle, setEditedSubGoalTitle] = useState("");
  const [editedSubGoalNotes, setEditedSubGoalNotes] = useState("");
  const [expandedSubGoalId, setExpandedSubGoalId] = useState<string | null>(
    null,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddSubGoal = () => {
    if (newSubGoal.trim()) {
      onAddSubGoal(newSubGoal.trim());
      setNewSubGoal("");
      setAddingSubGoal(false);
    }
  };

  const handleStartEditSubGoal = (subGoal: SubGoal) => {
    setEditingSubGoalId(subGoal.id);
    setEditedSubGoalTitle(subGoal.title);
    setEditedSubGoalNotes(subGoal.notes || "");
  };

  const handleSaveEditSubGoal = () => {
    if (editingSubGoalId && editedSubGoalTitle.trim()) {
      onEditSubGoal(
        editingSubGoalId,
        editedSubGoalTitle.trim(),
        editedSubGoalNotes,
      );
      setEditingSubGoalId(null);
      setEditedSubGoalTitle("");
      setEditedSubGoalNotes("");
    }
  };

  const handleCancelEditSubGoal = () => {
    setEditingSubGoalId(null);
    setEditedSubGoalTitle("");
    setEditedSubGoalNotes("");
  };

  const toggleExpandSubGoal = (subGoalId: string) => {
    setExpandedSubGoalId(expandedSubGoalId === subGoalId ? null : subGoalId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "spiritual":
        return "bg-blue-100 text-blue-700";
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

  const completedSubGoals = goal.subGoals.filter((sg) => sg.completed).length;
  const totalSubGoals = goal.subGoals.length;

  return (
    <View className="flex-1 bg-white p-4 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with goal title and options */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Flag size={24} color="#4F46E5" />
            <Text className="text-2xl font-bold ml-2 text-gray-800">
              {goal.title}
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
                onEdit(goal.id);
                setShowOptions(false);
              }}
            >
              <Edit size={18} color="#4F46E5" />
              <Text className="ml-2 text-gray-800">Edit Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-2"
              onPress={() => {
                onDelete(goal.id);
                setShowOptions(false);
              }}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text className="ml-2 text-gray-800">Delete Goal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Category and deadline */}
        <View className="flex-row justify-between mb-4">
          <View
            className={`px-3 py-1 rounded-full ${getCategoryColor(goal.category).split(" ")[0]}`}
          >
            <Text
              className={`${getCategoryColor(goal.category).split(" ")[1]} font-medium`}
            >
              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={16} color="#6B7280" />
            <Text className="ml-1 text-gray-600">
              Due: {formatDate(goal.deadline)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6 bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600">{goal.description}</Text>
        </View>

        {/* Progress */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium text-gray-800">Progress</Text>
            <Text className="text-indigo-600 font-medium">
              {Math.round(goal.progress * 100)}%
            </Text>
          </View>
          <View className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <View
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${goal.progress * 100}%` }}
            />
          </View>
          <Text className="text-gray-500 text-sm mt-2">
            {completedSubGoals} of {totalSubGoals} sub-goals completed
          </Text>
        </View>

        {/* Sub-goals section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Sub-goals</Text>
            <TouchableOpacity
              className="bg-indigo-100 p-1 rounded-full"
              onPress={() => setAddingSubGoal(true)}
            >
              <Plus size={18} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          {/* Add new sub-goal input */}
          {addingSubGoal && (
            <View className="mb-4 flex-row items-center">
              <TextInput
                className="flex-1 border border-gray-300 rounded-l-lg p-2 bg-white"
                placeholder="Enter new sub-goal"
                value={newSubGoal}
                onChangeText={setNewSubGoal}
              />
              <TouchableOpacity
                className="bg-indigo-600 px-3 py-2 rounded-r-lg"
                onPress={handleAddSubGoal}
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sub-goals list */}
          <View className="bg-gray-50 rounded-lg p-2">
            {goal.subGoals.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">
                No sub-goals yet. Add some to track your progress.
              </Text>
            ) : (
              goal.subGoals.map((subGoal) => (
                <View
                  key={subGoal.id}
                  className="py-3 border-b border-gray-100"
                >
                  {editingSubGoalId === subGoal.id ? (
                    <View>
                      <View className="flex-row items-center mb-2">
                        <TextInput
                          className="flex-1 border border-gray-300 rounded-lg p-2 bg-white mr-2"
                          value={editedSubGoalTitle}
                          onChangeText={setEditedSubGoalTitle}
                          autoFocus
                          placeholder="Sub-goal title"
                        />
                        <TouchableOpacity
                          onPress={handleSaveEditSubGoal}
                          className="p-2 bg-green-500 rounded-full mr-1"
                        >
                          <Check size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleCancelEditSubGoal}
                          className="p-2 bg-gray-300 rounded-full"
                        >
                          <X size={16} color="#4B5563" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        className="border border-gray-300 rounded-lg p-2 bg-white mb-2"
                        value={editedSubGoalNotes}
                        onChangeText={setEditedSubGoalNotes}
                        placeholder="Add notes for this sub-goal (optional)"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                    </View>
                  ) : (
                    <View>
                      <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                          className="flex-row items-center flex-1"
                          onPress={() => onToggleSubGoal(subGoal.id)}
                        >
                          {subGoal.completed ? (
                            <CheckCircle size={20} color="#10B981" />
                          ) : (
                            <Circle size={20} color="#D1D5DB" />
                          )}
                          <Text
                            className={`ml-3 ${subGoal.completed ? "text-gray-500 line-through" : "text-gray-800"}`}
                          >
                            {subGoal.title}
                          </Text>
                        </TouchableOpacity>
                        <View className="flex-row">
                          <TouchableOpacity
                            onPress={() => toggleExpandSubGoal(subGoal.id)}
                            className="p-2 mr-1"
                          >
                            <ChevronRight
                              size={16}
                              color="#4F46E5"
                              style={{
                                transform: [
                                  {
                                    rotate:
                                      expandedSubGoalId === subGoal.id
                                        ? "90deg"
                                        : "0deg",
                                  },
                                ],
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleStartEditSubGoal(subGoal)}
                            className="p-2 mr-1"
                          >
                            <Edit size={16} color="#4F46E5" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => onDeleteSubGoal(subGoal.id)}
                            className="p-2"
                          >
                            <Trash2 size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {expandedSubGoalId === subGoal.id && (
                        <View className="mt-2 ml-8 bg-indigo-50 p-3 rounded-lg">
                          <Text className="text-sm font-medium text-indigo-800 mb-1">
                            Notes:
                          </Text>
                          {subGoal.notes ? (
                            <Text className="text-gray-700">
                              {subGoal.notes}
                            </Text>
                          ) : (
                            <Text className="text-gray-500 italic">
                              No notes added yet. Edit this sub-goal to add
                              notes.
                            </Text>
                          )}
                          <TouchableOpacity
                            onPress={() => handleStartEditSubGoal(subGoal)}
                            className="mt-2 flex-row items-center self-end"
                          >
                            <Edit size={14} color="#4F46E5" />
                            <Text className="ml-1 text-indigo-700 text-sm">
                              Edit
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Notes section */}
        {goal.notes && (
          <View className="mb-6">
            <Text className="text-lg font-bold mb-2 text-gray-800">Notes</Text>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-600">{goal.notes}</Text>
            </View>
          </View>
        )}

        {/* Created date */}
        <View className="mb-6 items-center">
          <Text className="text-gray-500 text-sm">
            Goal created on {formatDate(goal.createdAt)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default GoalDetail;
