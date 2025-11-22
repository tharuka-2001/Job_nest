// app/category/[name].jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../constants/config";

export default function CategoryJobs() {
  const { name } = useLocalSearchParams();
  const { axiosAuth, me } = useAuth();
  const router = useRouter();

  const [displayJobs, setDisplayJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load jobs by category and then show ONLY those created by the logged-in user
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axiosAuth
      .get(`${API}/job/list`, { params: { category: String(name || "") } })
      .then(({ data }) => {
        if (!mounted) return;
        const items = Array.isArray(data) ? data : data?.data || [];
        const myId = String(me?.id ?? me?._id ?? "");
        const mine = items.filter((j) => {
          const createdById = String(
            (j?.createdBy && (j.createdBy._id || j.createdBy)) ?? ""
          );
          return createdById === myId;
        });
        mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDisplayJobs(mine);
      })
      .catch(() => setDisplayJobs([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [name, me?.id, me?._id]);

  const handleEdit = (job) => {
    router.push({
      pathname: "/jobs/edit",
      params: { id: job._id }, // pass what your edit screen expects
    });
  };

  const handleDelete = (jobId) => {
    Alert.alert("Delete job", "Are you sure you want to delete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // ✅ backend route is DELETE /jobs/:id
            await axiosAuth.delete(`${API}/job/delete/${jobId}`);
            // Optimistic UI update
            setDisplayJobs((prev) => prev.filter((j) => j._id !== jobId));
            Alert.alert("Deleted", "Job deleted successfully.");
          } catch (e) {
            const msg =
              e?.response?.data?.message ||
              e?.message ||
              "Failed to delete the job";
            Alert.alert("Error", msg);
          }
        },
      },
    ]);
  };
  return (
    <View style={s.screen}>
      {/* Top bar */}
      <View style={s.headerRow}>
        <Link href="/" asChild>
          <TouchableOpacity style={s.backBtn} activeOpacity={0.9}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </Link>
        <Text style={s.title}>{name} — My Jobs</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* RESULTS */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          {displayJobs.length === 0 ? (
            <Text style={s.emptyText}>
              You haven't posted any jobs in this category.
            </Text>
          ) : (
            displayJobs.map((item) => (
              <View key={item._id}>
                <View style={s.card}>
                  <View style={s.cardHeader}>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    <View style={s.badgeRight}>
                      <Text style={s.badgeRightText}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <Text style={s.metaLine}>
                    <Ionicons name="location-outline" size={14} />{" "}
                    {item.location}
                  </Text>

                  <View style={s.rowSpace}>
                    <Text style={s.metaStrong}>
                      <Ionicons name="cash-outline" size={14} />{" "}
                      {item?.salaryRange?.min != null
                        ? `${item.salaryRange.currency || ""}${
                            item.salaryRange.min
                          } - ${item.salaryRange.max}`
                        : "Negotiable"}
                    </Text>
                    <Text style={s.metaStrong}>
                      <Ionicons name="people-outline" size={14} />{" "}
                      {item.appliedCount || 0} applied
                    </Text>
                  </View>

                  <View style={s.chipsRow}>
                    <View style={s.chipGreen}>
                      <Text style={s.chipGreenText}>
                        {item.status || "draft"}
                      </Text>
                    </View>
                    <View style={s.chipOutline}>
                      <Text style={s.chipOutlineText}>{item.category}</Text>
                    </View>
                  </View>

                  {/* Actions: Edit & Delete */}
                  <View style={s.actions}>
                    <TouchableOpacity
                      style={s.editBtn}
                      activeOpacity={0.9}
                      onPress={() => handleEdit(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={s.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={s.deleteBtn}
                      activeOpacity={0.9}
                      onPress={() => handleDelete(item._id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                      <Text style={s.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },

  // Cards
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    maxWidth: "75%",
  },
  badgeRight: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#e8f7ee",
  },
  badgeRightText: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  metaLine: { marginTop: 6, color: COLORS.textSecondary },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaStrong: { color: COLORS.textPrimary, fontWeight: "600" },
  chipsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  chipGreen: {
    backgroundColor: "#e8f7ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipGreenText: { fontSize: 12, color: COLORS.textPrimary, fontWeight: "700" },
  chipOutline: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipOutlineText: { fontSize: 12, color: COLORS.textSecondary },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editText: { color: COLORS.primary, fontWeight: "700" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#dc2626",
    flex: 1,
    justifyContent: "center",
  },
  deleteText: { color: "#fff", fontWeight: "700" },

  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
});
