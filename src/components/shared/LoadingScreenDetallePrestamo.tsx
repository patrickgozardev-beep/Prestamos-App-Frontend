import { 
    VStack, Box, Skeleton, SkeletonCircle, SkeletonText, 
    HStack, Flex, Center, 
    Spacer,
    SimpleGrid
  } from "@chakra-ui/react";
import MainLayout from "../../layouts/MainLayout";
  
  interface LoadingScreenProps {
    type?: 'detalle' | 'lista' | 'simple' | 'dashboard';
  }
  
  const LoadingScreen = ({ type = 'detalle' }: LoadingScreenProps) => {
    // Skeleton para la vista de Detalle de Préstamo
    if (type === 'detalle') {
      return (
        <MainLayout>
        <VStack spacing={0} align="stretch" bg="gray.50" minH="100vh" w="full">
          {/* Header Skeleton */}
          <Flex align="center" py={4} px={4} bg="white">
            <SkeletonCircle size="10" />
            <VStack align="start" spacing={2} ml={3} flex={1}>
              <Skeleton h="20px" w="150px" />
              <Skeleton h="12px" w="100px" />
            </VStack>
          </Flex>
  
          {/* Card Principal Skeleton */}
          <Box px={4} py={6} bg="white" borderBottomRadius="3xl" shadow="sm">
            <Skeleton h="160px" borderRadius="2xl" mb={6} />
            <HStack spacing={6} px={2}>
              <Skeleton h="40px" flex={1} />
              <Skeleton h="40px" flex={1} />
              <Skeleton h="40px" flex={1} />
            </HStack>
          </Box>
  
          {/* Lista de Cuotas Skeleton */}
          <VStack align="stretch" p={4} spacing={4}>
            <Skeleton h="20px" w="120px" mb={2} />
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} bg="white" p={4} borderRadius="xl" shadow="xs">
                <HStack justifyContent="space-between">
                  <HStack spacing={3}>
                    <Skeleton h="40px" w="40px" borderRadius="lg" />
                    <VStack align="start" spacing={2}>
                      <Skeleton h="15px" w="80px" />
                      <Skeleton h="10px" w="60px" />
                    </VStack>
                  </HStack>
                  <VStack align="end" spacing={2}>
                    <Skeleton h="18px" w="60px" />
                    <Skeleton h="12px" w="40px" />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </VStack>
        </MainLayout>
      );
    }
    if(type === 'dashboard'){
        return (
          <MainLayout>
            <VStack spacing={6} align="stretch" w="full" pb={10} p={4}>
              
              {/* Superior: Saludo y Notificaciones */}
              <Flex align="center">
                <Box>
                  <Skeleton h="14px" w="80px" mb={2} />
                  <Skeleton h="24px" w="140px" />
                </Box>
                <Spacer />
                <HStack spacing={4}>
                  <SkeletonCircle size="6" />
                  <SkeletonCircle size="10" />
                </HStack>
              </Flex>
        
              {/* Tarjeta Principal de Cartera (Azul) */}
              <Box p={5} borderRadius="2xl" border="1px solid" borderColor="gray.100" shadow="sm">
                <VStack align="start" spacing={3}>
                  <Skeleton h="10px" w="120px" />
                  <Skeleton h="35px" w="180px" />
                  <Skeleton h="10px" w="150px" />
                </VStack>
              </Box>
        
              {/* Sección de Accesos Directos */}
              <Box>
                <Skeleton h="14px" w="150px" mb={5} />
                <SimpleGrid columns={3} spacing={4}>
                  {[1, 2, 3].map((i) => (
                    <VStack key={i}>
                      <SkeletonCircle size="60px" />
                      <Skeleton h="10px" w="50px" />
                    </VStack>
                  ))}
                </SimpleGrid>
              </Box>
        
              {/* Próximos Cobros */}
              <Box pt={4}>
                <HStack justifyContent="space-between" mb={4}>
                  <Skeleton h="14px" w="130px" />
                  <Skeleton h="12px" w="60px" />
                </HStack>
        
                <VStack spacing={3}>
                  {[1, 2, 3].map((i) => (
                    <HStack 
                      key={i}
                      w="full" 
                      p={4} 
                      bg="white" 
                      borderRadius="xl" 
                      border="1px solid" 
                      borderColor="gray.50"
                      justifyContent="space-between"
                    >
                      <HStack spacing={3}>
                        <SkeletonCircle size="3" />
                        <VStack align="start" spacing={2}>
                          <Skeleton h="14px" w="100px" />
                          <Skeleton h="10px" w="70px" />
                        </VStack>
                      </HStack>
                      <Skeleton h="16px" w="60px" />
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </MainLayout>

          );
    }

  
    // Skeleton simple para formularios o listas cortas
    return (
        <MainLayout>
        <VStack spacing={4} w="80%">
          <SkeletonCircle size="20" />
          <SkeletonText noOfLines={4} spacing="4" skeletonHeight="2" w="full" />
        </VStack>
        </MainLayout>
    );
  };
  
  export default LoadingScreen;