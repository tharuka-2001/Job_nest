import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { token, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      router.replace(token ? "(tabs)/home" : "(auth)/login");
    }
  }, [loading, token]);
  return (
    <View>
      <Text>Loading…</Text>
    </View>
  );
}
