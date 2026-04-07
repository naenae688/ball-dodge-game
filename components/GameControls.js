import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CONTROL_HEIGHT } from "../constants/gameConstants";

export default function GameControls({ onLeft, onRight, onRestart }) {
  return (
    <View style={styles.controls}>
      <Pressable style={styles.button} onPress={onLeft}>
        <Text style={styles.buttonText}>← LEFT</Text>
      </Pressable>
      <Pressable style={styles.restartButton} onPress={onRestart}>
        <Text style={styles.restartText}>RESTART</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onRight}>
        <Text style={styles.buttonText}>RIGHT →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    height: CONTROL_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  restartButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    backgroundColor: "#F59E0B",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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
