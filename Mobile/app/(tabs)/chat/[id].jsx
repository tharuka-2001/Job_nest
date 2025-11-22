import React, { useEffect, useRef, useState } from "react";
// NEW imports at the top

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import useSocket from "../../../hooks/useSocket";
import { g } from "../../../assets/styles/global";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { API } from "../../../constants/config";
import COLORS from "../../../constants/colors";

export default function ChatRoom() {
  const { id } = useLocalSearchParams();
  const { token, axiosAuth, me } = useAuth();
  const socketRef = useSocket(token);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);
  const insets = useSafeAreaInsets();

  // --- original data load (unchanged) ---
  useEffect(() => {
    (async () => {
      const { data } = await axiosAuth.get(`/chat/conversations/${id}`);
      setMessages(data.data || []);
      // ensure we scroll after first paint
      setTimeout(scrollToEnd, 0);
    })();
  }, [id]);

  // --- original socket wiring (unchanged) ---
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    s.emit("join_conversation", { conversationId: id });
    const onNew = (m) => {
      setMessages((prev) => [...prev, m]);
      // scroll to bottom when a new message arrives
      setTimeout(scrollToEnd, 0);
    };
    s.on("new_message", onNew);
    return () => {
      s.off("new_message", onNew);
    };
  }, [socketRef.current, id]);

  // --- original send (unchanged) ---
  const send = () => {
    if (!msg.trim()) return;
    socketRef.current.emit("send_message", { conversationId: id, text: msg });
    setMsg("");
    setTimeout(scrollToEnd, 0);
  };

  // --- original sendFile (unchanged) ---
  const sendFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });
    if (res.type !== "success") return;
    const fd = new FormData();
    fd.append("file", {
      uri: res.uri,
      name: res.name,
      type: res.mimeType || "application/octet-stream",
    });
    const up = await axios.post(`${API}/chat/attachments`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const url = up.data?.data?.fileUrl;
    socketRef.current.emit("send_message", {
      conversationId: id,
      fileUrl: url,
      text: "",
    });
    setTimeout(scrollToEnd, 0);
  };

  // --- UX helpers (no logic change) ---
  const scrollToEnd = () => {
    if (!listRef.current) return;
    listRef.current.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        s.bubble,
        String(item.sender?._id) === String(me?._id) ? s.mine : s.other,
      ]}
    >
      {item.text ? <Text style={s.msgText}>{item.text}</Text> : null}
      {item.fileUrl ? (
        <View style={s.attachment}>
          <Ionicons name="document-outline" size={14} color={COLORS.primary} />
          <Text style={s.attachmentText} numberOfLines={1}>
            Attachment: {item.fileUrl}
          </Text>
        </View>
      ) : null}
      <View style={s.metaRow}>
        <Ionicons name="time-outline" size={10} color={COLORS.textSecondary} />
        <Text style={s.timeText}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* KeyboardAvoidingView lifts the composer above the keyboard */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View
          style={[
            g.screen,
            { backgroundColor: COLORS.background, paddingHorizontal: 0 },
          ]}
        >
          {/* Header */}
          <View style={s.header}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>
                {(me?.profile?.fullName || me?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>Messages</Text>
              <Text style={s.subtitle}>
                Secure & private • {messages.length} msgs
              </Text>
            </View>
            <View style={s.onlineDot} />
          </View>

          {/* Info banner */}
          <View style={s.banner}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={COLORS.primary}
            />
            <Text style={s.bannerText}>
              Files are scanned and stored securely.
            </Text>
          </View>

          {/* Messages list */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m._id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 12, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
          />

          {/* Composer fixed at bottom, moves with keyboard */}
          <View style={s.composerWrap}>
            {/* pill container for input + buttons */}
            <View style={s.inputPill}>
              <Ionicons
                name="happy-outline"
                size={20}
                color={COLORS.textSecondary}
                style={{ marginHorizontal: 6 }}
              />
              <TextInput
                style={s.input}
                placeholder="Type a message…"
                placeholderTextColor={COLORS.placeholderText}
                value={msg}
                onChangeText={setMsg}
                multiline
                maxHeight={110}
              />
              <TouchableOpacity
                onPress={sendFile}
                style={s.iconBtn}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="attach-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={send}
              style={s.sendFab}
              activeOpacity={0.9}
            >
              <Ionicons name="paper-plane-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { color: COLORS.textPrimary, fontWeight: "800" },
  title: { color: COLORS.textPrimary, fontWeight: "800", fontSize: 16 },
  subtitle: { color: COLORS.textSecondary, fontSize: 12 },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22c55e",
  },

  /* Banner */
  banner: {
    marginHorizontal: 16,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bannerText: { color: COLORS.textSecondary, fontSize: 12 },

  /* Messages */
  bubble: {
    padding: 10,
    borderRadius: 14,
    marginVertical: 4,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#e3f2fd",
    borderTopRightRadius: 4,
  },
  other: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  msgText: { color: COLORS.textDark },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  attachmentText: { color: COLORS.primary, fontWeight: "600", flexShrink: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  timeText: { fontSize: 10, color: COLORS.textSecondary },

  /* Composer */
  composerWrap: {
    padding: 12,
    paddingTop: 8,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputPill: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingVertical: 8,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    marginRight: 6,
    color: COLORS.textDark,
    paddingTop: 4,
    paddingBottom: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sendFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
});
