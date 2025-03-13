import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  BookOpen,
  Target,
  Flag,
  BookText,
  BarChart2,
  Settings,
} from "lucide-react-native";

export default function DashboardWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 border-b border-gray-200">
        <Text className="text-2xl font-bold text-center text-indigo-800">
          JW Companion
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Bible Reading Card */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <BookOpen size={22} color="#7E57C2" />
              <Text className="text-xl font-semibold ml-2 text-neutral-800">
                Bible Reading
              </Text>
            </View>
          </View>

          <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: "35%" }}
            />
          </View>

          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">Progress</Text>
            <Text className="text-xs font-medium text-indigo-600">35%</Text>
          </View>

          <TouchableOpacity className="bg-indigo-600 py-3 rounded-lg items-center mt-3">
            <Text className="text-white font-medium">
              Mark Today's Reading Complete
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Habits */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row items-center mb-4">
            <Target size={20} color="#7E57C2" className="mr-2" />
            <Text className="text-xl font-bold text-gray-800">
              Quick Habits
            </Text>
          </View>

          <View className="flex-row items-center p-3 mb-3 bg-gray-50 rounded-lg border border-gray-100">
            <View className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Daily Prayer</Text>
              <Text className="text-xs text-gray-500">
                Start each day with prayer
              </Text>
            </View>
          </View>

          <View className="flex-row items-center p-3 mb-3 bg-gray-50 rounded-lg border border-gray-100">
            <View className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">
                Meeting Preparation
              </Text>
              <Text className="text-xs text-gray-500">
                Prepare for meetings
              </Text>
            </View>
          </View>
        </View>

        {/* Spiritual Goals */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row items-center mb-4">
            <Flag size={20} color="#7E57C2" className="mr-2" />
            <Text className="text-xl font-bold text-gray-800">
              Spiritual Goals
            </Text>
          </View>

          <View className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <Text className="font-semibold text-gray-800">
              Read Bible in One Year
            </Text>
            <Text className="text-xs text-gray-500 mb-2">
              Complete reading the entire Bible
            </Text>
            <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
              <View
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "35%" }}
              />
            </View>
            <Text className="text-xs text-indigo-600 font-medium text-right">
              35% complete
            </Text>
          </View>
        </View>

        {/* Journal */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <BookText size={20} color="#7E57C2" className="mr-2" />
              <Text className="text-xl font-bold text-gray-800">Journal</Text>
            </View>
          </View>

          <TouchableOpacity className="flex-row items-center justify-center py-3 bg-indigo-50 rounded-lg">
            <Text className="ml-2 text-indigo-700 font-medium">
              Create New Entry
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ministry Stats */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row items-center mb-4">
            <BarChart2 size={20} color="#7E57C2" className="mr-2" />
            <Text className="text-xl font-bold text-gray-800">
              Ministry Stats
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <View className="items-center bg-indigo-50 p-3 rounded-lg flex-1 mr-2">
              <Text className="text-xs text-gray-600">Hours</Text>
              <Text className="text-xl font-bold text-indigo-600">8</Text>
            </View>
            <View className="items-center bg-indigo-50 p-3 rounded-lg flex-1 mx-1">
              <Text className="text-xs text-gray-600">Placements</Text>
              <Text className="text-xl font-bold text-indigo-600">12</Text>
            </View>
            <View className="items-center bg-indigo-50 p-3 rounded-lg flex-1 ml-2">
              <Text className="text-xs text-gray-600">Return Visits</Text>
              <Text className="text-xl font-bold text-indigo-600">5</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white flex-row justify-around items-center h-16 border-t border-gray-200">
        <View className="items-center">
          <View className="p-1 rounded-full bg-indigo-100">
            <BookOpen size={24} color="#7E57C2" />
          </View>
          <Text className="text-xs text-indigo-800">Home</Text>
        </View>
        <View className="items-center">
          <BookOpen size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Bible</Text>
        </View>
        <View className="items-center">
          <Target size={24} color="#9CA3AF" />
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
