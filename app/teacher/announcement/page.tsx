"use client";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
const Announcements = () => {
  const {
    state: { accessToken },
  } = useGlobalContext();

  useEffect(() => {
    
  }, [accessToken])

  return (
    <Flex
      align="center"
      direction="column"
      gap={["20px"]}
      minHeight="100dvh"
      maxHeight="100dvh" // Use "maxHeight" para consistência
      justify="space-between"
      padding={["50px 0 80px 0"]}
      width="100dvw"
    >
      <Text fontSize={["20px"]} fontWeight={[700]}>
        Comunicados
      </Text>

      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        flex="1" // Permite que o contêiner se ajuste ocupando o restante do espaço disponível
        width="100%"
        overflowY="scroll" // Ativa o scroll vertical automaticamente
      >
        <Flex
          align="center"
          backgroundColor="secondary.50"
          border="2px solid #f97837"
          borderRadius="6px"
          justify="center"
          direction="column"
          shrink={0}
          overflow="hidden"
          width={["90%", "90%", "90%", "85%"]}
        >
          <Flex
            align="center"
            backgroundColor="secondary.solid"
            fontWeight={700}
            justify="center"
            wrap="wrap"
            width="100%"
          ></Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Announcements;
