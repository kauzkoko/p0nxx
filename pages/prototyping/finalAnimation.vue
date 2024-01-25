<template>
  <div class="wrapper flexCenter cursor-none font-sans">
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
        class="mix-blend-difference absolute aspect-1 bg-yellow w-$ballWidth rounded-full transform-gpu translate-x-$ballX translate-y-$ballY transition-transform duration-20"
        :style="{ opacity: fadeOut ? '0%' : '100%', transition: 'opacity 3s' }"
      ></div>
    </div>
    <div
      @click="
        gameStatus === 'ended'
          ? restartGame()
          : gameStatus === 'paused'
          ? resumeGame()
          : restartGame()
      "
      class="fixed left-50vw top-50vh transform-gpu translate-x--50% translate-y--50% text-40px bg-red mt-2 p-3 transition-all duration-300"
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
</template>

<script setup>
const { osc, on, send: sendOSC, bang } = useOSC();
const supabase = useSupabaseClient();
const redBars = ref(35);
const blueBars = ref(39);
const greenBars = ref(31);
const yellowBars = ref(45);
setPageLayout("none");

// playground
let size = 400;
const playground = reactive({
  width: size,
  height: size,
  leftWall: false,
  topWall: false,
  rightWall: false,
  bottomWall: false,
});
const playgroundX = css("playgroundX", playground.width + "px");

// ball
let speed = 0.9;
let startX = playground.width / 2;
let startY = -playground.height - 70;
let startXSpeed = 1.9 * speed;
let startYSpeed = 2.4 * speed;
let random = Math.random();
// let startXDirection =
//   random > 0.5
//     ? map(random, 0.5, 1, 0.2, 0.3)
//     : map(random, 0, 0.5, -0.2, -0.3);
let startXDirection = 0.2;
let startYDirection = 1;
let startBallValues = {
  x: startX,
  y: startY,
  xSpeed: startXSpeed,
  ySpeed: startYSpeed,
  xDirection: startXDirection,
  yDirection: startYDirection,
  r: 20,
};
const ball = reactive(startBallValues);
const ballX = css("ballX", ball.x - ball.r + "px");
const ballY = css("ballY", ball.y - ball.r + "px");
const ballWidth = css("ballWidth", ball.r * 2 + "px");

let sendWalls = () => {
  channel.send({
    type: "broadcast",
    event: "walls",
    payload: {
      wallLeft: playground.leftWall,
      wallRight: playground.rightWall,
      wallTop: playground.topWall,
      wallBottom: playground.bottomWall,
    },
  });
};
const concurrentWalls = ref(2);
const walls = ref([]);
watch(playground, () => {
  console.log(walls.value);
  if (walls.value.length > concurrentWalls.value) {
    let removeWall = walls.value[0];
    walls.value = walls.value.slice(-concurrentWalls.value);
    playground[removeWall] = false;
  }
  console.log("should send");
  sendWalls();
});
const toggleWall = (direction) => {
  if (direction === "left") {
    playground.leftWall = !playground.leftWall;
    if (
      walls.value[walls.value.length - 1] !== "leftWall" &&
      playground.leftWall
    ) {
      walls.value.push("leftWall");
    } else {
      walls.value = walls.value.filter((wall) => wall !== "leftWall");
    }
    sendOSC.value("toggleLeftWall", 1);
  }
  if (direction === "top") {
    playground.topWall = !playground.topWall;
    if (
      walls.value[walls.value.length - 1] !== "topWall" &&
      playground.topWall
    ) {
      walls.value.push("topWall");
    } else {
      walls.value = walls.value.filter((wall) => wall !== "topWall");
    }
    sendOSC.value("toggleTopWall", 1);
  }
  if (direction === "right") {
    playground.rightWall = !playground.rightWall;
    if (
      walls.value[walls.value.length - 1] !== "rightWall" &&
      playground.rightWall
    ) {
      walls.value.push("rightWall");
    } else {
      walls.value = walls.value.filter((wall) => wall !== "rightWall");
    }
    sendOSC.value("toggleRightWall", 1);
  }
  if (direction === "bottom") {
    playground.bottomWall = !playground.bottomWall;
    if (
      walls.value[walls.value.length - 1] !== "bottomWall" &&
      playground.bottomWall
    ) {
      walls.value.push("bottomWall");
    } else {
      walls.value = walls.value.filter((wall) => wall !== "bottomWall");
    }
    sendOSC.value("toggleBottomWall", 1);
  }
};

