import React from "react";
import { Stack } from "expo-router";
import ResetPasswordScreen from "../components/AuthScreens/ResetPasswordScreen";

export default function ResetPassword() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ResetPasswordScreen />
    </>
  );
}
