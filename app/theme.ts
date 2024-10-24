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
  },
});

const system = createSystem(defaultConfig, customConfig);

export default system;
