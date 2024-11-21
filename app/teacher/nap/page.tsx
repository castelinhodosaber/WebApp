"use client";
import { useEffect, useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { formatInTimeZone } from "date-fns-tz";
import { Nap, Person } from "@/app/types/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";
import { toaster } from "@/components/ui/toaster";
import { InputGroup } from "@/components/ui/input-group";
import { FaRegClock } from "react-icons/fa6";
import {
  calculateEndTime,
  calculateMinutesDifference,
} from "@/app/utils/formatTime";
import isNapOverlapping from "@/app/utils/isNapOverlapping";

type newNap = {
  startedAt: string;
  finishAt: string;
  studentId: number;
};

const TeacherNap = () => {
  const router = useRouter();
  const {
    state: { accessToken, date },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [naps, setNaps] = useState<Nap[]>();
  const [newNaps, setNewNaps] = useState<newNap[]>([]);
  const [presentStudents, setPresentStudents] =
    useState<(Person & { display: boolean })[]>();

  useEffect(() => {
    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd"
    );
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

  const updateNewNap = (nap: newNap) => {
    const otherNaps: newNap[] = [];
    let selectedStudentNap: newNap = nap;

    newNaps.forEach((item) => {
      if (item.studentId === nap.studentId) {
        selectedStudentNap = { ...item, ...nap };
      } else otherNaps.push(item);
    });

    setNewNaps([...otherNaps, selectedStudentNap]);
  };

  const saveNap = (studentId: number) => {
    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd"
    );

    const nap = newNaps.find((item) => item.studentId === studentId);

    if (nap && accessToken && nap.startedAt && nap.finishAt) {
      const napTimeMinutes = calculateMinutesDifference(
        nap.startedAt,
        nap.finishAt
      );

      const student = selectedClass?.students.find(
        (item) => item.id === nap.studentId
      );

      if (napTimeMinutes < 15) {
        toaster.create({
          duration: 8000,
          type: "error",
          title: "Erro!",
          description: `A duração da soneca não pode ser inferior a quinze minutos.`,
        });

        return;
      }

      const duplicatedNap = naps?.some((item) => {
        if (
          item.studentId === student?.id &&
          isNapOverlapping(
            { startedAt: nap.startedAt || "", finishAt: nap.finishAt || "" },
            item
          )
        ) {
          return true;
        }
        return false;
      });

      if (duplicatedNap) {
        toaster.create({
          duration: 8000,
          type: "error",
          title: "Erro!",
          description: `${student?.gender === "female" ? "A" : "O"} ${
            student?.name.split(" ")[0]
          } já possui uma soneca em horário próximo ao informado.`,
        });
        return;
      }

      const formattedNewNap = {
        date: formattedDate,
        hour: nap.startedAt,
        napTimeMinutes,
        studentId: nap.studentId,
      };

      toaster.promise(
        CASTELINHO_API_ENDPOINTS.nap
          .createOne(accessToken, formattedNewNap)
          .then((result) => {
            if (result?.data) setNaps([...(naps || []), result?.data]);
            setNewNaps((oldValue) =>
              oldValue?.map((item) =>
                item.studentId === nap.studentId
                  ? { ...item, startedAt: "", finishAt: "" }
                  : item
              )
            );
          }),
        {
          success: {
            title: "Soneca adicionada com sucesso.",
            description: "",
          },
          error: {
            title: "Erro",
            description:
              "Falha ao salvar soneca. Verifique os dados e tente novamente",
          },
          loading: {
            title: "Salvando soneca...",
            description: "Por favor aguarde",
          },
        }
      );
    } else {
      toaster.create({
        title: "Inserir horários para salvar soneca.",
      });
    }
  };

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
              borderBottomLeftRadius={student.display ? "" : ["6px"]}
              borderBottomRightRadius={student.display ? "" : ["6px"]}
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
              backgroundColor="rgba(255, 255, 255, 0.8)"
              borderBottomLeftRadius={["6px"]}
              borderBottomRightRadius={["6px"]}
              color="#031436"
              direction="column"
              display={student.display ? "flex" : "none"}
              gap={["10px"]}
              justify="center"
              padding={["0px 0 10px 0"]}
              width={["80%"]}
            >
              {naps?.map((nap, index) =>
                nap.studentId === student.id ? (
                  <Flex
                    align="center"
                    borderBottom="2px solid #031436"
                    height={["50px"]}
                    justify="space-between"
                    key={index}
                    margin="10px 0 0"
                    padding={["0 10px 10px 10px"]}
                    width={["100%"]}
                  >
                    <Flex align="center" gap={["8px"]} grow="1">
                      <Flex
                        align="center"
                        direction="column"
                        justify="center"
                        width={["100px"]}
                      >
                        <Text
                          fontSize={["12px"]}
                          fontWeight={600}
                          textTransform="uppercase"
                        >
                          Início
                        </Text>
                        <Text>{nap.hour.replace(":00", "")}</Text>
                      </Flex>
                      <Flex
                        align="center"
                        direction="column"
                        justify="center"
                        width={["100px"]}
                      >
                        <Text
                          fontSize={["12px"]}
                          fontWeight={600}
                          textTransform="uppercase"
                        >
                          Término
                        </Text>
                        <Text>
                          {calculateEndTime(nap.napTimeMinutes, nap.hour)}
                        </Text>
                      </Flex>
                    </Flex>

                    <Button
                      colorPalette="secondary"
                      color="#ffe9e0"
                      fontSize={["14px"]}
                      fontWeight={[800]}
                      onClick={() => deleteNap(nap.id!)}
                      width={["90px"]}
                    >
                      APAGAR
                    </Button>
                  </Flex>
                ) : null
              )}
              <Flex
                align="flex-end"
                justify="space-between"
                padding={["10px 10px 0px 10px"]}
                width="100%"
              >
                <Flex align="center" gap="8px" grow={1} justify="flex-start">
                  <Flex align="center" direction="column" justify="center">
                    <Text
                      fontSize={["12px"]}
                      fontWeight={600}
                      textTransform="uppercase"
                    >
                      Início
                    </Text>
                    <InputGroup
                      endElement={
                        <FaRegClock
                          color="#031436"
                          size={18}
                          style={{
                            position: "absolute",
                            right: "15px",
                            zIndex: "0 !important",
                          }}
                        />
                      }
                    >
                      <Input
                        border="1px solid #031436"
                        color="#031436"
                        type="time"
                        placeholder="Selecione a hora"
                        onChange={(ev) =>
                          updateNewNap({
                            studentId: student.id,
                            startedAt: ev.target.value,
                            finishAt:
                              newNaps.find(
                                (item) => item.studentId === student.id
                              )?.finishAt || "",
                          })
                        }
                        name="time"
                        css={{
                          "&::-webkit-calendar-picker-indicator": {
                            color: "#031436 !important",
                            fontSize: "20px",
                            zIndex: 1000,
                            backgroundImage: "none",
                          },
                        }}
                        padding="0px 10px 0px 10px !important"
                        width={["100px"]}
                        zIndex={999}
                      />
                    </InputGroup>
                  </Flex>
                  <Flex align="center" direction="column" justify="center">
                    <Text
                      fontSize={["12px"]}
                      fontWeight={600}
                      textTransform="uppercase"
                    >
                      Término
                    </Text>
                    <InputGroup
                      endElement={
                        <FaRegClock
                          color="#031436"
                          size={18}
                          style={{
                            position: "absolute",
                            right: "15px",
                            zIndex: "0 !important",
                          }}
                        />
                      }
                    >
                      <Input
                        border="1px solid #031436"
                        color="#031436"
                        type="time"
                        placeholder="Selecione a hora"
                        name="time"
                        onChange={(ev) =>
                          updateNewNap({
                            studentId: student.id,
                            finishAt: ev.target.value,
                            startedAt:
                              newNaps.find(
                                (item) => item.studentId === student.id
                              )?.startedAt || "",
                          })
                        }
                        css={{
                          "&::-webkit-calendar-picker-indicator": {
                            color: "#031436 !important",
                            fontSize: "20px",
                            zIndex: 1000,
                            backgroundImage: "none",
                          },
                        }}
                        padding="0px 10px 0px 10px !important"
                        step="300"
                        width={["100px"]}
                        zIndex={999}
                      />
                    </InputGroup>
                  </Flex>
                </Flex>
                <Button
                  colorPalette="secondary"
                  color="#ffe9e0"
                  fontSize={["14px"]}
                  fontWeight={[800]}
                  onClick={() => saveNap(student.id!)}
                  padding={["3px 7px"]}
                  disabled={
                    !newNaps.some(
                      (item) =>
                        item.studentId === student.id &&
                        item.finishAt &&
                        item.startedAt
                    )
                  }
                  maxWidth={["90px"]}
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
