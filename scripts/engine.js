import { FLOATIES }
  from "./floaties.js";

import {
  rand,
  pick
} from "./utils.js";

function getPlayerTheme() {

  return game.user.name
    .toLowerCase();

}

const CLAIM_THEMES = {

  tarf: {

    image:
      "modules/magical-falling/assets/claims/bolha_tarf.webp",

    alpha: 0.5,

    scale: 1,

    blendMode:
      PIXI.BLEND_MODES.ADD,

      sounds: {

  claim: [

    "modules/magical-falling/assets/sounds/tarf/bubble_1.opus",

    "modules/magical-falling/assets/sounds/tarf/bubble_2.opus",

    "modules/magical-falling/assets/sounds/tarf/bubble_3.opus",

    "modules/magical-falling/assets/sounds/tarf/bubble_4.opus",

    "modules/magical-falling/assets/sounds/tarf/bubble_5.opus",

    "modules/magical-falling/assets/sounds/tarf/bubble_6.opus"

  ],

  destroy: [

    "modules/magical-falling/assets/sounds/tarf/pop_1.opus",

    "modules/magical-falling/assets/sounds/tarf/pop_2.opus",

    "modules/magical-falling/assets/sounds/tarf/pop_3.opus",

    "modules/magical-falling/assets/sounds/tarf/pop_4.opus",

    "modules/magical-falling/assets/sounds/tarf/pop_5.opus",

    "modules/magical-falling/assets/sounds/tarf/pop_6.opus"

  ]

},

    spawnAnimation: {

      wobble: true,

      wobbleStrength: 0.03,

      wobbleSpeed: 0.003,

      wobbleDuration: 1200

    },

    destroyAnimation(sprite) {

  const overlay =
    sprite.claimOverlay;

  if (overlay) {

    overlay.scale.x *= 1.12;

    overlay.scale.y =
      overlay.scale.x;

    overlay.alpha -= 0.08;

  }

  sprite.tint =
  0x8B45D9;

sprite.blendMode =
  PIXI.BLEND_MODES.ADD;

  sprite.alpha -= 0.1;

sprite.scale.x *= 0.96;

sprite.scale.y =
  sprite.scale.x;

sprite.y -= 0.8;

}

  },

  sirius: {

    image:
      "modules/magical-falling/assets/claims/orbe_sirius.webp",

    alpha: 0.7,

    scale: 1,

    blendMode:
      PIXI.BLEND_MODES.NORMAL,

    spawnAnimation: {

      wobble: false

    },

    destroyAnimation(sprite) {

      sprite.rotation += 0.08;

      sprite.alpha -= 0.05;

    }

  },

  phact: {

    image:
      "modules/magical-falling/assets/claims/aura_phact.webp",

    alpha: 0.6,

    scale: 1,

    blendMode:
      PIXI.BLEND_MODES.ADD,

    spawnAnimation: {

      wobble: true,

      wobbleStrength: 0.01,

      wobbleSpeed: 0.001,

      wobbleDuration: 800

    },

    destroyAnimation(sprite) {

      sprite.scale.x *= 0.96;

      sprite.scale.y =
        sprite.scale.x;

      sprite.alpha -= 0.03;

    }

  }

};

async function applyClaimVisual(
  sprite,
  theme
) {

  if (sprite.claimOverlay) {

    sprite.removeChild(
      sprite.claimOverlay
    );

    sprite.claimOverlay.destroy();

  }

  const config =
  CLAIM_THEMES[theme];

if (!config) return;

const path =
  config.image;

  if (!path) return;

  const texture =
    await foundry.canvas.loadTexture(
      path
    );

  const overlay =
    new PIXI.Sprite(texture);

    overlay.alpha = 0;

    overlay.scale.set(0.2);

  overlay.eventMode = "none";

  overlay.interactive = false;

  overlay.anchor.set(0.5);

  overlay.targetAlpha =
  config.alpha;

overlay.targetScale =
  config.scale;

overlay.wobbleOffset =
  Math.random() * 9999;

  overlay.wobbleStart =
  performance.now();

  overlay.blendMode =
  config.blendMode;




  sprite.addChild(overlay);

  sprite.claimOverlay =
    overlay;

}

function playRandomSound(
  sounds
) {

  if (
    !sounds?.length
  ) return;

  const path =
    pick(sounds);

  foundry.audio.AudioHelper.play({
    src: path,
    volume: 0.4,
    autoplay: true,
    loop: false
  });

}

