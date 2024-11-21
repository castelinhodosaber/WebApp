"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import ROUTES from "@/app/routes";
import { Bath, Person } from "@/app/types/api/castelinho";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TeacherBath = () => {
  const router = useRouter();
  const {
    state: { date, accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [baths, setBaths] = useState<Bath[]>();
  const [presentStudents, setPresentStudents] =
    useState<(Person & { display: boolean })[]>();

  useEffect(() => {
    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd"
    );

    if (accessToken && selectedClass) {
      CASTELINHO_API_ENDPOINTS.attendance
        .getByClassIdAndDate(accessToken, selectedClass?.id, formattedDate)
        .then((attendanceResult) => {
          if (attendanceResult?.data.length) {
            const newPresentStudents: (Person & { display: boolean })[] = [];
            attendanceResult.data.forEach((att) => {
              if (att.student && att.present)
                newPresentStudents.push({ ...att.student, display: true });
            });
            setPresentStudents(newPresentStudents);
          }
        });
      CASTELINHO_API_ENDPOINTS.bath
        .getByClassIdAndDate(accessToken, selectedClass?.id, formattedDate)
        .then((getBathsRes) => {
          const allBaths = getBathsRes?.data?.length
            ? [...getBathsRes.data.map((item) => ({ ...item, display: true }))]
            : [];

          setBaths(allBaths);
        });
    }
  }, []);

  const handleBathChange = (studentId: number, newValue: boolean) => {
    const bathAlreadyExist = baths?.find(
      (item) => item.studentId === studentId
    );
    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd"
    );
    if (bathAlreadyExist) {
      setBaths(
        baths?.map((item) =>
          item.studentId === studentId
            ? {
                ...item,
                status: !item.status,
              }
            : item
        )
      );
    } else {
      const newBath = {
        date: formattedDate,
        status: newValue,
        studentId,
      };
      setBaths(baths ? [...baths, newBath] : [newBath]);
    }
  };

  const saveBaths = () => {
    if (accessToken && baths?.length)
      toaster.promise(
        CASTELINHO_API_ENDPOINTS.bath.createMany(accessToken, baths),
        {
          success: { title: "Lista salva com sucesso." },
          error: { title: "Erro ao criar lista. Tente novamente." },
          loading: { title: "Salvando lista. Por favor aguarde." },
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
        Banho - {date}
      </Text>
      <Flex
        align="center"
        backgroundColor="rgba(255, 255, 255, 0.8)"
        borderRadius={["6px"]}
        border="2px solid #f97837"
        color="principal.solid"
        direction="column"
        gap="15px"
        justify="flex-start"
        overflowY="scroll"
        padding={["10px 15px"]}
        width={["80%"]}
      >
        {presentStudents?.map((student, presentIndex) => (
          <Flex
            align="center"
            justify="space-between"
            key={presentIndex}
            width={["100%"]}
          >
            <Flex
              align="center"
              fontSize={["18px"]}
              fontWeight={[700]}
              gap={["10px"]}
              grow="1"
              justify="flex-start"
              zIndex={2}
            >
              <Image
                src={
                  student?.photo
                    ? `${process.env.NEXT_PUBLIC_CASTELINHO_API}${student.photo}`
                    : "/assets/images/defaultProfilePhoto.png"
                }
                height={["40px"]}
                width={["40px"]}
                alt="profile"
                borderRadius="11px"
              />
              <Text fontSize={["16px"]} fontWeight={700} textAlign="left">
                {student.name.split(" ")[0]}
              </Text>
            </Flex>
            <Flex
              align="center"
              borderBottomLeftRadius={["6px"]}
              borderBottomRightRadius={["6px"]}
              borderTop="0"
              gap={["10px"]}
              justify="center"
              padding={student.display ? ["10px 5px"] : ""}
            >
              <RadioGroup
                colorPalette="secondary"
                defaultValue="false"
                display="flex"
                gap="25px"
                onValueChange={(ev) =>
                  handleBathChange(
                    student.id,
                    ev.value === "true" ? true : false
                  )
                }
                defaultChecked={false}
                value={
                  baths
                    ?.find((item) => item.studentId === student.id)
                    ?.status.toString() || ""
                }
              >
                <Radio
                  display="flex"
                  flexDirection="column-reverse"
                  fontSize={["16px"]}
                  fontWeight={700}
                  value="false"
                >
                  Não
                </Radio>

                <Radio
                  display="flex"
                  flexDirection="column-reverse"
                  fontSize={["16px"]}
                  fontWeight={700}
                  value="true"
                >
                  Sim
                </Radio>
              </RadioGroup>
            </Flex>
          </Flex>
        ))}
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
          onClick={saveBaths}
          padding={["5px 20px"]}
        >
          Salvar
        </Button>
      </Flex>
    </Flex>
  );
};
export default TeacherBath;
