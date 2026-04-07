import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import useGameEngine from "../hooks/useGameEngine";
import GameOverlay from "./GameOverlay";
import GameControls from "./GameControls";
import { PLAYER_WIDTH, PLAYER_HEIGHT, BALL_RADIUS } from "../constants/gameConstants";

export default function GameScreen({ onRestart }) {
  const [playAreaSize, setPlayAreaSize] = useState(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scoreFlash = useRef(new Animated.Value(1)).current;

  const { playerX, balls, score, gameOver, movePlayer } = useGameEngine(
    playAreaSize,
    overlayOpacity,
    scoreFlash
  );

  const handleLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout;
    const nextSize = { width: Math.round(width), height: Math.round(height) };
    setPlayAreaSize((current) => {
      if (current && current.width === nextSize.width && current.height === nextSize.height) {
        return current;
      }
      return nextSize;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.playArea} onLayout={handleLayout}>
        <View style={styles.hud}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Animated.Text style={[styles.scoreValue, { transform: [{ scale: scoreFlash }] }]}>
            {score}
          </Animated.Text>
        </View>

        {playAreaSize && (
          <>
            <View
              style={[
                styles.player,
                {
                  left: playerX - PLAYER_WIDTH / 2,
                  top: playAreaSize.height - 50 - PLAYER_HEIGHT / 2,
                },
              ]}
            />
            {balls.map((ball, index) => (
              <View
                key={`ball-${index}`}
                style={[styles.ball, { left: ball.x - BALL_RADIUS, top: ball.y - BALL_RADIUS }]}
              />
            ))}
          </>
        )}

        <GameOverlay
          gameOver={gameOver}
          score={score}
          overlayOpacity={overlayOpacity}
          onRestart={onRestart}
        />
      </View>

      <GameControls
        onLeft={() => movePlayer(-1)}
        onRight={() => movePlayer(1)}
        onRestart={onRestart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1020" },
  playArea: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  hud: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 2,
    backgroundColor: "rgba(11,16,32,0.72)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  scoreLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  scoreValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
  },
  player: {
    position: "absolute",
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    borderRadius: 10,
    backgroundColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  ball: {
    position: "absolute",
    width: BALL_RADIUS * 2,
    height: BALL_RADIUS * 2,
    borderRadius: BALL_RADIUS,
    backgroundColor: "#F97316",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#F97316",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
});
