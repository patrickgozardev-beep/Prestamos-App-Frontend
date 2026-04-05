import {
    VStack, Box, Text, HStack, IconButton, Flex, Badge, 
    Progress, Divider, Button, Center, Icon,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    TabPanel,
    TabPanels,
    TabList,
    Tab,
    Tabs
  } from "@chakra-ui/react";
  import { CaretLeft, CheckCircle, Clock, House, Gear, ArrowsClockwise, Trash, WhatsappLogo } from "phosphor-react";
  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import MainLayout from "../../layouts/MainLayout";
  import prestamoService from "../../api/prestamoService"; // Asumiendo que existe
import type { PrestamoDetalleDTO } from "../../types/Prestamo";
import type { CronogramaDTO } from "../../types/CronogramaPago";
import cronogramaService from "../../api/cronogramaPagoService";
import LoadingScreen from "../../components/shared/LoadingScreenDetallePrestamo";
import { CuotaCard } from "../../components/CuotaCard";
  
  const DetallePrestamo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [loading, setLoading] = useState(true);
    const [prestamo, setPrestamo] = useState<PrestamoDetalleDTO | null>(null);
    const [cronogramas, setCronogramas] = useState<CronogramaDTO[]>([]);
    const saldoPendienteReal = cronogramas
    .filter(c => c.estado !== 'INACTIVO')
    .reduce((acc, curr) => acc + (curr.monto - (curr.montoPagado || 0)), 0);

    const fetchDatos = async () => {
      try {
        setLoading(true);
        const [dataPrestamo, dataCronograma] = await Promise.all([
          prestamoService.listarPorId(Number(id)),
          cronogramaService.listarPorPrestamo(Number(id))
        ]);
    
        const cronogramaOrdenado = [...dataCronograma].sort((a, b) => {

          const obtenerGrupo = (estado: string) => {
            if (['ATRASADO', 'PENDIENTE', 'PARCIAL'].includes(estado)) return 1;
            return 2; // PAGADO e INACTIVO van al fondo
          };
    
          const grupoA = obtenerGrupo(a.estado);
          const grupoB = obtenerGrupo(b.estado);
    
          // 1. Primero separamos por grupo (Por cobrar vs Finalizados)
          if (grupoA !== grupoB) {
            return grupoA - grupoB;
          }
    
          // 2. Dentro del mismo grupo, respetamos el orden natural de las cuotas
          return a.numeroCuota - b.numeroCuota;
        });
    
        setPrestamo(dataPrestamo);
        setCronogramas(cronogramaOrdenado);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // ... tu toast de error
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (id) fetchDatos();
    }, [id]);

    useEffect(() => {
      if (!loading && !prestamo) {
        navigate("/dashboard", { replace: true });
      }
    }, [loading, prestamo, navigate]);
  
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

    const cuotaProxima = cronogramas.find(c => ['PENDIENTE', 'ATRASADO', 'PARCIAL'].includes(c.estado));
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
                onClick={onOpen}
                aria-label="Ajustes del préstamo"
                mr={1}
              />
              <IconButton
                icon={<House size={24} weight="duotone" />}
                colorScheme="blue"
                variant="ghost"
                onClick={() => navigate("/dashboard",{replace:true})}
                aria-label="Ir al inicio"              />
            </Flex>
          </Flex>

          <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
            <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl" mx={4}>
              <ModalBody p={0}>
                <VStack align="stretch" spacing={0}>
                  <Box p={5} borderBottom="1px solid" borderColor="gray.100">
                    <Text fontWeight="900" color="#004481">Ajustes del Préstamo</Text>
                    <Text fontSize="xs" color="gray.500">¿Qué deseas realizar con este crédito?</Text>
                  </Box>
                  {/* Opción 1: Enviar mensaje */}
                  {prestamo.estado !== 'REPROGRAMADO' && (
                  <Button 
                    variant="ghost" justifyContent="start" h="65px" borderRadius="0"
                    borderBottomRadius="2xl"
                    color="#004481"
                    leftIcon={<Icon as={WhatsappLogo} size={24} weight="duotone" color="#004481" />}
                    onClick={() => {
                      onClose();
                      navigate(`/prestamos/notificar/${prestamo.id}`);                    }}
                  >
                    Enviar mensaje detallado
                  </Button>
                  )}

                  {/* Opción 2: Reprogramar */}
                  {prestamo.estado !== 'REPROGRAMADO' && (
                  <Button 
                    variant="ghost" 
                    justifyContent="start" 
                    h="65px" 
                    borderRadius="0"
                    leftIcon={<Icon as={ArrowsClockwise} size={24} weight="duotone"  />}
                    onClick={() => {
                      onClose();
                      navigate(`/prestamos/reprogramar/${prestamo.id}`, { 
                        state: { 
                          clienteNombre: prestamo.cliente?.nombres,
                          montoPendiente: saldoPendienteReal 
                        }
                      });
                    }}
                  >
                    Reprogramar préstamo
                  </Button>
                  )}
                  {/* Opción 3: Eliminar (Redirige a componente nuevo) */}
                  <Button 
                    variant="ghost" justifyContent="start" h="65px" borderRadius="0"
                    borderBottomRadius="2xl"
                    color="red.500"
                    _hover={{ bg: "red.50" }}
                    leftIcon={<Icon as={Trash} size={24} weight="duotone" color="red.500" />}
                    onClick={() => {
                      onClose();
                      navigate(`/prestamos/eliminar/${prestamo.id}`, { state: { prestamo } });
                    }}
                  >
                    Eliminar préstamo
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
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
          <Box px={4} py={2}> {/* El mt negativo es para "subir" un poco el tab sobre el fondo si quieres */}
          <Tabs isFitted variant="soft-rounded" colorScheme="blue">
            <TabList bg="white" p={1} borderRadius="xl" shadow="sm">
              <Tab 
                fontSize="sm" 
                fontWeight="bold" 
                _selected={{ color: "white", bg: "#004481" }}
              >
                PRÓXIMO COBRO
              </Tab>
              <Tab 
                fontSize="sm" 
                fontWeight="bold" 
                _selected={{ color: "white", bg: "#004481" }}
              >
                CUOTAS
              </Tab>
            </TabList>

            <TabPanels>
              {/* TAB 1: PRÓXIMO PAGO (ENFOQUE RÁPIDO) */}
              <TabPanel px={0} py={4}>
                {cuotaProxima ? (
                  <VStack align="stretch" spacing={3}>
                    <Text fontWeight="bold" fontSize="xs" color="gray.500" ml={1}>
                      CUOTA POR COBRAR AHORA
                    </Text>
                    {/* Renderizamos solo la card de la cuota próxima */}
                    <CuotaCard 
                      cuota={cuotaProxima} 
                      prestamo={prestamo} 
                      navigate={navigate} 
                      getBadgeProps={getBadgeProps} 
                    />
                    <Box p={4} bg="blue.50" borderRadius="xl" border="1px dashed" borderColor="blue.200">
                       <Text fontSize="xs" color="blue.700" textAlign="center">
                         Al finalizar este cobro, el sistema habilitará automáticamente la siguiente cuota.
                       </Text>
                    </Box>
                  </VStack>
                ) : (
                  <Center py={10} flexDirection="column">
                    <CheckCircle size={48} weight="fill" color="#38A169" />
                    <Text mt={2} fontWeight="bold" color="gray.600">¡Préstamo finalizado!</Text>
                    <Text fontSize="xs" color="gray.500">No hay cuotas pendientes por cobrar.</Text>
                  </Center>
                )}
              </TabPanel>

              {/* TAB 2: LISTADO DE TODAS LAS CUOTAS */}
              <TabPanel px={0} py={4}>
                <VStack align="stretch" spacing={3} pb={24}>
                  <Text fontWeight="bold" fontSize="xs" color="gray.500" ml={1}>
                    HISTORIAL COMPLETO ({cronogramas.length})
                  </Text>
                  {cronogramas.map((cuota) => (
                    <CuotaCard 
                      key={cuota.id}
                      cuota={cuota} 
                      prestamo={prestamo} 
                      navigate={navigate} 
                      getBadgeProps={getBadgeProps} 
                    />
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
          </VStack>
  
      </MainLayout>
    );
  };
  
  export default DetallePrestamo;