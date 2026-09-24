import { StyleSheet, Text, View } from "react-native";

interface CompetitionHeaderProps {
  category: string;
  title: string;
  type: string;
}

export default function CompetitionHeader({
  category,
  title,
  type,
}: CompetitionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.category}>{category.toUpperCase()}</Text>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{type}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  category: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: "#7C3AED",
    marginBottom: 8,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
    color: "#0F172A",
  },

  typeBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
});