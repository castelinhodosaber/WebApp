import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    breakpoints: {
      sm: "300px",
      md: "350px",
      lg: "400px",
      xl: "500px",
      "2xl": "992px",
      "4xl": "1200px",
      "6xl": "1400px",
    },
    tokens: {
      colors: {
        principal: {
          50: { value: "#e0e5f2" },
          100: { value: "#b3bdd9" },
          200: { value: "#8593bf" },
          300: { value: "#5769a5" },
          400: { value: "#2a418b" },
          500: { value: "#031436" },
          600: { value: "#02112f" },
          700: { value: "#020d27" },
          800: { value: "#010a1e" },
          900: { value: "#010615" },
        },
        secondary: {
          50: { value: "#ffe9e0" },
          100: { value: "#ffcbb4" },
          200: { value: "#ffac85" },
          300: { value: "#ff8d55" },
          400: { value: "#fc6f2b" },
          500: { value: "#f97837" },
          600: { value: "#d36030" },
          700: { value: "#ad4a27" },
          800: { value: "#87341d" },
          900: { value: "#612113" },
        },
      },
    },
    semanticTokens: {
      colors: {
        principal: {
          solid: { value: "{colors.principal.500}" },
          contrast: { value: "{colors.principal.100}" },
          fg: { value: "{colors.principal.700}" },
          muted: { value: "{colors.principal.100}" },
          subtle: { value: "{colors.principal.200}" },
          emphasized: { value: "{colors.principal.300}" },
          focusRing: { value: "{colors.principal.500}" },
        },
        secondary: {
          solid: { value: "{colors.secondary.500}" },
          contrast: { value: "{colors.secondary.100}" },
          fg: { value: "{colors.secondary.700}" },
          muted: { value: "{colors.secondary.100}" },
          subtle: { value: "{colors.secondary.200}" },
          emphasized: { value: "{colors.secondary.300}" },
          focusRing: { value: "{colors.secondary.500}" },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

export default system;
