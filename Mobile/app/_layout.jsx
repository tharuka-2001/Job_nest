import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";

function RootLayoutInner() {
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          //!Put all screens here
          {/* <Stack.Screen name="index" /> */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(payment)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </PaperProvider>
  );
}
