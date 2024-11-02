"use client";
import { Flex } from "@chakra-ui/react";
import { useGlobalContext } from "../../context/GlobalContext";
import Footer from "../../components/Footer";
import { useTeacherContext } from "@/app/context/TeacherContext";

const TeacherAttendance = () => {
  const {
    state: { person },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-around"
      width="100dvw"
      height="100dvh"
    >
      Teacher Attendance
      {JSON.stringify(person)}
      {JSON.stringify(selectedClass)}
      <Footer />
    </Flex>
  );
};

export default TeacherAttendance;
