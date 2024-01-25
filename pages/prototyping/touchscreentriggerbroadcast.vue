<template>
  <div class="wrapper" @click="trigger()">
    <div
      class="overflow-hidden absolute bg-white w-screen h-screen top-0 left-0 transform-gpu translate-y-$top transition-all duration-300 text-black text-80vh flexCenter"
    >
      <div class="grid grid-cols-15">
        <div
          v-for="n in 64"
          :style="{ backgroundColor: n % 2 === 0 ? 'black' : 'white' }"
          class="w-3rem h-50vh"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data, post } = useBroadcastChannel({ name: "strudelpong" });
const top = css("top", "80vh");
const trigger = () => {
  top.value = top.value ? 0 : "80vh";
  let wallValue = !top.value ? "leftWallOn" : "leftWallOff";
  post(wallValue);
};
</script>
