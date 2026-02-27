import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function WelcomeScreen({ onStart }) {
  return (
    <View style={styles.screen}>
      {/* Fake gradient layers (no library needed) */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />

      <View style={styles.content}>
        {/* Title section */}
        <Text style={styles.kicker}>INFO5144 • Physics Game</Text>
        <Text style={styles.title}>BALL DODGE</Text>
        <Text style={styles.subtitle}>Survive the storm. Score big.</Text>

        {/* Instructions card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Play</Text>
          <Text style={styles.cardText}>• Move left / right to dodge falling balls</Text>
          <Text style={styles.cardText}>• Survive longer to earn points</Text>
          <Text style={styles.cardText}>• Bonus rewards appear as you survive</Text>
        </View>

        {/* Start button */}
        <Pressable onPress={onStart} style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}>
          <Text style={styles.startBtnText}>START GAME</Text>
        </Pressable>

        {/* Footer hint */}
        <Text style={styles.footer}>Tip: Stay near the edges to bait drops.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B1020",
    overflow: "hidden",
  },

  // Background “gradient-like” blobs
  bgLayer1: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "#6D28D9", // purple
    top: -220,
    left: -180,
    opacity: 0.35,
  },
  bgLayer2: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "#06B6D4", // cyan
    bottom: -260,
    right: -220,
    opacity: 0.30,
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 70,
    paddingBottom: 34,
    justifyContent: "space-between",
  },

  kicker: {
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1.5,
    fontSize: 12,
    textTransform: "uppercase",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 10,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
  },

  card: {
    marginTop: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 0.3,
  },

  cardText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },

  startBtn: {
    marginTop: 22,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#22C55E", // green
    shadowColor: "#22C55E",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },

  startBtnText: {
    color: "#07110A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },

  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 12,
  },
});