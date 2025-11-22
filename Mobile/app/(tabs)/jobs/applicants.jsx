import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { g } from "../../../assets/styles/global";

export default function Applicants() {
  const { id } = useLocalSearchParams();
  const { axiosAuth } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axiosAuth.get(`/job/apply/get/applicants/${id}`);
      setApps(data.data || []);
    })();
  }, [id]);

  return (
    <View style={g.screen}>
      <FlatList
        data={apps}
        keyExtractor={(a) => a._id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 12,
              marginVertical: 6,
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {item.applicant?.profile?.fullName || item.applicant?.email}
            </Text>
            <Text style={{ color: "#555" }}>
              {item.applicant?.profile?.location}
            </Text>
            <Text numberOfLines={2} style={{ marginVertical: 4 }}>
              {item.coverLetter}
            </Text>
            {item.resumeUrl ? <Text>Resume: {item.resumeUrl}</Text> : null}
            <Link
              href={`/badges/user/${item.applicant?._id}`}
              style={[g.chip, { alignSelf: "flex-start" }]}
            >
              View Badges
            </Link>
            <Link
              href={`/chat/index?with=${item.applicant?._id}`}
              style={[g.chip, { alignSelf: "flex-start" }]}
            >
              Start Chat
            </Link>
          </View>
        )}
      />
    </View>
  );
}
