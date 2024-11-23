"use client";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import ROUTES from "@/app/routes";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { SkeletonCircle } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { formatInTimeZone } from "date-fns-tz";

const TeacherAttendance = () => {
  const searchParams = useSearchParams();
  const editAttendance = searchParams.get("edit");
  const router = useRouter();

  const [date, setDate] = useState("");
  const {
    state: { accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
    setSelectedClass,
  } = useTeacherContext();
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] =
    useState<
      { studentId: number; present: boolean; name: string; photo?: string }[]
    >();

  const allChecked = attendances?.every((attendance) => attendance.present);
  const indeterminate =
    attendances?.some((attendance) => attendance.present) && !allChecked;

  useEffect(() => {
    const newDate = new Date()
      .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      .split(",")[0];

    setDate(newDate);
    if (selectedClass && accessToken) {
      CASTELINHO_API_ENDPOINTS.attendance
        .getByClassIdAndDate(
          accessToken,
          selectedClass.id,
          new Date()
            .toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
            .split(",")[0]
        )
        .then((result) => {
          if (result?.data?.length) {
            if (!editAttendance)
              return router.push(ROUTES.private.teacher.home);
            setAttendances(
              result.data
                .filter((attendance) => attendance.student)
                .map((attendance) => ({
                  studentId: attendance.student!.id,
                  present: attendance.present,
                  name: attendance.student!.name,
                  photo: attendance.student!.photo,
                }))
            );
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setAttendances(
              selectedClass.students?.map((student) => ({
                studentId: student.id,
                present: false,
                name: student.name,
                photo: student.photo,
              }))
            );
          }
        });
    }
  }, []);

  const handleSaveAttendance = async () => {
    setIsLoading(true);
    if (accessToken && attendances) {
      const date = formatInTimeZone(
        new Date(),
        "America/Sao_Paulo",
        "yyyy-MM-dd"
      );

      const result = await CASTELINHO_API_ENDPOINTS.attendance.createMany(
        accessToken,
        attendances.map((attendance) => ({ ...attendance, date }))
      );

      if (result) {
        router.push(ROUTES.private.teacher.home);
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
    <SkeletonCircle />
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
        Lista de Presença - {date}
      </Text>
      <Flex
        align="center"
        backgroundColor="rgba(255, 255, 255, 0.8)"
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
          padding={["0 15px"]}
          paddingBottom="15px"
          width={["100%"]}
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
            padding={["0 15px"]}
            width="100%"
          >
            <Flex align="center" gap={["10px"]} grow={1} justify="flex-start">
              <Image
                src={
                  attendance.photo
                    ? `/api/castelinho/imageProxy?route=${encodeURIComponent(
                        attendance.photo
                      )}`
                    : "/assets/images/defaultProfilePhoto.png"
                }
                height={["50px"]}
                width={["50px"]}
                alt="profile"
                borderRadius="16px"
              />
              <Text fontSize={["16px"]} fontWeight={700} textAlign="left">
                {attendance.name}
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
