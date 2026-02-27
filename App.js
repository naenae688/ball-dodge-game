import React, { useState } from "react";
import { View } from "react-native";
import WelcomeScreen from "./components/WelcomeScreen";
import GameScreen from "./components/GameScreen";

export default function App() {
  const [started, setStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const restartGame = () => setGameKey((k) => k + 1);

  return (
    <View style={{ flex: 1 }}>
      {started ? (
        <GameScreen key={gameKey} onRestart={restartGame} />
      ) : (
        <WelcomeScreen onStart={() => setStarted(true)} />
      )}
    </View>
  );
}