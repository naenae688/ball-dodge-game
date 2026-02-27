import React, { useState } from "react";
import { View } from "react-native";
import WelcomeScreen from "./components/WelcomeScreen";
import GameScreen from "./components/GameScreen";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {started ? <GameScreen /> : <WelcomeScreen onStart={() => setStarted(true)} />}
    </View>
  );
}