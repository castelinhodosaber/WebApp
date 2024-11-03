"use client";
import { Button, Flex } from "@chakra-ui/react";
import Footer from "../../components/Footer";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";

const TeacherAttendance = () => {
  const router = useRouter();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [attendance, setAttendance] =
    useState<{ studentId: number; present: boolean; name: string }[]>();

  const allChecked = attendance?.every((item) => item.present);
  const indeterminate = attendance?.some((item) => item.present) && !allChecked;

  useEffect(() => {
    if (selectedClass) {
      setAttendance(
        selectedClass.students?.map((student) => ({
          studentId: student.id,
          present: false,
          name: student.name,
        }))
      );
    }
  }, [selectedClass]);

  const handleSaveAttendance = () => {};
  return (
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
            setAttendance((curr) =>
              curr?.map((value) => ({ ...value, present: !!e.checked }))
            );
          }}
        >
          Presença
        </Checkbox>
        {attendance?.map((item, index) => (
          <Checkbox
            key={item.studentId}
            ms="6"
            checked={item.present}
            onCheckedChange={(ev) => {
              setAttendance((current) => {
                const newValues = current ? [...current] : [];
                newValues[index] = {
                  ...newValues[index],
                  present: !!ev.checked,
                };
                return newValues;
              });
            }}
          >
            {item.name}
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
