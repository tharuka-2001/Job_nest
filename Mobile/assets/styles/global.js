import { StyleSheet } from "react-native";
export const g = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  btn: {
    backgroundColor: "#2f6fed",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    marginRight: 8,
    marginVertical: 4,
  },
});
