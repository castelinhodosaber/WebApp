"use client";
import { Flex, Text } from "@chakra-ui/react";
import { useGlobalContext } from "../context/GlobalContext";
import { ReactElement, useEffect, useState } from "react";
import { isTeacherRole } from "../types/api/castelinho";
import { FaHome } from "react-icons/fa";

const Footer = () => {
  const { state } = useGlobalContext();
  const [footerOptions, setFooterOptions] =
    useState<{ icon: ReactElement; name: string }[]>();

  useEffect(() => {
    if (state && state.person) {
      switch (true) {
        case isTeacherRole(state.person?.role):
          setFooterOptions([
            {
              icon: <FaHome />,
              name: "Início",
            },
          ]);
          break;

        default:
          setFooterOptions([
            {
              icon: <FaHome />,
              name: "Início",
            },
          ]);
          break;
      }
    }
  }, [state]);
  return (
    <Flex
      align="center"
      bgColor="#1C1C1C"
      borderTopLeftRadius={["6px"]}
      borderTopRightRadius={["6px"]}
      height={["50px"]}
      justify="space-evenly"
      width={["100%"]}
    >
      {footerOptions?.map((opt, index) => (
        <Flex key={index}>
          {opt.icon}
          <Text>{opt.name}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Footer;
