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
import { Plus, Flag, ChevronLeft } from "lucide-react-native";
import GoalList from "../components/GoalList";
import GoalDetail from "../components/GoalDetail";
import GoalForm from "../components/GoalForm";
import BottomNavigation from "../components/BottomNavigation";
import { useGoals, Goal, SubGoal } from "../lib/hooks/useGoals";

enum GoalsView {
  LIST,
  DETAIL,
  FORM,
}

export default function GoalsScreen() {
  const [currentView, setCurrentView] = useState<GoalsView>(GoalsView.LIST);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const {
    data: goals,
    isLoading,
    addData,
    updateData,
    deleteData,
  } = useGoals();

  const handleGoalPress = (goal: Goal) => {
    if (!goal) return;
    setSelectedGoal(goal);
    setCurrentView(GoalsView.DETAIL);
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
    await updateData(goalId, {
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
      setCurrentView(GoalsView.FORM);
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
    await updateData(selectedGoal.id, {
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

    await deleteData(id);
    setCurrentView(GoalsView.LIST);
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
    await updateData(selectedGoal.id, {
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
    await updateData(selectedGoal.id, {
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
    await updateData(selectedGoal.id, {
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

      await updateData(selectedGoal.id, updates);
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

      await addData(newGoal);
    }

    setCurrentView(GoalsView.LIST);
    setSelectedGoal(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case GoalsView.DETAIL:
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
      case GoalsView.FORM:
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
              setCurrentView(selectedGoal ? GoalsView.DETAIL : GoalsView.LIST);
              if (!selectedGoal) setSelectedGoal(null);
            }}
          />
        );
      default:
        return (
          <GoalList
            goals={goals}
            onGoalPress={handleGoalPress}
            onToggleSubGoal={handleToggleSubGoal}
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          title: "Spiritual Goals",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/* Header */}
      <View className="bg-white p-5 border-b border-secondary-300 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            {currentView !== GoalsView.LIST && (
              <TouchableOpacity
                onPress={() => {
                  if (currentView === GoalsView.DETAIL) {
                    setCurrentView(GoalsView.LIST);
                    setSelectedGoal(null);
                  } else if (currentView === GoalsView.FORM && selectedGoal) {
                    setCurrentView(GoalsView.DETAIL);
                  } else {
                    setCurrentView(GoalsView.LIST);
                    setSelectedGoal(null);
                  }
                }}
                className="mr-3"
              >
                <ChevronLeft size={24} color="#7E57C2" />
              </TouchableOpacity>
            )}
            <Text className="text-2xl font-semibold text-neutral-800">
              {currentView === GoalsView.LIST
                ? "Spiritual Goals"
                : currentView === GoalsView.DETAIL
                  ? "Goal Details"
                  : selectedGoal
                    ? "Edit Goal"
                    : "Create Goal"}
            </Text>
          </View>
          {currentView === GoalsView.LIST && (
            <TouchableOpacity
              onPress={() => {
                setSelectedGoal(null);
                setCurrentView(GoalsView.FORM);
              }}
              className="bg-primary-600 p-3 rounded-full shadow-sm"
            >
              <Plus size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-4 text-gray-600">Loading your goals...</Text>
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/goals" />
    </SafeAreaView>
  );
}
