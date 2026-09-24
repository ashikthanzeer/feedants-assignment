import { StyleSheet, Text, View } from "react-native";

import { Winner } from "../types/competition";
import Avatar from "./Avatar";
import CompetitionSection from "./CompetitionSection";

interface PreviousWinnersProps {
  winners: Winner[];
}

export default function PreviousWinners({ winners }: PreviousWinnersProps) {
  return (
    <CompetitionSection title="Previous Winners">
      {winners.length === 0 ? (
        <Text style={styles.empty}>No winners yet — be the first!</Text>
      ) : (
        winners.map((winner, index) => (
          <View
            key={`${winner.name}-${winner.position}`}
            style={[styles.row, index === winners.length - 1 ? undefined : styles.rowBorder]}
          >
            <Avatar name={winner.name} imageUrl={winner.image} size={44} />

            <View style={styles.details}>
              <Text style={styles.name}>{winner.name}</Text>
              <Text style={styles.position}>{winner.position} place</Text>
            </View>
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
    paddingVertical: 10,
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  position: {
    fontSize: 12,
    color: "#7C3AED",
    marginTop: 1,
  },

  empty: {
    fontSize: 14,
    color: "#64748B",
  },
});