import { VStack, Text, Box, Flex, IconButton, Button, SimpleGrid, Divider, HStack } from "@chakra-ui/react";
import { CaretLeft, Trash, PencilLine, MapPin, DeviceMobile } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

const DetalleCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
        <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
          <IconButton icon={<CaretLeft size={24} weight="bold" />} variant="ghost" onClick={() => navigate("/clientes")} color="#004481" aria-label="Volver" />
          <Text fontSize="lg" fontWeight="bold" color="#004481">Perfil del Cliente</Text>
        </Flex>

        <Box p={6}>
          <VStack align="start" spacing={6}>
            <Box>
              <Text fontSize="xs" color="gray.500" fontWeight="bold">NOMBRES</Text>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">Juan Pérez</Text>
            </Box>

            <SimpleGrid columns={2} w="full" spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">DNI</Text>
                <Text fontWeight="medium">72635489</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">TELÉFONO</Text>
                <Text fontWeight="medium">+51 987654321</Text>
              </Box>
            </SimpleGrid>

            <Divider />

            <Button leftIcon={<MapPin weight="fill" />} variant="link" color="#004481" size="sm">
              Ver Ubicación en Maps
            </Button>

            <HStack w="full" pt={10} spacing={4}>
              <Button flex={1} leftIcon={<PencilLine />} colorScheme="blue" variant="outline" borderRadius="none">
                Editar
              </Button>
              <Button flex={1} leftIcon={<Trash />} colorScheme="red" variant="ghost" borderRadius="none">
                Eliminar
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </MainLayout>
  );
};
export default DetalleCliente;