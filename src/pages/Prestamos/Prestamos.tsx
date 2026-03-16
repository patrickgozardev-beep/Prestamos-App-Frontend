import { useEffect, useState } from "react";
import { VStack, Text, Box, Flex, Badge, HStack, Button, Spacer, Spinner, Center, IconButton, Icon } from "@chakra-ui/react";
import { CaretLeft, House, Plus, Receipt } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import prestamoService from "../../api/prestamoService";
import { formatearFecha } from "../../utils/funciones";

const Prestamos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get("clienteId");

  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = clienteId 
          ? await prestamoService.listarPorCliente(Number(clienteId))
          : await prestamoService.listarPorUsuario();
        setPrestamos(data);
      } catch (error) {
        console.error("Error al cargar préstamos", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [clienteId]);

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" minH="100vh" bg="gray.50">
        <Flex align="center" py={4} px={2} bg="white" borderBottom="1px solid" borderColor="gray.100" position="sticky" top={0} zIndex={10}>
        <Box 
          as="button" 
          onClick={() => navigate(-1)} 
          p={2} 
          borderRadius="md" 
          _hover={{ bg: "gray.100" }} 
          _active={{ bg: "gray.200" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CaretLeft size={24} weight="bold" color="#004481" />
        </Box>
          <Text fontSize="lg" fontWeight="bold" color="#004481">
            {clienteId ? "Préstamos del Cliente" : "Prestamos en General"}
          </Text>
          <Spacer />
          <Flex flex={1} justify="flex-end">
              <IconButton
                icon={<House size={24} weight="duotone" />}
                colorScheme="blue"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                aria-label="Agregar Cliente"
              />
          </Flex>
        </Flex>

        {clienteId && (
          <Box p={3} bg="blue.50" borderBottom="1px solid" borderColor="blue.100">
            <HStack justifyContent="space-between">
              <Text fontSize="xs" fontWeight="bold" color="#004481">FILTRADO POR CLIENTE #{clienteId}</Text>
              <Button size="xs" colorScheme="blue" variant="link" onClick={() => navigate("/prestamos")}>Ver todos</Button>
            </HStack>
          </Box>
        )}

        <VStack p={4} spacing={4} pb={24}>
        {loading ? (
          <Center h="200px">
            <Spinner color="#004481" size="xl" thickness="4px" />
          </Center>
        ) : prestamos.length > 0 ? (
          // LISTA DE PRÉSTAMOS (Si existen)
          prestamos.map((p) => (
            <Box 
              key={p.id} 
              w="full" 
              p={5} 
              bg="white" 
              shadow="sm" 
              borderRadius="2xl" 
              border="1px solid" 
              borderColor="gray.100"
              cursor="pointer"
              _active={{ bg: "gray.50", transform: "scale(0.98)" }}
              transition="0.2s"
              onClick={() => navigate(`/prestamos/${p.id}`)}
            >
              <HStack justifyContent="space-between" mb={2}>
                <Badge colorScheme={p.estado === 'ACTIVO' ? "green" : "gray"} borderRadius="full" px={2}>
                  {p.estado}
                </Badge>
                <Text fontSize="xs" color="gray.400">#PR-{p.id}</Text>
              </HStack>
              
              <Text fontSize="2xl" fontWeight="900" color="#004481">
                S/ {p.monto.toFixed(2)}
              </Text>
              
              <HStack justifyContent="space-between" mt={1}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">Cliente: {p.cliente?.nombres}</Text>
                  <Text fontSize="xs" color="gray.400">Inicio: {formatearFecha(p.fechaInicio)}</Text>
                </VStack>
                <Text fontSize="xs" color="blue.500" fontWeight="bold">Ver cuotas →</Text>
              </HStack>
            </Box>
          ))
        ) : (
          // ESTADO VACÍO (Si no hay préstamos)
          <Center flex={1} py={20} w="full">
            <VStack spacing={4}>
              <Box bg="blue.50" p={6} borderRadius="full">
                {/* Usamos el icono de Receipt o Folder para indicar ausencia de registros */}
                <Icon as={Receipt} size={60} color="#004481" weight="duotone" />
              </Box>
              <VStack spacing={1}>
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                  No hay préstamos
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center" px={10}>
                  {clienteId 
                    ? "Este cliente aún no tiene créditos registrados en el sistema." 
                    : "Aún no has registrado ningún préstamo para hoy."}
                </Text>
              </VStack>
            </VStack>
          </Center>
        )}
        </VStack>

        <Button
          position="fixed" bottom="20px" right="20px" bg="#004481" color="white"
          borderRadius="full" size="lg" leftIcon={<Plus weight="bold" />}
          boxShadow="2xl"
          onClick={() => navigate(clienteId ? `/prestamos/nuevo?clienteId=${clienteId}` : "/prestamos/nuevo")}
        />
      </VStack>
    </MainLayout>
  );
};

export default Prestamos;