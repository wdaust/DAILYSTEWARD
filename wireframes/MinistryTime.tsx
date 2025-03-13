import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  BarChart2,
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  X,
  Save,
  ChevronDown,
  Edit,
  Target,
  Filter,
} from "lucide-react-native";

export default function MinistryTimeWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 border-b border-gray-200">
        <Text className="text-xl font-bold text-center text-indigo-800">
          Ministry Time
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity className="flex-1 py-4 border-b-2 border-indigo-600">
          <Text className="text-center font-medium text-indigo-600">
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 py-4">
          <Text className="text-center font-medium text-gray-600">Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 py-4">
          <Text className="text-center font-medium text-gray-600">
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="space-y-6">
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Monthly Summary
            </Text>

            <View className="items-center mb-3">
              <Text className="text-3xl font-bold text-indigo-600">15</Text>
              <Text className="text-sm text-gray-600">Hours</Text>
            </View>

            {/* Monthly Progress Bar */}
            <View className="mb-2">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs text-gray-600">Hours Goal</Text>
                <Text className="text-xs text-indigo-600 font-medium">
                  15/30 hours
                </Text>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: "50%" }}
                />
              </View>
            </View>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Hours by Ministry Type
            </Text>

            <View className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-gray-700">Field Ministry</Text>
                <Text className="text-xs text-indigo-600 font-medium">
                  10 hours (67%)
                </Text>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: "67%" }}
                />
              </View>
            </View>

            <View className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-gray-700">LDC</Text>
                <Text className="text-xs text-indigo-600 font-medium">
                  5 hours (33%)
                </Text>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: "33%" }}
                />
              </View>
            </View>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Bible Studies
              </Text>
              <TouchableOpacity className="bg-indigo-100 p-2 rounded-full">
                <Plus size={18} color="#7E57C2" />
              </TouchableOpacity>
            </View>

            <View className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <BookOpen size={16} color="#7E57C2" />
                  <Text className="ml-2 font-semibold text-gray-800">
                    John Smith
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">Weekly</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Last study: Jun 15, 2023
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Studying chapter 5
              </Text>
            </View>

            <View className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <BookOpen size={16} color="#7E57C2" />
                  <Text className="ml-2 font-semibold text-gray-800">
                    Mary Johnson
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">Bi-weekly</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Last study: Jun 10, 2023
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Interested in baptism
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Time Modal (shown as part of the wireframe) */}
      <View
        className="absolute inset-0 bg-black/50"
        style={{ display: "none" }}
      >
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-indigo-800">
              Add Ministry Time
            </Text>
            <TouchableOpacity>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Date Selector */}
            <View className="mb-4">
              <Text className="text-base font-medium mb-2 text-gray-700">
                Date
              </Text>
              <TouchableOpacity className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Text className="text-gray-800">June 15, 2023</Text>
              </TouchableOpacity>
            </View>

            {/* Type Selector */}
            <View className="mb-4">
              <Text className="text-base font-medium mb-2 text-gray-700">
                Type
              </Text>
              <TouchableOpacity className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                <Text className="text-gray-800">Field Ministry</Text>
                <ChevronDown size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Hours Selector */}
            <View className="mb-4">
              <Text className="text-base font-medium mb-2 text-gray-700">
                Hours
              </Text>
              <View className="flex-row flex-wrap justify-center mb-4">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                  <View
                    key={h}
                    className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${h === 2 ? "bg-indigo-600" : "bg-gray-200"}`}
                  >
                    <Text
                      className={`text-lg ${h === 2 ? "text-white font-medium" : "text-gray-700"}`}
                    >
                      {h}h
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Minutes Selector */}
            <View className="mb-6">
              <Text className="text-base font-medium mb-2 text-gray-700">
                Minutes
              </Text>
              <View className="flex-row flex-wrap justify-center">
                {[0, 15, 30, 45].map((m) => (
                  <View
                    key={m}
                    className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${m === 30 ? "bg-indigo-600" : "bg-gray-200"}`}
                  >
                    <Text
                      className={`text-lg ${m === 30 ? "text-white font-medium" : "text-gray-700"}`}
                    >
                      {m}m
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Total Time Display */}
            <View className="mb-6 bg-indigo-50 p-4 rounded-lg items-center">
              <Text className="text-indigo-700 font-medium mb-1">
                Total Time
              </Text>
              <Text className="text-2xl font-bold text-indigo-800">2h 30m</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity className="bg-indigo-600 py-4 rounded-xl items-center mb-4 flex-row justify-center">
              <Save size={18} color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">Save Time</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="bg-white flex-row justify-around items-center h-16 border-t border-gray-200">
        <View className="items-center">
          <BarChart2 size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Home</Text>
        </View>
        <View className="items-center">
          <BarChart2 size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Bible</Text>
        </View>
        <View className="items-center">
          <BarChart2 size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Habits</Text>
        </View>
        <View className="items-center">
          <BarChart2 size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Goals</Text>
        </View>
        <View className="items-center">
          <View className="p-1 rounded-full bg-indigo-100">
            <BarChart2 size={24} color="#7E57C2" />
          </View>
          <Text className="text-xs text-indigo-800">Ministry</Text>
        </View>
      </View>
    </View>
  );
}

function BookOpen(props) {
  return <View {...props} />;
}

function Settings(props) {
  return <View {...props} />;
}

function Flag(props) {
  return <View {...props} />;
}
