"use client";
import { Flex, List } from "@chakra-ui/react";
import Footer from "../../components/Footer";
import { useTeacherContext } from "@/app/context/TeacherContext";

const TeacherAttendance = () => {
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
      <List.Root>
        {selectedClass?.students.map((student) => (
          <List.Item key={student.id}>{student.name}</List.Item>
        ))}
      </List.Root>
      <Footer />
    </Flex>
  );
};

export default TeacherAttendance;
