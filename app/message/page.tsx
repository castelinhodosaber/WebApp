import { Flex } from "@chakra-ui/react";
import Footer from "../components/Footer";

const Messages = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      width="100dvw"
      height="100dvh"
    >
      Messages
      <Footer />
    </Flex>
  );
};

export default Messages;
