import { VStack, Text, Box, Flex, IconButton, Button, SimpleGrid, Divider, HStack, useToast, Center } from "@chakra-ui/react";
import { CaretLeft, Trash, PencilLine, MapPin, DeviceMobile, Spinner } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Cliente } from "../../types/Cliente";
import clienteService from "../../api/clienteService";

const DetalleCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar los datos al entrar a la pantalla
  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await clienteService.obtenerPorId(Number(id));
        setCliente(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo obtener la información del cliente",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/clientes"); // Si no existe, lo regresamos a la lista
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate, toast]);

  // Si está cargando, mostramos un spinner centrado estilo BBVA
  if (loading) {
    return (
      <MainLayout>
        <Center h="80vh">
          <Spinner  speed="0.65s"  color="#004481" size="xl" />
        </Center>
      </MainLayout>
    );
  }

  return (
<MainLayout>
      <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
        {/* Header de Navegación */}
        <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
          <IconButton 
            icon={<CaretLeft size={24} weight="bold" />} 
            variant="ghost" 
            onClick={() => navigate("/clientes")} 
            color="#004481" 
            aria-label="Volver" 
          />
          <Text fontSize="lg" fontWeight="bold" color="#004481">Perfil del Cliente</Text>
        </Flex>

        <Box p={6}>
          <VStack align="start" spacing={6}>
            {/* Campo Nombres */}
            <Box>
              <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest">NOMBRES</Text>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                {cliente?.nombres}
              </Text>
            </Box>

            {/* Grid de DNI y Teléfono */}
            <SimpleGrid columns={2} w="full" spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest">DNI</Text>
                <Text fontWeight="medium" color="gray.600">{cliente?.dni}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest">TELÉFONO</Text>
                <Text fontWeight="medium" color="gray.600">
                  {cliente?.telefono || "No registrado"}
                </Text>
              </Box>
            </SimpleGrid>

            <Divider />

            {/* Botón de Google Maps Condicional */}
            {cliente?.googleMapsLink && (
              <Button 
                leftIcon={<MapPin weight="fill" />} 
                variant="link" 
                color="#004481" 
                size="sm"
                onClick={() => window.open(cliente.googleMapsLink, "_blank")}
              >
                Ver Ubicación en Maps
              </Button>
            )}

            {/* Acciones de Edición/Eliminación */}
            <HStack w="full" pt={10} spacing={4}>
              <Button 
                flex={1} 
                leftIcon={<PencilLine />} 
                colorScheme="blue" 
                variant="outline" 
                borderRadius="md"
                _hover={{ bg: "blue.50" }}
              >
                Editar
              </Button>
              <Button 
                flex={1} 
                leftIcon={<Trash />} 
                colorScheme="red" 
                variant="ghost" 
                borderRadius="md"
              >
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