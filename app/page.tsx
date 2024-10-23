"use client";
import { useEffect } from "react";
import { Button, Flex, Image, Text } from "@chakra-ui/react";

function App() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deferredPrompt: any;

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      // Impede que o navegador mostre o prompt de instalação automaticamente
      e.preventDefault();
      console.log(e);
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
      >
        <Image
          alt="appLogo"
          bgColor="#031436"
          borderRadius="100px"
          position="absolute"
          top="2"
          left="3"
          src="/assets/icons/icon-512x512.png"
          width={["50px"]}
        />
        <Flex align="" justify="center" direction="column" width="80%">
          <Text>Agenda Castelinho</Text>
          <Text>app.castelinhodosaber.com</Text>
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
            Adicionar
          </Button>
        </Flex>
      </Flex>
      <Image
        alt="logo"
        src="/assets/icons/icon-512x512.png"
        width={["80%", "80%", "300px"]}
      />
      <Image
        alt="logo"
        src="/assets/images/fonteBranco.png"
        width={["80%", "80%", "300px"]}
      />
    </Flex>
  );
}

export default App;
