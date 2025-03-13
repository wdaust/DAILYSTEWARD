import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import {
  Settings as SettingsIcon,
  ChevronRight,
  Moon,
  Sun,
  Palette,
  Bell,
  BellOff,
  Download,
  Upload,
  Database,
  RefreshCw,
  AlertTriangle,
} from "lucide-react-native";

export default function SettingsWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 border-b border-gray-200">
        <Text className="text-xl font-bold text-center text-indigo-800">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-6 items-center">
          <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-2">
            <SettingsIcon size={32} color="#7E57C2" />
          </View>
          <Text className="text-xl font-bold text-neutral-800">
            JW Companion Settings
          </Text>
          <Text className="text-sm text-neutral-500 text-center mt-1">
            Customize your app experience and manage your data
          </Text>
        </View>

        <View className="space-y-6">
          {/* Appearance Settings */}
          <View className="p-6 bg-white rounded-2xl shadow-card w-full">
            <Text className="text-xl font-semibold mb-5 text-neutral-800">
              Appearance Settings
            </Text>

            {/* Dark/Light Mode Toggle */}
            <View className="flex-row items-center justify-between mb-6 py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <Sun size={22} color="#374151" className="mr-3" />
                <Text className="text-base text-gray-800">Dark Mode</Text>
              </View>
              <Switch
                value={false}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Color Theme Selection */}
            <View className="mb-4">
              <View className="flex-row items-center mb-3">
                <Palette size={22} color="#374151" className="mr-2" />
                <Text className="text-base text-gray-800">Color Theme</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                <View className="flex-row space-x-3 py-2">
                  <View className="p-3 rounded-lg border-2 border-blue-500">
                    <View className="items-center">
                      <View
                        style={{ backgroundColor: "#3b82f6" }}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <Text className="text-sm text-gray-800">Default</Text>
                    </View>
                  </View>
                  <View className="p-3 rounded-lg border border-gray-300">
                    <View className="items-center">
                      <View
                        style={{ backgroundColor: "#10b981" }}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <Text className="text-sm text-gray-800">Calm</Text>
                    </View>
                  </View>
                  <View className="p-3 rounded-lg border border-gray-300">
                    <View className="items-center">
                      <View
                        style={{ backgroundColor: "#8b5cf6" }}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <Text className="text-sm text-gray-800">Serene</Text>
                    </View>
                  </View>
                  <View className="p-3 rounded-lg border border-gray-300">
                    <View className="items-center">
                      <View
                        style={{ backgroundColor: "#f59e0b" }}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <Text className="text-sm text-gray-800">Warm</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Notification Settings */}
          <View className="bg-white p-6 rounded-2xl shadow-card w-full h-full">
            <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <View className="flex-row items-center">
                <Bell size={24} color="#4A5568" />
                <Text className="text-lg font-semibold ml-3 text-neutral-800">
                  Notification Settings
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={true ? "#3B82F6" : "#9CA3AF"}
              />
            </View>

            <ScrollView className="flex-1">
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-4 border-b border-gray-100"
              >
                <View className="flex-row items-center flex-1 mr-4">
                  <View className="mr-3">
                    <BookOpen size={22} color="#4A5568" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      Bible Reading
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Daily reminders for your Bible reading schedule
                    </Text>
                  </View>
                </View>
                <Switch
                  value={true}
                  trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                  thumbColor={true ? "#3B82F6" : "#9CA3AF"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-4 border-b border-gray-100"
              >
                <View className="flex-row items-center flex-1 mr-4">
                  <View className="mr-3">
                    <Clock size={22} color="#4A5568" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      Prayer Time
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Reminders for your scheduled prayer times
                    </Text>
                  </View>
                </View>
                <Switch
                  value={true}
                  trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                  thumbColor={true ? "#3B82F6" : "#9CA3AF"}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Data Management */}
          <View className="w-full p-6 bg-white rounded-2xl shadow-card">
            <Text className="text-xl font-semibold mb-5 text-neutral-800">
              Data Management
            </Text>

            {/* Export Data */}
            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <Download size={20} color="#4b5563" />
                <Text className="ml-3 text-gray-700">Export Data</Text>
              </View>
              <Text className="text-gray-500 text-sm">CSV, PDF</Text>
            </TouchableOpacity>

            {/* Backup Data */}
            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <Upload size={20} color="#4b5563" />
                <Text className="ml-3 text-gray-700">Backup Data</Text>
              </View>
              <Text className="text-gray-500 text-sm">Last: Never</Text>
            </TouchableOpacity>

            {/* Auto Backup */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <RefreshCw size={20} color="#4b5563" />
                <Text className="ml-3 text-gray-700">Auto Backup</Text>
              </View>
              <Switch
                value={false}
                trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                thumbColor={false ? "#3b82f6" : "#f4f4f5"}
              />
            </View>

            {/* Restore Data */}
            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <View className="flex-row items-center">
                <Database size={20} color="#4b5563" />
                <Text className="ml-3 text-gray-700">Restore from Backup</Text>
              </View>
              <Text className="text-gray-500 text-sm">Select file</Text>
            </TouchableOpacity>

            {/* Reset Data */}
            <TouchableOpacity className="flex-row items-center justify-between py-3 mt-4 bg-red-50 rounded-md px-2">
              <View className="flex-row items-center">
                <AlertTriangle size={20} color="#ef4444" />
                <Text className="ml-3 text-red-600 font-medium">
                  Reset All Data
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* User Account Settings */}
          <View className="bg-white p-6 rounded-2xl shadow-card mb-4">
            <Text className="text-xl font-semibold mb-4 text-neutral-800">
              Account Settings
            </Text>

            <View className="py-3 border-b border-gray-200">
              <TouchableOpacity className="flex-row justify-between items-center">
                <Text className="text-neutral-700">Email Address</Text>
                <View className="flex-row items-center">
                  <Text className="text-neutral-500 mr-2">
                    user@example.com
                  </Text>
                  <ChevronRight size={20} color="#7E57C2" />
                </View>
              </TouchableOpacity>
            </View>

            <View className="py-3 border-b border-gray-200">
              <TouchableOpacity className="flex-row justify-between items-center">
                <Text className="text-neutral-700">Change Password</Text>
                <ChevronRight size={20} color="#7E57C2" />
              </TouchableOpacity>
            </View>

            <View className="py-3">
              <TouchableOpacity className="flex-row justify-between items-center">
                <Text className="text-red-600">Sign Out</Text>
                <ChevronRight size={20} color="#7E57C2" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-center text-xs text-neutral-500 mb-6">
            © 2023 JW Companion App
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white flex-row justify-around items-center h-16 border-t border-gray-200">
        <View className="items-center">
          <SettingsIcon size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Home</Text>
        </View>
        <View className="items-center">
          <SettingsIcon size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Bible</Text>
        </View>
        <View className="items-center">
          <SettingsIcon size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Habits</Text>
        </View>
        <View className="items-center">
          <SettingsIcon size={24} color="#9CA3AF" />
          <Text className="text-xs text-gray-500">Goals</Text>
        </View>
        <View className="items-center">
          <View className="p-1 rounded-full bg-indigo-100">
            <SettingsIcon size={24} color="#7E57C2" />
          </View>
          <Text className="text-xs text-indigo-800">Settings</Text>
        </View>
      </View>
    </View>
  );
}

function BookOpen(props) {
  return <View {...props} />;
}
