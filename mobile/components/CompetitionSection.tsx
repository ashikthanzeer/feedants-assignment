import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CompetitionSectionProps {
  title: string;
  children: ReactNode;
}

export default function CompetitionSection({
  title,
  children,
}: CompetitionSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.2,
    marginBottom: 12,
  },
});