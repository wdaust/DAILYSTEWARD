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
import { useAuth } from "../lib/auth";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [readingCompleted, setReadingCompleted] = useState(false);
  const [showJournalInput, setShowJournalInput] = useState(false);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");

  // Fetch user-specific data
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: readingHistory, isLoading: readingHistoryLoading } =
    useReadingHistory();
  const { data: ministryStats, isLoading: ministryStatsLoading } =
    useMinistryStats();

  // Calculate weekly and monthly ministry statistics from user data
  const calculateMinistryStats = () => {
    if (!ministryStats || ministryStats.length === 0) {
      return {
        weekly: { hours: 0, placements: 0, returnVisits: 0 },
        monthly: { hours: 0, placements: 0, returnVisits: 0 },
      };
    }

    const weekly = ministryStats
      .filter((stat) => stat.type === "weekly")
      .reduce(
        (acc, stat) => {
          return {
            hours: acc.hours + stat.hours,
            placements: acc.placements + stat.placements,
            returnVisits: acc.returnVisits + stat.returnVisits,
          };
        },
        { hours: 0, placements: 0, returnVisits: 0 },
      );

    const monthly = ministryStats
      .filter((stat) => stat.type === "monthly")
      .reduce(
        (acc, stat) => {
          return {
            hours: acc.hours + stat.hours,
            placements: acc.placements + stat.placements,
            returnVisits: acc.returnVisits + stat.returnVisits,
          };
        },
        { hours: 0, placements: 0, returnVisits: 0 },
      );

    return { weekly, monthly };
  };

  const { weekly: weeklyStats, monthly: monthlyStats } =
    calculateMinistryStats();

  // Check if any data is still loading
  const isLoading =
    habitsLoading ||
    goalsLoading ||
    readingHistoryLoading ||
    ministryStatsLoading;

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
    let currentDate = new Date(today);

    for (let i = 0; i < sortedHistory.length; i++) {
      const historyDate = new Date(sortedHistory[i].date);
      const timeDiff = Math.abs(currentDate.getTime() - historyDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (diffDays === 1 && sortedHistory[i].completed) {
        streak++;
        currentDate = historyDate;
      } else {
        break;
      }
    }

    // Calculate completion rate
    const completedDays = sortedHistory.filter((day) => day.completed).length;
    const completionRate =
      sortedHistory.length > 0
        ? Math.round((completedDays / sortedHistory.length) * 100)
        : 0;

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
  const handleMarkReadingComplete = (method: string, value: any) => {
    setReadingCompleted(true);
    console.log(`Marked ${method} reading complete: ${value}`);
    // In a real app, this would update the database
  };

  // Handle navigation to Bible reading details
  const handleViewReadingDetails = () => {
    router.push("/bible-reading");
  };

  // Handle habit toggle
  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
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
          <BibleReadingCard
            key="bible-reading"
            progress={
              Array.isArray(readingHistory) && readingHistory.length > 0
                ? readingHistory.filter((day) => day.completed).length / 1189
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
        );
      case "habits":
        return (
          <View
            key="habits"
            className="bg-white p-4 rounded-xl shadow-sm w-full"
          >
            <View className="flex-row items-center mb-4">
              <Target size={20} color="#7E57C2" className="mr-2" />
              <Text className="text-xl font-bold text-gray-800">
                Quick Habits
              </Text>
            </View>

            {habits.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-center">
                  No habits to display on dashboard.
                </Text>
              </View>
            ) : (
              habits
                .filter((habit) => habit.showOnDashboard)
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
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <BookText size={20} color="#7E57C2" className="mr-2" />
                <Text className="text-xl font-bold text-gray-800">Journal</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/journal")}>
                <Text className="text-primary-600 text-sm">View All</Text>
              </TouchableOpacity>
            </View>

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
          </View>
        );
      case "ministry-stats":
        return (
          <MinistryStats
            key="ministry-stats"
            weeklyStats={weeklyStats}
            monthlyStats={monthlyStats}
            onViewDetailedStats={() => console.log("View detailed stats")}
          />
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
