import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Matter from "matter-js";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const PLAYER_MOVE_STEP = 30;
const BALL_RADIUS = 18;
const BALL_COUNT = 4;
const CONTROL_HEIGHT = 96;

const createBall = (playAreaWidth, index) =>
  Matter.Bodies.circle(
    BALL_RADIUS + Math.random() * Math.max(playAreaWidth - BALL_RADIUS * 2, 1),
    -80 - index * 90,
    BALL_RADIUS,
    {
      label: `ball-${index}`,
      restitution: 0.9,
      frictionAir: 0.01,
    }
  );

const resetBall = (ball, playAreaWidth) => {
  Matter.Body.setPosition(ball, {
    x: BALL_RADIUS + Math.random() * Math.max(playAreaWidth - BALL_RADIUS * 2, 1),
    y: -BALL_RADIUS - Math.random() * 24,
  });
  Matter.Body.setVelocity(ball, {
    x: (Math.random() - 0.5) * 2,
    y: 0,
  });
  Matter.Body.setAngularVelocity(ball, (Math.random() - 0.5) * 0.08);
};

export default function GameScreen({ onRestart }) {
  const [playAreaSize, setPlayAreaSize] = useState(null);
  const [playerX, setPlayerX] = useState(SCREEN_WIDTH / 2);
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const playerBodyRef = useRef(null);
  const ballBodiesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const startTimeRef = useRef(0);
  const gameOverRef = useRef(false);
  const collisionHandlerRef = useRef(null);

  useEffect(() => {
    if (!playAreaSize) {
      return undefined;
    }

    const { width, height } = playAreaSize;
    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 0.45;

    const world = engine.world;
    const player = Matter.Bodies.rectangle(
      width / 2,
      height - 50,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      {
        label: "player",
        inertia: Infinity,
        frictionAir: 0.18,
      }
    );

    const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, height, {
      isStatic: true,
      label: "left-wall",
    });
    const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, height, {
      isStatic: true,
      label: "right-wall",
    });
    const floor = Matter.Bodies.rectangle(width / 2, height + 20, width, 40, {
      isStatic: true,
      label: "floor",
    });

    const spawnedBalls = Array.from({ length: BALL_COUNT }, (_, index) =>
      createBall(width, index)
    );

    Matter.World.add(world, [player, leftWall, rightWall, floor, ...spawnedBalls]);

    engineRef.current = engine;
    worldRef.current = world;
    playerBodyRef.current = player;
    ballBodiesRef.current = spawnedBalls;
    gameOverRef.current = false;
    setGameOver(false);
    setPlayerX(player.position.x);
    setBalls(
      spawnedBalls.map((ball) => ({
        x: ball.position.x,
        y: ball.position.y,
      }))
    );
    setScore(0);

    const handleCollision = (event) => {
      if (gameOverRef.current) {
        return;
      }

      const playerHit = event.pairs.some(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        return labels.includes("player") && labels.some((label) => label.startsWith("ball-"));
      });

      if (playerHit) {
        gameOverRef.current = true;
        setGameOver(true);
        return;
      }

      event.pairs.forEach(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        const floorHit = labels.includes("floor");
        const ballBody = [bodyA, bodyB].find((body) => body.label.startsWith("ball-"));

        if (floorHit && ballBody) {
          resetBall(ballBody, width);
        }
      });
    };

    collisionHandlerRef.current = handleCollision;
    Matter.Events.on(engine, "collisionStart", handleCollision);

    startTimeRef.current = Date.now();
    lastTimeRef.current = 0;

    const update = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = Math.min(timestamp - lastTimeRef.current, 32);
      lastTimeRef.current = timestamp;

      if (!gameOverRef.current) {
        Matter.Engine.update(engine, delta);

        setPlayerX(player.position.x);
        setBalls(
          ballBodiesRef.current.map((ball) => ({
            x: ball.position.x,
            y: ball.position.y,
          }))
        );
        setScore(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (collisionHandlerRef.current) {
        Matter.Events.off(engine, "collisionStart", collisionHandlerRef.current);
      }

      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [playAreaSize]);

  const movePlayer = (direction) => {
    if (!playerBodyRef.current || gameOverRef.current || !playAreaSize) {
      return;
    }

    const nextX = Math.max(
      PLAYER_WIDTH / 2,
      Math.min(
        playAreaSize.width - PLAYER_WIDTH / 2,
        playerBodyRef.current.position.x + direction * PLAYER_MOVE_STEP
      )
    );

    Matter.Body.setPosition(playerBodyRef.current, {
      x: nextX,
      y: playerBodyRef.current.position.y,
    });
    Matter.Body.setVelocity(playerBodyRef.current, { x: 0, y: 0 });
    setPlayerX(nextX);
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.playArea}
        onLayout={({ nativeEvent }) => {
          const { width, height } = nativeEvent.layout;
          const nextSize = {
            width: Math.round(width),
            height: Math.round(height),
          };

          setPlayAreaSize((current) => {
            if (
              current &&
              current.width === nextSize.width &&
              current.height === nextSize.height
            ) {
              return current;
            }

            return nextSize;
          });
        }}
      >
        <View style={styles.hud}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
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
                style={[
                  styles.ball,
                  {
                    left: ball.x - BALL_RADIUS,
                    top: ball.y - BALL_RADIUS,
                  },
                ]}
              />
            ))}
          </>
        )}

        {gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>GAME OVER</Text>
            <Text style={styles.overlayScore}>Final Score: {score}</Text>
            <Pressable style={styles.overlayButton} onPress={onRestart}>
              <Text style={styles.overlayButtonText}>PLAY AGAIN</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={() => movePlayer(-1)}>
          <Text style={styles.buttonText}>LEFT</Text>
        </Pressable>

        <Pressable style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartText}>RESTART</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => movePlayer(1)}>
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
  },
  ball: {
    position: "absolute",
    width: BALL_RADIUS * 2,
    height: BALL_RADIUS * 2,
    borderRadius: BALL_RADIUS,
    backgroundColor: "#F97316",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5,8,18,0.78)",
    paddingHorizontal: 24,
    zIndex: 3,
  },
  overlayTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  overlayScore: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 18,
    marginTop: 12,
    marginBottom: 24,
  },
  overlayButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  overlayButtonText: {
    color: "#1A1202",
    fontWeight: "900",
    letterSpacing: 0.8,
  },
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
