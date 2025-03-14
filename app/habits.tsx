import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import BottomNavigation from "../components/BottomNavigation";
import HabitList from "../components/HabitList";
import HabitDetail from "../components/HabitDetail";
import HabitForm from "../components/HabitForm";
import { useHabits } from "../lib/hooks/useHabits";

enum HabitsView {
  LIST,
  DETAIL,
  FORM,
}

export default function HabitsScreen() {
  const [currentView, setCurrentView] = useState<HabitsView>(HabitsView.LIST);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const {
    data: habits,
    isLoading,
    addData: addHabit,
    updateData: updateHabit,
    deleteData: deleteHabit,
  } = useHabits();

  const handleHabitPress = (habit: any) => {
    setSelectedHabit(habit);
    setCurrentView(HabitsView.DETAIL);
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
      setCurrentView(HabitsView.FORM);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    // Remove the habit from the database
    await deleteHabit(id);
    setCurrentView(HabitsView.LIST);
  };

  const handleCompleteHabit = async (id: string, date: string) => {
    // Find the habit to update
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    // Update the habit completion history
    const updatedHistory = [...(habit.completionHistory || [])];
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
      currentView === HabitsView.DETAIL &&
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
    try {
      console.log("Handling save habit in habits.tsx:", habitData);
      if (selectedHabit) {
        // Edit existing habit
        const updates = {
          name: habitData.title,
          description: habitData.notes || selectedHabit.description,
          frequency: habitData.frequency.type,
          reminderTime: habitData.reminders.enabled
            ? habitData.reminders.time
            : null,
          showOnDashboard: habitData.showOnDashboard,
        };

        console.log("Updating habit with ID:", selectedHabit.id, updates);
        await updateHabit(selectedHabit.id, updates);
      } else {
        // Create new habit
        const newHabit = {
          name: habitData.title,
          description: habitData.notes || "New habit",
          frequency: habitData.frequency.type,
          category: "prayer",
          type: "prayer",
          streak: 0,
          completedToday: false,
          lastCompleted: null,
          progress: 0,
          completionHistory: [],
          showOnDashboard: habitData.showOnDashboard,
          reminderTime: habitData.reminders.enabled
            ? habitData.reminders.time
            : null,
          createdAt: new Date().toISOString().split("T")[0],
        };

        console.log("Adding new habit:", newHabit);
        await addHabit(newHabit);
      }
      console.log("Habit saved successfully");
      setCurrentView(HabitsView.LIST);
      setSelectedHabit(null);
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Error", "Failed to save habit. Please try again.");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case HabitsView.DETAIL:
        return (
          <HabitDetail
            habit={selectedHabit}
            onEdit={handleEditHabit}
            onDelete={handleDeleteHabit}
            onComplete={handleCompleteHabit}
          />
        );
      case HabitsView.FORM:
        return (
          <HabitForm
            initialData={
              selectedHabit
                ? {
                    id: selectedHabit.id,
                    title: selectedHabit.name,

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
                selectedHabit ? HabitsView.DETAIL : HabitsView.LIST,
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
                setCurrentView(HabitsView.FORM);
              }}
              className="bg-primary-600 py-4 rounded-xl items-center mt-4 mx-4 mb-4 flex-row justify-center"
            >
              <Plus size={20} color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">Add New Habit</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          title: "Spiritual Habits",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/* Header */}
      <View className="bg-white p-5 border-b border-secondary-300 shadow-sm">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-semibold text-neutral-800">
            {currentView === HabitsView.LIST
              ? "Spiritual Habits"
              : currentView === HabitsView.DETAIL
                ? "Habit Details"
                : selectedHabit
                  ? "Edit Habit"
                  : "Create Habit"}
          </Text>
          {currentView === HabitsView.LIST && (
            <TouchableOpacity
              onPress={() => {
                setSelectedHabit(null);
                setCurrentView(HabitsView.FORM);
              }}
              className="bg-primary-600 p-3 rounded-full shadow-sm"
            >
              <Plus size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {currentView !== HabitsView.LIST && (
            <TouchableOpacity
              onPress={() => {
                if (currentView === HabitsView.DETAIL) {
                  setCurrentView(HabitsView.LIST);
                  setSelectedHabit(null);
                } else if (currentView === HabitsView.FORM && selectedHabit) {
                  setCurrentView(HabitsView.DETAIL);
                } else {
                  setCurrentView(HabitsView.LIST);
                  setSelectedHabit(null);
                }
              }}
              className="bg-secondary-200 p-3 rounded-full shadow-sm"
            >
              <Text className="text-neutral-700 font-medium">Back</Text>
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
            <Text className="mt-4 text-gray-600">Loading your habits...</Text>
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/habits" />
    </SafeAreaView>
  );
}
