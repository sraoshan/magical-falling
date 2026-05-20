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

async function warmupSingleSound(
  theme,
  type
) {

  const config =
    CLAIM_THEMES[theme];

  if (!config) return;

  const allSounds =
    config.sounds?.[type];

  const loaded =
    config.loadedSounds?.[type];

  if (
    !allSounds?.length
  ) return;

  const base =
  config.baseSounds?.[type] || [];

  const remaining =
  allSounds.filter(

    s =>

      !loaded.includes(s)

      &&

      !base.includes(s)

  );

  if (!remaining.length)
    return;

  const path =
    pick(remaining);

  try {

    await foundry.audio.AudioHelper.play({

      src: path,

      volume: 0,

      autoplay: true,

      loop: false

    }, false);

    loaded.push(path);

console.log(

  "[Magical Falling] Warmed:",

  theme,

  type,

  path

);

  } catch (err) {

    console.warn(
      "Warmup failed:",
      path,
      err
    );

  }

}


  function beginProgressiveWarmup() {

  const theme =
    getPlayerTheme();

  if (!theme) return;

  if (
    !CLAIM_THEMES[theme]
  ) return;

  warmupSingleSound(
    theme,
    "claim"
  );

  warmupSingleSound(
    theme,
    "destroy"
  );

  (async () => {

  while (true) {

    await warmupSingleSound(
      theme,
      "claim"
    );

    await warmupSingleSound(
      theme,
      "destroy"
    );

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          3000
        )
    );

  }

})();

}


