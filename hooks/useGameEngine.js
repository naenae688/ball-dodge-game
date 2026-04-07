import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import Matter from "matter-js";
import { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_MOVE_STEP, BALL_COUNT } from "../constants/gameConstants";
import { createBall, resetBall } from "../physics/bodies";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function useGameEngine(playAreaSize, overlayOpacity, scoreFlash, sounds, paused) {
  const [playerX, setPlayerX] = useState(SCREEN_WIDTH / 2);
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const engineRef = useRef(null);
  const playerBodyRef = useRef(null);
  const ballBodiesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const startTimeRef = useRef(0);
  const gameOverRef = useRef(false);
  const collisionHandlerRef = useRef(null);
  const bonusRef = useRef(0);
  const lastMilestoneRef = useRef(0);
  const difficultyLevelRef = useRef(0);
  const dodgeCountRef = useRef(0);
  const dodgeMilestoneRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!playAreaSize) return undefined;

    const { width, height } = playAreaSize;
    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 0.45;

    const world = engine.world;
    const player = Matter.Bodies.rectangle(width / 2, height - 50, PLAYER_WIDTH, PLAYER_HEIGHT, {
      label: "player",
      inertia: Infinity,
      frictionAir: 0.18,
    });
    const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true, label: "left-wall" });
    const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true, label: "right-wall" });
    const floor = Matter.Bodies.rectangle(width / 2, height + 20, width, 40, { isStatic: true, label: "floor" });
    const spawnedBalls = Array.from({ length: BALL_COUNT }, (_, i) => createBall(width, i));

    Matter.World.add(world, [player, leftWall, rightWall, floor, ...spawnedBalls]);

    engineRef.current = engine;
    playerBodyRef.current = player;
    ballBodiesRef.current = spawnedBalls;
    gameOverRef.current = false;
    setGameOver(false);
    setPlayerX(player.position.x);
    setBalls(spawnedBalls.map((b) => ({ x: b.position.x, y: b.position.y })));
    setScore(0);
    startTimeRef.current = Date.now();
    lastTimeRef.current = 0;
    bonusRef.current = 0;
    lastMilestoneRef.current = 0;
    difficultyLevelRef.current = 0;
    dodgeCountRef.current = 0;
    dodgeMilestoneRef.current = 0;
    overlayOpacity.setValue(0);

    const handleCollision = (event) => {
      if (gameOverRef.current) return;

      const playerHit = event.pairs.some(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        return labels.includes("player") && labels.some((l) => l.startsWith("ball-"));
      });

      if (playerHit) {
        gameOverRef.current = true;
        setGameOver(true);
        sounds.playImpact();
        sounds.pauseMusic();
        setTimeout(() => sounds.playHit(), 400);
        Animated.timing(overlayOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        return;
      }

      event.pairs.forEach(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        const ballBody = [bodyA, bodyB].find((b) => b.label.startsWith("ball-"));
        if (labels.includes("floor") && ballBody) {
          sounds.playBounce();
          resetBall(ballBody, width, difficultyLevelRef.current);

          dodgeCountRef.current += 1;
          const dodgeMilestone = Math.floor(dodgeCountRef.current / 5);
          if (dodgeMilestone > dodgeMilestoneRef.current) {
            dodgeMilestoneRef.current = dodgeMilestone;
            bonusRef.current += 5;
            sounds.playBonus();
            Animated.sequence([
              Animated.timing(scoreFlash, { toValue: 1.5, duration: 120, useNativeDriver: true }),
              Animated.timing(scoreFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
            ]).start();
          }
        }
      });
    };

    collisionHandlerRef.current = handleCollision;
    Matter.Events.on(engine, "collisionStart", handleCollision);

    const update = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = Math.min(timestamp - lastTimeRef.current, 16.667);
      lastTimeRef.current = timestamp;

      if (!gameOverRef.current && !pausedRef.current) {
        Matter.Engine.update(engine, delta);
        setPlayerX(player.position.x);
        setBalls(ballBodiesRef.current.map((b) => ({ x: b.position.x, y: b.position.y })));

        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

        const newLevel = Math.floor(elapsed / 15);
        if (newLevel > difficultyLevelRef.current) {
          difficultyLevelRef.current = newLevel;
          engine.gravity.y = Math.min(0.45 + newLevel * 0.1, 1.0);
        }

        const milestone = Math.floor(elapsed / 10);
        if (milestone > lastMilestoneRef.current) {
          bonusRef.current += (milestone - lastMilestoneRef.current) * 10;
          lastMilestoneRef.current = milestone;
          sounds.playBonus();
          Animated.sequence([
            Animated.timing(scoreFlash, { toValue: 1.5, duration: 120, useNativeDriver: true }),
            Animated.timing(scoreFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
          ]).start();
        }
        setScore(elapsed + bonusRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (collisionHandlerRef.current) Matter.Events.off(engine, "collisionStart", collisionHandlerRef.current);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [playAreaSize]);

  const movePlayer = (direction) => {
    if (!playerBodyRef.current || gameOverRef.current || !playAreaSize) return;

    const nextX = Math.max(
      PLAYER_WIDTH / 2,
      Math.min(
        playAreaSize.width - PLAYER_WIDTH / 2,
        playerBodyRef.current.position.x + direction * PLAYER_MOVE_STEP
      )
    );

    Matter.Body.setPosition(playerBodyRef.current, { x: nextX, y: playerBodyRef.current.position.y });
    Matter.Body.setVelocity(playerBodyRef.current, { x: 0, y: 0 });
    setPlayerX(nextX);
  };

  return { playerX, balls, score, gameOver, movePlayer };
}
