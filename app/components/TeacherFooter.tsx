"use client";
import { Flex, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import handleFooterOptions from "../utils/HandleFooterOptions";
import { useTeacherContext } from "../context/TeacherContext";
import ROUTES from "../routes";
import { toaster } from "@/components/ui/toaster";

const TeacherFooter = () => {
  const {
    logout,
    state: { person },
  } = useGlobalContext();
  const {
    state: { attendance },
  } = useTeacherContext();
  const FOOTER_OPTIONS = person ? handleFooterOptions(person.role) : null;
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (footerOption: {
    icon: JSX.Element;
    name: string;
    pathname: string;
  }) => {
    switch (footerOption.pathname) {
      case ROUTES.private.teacher.message:
        if (!attendance) {
          toaster.create({
            type: "error",
            title: "Erro!",
            description: "Selecione a sala para acessar esta seção.",
            duration: 1000000,
          });
        } else router.push(footerOption.pathname);
        break;
      case ROUTES.public.logout:
        logout();
        break;
      default:
        router.push(footerOption.pathname);
        break;
    }
  };

  return (
    <Flex
      align="center"
      bgColor="#1C1C1C"
      borderTopLeftRadius={["6px"]}
      borderTopRightRadius={["6px"]}
      bottom="0"
      fontSize={["14px"]}
      fontWeight={600}
      height={["50px"]}
      justify="space-evenly"
      position="fixed"
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
            onClick={() => handleClick(opt)}
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

export default TeacherFooter;