const CLAIM_THEMES = {

  tarf: {

    image:
      "modules/magical-falling/assets/claims/bolha_tarf.webp",

    alpha: 0.5,

    scale: 1,

    blendMode:
      PIXI.BLEND_MODES.ADD,

    baseSounds: {

      claim: [

  "modules/magical-falling/assets/sounds/tarf/bubble_1.opus"

],

      destroy: [

  "modules/magical-falling/assets/sounds/tarf/pop_1.opus"

]

},

loadedSounds: {

  claim: [],

  destroy: []

},

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

  underlayImage:
    "modules/magical-falling/assets/claims/nebula_sirius.webp",

  overlayImage:
    "modules/magical-falling/assets/claims/smoke_sirius.webp",

    baseSounds: {

  claim: [

    "modules/magical-falling/assets/sounds/sirius/mag1.opus"

  ],

  destroy: [

    "modules/magical-falling/assets/sounds/sirius/dark1.opus",
    

  ]

},

sounds: {

  claim: [

    "modules/magical-falling/assets/sounds/sirius/mag1.opus",
    "modules/magical-falling/assets/sounds/sirius/mag2.opus",
    "modules/magical-falling/assets/sounds/sirius/mag3.opus",
    "modules/magical-falling/assets/sounds/sirius/mag4.opus",
    "modules/magical-falling/assets/sounds/sirius/mag5.opus",
    "modules/magical-falling/assets/sounds/sirius/mag6.opus"

  ],

  destroy: [

    "modules/magical-falling/assets/sounds/sirius/dark1.opus",
    "modules/magical-falling/assets/sounds/sirius/dark2.opus",
    "modules/magical-falling/assets/sounds/sirius/dark3.opus",
    "modules/magical-falling/assets/sounds/sirius/dark4.opus",
    "modules/magical-falling/assets/sounds/sirius/dark5.opus",
    "modules/magical-falling/assets/sounds/sirius/dark6.opus"

  ]

},

loadedSounds: {

  claim: [],

  destroy: []

},

overlayAnimation(
  overlay,
  underlay
) {

  overlay.targetScale =
  1.2;

if (underlay) {

  underlay.baseScale =
    1.25;

}

  if (underlay) {

    underlay.rotation +=
      0.004;

    const pulse =
      1 +
      Math.sin(
        performance.now() *
        0.003
      ) * 0.04;

    underlay.scale.x =
  underlay.baseScale *
  pulse;

underlay.scale.y =
  underlay.scale.x;

    underlay.alpha =
      0.75 + Math.sin(
        performance.now() *
        0.004
      ) * 0.08;

  }

  overlay.rotation -=
    0.01;

  overlay.scale.x +=
    Math.sin(
      performance.now() *
      0.008
    ) * 0.002;

  overlay.scale.y =
    overlay.scale.x;

  overlay.alpha =
    0.55 + Math.sin(
      performance.now() *
      0.012
    ) * 0.06;

},

    alpha: 0.7,

    scale: 1,

    blendMode:
      PIXI.BLEND_MODES.NORMAL,

    spawnAnimation: {

      wobble: false

    },

    destroyAnimation(sprite) {

      const overlay =
  sprite.claimOverlay;

const underlay =
  sprite.claimUnderlay;

/* =====================
   CHAOS
===================== */

sprite.rotation +=
  rand(-0.25, 0.25);

sprite.x +=
  rand(-2, 2);

sprite.y +=
  rand(-2, 2);

/* =====================
   FLICKER
===================== */

sprite.alpha *= 0.9;

sprite.alpha +=
  Math.random() * 0.08;

/* =====================
   COLLAPSE
===================== */

sprite.scale.x *=
  0.9;

sprite.scale.y =
  sprite.scale.x;

/* =====================
   DARKNESS
===================== */

sprite.tint =
  0x220033;

/* =====================
   OVERLAY CHAOS
===================== */

if (overlay) {

  overlay.rotation +=
    0.08;

  overlay.scale.x *=
    1.04;

  overlay.scale.y =
    overlay.scale.x;

  overlay.alpha *=
    0.96;

}

/* =====================
   UNDERLAY PULSE
===================== */

if (underlay) {

  underlay.rotation -=
    0.04;

  underlay.scale.x *=
    1.02;

  underlay.scale.y =
    underlay.scale.x;

}

/* =====================
   FAKE DISSOLVE
===================== */

if (
  Math.random() < 0.15
) {

  const ghost =
    new PIXI.Sprite(
      sprite.texture
    );

  ghost.anchor.set(0.5);

  ghost.x =
    sprite.x +
    rand(-12, 12);

  ghost.y =
    sprite.y +
    rand(-12, 12);

  ghost.scale.set(
    sprite.scale.x * 0.9
  );

  ghost.alpha =
    0.18;

  ghost.tint =
    0x110022;

  sprite.parent.addChild(
    ghost
  );

  const fade = () => {

    ghost.alpha -= 0.03;

    ghost.scale.x *=
      0.97;

    ghost.scale.y =
      ghost.scale.x;

    if (
      ghost.alpha <= 0
    ) {

      PIXI.Ticker.shared.remove(
        fade
      );

      ghost.destroy();

    }

  };

  PIXI.Ticker.shared.add(
    fade
  );

}

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

  config.overlayImage

  || config.image;

  if (!path) return;

  const texture =
    await foundry.canvas.loadTexture(
      path
    );


  if (theme === "sirius") {

  const underTexture =
    await foundry.canvas.loadTexture(

      "modules/magical-falling/assets/claims/nebula_sirius.webp"

    );

  const underlay =
    new PIXI.Sprite(
      underTexture
    );

  underlay.anchor.set(0.5);

  underlay.alpha = 0.95;

  underlay.scale.set(1);

  underlay.blendMode =
    PIXI.BLEND_MODES.MULTIPLY;

  underlay.x = 0;

  underlay.y = 0;

  sprite.addChildAt(
    underlay,
    0
  );

  sprite.claimUnderlay =
    underlay;

}

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

  if (theme === "sirius") {

  overlay.blendMode =
    PIXI.BLEND_MODES.SCREEN;

  overlay.alpha =
    0.6;

}




  sprite.addChild(overlay);

  sprite.claimOverlay =
    overlay;

}
function playRandomSound(
  theme,
  type
) {

  const config =
    CLAIM_THEMES[theme];

  if (!config) return;

  const sounds =
    config.loadedSounds?.[type];

  if (!sounds?.length)
    return;

  const path =
    pick(sounds);

  foundry.audio.AudioHelper.play({

    src: path,

    volume: 0.4,

    autoplay: true,

    loop: false

  });

}


export class MagicalFallingEngine {

  constructor() {

    this.audioUnlocked =
      false;

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

    const theme =
  getPlayerTheme();
  
  const config =
  CLAIM_THEMES[theme];

  console.log(
  "THEME:",
  theme
);

console.log(
  "CONFIG:",
  config
);

if (
  theme &&
  config?.baseSounds
) {

  foundry.audio.AudioHelper.play({

    src:
     config.baseSounds.claim[0]

  });

  foundry.audio.AudioHelper.play({

    src:
      config.baseSounds.destroy[0],

    volume: 0,

    autoplay: true,

    loop: false

  });

  config.loadedSounds.claim.push(
  config.baseSounds.claim[0]
);

config.loadedSounds.destroy.push(
  config.baseSounds.destroy[0]
);

}

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

    for (
  const sprite of
  this.activeFloaties
) {

  if (
    sprite._updateFunction
  ) {

    PIXI.Ticker.shared.remove(
      sprite._updateFunction
    );

  }

}

    this.activeFloaties = [];

    this.spawnTimers = [];

    this.lastSpawnPositions = [];

    if (this.container) {

      this.container.destroy({
        children: true
      });

      this.container = null;
      

    }

    for (const timer of this.spawnTimers) {

  clearTimeout(timer);

}

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
  !this.audioUnlocked
) {

  this.audioUnlocked =
    true;

  beginProgressiveWarmup();

}

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
  playerTheme,
  "claim"
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
  sprite.claimedBy,
  "destroy"
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

    const underlay =
  sprite.claimUnderlay;

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

const overlayAnim =
  CLAIM_THEMES[
    sprite.claimedBy
  ]?.overlayAnimation;

overlayAnim?.(
  overlay,
  sprite.claimUnderlay
);

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

      if (
  !sprite.destroying &&
  sprite.alpha < 1
) {

  sprite.alpha += 0.01;

}
      /* remove */

     if (!sprite.destroying) {

      const targetScale =
  sprite.hovered
    ? sprite.baseScale * 1.12
    : sprite.baseScale;

sprite.scale.x +=
  (targetScale - sprite.scale.x)
  * 0.08;

sprite.scale.y =
  sprite.scale.x;

}

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