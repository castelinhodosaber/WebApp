"use client";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import ROUTES from "@/app/routes";
import { toaster } from "@/components/ui/toaster";
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Management = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");

  const router = useRouter();
  useEffect(() => {
    if (isMobile) {
      toaster.create({
        meta: { closable: true },
        title: "Atenção",
        type: "info",

        description:
          "Por questão de segurança, a sessão administrativa é liberada para acesso apenas pelo computador.",
      });

      router.push(ROUTES.private.principal.dashboard);
    }
  }, [isMobile]);

  return <Flex></Flex>;
};

export default Management;
