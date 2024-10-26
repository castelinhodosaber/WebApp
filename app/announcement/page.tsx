import { Flex } from "@chakra-ui/react";
import Footer from "../components/Footer";

const Announcements = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      width="100dvw"
      height="100dvh"
    >
      Announcements
      <Footer />
    </Flex>
  );
};

export default Announcements;
