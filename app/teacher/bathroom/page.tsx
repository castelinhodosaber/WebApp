"use client";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";

const BathroomTeacher = () => {
  const {
    state: { date },
  } = useGlobalContext();
  const { selectedClass } = useTeacherContext;

  useEffect(() => {}, []);

  return (
    <Flex
      align="center"
      direction="column"
      gap={["20px"]}
      minHeight="100dvh"
      maxH="100dvh"
      justify="space-between"
      padding={["50px 0 80px 0 "]}
      width="100dvw"
    >
      <Text fontSize={["20px"]} fontWeight={[700]}>
        Banheiro - {date}
      </Text>
    </Flex>
  );
};

export default BathroomTeacher;
