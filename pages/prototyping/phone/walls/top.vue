<template>
  <div class="wrapper" @click="trigger('top')">
    <div
      class="overflow-hidden absolute bg-yellow w-screen h-screen top-0 left-0 transform-gpu translate-y-$top transition-all duration-300 text-black text-80vh flexCenter"
    >
      <div class="grid grid-cols-15">
        <div
          v-for="n in 64"
          :style="{
            backgroundColor:
              n % 3 === 0 ? 'yellow' : n % 2 === 0 ? 'black' : 'white',
          }"
          class="w-3rem h-50vh"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  superdough,
  samples,
  initAudioOnFirstClick,
  registerSynthSounds,
} from "superdough";

const top = css("top", "80vh");
const supabase = useSupabaseClient();
let channel;

onMounted(() => {
  channel = supabase.channel("strudelpong");
});

let counter = 0;
const trigger = (wall) => {
  if (!counter) {
    const init = Promise.all([
      initAudioOnFirstClick(),
      samples("github:tidalcycles/Dirt-Samples/master"),
      registerSynthSounds(),
    ]);
  }
  top.value = top.value ? 0 : "80vh";
  let wallValue = !top.value ?? false;
  superdough({ s: "bd" }, 0);
  channel.send({
    type: "broadcast",
    event: "walls",
    payload: { wall, wallValue: wallValue },
  });
};

onKeyStroke([" ", " "], (e) => {
  trigger("bottom");
});
</script>
