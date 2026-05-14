import { FLOATIES } from "./floaties.js";

import {
  rand,
  pick
} from "./utils.js";

export class MagicalFallingEngine {

  constructor() {

    this.container = null;

    this.activeFloaties = [];

    this.targetCount = 6;

    this.enabled = false;

    this.lastSpawnedIds = [];

  }

    async start() {

    if (this.enabled) return;

    this.enabled = true;

    this.container = new PIXI.Container();

    canvas.stage.addChild(this.container);

    this.loop();

  }

  stop() {

    this.enabled = false;

    if (this.container) {

      this.container.destroy({
        children: true
      });

      this.container = null;

    }

    this.activeFloaties = [];

  }

    async loop() {

    while (this.enabled) {

      if (
        this.activeFloaties.length <
        this.targetCount
      ) {

        this.spawnFloatie();

      }

      await foundry.utils.sleep(1000);

    }

  }

    getRandomFloatie() {

    const available = FLOATIES.filter(
      f => !this.lastSpawnedIds.includes(f.id)
    );

    const pool =
      available.length
        ? available
        : FLOATIES;

    const totalWeight = pool.reduce(
      (sum, f) => sum + (f.weight || 1),
      0
    );

    let roll = Math.random() * totalWeight;

    for (const floatie of pool) {

      roll -= (floatie.weight || 1);

      if (roll <= 0) {

        this.lastSpawnedIds.push(
          floatie.id
        );

        if (
          this.lastSpawnedIds.length > 3
        ) {
          this.lastSpawnedIds.shift();
        }

        return floatie;

      }

    }

    return pick(pool);

  }

    async spawnFloatie() {

    const data =
      this.getRandomFloatie();

    if (!data) return;

    const texture =
      await loadTexture(data.image);

    const sprite =
      new PIXI.Sprite(texture);

    sprite.anchor.set(0.5);

    const scale =
      rand(0.2, 0.45);

    sprite.scale.set(scale);

    sprite.x = rand(600, 1800);

    sprite.y = 1300;

    sprite.alpha = 0;

    sprite.eventMode = "static";

    sprite.cursor = "pointer";

    sprite.floatieData = data;

        sprite.on("pointerdown", (event) => {

      if (event.button === 2) {

        console.log(
          "Right click:",
          data.id
        );

      } else {

        console.log(
          "Left click:",
          data.id
        );

        this.destroyFloatie(sprite);

      }

    });

        this.container.addChild(sprite);

    this.activeFloaties.push(sprite);

    const speed =
      0.3 + ((1 - scale) * 1.2);

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
        performance.now() - startTime;

      sprite.y -= speed;

      sprite.x += drift;

      sprite.x +=
        Math.sin(t * wobbleSpeed)
        * wobbleStrength;

      sprite.rotation +=
        rotationSpeed;

      if (sprite.alpha < 1) {

        sprite.alpha += 0.01;

      }

      if (sprite.y < -300) {

        ticker.remove(update);

        this.removeFloatie(sprite);

      }

    };

    ticker.add(update);

    sprite._updateFunction =
      update;

  }

    destroyFloatie(sprite) {

    const ticker =
      PIXI.Ticker.shared;

    if (sprite._updateFunction) {

      ticker.remove(
        sprite._updateFunction
      );

    }

    this.removeFloatie(sprite);

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

