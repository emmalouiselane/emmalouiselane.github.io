<script setup>
import { onMounted, onUnmounted } from "vue";
import { backgroundColour, dialogueData, scaleFactor } from "../../interactive/constants";
import { k } from "../../interactive/kaplayCtx";
import { displayDialogue, setCamScale } from "../../interactive/utils";
//import initialiseGame from '../../interactive/main.js';

// components
import Navbar from "../../components/Navbar.vue";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");

  //initialiseGame();
  k.loadSprite("spritesheet", "/spritesheet.png", {
      sliceX: 39,
      sliceY: 31,
      anims: {
          "idle-down": 952,
          "walk-down": { from: 952, to: 955, loop: true, speed: 8 },
          "idle-side": 991,
          "walk-side": { from: 991, to: 994, loop: true, speed: 8 },
          "idle-up": 1030,
          "walk-up": { from: 1030, to: 1033, loop: true, speed: 8 }
      }
  });

  k.loadSprite("map", "/map.png");

  k.setBackground(k.Color.fromHex(backgroundColour));

  k.scene("scene_1", async () => {
      const mapData = await (await fetch("/map.json")).json();
      const layers = mapData.layers;

      const map = k.add([
          k.sprite("map"),
          k.pos(0),
          k.scale(scaleFactor)
      ]);

      const player = k.make([
          k.sprite("spritesheet", { anim: "idle-down"}),
          k.area({ shape: new k.Rect(k.vec2(0,3), 10, 10) }), //Player sprite is 16x16
          k.body(),
          //k.anchor("center"),
          k.pos(),
          k.scale(scaleFactor),
          {
              speed: 250,
              direction: "down",
              isInDialogue: false
          },
          "player" //Identifies object; To be used in onCollide
      ]);

      for (const layer of layers) {
          if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
              map.add([
                k.area({
                  shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                }),
                k.body({ isStatic: true }),
                k.pos(boundary.x, boundary.y),
                boundary.name,
              ]);
      
              if (boundary.name) {
                player.onCollide(boundary.name, () => {
                  player.isInDialogue = true;
                  displayDialogue(
                    dialogueData[boundary.name],
                    () => (player.isInDialogue = false)
                  );
                });
              }
            }
      
            continue;
          }
      
          if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
              if (entity.name === "player") {
                player.pos = k.vec2(
                  (map.pos.x + entity.x) * scaleFactor,
                  (map.pos.y + entity.y) * scaleFactor
                );
                k.add(player);
                continue;
              }
            }
          }
        }

        setCamScale(k);

        k.onResize(() => {
          setCamScale(k);
        });
      
        k.onUpdate(() => {
          k.camPos(player.worldPos().x, player.worldPos().y - 100);
        });

        k.onMouseDown((mouseBtn) => {
          if (mouseBtn !== "left" || player.isInDialogue) return;
      
          const worldMousePos = k.toWorld(k.mousePos());
          player.moveTo(worldMousePos, player.speed);
      
          const mouseAngle = player.pos.angle(worldMousePos);
      
          const lowerBound = 50;
          const upperBound = 125;
      
          if (
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up"
          ) {
            player.play("walk-up");
            player.direction = "up";
            return;
          }
      
          if (
            mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== "walk-down"
          ) {
            player.play("walk-down");
            player.direction = "down";
            return;
          }
      
          if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
          }
      
          if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
          }
        });
      
        function stopAnims() {
          if (player.direction === "down") {
            player.play("idle-down");
            return;
          }
          if (player.direction === "up") {
            player.play("idle-up");
            return;
          }
      
          player.play("idle-side");
        }
      
        k.onMouseRelease(stopAnims);
      
        k.onKeyRelease(() => {
          stopAnims();
        });
        k.onKeyDown((key) => {
          const keyMap = [
            k.isKeyDown("right") || k.isKeyDown("d"),
            k.isKeyDown("left") || k.isKeyDown("a"),
            k.isKeyDown("up") || k.isKeyDown("w"),
            k.isKeyDown("down") || k.isKeyDown("s"),
            k.isKeyDown("space")
          ];
      
          let nbOfKeyPressed = 0;
          for (const key of keyMap) {
            if (key) {
              nbOfKeyPressed++;
            }
          }
      
          if (nbOfKeyPressed > 1) return;
      
          if (player.isInDialogue) return;
          if (keyMap[0]) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            player.move(player.speed, 0);
            return;
          }
      
          if (keyMap[1]) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            player.move(-player.speed, 0);
            return;
          }
      
          if (keyMap[2]) {
            if (player.curAnim() !== "walk-up") player.play("walk-up");
            player.direction = "up";
            player.move(0, -player.speed);
            return;
          }
      
          if (keyMap[3]) {
            if (player.curAnim() !== "walk-down") player.play("walk-down");
            player.direction = "down";
            player.move(0, player.speed);
          }
        });
  });

  k.go("scene_1");
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");

  k.destroy();
});
</script>

<style>
@font-face {
  font-family: monogram;
  src: url(monogram.ttf);
}

body {
  font-family: monogram, monospace;
  font-size: 2rem;
  overflow: hidden;
}

#interactive-app {
  height: 0;
}

#textbox {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 2vh;
  min-height: 10vh;
  background: white;
  border-radius: 3px;
  outline-style: solid;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  word-spacing: 0.2rem;
  filter: drop-shadow(0 0 0.75rem rgb(112, 112, 112));
  /* overflow: auto; */
}

.ui-text {
  margin: 0;
  user-select: none;
}

.ui-close-btn {
  font-family: monogram, monospace;
  border-style: none;
  border-radius: 3px;
  padding: 1rem;
  font-size: inherit;
}

.btn-container {
  align-self: flex-end;
  margin-top: 1rem;
}
</style>

<template>
  <!-- <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <Navbar :sticky="true" />
      </div>
    </div>
  </div> -->
  
  <div id="interactive-app">
   
      <!-- <p class="left-note">Tap/Click around to move</p> -->

      <div id="textbox-container" style="display: none">
        <div id="textbox">
          <p id="dialogue" class="ui-text"></p>
          <div class="btn-container">
            <button id="close" class="ui-close-btn">Close</button>
          </div>
        </div>
      </div>

      <!-- <p class="right-note">IN DEVELOPMENT</p> -->
    <canvas id="game"></canvas>
  </div>
</template>