async function warmupSounds() {

  const paths = [];

  for (
    const theme of
    Object.values(CLAIM_THEMES)
  ) {

    paths.push(
      ...(theme.sounds?.claim || []),
      ...(theme.sounds?.destroy || [])
    );

  }

  for (const path of paths) {

    try {

      await foundry.audio.AudioHelper.play({

        src: path,

        volume: 0,

        autoplay: true,

        loop: false

      }, false);

    } catch (err) {

      console.warn(
        "Sound warmup failed:",
        path,
        err
      );

    }

  }

}

export class MagicalFallingEngine {

  constructor() {

    this.lastSpawnPositions = [];

    this.spawnTimers = [];

    this.container = null;

    this.enabled = false;

    this.activeFloaties = [];

    this.targetCount =
  game.settings.get(
    "magical-falling",
    "targetCount"
  );

  }

  async start() {

    if (this.enabled) return;

    this.enabled = true;

    await warmupSounds();

    this.container =
      new PIXI.Container();

      this.container.sortableChildren =
  true;

    canvas.stage.addChild(
      this.container
    );

    for (let i = 0; i < 4; i++) {

  setTimeout(() => {

    this.startSpawner();

  }, rand(0, 5000));

}

  }

  stop() {

    this.enabled = false;

    if (this.container) {

      this.container.destroy({
        children: true
      });
      

    }

    for (const timer of this.spawnTimers) {

  clearTimeout(timer);

}
        clearInterval(
      this.spawnInterval
    );

  }

      startSpawner() {

  const spawn = async () => {

    if (!this.enabled) return;

    if (
  this.activeFloaties.length <=
  this.targetCount + 2
) {

  this.spawnFloatie();

}

    const nextDelay =
      rand(400, 1400);

    const timer =
      setTimeout(
        spawn,
        nextDelay
      );

    this.spawnTimers.push(timer);

  };

  spawn();

}

