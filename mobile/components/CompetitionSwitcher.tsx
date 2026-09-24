import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CompetitionStatus, CompetitionSummary } from "../types/competition";

const STATUS_COLORS: Record<CompetitionStatus, string> = {
  UPCOMING: "#3B82F6",
  REGISTRATION_OPEN: "#16A34A",
  SUBMISSION_OPEN: "#D97706",
  COMPLETED: "#6B7280",
};

interface CompetitionSwitcherProps {
  competitions: CompetitionSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CompetitionSwitcher({
  competitions,
  selectedId,
  onSelect,
}: CompetitionSwitcherProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Competitions</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {competitions.map((competition) => {
          const selected = competition.id === selectedId;
          const dotColor =
            competition.status === "REGISTRATION_OPEN" &&
            competition.availability.isFull
              ? "#EF4444"
              : STATUS_COLORS[competition.status];

          return (
            <TouchableOpacity
              key={competition.id}
              onPress={() => onSelect(competition.id)}
              style={[styles.chip, selected && styles.chipSelected]}
              activeOpacity={0.7}
            >
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
                numberOfLines={1}
              >
                {competition.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#94A3B8",
    marginHorizontal: 20,
    marginBottom: 8,
  },

  row: {
    paddingHorizontal: 20,
    gap: 8,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    maxWidth: 220,
  },

  chipSelected: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },

  chipTextSelected: {
    color: "#FFFFFF",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    flexShrink: 1,
  },
});