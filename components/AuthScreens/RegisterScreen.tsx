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
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;

      Alert.alert(
        "Registration Successful",
        "Please check your email to confirm your account.",
        [{ text: "OK", onPress: () => router.replace("/login") }],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign up");
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
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-indigo-600 py-3 rounded-lg items-center mb-4"
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold">Create Account</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text className="text-indigo-600 font-medium">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
