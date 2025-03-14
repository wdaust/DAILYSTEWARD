import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  ChevronRight,
} from "lucide-react-native";

interface ReadingProgressProps {
  progress?: number;
  daysCompleted?: number;
  currentStreak?: number;
  totalChapters?: number;
  chaptersRead?: number;
  startDate?: string;
  completionRate?: number;
  completedChapters?: string[];
  completedVerses?: string[];
  completedPages?: number[];
  totalPages?: number;
  onShowProgressDetails?: () => void;
  onUpdateTotalPages?: (pages: number) => void;
}

const ReadingProgress = ({
  progress = 0,
  daysCompleted = 0,
  currentStreak = 0,
  totalChapters = 1189,
  chaptersRead = 0,
  startDate = new Date().toISOString().split("T")[0],
  completionRate = 0,
  completedChapters = [],
  completedVerses = [],
  completedPages = [],
  totalPages = 0,
  onShowProgressDetails = () => {}, // This will now navigate to the BibleReadingTracker view
  onUpdateTotalPages = () => {},
}: ReadingProgressProps) => {
  console.log("ReadingProgress props:", {
    progress,
    daysCompleted,
    currentStreak,
    chaptersRead,
    completionRate,
  });
  // Calculate percentage for display
  // Ensure we show at least 1% progress if there's at least one day completed
  const progressPercentage =
    daysCompleted > 0 ? Math.max(1, Math.round(progress * 100)) : 0;

  // Calculate chapters read for display
  const actualChaptersRead =
    completedChapters && Array.isArray(completedChapters)
      ? completedChapters.length
      : chaptersRead;

  return (
    <View className="bg-white p-6 rounded-2xl shadow-card w-full mb-4">
      <Text className="text-xl font-semibold text-neutral-800 mb-5">
        Bible Reading Progress
      </Text>

      {/* Progress Bar */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-neutral-700 text-sm">Progress</Text>
          <Text className="text-primary-600 font-bold">
            {progressPercentage}%
          </Text>
        </View>
        <View className="h-3 w-full bg-secondary-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-600 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>

      {/* Monthly Completion Rate Card */}
      <View className="bg-primary-50 p-4 rounded-xl flex-row items-center mb-5">
        <TrendingUp size={18} color="#7E57C2" />
        <Text className="ml-2 text-primary-700 font-medium">
          {completionRate}% completion rate
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row justify-between">
        <View className="items-center bg-secondary-100 p-4 rounded-xl flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <BookOpen size={16} color="#7E57C2" />
            <Text className="ml-1 text-neutral-600 text-xs">Chapters</Text>
          </View>
          <Text className="text-lg font-bold text-neutral-800">
            {actualChaptersRead}/{totalChapters}
          </Text>
        </View>

        <View className="items-center bg-secondary-100 p-4 rounded-xl flex-1">
          <View className="flex-row items-center mb-1">
            <TrendingUp size={16} color="#7E57C2" />
            <Text className="ml-1 text-neutral-600 text-xs">Streak</Text>
          </View>
          <Text className="text-lg font-bold text-neutral-800">
            {currentStreak} days
          </Text>
        </View>
      </View>

      {/* Detailed Progress Button */}
      <TouchableOpacity
        className="mt-4 bg-primary-50 p-3 rounded-xl flex-row justify-between items-center"
        onPress={onShowProgressDetails}
      >
        <View className="flex-row items-center">
          <BookOpen size={18} color="#7E57C2" />
          <Text className="ml-2 text-primary-700 font-medium">
            View Detailed Progress
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-primary-600 mr-1">
            {completedChapters.length} chapters, {completedVerses.length} verses
          </Text>
          <ChevronRight size={16} color="#7E57C2" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReadingProgress;
