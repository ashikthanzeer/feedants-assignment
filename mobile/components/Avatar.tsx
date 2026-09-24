import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { getInitials, isValidImageUrl } from "../utils/format";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

export default function Avatar({ name, imageUrl, size = 48 }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = isValidImageUrl(imageUrl) && !failed;

  if (showImage) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#F1F5F9",
  },

  fallback: {
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    fontWeight: "700",
    color: "#7C3AED",
  },
});