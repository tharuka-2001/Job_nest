import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { me, logout } = useAuth();
  const role = me?.role;

  const userId = me?._id;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        tabBarActiveTintColor: COLORS.primary,
        headerStyle: { backgroundColor: COLORS.cardBackground, height: 70 },
        headerTitleStyle: {
          color: COLORS.textPrimary,
          fontWeight: "1000",
          height: 80,
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 5,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paper-plane-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
