import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function GameOverlay({ gameOver, score, overlayOpacity, onRestart, onHome }) {
  if (!gameOver) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Text style={styles.title}>GAME OVER</Text>
      <Text style={styles.score}>Final Score: {score}</Text>
      <View style={styles.buttons}>
        <Pressable style={styles.playBtn} onPress={onRestart}>
          <Text style={styles.playBtnText}>PLAY AGAIN</Text>
        </Pressable>
        <Pressable style={styles.homeBtn} onPress={onHome}>
          <Text style={styles.homeBtnText}>HOME</Text>
        </Pressable>
      </View>
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
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  playBtn: {
    backgroundColor: "#F59E0B",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  playBtnText: {
    color: "#1A1202",
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  homeBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  homeBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.8,
  },
});
