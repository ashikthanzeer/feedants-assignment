import { StyleSheet, Text, View } from "react-native";

import { CompetitionStatus } from "../types/competition";

const STATUS_META: Record<
  CompetitionStatus,
  { label: string; color: string; background: string }
> = {
  UPCOMING: {
    label: "Upcoming",
    color: "#1D4ED8",
    background: "#DBEAFE",
  },
  REGISTRATION_OPEN: {
    label: "Registrations Open",
    color: "#15803D",
    background: "#DCFCE7",
  },
  SUBMISSION_OPEN: {
    label: "Submissions Open",
    color: "#B45309",
    background: "#FEF3C7",
  },
  COMPLETED: {
    label: "Completed",
    color: "#4B5563",
    background: "#E5E7EB",
  },
};

interface StatusBadgeProps {
  status: CompetitionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status];

  return (
    <View style={[styles.badge, { backgroundColor: meta.background }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 7,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  text: {
    fontSize: 13,
    fontWeight: "700",
  },
});