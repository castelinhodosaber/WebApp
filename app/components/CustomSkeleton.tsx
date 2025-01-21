import { Box, HStack, Stack } from "@chakra-ui/react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

const CustomSkeleton = () => {
  return (
    <Box w={["60%"]}>
      <HStack gap="5">
        <Stack flex="1">
          <SkeletonText
            backgroundColor="secondary.solid"
            opacity="30%"
            noOfLines={1}
            height="5"
          />
          <Skeleton
            height="20"
            backgroundColor="secondary.solid"
            opacity="30%"
          />
          <SkeletonText
            backgroundColor="secondary.solid"
            opacity="30%"
            noOfLines={2}
            height="5"
          />
        </Stack>
      </HStack>
    </Box>
  );
};

export default CustomSkeleton;
