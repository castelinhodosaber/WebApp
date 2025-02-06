"use client";
import { useEffect, useState } from "react";
import { Meal, MealType } from "@/app/types/api/castelinho";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { FaCaretDown } from "react-icons/fa6";
import { RiStarSFill } from "react-icons/ri";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";
import formatMealName from "@/app/utils/formatMealName";
import { FaCaretRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePrincipalContext } from "@/app/context/PrincipalContext";

const MotionFlex = motion.create(Flex);

const MealPage = () => {
  const router = useRouter();
  const {
    state: { accessToken, date },
  } = useGlobalContext();
  const {
    state: { selectedClass, attendance: globalAttendance },
  } = usePrincipalContext();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<
    (MealType & { display: boolean })[]
  >([]);

  useEffect(() => {
    if (accessToken && selectedClass) {
      CASTELINHO_API_ENDPOINTS.meal
        .getByClassIdAndDate(accessToken, selectedClass?.id, date.iso)
        .then((getMealsRes) => {
          const allMeals = getMealsRes?.data?.length
            ? [...getMealsRes.data]
            : [];

          CASTELINHO_API_ENDPOINTS.mealType
            .getByClassId(accessToken, selectedClass.id)
            .then((mealTypeRes) => {
              if (mealTypeRes?.data.length) {
                if (globalAttendance?.length) {
                  mealTypeRes.data.forEach((mealType) => {
                    globalAttendance.forEach((att) => {
                      if (
                        !allMeals.some(
                          (meal) =>
                            meal.student?.id === att.student?.id &&
                            meal.mealTypeId === mealType.id
                        ) &&
                        att.present
                      ) {
                        allMeals.push({
                          date: date.iso,
                          rating: 0,
                          studentId: att.student?.id || 0,
                          student: att.student,
                          mealTypeId: mealType.id,
                        });
                      }
                    });
                  });
                }

                setMealTypes(
                  mealTypeRes.data.map((mealType) => ({
                    ...mealType,
                    display: false,
                  }))
                );
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
      toaster.create({meta: { closable: true },
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
        Alimentação - {date.br}
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
            justify="center"
            key={index}
            width={["100%"]}
          >
            <Flex
              align="center"
              bgColor="secondary.solid"
              border="2px solid #f97837"
              borderTopLeftRadius={["6px"]}
              borderTopRightRadius={["6px"]}
              borderBottomLeftRadius={mealType.display ? "" : ["6px"]}
              borderBottomRightRadius={mealType.display ? "" : ["6px"]}
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
              width={["80%"]}
            >
              {formatMealName(mealType.name)}
              {mealType.display ? (
                <FaCaretDown style={{ position: "absolute", right: "15px" }} />
              ) : (
                <FaCaretRight style={{ position: "absolute", right: "15px" }} />
              )}
            </Flex>
            <MotionFlex
              align="center"
              backgroundColor="secondary.50"
              borderBottomLeftRadius={["6px"]}
              borderBottomRightRadius={["6px"]}
              border="2px solid #f97837"
              direction="column"
              gap={["10px"]}
              justify="center"
              padding={mealType.display ? ["10px 5px"] : ""}
              initial={{ opacity: 0, y: -20 }}
              animate={
                mealType.display ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
              }
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              width="80%"
            >
              {meals?.map((meal, mealIndex) =>
                meal.mealTypeId !== mealType.id ? null : (
                  <MotionFlex
                    align="center"
                    gap="10px"
                    justify="space-between"
                    key={mealIndex}
                    width={["100%"]}
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      mealType.display
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -20 }
                    }
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: mealType.display ? "flex" : "none" }}
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
                        borderRadius="11px"
                      />
                      <Text
                        color="principal.solid"
                        fontSize={["16px"]}
                        fontWeight={700}
                        textAlign="left"
                      >
                        {meal.student?.name.split(" ")[0]}
                      </Text>
                    </Flex>

                    <Flex align="center" grow={1} justify="flex-end">
                      {[1, 2, 3, 4, 5].map((rate, ratingIndex) => (
                        <RiStarSFill
                          color={rate <= meal.rating ? "#f97837" : "#031436"}
                          key={ratingIndex}
                          onClick={() =>
                            updateMeal(mealIndex, { ...meal, rating: rate })
                          }
                          size={20}
                        />
                      ))}
                    </Flex>
                  </MotionFlex>
                )
              )}
            </MotionFlex>
          </Flex>
        ))}
      </Flex>
      <Flex align="center" gap={["15px"]} justify="center">
        <Button
          colorPalette="secondaryButton"
          fontSize={["18px"]}
          fontWeight={[600]}
          onClick={() => router.push(ROUTES.private.principal.home)}
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
    </Flex>
  );
};

export default MealPage;
