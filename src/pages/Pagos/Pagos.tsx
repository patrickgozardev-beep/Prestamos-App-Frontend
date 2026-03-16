import { 
    VStack, Box, Text, HStack, IconButton, Flex, 
    Center, Spinner, Badge
  } from "@chakra-ui/react";
  import { CaretLeft, Receipt } from "phosphor-react";
  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import MainLayout from "../../layouts/MainLayout";
  import pagoService from "../../api/pagosService"; 
  
  const Pagos = () => {
    // 1. Asegúrate de que este nombre coincida con tu ruta: /pago/cuota/:cronogramaId
    const { cronogramaId } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pagos, setPagos] = useState<any[]>([]);
  
    useEffect(() => {
      const fetchPagos = async () => {
        if (!cronogramaId) return;
        try {
          setLoading(true);
          // 2. Llamamos al servicio con el ID de la URL
          const data = await pagoService.listarPorCuota(Number(cronogramaId));
          setPagos(data);
        } catch (error) {
          console.error("Error al cargar pagos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPagos();
    }, [cronogramaId]);
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" bg="gray.50" minH="100vh" w="full">
          
          {/* Header */}
          <Flex align="center" py={4} px={2} bg="white" shadow="sm">
            <IconButton 
              icon={<CaretLeft size={24} />} 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              color="#004481" 
              aria-label="Volver"
            />
            <VStack align="start" spacing={0} ml={2}>
              <Text fontSize="lg" fontWeight="bold" color="#004481">Historial de Cobros</Text>
              {/* Mostramos el ID del cronograma como referencia rápida */}
              <Text fontSize="xs" color="gray.500">ID Cronograma: #{cronogramaId}</Text>
            </VStack>
          </Flex>
  
          {loading ? (
            <Center mt={10}><Spinner color="#004481" size="xl" /></Center>
          ) : (
            <VStack p={4} spacing={3} align="stretch">
              {pagos.length === 0 ? (
                <Center flexDirection="column" mt={10}>
                  <Receipt size={48} weight="light" color="#CBD5E0" />
                  <Text color="gray.500" mt={2}>No se encontraron pagos para esta cuota</Text>
                </Center>
              ) : (
                pagos.map((pago) => (
                  <Box 
                    key={pago.id} 
                    w="full" 
                    bg="white" 
                    p={4} 
                    borderRadius="xl" 
                    shadow="sm"
                    border="1px solid"
                    borderColor="gray.50"
                    onClick={() => navigate(`/pago/detalle/${pago.id}`)}
                    _active={{ bg: "gray.50" }}
                    cursor="pointer"
                  >
                    <HStack justify="space-between">
                      <HStack spacing={4}>
                        <Center bg="blue.50" p={3} borderRadius="full">
                          <Receipt size={22} color="#004481" weight="fill" />
                        </Center>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="800" fontSize="md" color="gray.700">
                            S/ {pago.monto.toFixed(2)}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {pago.fechaPago}
                          </Text>
                        </VStack>
                      </HStack>
                      
                      <VStack align="end" spacing={1}>
                        <Badge 
                          variant="subtle" 
                          colorScheme="blue" 
                          borderRadius="md" 
                          px={2}
                          fontSize="10px"
                        >
                          {pago.metodo}
                        </Badge>
                        <Text fontSize="10px" color="gray.400">ID #{pago.id}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          )}
        </VStack>
      </MainLayout>
    );
  };
  
  export default Pagos;