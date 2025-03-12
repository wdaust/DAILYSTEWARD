import React from "react";
import { Stack } from "expo-router";
import RegisterScreen from "../components/AuthScreens/RegisterScreen";

export default function Register() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RegisterScreen />
    </>
  );
}
