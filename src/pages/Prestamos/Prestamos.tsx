// Prestamos.tsx
import { VStack, Text, Box, Flex, IconButton, Badge, HStack, Button, Spacer } from "@chakra-ui/react";
import { CaretLeft, Plus, Funnel } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";

const Prestamos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get("clienteId");

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" minH="100vh" bg="gray.50">
        <Flex align="center" py={4} px={2} bg="white" borderBottom="1px solid" borderColor="gray.100" position="sticky" top={0} zIndex={10}>
          <IconButton icon={<CaretLeft size={24} weight="bold" />} variant="ghost" onClick={() => navigate("/clientes")} color="#004481" aria-label="Volver" />
          <Text fontSize="lg" fontWeight="bold" color="#004481">Préstamos</Text>
          <Spacer />
        </Flex>

        {clienteId && (
          <Box p={3} bg="blue.50" borderBottom="1px solid" borderColor="blue.100">
            <HStack justifyContent="space-between">
              <Text fontSize="xs" fontWeight="bold" color="#004481">FILTRADO POR CLIENTE #{clienteId}</Text>
              <Button size="xs" variant="ghost" colorScheme="blue" onClick={() => navigate("/prestamos")}>Quitar filtro</Button>
            </HStack>
          </Box>
        )}

        <VStack p={4} spacing={4}>
          {/* Card de Préstamo */}
          <Box w="full" p={5} bg="white" shadow="sm" borderRadius="2xl" border="1px solid" borderColor="gray.100">
            <HStack justifyContent="space-between" mb={2}>
              <Badge colorScheme="green" borderRadius="full" px={2}>AL DÍA</Badge>
              <Text fontSize="xs" color="gray.400">#PR-9928</Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="900" color="#004481">S/ 1,200.00</Text>
            <HStack fontSize="sm" color="gray.600" spacing={1}>
                <Text fontWeight="bold">Cuotas:</Text>
                <Text>4 de 12 pagadas</Text>
            </HStack>
          </Box>
        </VStack>
        <Button
            position="fixed"
            bottom="20px"
            right="20px"
            colorScheme="blue"
            bg="#004481"
            borderRadius="full"
            size="lg"
            leftIcon={<Plus weight="bold" />}
            boxShadow="2xl"
            onClick={() => navigate("/prestamos/nuevo")}
          >
            Nuevo
          </Button>
      </VStack>
    </MainLayout>
  );
};

export default Prestamos;