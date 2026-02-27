import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

export default function GameScreen() {
  useEffect(() => {
    const engine = Matter.Engine.create();
    Matter.Engine.run(engine);

    return () => {
      // cleanup
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Game Screen (Engine Loaded)</Text>
      <GameEngine style={styles.engine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { textAlign: "center", paddingTop: 40, fontSize: 16 },
  engine: { flex: 1 },
});