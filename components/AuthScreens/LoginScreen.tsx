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
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/reset-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };

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
              placeholder="Enter your password"
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

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-indigo-600 text-right">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-indigo-600 py-3 rounded-lg items-center mb-4"
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold">Sign In</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text className="text-indigo-600 font-medium">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
