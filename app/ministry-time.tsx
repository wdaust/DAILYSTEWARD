import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import {
  BarChart2,
  Calendar,
  Clock,
  Plus,
  Settings,
  Target,
  BookOpen,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react-native";
import BottomNavigation from "../components/BottomNavigation";
import { useMinistryStats } from "../lib/hooks/useMinistryStats";
import { useMinistryGoals } from "../lib/hooks/useMinistryGoals";
import { useMinistryTypes } from "../lib/hooks/useMinistryTypes";
import { useBibleStudies } from "../lib/hooks/useBibleStudies";

export default function MinistryTimePage() {
  const {
    data: ministryStats,
    isLoading: statsLoading,
    addData,
    updateData,
    deleteData,
  } = useMinistryStats();

  const {
    data: ministryGoalsData,
    isLoading: goalsLoading,
    addData: addGoal,
    updateData: updateGoal,
    deleteData: deleteGoal,
  } = useMinistryGoals();

  const {
    data: ministryTypesData,
    isLoading: typesLoading,
    addData: addType,
    updateData: updateType,
    deleteData: deleteType,
  } = useMinistryTypes();

  const {
    data: bibleStudiesData,
    isLoading: studiesLoading,
    addData: addStudy,
    updateData: updateStudy,
    deleteData: deleteStudy,
  } = useBibleStudies();

  // Combined loading state
  const isLoading =
    statsLoading || goalsLoading || typesLoading || studiesLoading;
  const [activeTab, setActiveTab] = useState<"reports" | "goals" | "settings">(
    "reports",
  );
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddStudyModal, setShowAddStudyModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  // Use ministry goals from Supabase with localStorage fallback
  const [ministryGoals, setMinistryGoals] = useState(() => {
    // If we have data from Supabase, use that
    if (ministryGoalsData && ministryGoalsData.length > 0) {
      return ministryGoalsData;
    }

    // Otherwise try to load from localStorage if on web platform
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const savedGoals = localStorage.getItem("ministryGoals");
      if (savedGoals) {
        try {
          return JSON.parse(savedGoals);
        } catch (e) {
          console.error("Failed to parse saved goals", e);
        }
      }
    }
    // Default goals
    return [
      { id: "1", type: "Hours", current: 0, target: 24, period: "monthly" },
    ];
  });

  // Update local state when Supabase data changes
  useEffect(() => {
    if (ministryGoalsData && ministryGoalsData.length > 0) {
      setMinistryGoals(ministryGoalsData);
    }
  }, [ministryGoalsData]);

  // Use ministry types from Supabase with defaults as fallback
  const [ministryTypes, setMinistryTypes] = useState(() => {
    if (ministryTypesData && ministryTypesData.length > 0) {
      return ministryTypesData;
    }
    return [
      { id: "1", name: "Field Ministry" },
      { id: "2", name: "LDC" },
    ];
  });

  // Update local state when Supabase data changes
  useEffect(() => {
    if (ministryTypesData && ministryTypesData.length > 0) {
      setMinistryTypes(ministryTypesData);
    }
  }, [ministryTypesData]);

  // Use Bible studies from Supabase with defaults as fallback
  const [bibleStudies, setBibleStudies] = useState(() => {
    if (bibleStudiesData && bibleStudiesData.length > 0) {
      return bibleStudiesData.map((study) => ({
        id: study.id,
        name: study.name,
        frequency: study.frequency,
        lastStudy: study.last_study,
        notes: study.notes,
      }));
    }
    return [
      {
        id: "1",
        name: "John Smith",
        frequency: "Weekly",
        lastStudy: "2023-06-15",
        notes: "Studying chapter 5",
      },
      {
        id: "2",
        name: "Mary Johnson",
        frequency: "Bi-weekly",
        lastStudy: "2023-06-10",
        notes: "Interested in baptism",
      },
    ];
  });

  // Update local state when Supabase data changes
  useEffect(() => {
    if (bibleStudiesData && bibleStudiesData.length > 0) {
      setBibleStudies(
        bibleStudiesData.map((study) => ({
          id: study.id,
          name: study.name,
          frequency: study.frequency,
          lastStudy: study.last_study,
          notes: study.notes,
        })),
      );
    }
  }, [bibleStudiesData]);

  // Form states
  const [newGoal, setNewGoal] = useState({
    type: "Hours",
    target: 0,
    period: "monthly",
  });

  // Add ministryType field to track which type of ministry was done
  const [selectedMinistryType, setSelectedMinistryType] = useState("");
  const [newType, setNewType] = useState({ name: "" });
  const [newStudy, setNewStudy] = useState({
    name: "",
    frequency: "Weekly",
    notes: "",
  });

  // Calculate weekly and monthly statistics
  const calculateStats = () => {
    if (!ministryStats || ministryStats.length === 0) {
      return {
        weekly: { hours: 0 },
        monthly: { hours: 0 },
      };
    }

    const weekly = ministryStats
      .filter((stat) => stat.type === "weekly")
      .reduce(
        (acc, stat) => ({
          hours: acc.hours + stat.hours,
        }),
        { hours: 0 },
      );

    const monthly = ministryStats
      .filter((stat) => stat.type === "monthly")
      .reduce(
        (acc, stat) => ({
          hours: acc.hours + stat.hours,
        }),
        { hours: 0 },
      );

    return { weekly, monthly };
  };

  // Effect to sync goals with localStorage
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      localStorage.setItem("ministryGoals", JSON.stringify(ministryGoals));

      // Force update of any components that depend on this data
      const event = new Event("ministryGoalsUpdated");
      window.dispatchEvent(event);
    }
  }, [ministryGoals]);

  const { weekly, monthly } = calculateStats();

  // Handle adding a new goal
  const handleAddGoal = async () => {
    if (newGoal.target <= 0) return;

    const goal = {
      type: "Hours", // Only track hours now
      current: 0,
      target: newGoal.target,
      period: "monthly", // Always set to monthly
    };

    // Save to Supabase
    await addGoal(goal);

    // For backward compatibility, also update localStorage
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const updatedGoals = [
        ...ministryGoals,
        { ...goal, id: Date.now().toString() },
      ];
      localStorage.setItem("ministryGoals", JSON.stringify(updatedGoals));

      // Trigger event for components using localStorage
      const event = new Event("ministryGoalsUpdated");
      window.dispatchEvent(event);
    }

    setNewGoal({ type: "Hours", target: 0, period: "monthly" });
    setShowAddGoalModal(false);
  };

  // Handle editing a goal
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      type: goal.type,
      target: goal.target,
      period: "monthly", // Always set to monthly
    });
    setShowEditGoalModal(true);
  };

  // Handle saving edited goal
  const handleSaveEditedGoal = async () => {
    if (newGoal.target <= 0 || !editingGoal) return;

    const updates = {
      target: newGoal.target,
      period: "monthly", // Always set to monthly
    };

    // Update in Supabase if it's a Supabase goal (has user_id)
    if (editingGoal.user_id) {
      await updateGoal(editingGoal.id, updates);
    } else {
      // For legacy goals without user_id, update local state
      const updatedGoals = ministryGoals.map((goal) =>
        goal.id === editingGoal.id
          ? {
              ...goal,
              target: newGoal.target,
              period: "monthly", // Always set to monthly
            }
          : goal,
      );

      setMinistryGoals(updatedGoals);

      // Save to localStorage if on web platform
      if (Platform.OS === "web" && typeof window !== "undefined") {
        localStorage.setItem("ministryGoals", JSON.stringify(updatedGoals));

        // Trigger event for components using localStorage
        const event = new Event("ministryGoalsUpdated");
        window.dispatchEvent(event);
      }
    }

    setShowEditGoalModal(false);
    setEditingGoal(null);
    setNewGoal({ type: "Hours", target: 0, period: "monthly" });
  };

  // Handle deleting a goal
  const handleDeleteGoal = async (goalId) => {
    // Check if it's a Supabase goal (has user_id)
    const goalToDelete = ministryGoals.find((goal) => goal.id === goalId);

    if (goalToDelete?.user_id) {
      // Delete from Supabase
      await deleteGoal(goalId);
    } else {
      // For legacy goals without user_id, update local state
      const updatedGoals = ministryGoals.filter((goal) => goal.id !== goalId);
      setMinistryGoals(updatedGoals);

      // Save to localStorage if on web platform
      if (Platform.OS === "web" && typeof window !== "undefined") {
        localStorage.setItem("ministryGoals", JSON.stringify(updatedGoals));

        // Trigger event for components using localStorage
        const event = new Event("ministryGoalsUpdated");
        window.dispatchEvent(event);
      }
    }
  };

  // Handle adding a new ministry type
  const handleAddType = async () => {
    if (!newType.name.trim()) return;

    const type = {
      name: newType.name.trim(),
    };

    // Save to Supabase
    await addType(type);

    setNewType({ name: "" });
    setShowAddTypeModal(false);
  };

  // Handle adding a new Bible study
  const handleAddStudy = async () => {
    if (!newStudy.name.trim()) return;

    const study = {
      name: newStudy.name.trim(),
      frequency: newStudy.frequency,
      last_study: new Date().toISOString().split("T")[0],
      notes: newStudy.notes,
    };

    // Save to Supabase
    await addStudy(study);

    setNewStudy({ name: "", frequency: "Weekly", notes: "" });
    setShowAddStudyModal(false);
  };

  // Handle deleting a ministry type
  const handleDeleteType = async (id) => {
    // Check if it's a Supabase type (has user_id)
    const typeToDelete = ministryTypes.find((type) => type.id === id);

    if (typeToDelete?.user_id) {
      // Delete from Supabase
      await deleteType(id);
    } else {
      // For legacy types without user_id, update local state
      setMinistryTypes(ministryTypes.filter((type) => type.id !== id));
    }
  };

  // Handle deleting a Bible study
  const handleDeleteStudy = async (id) => {
    // Check if it's a Supabase study (has user_id)
    const studyToDelete = bibleStudies.find((study) => study.id === id);

    if (studyToDelete?.user_id) {
      // Delete from Supabase
      await deleteStudy(id);
    } else {
      // For legacy studies without user_id, update local state
      setBibleStudies(bibleStudies.filter((study) => study.id !== id));
    }
  };

  // Render the Reports tab
  const renderReportsTab = () => (
    <View className="space-y-6">
      <View className="bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Monthly Summary
        </Text>

        <View className="items-center mb-3">
          <Text className="text-3xl font-bold text-primary-600">
            {monthly.hours}
          </Text>
          <Text className="text-sm text-gray-600">Hours</Text>
        </View>

        {/* Monthly Progress Bar */}
        <View className="mb-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-gray-600">Hours Goal</Text>
            <Text className="text-xs text-primary-600 font-medium">
              {monthly.hours}/
              {ministryGoals.find((g) => g.type === "Hours")?.target || 24}{" "}
              hours
            </Text>
          </View>
          <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-600 rounded-full"
              style={{
                width: `${Math.min(100, (monthly.hours / (ministryGoals.find((g) => g.type === "Hours")?.target || 24)) * 100)}%`,
              }}
            />
          </View>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Hours by Ministry Type
        </Text>

        {ministryTypes.map((type) => {
          // Calculate hours for this ministry type
          const typeHours = ministryStats
            .filter(
              (stat) =>
                stat.type === "monthly" && stat.ministryType === type.name,
            )
            .reduce((sum, stat) => sum + stat.hours, 0);

          const percentage =
            monthly.hours > 0 ? (typeHours / monthly.hours) * 100 : 0;

          return (
            <View key={type.id} className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-gray-700">{type.name}</Text>
                <Text className="text-xs text-primary-600 font-medium">
                  {typeHours} hours ({Math.round(percentage)}%)
                </Text>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary-600 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">Bible Studies</Text>
          <TouchableOpacity
            className="bg-primary-100 p-2 rounded-full"
            onPress={() => setShowAddStudyModal(true)}
          >
            <Plus size={18} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        {bibleStudies.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">
            No Bible studies added yet
          </Text>
        ) : (
          bibleStudies.map((study) => (
            <View
              key={study.id}
              className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <BookOpen size={16} color="#7E57C2" />
                  <Text className="ml-2 font-semibold text-gray-800">
                    {study.name}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">{study.frequency}</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Last study: {study.lastStudy}
              </Text>
              {study.notes && (
                <Text className="text-sm text-gray-600 mt-1">
                  {study.notes}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );

  // Render the Goals tab
  const renderGoalsTab = () => (
    <View className="space-y-6">
      <View className="bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Ministry Goals
          </Text>
          <TouchableOpacity
            className="bg-primary-100 p-2 rounded-full"
            onPress={() => setShowAddGoalModal(true)}
          >
            <Plus size={18} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        {ministryGoals.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">
            No goals set yet
          </Text>
        ) : (
          ministryGoals.map((goal) => (
            <View key={goal.id} className="mb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-medium text-gray-800">{goal.type}</Text>
                <View className="flex-row items-center">
                  <Text className="text-primary-600 font-medium mr-2">
                    {goal.current}/{goal.target} {goal.type.toLowerCase()}
                  </Text>
                  <TouchableOpacity onPress={() => handleEditGoal(goal)}>
                    <Edit size={16} color="#7E57C2" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="ml-2"
                    onPress={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary-600 rounded-full"
                  style={{
                    width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                  }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Monthly goal</Text>
            </View>
          ))
        )}
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Goal Suggestions
        </Text>

        <View className="space-y-3">
          <TouchableOpacity
            className="p-3 bg-gray-50 rounded-lg border border-gray-100"
            onPress={() => {
              setNewGoal({ type: "Hours", target: 30, period: "monthly" });
              setShowAddGoalModal(true);
            }}
          >
            <Text className="font-medium text-gray-800">Auxiliary Pioneer</Text>
            <Text className="text-sm text-gray-600 mt-1">
              30 hours per month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-3 bg-gray-50 rounded-lg border border-gray-100"
            onPress={() => {
              setNewGoal({ type: "Hours", target: 50, period: "monthly" });
              setShowAddGoalModal(true);
            }}
          >
            <Text className="font-medium text-gray-800">Regular Pioneer</Text>
            <Text className="text-sm text-gray-600 mt-1">
              50 hours per month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-3 bg-gray-50 rounded-lg border border-gray-100"
            onPress={() => {
              setNewGoal({ type: "Hours", target: 100, period: "monthly" });
              setShowAddGoalModal(true);
            }}
          >
            <Text className="font-medium text-gray-800">Special Pioneer</Text>
            <Text className="text-sm text-gray-600 mt-1">
              100 hours per month
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render the Settings tab
  const renderSettingsTab = () => (
    <View className="space-y-6">
      <View className="bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Ministry Types
          </Text>
          <TouchableOpacity
            className="bg-primary-100 p-2 rounded-full"
            onPress={() => setShowAddTypeModal(true)}
          >
            <Plus size={18} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        {ministryTypes.map((type) => (
          <View
            key={type.id}
            className="flex-row justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg border border-gray-100"
          >
            <Text className="font-medium text-gray-800">{type.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteType(type.id)}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Bible Study Management
        </Text>

        {bibleStudies.map((study) => (
          <View
            key={study.id}
            className="flex-row justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg border border-gray-100"
          >
            <View>
              <Text className="font-medium text-gray-800">{study.name}</Text>
              <Text className="text-xs text-gray-500">{study.frequency}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="mr-2">
                <Edit size={18} color="#7E57C2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteStudy(study.id)}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="mt-3 flex-row items-center justify-center py-3 bg-primary-50 rounded-lg"
          onPress={() => setShowAddStudyModal(true)}
        >
          <Plus size={18} color="#7E57C2" />
          <Text className="ml-2 text-primary-700 font-medium">
            Add Bible Study
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Data Management
        </Text>

        <TouchableOpacity className="flex-row justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg border border-gray-100">
          <Text className="font-medium text-gray-800">
            Export Ministry Data
          </Text>
          <ChevronRight size={18} color="#7E57C2" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg border border-gray-100">
          <Text className="font-medium text-gray-800">
            Import Ministry Data
          </Text>
          <ChevronRight size={18} color="#7E57C2" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
          <Text className="font-medium text-gray-800">Reset All Data</Text>
          <ChevronRight size={18} color="#7E57C2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Add Goal Modal
  const renderAddGoalModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddGoalModal}
      onRequestClose={() => setShowAddGoalModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary-800">
              Add New Goal
            </Text>
            <TouchableOpacity onPress={() => setShowAddGoalModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Hours Goal
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Target Value
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Enter target value"
              keyboardType="numeric"
              value={
                newGoal.target.toString() === "0"
                  ? ""
                  : newGoal.target.toString()
              }
              onChangeText={(text) =>
                setNewGoal({ ...newGoal, target: parseInt(text) || 0 })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Period
            </Text>
            <View className="flex-row">
              <TouchableOpacity className="px-4 py-2 rounded-lg bg-primary-600">
                <Text className="text-white">Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary-600 py-3 rounded-lg items-center"
            onPress={handleAddGoal}
          >
            <Text className="text-white font-medium">Add Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Edit Goal Modal
  const renderEditGoalModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEditGoalModal}
      onRequestClose={() => setShowEditGoalModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary-800">
              Edit Goal
            </Text>
            <TouchableOpacity onPress={() => setShowEditGoalModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Target Value
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Enter target value"
              keyboardType="numeric"
              value={newGoal.target.toString()}
              onChangeText={(text) =>
                setNewGoal({ ...newGoal, target: parseInt(text) || 0 })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Period
            </Text>
            <View className="flex-row">
              <TouchableOpacity className="px-4 py-2 rounded-lg bg-primary-600">
                <Text className="text-white">Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary-600 py-3 rounded-lg items-center"
            onPress={handleSaveEditedGoal}
          >
            <Text className="text-white font-medium">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Add Type Modal
  const renderAddTypeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddTypeModal}
      onRequestClose={() => setShowAddTypeModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary-800">
              Add Ministry Type
            </Text>
            <TouchableOpacity onPress={() => setShowAddTypeModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Type Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Enter ministry type name"
              value={newType.name}
              onChangeText={(text) => setNewType({ ...newType, name: text })}
            />
          </View>

          <TouchableOpacity
            className="bg-primary-600 py-3 rounded-lg items-center"
            onPress={handleAddType}
          >
            <Text className="text-white font-medium">Add Type</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Add Bible Study Modal
  const renderAddStudyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddStudyModal}
      onRequestClose={() => setShowAddStudyModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary-800">
              Add Bible Study
            </Text>
            <TouchableOpacity onPress={() => setShowAddStudyModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Enter person's name"
              value={newStudy.name}
              onChangeText={(text) => setNewStudy({ ...newStudy, name: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Frequency
            </Text>
            <View className="flex-row">
              {["Weekly", "Bi-weekly", "Monthly"].map((frequency) => (
                <TouchableOpacity
                  key={frequency}
                  className={`mr-2 px-4 py-2 rounded-lg ${newStudy.frequency === frequency ? "bg-primary-600" : "bg-gray-200"}`}
                  onPress={() => setNewStudy({ ...newStudy, frequency })}
                >
                  <Text
                    className={
                      newStudy.frequency === frequency
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    {frequency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2 text-gray-700">
              Notes
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              placeholder="Add notes about the study"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={newStudy.notes}
              onChangeText={(text) => setNewStudy({ ...newStudy, notes: text })}
            />
          </View>

          <TouchableOpacity
            className="bg-primary-600 py-3 rounded-lg items-center"
            onPress={handleAddStudy}
          >
            <Text className="text-white font-medium">Add Bible Study</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          title: "Ministry Time",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/* Tab Navigation */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "reports" ? "border-b-2 border-primary-600" : ""}`}
          onPress={() => setActiveTab("reports")}
        >
          <Text
            className={`text-center font-medium ${activeTab === "reports" ? "text-primary-600" : "text-gray-600"}`}
          >
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "goals" ? "border-b-2 border-primary-600" : ""}`}
          onPress={() => setActiveTab("goals")}
        >
          <Text
            className={`text-center font-medium ${activeTab === "goals" ? "text-primary-600" : "text-gray-600"}`}
          >
            Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === "settings" ? "border-b-2 border-primary-600" : ""}`}
          onPress={() => setActiveTab("settings")}
        >
          <Text
            className={`text-center font-medium ${activeTab === "settings" ? "text-primary-600" : "text-gray-600"}`}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-4 text-gray-600">Loading ministry data...</Text>
          </View>
        ) : activeTab === "reports" ? (
          renderReportsTab()
        ) : activeTab === "goals" ? (
          renderGoalsTab()
        ) : (
          renderSettingsTab()
        )}
      </ScrollView>

      {/* Modals */}
      {renderAddGoalModal()}
      {renderEditGoalModal()}
      {renderAddTypeModal()}
      {renderAddStudyModal()}

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/ministry-time" />
    </SafeAreaView>
  );
}
