import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CompetitionSwitcher from "./components/CompetitionSwitcher";
import CompetitionScreen from "./screens/CompetitionScreen";
import { listCompetitions } from "./services/competitionApi";
import { CompetitionSummary } from "./types/competition";

const USER_ID = process.env.EXPO_PUBLIC_USER_ID!;
if (!USER_ID) {
  throw new Error('EXPO_PUBLIC_USER_ID environment variable is required');
}

type LoadState = "loading" | "error" | "ready";

function pickDefaultCompetition(
  competitions: CompetitionSummary[]
): string | null {
  return (
    competitions.find(
      (competition) =>
        competition.status === "REGISTRATION_OPEN" &&
        !competition.availability.isFull
    )?.id ??
    competitions.find(
      (competition) => competition.status === "REGISTRATION_OPEN"
    )?.id ??
    competitions[0]?.id ??
    null
  );
}

export default function App() {
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await listCompetitions();

        if (cancelled) {
          return;
        }

        setCompetitions(list);
        setSelectedId((current) =>
          current && list.some((competition) => competition.id === current)
            ? current
            : pickDefaultCompetition(list)
        );
        setLoadState("ready");
      } catch (error) {
        console.error("Failed to load competitions:", error);
        if (!cancelled) {
          setLoadState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = useCallback(() => {
    setLoadState("loading");
    setReloadKey((key) => key + 1);
  }, []);

  if (loadState === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (loadState === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>Can&apos;t load competitions</Text>
        <Text style={styles.centerSub}>
          Check that the server is running and try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <CompetitionSwitcher
          competitions={competitions}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </View>

      {selectedId ? (
        <CompetitionScreen
          key={selectedId}
          competitionId={selectedId}
          userId={USER_ID}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  topBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 62 : 26,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 32,
  },

  centerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  centerSub: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#0F172A",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});