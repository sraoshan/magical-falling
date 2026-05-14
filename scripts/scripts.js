import { MagicalLandingEngine }
  from "./engine.js";

const TARGET_SCENE_NAME =
  "Landing Page";

let engine = null;

Hooks.on("canvasReady", async () => {

  if (
    canvas.scene?.name !== TARGET_SCENE_NAME
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