// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  unocss: {
    shortcuts: [
      { flexCenter: "flex justify-center items-center" },
      { diff: "mix-blend-difference" },
      { normal: "mix-blend-normal" },
      { fullscreen: "w-screen h-screen" },
      { full: "w-full h-full" },
      { centerme: "justify-self-center self-center" },
      {
        circle:
          "bg-white w-100px aspect-1 rounded-full transition-all duration-200 transform-gpu",
      },
      {
        smallCircle:
          "bg-white w-100px aspect-1 rounded-full transition-all duration-200 transform-gpu",
      },
      {
        smallerCircle:
          "bg-white w-90% aspect-1 rounded-full transition-all duration-200 transform-gpu",
      },
      {
        largeCircle:
          "bg-white w-300px aspect-1 rounded-full transition-all duration-200 transform-gpu",
      },
      {
        smallRect:
          "bg-white w-200px h-100px transition-all duration-200 transform-gpu",
      },
      {
        rect: "bg-white w-400px h-300px transition-all duration-200 transform-gpu",
      },
      {
        largeRect:
          "bg-white w-600px h-400px transition-all duration-200 transform-gpu",
      },
      {
        largerRect:
          "bg-white w-110% h-110% transition-all duration-200 transform-gpu",
      },
      {
        smallerRect:
          "bg-white w-90% h-80% transition-all duration-200 transform-gpu",
      },
      {
        line: "bg-white w-80% h-5px transition-all duration-200 transform-gpu m-y-5 m-x-3",
      },
      {
        smallerLine:
          "bg-white w-80% h-5px transition-all duration-200 transform-gpu m-y-1 m-x-3",
      },
      {
        wrapper: "w-screen h-screen overflow-hidden bg-black text-white",
      },
      {
        dashy: "border-black border-dashed border-5px",
      },
      { smoothTransition: "transition-all duration-200 ease-in" },
      { longTransition: "transition-all duration-500 ease-in" },
      { shortTransition: "transition-all duration-50 ease-in" },
    ],
    // transformers: [transformerDirectives()],
  },
  supabase: {
    redirect: false,
  },
  modules: [
    "@unocss/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "@vue-macros/nuxt",
    "@tresjs/nuxt",
  ],
});
