import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { g } from "../../../assets/styles/global";
import { API } from "../../../constants/config";
import COLORS from "../../../constants/colors";
import axios from "axios";

export default function ApplyJob() {
  const params = useLocalSearchParams();
  const { id } = params; // keep original usage for submit()
  const { token } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState(null);

  // OPTIONAL details from route to enrich UI (won't affect functions)
  const {
    title,
    location,
    category,
    currency,
    min,
    max,
    org,
    createdAt,
    status,
    appliedCount,
  } = params;

  const pick = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/*",
      ],
    });
    if (res.type === "success") setFile(res);
  };

  const submit = async () => {
    try {
      const fd = new FormData();
      fd.append("jobId", id);
      fd.append("coverLetter", coverLetter);
      if (file) {
        fd.append("resume", {
          uri: file.uri,
          name: file.name || "resume.pdf",
          type: file.mimeType || "application/pdf",
        });
      }
      const { data } = await axios.post(`${API}/job/apply`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Applied", "Application submitted");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || String(e));
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 44 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={s.topBar}>
        <View style={s.titleWrap}>
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color={COLORS.primary}
          />
          <Text style={s.title}>Apply for Job</Text>
        </View>
      </View>

      {/* Job summary (pure UI; pulls optional params if provided) */}
      <View style={s.summaryCard}>
        <Text style={s.jobTitle}>{title || "Job Opportunity"}</Text>

        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Ionicons
              name="business-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.summaryText}>{org || "Hiring organization"}</Text>
          </View>
          <View style={s.summaryItem}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.summaryText}>
              {location.split(",")[0] || "Location TBD"}
            </Text>
          </View>
        </View>

        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
            <Text style={s.summaryText}>
              {min && max
                ? `${currency || ""}${min} - ${max}`
                : "Salary: Negotiable"}
            </Text>
          </View>
          <View style={s.summaryItem}>
            <Ionicons
              name="pricetag-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.summaryText}>{category || "General"}</Text>
          </View>
        </View>

        <View style={s.chipsRow}>
          {status ? (
            <View style={s.chipGreen}>
              <Text style={s.chipGreenText}>{String(status)}</Text>
            </View>
          ) : null}
          {createdAt ? (
            <View style={s.chipOutline}>
              <Ionicons
                name="time-outline"
                size={12}
                color={COLORS.textSecondary}
              />
              <Text style={s.chipOutlineText}>
                {new Date(String(createdAt)).toLocaleDateString()}
              </Text>
            </View>
          ) : null}
          {appliedCount ? (
            <View style={s.chipOutline}>
              <Ionicons
                name="people-outline"
                size={12}
                color={COLORS.textSecondary}
              />
              <Text style={s.chipOutlineText}>{appliedCount} applied</Text>
            </View>
          ) : null}
        </View>

        {/* Perks / info (advanced-looking but static UI) */}
        <View style={s.perksRow}>
          <View style={s.perk}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.perkText}>Secure application</Text>
          </View>
          <View style={s.perk}>
            <Ionicons name="flash-outline" size={16} color={COLORS.primary} />
            <Text style={s.perkText}>Fast review</Text>
          </View>
          <View style={s.perk}>
            <Ionicons
              name="document-text-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.perkText}>Cover letter helps</Text>
          </View>
        </View>
      </View>

      {/* Application form card */}
      <View style={s.card}>
        <Text style={s.sectionLabel}>Cover Letter</Text>
        <Text style={s.helpText}>
          Share a short note on why you’re a great fit. Keep it concise and
          relevant.
        </Text>

        <View style={s.textAreaWrap}>
          <TextInput
            style={[g.input, s.textArea]}
            placeholder="Write your cover letter..."
            placeholderTextColor={COLORS.placeholderText}
            multiline
            value={coverLetter}
            onChangeText={setCoverLetter}
          />
          <Text style={s.counter}>{coverLetter.length}/1000</Text>
        </View>

        <Text style={[s.sectionLabel, { marginTop: 14 }]}>
          Resume (optional)
        </Text>
        <Text style={s.helpText}>
          Accepted: PDF, DOC, DOCX, images • Max 10MB
        </Text>

        {file ? (
          <View style={s.filePill}>
            <Ionicons
              name="document-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <TouchableOpacity
              onPress={() => setFile(null)}
              style={s.removeBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={pick}
          style={[g.btn, s.pickBtn]}
          activeOpacity={0.9}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={16}
            color={COLORS.white}
          />
          <Text style={[g.btnText, { marginLeft: 8 }]}>
            {file ? "Change file" : "Pick Resume"}
          </Text>
        </TouchableOpacity>

        <View style={s.divider} />

        {/* Extra helpful hints (advanced UI) */}
        <View style={s.infoList}>
          <View style={s.infoItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.infoText}>
              Double-check contact details inside your resume.
            </Text>
          </View>
          <View style={s.infoItem}>
            <Ionicons
              name="chatbubbles-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.infoText}>
              Mention availability and earliest start date.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={submit}
          style={[g.btn, s.submitBtn]}
          activeOpacity={0.9}
        >
          <Text style={g.btnText}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "800" },

  /* Summary */
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  jobTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },
  summaryItem: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  summaryText: { color: COLORS.textDark, fontWeight: "600" },
  chipsRow: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  chipGreen: {
    backgroundColor: "#e8f7ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipGreenText: { fontSize: 12, color: COLORS.primary, fontWeight: "700" },
  chipOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  chipOutlineText: { fontSize: 12, color: COLORS.textSecondary },

  perksRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },
  perk: {
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
  perkText: { color: COLORS.textSecondary, fontWeight: "700", fontSize: 12 },

  /* Form card */
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionLabel: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  helpText: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 },

  textAreaWrap: { position: "relative" },
  textArea: { height: 140, textAlignVertical: "top" },
  counter: {
    position: "absolute",
    right: 10,
    bottom: 8,
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  filePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  fileName: { color: COLORS.textPrimary, flex: 1, fontWeight: "600" },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },

  pickBtn: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },

  infoList: { gap: 10 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { color: COLORS.textSecondary, flex: 1 },

  submitBtn: { marginTop: 6, backgroundColor: COLORS.primary },
});
