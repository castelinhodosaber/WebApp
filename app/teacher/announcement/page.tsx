import Footer from "@/app/components/Footer";
import { Flex } from "@chakra-ui/react";

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
