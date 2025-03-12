import React from "react";
import { Stack } from "expo-router";
import LoginScreen from "../components/AuthScreens/LoginScreen";

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  );
}
