"use client";
import { CASTELINHO_API_ENDPOINTS } from "@/app/api/castelinho";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { Announcement } from "@/app/types/api/castelinho";
import Pagination from "@/app/types/api/castelinho/pagination";
import { Flex, HStack, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PaginationPageChangeDetails } from "@ark-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import CustomSkeleton from "@/app/components/CustomSkeleton";
const Announcements = () => {
  const {
    state: { accessToken },
  } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [annoucements, setAnnouncements] = useState<Announcement[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 5,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    if (accessToken) {
      CASTELINHO_API_ENDPOINTS.announcement
        .getAllAnnouncement(accessToken, pagination)
        .then((res) => {
          if (res) {
            setAnnouncements(res.data);
            setPagination({ ...pagination, ...res.pagination });
          }
        });
    }
  }, [accessToken]);

  const handlePagination = (ev: PaginationPageChangeDetails) => {
    if (accessToken) {
      setIsLoading(true);
      CASTELINHO_API_ENDPOINTS.announcement
        .getAllAnnouncement(accessToken, {
          ...pagination,
          page: ev.page,
        })
        .then((res) => {
          if (res) {
            setAnnouncements(res.data);
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
      maxHeight="100dvh" // Use "maxHeight" para consistência
      justify="space-between"
      padding={["50px 0 80px 0"]}
      width="100dvw"
    >
      <Text fontSize={["20px"]} fontWeight={[700]}>
        Comunicados
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
        {annoucements.length || isLoading ? null : (
          <Text>Nenhum resultado encontrado.</Text>
        )}
        {isLoading
          ? null
          : annoucements.map((annoucement, index) => (
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
                  <Text>{`${annoucement.title} - ${new Date(
                    annoucement.date
                  ).toLocaleDateString("pt-BR")}`}</Text>
                </Flex>
                <Flex
                  align="flex-start"
                  color="principal.solid"
                  direction="column"
                  justify="center"
                  padding="5px 20px"
                  width="100%"
                >
                  <Text>{annoucement.description}</Text>
                  {annoucement.photo ? (
                    <Image src={annoucement.photo} alt="announcementPhoto" />
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

export default Announcements;
