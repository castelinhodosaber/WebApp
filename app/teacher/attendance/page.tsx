"use client";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import Footer from "../../components/Footer";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import ROUTES from "@/app/routes";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { SkeletonText } from "@/components/ui/skeleton";
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
        setIsLoading(false);
        router.push(ROUTES.private.teacher.home);
        toaster.create({ type: "sucess", title: "Lista salva com sucesso." });
      } else {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <SkeletonText noOfLines={6} />
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
        backgroundColor="#ffcbb4"
        direction="column"
        gap={["5px"]}
        grow={1}
        margin={["30px 0"]}
        overflowY="scroll"
        paddingRight={["30px"]}
        width={["80%"]}
      >
        <Flex align="center" justify="space-between" width={["100%"]}>
          <Text
            fontSize={["14px"]}
            fontWeight={700}
            marginLeft={["60px"]}
            textAlign="left"
          >
            {allChecked ? "Desmarcar Todos" : "Marcar Todos"}
          </Text>
          <Checkbox
            alignSelf="flex-end"
            borderRadius="3px"
            border="1px solid white"
            checked={indeterminate ? "indeterminate" : allChecked}
            onCheckedChange={(e) => {
              setAttendances((attendance) =>
                attendance?.map((value) => ({ ...value, present: !!e.checked }))
              );
            }}
            overflow="hidden"
          ></Checkbox>
        </Flex>

        {attendances?.map((attendance, index) => (
          <Flex
            align="center"
            justify="space-between"
            height={["100px"]}
            key={index}
            width="100%"
          >
            <Flex align="center" gap={["10px"]} grow={1} justify="flex-start">
              <Image
                src={
                  attendance.photo
                    ? `${process.env.NEXT_PUBLIC_CASTELINHO_API}${attendance.photo}`
                    : "/assets/images/defaultProfilePhoto.png"
                }
                height={["50px"]}
                width={["50px"]}
                alt="profile"
                borderRadius="16px"
              />
              <Text fontSize={["14px"]} fontWeight={700} textAlign="left">
                {attendance.name}
              </Text>
            </Flex>

            <Checkbox
              borderRadius="3px"
              border="1px solid white"
              key={attendance.studentId}
              ms="6"
              checked={attendance.present}
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
          onClick={() => router.push(ROUTES.private.teacher.dashboard)}
          padding={["10px 30px"]}
        >
          Voltar
        </Button>
        <Button
          colorPalette="secondary"
          onClick={handleSaveAttendance}
          padding={["10px 30px"]}
        >
          Salvar Lista
        </Button>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default TeacherAttendance;
