"use client";

import { ChakraProvider, defaultSystem, SystemContext } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import system from "@/app/theme";

export function Provider(
  props: React.PropsWithChildren & { value?: SystemContext }
) {
  return (
    <ChakraProvider value={system || defaultSystem}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  );
}