let names = [
  "weirdo",
  "stroll",
  "senfbraten",
  "ekmek",
  "playboy2002",
  "strudlerqueen",
  "weirdass",
  "lamm",
  "anja",
  "tsch fruh",
  "sonne",
  "mama",
  "hotel m",
  "swizzEU",
  "schnitzel",
  "chez monique",
  "rasa w",
  "seifenwasch 2",
  "seifenwasch",
];
const customName = ref("");
const highscores = ref([]);
const sortedHighscores = useSorted(highscores, (a, b) => b.score - a.score);
const getHighscores = async () => {
  let { data, error } = await supabase.from("starcube_highscores").select("*");
  highscores.value = data;
};
const setHighscore = async () => {
  let scoreName =
    customName.value === ""
      ? names[Math.floor(Math.random() * names.length)]
      : customName.value;
  const { data, error } = await supabase.from("starcube_highscores").insert([
    {
      name: scoreName,
      score: score.value,
    },
  ]);
  getHighscores();
};

watchEffect(() => {
  ballX.value = `${ball.x - ball.r}px`;
  ballY.value = `${ball.y - ball.r}px`;
});

// game
let endDelay = 3000;
const score = ref(0);
const lastGameStatus = ref("ready");
const gameStatus = ref("ready");
const fadeOut = ref(false);
let restartGame, pauseGame, endGame, resumeGame;
let channel;
onMounted(() => {
  // supabase walls
  getHighscores();
  channel = supabase.channel("strudelpong");
  channel
    .on("broadcast", { event: "walls" }, (event) => {
      switch (event.payload.wall) {
        case "left":
          toggleWall("left");
          break;
        case "top":
          toggleWall("top");
          break;
        case "right":
          toggleWall("right");
          break;
        case "bottom":
          toggleWall("bottom");
          break;
        default:
          return;
      }
    })
    // phone interface
    .on("broadcast", { event: "phoneControls" }, (event) => {
      console.log(event.payload.action);
      switch (event.payload.action) {
        case "restart":
          console.log(event.payload.action);
          restartGame();
          break;
        case "end":
          endGame();
          console.log(event.payload.action);
          break;
        case "resume":
          resumeGame();
          console.log(event.payload.action);
          break;
        case "pause":
          pauseGame();
          console.log(event.payload.action);
          break;
        default:
          return;
      }
    });
  // ball movement / collision
  const { pause, resume } = useRafFn(() => {
    ball.x += ball.xSpeed * ball.xDirection;
    ball.y += ball.ySpeed * ball.yDirection;
    if (gameStatus.value === "inCube") {
      if (
        (ball.x + ball.r > playground.width || ball.x + ball.r < 0) &&
        playground.rightWall &&
        gameStatus.value === "inCube"
      ) {
        ball.xDirection = -1;
        score.value++;
        bang.value("bounce");
      } else if (
        (ball.x + ball.r > playground.width || ball.x + ball.r < 0) &&
        !playground.rightWall
      ) {
        endGame();
      }
      if (
        (ball.x - ball.r < 0 || ball.x - ball.r > playground.width) &&
        playground.leftWall &&
        gameStatus.value === "inCube"
      ) {
        ball.xDirection = 1;
        score.value++;
        bang.value("bounce");
      } else if (
        (ball.x - ball.r < 0 || ball.x - ball.r > playground.width) &&
        !playground.leftWall
      ) {
        endGame();
      }
      if (
        (ball.y + ball.r > playground.height || ball.y + ball.r < 0) &&
        playground.bottomWall &&
        gameStatus.value === "inCube"
      ) {
        ball.yDirection = -1;
        score.value++;
        bang.value("bounce");
      } else if (
        (ball.y + ball.r > playground.height || ball.y + ball.r < 0) &&
        !playground.bottomWall
      ) {
        endGame();
      }
      if (
        (ball.y - ball.r < 0 || ball.y - ball.r > playground.height) &&
        playground.topWall &&
        gameStatus.value === "inCube"
      ) {
        ball.yDirection = 1;
        score.value++;
        bang.value("bounce");
      } else if (
        (ball.y - ball.r < 0 || ball.y - ball.r > playground.height) &&
        !playground.topWall
      ) {
        endGame();
      }
    } else {
      if (ball.y - ball.r > 0 && gameStatus.value === "started") {
        gameStatus.value = "inCube";
      }
    }
  });

  // game state controls
  pause();
  resumeGame = () => {
    resume();
    channel.send({
      type: "broadcast",
      event: "gameEvents",
      payload: { action: "resume" },
    });
    gameStatus.value = lastGameStatus.value;
  };
  pauseGame = () => {
    pause();
    channel.send({
      type: "broadcast",
      event: "gameEvents",
      payload: { action: "pause" },
    });
    lastGameStatus.value = gameStatus.value;
    gameStatus.value = "paused";
  };
  endGame = () => {
    gameStatus.value = "outOfCube";
    fadeOut.value = true;
    setTimeout(() => {
      pause();
      let random = Math.random();
      let startXDirection =
        random > 0.5
          ? map(random, 0.5, 1, 0.2, 0.5)
          : map(random, 0, 0.5, -0.2, -0.5);
      startXDirection = -0.3;
      let startYDirection = 1;
      ball.x = startX;
      ball.y = startY;
      ball.xDirection = startXDirection;
      ball.yDirection = startYDirection;
      ball.xSpeed = startXSpeed;
      ball.ySpeed = startYSpeed;
      playground.leftWall = false;
      playground.topWall = false;
      playground.rightWall = false;
      playground.bottomWall = false;
      gameStatus.value = "ended";
      setHighscore();
      score.value = 0;
      channel.send({
        type: "broadcast",
        event: "gameEvents",
        payload: { action: "end" },
      });
      sendWalls();
      bang.value("endGame");
    }, endDelay);
  };
  restartGame = () => {
    score.value = 0;
    fadeOut.value = false;
    ball.x = startX;
    ball.y = startY;
    let random = Math.random();
    let startXDirection =
      random > 0.5
        ? map(random, 0.5, 1, 0.2, 0.5)
        : map(random, 0, 0.5, -0.2, -0.5);
    startXDirection = -0.3;
    let startYDirection = 1;
    ball.x = startX;
    ball.y = startY;
    ball.xDirection = startXDirection;
    ball.yDirection = startYDirection;
    ball.xSpeed = startXSpeed;
    ball.ySpeed = startYSpeed;
    setTimeout(() => resume(), 0);
    gameStatus.value = "started";
    channel.send({
      type: "broadcast",
      event: "gameEvents",
      payload: { action: "restart" },
    });
    bang.value("restartGame");
  };

  setInterval(() => {
    sendOSC.value("ballX", map(ball.x, 0, playground.width, -1, 1));
    sendOSC.value("ballY", map(ball.y, 0, playground.height, 1, -1));
    sendOSC.value("stateLeftWall", playground.leftWall);
    sendOSC.value("stateTopWall", playground.topWall);
    sendOSC.value("stateRightWall", playground.rightWall);
    sendOSC.value("stateBottomWall", playground.bottomWall);
    let distances = [
      ball.x - ball.r,
      playground.height - ball.y - ball.r,
      playground.width - ball.x - ball.r,
      ball.y - ball.r,
    ];
    let minDistance = Math.min(...distances);
    sendOSC.value("minDistance", map(minDistance, 0, size, 0, 1));
  }, 50);

  watchEffect(() => {
    channel.send({
      type: "broadcast",
      event: "gameEvents",
      payload: { action: "score", score: score.value },
    });
  });
});

onKeyStroke(["a", "A"], (e) => {
  toggleWall("left");
});

onKeyStroke(["d", "D"], (e) => {
  toggleWall("right");
});

onKeyStroke(["w", "W"], (e) => {
  toggleWall("top");
});

onKeyStroke(["s", "S"], (e) => {
  toggleWall("bottom");
});

onKeyStroke(["l", "L"], (e) => {
  restartGame();
});

onKeyStroke(["p", "P"], (e) => {
  pauseGame();
});

onKeyStroke(["r", "R"], (e) => {
  resumeGame();
});
</script>
