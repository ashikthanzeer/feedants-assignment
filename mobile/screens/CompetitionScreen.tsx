import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CompetitionDates from "../components/CompetitionDates";
import CompetitionHeader from "../components/CompetitionHeader";
import CompetitionSection from "../components/CompetitionSection";
import CompetitionStats from "../components/CompetitionStats";
import JudgeCard from "../components/JudgeCard";
import PreviousWinners from "../components/PreviousWinners";
import RegisterBar from "../components/RegisterBar";
import RewardsList from "../components/RewardsList";
import StatusBadge from "../components/StatusBadge";

import {
  ApiError,
  getCompetition,
  registerCompetition,
} from "../services/competitionApi";
import { CompetitionResponse } from "../types/competition";

type LoadState = "loading" | "loaded" | "error" | "not-found";

interface CompetitionScreenProps {
  competitionId: string;
  userId: string;
}

export default function CompetitionScreen({
  competitionId,
  userId,
}: CompetitionScreenProps) {
  const [data, setData] = useState<CompetitionResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [refreshing, setRefreshing] = useState(false);

  const [registering, setRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  const loadedOnce = useRef(false);

  const fetchCompetition = useCallback(async () => {
    const response = await getCompetition(competitionId, userId);
    setData(response);
    setLoadState("loaded");
    setRegisterMessage("");
    loadedOnce.current = true;
  }, [competitionId, userId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getCompetition(competitionId, userId);

        if (cancelled) {
          return;
        }

        setData(response);
        setLoadState("loaded");
        setRegisterMessage("");
        loadedOnce.current = true;
      } catch (error) {
        if (cancelled || loadedOnce.current) {
          return;
        }

        const notFound = error instanceof ApiError && error.status === 404;
        setLoadState(notFound ? "not-found" : "error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [competitionId, userId]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCompetition().catch(() => undefined);
    setRefreshing(false);
  }, [fetchCompetition]);

  const handleRegister = useCallback(async () => {
    if (!data || registering) {
      return;
    }

    setRegistering(true);
    setRegisterMessage("");

    try {
      await registerCompetition(competitionId, userId);
      await fetchCompetition();
    } catch (error) {
      setRegisterMessage(
        error instanceof ApiError
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setRegistering(false);
    }
  }, [data, registering, competitionId, userId, fetchCompetition]);

  if (loadState === "loading" && !data) {
    return (
      <Center>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.centerSub}>Loading competition…</Text>
      </Center>
    );
  }

  if (loadState === "error") {
    return (
      <Center>
        <Text style={styles.centerTitle}>Something went wrong</Text>
        <Text style={styles.centerSub}>
          We couldn&apos;t load this competition.
        </Text>
        <RetryButton onPress={fetchCompetition} />
      </Center>
    );
  }

  if (loadState === "not-found") {
    return (
      <Center>
        <Text style={styles.centerTitle}>Competition not found</Text>
        <Text style={styles.centerSub}>
          This competition may have been removed.
        </Text>
        <RetryButton onPress={fetchCompetition} />
      </Center>
    );
  }

  if (!data) {
    return null;
  }

  const {
    competition,
    status,
    availability,
    user,
  } = data;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#7C3AED"
          />
        }
      >
        <CompetitionHeader
          category={competition.category}
          title={competition.title}
          type={competition.type}
        />

        <View style={styles.badgeRow}>
          <StatusBadge status={status} />
        </View>

        <CompetitionStats
          prizePool={competition.prizePool}
          entryFee={competition.entryFee}
          registered={availability.registered}
          capacity={availability.capacity}
          remaining={availability.remaining}
          isFull={availability.isFull}
        />

        <CompetitionDates
          registrationStart={competition.registrationStart}
          registrationEnd={competition.registrationEnd}
          submissionStart={competition.submissionStart}
          submissionEnd={competition.submissionEnd}
          resultDate={competition.resultDate}
        />

        <JudgeCard judge={competition.judge} />

        <CompetitionSection title="Description">
          <Text style={styles.bodyText}>{competition.description}</Text>
        </CompetitionSection>

        {renderBulletSection(
          "Judging Parameters",
          competition.judgingParameters,
          "No judging parameters published yet."
        )}

        {renderBulletSection("Rules", competition.rules, "No rules published yet.")}

        <RewardsList rewards={competition.rewards} />

        <PreviousWinners winners={competition.previousWinners} />
      </ScrollView>

      <RegisterBar
        status={status}
        isRegistered={user.isRegistered}
        isFull={availability.isFull}
        entryFee={competition.entryFee}
        registrationStart={competition.registrationStart}
        registering={registering}
        message={registerMessage}
        onPress={handleRegister}
      />
    </View>
  );

  function renderBulletSection(
    title: string,
    items: string[],
    emptyText: string
  ) {
    return (
      <CompetitionSection title={title}>
        {items.length === 0 ? (
          <Text style={styles.bodyText}>{emptyText}</Text>
        ) : (
          items.map((item, index) => (
            <View key={`${title}-${index}`} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bodyText}>{item}</Text>
            </View>
          ))
        )}
      </CompetitionSection>
    );
  }
}

function Center({ children }: { children: ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

function RetryButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.retryButton} onPress={onPress}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },

  badgeRow: {
    marginBottom: 16,
  },

  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7C3AED",
    marginTop: 7,
    marginRight: 10,
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
    marginTop: 12,
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