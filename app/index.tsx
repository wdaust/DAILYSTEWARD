import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Plus,
  Check,
  PenSquare,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  TrendingUp,
  Flag,
  ChevronDown,
  BookOpen,
  BookText,
  Calendar,
} from "lucide-react-native";
import Header from "../components/Header";
import MinistryStats from "../components/MinistryStats";
import BibleReadingCard from "../components/BibleReadingCard";
import BottomNavigation from "../components/BottomNavigation";
import { useRouter } from "expo-router";
import { useHabits } from "../lib/hooks/useHabits";
import { useGoals } from "../lib/hooks/useGoals";
import { useReadingHistory } from "../lib/hooks/useReadingHistory";
import { useMinistryStats } from "../lib/hooks/useMinistryStats";
import { useJournalEntries } from "../lib/hooks/useJournalEntries";
import { useAuth } from "../lib/auth";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [readingCompleted, setReadingCompleted] = useState(false);
  const [showJournalInput, setShowJournalInput] = useState(false);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");

  // Fetch user-specific data
  const {
    data: habits,
    isLoading: habitsLoading,
    updateData: updateHabit,
  } = useHabits();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: readingHistory, isLoading: readingHistoryLoading } =
    useReadingHistory();
  const { data: ministryStats, isLoading: ministryStatsLoading } =
    useMinistryStats();
  const { data: journalEntries, isLoading: journalEntriesLoading } =
    useJournalEntries();

  // Calculate weekly and monthly ministry statistics from user data
  const calculateMinistryStats = () => {
    if (!ministryStats || ministryStats.length === 0) {
      return {
        weekly: { hours: 0, placements: 0, returnVisits: 0 },
        monthly: { hours: 0, placements: 0, returnVisits: 0 },
      };
    }

    // Find the weekly stats
    const weeklyEntry = ministryStats.find((stat) => stat.type === "weekly");
    const weekly = weeklyEntry
      ? {
          hours: weeklyEntry.hours,
          placements: weeklyEntry.placements || 0,
          returnVisits: weeklyEntry.returnVisits || 0,
        }
      : { hours: 0, placements: 0, returnVisits: 0 };

    // Find the monthly stats
    const monthlyEntry = ministryStats.find((stat) => stat.type === "monthly");
    const monthly = monthlyEntry
      ? {
          hours: monthlyEntry.hours,
          placements: monthlyEntry.placements || 0,
          returnVisits: monthlyEntry.returnVisits || 0,
        }
      : { hours: 0, placements: 0, returnVisits: 0 };

    return { weekly, monthly };
  };

  const { weekly: weeklyStats, monthly: monthlyStats } =
    calculateMinistryStats();

  // Check if any data is still loading
  const isLoading =
    habitsLoading ||
    goalsLoading ||
    readingHistoryLoading ||
    ministryStatsLoading ||
    journalEntriesLoading;

  // Card order state
  const [cardOrder, setCardOrder] = useState([
    "bible-reading",
    "habits",
    "goals",
    "journal",
    "ministry-stats",
  ]);

  // Collapsed state for cards
  const [collapsedCards, setCollapsedCards] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle card collapsed state
  const toggleCardCollapse = (cardId: string) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // State for Bible reading tracking
  const [trackingMethod, setTrackingMethod] = useState<
    "chapter" | "page" | "verse" | "timer"
  >("chapter");

  // Calculate reading streak and completion rate from user data
  const calculateReadingStats = () => {
    if (
      !readingHistory ||
      !Array.isArray(readingHistory) ||
      readingHistory.length === 0 ||
      readingHistoryLoading
    ) {
      return { streak: 0, completionRate: 0 };
    }

    // Sort reading history by date (newest first)
    const sortedHistory = [...readingHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Calculate streak (consecutive days with completed readings)
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];

    // Check if today is already completed
    const todayCompleted = sortedHistory.some(
      (day) => day.date === today && day.completed,
    );

    // Start with today if it's completed
    let currentDate = new Date(today);
    if (todayCompleted) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1); // Move to yesterday for checking streak
    }

    // Check previous days for streak
    for (let i = 0; i < sortedHistory.length; i++) {
      // Skip today's entry since we already counted it
      if (sortedHistory[i].date === today) continue;

      const historyDate = new Date(sortedHistory[i].date);
      const timeDiff = Math.abs(currentDate.getTime() - historyDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (diffDays === 0 && sortedHistory[i].completed) {
        // Check if it's the expected next day
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // Move to the next previous day
      } else {
        // Break if we find a gap in the streak
        break;
      }
    }

    // Calculate completion rate
    const completedDays = sortedHistory.filter((day) => day.completed).length;
    const completionRate =
      sortedHistory.length > 0
        ? Math.round((completedDays / sortedHistory.length) * 100)
        : 0;

    console.log("Reading stats calculated:", {
      streak,
      completionRate,
      completedDays,
      totalDays: sortedHistory.length,
    });
    return { streak, completionRate };
  };

  // Initialize state variables for reading stats
  const [readingStreak, setReadingStreak] = useState(0);
  const [readingCompletionRate, setReadingCompletionRate] = useState(0);

  // Update stats when reading history changes
  useEffect(() => {
    if (!readingHistoryLoading && Array.isArray(readingHistory)) {
      const stats = calculateReadingStats();
      setReadingStreak(stats.streak);
      setReadingCompletionRate(stats.completionRate);
    }
  }, [readingHistory, readingHistoryLoading]);

  // Handle marking Bible reading as complete
  const handleMarkReadingComplete = async (method: string, value: any) => {
    try {
      setReadingCompleted(true);
      console.log(`Marked ${method} reading complete: ${value}`);

      // Actually update the database
      const today = new Date().toISOString().split("T")[0];
      const todayReading = readingHistory?.find(
        (entry) => entry.date === today,
      );

      let result;
      if (todayReading) {
        // Update existing entry
        console.log(
          "Updating existing reading entry with ID:",
          todayReading.id,
        );
        result = await updateReadingHistory(todayReading.id, {
          completed: true,
          content: value,
          method: method,
        });
        console.log("Update result:", result);
      } else {
        // Add new entry
        console.log("Adding new reading entry for today");
        result = await addReadingHistory({
          date: today,
          completed: true,
          content: value,
          method: method,
        });
        console.log("Add result:", result);
      }

      // Force recalculation of stats
      const stats = calculateReadingStats();
      setReadingStreak(stats.streak);
      setReadingCompletionRate(stats.completionRate);

      // Update local state to reflect the new entry
      if (readingHistory) {
        if (todayReading) {
          // Update existing entry in local state
          const updatedHistory = readingHistory.map((entry) =>
            entry.date === today
              ? { ...entry, completed: true, content: value, method: method }
              : entry,
          );
          // This forces a re-render with updated data
          setReadingHistory(updatedHistory);
        } else {
          // Add new entry to local state
          const newEntry = {
            id: result?.data?.[0]?.id || `temp-${Date.now()}`,
            date: today,
            completed: true,
            content: value,
            method: method,
          };
          setReadingHistory([...readingHistory, newEntry]);
        }
      }

      // Navigate to the Bible reading page to show updated stats
      router.push("/bible-reading");
    } catch (error) {
      console.error("Error marking reading as complete:", error);
    }
  };

  // Handle navigation to Bible reading details
  const handleViewReadingDetails = () => {
    router.push("/bible-reading");
  };

  // Handle habit toggle
  const toggleHabit = async (id) => {
    // Find the habit to update
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    // Calculate new streak value
    const newStreak = habit.completedToday
      ? Math.max(0, habit.streak - 1)
      : habit.streak + 1;
    const today = new Date().toISOString().split("T")[0];

    // Create updated habit object
    const updatedHabit = {
      ...habit,
      completedToday: !habit.completedToday,
      streak: newStreak,
      lastCompleted: !habit.completedToday ? today : habit.lastCompleted,
    };

    // Update the habit in the database with completedToday toggled and streak updated
    await updateHabit(id, {
      completedToday: !habit.completedToday,
      streak: newStreak,
      lastCompleted: !habit.completedToday ? today : habit.lastCompleted,
    });
  };

  // Handle journal entry creation
  const handleCreateJournalEntry = () => {
    if (journalTitle.trim() && journalContent.trim()) {
      // In a real app, this would save the entry to state/database
      console.log("Journal entry created:", { journalTitle, journalContent });
      setJournalTitle("");
      setJournalContent("");
      setShowJournalInput(false);
      // Navigate to journal page
      router.push("/journal");
    }
  };

  // Handle card reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(cardOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCardOrder(items);
  };

  // Render cards based on order
  const renderCard = (cardId) => {
    switch (cardId) {
      case "bible-reading":
        return (
          <View
            key="bible-reading"
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <TouchableOpacity
              className="flex-row justify-between items-center mb-3"
              onPress={() => toggleCardCollapse("bible-reading")}
            >
              <View className="flex-row items-center">
                <BookOpen size={20} color="#7E57C2" className="mr-2" />
                <Text className="text-xl font-bold text-gray-800">
                  Bible Reading
                </Text>
              </View>
              {collapsedCards["bible-reading"] ? (
                <ChevronRight size={20} color="#7E57C2" />
              ) : (
                <ChevronDown size={20} color="#7E57C2" />
              )}
            </TouchableOpacity>

            {!collapsedCards["bible-reading"] && (
              <BibleReadingCard
                progress={
                  Array.isArray(readingHistory) && readingHistory.length > 0
                    ? readingHistory.filter((day) => day.completed).length /
                      1189
                    : 0
                }
                currentReading={
                  Array.isArray(readingHistory) && readingHistory.length > 0
                    ? readingHistory[0]?.content || ""
                    : ""
                }
                isCompleted={readingCompleted}
                streak={readingStreak}
                completionRate={readingCompletionRate}
                trackingMethod={trackingMethod}
                onMarkComplete={handleMarkReadingComplete}
                onViewDetails={handleViewReadingDetails}
                onChangeTrackingMethod={setTrackingMethod}
              />
            )}
          </View>
        );
      case "habits":
        return (
          <View
            key="habits"
            className="bg-white p-4 rounded-xl shadow-sm w-full"
          >
            <TouchableOpacity
              className="flex-row justify-between items-center mb-3"
              onPress={() => toggleCardCollapse("habits")}
            >
              <View className="flex-row items-center">
                <Target size={20} color="#7E57C2" className="mr-2" />
                <Text className="text-xl font-bold text-gray-800">
                  Quick Habits
                </Text>
              </View>
              {collapsedCards["habits"] ? (
                <ChevronRight size={20} color="#7E57C2" />
              ) : (
                <ChevronDown size={20} color="#7E57C2" />
              )}
            </TouchableOpacity>

            {!collapsedCards["habits"] && (
              <>
                {!habits || habits.length === 0 ? (
                  <View className="py-8 items-center">
                    <Text className="text-gray-500 text-center">
                      No habits to display on dashboard.
                    </Text>
                  </View>
                ) : (
                  habits
                    .filter((habit) => habit && habit.showOnDashboard !== false)
                    .map((habit) => (
                      <TouchableOpacity
                        key={habit.id}
                        className="flex-row items-center p-3 mb-3 bg-gray-50 rounded-lg border border-gray-100"
                        onPress={() => toggleHabit(habit.id)}
                      >
                        <TouchableOpacity
                          onPress={() => toggleHabit(habit.id)}
                          className="mr-3"
                        >
                          {habit.completedToday ? (
                            <CheckCircle2 size={24} color="#7E57C2" />
                          ) : (
                            <Circle size={24} color="#D1D5DB" />
                          )}
                        </TouchableOpacity>

                        <View className="flex-1">
                          <View className="flex-row items-center justify-between">
                            <Text className="font-semibold text-gray-800">
                              {habit.name}
                            </Text>
                            <View className="flex-row items-center">
                              <View className="flex-row items-center mr-2">
                                <Clock size={16} color="#7E57C2" />
                                <Text className="text-xs text-gray-500 ml-1 capitalize">
                                  {habit.frequency}
                                </Text>
                              </View>
                              <ChevronRight size={16} color="#7E57C2" />
                            </View>
                          </View>

                          <Text className="text-xs text-gray-500 mb-2">
                            {habit.description}
                          </Text>

                          <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                            <View
                              className={`h-full ${habit.completedToday ? "bg-primary-600" : "bg-primary-400"}`}
                              style={{ width: `${habit.progress * 100}%` }}
                            />
                          </View>

                          <View className="flex-row justify-between">
                            <View className="flex-row items-center">
                              <TrendingUp size={14} color="#7E57C2" />
                              <Text className="text-xs text-primary-600 ml-1">
                                {habit.streak} day streak
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                )}

                <TouchableOpacity
                  className="mt-2 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg"
                  onPress={() => router.push("/habits")}
                >
                  <Text className="text-primary-600 font-medium">
                    View All Habits
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      case "goals":
        return (
          <View key="goals" className="bg-white p-4 rounded-xl shadow-sm">
            <TouchableOpacity
              className="flex-row justify-between items-center mb-3"
              onPress={() => toggleCardCollapse("goals")}
            >
              <View className="flex-row items-center">
                <Flag size={20} color="#7E57C2" className="mr-2" />
                <Text className="text-xl font-bold text-gray-800">
                  Spiritual Goals
                </Text>
              </View>
              {collapsedCards["goals"] ? (
                <ChevronRight size={20} color="#7E57C2" />
              ) : (
                <ChevronDown size={20} color="#7E57C2" />
              )}
            </TouchableOpacity>

            {!collapsedCards["goals"] && (
              <>
                {goals.length === 0 ? (
                  <View className="py-8 items-center">
                    <Text className="text-gray-500 text-center">
                      No goals to display. Add a goal to get started.
                    </Text>
                  </View>
                ) : (
                  goals.map((goal) => (
                    <View
                      key={goal.id}
                      className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-semibold text-gray-800">
                          {goal.title}
                        </Text>
                        <View
                          className={`px-2 py-1 rounded-full ${
                            goal.category === "spiritual"
                              ? "bg-primary-100"
                              : goal.category === "ministry"
                                ? "bg-green-100"
                                : goal.category === "personal"
                                  ? "bg-purple-100"
                                  : goal.category === "family"
                                    ? "bg-orange-100"
                                    : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              goal.category === "spiritual"
                                ? "text-primary-700"
                                : goal.category === "ministry"
                                  ? "text-green-700"
                                  : goal.category === "personal"
                                    ? "text-purple-700"
                                    : goal.category === "family"
                                      ? "text-orange-700"
                                      : "text-gray-700"
                            }`}
                          >
                            {goal.category.charAt(0).toUpperCase() +
                              goal.category.slice(1)}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-xs text-gray-500 mb-2">
                        {goal.description}
                      </Text>

                      <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                        <View
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${goal.progress * 100}%` }}
                        />
                      </View>

                      <View className="flex-row justify-between">
                        <Text className="text-xs text-gray-500">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </Text>
                        <Text className="text-xs text-primary-600 font-medium">
                          {Math.round(goal.progress * 100)}% complete
                        </Text>
                      </View>
                    </View>
                  ))
                )}

                <TouchableOpacity
                  className="mt-2 flex-row items-center justify-center py-2 bg-gray-100 rounded-lg"
                  onPress={() => router.push("/goals")}
                >
                  <Text className="text-primary-600 font-medium">
                    View All Goals
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      case "journal":
        return (
          <View key="journal" className="bg-white p-4 rounded-xl shadow-sm">
            <TouchableOpacity
              className="flex-row justify-between items-center mb-3"
              onPress={() => toggleCardCollapse("journal")}
            >
              <View className="flex-row items-center">
                <BookText size={20} color="#7E57C2" className="mr-2" />
                <Text className="text-xl font-bold text-gray-800">Journal</Text>
              </View>
              {collapsedCards["journal"] ? (
                <ChevronRight size={20} color="#7E57C2" />
              ) : (
                <ChevronDown size={20} color="#7E57C2" />
              )}
            </TouchableOpacity>

            {!collapsedCards["journal"] && (
              <>
                <TouchableOpacity
                  className="flex-row justify-end mb-3"
                  onPress={() => router.push("/journal")}
                >
                  <Text className="text-primary-600 text-sm">View All</Text>
                </TouchableOpacity>

                {journalEntries && journalEntries.length > 0 ? (
                  <View className="mb-3">
                    {journalEntries
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .slice(0, 3)
                      .map((entry) => (
                        <TouchableOpacity
                          key={entry.id}
                          className="p-3 mb-2 bg-gray-50 rounded-lg border border-gray-100"
                          onPress={() => router.push(`/journal?id=${entry.id}`)}
                        >
                          <View className="flex-row justify-between items-center mb-1">
                            <Text className="font-semibold text-gray-800">
                              {entry.title}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text
                            className="text-sm text-gray-600"
                            numberOfLines={2}
                          >
                            {entry.preview || entry.content.substring(0, 100)}
                          </Text>
                          {entry.scriptures && entry.scriptures.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                              {entry.scriptures
                                .slice(0, 2)
                                .map((scripture, index) => (
                                  <View
                                    key={index}
                                    className="bg-primary-50 px-2 py-1 rounded-md mr-1 mb-1"
                                  >
                                    <Text className="text-xs text-primary-700">
                                      {scripture}
                                    </Text>
                                  </View>
                                ))}
                              {entry.scriptures.length > 2 && (
                                <View className="bg-gray-100 px-2 py-1 rounded-md">
                                  <Text className="text-xs text-gray-600">
                                    +{entry.scriptures.length - 2} more
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                  </View>
                ) : (
                  <View className="py-4 items-center mb-3 bg-gray-50 rounded-lg">
                    <Text className="text-gray-500 text-center">
                      No journal entries yet.
                    </Text>
                  </View>
                )}

                {showJournalInput ? (
                  <View>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2 mb-2 bg-gray-50"
                      placeholder="Entry title"
                      value={journalTitle}
                      onChangeText={setJournalTitle}
                    />
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2 mb-3 bg-gray-50"
                      placeholder="Your thoughts..."
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      value={journalContent}
                      onChangeText={setJournalContent}
                    />
                    <View className="flex-row justify-end">
                      <TouchableOpacity
                        className="bg-gray-200 px-3 py-2 rounded-lg mr-2"
                        onPress={() => setShowJournalInput(false)}
                      >
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-primary-600 px-3 py-2 rounded-lg"
                        onPress={handleCreateJournalEntry}
                      >
                        <Text className="text-white">Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="flex-row items-center justify-center py-3 bg-primary-50 rounded-lg"
                    onPress={() => router.push("/journal")}
                  >
                    <PenSquare size={18} color="#7E57C2" />
                    <Text className="ml-2 text-primary-700 font-medium">
                      Create New Entry
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        );
      case "ministry-stats":
        return (
          <View
            key="ministry-stats"
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <TouchableOpacity
              className="flex-row justify-between items-center mb-3"
              onPress={() => toggleCardCollapse("ministry-stats")}
            >
              <View className="flex-row items-center">
                <Calendar size={20} color="#7E57C2" className="mr-2" />
                <Text className="text-xl font-bold text-gray-800">
                  Ministry Stats
                </Text>
              </View>
              {collapsedCards["ministry-stats"] ? (
                <ChevronRight size={20} color="#7E57C2" />
              ) : (
                <ChevronDown size={20} color="#7E57C2" />
              )}
            </TouchableOpacity>

            {!collapsedCards["ministry-stats"] && (
              <MinistryStats
                weeklyStats={weeklyStats}
                monthlyStats={monthlyStats}
                onViewDetailedStats={() => console.log("View detailed stats")}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <StatusBar style="light" />

      {/* Header removed */}

      <ScrollView
        className="flex-1 px-5 pt-5 pb-20"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#7E57C2" />
            <Text className="mt-4 text-gray-600">
              Loading your dashboard...
            </Text>
          </View>
        ) : user ? (
          <View className="space-y-6">
            {cardOrder.map((cardId) => (
              <View key={cardId} className="mb-4">
                {renderCard(cardId)}
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Welcome to JW Companion
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Please sign in to see your personal data
            </Text>
            <TouchableOpacity
              className="bg-primary-600 px-6 py-3 rounded-lg"
              onPress={() => router.push("/login")}
            >
              <Text className="text-white font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/" />
    </SafeAreaView>
  );
}
