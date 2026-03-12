import { 
    VStack, Box, Text, IconButton, Flex, Image, 
    Stat, StatLabel, StatNumber, Badge, Divider, Center, Spinner,
    HStack, Icon, Button, useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure
  } from "@chakra-ui/react";
  import { CaretLeft, CalendarBlank, CreditCard, Hash, Receipt, ShareNetwork, Trash, CheckCircle } from "phosphor-react";
  import { useNavigate, useParams } from "react-router-dom";
  import React, { useEffect, useState, useRef } from "react";
  import MainLayout from "../../layouts/MainLayout";
  import pagoService from "../../api/pagosService";

  const DetallePago = () => {
    const { pagoId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [pago, setPago] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null); // Referencia para el botón de cancelar
  
    // Función para formatear la fecha fea de la DB a algo bonito
    const formatearFecha = (fechaRaw: string) => {
      if (!fechaRaw) return "";
      const fecha = new Date(fechaRaw);
      return fecha.toLocaleString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };
  
    const cargarDetalle = async () => {
      try {
        setLoading(true);
        const data = await pagoService.obtenerPorId(Number(pagoId));
        setPago(data);
      } catch (error) {
        console.error("Error al obtener el pago", error);
      } finally {
        setLoading(false);
      }
    };
  
    const manejarEliminar = async () => {
        try {
          await pagoService.eliminar(Number(pagoId));
          onClose(); // Cerramos el modal
          toast({ 
            title: "Operación anulada", 
            description: "El saldo del préstamo ha sido actualizado.",
            status: "info", 
            duration: 4000,
            isClosable: true 
          });
          navigate(-1);
        } catch (error) {
          toast({ title: "Error al anular", status: "error" });
        }
      };
  
    useEffect(() => {
      cargarDetalle();
    }, [pagoId]);
  
    if (loading) return <Center h="100vh"><Spinner color="#004481" size="xl" /></Center>;
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" bg="white" minH="100vh">
          
          {/* Header con bordes limpios */}
          <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
            <IconButton 
              icon={<CaretLeft size={26} weight="bold" />} 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              color="gray.700"
              aria-label="Volver"
            />
            <Text fontSize="xl" fontWeight="bold" color="gray.800" ml={2}>Detalle del Pago</Text>
          </Flex>
  
          <VStack p={6} spacing={8}>
            
            {/* Sección del Monto y Estado */}
            <VStack spacing={2} textAlign="center" pt={4}>
              <Icon as={CheckCircle} weight="fill" color="green.400" boxSize={12} />
              <Text fontSize="sm" color="gray.500" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
                Pago Recibido
              </Text>
              <Text fontSize="5xl" fontWeight="900" color="gray.800">
                S/ {pago.monto.toFixed(2)}
              </Text>
              <Badge colorScheme="green" variant="subtle" borderRadius="full" px={4} py={1} fontSize="xs">
                COMPLETADO
              </Badge>
            </VStack>
  
            {/* Detalles de la Transacción */}
            <Box w="full" bg="gray.50" p={5} borderRadius="2xl">
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">Fecha y hora</Text>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    {formatearFecha(pago.fechaPago)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">Método de pago</Text>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">{pago.metodo}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">ID de operación</Text>
                  <Text fontSize="sm" fontWeight="mono" color="gray.400">#{pago.id.toString().padStart(5, '0')}</Text>
                </HStack>
              </VStack>
            </Box>
  
            {/* Visualización de la Captura (foto_pago) */}
            <VStack align="stretch" w="full" spacing={3}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" ml={1}>Comprobante adjunto</Text>
            <Box borderRadius="2xl" overflow="hidden" border="2px solid" borderColor="gray.100" shadow="md">
                <Image 
                src='https://i.pinimg.com/236x/71/71/b9/7171b923637a47425975a3b42392bd17.jpg' 
                alt="Captura de pago" 
                w="full"
                maxH="450px"
                objectFit="contain"
                bg="gray.200"
                />
            </Box>
            </VStack>
            {pago.fotoPago && (
              <VStack align="stretch" w="full" spacing={3}>
                <Text fontSize="sm" fontWeight="bold" color="gray.600" ml={1}>Comprobante adjunto</Text>
                <Box 
                  borderRadius="2xl" 
                  overflow="hidden" 
                  border="2px solid" 
                  borderColor="gray.100"
                  shadow="md"
                >
                  <Image 
                    src={pago.fotoPago} 
                    alt="Captura de pago" 
                    w="full"
                    maxH="450px"
                    objectFit="contain"
                    bg="gray.200"
                    fallbackSrc="https://via.placeholder.com/400x600?text=Cargando+Imagen..."
                  />
                </Box>
              </VStack>
            )}
  
            {/* Botones de acción */}
            <VStack w="full" spacing={3} pt={4}>
              <Button 
                leftIcon={<ShareNetwork weight="bold" />} 
                w="full" 
                colorScheme="blue" 
                size="lg" 
                borderRadius="xl"
                bg="#004481"
              >
                Compartir Recibo
              </Button>
              <Button 
                leftIcon={<Trash weight="bold" />} 
                w="full" 
                variant="ghost" 
                colorScheme="red"
                onClick={onOpen}                
              >
                Anular Operación
              </Button>
            </VStack>
            <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
            >
            <AlertDialogOverlay>
                <AlertDialogContent borderRadius="2xl" mx={4}>
                <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.500">
                    ¿Anular esta operación?
                </AlertDialogHeader>

                <AlertDialogBody color="gray.600">
                    Esta acción eliminará el registro del pago y el monto de 
                    <Text as="span" fontWeight="bold"> S/ {pago?.monto.toFixed(2)} </Text> 
                    volverá a figurar como deuda pendiente. Esta acción no se puede deshacer.
                </AlertDialogBody>

                <AlertDialogFooter gap={3}>
                    <Button ref={cancelRef} onClick={onClose} variant="ghost" flex={1}>
                    Cancelar
                    </Button>
                    <Button colorScheme="red" onClick={manejarEliminar} flex={1} borderRadius="xl">
                    Sí, anular
                    </Button>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
            </AlertDialog>
          </VStack>
        </VStack>
      </MainLayout>
    );
  };
  
  export default DetallePago;