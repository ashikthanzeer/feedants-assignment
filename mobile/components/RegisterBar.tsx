import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CompetitionStatus } from "../types/competition";
import { formatDate, formatINR } from "../utils/format";

interface RegisterBarProps {
  status: CompetitionStatus;
  isRegistered: boolean;
  isFull: boolean;
  entryFee: number;
  registrationStart: string;
  registering: boolean;
  message: string;
  onPress: () => void;
}

export default function RegisterBar({
  status,
  isRegistered,
  isFull,
  entryFee,
  registrationStart,
  registering,
  message,
  onPress,
}: RegisterBarProps) {
  const cta = resolveCta();

  function resolveCta() {
    if (isRegistered) {
      return { label: "You're registered", disabled: true, primary: false };
    }

    if (status === "UPCOMING") {
      return {
        label: `Registrations open ${formatDate(registrationStart)}`,
        disabled: true,
        primary: false,
      };
    }

    if (status === "REGISTRATION_OPEN") {
      if (isFull) {
        return { label: "Competition full", disabled: true, primary: false };
      }

      return {
        label: `Register now · ${formatINR(entryFee)}`,
        disabled: false,
        primary: true,
      };
    }

    if (status === "SUBMISSION_OPEN") {
      return { label: "Registrations closed", disabled: true, primary: false };
    }

    return { label: "Competition completed", disabled: true, primary: false };
  }

  const buttonDisabled = cta.disabled || registering;

  return (
    <View style={styles.bar}>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity
        style={[
          styles.button,
          cta.primary ? styles.buttonPrimary : styles.buttonMuted,
          buttonDisabled && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={buttonDisabled}
        activeOpacity={0.85}
      >
        {registering ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.buttonText, cta.primary ? undefined : styles.buttonTextMuted]}>
            {cta.label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 26 : 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E2E8F0",
  },

  message: {
    fontSize: 13,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 10,
  },

  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPrimary: {
    backgroundColor: "#7C3AED",
  },

  buttonMuted: {
    backgroundColor: "#F1F5F9",
  },

  buttonDisabled: {
    opacity: 1,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  buttonTextMuted: {
    color: "#64748B",
  },
});