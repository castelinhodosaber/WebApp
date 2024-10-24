import { Flex } from "@chakra-ui/react";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      width="100dvw"
      height="100dvh"
    >
      Dashboard
      <Footer />
    </Flex>
  );
};

export default Dashboard;
