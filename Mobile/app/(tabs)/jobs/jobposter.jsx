// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import { Ionicons } from "@expo/vector-icons";
// import { Link } from "expo-router";
// import { useAuth } from "../../../context/AuthContext";
// import { g } from "../../../assets/styles/global";
// import COLORS from "../../../constants/colors";

// export default function JobCreate() {
//   const { axiosAuth } = useAuth();
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     category: "",
//     min: "",
//     max: "",
//     currency: "LKR",
//   });
//   const change = (k, v) => setForm({ ...form, [k]: v });

//   const submit = async () => {
//     try {
//       const payload = {
//         title: form.title,
//         description: form.description,
//         location: form.location,
//         category: form.category,
//         salaryRange: {
//           min: Number(form.min) || 0,
//           max: Number(form.max) || 0,
//           currency: form.currency,
//         },
//       };

//       const { data } = await axiosAuth.post(`/job/create`, payload);
//       const url = data?.data?.checkoutUrl;
//       if (url) await WebBrowser.openBrowserAsync(url);
//       else Alert.alert("No checkout URL returned.");
//     } catch (e) {
//       Alert.alert("Error", e?.response?.data?.message || String(e));
//     }
//   };

//   const fields = [
//     {
//       key: "title",
//       label: "Job Title",
//       icon: "create-outline",
//       placeholder: "Senior Carpenter",
//     },
//     {
//       key: "description",
//       label: "Description",
//       icon: "document-text-outline",
//       placeholder: "Responsibilities, skills, hours…",
//     },
//     {
//       key: "location",
//       label: "Location",
//       icon: "location-outline",
//       placeholder: "Colombo, Kandy…",
//     },
//     {
//       key: "category",
//       label: "Category",
//       icon: "pricetag-outline",
//       placeholder: "Construction, Driving…",
//     },
//     {
//       key: "min",
//       label: "Min Salary",
//       icon: "cash-outline",
//       placeholder: "e.g. 50000",
//       numeric: true,
//     },
//     {
//       key: "max",
//       label: "Max Salary",
//       icon: "cash-outline",
//       placeholder: "e.g. 120000",
//       numeric: true,
//     },
//     {
//       key: "currency",
//       label: "Currency",
//       icon: "wallet-outline",
//       placeholder: "LKR / USD",
//     },
//   ];

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
//       >
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header with "My Jobs" action */}
//           <View style={s.headerRow}>
//             <View style={s.titleWrap}>
//               <Ionicons
//                 name="briefcase-outline"
//                 size={18}
//                 color={COLORS.primary}
//               />
//               <Text style={s.title}>Create a Job</Text>
//             </View>
//             <Link href="./jobposterjobs" asChild>
//               <TouchableOpacity style={s.myJobsBtn} activeOpacity={0.9}>
//                 <Ionicons name="list-outline" size={16} color={COLORS.white} />
//                 <Text style={s.myJobsText}>My Jobs</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>

//           {/* Helpful banner */}
//           <View style={s.banner}>
//             <Ionicons
//               name="information-circle-outline"
//               size={16}
//               color={COLORS.primary}
//             />
//             <Text style={s.bannerText}>
//               Clear titles and detailed descriptions attract more applicants.
//             </Text>
//           </View>

//           {/* Card wrapper for the form */}
//           <View style={s.card}>
//             {/* Inline hints */}
//             <View style={s.hintsRow}>
//               <View style={s.hintPill}>
//                 <Ionicons
//                   name="cash-outline"
//                   size={14}
//                   color={COLORS.primary}
//                 />
//                 <Text style={s.hintText}>Add realistic salary range</Text>
//               </View>
//               <View style={s.hintPill}>
//                 <Ionicons
//                   name="location-outline"
//                   size={14}
//                   color={COLORS.primary}
//                 />
//                 <Text style={s.hintText}>Mention exact location</Text>
//               </View>
//             </View>

//             {/* Labeled Inputs (structure & change() unchanged) */}
//             {fields.map((f) => (
//               <View key={f.key} style={s.group}>
//                 <View style={s.labelRow}>
//                   <Ionicons
//                     name={f.icon}
//                     size={14}
//                     color={COLORS.textSecondary}
//                   />
//                   <Text style={s.label}>{f.label}</Text>
//                 </View>
//                 <TextInput
//                   style={[
//                     g.input,
//                     s.input,
//                     f.key === "description" && s.textArea,
//                     (f.key === "min" || f.key === "max") && s.numberInput,
//                   ]}
//                   placeholder={f.placeholder}
//                   placeholderTextColor={COLORS.placeholderText}
//                   value={form[f.key]}
//                   onChangeText={(v) => change(f.key, v)}
//                   keyboardType={f.numeric ? "numeric" : "default"}
//                   multiline={f.key === "description"}
//                   textAlignVertical={f.key === "description" ? "top" : "center"}
//                 />
//               </View>
//             ))}

