import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PaymentSuccess() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Payment successful 🎉
      </Text>
      {jobId ? <Text>Job ID: {String(jobId)}</Text> : null}

      <TouchableOpacity
        onPress={() => router.replace("/home")}
        style={{
          marginTop: 24,
          backgroundColor: "#2f6fed",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
