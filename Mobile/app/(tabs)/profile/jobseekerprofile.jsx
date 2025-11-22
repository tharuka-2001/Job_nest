import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { Link } from "expo-router";

import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../constants/config";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import COLORS from "../../../constants/colors";
import { useRouter } from "expo-router"; // 👈 Add this at the top

export default function profile() {
  const { me, logout } = useAuth();
  const role = me?.role;
  const userId = me?._id;
  const router = useRouter();

  const [greeting, setGreeting] = useState("");
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours(); // 0 - 23

      if (currentHour < 12) {
        return "Good Morning !";
      } else if (currentHour < 17) {
        return "Good Afternoon !";
      } else if (currentHour < 21) {
        return "Good Evening !";
      } else {
        return "Good Night !";
      }
    };

    setGreeting(getGreeting());

    // Optional: Update greeting every minute if user stays on page
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (!userId) return; // 🛑 Stop if userId not yet loaded
    const fetchBadges = async () => {
      try {
        const { data } = await axios.get(`${API}/badges/user/${userId}`);
        setBadges(data.data || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };
    fetchBadges();
  }, [userId]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              <Image
                source={require("../../../assets/images/profile.jpg")}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={styles.statusDot} />
            </View>

            <Text style={styles.greeting}>
              {greeting}{" "}
              <Text style={styles.nameText}>
                {me?.profile?.fullName || me?.email}
              </Text>
            </Text>

            <View style={styles.metaRow}>
              {role ? (
                <View style={[styles.chip, styles.roleChip]}>
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color={COLORS.white}
                  />
                  <Text style={styles.chipTextLight}>{role}</Text>
                </View>
              ) : null}

              {me?.createdAt ? (
                <View style={[styles.chip, styles.lightChip]}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.chipTextMuted}>
                    Member since {me?.createdAt.split("-")[0]}
                  </Text>
                </View>
              ) : null}

              {me?.profile?.occupation ? (
                <View style={[styles.chip, styles.lightChip]}>
                  <Ionicons
                    name="briefcase-outline"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.chipTextMuted}>
                    {me?.profile?.occupation}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Quick Actions (added UI, non-breaking) */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.primaryBtn]}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={styles.primaryBtnText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Logout", "Are you sure you want to logout?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Logout",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await logout(); // call your logout function
                          router.replace("(auth)/login"); // 👈 navigate to login screen after logout
                        } catch (err) {
                          console.error("Logout failed:", err);
                        }
                      },
                    },
                  ])
                }
                style={[styles.actionBtn, styles.outlineBtn]}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="log-out-outline"
                  size={16}
                  color={COLORS.textPrimary}
                />
                <Text style={styles.outlineBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>

            {/* NEW: Take Assessment button (full-width, separate row) */}

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.actionBtn, styles.assessBtn]}
              onPress={() => router.push("profile/assess")}
            >
              <Ionicons
                name="clipboard-outline"
                size={16}
                color={COLORS.white}
              />
              <Text style={styles.assessBtnText}>Take an Assessment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <View style={styles.iconPill}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.infoText}>
                {me?.profile?.phone || "Not provided"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconPill}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.infoText}>{me?.email}</Text>
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>

          <View style={styles.skillsWrap}>
            {(me?.profile?.skills || []).map((k, idx) => (
              <View key={`${k}-${idx}`} style={styles.skillChip}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={COLORS.white}
                />
                <Text style={styles.skillText}>{k}</Text>
              </View>
            ))}
            {(!me?.profile?.skills || me?.profile?.skills?.length === 0) && (
              <Text style={styles.emptyText}>No skills added yet.</Text>
            )}
          </View>
        </View>

        {/* Badges & Endorsements */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ribbon-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{badges.length}</Text>
            </View>
          </View>

          <FlatList
            data={badges}
            keyExtractor={(i) => i._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.badgeCard}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons
                    name="medal-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.badgeTitle}>{item.badge?.title}</Text>
                  <Text style={styles.badgeMeta}>
                    Level:{" "}
                    <Text style={styles.badgeMetaStrong}>{item.level}</Text> •
                    Source:{" "}
                    <Text style={styles.badgeMetaStrong}>{item.source}</Text>
                    {item.score ? (
                      <>
                        {" "}
                        • Score:{" "}
                        <Text style={styles.badgeMetaStrong}>{item.score}</Text>
                      </>
                    ) : null}
                    {item.endorsementsCount ? (
                      <>
                        {" "}
                        • Endorsements:{" "}
                        <Text style={styles.badgeMetaStrong}>
                          {item.endorsementsCount}
                        </Text>
                      </>
                    ) : null}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No badges yet. Keep building your profile!
              </Text>
            }
          />
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

  /* Cards */
  card: {
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

  /* Header section */
  header: { alignItems: "center" },
  avatarWrap: {
    width: width * 0.34,
    height: width * 0.34,
    borderRadius: (width * 0.34) / 2,
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: COLORS.inputBackground,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
  },
  statusDot: {
    position: "absolute",
    bottom: 10,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4caf50",
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  nameText: { color: COLORS.textPrimary, fontWeight: "800" },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleChip: { backgroundColor: COLORS.primary },
  chipTextLight: { color: COLORS.white, fontWeight: "700", fontSize: 12 },
  lightChip: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipTextMuted: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 12,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  primaryBtnText: { color: COLORS.white, fontWeight: "800" },
  outlineBtn: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlineBtnText: { color: COLORS.textPrimary, fontWeight: "800" },

  // NEW styles for Take Assessment button
  assessBtn: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  assessBtnText: { color: COLORS.white, fontWeight: "800" },

  /* Section header */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },

  /* Contact info */
  infoList: { marginTop: 4, gap: 12 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { color: COLORS.textDark, fontSize: 15, fontWeight: "600" },

  /* Skills */
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  skillText: { color: COLORS.white, fontWeight: "700", fontSize: 12 },

  /* Badges */
  badgeCount: {
    marginLeft: "auto",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeCountText: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    fontSize: 12,
  },

  badgeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    marginVertical: 6,
  },
  badgeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: { fontWeight: "800", color: COLORS.textPrimary, marginBottom: 2 },
  badgeMeta: { color: COLORS.textSecondary, fontSize: 12 },
  badgeMetaStrong: { color: COLORS.textPrimary, fontWeight: "700" },

  /* Empty */
  emptyText: { color: COLORS.textSecondary, textAlign: "center", marginTop: 6 },
});
