"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import ROUTES from "@/app/routes";
import { Attendance, Bathroom } from "@/app/types/api/castelinho";
import { StepperInput } from "@/components/ui/stepper-input";
import { toaster } from "@/components/ui/toaster";
import { Button, Flex, SimpleGrid, Tabs, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPoop } from "react-icons/fa";
import { GiDroplets } from "react-icons/gi";

const BathroomTeacher = () => {
  const router = useRouter();
  const {
    state: { date, accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [attendance, setAttendance] = useState<Attendance[]>();
  const [bathroomList, setBathroomList] = useState<Bathroom[]>();

  useEffect(() => {
    if (accessToken && selectedClass) {
      CASTELINHO_API_ENDPOINTS.attendance
        .getByClassIdAndDate(accessToken, selectedClass.id, date.iso)
        .then((attendanceRes) => {
          setAttendance(attendanceRes?.data.filter((item) => item.present));
        });
      CASTELINHO_API_ENDPOINTS.bathroom
        .getByClassIdAndDate(accessToken, selectedClass.id, date.iso)
        .then((res) => {
          setBathroomList(res?.data);
        });
    }
  }, []);

  const handleBathroomUpdate = (
    type: "PEE" | "POOP",
    newValue: number,
    studentId: number,
    actionDetail: "NORMAL" | "DIARRHEA" | "HARD" = "NORMAL"
  ) => {
    const newBathroomList: Bathroom[] = [];

    let registryAlreadyExist = false;

    bathroomList?.forEach((item) => {
      if (
        (item.student?.id === studentId || item.studentId === studentId) &&
        item.action === type
      ) {
        registryAlreadyExist = true;
        newBathroomList.push({ ...item, amount: newValue, actionDetail });
      } else if (item.action === type) newBathroomList.push(item);
    });

    setBathroomList(
      registryAlreadyExist
        ? newBathroomList
        : [
            ...newBathroomList,
            {
              action: type,
              actionDetail,
              amount: newValue,
              date: date.iso,
              studentId,
            },
          ]
    );
  };

  const saveBathroomList = () => {
    if (accessToken && bathroomList)
      toaster.promise(
        CASTELINHO_API_ENDPOINTS.bathroom.createMany(accessToken, bathroomList),
        {
          success: {
            title: "Itens salvos com sucesso.",
          },
          error: {
            title: "Erro ao salvar lista. Tente novamente",
          },
          loading: {
            title: "Salvando lista. Por favor, aguarde...",
          },
        }
      );
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
        Banheiro - {date.br}
      </Text>
      <Flex
        align="center"
        direction="column"
        grow="1"
        overflowY="scrool"
        width="100%"
      >
        <SimpleGrid columns={2} gap="14" width="full">
          <Tabs.Root
            colorPalette="secondary"
            defaultValue="PEE"
            variant="subtle"
          >
            <Tabs.List
              alignItems="center"
              display="flex"
              justifyContent="center"
              textAlign="center"
              width="100dvw"
            >
              <Tabs.Trigger
                fontSize={["16px"]}
                fontWeight={700}
                padding={["5px 25px"]}
                value="PEE"
              >
                <GiDroplets />
                Xixi
              </Tabs.Trigger>
              <Tabs.Trigger
                fontSize={["16px"]}
                fontWeight={700}
                padding={["5px 25px"]}
                value="POOP"
              >
                <FaPoop />
                Cocô
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              display="flex"
              justifyContent="center"
              value="PEE"
              width="100dvw"
            >
              <Flex
                align="center"
                direction="column"
                gap={["20px"]}
                height="100%"
                marginTop={["20px"]}
                width={["80%"]}
              >
                {attendance?.map((attendanceItem, attendanceIndex) => (
                  <Flex
                    align="center"
                    justify="space-between"
                    key={attendanceIndex}
                    width="100%"
                  >
                    <Flex grow="1">
                      <Text>{attendanceItem.student?.name}</Text>
                    </Flex>
                    <StepperInput
                      variant="subtle"
                      size={["xs"]}
                      min={0}
                      max={10}
                      onValueChange={(ev) =>
                        handleBathroomUpdate(
                          "PEE",
                          Number(ev.value),
                          attendanceItem.student?.id || 0
                        )
                      }
                      value={
                        bathroomList
                          ?.find(
                            (bathroomItem) =>
                              (bathroomItem.studentId ===
                                attendanceItem.student?.id ||
                                bathroomItem.student?.id ===
                                  attendanceItem.student?.id) &&
                              bathroomItem.action === "PEE"
                          )
                          ?.amount.toString() || "0"
                      }
                    />
                  </Flex>
                ))}
              </Flex>
            </Tabs.Content>
            <Tabs.Content
              display="flex"
              justifyContent="center"
              value="POOP"
              width="100dvw"
            >
              <Flex
                align="center"
                direction="column"
                gap={["20px"]}
                height="100%"
                marginTop={["20px"]}
                width={["80%"]}
              >
                {attendance?.map((attendanceItem, attendanceIndex) => (
                  <Flex
                    align="center"
                    justify="space-between"
                    key={attendanceIndex}
                    width="100%"
                  >
                    <Flex grow="1">
                      <Text>{attendanceItem.student?.name}</Text>
                    </Flex>
                    <StepperInput
                      variant="subtle"
                      size={["xs"]}
                      min={0}
                      max={10}
                      onValueChange={(ev) =>
                        handleBathroomUpdate(
                          "POOP",
                          Number(ev.value),
                          attendanceItem.student?.id || 0
                        )
                      }
                      value={
                        bathroomList
                          ?.find(
                            (bathroomItem) =>
                              (bathroomItem.studentId ===
                                attendanceItem.student?.id ||
                                bathroomItem.student?.id ===
                                  attendanceItem.student?.id) &&
                              bathroomItem.action === "POOP"
                          )
                          ?.amount.toString() || "0"
                      }
                    />
                  </Flex>
                ))}
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </SimpleGrid>
      </Flex>
      <Flex align="center" gap={["15px"]} justify="center">
        <Button
          colorPalette="secondaryButton"
          fontSize={["18px"]}
          fontWeight={[600]}
          onClick={() => router.push(ROUTES.private.teacher.home)}
          padding={["5px 20px"]}
        >
          Voltar
        </Button>
        <Button
          colorPalette="secondary"
          fontSize={["18px"]}
          fontWeight={[600]}
          onClick={saveBathroomList}
          padding={["5px 20px"]}
        >
          Salvar
        </Button>
      </Flex>
    </Flex>
  );
};

export default BathroomTeacher;
