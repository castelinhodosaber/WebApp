"use client";
import { useEffect, useState } from "react";
import { Attendance, Meal, MealType } from "@/app/types/api/castelinho";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useTeacherContext } from "@/app/context/TeacherContext";
import Footer from "@/app/components/Footer";
import { FaCaretDown } from "react-icons/fa6";

const MealPage = () => {
  const {
    state: { accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<
    (MealType & { display: boolean })[]
  >([]);
  const [date, setDate] = useState<string>("");
  const [presentList, setPresentList] = useState<Attendance[]>();

  useEffect(() => {
    const newDate = new Date()
      .toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      .split(",")[0];
    setDate(newDate);
    if (accessToken && selectedClass) {
      CASTELINHO_API_ENDPOINTS.meal
        .getByClassIdAndDate(accessToken, selectedClass?.id, newDate)
        .then((result) => {
          if (result?.data.length) {
            setMeals(result.data);
          }
        });

      CASTELINHO_API_ENDPOINTS.mealType
        .getByClassId(accessToken, selectedClass.id)
        .then((result) => {
          if (result?.data.length) {
            setMealTypes(
              result.data.map((res, index) => ({
                ...res,
                display: index ? false : true,
              }))
            );
          }
        });

      CASTELINHO_API_ENDPOINTS.attendance
        .getByClassIdAndDate(accessToken, selectedClass?.id, newDate)
        .then((result) => {
          if (result?.data.length) {
            setPresentList(result.data);
          }
        });
    }
  }, []);

  return (
    <Flex
      align="center"
      direction="column"
      gap={["20px"]}
      minHeight="100dvh"
      justify="center"
      padding={["20px 0 80px 0 "]}
      width="100dvw"
    >
      <Flex align="center" direction="column" width={["100%"]}>
        <Text fontSize={["16px"]} fontWeight={[700]}>
          Alimentação - {date}
        </Text>
        {mealTypes.map((mealType) => (
          <Flex
            align="center"
            direction="column"
            justify="center"
            key={mealType.id}
            width={["100%"]}
          >
            <Flex
              align="center"
              justify="center"
              onClick={() =>
                setMealTypes((curr) => [
                  ...curr.map((item) =>
                    item.id === mealType.id
                      ? { ...item, display: !item.display }
                      : item
                  ),
                ])
              }
              position="relative"
              textTransform="capitalize"
              width={["70%"]}
            >
              {mealType.name}
              <FaCaretDown style={{ position: "absolute", right: "15px" }} />
            </Flex>
            {presentList?.map((attendance) => (
              <Flex
                align="center"
                display={mealType.display ? "flex" : "none"}
                gap="5px"
                justify="center"
                key={attendance.id}
              >
                {attendance.student?.name} -{" "}
                {meals.map((meal) => {
                  return meal.student?.id === attendance.student?.id &&
                    meal.mealTypeId === mealType.id
                    ? meal.rating
                    : "";
                })}
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
      <Flex align="center" gap={["15px"]} justify="center">
        <Button colorPalette="secondaryButton" padding={["5px 20px"]}>
          Voltar
        </Button>
        <Button colorPalette="secondary" padding={["5px 20px"]}>
          Salvar
        </Button>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default MealPage;
