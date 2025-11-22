// app/(tabs)/jobs/_layout.jsx
import React from "react";
import { Stack } from "expo-router";

export default function JobsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* These names must match your files */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="jobseekerprofile" />
      <Stack.Screen name="jobposterprofile" />
    </Stack>
  );
}
