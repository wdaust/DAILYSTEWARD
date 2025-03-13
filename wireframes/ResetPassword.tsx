import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ResetPasswordWireframe() {
  return (
    <View className="flex-1 bg-white p-6">
      <TouchableOpacity className="mb-6">
        <ArrowLeft size={24} color="#4F46E5" />
      </TouchableOpacity>

      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-indigo-800 mb-2">Reset Password</Text>
        <Text className="text-gray-600 text-center">
          Enter your email to receive password reset instructions
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-