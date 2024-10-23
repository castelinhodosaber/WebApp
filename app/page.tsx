"use client";
import { useEffect } from "react";
import { Button, Flex, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

function App() {
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

  return (
    <Flex
      align="center"
      direction="column"
      justify="center"
      bgColor="#031436"
      width="100vw"
      height="100vh"
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
          bgColor="#031436"
          borderRadius="100px"
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
          width="80%"
        >
          <Text fontSize={["16px"]} fontWeight={600}>
            Agenda Castelinho
          </Text>
          <Text color="rgb(50,50,50)" fontSize={["13px"]}>
            app.castelinhodosaber.com
          </Text>
          <Button
            _hover={{ bgColor: "#0056b3" }}
            bgColor="#007bff"
            color="white"
            border="none"
            borderRadius="6px"
            padding="10px 15px"
            cursor="pointer"
            fontSize={["16px"]}
            marginTop="10px"
            transition="background-color 0.3s"
            id="install-button"
          >
            Instalar aplicativo
          </Button>
        </Flex>
      </Flex>
      <Image
        alt="logo"
        src="/assets/icons/icon-512x512.png"
        width={["60%", "60%", "300px"]}
      />
      <Image
        alt="logo"
        src="/assets/images/fonteBranco.png"
        width={["60%", "60%", "300px"]}
      />
      <Stack gap="10" width="70%">
        <Field label="E-mail">
          <Input
            border="1px solid white"
            borderRadius="12px"
            variant="outline"
          />
        </Field>
        <Field label="Senha">
          <PasswordInput border="1px solid white" borderRadius="12px" />
        </Field>
        <Flex align="center" gap="8px" justify="center">
          <Flex
            height="14px"
            borderRadius="4px"
            width="14px"
            bgColor="#f97837"
          />
          <Text>Lembre-se de mim</Text>
        </Flex>
        <Button
          bgColor="#f97837"
          borderRadius="12px"
          color="white"
          fontSize="18px"
          fontWeight={700}
        >
          Entrar
        </Button>
      </Stack>
    </Flex>
  );
}

export default App;
