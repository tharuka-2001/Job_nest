import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import COLORS from "../../../constants/colors";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { me, logout } = useAuth();
  const role = me?.role;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.nameCard}>
          <View style={styles.nameRow}>
            <Image
              source={require("../../../assets/images/profile.jpg")}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>Hello</Text>
              <Text style={styles.subtitle}>{me?.profile?.fullName}</Text>
              {role ? (
                <View style={styles.roleChip}>
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color={COLORS.white}
                  />
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.bellWrap}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.primary}
              />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.header}>
          <View style={[styles.headerCard, styles.headerCardA]}>
            <Ionicons name="briefcase-outline" size={18} color={COLORS.white} />
            <Text style={styles.headerMetric}>4</Text>
            <Text style={styles.headerLabel}>Active Jobs</Text>
          </View>
          <View style={[styles.headerCard, styles.headerCardB]}>
            <Ionicons name="flame-outline" size={18} color={COLORS.white} />
            <Text style={styles.headerMetric}>10</Text>
            <Text style={styles.headerLabel}>Urgent Hiring</Text>
          </View>
          <View style={[styles.headerCard, styles.headerCardC]}>
            <Ionicons name="wifi-outline" size={18} color={COLORS.white} />
            <Text style={styles.headerMetric}>10</Text>
            <Text style={styles.headerLabel}>Online</Text>
          </View>
        </View>

        {/* NEW: Discover banner (non-breaking UI addition) */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Find jobs near you</Text>
            <Text style={styles.bannerSub}>
              Browse hundreds of fresh listings
            </Text>
          </View>
          <Link href="/jobs" asChild>
            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.9}>
              <Ionicons name="compass-outline" size={16} color={COLORS.white} />
              <Text style={styles.bannerBtnText}>Explore</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Browse by category */}
        <View style={styles.catSection}>
          <View style={styles.catHeaderRow}>
            <Text style={styles.catHeading}>Job Categories</Text>
            <Text style={styles.catHint}>Tap a category to filter</Text>
          </View>

          <View style={styles.catGrid}>
            {[
              { key: "Farming", icon: "🌾", count: 15 },
              { key: "Shop Work", icon: "🏪", count: 12 },
              { key: "Driving", icon: "🚚", count: 18 },
              { key: "Construction", icon: "🏗️", count: 8 },
              { key: "Cleaning", icon: "🧹", count: 6 },
              { key: "Cooking", icon: "👩‍🍳", count: 9 },
              { key: "Gardening", icon: "🌱", count: 7 },
              { key: "Teaching", icon: "🧑‍🏫", count: 5 },
            ].map((c) => (
              <Link
                key={c.key}
                href={{
                  pathname: "/jobs",
                  params: { name: c.key },
                }}
                asChild
              >
                <TouchableOpacity style={styles.catCard} activeOpacity={0.9}>
                  <Text style={styles.catIcon}>{c.icon}</Text>
                  <Text style={styles.catTitle}>{c.key}</Text>
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{c.count} jobs</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  /* Header card */
  nameCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: (width * 0.16) / 2,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  hello: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  subtitle: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "700" },
  roleChip: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleText: { color: COLORS.white, fontSize: 12, fontWeight: "700" },
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff6b6b",
  },

  /* Stats */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },
  headerCard: {
    width: (width - 60) / 3,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: "center",
    gap: 6,
  },
  headerCardA: { backgroundColor: "#64b5f6" },
  headerCardB: { backgroundColor: "#4fc3f7" },
  headerCardC: { backgroundColor: "#29b6f6" },
  headerMetric: { color: COLORS.white, fontSize: 18, fontWeight: "800" },
  headerLabel: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
    textAlign: "center",
  },

  /* Banner (new UI) */
  banner: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  bannerTitle: { color: COLORS.textDark, fontSize: 16, fontWeight: "800" },
  bannerSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bannerBtnText: { color: COLORS.white, fontWeight: "800" },

  /* Categories */
  catSection: { marginTop: 4 },
  catHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  catHeading: { fontSize: 16, fontWeight: "800", color: COLORS.textPrimary },
  catHint: { fontSize: 12, color: COLORS.textSecondary },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  catCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  catIcon: { fontSize: 36, marginBottom: 6 },
  catTitle: { fontSize: 15, color: COLORS.textPrimary, fontWeight: "700" },
  catBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  catBadgeText: { fontSize: 12, color: COLORS.primary, fontWeight: "700" },
});