//             {/* Footer action */}
//             <TouchableOpacity
//               onPress={submit}
//               style={[g.btn, s.submitBtn]}
//               activeOpacity={0.9}
//             >
//               <Ionicons name="card-outline" size={16} color={COLORS.white} />
//               <Text style={[g.btnText, { marginLeft: 8 }]}>
//                 Proceed to Pay & Post
//               </Text>
//             </TouchableOpacity>

//             {/* Note */}
//             <View style={s.noteRow}>
//               <Ionicons
//                 name="shield-checkmark-outline"
//                 size={14}
//                 color={COLORS.primary}
//               />
//               <Text style={s.noteText}>
//                 After successful payment via Stripe, this job will be published.
//               </Text>
//             </View>
//           </View>

//           {/* Extra UX: tips block */}
//           <View style={s.tipsBlock}>
//             <Text style={s.tipsTitle}>Tips for better job posts</Text>
//             <View style={s.tipItem}>
//               <Ionicons
//                 name="document-text-outline"
//                 size={14}
//                 color={COLORS.primary}
//               />
//               <Text style={s.tipText}>
//                 Use bullet points in description for clarity.
//               </Text>
//             </View>
//             <View style={s.tipItem}>
//               <Ionicons
//                 name="people-outline"
//                 size={14}
//                 color={COLORS.primary}
//               />
//               <Text style={s.tipText}>
//                 Specify skills, experience, and working hours.
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const s = StyleSheet.create({
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   titleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
//   title: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "800" },

//   myJobsBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.12,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   myJobsText: { color: COLORS.white, fontWeight: "800", fontSize: 12 },

//   banner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 12,
//     backgroundColor: COLORS.cardBackground,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginBottom: 12,
//   },
//   bannerText: { color: COLORS.textSecondary, fontSize: 12 },

//   card: {
//     backgroundColor: COLORS.cardBackground,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 16,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 3,
//   },

//   hintsRow: {
//     flexDirection: "row",
//     gap: 8,
//     flexWrap: "wrap",
//     marginBottom: 6,
//   },
//   hintPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: COLORS.inputBackground,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   hintText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: "700" },

//   group: { marginTop: 10 },
//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 6,
//   },
//   label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: "800" },

//   input: {
//     backgroundColor: COLORS.inputBackground,
//     borderColor: COLORS.border,
//     color: COLORS.textDark,
//   },
//   textArea: {
//     height: 120,
//     textAlignVertical: "top",
//     paddingTop: 10,
//     lineHeight: 20,
//   },
//   numberInput: {},

//   submitBtn: {
//     backgroundColor: COLORS.primary,
//     marginTop: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   noteRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 8,
//   },
//   noteText: { color: COLORS.textSecondary, fontSize: 12, flex: 1 },

//   tipsBlock: {
//     marginTop: 14,
//     backgroundColor: COLORS.cardBackground,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 14,
//     padding: 12,
//     gap: 6,
//   },
//   tipsTitle: {
//     color: COLORS.textPrimary,
//     fontWeight: "800",
//     marginBottom: 2,
//     fontSize: 14,
//   },
//   tipItem: { flexDirection: "row", alignItems: "center", gap: 8 },
//   tipText: { color: COLORS.textSecondary, fontSize: 12 },
// });
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
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { g } from "../../../assets/styles/global";
import COLORS from "../../../constants/colors";

export default function JobCreate() {
  const { axiosAuth } = useAuth();

  // (1) Reusable blank form
  const initialForm = {
    title: "",
    description: "",
    location: "",
    category: "",
    min: "",
    max: "",
    currency: "LKR",
  };

  // (2) Use initialForm
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const change = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    // (3a) Snapshot the current values that we’ll send
    const current = { ...form };

    // (3b) Clear inputs immediately after tap
    setForm(initialForm);
    setSubmitting(true);

    try {
      const payload = {
        title: current.title,
        description: current.description,
        location: current.location,
        category: current.category,
        salaryRange: {
          min: Number(current.min) || 0,
          max: Number(current.max) || 0,
          currency: current.currency,
        },
      };

      const { data } = await axiosAuth.post(`/job/create`, payload);
      const url = data?.data?.checkoutUrl;
      if (url) {
        await WebBrowser.openBrowserAsync(url);
      } else {
        Alert.alert("No checkout URL returned.");
      }
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || String(e));
      // If you want to restore what the user typed on failure, uncomment:
      // setForm(current);
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    {
      key: "title",
      label: "Job Title",
      icon: "create-outline",
      placeholder: "Senior Carpenter",
    },
    {
      key: "description",
      label: "Description",
      icon: "document-text-outline",
      placeholder: "Responsibilities, skills, hours…",
    },
    {
      key: "location",
      label: "Location",
      icon: "location-outline",
      placeholder: "Colombo, Kandy…",
    },
    {
      key: "category",
      label: "Category",
      icon: "pricetag-outline",
      placeholder: "Construction, Driving…",
    },
    {
      key: "min",
      label: "Min Salary",
      icon: "cash-outline",
      placeholder: "e.g. 50000",
      numeric: true,
    },
    {
      key: "max",
      label: "Max Salary",
      icon: "cash-outline",
      placeholder: "e.g. 120000",
      numeric: true,
    },
    {
      key: "currency",
      label: "Currency",
      icon: "wallet-outline",
      placeholder: "LKR / USD",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with "My Jobs" action */}
          <View style={s.headerRow}>
            <View style={s.titleWrap}>
              <Ionicons
                name="briefcase-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={s.title}>Create a Job</Text>
            </View>
            <Link href="./jobposterjobs" asChild>
              <TouchableOpacity style={s.myJobsBtn} activeOpacity={0.9}>
                <Ionicons name="list-outline" size={16} color={COLORS.white} />
                <Text style={s.myJobsText}>My Jobs</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Helpful banner */}
          <View style={s.banner}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={s.bannerText}>
              Clear titles and detailed descriptions attract more applicants.
            </Text>
          </View>

          {/* Card wrapper for the form */}
          <View style={s.card}>
            {/* Inline hints */}
            <View style={s.hintsRow}>
              <View style={s.hintPill}>
                <Ionicons
                  name="cash-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={s.hintText}>Add realistic salary range</Text>
              </View>
              <View style={s.hintPill}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={s.hintText}>Mention exact location</Text>
              </View>
            </View>

            {/* Labeled Inputs */}
            {fields.map((f) => (
              <View key={f.key} style={s.group}>
                <View style={s.labelRow}>
                  <Ionicons
                    name={f.icon}
                    size={14}
                    color={COLORS.textSecondary}
                  />
                  <Text style={s.label}>{f.label}</Text>
                </View>
                <TextInput
                  style={[
                    g.input,
                    s.input,
                    f.key === "description" && s.textArea,
                    (f.key === "min" || f.key === "max") && s.numberInput,
                  ]}
                  placeholder={f.placeholder}
                  placeholderTextColor={COLORS.placeholderText}
                  value={form[f.key]}
                  onChangeText={(v) => change(f.key, v)}
                  keyboardType={f.numeric ? "numeric" : "default"}
                  multiline={f.key === "description"}
                  textAlignVertical={f.key === "description" ? "top" : "center"}
                />
              </View>
            ))}

            {/* Footer action */}
            <TouchableOpacity
              onPress={submit}
              style={[g.btn, s.submitBtn, submitting && { opacity: 0.7 }]}
              activeOpacity={0.9}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="card-outline"
                    size={16}
                    color={COLORS.white}
                  />
                  <Text style={[g.btnText, { marginLeft: 8 }]}>
                    Proceed to Pay & Post
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Note */}
            <View style={s.noteRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={COLORS.primary}
              />
              <Text style={s.noteText}>
                After successful payment via Stripe, this job will be published.
              </Text>
            </View>
          </View>

          {/* Extra UX: tips block */}
          <View style={s.tipsBlock}>
            <Text style={s.tipsTitle}>Tips for better job posts</Text>
            <View style={s.tipItem}>
              <Ionicons
                name="document-text-outline"
                size={14}
                color={COLORS.primary}
              />
              <Text style={s.tipText}>
                Use bullet points in description for clarity.
              </Text>
            </View>
            <View style={s.tipItem}>
              <Ionicons
                name="people-outline"
                size={14}
                color={COLORS.primary}
              />
              <Text style={s.tipText}>
                Specify skills, experience, and working hours.
              </Text>
            </View>
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
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "800" },

  myJobsBtn: {
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
  myJobsText: { color: COLORS.white, fontWeight: "800", fontSize: 12 },

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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  hintsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 6,
  },
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

  group: { marginTop: 10 },
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
    height: 120,
    textAlignVertical: "top",
    paddingTop: 10,
    lineHeight: 20,
  },
  numberInput: {},

  submitBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  noteText: { color: COLORS.textSecondary, fontSize: 12, flex: 1 },

  tipsBlock: {
    marginTop: 14,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  tipsTitle: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    marginBottom: 2,
    fontSize: 14,
  },
  tipItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  tipText: { color: COLORS.textSecondary, fontSize: 12 },
});
