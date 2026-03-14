import { 
  VStack, Text, Box, HStack, Circle, Flex, Spacer, 
  Button, SimpleGrid, useToast,
  Center
} from "@chakra-ui/react";
import { Users, Coins, ChartPieSlice, SignOut, CaretRight, Bell, CalendarBlank } from "phosphor-react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import prestamoService from "../api/prestamoService";
import LoadingScreen from "../components/shared/LoadingScreenDetallePrestamo";
import type { MetricasDashboardDTO } from "../types/MetricasDashboard";
import type { CronogramaDetalladoDTO } from "../types/CronogramaPago";
import cronogramaService from "../api/cronogramaPagoService";
import { formatearFecha } from "../utils/funciones";

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState<MetricasDashboardDTO | null>(null);
  const [proximos, setProximos] = useState<CronogramaDetalladoDTO[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dataMetricas, dataProximos] = await Promise.all([
        prestamoService.getMetricasDashboard(),
        cronogramaService.obtenerProximosCobros()
      ]);
      setMetricas(dataMetricas);
      setProximos(dataProximos);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
      toast({
        title: "Error de sincronización",
        description: "Revisa tu conexión al servidor.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <LoadingScreen type="dashboard" />;

  return (
    <MainLayout>
      <VStack spacing={6} align="stretch" w="full" pb={10}>
        
        {/* Superior: Saludo y Notificaciones */}
        <Flex align="center" px={2}>
          <Box>
            <Text fontSize="sm" color="gray.500">Hola, Steve</Text>
            <Text fontSize="xl" fontWeight="900" color="#004481">GOZAR CAPITAL</Text>
          </Box>
          <Spacer />
          <HStack spacing={4}>
            <Bell size={24} color="#004481" weight="bold" />
            <Circle size="40px" bg="blue.50">
              <Text fontWeight="bold" color="#004481">S</Text>
            </Circle>
          </HStack>
        </Flex>

        {/* Banner Deslizable de Métricas (Estilo BBVA) */}
        <Box 
          bg="#004481" 
          p={5} 
          borderRadius="2xl" 
          color="white" 
          shadow="xl"
          position="relative"
          overflow="hidden"
        >
          <Flex 
            overflowX="auto" 
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            {/* Slide 1: Capital en la Calle */}
            <VStack align="start" minW="full" spacing={1} scrollSnapAlign="start">
              <Text fontSize="xs" fontWeight="bold" opacity={0.8}>CAPITAL EN LA CALLE</Text>
              <Text fontSize="3xl" fontWeight="bold">S/ {metricas?.capitalVivo?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
              <Text fontSize="xs" opacity={0.7}>Monto neto entregado</Text>
            </VStack>

            {/* Slide 2: Intereses/Ganancias */}
            <VStack align="start" minW="full" spacing={1} scrollSnapAlign="start">
              <Text fontSize="xs" fontWeight="bold" opacity={0.8} color="orange.200">GANANCIAS PROYECTADAS</Text>
              <Text fontSize="3xl" fontWeight="bold">S/ {metricas?.interesesPendientes?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
              <Text fontSize="xs" opacity={0.7}>Intereses totales por cobrar</Text>
            </VStack>

            {/* Slide 3: Monto Recuperado */}
            <VStack align="start" minW="full" spacing={1} scrollSnapAlign="start">
              <Text fontSize="xs" fontWeight="bold" opacity={0.8} color="green.200">MONTO RECUPERADO</Text>
              <Text fontSize="3xl" fontWeight="bold">S/ {metricas?.montoRecuperado?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
              <Text fontSize="xs" opacity={0.7}>Dinero que ya regresó a caja</Text>
            </VStack>
          </Flex>

          {/* Indicadores de Scroll (Dots) */}  
          <HStack justify="center" mt={4} spacing={2}>
            <Circle size="6px" bg="white" />
            <Circle size="6px" bg="whiteAlpha.400" />
            <Circle size="6px" bg="whiteAlpha.400" />
          </HStack>

          {/* Adorno visual */}
          <Circle position="absolute" right="-20px" bottom="-20px" size="100px" bg="whiteAlpha.100" />
        </Box>

        {/* Sección de Accesos Directos */}
        <Text fontSize="sm" fontWeight="bold" color="gray.600" px={2}>OPERACIONES FRECUENTES</Text>
        <SimpleGrid columns={3} spacing={4} px={2}>
          <VStack onClick={() => navigate("/clientes")} cursor="pointer">
            <Circle size="60px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100">
              <Users size={28} color="#004481" weight="duotone" />
            </Circle>
            <Text fontSize="xs" fontWeight="bold" color="#004481">Clientes</Text>
          </VStack>

          <VStack onClick={() => navigate("/prestamos")} cursor="pointer">
            <Circle size="60px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100">
              <Coins size={28} color="#004481" weight="duotone" />
            </Circle>
            <Text fontSize="xs" fontWeight="bold" color="#004481">Préstamos</Text>
          </VStack>

          <VStack onClick={() => navigate("/metricas")} cursor="pointer">
            <Circle size="60px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100">
              <ChartPieSlice size={28} color="#004481" weight="duotone" />
            </Circle>
            <Text fontSize="xs" fontWeight="bold" color="#004481">Métricas</Text>
          </VStack>
        </SimpleGrid>

        {/* Lista de Próximos Cobros (Hardcoded por ahora) */}
{/* SECCIÓN DINÁMICA: PRÓXIMOS COBROS */}
        <Box px={2} pt={4}>
          <HStack justifyContent="space-between" mb={4}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600">PRÓXIMOS COBROS</Text>
            {proximos.length > 0 && (
              <Text 
                fontSize="xs" color="#004481" fontWeight="bold" cursor="pointer"
                onClick={() => navigate("/prestamos")} // O filtrar por IDs
              >
                Ver todos
              </Text>
            )}
          </HStack>

          {proximos.length > 0 ? (
            <VStack spacing={3}>
              {proximos.slice(0, 4).map((cobro) => (
                <HStack 
                key={cobro.id} 
                w="full" 
                p={4} 
                bg="white" 
                borderRadius="xl" 
                shadow="sm" 
                border="1px solid"
                borderColor="gray.100"
                justifyContent="space-between" 
                cursor="pointer"
                onClick={() => navigate(`/prestamos/${cobro.prestamoId}`)}
                _hover={{ shadow: "md", borderColor: "blue.100" }}
                _active={{ transform: "scale(0.98)", bg: "gray.50" }}
                transition="all 0.2s"
              >
                <HStack spacing={4} flex={1}>
                  {/* Indicador de estado más visual */}
                  <Circle 
                    size="12px" 
                    bg={cobro.estado === 'PARCIAL' ? "orange.400" : "teal.400"} 
                    boxShadow="0 0 8px rgba(0,0,0,0.1)"
                  />
                  
                  <VStack align="start" spacing={0} flex={1}>
                    {/* NOMBRE DEL CLIENTE: Ahora es lo primero que se lee */}
                    <Text 
                      fontSize="sm" 
                      fontWeight="extrabold" 
                      color="gray.800" 
                      noOfLines={1}
                      textTransform="uppercase"
                      letterSpacing="tight"
                    >
                      {cobro.nombreCliente}
                    </Text>
                    
                    {/* Detalles secundarios en una sola línea */}
                    <HStack spacing={2} color="gray.500" fontSize="xs">
                      <Text fontWeight="medium">Cuota #{cobro.numeroCuota}</Text>
                      <Text>•</Text>
                      <Text>Vence {formatearFecha(cobro.fechaVencimiento)}</Text>
                    </HStack>
                  </VStack>
                </HStack>
        
                <HStack spacing={3}>
                  <VStack align="end" spacing={0}>
                    <Text fontWeight="800" color="#004481" fontSize="md">
                      S/ {cobro.monto.toFixed(2)}
                    </Text>
                    {cobro.montoPagado > 0 && (
                      <Text fontSize="10px" color="orange.500" fontWeight="bold">
                        Faltan: S/ {cobro.montoPendiente.toFixed(2)}
                      </Text>
                    )}
                  </VStack>
                  <CaretRight size={18} weight="bold" color="gray.300" />
                </HStack>
              </HStack>
              ))}
            </VStack>
          ) : (
            /* ESTADO VACÍO ELEGANTE */
            <Center p={8} bg="gray.50" borderRadius="2xl" border="2px dashed" borderColor="gray.200">
              <VStack spacing={2}>
                <CalendarBlank size={32} color="#CBD5E0" weight="light" />
                <Text fontSize="sm" color="gray.500" fontWeight="medium">No hay cobros pendientes para hoy</Text>
              </VStack>
            </Center>
          )}
        </Box>

        <Button 
          variant="ghost" leftIcon={<SignOut size={20} />} colorScheme="red" size="sm" mt={10}
          onClick={() => { localStorage.clear(); navigate("/"); }}
        >
          Cerrar Sesión Segura
        </Button>

      </VStack>
    </MainLayout>
  );
};

export default Dashboard;