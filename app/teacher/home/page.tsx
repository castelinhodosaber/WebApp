"use client";
import Footer from "@/app/components/Footer";
import { useTeacherContext } from "@/app/context/TeacherContext";
import ROUTES from "@/app/routes";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaBath, FaToilet } from "react-icons/fa";
import { GiKnifeFork, GiNightSleep } from "react-icons/gi";
import { HiAnnotation } from "react-icons/hi";

const Home = () => {
  const router = useRouter();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const HOME_ITEMS = [
    {
      name: "Alimentação",
      path: ROUTES.private.teacher.meal,
      icon: <GiKnifeFork size="100%" />,
    },
    {
      name: "Soneca",
      path: ROUTES.private.teacher.nap,
      icon: <GiNightSleep size="100%" />,
    },
    {
      name: "Banho",
      path: ROUTES.private.teacher.bath,
      icon: <FaBath size="100%" />,
    },
    {
      name: "Banheiro",
      path: ROUTES.private.teacher.bathroom,
      icon: <FaToilet size="100%" />,
    },
    {
      name: "Ocorrências",
      path: "/occurrence",
      icon: <HiAnnotation size="100%" />,
    },
  ];
  return (
    <Flex
      align="center"
      height={["calc(100dvh - 50px)"]}
      justify="center"
      padding={["20px 10px"]}
      wrap="wrap"
      width={["100%"]}
    >
      <Text fontSize={["24px"]} fontWeight={800}>
        {selectedClass?.name}
      </Text>
      <Flex
        align="center"
        alignContent="center"
        gap={["60px 0px"]}
        justify="center"
        width="100dvw"
        wrap="wrap"
      >
        {HOME_ITEMS.map((item, index) => (
          <Flex
            align="center"
            color="secondary.solid"
            direction="column"
            justify="center"
            key={index}
            onClick={() => router.push(item.path)}
            width={["130px", "150px", "180px"]}
          >
            <Flex
              align="center"
              height={["30px"]}
              justify="center"
              width={["30px"]}
            >
              {item.icon}
            </Flex>

            <Text color="white">{item.name}</Text>
          </Flex>
        ))}
      </Flex>
      <Button colorPalette="secondary" fontSize={["18px"]} padding="5px 20px">
        Editar Presença
      </Button>
      <Footer />
    </Flex>
  );
};

export default Home;
