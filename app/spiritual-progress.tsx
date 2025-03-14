import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { Plus, Flag, Target } from "lucide-react-native";
import GoalList from "../components/GoalList";
import GoalDetail from "../components/GoalDetail";
import GoalForm from "../components/GoalForm";
import HabitList from "../components/HabitList";
import HabitDetail from "../components/HabitDetail";
import HabitForm from "../components/HabitForm";
import BottomNavigation from "../components/BottomNavigation";
import { useGoals, Goal, SubGoal } from "../lib/hooks/useGoals";
import { useHabits } from "../lib/hooks/useHabits";

enum TrackerView {
  LIST,
  DETAIL,
  FORM,
}

enum TrackerTab {
  GOALS,
  HABITS,
}

export default function SpiritualProgressScreen() {
  const [activeTab, setActiveTab] = useState<TrackerTab>(TrackerTab.GOALS);
  const [currentView, setCurrentView] = useState<TrackerView>(TrackerView.LIST);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);

  // Goals data
  const {
    data: goals,
    isLoading: goalsLoading,
    addData: addGoal,
    updateData: updateGoal,
    deleteData: deleteGoal,
  } = useGoals();

  // Habits data
  const {
    data: habits,
    isLoading: habitsLoading,
    addData: addHabit,
    updateData: updateHabit,
    deleteData: deleteHabit,
  } = useHabits();

  const isLoading =
    activeTab === TrackerTab.GOALS ? goalsLoading : habitsLoading;

  // Goals handlers
  const handleGoalPress = (goal: Goal) => {
    if (!goal) return;
    setSelectedGoal(goal);
    setCurrentView(TrackerView.DETAIL);
  };

  const handleToggleSubGoal = async (goalId: string, subGoalId: string) => {
    if (!goalId || !subGoalId || !goals) return;

    const goal = goals.find((g) => g.id === goalId);
    if (!goal || !goal.subGoals) return;

    const updatedSubGoals = goal.subGoals.map((subGoal) => {
      if (subGoal.id === subGoalId) {
        return { ...subGoal, completed: !subGoal.completed };
      }
      return subGoal;
    });

    // Calculate new progress
    const completedCount = updatedSubGoals.filter((sg) => sg.completed).length;
    const newProgress = updatedSubGoals.length
      ? completedCount / updatedSubGoals.length
      : 0;

    // Update in database
    await updateGoal(goalId, {
      subGoals: updatedSubGoals,
      progress: newProgress,
    });

    // Update selected goal if in detail view
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal({
        ...selectedGoal,
        subGoals: updatedSubGoals,
        progress: newProgress,
      });
    }
  };

  const handleEditGoal = (id: string) => {
    if (!id || !goals) return;

    const goalToEdit = goals.find((g) => g.id === id);
    if (goalToEdit) {
      setSelectedGoal(goalToEdit);
      setCurrentView(TrackerView.FORM);
    }
  };

  const handleEditSubGoal = async (
    subGoalId: string,
    newTitle: string,
    notes?: string,
  ) => {
    if (!selectedGoal || !subGoalId || !newTitle || !selectedGoal.subGoals)
      return;

    const updatedSubGoals = selectedGoal.subGoals.map((subGoal) => {
      if (subGoal.id === subGoalId) {
        return { ...subGoal, title: newTitle, notes: notes };
      }
      return subGoal;
    });

    // Update in database
    await updateGoal(selectedGoal.id, {
      subGoals: updatedSubGoals,
    });

    // Update local state
    setSelectedGoal({
      ...selectedGoal,
      subGoals: updatedSubGoals,
    });
  };

  const handleDeleteGoal = async (id: string) => {
    if (!id) return;

    await deleteGoal(id);
    setCurrentView(TrackerView.LIST);
    setSelectedGoal(null);
  };

  const handleToggleDetailSubGoal = async (subGoalId: string) => {
    if (!selectedGoal || !subGoalId || !selectedGoal.subGoals) return;

    const updatedSubGoals = selectedGoal.subGoals.map((subGoal) => {
      if (subGoal.id === subGoalId) {
        return { ...subGoal, completed: !subGoal.completed };
      }
      return subGoal;
    });

    // Calculate new progress
    const completedCount = updatedSubGoals.filter((sg) => sg.completed).length;
    const newProgress = updatedSubGoals.length
      ? completedCount / updatedSubGoals.length
      : 0;

    // Update in database
    await updateGoal(selectedGoal.id, {
      subGoals: updatedSubGoals,
      progress: newProgress,
    });

    // Update local state
    setSelectedGoal({
      ...selectedGoal,
      subGoals: updatedSubGoals,
      progress: newProgress,
    });
  };

  const handleAddSubGoal = async (title: string) => {
    if (!selectedGoal || !title) return;

    const newSubGoal = {
      id: `${selectedGoal.id}-${Date.now()}`,
      title,
      completed: false,
    };

    const updatedSubGoals = [...(selectedGoal.subGoals || []), newSubGoal];

    // Calculate new progress
    const completedCount = updatedSubGoals.filter((sg) => sg.completed).length;
    const newProgress = completedCount / updatedSubGoals.length;

    // Update in database
    await updateGoal(selectedGoal.id, {
      subGoals: updatedSubGoals,
      progress: newProgress,
    });

    // Update local state
    setSelectedGoal({
      ...selectedGoal,
      subGoals: updatedSubGoals,
      progress: newProgress,
    });
  };

  const handleDeleteSubGoal = async (subGoalId: string) => {
    if (!selectedGoal || !subGoalId || !selectedGoal.subGoals) return;

    const updatedSubGoals = selectedGoal.subGoals.filter(
      (sg) => sg.id !== subGoalId,
    );

    // Calculate new progress
    const completedCount = updatedSubGoals.filter((sg) => sg.completed).length;
    const newProgress = updatedSubGoals.length
      ? completedCount / updatedSubGoals.length
      : 0;

    // Update in database
    await updateGoal(selectedGoal.id, {
      subGoals: updatedSubGoals,
      progress: newProgress,
    });

    // Update local state
    setSelectedGoal({
      ...selectedGoal,
      subGoals: updatedSubGoals,
      progress: newProgress,
    });
  };

  const handleSaveGoal = async (goalData: any) => {
    if (selectedGoal) {
      // Edit existing goal
      const updatedSubGoals = goalData.subGoals.map(
        (sg: any, index: number) => ({
          id:
            selectedGoal.subGoals[index]?.id ||
            `${selectedGoal.id}-${Date.now()}-${index}`,
          title: sg.title,
          completed: sg.completed || false,
        }),
      );

      // Calculate progress based on completed sub-goals
      const completedCount = updatedSubGoals.filter(
        (sg: any) => sg.completed,
      ).length;
      const newProgress = updatedSubGoals.length
        ? completedCount / updatedSubGoals.length
        : 0;

      const updates = {
        title: goalData.title,
        description: goalData.description,
        deadline: goalData.deadline,
        category: goalData.category,
        notes: goalData.notes,
        subGoals: updatedSubGoals,
        progress: newProgress,
      };

      await updateGoal(selectedGoal.id, updates);
    } else {
      // Create new goal
      const subGoals = goalData.subGoals.map((sg: any, index: number) => ({
        id: `temp-${index}`, // Temporary ID that will be replaced when saved to DB
        title: sg.title,
        completed: false,
      }));

      const newGoal = {
        title: goalData.title,
        description: goalData.description,
        deadline: goalData.deadline,
        category: goalData.category,
        notes: goalData.notes,
        subGoals: subGoals,
        progress: 0, // New goals start with 0 progress
        createdAt: new Date().toISOString().split("T")[0],
      };

      await addGoal(newGoal);
    }

    setCurrentView(TrackerView.LIST);
    setSelectedGoal(null);
  };

  // Habits handlers
  const handleHabitPress = (habit: any) => {
    setSelectedHabit(habit);
    setCurrentView(TrackerView.DETAIL);
  };

  const handleToggleComplete = async (habit: any, completed: boolean) => {
    // Calculate new streak value
    const newStreak = habit.completedToday
      ? Math.max(0, habit.streak - 1)
      : habit.streak + 1;
    const today = new Date().toISOString().split("T")[0];

    // Create updated habit object
    const updatedHabit = {
      ...habit,
      completedToday: completed,
      streak: newStreak,
      lastCompleted: completed ? today : habit.lastCompleted,
    };

    // Update the habit completion status in the database
    await updateHabit(habit.id, {
      completedToday: completed,
      streak: newStreak,
      lastCompleted: completed ? today : habit.lastCompleted,
    });

    // Update local state immediately to reflect changes
    const updatedHabits = habits.map((h) =>
      h.id === habit.id ? updatedHabit : h,
    );
    // Force update of the habits array to trigger re-render
    setHabits(updatedHabits);
  };

  const handleEditHabit = (id: string) => {
    const habitToEdit = habits.find((h) => h.id === id);
    if (habitToEdit) {
      setSelectedHabit(habitToEdit);
      setCurrentView(TrackerView.FORM);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    // Remove the habit from the database
    await deleteHabit(id);
    setCurrentView(TrackerView.LIST);
  };

  const handleCompleteHabit = async (id: string, date: string) => {
    // Find the habit to update
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    // Update the habit completion history
    const updatedHistory = [...habit.completionHistory];
    const existingEntryIndex = updatedHistory.findIndex(
      (entry) => entry.date === date,
    );

    if (existingEntryIndex >= 0) {
      updatedHistory[existingEntryIndex] = {
        ...updatedHistory[existingEntryIndex],
        completed: true,
      };
    } else {
      updatedHistory.push({ date, completed: true });
    }

    // Update the habit in the database
    await updateHabit(id, {
      completedToday: true,
      completionHistory: updatedHistory,
      streak: habit.streak + 1,
      lastCompleted: date,
    });

    // Update the selected habit if we're in detail view
    if (
      currentView === TrackerView.DETAIL &&
      selectedHabit &&
      selectedHabit.id === id
    ) {
      setSelectedHabit({
        ...selectedHabit,
        completedToday: true,
        completionHistory: updatedHistory,
        streak: selectedHabit.streak + 1,
        lastCompleted: date,
      });
    }
  };

  const handleSaveHabit = async (habitData: any) => {
    if (selectedHabit) {
      // Edit existing habit
      const updates = {
        name: habitData.title,
        type: habitData.type,
        description: habitData.notes || selectedHabit.description,
        frequency: habitData.frequency.type,
        reminderTime: habitData.reminders.enabled
          ? habitData.reminders.time
          : undefined,
        showOnDashboard: habitData.showOnDashboard,
      };

      await updateHabit(selectedHabit.id, updates);
    } else {
      // Create new habit
      const newHabit = {
        name: habitData.title,
        type: habitData.type,
        description: habitData.notes || "New habit",
        frequency: habitData.frequency.type,
        category: habitData.type,
        type: habitData.type,
        streak: 0,
        completedToday: false,
        lastCompleted: "",
        progress: 0,
        completionHistory: [],
        showOnDashboard: habitData.showOnDashboard,
        reminderTime: habitData.reminders.enabled
          ? habitData.reminders.time
          : undefined,
        createdAt: new Date().toISOString().split("T")[0],
      };

      await addHabit(newHabit);
    }
    setCurrentView(TrackerView.LIST);
    setSelectedHabit(null);
  };

  const renderContent = () => {
    if (activeTab === TrackerTab.GOALS) {
      // Goals content
      switch (currentView) {
        case TrackerView.DETAIL:
          return (
            <GoalDetail
              goal={selectedGoal as Goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onToggleSubGoal={handleToggleDetailSubGoal}
              onAddSubGoal={handleAddSubGoal}
              onDeleteSubGoal={handleDeleteSubGoal}
              onEditSubGoal={handleEditSubGoal}
            />
          );
        case TrackerView.FORM:
          return (
            <GoalForm
              initialData={
                selectedGoal
                  ? {
                      id: selectedGoal.id,
                      title: selectedGoal.title,
                      description: selectedGoal.description,
                      deadline: selectedGoal.deadline,
                      category: selectedGoal.category,
                      notes: selectedGoal.notes,
                      subGoals: selectedGoal.subGoals.map((sg) => ({
                        id: sg.id,
                        title: sg.title,
                        completed: sg.completed,
                      })),
                    }
                  : undefined
              }
              onSave={handleSaveGoal}
              onCancel={() => {
                setCurrentView(
                  selectedGoal ? TrackerView.DETAIL : TrackerView.LIST,
                );
                if (!selectedGoal) setSelectedGoal(null);
              }}
            />
          );
        default:
          return (
            <View className="flex-1">
              <GoalList
                goals={goals}
                onGoalPress={handleGoalPress}
                onToggleSubGoal={handleToggleSubGoal}
              />

              {/* Add Goal Button */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedGoal(null);
                  setCurrentView(TrackerView.FORM);
                }}
                className="bg-primary-600 py-4 rounded-xl items-center mt-4 mx-4 mb-4 flex-row justify-center"
              >
                <Plus size={20} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">
                  Add New Goal
                </Text>
              </TouchableOpacity>
            </View>
          );
      }
    } else {
      // Habits content
      switch (currentView) {
        case TrackerView.DETAIL:
          return (
            <HabitDetail
              habit={selectedHabit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              onComplete={handleCompleteHabit}
            />
          );
        case TrackerView.FORM:
          return (
            <HabitForm
              initialData={
                selectedHabit
                  ? {
                      id: selectedHabit.id,
                      title: selectedHabit.name,
                      type: selectedHabit.type,
                      frequency: {
                        type: selectedHabit.frequency,
                        days: [],
                        times: 1,
                      },
                      reminders: {
                        enabled: !!selectedHabit.reminderTime,
                        time: selectedHabit.reminderTime || "08:00",
                      },
                      notes: selectedHabit.description,
                      showOnDashboard: selectedHabit.showOnDashboard || false,
                    }
                  : undefined
              }
              onSave={handleSaveHabit}
              onCancel={() => {
                setCurrentView(
                  selectedHabit ? TrackerView.DETAIL : TrackerView.LIST,
                );
                if (!selectedHabit) setSelectedHabit(null);
              }}
            />
          );
        default:
          return (
            <View className="flex-1">
              <HabitList
                habits={habits}
                onHabitPress={handleHabitPress}
                onToggleComplete={handleToggleComplete}
              />

              {/* Add Habit Button */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedHabit(null);
                  setCurrentView(TrackerView.FORM);
                }}
                className="bg-primary-600 py-4 rounded-xl items-center mt-4 mx-4 mb-4 flex-row justify-center"
              >
                <Plus size={20} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">
                  Add New Habit
                </Text>
              </TouchableOpacity>
            </View>
          );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          title: "Spiritual Progress",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/* Header with Tabs */}
      <View className="bg-white p-5 border-b border-secondary-300 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            {currentView !== TrackerView.LIST && (
              <TouchableOpacity
                onPress={() => {
                  if (currentView === TrackerView.DETAIL) {
                    setCurrentView(TrackerView.LIST);
                    setSelectedGoal(null);
                    setSelectedHabit(null);
                  } else if (currentView === TrackerView.FORM) {
                    if (activeTab === TrackerTab.GOALS && selectedGoal) {
                      setCurrentView(TrackerView.DETAIL);
                    } else if (
                      activeTab === TrackerTab.HABITS &&
                      selectedHabit
                    ) {
                      setCurrentView(TrackerView.DETAIL);
                    } else {
                      setCurrentView(TrackerView.LIST);
                      setSelectedGoal(null);
                      setSelectedHabit(null);
                    }
                  } else {
                    setCurrentView(TrackerView.LIST);
                    setSelectedGoal(null);
                    setSelectedHabit(null);
                  }
                }}
                className="mr-3"
              >
                <Text className="text-primary-600 font-medium">Back</Text>
              </TouchableOpacity>
            )}
            <Text className="text-2xl font-semibold text-neutral-800">
              {currentView === TrackerView.LIST
                ? "Spiritual Progress"
                : currentView === TrackerView.DETAIL
                  ? activeTab === TrackerTab.GOALS
                    ? "Goal Details"
                    : "Habit Details"
                  : activeTab === TrackerTab.GOALS
                    ? selectedGoal
                      ? "Edit Goal"
                      : "Create Goal"
                    : selectedHabit
                      ? "Edit Habit"
                      : "Create Habit"}
            </Text>
          </View>
        </View>

        {/* Tab Selector - Only show in list view */}
        {currentView === TrackerView.LIST && (
          <View className="flex-row mt-4 border-b border-secondary-200">
            <TouchableOpacity
              className={`flex-1 py-2 ${activeTab === TrackerTab.GOALS ? "border-b-2 border-primary-600" : ""}`}
              onPress={() => setActiveTab(TrackerTab.GOALS)}
            >
              <View className="flex-row justify-center items-center">
                <Flag
                  size={18}
                  color={activeTab === TrackerTab.GOALS ? "#7E57C2" : "#9CA3AF"}
                />
                <Text
                  className={`ml-2 font-medium ${activeTab === TrackerTab.GOALS ? "text-primary-600" : "text-neutral-500"}`}
                >
                  Goals
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 ${activeTab === TrackerTab.HABITS ? "border-b-2 border-primary-600" : ""}`}
              onPress={() => setActiveTab(TrackerTab.HABITS)}
            >
              <View className="flex-row justify-center items-center">
                <Target
                  size={18}
                  color={
                    activeTab === TrackerTab.HABITS ? "#7E57C2" : "#9CA3AF"
                  }
                />
                <Text
                  className={`ml-2 font-medium ${activeTab === TrackerTab.HABITS ? "text-primary-600" : "text-neutral-500"}`}
                >
                  Habits
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-4 text-gray-600">
              {activeTab === TrackerTab.GOALS
                ? "Loading your goals..."
                : "Loading your habits..."}
            </Text>
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/spiritual-progress" />
    </SafeAreaView>
  );
}
