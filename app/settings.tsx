import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { Stack } from "expo-router";

import AppearanceSettings from "../components/AppearanceSettings";
import NotificationSettings from "../components/NotificationSettings";
import DataManagement from "../components/DataManagement";
import BottomNavigation from "../components/BottomNavigation";
import { useAuth } from "../lib/auth";

export default function Settings() {
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          headerTitle: "Settings",
          headerLeft: () => (
            <ArrowLeft size={24} color="#7E57C2" className="ml-2" />
          ),
        }}
      />

      <ScrollView className="flex-1 p-4">
        <View className="mb-6 items-center">
          <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-2">
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
          <View className="mb-4">
            <AppearanceSettings />
          </View>

          {/* Notification Settings */}
          <View className="mb-4">
            <NotificationSettings />
          </View>

          {/* Data Management */}
          <View className="mb-4">
            <DataManagement />
          </View>

          {/* Dashboard Settings */}
          <View className="bg-white p-6 rounded-2xl shadow-card mb-4">
            <Text className="text-xl font-semibold mb-4 text-neutral-800">
              Dashboard Settings
            </Text>

            <View className="py-3 border-b border-gray-200">
              <TouchableOpacity className="flex-row justify-between items-center">
                <Text className="text-neutral-700">
                  Rearrange Dashboard Cards
                </Text>
                <ChevronRight size={20} color="#7E57C2" />
              </TouchableOpacity>
            </View>

            <View className="py-3 border-b border-gray-200">
              <TouchableOpacity className="flex-row justify-between items-center">
                <Text className="text-neutral-700">Manage Visible Cards</Text>
                <ChevronRight size={20} color="#7E57C2" />
              </TouchableOpacity>
            </View>
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
                  <Text className="text-neutral-500 mr-2">{user?.email}</Text>
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
              <TouchableOpacity
                className="flex-row justify-between items-center"
                onPress={() => signOut()}
              >
                <Text className="text-red-600">Sign Out</Text>
                <ChevronRight size={20} color="#7E57C2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Information */}
          <View className="bg-white p-6 rounded-2xl shadow-card">
            <Text className="text-xl font-semibold mb-4 text-neutral-800">
              About JW Companion
            </Text>

            <View className="py-3 border-b border-gray-200">
              <Text className="text-neutral-700">Version</Text>
              <Text className="text-neutral-500 text-sm">1.0.0</Text>
            </View>

            <View className="py-3 border-b border-gray-200">
              <Text className="text-neutral-700">Build</Text>
              <Text className="text-neutral-500 text-sm">2023.06.15</Text>
            </View>

            <View className="py-3">
              <Text className="text-neutral-700">Privacy Policy</Text>
              <Text className="text-neutral-500 text-sm mt-1">
                This app does not collect any personal data. All information is
                stored locally on your device.
              </Text>
            </View>
          </View>

          <Text className="text-center text-xs text-neutral-500 mb-6">
            © 2023 JW Companion App
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/settings" />
    </SafeAreaView>
  );
}