  async spawnFloatie() {

    const data =
      pick(FLOATIES);

    if (!data) return;

    const texture =
      await foundry.canvas.loadTexture(
        data.image
      );

    const sprite =
      new PIXI.Sprite(texture);

      sprite.claimState =
  "neutral";

sprite.claimedBy =
  null;

sprite.claimOverlay =
  null;

sprite.destroying =
  false;

sprite.lastInteraction =
  0;

      sprite.eventMode = "static";

    sprite.cursor = "pointer";

    sprite.anchor.set(0.5);

    /* =====================================
       PROFUNDIDADE FAKE
    ===================================== */

    const minScale =
  game.settings.get(
    "magical-falling",
    "minScale"
  );

const maxScale =
  game.settings.get(
    "magical-falling",
    "maxScale"
  );

const scale =
  rand(
    minScale,
    maxScale
  );

    sprite.scale.set(scale);

    sprite.baseScale = scale;

    sprite.zIndex = scale;

    sprite.on("pointerover", () => {

  sprite.hovered = true;


});

    sprite.on("pointerout", () => {

  sprite.hovered = false;

});

sprite.on("pointerdown", event => {

  event.stopPropagation();

  if (
  event.button !== 0
) return;

  console.log(
  "STATE:",
  sprite.claimState
);

  console.log(
  sprite.claimState
);

  const playerTheme =
    getPlayerTheme();

    const now =
  performance.now();

if (
  now - sprite.lastInteraction <
  250
) return;

sprite.lastInteraction =
  now;

  if (!playerTheme) return;

  /* =========================
     JÁ ESTÁ DESTRUINDO
  ========================= */

  if (
    sprite.claimState ===
    "destroying"
  ) return;

  /* =========================
     PRIMEIRO CLICK
  ========================= */

  if (
    sprite.claimState ===
    "neutral"
  ) {

    sprite.claimState =
      "claimed";

      console.log(
  "SET CLAIMED"
);

    sprite.claimedBy =
      playerTheme;

    applyClaimVisual(
      sprite,
      playerTheme
    );

    playRandomSound(
  CLAIM_THEMES[
    playerTheme
  ]?.sounds?.claim
);

    console.log(
  "VISUAL APPLIED"
);

    return;

  }

  /* =========================
     OUTRO JOGADOR
  ========================= */

  if (
    sprite.claimedBy !==
    playerTheme
  ) return;

  /* =========================
     SEGUNDO CLICK
  ========================= */

  sprite.claimState =
    "destroying";

  sprite.destroying =
    true;

    playRandomSound(
  CLAIM_THEMES[
    sprite.claimedBy
  ]?.sounds?.destroy
);

});

    /* =====================================
       POSIÇÃO
    ===================================== */

    const minX =
  game.settings.get(
    "magical-falling",
    "minX"
  );

const maxX =
  game.settings.get(
    "magical-falling",
    "maxX"
  );

let spawnX;

let attempts = 0;

do {

  spawnX = rand(
    minX,
    maxX
  );

  attempts++;

} while (

  attempts < 20 &&

  this.lastSpawnPositions.some(
    x =>
      Math.abs(x - spawnX) < 180
  )

);

sprite.x = spawnX;

this.lastSpawnPositions.push(
  spawnX
);

if (
  this.lastSpawnPositions.length > 5
) {

  this.lastSpawnPositions.shift();

}

const startY =
  game.settings.get(
    "magical-falling",
    "startY"
  );

const endY =
  game.settings.get(
    "magical-falling",
    "endY"
  );

  const startVariance =
  game.settings.get(
    "magical-falling",
    "startYVariance"
  );

const endVariance =
  game.settings.get(
    "magical-falling",
    "endYVariance"
  );

sprite.y = rand(
  startY,
  startY + startVariance
);

sprite.destroyY = rand(
  endY,
  endY - endVariance
);

    /* =====================================
       VISUAL
    ===================================== */

    sprite.alpha = 0;

    this.container.addChild(
      sprite
    );

    this.activeFloaties.push(
      sprite
    );

    /* =====================================
       MOVIMENTO
    ===================================== */

    const speedMultiplier =
  game.settings.get(
    "magical-falling",
    "speedMultiplier"
  );

const normalizedScale =
  (scale - minScale)
  / (maxScale - minScale);

/* menores = mais rápidos */

const depthSpeed =
  2.8 - (
    normalizedScale * 2.0
  );

/* pequena variação */

const randomSpeed =
  rand(-0.25, 0.25);

const speed =
  (
    depthSpeed +
    randomSpeed
  ) * speedMultiplier;

    const drift =
      rand(-0.2, 0.2);

    const rotationSpeed =
      rand(-0.002, 0.002);

    const wobbleStrength =
      rand(0.05, 0.3);

    const wobbleSpeed =
      rand(0.001, 0.003);

    const startTime =
      performance.now();

    const ticker =
      PIXI.Ticker.shared;

    const update = () => {

      const t =
        performance.now() -
        startTime;

      if (sprite.claimOverlay) {

  const overlay =
    sprite.claimOverlay;

  overlay.alpha +=
  (
    overlay.targetAlpha -
    overlay.alpha
  ) * 0.12;

overlay.scale.x +=
  (
    overlay.targetScale -
    overlay.scale.x
  ) * 0.15;

  overlay.scale.y =
    overlay.scale.x;

    const settled =
  Math.abs(
    overlay.targetScale -
    overlay.scale.x
  ) < 0.02;

const anim =
  CLAIM_THEMES[
    sprite.claimedBy
  ]?.spawnAnimation;

if (
  settled &&
  anim?.wobble
) {

  const elapsed =
    performance.now() -
    overlay.wobbleStart;

  const strength =
    Math.max(
      0,
      1 - (
        elapsed /
        anim.wobbleDuration
      )
    );

  const wobble =
    Math.sin(
      (
        performance.now() *
        anim.wobbleSpeed
      ) + overlay.wobbleOffset
    ) * (
      anim.wobbleStrength *
      strength
    );

  overlay.scale.x =
    overlay.targetScale +
    wobble;

  overlay.scale.y =
    overlay.scale.x;

}

}

      sprite.y -= speed;

      sprite.x += drift;

      sprite.x +=
        Math.sin(
          t * wobbleSpeed
        ) * wobbleStrength;

      sprite.rotation +=
        rotationSpeed;

      /* fade in */

      if (sprite.alpha < 1) {

        sprite.alpha += 0.01;

      }

      /* remove */

      const targetScale =
  sprite.hovered
    ? sprite.baseScale * 1.12
    : sprite.baseScale;

sprite.scale.x +=
  (targetScale - sprite.scale.x)
  * 0.08;

sprite.scale.y =
  sprite.scale.x;

      if (sprite.destroying) {

  const config =
  CLAIM_THEMES[
    sprite.claimedBy
  ];

config?.destroyAnimation?.(
  sprite
);

  if (sprite.alpha <= 0.02) {

    ticker.remove(update);

    this.removeFloatie(
      sprite
    );

    return;

  }

}
      if (sprite.y < sprite.destroyY) {

        ticker.remove(update);

        this.removeFloatie(
          sprite
        );

      }

    };

    ticker.add(update);

    sprite._updateFunction =
      update;

  }

  removeFloatie(sprite) {

    this.activeFloaties =
      this.activeFloaties.filter(
        f => f !== sprite
      );

    if (
      this.container?.children.includes(
        sprite
      )
    ) {

      this.container.removeChild(
        sprite
      );

    }

    sprite.destroy();

  }

}