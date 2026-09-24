import { StyleSheet, Text, View } from "react-native";

import { Judge } from "../types/competition";
import Avatar from "./Avatar";
import CompetitionSection from "./CompetitionSection";

interface JudgeCardProps {
  judge: Judge;
}

export default function JudgeCard({ judge }: JudgeCardProps) {
  return (
    <CompetitionSection title="Judge">
      <View style={styles.row}>
        <Avatar name={judge.name} imageUrl={judge.image} size={52} />

        <View style={styles.details}>
          <Text style={styles.name}>{judge.name}</Text>
          <Text style={styles.role}>{judge.role}</Text>
          <Text style={styles.experience}>{judge.experience}</Text>
        </View>
      </View>
    </CompetitionSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  details: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  role: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },

  experience: {
    fontSize: 13,
    color: "#7C3AED",
    marginTop: 2,
  },
});