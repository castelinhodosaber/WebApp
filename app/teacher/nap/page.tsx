"use client";
import { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { formatInTimeZone } from "date-fns-tz";
import { Nap, Person } from "@/app/types/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";
import { toaster } from "@/components/ui/toaster";

const TeacherNap = () => {
  const router = useRouter();
  const {
    state: { accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [date, setDate] = useState("");
  const [naps, setNaps] = useState<Nap[]>();
  const [presentStudents, setPresentStudents] =
    useState<(Person & { display: boolean })[]>();

  useEffect(() => {
    const newDate = new Date()
      .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      .split(",")[0];

    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd"
    );
    setDate(newDate);
    if (accessToken && selectedClass) {
      CASTELINHO_API_ENDPOINTS.nap
        .getByClassIdAndDate(accessToken, selectedClass?.id, formattedDate)
        .then((getNapsRes) => {
          const allNaps: Nap[] = getNapsRes?.data?.length
            ? [...getNapsRes.data]
            : [];

          CASTELINHO_API_ENDPOINTS.attendance
            .getByClassIdAndDate(accessToken, selectedClass?.id, formattedDate)
            .then((attendanceResult) => {
              if (attendanceResult?.data.length) {
                const newPresentStudents: (Person & { display: boolean })[] =
                  [];
                attendanceResult.data.forEach((att) => {
                  if (att.student && att.present)
                    newPresentStudents.push({ ...att.student, display: true });
                });
                setPresentStudents(newPresentStudents);
              }
            })
            .then(() => {
              setTimeout(() => {
                setNaps(allNaps);
              }, 100);
            });
        });
    }
  }, []);

  const deleteNap = async (napId: number) => {
    if (accessToken) {
      const result = await CASTELINHO_API_ENDPOINTS.nap.deleteById(
        accessToken,
        napId
      );

      if (result) {
        toaster.create({
          type: "success",
          title: "Soneca apagada com sucesso.",
        });
        setNaps(naps ? naps.filter((nap) => nap.id !== napId) : []);
      }
    }
  };

  const saveNaps = (studentId: number) => {};
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
        Soneca - {date}
      </Text>
      <Flex
        align="center"
        direction="column"
        gap="15px"
        grow="1"
        justify="flex-start"
        overflowY="scroll"
        width={["100%"]}
      >
        {presentStudents?.map((student, index) => (
          <Flex
            align="center"
            direction="column"
            justify="center"
            key={index}
            width={["100%"]}
          >
            <Flex
              align="center"
              bgColor="secondary.solid"
              border="2px solid #f97837"
              borderTopLeftRadius={["6px"]}
              borderTopRightRadius={["6px"]}
              color="secondary.50"
              fontSize={["18px"]}
              fontWeight={[700]}
              justify="center"
              onClick={() =>
                setPresentStudents(
                  presentStudents.map((item) =>
                    item === student
                      ? { ...student, display: !student.display }
                      : item
                  )
                )
              }
              width={["80%"]}
            >
              {student.name}
            </Flex>
            <Flex
              align="center"
              backgroundColor="#f0f2f5"
              borderBottomLeftRadius={["6px"]}
              borderBottomRightRadius={["6px"]}
              color="#031436"
              direction="column"
              display={student.display ? "flex" : "none"}
              justify="center"
              width={["80%"]}
            >
              {naps?.map((nap, index) =>
                nap.studentId === student.id ? (
                  <Flex
                    align="center"
                    height={["50px"]}
                    justify="space-between"
                    key={index}
                    padding={["0 20px"]}
                    width={["100%"]}
                  >
                    <Text>
                      {nap.hour} - {nap.napTimeMinutes}
                    </Text>
                    <Button
                      colorPalette="secondary"
                      fontSize={["12px"]}
                      fontWeight={[800]}
                      onClick={() => deleteNap(nap.id!)}
                      padding={["3px 10px"]}
                    >
                      APAGAR
                    </Button>
                  </Flex>
                ) : null
              )}
              <Flex>
                <Button
                  colorPalette="secondary"
                  fontSize={["12px"]}
                  fontWeight={[800]}
                  onClick={() => saveNaps(student.id!)}
                  padding={["3px 10px"]}
                >
                  ADICIONAR
                </Button>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Flex align="center" gap={["15px"]} justify="center">
        <Button
          backgroundColor="secondaryButton"
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

export default TeacherNap;
