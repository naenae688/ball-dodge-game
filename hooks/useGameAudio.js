import { useEffect, useRef, useState } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const SOUND_SOURCES = {
  start:  require("../assets/sounds/whoosh_theme.mp3"),
  bounce: require("../assets/sounds/bounce_theme.mp3"),
  impact: require("../assets/sounds/impact_theme.mp3"),
  hit:    require("../assets/sounds/game_over_theme.mp3"),
  bonus:  require("../assets/sounds/ding_theme.mp3"),
  tap:    require("../assets/sounds/click_theme.mp3"),
  music:  require("../assets/sounds/game_background_theme.mp3"),
};

export default function useGameAudio() {
  const playersRef = useRef({});
  const musicRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const lastBonusTimeRef = useRef(0);
  const lastBounceTimeRef = useRef(0);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });

    for (const [key, source] of Object.entries(SOUND_SOURCES)) {
      if (key === "music") continue;
      playersRef.current[key] = createAudioPlayer(source);
    }

    const music = createAudioPlayer(SOUND_SOURCES.music);
    music.loop = true;
    music.volume = 0.35;
    music.play();
    musicRef.current = music;

    return () => {
      Object.values(playersRef.current).forEach((p) => p.remove());
      if (musicRef.current) musicRef.current.remove();
    };
  }, []);

  const play = (key) => {
    try {
      const player = playersRef.current[key];
      if (player) {
        player.seekTo(0);
        player.play();
      }
    } catch (_) {}
  };

  const pauseMusic = () => {
    try {
      if (musicRef.current) musicRef.current.pause();
    } catch (_) {}
  };

  const restartMusic = () => {
    try {
      if (!musicRef.current || isMutedRef.current) return;
      musicRef.current.seekTo(0);
      musicRef.current.play();
    } catch (_) {}
  };

  const toggleMute = () => {
    try {
      if (!musicRef.current) return;
      if (isMutedRef.current) {
        musicRef.current.play();
      } else {
        musicRef.current.pause();
      }
      isMutedRef.current = !isMutedRef.current;
      setIsMuted((prev) => !prev);
    } catch (_) {}
  };

  const playBonus = () => {
    const now = Date.now();
    if (now - lastBonusTimeRef.current < 600) return;
    lastBonusTimeRef.current = now;
    play("bonus");
  };

  const playBounce = () => {
    const now = Date.now();
    if (now - lastBounceTimeRef.current < 80) return;
    lastBounceTimeRef.current = now;
    play("bounce");
  };

  return {
    playStart:  () => play("start"),
    playBounce,
    playImpact: () => play("impact"),
    playHit:    () => play("hit"),
    playBonus,
    playTap:    () => play("tap"),
    pauseMusic,
    restartMusic,
    toggleMute,
    isMuted,
  };
}
