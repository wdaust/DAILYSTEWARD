import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  Target,
  ChevronRight,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  TrendingUp,
  Plus,
} from "lucide-react-native";

export default function HabitsWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-semibold text-neutral-800">
            Spiritual Habits
          </Text>
          <TouchableOpacity className="bg-indigo-600 p-3 rounded-full shadow-sm">
            <Plus size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-2xl p-6 shadow-card w-full">
          <Text className="text-xl font-semibold mb-5 text-neutral-800">
            My Spiritual Habits
          </Text>

          <TouchableOpacity className="flex-row items-center p-4 mb-4 bg-gray-100 rounded-xl shadow-sm">
            <TouchableOpacity className="mr-3">
              <CheckCircle size={24} color="#7E57C2" />
            </TouchableOpacity>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-neutral-800">
                  Daily Prayer
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-2">
                    <Clock size={16} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 capitalize font-medium">
                      Daily
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#7E57C2" />
                </View>
              </View>

              <Text className="text-xs text-neutral-500 mb-3">
                Start each day with a meaningful prayer
              </Text>

              <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-600"
                  style={{ width: "75%" }}
                />
              </View>

              <View className="flex-row justify-between mt-2">
                <View className="flex-row items-center">
                  <TrendingUp size={14} color="#7E57C2" />
                  <Text className="text-xs text-indigo-600 ml-1 font-medium">
                    7 day streak
                  </Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-indigo-100">
                  <Text className="text-xs text-indigo-700 font-medium">
                    Prayer
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 mb-4 bg-gray-100 rounded-xl shadow-sm">
            <TouchableOpacity className="mr-3">
              <Circle size={24} color="#D1D5DB" strokeWidth={1.5} />
            </TouchableOpacity>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-neutral-800">
                  Meeting Preparation
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-2">
                    <Calendar size={16} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 capitalize font-medium">
                      Weekly
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#7E57C2" />
                </View>
              </View>

              <Text className="text-xs text-neutral-500 mb-3">
                Prepare for weekly congregation meetings
              </Text>

              <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-400"
                  style={{ width: "30%" }}
                />
              </View>

              <View className="flex-row justify-between mt-2">
                <View className="flex-row items-center">
                  <TrendingUp size={14} color="#7E57C2" />
                  <Text className="text-xs text-indigo-600 ml-1 font-medium">
                    3 week streak
                  </Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-indigo-100">
                  <Text className="text-xs text-indigo-700 font-medium">
                    Study
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 mb-4 bg-gray-100 rounded-xl shadow-sm">
            <TouchableOpacity className="mr-3">
              <Circle size={24} color="#D1D5DB" strokeWidth={1.5} />
            </TouchableOpacity>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-neutral-800">
                  Family Worship
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-2">
                    <Calendar size={16} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 capitalize font-medium">
                      Weekly
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#7E57C2" />
                </View>
              </View>

              <Text className="text-xs text-neutral-500 mb-3">
                Conduct weekly family worship evening
              </Text>

              <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-400"
                  style={{ width: "50%" }}
                />
              </View>

              <View className="flex-row justify-between mt-2">
                <View className="flex-row items-center">
                  <TrendingUp size={14} color="#7E57C2" />
                  <Text className="text-xs text-indigo-600 ml-1 font-medium">
                    5 week streak
                  </Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-indigo-100">
                  <Text className="text-xs text-indigo-700 font-medium">
                    Study
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Habit Detail Preview */}
        <View className="mt-6 bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Habit Details
          </Text>

          <View className="flex-row justify-between mb-6">
            <View className="bg-indigo-50 p-4 rounded-lg flex-1 mr-2 items-center">
              <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mb-1">
                <TrendingUp size={18} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-indigo-600 mt-1">7</Text>
              <Text className="text-gray-600 text-sm">Day Streak</Text>
            </View>
            <View className="bg-indigo-50 p-4 rounded-lg flex-1 ml-2 items-center">
              <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mb-1">
                <CheckCircle size={18} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-indigo-600 mt-1">
                85%
              </Text>
              <Text className="text-gray-600 text-sm">Completion</Text>
            </View>
          </View>

          <View className="mb-6 bg-gray-50 p-4 rounded-lg">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-800 capitalize">Daily habit</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-800">Reminder at 07:00</Text>
            </View>
          </View>

          <TouchableOpacity className="p-4 rounded-lg mb-6 flex-row justify-center items-center bg-indigo-600">
            <CheckCircle size={20} color="#FFFFFF" />
            <Text className="ml-2 font-bold text-white">Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white flex-row justify-around items-center h-16 border-t border-gray-200">
        <View className="items-center">
          <Target size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Home</Text>
        </View>
        <View className="items-center">
          <Target size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Bible</Text>
        </View>
        <View className="items-center">
          <View className="p-1 rounded-full bg-indigo-100">
            <Target size={24} color="#7E57C2" />
          </View>
          <Text className="text-xs text-indigo-800">Habits</Text>
        </View>
        <View className="items-center">
          <Target size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Goals</Text>
        </View>
        <View className="items-center">
          <Target size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Settings</Text>
        </View>
      </View>
    </View>
  );
}
