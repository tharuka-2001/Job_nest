// app/category/[name].jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../constants/config";
import { useRouter } from "expo-router";

export default function CategoryJobs() {
  const { name, id } = useLocalSearchParams();
  const { axiosAuth } = useAuth();
  const { me } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]); // full list from API
  const [displayJobs, setDisplayJobs] = useState([]); // what we render (filters applied only on button)
  const [loading, setLoading] = useState(true);

  // Search / filter state (do NOT auto-apply)
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [sortBy, setSortBy] = useState("recent"); // recent | salary | applied

  // load jobs for the category (no client filters yet)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axiosAuth
      .get(`${API}/job/list`, { params: { category: String(name || "") } })
      .then(({ data }) => {
        if (!mounted) return;
        const items = Array.isArray(data) ? data : data?.data || [];
        setJobs(items);
        setDisplayJobs(items); // show all by default
      })
      .catch(() => {
        setJobs([]);
        setDisplayJobs([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [name]);
  const handleSearch = () => {
    let list = [...jobs];

    if (onlyPublished)
      list = list.filter((j) => (j.status || "draft") === "published");

    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q)
      );
    }

    if (location.trim()) {
      const loc = location.trim().toLowerCase();
      list = list.filter((j) => j.location?.toLowerCase().includes(loc));
    }

    const min = Number(minSalary) || 0;
    const max = Number(maxSalary) || Number.MAX_SAFE_INTEGER;
    list = list.filter((j) => {
      const sr = j?.salaryRange || {};
      if (sr?.min == null && sr?.max == null) return true; // negotiable
      const low = Number(sr.min ?? sr.max ?? 0);
      const high = Number(sr.max ?? sr.min ?? 0);
      return high >= min && low <= max;
    });

    if (sortBy === "salary") {
      list.sort(
        (a, b) => (b?.salaryRange?.max || 0) - (a?.salaryRange?.max || 0)
      );
    } else if (sortBy === "applied") {
      list.sort((a, b) => (b.appliedCount || 0) - (a.appliedCount || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setDisplayJobs(list);
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setOnlyPublished(true);
    setSortBy("recent");
    setDisplayJobs(jobs); // back to full list
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
        <Text style={s.title}>{name} Jobs</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* SEARCH & FILTER CARD (filters apply only when pressing Search) */}
      <View style={s.searchCard}>
        <Text style={s.searchTitle}>Find the right job</Text>

        <View style={s.inputRow}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.textSecondary}
          />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Search by title or keywords"
            placeholderTextColor={COLORS.placeholderText}
            style={s.textInput}
            returnKeyType="search"
          />
        </View>

        <View style={s.inputRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={COLORS.textSecondary}
          />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location (city, village…)"
            placeholderTextColor={COLORS.placeholderText}
            style={s.textInput}
            returnKeyType="search"
          />
        </View>

        <View style={s.row2}>
          <View style={[s.inputRow, s.half]}>
            <Ionicons
              name="cash-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <TextInput
              value={minSalary}
              onChangeText={setMinSalary}
              placeholder="Min salary"
              placeholderTextColor={COLORS.placeholderText}
              style={s.textInput}
              keyboardType="numeric"
            />
          </View>
          <View style={[s.inputRow, s.half]}>
            <Ionicons
              name="cash-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <TextInput
              value={maxSalary}
              onChangeText={setMaxSalary}
              placeholder="Max salary"
              placeholderTextColor={COLORS.placeholderText}
              style={s.textInput}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={s.tagRow}>
          <TouchableOpacity
            style={[s.toggle, onlyPublished && s.toggleOn]}
            onPress={() => setOnlyPublished((v) => !v)}
          >
            <Ionicons
              name={onlyPublished ? "shield-checkmark" : "shield-outline"}
              size={14}
              color={onlyPublished ? COLORS.white : COLORS.textSecondary}
            />
            <Text
              style={[s.toggleText, onlyPublished && { color: COLORS.white }]}
            >
              Verified / Published
            </Text>
          </TouchableOpacity>

          <View style={s.sortPill}>
            <TouchableOpacity
              onPress={() => setSortBy("recent")}
              style={[s.sortBtn, sortBy === "recent" && s.sortBtnActive]}
            >
              <Text
                style={[s.sortText, sortBy === "recent" && s.sortTextActive]}
              >
                Recent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortBy("salary")}
              style={[s.sortBtn, sortBy === "salary" && s.sortBtnActive]}
            >
              <Text
                style={[s.sortText, sortBy === "salary" && s.sortTextActive]}
              >
                Salary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortBy("applied")}
              style={[s.sortBtn, sortBy === "applied" && s.sortBtnActive]}
            >
              <Text
                style={[s.sortText, sortBy === "applied" && s.sortTextActive]}
              >
                Applied
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.actionRow}>
          <TouchableOpacity
            onPress={clearFilters}
            style={s.clearBtn}
            activeOpacity={0.9}
          >
            <Text style={s.clearText}>Clear Filter ✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearch}
            style={s.searchBtn}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={16} color={COLORS.white} />
            <Text style={s.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
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
            <Text style={s.emptyText}>No jobs found.</Text>
          ) : (
            displayJobs.map((item) => (
              <View
                key={item._id}
                // href={{ pathname: "./apply", params: { id: item._id } }}
                // asChild
              >
                <TouchableOpacity activeOpacity={0.9} style={s.card}>
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

                  {/* Visual buttons (card itself navigates to /apply?id=...) */}
                  <View style={s.actions}>
                    <View style={s.saveBtn}>
                      <Ionicons
                        name="bookmark-outline"
                        size={16}
                        color={COLORS.textPrimary}
                      />
                      <Text style={s.saveText}>Save</Text>
                    </View>
                    <TouchableOpacity
                      style={s.applyBtn}
                      activeOpacity={0.9}
                      onPress={() =>
                        router.push({
                          pathname: "/jobs/apply",
                          params: {
                            id: item._id,
                            title: item.title,
                            location: item.location,
                            category: item.category,
                            currency: item.salaryRange?.currency || "",
                            min: String(item.salaryRange?.min ?? ""),
                            max: String(item.salaryRange?.max ?? ""),
                            org: item.organization?.name || "",
                            createdAt: item.createdAt,
                            status: item.status || "",
                            appliedCount: String(item.appliedCount ?? 0),
                          },
                        })
                      }
                    >
                      <Text style={s.applyText}>Apply Now 🚀</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
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

  // Search card
  searchCard: {
    marginTop: 12,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 44,
    marginTop: 10,
  },
  textInput: { flex: 1, marginLeft: 8, color: COLORS.textPrimary },
  row2: { flexDirection: "row", gap: 10, marginTop: 10 },
  half: { flex: 1 },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  toggleOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { color: COLORS.textSecondary, fontWeight: "600", fontSize: 12 },

  sortPill: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  sortBtnActive: { backgroundColor: COLORS.primary },
  sortText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "700" },
  sortTextActive: { color: COLORS.white },

  actionRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  clearBtn: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: { color: COLORS.textSecondary, fontWeight: "700" },
  searchBtn: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  searchBtnText: { color: COLORS.white, fontWeight: "800" },

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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveText: { color: COLORS.textPrimary, fontWeight: "600" },
  applyBtn: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { color: COLORS.white, fontWeight: "700" },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
});
