"use client";
import { useEffect } from "react";
import { Button, Flex, Image } from "@chakra-ui/react";

function App() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deferredPrompt: any; // Explicitamente declarado como 'any'

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      // Impede que o navegador mostre o prompt de instalação automaticamente
      e.preventDefault();
      deferredPrompt = e;

      // Mostre um botão para o usuário optar por instalar
      const installButton = document.getElementById("install-button");
      if (installButton && deferredPrompt) {
        installButton.style.display = "block";

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
      <Button
        id="install-button"
        position="absolute"
        top="1"
        style={{ display: "none" }}
      >
        Instalar PWA
      </Button>
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
