import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Mail, Lock, Eye } from "lucide-react-native";

export default function LoginWireframe() {
  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-indigo-800 mb-2">
          JW Companion
        </Text>
        <Text className="text-gray-600 text-center">
          Sign in to track your spiritual goals and habits
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
              placeholder="Enter your password"
              secureTextEntry={true}
            />
            <TouchableOpacity>
              <Eye size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity>
          <Text className="text-indigo-600 text-right">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="bg-indigo-600 py-3 rounded-lg items-center mb-4">
        <Text className="text-white font-bold">Sign In</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity>
          <Text className="text-indigo-600 font-medium">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
