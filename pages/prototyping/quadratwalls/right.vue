<template>
  <div class="wrapper" @click="trigger('right')">
    <div
      class="overflow-hidden absolute bg-blue w-screen h-screen top-0 left-0 transform-gpu translate-y-$top transition-all duration-300 text-black text-80vh flexCenter"
    >
      <div class="grid grid-cols-15">
        <div
          v-for="n in 64"
          :style="{
            backgroundColor:
              n % 3 === 0 ? 'blue' : n % 2 === 0 ? 'black' : 'white',
          }"
          class="w-3rem h-50vh"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const top = css("top", "60vh");
const supabase = useSupabaseClient();
let channel;

const wall = ref(false);
const trigger = (direction) => {
  top.value = wall.value ? 0 : "60vh";
  channel.send({
    type: "broadcast",
    event: "walls",
    payload: { wall: direction, wallValue: wall.value },
  });
};

onMounted(() => {
  channel = supabase.channel("strudelpong");
  channel
    .on("broadcast", { event: "walls" }, (event) => {
      wall.value = event.payload.wallRight;
      top.value = wall.value ? 0 : "60vh";
    })
    .subscribe();
});
</script>
