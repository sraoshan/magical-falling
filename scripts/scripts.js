import { MagicalLandingEngine }
  from "./engine.js";

let engine = null;

Hooks.on("canvasReady", async () => {

  const targetScene =
  game.settings.get(
    "magical-falling",
    "targetScene"
  );

if (
  canvas.scene?.name !==
  targetScene
) return;

  engine = new MagicalLandingEngine();

  engine.start();

});

Hooks.on("canvasTearDown", () => {

  if (engine) {

    engine.stop();

    engine = null;

  }

});