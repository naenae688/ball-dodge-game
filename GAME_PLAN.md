# Ball Dodge Game – Design Plan (INFO5144)

## Game Objective
The player controls a square at the bottom of the screen.

Falling balls drop from the top of the screen.

The objective is to:
- Avoid getting hit by the falling balls
- Survive as long as possible
- Earn points over time
- Earn bonus rewards for survival milestones

If a ball hits the player → Game Over.

---

## Core Gameplay Loop

1. Game starts
2. Balls begin falling using gravity
3. Player moves left and right
4. Score increases while alive
5. Collision with ball ends game
6. Restart button resets everything

---

## Rigid Bodies (Physics Objects)

Minimum Required (Rubric):

- Player (dynamic rectangle)
- 4 Falling Balls (dynamic circles)
- Left Wall (static)
- Right Wall (static)
- Floor (static)

Total: 7+ rigid bodies

---

## Scoring System

### Base Score:
- +1 point every second survived

### Bonus Rewards:
- +10 points every 10 seconds survived

Score stops when:
- Game Over occurs

Score resets when:
- Restart button is pressed

---

## UI Controls

- Move Left button
- Move Right button
- Restart button

---

## Game Over Conditions

Game ends when:
- Ball collides with player

Game displays:
- "Game Over"
- Final score
- Restart button

---

## Responsibilities

Setup:
- Engine configuration
- Welcome screen

Player Controls:
- Movement
- Boundaries
- Restart logic

Collision System:
- Falling balls
- Collision detection
- Game over trigger

Scoring:
- Time tracking
- Bonus reward logic
- Score display

---

