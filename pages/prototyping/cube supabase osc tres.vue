<template>
  <div class="wrapper flexCenter">
    <div class="console fixed left-0 top-0 bg-yellow text-black">
      <div class="grid grid-cols-2 grid gap-x-1">
        <div>start / restart game in 1 sec</div>
        <div><button @click="restartGame()">start</button></div>
      </div>
      <div class="grid grid-cols-2 grid gap-x-1">
        <div>end / stop game</div>
        <div><button @click="endGame()">stop</button></div>
      </div>
      <div class="grid grid-cols-2 grid gap-x-1">
        <div>pause game</div>
        <div><button @click="pauseGame()">pause</button></div>
      </div>
      <div class="grid grid-cols-2 grid gap-x-1">
        <div>resume game</div>
        <div><button @click="resumeGame()">resume</button></div>
      </div>
      <div class="grid grid-cols-2 gap-x-1">
        <div>ball.xSpeed</div>
        <div>
          <input type="range" v-model="ball.xSpeed" step="1" min="1" max="20" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-1">
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
        class="absolute bg-green w-50px h-100% left-0 top-0 ml--50px transition-all duration-200"
      >
        <div
          v-for="n in greenBars"
          class="bg-white w-100% h-10px mt-20px mb-20px"
        ></div>
      </div>
      <div
        :style="{ opacity: playground.rightWall ? '100%' : '0%' }"
        @click="toggleWall('right')"
        class="absolute bg-blue w-50px h-100% right-0 top-0 mr--50px transform-gpu rotate-180 transition-all duration-200"
      >
        <div
          v-for="n in blueBars"
          class="bg-white w-100% h-10px mt-20px mb-20px"
        ></div>
      </div>
      <div
        :style="{ opacity: playground.topWall ? '100%' : '0%' }"
        @click="toggleWall('top')"
        class="absolute bg-yellow w-100% h-50px left-0 top-0 mt--50px grid grid-cols-10 transform-gpu rotate-180 transition-all duration-200"
      >
        <div
          v-for="n in yellowBars"
          class="bg-white w-10px h-50px ml-20px"
        ></div>
      </div>
      <div
        :style="{ opacity: playground.bottomWall ? '100%' : '0%' }"
        @click="toggleWall('bottom')"
        class="absolute bg-red w-100% h-50px left-0 bottom-0 mb--50px grid grid-cols-10 transition-all duration-200"
      >
        <div
          v-for="n in redBars"
          class="bg-white w-10px h-50px ml-20px self-start"
        ></div>
      </div>
      <div
        class="mix-blend-difference absolute aspect-1 bg-white w-$ballWidth rounded-full transform-gpu translate-x-$ballX translate-y-$ballY transition-all duration-20"
      ></div>
    </div>
    <div
      class="fixed left-0 top-0 wrapper bg-transparent flexCenter pointer-events-none"
    >
      <div class="w-300px aspect-1 bg-yellow">
        <TresCanvas v-bind="gl">
          <TresPerspectiveCamera
            :position="[-8.96, -5.21, 13.9]"
            :rotation="[0.36, 0.54, -0.19]"
            :args="[45, 1, 0.1, 1000]"
          />
          <OrbitControls />
          <TresMesh ref="sphereRef" :scale="1">
            <TresSphereGeometry :args="[1, 32, 32]" />
            <TresMeshNormalMaterial />
          </TresMesh>
        </TresCanvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from "three";

const { width, height } = useWindowSize();
const { osc, on, send: sendOSC, bang } = useOSC();
const { data, post } = useBroadcastChannel({ name: "strudelpong" });
const supabase = useSupabaseClient();
const redBars = ref(35);
const blueBars = ref(39);
const greenBars = ref(31);
const yellowBars = ref(45);
let restartGame, pauseGame, endGame, resumeGame;

const gl = reactive({
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
});

const { onLoop } = useRenderLoop();
const sphereRef = shallowRef(null);

onLoop(({ delta, elapsed }) => {
  if (sphereRef.value) {
    sphereRef.value.rotation.y += delta;
    sphereRef.value.rotation.z = elapsed * 0.2;
    sphereRef.value.position.x += 0.01;
    sphereRef.value.position.y -= 0.01;
  }
});

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

  const { pause, resume } = useRafFn(() => {
    ball.x += ball.xSpeed * ball.xDirection;
    ball.y += ball.ySpeed * ball.yDirection;
    if (ball.x + ball.r >= playground.width && playground.rightWall) {
      ball.xDirection = -1;
      bang.value("bounceRightWall");
      post("space");
    } else if (ball.x + ball.r >= playground.width && !playground.rightWall) {
      post("space*8");
      bang.value("endGame");
      endGame();
    }
    if (ball.x - ball.r <= 0 && playground.leftWall) {
      ball.xDirection = 1;
      sendOSC.value("bounceLeftWall", 1);
      post("cp");
    } else if (ball.x - ball.r <= 0 && !playground.leftWall) {
      post("cp*8");
      sendOSC.value("endGame", 1);
      endGame();
    }
    if (ball.y + ball.r >= playground.height && playground.bottomWall) {
      ball.yDirection = -1;
      sendOSC.value("bounceBottomWall", 1);
      post("oh");
    } else if (ball.y + ball.r >= playground.height && !playground.bottomWall) {
      post("oh*8");
      sendOSC.value("endGame", 1);
      endGame();
    }
    if (ball.y - ball.r <= 0 && playground.topWall) {
      ball.yDirection = 1;
      sendOSC.value("bounceTopWall", 1);
      post("crow");
    } else if (ball.y - ball.r <= 0 && !playground.topWall) {
      post("crow*8");
      sendOSC.value("endGame", 1);
      endGame();
    }
  });
  pause();
  resumeGame = resume;
  pauseGame = () => {
    pause();
    sendOSC.value("pauseGame", 1);
  };
  endGame = () => {
    pause();
    ball.x = playground.width / 2;
    ball.y = playground.height / 2;
    bang.value("endGame");
  };
  restartGame = () => {
    pause();
    ball.x = playground.width / 2;
    ball.y = playground.height / 2;
    setTimeout(() => resume(), 0);
    bang.value("restartGame");
  };

  setInterval(() => {
    sendOSC.value("ballX", ball.x);
    sendOSC.value("ballY", ball.y);
  }, 200);
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
  if (direction === "left") {
    playground.leftWall = !playground.leftWall;
    sendOSC.value("toggleLeftWall", 1);
  }
  if (direction === "top") {
    playground.topWall = !playground.topWall;
    sendOSC.value("toggleTopWall", 1);
  }
  if (direction === "right") {
    playground.rightWall = !playground.rightWall;
    sendOSC.value("toggleRightWall", 1);
  }
  if (direction === "bottom") {
    playground.bottomWall = !playground.bottomWall;
    sendOSC.value("toggleBottomWall", 1);
  }
};

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
