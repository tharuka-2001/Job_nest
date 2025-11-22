import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { g } from "../../../assets/styles/global";
import COLORS from "../../../constants/colors";

export default function Assess() {
  const { axiosAuth } = useAuth();
  const router = useRouter();

  const [badgeKey, setBadgeKey] = useState("carpenter");
  const [score, setScore] = useState("80");
  const [evidence, setEvidence] = useState("");

  const submit = async () => {
    try {
      const evidenceUrls = evidence
        ? evidence.split(",").map((s) => s.trim())
        : [];
      const { data } = await axiosAuth.post(`/badges/assess`, {
        badgeKey,
        score: Number(score),
        evidenceUrls,
      });

      Alert.alert(
        "Submitted",
        data?.message || "Assessment submitted successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              // reset fields & go back to previous screen (jobseekerprofile.jsx)
              setBadgeKey("");
              setScore("");
              setEvidence("");
              router.back();
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || String(e));
    }
  };

  const quickKeys = ["carpenter", "driver", "cook", "electrician"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={s.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={s.backBtn}
              activeOpacity={0.9}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <Text style={s.title}>Take Assessment</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Info banner */}
          <View style={s.banner}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.bannerText}>
              Provide your skill, a score (0–100), and any proof links (comma
              separated).
            </Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {/* Badge key */}
            <View style={s.group}>
              <View style={s.labelRow}>
                <Ionicons
                  name="pricetag-outline"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Text style={s.label}>Badge / Skill</Text>
              </View>
              <TextInput
                style={[g.input, s.input]}
                placeholder="e.g., carpenter"
                placeholderTextColor={COLORS.placeholderText}
                value={badgeKey}
                onChangeText={setBadgeKey}
              />
              {/* quick chips */}
              <View style={s.chipsRow}>
                {quickKeys.map((k) => (
                  <TouchableOpacity
                    key={k}
                    onPress={() => setBadgeKey(k)}
                    style={[
                      s.chip,
                      badgeKey.toLowerCase() === k ? s.chipActive : null,
                    ]}
                  >
                    <Text
                      style={[
                        s.chipText,
                        badgeKey.toLowerCase() === k
                          ? { color: COLORS.white }
                          : null,
                      ]}
                    >
                      {k}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Score */}
            <View style={s.group}>
              <View style={s.labelRow}>
                <Ionicons
                  name="speedometer-outline"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Text style={s.label}>Score (0–100)</Text>
              </View>
              <TextInput
                style={[g.input, s.input]}
                placeholder="80"
                placeholderTextColor={COLORS.placeholderText}
                value={score}
                onChangeText={setScore}
                keyboardType="numeric"
              />
              <View style={s.hintsRow}>
                {[60, 70, 80, 90].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={s.hintPill}
                    onPress={() => setScore(String(n))}
                  >
                    <Ionicons
                      name="flash-outline"
                      size={12}
                      color={COLORS.primary}
                    />
                    <Text style={s.hintText}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Evidence */}
            <View style={s.group}>
              <View style={s.labelRow}>
                <Ionicons
                  name="link-outline"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Text style={s.label}>Evidence URLs</Text>
              </View>
              <TextInput
                style={[g.input, s.input, s.textArea]}
                placeholder="https://link1, https://link2"
                placeholderTextColor={COLORS.placeholderText}
                value={evidence}
                onChangeText={setEvidence}
                multiline
              />
              <Text style={s.helpText}>
                Add one or more links separated by commas (portfolio, video, or
                references).
              </Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={submit}
              style={[g.btn, s.submitBtn]}
              activeOpacity={0.9}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#fff"
              />
              <Text style={[g.btnText, { marginLeft: 8 }]}>
                Submit assessment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  title: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  bannerText: { color: COLORS.textSecondary, fontSize: 12 },

  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },

  group: { marginBottom: 12 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: "800" },

  input: {
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    color: COLORS.textDark,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
    paddingTop: 10,
    lineHeight: 20,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { color: COLORS.textSecondary, fontWeight: "700", fontSize: 12 },

  hintsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hintText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: "700" },

  helpText: { marginTop: 6, color: COLORS.textSecondary, fontSize: 12 },

  submitBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
