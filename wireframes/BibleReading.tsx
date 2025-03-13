import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  ChevronDown,
  Plus,
  Minus,
  CheckCircle,
} from "lucide-react-native";

export default function BibleReadingWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 border-b border-gray-200">
        <Text className="text-xl font-bold text-center text-indigo-800">
          Bible Reading
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Reading Progress */}
        <View className="bg-white p-6 rounded-xl shadow-sm w-full mb-4">
          <Text className="text-xl font-semibold text-neutral-800 mb-5">
            Bible Reading Progress
          </Text>

          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-neutral-700 text-sm">Progress</Text>
              <Text className="text-indigo-600 font-bold">35%</Text>
            </View>
            <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "35%" }}
              />
            </View>
          </View>

          <View className="bg-indigo-50 p-4 rounded-xl flex-row items-center mb-5">
            <TrendingUp size={18} color="#7E57C2" />
            <Text className="ml-2 text-indigo-700 font-medium">
              85% completion rate
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center bg-gray-100 p-4 rounded-xl flex-1 mr-3">
              <View className="flex-row items-center mb-1">
                <BookOpen size={16} color="#7E57C2" />
                <Text className="ml-1 text-neutral-600 text-xs">Chapters</Text>
              </View>
              <Text className="text-lg font-bold text-neutral-800">
                416/1189
              </Text>
            </View>

            <View className="items-center bg-gray-100 p-4 rounded-xl flex-1">
              <View className="flex-row items-center mb-1">
                <TrendingUp size={16} color="#7E57C2" />
                <Text className="ml-1 text-neutral-600 text-xs">Streak</Text>
              </View>
              <Text className="text-lg font-bold text-neutral-800">7 days</Text>
            </View>
          </View>
        </View>

        {/* Reading Settings */}
        <View className="bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Reading Settings
          </Text>

          <Text className="text-base font-medium text-gray-700 mb-2">
            Tracking Method
          </Text>
          <View className="flex-row flex-wrap mb-4">
            <View className="mr-2 mb-2 px-4 py-2 rounded-lg h-10 items-center justify-center bg-indigo-600">
              <Text className="text-white">By Chapter</Text>
            </View>
            <View className="mr-2 mb-2 px-4 py-2 rounded-lg h-10 items-center justify-center bg-gray-200">
              <Text className="text-gray-700">By Page</Text>
            </View>
            <View className="mr-2 mb-2 px-4 py-2 rounded-lg h-10 items-center justify-center bg-gray-200">
              <Text className="text-gray-700">By Chapter & Verse</Text>
            </View>
            <View className="px-4 py-2 rounded-lg h-10 items-center justify-center bg-gray-200">
              <Text className="text-gray-700">By Timer</Text>
            </View>
          </View>

          <Text className="text-base font-medium text-gray-700 mb-2">
            Current Reading
          </Text>
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-700 mr-2 w-24">Book:</Text>
              <View className="flex-1 border border-gray-300 rounded-md p-2 bg-white flex-row justify-between items-center">
                <Text className="text-gray-700">Matthew</Text>
                <ChevronDown size={16} color="#6B7280" />
              </View>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-700 mr-2 w-24">Start Chapter:</Text>
              <View className="flex-1 border border-gray-300 rounded-md p-2 bg-white flex-row justify-between items-center">
                <Text className="text-gray-700">5</Text>
                <ChevronDown size={16} color="#6B7280" />
              </View>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-700 mr-2 w-24">Chapters:</Text>
              <View className="flex-row items-center flex-1">
                <TouchableOpacity className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center">
                  <Minus size={20} color="#4b5563" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-medium">1</Text>
                <TouchableOpacity className="bg-indigo-500 w-10 h-10 rounded-full items-center justify-center">
                  <Plus size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-gray-600 text-sm mt-1">
              Reading: Matthew 5
            </Text>
          </View>

          <View className="py-4 rounded-xl flex-row justify-center items-center bg-indigo-600">
            <CheckCircle size={20} color="#ffffff" />
            <Text className="ml-2 font-medium text-white text-lg">
              Mark as Complete
            </Text>
          </View>
        </View>

        {/* Reading History */}
        <View className="mt-6 bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Reading History
          </Text>

          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <View className="flex-row mb-4">
              <TouchableOpacity className="flex-1 py-2 mr-1 rounded-md bg-indigo-600">
                <Text className="text-center text-white font-medium">Week</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-2 mx-1 rounded-md bg-gray-200">
                <Text className="text-center text-gray-700 font-medium">
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-2 ml-1 rounded-md bg-gray-200">
                <Text className="text-center text-gray-700 font-medium">
                  Year
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500 text-xs">Mon</Text>
                <Text className="text-gray-500 text-xs">Tue</Text>
                <Text className="text-gray-500 text-xs">Wed</Text>
                <Text className="text-gray-500 text-xs">Thu</Text>
                <Text className="text-gray-500 text-xs">Fri</Text>
                <Text className="text-gray-500 text-xs">Sat</Text>
                <Text className="text-gray-500 text-xs">Sun</Text>
              </View>

              <View className="flex-row justify-between mb-2">
                {[true, true, false, true, true, true, true].map(
                  (completed, index) => (
                    <View
                      key={index}
                      className={`w-10 h-10 rounded-lg items-center justify-center ${completed ? "bg-green-500" : "bg-gray-100"}`}
                    />
                  ),
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white flex-row justify-around items-center h-16 border-t border-gray-200">
        <View className="items-center">
          <BookOpen size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Home</Text>
        </View>
        <View className="items-center">
          <View className="p-1 rounded-full bg-indigo-100">
            <BookOpen size={24} color="#7E57C2" />
          </View>
          <Text className="text-xs text-indigo-800">Bible</Text>
        </View>
        <View className="items-center">
          <Calendar size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Habits</Text>
        </View>
        <View className="items-center">
          <Flag size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Goals</Text>
        </View>
        <View className="items-center">
          <Settings size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Settings</Text>
        </View>
      </View>
    </View>
  );
}

function Settings(props) {
  return <View {...props} />;
}

function Flag(props) {
  return <View {...props} />;
}
