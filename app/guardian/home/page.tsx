"use client";
import Loading from "@/app/components/Loading";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useGuardianContext } from "@/app/context/GuardianContext";
import {
  Classes,
  Person,
  StudentGuardianRelationship,
} from "@/app/types/api/castelinho";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Home = () => {
  const [isLoading, _setIsLoading] = useState(false);
  const _router = useRouter();
  const {
    state: { date },
  } = useGlobalContext();
  const { state: guardianDetails } = useGuardianContext();
  const [selectedStudent, setSelectedStudent] = useState<
    Person & { classes: Classes[]; relationship: StudentGuardianRelationship }
  >();

  useEffect(() => {
    if (guardianDetails) {
      if (guardianDetails.students.length === 1) {
        setSelectedStudent(guardianDetails.students[0]);
      }
    }
  }, [guardianDetails]);

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
      <Text fontSize={["18px"]} fontWeight={700}>
        {`Bem vind${guardianDetails?.gender === "female" ? "a" : "o"}, ${
          guardianDetails?.name.split(" ")[0]
        }!`}
      </Text>
      {selectedStudent ? (
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
      ) : (
        <Flex>ss</Flex>
      )}
    </Flex>
  );
};

export default Home;
