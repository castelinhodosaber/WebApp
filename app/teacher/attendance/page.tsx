"use client";
import { Button, Flex } from "@chakra-ui/react";
import Footer from "../../components/Footer";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { SkeletonText } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { formatInTimeZone } from "date-fns-tz";

const TeacherAttendance = () => {
  const router = useRouter();
  const {
    state: { accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] =
    useState<{ studentId: number; present: boolean; name: string }[]>();

  const allChecked = attendances?.every((attendance) => attendance.present);
  const indeterminate =
    attendances?.some((attendance) => attendance.present) && !allChecked;

  useEffect(() => {
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
            router.push(ROUTES.private.teacher.home);
            setAttendances(
              result.data
                .filter((attendance) => attendance.student)
                .map((attendance) => ({
                  studentId: attendance.student!.id,
                  present: attendance.present,
                  name: attendance.student!.name,
                }))
            );
          } else {
            setIsLoading(false);
            setAttendances(
              selectedClass.students?.map((student) => ({
                studentId: student.id,
                present: false,
                name: student.name,
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
      justify="space-around"
      width="100dvw"
      height="100dvh"
    >
      <Flex direction="column">
        <Checkbox
          checked={indeterminate ? "indeterminate" : allChecked}
          onCheckedChange={(e) => {
            setAttendances((attendance) =>
              attendance?.map((value) => ({ ...value, present: !!e.checked }))
            );
          }}
        >
          Presença
        </Checkbox>
        {attendances?.map((attendance, index) => (
          <Checkbox
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
          >
            {attendance.name}
          </Checkbox>
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
