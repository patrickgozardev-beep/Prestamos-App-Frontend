import {
    VStack, Box, Text, HStack, IconButton, Flex, Badge, 
    Progress, Divider, Button, Center, Spinner, Stack, Icon,
    useToast
  } from "@chakra-ui/react";
  import { CaretLeft, CheckCircle, Clock, CurrencyDollar, CalendarBlank, MapPin, House, Gear } from "phosphor-react";
  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import MainLayout from "../../layouts/MainLayout";
  import prestamoService from "../../api/prestamoService"; // Asumiendo que existe
import type { PrestamoDetalleDTO } from "../../types/Prestamo";
import type { CronogramaDTO } from "../../types/CronogramaPago";
import cronogramaService from "../../api/cronogramaPagoService";
import LoadingScreen from "../../components/shared/LoadingScreenDetallePrestamo";
  
  const DetallePrestamo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [prestamo, setPrestamo] = useState<PrestamoDetalleDTO | null>(null);
    const [cronogramas, setCronogramas] = useState<CronogramaDTO[]>([]);
    const saldoPendienteReal = cronogramas
    .filter(c => c.estado !== 'INACTIVO')
    .reduce((acc, curr) => acc + (curr.monto - (curr.montoPagado || 0)), 0);


    const fetchDatos = async () => {
      try {
        setLoading(true);
        // Peticiones en paralelo para mayor velocidad
        const [dataPrestamo, dataCronograma] = await Promise.all([
          prestamoService.listarPorId(Number(id)),
          cronogramaService.listarPorPrestamo(Number(id))
        ]);
  
        setPrestamo(dataPrestamo);
        setCronogramas(dataCronograma);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del préstamo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (id) fetchDatos();
    }, [id]);
  
    if (loading) return <LoadingScreen type="detalle" />;

    if (!prestamo) {
      return (
        <Center h="100vh" flexDirection="column">
          <Text fontSize="lg" color="gray.500">Préstamo no encontrado</Text>
          <Button mt={4} onClick={() => navigate("/dashboard")}>Volver al inicio</Button>
        </Center>
      );
    }
    // Cálculos basados en los datos reales del cronograma
    const cuotasPagadas = cronogramas.filter((c) => c.estado === "PAGADO").length;
    const totalCuotas = cronogramas.length || 1;
    const porcentajeProgreso = (cuotasPagadas / totalCuotas) * 100;
  
    // Helper para los colores de estado (ahora incluyendo atrasados y parciales)
    const getBadgeProps = (estado: string) => {
      switch (estado) {
        case 'PAGADO': return { color: "green", bg: "green.50", iconColor: "#38A169" };
        case 'PARCIAL': return { color: "blue", bg: "blue.50", iconColor: "#3182ce" };
        case 'ATRASADO': return { color: "red", bg: "red.50", iconColor: "#E53E3E" };
        case 'INACTIVO': return { color: "gray", bg: "gray.100", iconColor: "#A0AEC0" }; // <-- Nuevo
        default: return { color: "orange", bg: "orange.50", iconColor: "#DD6B20" };
      }
    };

    
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" bg="gray.50" minH="100vh" w="full">
          
          {/* Header Navegación */}
          <Flex align="center" py={4} px={2} bg="white">
            <IconButton
              icon={<CaretLeft size={24} weight="bold" />}
              variant="ghost"
              onClick={() => navigate(-1)}
              aria-label="Volver"
              color="#004481"
            />
            <VStack align="start" spacing={0} ml={2}>
              <Text fontSize="lg" fontWeight="bold" color="#004481">Detalle del Préstamo</Text>
              <Text fontSize="xs" color="gray.500">ID: #{prestamo.id} - {prestamo.cliente?.nombres}</Text>
            </VStack>
            <Flex flex={1} justify="flex-end">
            <IconButton
                icon={<Gear size={24} weight="duotone" />}
                variant="ghost"
                color="#004481"
                onClick={() => navigate(`/prestamos/reprogramar/${prestamo.id}`, { 
                  state: { 
                    clienteNombre: prestamo.cliente?.nombres,
                    montoPendiente: prestamo.montoTotal - (cuotasPagadas * (prestamo.montoTotal/totalCuotas)) // O el cálculo que use tu back
                  } 
                })}
                aria-label="Ajustes del préstamo"
                mr={1}
              />
              <IconButton
                icon={<House size={24} weight="duotone" />}
                colorScheme="blue"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                aria-label="Ir al inicio"              />
            </Flex>
          </Flex>
  
          {/* Card de Resumen Financiero */}
          <Box px={4} py={6} bg="white" borderBottomRadius="3xl" shadow="sm">
            <VStack align="stretch" spacing={4}>
              <Box bg="#004481" p={5} borderRadius="2xl" color="white" shadow="md">
  <Flex 
    overflowX="auto" 
    css={{
      '&::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
      scrollSnapType: 'x mandatory'
    }}
  >
    {/* Slide 1: Total a Pagar */}
    <VStack align="start" minW="full" spacing={0} scrollSnapAlign="start">
      <HStack justifyContent="space-between" w="full">
        <Text fontSize="sm" opacity={0.8}>Total a Pagar</Text>
        <Badge colorScheme="whiteAlpha" variant="subtle" borderRadius="full">
          {prestamo.estado}
        </Badge>
      </HStack>
      <Text fontSize="3xl" fontWeight="bold" mt={1}>
        S/ {prestamo.montoTotal.toFixed(2)}
      </Text>
    </VStack>

    {/* Slide 2: Lo que falta pagar */}
    <VStack align="start" minW="full" spacing={0} scrollSnapAlign="start">
      <HStack justifyContent="space-between" w="full">
        <Text fontSize="sm" opacity={0.8} color="orange.200">Saldo Pendiente</Text>
        <Icon as={Clock} weight="fill" color="orange.200" />
      </HStack>
      <Text fontSize="3xl" fontWeight="bold" mt={1} color="orange.50">
        S/ {saldoPendienteReal.toFixed(2)}
      </Text>
    </VStack>
  </Flex>

  {/* Indicador de que es deslizable (opcional) */}
  <HStack justify="center" mt={2} spacing={1}>
    <Box w="4px" h="4px" borderRadius="full" bg="white" />
    <Box w="4px" h="4px" borderRadius="full" bg="whiteAlpha.400" />
  </HStack>

  {/* Barra de Progreso */}
  <Box mt={4}>
    <Flex justifyContent="space-between" mb={1}>
      <Text fontSize="xs">Progreso de pago</Text>
      <Text fontSize="xs" fontWeight="bold">{Math.round(porcentajeProgreso)}%</Text>
    </Flex>
    <Progress 
      value={porcentajeProgreso} 
      size="xs" 
      colorScheme="green" 
      borderRadius="full" 
      bg="whiteAlpha.300" 
    />
  </Box>
