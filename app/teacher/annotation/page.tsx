"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useTeacherContext } from "@/app/context/TeacherContext";
import { GuardianAnnotation } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";
import capitalize from "@/app/utils/capitalize";
import debounce from "@/app/utils/debounce";
import formatRelationship from "@/app/utils/formatRelationship";
import { Field } from "@/components/ui/field";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { PaginationPageChangeDetails } from "@ark-ui/react";
import { Flex, HStack, Input, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const Annotations = () => {
  const {
    state: { accessToken },
  } = useGlobalContext();
  const {
    state: { selectedClass },
  } = useTeacherContext();

  const [isLoading, setIsLoading] = useState(false);
  const [annotations, setAnnotations] = useState<GuardianAnnotation[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 5,
    page: 1,
    total: 0,
  });

  const handleSearch = useCallback(
    debounce((search: string) => {
      console.log(search);
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .getByClassId(
          accessToken || "",
          selectedClass?.id || 0,
          pagination,
          search
        )
        .then((res) => {
          setIsLoading(false);
          if (res) {
            console.log(res);
            setAnnotations(res.data);
            setPagination({ ...pagination, ...res.pagination });
          } else {
            setAnnotations([]);
            setPagination({ page: 1, total: 1, limit: 10 });
          }
        });
    }, 1000),
    []
  );

  useEffect(() => {
    if (selectedClass && accessToken) {
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .getByClassId(accessToken, selectedClass.id, pagination)
        .then((res) => {
          if (res) {
            setAnnotations(res.data);
            setPagination({ ...pagination, ...res.pagination });
          }
        });
    }
  }, [accessToken, selectedClass]);

  const handlePagination = (ev: PaginationPageChangeDetails) => {
    if (accessToken && selectedClass?.id) {
      CASTELINHO_API_ENDPOINTS.guardianAnnotation
        .getByClassId(accessToken, selectedClass.id, {
          ...pagination,
          page: ev.page,
        })
        .then((res) => {
          if (res) {
            setAnnotations(res.data);
            setPagination({ ...pagination, ...res.pagination });
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
        Recados - {selectedClass?.name}
      </Text>

      <Flex
        align="center"
        direction="column"
        gap={["20px"]}
        flex="1" // Permite que o contêiner se ajuste ocupando o restante do espaço disponível
        width="100%"
        overflowY="scroll" // Ativa o scroll vertical automaticamente
      >
        <Flex>
          <Field helperText="Procure pelo nome do responsável ou da criança.">
            <Input
              onChange={(ev) => {
                setIsLoading(true);
                handleSearch(ev.target.value);
              }}
              placeholder="Digite aqui sua pesquisa"
            />
          </Field>
        </Flex>
        {isLoading ? (
          <>
            <CustomSkeleton />
            <CustomSkeleton />
            <CustomSkeleton />
          </>
        ) : null}
        {annotations.length || isLoading ? null : (
          <Text>Nenhum resultado encontrado.</Text>
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
                        annotation.guardian?.gender,
                        annotation.relationship
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
