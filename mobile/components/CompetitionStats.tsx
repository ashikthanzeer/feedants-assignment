import { StyleSheet, Text, View } from "react-native";

import { formatINR } from "../utils/format";

interface CompetitionStatsProps {
  prizePool: number;
  entryFee: number;
  registered: number;
  capacity: number;
  remaining: number;
  isFull: boolean;
}

export default function CompetitionStats({
  prizePool,
  entryFee,
  registered,
  capacity,
  remaining,
  isFull,
}: CompetitionStatsProps) {
  const fillRatio = capacity > 0 ? Math.min(registered / capacity, 1) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.value}>{formatINR(prizePool)}</Text>
          <Text style={styles.label}>Prize Pool</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.value}>{formatINR(entryFee)}</Text>
          <Text style={styles.label}>Entry Fee</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text
            style={[styles.value, isFull ? styles.valueFull : undefined]}
          >
            {remaining}
          </Text>
          <Text style={styles.label}>Slots Left</Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${fillRatio * 100}%` },
              isFull && styles.progressFillFull,
            ]}
          />
        </View>

        <Text style={styles.progressLabel}>
          {isFull
            ? "All slots filled"
            : `${registered} of ${capacity} spots taken`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  value: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },

  valueFull: {
    color: "#DC2626",
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  divider: {
    width: 1,
    height: 34,
    backgroundColor: "#E2E8F0",
  },

  progressWrap: {
    marginTop: 16,
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7C3AED",
  },

  progressFillFull: {
    backgroundColor: "#DC2626",
  },

  progressLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B",
  },
});