</Box>
  
              {/* Mini Info */}
              <HStack spacing={4} px={2}>
                <VStack align="start" flex={1}>
                  <Text fontSize="xs" color="gray.500">Monto Prestado</Text>
                  <Text fontWeight="bold" color="gray.700">S/ {prestamo.monto}</Text>
                </VStack>
                <Divider orientation="vertical" h="30px" />
                <VStack align="start" flex={1}>
                  <Text fontSize="xs" color="gray.500">Interés</Text>
                  <Text fontWeight="bold" color="gray.700">{prestamo.interesPorcentaje}%</Text>
                </VStack>
                <Divider orientation="vertical" h="30px" />
                <VStack align="start" flex={1}>
                  <Text fontSize="xs" color="gray.500">Cuotas</Text>
                  <Text fontWeight="bold" color="gray.700">{totalCuotas}</Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
  
          {/* Cronograma de Pagos */}
          <VStack align="stretch" p={4} spacing={3} pb={24}>
            <Text fontWeight="bold" fontSize="md" color="gray.700" mb={1}>Cronograma de Pagos</Text>
            
          {cronogramas.map((cuota) => {
            const props = getBadgeProps(cuota.estado);
            return (
              <Box 
                key={cuota.id} 
                bg="white" 
                p={4} 
                borderRadius="xl" 
                shadow="sm"
                onClick={() => {
                  if (cuota.estado === 'PAGADO' || cuota.estado === 'PARCIAL') {
                    navigate(`/pago/cronograma/${cuota.id}`, { 
                      state: { numeroCuota: cuota.numeroCuota } 
                    });
                  }
                }}
                cursor={(cuota.estado === 'PAGADO' || cuota.estado === 'PARCIAL') ? "pointer" : "default"}
                _hover={(cuota.estado === 'PAGADO' || cuota.estado === 'PARCIAL') ? { bg: "gray.50" } : {}}
              >
                <HStack justifyContent="space-between">
                  <HStack spacing={3}>
                    <Center bg={props.bg} p={2} borderRadius="lg">
                      {cuota.estado === 'PAGADO' ? (
                        <CheckCircle size={24} color={props.iconColor} weight="fill" />
                      ) : (
                        <Clock size={24} color={props.iconColor} weight="fill" />
                      )}
                    </Center>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" fontSize="sm">Cuota {cuota.numeroCuota}</Text>
                      <Text fontSize="xs" color="gray.500">Vence: {cuota.fechaVencimiento}</Text>
                    </VStack>
                  </HStack>

                  <VStack align="end" spacing={0}>
                    <Text fontWeight="900" fontSize="md" color="#004481">
                      S/ {cuota.monto.toFixed(2)}
                    </Text>
                    <Badge fontSize="9px" colorScheme={props.color} variant="subtle">
                      {cuota.estado}
                    </Badge>
                  </VStack>
                </HStack>

                {/* Botón de Pago: Solo si tiene saldo pendiente */}
                {cuota.estado !== 'PAGADO' && cuota.estado!=='INACTIVO' && (
                  <Button 
                    mt={3} 
                    size="sm" 
                    w="full" 
                    colorScheme="blue" 
                    variant="outline"
                    leftIcon={<CurrencyDollar weight="bold" />}
                    borderRadius="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pago/nuevo/${cuota.id}`, { 
                        state: { 
                          montoSugerido: cuota.monto - cuota.montoPagado, 
                          numeroCuota: cuota.numeroCuota,
                          clienteNombre: prestamo.cliente?.nombres,
                          prestamoId: prestamo.id 
                        }
                      });
                    }}
                  >
                    Registrar Cobro
                  </Button>
                )}
              </Box>
            );
          })}
          </VStack>
  
        </VStack>
      </MainLayout>
    );
  };
  
  export default DetallePrestamo;