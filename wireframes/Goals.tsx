import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  Flag,
  Calendar,
  CheckCircle,
  Circle,
  ChevronRight,
  TrendingUp,
  Plus,
} from "lucide-react-native";

export default function GoalsWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 border-b border-gray-200 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-2xl font-semibold text-neutral-800">
              Spiritual Goals
            </Text>
          </View>
          <TouchableOpacity className="bg-indigo-600 p-3 rounded-full shadow-sm">
            <Plus size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-2xl p-6 shadow-card w-full">
          <Text className="text-xl font-semibold mb-5 text-neutral-800">
            My Spiritual Goals
          </Text>

          <View className="mb-4">
            <TouchableOpacity className="flex-row items-center p-3 bg-gray-100 rounded-xl border border-gray-200">
              <View className="mr-3 p-2 rounded-full bg-indigo-100">
                <Flag size={20} color="#7E57C2" />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-neutral-800">
                    Read Bible in One Year
                  </Text>
                  <View className="flex-row items-center">
                    <View className="px-2 py-1 rounded-full bg-indigo-100 mr-2">
                      <Text className="text-xs text-indigo-700 font-medium">
                        Spiritual
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#7E57C2" />
                  </View>
                </View>

                <Text className="text-xs text-neutral-500 mb-2">
                  Complete reading the entire Bible in one year
                </Text>

                <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: "35%" }}
                  />
                </View>

                <View className="flex-row justify-between mt-2">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 font-medium">
                      Due: Dec 31, 2023
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TrendingUp size={14} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 font-medium">
                      35% complete
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <TouchableOpacity className="flex-row items-center p-3 bg-gray-100 rounded-xl border border-gray-200">
              <View className="mr-3 p-2 rounded-full bg-indigo-100">
                <Flag size={20} color="#7E57C2" />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-neutral-800">
                    Auxiliary Pioneer
                  </Text>
                  <View className="flex-row items-center">
                    <View className="px-2 py-1 rounded-full bg-green-100 mr-2">
                      <Text className="text-xs text-green-700 font-medium">
                        Ministry
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#7E57C2" />
                  </View>
                </View>

                <Text className="text-xs text-neutral-500 mb-2">
                  Complete 30 hours of ministry this month
                </Text>

                <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: "60%" }}
                  />
                </View>

                <View className="flex-row justify-between mt-2">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 font-medium">
                      Due: Jun 30, 2023
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TrendingUp size={14} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 font-medium">
                      60% complete
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <TouchableOpacity className="flex-row items-center p-3 bg-gray-100 rounded-xl border border-gray-200">
              <View className="mr-3 p-2 rounded-full bg-indigo-100">
                <Flag size={20} color="#7E57C2" />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-neutral-800">
                    Memorize Key Scriptures
                  </Text>
                  <View className="flex-row items-center">
                    <View className="px-2 py-1 rounded-full bg-purple-100 mr-2">
                      <Text className="text-xs text-purple-700 font-medium">
                        Personal
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#7E57C2" />
                  </View>
                </View>

                <Text className="text-xs text-neutral-500 mb-2">
                  Memorize 12 key Bible verses
                </Text>

                <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: "25%" }}
                  />
                </View>

                <View className="flex-row justify-between mt-2">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 font-medium">
                      Due: Aug 15, 2023
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TrendingUp size={14} color="#7E57C2" />
                    <Text className="text-xs text-indigo-600 ml-1 font-medium">
                      25% complete
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Goal Detail Preview */}
        <View className="mt-6 bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Goal Details
          </Text>

          <View className="flex-row justify-between mb-4">
            <View className="px-3 py-1 rounded-full bg-indigo-100">
              <Text className="text-indigo-700 font-medium">Spiritual</Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={16} color="#6B7280" />
              <Text className="ml-1 text-gray-600">Due: Dec 31, 2023</Text>
            </View>
          </View>

          <View className="mb-6 bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-600">
              Complete reading the entire Bible in one year, focusing on
              understanding key themes and principles.
            </Text>
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="font-medium text-gray-800">Progress</Text>
              <Text className="text-indigo-600 font-medium">35%</Text>
            </View>
            <View className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <View
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "35%" }}
              />
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              3 of 6 sub-goals completed
            </Text>
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">Sub-goals</Text>
              <TouchableOpacity className="bg-indigo-100 p-1 rounded-full">
                <Plus size={18} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 rounded-lg p-2">
              <View className="py-3 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity className="flex-row items-center flex-1">
                    <CheckCircle size={20} color="#10B981" />
                    <Text className="ml-3 text-gray-500 line-through">
                      Read Genesis to Deuteronomy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="py-3 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity className="flex-row items-center flex-1">
                    <Circle size={20} color="#D1D5DB" />
                    <Text className="ml-3 text-gray-800">
                      Read Joshua to Esther
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="py-3 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity className="flex-row items-center flex-1">
                    <Circle size={20} color="#D1D5DB" />
                    <Text className="ml-3 text-gray-800">
                      Read Job to Song of Solomon
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white flex-row justify-around items-center h-16 border-t border-gray-200">
        <View className="items-center">
          <Flag size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Home</Text>
        </View>
        <View className="items-center">
          <Flag size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Bible</Text>
        </View>
        <View className="items-center">
          <Flag size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Habits</Text>
        </View>
        <View className="items-center">
          <View className="p-1 rounded-full bg-indigo-100">
            <Flag size={24} color="#7E57C2" />
          </View>
          <Text className="text-xs text-indigo-800">Goals</Text>
        </View>
        <View className="items-center">
          <Flag size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Settings</Text>
        </View>
      </View>
    </View>
  );
}
