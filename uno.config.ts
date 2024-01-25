// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from "unocss";
import { presetWebFonts, transformerDirectives, presetIcons } from "unocss";

export default defineConfig({
  presets: [
    presetAttributify({}),
    presetUno(),
    presetIcons({}),
    presetWebFonts({
      provider: "bunny", // default provider
      fonts: {
        sans: "Jost",
        helvetica: [
          {
            name: "Helvetica Neue",
            provider: "none",
          },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
