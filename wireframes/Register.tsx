import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Mail, Lock, Eye, ArrowLeft } from "lucide-react-native";

export default function RegisterWireframe() {
  return (
    <View className="flex-1 bg-white p-6">
      <TouchableOpacity className="mb-6">
        <ArrowLeft size={24} color="#4F46E5" />
      </TouchableOpacity>

      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-indigo-800 mb-2">
          Create Account
        </Text>
        <Text className="text-gray-600 text-center">
          Join JW Companion to track your spiritual journey
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
            <Mail size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Enter your email"
            />
          </View>
        </View>

        <View>
          <Text className="text-gray-700 mb-1 font-medium">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
            <Lock size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Create a password"
              secureTextEntry={true}
            />
            <TouchableOpacity>
              <Eye size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 mb-1 font-medium">
            Confirm Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
            <Lock size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Confirm your password"
              secureTextEntry={true}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity className="bg-indigo-600 py-3 rounded-lg items-center mb-4">
        <Text className="text-white font-bold">Create Account</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity>
          <Text className="text-indigo-600 font-medium">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
