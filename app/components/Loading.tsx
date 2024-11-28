import { Flex, Image } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex
      align="center"
      direction="column"
      height={["100dvh"]}
      justify="center"
      width={["100%"]}
    >
      <Image
        animation={"pulse 3s infinite"}
        alt="logo"
        height={["200px", "220px", "220px", "250px"]}
        src="/assets/icons/icon-512x512.png"
      />
    </Flex>
  );
};

export default Loading;
