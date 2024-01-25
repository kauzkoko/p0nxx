<template>
  <div class="wrapper flexCenter">
    <div
      v-show="wallLeft"
      class="absolute grid grid-cols-15 left-0 top-0 h-full w-10vw"
      v-for="n in show.number"
    >
      <div
        v-for="n in 64"
        :style="{
          backgroundColor:
            n % 3 === 0 ? 'green' : n % 2 === 0 ? 'black' : 'white',
        }"
        class="w-3rem h-50vh"
      ></div>
    </div>
    <div
      v-show="wallRight"
      class="absolute grid grid-cols-15 right-0 top-0 h-full w-25vw"
      v-for="n in show.number"
    >
      <div
        v-for="n in 64"
        :style="{
          backgroundColor:
            n % 3 === 0 ? 'blue' : n % 2 === 0 ? 'black' : 'white',
        }"
        class="w-3rem h-50vh"
      ></div>
    </div>
    <div
      v-show="wallTop"
      class="absolute grid grid-cols-15 left-0 top-0 h-10vw w-screen overflow-hidden"
      v-for="n in show.number"
    >
      <div
        v-for="n in 64"
        :style="{
          backgroundColor:
            n % 3 === 0 ? 'yellow' : n % 2 === 0 ? 'black' : 'white',
        }"
        class="h-3rem w-50vh"
      ></div>
    </div>
    <div
      class="absolute grid grid-cols-15 left-0 bottom-0 h-10vw w-screen overflow-hidden"
      v-show="wallBottom"
      v-for="n in show.number"
    >
      <div
        v-for="n in 64"
        :style="{
          backgroundColor:
            n % 3 === 0 ? 'red' : n % 2 === 0 ? 'black' : 'white',
        }"
        class="h-3rem w-50vh"
      ></div>
    </div>
    <div>
      <div class="fixed left-0 top-0 wrapper flexCenter bg-transparent">
        <div
          @click="gameStatus === 'paused' ? send('resume') : send('pause')"
          class="circle bg-yellow w-150px flexCenter text-black text-30px text-bold user-select-none"
        >
          {{ score }}
        </div>
      </div>
      <div
        @click="
          gameStatus === 'ended'
            ? send('restart')
            : gameStatus === 'paused'
            ? send('resume')
            : send('restart')
        "
        class="fixed left-50vw top-50vh transform-gpu translate-x--50% translate-y--50% text-40px bg-red mt-2 p-3 transition-all duration-300 whitespace-nowrap"
        :style="{
          opacity:
            gameStatus === 'ended' ||
            gameStatus === 'paused' ||
            gameStatus === 'ready'
              ? '100%'
              : '0%',
        }"
      >
        {{
          gameStatus === "ended"
            ? "game over – restart?"
            : gameStatus === "paused"
            ? "paused – continue?"
            : gameStatus === "ready"
            ? "ready – start?"
            : ""
        }}
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let channel;

let colors = ["red", "blue", "green", "yellow"];
const { state, next, prev } = useCycleList(colors);
const show = ref({ number: 0, color: "red" });
const { pause, resume, isActive } = useIntervalFn(() => {
  if (show.value.number < 20) show.value.number++;
  else show.value.number = 0;
  next();
  show.value.color = state.value;
}, 1000);

const score = ref(0);
const gameStatus = ref("ready");
const send = (action) => {
  console.log(action);
  channel.send({
    type: "broadcast",
    event: "phoneControls",
    payload: { action },
  });
};

const wallLeft = ref(false);
const wallRight = ref(false);
const wallTop = ref(false);
const wallBottom = ref(false);
watch([wallLeft, wallRight, wallTop, wallBottom], (v) => {
  console.log(v);
});
onMounted(() => {
  channel = supabase.channel("strudelpong");
  channel
    .on("broadcast", { event: "gameEvents" }, (event) => {
      switch (event.payload.action) {
        case "resume":
          console.log(event.payload.action);
          gameStatus.value = "started";
          break;
        case "end":
          console.log(event.payload.action);
          gameStatus.value = "ended";
          score.value = 0;
          break;
        case "restart":
          console.log(event.payload.action);
          gameStatus.value = "started";
          score.value = 0;
          break;
        case "pause":
          console.log(event.payload.action);
          gameStatus.value = "paused";
          break;
        case "score":
          console.log(event.payload.action, event.payload.score);
          score.value = event.payload.score;
          break;
        default:
          return;
      }
    })
    .on("broadcast", { event: "walls" }, (event) => {
      wallLeft.value = event.payload.wallLeft;
      wallRight.value = event.payload.wallRight;
      wallTop.value = event.payload.wallTop;
      wallBottom.value = event.payload.wallBottom;
    })
    .subscribe();
});
</script>
