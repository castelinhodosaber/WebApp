"use client";
import Loading from "@/app/components/Loading";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { usePrincipalContext } from "@/app/context/PrincipalContext";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import ROUTES from "@/app/routes";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const {
    state: { classes, selectedClass },
    setSelectedClass,
  } = usePrincipalContext();
  const {
    state: { person },
  } = useGlobalContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [classes]);

  const handleSelectedClass = (classId: number) => {
    setIsLoading(true);
    setSelectedClass(classId);
  };

  useEffect(() => {
    if (selectedClass) {
      router.push(ROUTES.private.principal.attendance);
    } else setIsLoading(false);
  }, [selectedClass, router]);

  return isLoading ? (
    <Loading />
  ) : (
    <Flex
      align="center"
      direction="column"
      height="100dvh"
      justify="flex-start"
      padding={["50px 0 80px 0 "]}
      width="100%"
    >
      <Text fontSize={["18px"]} fontWeight={700}>
        {`Bem vind${person?.gender === "female" ? "a" : "o"}, ${
          person?.name.split(" ")[0]
        }!`}
      </Text>

      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        grow="1"
        justify="center"
        width="100%"
      >
        <Flex
          align="center"
          alignContent="center"
          gap="15px 20px"
          grow={2}
          justify="center"
          wrap="wrap"
          width="90%"
        >
          <Flex
            align="center"
            justify="center"
            margin="0 0 10px 0"
            width="100%"
          >
            <Text fontSize={["16px"]} fontWeight={700}>
              Selecionar Turma
            </Text>
          </Flex>
          {classes?.map((principalClass, index) => (
            <Button
              color="secondary.100"
              colorPalette="secondary"
              border="1px solid orange"
              borderRadius={["12px"]}
              fontSize={["20px"]}
              fontWeight={800}
              height={["50px"]}
              key={index}
              onClick={() => {
                handleSelectedClass(principalClass.id);
              }}
              padding={["2px 5px"]}
              textTransform="uppercase"
              width={["45%"]}
            >
              {principalClass.name}
            </Button>
          ))}
        </Flex>
        {!isMobile ? (
          <Flex grow="1" align="flex-end" justify="center">
            <Button
              onClick={() =>
                router.push(ROUTES.private.principal.management.home)
              }
              padding={["5px 15px"]}
            >
              Área Administrativa
            </Button>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default TeacherDashboard;
