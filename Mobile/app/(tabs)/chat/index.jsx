import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { g } from "../../../assets/styles/global";
import COLORS from "../../../constants/colors";

export default function Conversations() {
  const { axiosAuth } = useAuth();
  const [list, setList] = useState([]);
  const [otherUserId, setOtherUserId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const params = useLocalSearchParams();
  const withParam = Array.isArray(params.with) ? params.with[0] : params.with;

  const load = async () => {
    const { data } = await axiosAuth.get(`/chat/conversations`);
    setList(data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (withParam) startConversation(withParam);
  }, [withParam]);

  const startConversation = async (userId) => {
    try {
      const { data } = await axiosAuth.post(`/chat/conversations`, {
        otherUserId: userId,
      });
      router.push(`/chat/${data.data._id}`);
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || String(e));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const names = item.participants
      ?.map((p) => p?.profile?.fullName || p?.email || "User")
      .join(", ");

    const avatarLetter = (
      item.participants?.[0]?.profile?.fullName ||
      item.participants?.[0]?.email ||
      "U"
    )
      .charAt(0)
      .toUpperCase();

    return (
      <Link href={{ pathname: "/chat/[id]", params: { id: item._id } }} asChild>
        <TouchableOpacity activeOpacity={0.9} style={s.card}>
          <View style={s.cardLeft}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{avatarLetter}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.nameText} numberOfLines={1}>
                {names}
              </Text>
              <Text style={s.subText} numberOfLines={1}>
                Tap to open chat • secure & private
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View
      style={[g.screen, { backgroundColor: COLORS.background, paddingTop: 8 }]}
    >
      {/* Header */}
      <View style={s.headerRow}>
        <View style={s.titleWrap}>
          <Ionicons
            name="chatbubbles-outline"
            size={18}
            color={COLORS.primary}
          />
          <Text style={s.title}>Conversations</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={s.composeBtn}
          onPress={() => inputRef.current?.focus()}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.white} />
          <Text style={s.composeText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Info banner */}
      <View style={s.banner}>
        <Ionicons
          name="shield-checkmark-outline"
          size={14}
          color={COLORS.primary}
        />
        <Text style={s.bannerText}>
          Messages and shared files are stored securely.
        </Text>
      </View>

      {/* Start new conversation */}
      <View style={[g.rowBetween, s.newRow]}>
        <View style={s.inputWrap}>
          <Ionicons
            name="person-add-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <TextInput
            ref={inputRef}
            placeholder="Enter user ID to start chat"
            placeholderTextColor={COLORS.placeholderText}
            style={[g.input, s.input]}
            value={otherUserId}
            onChangeText={setOtherUserId}
            returnKeyType="go"
            onSubmitEditing={() => startConversation(otherUserId)}
          />
        </View>
        <TouchableOpacity
          onPress={() => startConversation(otherUserId)}
          style={[g.btn, s.startBtn]}
          activeOpacity={0.9}
        >
          <Ionicons name="paper-plane-outline" size={16} color="#fff" />
          <Text style={[g.btnText, { marginLeft: 6 }]}>Start</Text>
        </TouchableOpacity>
      </View>

      {/* Conversations list */}
      <FlatList
        data={list}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={COLORS.textSecondary}
            />
            <Text style={s.emptyText}>
              No conversations yet. Start one above.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "800" },
  composeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  composeText: { color: COLORS.white, fontWeight: "800", fontSize: 12 },

  /* Banner */
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
    marginBottom: 10,
  },
  bannerText: { color: COLORS.textSecondary, fontSize: 12 },

  /* New conversation row */
  newRow: { marginBottom: 8 },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 44,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
    color: COLORS.textDark,
    marginTop: 0,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  /* List cards */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginVertical: 6,
    justifyContent: "space-between",
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.textPrimary, fontWeight: "800" },
  nameText: { color: COLORS.textPrimary, fontWeight: "700", fontSize: 14 },
  subText: { color: COLORS.textSecondary, fontSize: 12 },

  /* Empty */
  emptyWrap: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },
  emptyText: { color: COLORS.textSecondary, fontSize: 12 },
});
