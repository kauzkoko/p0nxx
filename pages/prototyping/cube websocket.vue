<template>
  <div class="wrapper flexCenter">
    <div class="console fixed left-0 top-0 bg-yellow text-black">
      <div><button @click="post('crow')">send cp</button></div>
      <div class="grid grid-cols grid-2 gap-x-2">
        <div>ball.xSpeed</div>
        <div>
          <input type="range" v-model="ball.xSpeed" step="1" min="1" max="20" />
        </div>
      </div>
      <div class="grid grid-cols grid-2 gap-x-2">
        <div>ball.ySpeed</div>
        <div>
          <input type="range" v-model="ball.ySpeed" step="1" min="1" max="20" />
        </div>
      </div>
    </div>
    <div class="w-$playgroundX aspect-1 bg-white relative">
      <div
        :style="{ opacity: playground.leftWall ? '100%' : '0%' }"
        @click="toggleWall('left')"
        class="absolute bg-green w-50px h-100% left-0 top-0 ml--50px"
      ></div>
      <div
        :style="{ opacity: playground.rightWall ? '100%' : '0%' }"
        @click="toggleWall('right')"
        class="absolute bg-blue w-50px h-100% right-0 top-0 mr--50px"
      ></div>
      <div
        :style="{ opacity: playground.topWall ? '100%' : '0%' }"
        @click="toggleWall('top')"
        class="absolute bg-yellow w-100% h-50px left-0 top-0 mt--50px"
      ></div>
      <div
        :style="{ opacity: playground.bottomWall ? '100%' : '0%' }"
        @click="toggleWall('bottom')"
        class="absolute bg-red w-100% h-50px left-0 bottom-0 mb--50px"
      ></div>
      <!-- <div
        class="absolute w-full h-full left-0 top-0 grid grid-cols-2 text-black justify-between content-between place-content-between"
      >
        <div>top left</div>
        <div class="justify-self-end">top right</div>
        <div>bottom left</div>
        <div class="justify-self-end">bottom right</div>
      </div> -->
      <div
        class="difference absolute aspect-1 bg-black w-$ballWidth rounded-full transform-gpu translate-x-$ballX translate-y-$ballY"
      ></div>
    </div>
  </div>
</template>

<script setup>
const { data, post } = useBroadcastChannel({ name: "strudelpong" });
const supabase = useSupabaseClient();
let channel;
onMounted(() => {
  channel = supabase.channel("strudelpong");
  channel
    .on("broadcast", { event: "walls" }, (event) => {
      switch (event.payload.wall) {
        case "left":
          playground.leftWall = event.payload.wallValue;
          break;
        case "top":
          playground.topWall = event.payload.wallValue;
          break;
        case "right":
          playground.rightWall = event.payload.wallValue;
          break;
        case "bottom":
          playground.bottomWall = event.payload.wallValue;
          break;
        default:
          return;
      }

      console.log(event);
    })
    .subscribe();
});
const playground = reactive({
  width: 300,
  height: 300,
  leftWall: true,
  topWall: true,
  rightWall: true,
  bottomWall: true,
});
const playgroundX = css("playgroundX", playground.width + "px");
const ball = reactive({
  x: playground.width / 2,
  y: playground.height / 2,
  xSpeed: Math.random() * 3 + 1,
  ySpeed: Math.random() * 3 + 1,
  xDirection: Math.round(Math.random()) ? 1 : -1,
  yDirection: Math.round(Math.random()) ? 1 : -1,
  r: 10,
});

const ballX = css("ballX", ball.x - ball.r + "px");
const ballY = css("ballY", ball.y - ball.r + "px");
const ballWidth = css("ballWidth", ball.r * 2 + "px");
watchEffect(() => {
  ballX.value = `${ball.x - ball.r}px`;
  ballY.value = `${ball.y - ball.r}px`;
});

setInterval(() => {
  post("wind");
}, 1000);

const toggleWall = (direction) => {
  if (direction === "left") playground.leftWall = !playground.leftWall;
  if (direction === "top") playground.topWall = !playground.topWall;
  if (direction === "right") playground.rightWall = !playground.rightWall;
  if (direction === "bottom") playground.bottomWall = !playground.bottomWall;
};

const { pause, resume } = useRafFn(() => {
  //move the ball every frame and bounce it off the walls
  ball.x += ball.xSpeed * ball.xDirection;
  ball.y += ball.ySpeed * ball.yDirection;
  if (ball.x + ball.r >= playground.width && playground.rightWall) {
    ball.xDirection = -1;
    post("space");
  }
  if (ball.x - ball.r <= 0 && playground.leftWall) {
    ball.xDirection = 1;
    post("cp");
  }
  if (ball.y + ball.r >= playground.height && playground.bottomWall) {
    ball.yDirection = -1;
    post("oh");
  }
  if (ball.y - ball.r <= 0 && playground.topWall) {
    ball.yDirection = 1;
    post("crow");
  }
});

let getXBallSpeed = computed(() => parseFloat(ball.xSpeed));
let getYBallSpeed = computed(() => parseFloat(ball.ySpeed));
onKeyStroke(["a", "A"], (e) => {
  ball.x -= getXBallSpeed.value;
});

onKeyStroke(["d", "D"], (e) => {
  ball.x += getXBallSpeed.value;
});

onKeyStroke(["w", "W"], (e) => {
  ball.y -= getYBallSpeed.value;
});

onKeyStroke(["s", "S"], (e) => {
  ball.y += getYBallSpeed.value;
});
</script>
