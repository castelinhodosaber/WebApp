"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import ROUTES from "@/app/routes";
import { Attendance } from "@/app/types/api/castelinho";
import { toaster } from "@/components/ui/toaster";
import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Messages = () => {
  const router = useRouter();
  const {
    state: { date, accessToken },
  } = useGlobalContext();
  const {
    state: { attendance: globalAttendance },
  } = useTeacherContext();
  const [updatedList, setUpdatedList] = useState<Attendance[]>(
    globalAttendance || []
  );

  const handleCommentUpdate = (newComment: string, index: number) => {
    const newList = updatedList;

    if (newList) newList[index].comments = newComment || "";

    setUpdatedList([...newList]);
  };

  const saveComments = (index: number) => {
    if (updatedList && accessToken && updatedList[index].id) {
      toaster.promise(
        CASTELINHO_API_ENDPOINTS.attendance.updateCommentById(
          accessToken,
          updatedList[index].comments || "",
          updatedList[index].id
        ),
        {
          success: { title: "Anotação salva com sucesso." },
          loading: { title: "Salvando anotação..." },
          error: { title: "Erro ao salvar anotação. Tente novamente." },
        }
      );
    }
  };

  return (
    <Flex
      align="center"
      direction="column"
      gap={["20px"]}
      minHeight="100dvh"
      maxHeight="100dvh" // Use "maxHeight" para consistência
      justify="space-between"
      padding={["50px 0 80px 0"]}
      width="100dvw"
    >
      <Text fontSize={["20px"]} fontWeight={[700]}>
        Anotações - {date.br}
      </Text>

      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        flex="1" // Permite que o contêiner se ajuste ocupando o restante do espaço disponível
        width="100%"
        overflowY="scroll" // Ativa o scroll vertical automaticamente
      >
        {globalAttendance?.map((attendance, index) =>
          attendance.present ? (
            <Flex
              align="center"
              backgroundColor="secondary.50"
              border="2px solid #f97837"
              borderRadius="6px"
              direction="column"
              justify="center"
              shrink={0}
              key={index}
              overflow="hidden"
              width={["90%", "90%", "90%", "85%"]}
            >
              <Flex
                align="center"
                backgroundColor="secondary.solid"
                justify="center"
                width="100%"
              >
                <Text fontSize={["16px"]} fontWeight={700}>
                  {attendance.student?.name}
                </Text>
              </Flex>
              <Flex
                align="center"
                justify="center"
                padding="10px 0"
                width="100%"
              >
                <Textarea
                  backgroundColor={"secondaryButton.100"}
                  border="2px solid #f97837"
                  borderRadius="6px"
                  color="#031436"
                  height={["120px"]}
                  onChange={(ev) => handleCommentUpdate(ev.target.value, index)}
                  padding="5px"
                  value={
                    updatedList.length ? updatedList[index].comments || "" : ""
                  }
                  variant="subtle"
                  width={["60%"]}
                />
              </Flex>
              <Flex
                align="center"
                gap={["15px"]}
                justify="center"
                marginBottom={["10px"]}
              >
                <Button
                  colorPalette="secondary"
                  color="secondary.50"
                  fontSize={["18px"]}
                  fontWeight={[600]}
                  onClick={() => saveComments(index)}
                  padding={["5px 20px"]}
                >
                  Salvar
                </Button>
              </Flex>
            </Flex>
          ) : null
        )}
      </Flex>
      <Flex
        align="center"
        gap={["15px"]}
        justify="center"
        marginBottom={["10px"]}
      >
        <Button
          colorPalette="secondaryButton"
          fontSize={["18px"]}
          fontWeight={[600]}
          onClick={() => router.push(ROUTES.private.teacher.home)}
          padding={["5px 20px"]}
        >
          Voltar
        </Button>
      </Flex>
    </Flex>
  );
};

export default Messages;
