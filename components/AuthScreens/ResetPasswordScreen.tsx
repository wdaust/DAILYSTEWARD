import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../lib/auth";
import { useRouter } from "expo-router";
import { Mail, ArrowLeft } from "lucide-react-native";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;

      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email for instructions to reset your password.",
        [{ text: "OK", onPress: () => router.replace("/login") }],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <TouchableOpacity className="mb-6" onPress={() => router.back()}>
        <ArrowLeft size={24} color="#4F46E5" />
      </TouchableOpacity>

      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-indigo-800 mb-2">
          Reset Password
        </Text>
        <Text className="text-gray-600 text-center">
          Enter your email to receive password reset instructions
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
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-indigo-600 py-3 rounded-lg items-center mb-4"
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold">Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Remember your password? </Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text className="text-indigo-600 font-medium">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
