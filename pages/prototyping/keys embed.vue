<template>
  <div class="wrapper flexCenter bg-black">
    <div
      class="text-center w-25vw fixed left-0 top-4 text-white font-sans text-5vw"
    >
      <span class="ml-3px">Ablepong</span> :||
    </div>
    <div class="h-full w-50vw bg-white relative">
      <div
        class="w-$ballSize aspect-1 bg-black rounded-full absolute transform-gpu translate-x-$ballX translate-y-$ballY transitin-all duration-200"
      >
        <div class="smallerCircle"></div>
      </div>
      <div
        class="w-$playerSize h-50px transform-gpu translate-x-$playerX bg-black absolute bottom-0 left-50%"
      >
        <div v-for="n in 3" class="smallerLine"></div>
      </div>
    </div>
    <div class="fixed right-0 top-0 w-25vw">
      <Script src="/strudelembed.js"></Script>
      <strudel-repl width="25vw">
        <!--
          s("bd sd, hh*4")
      -->
      </strudel-repl>
    </div>
  </div>
</template>

<script setup>
import { initStrudel } from "@strudel/web";
initStrudel({
  prebake: () => samples("github:tidalcycles/Dirt-Samples/master"),
});

const { x } = useMouse();
const { width, height } = useWindowSize();
const playerSize = ref(150);
const playerSizeCss = css("playerSize", playerSize.value + "px");
const playerPosition = ref([100, 0]);
const playerX = css(
  "playerX",
  `${playerPosition.value[0]}-${playerSize.value / 2}px`
);

const ballSize = ref("50");
const ballSizeCss = css("ballSize", ballSize.value + "px");
const ballDirection = ref([1, 1]);
const ballSpeed = ref(100);
const ballPosition = ref([200, 200]);
const ballXCss = css("ballX", `${300 - ballSize.value / 2}px`);
const ballYCss = css("ballY", `${300 - ballSize.value / 2}px`);
watchEffect(() => {
  playerX.value = `${
    map(x.value, 0, width.value, -width.value / 4, width.value / 4) -
    playerSize.value / 2
  }px`;

  ballXCss.value = `${ballPosition.value[0] - ballSize.value / 2}px`;
  ballYCss.value = `${ballPosition.value[1] - ballSize.value / 2}px`;
});

let frameCount = 0;
const { pause, resume } = useRafFn(() => {
  frameCount++;
  if (frameCount % 60 === 0) {
  }
});

onKeyStroke(["a", "A", "ArrowLeft"], (e) => {
  e.preventDefault();
  ballPosition.value[0] -= ballSpeed.value;
});

onKeyStroke(["d", "D", "ArrowRight"], (e) => {
  e.preventDefault();
  ballPosition.value[0] += ballSpeed.value;
});

onKeyStroke(["w", "W", "ArrowUp"], (e) => {
  e.preventDefault();
  ballPosition.value[1] -= ballSpeed.value;
});

onKeyStroke(["s", "S", "ArrowDown"], (e) => {
  e.preventDefault();
  ballPosition.value[1] += ballSpeed.value;
});
</script>
