"use client";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import ROUTES from "@/app/routes";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";

import { toaster } from "@/components/ui/toaster";
import { Attendance } from "@/app/types/api/castelinho";
import Loading from "@/app/components/Loading";
import { usePrincipalContext } from "@/app/context/PrincipalContext";

const TeacherAttendance = () => {
  const searchParams = useSearchParams();
  const editAttendance = searchParams.get("edit");
  const router = useRouter();

  const {
    state: { accessToken, date },
  } = useGlobalContext();
  const {
    state: { selectedClass },
    setSelectedClass,
    setAttendance: setContextAttendance,
  } = usePrincipalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>();

  const allChecked = attendances?.every((attendance) => attendance.present);
  const indeterminate =
    attendances?.some((attendance) => attendance.present) && !allChecked;

  useEffect(() => {
    if (selectedClass && accessToken) {
      CASTELINHO_API_ENDPOINTS.attendance
        .getByClassIdAndDate(accessToken, selectedClass.id, date.iso)
        .then((result) => {
          if (result?.data?.length) {
            if (!editAttendance)
              return router.push(ROUTES.private.teacher.home);

            const newAttendances = result.data
              .filter((attendance) => attendance.student)
              .map((attendance) => ({
                studentId: attendance.student!.id,
                date: date.iso,
                present: attendance.present,
                student: attendance.student,
              }));
            setAttendances(newAttendances);
            setContextAttendance(newAttendances);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            const newAttendances = selectedClass.students?.map((student) => ({
              studentId: student.id,
              present: false,
              student,
              date: date.iso,
            }));

            setAttendances(newAttendances);
          }
        });
    }
  }, []);

  const handleSaveAttendance = async () => {
    setIsLoading(true);
    if (accessToken && attendances) {
      const newAttendances = attendances.map((attendance) => ({
        ...attendance,
        date: date.iso,
      }));
      const result = await CASTELINHO_API_ENDPOINTS.attendance.createMany(
        accessToken,
        newAttendances
      );

      if (result) {
        router.push(ROUTES.private.teacher.home);

        setContextAttendance(
          newAttendances.map((item, index) => ({
            ...item,
            id: result.data[index].id,
          }))
        );
        toaster.create({ type: "success", title: "Lista salva com sucesso." });
      } else {
        toaster.create({
          type: "error",
          title: "Erro desconhecido. Tente novamente.",
        });
        setIsLoading(false);
      }
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Flex
      direction="column"
      align="center"
      padding={["50px 0 80px 0 "]}
      width="100dvw"
      maxH="100dvh"
      height="100dvh"
    >
      <Text fontSize={["20px"]} fontWeight={[700]}>
        Lista de Presença - {date.br}
      </Text>
      <Flex
        align="center"
        backgroundColor="secondary.50"
        border="2px solid #f97837"
        borderRadius={["8px"]}
        color="principal.solid"
        direction="column"
        gap={["5px"]}
        grow={1}
        margin={["30px 0"]}
        overflowY="scroll"
        padding={["20px 0 0"]}
        width={["80%"]}
      >
        <Flex
          align="center"
          borderBottom="2px solid #031436"
          justify="space-between"
          onClick={() => {
            setAttendances((attendance) =>
              attendance?.map((value) =>
                allChecked
                  ? { ...value, present: false }
                  : { ...value, present: true }
              )
            );
          }}
          paddingBottom="15px"
          width={["90%"]}
        >
          <Text
            fontSize={["16px"]}
            fontWeight={700}
            marginLeft={["60px"]}
            textAlign="left"
          >
            {allChecked ? "Desmarcar Todos" : "Marcar Todos"}
          </Text>
          <Checkbox
            alignSelf="flex-end"
            colorPalette="secondary"
            borderRadius="3px"
            border="1px solid white"
            checked={indeterminate ? "indeterminate" : allChecked}
            onClick={() => {
              setAttendances((attendance) => {
                if (allChecked) {
                  return attendance?.map((value) => ({
                    ...value,
                    present: true,
                  }));
                } else {
                  return attendance?.map((value) => ({
                    ...value,
                    present: false,
                  }));
                }
              });
            }}
            overflow="hidden"
          ></Checkbox>
        </Flex>

        {attendances?.map((attendance, index) => (
          <Flex
            align="center"
            borderBottom={
              index === attendances.length - 1 ? "" : "2px solid #031436"
            }
            justify="space-between"
            height={["100px"]}
            key={index}
            onClick={() => {
              setAttendances((item) => {
                const newValues = item ? [...item] : [];
                newValues[index] = {
                  ...newValues[index],
                  present: !newValues[index].present,
                };
                return newValues;
              });
            }}
            width="90%"
          >
            <Flex align="center" gap={["10px"]} grow={1} justify="flex-start">
              <Image
                src={
                  attendance.student?.photo
                    ? `/api/castelinho/imageProxy?route=${encodeURIComponent(
                        attendance.student?.photo
                      )}`
                    : "/assets/images/defaultProfilePhoto.png"
                }
                height={["50px"]}
                width={["50px"]}
                alt="profile"
                borderRadius="16px"
              />
              <Text fontSize={["16px"]} fontWeight={700} textAlign="left">
                {attendance.student?.name}
              </Text>
            </Flex>

            <Checkbox
              borderRadius="3px"
              border="1px solid white"
              colorPalette="secondary"
              key={attendance.studentId}
              ms="6"
              checked={attendance.present}
              onClick={() => {
                setAttendances((item) => {
                  const newValues = item ? [...item] : [];
                  newValues[index] = {
                    ...newValues[index],
                    present: !newValues[index].present,
                  };
                  return newValues;
                });
              }}
              onCheckedChange={(ev) => {
                setAttendances((attendance) => {
                  const newValues = attendance ? [...attendance] : [];
                  newValues[index] = {
                    ...newValues[index],
                    present: !!ev.checked,
                  };
                  return newValues;
                });
              }}
              overflow="hidden"
            />
          </Flex>
        ))}
      </Flex>
      <Flex justify="center" gap={["20px"]} width={["100%"]}>
        <Button
          colorPalette="secondaryButton"
          fontSize={["14px"]}
          fontWeight={700}
          onClick={() => {
            setSelectedClass();
            router.push(ROUTES.private.teacher.dashboard);
          }}
          padding={["10px 30px"]}
          textTransform="uppercase"
        >
          Voltar
        </Button>
        <Button
          borderRadius="3px"
          color="#ffe9e0"
          colorPalette="secondary"
          fontSize={["14px"]}
          fontWeight={700}
          onClick={handleSaveAttendance}
          padding={["10px 30px"]}
          textTransform="uppercase"
        >
          Salvar Lista
        </Button>
      </Flex>
    </Flex>
  );
};

export default TeacherAttendance;
