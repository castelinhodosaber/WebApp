"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import ROUTES from "@/app/routes";
import {
  Attendance,
  Bathroom,
  BATHROOM_ACTIONS_DETAILS,
  BathroomAction,
  BathroomActionDetails,
} from "@/app/types/api/castelinho";
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
    state: { selectedClass, attendance: globalAttendance },
  } = useTeacherContext();
  const [attendance, setAttendance] = useState<Attendance[]>();
  const [bathroomList, setBathroomList] = useState<Bathroom[]>();
  const BATHROOM_ACTION_DETAILS_ARR = BATHROOM_ACTIONS_DETAILS.map((item) => ({
    name: item,
    displayName:
      item === "DIARRHEA"
        ? "Diarréia"
        : item === "NORMAL"
        ? "Normal"
        : "Ressecado",
  }));
  useEffect(() => {
    if (accessToken && selectedClass && globalAttendance?.length) {
      setAttendance(globalAttendance.filter((item) => item.present));

      CASTELINHO_API_ENDPOINTS.bathroom
        .getByClassIdAndDate(accessToken, selectedClass.id, date.iso)
        .then((res) => {
          setBathroomList(res?.data);
        });
    }
  }, []);

  const handleBathroomUpdate = (
    type: BathroomAction,
    newValue: number,
    studentId: number,
    actionDetail: BathroomActionDetails = "NORMAL"
  ) => {
    setBathroomList((oldState) => {
      let registryAlreadyExist = false;
      const newBathroomList: Bathroom[] = [];

      oldState?.forEach((item) => {
        if (
          (item.student?.id === studentId || item.studentId === studentId) &&
          item.action === type &&
          item.actionDetail === actionDetail
        ) {
          registryAlreadyExist = true;
          newBathroomList.push({ ...item, amount: newValue, actionDetail });
        } else newBathroomList.push(item);
      });

      return registryAlreadyExist
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
          ];
    });
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
              color="principal.solid"
              display="flex"
              justifyContent="center"
              value="PEE"
              width="100dvw"
            >
              <Flex
                align="center"
                backgroundColor="secondary.50"
                border="2px solid #f97837"
                borderRadius={["7px"]}
                direction="column"
                height="100%"
                marginTop={["20px"]}
                padding={["10px"]}
                width={["80%"]}
              >
                {attendance?.map((attendanceItem, attendanceIndex) => (
                  <Flex
                    align="center"
                    borderBottom={
                      attendanceIndex === attendance.length - 1
                        ? ""
                        : "1px solid #031436"
                    }
                    justify="space-between"
                    key={attendanceIndex}
                    padding={["10px 0"]}
                    width="100%"
                  >
                    <Flex fontSize={["16px"]} fontWeight={700} grow="1">
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
                width={["95%", "90%", "90%", "90%", "400px"]}
              >
                {attendance?.map((attendanceItem, attendanceIndex) => (
                  <Flex
                    align="center"
                    color="principa.solid"
                    direction="column"
                    justify="space-between"
                    key={attendanceIndex}
                    width="100%"
                  >
                    <Flex
                      align="center"
                      backgroundColor="secondary.solid"
                      borderTopLeftRadius={["5px"]}
                      borderTopRightRadius={["5px"]}
                      color="secondary.50"
                      fontSize={["18px"]}
                      fontWeight={700}
                      grow="1"
                      justify="center"
                      width={"100%"}
                    >
                      <Text>{attendanceItem.student?.name}</Text>
                    </Flex>
                    <Flex
                      align="center"
                      backgroundColor={"secondary.50"}
                      borderBottomLeftRadius={["5px"]}
                      borderBottomRightRadius={["5px"]}
                      color="principal.solid"
                      justify="space-evenly"
                      padding={["10px"]}
                      width="100%"
                    >
                      {BATHROOM_ACTION_DETAILS_ARR.map((item, index) => (
                        <Flex
                          align="center"
                          direction="column"
                          justify="center"
                          key={index}
                        >
                          <Text fontSize={["16px"]} fontWeight={600}>
                            {item.displayName}
                          </Text>
                          <StepperInput
                            variant="subtle"
                            colorPalette="secondary"
                            color="principal.solid"
                            size={["xs"]}
                            min={0}
                            max={10}
                            onValueChange={(ev) =>
                              handleBathroomUpdate(
                                "POOP",
                                Number(ev.value),
                                attendanceItem.student?.id || 0,
                                item.name
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
                                    bathroomItem.action === "POOP" &&
                                    bathroomItem.actionDetail === item.name
                                )
                                ?.amount.toString() || "0"
                            }
                          />
                        </Flex>
                      ))}
                    </Flex>
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
