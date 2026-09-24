import { StyleSheet, Text, View } from "react-native";

import { Reward } from "../types/competition";
import { formatINR } from "../utils/format";
import CompetitionSection from "./CompetitionSection";

interface RewardsListProps {
  rewards: Reward[];
}

const MEDAL_COLORS: Record<number, string> = {
  1: "#B45309",
  2: "#64748B",
  3: "#B7791F",
};

export default function RewardsList({ rewards }: RewardsListProps) {
  return (
    <CompetitionSection title="Rewards">
      {rewards.length === 0 ? (
        <Text style={styles.empty}>No rewards published yet.</Text>
      ) : (
        rewards.map((reward, index) => (
          <View
            key={reward.position}
            style={[styles.row, index === rewards.length - 1 ? undefined : styles.rowBorder]}
          >
            <View
              style={[
                styles.positionBadge,
                { backgroundColor: MEDAL_COLORS[reward.position] ?? "#475569" },
              ]}
            >
              <Text style={styles.positionText}>#{reward.position}</Text>
            </View>

            <Text style={styles.label}>{reward.label}</Text>

            <Text style={styles.amount}>{formatINR(reward.amount)}</Text>
          </View>
        ))
      )}
    </CompetitionSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },

  positionBadge: {
    width: 34,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  positionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  amount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  empty: {
    fontSize: 14,
    color: "#64748B",
  },
});