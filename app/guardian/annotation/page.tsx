"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useGuardianContext } from "@/app/context/GuardianContext";
import { GuardianAnnotation } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";

import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { toaster } from "@/components/ui/toaster";
import { PaginationPageChangeDetails } from "@ark-ui/react";
import { Button, Flex, HStack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const Annotations = () => {
  const {
    state: { accessToken, date, person },
  } = useGlobalContext();
  const { state: guardianState } = useGuardianContext();
  const createAnnotationDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [annotations, setAnnotations] = useState<GuardianAnnotation[]>([]);
  const [newOrUpdatedAnnotation, setNewOrUpdatedAnnotation] =
    useState<GuardianAnnotation>({
      description: "",
      date: date.iso,
      guardianId: person?.roleId,
      studentId: guardianState?.students[0].id,
    });
  const [pagination, setPagination] = useState<Pagination>({
    limit: 5,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    if (accessToken) {
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .getByGuardian(accessToken, pagination)
        .then((res) => {
          setIsLoading(false);
          if (res?.data) {
            setAnnotations(res.data || []);
            setPagination({ ...pagination, ...res.pagination });
          }
        });
    }
  }, [accessToken]);

  const handleDeleteAnnotation = (annotation: GuardianAnnotation) => {
    if (accessToken) {
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .deleteById(accessToken, annotation.id || 0)
        .then((res) => {
          if (res?.status === 200) {
            toaster.create({
              meta: { closable: true },
              description: res.message,
              type: "success",
            });
            setAnnotations(
              annotations.filter((item) => item.id !== annotation.id)
            );
          }
        });
    }
  };

  const handleSaveNewOrUpdatedAnnotation = () => {
    if (accessToken) {
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .createOrUpdateOne(accessToken, newOrUpdatedAnnotation)
        .then((res) => {
          if (res?.data[1]) {
            setAnnotations([res.data[0], ...annotations]);
          } else if (res?.data[0].id) {
            setAnnotations(
              annotations.map((item) =>
                item.id === res.data[0].id
                  ? { ...item, description: res.data[0].description }
                  : item
              )
            );
          }
          toaster.create({
            meta: { closable: true },
            type: "success",
            description: res?.message,
          });
        });
    }
  };

  const handlePagination = (ev: PaginationPageChangeDetails) => {
    if (accessToken) {
      setIsLoading(true);
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .getByGuardian(accessToken, {
          ...pagination,
          page: ev.page,
        })
        .then((res) => {
          if (res?.status === 204 || res?.data) setIsLoading(false);
          if (res) {
            setAnnotations(res?.data?.length ? res.data : []);
            setPagination({ ...pagination, ...res.pagination });
            setIsLoading(false);
          }
        });
    }
  };

  return (
    <Flex
      align="center"
      direction="column"
      gap={["20px"]}
      minHeight="100dvh"
      maxHeight="100dvh"
      justify="space-between"
      padding={["50px 0 80px 0"]}
      width="100dvw"
    >
      <Text fontSize={["20px"]} fontWeight={[700]}>
        Recados
      </Text>

      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        flex="1" // Permite que o contêiner se ajuste ocupando o restante do espaço disponível
        width="100%"
        overflowY="scroll" // Ativa o scroll vertical automaticamente
      >
        {isLoading ? (
          <>
            <CustomSkeleton />
            <CustomSkeleton />
            <CustomSkeleton />
          </>
        ) : null}
        <DialogRoot
          initialFocusEl={() => createAnnotationDescriptionInputRef.current}
          placement="center"
        >
          <DialogTrigger asChild>
            <Button
              colorPalette="secondary"
              fontWeight={700}
              padding={["2px 6px"]}
              variant="solid"
            >
              Criar novo recado
            </Button>
          </DialogTrigger>
          <DialogContent
            backgroundColor="principal.700"
            padding={["10px 15px"]}
            width={["80%"]}
          >
            <DialogHeader>
              <DialogTitle textAlign="center">
                {newOrUpdatedAnnotation?.id ? "Editar Recado" : "Novo Recado"}
              </DialogTitle>
            </DialogHeader>
            <DialogBody p={["14px 0"]}>
              <Flex direction="column" justify="center" align="center" gap="4">
                <Textarea
                  minH={["150px"]}
                  height={["150px"]}
                  maxH={["150px"]}
                  onChange={(ev) =>
                    setNewOrUpdatedAnnotation({
                      ...newOrUpdatedAnnotation,
                      description: (ev.target as HTMLTextAreaElement).value,
                    })
                  }
                  padding={["5px 8px"]}
                  placeholder="Escreva seu recado"
                  ref={createAnnotationDescriptionInputRef}
                />
                <Text textAlign={"left"} width={["100%"]}>
                  Recado para:
                </Text>
                <RadioGroup
                  value={newOrUpdatedAnnotation.studentId?.toString()}
                  onValueChange={(e) =>
                    setNewOrUpdatedAnnotation({
                      ...newOrUpdatedAnnotation,
                      studentId: +e.value,
                    })
                  }
                  defaultValue="1"
                  width={["100%"]}
                >
                  <HStack gap="6">
                    {guardianState?.students.map((item, index) => (
                      <Radio key={index} value={item.id?.toString() || "1"}>
                        {item.name.split(" ")[0]}
                      </Radio>
                    ))}
                  </HStack>
                </RadioGroup>
              </Flex>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button
                  fontWeight={700}
                  variant="solid"
                  colorPalette="white"
                  padding={["2px 5px"]}
                >
                  Cancelar
                </Button>
              </DialogActionTrigger>
              <DialogActionTrigger asChild>
                <Button
                  fontWeight={700}
                  colorPalette="secondary"
                  onClick={handleSaveNewOrUpdatedAnnotation}
                  padding={["2px 5px"]}
                >
                  {newOrUpdatedAnnotation.id ? "Atualizar" : "Salvar"}
                </Button>
              </DialogActionTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
        {annotations.length || isLoading ? null : (
          <Text>Nenhum recado encontrado.</Text>
        )}
        {isLoading
          ? null
          : annotations?.map((annotation, index) => (
              <Flex
                align="center"
                backgroundColor="secondary.50"
                border="2px solid #f97837"
                borderRadius="6px"
                justify="center"
                direction="column"
                shrink={0}
                key={index}
                overflow="hidden"
                width={["90%", "90%", "90%", "85%"]}
              >
                <Flex
                  align="flex-start"
                  color="principal.solid"
                  direction="column"
                  justify="center"
                  padding="5px 20px"
                  width="100%"
                >
                  <Text minH={["60px"]} marginBottom={["20px"]}>
                    {annotation.description}
                  </Text>
                  <Text alignSelf="flex-start" fontSize={["14px"]}>
                    Criança: {annotation.student?.name}
                  </Text>
                  <Text alignSelf="flex-start" fontSize={["14px"]}>
                    Criado por:{" "}
                    {annotation.guardianId === guardianState?.id
                      ? "Você"
                      : annotation.guardian?.name}
                  </Text>
                  <Text alignSelf="flex-start" fontSize={["14px"]}>
                    Data:{" "}
                    {new Date(annotation.date).toLocaleDateString("pt-BR")}
                  </Text>
                  {annotation.guardianId === guardianState?.id ? (
                    <Flex
                      alignItems="center"
                      fontSize={["13px"]}
                      gap="20px"
                      margin={["15px 0 0"]}
                      justifyContent="center"
                      width="100%"
                    >
                      <Button
                        borderRadius={["6px"]}
                        colorPalette="secondary"
                        fontWeight={700}
                        onClick={() => handleDeleteAnnotation(annotation)}
                        width={["40%"]}
                      >
                        Apagar
                      </Button>
                    </Flex>
                  ) : null}
                </Flex>
              </Flex>
            ))}
      </Flex>
      <PaginationRoot
        page={pagination.page}
        count={pagination.total || 0}
        pageSize={pagination.limit}
        onPageChange={(ev) => handlePagination(ev)}
      >
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Flex>
  );
};

export default Annotations;
