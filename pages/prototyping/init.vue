<template>
  <div class="wrapper flexCenter bg-black">
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
  </div>
</template>

<script setup>
const { x } = useMouse();
const { width, height } = useWindowSize();
const playerSize = css("playerSize", "150px");
const ballSize = css("ballSize", "50px");
const playerX = css("playerX", `-${playerSize.value.slice(0, -2) / 2}px`);
const ballX = css("ballX", `${300 - ballSize.value.slice(0, -2) / 2}px`);
const ballY = css("ballY", `${300 - ballSize.value.slice(0, -2) / 2}px`);
watchEffect(() => {
  playerX.value = `${
    map(x.value, 0, width.value, -width.value / 4, width.value / 4) -
    playerSize.value.slice(0, -2) / 2
  }px`;
});

let frameCount = 0;
const { pause, resume } = useRafFn(() => {
  frameCount++;
  if (frameCount % 60 === 0) {
    ballX.value = `${
      Math.floor(Math.random() * (width.value / 2)) -
      ballSize.value.slice(0, -2) / 2
    }px`;
    ballY.value = `${
      Math.floor(Math.random() * height.value) - ballSize.value.slice(0, -2) / 2
    }px`;
  }
});
</script>
