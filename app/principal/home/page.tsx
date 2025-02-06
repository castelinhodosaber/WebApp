"use client";
import Loading from "@/app/components/Loading";
import { usePrincipalContext } from "@/app/context/PrincipalContext";

import ROUTES from "@/app/routes";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaBath, FaBookOpen, FaToilet } from "react-icons/fa";
import { GiKnifeFork, GiNightSleep } from "react-icons/gi";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {
    state: { selectedClass },
    setSelectedClass,
  } = usePrincipalContext();
  const HOME_ITEMS = [
    {
      name: "Alimentação",
      path: ROUTES.private.principal.meal,
      icon: <GiKnifeFork size="100%" />,
    },
    {
      name: "Soneca",
      path: ROUTES.private.principal.nap,
      icon: <GiNightSleep size="100%" />,
    },
    {
      name: "Banho",
      path: ROUTES.private.principal.bath,
      icon: <FaBath size="100%" />,
    },
    {
      name: "Banheiro",
      path: ROUTES.private.principal.bathroom,
      icon: <FaToilet size="100%" />,
    },
    {
      name: "Recados",
      path: ROUTES.private.principal.annotation,
      icon: <BiSolidMessageDetail size="100%" />,
    },
    {
      name: "Anotações",
      path: ROUTES.private.principal.message,
      icon: <FaBookOpen size="100%" />,
    },
  ];

  useEffect(() => {
    if (!selectedClass?.id)
      return router.push(ROUTES.private.principal.dashboard);
    setIsLoading(false);
  }, [selectedClass, router]);

  return isLoading ? (
    <Loading />
  ) : (
    <Flex
      align="center"
      direction="column"
      height={"100dvh"}
      maxH="100dvh"
      padding={["50px 0 80px 0"]}
      wrap="wrap"
      width={["100%"]}
    >
      <Text fontSize={["24px"]} fontWeight={800}>
        {selectedClass?.name}
      </Text>
      <Flex
        align="center"
        alignContent="center"
        grow="1"
        justify="center"
        width="100dvw"
      >
        <Flex
          backgroundColor="secondary.50"
          border="2px solid #f97837"
          borderRadius={["12px"]}
          gap={["60px 20px"]}
          justify="center"
          padding={["20px 0"]}
          width={["100%", "90%"]}
          wrap="wrap"
        >
          {HOME_ITEMS.map((item, index) => (
            <Flex
              align="center"
              color="secondary.500"
              direction="column"
              gap={["10px"]}
              justify="center"
              key={index}
              onClick={() => router.push(item.path)}
              width={["100px", "120px", "120px"]}
            >
              <Flex
                align="center"
                height={["30px"]}
                justify="center"
                width={["30px"]}
              >
                {item.icon}
              </Flex>
              <Text
                color="principal.solid"
                fontSize={["16px"]}
                fontWeight={700}
                textTransform="uppercase"
              >
                {item.name}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex align="center" gap="20px" justify="center" wrap="wrap">
        <Button
          colorPalette="secondaryButton"
          fontSize={["16px"]}
          fontWeight={700}
          onClick={() => {
            setSelectedClass();
            router.push(ROUTES.private.principal.dashboard);
          }}
          lineBreak="anywhere"
          padding="5px 20px"
          textTransform="uppercase"
        >
          Selecionar Turma
        </Button>
        <Button
          colorPalette="secondary"
          color="secondary.100"
          fontSize={["16px"]}
          fontWeight={700}
          onClick={() =>
            router.push(ROUTES.private.principal.attendance + "?edit=true")
          }
          textTransform="uppercase"
          padding="5px 20px"
        >
          Editar Presença
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
