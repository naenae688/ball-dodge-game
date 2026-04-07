import React from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

export default function GameOverlay({ gameOver, score, overlayOpacity, onRestart }) {
  if (!gameOver) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Text style={styles.title}>GAME OVER</Text>
      <Text style={styles.score}>Final Score: {score}</Text>
      <Pressable style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>PLAY AGAIN</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5,8,18,0.78)",
    paddingHorizontal: 24,
    zIndex: 3,
  },
  title: {
    color: "#F97316",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 2,
    textShadowColor: "rgba(249,115,22,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  score: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 18,
    marginTop: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#F59E0B",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#1A1202",
    fontWeight: "900",
    letterSpacing: 0.8,
  },
});
