<template>
  <div class="wrapper flexCenter">
    <div class="w-$playgroundX aspect-1 bg-white relative">
      <div
        class="absolute w-full h-full left-0 top-0 grid grid-cols-2 text-black justify-between content-between place-content-between"
      >
        <div>top left</div>
        <div class="justify-self-end">top right</div>
        <div>bottom left</div>
        <div class="justify-self-end">bottom right</div>
      </div>
      <div
        class="absolute aspect-1 bg-black w-20px rounded-full transform-gpu translate-x-$ballX"
      ></div>
    </div>
  </div>
</template>

<script setup>
const { data, post } = useBroadcastChannel({ name: "tostrudel" });
const ball = reactive({ x: 200, y: 0, speed: 1, r: 10 });
const ballX = compCss("ballX", () => `${ball.x}px`);
const playgroundX = css("playgroundX", "300px");

onKeyStroke(["a", "A"], (e) => {
  ball.x -= ball.speed;
  console.log(ball.x);
});
</script>
