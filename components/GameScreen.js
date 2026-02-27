import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Matter from "matter-js";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function GameScreen({ onRestart }) {
  const [playerX, setPlayerX] = useState(SCREEN_WIDTH / 2);
  const playerWidth = 40;

  useEffect(() => {
    const engine = Matter.Engine.create();
    Matter.Engine.run(engine);

    return () => {
      Matter.Engine.clear(engine);
    };
  }, []);

  const moveLeft = () => {
    setPlayerX(prev => Math.max(playerWidth / 2, prev - 30));
  };

  const moveRight = () => {
    setPlayerX(prev => Math.min(SCREEN_WIDTH - playerWidth / 2, prev + 30));
  };

  return (
    <View style={styles.container}>
      <View style={styles.playArea}>
        <View
          style={[
            styles.player,
            { left: playerX - playerWidth / 2 }
          ]}
        />
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={moveLeft}>
          <Text style={styles.buttonText}>LEFT</Text>
        </Pressable>

        <Pressable style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartText}>RESTART</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={moveRight}>
          <Text style={styles.buttonText}>RIGHT</Text>
        </Pressable>
      </View>
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
  },
  player: {
    position: "absolute",
    bottom: 30,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#22C55E",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    alignItems: "center",
  },
  restartButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    backgroundColor: "#F59E0B",
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  restartText: {
    color: "#1A1202",
    fontWeight: "bold",
  },
});