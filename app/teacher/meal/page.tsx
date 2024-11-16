"use client";
import { useEffect, useState } from "react";
import { Meal, MealType } from "@/app/types/api/castelinho";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useTeacherContext } from "@/app/context/TeacherContext";
import Footer from "@/app/components/Footer";
import { FaCaretDown } from "react-icons/fa6";
import { RiStarSFill } from "react-icons/ri";
import { formatInTimeZone } from "date-fns-tz";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";
import formatMealName from "@/app/utils/formatMealName";
import { FaCaretRight } from "react-icons/fa";

const MealPage = () => {
  const router = useRouter();
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

  useEffect(() => {
    const newDate = new Date()
      .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      .split(",")[0];

    const formattedDate = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd"
    );
    setDate(newDate);
    if (accessToken && selectedClass) {
      CASTELINHO_API_ENDPOINTS.meal
        .getByClassIdAndDate(accessToken, selectedClass?.id, formattedDate)
        .then((getMealsRes) => {
          const allMeals = getMealsRes?.data?.length
            ? [...getMealsRes.data]
            : [];

          CASTELINHO_API_ENDPOINTS.mealType
            .getByClassId(accessToken, selectedClass.id)
            .then((mealTypeRes) => {
              if (mealTypeRes?.data.length) {
                CASTELINHO_API_ENDPOINTS.attendance
                  .getByClassIdAndDate(
                    accessToken,
                    selectedClass?.id,
                    formattedDate
                  )
                  .then((attendanceResult) => {
                    if (attendanceResult?.data.length) {
                      mealTypeRes.data.forEach((mealType) => {
                        attendanceResult.data.forEach((att) => {
                          if (
                            !allMeals.some(
                              (meal) =>
                                meal.student?.id === att.student?.id &&
                                meal.mealTypeId === mealType.id
                            ) &&
                            att.present
                          ) {
                            allMeals.push({
                              date: formattedDate,
                              rating: 0,
                              studentId: att.student?.id || 0,
                              student: att.student,
                              mealTypeId: mealType.id,
                            });
                          }
                        });
                      });
                    }
                  })
                  .then(() => {
                    setMealTypes(
                      mealTypeRes.data.map((mealType) => ({
                        ...mealType,
                        display: false,
                      }))
                    );
                  });
              }
            })
            .then(() => {
              setTimeout(() => {
                setMeals(allMeals);
              }, 100);
            });
        });
    }
  }, []);

  const updateMeal = (index: number, newMeal: Meal) => {
    setMeals((prevValues) => {
      const newValues = prevValues.map((value, i) =>
        i === index ? newMeal : value
      );

      return newValues;
    });
  };

  const saveMeals = async () => {
    const result = await CASTELINHO_API_ENDPOINTS.meal.createMany(
      accessToken || "",
      meals
    );

    if (result) {
      toaster.create({
        title: "Refeições salvas com sucesso.",
        type: "success",
      });
    }
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
        Alimentação - {date}
      </Text>
      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        grow={1}
        maxH="100%"
        overflowY="scroll"
        width={["100%"]}
      >
        {mealTypes.map((mealType, index) => (
          <Flex
            align="center"
            direction="column"
            gap={["15px"]}
            justify="center"
            key={index}
            width={["100%"]}
          >
            <Flex
              align="center"
              bgColor="secondary.solid"
              border="2px solid #f97837"
              borderRadius={["6px"]}
              color="secondary.50"
              fontSize={["18px"]}
              fontWeight={[700]}
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
              width={["70%"]}
            >
              {formatMealName(mealType.name)}
              {mealType.display ? (
                <FaCaretDown style={{ position: "absolute", right: "15px" }} />
              ) : (
                <FaCaretRight style={{ position: "absolute", right: "15px" }} />
              )}
            </Flex>
            <Flex
              align="center"
              direction="column"
              gap={["10px"]}
              justify="center"
              width="100%"
            >
              {meals?.map((meal, mealIndex) =>
                meal.mealTypeId !== mealType.id ? null : (
                  <Flex
                    align="center"
                    display={mealType.display ? "flex" : "none"}
                    gap="10px"
                    justify="space-between"
                    key={mealIndex}
                    width={["70%"]}
                  >
                    <Flex
                      align="center"
                      gap={["10px"]}
                      grow={1}
                      justify="flex-start"
                    >
                      <Image
                        src={
                          meal.student?.photo
                            ? `${process.env.NEXT_PUBLIC_CASTELINHO_API}${meal.student.photo}`
                            : "/assets/images/defaultProfilePhoto.png"
                        }
                        height={["40px"]}
                        width={["40px"]}
                        alt="profile"
                        borderRadius="16px"
                      />
                      <Text
                        fontSize={["16px"]}
                        fontWeight={700}
                        textAlign="left"
                      >
                        {meal.student?.name}
                      </Text>
                    </Flex>

                    <Flex align="center" grow={1} justify="flex-end">
                      {[1, 2, 3, 4, 5].map((rate, ratingIndex) => (
                        <RiStarSFill
                          color={rate <= meal.rating ? "yellow" : "white"}
                          key={ratingIndex}
                          onClick={() =>
                            updateMeal(mealIndex, { ...meal, rating: rate })
                          }
                          size={18}
                        />
                      ))}
                    </Flex>
                  </Flex>
                )
              )}
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
          onClick={saveMeals}
          padding={["5px 20px"]}
        >
          Salvar
        </Button>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default MealPage;
