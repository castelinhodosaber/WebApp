"use client";
import { useEffect, useState } from "react";
import { Flex, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ROUTES from "./routes";
import { useGlobalContext } from "./context/GlobalContext";
import { toaster } from "@/components/ui/toaster";
import { CASTELINHO_API_ENDPOINTS } from "./api/castelinho";

function App() {
  const { login: globalContextLogin } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remerberUser, setRememberUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deferredPrompt: any;

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      // Impede que o navegador mostre o prompt de instalação automaticamente
      e.preventDefault();
      deferredPrompt = e;

      // Mostre um botão para o usuário optar por instalar
      const installButton = document.getElementById("install-button");
      const installBox = document.getElementById("pwa-prompt");
      if (installButton && deferredPrompt && installBox) {
        installBox.style.display = "flex";

        installButton.addEventListener("click", () => {
          // Mostra o prompt de instalação quando o botão é clicado
          deferredPrompt.prompt();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") {
              console.log("Usuário aceitou instalar o PWA");
            } else {
              console.log("Usuário recusou instalar o PWA");
            }
            deferredPrompt = null;
          });
        });
      }
    });
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = await CASTELINHO_API_ENDPOINTS.auth.login(email, password);

    if (data) {
      toaster.create({
        type: "success",
        title: "Bem vindo(a), " + data.data.person.name + ".",
      });
      globalContextLogin(data.data);
    }
    setIsLoading(false);

    if (data) {
      router.push(ROUTES.private[data.data.person.role].dashboard);
    }
  };
  return (
    <Flex
      align="center"
      direction="column"
      justify="center"
      bgColor="principal.solid"
      width="100dvw"
      height="100dvh"
    >
      <Flex
        bgColor="white"
        borderRadius="8px"
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)"
        direction="column"
        padding="10px 20px"
        color="black"
        justify="flex-end"
        position="fixed"
        top="10"
        left="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        width={["80%"]}
        maxW="320px"
        id="pwa-prompt"
        display="none"
      >
        <Image
          alt="appLogo"
          borderRadius="100px"
          bgColor="principal.solid"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          left="2"
          src="/assets/icons/icon-512x512.png"
          width={["50px"]}
        />
        <Flex
          align=""
          justify="center"
          direction="column"
          marginLeft="55px"
          paddingRight={["10px"]}
          width="80%"
        >
          <Text fontSize={["14px", "14px", "16px"]} fontWeight={600}>
            Agenda Castelinho
          </Text>
          <Text color="rgb(50,50,50)" fontSize={["10px", "11px", "13px"]}>
            app.castelinhodosaber.com
          </Text>
          <Button
            alignSelf={["flex-start", "flex-start"]}
            _hover={{ bgColor: "#0056b3" }}
            bgColor="#007bff"
            color="white"
            border="none"
            borderRadius="6px"
            padding={["10px 5px", "10px 15px"]}
            cursor="pointer"
            fontSize={["13px", "14px", "16px"]}
            marginTop="10px"
            fontWeight={600}
            transition="background-color 0.3s"
            id="install-button"
            width={["100%", "auto"]}
          >
            Instalar aplicativo
          </Button>
        </Flex>
      </Flex>
      <Image
        alt="logo"
        src="/assets/icons/icon-512x512.png"
        width={["150px", "180px", "180px", "180px", "200px", "260px"]}
      />
      <Image
        alt="logo"
        src="/assets/images/fonteBranco.png"
        width={["180px", "210px", "210px", "220px", "280px", "400px"]}
      />
      <Stack
        fontSize={["12px", "12px", "14px", "14px"]}
        gap={["2", "2", "4"]}
        marginTop={["20px"]}
      >
        <Field label="Usuário">
          <Input
            border="1px solid white"
            borderRadius={["8px"]}
            size={["xs", "xs", "sm", "sm", "lg"]}
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            variant="outline"
          />
        </Field>
        <Field label="Senha">
          <PasswordInput
            border="1px solid white"
            size={["xs", "xs", "sm", "sm", "lg"]}
            onChange={(ev) => setPassword(ev.target.value)}
            value={password}
            borderRadius={["8px"]}
          />
        </Field>
        <Flex
          align="center"
          gap="8px"
          onClick={() => setRememberUser(!remerberUser)}
          justify="center"
        >
          <Flex
            align="center"
            color="#f97837"
            height="14px"
            justify="center"
            borderRadius="4px"
            width="14px"
            border="2px solid #f97837"
          >
            {remerberUser ? <FaCheck /> : ""}
          </Flex>
          <Text>Lembre-se de mim</Text>
        </Flex>
        <Button
          bgColor="#f97837"
          borderRadius="12px"
          color="white"
          fontSize="18px"
          fontWeight={700}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Entrar
        </Button>
      </Stack>
    </Flex>
  );
}

export default App;
