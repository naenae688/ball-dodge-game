import React, { useState } from "react";
import { View } from "react-native";
import WelcomeScreen from "./components/WelcomeScreen";
import CountdownScreen from "./components/CountdownScreen";
import GameScreen from "./components/GameScreen";
import useGameAudio from "./hooks/useGameAudio";

export default function App() {
  const [phase, setPhase] = useState("welcome"); // 'welcome' | 'countdown' | 'game'
  const [gameKey, setGameKey] = useState(0);

  const sounds = useGameAudio();

  const startCountdown = () => {
    sounds.pauseMusic();
    setPhase("countdown");
  };

  const handleCountdownComplete = () => {
    sounds.restartMusic();
    sounds.playStart();
    setPhase("game");
  };

  const restartGame = () => {
    setGameKey((k) => k + 1);
    startCountdown();
  };

  const goHome = () => {
    sounds.restartMusic();
    setPhase("welcome");
  };

  return (
    <View style={{ flex: 1 }}>
      {phase === "welcome" && (
        <WelcomeScreen onStart={startCountdown} sounds={sounds} />
      )}
      {phase === "countdown" && (
        <CountdownScreen onComplete={handleCountdownComplete} />
      )}
      {phase === "game" && (
        <GameScreen
          key={gameKey}
          onRestart={restartGame}
          onHome={goHome}
          sounds={sounds}
        />
      )}
    </View>
  );
}
