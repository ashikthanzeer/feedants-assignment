import { StyleSheet, Text, View } from "react-native";

import { formatDateLong } from "../utils/format";
import CompetitionSection from "./CompetitionSection";

interface CompetitionDatesProps {
  registrationStart: string;
  registrationEnd: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;
}

interface DateRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

function DateRow({ label, value, isLast }: DateRowProps) {
  return (
    <View style={[styles.row, isLast ? undefined : styles.rowBorder]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function CompetitionDates({
  registrationStart,
  registrationEnd,
  submissionStart,
  submissionEnd,
  resultDate,
}: CompetitionDatesProps) {
  return (
    <CompetitionSection title="Dates & Deadlines">
      <DateRow label="Registrations open" value={formatDateLong(registrationStart)} />
      <DateRow label="Registrations close" value={formatDateLong(registrationEnd)} />
      <DateRow
        label="Submissions"
        value={`${formatDateLong(submissionStart)} – ${formatDateLong(submissionEnd)}`}
      />
      <DateRow label="Results announced" value={formatDateLong(resultDate)} isLast />
    </CompetitionSection>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 3,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
});