"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { GuardianAnnotation } from "@/app/types/api/castelinho";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Annotations = () => {
  const {
    state: { accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [annotations, setAnnotations] = useState<GuardianAnnotation[]>([]);
  useEffect(() => {
    if (selectedClass && accessToken) {
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .getByClassId(accessToken, selectedClass.id)
        .then((res) => {
          if (res) setAnnotations(res?.data);
        });
    }
  }, []);
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      width="100dvw"
      height="100dvh"
    >
      Annotations
      {JSON.stringify(annotations)}
    </Flex>
  );
};

export default Annotations;
