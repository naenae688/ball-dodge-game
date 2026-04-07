import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen({ onStart, sounds }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const ballY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ballY, { toValue: -20, duration: 1100, useNativeDriver: true }),
        Animated.timing(ballY, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />

      <Pressable style={styles.muteBtn} onPress={sounds.toggleMute}>
        <Ionicons
          name={sounds.isMuted ? "volume-mute" : "volume-high"}
          size={18}
          color="rgba(255,255,255,0.7)"
        />
      </Pressable>

      <View style={styles.content}>
        <View>
          <Text style={styles.kicker}>INFO5144 • Physics Game</Text>
          <Text style={styles.creators}>Lynae · Hendrick · Rayan</Text>
          <Text style={styles.title}>BALL DODGE</Text>
          <Text style={styles.subtitle}>Survive the storm. Score big.</Text>
        </View>

        <Animated.View style={[styles.decorBall, { transform: [{ translateY: ballY }] }]} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Play</Text>
          <Text style={styles.cardText}>• Move left / right to dodge falling balls</Text>
          <Text style={styles.cardText}>• Survive longer to earn points</Text>
          <Text style={styles.cardText}>• Every 10s bonus: +10 points</Text>
          <Text style={styles.cardText}>• Balls get faster as you survive</Text>
        </View>

        <View>
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Pressable
              onPress={onStart}
              style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
            >
              <Text style={styles.startBtnText}>START GAME</Text>
            </Pressable>
          </Animated.View>
          <Text style={styles.footer}>Tip: Stay near the edges to bait drops.</Text>
        </View>
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
  bgLayer1: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "#6D28D9",
    top: -220,
    left: -180,
    opacity: 0.35,
  },
  bgLayer2: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "#06B6D4",
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
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1.5,
    fontSize: 11,
    textTransform: "uppercase",
  },
  creators: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 4,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    marginTop: 8,
  },
  decorBall: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F97316",
    shadowColor: "#F97316",
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  cardText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 22,
  },
  startBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  startBtnText: {
    color: "#07110A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  pressed: {
    opacity: 0.88,
  },
  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    marginTop: 14,
  },
  muteBtn: {
    position: "absolute",
    top: 52,
    right: 22,
    zIndex: 2,
    backgroundColor: "rgba(11,16,32,0.72)",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});
