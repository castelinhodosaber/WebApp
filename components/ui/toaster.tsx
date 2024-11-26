"use client";
import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster
        alignItems="center"
        display="flex"
        toaster={toaster}
        insetInline={{ mdDown: "2rem" }}
        width={["90vw"]}
        bottom={["80px !important"]}
      >
        {(toast) => (
          <Toast.Root
            alignItems="center"
            display="flex"
            padding={["20px 10px"]}
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator marginLeft={["20px !important"]} />
            )}
            <Stack align="flex-start" display="flex" gap="1" justify="center">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
