"use client";
import Loading from "@/app/components/Loading";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { usePrincipalContext } from "@/app/context/PrincipalContext";
import ROUTES from "@/app/routes";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
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
        <Text fontSize={["16px"]} fontWeight={700}>
          Selecionar Turma
        </Text>
        <Flex
          align="center"
          alignContent="center"
          gap="15px 20px"
          justify="center"
          wrap="wrap"
          width="90%"
        >
          {classes?.length ? (
            classes?.map((principalClass, index) => (
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
            ))
          ) : (
            <Text fontSize={["14px"]} fontWeight={400} textAlign="center">
              Você não é responsável direto(a) por nenhuma turma no momento.
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TeacherDashboard;
