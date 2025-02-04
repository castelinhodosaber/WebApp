"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useGuardianContext } from "@/app/context/GuardianContext";
import { GuardianAnnotation } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";
import capitalize from "@/app/utils/capitalize";

import formatRelationship from "@/app/utils/formatRelationship";
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
import { PaginationPageChangeDetails } from "@ark-ui/react";
import { Button, Flex, HStack, Input, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const Annotations = () => {
  const {
    state: { accessToken, date, person },
  } = useGlobalContext();
  const { state: guardianState } = useGuardianContext();
  const createAnnotationDescriptionInputRef = useRef<HTMLInputElement>(null);
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
          if (res?.status === 204 || res?.data) setIsLoading(false);
          if (res) {
            setAnnotations(res?.data || []);
            setPagination({ ...pagination, ...res.pagination });
          }
        });
    }
  }, [accessToken]);

  const handleSaveNewOrUpdatedAnnotation = () => {};

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
            setAnnotations(res?.data || []);
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
          <DialogContent width={["80%"]}>
            <DialogHeader>
              <DialogTitle>
                {newOrUpdatedAnnotation?.id ? "Editar Recado" : "Novo Recado"}
              </DialogTitle>
            </DialogHeader>
            <DialogBody pb="4">
              <Flex direction="column" justify="center" align="center" gap="4">
                <Input
                  onClick={(ev) =>
                    setNewOrUpdatedAnnotation({
                      ...newOrUpdatedAnnotation,
                      description: (ev.target as HTMLInputElement).value,
                    })
                  }
                  placeholder="Escreva seu recado"
                  ref={createAnnotationDescriptionInputRef}
                />
                <RadioGroup
                  value={newOrUpdatedAnnotation.studentId?.toString()}
                  onValueChange={(e) =>
                    setNewOrUpdatedAnnotation({
                      ...newOrUpdatedAnnotation,
                      studentId: +e.value,
                    })
                  }
                  defaultValue="1"
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
                <Button variant="outline" colorPalette="principal">
                  Cancelar
                </Button>
              </DialogActionTrigger>
              <Button
                colorPalette="secondary"
                onClick={handleSaveNewOrUpdatedAnnotation}
              >
                {newOrUpdatedAnnotation.id ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
        {annotations.length || isLoading ? null : (
          <Text>Nenhum recado encontrado.</Text>
        )}
        {isLoading
          ? null
          : annotations.map((annotation, index) => (
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
                  align="center"
                  backgroundColor="secondary.solid"
                  fontWeight={700}
                  justify="center"
                  wrap="wrap"
                  width="100%"
                >
                  <Text>
                    {`${annotation.guardian?.name.split(" ")[0]} - ${capitalize(
                      formatRelationship(
                        annotation.guardian?.gender || "female",
                        annotation.relationship || "parent"
                      )
                    )} d${annotation.student?.gender === "male" ? "o" : "a"} ${
                      annotation.student?.name
                    }`}
                  </Text>
                </Flex>
                <Flex
                  align="flex-start"
                  color="principal.solid"
                  direction="column"
                  justify="center"
                  padding="5px 20px"
                  width="100%"
                >
                  <Text>Recado: {annotation.description}</Text>
                  <Text alignSelf="flex-start">
                    Data:{" "}
                    {new Date(annotation.date).toLocaleDateString("pt-BR")}
                  </Text>
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
