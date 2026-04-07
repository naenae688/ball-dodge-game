import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const STEPS = ["3", "2", "1", "GO!"];

export default function CountdownScreen({ onComplete }) {
  const [index, setIndex] = useState(0);
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      scale.setValue(0.4);
      opacity.setValue(1);

      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18 }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]).start(() => {
        setIndex((prev) => {
          const next = prev + 1;
          if (next >= STEPS.length) {
            onComplete();
          }
          return next;
        });
      });
    };

    animate();
  }, [index]);

  if (index >= STEPS.length) return null;

  const isGo = STEPS[index] === "GO!";

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>GET READY</Text>
      <Animated.Text
        style={[
          styles.number,
          isGo && styles.go,
          { transform: [{ scale }], opacity },
        ]}
      >
        {STEPS[index]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B1020",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  number: {
    color: "#FFFFFF",
    fontSize: 120,
    fontWeight: "900",
    letterSpacing: -2,
  },
  go: {
    color: "#22C55E",
    fontSize: 80,
    textShadowColor: "rgba(34,197,94,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
