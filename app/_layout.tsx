import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "react-native-webview";
import "../global.css";
import { Platform, View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../lib/auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Auth redirect component
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAuthRoute =
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "reset-password" ||
      segments[0]?.startsWith("tempobook");

    if (!user && !isAuthRoute) {
      // If not logged in and not on an auth page, redirect to login
      router.replace("/login");
    } else if (user && isAuthRoute && !segments[0]?.startsWith("tempobook")) {
      // If logged in and on an auth page, redirect to home
      router.replace("/");
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <AuthRedirect>
          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={({ route }) => ({
                headerShown: !route.name.startsWith("tempobook"),
                contentStyle: { flex: 1 },
              })}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen
                name="reset-password"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
          </View>
        </AuthRedirect>
      </AuthProvider>
    </ThemeProvider>
  );
}
