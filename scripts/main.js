import { MagicalFallingEngine }
  from "./engine.js";

let engine = null;

Hooks.once("init", () => {


    game.settings.register(
  "magical-falling",
  "landingScene",

  {

    name:
      "Landing Scene",

    hint:
      "Scene where magical floaties appear.",

    scope: "world",

    config: true,

    type: String,

    default: "",

    choices: {}

  }
);

    game.settings.register(
    "magical-falling",
    "minScale",
    {
      name: "Minimum Floatie Scale",

      hint:
        "Escala mínima dos floaties.",

      scope: "world",

      config: true,

      type: Number,

      default: 0.2
    }
  );

  game.settings.register(
    "magical-falling",
    "maxScale",
    {
      name: "Maximum Floatie Scale",

      hint:
        "Escala máxima dos floaties.",

      scope: "world",

      config: true,

      type: Number,

      default: 0.45
    }
  );

    game.settings.register(
    "magical-falling",
    "speedMultiplier",
    {
      name: "Speed Multiplier",

      hint:
        "Multiplicador global da velocidade dos floaties.",

      scope: "world",

      config: true,

      type: Number,

      default: 1
    }
  );

    game.settings.register(
    "magical-falling",
    "startYVariance",
    {
      name: "Start Y Variance",

      hint:
        "Variação vertical do spawn.",

      scope: "world",

      config: true,

      type: Number,

      default: 300
    }
  );

  game.settings.register(
    "magical-falling",
    "endYVariance",
    {
      name: "End Y Variance",

      hint:
        "Variação vertical da destruição.",

      scope: "world",

      config: true,

      type: Number,

      default: 300
    }
  );

  game.settings.register(
    "magical-falling",
    "startY",
    {
      name: "Floatie Start Y",

      hint:
        "Posição inicial vertical.",

      scope: "world",

      config: true,

      type: Number,

      default: 1300
    }
  );

  game.settings.register(
    "magical-falling",
    "endY",
    {
      name: "Floatie End Y",

      hint:
        "Posição final vertical.",

      scope: "world",

      config: true,

      type: Number,

      default: -300
    }
  );

  game.settings.register(
    "magical-falling",
    "minX",
    {
      name: "Floatie Min X",

      hint:
        "Área mínima horizontal.",

      scope: "world",

      config: true,

      type: Number,

      default: 600
    }
  );

  game.settings.register(
    "magical-falling",
    "maxX",
    {
      name: "Floatie Max X",

      hint:
        "Área máxima horizontal.",

      scope: "world",

      config: true,

      type: Number,

      default: 1800
    }
  );

  game.settings.register(
    "magical-falling",
    "targetCount",
    {
      name: "Quantidade de Floaties",

      hint:
        "Máximo simultâneo.",

      scope: "world",

      config: true,

      type: Number,

      default: 10
    }
  );

});

Hooks.once("ready", () => {

  const sceneChoices = {};

  for (
    const scene of game.scenes
  ) {

    sceneChoices[
      scene.id
    ] = scene.name;

  }

  game.settings.settings.get(
    "magical-falling.landingScene"
  ).choices =
    sceneChoices;

});

Hooks.on("canvasReady", async () => {

  if (engine) {

    engine.stop();

    engine = null;

  }

  const targetScene =
    game.settings.get(
      "magical-falling",
      "landingScene"
    );

  if (
    canvas.scene?.id !==
    targetScene
  ) return;

  engine =
    new MagicalFallingEngine();

  engine.start();

});

Hooks.on("canvasTearDown", () => {

  if (engine) {

    engine.stop();

    engine = null;

  }

});