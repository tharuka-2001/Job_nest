import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

export default function Index() {
  const { me } = useAuth();
  const role = me?.role;

  const router = useRouter();
  useEffect(() => {
    if (!role) return; // wait until role is known
    if (role === "JOB_SEEKER") {
      router.replace("jobs/userjobs");
    } else if (role === "JOB_POSTER") {
      router.replace("jobs/jobposter");
    }
  }, [me, role]);
  return (
    <Redirect
      href={role === "JOB_SEEKER" ? "/jobs/userjobs" : "/jobs/jobposter"}
    />
  );
}
