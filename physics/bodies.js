import Matter from "matter-js";
import { BALL_RADIUS } from "../constants/gameConstants";

export const createBall = (playAreaWidth, index) =>
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

export const resetBall = (ball, playAreaWidth, level) => {
  Matter.Body.setPosition(ball, {
    x: BALL_RADIUS + Math.random() * Math.max(playAreaWidth - BALL_RADIUS * 2, 1),
    y: -BALL_RADIUS - Math.random() * 24,
  });
  Matter.Body.setVelocity(ball, {
    x: (Math.random() - 0.5) * (2 + level * 0.5),
    y: 0,
  });
  Matter.Body.setAngularVelocity(ball, (Math.random() - 0.5) * 0.08);
};
