import Matter from "matter-js";

export default (world, position, size) => {
  const body = Matter.Bodies.rectangle(
    position.x,
    position.y,
    size.width,
    size.height,
    { isStatic: false }
  );

  Matter.World.add(world, body);

  return {
    body,
    size,
    renderer: body => {
      return (
        <div />
      );
    }
  };
};