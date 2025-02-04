"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { CastelinhoApiStudentGetDetailsByIdAndDateResponse } from "@/app/api/castelinho/student/getDetailsByIdAndDate";
import Loading from "@/app/components/Loading";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useGuardianContext } from "@/app/context/GuardianContext";
import {
  Classes,
  Person,
  StudentGuardianRelationship,
} from "@/app/types/api/castelinho";
import addMinutesToTime from "@/app/utils/addMinutesToTime";
import formatDateToBR from "@/app/utils/formatDateToBR";
import formatMealName from "@/app/utils/formatMealName";
import { Field } from "@/components/ui/field";
import { Flex, Input, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiStarSFill } from "react-icons/ri";

const MotionFlex = motion.create(Flex);

const Home = () => {
  const [isLoading, _setIsLoading] = useState(false);
  const {
    state: { date, accessToken },
  } = useGlobalContext();
  const { state: guardianDetails } = useGuardianContext();
  const [selectedDate, setSelectedDate] = useState(date.iso || "");
  const [selectedStudent, setSelectedStudent] = useState<
    Person & { classes: Classes[]; relationship: StudentGuardianRelationship }
  >();
  const [studentDetails, setStudentDetails] =
    useState<CastelinhoApiStudentGetDetailsByIdAndDateResponse["data"]>();

  useEffect(() => {
    if (guardianDetails) {
      if (guardianDetails.students.length === 1) {
        setSelectedStudent(guardianDetails.students[0]);
      }
    }
  }, [guardianDetails]);

  useEffect(() => {
    if (selectedStudent?.id && accessToken) {
      CASTELINHO_API_ENDPOINTS.student
        .getDetailsByIdAndDate(accessToken, selectedStudent.id, selectedDate)
        .then((result) => {
          if (result && result.data) {
            setStudentDetails(result.data);
          } else {
            setStudentDetails(undefined);
          }
        });
    }
  }, [selectedStudent, accessToken, selectedDate]);

  return isLoading ? (
    <Loading />
  ) : (
    <Flex
      align="center"
      direction="column"
      height={"100dvh"}
      maxH="100dvh"
      padding={["50px 0 80px 0"]}
      wrap="wrap"
      width={["100%"]}
    >
      {!selectedStudent ? (
        <>
          <Text fontSize={["18px"]} fontWeight={700}>
            {`Bem vind${guardianDetails?.gender === "female" ? "a" : "o"}, ${
              guardianDetails?.name.split(" ")[0]
            }!`}
          </Text>
          <Flex align="center" direction="column" grow={1} justify="center">
            <Text fontSize={["14px"]} fontWeight={400} marginBottom={["50px"]}>
              Escolha uma criança para ver as atualizações diárias
            </Text>
            {guardianDetails?.students.map((student, index) => (
              <Flex
                align="center"
                backgroundColor="secondary.50"
                border="2px solid #f97837"
                borderRadius={["12px"]}
                color="principal.500"
                cursor="pointer"
                gap="10px"
                onClick={() => setSelectedStudent(student)}
                padding={["10px 20px 10px 15px"]}
                textAlign={"center"}
                key={index}
                width={["250px"]}
              >
                <Flex
                  borderRadius={["8px"]}
                  position="relative"
                  overflow="hidden"
                  width={["50px"]}
                  height={["50px"]}
                >
                  <Image
                    alt="children"
                    src={
                      student.photo
                        ? `/api/castelinho/imageProxy?route=${encodeURIComponent(
                            student.photo
                          )}`
                        : "/assets/images/defaultProfilePhoto.png"
                    }
                    objectFit="fill"
                    fill={true}
                  />
                </Flex>
                <Flex align="flex-start" direction="column">
                  <Text fontSize={["15px"]} fontWeight={600}>
                    {student.name.split(" ")[0]}
                  </Text>
                  <Text fontSize={["13px"]}>
                    {
                      student.classes.find(
                        (aClass) =>
                          aClass.year.toString() === date.br.split("/")[2]
                      )?.name
                    }
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          direction="column"
          grow={1}
          justify="center"
          wrap="wrap"
          width={["100%"]}
        >
          <Flex
            borderRadius={["8px"]}
            marginBottom={["10px"]}
            position="relative"
            overflow="hidden"
            width={["50px"]}
            height={["50px"]}
          >
            <Image
              alt="children"
              src={
                selectedStudent?.photo
                  ? `/api/castelinho/imageProxy?route=${encodeURIComponent(
                      selectedStudent?.photo
                    )}`
                  : "/assets/images/defaultProfilePhoto.png"
              }
              objectFit="fill"
              fill={true}
            />
          </Flex>
          <Text fontSize={["15px"]} fontWeight={[700]}>{`${
            selectedStudent?.name
          } - ${
            selectedStudent?.classes.find(
              (classItem) => classItem.year.toString() === date.br.split("/")[2]
            )?.name
          }`}</Text>
          <Text fontSize={["13px"]}>
            Informações do dia {formatDateToBR(selectedDate)}
          </Text>

          <Field
            alignItems="center"
            display="flex"
            justifyContent="center"
            label="Selecionar outra data"
            margin="20px 0"
            textAlign="center"
            width="100%"
          >
            <Input
              type="date"
              padding={["2px 5px"]}
              value={selectedDate}
              onChange={(ev) => setSelectedDate(ev.target.value)}
              width="auto"
            />
          </Field>

          {studentDetails ? (
            <MotionFlex
              align="center"
              gap={["20px"]}
              backgroundColor="secondary.50"
              border="2px solid #f97837"
              borderRadius={["5px"]}
              direction="column"
              color="principal.solid"
              fontSize={["13px"]}
              justify="center"
              marginTop={["30px"]}
              padding={["10px 20px"]}
              width={["80%"]}
              initial={{ opacity: 0, y: -20 }}
              animate={
                studentDetails ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
              }
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: studentDetails ? "flex" : "none" }}
            >
              <Flex
                align="center"
                direction="column"
                justify="center"
                width="100%"
              >
                <Text fontSize={["15px"]} fontWeight={700}>
                  Refeições
                </Text>
                <Flex
                  align="center"
                  direction="column"
                  justify="center"
                  width="100%"
                >
                  {studentDetails.meals?.map((mealItem, index) => (
                    <Flex
                      align="center"
                      justify="space-between"
                      key={index}
                      width="100%"
                    >
                      <Text>{formatMealName(mealItem.name || "lunch")}</Text>
                      <Flex align="center" grow={1} justify="flex-end">
                        {[1, 2, 3, 4, 5].map((rate, rateIndex) => (
                          <RiStarSFill
                            color={
                              rate <= mealItem.rating ? "#f97837" : "#031436"
                            }
                            key={rateIndex}
                            size={20}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex
                align="center"
                direction="column"
                justify="center"
                width="100%"
              >
                <Text fontSize={["15px"]} fontWeight={700}>
                  Sonecas
                </Text>
                <Flex
                  align="center"
                  direction="column"
                  justify="center"
                  width="100%"
                >
                  <Flex
                    align="center"
                    justify="center"
                    textAlign="center"
                    fontWeight={700}
                    width="100%"
                  >
                    <Text width="40%">Início</Text>
                    <Text width="40%">Término</Text>
                  </Flex>
                  {studentDetails.naps?.map((napItem, index) => (
                    <Flex
                      align="center"
                      justify="center"
                      key={index}
                      textAlign="center"
                      width="100%"
                    >
                      <Text width="40%">{napItem.hour.substring(0, 5)}</Text>
                      <Text width="40%">
                        {addMinutesToTime(
                          napItem.hour,
                          napItem.napTimeMinutes
                        ).substring(0, 5)}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex
                align="center"
                direction="column"
                justify="center"
                width="100%"
              >
                <Text fontSize={["15px"]} fontWeight={700}>
                  Banheiro (Trocas)
                </Text>
                <Flex
                  align="center"
                  direction="column"
                  justify="center"
                  width="100%"
                >
                  {studentDetails.bathrooms?.map((bathroomItem, index) => (
                    <Flex
                      align="center"
                      justify="space-between"
                      key={index}
                      width="100%"
                    >
                      <Text>
                        {bathroomItem.action === "PEE"
                          ? "Xixi"
                          : `Cocô (${
                              bathroomItem.actionDetail === "DIARRHEA"
                                ? "Diarréia"
                                : bathroomItem.actionDetail === "NORMAL"
                                ? "Normal"
                                : "Duro"
                            })`}
                      </Text>
                      {
                        <Text>
                          {bathroomItem.amount}{" "}
                          {bathroomItem.amount > 1
                            ? "vezez"
                            : bathroomItem.amount === 1
                            ? "vez"
                            : "Nenhuma vez"}
                        </Text>
                      }
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex
                align="center"
                direction="column"
                justify="center"
                width="100%"
              >
                <Text fontSize={["15px"]} fontWeight={700}>
                  Banho
                </Text>
                <Flex
                  align="center"
                  direction="column"
                  justify="center"
                  width="100%"
                >
                  {studentDetails.baths?.map((bathItem, index) => (
                    <Flex
                      align="center"
                      justify="center"
                      key={index}
                      textAlign="center"
                      width="100%"
                    >
                      <Text>
                        {bathItem.status
                          ? `Tomou banho na escola.`
                          : `Não tomou banho na escola.`}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex
                align="center"
                direction="column"
                justify="center"
                width="100%"
              >
                <Text fontSize={["15px"]} fontWeight={700}>
                  Anotações
                </Text>
                <Flex
                  align="center"
                  direction="column"
                  justify="center"
                  width="100%"
                >
                  {studentDetails.attendances?.map((attendanceItem, index) => (
                    <Flex
                      align="center"
                      justify="center"
                      key={index}
                      textAlign="center"
                      width="100%"
                    >
                      <Text>
                        {attendanceItem.comments
                          ? attendanceItem.comments
                          : `${
                              selectedStudent.gender === "female" ? "A" : "O"
                            } ${
                              selectedStudent.name.split(" ")[0]
                            } não possui referente a data selecionada.`}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </MotionFlex>
          ) : (
            <Flex align="center" grow="1" justify="center" width="100%">
              <Text fontSize={"13px"} textAlign="center" width={["80%"]}>
                {" "}
                {`${selectedStudent.gender === "female" ? "A" : "O"} ${
                  selectedStudent.name.split(" ")[0]
                } não possui registros referente a data selecionada. ${
                  selectedDate === date.iso
                    ? "Aguarde até que a professora responsável preencha as informações do dia."
                    : ""
                }`}
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Home;
