"use client";
import Loading from "@/app/components/Loading";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import ROUTES from "@/app/routes";
import { Classes } from "@/app/types/api/castelinho";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import {
  Button,
  createListCollection,
  Flex,
  ListCollection,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const createClassesCollection = (classes: Classes[]) =>
  createListCollection({
    items: classes.map((aClass) => ({ label: aClass.name, value: aClass.id })),
  });

const TeacherDashboard = () => {
  const {
    state: { teacherClasses, classes, selectedClass },
    setSelectedClass,
  } = useTeacherContext();
  const {
    state: { person },
  } = useGlobalContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [classCollection, setClassCollection] = useState<
    ListCollection<{
      label: string;
      value: number;
    }>
  >();

  useEffect(() => {
    if (classes && teacherClasses)
      setClassCollection(
        createClassesCollection(
          classes.filter(
            (aClass) =>
              !teacherClasses.some(
                (teacherClass) => teacherClass.name === aClass.name
              )
          )
        )
      );
    setIsLoading(false);
  }, [classes, teacherClasses]);

  const handleSelectedClass = (classId: number) => {
    setIsLoading(true);
    setSelectedClass(classId);
  };

  useEffect(() => {
    if (selectedClass) {
      router.push(ROUTES.private.teacher.attendance);
    } else setIsLoading(false);
  }, [selectedClass, router]);

  return isLoading ? (
    <Loading />
  ) : (
    <Flex
      align="center"
      direction="column"
      height="100dvh"
      justify="flex-start"
      padding={["50px 0 80px 0 "]}
      width="100%"
    >
      <Text fontSize={["18px"]} fontWeight={700}>
        {`Bem vind${person?.gender === "female" ? "a" : "o"}, ${
          person?.name.split(" ")[0]
        }!`}
      </Text>
      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        grow="1"
        justify="center"
        width="100%"
      >
        <Text fontSize={["16px"]} fontWeight={700}>
          Selecionar Turma
        </Text>
        {teacherClasses?.length ? (
          teacherClasses?.map((teacherClass, index) => (
            <Button
              color="secondary.100"
              colorPalette="secondary"
              border="1px solid orange"
              borderRadius={["12px"]}
              fontSize={["20px"]}
              fontWeight={800}
              height={["80px"]}
              key={index}
              onClick={() => {
                handleSelectedClass(teacherClass.id);
              }}
              textTransform="uppercase"
              width={["180px"]}
            >
              {teacherClass.name}
            </Button>
          ))
        ) : (
          <Text fontSize={["14px"]} fontWeight={400} textAlign="center">
            Você não é responsável direto(a) por nenhuma turma no momento.
          </Text>
        )}
        <label>
          {classCollection ? (
            <NativeSelectRoot variant={"outline"} width={["180px"]}>
              <NativeSelectField
                value={selectedClass?.id}
                placeholder="Selecionar outra turma"
                onChange={(e) => handleSelectedClass(Number(e.target.value))}
              >
                {classCollection.items.map((aClass) => (
                  <option value={aClass.value} key={aClass.value}>
                    {aClass.label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          ) : null}
        </label>
      </Flex>
    </Flex>
  );
};

export default TeacherDashboard;
