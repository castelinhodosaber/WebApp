"use client";
import { Flex, Text } from "@chakra-ui/react";
import { FaBookOpen, FaEnvelope } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import ROUTES from "../routes";
import { IoHome } from "react-icons/io5";
import { BiSolidMessageDetail } from "react-icons/bi";

import { useGlobalContext } from "../context/GlobalContext";

const Footer = () => {
  const { logout } = useGlobalContext();
  const FOOTER_OPTIONS = [
    {
      icon: <IoHome style={{ height: "100%", width: "100%" }} />,
      name: "Início",
      pathname: ROUTES.dashboard,
    },
    {
      icon: <BiSolidMessageDetail style={{ height: "100%", width: "100%" }} />,
      name: "Recados",
      pathname: ROUTES.annotation,
    },
    {
      icon: <FaBookOpen style={{ height: "100%", width: "100%" }} />,
      name: "Anotações",
      pathname: ROUTES.message,
    },
    {
      icon: <FaEnvelope style={{ height: "100%", width: "100%" }} />,
      name: "Comunicados",
      pathname: ROUTES.announcement,
    },
    {
      icon: <RiLogoutBoxFill style={{ height: "100%", width: "100%" }} />,
      name: "Sair",
      pathname: "",
    },
  ];
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Flex
      align="center"
      bgColor="#1C1C1C"
      borderTopLeftRadius={["6px"]}
      borderTopRightRadius={["6px"]}
      fontSize={["14px"]}
      fontWeight={600}
      height={["50px"]}
      justify="space-evenly"
      width={["100%"]}
    >
      {FOOTER_OPTIONS?.map((opt, index) => (
        <Flex
          align="center"
          direction="column"
          height="100%"
          justify="flex-end"
          key={index}
        >
          <Flex
            _hover={{ color: "#f97837" }}
            align="center"
            color={pathname === opt.pathname ? "#F97837" : "white"}
            height={["20px"]}
            justify="center"
            onClick={() =>
              opt.name === "Sair" ? logout() : router.push(opt.pathname)
            }
            position="relative"
            width={["20px"]}
          >
            {opt.icon}
          </Flex>

          <Text color="white">{opt.name}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Footer;
